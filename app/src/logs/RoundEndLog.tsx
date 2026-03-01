/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialMove } from '@gamepark/rules-api'
import { Memory, RoundResultsData } from '@gamepark/moonlight/rules/Memory'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { separatorTitleCss, separatorWinnerCss, separatorTieCss, separatorWrapCss, separatorTextCss, logButtonCss } from './logStyles'
import { openRoundScore } from '../scoring/roundScoreState'

export const RoundEndLog: FC<MoveComponentProps<MaterialMove>> = ({ context }) => {
  const { t } = useTranslation()
  const round = context.game.memory?.[Memory.Round] ?? 1
  const winner = context.game.memory?.[Memory.RoundWinner] as PlayerColor | undefined
  const results = context.game.memory?.[Memory.RoundResults] as RoundResultsData | undefined
  const winnerName = usePlayerName(winner)

  const handleClick = useCallback(() => {
    if (results) openRoundScore({ results, winner })
  }, [results, winner])

  return (
    <div css={separatorWrapCss}>
      <span css={separatorTextCss}>
        <span css={separatorTitleCss}>
          {t('log.round-end.round', 'Round {round}', { round })}
        </span>
        {' \u2014 '}
        {winner !== undefined ? (
          <span css={separatorWinnerCss(winner)}>
            {t('log.round-end.wins', '{player} wins', { player: winnerName })}
          </span>
        ) : (
          <span css={separatorTieCss}>
            {t('log.round-end.tie.label', 'Tie')}
          </span>
        )}
      </span>
      <button css={logButtonCss} onClick={handleClick}>
        {t('log.round-end.details', 'Details')}
      </button>
    </div>
  )
}
