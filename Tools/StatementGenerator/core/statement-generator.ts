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

    public setColumns(columns: ColumnsType[]): StatementGenerator {
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
        this.linesCount = this.dates.length;

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

        // Build row objects to facilitate sorting
        const rows: string[][] = []
        for (let i = 0; i < rowsCount; i++) {
            const rowValues = colOrder.map((col) => {
                const colArray = this.statementByColumns[col] ?? []
                return colArray[i] ?? ''
            })
            // Only add rows that have at least one non-empty value
            if (rowValues.some(val => val !== '')) {
                rows.push(rowValues)
            }
        }

        // Sort rows by date if DATE_TRANSACTION column exists
        const dateColIndex = colOrder.indexOf(ColumnsType.DATE_TRANSACTION)
        if (dateColIndex !== -1) {
            rows.sort((a, b) => {
                const dateA = new Date(a[dateColIndex])
                const dateB = new Date(b[dateColIndex])
                return dateA.getTime() - dateB.getTime()
            })
        }

        // Build CSV lines with escaped values
        const lines = rows.map(row => row.map(val => escapeCsv(String(val))).join(','))

        const csv = lines.join('\n') + '\n'

        // Ensure directory exists and write file
        await fs.mkdir(path.dirname(filepath), { recursive: true })
        await fs.writeFile(filepath, csv, { encoding: 'utf8' })

        return this;
    }

    //
    //  Manually add a statement row by specifying column/value pairs
    //
    //  Requirements from issue:
    //  - Method name: addStatementRow
    //  - Accept a single array of entries; each entry contains a column type and a value
    //  - Date columns must be stored using en-CA format
    //  - Amount must be auto-signed based on DESCRIPTION's amountOperationType
    //  - Throw on mismatch (e.g., AMOUNT requires DESCRIPTION context; unknown column; duplicate columns)
    //  - Append values into statementByColumns
    public addStatementRow(
        entries: Array<{ column: ColumnsType; value?: string | number | Date }>
    ): StatementGenerator {
        if (!Array.isArray(entries) || entries.length === 0) {
            throw new Error('addStatementRow: entries must be a non-empty array')
        }

        // Ensure the internal structure exists
        if (!this.statementByColumns) {
            this.statementByColumns = {}
        }

        // Track provided fields and detect duplicates
        const seen = new Set<ColumnsType>()

        // We'll need description metadata for amount signing logic
        let descriptionMeta: TransactionDescription | undefined
        let pendingAmount: number | string | Date | undefined

        // First pass: normalize and validate inputs, capture description and amount
        for (const e of entries) {
            const { column } = e
            if (seen.has(column)) {
                throw new Error(`addStatementRow: duplicate column provided: ${column}`)
            }
            seen.add(column)

            switch (column) {
                case ColumnsType.DATE_INSCRIPTION:
                case ColumnsType.DATE_TRANSACTION: {
                    // Accept Date or string; store as en-CA string
                    if (e.value === undefined || e.value === null) {
                        throw new Error('addStatementRow: date value missing')
                    }
                    const d = e.value
                    const asString = d instanceof Date ? d.toLocaleDateString('en-CA') : String(d)
                    const arr = this.statementByColumns[column] ?? (this.statementByColumns[column] = [])
                    arr.push(asString)
                    break
                }
                case ColumnsType.CARD_NUMBER: {
                    const arr = this.statementByColumns[ColumnsType.CARD_NUMBER] ?? (this.statementByColumns[ColumnsType.CARD_NUMBER] = [])
                    // If value not specified, fall back to currently selected card number
                    let value = e.value
                    if (value === undefined || value === null || String(value).trim() === '') {
                        if (!this.cardNumber || String(this.cardNumber).trim() === '') {
                            throw new Error('addStatementRow: CARD_NUMBER value missing and no selected card number available')
                        }
                        value = this.cardNumber
                    }
                    arr.push(String(value))
                    break
                }
                case ColumnsType.DESCRIPTION: {
                    if (e.value === undefined || e.value === null) {
                        throw new Error('addStatementRow: DESCRIPTION value missing')
                    }
                    const descText = String(e.value)
                    // push the text to the DESCRIPTION column
                    const descCol = this.statementByColumns[ColumnsType.DESCRIPTION] ?? (this.statementByColumns[ColumnsType.DESCRIPTION] = [])
                    descCol.push(descText)

                    // try to find metadata for amount sign
                    const trimmed = descText.trim()
                    descriptionMeta = transactionDescriptions.find(td => td.description.trim() === trimmed)
                    break
                }
                case ColumnsType.AMOUNT: {
                    pendingAmount = e.value
                    // defer push until we compute sign (needs description)
                    break
                }
                default:
                    throw new Error(`addStatementRow: unsupported column: ${column}`)
            }
        }

        // If AMOUNT was provided, we must have DESCRIPTION metadata to decide the sign
        if (seen.has(ColumnsType.AMOUNT)) {
            if (!seen.has(ColumnsType.DESCRIPTION)) {
                throw new Error('addStatementRow: AMOUNT provided but DESCRIPTION is missing')
            }
            if (pendingAmount === undefined) {
                throw new Error('addStatementRow: AMOUNT value missing')
            }

            const n = Number(pendingAmount)
            if (Number.isNaN(n)) {
                throw new Error('addStatementRow: AMOUNT must be a number')
            }

            const isExpense = descriptionMeta?.amountOperationType === AmountOperationType.Expanse
            const signed = isExpense ? -Math.abs(n) : Math.abs(n)

            const amtCol = this.statementByColumns[ColumnsType.AMOUNT] ?? (this.statementByColumns[ColumnsType.AMOUNT] = [])
            amtCol.push(signed.toString())
        }

        this.linesCount++

        return this
    }

    /**
     * Adds a recurring transaction for each month within the generator's date range.
     * @param description The transaction description (should match one in transactionDescriptions for correct signing)
     * @param amount The base amount for the transaction
     * @param dayOfMonth The day of the month the transaction occurs (1-31)
     */
    public addRecurringTransactions(
        description: string,
        amount: number,
        dayOfMonth: number
    ): StatementGenerator {
        const current = new Date(this.startDate)
        current.setHours(0, 0, 0, 0)

        while (current <= this.endDate) {
            const transactionDate = new Date(current.getFullYear(), current.getMonth(), dayOfMonth)

            // Ensure transaction date is within the current month and the overall range
            if (
                transactionDate.getMonth() === current.getMonth() &&
                transactionDate >= this.startDate &&
                transactionDate <= this.endDate
            ) {
                const entries: Array<{ column: ColumnsType; value?: string | number | Date }> = [
                    { column: ColumnsType.DESCRIPTION, value: description },
                    { column: ColumnsType.AMOUNT, value: amount },
                    { column: ColumnsType.DATE_TRANSACTION, value: transactionDate },
                    { column: ColumnsType.DATE_INSCRIPTION, value: transactionDate }
                ]

                if (this.columns.includes(ColumnsType.CARD_NUMBER)) {
                    entries.push({ column: ColumnsType.CARD_NUMBER })
                }

                this.addStatementRow(entries)
            }

            // Move to the next month
            current.setMonth(current.getMonth() + 1)
        }

        return this
    }
}
