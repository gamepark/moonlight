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

// --- Declarative power effect definitions ---

export interface AlphaPowerEffect {
  type: 'ambush' | 'stamina'
  // Stamina effects (always active)
  handSize?: number         // Override starting hand size (default 3)
  protectsValue1?: boolean  // Value 1 wolves can't be covered
  extraMoons?: number       // Bonus moons in scoring
  winsAllTies?: boolean     // Win all tie situations (rows, moons, round)
  // Ambush effects (one-time use per round)
  stackingSkip?: boolean    // Can skip a value when stacking (value+2)
  doublePlace?: boolean     // Place 2 cards in one turn
  coverSameValue?: boolean  // Can cover same value (not just +1)
  movePile?: boolean        // Can move a pile + place value 2
}

export const alphaPowerEffects: Record<AlphaPowerCard, AlphaPowerEffect> = {
  [AlphaPowerCard.AlphaPower1]: { type: 'ambush', stackingSkip: true },
  [AlphaPowerCard.AlphaPower2]: { type: 'stamina', handSize: 5 },
  [AlphaPowerCard.AlphaPower3]: { type: 'stamina', protectsValue1: true },
  [AlphaPowerCard.AlphaPower4]: { type: 'ambush', doublePlace: true },
  [AlphaPowerCard.AlphaPower5]: { type: 'ambush', coverSameValue: true },
  [AlphaPowerCard.AlphaPower6]: { type: 'stamina', extraMoons: 2 },
  [AlphaPowerCard.AlphaPower7]: { type: 'stamina', winsAllTies: true },
  [AlphaPowerCard.AlphaPower8]: { type: 'ambush', movePile: true }
}

export type AmbushEffectKey = 'stackingSkip' | 'doublePlace' | 'coverSameValue' | 'movePile'

export const isAmbushPower = (power: AlphaPowerCard) => alphaPowerEffects[power].type === 'ambush'
export const isStaminaPower = (power: AlphaPowerCard) => alphaPowerEffects[power].type === 'stamina'
