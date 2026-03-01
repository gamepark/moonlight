export enum Memory {
  Round = 1,
  RoundWinner,
  FirstPlayer,
  EndTriggered,
  LightMountains = 6,
  DarkMountains,
  MovePilePhase,
  RoundResults,
  RoundHistory
}

export type RowResult = {
  y: number
  lightValue: number
  darkValue: number
  lightCards: number
  darkCards: number
  winner: 'light' | 'dark' | 'tie'
}

export type PlayerScoreBreakdown = {
  moons: number
  moonBonus: number
  cards: number
  v3Bonus: number
  total: number
}

export type RoundResultsData = {
  rows: RowResult[]
  light: PlayerScoreBreakdown
  dark: PlayerScoreBreakdown
}
