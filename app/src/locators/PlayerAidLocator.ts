import { DeckLocator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { wolfDeckLocator } from './WolfDeckLocator'

class PlayerAidLocator extends DeckLocator {
  getHoverTransform = () => ['translateZ(10em)', 'scale(1.5)']

  getCoordinates(location: Location, context: MaterialContext) {
    const { rules, player } = context
    const isLeft = location.player === (player ?? rules.players[0])
    const coordinates = wolfDeckLocator.getCoordinates(location, context)
    coordinates.x += isLeft ? -8 : 8
    return coordinates
  }
}

export const playerAidLocator = new PlayerAidLocator()
