import { isMoveItemType, ItemMove, MaterialMove, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { PlayerColor } from '../PlayerColor'
import { RuleId } from './RuleId'

export class ChooseLoneWolfRule extends PlayerTurnRule {
  onRuleStart() {
    const loneWolves = this.material(MaterialType.WolfCard)
      .location(LocationType.LoneWolfDeck)
      .player(this.player)

    if (loneWolves.length === 0) {
      return this.goToAlphaPowerChoice()
    }
    return []
  }

  getPlayerMoves() {
    return this.material(MaterialType.WolfCard)
      .location(LocationType.LoneWolfDeck)
      .player(this.player)
      .moveItems({
        type: LocationType.WolfDeck,
        player: this.player
      })
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.WolfCard)(move)) return []
    return this.goToAlphaPowerChoice()
  }

  goToAlphaPowerChoice(): MaterialMove[] {
    const loser = this.player === PlayerColor.Light ? PlayerColor.Dark : PlayerColor.Light
    const alphaPowers = this.material(MaterialType.AlphaPowerCard)
      .location(LocationType.AlphaPowerArea)

    if (alphaPowers.length === 0) {
      return [this.startRule(RuleId.NewRound)]
    }
    return [this.startPlayerTurn(RuleId.ChooseAlphaPower, loser)]
  }
}
