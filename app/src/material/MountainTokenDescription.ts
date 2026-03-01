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
  height = 4
  borderRadius = 0.5

  transparency = true

  images = {
    [MountainToken.LightBottom]: MountainBottomLight,
    [MountainToken.LightTop]: MountainTopLight,
    [MountainToken.DarkBottom]: MountainBottomDark,
    [MountainToken.DarkTop]: MountainTopDark
  }
}

export const mountainTokenDescription = new MountainTokenDescription()
