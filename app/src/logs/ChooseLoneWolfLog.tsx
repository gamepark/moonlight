/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { wolfColor, wolfValue, WolfCard } from '@gamepark/moonlight/material/WolfCard'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { useTranslation } from 'react-i18next'
import { playerNameCss, valueBadgeCss, pickMarkerCss } from './logStyles'

export const ChooseLoneWolfLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const { t } = useTranslation()
  const player = (context.action.playerId ?? context.game.rule?.player) as PlayerColor | undefined
  const name = usePlayerName(player)
  const m = move as MoveItem

  const item = context.game.items?.[MaterialType.WolfCard]?.[m.itemIndex]
  const cardId = item?.id as { front: WolfCard } | undefined
  const value = cardId ? wolfValue(cardId.front) : undefined
  const cardPlayer = cardId ? wolfColor(cardId.front) : player

  if (value !== undefined) {
    return (
      <span>
        <span css={pickMarkerCss}>{'\u25C6'}</span>
        <span css={playerNameCss(player)}>{name}</span>
        {' '}{t('log.choose-lone-wolf.value.text', 'adds a Lone Wolf (value')}{' '}
        <span css={valueBadgeCss(cardPlayer)}>{value}</span>
        {') '}{t('log.choose-lone-wolf.value.deck', 'to their deck')}
      </span>
    )
  }

  return (
    <span>
      <span css={pickMarkerCss}>{'\u25C6'}</span>
      <span css={playerNameCss(player)}>{name}</span>
      {' '}{t('log.choose-lone-wolf.text', 'chooses a Lone Wolf')}
    </span>
  )
}
