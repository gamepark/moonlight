import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { and, isRule, MaterialGameAnimations } from '@gamepark/react-game'
import { isMoveItemType, isStartSimultaneousRule } from '@gamepark/rules-api'

export const gameAnimations = new MaterialGameAnimations()

// Drawing a card
gameAnimations
  .configure(and(isRule(RuleId.DrawCard), isMoveItemType(MaterialType.WolfCard)))
  .duration(500)

// Placing a card on the play area
gameAnimations
  .configure(and(isRule(RuleId.PlaceCard), isMoveItemType(MaterialType.WolfCard)))
  .duration(400)

// Placing second card (AP4)
gameAnimations
  .configure(and(isRule(RuleId.PlaceSecondCard), isMoveItemType(MaterialType.WolfCard)))
  .duration(400)

// Moving a pile (AP8)
gameAnimations
  .configure(and(isRule(RuleId.MovePile), isMoveItemType(MaterialType.WolfCard)))
  .duration(300)

// Choosing a lone wolf
gameAnimations
  .configure(and(isRule(RuleId.ChooseLoneWolf), isMoveItemType(MaterialType.WolfCard)))
  .duration(600)

// Choosing an alpha power
gameAnimations
  .configure(and(isRule(RuleId.ChooseAlphaPower), isMoveItemType(MaterialType.AlphaPowerCard)))
  .duration(600)

// New round cleanup (fast)
gameAnimations
  .configure(and(isRule(RuleId.NewRound), isMoveItemType(MaterialType.WolfCard)))
  .duration(200)

// Prepare round dealing
gameAnimations
  .configure(and(isRule(RuleId.PrepareRound), isMoveItemType(MaterialType.WolfCard)))
  .duration(300)

// Beat between the last card of the round and the results panel, for spectators only.
gameAnimations
  .configure((move, context) => isStartSimultaneousRule(move) && move.id === RuleId.ViewRoundResults && context.player === undefined)
  .postMove()
  .duration(200)
