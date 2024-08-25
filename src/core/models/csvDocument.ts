export type CSVRawRow = {
  cardNumber: string;
  dateInscription: String;
  dateTransaction: string;
  amount: string;
  description: string;
};

export enum CSVColumns {
  CARD_NUMBER = 'cardNumber',
  DATE_INSCRIPTION = 'dateInscription',
  DATE_TRANSACTION = 'dateTransaction',
  AMOUNT = 'amount',
  DESCRIPTION = 'description',
  UNKNOWN = 'unknown',
}

export type CSVFileSettings = {
  delimiter: string;
  columns: CSVColumns[];
};

