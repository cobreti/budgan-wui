import { type Parameters } from './types.ts'
import { cardNumbers} from './data/card-numbers.ts'
import { type TransactionDescription, transactionDescriptions } from './data/transaction-descriptions.ts'

//
//  generate random dates based on the parameters
//  between startDate and endDate
//  linesCount is the number of dates to generate
//
//
export function generateRandomDates(params: Parameters): Date[] {
    const dates: Date[] = []
    const startTime = params.startDate.getTime()
    const endTime = params.endDate.getTime()

    for (let i = 0; i < params.linesCount; i++) {
        const randomTime = startTime + Math.random() * (endTime - startTime)
        const tempDate = new Date(randomTime)
        tempDate.setHours(0, 0, 0, 0)
        dates.push(tempDate)
    }

    return dates
}

//
// select a random card number from the list
//
export function selectRandomCardNumber() : string {
    return cardNumbers[Math.floor(Math.random() * cardNumbers.length)]
}


//
// select random descriptions from the list
//

export function selectRandomDescriptions(params: Parameters): TransactionDescription[] {
    const descriptions: TransactionDescription[] = []

    for (let i = 0; i < params.linesCount; i++) {
        const randomIndex = Math.floor(Math.random() * transactionDescriptions.length)
        descriptions.push(transactionDescriptions[randomIndex])
    }

    return descriptions
}


//
//
//
export function generateAmounts(params: Parameters) : number[] {
    const amounts: number[] = []
    const min = params.minAmount ?? 0
    const max = params.maxAmount ?? Number.MAX_SAFE_INTEGER

    for (let i = 0; i < params.linesCount; i++) {
        const randomAmount = Math.random() * (max - min) + min
        amounts.push(Math.round(randomAmount * 100) / 100)
    }

    return amounts
}
