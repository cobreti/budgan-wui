import type { BankAccountsDictionary } from '@models/BankAccountTypes'
import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'


export type ImportAccountsStore = {
  accounts: Ref<BankAccountsDictionary>,
  importAccountFromFile: (file: File) => void
}

export const useImportAccountsStore = defineStore<string, ImportAccountsStore>('importAccounts', () => {

  const accounts = ref<BankAccountsDictionary>({});

  function importAccountFromFile(file: File) {
    const reader = new FileReader();

    reader.onload = () => onJsonLoaded(reader.result as string);

    reader.readAsText(file);
  }

  function onJsonLoaded(content: string) {
    const json = JSON.parse(content);

    if (json.accounts) {
      for (const accountId of Object.keys(json.accounts)) {
        accounts.value[accountId] = json.accounts[accountId];
      }
    }
  }

  return {
    accounts,
    importAccountFromFile
  }
});
