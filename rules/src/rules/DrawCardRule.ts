import { PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class DrawCardRule extends PlayerTurnRule {
  onRuleStart() {
    const deck = this.material(MaterialType.WolfCard).location(LocationType.WolfDeck).player(this.player).deck()
    if (deck.length > 0) {
      return [
        deck.dealOne({
          type: LocationType.PlayerHand,
          player: this.player
        }),
        this.startRule(RuleId.EndOfTurn)
      ]
    }
    return [this.startRule(RuleId.EndOfTurn)]
  }
}
