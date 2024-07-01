import type { BankAccountTransactionsGroup } from '@models/BankAccountTypes'

export const transactionsGroup_test1_success_input: BankAccountTransactionsGroup = {
  name: 'Group 1',
  id: '1',
  dateStart: new Date('2022-01-01'),
  dateEnd: new Date('2022-01-31'),
  transactions: [
    {
      transactionId: '10',
      date: new Date('2022-01-01'),
      amount: 100,
      type: 'Deposit',
      description: 'Deposit 1'
    },
    {
      transactionId: '11',
      date: new Date('2022-01-02'),
      amount: 100,
      type: 'Deposit',
      description: 'Deposit 2'
    },
  ]
};

export const transactionsGroup_test1_expected_transactionsIds = {
  '10': {},
  '11': {},
}

export const transactionsGroups_test1_expected: BankAccountTransactionsGroup[] = [
  {
    name: 'Group 1',
    id: '1',
    dateStart: new Date('2022-01-01'),
    dateEnd: new Date('2022-01-31'),
    transactions: [
      {
        transactionId: '10',
        date: new Date('2022-01-01'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 1'
      },
      {
        transactionId: '11',

        date: new Date('2022-01-02'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 2'
      },
    ],
    invalidTransactions: []
  }
];

