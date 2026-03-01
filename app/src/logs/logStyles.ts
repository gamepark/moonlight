import { css } from '@emotion/react'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'

/* ── Player color palette ── */
const playerLogColors: Record<PlayerColor, { accent: string, bg: string, name: string }> = {
  [PlayerColor.Light]: { accent: '#b8a060', bg: 'rgba(184, 160, 96, 0.15)', name: '#8a7030' },
  [PlayerColor.Dark]: { accent: '#4a9a8a', bg: 'rgba(74, 154, 138, 0.15)', name: '#2a7a6a' }
}

const GOLD = '#c89828'
const GOLD_LIGHT = '#d4ac40'

/* ── Helpers ── */
export const getPlayerColor = (player?: PlayerColor) =>
  player !== undefined ? playerLogColors[player].name : '#2a3a3a'

/* ══════════════════════════════════════════════════════
   ENTRY CSS — per player (Amanite pattern)
   ══════════════════════════════════════════════════════ */

export const entryCss = (player?: PlayerColor) => {
  const colors = player !== undefined ? playerLogColors[player] : undefined
  const accent = colors?.accent ?? '#888'
  const bg = colors?.bg ?? 'rgba(0, 0, 0, 0.05)'
  return css`
    background: ${bg} !important;
    border-radius: 0 0.4em 0.4em 0 !important;
    border-left: 4px solid ${accent} !important;
    margin-bottom: 0.12em !important;
    margin-top: 0 !important;
    padding: 0.3em 0.6em 0.3em 0.8em !important;
    font-size: 1.8em !important;
    color: #2a3a3a;
  `
}

/* ── Game over ── */
export const gameOverCss = css`
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0.3em 0.6em;
  margin: 0.5em 0;
  width: 100%;
  max-width: 100%;
  display: block;
  & > * {
    width: 100%;
  }
`

/* ── Round separator ── */
export const separatorCss = css`
  background: linear-gradient(90deg, rgba(200, 152, 40, 0.18) 0%, rgba(200, 152, 40, 0.06) 100%) !important;
  border-radius: 0.4em !important;
  border-left: 4px solid ${GOLD} !important;
  border-top: 1px solid rgba(200, 152, 40, 0.2) !important;
  border-bottom: 1px solid rgba(200, 152, 40, 0.2) !important;
  margin-bottom: 0.3em !important;
  margin-top: 0.3em !important;
  padding: 0.6em 1em !important;
  font-size: 1.8em !important;
  color: #2a3a3a;

  > div:last-child {
    flex: 1;
  }
`

export const separatorTitleCss = css`
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${GOLD};
  font-size: 0.85em;
`

export const separatorWinnerCss = (player?: PlayerColor) => {
  const color = player !== undefined ? playerLogColors[player].accent : GOLD
  return css`
    font-weight: 700;
    color: ${color};
  `
}

export const separatorTieCss = css`
  font-weight: 600;
  font-style: italic;
  color: #8a8a7a;
`

/* ══════════════════════════════════════════════════════
   INLINE JSX STYLES — used inside log components
   ══════════════════════════════════════════════════════ */

export const playerNameCss = (player?: PlayerColor) => css`
  font-weight: 700;
  color: ${getPlayerColor(player)};
`

export const valueBadgeCss = (player?: PlayerColor) => {
  const colors = player !== undefined ? playerLogColors[player] : undefined
  const accent = colors?.accent ?? '#888'
  return css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.3em;
    height: 1.3em;
    border-radius: 50%;
    font-size: 0.8em;
    font-weight: 700;
    line-height: 1;
    vertical-align: middle;
    margin: 0 0.1em;
    position: relative;
    top: -0.05em;
    background: ${colors?.bg ?? 'rgba(0,0,0,0.08)'};
    color: ${accent};
    border: 1.5px solid ${accent}70;
  `
}

export const stackIconCss = css`
  color: ${GOLD_LIGHT};
  font-size: 0.85em;
  margin-right: 0.15em;
`

export const powerIconCss = css`
  font-size: 0.85em;
  margin-right: 0.1em;
`

export const pickMarkerCss = css`
  color: ${GOLD_LIGHT};
  font-size: 0.7em;
  margin-right: 0.2em;
`

export const powerNameCss = css`
  color: ${GOLD};
  font-style: italic;
  font-weight: 600;
`

export const separatorWrapCss = css`
  display: flex;
  align-items: center;
  width: 100%;
`

export const separatorTextCss = css`
  flex: 1;
`

export const logButtonCss = css`
  flex-shrink: 0;
  margin-left: auto;
  padding: 0.25em 1em;
  font-size: 0.85em;
  font-weight: 700;
  border-radius: 0.35em;
  border: none;
  background: #1a4040;
  color: #e0dcc0;
  cursor: pointer;
  letter-spacing: 0.03em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  &:hover {
    background: #255555;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  &:active {
    background: #153535;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
  }
`
