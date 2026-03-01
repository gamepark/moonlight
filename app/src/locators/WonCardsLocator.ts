import { HandLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'

class WonCardsLocatorClass extends HandLocator {
  maxAngle = 8

  getCoordinates(location: Location, context: MaterialContext) {
    const { rules, player } = context
    const isLeft = location.player === (player ?? rules.players[0])
    return {
      x: isLeft ? -30 : 30,
      y: 11,
      z: 5
    }
  }
}

export const wonCardsLocator = new WonCardsLocatorClass()
