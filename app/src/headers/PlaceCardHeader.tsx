import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { wolfValue } from '@gamepark/moonlight/material/WolfCard'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { CustomMoveType } from '@gamepark/moonlight/rules/CustomMoveType'
import { AlphaPowerHelper } from '@gamepark/moonlight/rules/helper/AlphaPowerHelper'
import { PlayMoveButton, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

export const PlaceCardHeader = () => {
  const rules = useRules<MoonlightRules>()!
  const player = rules.getActivePlayer()!
  const me = usePlayerId()
  const name = usePlayerName(player)
  const powers = new AlphaPowerHelper(rules.game, player)
  const hasValue2 = rules.material(MaterialType.WolfCard).location(LocationType.PlayerHand).player(player)
    .filter(item => wolfValue((item.id as { front: number })?.front) === 2).length > 0
  const canMovePile = powers.canUseAmbush('movePile') && hasValue2
  const isMe = player === me

  if (canMovePile) {
    return <Trans
      i18nKey={isMe ? 'header.place-card.move-pile.me' : 'header.place-card.move-pile'}
      values={{ player: name }}
      components={{
        button: <PlayMoveButton move={isMe ? rules.customMove(CustomMoveType.ActivateMovePile) : undefined} />
      }}
    />
  }

  return <Trans
    i18nKey={isMe ? 'header.place-card.me' : 'header.place-card'}
    values={{ player: name }}
  />
}
