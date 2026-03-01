import { ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { playerAidLocator } from './PlayerAidLocator'

class PlayerAlphaPowerLocator extends ListLocator {
  gap = { x: 7 }

  getCoordinates(location: Location, context: MaterialContext) {
    const { rules, player } = context
    const isLeft = location.player === (player ?? rules.players[0])
    const coordinates = playerAidLocator.getCoordinates(location, context)
    coordinates.x += isLeft ? -8 : 8
    coordinates.y = 0
    coordinates.z = 0
    return coordinates
  }

  getHoverTransform(item: MaterialItem, context: ItemContext) {
    const isLeft = item.location?.player === (context.player ?? context.rules.players[0])
    return ['translateZ(10em)', isLeft ? 'translateX(25%)' : 'translateX(-25%)', 'scale(2)']
  }
}

export const playerAlphaPowerLocator = new PlayerAlphaPowerLocator()
