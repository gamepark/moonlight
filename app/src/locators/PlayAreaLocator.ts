import { PlayAreaHelper } from '@gamepark/moonlight/rules/helper/PlayAreaHelper'
import { PlaceCardRule } from '@gamepark/moonlight/rules/PlaceCardRule'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location } from '@gamepark/rules-api'
import { wolfCardDescription } from '../material/WolfCardDescription'
import { PlayAreaDescription } from './description/PlayAreaDescription'

class PlayAreaLocator extends Locator {
  getLocations(context: MaterialContext) {
    const { rules, player } = context
    if (rules.game.rule?.id === RuleId.PlaceCard && rules.game.rule.player === player) {
      return new PlaceCardRule(rules.game).availableSpaces
    }
    return super.getLocations(context)
  }

  getCoordinates(location: Location, _context: MaterialContext) {
    const boundaries = new PlayAreaHelper(_context.rules.game).outerSquareBoundaries
    const { x, y } = { x: 0, y: 0 }
    const computedX = location.x! - (boundaries.xMin + boundaries.xMax) / 2
    const computedY = location.y! - (boundaries.yMin + boundaries.yMax) / 2
    return {
      x: x + computedX * (wolfCardDescription.width + 0.5),
      y: y + computedY * (wolfCardDescription.height + 0.5),
      z: (location.z ?? 0) * 0.5
    }
  }

  getHoverTransform = () => {
    return ['translateZ(10em)', 'scale(2)']
  }

  locationDescription = new PlayAreaDescription()
}

export const playAreaLocator = new PlayAreaLocator()
