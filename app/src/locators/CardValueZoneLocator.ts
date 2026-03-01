import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { DropAreaDescription, Locator } from '@gamepark/react-game'

class CardValueZoneLocator extends Locator {
  parentItemType = MaterialType.WolfCard
  positionOnParent = { x: 59, y: 10 }
  locationDescription = new DropAreaDescription({ width: 1.4, height: 1.4, borderRadius: 0.7 })
}

export const cardValueZoneLocator = new CardValueZoneLocator()
