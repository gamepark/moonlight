import { ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { wolfDeckLocator } from './WolfDeckLocator'

class LoneWolfDeckLocator extends ListLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const coordinates = wolfDeckLocator.getCoordinates(location, context)
    coordinates.y -= 10

    return coordinates
  }

  gap = { x: 2 }

  getItemCoordinates(item: MaterialItem, context: ItemContext) {
    const coordinates = super.getItemCoordinates(item, context)
    if (item.selected) coordinates.y! -= 1
    return coordinates
  }

  getHoverTransform = () => ['translateZ(10em)', 'scale(2)']
}

export const loneWolfDeckLocator = new LoneWolfDeckLocator()
