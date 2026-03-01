import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { RoundResultsData } from '@gamepark/moonlight/rules/Memory'

export type RoundScoreSnapshot = {
  results: RoundResultsData
  winner: PlayerColor | undefined
}

let listener: ((snapshot: RoundScoreSnapshot) => void) | undefined

export const onOpenRoundScore = (cb: (snapshot: RoundScoreSnapshot) => void) => { listener = cb }
export const openRoundScore = (snapshot: RoundScoreSnapshot) => listener?.(snapshot)
