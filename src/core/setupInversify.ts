import 'reflect-metadata';
import {Container} from 'inversify';
import {ServicesTypes} from '@services/types';
import {OfxParser} from '@services/ofxParser';
import { OfxToBankAccount } from '@services/OfxToBankAccount'
import { FileReaderFactory } from '@services/FileReaderFactory'
import { IdGenerator } from '@services/IdGenerator'
import { BankAccountOperations } from '@services/BankAccountOperations';
import { BankAccountTransactionsSanitizer } from '@services/BankAccountTransactionsSanitizer';
import { BankAccountTransactionsSanitizerFactory } from '@services/BankAccountTransactionsSanitizerFactory';
import { BankAccountLoader } from '@services/BankAccountLoader';
import { CsvToBankAccount } from '@services/CsvToBankAccount'
import { StreamFactory } from '@services/StreamFactory'
import { CsvParser } from '@services/CsvParser'
import { AccountDataSerializer } from '@services/AccountDataSerializer'

const container = new Container();

container.bind(ServicesTypes.OfxParser).to(OfxParser);
container.bind(ServicesTypes.OfxToBankAccount).to(OfxToBankAccount);
container.bind(ServicesTypes.CsvToBankAccount).to(CsvToBankAccount);
container.bind(ServicesTypes.FileReaderFactory).to(FileReaderFactory).inSingletonScope();
container.bind(ServicesTypes.IdGenerator).to(IdGenerator).inSingletonScope();
container.bind(ServicesTypes.BankAccountOperations).to(BankAccountOperations).inSingletonScope();
container.bind(ServicesTypes.BankAccountTransactionsSanitizer).to(BankAccountTransactionsSanitizer);
container.bind(ServicesTypes.BankAccountTransactionsSanitizerFactory).to(BankAccountTransactionsSanitizerFactory);
container.bind(ServicesTypes.BankAccountLoader).to(BankAccountLoader);
container.bind(ServicesTypes.StreamFactory).to(StreamFactory).inSingletonScope();
container.bind(ServicesTypes.CsvParser).to(CsvParser);
container.bind(ServicesTypes.AccountDataSerializer).to(AccountDataSerializer).inSingletonScope();

export {
    container
}
