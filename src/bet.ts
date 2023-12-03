import { BetResultEnum } from './enums/bet-result.enum'

export class Bet {
    bet: number
    sector: number
    potentialWin: number
    result: BetResultEnum
    winAmount: number
    constructor(bet: number, sector: number) {
        this.bet = bet
        this.sector = sector
        this.potentialWin = bet * sector
        this.result = BetResultEnum.IN_PROCESS
        this.winAmount = 0
    }

    win(win: number): void {
        this.winAmount = win
        this.result = BetResultEnum.WIN
    }

    lose(): void {
        this.result = BetResultEnum.LOSE
    }
}
