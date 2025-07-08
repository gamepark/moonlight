import { PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { RuleId } from './RuleId'

export class DrawCardRule extends PlayerTurnRule {
  onRuleStart() {
    const currentHandSize = this.material(MaterialType.WolfCard).location(LocationType.PlayerHand).player(this.player).deck().length
    if (currentHandSize == 0) {
      return [
        this.material(MaterialType.WolfCard).location(LocationType.WolfDeck).player(this.player).deck().dealAtOnce(
          {
            type: LocationType.PlayerHand,
            player: this.player
          },
          3
        ),
        this.startRule(RuleId.PlaceCard)
      ]
    } else {
      return [
        this.material(MaterialType.WolfCard).location(LocationType.WolfDeck).player(this.player).deck().dealOne({
          type: LocationType.PlayerHand,
          player: this.player
        }),
        this.startRule(RuleId.PlaceCard)
      ]
    }
  }
}
