import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { HandLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialRules } from '@gamepark/rules-api'

class PlayerHandLocator extends HandLocator {
  getCoordinates(location: Location, context: MaterialContext) {
    const { rules, player } = context
    const hasWonCards = (rules as MaterialRules).material(MaterialType.WolfCard)
      .location(LocationType.WonCards).player(location.player).length > 0
    const y = hasWonCards ? 21 : 14
    if (location.player === (player ?? rules.players[0])) {
      return { x: -30, y, z: 0 }
    }
    return { x: 30, y, z: 0 }
  }
}

export const playerHandLocator = new PlayerHandLocator()
