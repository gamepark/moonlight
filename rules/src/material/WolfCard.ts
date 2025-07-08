import { getEnumValues } from '@gamepark/rules-api'
import { PlayerColor } from '../PlayerColor'

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
export const lightWolfCards = getEnumValues(WolfCard).filter((card) => card < WolfCard.DarkWolf1)
export const darkWolfCards = getEnumValues(WolfCard).filter((card) => card >= WolfCard.DarkWolf1)

export enum WolfEffect {
  CornerTriplesValue = 1,
  BonusPoint
}

export const wolfColor = (wolf: WolfCard): PlayerColor => Math.floor(wolf / 100)
export const wolfValue = (wolf: WolfCard) => wolf % 10
export const isLoneWolf = (wolf: WolfCard) => wolf % 100 > 20

export const wolfMoons = (wolf: WolfCard) => {
  if (isLoneWolf(wolf)) {
    switch (wolfValue(wolf)) {
      case 1:
        return 2
      case 2:
        return 1
      default:
        return 0
    }
  } else {
    return wolf % 100 > 10 ? 1 : 0
  }
}

export const wolfEffect = (wolf: WolfCard) => {
  switch (wolf % 100) {
    case 1:
    case 21:
    case 22:
      return WolfEffect.CornerTriplesValue
    case 3:
      return WolfEffect.BonusPoint
    default:
      return
  }
}
