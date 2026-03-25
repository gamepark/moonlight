import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { alphaPowerCardDescription } from './AlphaPowerDescription'
import { frenchAlphaPowerCardDescription } from './FrenchAlphaPowerDescription'
import { frenchPlayerAidDescription } from './FrenchPlayerAidDescription'
import { mountainTokenDescription } from './MountainTokenDescription'
import { playerAidDescription } from './PlayerAidDescription'
import { wolfCardDescription } from './WolfCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.WolfCard]: wolfCardDescription,
  [MaterialType.PlayerAid]: playerAidDescription,
  [MaterialType.AlphaPowerCard]: alphaPowerCardDescription,
  [MaterialType.MountainToken]: mountainTokenDescription
}

export const materialI18n: Record<string, Partial<Record<MaterialType, MaterialDescription>>> = {
  fr: {
    [MaterialType.AlphaPowerCard]: frenchAlphaPowerCardDescription,
    [MaterialType.PlayerAid]: frenchPlayerAidDescription
  }
}
