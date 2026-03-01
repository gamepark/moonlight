/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove, MoveItem } from '@gamepark/rules-api'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { wolfColor, wolfValue, WolfCard } from '@gamepark/moonlight/material/WolfCard'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { useTranslation } from 'react-i18next'
import { playerNameCss, valueBadgeCss, stackIconCss } from './logStyles'

export const PlaceCardLog: FC<MoveComponentProps<MaterialMove>> = ({ move, context }) => {
  const { t } = useTranslation()
  const player = (context.action.playerId ?? context.game.rule?.player) as PlayerColor | undefined
  const name = usePlayerName(player)
  const m = move as MoveItem

  const item = context.game.items?.[MaterialType.WolfCard]?.[m.itemIndex]
  const cardId = (m.reveal?.id ?? item?.id) as { front: WolfCard } | undefined
  const value = cardId ? wolfValue(cardId.front) : undefined
  const cardPlayer = cardId ? wolfColor(cardId.front) : player
  const isStacking = (m.location.z ?? 0) > 0

  if (isStacking && value !== undefined) {
    return (
      <span>
        <span css={stackIconCss}>{'\u2694'}</span>
        <span css={playerNameCss(player)}>{name}</span>
        {' '}{t('log.place-card.stack.text', 'covers a wolf with a value')}{' '}
        <span css={valueBadgeCss(cardPlayer)}>{value}</span>
        {' '}{t('log.place-card.stack.wolf', 'wolf')}
      </span>
    )
  }

  if (value !== undefined) {
    return (
      <span>
        <span css={playerNameCss(player)}>{name}</span>
        {' '}{t('log.place-card.value.text', 'places a value')}{' '}
        <span css={valueBadgeCss(cardPlayer)}>{value}</span>
        {' '}{t('log.place-card.value.wolf', 'wolf')}
      </span>
    )
  }

  return (
    <span>
      <span css={playerNameCss(player)}>{name}</span>
      {' '}{t('log.place-card.text', 'places a card')}
    </span>
  )
}
