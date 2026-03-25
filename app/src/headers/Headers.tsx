import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseAlphaPowerHeader } from './ChooseAlphaPowerHeader'
import { ChooseLoneWolfHeader } from './ChooseLoneWolfHeader'
import { DrawCardHeader } from './DrawCardHeader'
import { EndOfRoundHeader } from './EndOfRoundHeader'
import { MovePileHeader } from './MovePileHeader'
import { NewRoundHeader } from './NewRoundHeader'
import { PlaceCardHeader } from './PlaceCardHeader'
import { PlaceSecondCardHeader } from './PlaceSecondCardHeader'
import { PrepareRoundHeader } from './PrepareRoundHeader'
import { ViewRoundResultsHeader } from './ViewRoundResultsHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.PlaceCard]: PlaceCardHeader,
  [RuleId.DrawCard]: DrawCardHeader,
  [RuleId.PlaceSecondCard]: PlaceSecondCardHeader,
  [RuleId.MovePile]: MovePileHeader,
  [RuleId.EndOfRound]: EndOfRoundHeader,
  [RuleId.NewRound]: NewRoundHeader,
  [RuleId.ChooseLoneWolf]: ChooseLoneWolfHeader,
  [RuleId.ChooseAlphaPower]: ChooseAlphaPowerHeader,
  [RuleId.PrepareRound]: PrepareRoundHeader,
  [RuleId.ViewRoundResults]: ViewRoundResultsHeader
}
