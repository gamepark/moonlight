import { MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { MountainToken } from '../material/MountainToken'
import { PlayerColor } from '../PlayerColor'
import { AlphaPowerHelper } from './helper/AlphaPowerHelper'
import { ScoringHelper } from './helper/ScoringHelper'
import { Memory, PlayerScoreBreakdown, RoundResultsData, RowResult } from './Memory'
import { RuleId } from './RuleId'

export class EndOfRoundRule extends PlayerTurnRule {
  onRuleStart() {
    this.forget(Memory.EndTriggered)

    const lightHelper = new ScoringHelper(this.game, PlayerColor.Light)
    const darkHelper = new ScoringHelper(this.game, PlayerColor.Dark)

    const lightPoints = lightHelper.roundPoints
    const darkPoints = darkHelper.roundPoints

    let winner: PlayerColor | undefined

    if (lightPoints > darkPoints) {
      winner = PlayerColor.Light
    } else if (darkPoints > lightPoints) {
      winner = PlayerColor.Dark
    } else {
      if (lightHelper.wonCards.length > darkHelper.wonCards.length) {
        winner = PlayerColor.Light
      } else if (darkHelper.wonCards.length > lightHelper.wonCards.length) {
        winner = PlayerColor.Dark
      } else {
        const lightWinsTies = new AlphaPowerHelper(this.game, PlayerColor.Light).winsAllTies
        const darkWinsTies = new AlphaPowerHelper(this.game, PlayerColor.Dark).winsAllTies
        if (lightWinsTies && !darkWinsTies) winner = PlayerColor.Light
        else if (darkWinsTies && !lightWinsTies) winner = PlayerColor.Dark
      }
    }

    // Store round results for the popup
    const rows = lightHelper.rows
    const rowResults: RowResult[] = rows.map(row => {
      const lv = lightHelper.rowValueForPlayer(row, PlayerColor.Light)
      const dv = darkHelper.rowValueForPlayer(row, PlayerColor.Dark)
      const lightWon = lightHelper.wonRows.some(wr => wr.y === row.y)
      const darkWon = darkHelper.wonRows.some(wr => wr.y === row.y)
      const lightCards = row.cards.filter(c => c.owner === PlayerColor.Light).length
      const darkCards = row.cards.filter(c => c.owner === PlayerColor.Dark).length
      return {
        y: row.y,
        lightValue: lv,
        darkValue: dv,
        lightCards,
        darkCards,
        winner: lightWon ? 'light' as const : darkWon ? 'dark' as const : 'tie' as const
      }
    })

    const lightBreakdown: PlayerScoreBreakdown = {
      moons: lightHelper.playerMoons,
      moonBonus: lightHelper.moonBonusPoints,
      cards: lightHelper.cardPoints,
      v3Bonus: lightHelper.value3BonusPoints,
      total: lightPoints
    }

    const darkBreakdown: PlayerScoreBreakdown = {
      moons: darkHelper.playerMoons,
      moonBonus: darkHelper.moonBonusPoints,
      cards: darkHelper.cardPoints,
      v3Bonus: darkHelper.value3BonusPoints,
      total: darkPoints
    }

    const roundResults: RoundResultsData = {
      rows: rowResults,
      light: lightBreakdown,
      dark: darkBreakdown
    }

    this.memorize(Memory.RoundResults, roundResults)

    // Record round result in history
    const round = this.remind<number>(Memory.Round) ?? 1
    const history = this.remind<{ round: number; winner: PlayerColor | undefined }[]>(Memory.RoundHistory) ?? []
    history.push({ round, winner })
    this.memorize(Memory.RoundHistory, history)

    // Move won cards to WonCards zone
    const moves: MaterialMove[] = []
    const topCards = lightHelper.visibleCards

    for (const player of [PlayerColor.Light, PlayerColor.Dark]) {
      const helper = player === PlayerColor.Light ? lightHelper : darkHelper
      let x = 0
      for (const row of helper.wonRows) {
        for (const card of row.cards) {
          if (card.owner !== player) continue
          const topInfo = topCards.get(`${card.x},${card.y}`)
          if (!topInfo) continue
          const cardMaterial = this.material(MaterialType.WolfCard)
            .location(LocationType.PlayArea)
            .filter(item =>
              item.location.x === card.x &&
              item.location.y === card.y &&
              (item.location.z ?? 0) === topInfo.z
            )
          if (cardMaterial.length > 0) {
            moves.push(cardMaterial.moveItem({ type: LocationType.WonCards, player, x: x++ }))
          }
        }
      }
    }

    if (winner === undefined) {
      this.forget(Memory.RoundWinner)
      // Tie that cannot be broken: the player who did NOT start the current round starts the next one
      const currentFirstPlayer = this.remind<PlayerColor>(Memory.FirstPlayer)
      if (currentFirstPlayer !== undefined) {
        this.memorize(
          Memory.FirstPlayer,
          currentFirstPlayer === PlayerColor.Light ? PlayerColor.Dark : PlayerColor.Light
        )
      }
      moves.push(this.startSimultaneousRule(RuleId.ViewRoundResults))
      return moves
    }

    // Award mountain
    const mountainKey = winner === PlayerColor.Light ? Memory.LightMountains : Memory.DarkMountains
    const mountains = this.remind<number>(mountainKey) ?? 0
    const pieceId = mountains === 0
      ? (winner === PlayerColor.Light ? MountainToken.LightBottom : MountainToken.DarkBottom)
      : (winner === PlayerColor.Light ? MountainToken.LightTop : MountainToken.DarkTop)

    moves.push(
      this.material(MaterialType.MountainToken).id(pieceId)
        .moveItem({ type: LocationType.PlayerMountain, player: winner, x: mountains })
    )

    this.memorize(mountainKey, mountains + 1)
    this.memorize(Memory.RoundWinner, winner)
    this.memorize(Memory.FirstPlayer, winner)

    moves.push(this.startSimultaneousRule(RuleId.ViewRoundResults))
    return moves
  }
}
