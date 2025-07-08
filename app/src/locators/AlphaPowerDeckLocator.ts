import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class AlphaPowerDeckLocator extends DeckLocator {
  getCoordinates(_location: Location, _context: MaterialContext) {
    return { x: -10, y: -25, z: 0 }
  }
  gap = { x: -0.03, y: -0.03 }
}
export const alphaPowerDeckLocator = new AlphaPowerDeckLocator()
