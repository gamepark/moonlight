import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import isEqual from 'lodash/isEqual'
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
      const countOnLine = playArea.filter((item) => item.location.y === space.y).length
      const countOnColumn = playArea.filter((item) => item.location.x === space.x).length
      if (countOnLine === 4 || countOnColumn === 4) return true
      return spaces.some((s2) => isEqual(s2, space))
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
