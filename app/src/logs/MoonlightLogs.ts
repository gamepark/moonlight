import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { CustomMoveType } from '@gamepark/moonlight/rules/CustomMoveType'
import { LogDescription, MoveComponentContext, MovePlayedLogDescription } from '@gamepark/react-game'
import { isCustomMoveType, isEndGame, isMoveItemType, isStartSimultaneousRule, MaterialGame, MaterialMove } from '@gamepark/rules-api'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { PlaceCardLog } from './PlaceCardLog'
import { DrawCardLog } from './DrawCardLog'
import { ChooseLoneWolfLog } from './ChooseLoneWolfLog'
import { ChooseAlphaPowerLog } from './ChooseAlphaPowerLog'
import { PassLog } from './PassLog'
import { MovePileLog } from './MovePileLog'
import { PowerUsedLog } from './PowerUsedLog'
import { RoundEndLog } from './RoundEndLog'
import { GameOverLog } from './GameOverLog'
import { entryCss, separatorCss, gameOverCss } from './logStyles'

export class MoonlightLogs implements LogDescription<MaterialMove, PlayerColor, MaterialGame<PlayerColor, MaterialType, LocationType>> {
  getMovePlayedLogDescription(
    move: MaterialMove,
    context: MoveComponentContext<MaterialMove, PlayerColor, MaterialGame<PlayerColor, MaterialType, LocationType>>
  ): MovePlayedLogDescription | undefined {
    const rule = context.game.rule?.id
    const player = context.action.playerId ?? context.game.rule?.player

    // Game over
    if (isEndGame(move)) {
      return { Component: GameOverLog, css: gameOverCss }
    }

    // Round end separator
    if (isStartSimultaneousRule(move) && move.id === RuleId.ViewRoundResults) {
      return { Component: RoundEndLog, css: separatorCss }
    }

    // Wolf card moves
    if (isMoveItemType(MaterialType.WolfCard)(move)) {
      // Card placed on play area
      if (move.location.type === LocationType.PlayArea) {
        if (rule === RuleId.MovePile) {
          const item = context.game.items?.[MaterialType.WolfCard]?.[move.itemIndex]
          if (item?.location?.type === LocationType.PlayArea) {
            return { Component: MovePileLog, player, css: entryCss(player) }
          }
          return { Component: PlaceCardLog, player, css: entryCss(player) }
        }
        if (rule === RuleId.PlaceCard || rule === RuleId.PlaceSecondCard) {
          return { Component: PlaceCardLog, player, css: entryCss(player) }
        }
      }

      // Draw card
      if (move.location.type === LocationType.PlayerHand && rule === RuleId.DrawCard) {
        return { Component: DrawCardLog, player, css: entryCss(player) }
      }

      // Choose lone wolf
      if (move.location.type === LocationType.WolfDeck && rule === RuleId.ChooseLoneWolf) {
        return { Component: ChooseLoneWolfLog, player, css: entryCss(player) }
      }
    }

    // Alpha power card moves
    if (isMoveItemType(MaterialType.AlphaPowerCard)(move)) {
      // Power used (rotation = face down)
      if (move.location.rotation === true) {
        return { Component: PowerUsedLog, player, css: entryCss(player) }
      }

      // Choose alpha power
      if (move.location.type === LocationType.PlayerAlphaPower && rule === RuleId.ChooseAlphaPower) {
        return { Component: ChooseAlphaPowerLog, player, css: entryCss(player) }
      }
    }

    // Pass
    if (isCustomMoveType(CustomMoveType.Pass)(move)) {
      return { Component: PassLog, player, css: entryCss(player) }
    }

    return undefined
  }
}
