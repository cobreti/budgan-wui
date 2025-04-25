import 'reflect-metadata';

import { inject, injectable } from 'inversify'
import type { BankAccount, BankAccountTransaction, BankAccountTransactionsGroup } from '@models/BankAccountTypes'
import { ServicesTypes } from '@services/types'
import type { IReaderFactory } from '@services/FileReaderFactory'
import { parse } from 'csv-parse/browser/esm';
import { type CSVColumnContentMapping } from '@models/csvDocument'
import type { CsvContent } from '@services/CsvParser'
import { CsvColumnsToBankAccountTransactionMapper } from '@services/CsvColumnsToBankAccountTransactionMapper'
import type { IdGenerator } from '@services/IdGenerator'

export interface ICsvToBankAccount {
  loadCsvFile(file: File) : Promise<BankAccount>;
  convertToBankAccountTransactionsGroup(csvContent: CsvContent, columnsMapping: CSVColumnContentMapping) : BankAccountTransactionsGroup | undefined;
}

@injectable()
export class CsvToBankAccount implements ICsvToBankAccount {

  constructor(
    @inject(ServicesTypes.FileReaderFactory) private fileReaderFactory: IReaderFactory,
    @inject(ServicesTypes.IdGenerator) private idGenerator: IdGenerator
  ) {

  }

  loadCsvFile(file: File) : Promise<BankAccount> {
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

    const parser = parse({
      delimiter: ','
    });

    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null ) {
        console.log(record);
      }
    });

    const lines = text.split(/\r?\n/);

    lines.forEach((line) => {
      const items = line.split(',');
      if (items.length > 3) {
        parser.write(line);
        parser.write('\n');
      }
    });

    parser.end();

    return undefined;
  }

  convertToBankAccountTransactionsGroup(csvContent: CsvContent, columnsMapping: CSVColumnContentMapping): BankAccountTransactionsGroup | undefined {

    const mapper = new CsvColumnsToBankAccountTransactionMapper(columnsMapping);

    const transactions: BankAccountTransaction[] = [];

    for (const row of csvContent.rows) {
      const transaction = mapper.mapCsvToTransaction(row);
      if (transaction) {
        transactions.push(transaction);
      }
    }

    if (transactions.length === 0) {
      return undefined;
    }

    let dateStart: Date = transactions[0].dateInscription;
    let dateEnd: Date = transactions[0].dateInscription;

    for (const transaction of transactions) {
      if (transaction.dateInscription < dateStart) {
        dateStart = transaction.dateInscription;
      }

      if (transaction.dateInscription > dateEnd) {
        dateEnd = transaction.dateInscription;
      }
    }

    const id = this.idGenerator.generateId();
    const name = `${dateStart.toDateString()} - ${dateEnd.toDateString()}`;

    return {
      id,
      name,
      dateStart,
      dateEnd,
      transactions
    } as BankAccountTransactionsGroup;
  }
}
