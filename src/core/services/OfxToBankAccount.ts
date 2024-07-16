import "reflect-metadata";

import { injectable, inject } from 'inversify'
import type { OfxDocument, OfxTransaction } from '@models/ofxDocument'
import type { BankAccount, BankAccountTransaction } from '@models/BankAccountTypes'
import type { IOfxParser } from '@services/ofxParser'
import { ServicesTypes } from '@services/types'
import type { IReaderFactory } from '@services/FileReaderFactory'
import type { IdGenerator } from '@services/IdGenerator'

export interface IOfxToBankAccount {
  loadOfxFile(file: File) : Promise<BankAccount>;
}

@injectable()
export class OfxToBankAccount implements IOfxToBankAccount {

  constructor(
    @inject(ServicesTypes.FileReaderFactory) private fileReaderFactory: IReaderFactory,
    @inject(ServicesTypes.OfxParser) private ofxParser: IOfxParser,
    @inject(ServicesTypes.IdGenerator) private idGenerator: IdGenerator
  ) {

  }

  async loadOfxFile(file: File) : Promise<BankAccount> {
    return new Promise((resolve, reject) => {
      const reader =  this.fileReaderFactory.createReader();

      reader.onload = () => {
          console.log(`File ${file.name} loaded.`);
          const text = reader.result as string;
          if (text == null) {
            reject('Unable to read file content as text')
          }
          const accountResult = this.convertOfxToBankAccount(text);
          if (!accountResult) {
            reject();
          }
          else {
            resolve(accountResult);
          }
      }

      reader.onerror = () => {
        console.log(`File ${file.name} could not be loaded.`);
        reject();
      }

      reader.readAsText(file);
    });
  }

  convertOfxToBankAccount(ofxContent: string) : BankAccount | undefined {
    try {
      const result = this.ofxParser.parse(ofxContent);

      if (!result.document) {
        return;
      }

      return this.createAccountFromOfxDocument(result.document);
    }
    catch (error) {
      console.error('Error parsing OFX file.', error);
      return;
    }
  }

  OfxToBankAccountTransaction(ofxTransaction: OfxTransaction) : BankAccountTransaction {
    if (ofxTransaction.fitId == undefined) {
      throw new Error('Transaction ID not found in OFX file.');
    }

    if (ofxTransaction.datePosted == undefined) {
      throw new Error('Transaction date not found in OFX file.');
    }

    if (ofxTransaction.amount == undefined) {
      throw new Error('Transaction amount not found in OFX file.');
    }

    if (ofxTransaction.type == undefined) {
      throw new Error('Transaction type not found in OFX file.');
    }

    return {
      transactionId: ofxTransaction.fitId,
      date: ofxTransaction.datePosted,
      amount: ofxTransaction.amount,
      type: ofxTransaction.type,
      description: ofxTransaction.name || ''
    }
  }

  createAccountFromOfxDocument(document: OfxDocument) : BankAccount {
    if (document.accountId == undefined) {
      throw new Error('Account ID not found in OFX file.');
    }

    if (document.startDate == undefined) {
      throw new Error('Start date not found in OFX file.');
    }

    if (document.endDate == undefined) {
      throw new Error('End date not found in OFX file.');
    }

    const account: BankAccount = {
      name: document.accountId,
      accountId: document.accountId,
      accountType: document.accountType || '',
      transactionsGroups: []
    };

    if (document.transactions && document.transactions.length > 0) {

      const bankAccountTransactions = document.transactions.map(this.OfxToBankAccountTransaction);

      account.transactionsGroups = [{
        name: `${document.startDate?.toDateString()} - ${document.endDate?.toDateString()}`,
        id: this.idGenerator.generateId(),
        dateStart: document.startDate,
        dateEnd: document.endDate,
        transactions: bankAccountTransactions
      }];
    }

    return account;
  }
}
