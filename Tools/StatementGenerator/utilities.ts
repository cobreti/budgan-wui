import { ColumnsType, type Parameters, type StatementByColumns } from './types.ts'
import { cardNumbers} from './data/card-numbers.ts'
import { type TransactionDescription, transactionDescriptions } from './data/transaction-descriptions.ts'
import { promises as fs } from 'fs'
import * as path from 'node:path'

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
//  Generate random amounts between minAmount and maxAmount with 2 decimals
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


//
//  Generate a statement structure with the specified number of entries based on the parameters
//
export function generateStatement(params: Parameters): StatementByColumns {
    const statement: StatementByColumns = {}

    const dates = generateRandomDates(params)
    const cardNumber = selectRandomCardNumber()
    const descriptions = selectRandomDescriptions(params)

    params.columns.forEach((column) => {
        switch (column) {
            case ColumnsType.DATE_INSCRIPTION:
                statement[ColumnsType.DATE_INSCRIPTION] = dates.map((date) =>
                    date.toLocaleDateString('en-CA')
                )
                break
            case ColumnsType.DATE_TRANSACTION:
                statement[ColumnsType.DATE_TRANSACTION] = dates.map((date) =>
                    date.toLocaleDateString('en-CA')
                )
                break
            case ColumnsType.CARD_NUMBER:
                statement[ColumnsType.CARD_NUMBER] = Array(params.linesCount).fill(cardNumber)
                break
            case ColumnsType.DESCRIPTION:
                statement[ColumnsType.DESCRIPTION] = descriptions.map((d) => d.description)
                break
            case ColumnsType.AMOUNT:
                statement[ColumnsType.AMOUNT] = generateAmounts(params).map((a) => a.toString())
                break
        }
    })

    return statement
}

//
// Save a statement as a CSV file to the given filepath.
// - Uses the order of columns specified in params.columns for each row
// - Writes params.fileHeader as the first line when provided (non-null)
// - Escapes fields per CSV rules (double quotes when needed, doubled inner quotes)
//
export async function saveStatementAsCsv(
    filepath: string,
    params: Parameters,
    statement: StatementByColumns
): Promise<void> {
    // Helper to escape a CSV field per RFC 4180
    const escapeCsv = (val: string): string => {
        const needsQuoting = /[",\n\r]/.test(val) || val.startsWith(' ') || val.endsWith(' ')
        const escaped = val.replace(/"/g, '""')
        return needsQuoting ? `"${escaped}"` : escaped
    }

    const rowsCount = params.linesCount
    const colOrder = params.columns

    // Build CSV lines
    const lines: string[] = []

    if (params.fileHeader) {
        lines.push(params.fileHeader)
    }

    for (let i = 0; i < rowsCount; i++) {
        const rowValues = colOrder.map((col) => {
            const colArray = statement[col] ?? []
            const value = colArray[i] ?? ''
            return escapeCsv(String(value))
        })
        lines.push(rowValues.join(','))
    }

    const csv = lines.join('\n') + '\n'

    // Ensure directory exists and write file
    await fs.mkdir(path.dirname(filepath), { recursive: true })
    await fs.writeFile(filepath, csv, { encoding: 'utf8' })
}

