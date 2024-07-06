import type { BankAccount } from "@/core/models/BankAccountTypes";

export const LoadSingleFileTestSuccess_Input: BankAccount = {
    name: "Sample Bank Account",
    accountId: "123456789",
    accountType: "Checking",
    transactionsGroups: []
};


export const LoadMultipleAccountsTest_Input: BankAccount[] = [
    {
        name: "Sample Bank Account 1",
        accountId: "123456789",
        accountType: "Checking",
        transactionsGroups: []
    },
    {
        name: "Sample Bank Account 2",
        accountId: "987654321",
        accountType: "Savings",
        transactionsGroups: []
    }
];


export const LoadSortLoadedAccountByIdTest_Input: BankAccount[] = [
    {
        name: "Account 1 - Checking",
        accountId: "123456789",
        accountType: "Checking",
        transactionsGroups: []
    },
    {
        name: "Account 2 - Savings",
        accountId: "123456789",
        accountType: "Savings",
        transactionsGroups: []
    },
    {
        name: "Account 3 - Checking",
        accountId: "987654321",
        accountType: "Checking",
        transactionsGroups: []
    },
    {
        name: "Account 4 - Savings",
        accountId: "987654321",
        accountType: "Savings",
        transactionsGroups: []
    }
];
