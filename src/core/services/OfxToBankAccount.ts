import { injectable, inject } from 'inversify'
import type { OfxDocument, OfxTransaction } from '@models/ofxDocument'
import type { BankAccount, BankAccountTransaction } from '@models/BankAccountTypes'
import type { IOfxParser } from '@services/ofxParser'
import { ServicesTypes } from '@services/types'
import type { IReaderFactory } from '@services/FileReaderFactory'

export interface IOfxToBankAccount {
  loadOfxFile(file: File) : Promise<BankAccount>;
}

@injectable()
export class OfxToBankAccount implements IOfxToBankAccount {

  constructor(
    @inject(ServicesTypes.FileReaderFactory) private fileReaderFactory: IReaderFactory,
    @inject(ServicesTypes.OfxParser) private ofxParser: IOfxParser
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
          const accountResult = this.ofxToBankAccount(text);
          resolve(accountResult);
      }

      reader.onerror = () => {
        console.log(`File ${file.name} could not be loaded.`);
        reject();
      }

      reader.readAsText(file);
    });
  }

  ofxToBankAccount(ofxContent: string) : BankAccount {
    const result = this.ofxParser.parse(ofxContent);

    if (!result.document) {
      throw new Error('OFX document not found.');
    }

    return this.createAccountFromOfxDocument(result.document);
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
      transactions: []
    };

    if (document.transactions && document.transactions.length > 0) {

      const bankAccountTransactions = document.transactions.map(this.OfxToBankAccountTransaction);

      account.transactions = [{
        name: `${document.startDate?.toDateString()} - ${document.endDate?.toDateString()}`,
        id: crypto.randomUUID(),
        dateStart: document.startDate,
        dateEnd: document.endDate,
        transactions: bankAccountTransactions
      }];
    }

    return account;
  }
}
