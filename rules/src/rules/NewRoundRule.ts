import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerColor } from '../PlayerColor'
import { RuleId } from './RuleId'

export class NewRoundRule extends PlayerTurnRule {
  onRuleStart() {
    const moves: MaterialMove[] = []

    // Move all wolf cards from PlayArea, WonCards and Hand back to their owner's WolfDeck
    for (const player of [PlayerColor.Light, PlayerColor.Dark]) {
      const playAreaCards = this.material(MaterialType.WolfCard)
        .location(LocationType.PlayArea)
        .filter(item => {
          const id = item.id as { back: PlayerColor }
          return id.back === player
        })
      if (playAreaCards.length > 0) {
        moves.push(playAreaCards.moveItemsAtOnce({ type: LocationType.WolfDeck, player }))
      }

      const wonCards = this.material(MaterialType.WolfCard)
        .location(LocationType.WonCards)
        .player(player)
      if (wonCards.length > 0) {
        moves.push(wonCards.moveItemsAtOnce({ type: LocationType.WolfDeck, player }))
      }

      const handCards = this.material(MaterialType.WolfCard)
        .location(LocationType.PlayerHand)
        .player(player)
      if (handCards.length > 0) {
        moves.push(handCards.moveItemsAtOnce({ type: LocationType.WolfDeck, player }))
      }
    }

    // Replenish alpha powers to 4 visible
    const visibleAlphaPowers = this.material(MaterialType.AlphaPowerCard)
      .location(LocationType.AlphaPowerArea)
    const alphaDeck = this.material(MaterialType.AlphaPowerCard)
      .location(LocationType.AlphaPowerDeck)
    const needed = 4 - visibleAlphaPowers.length
    if (needed > 0 && alphaDeck.length > 0) {
      const toDeal = Math.min(needed, alphaDeck.length)
      moves.push(alphaDeck.deck().dealAtOnce({ type: LocationType.AlphaPowerArea }, toDeal))
    }

    moves.push(this.startRule(RuleId.PrepareRound))
    return moves
  }
}
