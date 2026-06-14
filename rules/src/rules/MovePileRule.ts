import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { wolfValue } from '../material/WolfCard'
import { PlayAreaHelper } from './helper/PlayAreaHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class MovePileRule extends PlayerTurnRule {
  getPlayerMoves() {
    const phase = this.remind<string>(Memory.MovePilePhase)

    if (phase === 'place') {
      return this.getPlaceValue2Moves()
    }

    return this.getPileMoveMoves()
  }

  /** Phase 1: Move a pile to any empty position within grid size limits */
  private getPileMoveMoves(): MaterialMove[] {
    const moves: MaterialMove[] = []
    const helper = new PlayAreaHelper(this.game)
    const topCards = helper.getTopCards()
    const allCards = helper.playArea.getItems()

    // Occupied positions
    const occupied = new Set<string>()
    for (const [key] of topCards) occupied.add(key)

    // All positions adjacent to any card (candidate destinations)
    const candidates = new Set<string>()
    for (const card of allCards) {
      const cx = card.location.x!
      const cy = card.location.y!
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const nk = `${cx + dx},${cy + dy}`
        if (!occupied.has(nk)) candidates.add(nk)
      }
    }

    for (const [key, info] of topCards) {
      const [sx, sy] = key.split(',').map(Number)

      // Compute boundaries WITHOUT the source pile
      const otherCards = allCards.filter(c => c.location.x !== sx || c.location.y !== sy)
      if (otherCards.length === 0) continue // Can't move the only pile

      let oxMin = Infinity, oxMax = -Infinity, oyMin = Infinity, oyMax = -Infinity
      for (const c of otherCards) {
        const cx = c.location.x!
        const cy = c.location.y!
        if (cx < oxMin) oxMin = cx
        if (cx > oxMax) oxMax = cx
        if (cy < oyMin) oyMin = cy
        if (cy > oyMax) oyMax = cy
      }

      // Also include candidates adjacent to remaining cards (not the source)
      const destCandidates = new Set<string>()
      for (const c of otherCards) {
        const cx = c.location.x!
        const cy = c.location.y!
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const nk = `${cx + dx},${cy + dy}`
          if (!occupied.has(nk) || nk === key) destCandidates.add(nk)
        }
      }

      for (const destKey of destCandidates) {
        if (destKey === key) continue // Can't move to same position
        // Must be empty (or the source itself which will be vacated)
        if (occupied.has(destKey)) continue

        const [dx, dy] = destKey.split(',').map(Number)

        // Same size rule as card placement: grow one dimension at a time within limits.
        const currentWidth = oxMax - oxMin + 1
        const currentHeight = oyMax - oyMin + 1
        const newWidth = Math.max(oxMax, dx) - Math.min(oxMin, dx) + 1
        const newHeight = Math.max(oyMax, dy) - Math.min(oyMin, dy) + 1
        if (!PlayAreaHelper.fitsGrid(currentWidth, currentHeight, newWidth, newHeight)) continue

        // Check destination is adjacent to at least one OTHER card
        const hasOtherNeighbor = otherCards.some(card =>
          (Math.abs(card.location.x! - dx) === 1 && card.location.y === dy) ||
          (card.location.x === dx && Math.abs(card.location.y! - dy) === 1)
        )
        if (!hasOtherNeighbor) continue

        const topItem = this.material(MaterialType.WolfCard)
          .location(LocationType.PlayArea)
          .filter(item =>
            item.location.x === sx &&
            item.location.y === sy &&
            (item.location.z ?? 0) === info.z
          )

        moves.push(...topItem.moveItems({
          type: LocationType.PlayArea,
          x: dx,
          y: dy,
          z: info.z
        }))
      }
    }

    return moves
  }

  /** Phase 2: Place a value 2 card from hand (same rules as normal placement) */
  private getPlaceValue2Moves(): MaterialMove[] {
    const helper = new PlayAreaHelper(this.game)
    const value2Cards = this.hand.filter(item => {
      const id = item.id as { front: number }
      return id && wolfValue(id.front) === 2
    })
    return helper.getPlacementMoves(value2Cards, this.player, helper.availableSpaces())
  }

  beforeItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.WolfCard)(move)) return []
    const phase = this.remind<string>(Memory.MovePilePhase)

    if (phase !== 'place') {
      // Store the source position before moving the top card
      const item = this.material(MaterialType.WolfCard).getItem(move.itemIndex)
      this.memorize(Memory.MovePilePhase, `moving:${item.location.x},${item.location.y}`)
    }

    return []
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.WolfCard)(move)) return []
    if (move.location.type !== LocationType.PlayArea) return []

    const phase = this.remind<string>(Memory.MovePilePhase)

    if (phase?.startsWith('moving:')) {
      // Phase 1 complete: move remaining cards from the old position
      const [sx, sy] = phase.replace('moving:', '').split(',').map(Number)
      const moves: MaterialMove[] = []

      const remainingCards = this.material(MaterialType.WolfCard)
        .location(LocationType.PlayArea)
        .filter(item => item.location.x === sx && item.location.y === sy)

      // Move each remaining card to the new position, preserving z
      for (const card of remainingCards.getItems()) {
        moves.push(
          this.material(MaterialType.WolfCard)
            .location(LocationType.PlayArea)
            .filter(item =>
              item.location.x === sx &&
              item.location.y === sy &&
              (item.location.z ?? 0) === (card.location.z ?? 0)
            )
            .moveItem({
              type: LocationType.PlayArea,
              x: move.location.x,
              y: move.location.y,
              z: card.location.z ?? 0
            })
        )
      }

      // Transition to phase 2
      this.memorize(Memory.MovePilePhase, 'place')
      return moves
    }

    // Phase 2 complete: value 2 card placed
    this.forget(Memory.MovePilePhase)

    return [this.startRule(RuleId.DrawCard)]
  }

  get hand() {
    return this.material(MaterialType.WolfCard).location(LocationType.PlayerHand).player(this.player)
  }
}
