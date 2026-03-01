import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { DropAreaDescription, Locator } from '@gamepark/react-game'

class CardEffectZoneLocator extends Locator {
  parentItemType = MaterialType.WolfCard
  positionOnParent = { x: 15.5, y: 11 }
  locationDescription = new DropAreaDescription({ width: 1.4, height: 1.4, borderRadius: 0.7 })
}

export const cardEffectZoneLocator = new CardEffectZoneLocator()
