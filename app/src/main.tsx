import { css } from '@emotion/react'
import { MoonlightOptionsSpec } from '@gamepark/moonlight/MoonlightOptions'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { MoonlightSetup } from '@gamepark/moonlight/MoonlightSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { MoonlightLogs } from './logs/MoonlightLogs'
import { Material } from './material/Material'
import { MoonlightScoring } from './scoring/MoonlightScoring'
import { MoonlightTutorial } from './tutorial/Tutorial'

const theme = {
  root: {
    fontFamily: 'Raleway'
  },
  dialog: {
    backgroundColor: '#152e2e',
    color: '#e0dcc0'
  },
  buttons: css`
    background: rgba(200, 152, 40, 0.15);
    color: #e0dcc0;
    border: 1px solid rgba(200, 152, 40, 0.4);
    border-radius: 0.4em;
    padding: 0.3em 0.8em;
    &:hover {
      background: rgba(200, 152, 40, 0.3);
    }
  `
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="moonlight"
      Rules={MoonlightRules}
      optionsSpec={MoonlightOptionsSpec}
      GameSetup={MoonlightSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
      scoring={new MoonlightScoring()}
      logs={new MoonlightLogs()}
      tutorial={new MoonlightTutorial()}
      theme={theme}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
