import { getEnumValues } from '@gamepark/rules-api'

export enum AlphaPowerCard {
  AlphaPower1 = 101,
  AlphaPower2 = 102,
  AlphaPower3 = 103,
  AlphaPower4 = 104,
  AlphaPower5 = 105,
  AlphaPower6 = 106,
  AlphaPower7 = 107,
  AlphaPower8 = 108
}

export const alphaPowerCards = getEnumValues(AlphaPowerCard)
