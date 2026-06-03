import { MaterialRulesPart } from '@gamepark/rules-api'
import { WolfCard, wolfEffect, wolfMoons, wolfValue, WolfEffect } from '../../material/WolfCard'
import { PlayerColor } from '../../PlayerColor'
import { AlphaPowerHelper } from './AlphaPowerHelper'
import { PlayAreaHelper, TopCardInfo } from './PlayAreaHelper'

interface VisibleCard {
  x: number
  y: number
  front: WolfCard
  owner: PlayerColor
}

interface Row {
  y: number
  cards: VisibleCard[]
}

export class ScoringHelper extends MaterialRulesPart {
  constructor(game: MaterialRulesPart['game'], readonly player: PlayerColor) {
    super(game)
  }

  get opponent(): PlayerColor {
    return this.player === PlayerColor.Light ? PlayerColor.Dark : PlayerColor.Light
  }

  get visibleCards(): Map<string, TopCardInfo> {
    return new PlayAreaHelper(this.game).getTopCards()
  }

  get bounds() {
    return new PlayAreaHelper(this.game).outerSquareBoundaries
  }

  isCorner(x: number, y: number): boolean {
    const b = this.bounds
    return (x === b.xMin || x === b.xMax) && (y === b.yMin || y === b.yMax)
  }

  cardScoringValue(front: WolfCard, x: number, y: number): number {
    const value = wolfValue(front)
    if (wolfEffect(front) === WolfEffect.CornerTriplesValue && this.isCorner(x, y)) {
      return value * 3
    }
    return value
  }

  // Rows of the panorama (horizontal lines)
  get rows(): Row[] {
    const b = this.bounds
    const topCards = this.visibleCards
    const rows: Row[] = []

    for (let y = b.yMin; y <= b.yMax; y++) {
      const cards: VisibleCard[] = []
      for (let x = b.xMin; x <= b.xMax; x++) {
        const info = topCards.get(`${x},${y}`)
        if (info) {
          cards.push({ x, y, front: info.front, owner: info.owner })
        }
      }
      rows.push({ y, cards })
    }

    return rows
  }

  rowValueForPlayer(row: Row, player: PlayerColor): number {
    return row.cards
      .filter(c => c.owner === player)
      .reduce((sum, c) => sum + this.cardScoringValue(c.front, c.x, c.y), 0)
  }

  get powerHelper(): AlphaPowerHelper {
    return new AlphaPowerHelper(this.game, this.player)
  }

  // Moon scoring
  get playerMoons(): number {
    let count = 0
    for (const [, info] of this.visibleCards) {
      if (info.owner === this.player) count += wolfMoons(info.front)
    }
    count += this.powerHelper.extraMoons
    return count
  }

  get opponentMoons(): number {
    let count = 0
    for (const [, info] of this.visibleCards) {
      if (info.owner === this.opponent) count += wolfMoons(info.front)
    }
    count += new AlphaPowerHelper(this.game, this.opponent).extraMoons
    return count
  }

  get hasMoonMajority(): boolean {
    if (this.playerMoons > this.opponentMoons) return true
    // Stamina: win ties in moon majority
    if (this.playerMoons === this.opponentMoons && this.powerHelper.winsAllTies) return true
    return false
  }

  get moonBonusPoints(): number {
    return this.hasMoonMajority ? 2 : 0
  }

  // Row battles: rows where this player's total value > opponent's
  get wonRows(): Row[] {
    return this.rows.filter(row => {
      const playerSum = this.rowValueForPlayer(row, this.player)
      const opponentSum = this.rowValueForPlayer(row, this.opponent)
      if (playerSum > opponentSum) return true
      // Stamina: win tied rows
      if (playerSum === opponentSum && this.powerHelper.winsAllTies) return true
      return false
    })
  }

  // Player's visible wolves in won rows
  get wonCards(): VisibleCard[] {
    const result: VisibleCard[] = []
    for (const row of this.wonRows) {
      for (const card of row.cards) {
        if (card.owner === this.player) {
          result.push(card)
        }
      }
    }
    return result
  }

  // 1 point per won card
  get cardPoints(): number {
    return this.wonCards.length
  }

  // +1 for each value 3 wolf (BonusPoint effect) in won rows
  get value3BonusPoints(): number {
    return this.wonCards.filter(card => wolfEffect(card.front) === WolfEffect.BonusPoint).length
  }

  // Total round score
  get roundPoints(): number {
    return this.moonBonusPoints + this.cardPoints + this.value3BonusPoints
  }
}
