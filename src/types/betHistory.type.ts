import { BetResultEnum } from '../enums/bet-result.enum'
import { Sector } from './sectors.type'

export type BetHistoryType = BetHistoryInterface[]

export interface BetHistoryInterface {
    bet: number
    sector: Sector
    wheelId: number
    result: BetResultEnum
    potentialWin: number
    win: number
}
