import {defineStore} from 'pinia';
import {ref, type Ref} from 'vue';
import type {BankAccount} from '@models/BankAccountTypes';
import { container } from '@/core/setupInversify';
import { ServicesTypes } from '@/core/services/types';
import type { IBankAccountOperations } from '@/core/services/BankAccountOperations';
import { useBankAccountsStore } from './bankAccounts-store';

export declare type LoadedAccount = {
    loading: boolean,
    account: BankAccount | undefined;
    filename: string | undefined;
}

export declare type AccountToAdd = {
    account: BankAccount;
    filename: string;
}

export type AddStatementStore = {
    loading: Ref<boolean>;
    accounts: Ref<AccountToAdd[]>;
    clear: () => void;
    setLoadingFile: (filename: string) => void;
    setBankAccount: (account: BankAccount) => void;
};

export const useAddStatementStore = defineStore<string, AddStatementStore>('addStatement',  () => {

    const bankAccountStore = useBankAccountsStore();

    const bankAccountOperations : IBankAccountOperations = container.get(ServicesTypes.BankAccountOperations);

    const accountWithNewTransactionsOnly = ref<BankAccount | undefined>(undefined);

    const accounts = ref<AccountToAdd[]>([]);

    const loading = ref<boolean>(false);

    function clear() {
        loading.value = false;
        accounts.value = [];
    }

    function setLoadingFile(filename: string) {
        loading.value = true;
    }

    function setBankAccount(account: BankAccount) {
        accounts.value = [
            ...accounts.value,
            {
                account: account,
                filename: ''
            }
        ]

        const existingAccount = bankAccountStore.getAccountByIdIfExist(account.accountId);
        if (existingAccount) {
            const transactionsToIgnore = bankAccountOperations.getTransactionsInBothAccounts(account, existingAccount);
            bankAccountOperations.removeTransactionsFromBankAccount(account, transactionsToIgnore);
        }
        else {
            accountWithNewTransactionsOnly.value = account;
        }
    }

    return {
        loading,
        accounts,
        clear,
        setLoadingFile,
        setBankAccount
    }
});
