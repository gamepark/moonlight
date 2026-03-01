import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const ChooseLoneWolfHeader = () => {
  const rules = useRules<MoonlightRules>()!
  const player = rules.getActivePlayer()!
  const me = usePlayerId()
  const name = usePlayerName(player)
  const isMe = player === me
  return <Trans
    i18nKey={isMe ? 'header.choose-lone-wolf.me' : 'header.choose-lone-wolf'}
    defaults={isMe ? 'You must choose a Lone Wolf card' : '{player} must choose a Lone Wolf card'}
    values={{ player: name }}
  />
}
