import { Location, Material, MaterialItem, MaterialRulesPart } from '@gamepark/rules-api'
import uniqBy from 'lodash/uniqBy'
import { LocationType } from '../../material/LocationType'
import { MaterialType } from '../../material/MaterialType'

export class PlayAreaHelper extends MaterialRulesPart {
  availableSpaces() {
    const availableSpaces: Location[] = []
    const boundaries = this.outerSquareBoundaries

    let playedCards: MaterialItem[] = []

    playedCards = this.playArea.getItems()

    const maxSize = 4

    if (playedCards.length === 0) {
      availableSpaces.push({ type: LocationType.PlayArea, x: 0, y: 0, z: 0 })
    }

    playedCards.forEach((playedCard) => {
      const coordinates = { x: playedCard.location.x, y: playedCard.location.y }
      const left = { x: playedCard.location.x! - 1, y: playedCard.location.y! }
      if (!playedCards.find((item) => isAnyCardToTheLeft(item, coordinates)) && boundaries.xMax - left.x < maxSize) {
        if (boundaries.yMax - boundaries.yMin < maxSize) {
          availableSpaces.push({ type: LocationType.PlayArea, x: left.x, y: left.y, z: 0 })
        }
      }

      const right = { x: playedCard.location.x! + 1, y: playedCard.location.y! }
      if (!playedCards.find((item) => isAnyCardToTheRight(item, coordinates)) && right.x - boundaries.xMin < maxSize) {
        if (boundaries.yMax - boundaries.yMin < maxSize) {
          availableSpaces.push({ type: LocationType.PlayArea, x: right.x, y: right.y, z: 0 })
        }
      }

      const below = { x: playedCard.location.x!, y: playedCard.location.y! + 1 }
      if (
        !playedCards.find((item) => isAnyCardBelow(item, coordinates)) &&
        below.y - boundaries.yMin <
          maxSize /* && (below.x < boundaries.xMin? (boundaries.xMax - below.x < this.maxSize): (below.x - boundaries.xMin < this.maxSize))*/
      ) {
        if (boundaries.xMax - boundaries.xMin < maxSize) {
          availableSpaces.push({ type: LocationType.PlayArea, x: below.x, y: below.y, z: 0 })
        }
      }

      const above = { x: playedCard.location.x!, y: playedCard.location.y! - 1 }
      if (
        !playedCards.find((item) => isAnyCardAbove(item, coordinates)) &&
        boundaries.yMax - above.y <
          maxSize /* && (above.x < boundaries.xMin? (boundaries.xMax - above.x < this.maxSize): (above.x - boundaries.xMin < this.maxSize))*/
      ) {
        if (boundaries.xMax - boundaries.xMin < maxSize) {
          availableSpaces.push({ type: LocationType.PlayArea, x: above.x, y: above.y, z: 0 })
        }
      }
    })

    return uniqBy(availableSpaces, (location) => JSON.stringify(location))
  }

  getBoundaries(panorama: Material) {
    const xMin = panorama.minBy((item) => item.location.x!).getItem()?.location.x ?? 0
    const xMax = panorama.maxBy((item) => item.location.x!).getItem()?.location.x ?? 0
    const yMin = panorama.minBy((item) => item.location.y!).getItem()?.location.y ?? 0
    const yMax = panorama.maxBy((item) => item.location.y!).getItem()?.location.y ?? 0
    return {
      xMin,
      xMax,
      yMin,
      yMax
    }
  }

  get outerSquareBoundaries() {
    return this.getBoundaries(this.playArea)
  }

  get playArea() {
    return this.material(MaterialType.WolfCard).location(LocationType.PlayArea)
  }
}

export const isAnyCardToTheLeft = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! - 1 && slotToCheck.location.y === reference.y
}
export const isAnyCardToTheRight = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! + 1 && slotToCheck.location.y === reference.y
}
export const isAnyCardAbove = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! && slotToCheck.location.y === reference.y! - 1
}
export const isAnyCardBelow = (slotToCheck: MaterialItem, reference: { x?: number; y?: number }) => {
  return slotToCheck.location.x === reference.x! && slotToCheck.location.y === reference.y! + 1
}
