import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { Memory } from '@gamepark/moonlight/rules/Memory'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const ViewRoundResultsHeader = () => {
  const rules = useRules<MoonlightRules>()!
  const me = usePlayerId<PlayerColor>()
  const winner = rules.remind<PlayerColor | undefined>(Memory.RoundWinner)
  const winnerName = usePlayerName(winner)
  const activePlayers = rules.game.rule?.players ?? []
  const hasConfirmed = me !== undefined && !activePlayers.includes(me)

  if (hasConfirmed) {
    return <Trans i18nKey="header.round-results.waiting" defaults="Waiting for the other player..." />
  }
  if (winner === undefined) {
    return <Trans i18nKey="header.round-results.tie" defaults="The round is tied!" />
  }
  if (me === winner) {
    return <Trans i18nKey="header.round-results.winner.me" defaults="You win the round!" />
  }
  return <Trans i18nKey="header.round-results.winner" defaults="{player} wins the round!" values={{ player: winnerName }} />
}
