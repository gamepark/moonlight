import { MaterialMove, SimultaneousRule } from '@gamepark/rules-api'
import { PlayerColor } from '../PlayerColor'
import { Memory } from './Memory'
import { RuleId } from './RuleId'

export class ViewRoundResultsRule extends SimultaneousRule {
  getActivePlayerLegalMoves(player: PlayerColor): MaterialMove[] {
    return [this.endPlayerTurn(player)]
  }

  getMovesAfterPlayersDone(): MaterialMove[] {
    const winner = this.remind<PlayerColor | undefined>(Memory.RoundWinner)
    if (winner === undefined) {
      return [this.startRule(RuleId.NewRound)]
    }

    // Check if the winner has completed their mountain (2 pieces)
    const mountainKey = winner === PlayerColor.Light ? Memory.LightMountains : Memory.DarkMountains
    const mountains = this.remind<number>(mountainKey) ?? 0
    if (mountains >= 2) {
      return [this.endGame()]
    }

    return [this.startPlayerTurn(RuleId.ChooseLoneWolf, winner)]
  }
}
