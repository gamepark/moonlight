import {
  CompetitiveScore,
  hideFront,
  hideFrontToOthers,
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
import { ChooseAlphaPowerRule } from './rules/ChooseAlphaPowerRule'
import { ChooseLoneWolfRule } from './rules/ChooseLoneWolfRule'
import { DrawCardRule } from './rules/DrawCardRule'
import { EndOfRoundRule } from './rules/EndOfRoundRule'
import { EndOfTurnRule } from './rules/EndOfTurnRule'
import { Memory } from './rules/Memory'
import { MovePileRule } from './rules/MovePileRule'
import { NewRoundRule } from './rules/NewRoundRule'
import { PlaceCardRule } from './rules/PlaceCardRule'
import { PlaceSecondCardRule } from './rules/PlaceSecondCardRule'
import { PrepareRoundRule } from './rules/PrepareRoundRule'
import { RuleId } from './rules/RuleId'
import { ViewRoundResultsRule } from './rules/ViewRoundResultsRule'

/**
 * This class implements the rules of the board game.
 * It must follow Game Park "Rules" API so that the Game Park server can enforce the rules.
 */
export class MoonlightRules
  extends SecretMaterialRules<PlayerColor, MaterialType, LocationType>
  implements
    TimeLimit<MaterialGame<PlayerColor, MaterialType, LocationType>, MaterialMove<PlayerColor, MaterialType, LocationType>, PlayerColor>,
    CompetitiveScore<MaterialGame<PlayerColor, MaterialType, LocationType>, MaterialMove<PlayerColor, MaterialType, LocationType>, PlayerColor>
{
  rules = {
    [RuleId.DrawCard]: DrawCardRule,
    [RuleId.PlaceCard]: PlaceCardRule,
    [RuleId.EndOfTurn]: EndOfTurnRule,
    [RuleId.EndOfRound]: EndOfRoundRule,
    [RuleId.ChooseLoneWolf]: ChooseLoneWolfRule,
    [RuleId.ChooseAlphaPower]: ChooseAlphaPowerRule,
    [RuleId.NewRound]: NewRoundRule,
    [RuleId.PrepareRound]: PrepareRoundRule,
    [RuleId.PlaceSecondCard]: PlaceSecondCardRule,
    [RuleId.MovePile]: MovePileRule,
    [RuleId.ViewRoundResults]: ViewRoundResultsRule
  }

  locationsStrategies = {
    [MaterialType.WolfCard]: {
      [LocationType.WolfDeck]: new PositiveSequenceStrategy(),
      [LocationType.LoneWolfDeck]: new PositiveSequenceStrategy(),
      [LocationType.PlayerHand]: new PositiveSequenceStrategy(),
      [LocationType.PlayArea]: new StackingStrategy(),
      [LocationType.WonCards]: new PositiveSequenceStrategy()
    },
    [MaterialType.AlphaPowerCard]: {
      [LocationType.AlphaPowerDeck]: new PositiveSequenceStrategy(),
      [LocationType.AlphaPowerArea]: new PositiveSequenceStrategy(),
      [LocationType.PlayerAlphaPower]: new PositiveSequenceStrategy()
    },
    [MaterialType.MountainToken]: {
      [LocationType.MountainArea]: new PositiveSequenceStrategy()
    }
  }

  hidingStrategies = {
    [MaterialType.WolfCard]: {
      [LocationType.WolfDeck]: hideFront,
      [LocationType.PlayerHand]: hideFrontToOthers
    },
    [MaterialType.AlphaPowerCard]: {
      [LocationType.AlphaPowerDeck]: hideItemId
    }
  }

  giveTime(): number {
    return 60
  }

  getScore(player: PlayerColor): number {
    const key = player === PlayerColor.Light ? Memory.LightMountains : Memory.DarkMountains
    return this.remind<number>(key) ?? 0
  }

  getTieBreaker(_tieBreaker: number, _player: PlayerColor): number | undefined {
    return undefined
  }
}
