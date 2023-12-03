import { Bet } from './bet'
import { Sector } from './types/sectors.type'

export class Player {
    balance: number
    betHistory = new Map<number, Bet[]>()
    constructor(initialBalance: number) {
        this.balance = initialBalance
    }
    makeBet(bet: number, sector: Sector, spinNumber: number) {
        if (this.balance < bet) {
            console.log(
                'Баланс игрока меньше суммы ставки, данная ставка невозможна',
            )
            return
        }
        console.log(this.betHistory)
        this.balance -= bet

        const oldBetHistory = this.betHistory.get(spinNumber)
        const newBet = new Bet(bet, sector)

        if (!oldBetHistory) {
            this.betHistory.set(spinNumber, [newBet])
        } else {
            oldBetHistory.push(newBet)
        }

        return { bet }
    }

    increaseBalance(win: number): void {
        this.balance += win
    }
}
