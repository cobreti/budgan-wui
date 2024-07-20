import 'reflect-metadata';

import { inject, injectable } from 'inversify'
import type { BankAccount } from '@models/BankAccountTypes'
import { ServicesTypes } from '@services/types'
import type { IReaderFactory } from '@services/FileReaderFactory'

export interface ICsvToBankAccount {
  loadOfxFile(file: File) : Promise<BankAccount>;
}

@injectable()
export class CsvToBankAccount implements ICsvToBankAccount {

  constructor(
    @inject(ServicesTypes.FileReaderFactory) private fileReaderFactory: IReaderFactory
  ) {

  }

  loadOfxFile(file: File) : Promise<BankAccount> {
    return new Promise((resolve, reject) => {
      const reader =  this.fileReaderFactory.createReader();

      reader.onload = () => {
        console.log(`File ${file.name} loaded.`);
        const text = reader.result as string;
        if (text == null) {
          reject('Unable to read file content as text')
        }
        const accountResult = this.convertCsvToBankAccount(text);
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

  convertCsvToBankAccount(text: string) : BankAccount | undefined {

    const lines = text.split(/\r?\n/);
    return undefined;
  }
}
