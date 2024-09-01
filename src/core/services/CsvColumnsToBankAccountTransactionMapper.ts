import { CSVColumnContent, type CSVColumnContentMapping } from '@models/csvDocument'
import type { CsvRow } from '@services/CsvParser'
import type { BankAccountTransaction } from '@models/BankAccountTypes'
import moment from 'moment';

export class CsvColumnsToBankAccountTransactionMapper {

  dateInscriptionColIndex: number | undefined;
  dateTransactionColIndex: number | undefined;
  amountColIndex: number | undefined;
  cardNumberColIndex: number | undefined;
  descriptionColIndex: number | undefined;
  typeColIndex: number | undefined;
  dateFormat: string = 'YYYYMMDD';

  constructor(private columnsMapping : CSVColumnContentMapping) {

    this.dateInscriptionColIndex = this.getColumnIndex(CSVColumnContent.DATE_INSCRIPTION);
    this.dateTransactionColIndex = this.getColumnIndex(CSVColumnContent.DATE_TRANSACTION);
    this.amountColIndex = this.getColumnIndex(CSVColumnContent.AMOUNT);
    this.cardNumberColIndex = this.getColumnIndex(CSVColumnContent.CARD_NUMBER);
    this.descriptionColIndex = this.getColumnIndex(CSVColumnContent.DESCRIPTION);
    this.typeColIndex = this.getColumnIndex(CSVColumnContent.TYPE);
  }

  getColumnIndex(column: CSVColumnContent) : number | undefined {
    if (column in this.columnsMapping) {
      return this.columnsMapping[column];
    }

    return undefined;
  }

  get valid() : boolean {
    return (
      this.dateInscriptionColIndex !== undefined &&
      this.amountColIndex !== undefined &&
      this.descriptionColIndex !== undefined &&
      this.typeColIndex !== undefined
    );
  }

  mapCsvToTransaction(row: CsvRow) : BankAccountTransaction | undefined {
    if (!this.valid) {
      return undefined;
    }

    const maxColIndex = Math.max(
      this.dateInscriptionColIndex!,
      this.amountColIndex!,
      this.descriptionColIndex!,
      this.typeColIndex!
    );

    if (!(row.records.length > maxColIndex)) {
      return undefined;
    }

    const dateInscription = row.records[this.dateInscriptionColIndex!];
    const amoount = row.records[this.amountColIndex!];
    const description = row.records[this.descriptionColIndex!];
    const type = row.records[this.typeColIndex!];
    const id = `${dateInscription}-${amoount}-${description}-${type}`;

    return {
      transactionId: id,
      dateInscription: moment(dateInscription, this.dateFormat).toDate(),
      amount: parseFloat(amoount),
      description: description,
      type: type
    }
  }
}
