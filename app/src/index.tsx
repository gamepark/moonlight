/** @jsxImportSource @emotion/react */
import { MoonlightOptionsSpec } from '@gamepark/moonlight/MoonlightOptions'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { MoonlightSetup } from '@gamepark/moonlight/MoonlightSetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { gameAnimations } from './animations/GameAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider
      game="moonlight"
      Rules={MoonlightRules}
      optionsSpec={MoonlightOptionsSpec}
      GameSetup={MoonlightSetup}
      material={Material}
      locators={Locators}
      animations={gameAnimations}
    >
      <App />
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
