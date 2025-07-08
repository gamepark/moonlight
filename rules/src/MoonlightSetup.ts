import { MaterialGameSetup } from '@gamepark/rules-api'
import { alphaPowerCards } from './material/AlphaPowerCard'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerAidCard } from './material/PlayerAidCard'
import { darkWolfCards, isLoneWolf, lightWolfCards } from './material/WolfCard'
import { MoonlightOptions } from './MoonlightOptions'
import { MoonlightRules } from './MoonlightRules'
import { PlayerColor } from './PlayerColor'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class MoonlightSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, MoonlightOptions> {
  Rules = MoonlightRules

  setupMaterial(_options: MoonlightOptions) {
    this.setupPlayers()
    this.setupAlphaPowers()
  }

  start() {
    this.startPlayerTurn(RuleId.DrawCard, this.players[0])
  }

  setupPlayers() {
    this.setupPlayer(PlayerColor.Dark)
    this.setupPlayer(PlayerColor.Light)
  }

  setupAlphaPowers() {
    const cards = alphaPowerCards.map((card) => ({
      id: card,
      location: {
        type: LocationType.AlphaPowerDeck
      }
    }))

    this.material(MaterialType.AlphaPowerCard).createItems(cards)
    this.material(MaterialType.AlphaPowerCard).shuffle()

    this.material(MaterialType.AlphaPowerCard).deck().deal(
      {
        type: LocationType.AlphaPowerArea
      },
      4
    )
  }

  setupPlayer(player: PlayerColor) {
    const cards = player === PlayerColor.Dark ? darkWolfCards : lightWolfCards
    this.material(MaterialType.WolfCard).createItems(
      cards
        .filter((item) => !isLoneWolf(item))
        .map((g) => ({
          id: {
            back: player,
            front: g
          },
          location: {
            type: LocationType.WolfDeck,
            player: player
          }
        }))
    )

    this.material(MaterialType.WolfCard).createItems(
      cards
        .filter((item) => isLoneWolf(item))
        .map((g) => ({
          id: {
            back: player,
            front: g
          },
          location: {
            type: LocationType.LoneWolfDeck,
            player: player
          }
        }))
    )

    this.material(MaterialType.PlayerAid).createItem({
      id: player === PlayerColor.Dark ? PlayerAidCard.DarkAid : PlayerAidCard.LightAid,
      location: {
        type: LocationType.PlayerAidArea,
        player: player
      }
    })

    this.material(MaterialType.WolfCard).location(LocationType.WolfDeck).locationId(player).shuffle()
  }
}
