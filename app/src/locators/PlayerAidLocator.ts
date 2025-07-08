import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { wolfDeckLocator } from './WolfDeckLocator'

class PlayerAidLocator extends DeckLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const coordinates = wolfDeckLocator.getCoordinates(location, context)
    coordinates.x += 8
    return coordinates
  }
}

export const playerAidLocator = new PlayerAidLocator()
