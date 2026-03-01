import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { CustomMoveType } from '@gamepark/moonlight/rules/CustomMoveType'
import { PlayMoveButton, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const PlaceSecondCardHeader = () => {
  const rules = useRules<MoonlightRules>()!
  const player = rules.getActivePlayer()!
  const me = usePlayerId()
  const name = usePlayerName(player)
  const isMe = player === me
  return <Trans
    i18nKey={isMe ? 'header.place-second-card.me' : 'header.place-second-card'}
    defaults={isMe ? 'You may place a second card or <pass>pass</pass>' : '{player} may place a second card or <pass>pass</pass>'}
    values={{ player: name }}
    components={{
      pass: <PlayMoveButton move={isMe ? rules.customMove(CustomMoveType.Pass) : undefined} auto={5} />
    }}
  />
}
