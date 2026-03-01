import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { alphaPowerCardDescription } from './AlphaPowerDescription'
import { mountainTokenDescription } from './MountainTokenDescription'
import { playerAidDescription } from './PlayerAidDescription'
import { wolfCardDescription } from './WolfCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.WolfCard]: wolfCardDescription,
  [MaterialType.PlayerAid]: playerAidDescription,
  [MaterialType.AlphaPowerCard]: alphaPowerCardDescription,
  [MaterialType.MountainToken]: mountainTokenDescription
}
