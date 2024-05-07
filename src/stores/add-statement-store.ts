import {defineStore} from 'pinia';
import {ref, type Ref} from 'vue';
import type {BankAccount} from '@models/BankAccountTypes';

export declare type LoadedAccount = {
    loading: boolean,
    account: BankAccount | undefined;
    filename: string | undefined;
}

export type AddStatementStore = {
    loadedAccount: Ref<LoadedAccount>;
    clear: () => void;
    setLoadingFile: (filename: string) => void;
    setBankAccount: (account: BankAccount) => void;
};

export const useAddStatementStore = defineStore<string, AddStatementStore>('addStatement',  () => {

    const loadedAccount = ref<LoadedAccount>({
        loading: false,
        account: undefined,
        filename: undefined
    });

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
    }

    return {
        loadedAccount,
        clear,
        setLoadingFile,
        setBankAccount
    }
});
