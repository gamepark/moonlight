import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { CustomMoveType } from '@gamepark/moonlight/rules/CustomMoveType'
import { PlayMoveButton, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'
import { headerButtonCss } from './headerButtonCss'

export const PlaceSecondCardHeader = () => {
  const rules = useRules<MoonlightRules>()!
  const player = rules.getActivePlayer()!
  const me = usePlayerId()
  const name = usePlayerName(player)
  const isMe = player === me
  return <Trans
    i18nKey={isMe ? 'header.place-second-card.me' : 'header.place-second-card'}
    values={{ player: name }}
    components={{
      pass: <PlayMoveButton css={headerButtonCss} move={isMe ? rules.customMove(CustomMoveType.Pass) : undefined} auto={5} />
    }}
  />
}
