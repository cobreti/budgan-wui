import 'reflect-metadata'

import { injectable } from 'inversify'
import type { BankAccount, BankAccountTransactionsGroup, TransactionIdsTable } from '@models/BankAccountTypes'
import { InvalidTransactionReason } from '@models/BankAccountTypes'

export interface IBankAccountTransactionsSanitizer {
  initWithAccount(account: BankAccount) : void;
  getTransactionsIdsForAccount(account: BankAccount) : TransactionIdsTable;
  addTransactionsGroup(group: BankAccountTransactionsGroup) : void;

  get transactionsGroups() : BankAccountTransactionsGroup[];
}

@injectable()
export class BankAccountTransactionsSanitizer implements IBankAccountTransactionsSanitizer {

  public accountId : string | undefined;
  public transactionsIds : TransactionIdsTable = {};
  public transactionsGroups : BankAccountTransactionsGroup[] = [];
  public rejectedGroups : BankAccountTransactionsGroup[] = [];

  public initWithAccount(account : BankAccount) : void {
    if (this.accountId != undefined) {
      throw new Error('Account already initialized');
    }

    this.accountId = account.accountId;
    this.transactionsIds = this.getTransactionsIdsForAccount(account);
  }

  public getTransactionsIdsForAccount(account: BankAccount) : TransactionIdsTable {
    return account.transactionsGroups.reduce((acc, group) => {
      group.transactions.forEach((transaction) => {
        acc[transaction.transactionId] = {};
      });
      return acc;
    }, {} as TransactionIdsTable);
  }

  public addTransactionsGroup(group: BankAccountTransactionsGroup) : void {

    //
    // check if group already added first
    //

    const groupIdx = this.transactionsGroups.findIndex((g) => g.id === group.id);
    if (groupIdx >= 0) {
      this.rejectedGroups.push(group);
      return;
    }

    //
    // check if group contains duplicated transactions
    //  and add the groups list
    //

    const newGroup: BankAccountTransactionsGroup = {
      ...group,
      transactions: [],
      invalidTransactions: []
    };

    group.transactions.forEach((transaction) => {
      if (this.transactionsIds[transaction.transactionId]) {
        newGroup.invalidTransactions?.push({
          ...transaction,
          invalidReason: InvalidTransactionReason.duplicate
        });
      } else {
        newGroup.transactions.push(transaction);
        this.transactionsIds[transaction.transactionId] = {};
      }
    });

    this.transactionsGroups.push(newGroup);
  };
}
