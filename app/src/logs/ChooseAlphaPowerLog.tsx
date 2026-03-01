/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { AlphaPowerCard } from '@gamepark/moonlight/material/AlphaPowerCard'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { useTranslation } from 'react-i18next'
import { playerNameCss, pickMarkerCss, powerNameCss } from './logStyles'

export const ChooseAlphaPowerLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const { t } = useTranslation()
  const player = (context.action.playerId ?? context.game.rule?.player) as PlayerColor | undefined
  const name = usePlayerName(player)
  const m = move as MoveItem

  const item = context.game.items?.[MaterialType.AlphaPowerCard]?.[m.itemIndex]
  const cardId = (m.reveal?.id ?? item?.id) as AlphaPowerCard | undefined
  const powerName = cardId ? t(`help.alpha.title.${cardId - 100}`) : undefined

  return (
    <span>
      <span css={pickMarkerCss}>{'\u25C6'}</span>
      <span css={playerNameCss(player)}>{name}</span>
      {' '}{t('log.choose-alpha-power.verb', 'chooses')}{' '}
      <span css={powerNameCss}>{powerName ?? t('log.choose-alpha-power.fallback', 'an Alpha Power')}</span>
    </span>
  )
}
