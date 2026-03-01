import { ItemContext, PileLocator } from '@gamepark/react-game'
import { MaterialItem } from '@gamepark/rules-api'

class MountainAreaLocator extends PileLocator {
  coordinates = { x: 0, y: -40 }

  placeItem(item: MaterialItem, context: ItemContext): string[] {
    return [...super.placeItem(item, context), 'scale(0)']
  }
}

export const mountainAreaLocator = new MountainAreaLocator()
