/** @jsxImportSource @emotion/react */
import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { WolfCard } from '@gamepark/moonlight/material/WolfCard'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isMoveItemType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { TutorialSetup } from './TutorialSetup'

const me = PlayerColor.Light
const opponent = PlayerColor.Dark

export class MoonlightTutorial extends MaterialTutorial<PlayerColor, MaterialType, LocationType> {
  version = 1
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
        text: () => <Trans i18nKey="tuto.welcome" defaults="Welcome to Moonlight! Two wolf packs compete to build a panorama and dominate the mountain. Each turn, you place a card from your hand, then draw a new one. Win 2 mountain tokens to claim victory!" />
      }
    },

    // 2. Show hand
    {
      popup: {
        text: () => <Trans i18nKey="tuto.hand" defaults="This is your hand. Each card has a value (1 to 5) and some have a moon symbol. Higher values are stronger in row battles!" />,
        position: { y: -5 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.WolfCard).location(LocationType.PlayerHand).player(me)],
        margin: { top: 2, bottom: 2, left: 2, right: 2 }
      })
    },

    // 3. Place first card on the grid
    {
      popup: {
        text: () => <Trans i18nKey="tuto.place-first" defaults="Place your wolf on the panorama to start building the grid. It will grow up to a 4x3 rectangle." />,
        position: { y: 20 }
      },
      move: {
        player: me,
        filter: (move) =>
          isMoveItemType(MaterialType.WolfCard)(move) &&
          move.location.type === LocationType.PlayArea &&
          move.location.x === 0 && move.location.y === 0
      }
    },

    // 4. Draw happened automatically
    {
      popup: {
        text: () => <Trans i18nKey="tuto.after-draw" defaults="You drew a new card from your deck. Now your opponent will play their turn." />
      }
    },

    // 5. Opponent places DarkWolf1 at (1,0) — auto
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

    // 6. Explain stacking and place value 2 on opponent's value 1
    {
      popup: {
        text: () => <Trans i18nKey="tuto.stacking" defaults="You can cover an opponent's wolf by placing a card with exactly +1 value on top! Place your Moon Wolf (value 2) on the opponent's wolf (value 1) to take control of that spot." />,
        position: { y: 20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.WolfCard).location(LocationType.PlayArea),
          this.material(game, MaterialType.WolfCard).location(LocationType.PlayerHand).player(me)
        ],
        margin: { top: 5, bottom: 5, left: 5, right: 5 }
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

    // 7. Scoring explanation
    {
      popup: {
        text: () => <Trans i18nKey="tuto.scoring" defaults="The card you just played has a moon! At the end of a round, the player with the most moons scores 2 bonus points. Each row of the panorama is a battle: the player with the highest total value wins the row and scores their visible cards." />
      }
    },

    // 8. Ready to play
    {
      popup: {
        text: () => <Trans i18nKey="tuto.end" defaults="You're ready to play Moonlight! Build your panorama, win row battles, and collect 2 mountain tokens to win. Between rounds, the winner picks a Lone Wolf and the loser picks an Alpha Power. Good luck!" />
      }
    }
  ]
}
