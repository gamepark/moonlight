import { PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { Memory } from './Memory'
import { RuleId } from './RuleId'
import { PlayAreaHelper } from './helper/PlayAreaHelper'

export class EndOfTurnRule extends PlayerTurnRule {
  onRuleStart() {
    // 1. Rectangle complete → end round immediately
    if (this.isRectangleComplete) {
      return [this.startRule(RuleId.EndOfRound)]
    }

    // 2. Previous player triggered end → opponent just finished extra turn
    if (this.remind(Memory.EndTriggered)) {
      return [this.startRule(RuleId.EndOfRound)]
    }

    // 3. Current player has no more cards → trigger end, opponent gets one more turn
    const hand = this.material(MaterialType.WolfCard).location(LocationType.PlayerHand).player(this.player)
    const deck = this.material(MaterialType.WolfCard).location(LocationType.WolfDeck).player(this.player)
    if (hand.length === 0 && deck.length === 0) {
      this.memorize(Memory.EndTriggered, true)
      return [this.startPlayerTurn(RuleId.PlaceCard, this.nextPlayer)]
    }

    // 4. Normal → next player's turn
    return [this.startPlayerTurn(RuleId.PlaceCard, this.nextPlayer)]
  }

  get isRectangleComplete() {
    const helper = new PlayAreaHelper(this.game)
    const bounds = helper.outerSquareBoundaries
    const width = bounds.xMax - bounds.xMin + 1
    const height = bounds.yMax - bounds.yMin + 1
    if (width * height !== 12) return false
    return helper.getTopCards().size === 12
  }
}
