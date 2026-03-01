import { PlayerAidCard } from '@gamepark/moonlight/material/PlayerAidCard'
import { CardDescription } from '@gamepark/react-game'
import { PlayerAidHelp } from './help/PlayerAidHelp'
import AidDarkEN from '../images/aid/en/AidDarkEN.jpg'
import AidLightEN from '../images/aid/en/AidLightEN.jpg'

class PlayerAidDescription extends CardDescription {
  help = PlayerAidHelp

  images = {
    // LIGHT
    [PlayerAidCard.LightAid]: AidLightEN,
    // DARK
    [PlayerAidCard.DarkAid]: AidDarkEN
  }
}

export const playerAidDescription = new PlayerAidDescription()
