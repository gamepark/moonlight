import { css } from '@emotion/react'

import { StyledPlayerPanel, usePlayers } from '@gamepark/react-game'
import { createPortal } from 'react-dom'
import MountainBottomDark from '../images/tokens/MountainBottomDark.png'
import MountainBottomLight from '../images/tokens/MountainBottomLight.png'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'

export const PlayerPanels = () => {
  const players = usePlayers({ sortFromMe: true })
  const root = document.getElementById('root')
  if (!root) {
    return null
  }

  return createPortal(
    <>
      {players.map((player, index) => {
        return (
          <StyledPlayerPanel
            key={player.id}
            backgroundImage={player.id === PlayerColor.Light ? MountainBottomLight : MountainBottomDark}
            player={player}
            css={[panelPosition, index === 0 ? leftPlayer : rightPlayer]}
          />
        )
      })}
    </>,
    root
  )
}
const panelPosition = css`
  position: absolute;
  top: ${8.5}em;
  width: 27em;
`

const leftPlayer = css`
  left: 2em;
`

const rightPlayer = css`
  right: 2em;
`
