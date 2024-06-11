import type {BankAccount, BankAccountTransaction} from '@models/BankAccountTypes';
import {defineStore} from 'pinia';
import {type Ref, ref} from 'vue';

export type AccountViewTransaction = BankAccountTransaction & {
    groupId: string;
}

export type AccountView = {
    account: BankAccount | undefined;
    transactions: AccountViewTransaction[];
}

export type AccountViewStore = {
    accountView: Ref<AccountView>;
    addBankAccount: (bankAccount: BankAccount) => void;
    clearAccountView: () => void;
};


export const useAccountViewStore = defineStore<string, AccountViewStore>('accountView',  () => {

    const accountView = ref<AccountView>({
        account: undefined,
        transactions: []
    });

    function addBankAccount(bankAccount: BankAccount) {

        const transactions = bankAccount.transactionsGroups.reduce((acc: AccountViewTransaction[], group) => {
            const groupId = group.id;

            const viewTransactions = group.transactions.reduce((tacc: AccountViewTransaction[], transaction) => {
                return [...tacc, {...transaction, groupId}];
            }, []);

            return [...acc, ...viewTransactions];
        }, []);

        accountView.value = {
            account: bankAccount,
            transactions
        };
    }

    function clearAccountView() {
        accountView.value = {
            account: undefined,
            transactions: []
        };
    }

    return {
        accountView,
        addBankAccount,
        clearAccountView
    };
});
