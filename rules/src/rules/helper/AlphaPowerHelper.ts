import { MaterialMove, MaterialRulesPart } from '@gamepark/rules-api'
import { AlphaPowerCard, AlphaPowerEffect, AmbushEffectKey, alphaPowerEffects } from '../../material/AlphaPowerCard'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'
import { PlayerColor } from '../../PlayerColor'

export class AlphaPowerHelper extends MaterialRulesPart {
  constructor(game: MaterialRulesPart['game'], readonly player: PlayerColor) {
    super(game)
  }

  get playerPowers() {
    return this.material(MaterialType.AlphaPowerCard)
      .location(LocationType.PlayerAlphaPower)
      .player(this.player)
  }

  /** All effect definitions for powers this player currently owns */
  get activeEffects(): AlphaPowerEffect[] {
    return this.playerPowers.getItems()
      .map(item => alphaPowerEffects[item.id as AlphaPowerCard])
      .filter((e): e is AlphaPowerEffect => !!e)
  }

  // --- Stamina effects (always active) ---

  /** Starting hand size (default 3, overridden by stamina power) */
  get handSize(): number {
    for (const effect of this.activeEffects) {
      if (effect.handSize !== undefined) return effect.handSize
    }
    return 3
  }

  /** Whether this player's value 1 wolves are protected from covering */
  get protectsValue1(): boolean {
    return this.activeEffects.some(e => e.protectsValue1)
  }

  /** Bonus moons added during scoring */
  get extraMoons(): number {
    return this.activeEffects.reduce((sum, e) => sum + (e.extraMoons ?? 0), 0)
  }

  /** Whether this player wins all tie situations */
  get winsAllTies(): boolean {
    return this.activeEffects.some(e => e.winsAllTies)
  }

  // --- Ambush effects (one-time use per round) ---

  /** Find the power card that provides a given ambush effect */
  findPowerForEffect(effectKey: AmbushEffectKey): AlphaPowerCard | undefined {
    for (const item of this.playerPowers.getItems()) {
      const id = item.id as AlphaPowerCard
      const effect = alphaPowerEffects[id]
      if (effect && effect[effectKey]) return id
    }
    return undefined
  }

  /** Check if an ambush effect is available (power owned + not flipped face-down) */
  canUseAmbush(effectKey: AmbushEffectKey): boolean {
    const power = this.findPowerForEffect(effectKey)
    if (!power) return false
    const card = this.playerPowers.id(power).getItem()
    return card !== undefined && card.location.rotation !== true
  }

  /** Mark an ambush effect as used, returns move to flip the card face-down */
  markAmbushUsed(effectKey: AmbushEffectKey): MaterialMove[] {
    const power = this.findPowerForEffect(effectKey)
    if (!power) return []
    const card = this.playerPowers.id(power)
    if (card.length === 0) return []
    if (card.getItem()!.location.rotation === true) return []
    return [card.rotateItem(true)]
  }
}
