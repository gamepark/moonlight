import { getEnumValues } from '@gamepark/rules-api'
import { PlayerColor } from '../PlayerColor'

export type CardId = { front?: WolfCard, back: PlayerColor }

export enum WolfCard {
  LightWolf1 = 101,
  LightWolf2 = 102,
  LightWolf3 = 103,
  LightWolf4 = 104,
  LightWolf5 = 105,
  LightWolfMoon1 = 111,
  LightWolfMoon2 = 112,
  LightWolfMoon3 = 113,
  LightWolfMoon4 = 114,
  LightLoneWolf1 = 121,
  LightLoneWolf2 = 122,
  LightLoneWolf4 = 124,
  LightLoneWolf6 = 126,
  DarkWolf1 = 201,
  DarkWolf2 = 202,
  DarkWolf3 = 203,
  DarkWolf4 = 204,
  DarkWolf5 = 205,
  DarkWolfMoon1 = 211,
  DarkWolfMoon2 = 212,
  DarkWolfMoon3 = 213,
  DarkWolfMoon4 = 214,
  DarkLoneWolf1 = 221,
  DarkLoneWolf2 = 222,
  DarkLoneWolf4 = 224,
  DarkLoneWolf6 = 226
}

// Wolves with a value of 3 comes in 2 copies each
export const getWolves = () => getEnumValues(WolfCard).concat(getEnumValues(WolfCard).filter((wolf) => wolfValue(wolf) === 3))
export const lightWolfCards = getWolves().filter((card) => card < WolfCard.DarkWolf1)
export const darkWolfCards = getWolves().filter((card) => card >= WolfCard.DarkWolf1)

export enum WolfEffect {
  CornerTriplesValue = 1,
  BonusPoint
}

export const wolfColor = (wolf: WolfCard): PlayerColor => Math.floor(wolf / 100)
export const wolfValue = (wolf: WolfCard) => wolf % 10
export const isLoneWolf = (wolf: WolfCard) => wolf % 100 > 20

const wolfMoonsMap: Partial<Record<WolfCard, number>> = {
  [WolfCard.LightWolfMoon1]: 1,
  [WolfCard.LightWolfMoon2]: 1,
  [WolfCard.LightWolfMoon3]: 1,
  [WolfCard.LightWolfMoon4]: 1,
  [WolfCard.DarkWolfMoon1]: 1,
  [WolfCard.DarkWolfMoon2]: 1,
  [WolfCard.DarkWolfMoon3]: 1,
  [WolfCard.DarkWolfMoon4]: 1,
  [WolfCard.LightLoneWolf1]: 2,
  [WolfCard.LightLoneWolf2]: 1,
  [WolfCard.DarkLoneWolf1]: 2,
  [WolfCard.DarkLoneWolf2]: 1
}

export const wolfMoons = (wolf: WolfCard): number => wolfMoonsMap[wolf] ?? 0

const wolfEffectMap: Partial<Record<WolfCard, WolfEffect>> = {
  [WolfCard.LightWolf1]: WolfEffect.CornerTriplesValue,
  [WolfCard.LightWolfMoon1]: WolfEffect.CornerTriplesValue,
  [WolfCard.LightLoneWolf1]: WolfEffect.CornerTriplesValue,
  [WolfCard.LightLoneWolf2]: WolfEffect.CornerTriplesValue,
  [WolfCard.LightWolf3]: WolfEffect.BonusPoint,
  [WolfCard.LightWolfMoon3]: WolfEffect.BonusPoint,
  [WolfCard.DarkWolf1]: WolfEffect.CornerTriplesValue,
  [WolfCard.DarkWolfMoon1]: WolfEffect.CornerTriplesValue,
  [WolfCard.DarkLoneWolf1]: WolfEffect.CornerTriplesValue,
  [WolfCard.DarkLoneWolf2]: WolfEffect.CornerTriplesValue,
  [WolfCard.DarkWolf3]: WolfEffect.BonusPoint,
  [WolfCard.DarkWolfMoon3]: WolfEffect.BonusPoint
}

export const wolfEffect = (wolf: WolfCard): WolfEffect | undefined => wolfEffectMap[wolf]
