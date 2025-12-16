import { AmountOperationType, ColumnsType, type StatementByColumns, type TransactionDescription } from './types.ts'
import { cardNumbers } from '../data/card-numbers.ts'
import { transactionDescriptions } from '../data/transaction-descriptions.ts'
import { promises as fs } from 'fs'
import path from 'node:path'

export class StatementGenerator {

    //
    //  Statement generation parameters
    //
    private startDate: Date = new Date(Date.now());
    private endDate: Date = new Date(Date.now());
    private minAmount?: number = 10;
    private maxAmount?: number = 1000;
    private columns: ColumnsType[] = [];
    private linesCount: number = 10;

    //
    //  Generated statement data
    //
    private dates: Date[] = [];
    private cardNumber: string = '';
    private descriptions: TransactionDescription[] = [];
    private amounts: number[] = [];
    private statementByColumns: StatementByColumns = undefined;

    public setDateRange(startDate: Date, endDate: Date): StatementGenerator {
        this.startDate = startDate;
        this.endDate = endDate;
        return this;
    }

    public setAmountRange(min: number, max: number): StatementGenerator {
        this.minAmount = min;
        this.maxAmount = max;
        return this;
    }

    public setColumns(...columns: ColumnsType[]): StatementGenerator {
        this.columns = columns;
        return this;
    }

    public setLinesCount(count: number): StatementGenerator {
        this.linesCount = count;
        return this;
    }

    public generateRandomDates(): StatementGenerator {
        const startTime = this.startDate.getTime()
        const endTime = this.endDate.getTime()

        this.dates = [];

        for (let i = 0; i < this.linesCount; i++) {
            const randomTime = startTime + Math.random() * (endTime - startTime)
            const tempDate = new Date(randomTime)
            tempDate.setHours(0, 0, 0, 0)
            this.dates.push(tempDate)
        }

        return this;
    }

    public selectRandomCardNumber(): StatementGenerator {
        this.cardNumber = cardNumbers[Math.floor(Math.random() * cardNumbers.length)]
        return this;
    }

    public selectRandomDescriptions(excludeDescriptions?: string[]): StatementGenerator {

        this.descriptions = [];

        const excludeSet = new Set((excludeDescriptions ?? []).map((s) => s.trim()))
        const pool = transactionDescriptions.filter((td) => !excludeSet.has(td.description.trim()))
        const effectivePool = pool.length > 0 ? pool : transactionDescriptions

        for (let i = 0; i < this.linesCount; i++) {
            const randomIndex = Math.floor(Math.random() * effectivePool.length)
            this.descriptions.push(effectivePool[randomIndex])
        }

        return this;
    }

    public generateAmounts(): StatementGenerator {
        const min = this.minAmount ?? 0
        const max = this.maxAmount ?? Number.MAX_SAFE_INTEGER

        this.amounts = [];

        for (let i = 0; i < this.linesCount; i++) {
            const randomAmount = Math.random() * (max - min) + min
            this.amounts.push(Math.round(randomAmount * 100) / 100)
        }

        return this;
    }

    public generateStatement(): StatementGenerator {
        this.statementByColumns = {};

        this.columns.forEach((column) => {
            switch (column) {
                case ColumnsType.DATE_INSCRIPTION:
                    this.statementByColumns[ColumnsType.DATE_INSCRIPTION] = this.dates.map((date) =>
                        date.toLocaleDateString('en-CA')
                    )
                    break
                case ColumnsType.DATE_TRANSACTION:
                    this.statementByColumns[ColumnsType.DATE_TRANSACTION] = this.dates.map((date) =>
                        date.toLocaleDateString('en-CA')
                    )
                    break
                case ColumnsType.CARD_NUMBER:
                    this.statementByColumns[ColumnsType.CARD_NUMBER] = Array(this.linesCount).fill(this.cardNumber)
                    break
                case ColumnsType.DESCRIPTION:
                    this.statementByColumns[ColumnsType.DESCRIPTION] = this.descriptions.map((d) => d.description)
                    break
                case ColumnsType.AMOUNT: {
                    this.statementByColumns[ColumnsType.AMOUNT] = this.amounts.map((a, i) => {
                        const isExpense = this.descriptions[i]?.amountOperationType === AmountOperationType.Expanse
                        const signed = isExpense ? -Math.abs(a) : Math.abs(a)
                        return signed.toString()
                    })
                    break
                }
            }
        });

        return this;
    }

    public async saveStatement(filepath: string): Promise<StatementGenerator>
    {
        const escapeCsv = (val: string): string => {
            const needsQuoting = /[",\n\r]/.test(val) || val.startsWith(' ') || val.endsWith(' ')
            const escaped = val.replace(/"/g, '""')
            return needsQuoting ? `"${escaped}"` : escaped
        }

        const rowsCount = this.linesCount
        const colOrder = this.columns

        // Build CSV lines
        const lines: string[] = []

        // if (params.fileHeader) {
        //     lines.push(params.fileHeader)
        // }

        for (let i = 0; i < rowsCount; i++) {
            const rowValues = colOrder.map((col) => {
                const colArray = this.statementByColumns[col] ?? []
                const value = colArray[i] ?? ''
                return escapeCsv(String(value))
            })
            lines.push(rowValues.join(','))
        }

        const csv = lines.join('\n') + '\n'

        // Ensure directory exists and write file
        await fs.mkdir(path.dirname(filepath), { recursive: true })
        await fs.writeFile(filepath, csv, { encoding: 'utf8' })

        return this;
    }
}
