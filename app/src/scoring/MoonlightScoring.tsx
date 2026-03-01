/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { Memory } from '@gamepark/moonlight/rules/Memory'
import { ScoringDescription, ScoringValue } from '@gamepark/react-game'
import { Trans } from 'react-i18next'

type RoundHistoryEntry = { round: number; winner: PlayerColor | undefined }

type ScoringKey = { round: number }

export class MoonlightScoring implements ScoringDescription<PlayerColor, MoonlightRules, ScoringKey> {
  getScoringKeys(rules: MoonlightRules): ScoringKey[] {
    const history = (rules as any).remind(Memory.RoundHistory) as RoundHistoryEntry[] | undefined
    if (!history || history.length === 0) return []
    return history.map(entry => ({ round: entry.round }))
  }

  getScoringHeader(key: ScoringKey, _rules: MoonlightRules): ScoringValue {
    return <Trans i18nKey="scoring.round" defaults="Round {n}" values={{ n: key.round }} />
  }

  getScoringPlayerData(key: ScoringKey, player: PlayerColor, rules: MoonlightRules): ScoringValue | null {
    const history = (rules as any).remind(Memory.RoundHistory) as RoundHistoryEntry[] | undefined
    if (!history) return null
    const entry = history.find(e => e.round === key.round)
    if (!entry) return null
    if (entry.winner === undefined) {
      return <span css={tieCss}>&mdash;</span>
    }
    if (entry.winner === player) {
      return <span css={winCss}>{'\u2714'}</span>
    }
    return null
  }
}

const winCss = css`
  color: #c89828;
  font-size: 1.3em;
`

const tieCss = css`
  color: #a09878;
  font-size: 1.1em;
`
