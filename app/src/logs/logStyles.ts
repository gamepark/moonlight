import { css } from '@emotion/react'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'

/* ── Player color palette ── */
const playerLogColors: Record<PlayerColor, { accent: string, bg: string, name: string, glow: string }> = {
  [PlayerColor.Light]: { accent: '#b8a060', bg: 'rgba(184, 160, 96, 0.12)', name: '#c8b060', glow: 'rgba(184, 160, 96, 0.4)' },
  [PlayerColor.Dark]: { accent: '#4a9a8a', bg: 'rgba(74, 154, 138, 0.12)', name: '#60c0b0', glow: 'rgba(74, 154, 138, 0.4)' }
}

const GOLD = '#c89828'
const GOLD_LIGHT = '#d4ac40'

/* ── Helpers ── */
export const getPlayerColor = (player?: PlayerColor) =>
  player !== undefined ? playerLogColors[player].name : '#a09878'

/* ══════════════════════════════════════════════════════
   ENTRY CSS — per player (Amanite pattern)
   ══════════════════════════════════════════════════════ */

export const entryCss = (player?: PlayerColor) => {
  const colors = player !== undefined ? playerLogColors[player] : undefined
  const accent = colors?.accent ?? '#888'
  const bg = colors?.bg ?? 'transparent'
  const glow = colors?.glow ?? 'transparent'
  return css`
    background: ${bg};
    border-left: 3px solid ${accent};
    box-shadow: inset 3px 0 6px -3px ${glow};
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
  background: linear-gradient(90deg, rgba(200, 152, 40, 0.14) 0%, rgba(200, 152, 40, 0.03) 100%);
  border-radius: 0.35em;
  border-left: 3px solid ${GOLD};
  border-top: 1px solid rgba(200, 152, 40, 0.12);
  border-bottom: 1px solid rgba(200, 152, 40, 0.12);
  margin: 0.4em 0;
  padding: 0.5em 0.7em;

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
    min-width: 1.6em;
    height: 1.6em;
    border-radius: 50%;
    font-size: 0.9em;
    font-weight: 700;
    line-height: 1;
    vertical-align: middle;
    margin: 0 0.15em;
    background: ${colors?.bg ?? 'rgba(0,0,0,0.08)'};
    color: ${accent};
    border: 1.5px solid ${accent}70;
    box-shadow: 0 0 5px ${colors?.glow ?? 'transparent'};
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

export const powerLinkCss = css`
  color: ${GOLD};
  font-style: italic;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: ${GOLD}40;
  text-underline-offset: 0.15em;
  &:hover {
    text-decoration-color: ${GOLD};
    color: ${GOLD_LIGHT};
  }
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
  padding: 0.2em 0.7em;
  font-size: 0.85em;
  font-weight: 600;
  border-radius: 2em;
  border: 1px solid rgba(200, 152, 40, 0.25);
  background: rgba(31, 79, 79, 0.6);
  color: #e0dcc0;
  cursor: pointer;
  letter-spacing: 0.03em;
  white-space: nowrap;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(31, 79, 79, 0.85);
    border-color: rgba(200, 152, 40, 0.4);
    box-shadow: 0 0 8px rgba(200, 152, 40, 0.1);
  }
  &:active {
    background: rgba(21, 53, 53, 0.9);
  }
`
