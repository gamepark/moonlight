import { PlayAreaHelper } from '@gamepark/moonlight/rules/helper/PlayAreaHelper'
import { PlaceCardRule } from '@gamepark/moonlight/rules/PlaceCardRule'
import { Memory } from '@gamepark/moonlight/rules/Memory'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { Locator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialRules } from '@gamepark/rules-api'
import { wolfCardDescription } from '../material/WolfCardDescription'
import { PlayAreaDescription } from './description/PlayAreaDescription'

class PlayAreaLocator extends Locator {
  getLocations(context: MaterialContext) {
    const { rules, player } = context
    const ruleId = rules.game.rule?.id
    if (rules.game.rule?.player !== player) return super.getLocations(context)

    const isPlacement = ruleId === RuleId.PlaceCard || ruleId === RuleId.PlaceSecondCard
    const isMovePilePlace = ruleId === RuleId.MovePile
      && (rules as MaterialRules).remind(Memory.MovePilePhase) === 'place'

    if (isPlacement || isMovePilePlace) {
      const helper = new PlayAreaHelper(rules.game)

      let spaces: Location[]

      if (isMovePilePlace) {
        spaces = helper.availableSpaces()
      } else {
        const rule = new PlaceCardRule(rules.game)
        spaces = rule.availableSpaces
      }

      // Only show ground-level drop areas (z=0) to avoid revealing stacking targets
      // Stacking drop areas appear automatically during drag from legal moves
      return spaces.filter(space => (space.z ?? 0) === 0)
    }
    return super.getLocations(context)
  }

  getCoordinates(location: Location, _context: MaterialContext) {
    const helper = new PlayAreaHelper(_context.rules.game)
    const boundaries = helper.outerSquareBoundaries

    const cellW = wolfCardDescription.width + 0.5
    const cellH = wolfCardDescription.height + 0.5

    const centerX = (boundaries.xMin + boundaries.xMax) / 2
    const centerY = (boundaries.yMin + boundaries.yMax) / 2

    return {
      x: (location.x! - centerX) * cellW,
      y: (location.y! - centerY) * cellH,
      z: (location.z ?? 0) * 0.5
    }
  }

  getHoverTransform = () => {
    return ['translateZ(10em)', 'scale(2)']
  }

  locationDescription = new PlayAreaDescription()
}

export const playAreaLocator = new PlayAreaLocator()
