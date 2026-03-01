import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseAlphaPowerHeader } from './ChooseAlphaPowerHeader'
import { ChooseLoneWolfHeader } from './ChooseLoneWolfHeader'
import { DrawCardHeader } from './DrawCardHeader'
import { MovePileHeader } from './MovePileHeader'
import { PlaceCardHeader } from './PlaceCardHeader'
import { PlaceSecondCardHeader } from './PlaceSecondCardHeader'
import { ViewRoundResultsHeader } from './ViewRoundResultsHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.PlaceCard]: PlaceCardHeader,
  [RuleId.DrawCard]: DrawCardHeader,
  [RuleId.PlaceSecondCard]: PlaceSecondCardHeader,
  [RuleId.MovePile]: MovePileHeader,
  [RuleId.ChooseLoneWolf]: ChooseLoneWolfHeader,
  [RuleId.ChooseAlphaPower]: ChooseAlphaPowerHeader,
  [RuleId.ViewRoundResults]: ViewRoundResultsHeader
}
