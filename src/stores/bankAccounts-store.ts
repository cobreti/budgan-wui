import { defineStore } from 'pinia'
import { computed, type ComputedRef, type Ref, ref } from 'vue'
import type {
    BankAccount,
    BankAccountsDictionary,
    TransactionIdsTable
} from '@models/BankAccountTypes'
import { JsonReplacer, JsonReviver } from '@/core/utils/json-utils'

type BankAccountsTransactionIdsIndex = { [accountId: string]: TransactionIdsTable }

export type BankAccountsStore = {
    accounts: Ref<BankAccountsDictionary>
    transactionsIdsIndex: Ref<BankAccountsTransactionIdsIndex>
    totalTransactionsPerAccount: ComputedRef<{ [key: string]: number }>
    totalTransactionIdsPerAccount: ComputedRef<{ [key: string]: number }>
    getAccountById: (accountId: string) => BankAccount
    getAccountByNameIfExists: (accountName: string) => BankAccount | undefined
    getAccountByIdIfExist: (accountId: string) => BankAccount | undefined
    addWithBankAccount: (account: BankAccount, accountId?: string) => void
    hasAccounts: ComputedRef<boolean>
    clear: () => void
    getTransactionsIdsForAccountId: (accountId: string) => TransactionIdsTable
    removeAccount: (accountId: string) => void
}

export const useBankAccountsStore = defineStore<string, BankAccountsStore>(
    'bankTransactions',
    () => {
        const accounts = ref<BankAccountsDictionary>({})
        const transactionsIdsIndex = ref<BankAccountsTransactionIdsIndex>({})

        const hasAccounts = computed(() => {
            return Object.keys(accounts.value).length > 0
        })

        const totalTransactionsPerAccount: ComputedRef<{ [key: string]: number }> = computed(() => {
            return Object.values(accounts.value).reduce(
                (acc, account) => {
                    acc[account.accountId] = account.transactions.length
                    return acc
                },
                {} as { [key: string]: number }
            )
        })

        const totalTransactionIdsPerAccount = computed(() => {
            return Object.keys(transactionsIdsIndex.value)
                .map((accountId) => {
                    return {
                        [accountId]: Object.keys(transactionsIdsIndex.value[accountId]).length
                    }
                })
                .reduce((acc, count) => {
                    return { ...acc, ...count }
                }, {})
        })

        function getAccountById(accountId: string) {
            return accounts.value[accountId]
        }

        function getAccountByNameIfExists(accountName: string): BankAccount | undefined {
            const accountsInfo = Object.values(accounts.value)

            return accountsInfo.find((account) => account.name === accountName)
        }

        function getAccountByIdIfExist(accountId: string) {
            if (accountId in accounts.value) {
                return accounts.value[accountId]
            }
            return undefined
        }

        // function sanitizeTransactionsGroup(
        //     accountTransactionsIds: TransactionIdsTable,
        //     transactionsGroup: BankAccountTransactionsGroup
        // ) {
        //     return {
        //         ...transactionsGroup,
        //         dateStart: transactionsGroup.dateStart,
        //         dateEnd: transactionsGroup.dateEnd
        //     } as BankAccountTransactionsGroup
        // }

        function addWithBankAccount(account: BankAccount, accountId?: string) {
            const targetAccountId = accountId || account.accountId
            const existingAccount = getAccountById(targetAccountId)
            const accountTransactionsIds = transactionsIdsIndex.value[targetAccountId] || {}

            if (!existingAccount) {
                // Sort the new account's transactions by date in ascending order
                account.transactions.sort(
                    (a, b) => a.dateInscription.getTime() - b.dateInscription.getTime()
                )
                accounts.value[targetAccountId] = account
            } else {
                // Create array of new transactions (excluding duplicates)
                const newTransactions = []

                for (const transaction of account.transactions) {
                    const transactionId = transaction.transactionId
                    if (transactionId in accountTransactionsIds) {
                        // mark transaction as rejected
                    } else {
                        newTransactions.push(transaction)
                    }
                }

                // Add new transactions to existing ones
                if (newTransactions.length > 0) {
                    // Combine existing and new transactions
                    const allTransactions = [...existingAccount.transactions, ...newTransactions]

                    // Sort all transactions by date in ascending order
                    allTransactions.sort(
                        (a, b) => a.dateInscription.getTime() - b.dateInscription.getTime()
                    )

                    // Replace the existing transactions array with the sorted one
                    existingAccount.transactions = allTransactions
                }
            }

            const ids = buildTransactionIdsForAccount(account)

            transactionsIdsIndex.value[targetAccountId] = { ...accountTransactionsIds, ...ids }
        }

        function buildTransactionIdsForAccount(account: BankAccount): TransactionIdsTable {
            return account.transactions.reduce((acc: TransactionIdsTable, transaction) => {
                acc[transaction.transactionId] = {}
                return acc
            }, {})
        }

        function getTransactionsIdsForAccountId(accountId: string): TransactionIdsTable {
            if (!(accountId in transactionsIdsIndex.value)) {
                return {}
            }

            return transactionsIdsIndex.value[accountId]
        }

        function removeAccount(accountId: string): void {
            if (accountId in accounts.value) {
                delete accounts.value[accountId]
                delete transactionsIdsIndex.value[accountId]
            }
        }

        function clear() {
            accounts.value = {}
        }

        return {
            accounts,
            transactionsIdsIndex,
            totalTransactionsPerAccount,
            totalTransactionIdsPerAccount,
            getAccountById,
            getAccountByNameIfExists,
            getAccountByIdIfExist,
            addWithBankAccount,
            hasAccounts,
            clear,
            getTransactionsIdsForAccountId,
            removeAccount
        }
    },
    {
        persist: {
            paths: ['accounts'],
            storage: localStorage,
            serializer: {
                serialize: (state) => {
                    return JSON.stringify(state, JsonReplacer)
                },
                deserialize: (value) => {
                    return JSON.parse(value, JsonReviver)
                }
            },
            afterRestore(context) {}
        }
    }
)
