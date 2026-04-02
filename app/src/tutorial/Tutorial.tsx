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
        text: () => <Trans i18nKey="tuto.welcome" defaults="Welcome to <b>Moonlight</b>! Two wolf packs compete to build a panorama and dominate the mountain.\nEach turn, you place a card from your hand, then draw a new one.\nWin <b>2 mountain tokens</b> to claim victory!" components={{ b: <strong/> }} />
      }
    },

    // 2. Show hand — hand is at y=14 (bottom). Zoom on it → reserve space above for popup
    {
      popup: {
        text: () => <Trans i18nKey="tuto.hand" defaults="This is your hand. Each card has a <b>value</b> (1 to 5) and may have special icons.\nYou'll learn about them in the next step!" components={{ b: <strong/> }} />,
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
        text: () => <Trans i18nKey="tuto.card-anatomy" defaults="Look at the icons on your cards!\nThe <b>×3</b> icon (top-left) triples the card's value if placed in a corner.\nThe <b>+1</b> icon means the card scores a bonus point when you win its row.\nThe <b>moon</b> symbol counts for the moon majority bonus." components={{ b: <strong/> }} />,
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
        text: () => <Trans i18nKey="tuto.alpha-powers" defaults="These are the <b>Alpha Powers</b>. Between rounds, the loser picks one.\nThey grant special abilities: <b>Stamina</b> (always active) or <b>Ambush</b> (once per round).\nClick on a card to see its effect!" components={{ b: <strong/> }} />,
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
        text: () => <Trans i18nKey="tuto.lone-wolves" defaults="These are the <b>Lone Wolves</b>. The round winner adds one to their deck.\nThey have special values (1, 2, 4, 6) and like regular wolves, some have <b>moons</b> or the <b>×3</b> corner effect." components={{ b: <strong/> }} />,
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
        text: () => <Trans i18nKey="tuto.place-first" defaults="Place your wolf on the panorama!\nCards must be placed adjacent to existing cards, forming a grid up to a <b>4×3 or 3×4</b> rectangle.\nEach row will be a separate battle at the end of the round." components={{ b: <strong/> }} />,
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
        text: () => <Trans i18nKey="tuto.after-draw" defaults="You drew a new card from your deck.\nNow your opponent will play their turn." />
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
        text: () => <Trans i18nKey="tuto.place-second" defaults="Your opponent placed a wolf next to yours.\nPlace another card to expand the panorama." />,
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
        text: () => <Trans i18nKey="tuto.stacking" defaults="You can cover an opponent's wolf by placing a card with exactly <b>+1 value</b> on top!\nPlace your <b>Moon Wolf</b> (value 2) on the opponent's wolf (value 1) to take control of that spot." components={{ b: <strong/> }} />,
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
        text: () => <Trans i18nKey="tuto.scoring" defaults="At the end of a round, each row of the panorama is a battle: the player with the <b>highest total value</b> wins the row and recovers their visible cards.\nThe player with the most <b>moons</b> scores <b>2 bonus points</b>.\nThe round winner earns a <b>mountain token</b>." components={{ b: <strong/> }} />
      }
    },

    // 13. Win condition
    {
      popup: {
        text: () => <Trans i18nKey="tuto.win-condition" defaults="The first player to collect <b>2 mountain tokens</b> wins the game!" components={{ b: <strong/> }} />
      }
    },

    // 14. Good luck
    {
      popup: {
        text: () => <Trans i18nKey="tuto.end" defaults="You're ready to play <b>Moonlight</b>!\nBuild your panorama, win row battles, and dominate the mountain.\nGood luck!" components={{ b: <strong/> }} />
      }
    }
  ]
}
