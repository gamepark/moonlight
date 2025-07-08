import { getEnumValues } from '@gamepark/rules-api'

export enum PlayerAidCard {
  LightAid = 101,
  DarkAid = 201
}
export const playerAidCards = getEnumValues(PlayerAidCard)
