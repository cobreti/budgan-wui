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

export declare type AccountToAddDictionary = {[key: string]: AccountToAdd};

export type AddStatementStore = {
    loading: Ref<boolean>;
    accounts: Ref<AccountToAddDictionary>;
    clear: () => void;
    setLoadingFile: (filename: string) => void;
    setBankAccount: (id: string, account: BankAccount) => void;
    accountExists: (id: string) => boolean;
    getAccountById: (id: string) => AccountToAdd | undefined;
};

export const useAddStatementStore = defineStore<string, AddStatementStore>('addStatement',  () => {

    const bankAccountStore = useBankAccountsStore();

    const bankAccountOperations : IBankAccountOperations = container.get(ServicesTypes.BankAccountOperations);

    const accountWithNewTransactionsOnly = ref<BankAccount | undefined>(undefined);

    const accounts = ref<AccountToAddDictionary>({});

    const loading = ref<boolean>(false);

    function clear() {
        loading.value = false;
        accounts.value = {};
    }

    function setLoadingFile(filename: string) {
        loading.value = true;
    }

    function setBankAccount(id: string, account: BankAccount) {
        accounts.value[id] = {
            account: account,
            filename: ''
        };
        // const updatedAccounts = {...accounts.value};
        // updatedAccounts[id] = {
        //     account: account,
        //     filename: ''
        // };
        //
        // accounts.value = updatedAccounts;

        const existingAccount = bankAccountStore.getAccountByIdIfExist(account.accountId);
        if (existingAccount) {
            const transactionsToIgnore = bankAccountOperations.getTransactionsInBothAccounts(account, existingAccount);
            bankAccountOperations.removeTransactionsFromBankAccount(account, transactionsToIgnore);
        }
        else {
            accountWithNewTransactionsOnly.value = account;
        }
    }

    function getAccountById(id: string): AccountToAdd | undefined {
        return accounts.value[id];
    }

    function accountExists(id: string):boolean {
        return id in accounts.value;
    }

    return {
        loading,
        accounts,
        clear,
        setLoadingFile,
        setBankAccount,
        accountExists,
        getAccountById
    }
});
