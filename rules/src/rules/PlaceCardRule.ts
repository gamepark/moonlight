import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove, MoveItem, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { wolfValue } from '../material/WolfCard'
import { CustomMoveType } from './CustomMoveType'
import { AlphaPowerHelper } from './helper/AlphaPowerHelper'
import { PlayAreaHelper } from './helper/PlayAreaHelper'
import { RuleId } from './RuleId'

export class PlaceCardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const helper = new PlayAreaHelper(this.game)
    const moves = helper.getPlacementMoves(this.hand, this.player, this.availableSpaces)

    // Ambush: activate move pile power (requires a value 2 wolf in hand)
    const powers = new AlphaPowerHelper(this.game, this.player)
    if (powers.canUseAmbush('movePile') && this.handCardsWithValue(2).length > 0) {
      moves.push(this.customMove(CustomMoveType.ActivateMovePile))
    }

    return moves
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.WolfCard)(move)) return []
    if (move.location.type !== LocationType.PlayArea) return []

    const powers = new AlphaPowerHelper(this.game, this.player)
    const moves: MaterialMove[] = []

    // Detect ambush power usage on stacking
    if ((move.location.z ?? 0) > 0) {
      moves.push(...this.detectStackingPowerUsage(move, powers))
    }

    // Ambush: double placement available → offer second card
    if (powers.canUseAmbush('doublePlace')) {
      moves.push(this.startPlayerTurn(RuleId.PlaceSecondCard, this.player))
      return moves
    }

    moves.push(this.startRule(RuleId.DrawCard))
    return moves
  }

  onCustomMove(move: CustomMove) {
    if (isCustomMoveType(CustomMoveType.ActivateMovePile)(move)) {
      const powers = new AlphaPowerHelper(this.game, this.player)
      return [
        ...powers.markAmbushUsed('movePile'),
        this.startPlayerTurn(RuleId.MovePile, this.player)
      ]
    }
    return []
  }

  private detectStackingPowerUsage(move: MoveItem, powers: AlphaPowerHelper): MaterialMove[] {
    const placedCard = this.material(MaterialType.WolfCard).getItem(move.itemIndex)
    const placedValue = wolfValue((placedCard.id as { front: number }).front)

    const belowCard = this.material(MaterialType.WolfCard)
      .location(LocationType.PlayArea)
      .filter(item =>
        item.location.x === move.location.x &&
        item.location.y === move.location.y &&
        (item.location.z ?? 0) === (move.location.z ?? 0) - 1
      )

    if (belowCard.length > 0) {
      const belowValue = wolfValue((belowCard.getItem()!.id as { front: number }).front)
      if (placedValue === belowValue + 2) {
        return powers.markAmbushUsed('stackingSkip')
      } else if (placedValue === belowValue) {
        return powers.markAmbushUsed('coverSameValue')
      }
    }
    return []
  }

  private handCardsWithValue(value: number) {
    return this.hand.filter(item => {
      const id = item.id as { front: number }
      return id && wolfValue(id.front) === value
    })
  }

  get availableSpaces() {
    const spaces = new PlayAreaHelper(this.game).availableSpaces()

    // Count unique (x,y) ground positions — stacked cards share the same position
    const occupiedPositions = new Set<string>()
    for (const item of this.playArea) {
      const { x, y } = item.location
      if (x !== undefined && y !== undefined) {
        occupiedPositions.add(`${x},${y}`)
      }
    }

    const rowsMap = new Map<number, number>()
    const colsMap = new Map<number, number>()
    for (const pos of occupiedPositions) {
      const [x, y] = pos.split(',').map(Number)
      colsMap.set(x, (colsMap.get(x) ?? 0) + 1)
      rowsMap.set(y, (rowsMap.get(y) ?? 0) + 1)
    }

    const fullRowExists = [...rowsMap.values()].some((count) => count === 4)
    const fullColExists = [...colsMap.values()].some((count) => count === 4)

    const rowCount = rowsMap.size
    const colCount = colsMap.size

    const tooManyCols = fullRowExists || rowCount >= 4
    const tooManyRows = fullColExists || colCount >= 4

    return spaces.filter((space) => {
      const { x: sx, y: sy } = space

      if (tooManyCols && sx !== undefined && !colsMap.has(sx) && colCount >= 3) {
        return false
      }

      if (tooManyRows && sy !== undefined && !rowsMap.has(sy) && rowCount >= 3) {
        return false
      }

      return true
    })
  }

  get playArea() {
    return this.material(MaterialType.WolfCard).location(LocationType.PlayArea).getItems()
  }

  get hand() {
    return this.material(MaterialType.WolfCard).location(LocationType.PlayerHand).player(this.player)
  }
}
