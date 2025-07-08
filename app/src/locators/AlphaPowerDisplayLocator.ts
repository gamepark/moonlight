import { ItemContext, ListLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem } from '@gamepark/rules-api'
import { alphaPowerDeckLocator } from './AlphaPowerDeckLocator'

class AlphaPowerDisplayLocator extends ListLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const coordinates = alphaPowerDeckLocator.getCoordinates(location, context)
    coordinates.x += 10

    return coordinates
  }

  gap = { x: 7 }

  getItemCoordinates(item: MaterialItem, context: ItemContext) {
    const coordinates = super.getItemCoordinates(item, context)
    if (item.selected) coordinates.y! -= 1
    return coordinates
  }

  getHoverTransform = () => ['translateZ(10em)', 'scale(2)']
}

export const alphaPowerDisplayLocator = new AlphaPowerDisplayLocator()
