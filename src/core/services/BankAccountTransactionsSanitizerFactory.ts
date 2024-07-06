import { type BankAccount } from '@models/BankAccountTypes';
import { BankAccountTransactionsSanitizer, type IBankAccountTransactionsSanitizer } from './BankAccountTransactionsSanitizer';


export interface IBankAccountTransactionsSanitizerFactory {
    create(account: BankAccount) : IBankAccountTransactionsSanitizer;
};


export class BankAccountTransactionsSanitizerFactory implements IBankAccountTransactionsSanitizerFactory {

    public create(account: BankAccount) : IBankAccountTransactionsSanitizer {
        const sanitizer = new BankAccountTransactionsSanitizer();
        sanitizer.initWithAccount(account);
        return sanitizer;
    }
}
