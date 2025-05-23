import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAddStatementStore, type Statement } from '../add-statement-store'
import type { BankAccount } from '@models/BankAccountTypes'

// Mock BankAccount data
const mockBankAccount1: BankAccount = {
    accountId: 'account-1',
    name: 'Checking Account',
    accountType: 'checking',
    csvSettingId: 'csv-1',
    transactions: [],
    transactionsGroups: []
}

const mockBankAccount2: BankAccount = {
    accountId: 'account-2',
    name: 'Savings Account',
    accountType: 'savings',
    csvSettingId: 'csv-2',
    transactions: [],
    transactionsGroups: []
}

const mockStatement1: Statement = {
    account: mockBankAccount1,
    filename: 'statement1.csv',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    numberOfTransactions: 10
}

const mockStatement2: Statement = {
    account: mockBankAccount2,
    filename: 'statement2.csv',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-29'),
    numberOfTransactions: 15
}

const mockStatement3: Statement = {
    account: mockBankAccount1,
    filename: 'statement3.csv',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    numberOfTransactions: 20
}

describe('AddStatementStore', () => {
    let store: ReturnType<typeof useAddStatementStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useAddStatementStore()
    })

    describe('Basic functionality', () => {
        it('should initialize with empty statements', () => {
            expect(store.statements).toEqual({})
            expect(store.loading).toBe(false)
        })

        it('should add a single statement', () => {
            store.setStatement(mockStatement1)

            const statements = Object.values(store.statements)
            expect(statements).toHaveLength(1)
            expect(statements[0]).toEqual(mockStatement1)
        })

        it('should add multiple statements', () => {
            store.setStatement(mockStatement1)
            store.setStatement(mockStatement2)
            store.setStatement(mockStatement3)

            const statements = Object.values(store.statements)
            expect(statements).toHaveLength(3)

            // Check each statement is present
            const filenames = statements.map((s) => s.filename)
            expect(filenames).toContain('statement1.csv')
            expect(filenames).toContain('statement2.csv')
            expect(filenames).toContain('statement3.csv')
        })

        it('should generate unique IDs for statements', () => {
            store.setStatement(mockStatement1)
            store.setStatement(mockStatement3) // Same account, different file

            const statementIds = Object.keys(store.statements)
            expect(statementIds).toHaveLength(2)
            expect(statementIds[0]).not.toEqual(statementIds[1])

            // Both should contain the account ID and filename
            expect(statementIds[0]).toContain('account-1')
            expect(statementIds[0]).toContain('statement1.csv')
            expect(statementIds[1]).toContain('account-1')
            expect(statementIds[1]).toContain('statement3.csv')
        })
    })

    describe('Statement retrieval', () => {
        beforeEach(() => {
            store.setStatement(mockStatement1)
            store.setStatement(mockStatement2)
            store.setStatement(mockStatement3)
        })

        it('should get statement by ID', () => {
            const statementIds = Object.keys(store.statements)
            const firstId = statementIds[0]

            const statement = store.getStatementById(firstId)
            expect(statement).toBeDefined()
            expect(statement?.filename).toBe(store.statements[firstId].filename)
        })

        it('should return undefined for non-existent statement ID', () => {
            const statement = store.getStatementById('non-existent-id')
            expect(statement).toBeUndefined()
        })

        it('should get all statements', () => {
            const allStatements = store.getAllStatements()
            expect(allStatements).toHaveLength(3)

            const filenames = allStatements.map((s) => s.filename)
            expect(filenames).toContain('statement1.csv')
            expect(filenames).toContain('statement2.csv')
            expect(filenames).toContain('statement3.csv')
        })

        it('should get account by ID', () => {
            const account1 = store.getAccountById('account-1')
            expect(account1).toBeDefined()
            expect(account1?.accountId).toBe('account-1')

            const account2 = store.getAccountById('account-2')
            expect(account2).toBeDefined()
            expect(account2?.accountId).toBe('account-2')

            const nonExistent = store.getAccountById('non-existent')
            expect(nonExistent).toBeUndefined()
        })

        it('should check if statement exists', () => {
            const statementIds = Object.keys(store.statements)
            const firstId = statementIds[0]

            expect(store.statementExists(firstId)).toBe(true)
            expect(store.statementExists('non-existent-id')).toBe(false)
        })
    })

    describe('Statement removal', () => {
        beforeEach(() => {
            store.setStatement(mockStatement1)
            store.setStatement(mockStatement2)
            store.setStatement(mockStatement3)
        })

        it('should remove a statement by ID', () => {
            const statementIds = Object.keys(store.statements)
            const idToRemove = statementIds[0]

            expect(store.statements[idToRemove]).toBeDefined()
            store.removeStatement(idToRemove)
            expect(store.statements[idToRemove]).toBeUndefined()

            // Should have 2 statements remaining
            expect(Object.keys(store.statements)).toHaveLength(2)
        })

        it('should handle removal of non-existent statement gracefully', () => {
            const initialCount = Object.keys(store.statements).length
            store.removeStatement('non-existent-id')

            // Should not affect existing statements
            expect(Object.keys(store.statements)).toHaveLength(initialCount)
        })
    })

    describe('Loading state', () => {
        it('should manage loading state', () => {
            expect(store.loading).toBe(false)

            store.setLoadingFile('test.csv')
            expect(store.loading).toBe(true)

            store.clearLoadingFileStatus()
            expect(store.loading).toBe(false)
        })
    })

    describe('Clear functionality', () => {
        beforeEach(() => {
            store.setStatement(mockStatement1)
            store.setStatement(mockStatement2)
            store.setLoadingFile('test.csv')
        })

        it('should clear all statements and reset loading state', () => {
            expect(Object.keys(store.statements)).toHaveLength(2)
            expect(store.loading).toBe(true)

            store.clear()

            expect(store.statements).toEqual({})
            expect(store.loading).toBe(false)
        })
    })

    describe('Multiple statements with same account', () => {
        it('should support multiple statements for the same account', () => {
            store.setStatement(mockStatement1) // account-1, statement1.csv
            store.setStatement(mockStatement3) // account-1, statement3.csv

            const statements = Object.values(store.statements)
            expect(statements).toHaveLength(2)

            // Both should be for the same account
            expect(statements[0].account.accountId).toBe('account-1')
            expect(statements[1].account.accountId).toBe('account-1')

            // But different filenames
            const filenames = statements.map((s) => s.filename)
            expect(filenames).toContain('statement1.csv')
            expect(filenames).toContain('statement3.csv')
        })

        it('should generate unique IDs even for same account with different files', () => {
            store.setStatement(mockStatement1)
            store.setStatement(mockStatement3)

            const statementIds = Object.keys(store.statements)
            expect(statementIds).toHaveLength(2)
            expect(statementIds[0]).not.toEqual(statementIds[1])
        })
    })

    describe('Statement ID format', () => {
        it('should generate statement IDs with expected format', () => {
            store.setStatement(mockStatement1)

            const statementIds = Object.keys(store.statements)
            const statementId = statementIds[0]

            // Should contain account ID, filename, and timestamp
            expect(statementId).toContain('account-1')
            expect(statementId).toContain('statement1.csv')
            expect(statementId).toMatch(/_\d+$/) // ends with timestamp
        })
    })
})
