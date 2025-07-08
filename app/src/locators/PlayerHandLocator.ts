import { HandLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { wolfCardDescription } from '../material/WolfCardDescription'
import { wolfDeckLocator } from './WolfDeckLocator'

class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const coordinates = wolfDeckLocator.getCoordinates(location, context)
    coordinates.x += wolfCardDescription.width / 2 + 0.5
    coordinates.y += wolfCardDescription.height + 2
    return coordinates
  }
}

export const playerHandLocator = new PlayerHandLocator()
