import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { BankAccount } from '@models/BankAccountTypes'
import { BankAccountTransactionsSanitizer } from '@services/BankAccountTransactionsSanitizer'
import {
    transactionsGroup_test1_expected_transactionsIds,
    transactionsGroup_test1_success_input,
    transactionsGroups_test1_expected,
    transactionsGroups_test3_existing_transactions
} from '@services/tests-files/BankAccountTransactionsSanitizer/addTransactionsGroup-test-data'

describe('BankAccountTransactionsSanitizer', () => {
    let sanitizer: BankAccountTransactionsSanitizer

    beforeEach(async () => {
        sanitizer = new BankAccountTransactionsSanitizer()
    })

    afterEach(async () => {
        vi.resetAllMocks()
    })

    describe('initWithAccount', () => {
        test('should set accountId_', async () => {
            // Arrange
            const account: BankAccount = {
                name: 'name',
                accountId: 'accountId',
                accountType: 'accountType',
                transactionsGroups: [],
                transactions: []
            }

            // Act
            sanitizer.initWithAccount(account)

            // Assert
            expect(sanitizer.accountId).toBe('accountId')
            expect(sanitizer.transactionsGroups).toEqual([])
            expect(sanitizer.transactionsIds).toEqual({})
        })

        test('should throw error if accountId_ is already set', async () => {
            // Arrange
            const account: BankAccount = {
                name: 'name',
                accountId: 'accountId',
                accountType: 'accountType',
                transactionsGroups: [],
                transactions: []
            }

            // Act
            sanitizer.accountId = 'otheraccountId'

            // Assert
            expect(() => sanitizer.initWithAccount(account)).toThrowError(
                'Account already initialized'
            )
        })
    })

    describe('addTransactionsGroup', () => {
        test('add group to transactionsGroups_', async () => {
            sanitizer.addTransactionsGroup(transactionsGroup_test1_success_input)

            expect(sanitizer.transactionsGroups).toEqual(transactionsGroups_test1_expected)
            expect(sanitizer.transactionsIds).toEqual(
                transactionsGroup_test1_expected_transactionsIds
            )
            expect(sanitizer.rejectedGroups).toEqual([])
        })

        test('group id is the same as existing one', () => {
            sanitizer.transactionsGroups = transactionsGroups_test3_existing_transactions

            sanitizer.addTransactionsGroup(transactionsGroup_test1_success_input)

            expect(sanitizer.transactionsIds).toEqual({})
            expect(sanitizer.transactionsGroups).toEqual(
                transactionsGroups_test3_existing_transactions
            )
            expect(sanitizer.rejectedGroups).toEqual([transactionsGroup_test1_success_input])
        })
    })
})
