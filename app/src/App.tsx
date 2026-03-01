/** @jsxImportSource @emotion/react */
import { css, Global } from '@emotion/react'
import { FailuresDialog, FullscreenDialog, LoadingScreen, MaterialGameSounds, MaterialHeader, MaterialImageLoader, Menu, useGame } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { useEffect, useState } from 'react'
import { GameDisplay } from './GameDisplay'
import { Headers } from './headers/Headers'

export function App() {
  const game = useGame<MaterialGame>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  const [isImagesLoading, setImagesLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])

  useEffect(() => {
    if (game?.helpDisplay) {
      document.documentElement.classList.add('help-open')
    } else {
      document.documentElement.classList.remove('help-open')
    }
  }, [game?.helpDisplay])

  const loading = !game || isJustDisplayed || isImagesLoading
  return (
    <>
      <Global styles={helpDialogCss} />
      {!!game && <GameDisplay players={game.players.length} />}
      <LoadingScreen display={loading} />
      <MaterialHeader rulesStepsHeaders={Headers} loading={loading} />
      <MaterialImageLoader onImagesLoad={() => setImagesLoading(false)} />
      <MaterialGameSounds />
      <Menu />
      <FailuresDialog />
      <FullscreenDialog />
    </>
  )
}

const helpDialogCss = css`
  /* Navigation arrows (no theme slot, must use Global CSS) */
  .help-open div:has(> .fa-chevron-left),
  .help-open div:has(> .fa-chevron-right) {
    z-index: 1 !important;
    background: #1a4040 !important;
    border: 2px solid rgba(200, 152, 40, 0.3) !important;
    border-radius: 50% !important;
    box-shadow: 0 0.08em 0.25em rgba(0, 0, 0, 0.3) !important;
    color: #e0dcc0 !important;
    width: 1.2em !important;
    height: 1.2em !important;
    padding: 0 !important;
    transition: all 0.15s ease !important;
    animation: none !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    & > svg {
      width: 0.4em !important;
      height: 0.4em !important;
    }

    &:hover {
      background: #255555 !important;
      border-color: rgba(200, 152, 40, 0.5) !important;
      box-shadow: 0 0.1em 0.35em rgba(0, 0, 0, 0.35) !important;
      transform: translateY(-50%) scale(1.08) !important;
    }

    &:active {
      background: #153535 !important;
      box-shadow: 0 0.04em 0.1em rgba(0, 0, 0, 0.2) !important;
      transform: translateY(-50%) scale(0.95) !important;
    }
  }

  .help-open div:has(> .fa-chevron-left) {
    left: -0.6em !important;
  }

  .help-open div:has(> .fa-chevron-right) {
    right: -0.6em !important;
  }
`
