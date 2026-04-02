/** @jsxImportSource @emotion/react */
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { WolfCard } from '@gamepark/moonlight/material/WolfCard'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { TutorialSetup } from './TutorialSetup'

const me = PlayerColor.Light
const opponent = PlayerColor.Dark

export class MoonlightTutorial extends MaterialTutorial<PlayerColor, MaterialType, LocationType> {
  version = 5
  options = { players: [{ id: me }, { id: opponent }] }
  setup = new TutorialSetup()
  players = [
    { id: me },
    { id: opponent, name: 'Fenrir' }
  ]

  steps: TutorialStep<PlayerColor, MaterialType, LocationType>[] = [
    // 1. Welcome
    {
      popup: {
        text: () => <Trans i18nKey="tuto.welcome" components={{ b: <strong/> }} />
      }
    },

    // 2. Show hand — hand is at y=14 (bottom). Zoom on it → reserve space above for popup
    {
      popup: {
        text: () => <Trans i18nKey="tuto.hand" components={{ b: <strong/> }} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.PlayerHand).player(me)],
        margin: { top: 15, bottom: 2, left: 2, right: 2 },
        highlight: true
      })
    },

    // 3. Card anatomy — focus hand + highlight icons (x3, +1, moon) via fake locations
    {
      popup: {
        text: () => <Trans i18nKey="tuto.card-anatomy" components={{ b: <strong/> }} />,
        position: { y: -15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.PlayerHand).player(me)],
        locations: [
          { type: LocationType.CardEffectZone, parent: this.material(game, MaterialType.WolfCard).id((id: any) => id.front === WolfCard.LightWolf1).getIndex() },
          { type: LocationType.CardMoonZone, parent: this.material(game, MaterialType.WolfCard).id((id: any) => id.front === WolfCard.LightWolfMoon2).getIndex() },
          { type: LocationType.CardEffectZone, parent: this.material(game, MaterialType.WolfCard).id((id: any) => id.front === WolfCard.LightWolf3).getIndex() }
        ],
        margin: { top: 15, bottom: 2, left: 2, right: 2 },
        highlight: true
      })
    },

    // 4. Show Alpha Powers — at y=-25 (top area). Zoom → reserve space below for popup
    {
      popup: {
        text: () => <Trans i18nKey="tuto.alpha-powers" components={{ b: <strong/> }} />,
        position: { y: 15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.AlphaPowerCard).location(LocationType.AlphaPowerArea)],
        margin: { top: 2, bottom: 15, left: 2, right: 2 },
        highlight: true
      })
    },

    // 5. Show Lone Wolves — at x=-37, y=-10 (top-left). Zoom → reserve space on right for popup
    {
      popup: {
        text: () => <Trans i18nKey="tuto.lone-wolves" components={{ b: <strong/> }} />,
        position: { x: 15 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.LoneWolfDeck).player(me)],
        margin: { top: 2, bottom: 2, left: 2, right: 20 },
        highlight: true
      })
    },

    // 6. Place first card — focus hand (y=14) + play area drop zone (y~0). Popup above
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place-first" components={{ b: <strong/> }} />,
        position: { y: -18 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.PlayerHand).player(me)],
        locations: [{ type: LocationType.PlayArea, x: 0, y: 0 }],
        margin: { top: 15, bottom: 2, left: 5, right: 5 },
        highlight: true
      }),
      move: {
        player: me,
        filter: (move, game) =>
          isMoveItemType(MaterialType.WolfCard)(move) &&
          move.location.type === LocationType.PlayArea &&
          move.location.x === 0 && move.location.y === 0 &&
          game.items[MaterialType.WolfCard]![move.itemIndex]?.id?.front !== WolfCard.LightWolfMoon2
      }
    },

    // 7. Draw happened automatically
    {
      popup: {
        text: () => <Trans i18nKey="tuto.after-draw" />
      }
    },

    // 8. Opponent places DarkWolf1 at (1,0)
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

    // 9. Place 2nd card — focus hand + play area cards. Popup above
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place-second" />,
        position: { y: -18 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.WolfCard).location(LocationType.PlayerHand).player(me),
          this.material(game, MaterialType.WolfCard).location(LocationType.PlayArea)
        ],
        margin: { top: 15, bottom: 2, left: 5, right: 5 },
        highlight: true
      }),
      move: {
        player: me,
        filter: (move, game) =>
          isMoveItemType(MaterialType.WolfCard)(move) &&
          move.location.type === LocationType.PlayArea &&
          (move.location.z ?? 0) === 0 &&
          game.items[MaterialType.WolfCard]![move.itemIndex]?.id?.front !== WolfCard.LightWolfMoon2
      }
    },

    // 10. Opponent places DarkWolfMoon2 somewhere (2nd card on grid)
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

    // 11. Explain stacking — play area (~y=0) + hand (y=14) = large zone. Popup above
    {
      popup: {
        text: () => <Trans i18nKey="tuto.stacking" components={{ b: <strong/> }} />,
        position: { y: -18 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.WolfCard).location(LocationType.PlayArea),
          this.material(game, MaterialType.WolfCard).location(LocationType.PlayerHand).player(me)
        ],
        margin: { top: 20, bottom: 2, left: 5, right: 5 },
        highlight: true
      }),
      move: {
        player: me,
        filter: (move) =>
          isMoveItemType(MaterialType.WolfCard)(move) &&
          move.location.type === LocationType.PlayArea &&
          move.location.x === 1 && move.location.y === 0 &&
          (move.location.z ?? 0) > 0
      }
    },

    // 12. Scoring explanation
    {
      popup: {
        text: () => <Trans i18nKey="tuto.scoring" components={{ b: <strong/> }} />
      }
    },

    // 13. Win condition
    {
      popup: {
        text: () => <Trans i18nKey="tuto.win-condition" components={{ b: <strong/> }} />
      }
    },

    // 14. Good luck
    {
      popup: {
        text: () => <Trans i18nKey="tuto.end" components={{ b: <strong/> }} />
      }
    }
  ]
}
