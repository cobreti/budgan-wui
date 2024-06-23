import type { BankAccount, BankAccountTransactionsGroup } from '@models/BankAccountTypes'

export const data_getCombinedTransactionsGroup_Success_input: BankAccount[] = [
  {
    accountId: "1",
    name: "Account 1",
    accountType: "Checking",
    transactionsGroups: [
      {
        name: "Group 1",
        id: "1",
        dateStart: new Date("2024-06-23T21:43:14.289Z"),
        dateEnd: new Date("2024-06-23T21:43:14.289Z"),
        transactions: [
          { transactionId: "1", date: new Date("2024-06-23T21:43:14.289Z"), amount: 100, type: "Deposit", description: "Deposit 1" },
          { transactionId: "2", date: new Date("2024-06-23T21:43:14.289Z"), amount: 200, type: "Deposit", description: "Deposit 2" },
          { transactionId: "3", date: new Date("2024-06-23T21:43:14.289Z"), amount: 300, type: "Deposit", description: "Deposit 3" },
        ],
      },
      {
        name: "Group 2",
        id: "2",
        dateStart: new Date("2024-06-23T21:43:14.289Z"),
        dateEnd: new Date("2024-06-23T21:43:14.289Z"),
        transactions: [
          { transactionId: "4", date: new Date("2024-06-23T21:43:14.289Z"), amount: 400, type: "Deposit", description: "Deposit 4" },
          { transactionId: "5", date: new Date("2024-06-23T21:43:14.289Z"), amount: 500, type: "Deposit", description: "Deposit 5" },
          { transactionId: "6", date: new Date("2024-06-23T21:43:14.289Z"), amount: 600, type: "Deposit", description: "Deposit 6" },
        ],
      },
    ],
  },
  {
    accountId: "1",
    name: "Account 2",
    accountType: "Savings",
    transactionsGroups: [
      {
        name: "Group 1",
        id: "3",
        dateStart: new Date("2024-06-23T21:43:14.289Z"),
        dateEnd: new Date("2024-06-23T21:43:14.289Z"),
        transactions: [
          { transactionId: "1", date: new Date("2024-06-23T21:43:14.289Z"), amount: 700, type: "Deposit", description: "Deposit 7" },
          { transactionId: "7", date: new Date("2024-06-23T21:43:14.289Z"), amount: 800, type: "Deposit", description: "Deposit 8" },
          { transactionId: "8", date: new Date("2024-06-23T21:43:14.289Z"), amount: 900, type: "Deposit", description: "Deposit 9" },
        ],
      },
      {
        name: "Group 2",
        id: "4",
        dateStart: new Date("2024-06-23T21:43:14.289Z"),
        dateEnd: new Date("2024-06-23T21:43:14.289Z"),
        transactions: [
          { transactionId: "9", date: new Date("2024-06-23T21:43:14.289Z"), amount: 1000, type: "Deposit", description: "Deposit 10" },
          { transactionId: "10", date: new Date("2024-06-23T21:43:14.289Z"), amount: 1100, type: "Deposit", description: "Deposit 11" },
          { transactionId: "6", date: new Date("2024-06-23T21:43:14.289Z"), amount: 1200, type: "Deposit", description: "Deposit 12" },
        ],
      },
    ],
  },
];


export const data_getCombinedTransactionsGroup_Success_expected: BankAccountTransactionsGroup[] = [
  {
    name: "Group 1",
    id: "1",
    dateStart: new Date("2024-06-23T21:43:14.289Z"),
    dateEnd: new Date("2024-06-23T21:43:14.289Z"),
    transactions: [
      { transactionId: "1", date: new Date("2024-06-23T21:43:14.289Z"), amount: 100, type: "Deposit", description: "Deposit 1" },
      { transactionId: "2", date: new Date("2024-06-23T21:43:14.289Z"), amount: 200, type: "Deposit", description: "Deposit 2" },
      { transactionId: "3", date: new Date("2024-06-23T21:43:14.289Z"), amount: 300, type: "Deposit", description: "Deposit 3" },
    ],
  },
  {
    name: "Group 2",
    id: "2",
    dateStart: new Date("2024-06-23T21:43:14.289Z"),
    dateEnd: new Date("2024-06-23T21:43:14.289Z"),
    transactions: [
      { transactionId: "4", date: new Date("2024-06-23T21:43:14.289Z"), amount: 400, type: "Deposit", description: "Deposit 4" },
      { transactionId: "5", date: new Date("2024-06-23T21:43:14.289Z"), amount: 500, type: "Deposit", description: "Deposit 5" },
      { transactionId: "6", date: new Date("2024-06-23T21:43:14.289Z"), amount: 600, type: "Deposit", description: "Deposit 6" },
    ],
  },
  {
    name: "Group 1",
    id: "3",
    dateStart: new Date("2024-06-23T21:43:14.289Z"),
    dateEnd: new Date("2024-06-23T21:43:14.289Z"),
    transactions: [
      { transactionId: "1", date: new Date("2024-06-23T21:43:14.289Z"), amount: 700, type: "Deposit", description: "Deposit 7" },
      { transactionId: "7", date: new Date("2024-06-23T21:43:14.289Z"), amount: 800, type: "Deposit", description: "Deposit 8" },
      { transactionId: "8", date: new Date("2024-06-23T21:43:14.289Z"), amount: 900, type: "Deposit", description: "Deposit 9" },
    ],
  },
  {
    name: "Group 2",
    id: "4",
    dateStart: new Date("2024-06-23T21:43:14.289Z"),
    dateEnd: new Date("2024-06-23T21:43:14.289Z"),
    transactions: [
      { transactionId: "9", date: new Date("2024-06-23T21:43:14.289Z"), amount: 1000, type: "Deposit", description: "Deposit 10" },
      { transactionId: "10", date: new Date("2024-06-23T21:43:14.289Z"), amount: 1100, type: "Deposit", description: "Deposit 11" },
      { transactionId: "6", date: new Date("2024-06-23T21:43:14.289Z"), amount: 1200, type: "Deposit", description: "Deposit 12" },
    ],
  },
];
