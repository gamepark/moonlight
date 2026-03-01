import { Location, Material, MaterialItem, MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { uniqBy } from 'es-toolkit'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { WolfCard, wolfValue } from '../../material/WolfCard'
import { PlayerColor } from '../../PlayerColor'
import { AlphaPowerHelper } from './AlphaPowerHelper'

export interface TopCardInfo {
  z: number
  front: WolfCard
  owner: PlayerColor
}

export class PlayAreaHelper extends MaterialRulesPart {
  getTopCards(): Map<string, TopCardInfo> {
    const playedCards = this.playArea.getItems()
    const topCards = new Map<string, TopCardInfo>()

    for (const card of playedCards) {
      const x = card.location.x!
      const y = card.location.y!
      const z = card.location.z ?? 0
      const key = `${x},${y}`
      const current = topCards.get(key)

      if (!current || z > current.z) {
        topCards.set(key, {
          z,
          front: card.id.front,
          owner: card.id.back
        })
      }
    }

    return topCards
  }

  static readonly MAX_SIZE = 4
  static readonly MAX_AREA = 12

  availableSpaces() {
    const availableSpaces: Location[] = []
    const boundaries = this.outerSquareBoundaries
    const playedCards = this.playArea.getItems()
    const { MAX_SIZE, MAX_AREA } = PlayAreaHelper

    if (playedCards.length === 0) {
      availableSpaces.push({ type: LocationType.PlayArea, x: 0, y: 0, z: 0 })
      return availableSpaces
    }

    const currentWidth = boundaries.xMax - boundaries.xMin + 1
    const currentHeight = boundaries.yMax - boundaries.yMin + 1

    playedCards.forEach((playedCard) => {
      const coordinates = { x: playedCard.location.x, y: playedCard.location.y, z: playedCard.location.z }

      // Right
      const right = { x: playedCard.location.x! + 1, y: playedCard.location.y! }
      if (!playedCards.find((item) => isAnyCardToTheRight(item, coordinates))) {
        const newWidth = Math.max(boundaries.xMax, right.x) - boundaries.xMin + 1
        if (newWidth <= MAX_SIZE && newWidth * currentHeight <= MAX_AREA) {
          availableSpaces.push({ type: LocationType.PlayArea, x: right.x, y: right.y, z: 0 })
        }
      }

      // Left
      const left = { x: playedCard.location.x! - 1, y: playedCard.location.y! }
      if (!playedCards.find((item) => isAnyCardToTheLeft(item, coordinates))) {
        const newWidth = boundaries.xMax - Math.min(boundaries.xMin, left.x) + 1
        if (newWidth <= MAX_SIZE && newWidth * currentHeight <= MAX_AREA) {
          availableSpaces.push({ type: LocationType.PlayArea, x: left.x, y: left.y, z: 0 })
        }
      }

      // Below
      const below = { x: playedCard.location.x!, y: playedCard.location.y! + 1 }
      if (!playedCards.find((item) => isAnyCardBelow(item, coordinates))) {
        const newHeight = Math.max(boundaries.yMax, below.y) - boundaries.yMin + 1
        if (newHeight <= MAX_SIZE && currentWidth * newHeight <= MAX_AREA) {
          availableSpaces.push({ type: LocationType.PlayArea, x: below.x, y: below.y, z: 0 })
        }
      }

      // Above
      const above = { x: playedCard.location.x!, y: playedCard.location.y! - 1 }
      if (!playedCards.find((item) => isAnyCardAbove(item, coordinates))) {
        const newHeight = boundaries.yMax - Math.min(boundaries.yMin, above.y) + 1
        if (newHeight <= MAX_SIZE && currentWidth * newHeight <= MAX_AREA) {
          availableSpaces.push({ type: LocationType.PlayArea, x: above.x, y: above.y, z: 0 })
        }
      }
    })

    // Stacking spaces: on opponent's top cards, with last-wolf protection and power effects
    const topCards = this.getTopCards()
    const activePlayer = this.game.rule?.player as PlayerColor
    const opponent = activePlayer === PlayerColor.Light ? PlayerColor.Dark : PlayerColor.Light
    const opponentTopCards = [...topCards.entries()].filter(([, info]) => info.owner !== activePlayer)
    const opponentPowers = new AlphaPowerHelper(this.game, opponent)

    if (opponentTopCards.length > 1) {
      for (const [key, info] of opponentTopCards) {
        // Protected value 1 wolves (stamina power)
        if (opponentPowers.protectsValue1 && wolfValue(info.front) === 1) continue
        const [x, y] = key.split(',').map(Number)
        availableSpaces.push({ type: LocationType.PlayArea, x, y, z: info.z + 1 })
      }
    }

    return uniqBy(availableSpaces, (location) => JSON.stringify(location))
  }

  /**
   * Returns placement moves for a set of hand cards on available spaces.
   * Handles ground placement and stacking (value +1, with power effects).
   * @param hand - the cards to place (already filtered by caller if needed)
   * @param player - the active player
   * @param spaces - available spaces (from availableSpaces())
   */
  getPlacementMoves(hand: Material, player: PlayerColor, spaces: Location[]): MaterialMove[] {
    const moves: MaterialMove[] = []
    const topCards = this.getTopCards()
    const powers = new AlphaPowerHelper(this.game, player)

    const handCardsWithValue = (value: number) =>
      hand.filter(item => {
        const id = item.id as { front: number }
        return id && wolfValue(id.front) === value
      })

    for (const space of spaces) {
      if ((space.z ?? 0) > 0) {
        const key = `${space.x},${space.y}`
        const topCard = topCards.get(key)
        if (!topCard) continue
        const topValue = wolfValue(topCard.front)

        // Normal: value + 1
        moves.push(...handCardsWithValue(topValue + 1).moveItems(space))

        // Ambush: skip a value (value + 2)
        if (powers.canUseAmbush('stackingSkip')) {
          moves.push(...handCardsWithValue(topValue + 2).moveItems(space))
        }

        // Ambush: cover same value
        if (powers.canUseAmbush('coverSameValue')) {
          moves.push(...handCardsWithValue(topValue).moveItems(space))
        }
      } else {
        // Ground: any card from hand
        moves.push(...hand.moveItems(space))
      }
    }

    return moves
  }

  getBoundaries(panorama: Material) {
    const xMin = panorama.minBy((item) => item.location.x!).getItem()?.location.x ?? 0
    const xMax = panorama.maxBy((item) => item.location.x!).getItem()?.location.x ?? 0
    const yMin = panorama.minBy((item) => item.location.y!).getItem()?.location.y ?? 0
    const yMax = panorama.maxBy((item) => item.location.y!).getItem()?.location.y ?? 0
    return { xMin, xMax, yMin, yMax }
  }

  get outerSquareBoundaries() {
    return this.getBoundaries(this.playArea)
  }

  get visualBoundaries() {
    const cards = this.playArea.getItems()
    if (cards.length === 0) return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 }

    const cb = this.outerSquareBoundaries
    const { MAX_SIZE, MAX_AREA } = PlayAreaHelper
    const w = cb.xMax - cb.xMin + 1
    const h = cb.yMax - cb.yMin + 1

    const canExpandVertically = h + 1 <= MAX_SIZE && w * (h + 1) <= MAX_AREA
    const canExpandHorizontally = w + 1 <= MAX_SIZE && (w + 1) * h <= MAX_AREA

    return {
      xMin: canExpandHorizontally ? cb.xMin - 1 : cb.xMin,
      xMax: canExpandHorizontally ? cb.xMax + 1 : cb.xMax,
      yMin: canExpandVertically ? cb.yMin - 1 : cb.yMin,
      yMax: canExpandVertically ? cb.yMax + 1 : cb.yMax
    }
  }

  get playArea() {
    return this.material(MaterialType.WolfCard).location(LocationType.PlayArea)
  }
}

export const isAnyCardToTheLeft = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! - 1 && slotToCheck.location.y === reference.y
}
export const isAnyCardToTheRight = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! + 1 && slotToCheck.location.y === reference.y
}
export const isAnyCardAbove = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! && slotToCheck.location.y === reference.y! - 1
}
export const isAnyCardBelow = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! && slotToCheck.location.y === reference.y! + 1
}
