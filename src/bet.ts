import { BetResultEnum } from './enums/bet-result.enum'

export class Bet {
    bet: number
    sector: number
    potentialWinAmount: number
    result: BetResultEnum
    winAmount: number
    constructor(bet: number, sector: number) {
        this.bet = bet
        this.sector = sector
        this.potentialWinAmount = bet * sector
        this.result = BetResultEnum.IN_PROCESS
        this.winAmount = 0
    }

    win(): number {
        this.winAmount = this.potentialWinAmount
        this.result = BetResultEnum.WIN
        return this.winAmount
    }

    lose(): void {
        this.result = BetResultEnum.LOSE
    }
}
