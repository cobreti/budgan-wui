import {defineStore} from 'pinia';
import { computed, ref, type Ref } from 'vue'
import type {BankAccount, BankAccountsDictionary} from '@models/BankAccountTypes';

export type AddStatementStore = {
    loading: Ref<boolean>;
    accounts: Ref<BankAccountsDictionary>;
    accountsIds: Ref<string[]>;
    clear: () => void;
    setLoadingFile: (filename: string) => void;
    clearLoadingFileStatus: () => void;
    setBankAccount: (account: BankAccount) => void;
    accountExists: (id: string) => boolean;
    getAccountById: (id: string) => BankAccount | undefined;
};

export const useAddStatementStore = defineStore<string, AddStatementStore>('addStatement',  () => {

    const accounts = ref<BankAccountsDictionary>({});

    const accountsIds = computed(() => Object.keys(accounts.value));

    const loading = ref<boolean>(false);

    function clear() {
        loading.value = false;
        accounts.value = {};
    }

    function setLoadingFile(filename: string) {
        loading.value = true;
    }

    function clearLoadingFileStatus() {
        loading.value = false;
    }

    function setBankAccount(account: BankAccount) {

        accounts.value[account.accountId] = account;
    }

    function getAccountById(id: string): BankAccount | undefined {
        return accounts.value[id];
    }

    function accountExists(id: string):boolean {
        return id in accounts.value;
    }

    return {
        loading,
        accounts,
        accountsIds,
        clear,
        setLoadingFile,
        clearLoadingFileStatus,
        setBankAccount,
        accountExists,
        getAccountById
    }
});
