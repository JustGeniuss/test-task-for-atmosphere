export function validateNumber(
    number: number,
    limits: { min?: number; max?: number },
): boolean {
    if (isNaN(number)) {
        console.log('Пожалуйста введите число')
        return false
    }
    if (limits.min && number < limits.min) {
        console.log(
            `Число меньше минимально допустимого значения в ${limits.min} `,
        )
        return false
    }
    if (limits.max && number > limits.max) {
        console.log(
            `Число больше максимально допустимого значения в ${limits.max} `,
        )
        return false
    }
    return true
}
