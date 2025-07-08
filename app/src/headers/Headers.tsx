/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { ComponentType } from 'react'
import { DrawCardHeader } from './DrawCardHeader'
import { PlaceCardHeader } from './PlaceCardHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.DrawCard]: DrawCardHeader,
  [RuleId.PlaceCard]: PlaceCardHeader
}
