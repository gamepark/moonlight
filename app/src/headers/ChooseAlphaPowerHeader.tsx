import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const ChooseAlphaPowerHeader = () => {
  const rules = useRules<MoonlightRules>()!
  const player = rules.getActivePlayer()!
  const me = usePlayerId()
  const name = usePlayerName(player)
  const isMe = player === me
  return <Trans
    i18nKey={isMe ? 'header.choose-alpha-power.me' : 'header.choose-alpha-power'}
    values={{ player: name }}
  />
}
