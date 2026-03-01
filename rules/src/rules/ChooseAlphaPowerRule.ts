import { isMoveItemType, ItemMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class ChooseAlphaPowerRule extends PlayerTurnRule {
  onRuleStart() {
    const alphaPowers = this.material(MaterialType.AlphaPowerCard)
      .location(LocationType.AlphaPowerArea)

    if (alphaPowers.length === 0) {
      return [this.startRule(RuleId.NewRound)]
    }
    return []
  }

  getPlayerMoves() {
    return this.material(MaterialType.AlphaPowerCard)
      .location(LocationType.AlphaPowerArea)
      .moveItems({
        type: LocationType.PlayerAlphaPower,
        player: this.player
      })
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.AlphaPowerCard)(move)) return []
    return [this.startRule(RuleId.NewRound)]
  }
}
