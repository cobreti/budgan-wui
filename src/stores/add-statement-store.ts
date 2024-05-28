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

export type AddStatementStore = {
    loadedAccount: Ref<LoadedAccount>;
    accountWithNewTransactionsOnly: Ref<BankAccount | undefined>;
    transactionsToIgnore: Ref<Set<string>>;
    clear: () => void;
    setLoadingFile: (filename: string) => void;
    setBankAccount: (account: BankAccount) => void;
};

export const useAddStatementStore = defineStore<string, AddStatementStore>('addStatement',  () => {

    const bankAccountStore = useBankAccountsStore();

    const bankAccountOperations : IBankAccountOperations = container.get(ServicesTypes.BankAccountOperations);

    const accountWithNewTransactionsOnly = ref<BankAccount | undefined>(undefined);

    const loadedAccount = ref<LoadedAccount>({
        loading: false,
        account: undefined,
        filename: undefined
    });

    const transactionsToIgnore = ref(new Set<string>());

    function clear() {
        loadedAccount.value = {
            loading: false,
            account: undefined,
            filename: undefined
        };
    }

    function setLoadingFile(filename: string) {
        loadedAccount.value = {
            loading: true,
            account: undefined,
            filename: filename
        };
    }

    function setBankAccount(account: BankAccount) {
        loadedAccount.value = {
            ...loadedAccount.value,
            loading: false,
            account: account
        };

        const existingAccount = bankAccountStore.getAccountByIdIfExist(account.accountId);
        if (existingAccount) {
            transactionsToIgnore.value = bankAccountOperations.getTransactionsInBothAccounts(account, existingAccount);
            accountWithNewTransactionsOnly.value = bankAccountOperations.removeTransactionsFromBankAccount(account, transactionsToIgnore.value);
        }
        else {
            transactionsToIgnore.value = new Set();
            accountWithNewTransactionsOnly.value = account;
        }
    }

    return {
        loadedAccount,
        accountWithNewTransactionsOnly,
        transactionsToIgnore,
        clear,
        setLoadingFile,
        setBankAccount
    }
});
