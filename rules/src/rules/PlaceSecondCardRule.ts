import { CustomMove, isCustomMoveType, isMoveItemType, ItemMove, MaterialMove, MoveItem, PlayerTurnRule } from '@gamepark/rules-api'
import { LocationType } from '../material/LocationType'
import { MaterialType } from '../material/MaterialType'
import { wolfValue } from '../material/WolfCard'
import { CustomMoveType } from './CustomMoveType'
import { AlphaPowerHelper } from './helper/AlphaPowerHelper'
import { PlayAreaHelper } from './helper/PlayAreaHelper'
import { RuleId } from './RuleId'

export class PlaceSecondCardRule extends PlayerTurnRule {
  onRuleStart() {
    // No card left to place (or no space): skip the second placement entirely
    const helper = new PlayAreaHelper(this.game)
    if (helper.getPlacementMoves(this.hand, this.player, helper.availableSpaces()).length === 0) {
      return [this.startRule(RuleId.DrawCard)]
    }
    return []
  }

  getPlayerMoves() {
    const helper = new PlayAreaHelper(this.game)
    const moves = helper.getPlacementMoves(this.hand, this.player, helper.availableSpaces())

    // Always offer pass (decline second placement)
    moves.push(this.customMove(CustomMoveType.Pass))

    return moves
  }

  afterItemMove(move: ItemMove) {
    if (!isMoveItemType(MaterialType.WolfCard)(move)) return []
    if (move.location.type !== LocationType.PlayArea) return []

    const powers = new AlphaPowerHelper(this.game, this.player)
    const moves: MaterialMove[] = []

    // Detect stacking power usage
    if ((move.location.z ?? 0) > 0) {
      moves.push(...this.detectStackingPowerUsage(move, powers))
    }

    // Mark double placement as used
    moves.push(...powers.markAmbushUsed('doublePlace'))

    moves.push(this.startRule(RuleId.DrawCard))
    return moves
  }

  onCustomMove(move: CustomMove) {
    if (isCustomMoveType(CustomMoveType.Pass)(move)) {
      return [this.startRule(RuleId.DrawCard)]
    }
    return []
  }

  private detectStackingPowerUsage(move: MoveItem, powers: AlphaPowerHelper): MaterialMove[] {
    const placedCard = this.material(MaterialType.WolfCard).getItem(move.itemIndex)
    const placedValue = wolfValue((placedCard.id as { front: number }).front)

    const belowCard = this.material(MaterialType.WolfCard)
      .location(LocationType.PlayArea)
      .filter(item =>
        item.location.x === move.location.x &&
        item.location.y === move.location.y &&
        (item.location.z ?? 0) === (move.location.z ?? 0) - 1
      )

    if (belowCard.length > 0) {
      const belowValue = wolfValue((belowCard.getItem()!.id as { front: number }).front)
      if (placedValue === belowValue + 2) {
        return powers.markAmbushUsed('stackingSkip')
      } else if (placedValue === belowValue) {
        return powers.markAmbushUsed('coverSameValue')
      }
    }
    return []
  }

  get hand() {
    return this.material(MaterialType.WolfCard).location(LocationType.PlayerHand).player(this.player)
  }
}
