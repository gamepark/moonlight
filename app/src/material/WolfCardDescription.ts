import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { CardDescription } from '@gamepark/react-game'
import { WolfCard } from '@gamepark/moonlight/material/WolfCard'
import { WolfCardHelp } from './help/WolfCardHelp'
import WolfDarkBack from '../images/wolf/dark/WolfDarkBack.jpg'
import WolfLightBack from '../images/wolf/light/WolfLightBack.jpg'
import WolfLight1 from '../images/wolf/light/WolfLight1.jpg'
import WolfLight2 from '../images/wolf/light/WolfLight2.jpg'
import WolfLight3 from '../images/wolf/light/WolfLight3.jpg'
import WolfLight4 from '../images/wolf/light/WolfLight4.jpg'
import WolfLight5 from '../images/wolf/light/WolfLight5.jpg'
import WolfLight1Moon from '../images/wolf/light/WolfLight1Moon.jpg'
import WolfLight2Moon from '../images/wolf/light/WolfLight2Moon.jpg'
import WolfLight3Moon from '../images/wolf/light/WolfLight3Moon.jpg'
import WolfLight4Moon from '../images/wolf/light/WolfLight4Moon.jpg'
import LoneWolfLight1 from '../images/wolf/light/LoneWolfLight1.jpg'
import LoneWolfLight2 from '../images/wolf/light/LoneWolfLight2.jpg'
import LoneWolfLight4 from '../images/wolf/light/LoneWolfLight4.jpg'
import LoneWolfLight6 from '../images/wolf/light/LoneWolfLight6.jpg'
import WolfDark1 from '../images/wolf/dark/WolfDark1.jpg'
import WolfDark2 from '../images/wolf/dark/WolfDark2.jpg'
import WolfDark3 from '../images/wolf/dark/WolfDark3.jpg'
import WolfDark4 from '../images/wolf/dark/WolfDark4.jpg'
import WolfDark5 from '../images/wolf/dark/WolfDark5.jpg'
import WolfDark1Moon from '../images/wolf/dark/WolfDark1Moon.jpg'
import WolfDark2Moon from '../images/wolf/dark/WolfDark2Moon.jpg'
import WolfDark3Moon from '../images/wolf/dark/WolfDark3Moon.jpg'
import WolfDark4Moon from '../images/wolf/dark/WolfDark4Moon.jpg'
import LoneWolfDark1 from '../images/wolf/dark/LoneWolfDark1.jpg'
import LoneWolfDark2 from '../images/wolf/dark/LoneWolfDark2.jpg'
import LoneWolfDark4 from '../images/wolf/dark/LoneWolfDark4.jpg'
import LoneWolfDark6 from '../images/wolf/dark/LoneWolfDark6.jpg'

class WolfCardDescription extends CardDescription {
  help = WolfCardHelp


  backImages = {
    [PlayerColor.Dark]: WolfDarkBack,
    [PlayerColor.Light]: WolfLightBack
  }

  images = {
    // LIGHT
    [WolfCard.LightWolf1]: WolfLight1,
    [WolfCard.LightWolf2]: WolfLight2,
    [WolfCard.LightWolf3]: WolfLight3,
    [WolfCard.LightWolf4]: WolfLight4,
    [WolfCard.LightWolf5]: WolfLight5,
    [WolfCard.LightWolfMoon1]: WolfLight1Moon,
    [WolfCard.LightWolfMoon2]: WolfLight2Moon,
    [WolfCard.LightWolfMoon3]: WolfLight3Moon,
    [WolfCard.LightWolfMoon4]: WolfLight4Moon,
    [WolfCard.LightLoneWolf1]: LoneWolfLight1,
    [WolfCard.LightLoneWolf2]: LoneWolfLight2,
    [WolfCard.LightLoneWolf4]: LoneWolfLight4,
    [WolfCard.LightLoneWolf6]: LoneWolfLight6,
    // DARK
    [WolfCard.DarkWolf1]: WolfDark1,
    [WolfCard.DarkWolf2]: WolfDark2,
    [WolfCard.DarkWolf3]: WolfDark3,
    [WolfCard.DarkWolf4]: WolfDark4,
    [WolfCard.DarkWolf5]: WolfDark5,
    [WolfCard.DarkWolfMoon1]: WolfDark1Moon,
    [WolfCard.DarkWolfMoon2]: WolfDark2Moon,
    [WolfCard.DarkWolfMoon3]: WolfDark3Moon,
    [WolfCard.DarkWolfMoon4]: WolfDark4Moon,
    [WolfCard.DarkLoneWolf1]: LoneWolfDark1,
    [WolfCard.DarkLoneWolf2]: LoneWolfDark2,
    [WolfCard.DarkLoneWolf4]: LoneWolfDark4,
    [WolfCard.DarkLoneWolf6]: LoneWolfDark6
  }
}

export const wolfCardDescription = new WolfCardDescription()
