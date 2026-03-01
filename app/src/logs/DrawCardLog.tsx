/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove } from '@gamepark/rules-api'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { useTranslation } from 'react-i18next'
import { playerNameCss } from './logStyles'

export const DrawCardLog: FC<MoveComponentProps<MaterialMove>> = ({ context }) => {
  const { t } = useTranslation()
  const player = (context.action.playerId ?? context.game.rule?.player) as PlayerColor | undefined
  const name = usePlayerName(player)
  return (
    <span>
      <span css={playerNameCss(player)}>{name}</span>
      {' '}{t('log.draw-card.text', 'draws a card')}
    </span>
  )
}
