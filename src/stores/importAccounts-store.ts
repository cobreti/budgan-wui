import type { BankAccountsDictionary } from '@models/BankAccountTypes'
import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'


export type ImportAccountsStore = {
  accounts: Ref<BankAccountsDictionary>;
  hasAccounts: Ref<boolean>;
  importAccountFromFile: (file: File) => Promise<void>;
  clear: () => void;
}

export const useImportAccountsStore = defineStore<string, ImportAccountsStore>('importAccounts', () => {

  const accounts = ref<BankAccountsDictionary>({});

  const hasAccounts = computed(() => {
    return Object.keys(accounts.value).length > 0;
  });

  function importAccountFromFile(file: File) : Promise<void> {
    return new Promise((resolve) => {

      function onJsonLoaded(content: string) {
        const json = JSON.parse(content);

        const loadedAccounts : BankAccountsDictionary = {};

        if (json.accounts) {
          for (const accountId of Object.keys(json.accounts)) {
            loadedAccounts[accountId] = json.accounts[accountId];
          }
        }

        accounts.value = loadedAccounts;
        resolve();
      }

      const reader = new FileReader();

      reader.onload = () => onJsonLoaded(reader.result as string);

      reader.readAsText(file);
    });
  }

  function clear()
  {
    accounts.value = {};
  }

  return {
    accounts,
    hasAccounts,
    importAccountFromFile,
    clear
  }
});
