import { AlphaPowerCard } from '@gamepark/moonlight/material/AlphaPowerCard'
import { AlphaPowerCardDescription } from './AlphaPowerDescription'
import AlphaPowerFR1 from '../images/alpha/fr/AlphaPowerFR1.jpg'
import AlphaPowerFR2 from '../images/alpha/fr/AlphaPowerFR2.jpg'
import AlphaPowerFR3 from '../images/alpha/fr/AlphaPowerFR3.jpg'
import AlphaPowerFR4 from '../images/alpha/fr/AlphaPowerFR4.jpg'
import AlphaPowerFR5 from '../images/alpha/fr/AlphaPowerFR5.jpg'
import AlphaPowerFR6 from '../images/alpha/fr/AlphaPowerFR6.jpg'
import AlphaPowerFR7 from '../images/alpha/fr/AlphaPowerFR7.jpg'
import AlphaPowerFR8 from '../images/alpha/fr/AlphaPowerFR8.jpg'

class FrenchAlphaPowerCardDescription extends AlphaPowerCardDescription {
  images = {
    [AlphaPowerCard.AlphaPower1]: AlphaPowerFR1,
    [AlphaPowerCard.AlphaPower2]: AlphaPowerFR2,
    [AlphaPowerCard.AlphaPower3]: AlphaPowerFR3,
    [AlphaPowerCard.AlphaPower4]: AlphaPowerFR4,
    [AlphaPowerCard.AlphaPower5]: AlphaPowerFR5,
    [AlphaPowerCard.AlphaPower6]: AlphaPowerFR6,
    [AlphaPowerCard.AlphaPower7]: AlphaPowerFR7,
    [AlphaPowerCard.AlphaPower8]: AlphaPowerFR8
  }
}

export const frenchAlphaPowerCardDescription = new FrenchAlphaPowerCardDescription()
