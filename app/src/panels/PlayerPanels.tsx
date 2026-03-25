/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { ScoringHelper } from '@gamepark/moonlight/rules/helper/ScoringHelper'
import { StyledPlayerPanel, useGame, usePlayers, useRules } from '@gamepark/react-game'
import { MaterialGame } from '@gamepark/rules-api'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import MountainBottomDark from '../images/tokens/MountainBottomDark.png'
import MountainBottomLight from '../images/tokens/MountainBottomLight.png'
import moonLightIcon from '../images/icon/moon-light.jpg'
import moonDarkIcon from '../images/icon/moon-dark.jpg'

const playPhases = new Set([RuleId.PlaceCard, RuleId.DrawCard, RuleId.EndOfTurn, RuleId.PlaceSecondCard, RuleId.MovePile])

export const PlayerPanels = () => {
  const players = usePlayers({ sortFromMe: true })
  const rules = useRules<MoonlightRules>()
  const game = useGame<MaterialGame>()
  const currentRule = game?.rule?.id as RuleId | undefined
  const isPlayPhase = currentRule !== undefined && playPhases.has(currentRule)
  const frozenMoons = useRef<Record<number, number>>({})

  // Compute live moon counts during play phases
  const liveMoons: Record<number, number> = {}
  if (isPlayPhase && rules) {
    for (const player of players) {
      liveMoons[player.id] = new ScoringHelper(rules.game, player.id).playerMoons
    }
  }

  // Freeze the last known values when leaving play phase
  useEffect(() => {
    if (isPlayPhase) {
      frozenMoons.current = { ...liveMoons }
    } else if (currentRule === RuleId.PrepareRound || currentRule === RuleId.NewRound) {
      frozenMoons.current = {}
    }
  })

  const root = document.getElementById('root')
  if (!root) return null

  return createPortal(
    <>
      {players.map((player, index) => {
        const isLight = player.id === PlayerColor.Light
        const moonCount = isPlayPhase ? (liveMoons[player.id] ?? 0) : (frozenMoons.current[player.id] ?? 0)
        return (
          <StyledPlayerPanel
            key={player.id}
            backgroundImage={isLight ? MountainBottomLight : MountainBottomDark}
            player={player}
            counters={[{
              image: isLight ? moonLightIcon : moonDarkIcon,
              value: moonCount,
              imageCss: moonIconCss
            }]}
            css={[panelPosition, index === 0 ? leftPlayer : rightPlayer, bgBottomCss]}
          />
        )
      })}
    </>,
    root
  )
}

const panelPosition = css`
  position: absolute;
  top: 8.5em;
  width: 27em;
`

const leftPlayer = css`
  left: 2em;
`

const rightPlayer = css`
  right: 2em;
`

const bgBottomCss = css`
  background-position: bottom !important;
`

const moonIconCss = css`
  border-radius: 50%;
  transform: scale(0.85);
`
