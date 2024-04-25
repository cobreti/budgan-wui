import type { BankAccount } from '@models/BankAccountTypes'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'

export type BankAccountExportFormat = BankAccount & {
  transactionsId: undefined
}

export type BankAccountsExportDictionary = {[key: string]: BankAccountExportFormat};

export type ExportAccountsStore = {
  accounts: Ref<BankAccountsExportDictionary>,
  getSaveBankAccountDataForAllAccounts: (accountsIds: Array<string>) => void,
  clear: () => void
}

export const useExportAccountsStore = defineStore<string, ExportAccountsStore>('exportAccounts', () => {

  const accountsStore = useBankAccountsStore();

  const accounts = ref<BankAccountsExportDictionary>({});

  function getSaveBankAccountData(accountId: string) : BankAccountExportFormat {
    const account = accountsStore.accounts[accountId];

    if (!account) {
      throw new Error(`undefined account ${accountId}`);
    }

    const { transactionsId, ...other } = account;

    return { ...other } as BankAccountExportFormat;
  }

  function getSaveBankAccountDataForAllAccounts(accountsIds: Array<string>) {
    const bankAccounts = accountsStore.accounts;
    const tmpAccount: BankAccountsExportDictionary = {};

    for (const accountId in bankAccounts) {
      if (accountsIds.includes(accountId)) {
        tmpAccount[accountId] = getSaveBankAccountData(accountId);
      }
    }

    accounts.value = tmpAccount;
  }

  function clear() {
    accounts.value = {};
  }

  return {
    accounts,
    getSaveBankAccountDataForAllAccounts,
    clear
  }
});

