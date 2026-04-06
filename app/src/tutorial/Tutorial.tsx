/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { CardId, WolfCard } from '@gamepark/moonlight/material/WolfCard'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import MountainLight from '../images/tokens/MountainBottomLight.png'
import { TutorialSetup } from './TutorialSetup'

const me = PlayerColor.Light
const opponent = PlayerColor.Dark

export class MoonlightTutorial extends MaterialTutorial<PlayerColor, MaterialType, LocationType> {
  version = 8
  options = { players: [{ id: me }, { id: opponent }] }
  setup = new TutorialSetup()
  players = [{ id: me }, { id: opponent, name: 'Fenrir' }]

  steps: TutorialStep<PlayerColor, MaterialType, LocationType>[] = [
    // 1. Lore intro — no focus, centered popup
    {
      popup: {
        text: () => <Trans i18nKey="tuto.lore-intro" components={{ b: <strong /> }} />
      }
    },

    // 2. Show hand — focus hand, popup above
    // Hand: [Wolf1, WolfMoon2, Wolf3]
    {
      popup: {
        text: () => <Trans i18nKey="tuto.hand" components={{ b: <strong /> }} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.PlayerHand).player(me)],
        margin: { top: 15, bottom: 2, left: 2, right: 2 },
        highlight: true
      })
    },

    // 3. Place Wolf1 — focus Wolf1 card + drop zone, popup above
    // Hand: [Wolf1, WolfMoon2, Wolf3]
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place-first" components={{ b: <strong /> }} />,
        position: { y: -18 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).id<CardId>((id) => id.front === WolfCard.LightWolf1)],
        locations: [{ type: LocationType.PlayArea, x: 0, y: 0 }],
        margin: { top: 15, bottom: 2, left: 5, right: 5 },
        highlight: true
      }),
      move: {
        player: me,
        filter: (move, game) =>
          isMoveItemType(MaterialType.WolfCard)(move) &&
          move.location.type === LocationType.PlayArea &&
          move.location.x === 0 &&
          move.location.y === 0 &&
          game.items[MaterialType.WolfCard]![move.itemIndex]?.id?.front === WolfCard.LightWolf1
      }
    },

    // 4. Opponent places DarkWolf1 at (1,0) — auto, no popup
    {
      move: {
        player: opponent,
        filter: (move, game) => {
          if (!isMoveItemType(MaterialType.WolfCard)(move)) return false
          if (move.location.type !== LocationType.PlayArea) return false
          if (move.location.x !== 1 || move.location.y !== 0) return false
          const items = game.items[MaterialType.WolfCard]!
          return items[move.itemIndex]?.id?.front === WolfCard.DarkWolf1
        }
      }
    },

    // 5. Explain panorama — focus play area (2 cards), popup below
    // Play area: Wolf1(0,0) + DarkWolf1(1,0)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.panorama" components={{ b: <strong /> }} />,
        position: { y: 15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.PlayArea)],
        margin: { top: 2, bottom: 15, left: 5, right: 5 },
        highlight: true
      })
    },

    // 6. Explain card effects — focus x3 icon on both value-1 cards in panorama, popup above
    // Play area: Wolf1(0,0) + DarkWolf1(1,0)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.effects" components={{ b: <strong /> }} />,
        position: { y: 15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.WolfCard).id<CardId>((id) => id.front === WolfCard.LightWolf1),
          this.material(game, MaterialType.WolfCard).id<CardId>((id) => id.front === WolfCard.DarkWolf1)
        ],
        locations: [
          {
            type: LocationType.CardEffectZone,
            parent: this.material(game, MaterialType.WolfCard)
              .id<CardId>((id) => id.front === WolfCard.LightWolf1)
              .getIndex()
          },
          {
            type: LocationType.CardEffectZone,
            parent: this.material(game, MaterialType.WolfCard)
              .id<CardId>((id) => id.front === WolfCard.DarkWolf1)
              .getIndex()
          }
        ],
        margin: { top: 2, bottom: 15, left: 2, right: 2 },
        highlight: true
      })
    },

    // 7. Explain bonus point icon — focus +1 icon on Wolf3 in hand, popup above
    // Hand: [WolfMoon2, Wolf3, Wolf4]
    {
      popup: {
        text: () => <Trans i18nKey="tuto.bonus-point" components={{ b: <strong/> }} />,
        position: { x: -20, y: -10 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.WolfCard).id<CardId>((id) => id.front === WolfCard.LightWolf3)
        ],
        locations: [
          {
            type: LocationType.CardEffectZone,
            parent: this.material(game, MaterialType.WolfCard)
              .id<CardId>((id) => id.front === WolfCard.LightWolf3)
              .getIndex()
          }
        ],
        margin: { top: 15, bottom: 2, left: 2, right: 2 },
        highlight: true
      })
    },

    // 8. Place Wolf3 — focus Wolf3 card + play area, popup above
    // Hand: [WolfMoon2, Wolf3, Wolf4]
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place-second" components={{ b: <strong /> }} />,
        position: { x: -40, y: -15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.WolfCard).id<CardId>((id) => id.front === WolfCard.LightWolf3),
          this.material(game, MaterialType.WolfCard).location(LocationType.PlayArea)
        ],
        margin: { top: 10, bottom: 2, left: 5, right: 5 },
        highlight: true
      }),
      move: {
        player: me,
        filter: (move, game) =>
          isMoveItemType(MaterialType.WolfCard)(move) &&
          move.location.type === LocationType.PlayArea &&
          (move.location.z ?? 0) === 0 &&
          game.items[MaterialType.WolfCard]![move.itemIndex]?.id?.front === WolfCard.LightWolf3
      }
    },

    // 8. Opponent places DarkWolfMoon2 — auto, no popup
    {
      move: {
        player: opponent,
        filter: (move, game) => {
          if (!isMoveItemType(MaterialType.WolfCard)(move)) return false
          if (move.location.type !== LocationType.PlayArea) return false
          const items = game.items[MaterialType.WolfCard]!
          return items[move.itemIndex]?.id?.front === WolfCard.DarkWolfMoon2
        }
      }
    },

    // 9. Explain stacking — focus play area only, popup below
    // Hand: [WolfMoon2, Wolf4, WolfMoon1] (Wolf3 posé, WolfMoon1 pioché)
    {
      popup: {
        text: () => <Trans i18nKey="tuto.stacking-explain" components={{ b: <strong /> }} />,
        position: { y: 15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.PlayArea)],
        margin: { top: 2, bottom: 15, left: 5, right: 5 },
        highlight: true
      })
    },

    // 10. Stack WolfMoon2 on DarkWolf1 — focus WolfMoon2 + play area, popup above
    {
      popup: {
        text: () => <Trans i18nKey="tuto.stacking-do" components={{ b: <strong /> }} />,
        position: { y: -18 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.WolfCard).id<CardId>((id) => id.front === WolfCard.LightWolfMoon2),
          this.material(game, MaterialType.WolfCard).location(LocationType.PlayArea)
        ],
        margin: { top: 18, bottom: 2, left: 5, right: 5 },
        highlight: true
      }),
      move: {
        player: me,
        filter: (move) =>
          isMoveItemType(MaterialType.WolfCard)(move) &&
          move.location.type === LocationType.PlayArea &&
          move.location.x === 1 &&
          move.location.y === 0 &&
          (move.location.z ?? 0) > 0
      }
    },

    // 11. Scoring: round end condition — focus play area, popup below
    {
      popup: {
        text: () => <Trans i18nKey="tuto.scoring" components={{ b: <strong /> }} />,
        position: { y: 15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.PlayArea)],
        margin: { top: 2, bottom: 15, left: 5, right: 5 },
        highlight: true
      })
    },

    // 12. Scoring: moon majority — focus moon icons on all moon cards in hand, popup above
    // Hand: [Wolf4, WolfMoon1, WolfMoon3]
    {
      popup: {
        text: () => <Trans i18nKey="tuto.scoring-moons" components={{ b: <strong /> }} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.WolfCard).id<CardId>((id) => id.front === WolfCard.LightWolfMoon1),
          this.material(game, MaterialType.WolfCard).id<CardId>((id) => id.front === WolfCard.LightWolfMoon3)
        ],
        locations: [
          {
            type: LocationType.CardMoonZone,
            parent: this.material(game, MaterialType.WolfCard)
              .id<CardId>((id) => id.front === WolfCard.LightWolfMoon1)
              .getIndex()
          },
          {
            type: LocationType.CardMoonZone,
            parent: this.material(game, MaterialType.WolfCard)
              .id<CardId>((id) => id.front === WolfCard.LightWolfMoon3)
              .getIndex()
          }
        ],
        margin: { top: 15, bottom: 2, left: 2, right: 2 },
        highlight: true
      })
    },

    // 13. Scoring: row battles — focus play area, popup below
    {
      popup: {
        text: () => <Trans i18nKey="tuto.scoring-rows" components={{ b: <strong /> }} />,
        position: { y: 15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.PlayArea)],
        margin: { top: 2, bottom: 15, left: 5, right: 5 },
        highlight: true
      })
    },

    // 14. Scoring: round winner — no focus
    {
      popup: {
        text: () => <Trans i18nKey="tuto.scoring-winner" components={{ b: <strong /> }} />
      }
    },

    // Win condition — mountain image in popup, no focus
    {
      popup: {
        text: () => (
          <Trans
            i18nKey="tuto.win-and-beyond"
            components={{ b: <strong />, mountain: <img src={MountainLight} alt="" style={{ height: '2em', verticalAlign: 'middle' }} /> }}
          />
        )
      }
    },

    // Lone wolves — focus lone wolf deck, popup above
    {
      popup: {
        text: () => <Trans i18nKey="tuto.lone-wolves" components={{ b: <strong /> }} />,
        position: { x: 30 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.WolfCard).location(l => l.type === LocationType.LoneWolfDeck && l.player === me)
        ],
        margin: { top: 2, bottom: 2, left: 2, right: 20 },
        highlight: true
      })
    },

    // Alpha powers — focus alpha power area, popup above
    {
      popup: {
        text: () => <Trans i18nKey="tuto.alpha-powers" components={{ b: <strong /> }} />,
        position: { y: 20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.AlphaPowerCard).location(LocationType.AlphaPowerArea)
        ],
        margin: { top: 2, bottom: 2, left: 2, right: 2 },
        highlight: true
      })
    },

    // 13. Good luck — no focus, centered popup
    {
      popup: {
        text: () => <Trans i18nKey="tuto.good-luck" components={{ b: <strong /> }} />
      }
    }
  ]
}
