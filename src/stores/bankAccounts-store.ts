import { defineStore } from 'pinia'
import { computed, type ComputedRef, type Ref, ref } from 'vue'
import type {
    BankAccount, BankAccountsDictionary,
    BankAccountTransaction,
    BankAccountTransactionsGroup,
    TransactionIdsTable
} from '@models/BankAccountTypes';


type BankAccountsTransactionIdsIndex = {[accountId: string]: TransactionIdsTable};

export type BankAccountsStore = {
    accounts: Ref<BankAccountsDictionary>;
    transactionsIdsIndex: Ref<BankAccountsTransactionIdsIndex>;
    totalTransactionsPerAccount: ComputedRef<{[key:string]: number }>;
    totalTransactionIdsPerAccount: ComputedRef<{[key:string]: number }>;
    getAccountById: (accountId: string) => BankAccount;
    getAccountByNameIfExists: (accountName: string) => BankAccount | undefined;
    getAccountByIdIfExist: (accountId: string) => BankAccount | undefined;
    addWithBankAccount: (account: BankAccount, accountId? : string) => void;
    hasAccounts: ComputedRef<boolean>;
    clear: () => void;
    getTransactionsIdsForAccountId: (accountId: string) => TransactionIdsTable;
}

export const useBankAccountsStore = defineStore<string, BankAccountsStore>('bankTransactions',  () => {

    const accounts = ref<BankAccountsDictionary>({});
    const transactionsIdsIndex = ref<BankAccountsTransactionIdsIndex>({});

    const hasAccounts = computed(() => {
        return Object.keys(accounts.value).length > 0;
    });

    const totalTransactionsPerAccount: ComputedRef<{[key: string]: number}> = computed(() => {
        return Object.values(accounts.value)
          .map((account) => {
              const count = account.transactionsGroups.map((transactionsGroup) => {
                  return transactionsGroup.transactions.length;
              })
                .reduce((acc, count) => acc + count, 0);
              return { [account.accountId]: count}
          })
          .reduce((acc, count) => {
              return {...acc, ...count};
          }, {});
    });

    const totalTransactionIdsPerAccount = computed(() => {
        return Object.keys(transactionsIdsIndex.value)
          .map((accountId) => {
              return { [accountId]: Object.keys(transactionsIdsIndex.value[accountId]).length};
          })
          .reduce((acc, count) => {
              return {...acc, ...count};
          }, {});
    });

    function getAccountById(accountId: string) {
            return accounts.value[accountId];
    }

    function getAccountByNameIfExists(accountName: string) : BankAccount | undefined {
        const accountsInfo = Object.values(accounts.value);

        return accountsInfo.find((account) => account.name === accountName);
    }

    function getAccountByIdIfExist(accountId: string) {
        if (accountId in accounts.value) {
            return accounts.value[accountId];
        }
        return undefined;
    }

    function sanitizeTransactionsGroup(accountTransactionsIds: TransactionIdsTable, transactionsGroup: BankAccountTransactionsGroup) {

        const newTransactions = transactionsGroup.transactions.filter((transaction) => {
            return !(transaction.transactionId in accountTransactionsIds);
        });

        return {
            ...transactionsGroup,
            dateStart: transactionsGroup.dateStart,
            dateEnd: transactionsGroup.dateEnd,
            transactions: newTransactions
        } as BankAccountTransactionsGroup;
    }

    function addWithBankAccount(account: BankAccount, accountId? : string) {

        const targetAccountId = accountId || account.accountId;
        const existingAccount = getAccountById(targetAccountId);
        const accountTransactionsIds = transactionsIdsIndex.value[targetAccountId] || {};

        if (!existingAccount) {
            accounts.value[targetAccountId] = account;
        }
        else {
            const sanitizedTransactionsGroup = account.transactionsGroups.map((transactionsGroup) => {
                return sanitizeTransactionsGroup(accountTransactionsIds, transactionsGroup);
            })
              .filter((transactionsGroup) => transactionsGroup.transactions.length > 0);

            if (sanitizedTransactionsGroup.length > 0) {
                existingAccount.transactionsGroups = [...existingAccount.transactionsGroups, ...sanitizedTransactionsGroup];
            }
        }

        const ids = buildTransactionIdsForAccount(account);

        transactionsIdsIndex.value[targetAccountId] = {...accountTransactionsIds, ...ids};
    }

    function buildTransactionIdsForAccount(account: BankAccount) : TransactionIdsTable {
        return account.transactionsGroups.map((transactionsGroup) => {
            return transactionsGroup.transactions.map((transaction) => {
                return transaction.transactionId;
            })
              .reduce((acc: TransactionIdsTable, id) => {
                acc[id] = {};
                return acc;
            }, {});
        })
          .reduce((acc: TransactionIdsTable, ids) => {
            return {...acc, ...ids};
        }, {});
    }

    function getTransactionsIdsForAccountId(accountId: string) : TransactionIdsTable {
        if ( !(accountId in transactionsIdsIndex.value) ) {
            return {};
        }

        return transactionsIdsIndex.value[accountId];
    }

    function clear() {
        accounts.value = {};
    }

    return {
        accounts,
        transactionsIdsIndex,
        totalTransactionsPerAccount,
        totalTransactionIdsPerAccount,
        getAccountById,
        getAccountByNameIfExists,
        getAccountByIdIfExist,
        addWithBankAccount,
        hasAccounts,
        clear,
        getTransactionsIdsForAccountId
    }
}, {
    persist: {
        storage: sessionStorage,
        afterRestore(context) {
            const accounts = context.store.accounts;

            for (const accountId in accounts) {
                const account = accounts[accountId];
                account.transactionsGroups = account.transactionsGroups.map((transactionsGroup : BankAccountTransactionsGroup) => {
                    return {
                        ...transactionsGroup,
                        dateStart: new Date(transactionsGroup.dateStart),
                        dateEnd: new Date(transactionsGroup.dateEnd),
                        transactions: transactionsGroup.transactions.map((transaction :BankAccountTransaction) => {
                            return {
                                ...transaction,
                                date: new Date(transaction.dateInscription)
                            };
                        })
                    };
                });
            }
        }
    }
});
