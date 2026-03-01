import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const MovePileHeader = () => {
  const rules = useRules<MoonlightRules>()!
  const player = rules.getActivePlayer()!
  const me = usePlayerId()
  const name = usePlayerName(player)
  const isMe = player === me
  return <Trans
    i18nKey={isMe ? 'header.move-pile.me' : 'header.move-pile'}
    defaults={isMe ? 'You must move a pile and place a value 2 card' : '{player} must move a pile and place a value 2 card'}
    values={{ player: name }}
  />
}
