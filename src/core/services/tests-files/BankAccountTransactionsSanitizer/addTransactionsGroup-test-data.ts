import type { BankAccountTransactionsGroup } from '@models/BankAccountTypes'
import { InvalidTransactionReason } from '@models/BankAccountTypes'

//
// test 1 : add new transactions group with no duplicated transactions
//

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

//
//  test 2 : add new transactions group with some duplicated transactions
//

export const transactionsGroups_test2_existing_transactions : BankAccountTransactionsGroup[] = [
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

export const transactionsGroup_test2_existing_transactionsIds = {
  '10': {},
  '11': {},
}

export const transactionsGroup_test2_input: BankAccountTransactionsGroup = {
  name: 'Group 2',
  id: '2',
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
    {
      transactionId: '12',
      date: new Date('2022-01-03'),
      amount: 100,
      type: 'Deposit',
      description: 'Deposit 3'
    },
    {
      transactionId: '13',
      date: new Date('2022-01-04'),
      amount: 100,
      type: 'Deposit',
      description: 'Deposit 4'
    },
    {
      transactionId: '14',
      date: new Date('2022-01-05'),
      amount: 100,
      type: 'Deposit',
      description: 'Deposit 5'
    },
  ],
  invalidTransactions: []
};

export const transactionsGroup_test2_expected: BankAccountTransactionsGroup[] = [
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
  },
  {
    name: 'Group 2',
    id: '2',
    dateStart: new Date('2022-01-01'),
    dateEnd: new Date('2022-01-31'),
    transactions: [
      {
        transactionId: '12',
        date: new Date('2022-01-03'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 3'
      },
      {
        transactionId: '13',
        date: new Date('2022-01-04'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 4'
      },
      {
        transactionId: '14',
        date: new Date('2022-01-05'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 5'
      },
    ],
    invalidTransactions: [
      {
        transactionId: '10',
        date: new Date('2022-01-01'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 1',
        invalidReason: InvalidTransactionReason.duplicate
      },
      {
        transactionId: '11',
        date: new Date('2022-01-02'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 2',
        invalidReason: InvalidTransactionReason.duplicate
      }
    ]
  }
];

export const transactionsGroup_test2_resulting_transactionIds = {
  '10': {},
  '11': {},
  '12': {},
  '13': {},
  '14': {},
}

//
// test 3 : add new transactions group that has the same id as an existing group
//

export const transactionsGroups_test3_existing_transactions : BankAccountTransactionsGroup[] = [
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

export const transactionsGroups_test3_input : BankAccountTransactionsGroup = {
  name: 'Group 1',
  id: '1',
  dateStart: new Date('2022-01-01'),
  dateEnd: new Date('2022-01-31'),
  transactions: [
    {
      transactionId: '12',
      date: new Date('2022-01-01'),
      amount: 100,
      type: 'Deposit',
      description: 'Deposit 1'
    },
    {
      transactionId: '15',

      date: new Date('2022-01-02'),
      amount: 100,
      type: 'Deposit',
      description: 'Deposit 2'
    },
  ],
  invalidTransactions: []
};
