import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { playerAlphaPowerLocator } from './PlayerAlphaPowerLocator'

class PlayerMountainLocator extends Locator {
  getCoordinates(location: Location, context: MaterialContext) {
    const coordinates = playerAlphaPowerLocator.getCoordinates(location, context)
    // Bottom (x:0) then top (x:1) stacked above, overlapping
    const x = location.x ?? 0
    coordinates.y -= 10 + x * 2.77
    coordinates.z = x === 0 ? 0.2 : 0.1
    return coordinates
  }
}

export const playerMountainLocator = new PlayerMountainLocator()
