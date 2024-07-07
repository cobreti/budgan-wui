import 'reflect-metadata';

import { type BankAccount } from '@models/BankAccountTypes';
import { BankAccountTransactionsSanitizer, type IBankAccountTransactionsSanitizer } from './BankAccountTransactionsSanitizer';
import { injectable } from 'inversify';


export interface IBankAccountTransactionsSanitizerFactory {
    create(account: BankAccount | undefined) : IBankAccountTransactionsSanitizer;
};


@injectable()
export class BankAccountTransactionsSanitizerFactory implements IBankAccountTransactionsSanitizerFactory {

    public create(account: BankAccount | undefined) : IBankAccountTransactionsSanitizer {
        const sanitizer = new BankAccountTransactionsSanitizer();
        if (account) {
            sanitizer.initWithAccount(account);
        }
        return sanitizer;
    }
}
