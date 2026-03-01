/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { MoveComponentProps, usePlay, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MaterialMoveBuilder, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { AlphaPowerCard } from '@gamepark/moonlight/material/AlphaPowerCard'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { useTranslation } from 'react-i18next'
import { playerNameCss, pickMarkerCss, powerLinkCss, powerNameCss } from './logStyles'

export const ChooseAlphaPowerLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const { t } = useTranslation()
  const play = usePlay()
  const player = (context.action.playerId ?? context.game.rule?.player) as PlayerColor | undefined
  const name = usePlayerName(player)
  const m = move as MoveItem

  const item = context.game.items?.[MaterialType.AlphaPowerCard]?.[m.itemIndex]
  const cardId = (m.reveal?.id ?? item?.id) as AlphaPowerCard | undefined
  const powerName = cardId ? t(`help.alpha.title.${cardId - 100}`) : undefined

  const openHelp = cardId !== undefined ? () => {
    play(MaterialMoveBuilder.displayMaterialHelp(MaterialType.AlphaPowerCard, { id: cardId }), { transient: true })
  } : undefined

  return (
    <span>
      <span css={pickMarkerCss}>{'\u25C6'}</span>
      <span css={playerNameCss(player)}>{name}</span>
      {' '}{t('log.choose-alpha-power.verb', 'chooses')}{' '}
      {openHelp ? (
        <span css={powerLinkCss} onClick={openHelp}>{powerName}</span>
      ) : (
        <span css={powerNameCss}>{t('log.choose-alpha-power.fallback', 'an Alpha Power')}</span>
      )}
    </span>
  )
}
