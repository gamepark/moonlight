import { MoonlightOptionsSpecV2 } from '@gamepark/moonlight/MoonlightOptions'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { MoonlightSetup } from '@gamepark/moonlight/MoonlightSetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { gameAnimations } from './animations/GameAnimations'
import { App } from './App'
import { Locators } from './locators/Locators'
import { MoonlightLogs } from './logs/MoonlightLogs'
import { Material, materialI18n } from './material/Material'
import { MoonlightScoring } from './scoring/MoonlightScoring'
import { theme } from './theme'
import { MoonlightTutorial } from './tutorial/Tutorial'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="moonlight"
      Rules={MoonlightRules}
      optionsSpec={MoonlightOptionsSpecV2}
      GameSetup={MoonlightSetup}
      material={Material}
      materialI18n={materialI18n}
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
