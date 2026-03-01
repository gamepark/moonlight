import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class WolfDeckLocator extends DeckLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const { rules, player } = context
    if (location.player === (player ?? rules.players[0])) {
      return { x: -29, y: 0, z: 0 }
    }

    return { x: 29, y: 0, z: 0 }
  }
}

export const wolfDeckLocator = new WolfDeckLocator()
