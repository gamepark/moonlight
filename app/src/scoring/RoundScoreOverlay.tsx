/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { Memory } from '@gamepark/moonlight/rules/Memory'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { useGame, usePlayerId, useRules } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { RoundScorePopup } from './RoundScorePopup'
import { onOpenRoundScore, RoundScoreSnapshot } from './roundScoreState'

export const RoundScoreOverlay: FC = () => {
  const game = useGame<MaterialGame>()
  const rules = useRules<MoonlightRules>()
  const me = usePlayerId()
  const isSpectator = me === undefined
  const ruleId = game?.rule?.id as RuleId | undefined
  const hasRoundResults = rules ? rules.remind(Memory.RoundResults) !== undefined : false

  // --- Player: show only during ViewRoundResults (unchanged behavior) ---
  // --- Spectator: trigger once when entering ViewRoundResults, stays until dismissed/timer ---
  const [spectatorTriggered, setSpectatorTriggered] = useState(false)
  const prevRuleId = useRef(ruleId)

  useEffect(() => {
    if (isSpectator) {
      // Trigger when we enter ViewRoundResults
      if (ruleId === RuleId.ViewRoundResults && prevRuleId.current !== RuleId.ViewRoundResults) {
        setSpectatorTriggered(true)
      }
      // Reset when round results are cleared (new round)
      if (!hasRoundResults && spectatorTriggered) {
        setSpectatorTriggered(false)
      }
    }
    prevRuleId.current = ruleId
  })

  const showResults = isSpectator ? spectatorTriggered : ruleId === RuleId.ViewRoundResults

  // --- Review snapshot (from log "Details" button) ---
  const [reviewSnapshot, setReviewSnapshot] = useState<RoundScoreSnapshot | null>(null)

  useEffect(() => {
    onOpenRoundScore((snapshot) => setReviewSnapshot(snapshot))
  }, [])

  // --- Spectator minimize/dismiss ---
  const [minimized, setMinimized] = useState(false)
  const prevShowResults = useRef(false)

  useEffect(() => {
    if (showResults && !prevShowResults.current) {
      setMinimized(false)
    }
    prevShowResults.current = showResults
  })

  const [playerHidden, setPlayerHidden] = useState(false)

  // Reset playerHidden when entering ViewRoundResults
  useEffect(() => {
    if (!isSpectator && ruleId === RuleId.ViewRoundResults) {
      setPlayerHidden(false)
    }
  }, [ruleId, isSpectator])

  const closeReview = useCallback(() => setReviewSnapshot(null), [])
  const minimize = useCallback(() => setMinimized(true), [])
  const restore = useCallback(() => setMinimized(false), [])
  const dismiss = useCallback(() => setSpectatorTriggered(false), [])
  const hidePlayer = useCallback(() => setPlayerHidden(true), [])

  return (
    <>
      {showResults && !playerHidden && !reviewSnapshot && (
        <RoundScorePopup
          minimized={minimized}
          onMinimize={minimize}
          onRestore={restore}
          onClose={isSpectator ? dismiss : undefined}
          onConfirm={isSpectator ? undefined : hidePlayer}
          autoDismiss={isSpectator ? dismiss : undefined}
        />
      )}
      {reviewSnapshot && (
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

const reviewPopupCss = css`
  position: fixed;
  top: 50%;
  left: 36vw;
  transform: translateY(-50%);
  z-index: 1100;
`
