import 'reflect-metadata'

import { type IOfxToBankAccount } from './OfxToBankAccount'
import { inject, injectable } from 'inversify'
import { ServicesTypes } from './types'
import type { BankAccount, BankAccountsDictionary } from '@models/BankAccountTypes'
import type { IBankAccountOperations } from './BankAccountOperations'
import type { BankAccountTransactionsSanitizerFactory } from './BankAccountTransactionsSanitizerFactory'
import type { ICsvToBankAccount } from '@services/CsvToBankAccount'
import type { IStreamFactory } from '@services/StreamFactory'
import type { ICsvParser } from '@services/CsvParser'
import { type CSVColumnContentMapping } from '@models/csvDocument'

export type BankAccountListById = { [id: string]: BankAccount[] }

export type Statement = {
    account: BankAccount
    filename: string
    startDate: Date
    endDate: Date
    numberOfTransactions: number
}

export interface IBankAccountLoader {
    loadingFileStarted: BankAccountLoader_LoadingFileStarted | undefined
    accountLoaded: BankAccountLoader_AccountLoaded | undefined

    load(files: File[]): Promise<Statement[]>
    loadWithAccount(
        account: BankAccount,
        mapping: CSVColumnContentMapping,
        files: File[]
    ): Promise<Statement[]>
    sanitize(accounts: BankAccountsDictionary): void

    get accountsById(): BankAccountsDictionary
    get statements(): Statement[]
}

export type BankAccountLoader_LoadingFileStarted = (filename: string) => void
export type BankAccountLoader_AccountLoaded = (account: BankAccount) => void
export type BankAccountLoader_AccountLoadError = (filename: string, error: unknown) => void

@injectable()
export class BankAccountLoader implements IBankAccountLoader {
    rawAccountsLoadedById: BankAccountListById = {}
    sanitizedAccountsById: BankAccountsDictionary = {}
    private statementsArray: Statement[] = []

    loadingFileStarted: BankAccountLoader_LoadingFileStarted | undefined
    accountLoaded: BankAccountLoader_AccountLoaded | undefined
    accountLoadError: BankAccountLoader_AccountLoadError | undefined

    constructor(
        @inject(ServicesTypes.OfxToBankAccount) private ofxToBankAccount: IOfxToBankAccount,
        @inject(ServicesTypes.CsvToBankAccount) private csvToBankAccount: ICsvToBankAccount,
        @inject(ServicesTypes.BankAccountOperations)
        private bankAccountOperations: IBankAccountOperations,
        @inject(ServicesTypes.BankAccountTransactionsSanitizerFactory)
        private bankAccountTransactionsSanitizerFactory: BankAccountTransactionsSanitizerFactory,
        @inject(ServicesTypes.StreamFactory) private streamFactory: IStreamFactory,
        @inject(ServicesTypes.CsvParser) private csvParser: ICsvParser
    ) {}

    get accountsById(): BankAccountsDictionary {
        return this.sanitizedAccountsById
    }

    get statements(): Statement[] {
        return this.statementsArray
    }

    public async load(files: File[]): Promise<Statement[]> {
        this.statementsArray = []

        for (const file of files) {
            this.loadingFileStarted && this.loadingFileStarted(file.name)

            try {
                const account = await this.loadFile(file)
                if (account.transactionsGroups.length > 0) {
                    account.transactionsGroups[0].filename = file.name
                }

                const accountId = account.accountId

                const accountsForId = this.rawAccountsLoadedById[accountId] || []
                accountsForId.push(account)
                this.rawAccountsLoadedById[accountId] = accountsForId

                // Create a statement for this file only if there are transactions
                if (account.transactions.length > 0) {
                    const statement = this.createStatementFromAccount(account, file.name)
                    this.statementsArray.push(statement)
                }

                this.accountLoaded && this.accountLoaded(account)
            } catch (error) {
                this.accountLoadError && this.accountLoadError(file.name, error)
            }
        }

        return this.statementsArray
    }

    public async loadWithAccount(
        account: BankAccount,
        csvMapping: CSVColumnContentMapping,
        files: File[]
    ): Promise<Statement[]> {
        this.statementsArray = []

        for (const file of files) {
            this.loadingFileStarted && this.loadingFileStarted(file.name)

            try {
                const resultAccount = await this.loadFileWithAccount(account, csvMapping, file)
                if (resultAccount.transactionsGroups.length > 0) {
                    resultAccount.transactionsGroups[0].filename = file.name
                }

                const accountId = resultAccount.accountId

                const accountsForId = this.rawAccountsLoadedById[accountId] || []
                accountsForId.push(resultAccount)
                this.rawAccountsLoadedById[accountId] = accountsForId

                // Create a statement for this file only if there are transactions
                if (resultAccount.transactions.length > 0) {
                    const statement = this.createStatementFromAccount(resultAccount, file.name)
                    this.statementsArray.push(statement)
                }

                this.accountLoaded && this.accountLoaded(resultAccount)
            } catch (error) {
                this.accountLoadError && this.accountLoadError(file.name, error)
            }
        }

        return this.statementsArray
    }

    private createStatementFromAccount(account: BankAccount, filename: string): Statement {
        if (account.transactions.length === 0) {
            throw new Error('Cannot create statement from account with no transactions')
        }

        const transactions = account.transactions
        const startDate = new Date(
            Math.min(...transactions.map((t) => t.dateInscription.getTime()))
        )
        const endDate = new Date(Math.max(...transactions.map((t) => t.dateInscription.getTime())))

        return {
            account: {
                ...account,
                transactions: account.transactions,
                transactionsGroups: account.transactionsGroups
            },
            filename: filename,
            startDate: startDate,
            endDate: endDate,
            numberOfTransactions: account.transactions.length
        }
    }

    public async loadFile(file: File): Promise<BankAccount> {
        const reOfx = /\.ofx$/i
        const reCsv = /\.csv$/i

        if (reOfx.test(file.name)) {
            return await this.ofxToBankAccount.loadOfxFile(file)
        } else if (reCsv.test(file.name)) {
            return await this.csvToBankAccount.loadCsvFile(file)
        } else {
            throw new Error('Unsupported file type')
        }
    }

    public async loadFileWithAccount(
        account: BankAccount,
        csvMapping: CSVColumnContentMapping,
        file: File
    ): Promise<BankAccount> {
        const reOfx = /\.ofx$/i
        const reCsv = /\.csv$/i

        if (reOfx.test(file.name)) {
            return await this.ofxToBankAccount.loadOfxFile(file)
        } else if (reCsv.test(file.name)) {
            return this.csvFileToBankAccount(account, csvMapping, file)
        } else {
            throw new Error('Unsupported file type')
        }
    }

    public async csvFileToBankAccount(
        account: BankAccount,
        csvMapping: CSVColumnContentMapping,
        file: File
    ): Promise<BankAccount> {
        const inputStream = this.streamFactory.createFileReader(file)

        const text = await inputStream.read()

        this.csvParser.minimumColumnsCount = 3
        const csvResult = this.csvParser.parse(text)

        const result = this.csvToBankAccount.convertToBankAccountTransactionsGroup(
            csvResult.content,
            csvMapping
        )

        if (result == undefined) {
            throw new Error('Unable to convert CSV file to transactions group')
        }

        return {
            name: account.name,
            accountId: account.accountId,
            accountType: account.accountType,
            transactionsGroups: [result.transactionsGroup],
            transactions: result.transactions
        } as BankAccount
    }

    public sanitize(accounts: BankAccountsDictionary) {
        const newAccounts = this.combineAndSortTransactionsGroups()

        this.sanitizedAccountsById = this.sanitizeNewAccounts(accounts, newAccounts)
    }

    public combineAndSortTransactionsGroups(): BankAccountsDictionary {
        const accountsById: BankAccountsDictionary = {}

        for (const accountId in this.rawAccountsLoadedById) {
            const loadedAccounts = this.rawAccountsLoadedById[accountId]
            const combinedGroups = this.bankAccountOperations.getCombinedTransactionsGroup(
                ...loadedAccounts
            )
            const sortedGroups =
                this.bankAccountOperations.sortTransactionsGroupByStartDateAscending(combinedGroups)
            const account = loadedAccounts[0]
            accountsById[account.accountId] = {
                ...account,
                transactionsGroups: sortedGroups
            }
        }

        return accountsById
    }

    public sanitizeNewAccounts(
        existingAccounts: BankAccountsDictionary,
        newAccounts: BankAccountsDictionary
    ): BankAccountsDictionary {
        const sanitizedAccountsById: BankAccountsDictionary = {}

        for (const id in newAccounts) {
            const sanitizer = this.bankAccountTransactionsSanitizerFactory.create(
                existingAccounts[id]
            )

            const account = newAccounts[id]
            sanitizer.addTransactions(account.transactions)
            account.transactions = sanitizer.transactions

            sanitizedAccountsById[id] = account
        }

        return sanitizedAccountsById
    }
}
