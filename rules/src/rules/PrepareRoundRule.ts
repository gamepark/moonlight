import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerColor } from '../PlayerColor'
import { AlphaPowerHelper } from './helper/AlphaPowerHelper'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class PrepareRoundRule extends PlayerTurnRule {
  onRuleStart() {
    const moves: MaterialMove[] = []

    // Shuffle each player's WolfDeck and deal cards
    for (const player of [PlayerColor.Light, PlayerColor.Dark]) {
      const deck = this.material(MaterialType.WolfCard)
        .location(LocationType.WolfDeck)
        .player(player)

      const handSize = new AlphaPowerHelper(this.game, player).handSize

      moves.push(deck.shuffle())
      moves.push(
        deck.deck().dealAtOnce({ type: LocationType.PlayerHand, player }, handSize)
      )

      // Flip used alpha power cards back face-up
      const usedPowers = this.material(MaterialType.AlphaPowerCard)
        .location(LocationType.PlayerAlphaPower)
        .player(player)
        .filter(item => item.location.rotation === true)
      if (usedPowers.length > 0) {
        moves.push(...usedPowers.rotateItems(false))
      }
    }

    // Update round counter and clean up memory
    this.memorize(Memory.Round, (this.remind<number>(Memory.Round) ?? 1) + 1)
    this.forget(Memory.EndTriggered)
    this.forget(Memory.RoundWinner)
    this.forget(Memory.RoundResults)

    // Winner of previous round starts (or same first player if tie)
    const firstPlayer = this.remind<PlayerColor>(Memory.FirstPlayer) ?? PlayerColor.Dark
    moves.push(this.startPlayerTurn(RuleId.PlaceCard, firstPlayer))

    return moves
  }
}
