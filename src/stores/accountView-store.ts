import type { BankAccount, BankAccountTransaction } from '@models/BankAccountTypes'
import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'

export type AccountViewTransaction = BankAccountTransaction & {
    groupId: string
}

export type AccountView = {
    account: BankAccount | undefined
    transactions: AccountViewTransaction[]
}

export type AccountViewStore = {
    accountView: Ref<AccountView>
    setBankAccountFromId: (id: string) => void
    addBankAccount: (bankAccount: BankAccount) => void
    clearAccountView: () => void
}

export const useAccountViewStore = defineStore<string, AccountViewStore>('accountView', () => {
    const bankAccountStore = useBankAccountsStore()

    const accountView = ref<AccountView>({
        account: undefined,
        transactions: []
    })

    function setBankAccountFromId(id: string) {
        const bankAccount = bankAccountStore.getAccountByIdIfExist(id)

        clearAccountView()

        if (bankAccount) {
            addBankAccount(bankAccount)
        }
    }

    function addBankAccount(bankAccount: BankAccount) {
        const transactions = bankAccount.transactionsGroups.reduce(
            (acc: AccountViewTransaction[], group) => {
                const groupId = group.id

                const viewTransactions = group.transactions.reduce(
                    (tacc: AccountViewTransaction[], transaction) => {
                        return [...tacc, { ...transaction, groupId }]
                    },
                    []
                )

                return [...acc, ...viewTransactions]
            },
            []
        )

        accountView.value = {
            account: bankAccount,
            transactions
        }
    }

    function clearAccountView() {
        accountView.value = {
            account: undefined,
            transactions: []
        }
    }

    return {
        accountView,
        setBankAccountFromId,
        addBankAccount,
        clearAccountView
    }
})
