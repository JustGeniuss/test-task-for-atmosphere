import { COLLECTING_TIMEOUT, SPIN_TIMEOUT, CALCULATING_TIMEOUT } from './constants/timeouts'
import { SECTORS } from './constants/sectors'
import { delay } from './helpers/delay'
import { validateNumber } from './helpers/validate-number'
import { Player } from './player'
import { ReadlineClient } from './readline'
import { AvailableSectors, Sector } from './types/sectors.type'

export class Wheel {
    spinNumber: number = 0
    sectors: AvailableSectors = []
    history: AvailableSectors = []
    players: Player[] = []
    readlineClient: ReadlineClient
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
        this.readlineClient = new ReadlineClient()
    }

    async startGame(): Promise<void> {
        let playersCount = await this.readlineClient.playersCount()

        while (!validateNumber(playersCount, { min: 1, max: 7 })) {
            playersCount = await this.readlineClient.playersCount()
        }

        for (let i = 0; i < Number(playersCount); i++) {
            this.players.push(new Player(100))
        }
        this.gameCycle()
    }

    async gameCycle(): Promise<void> {
        while (true) {
            await this.startIteration()
        }
    }

    spin(): Sector {
        const sector: Sector = this.sectors[
            Math.floor(Math.random() * this.sectors.length)
        ] as Sector
        this.history.push(sector)
        return sector
    }

    calculateBets(sector: Sector): void {
        for (const player of this.players) {
            for (const bet of player.betHistory.get(this.spinNumber) ?? []) {
                if (bet.sector === sector) {
                    bet.win(bet.potentialWin)
                    player.increaseBalance(bet.potentialWin)
                } else {
                    bet.lose()
                }
            }
        }
    }

    async startIteration() {
        console.log(this.history)
        this.spinNumber++
        console.log('start')

        await Promise.race([this.collectBets(), delay(COLLECTING_TIMEOUT)])
        console.log('\nПрием ставок окончен')

        console.log('Начинаем прокрут колеса')
        const winningSector = this.spin()
        await delay(SPIN_TIMEOUT)
        console.log('winning sector is ', winningSector)

        this.calculateBets(winningSector)
        await delay(CALCULATING_TIMEOUT)
    }

    async collectBets(): Promise<void> {
        while (true) {
            let playerNumber = await this.readlineClient.playerNumber()

            while (!this.players[playerNumber - 1]) {
                console.log(
                    'Такого игрока не существует, пожалуйста, введите корректный номер ',
                )
                playerNumber = await this.readlineClient.playerNumber()
            }

            let bet = await this.readlineClient.betSize(playerNumber)

            while (!validateNumber(bet, { min: 1 })) {
                bet = await this.readlineClient.betSize(playerNumber)
            }

            const sector = (await this.readlineClient.sector(
                playerNumber,
            )) as Sector

            if (!SECTORS.includes(sector)) {
                console.log(
                    'Такого сектора не существует, Актуальные сектора: [2, 4, 6, 12, 16, 24, 48]',
                )
                console.log('Пожалуйста, поставьте ставку заново')
                continue
            }

            const player = this.players[playerNumber - 1] as Player
            const playersBet = player.makeBet(bet, sector, this.spinNumber)

            if (!playersBet) {
                continue
            }

            console.log(
                `Игрок ${playerNumber} - Ставка: ${playersBet.bet}, Баланс: ${player.balance}`,
            )
        }
    }
}
