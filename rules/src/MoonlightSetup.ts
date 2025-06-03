import { MaterialGameSetup } from '@gamepark/rules-api'
import { MoonlightOptions } from './MoonlightOptions'
import { MoonlightRules } from './MoonlightRules'
import { LocationType } from './material/LocationType'
import { MaterialType } from './material/MaterialType'
import { PlayerColor } from './PlayerColor'
import { RuleId } from './rules/RuleId'

/**
 * This class creates a new Game based on the game options
 */
export class MoonlightSetup extends MaterialGameSetup<PlayerColor, MaterialType, LocationType, MoonlightOptions> {
  Rules = MoonlightRules

  setupMaterial(_options: MoonlightOptions) {
    // TODO
  }

  start() {
    this.startPlayerTurn(RuleId.TheFirstStep, this.players[0])
  }
}
