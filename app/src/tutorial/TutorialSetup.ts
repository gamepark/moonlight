import { AlphaPowerCard } from '@gamepark/moonlight/material/AlphaPowerCard'
import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { MountainToken } from '@gamepark/moonlight/material/MountainToken'
import { PlayerAidCard } from '@gamepark/moonlight/material/PlayerAidCard'
import { darkWolfCards, isLoneWolf, lightWolfCards, WolfCard } from '@gamepark/moonlight/material/WolfCard'
import { MoonlightOptions } from '@gamepark/moonlight/MoonlightOptions'
import { MoonlightRules } from '@gamepark/moonlight/MoonlightRules'
import { Memory } from '@gamepark/moonlight/rules/Memory'
import { RuleId } from '@gamepark/moonlight/rules/RuleId'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { MaterialGameSetup } from '@gamepark/rules-api'

export class TutorialSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, MoonlightOptions> {
  Rules = MoonlightRules

  setupMaterial(_options: MoonlightOptions) {
    // Light player: deterministic hand + deck order
    this.setupTutorialPlayer(PlayerColor.Light,
      [WolfCard.LightWolf1, WolfCard.LightWolfMoon2, WolfCard.LightWolf3],
      [WolfCard.LightWolf5, WolfCard.LightWolfMoon4, WolfCard.LightWolf2, WolfCard.LightWolfMoon3, WolfCard.LightWolfMoon1, WolfCard.LightWolf4]
    )

    // Dark player: deterministic hand + deck order
    this.setupTutorialPlayer(PlayerColor.Dark,
      [WolfCard.DarkWolf1, WolfCard.DarkWolfMoon2, WolfCard.DarkWolf3],
      [WolfCard.DarkWolf5, WolfCard.DarkWolfMoon4, WolfCard.DarkWolf2, WolfCard.DarkWolfMoon3, WolfCard.DarkWolfMoon1, WolfCard.DarkWolf4]
    )

    // Alpha powers (no shuffle)
    this.material(MaterialType.AlphaPowerCard).createItems(
      [AlphaPowerCard.AlphaPower1, AlphaPowerCard.AlphaPower3, AlphaPowerCard.AlphaPower5, AlphaPowerCard.AlphaPower7].map(card => ({
        id: card,
        location: { type: LocationType.AlphaPowerArea }
      }))
    )
    this.material(MaterialType.AlphaPowerCard).createItems(
      [AlphaPowerCard.AlphaPower2, AlphaPowerCard.AlphaPower4, AlphaPowerCard.AlphaPower6, AlphaPowerCard.AlphaPower8].map(card => ({
        id: card,
        location: { type: LocationType.AlphaPowerDeck }
      }))
    )

    // Mountains
    for (const player of [PlayerColor.Light, PlayerColor.Dark]) {
      this.material(MaterialType.MountainToken).createItem({
        id: player === PlayerColor.Light ? MountainToken.LightBottom : MountainToken.DarkBottom,
        location: { type: LocationType.MountainArea, player, x: 0 }
      })
      this.material(MaterialType.MountainToken).createItem({
        id: player === PlayerColor.Light ? MountainToken.LightTop : MountainToken.DarkTop,
        location: { type: LocationType.MountainArea, player, x: 1 }
      })
    }
  }

  start() {
    this.memorize(Memory.Round, 1)
    this.memorize(Memory.FirstPlayer, PlayerColor.Light)
    this.startPlayerTurn(RuleId.PlaceCard, PlayerColor.Light)
  }

  private setupTutorialPlayer(player: PlayerColor, handCards: WolfCard[], deckCards: WolfCard[]) {
    this.material(MaterialType.WolfCard).createItems(
      handCards.map(card => ({
        id: { front: card, back: player },
        location: { type: LocationType.PlayerHand, player }
      }))
    )

    // Deck: last item created = highest index = first to draw
    this.material(MaterialType.WolfCard).createItems(
      deckCards.map(card => ({
        id: { front: card, back: player },
        location: { type: LocationType.WolfDeck, player }
      }))
    )

    // Lone wolves
    const loneWolves = (player === PlayerColor.Light ? lightWolfCards : darkWolfCards).filter(isLoneWolf)
    this.material(MaterialType.WolfCard).createItems(
      loneWolves.map(card => ({
        id: { front: card, back: player },
        location: { type: LocationType.LoneWolfDeck, player }
      }))
    )

    // Player aid
    this.material(MaterialType.PlayerAid).createItem({
      id: player === PlayerColor.Dark ? PlayerAidCard.DarkAid : PlayerAidCard.LightAid,
      location: { type: LocationType.PlayerAidArea, player }
    })
  }
}
