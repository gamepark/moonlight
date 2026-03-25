import { PlayerAidCard } from '@gamepark/moonlight/material/PlayerAidCard'
import { PlayerAidDescription } from './PlayerAidDescription'
import AidDarkFR from '../images/aid/fr/AidDarkFR.jpg'
import AidLightFR from '../images/aid/fr/AidLightFR.jpg'

class FrenchPlayerAidDescription extends PlayerAidDescription {
  images = {
    [PlayerAidCard.LightAid]: AidLightFR,
    [PlayerAidCard.DarkAid]: AidDarkFR
  }
}

export const frenchPlayerAidDescription = new FrenchPlayerAidDescription()
