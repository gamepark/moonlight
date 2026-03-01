/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { GameTable, GameTableNavigation, useGame } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { FC, useCallback, useEffect, useState } from 'react'
import { PlayerPanels } from './panels/PlayerPanels'
import { RoundScorePopup } from './scoring/RoundScorePopup'
import { onOpenRoundScore, RoundScoreSnapshot } from './scoring/roundScoreState'

type GameDisplayProps = {
  players: number
}

export const GameDisplay: FC<GameDisplayProps> = () => {
  const game = useGame<MaterialGame>()
  const isViewingResults = game?.rule?.id === RuleId.ViewRoundResults
  const [reviewSnapshot, setReviewSnapshot] = useState<RoundScoreSnapshot | null>(null)

  useEffect(() => {
    onOpenRoundScore((snapshot) => setReviewSnapshot(snapshot))
  }, [])

  const margin = { top: 7, left: 0, right: 0, bottom: 0 }
  const closeReview = useCallback(() => setReviewSnapshot(null), [])

  return (
    <>
      <GameTable xMin={-50} xMax={50} yMin={-30} yMax={20} margin={margin}>
        <GameTableNavigation css={navContainerCss} />
        <PlayerPanels />
      </GameTable>
      {isViewingResults && <RoundScorePopup />}
      {!isViewingResults && reviewSnapshot && (
        <RoundScorePopup
          onClose={closeReview}
          backdrop={false}
          popupStyle={reviewPopupCss}
          snapshot={reviewSnapshot}
        />
      )}
    </>
  )
}

const navContainerCss = css`
  top: unset !important;
  left: unset !important;
  bottom: 1em !important;
  right: 1em !important;
  flex-direction: column !important;
  gap: 0.5em !important;

  button {
    font-size: 2.2em !important;
    width: 1.8em !important;
    height: 1.8em !important;
    border: 1.5px solid rgba(200, 152, 40, 0.25) !important;
    background: rgba(18, 44, 44, 0.5) !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: #a09878 !important;
    filter: none !important;
    transition: all 0.3s ease !important;

    &:not(:disabled):hover {
      border-color: rgba(200, 152, 40, 0.5) !important;
      color: #e0dcc0 !important;
      background: rgba(26, 64, 64, 0.7) !important;
      box-shadow: 0 0 12px rgba(200, 152, 40, 0.12) !important;
      transform: scale(1.05) !important;
    }

    &:not(:disabled):active {
      transform: scale(0.92) !important;
      border-color: #c89828 !important;
      background: rgba(200, 152, 40, 0.12) !important;
      color: #d4ac40 !important;
      box-shadow: 0 0 18px rgba(200, 152, 40, 0.2) !important;
    }

    &:disabled {
      color: rgba(160, 152, 120, 0.3) !important;
      border-color: rgba(200, 152, 40, 0.1) !important;
    }
  }
`

const reviewPopupCss = css`
  position: fixed;
  top: 50%;
  left: 36vw;
  transform: translateY(-50%);
  z-index: 1100;
`
