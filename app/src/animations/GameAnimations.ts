import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType, isStartSimultaneousRule } from '@gamepark/rules-api'

export const gameAnimations = new MaterialGameAnimations()

// Drawing a card
gameAnimations
  .when()
  .rule(RuleId.DrawCard)
  .move(isMoveItemType(MaterialType.WolfCard))
  .duration(0.5)

// Placing a card on the play area
gameAnimations
  .when()
  .rule(RuleId.PlaceCard)
  .move(isMoveItemType(MaterialType.WolfCard))
  .duration(0.4)

// Placing second card (AP4)
gameAnimations
  .when()
  .rule(RuleId.PlaceSecondCard)
  .move(isMoveItemType(MaterialType.WolfCard))
  .duration(0.4)

// Moving a pile (AP8)
gameAnimations
  .when()
  .rule(RuleId.MovePile)
  .move(isMoveItemType(MaterialType.WolfCard))
  .duration(0.3)

// Choosing a lone wolf
gameAnimations
  .when()
  .rule(RuleId.ChooseLoneWolf)
  .move(isMoveItemType(MaterialType.WolfCard))
  .duration(0.6)

// Choosing an alpha power
gameAnimations
  .when()
  .rule(RuleId.ChooseAlphaPower)
  .move(isMoveItemType(MaterialType.AlphaPowerCard))
  .duration(0.6)

// New round cleanup (fast)
gameAnimations
  .when()
  .rule(RuleId.NewRound)
  .move(isMoveItemType(MaterialType.WolfCard))
  .duration(0.2)

// Prepare round dealing
gameAnimations
  .when()
  .rule(RuleId.PrepareRound)
  .move(isMoveItemType(MaterialType.WolfCard))
  .duration(0.3)

gameAnimations
.configure((move, context) => isStartSimultaneousRule(move) && move.id === RuleId.ViewRoundResults && context.player === undefined)
.postMove()
.duration(0.2)