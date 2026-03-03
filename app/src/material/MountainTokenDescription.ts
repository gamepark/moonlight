import { MountainToken } from '@gamepark/moonlight/material/MountainToken'
import { TokenDescription } from '@gamepark/react-game'
import { MountainTokenHelp } from './help/MountainTokenHelp'
import MountainBottomDark from '../images/tokens/MountainBottomDark.png'
import MountainBottomLight from '../images/tokens/MountainBottomLight.png'
import MountainTopDark from '../images/tokens/MountainTopDark.png'
import MountainTopLight from '../images/tokens/MountainTopLight.png'

class MountainTokenDescription extends TokenDescription {
  help = MountainTokenHelp
  width = 6
  height = 3.9
  borderRadius = 0.5

  getSize(itemId: MountainToken) {
    const isTop = itemId === MountainToken.LightTop || itemId === MountainToken.DarkTop
    return { width: 6, height: isTop ? 4.74 : 3.9 }
  }

  transparency = true

  images = {
    [MountainToken.LightBottom]: MountainBottomLight,
    [MountainToken.LightTop]: MountainTopLight,
    [MountainToken.DarkBottom]: MountainBottomDark,
    [MountainToken.DarkTop]: MountainTopDark
  }
}

export const mountainTokenDescription = new MountainTokenDescription()
