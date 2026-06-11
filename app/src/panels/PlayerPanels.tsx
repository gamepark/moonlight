/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { Memory, RoundResultsData } from '@gamepark/moonlight/rules/Memory'
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
import tutoAvatar from '../images/icon/tuto-avatar.jpg'

const playPhases = new Set([RuleId.PlaceCard, RuleId.DrawCard, RuleId.EndOfTurn, RuleId.PlaceSecondCard, RuleId.MovePile])

// Phases where the round is over but its final moon counts must keep showing
const resultPhases = new Set([RuleId.EndOfRound, RuleId.ViewRoundResults])

export const PlayerPanels = () => {
  const players = usePlayers({ sortFromMe: true })
  const rules = useRules<MoonlightRules>()
  const game = useGame<MaterialGame>()
  const currentRule = game?.rule?.id as RuleId | undefined
  const isPlayPhase = currentRule !== undefined && playPhases.has(currentRule)
  const isResultPhase = currentRule !== undefined && resultPhases.has(currentRule)
  const isTutorial = game?.tutorial !== undefined
  const frozenMoons = useRef<Record<number, number>>({})

  // During result phases, read the authoritative final moon counts stored at round end.
  // The card that ends the round can trigger EndOfRound synchronously, so no play-phase
  // render ever captures it into frozenMoons — RoundResults is computed server-side before
  // the won cards leave the play area, so it always reflects the last card played.
  const roundResults = isResultPhase && rules ? rules.remind<RoundResultsData>(Memory.RoundResults) : undefined

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
        const resultMoons = roundResults ? (isLight ? roundResults.light.moons : roundResults.dark.moons) : undefined
        const moonCount = isPlayPhase
          ? (liveMoons[player.id] ?? 0)
          : (resultMoons ?? frozenMoons.current[player.id] ?? 0)
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
            css={[panelPosition, index === 0 ? leftPlayer : rightPlayer, bgBottomCss, isTutorial && !isLight && tutoAvatarCss]}
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

const tutoAvatarCss = css`
  & > div:first-of-type {
    visibility: hidden;
  }
  &::before {
    content: '';
    position: absolute;
    top: -0.4em;
    left: -0.3em;
    height: 6.6em;
    width: 6.6em;
    background: url(${tutoAvatar}) center / cover no-repeat;
    border: 0.3em solid #1a4040;
    border-radius: 50%;
    box-shadow: 0 0 0.4em black, inset 0 0 0.3em rgba(0, 0, 0, 0.5);
    z-index: 4;
    pointer-events: none;
  }
`
