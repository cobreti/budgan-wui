import type { BankAccount } from './BankAccountTypes'

export type Statement = {
    account: BankAccount
    filename: string
    startDate: Date
    endDate: Date
    numberOfTransactions: number
}

export type StatementsDictionary = { [key: string]: Statement }
