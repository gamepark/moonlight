import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { HandLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialGame, MaterialRules } from '@gamepark/rules-api'

const CARD_ANATOMY_STEP = 2

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

  getGapMaxAngle(location: Location, context: MaterialContext): number {
    const tutorial = (context.rules.game as MaterialGame).tutorial
    if (tutorial?.step === CARD_ANATOMY_STEP) return 4
    return super.getGapMaxAngle(location, context)
  }

  getMaxAngle(location: Location, context: MaterialContext): number {
    const tutorial = (context.rules.game as MaterialGame).tutorial
    if (tutorial?.step === CARD_ANATOMY_STEP) return 16
    return super.getMaxAngle(location, context)
  }
}

export const playerHandLocator = new PlayerHandLocator()
