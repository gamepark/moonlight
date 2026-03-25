/** @jsxImportSource @emotion/react */
import { css, Interpolation, Theme } from '@emotion/react'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { Memory, PlayerScoreBreakdown, RoundResultsData } from '@gamepark/moonlight/rules/Memory'
import { PlayMoveButton, usePlayerId, usePlayerName, useRules } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { RoundScoreSnapshot } from './roundScoreState'

type RoundScorePopupProps = {
  onClose?: () => void
  onConfirm?: () => void
  minimized?: boolean
  onMinimize?: () => void
  onRestore?: () => void
  autoDismiss?: () => void
  backdrop?: boolean
  popupStyle?: Interpolation<Theme>
  snapshot?: RoundScoreSnapshot
}

export const RoundScorePopup: FC<RoundScorePopupProps> = ({ onClose, onConfirm, minimized, onMinimize, onRestore, autoDismiss, backdrop = true, popupStyle, snapshot }) => {
  const { t } = useTranslation()

  // Auto-dismiss after 30s (for spectators)
  useEffect(() => {
    if (!autoDismiss) return
    const timer = setTimeout(autoDismiss, 30000)
    return () => clearTimeout(timer)
  }, [autoDismiss])
  const rules = useRules<MoonlightRules>()!
  const me = usePlayerId<PlayerColor>()
  const winner = snapshot?.winner ?? rules.remind<PlayerColor | undefined>(Memory.RoundWinner)
  const results = snapshot?.results ?? rules.remind<RoundResultsData>(Memory.RoundResults)
  const activePlayers = snapshot ? [] : (rules.game.rule?.players ?? [])
  const hasConfirmed = snapshot ? true : (me !== undefined && !activePlayers.includes(me))

  const winnerName = usePlayerName(winner)

  const leftPlayer = me ?? PlayerColor.Light
  const rightPlayer = leftPlayer === PlayerColor.Light ? PlayerColor.Dark : PlayerColor.Light
  const leftName = usePlayerName(leftPlayer)
  const rightName = usePlayerName(rightPlayer)
  const left: PlayerScoreBreakdown = leftPlayer === PlayerColor.Light ? results?.light : results?.dark
  const right: PlayerScoreBreakdown = leftPlayer === PlayerColor.Light ? results?.dark : results?.light

  const getRowValue = (row: RoundResultsData['rows'][number], player: PlayerColor) =>
    player === PlayerColor.Light ? row.lightValue : row.darkValue
  const getRowCards = (row: RoundResultsData['rows'][number], player: PlayerColor) =>
    player === PlayerColor.Light ? row.lightCards : row.darkCards
  const getRowWon = (row: RoundResultsData['rows'][number], player: PlayerColor) =>
    (player === PlayerColor.Light && row.winner === 'light') || (player === PlayerColor.Dark && row.winner === 'dark')
  const getRowLost = (row: RoundResultsData['rows'][number], player: PlayerColor) =>
    (player === PlayerColor.Light && row.winner === 'dark') || (player === PlayerColor.Dark && row.winner === 'light')

  const confirmMove = me !== undefined ? MaterialMoveBuilder.endPlayerTurn(me) : undefined

  if (!results) return null

  const content = (
    <div css={[popupCss, popupStyle]}>

      {/* Minimize button */}
      {onMinimize && (
        <button css={minimizeBtnCss} onClick={onMinimize} title="Minimize">−</button>
      )}

      {/* Title */}
      <div css={titleCss}>
        {winner === undefined
          ? <Trans i18nKey="round-results.title.tie" defaults="The round is tied!" />
          : winner === me
            ? <Trans i18nKey="round-results.title.winner.me" defaults="You win the round!" />
            : <Trans i18nKey="round-results.title.winner" defaults="{player} wins the round!" values={{ player: winnerName }} />
        }
      </div>

      {/* Column headers */}
      <div css={headerRowCss}>
        <div css={colLabelCss} />
        <div css={colPlayerCss}>{leftName}</div>
        <div css={colPlayerCss}>{rightName}</div>
      </div>

      {/* Row battles */}
      {results.rows.map((row, i) => (
        <div key={row.y} css={rowCss(i)}>
          <div css={colLabelCss}>{t('scoring.row', 'Row {n}', { n: i + 1 })}</div>
          <div css={colCellCss}>
            <span css={rowValCss(getRowWon(row, leftPlayer), getRowLost(row, leftPlayer))}>{getRowCards(row, leftPlayer)}</span>
            <span css={cardCountCss}>{'\u00a0'}{t('scoring.majority', '(majority {n})', { n: getRowValue(row, leftPlayer) })}</span>
          </div>
          <div css={colCellCss}>
            <span css={rowValCss(getRowWon(row, rightPlayer), getRowLost(row, rightPlayer))}>{getRowCards(row, rightPlayer)}</span>
            <span css={cardCountCss}>{'\u00a0'}{t('scoring.majority', '(majority {n})', { n: getRowValue(row, rightPlayer) })}</span>
          </div>
        </div>
      ))}

      {/* Explanation + scoring section */}
      <div css={sectionExplainCss}>
        <Trans i18nKey="round-results.explain" defaults="The winner of each row recovers their cards." />
      </div>

      <div css={sectionTitleCss}>{t('round-results.scoring', 'Scoring')}</div>

      {/* Won cards */}
      <div css={scoreRowCss}>
        <div css={colLabelCss}>{t('scoring.cards', 'Won cards')}</div>
        <div css={colCellCss}>
          <span css={scoreValCss(left.cards > 0)}>{left.cards}</span>
        </div>
        <div css={colCellCss}>
          <span css={scoreValCss(right.cards > 0)}>{right.cards}</span>
        </div>
      </div>

      {/* Moon majority */}
      <div css={scoreRowCss}>
        <div css={colLabelCss}>{t('scoring.moons', 'Moon majority')}</div>
        <div css={colCellCss}>
          <span css={scoreValCss(left.moonBonus > 0)}>
            {left.moonBonus > 0 ? `+${left.moonBonus}` : '\u2014'}
          </span>
        </div>
        <div css={colCellCss}>
          <span css={scoreValCss(right.moonBonus > 0)}>
            {right.moonBonus > 0 ? `+${right.moonBonus}` : '\u2014'}
          </span>
        </div>
      </div>

      {/* V3 bonus */}
      {(left.v3Bonus > 0 || right.v3Bonus > 0) && (
        <div css={scoreRowCss}>
          <div css={colLabelCss}>{t('scoring.bonus', 'Value 3 bonus')}</div>
          <div css={colCellCss}>
            <span css={scoreValCss(left.v3Bonus > 0)}>
              {left.v3Bonus > 0 ? `+${left.v3Bonus}` : '\u2014'}
            </span>
          </div>
          <div css={colCellCss}>
            <span css={scoreValCss(right.v3Bonus > 0)}>
              {right.v3Bonus > 0 ? `+${right.v3Bonus}` : '\u2014'}
            </span>
          </div>
        </div>
      )}

      {/* Total */}
      <div css={totalRowCss}>
        <div css={colLabelCss}>{t('scoring.total', 'Total')}</div>
        <div css={colCellCss}>
          <span css={totalValCss(left.total >= right.total)}>{left.total}</span>
        </div>
        <div css={colCellCss}>
          <span css={totalValCss(right.total >= left.total)}>{right.total}</span>
        </div>
      </div>

      {/* Mountain info */}
      <div css={mountainCss}>
        {winner !== undefined ? (
          <Trans
            i18nKey={winner === me ? 'round-results.mountain-awarded.me' : 'round-results.mountain-awarded'}
            defaults={winner === me ? 'You receive a mountain token!' : '{player} receives a mountain token!'}
            values={{ player: winnerName }}
          />
        ) : (
          <Trans i18nKey="round-results.no-mountain" defaults="No mountain is awarded. The round will be replayed." />
        )}
      </div>

      {/* Action */}
      <div css={actionCss}>
        {snapshot ? (
          <button css={btnCss} onClick={onClose}>
            <Trans i18nKey="Close" defaults="Close" ns="common" />
          </button>
        ) : me !== undefined && !hasConfirmed ? (
          <PlayMoveButton move={confirmMove} onPlay={onConfirm} css={btnCss} auto={30}>
            <Trans i18nKey="round-results.continue" defaults="Continue" />
          </PlayMoveButton>
        ) : onClose ? (
          <button css={btnCss} onClick={onClose}>
            <Trans i18nKey="Close" defaults="Close" ns="common" />
          </button>
        ) : null}
      </div>
    </div>
  )

  if (!backdrop) return content

  return (
    <>
      {minimized && (
        <button css={fabCss} onClick={onRestore}>
          <Trans i18nKey="round-results.show" defaults="Round results" />
        </button>
      )}
      <div css={[backdropCss, minimized && hiddenCss]} onClick={onMinimize}>
        <div onClick={e => e.stopPropagation()}>
          {content}
        </div>
      </div>
    </>
  )
}

/* ── Theme colors ── */
const TEAL_DEEP = '#122c2c'
const TEAL = '#1a4040'
const TEAL_LIGHT = '#1f4f4f'
const GOLD = '#c89828'
const GOLD_LIGHT = '#d4ac40'
const CREAM = '#e0dcc0'
const CREAM_DIM = '#a09878'

/* ── Styles ── */

const backdropCss = css`
  position: fixed;
  inset: 0;
  background: rgba(5, 15, 15, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`

const popupCss = css`
  position: relative;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(30, 80, 70, 0.25) 0%, transparent 60%),
    linear-gradient(170deg, ${TEAL_DEEP} 0%, ${TEAL} 50%, ${TEAL_DEEP} 100%);
  border: 1.5px solid ${GOLD}33;
  border-radius: 1em;
  padding: 2.5em 3em 2em;
  color: ${CREAM};
  width: min(44em, 90vw);
  box-shadow:
    0 0 0 1px ${TEAL_LIGHT},
    0 1.5em 5em rgba(0, 0, 0, 0.5);
  font-size: calc(2.5em * var(--gp-scale, 1));
`

const titleCss = css`
  text-align: center;
  font-size: 1.5em;
  font-weight: 700;
  color: ${GOLD_LIGHT};
  margin-bottom: 1em;
`

/* ── Grid layout: 3 columns ── */

const headerRowCss = css`
  display: grid;
  grid-template-columns: 7em 1fr 1fr;
  padding: 0 0.5em 0.5em;
  border-bottom: 1px solid ${GOLD}15;
  margin-bottom: 0.3em;
`

const colLabelCss = css`
  font-size: 0.8em;
  color: ${CREAM_DIM};
  display: flex;
  align-items: center;
`

const colPlayerCss = css`
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${CREAM_DIM};
  text-align: center;
`

const colCellCss = css`
  text-align: center;
  font-size: 1.1em;
`

const rowCss = (i: number) => css`
  display: grid;
  grid-template-columns: 7em 1fr 1fr;
  align-items: center;
  padding: 0.45em 0.5em;
  border-radius: 0.3em;
  ${i % 2 === 0 && `background: rgba(255, 255, 255, 0.02);`}
`

const rowValCss = (won: boolean, lost: boolean) => css`
  font-size: 1.2em;
  font-weight: ${won ? '700' : '400'};
  color: ${won ? GOLD_LIGHT : lost ? '#807060' : CREAM_DIM};
  ${lost && css`
    text-decoration: line-through;
    text-decoration-color: #90786888;
  `}
`

const cardCountCss = css`
  font-size: 0.7em;
  color: ${CREAM_DIM};
`

/* ── Scoring lines ── */

const sectionExplainCss = css`
  text-align: center;
  font-size: 0.7em;
  color: ${CREAM_DIM};
  font-style: italic;
  margin-top: 0.8em;
`

const sectionTitleCss = css`
  font-size: 0.75em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${GOLD_LIGHT};
  text-align: center;
  margin: 0.6em 0 0.4em;
  border-top: 1px solid ${GOLD}18;
  padding-top: 0.6em;
`

const scoreRowCss = css`
  display: grid;
  grid-template-columns: 7em 1fr 1fr;
  align-items: center;
  padding: 0.3em 0.5em;
`

const scoreValCss = (highlight: boolean) => css`
  font-weight: ${highlight ? '700' : '400'};
  color: ${highlight ? GOLD_LIGHT : '#504840'};
`

/* ── Total ── */

const totalRowCss = css`
  display: grid;
  grid-template-columns: 7em 1fr 1fr;
  align-items: center;
  padding: 0.6em 0.5em 0.3em;
  margin-top: 0.3em;
  border-top: 1px solid ${GOLD}22;
`

const totalValCss = (isLeader: boolean) => css`
  font-size: 1.5em;
  font-weight: 800;
  color: ${isLeader ? GOLD_LIGHT : '#504840'};
`

/* ── Footer ── */

const mountainCss = css`
  text-align: center;
  margin-top: 1.2em;
  font-size: 0.8em;
  color: ${CREAM_DIM};
  font-style: italic;
`

const actionCss = css`
  display: flex;
  justify-content: center;
  margin-top: 1em;
`

const btnCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.5em 2em;
  min-width: 14em;
  font-size: 1em;
  border-radius: 0.4em;
  border: 1px solid ${GOLD}55;
  background: ${GOLD}18;
  color: ${GOLD_LIGHT};
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: background 0.15s;
  &:hover {
    background: ${GOLD}30;
  }
`

const waitingCss = css`
  color: ${CREAM_DIM};
  font-style: italic;
  font-size: 0.85em;
`

const minimizeBtnCss = css`
  position: absolute;
  top: 0.6em;
  right: 0.6em;
  width: 1.6em;
  height: 1.6em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
  font-weight: 700;
  border-radius: 50%;
  border: 1px solid ${GOLD}33;
  background: ${GOLD}15;
  color: ${CREAM_DIM};
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${GOLD}30;
    color: ${GOLD_LIGHT};
    border-color: ${GOLD}55;
  }
`

const hiddenCss = css`
  visibility: hidden;
  pointer-events: none;
`

const fabCss = css`
  position: fixed;
  bottom: 1.5em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  padding: 0.6em 1.5em;
  font-size: calc(2em * var(--gp-scale, 1));
  border-radius: 2em;
  border: 1.5px solid ${GOLD}55;
  background: linear-gradient(145deg, ${TEAL}, ${TEAL_DEEP});
  color: ${GOLD_LIGHT};
  cursor: pointer;
  letter-spacing: 0.04em;
  box-shadow: 0 0.3em 1.5em rgba(0, 0, 0, 0.4);
  transition: all 0.2s ease;
  &:hover {
    background: linear-gradient(145deg, ${TEAL_LIGHT}, ${TEAL});
    border-color: ${GOLD}88;
    box-shadow: 0 0.3em 2em rgba(200, 152, 40, 0.15);
  }
`
