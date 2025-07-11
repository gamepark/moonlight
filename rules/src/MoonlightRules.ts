import {
  hideFront,
  MaterialGame,
  MaterialMove,
  SecretMaterialRules,
  PositiveSequenceStrategy,
  TimeLimit,
  hideItemId,
  StackingStrategy
} from '@gamepark/rules-api'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerColor } from './PlayerColor'
import { DrawCardRule } from './rules/DrawCardRule'
import { RuleId } from './rules/RuleId'
import { PlaceCardRule } from './rules/PlaceCardRule'
import { EndOfTurnRule } from './rules/EndOfTurnRule'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class MoonlightRules
  extends SecretMaterialRules<PlayerColor, MaterialType, LocationType>
  implements TimeLimit<MaterialGame<PlayerColor, MaterialType, LocationType>, MaterialMove<PlayerColor, MaterialType, LocationType>, PlayerColor>
{
  rules = {
    [RuleId.DrawCard]: DrawCardRule,
    [RuleId.PlaceCard]: PlaceCardRule,
    [RuleId.EndOfTurn]: EndOfTurnRule
  }

  locationsStrategies = {
    [MaterialType.WolfCard]: {
      [LocationType.WolfDeck]: new PositiveSequenceStrategy(),
      [LocationType.LoneWolfDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.PlayArea]: new StackingStrategy()
    },
    [MaterialType.AlphaPowerCard]: {
      [LocationType.AlphaPowerDeck]: new PositiveSequenceStrategy(),
      [LocationType.AlphaPowerArea]: new PositiveSequenceStrategy()
    }
  }

  hidingStrategies = {
    [MaterialType.WolfCard]: {
      [LocationType.WolfDeck]: hideFront
    },
    [MaterialType.AlphaPowerCard]: {
      [LocationType.AlphaPowerDeck]: hideItemId
    }
  }

  giveTime(): number {
    return 60
  }
}
