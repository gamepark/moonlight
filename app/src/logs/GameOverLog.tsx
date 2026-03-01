/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { MoveComponentProps, usePlayerName } from '@gamepark/react-game'
import { MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'

const GOLD = '#c89828'
const GOLD_LIGHT = '#d4ac40'

// Brighter colors for dark background
const lightPlayerColor: Record<PlayerColor, string> = {
  [PlayerColor.Light]: '#d4c480',
  [PlayerColor.Dark]: '#60c0b0'
}

export const GameOverLog: FC<MoveComponentProps<MaterialMove>> = ({ context }) => {
  const { t } = useTranslation()
  const rules = new MoonlightRules(context.game as MaterialGame)
  const players = context.game.players as PlayerColor[]

  const scores = players.map(p => ({
    player: p,
    score: rules.getScore(p)
  })).sort((a, b) => b.score - a.score)

  const winner = scores[0]

  return (
    <div css={containerCss}>
      <WinnerBlock player={winner.player} score={winner.score} t={t} />
      <div css={dividerCss} />
      <div css={standingsCss}>
        {scores.map(({ player, score }) => (
          <ScoreRow key={player} player={player} score={score} t={t} />
        ))}
      </div>
    </div>
  )
}

const WinnerBlock: FC<{ player: PlayerColor, score: number, t: any }> = ({ player, score, t }) => {
  const name = usePlayerName(player)
  return (
    <div css={winnerCss}>
      <span css={crownCss}>{'\u2733'}</span>
      {' '}
      <strong css={winnerNameCss(lightPlayerColor[player])}>{name}</strong>
      {' '}
      <span css={winnerPtsCss}>
        {t('log.game-over.points', '{score, plural, one{# mountain} other{# mountains}}', { score })}
      </span>
    </div>
  )
}

const ScoreRow: FC<{ player: PlayerColor, score: number, t: any }> = ({ player, score, t }) => {
  const name = usePlayerName(player)
  const accent = player === PlayerColor.Light ? '#b8a060' : '#4a9a8a'
  return (
    <div css={rowCss}>
      <span css={dotCss(accent)} />
      <span css={nameCss(lightPlayerColor[player])}>{name}</span>
      <span css={scoreCss}>
        {t('log.game-over.mountains', '{score, plural, one{# mountain} other{# mountains}}', { score })}
      </span>
    </div>
  )
}

const containerCss = css`
  background: linear-gradient(175deg, #1a4040 0%, #163838 40%, #122c2c 100%);
  border: 1px solid ${GOLD}30;
  border-radius: 0.25em;
  padding: 0.6em 0.8em 0.6em 1em;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.2);
  color: #e0dcc0;
`

const winnerCss = css`
  text-align: center;
  padding-bottom: 0.4em;
`

const crownCss = css`
  color: ${GOLD_LIGHT};
  font-size: 0.9em;
`

const winnerNameCss = (color: string) => css`
  font-weight: 700;
  font-size: 1.1em;
  color: ${color};
`

const winnerPtsCss = css`
  font-size: 0.85em;
  color: #c0b890;
  font-style: italic;
`

const dividerCss = css`
  border-top: 1px dashed ${GOLD}25;
  margin-bottom: 0.35em;
`

const standingsCss = css`
  display: flex;
  flex-direction: column;
  gap: 0.15em;
`

const rowCss = css`
  display: flex;
  align-items: center;
  gap: 0.35em;
  padding: 0.1em 0.2em;
`

const dotCss = (accent: string) => css`
  width: 0.45em;
  height: 0.45em;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${accent};
  opacity: 0.75;
`

const nameCss = (color: string) => css`
  flex: 1;
  font-weight: 600;
  color: ${color};
`

const scoreCss = css`
  font-weight: 700;
  color: ${GOLD_LIGHT};
`
