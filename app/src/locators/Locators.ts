import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { Locator } from '@gamepark/react-game'
import { alphaPowerDeckLocator } from './AlphaPowerDeckLocator'
import { alphaPowerDisplayLocator } from './AlphaPowerDisplayLocator'
import { playerAidLocator } from './PlayerAidLocator'
import { wolfDeckLocator } from './WolfDeckLocator'
import { loneWolfDeckLocator } from './LoneWolfDeckLocator'
import { playerHandLocator } from './PlayerHandLocator'
import { playAreaLocator } from './PlayAreaLocator'

export const Locators: Partial<Record<LocationType, Locator<PlayerColor, MaterialType, LocationType>>> = {
  [LocationType.WolfDeck]: wolfDeckLocator,
  [LocationType.LoneWolfDeck]: loneWolfDeckLocator,
  [LocationType.PlayerHand]: playerHandLocator,
  [LocationType.PlayerAidArea]: playerAidLocator,
  [LocationType.AlphaPowerArea]: alphaPowerDisplayLocator,
  [LocationType.AlphaPowerDeck]: alphaPowerDeckLocator,
  [LocationType.PlayArea]: playAreaLocator
}
