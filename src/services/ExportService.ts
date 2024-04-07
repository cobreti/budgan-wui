import { injectable } from 'inversify'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'
import type { BankAccount } from '@models/BankAccountTypes'


export type BankAccountExportFormat = BankAccount & {
  transactionsId: undefined
}

export type BankAccountsExportDictionary = {[key: string]: BankAccountExportFormat};


export interface IExportService {

  getSaveBankAccountData(accountId: string): BankAccountExportFormat;
  getSaveBankAccountDataForAllAccounts(): { [key: string] : BankAccountsExportDictionary };
}


@injectable()
export class ExportService implements IExportService {

  private accountsStore_ = useBankAccountsStore();

  getSaveBankAccountData(accountId: string) : BankAccountExportFormat {
    const account = this.accountsStore_.accounts[accountId];

    if (!account) {
      throw new Error(`undefined account ${accountId}`);
    }

    const { transactionsId, ...other } = account;

    return { ...other } as BankAccountExportFormat;
  }


  getSaveBankAccountDataForAllAccounts() : { [key: string] : BankAccountsExportDictionary } {
    const accounts = this.accountsStore_.accounts;
    const saveData : BankAccountsExportDictionary = {};

    for (const accountId in accounts) {
      saveData[accountId] = this.getSaveBankAccountData(accountId);
    }

    return saveData;
  }
}
