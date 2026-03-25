import { PlayAreaHelper } from '@gamepark/moonlight/rules/helper/PlayAreaHelper'
import { PlaceCardRule } from '@gamepark/moonlight/rules/PlaceCardRule'
import { Memory } from '@gamepark/moonlight/rules/Memory'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { GridLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialItem, MaterialRules } from '@gamepark/rules-api'
import { wolfCardDescription } from '../material/WolfCardDescription'
import { PlayAreaDescription } from './description/PlayAreaDescription'

class PlayAreaLocator extends GridLocator {
  gap = { x: wolfCardDescription.width + 0.5, y: wolfCardDescription.height + 0.5, z: 0.5 }

  getBoundaries(_location: Location, context: MaterialContext) {
    const helper = new PlayAreaHelper(context.rules.game)
    return helper.outerSquareBoundaries
  }

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

      return spaces.filter(space => (space.z ?? 0) === 0)
    }
    return super.getLocations(context)
  }

  getHoverTransform(item: MaterialItem, context: ItemContext) {
    if (item.id?.front === undefined) return []
    const boundaries = new PlayAreaHelper(context.rules.game).outerSquareBoundaries
    if ((item.location.y ?? 0) >= boundaries.yMax) {
      return ['translateZ(10em)', 'translateY(-40%)', 'scale(2)']
    }
    return ['translateZ(10em)', 'scale(2)']
  }

  locationDescription = new PlayAreaDescription()
}

export const playAreaLocator = new PlayAreaLocator()
