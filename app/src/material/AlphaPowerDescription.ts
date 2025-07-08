import { AlphaPowerCard } from '@gamepark/moonlight/material/AlphaPowerCard'
import { CardDescription } from '@gamepark/react-game'
import AlphaPowerEN1 from '../images/alpha/en/AlphaPowerEN1.jpg'
import AlphaPowerEN2 from '../images/alpha/en/AlphaPowerEN2.jpg'
import AlphaPowerEN3 from '../images/alpha/en/AlphaPowerEN3.jpg'
import AlphaPowerEN4 from '../images/alpha/en/AlphaPowerEN4.jpg'
import AlphaPowerEN5 from '../images/alpha/en/AlphaPowerEN5.jpg'
import AlphaPowerEN6 from '../images/alpha/en/AlphaPowerEN6.jpg'
import AlphaPowerEN7 from '../images/alpha/en/AlphaPowerEN7.jpg'
import AlphaPowerEN8 from '../images/alpha/en/AlphaPowerEN8.jpg'
import AlphaBack from '../images/alpha/AlphaBack.jpg'

class AlphaPowerCardDescription extends CardDescription {
  backImage = AlphaBack
  images = {
    [AlphaPowerCard.AlphaPower1]: AlphaPowerEN1,
    [AlphaPowerCard.AlphaPower2]: AlphaPowerEN2,
    [AlphaPowerCard.AlphaPower3]: AlphaPowerEN3,
    [AlphaPowerCard.AlphaPower4]: AlphaPowerEN4,
    [AlphaPowerCard.AlphaPower5]: AlphaPowerEN5,
    [AlphaPowerCard.AlphaPower6]: AlphaPowerEN6,
    [AlphaPowerCard.AlphaPower7]: AlphaPowerEN7,
    [AlphaPowerCard.AlphaPower8]: AlphaPowerEN8
  }
}

export const alphaPowerCardDescription = new AlphaPowerCardDescription()
