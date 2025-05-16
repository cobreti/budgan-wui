import { defineStore } from 'pinia'
import { computed, type ComputedRef, type Ref, ref } from 'vue'
import type {
    BankAccount,
    BankAccountsDictionary,
    BankAccountTransaction,
    BankAccountTransactionsGroup,
    TransactionIdsTable
} from '@models/BankAccountTypes'

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

const dateUUID = '7f5e8a12-09b3-4dfc-a726-89ed4731cb56'

function AccountReplacer(this: any, key: string, value: any): any {
    if (this[key] instanceof Date) {
        return { type: dateUUID, value: this[key].toISOString() }
    }
    return value
}

function AccountReviver(key: string, value: any): any {
    if (typeof value === 'object' && value['type'] === dateUUID) {
        return new Date(value.value)
    }

    return value
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
            return Object.values(accounts.value)
                .map((account) => {
                    const count = account.transactionsGroups
                        .map((transactionsGroup) => {
                            return transactionsGroup.transactions.length
                        })
                        .reduce((acc, count) => acc + count, 0)
                    return { [account.accountId]: count }
                })
                .reduce((acc, count) => {
                    return { ...acc, ...count }
                }, {})
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

        function sanitizeTransactionsGroup(
            accountTransactionsIds: TransactionIdsTable,
            transactionsGroup: BankAccountTransactionsGroup
        ) {
            const newTransactions = transactionsGroup.transactions.filter((transaction) => {
                return !(transaction.transactionId in accountTransactionsIds)
            })

            return {
                ...transactionsGroup,
                dateStart: transactionsGroup.dateStart,
                dateEnd: transactionsGroup.dateEnd,
                transactions: newTransactions
            } as BankAccountTransactionsGroup
        }

        function addWithBankAccount(account: BankAccount, accountId?: string) {
            const targetAccountId = accountId || account.accountId
            const existingAccount = getAccountById(targetAccountId)
            const accountTransactionsIds = transactionsIdsIndex.value[targetAccountId] || {}

            if (!existingAccount) {
                accounts.value[targetAccountId] = account
            } else {
                for (const transaction of account.transactions) {
                    const transactionId = transaction.transactionId
                    if (transactionId in accountTransactionsIds) {
                        // mark transaction as rejected
                    } else {
                        existingAccount.transactions.push(transaction)
                    }
                }
                // const sanitizedTransactionsGroup = account.transactionsGroups
                //     .map((transactionsGroup) => {
                //         return sanitizeTransactionsGroup(accountTransactionsIds, transactionsGroup)
                //     })
                //     .filter((transactionsGroup) => transactionsGroup.transactions.length > 0)
                //
                // if (sanitizedTransactionsGroup.length > 0) {
                //     existingAccount.transactionsGroups = [
                //         ...existingAccount.transactionsGroups,
                //         ...sanitizedTransactionsGroup
                //     ]
                // }
            }

            const ids = buildTransactionIdsForAccount(account)

            transactionsIdsIndex.value[targetAccountId] = { ...accountTransactionsIds, ...ids }
        }

        function buildTransactionIdsForAccount(account: BankAccount): TransactionIdsTable {
            return account.transactions.reduce((acc: TransactionIdsTable, transaction) => {
                acc[transaction.transactionId] = {}
                return acc
            }, {})
            // return account.transactionsGroups
            //     .map((transactionsGroup) => {
            //         return transactionsGroup.transactions
            //             .map((transaction) => {
            //                 return transaction.transactionId
            //             })
            //             .reduce((acc: TransactionIdsTable, id) => {
            //                 acc[id] = {}
            //                 return acc
            //             }, {})
            //     })
            //     .reduce((acc: TransactionIdsTable, ids) => {
            //         return { ...acc, ...ids }
            //     }, {})
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
                    return JSON.stringify(state, AccountReplacer)
                },
                deserialize: (value) => {
                    return JSON.parse(value, AccountReviver)
                }
            },
            afterRestore(context) {}
        }
    }
)
