import type { BankAccount } from '@models/BankAccountTypes'
import type { FilteredTransactions } from '@models/FilterTypes'

export function IdentityFilter(account: BankAccount) : FilteredTransactions {
  let minDate: Date | undefined = undefined;
  let maxDate: Date | undefined = undefined;
  const transactions = account.transactions.flatMap(group => {
    minDate = minDate ? (group.dateStart < minDate ? group.dateStart : minDate) : group.dateStart;
    maxDate = maxDate ? (group.dateEnd > maxDate ? group.dateEnd : maxDate) : group.dateEnd;
    return group.transactions.map(transaction => {
      return {
        ...transaction,
        bankAccountId: account.accountId,
        transactionGroupId: group.id
      }
    });
  });

  return {
    dateStart: minDate,
    dateEnd: maxDate,
    transactions
  }
}
