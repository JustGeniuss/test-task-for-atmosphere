import { SECTORS } from './constants/sectors'
import { BetResultEnum } from './enums/bet-result.enum'
import { AvailableSectors, Sector } from './types/sectors.type'
import { Player } from './player'
import { rl } from './helpers/readline'
import { delay } from './helpers/delay'

export class Wheel {
    id: number = 0
    sectors: AvailableSectors = []
    history: AvailableSectors = []
    players: Player[] = []
    constructor() {
        this.sectors = Array(24)
            .fill(2)
            .concat(
                Array(12).fill(4),
                Array(8).fill(6),
                Array(4).fill(12),
                Array(3).fill(16),
                Array(2).fill(24),
                Array(1).fill(48),
            )
    }
    async startGame(): Promise<void> {
        let playersCount = await rl.question(
            'Введите количество игроков (от 1 до 7): ',
        )

        while (this.isPlayersCountIncorrect(playersCount)) {
            console.log('Неверный ввод. Пожалуйста, введите число от 1 до 7.')
            playersCount = await rl.question(
                'Введите количество игроков (от 1 до 7): ',
            )
        }

        for (let i = 0; i < Number(playersCount); i++) {
            this.players.push(new Player(100))
        }
        this.gameCycle()
    }

    isPlayersCountIncorrect(playersCount: string): boolean {
        const playersCountNumber = +playersCount
        return (
            isNaN(playersCountNumber) ||
            playersCountNumber < 1 ||
            playersCountNumber > 7
        )
    }

    gameCycle = (): void => {
        this.startIteration()
        setInterval(() => {
            this.startIteration()
        }, 21000)
    }

    spin(): Sector {
        const sector: Sector = this.sectors[
            Math.floor(Math.random() * this.sectors.length)
        ] as Sector
        this.history.push(sector)
        return sector
    }

    sendWins(sector: Sector): void {
        for (const player of this.players) {
            for (const bet of player.betHistory) {
                if (bet.result === BetResultEnum.IN_PROCESS) {
                    if (bet.sector === sector) {
                        bet.result = BetResultEnum.WIN
                        bet.win = bet.potentialWin
                        player.balance += bet.potentialWin
                    } else {
                        bet.result = BetResultEnum.LOSE
                        bet.win = 0
                    }
                }
            }
        }
    }

    async startIteration() {
        console.log(this.history)
        this.id++
        console.log('start')
        await Promise.race([this.collectBets(), delay(15000)])
        console.log('\nПрием ставок окончен')
        console.log('Начинаем прокрут колеса')
        const winningSector = this.spin()
        await delay(5000)
        console.log('winning sector is ', winningSector)
        this.sendWins(winningSector)
    }

    async collectBets(): Promise<void> {
        while (true) {
            const playerNumber = +(await rl.question(
                `Введите номер игрока, который совершает ставку`,
            ))

            if (!this.players[playerNumber - 1]) {
                console.log(
                    'Такого игрока не существует, пожалуйста, введите корректный номер',
                )
                continue
            }

            const bet = +(await rl.question(
                `Игрок ${playerNumber}, введите ставку`,
            ))

            const sector = +(await rl.question(
                `Игрок ${playerNumber}, введите сектор`,
            )) as Sector

            if (!SECTORS.includes(sector)) {
                console.log(
                    'Такого сектора не существует, Актуальные сектора: [2, 4, 6, 12, 16, 24, 48]',
                )
                console.log('Пожалуйста, поставьте ставку заново')
                continue
            }

            const player = this.players[playerNumber - 1] as Player
            const playersBet = player.makeBet(bet, sector, this.id)

            if (!playersBet) {
                continue
            }

            console.log(
                `Игрок ${playerNumber} - Ставка: ${playersBet.bet}, Баланс: ${player.balance}`,
            )
        }
    }
}
