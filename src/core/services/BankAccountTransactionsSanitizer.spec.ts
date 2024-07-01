import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import type { BankAccount } from '@models/BankAccountTypes'
import { BankAccountTransactionsSanitizer } from '@services/BankAccountTransactionsSanitizer'
import {
  getTransactionsIdsForAccount_expected_output,
  getTransactionsIdsForAccount_success_input
} from '@services/tests-files/getTransactionsIdsForAccount-test-data'


describe('BankAccountTransactionsSanitizer', () => {

  let sanitizer: BankAccountTransactionsSanitizer;

  beforeEach( async() => {
    sanitizer = new BankAccountTransactionsSanitizer();
  });

  afterEach( async() => {
    vi.resetAllMocks();
  })

  test('initWithAccount should set accountId_', async() => {
    // Arrange
    const account: BankAccount = {
      name: 'name',
      accountId: 'accountId',
      accountType: 'accountType',
      transactionsGroups: []
    };

    // Act
    sanitizer.initWithAccount(account);

    // Assert
    expect(sanitizer.accountId_).toBe('accountId');
    expect(sanitizer.transactionsGroups_).toEqual([]);
    expect(sanitizer.transactionsIds_).toEqual({});
  });

  test('initWithAccount should set transactionsIds_', async() => {

    sanitizer.initWithAccount(getTransactionsIdsForAccount_success_input);

    expect(sanitizer.transactionsIds_).toEqual(getTransactionsIdsForAccount_expected_output);
    expect(sanitizer.accountId_).toBe('123456');
    expect(sanitizer.transactionsGroups_).toEqual([]);
  });

  test('initWithAccount should throw error if accountId_ is already set', async() => {
    // Arrange
    const account: BankAccount = {
      name: 'name',
      accountId: 'accountId',
      accountType: 'accountType',
      transactionsGroups: []
    };

    // Act
    sanitizer.accountId_ = 'otheraccountId';

    // Assert
    expect(() => sanitizer.initWithAccount(account)).toThrowError('Account already initialized');
  });

  test('getTransactionsIdsForAccount should return transaction ids', async() => {
    const result = sanitizer.getTransactionsIdsForAccount(getTransactionsIdsForAccount_success_input);

    expect(result).toEqual(getTransactionsIdsForAccount_expected_output);
  });
});
