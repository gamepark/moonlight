import { isMoveItemType, MaterialGame, MaterialMove, MaterialRules } from '@gamepark/rules-api'
import { describe, expect, it } from 'vitest'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { WolfCard } from './material/WolfCard'
import { MoonlightRules } from './MoonlightRules'
import { PlayerColor } from './PlayerColor'
import { Memory } from './rules/Memory'
import { RuleId } from './rules/RuleId'

function playConsequences(rules: MaterialRules, move: MaterialMove) {
  const consequences = rules.play(move)
  while (consequences.length > 0) consequences.push(...rules.play(consequences.shift()!))
}

/**
 * Minimal game positioned directly in the MovePile rule:
 *  - a 3-card pile owned by Dark at (0,0): z0=DarkWolf1, z1=DarkWolf3, z2=DarkWolf4
 *  - an anchor card at (1,0) so a moved pile has a valid neighbour
 *  - a value 2 card in Dark's hand for phase 2
 */
function createMovePileGame(): MaterialGame {
  const game: MaterialGame = {
    players: [PlayerColor.Light, PlayerColor.Dark],
    items: {
      [MaterialType.WolfCard]: [],
      [MaterialType.AlphaPowerCard]: [],
      [MaterialType.MountainToken]: [],
      [MaterialType.PlayerAid]: []
    },
    rule: { id: RuleId.MovePile, player: PlayerColor.Dark },
    memory: { [Memory.Round]: 1, [Memory.FirstPlayer]: PlayerColor.Light }
  }

  const wolves = game.items[MaterialType.WolfCard]!
  const dark = (front: WolfCard, x: number, y: number, z: number) =>
    wolves.push({ id: { front, back: PlayerColor.Dark }, location: { type: LocationType.PlayArea, x, y, z } })

  dark(WolfCard.DarkWolf1, 0, 0, 0)
  dark(WolfCard.DarkWolf3, 0, 0, 1)
  dark(WolfCard.DarkWolf4, 0, 0, 2)
  dark(WolfCard.DarkWolf2, 1, 0, 0) // anchor
  wolves.push({ id: { front: WolfCard.DarkWolfMoon2, back: PlayerColor.Dark }, location: { type: LocationType.PlayerHand, player: PlayerColor.Dark } })

  // Non-empty decks so DrawCard refills a hand and the round does not end mid-test.
  for (const front of [WolfCard.DarkWolf5, WolfCard.DarkWolfMoon4]) {
    wolves.push({ id: { front, back: PlayerColor.Dark }, location: { type: LocationType.WolfDeck, player: PlayerColor.Dark } })
  }
  for (const front of [WolfCard.LightWolf5, WolfCard.LightWolfMoon4]) {
    wolves.push({ id: { front, back: PlayerColor.Light }, location: { type: LocationType.WolfDeck, player: PlayerColor.Light } })
  }
  // Keep the opponent with a card in hand too, so neither hand empties out.
  wolves.push({ id: { front: WolfCard.LightWolf1, back: PlayerColor.Light }, location: { type: LocationType.PlayerHand, player: PlayerColor.Light } })

  return game
}

const pileAt = (rules: MoonlightRules, x: number, y: number) =>
  rules.material(MaterialType.WolfCard).location(LocationType.PlayArea).getItems()
    .filter(i => i.location.x === x && i.location.y === y)
    .sort((a, b) => (a.location.z ?? 0) - (b.location.z ?? 0))

describe('MovePile rule', () => {
  it('moves a multi-card pile then asks to place a value 2 card (does not end early)', () => {
    const rules = new MoonlightRules(createMovePileGame())

    expect(pileAt(rules, 0, 0)).toHaveLength(3)

    // Phase 1: move the pile (3 cards). The player drag-and-drops the top card.
    const pileMove = rules.getLegalMoves(PlayerColor.Dark)
      .find(m => isMoveItemType(MaterialType.WolfCard)(m) && m.location.type === LocationType.PlayArea)
    expect(pileMove).toBeDefined()
    const dest = { x: (pileMove as any).location.x as number, y: (pileMove as any).location.y as number }

    playConsequences(rules, pileMove!)

    // The rule must NOT have ended: with a 2+ card pile, the remaining cards moved as
    // consequences must not be mistaken for the phase-2 placement. We must still be in
    // MovePile, phase 'place', asking for the value 2 card.
    expect(rules.game.rule?.id).toBe(RuleId.MovePile)
    expect(rules.remind(Memory.MovePilePhase)).toBe('place')

    // The whole pile moved together (3 cards relocated, source vacated).
    expect(pileAt(rules, dest.x, dest.y)).toHaveLength(3)
    expect(pileAt(rules, 0, 0)).toHaveLength(0)

    // Phase 2: place the value 2 card -> clean end, memory cleared.
    const place2 = rules.getLegalMoves(PlayerColor.Dark)
      .find(m => isMoveItemType(MaterialType.WolfCard)(m) && m.location.type === LocationType.PlayArea)
    expect(place2).toBeDefined()
    playConsequences(rules, place2!)

    expect(rules.game.rule?.id).not.toBe(RuleId.MovePile)
    expect(rules.remind(Memory.MovePilePhase)).toBeUndefined()
    expect(rules.remind(Memory.MovePileSource)).toBeUndefined()
  })

  it('moves a single-card pile then still asks to place the value 2 card', () => {
    const game = createMovePileGame()
    // Reduce the pile at (0,0) to a single card.
    game.items[MaterialType.WolfCard] = game.items[MaterialType.WolfCard]!
      .filter(i => !(i.location.x === 0 && i.location.y === 0 && (i.location.z ?? 0) >= 1))
    const rules = new MoonlightRules(game)

    const pileMove = rules.getLegalMoves(PlayerColor.Dark)
      .find(m => isMoveItemType(MaterialType.WolfCard)(m) && m.location.type === LocationType.PlayArea)
    expect(pileMove).toBeDefined()
    playConsequences(rules, pileMove!)

    expect(rules.game.rule?.id).toBe(RuleId.MovePile)
    expect(rules.remind(Memory.MovePilePhase)).toBe('place')

    const place2 = rules.getLegalMoves(PlayerColor.Dark)
      .find(m => isMoveItemType(MaterialType.WolfCard)(m) && m.location.type === LocationType.PlayArea)
    expect(place2).toBeDefined()
    playConsequences(rules, place2!)

    expect(rules.game.rule?.id).not.toBe(RuleId.MovePile)
    expect(rules.remind(Memory.MovePilePhase)).toBeUndefined()
  })

  it('phase 1 offers moving the top card of a pile (what the player drag-and-drops)', () => {
    const game = createMovePileGame()
    const rules = new MoonlightRules(game)

    const moves = rules.getLegalMoves(PlayerColor.Dark)
      .filter(m => isMoveItemType(MaterialType.WolfCard)(m) && m.location.type === LocationType.PlayArea)

    // For the (0,0) pile (z = 0,1,2), the offered move grabs the TOP card (z = 2).
    for (const m of moves) {
      const item = game.items[MaterialType.WolfCard]![(m as any).itemIndex]
      if (item.location.x === 0 && item.location.y === 0) {
        expect(item.location.z ?? 0).toBe(2)
      }
    }
    expect(moves.length).toBeGreaterThan(0)
  })
})
