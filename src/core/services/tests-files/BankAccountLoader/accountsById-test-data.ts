import type { BankAccountsDictionary } from '@models/BankAccountTypes'
import { InvalidTransactionReason } from '@models/BankAccountTypes'

export const accountsById_test_data: BankAccountsDictionary = {
  '123456789': {
    name: 'Primary Checking Account',
    accountId: '123456789',
    accountType: 'checking',
    transactionsGroups: [
      {
        name: 'January Transactions',
        id: 'jan-trans',
        dateStart: new Date('2023-01-01'),
        dateEnd: new Date('2023-01-31'),
        transactions: [
          {
            transactionId: 'trans123',
            dateInscription: new Date('2023-01-15'),
            amount: -100,
            type: 'WITHDRAWAL',
            description: 'Grocery Shopping'
          },
          {
            transactionId: 'trans124',
            dateInscription: new Date('2023-01-20'),
            amount: 2000,
            type: 'DEPOSIT',
            description: 'Paycheck'
          }
        ]
      }
    ]
  },
  '987654321': {
    name: 'Savings Account',
    accountId: '987654321',
    accountType: 'savings',
    transactionsGroups: [
      {
        name: 'February Transactions',
        id: 'feb-trans',
        dateStart: new Date('2023-02-01'),
        dateEnd: new Date('2023-02-28'),
        transactions: [
          {
            transactionId: 'trans223',
            dateInscription: new Date('2023-02-10'),
            amount: 500,
            type: 'DEPOSIT',
            description: 'Gift'
          },
          {
            transactionId: 'trans224',
            dateInscription: new Date('2023-02-14'),
            amount: -50,
            type: 'WITHDRAWAL',
            description: 'Valentine\'s Day Dinner',
          }
        ],
        invalidTransactions: [
          {
            transactionId: 'trans224',
            dateInscription: new Date('2023-02-14'),
            amount: -50,
            type: 'WITHDRAWAL',
            description: 'Valentine\'s Day Dinner',
            invalidReason: InvalidTransactionReason.duplicate
          }
        ]
      }
    ]
  }
};