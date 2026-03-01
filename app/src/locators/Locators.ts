import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { Locator } from '@gamepark/react-game'
import { alphaPowerDeckLocator } from './AlphaPowerDeckLocator'
import { alphaPowerDisplayLocator } from './AlphaPowerDisplayLocator'
import { mountainAreaLocator } from './MountainAreaLocator'
import { playerMountainLocator } from './PlayerMountainLocator'
import { playerAidLocator } from './PlayerAidLocator'
import { playerAlphaPowerLocator } from './PlayerAlphaPowerLocator'
import { wolfDeckLocator } from './WolfDeckLocator'
import { loneWolfDeckLocator } from './LoneWolfDeckLocator'
import { playerHandLocator } from './PlayerHandLocator'
import { playAreaLocator } from './PlayAreaLocator'
import { wonCardsLocator } from './WonCardsLocator'
import { cardValueZoneLocator } from './CardValueZoneLocator'
import { cardEffectZoneLocator } from './CardEffectZoneLocator'
import { cardMoonZoneLocator } from './CardMoonZoneLocator'

export const Locators: Partial<Record<LocationType, Locator<PlayerColor, MaterialType, LocationType>>> = {
  [LocationType.WolfDeck]: wolfDeckLocator,
  [LocationType.LoneWolfDeck]: loneWolfDeckLocator,
  [LocationType.PlayerHand]: playerHandLocator,
  [LocationType.PlayerAidArea]: playerAidLocator,
  [LocationType.AlphaPowerArea]: alphaPowerDisplayLocator,
  [LocationType.AlphaPowerDeck]: alphaPowerDeckLocator,
  [LocationType.PlayArea]: playAreaLocator,
  [LocationType.MountainArea]: mountainAreaLocator,
  [LocationType.PlayerAlphaPower]: playerAlphaPowerLocator,
  [LocationType.PlayerMountain]: playerMountainLocator,
  [LocationType.WonCards]: wonCardsLocator,
  [LocationType.CardValueZone]: cardValueZoneLocator,
  [LocationType.CardEffectZone]: cardEffectZoneLocator,
  [LocationType.CardMoonZone]: cardMoonZoneLocator
}
