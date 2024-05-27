import 'reflect-metadata';
import {Container} from 'inversify';
import {ServicesTypes} from '@services/types';
import {OfxParser} from '@services/ofxParser';
import { OfxToBankAccount } from '@services/OfxToBankAccount'
import { FileReaderFactory } from '@services/FileReaderFactory'
import { IdGenerator } from '@services/IdGenerator'
import { BankAccountOperations } from './services/BankAccountOperations';

const container = new Container();

container.bind(ServicesTypes.OfxParser).to(OfxParser);
container.bind(ServicesTypes.OfxToBankAccount).to(OfxToBankAccount);
container.bind(ServicesTypes.FileReaderFactory).to(FileReaderFactory).inSingletonScope();
container.bind(ServicesTypes.IdGenerator).to(IdGenerator).inSingletonScope();
container.bind(ServicesTypes.BankAccountOperations).to(BankAccountOperations).inSingletonScope();

export {
    container
}
