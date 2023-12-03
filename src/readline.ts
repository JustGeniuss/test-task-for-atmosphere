import { stdin as input, stdout as output } from 'node:process'
import * as readline from 'node:readline/promises'

export class ReadlineClient {
    rl: readline.Interface

    constructor() {
        this.rl = readline.createInterface({
            input,
            output,
        })
    }

    async questionNumber(query: string): Promise<number> {
        return +(await this.rl.question(query))
    }

    async playersCount(): Promise<number> {
        return await this.questionNumber(
            'Введите количество игроков (от 1 до 7): ',
        )
    }

    async playerNumber(): Promise<number> {
        return await this.questionNumber(
            `Введите номер игрока, который совершает ставку `,
        )
    }

    async betSize(playerNumber: number): Promise<number> {
        return await this.questionNumber(
            `Игрок ${playerNumber}, введите ставку `,
        )
    }

    async sector(playerNumber: number): Promise<number> {
        return await this.questionNumber(
            `Игрок ${playerNumber}, введите сектор `,
        )
    }
}
