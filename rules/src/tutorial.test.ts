import { describe, expect, it } from 'vitest'
import { MaterialType } from './material/MaterialType'
import { LocationType } from './material/LocationType'
import { WolfCard, wolfValue } from './material/WolfCard'
import { AlphaPowerCard } from './material/AlphaPowerCard'
import { MountainToken } from './material/MountainToken'
import { PlayerAidCard } from './material/PlayerAidCard'
import { PlayerColor } from './PlayerColor'
import { MoonlightRules } from './MoonlightRules'
import { RuleId } from './rules/RuleId'
import { Memory } from './rules/Memory'
import { isMoveItemType, MaterialGame, MaterialMove, MaterialRules } from '@gamepark/rules-api'

/**
 * Reproduces the TutorialSetup from app/src/tutorial/TutorialSetup.ts
 * so we can test the tutorial flow purely in rules.
 */
function createTutorialGame(): MaterialGame {
  const game: MaterialGame = {
    players: [PlayerColor.Light, PlayerColor.Dark],
    items: {
      [MaterialType.WolfCard]: [],
      [MaterialType.AlphaPowerCard]: [],
      [MaterialType.MountainToken]: [],
      [MaterialType.PlayerAid]: []
    },
    rule: { id: RuleId.PlaceCard, player: PlayerColor.Light },
    memory: { [Memory.Round]: 1, [Memory.FirstPlayer]: PlayerColor.Light }
  }

  const wolves = game.items[MaterialType.WolfCard]!

  // Light hand (indices 0-2)
  for (const card of [WolfCard.LightWolf1, WolfCard.LightWolfMoon2, WolfCard.LightWolf3]) {
    wolves.push({ id: { front: card, back: PlayerColor.Light }, location: { type: LocationType.PlayerHand, player: PlayerColor.Light } })
  }
  // Light deck (indices 3-8)
  for (const card of [WolfCard.LightWolf5, WolfCard.LightWolfMoon4, WolfCard.LightWolf2, WolfCard.LightWolfMoon3, WolfCard.LightWolfMoon1, WolfCard.LightWolf4]) {
    wolves.push({ id: { front: card, back: PlayerColor.Light }, location: { type: LocationType.WolfDeck, player: PlayerColor.Light } })
  }

  // Light lone wolves (indices 9-12)
  for (const card of [WolfCard.LightLoneWolf1, WolfCard.LightLoneWolf2, WolfCard.LightLoneWolf4, WolfCard.LightLoneWolf6]) {
    wolves.push({ id: { front: card, back: PlayerColor.Light }, location: { type: LocationType.LoneWolfDeck, player: PlayerColor.Light } })
  }

  // Dark hand (indices 13-15)
  for (const card of [WolfCard.DarkWolf1, WolfCard.DarkWolfMoon2, WolfCard.DarkWolf3]) {
    wolves.push({ id: { front: card, back: PlayerColor.Dark }, location: { type: LocationType.PlayerHand, player: PlayerColor.Dark } })
  }
  // Dark deck (indices 16-21)
  for (const card of [WolfCard.DarkWolf5, WolfCard.DarkWolfMoon4, WolfCard.DarkWolf2, WolfCard.DarkWolfMoon3, WolfCard.DarkWolfMoon1, WolfCard.DarkWolf4]) {
    wolves.push({ id: { front: card, back: PlayerColor.Dark }, location: { type: LocationType.WolfDeck, player: PlayerColor.Dark } })
  }

  // Dark lone wolves (indices 22-25)
  for (const card of [WolfCard.DarkLoneWolf1, WolfCard.DarkLoneWolf2, WolfCard.DarkLoneWolf4, WolfCard.DarkLoneWolf6]) {
    wolves.push({ id: { front: card, back: PlayerColor.Dark }, location: { type: LocationType.LoneWolfDeck, player: PlayerColor.Dark } })
  }

  // Alpha powers
  const alphas = game.items[MaterialType.AlphaPowerCard]!
  for (const card of [AlphaPowerCard.AlphaPower1, AlphaPowerCard.AlphaPower3, AlphaPowerCard.AlphaPower5, AlphaPowerCard.AlphaPower7]) {
    alphas.push({ id: card, location: { type: LocationType.AlphaPowerArea } })
  }
  for (const card of [AlphaPowerCard.AlphaPower2, AlphaPowerCard.AlphaPower4, AlphaPowerCard.AlphaPower6, AlphaPowerCard.AlphaPower8]) {
    alphas.push({ id: card, location: { type: LocationType.AlphaPowerDeck } })
  }

  // Mountains
  const mountains = game.items[MaterialType.MountainToken]!
  for (const player of [PlayerColor.Light, PlayerColor.Dark]) {
    mountains.push({
      id: player === PlayerColor.Light ? MountainToken.LightBottom : MountainToken.DarkBottom,
      location: { type: LocationType.MountainArea, player, x: 0 }
    })
    mountains.push({
      id: player === PlayerColor.Light ? MountainToken.LightTop : MountainToken.DarkTop,
      location: { type: LocationType.MountainArea, player, x: 1 }
    })
  }

  // Player aids
  const aids = game.items[MaterialType.PlayerAid]!
  aids.push({ id: PlayerAidCard.LightAid, location: { type: LocationType.PlayerAidArea, player: PlayerColor.Light } })
  aids.push({ id: PlayerAidCard.DarkAid, location: { type: LocationType.PlayerAidArea, player: PlayerColor.Dark } })

  return game
}

function playConsequences(rules: MaterialRules, move: MaterialMove) {
  const consequences = rules.play(move)
  while (consequences.length > 0) consequences.push(...rules.play(consequences.shift()!))
}

function findMove(rules: MoonlightRules, player: PlayerColor, filter: (move: any) => boolean): MaterialMove {
  const moves = rules.getLegalMoves(player)
  const match = moves.find(filter)
  if (!match) {
    throw new Error(`No matching move found for player ${player}. ${moves.length} legal moves available.`)
  }
  return match
}

describe('Tutorial flow', () => {
  it('should allow all tutorial steps to be played', () => {
    const game = createTutorialGame()
    const rules = new MoonlightRules(game)

    // Step 3: Light places any card EXCEPT LightWolfMoon2 at (0,0)
    const placeFirst = findMove(rules, PlayerColor.Light, (m) =>
      isMoveItemType(MaterialType.WolfCard)(m) &&
      m.location.type === LocationType.PlayArea &&
      m.location.x === 0 && m.location.y === 0 &&
      rules.game.items[MaterialType.WolfCard]![m.itemIndex]?.id?.front !== WolfCard.LightWolfMoon2
    )
    playConsequences(rules, placeFirst)
    expect(rules.game.rule?.player).toBe(PlayerColor.Dark)

    // Step 5: Dark places DarkWolf1 at (1,0)
    const darkPlace1 = findMove(rules, PlayerColor.Dark, (m) =>
      isMoveItemType(MaterialType.WolfCard)(m) &&
      m.location.type === LocationType.PlayArea &&
      m.location.x === 1 && m.location.y === 0 &&
      game.items[MaterialType.WolfCard]![m.itemIndex]?.id?.front === WolfCard.DarkWolf1
    )
    playConsequences(rules, darkPlace1)
    expect(rules.game.rule?.player).toBe(PlayerColor.Light)

    // Step 6: Light places any card on ground EXCEPT value 2 (need it for stacking)
    const placeGround = findMove(rules, PlayerColor.Light, (m) =>
      isMoveItemType(MaterialType.WolfCard)(m) &&
      m.location.type === LocationType.PlayArea &&
      (m.location.z ?? 0) === 0 &&
      rules.game.items[MaterialType.WolfCard]![m.itemIndex]?.id?.front !== WolfCard.LightWolfMoon2
    )
    playConsequences(rules, placeGround)
    expect(rules.game.rule?.player).toBe(PlayerColor.Dark)

    // Step 7: Dark places DarkWolfMoon2 somewhere
    const darkPlace2 = findMove(rules, PlayerColor.Dark, (m) =>
      isMoveItemType(MaterialType.WolfCard)(m) &&
      m.location.type === LocationType.PlayArea &&
      game.items[MaterialType.WolfCard]![m.itemIndex]?.id?.front === WolfCard.DarkWolfMoon2
    )
    playConsequences(rules, darkPlace2)
    expect(rules.game.rule?.player).toBe(PlayerColor.Light)

    // Step 8: Light stacks on (1,0) with a value 2 card
    // Step 8: Light stacks on (1,0) with a value 2 card
    const stackMove = findMove(rules, PlayerColor.Light, (m) =>
      isMoveItemType(MaterialType.WolfCard)(m) &&
      m.location.type === LocationType.PlayArea &&
      m.location.x === 1 && m.location.y === 0 &&
      (m.location.z ?? 0) > 0
    )
    expect(stackMove).toBeDefined()
    const stackedCard = rules.game.items[MaterialType.WolfCard]![(stackMove as any).itemIndex]
    expect(wolfValue(stackedCard.id.front)).toBe(2)
  })
})
