import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'
import { PlayAreaHelper } from './helper/PlayAreaHelper'

export class PlaceCardRule extends PlayerTurnRule {
  getPlayerMoves() {
    const moves: MaterialMove[] = []
    const hand = this.hand

    for (const space of this.availableSpaces) {
      moves.push(...hand.moveItems(space))
    }
    return moves
  }

  get availableSpaces() {
    const spaces = new PlayAreaHelper(this.game).availableSpaces()

    const playArea = this.playArea
    return spaces.filter((space) => {
      const rowsMap = new Map<number, number>()
      const colsMap = new Map<number, number>()

      for (const item of playArea) {
        const { x, y } = item.location

        if (x !== undefined) {
          colsMap.set(x, (colsMap.get(x) ?? 0) + 1)
        }

        if (y !== undefined) {
          rowsMap.set(y, (rowsMap.get(y) ?? 0) + 1)
        }
      }

      const fullRowExists = [...rowsMap.values()].some((count) => count === 4)
      const fullColExists = [...colsMap.values()].some((count) => count === 4)

      const rowCount = rowsMap.size
      const colCount = colsMap.size

      const tooManyCols = fullRowExists || rowCount >= 4
      const tooManyRows = fullColExists || colCount >= 4

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

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.WolfCard)(move)) return []

    if (move.location.type === LocationType.PlayArea) {
      return [this.startRule(RuleId.EndOfTurn)]
    }
    return []
  }

  get hand() {
    return this.material(MaterialType.WolfCard).location(LocationType.PlayerHand).player(this.player)
  }
}
