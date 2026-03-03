import { PlayAreaHelper } from '@gamepark/moonlight/rules/helper/PlayAreaHelper'
import { PlaceCardRule } from '@gamepark/moonlight/rules/PlaceCardRule'
import { Memory } from '@gamepark/moonlight/rules/Memory'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { GridBoundaries, GridLocator, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialRules } from '@gamepark/rules-api'
import { wolfCardDescription } from '../material/WolfCardDescription'
import { PlayAreaDescription } from './description/PlayAreaDescription'

class PlayAreaLocator extends GridLocator {
  gap = { x: wolfCardDescription.width + 0.5, y: wolfCardDescription.height + 0.5, z: 0.5 }

  getBoundaries(_location: Location, context: MaterialContext): GridBoundaries | undefined {
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

  getHoverTransform = () => {
    return ['translateZ(10em)', 'scale(2)']
  }

  locationDescription = new PlayAreaDescription()
}

export const playAreaLocator = new PlayAreaLocator()
