import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { HandLocator, ItemContext, MaterialContext } from '@gamepark/react-game'
import { Location, MaterialGame, MaterialItem, MaterialRules } from '@gamepark/rules-api'

class PlayerHandLocator extends HandLocator {
  game?: MaterialGame
  shifted = false

  getCoordinates(location: Location, context: MaterialContext) {
    const { rules, player } = context
    const y = this.shifted ? 21 : 14
    if (location.player === (player ?? rules.players[0])) {
      return { x: -30, y, z: 0 }
    }
    return { x: 30, y, z: 0 }
  }

  getPositionDependencies(location: Location, context: MaterialContext): unknown {
    if (context.rules.game !== this.game) {
      this.refreshShifted(context.rules as MaterialRules)
      this.game = context.rules.game
    }
    return [super.getPositionDependencies(location, context), this.shifted]
  }

  refreshShifted(rules: MaterialRules) {
    const ruleId = rules.game.rule?.id
    if (ruleId === RuleId.EndOfRound || ruleId === RuleId.ViewRoundResults) {
      this.shifted = true
    } else {
      const hasWonCards = rules.material(MaterialType.WolfCard).location(LocationType.WonCards).length > 0
      this.shifted = hasWonCards
    }
  }

  getHoverTransform(item: MaterialItem, context: ItemContext): string[] {
    return ['translateZ(10em)', `rotateZ(${-this.getItemRotateZ(item, context)}${this.rotationUnit})`, 'translateY(-40%)', 'scale(2)']
  }
}

export const playerHandLocator = new PlayerHandLocator()
