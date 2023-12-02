import { BetResultEnum } from './enums/bet-result.enum'
import { BetHistoryType } from './types/betHistory.type'
import { Sector } from './types/sectors.type'

export class Player {
    balance: number
    betHistory: BetHistoryType = []
    constructor(initialBalance: number) {
        this.balance = initialBalance
    }
    makeBet(bet: number, sector: Sector, wheelId: number) {
        if (this.balance < bet) {
            console.log(
                'Баланс игрока меньше суммы ставки, данная ставка невозможна',
            )
            return
        }
        console.log(this.betHistory)
        this.balance -= bet
        this.betHistory.push({
            bet,
            sector,
            wheelId,
            result: BetResultEnum.IN_PROCESS,
            potentialWin: bet * sector,
            win: 0,
        })
        return { bet }
    }
}
