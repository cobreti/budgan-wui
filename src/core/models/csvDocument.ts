export type CSVRawRow = {
  cardNumber: string;
  dateInscription: String;
  dateTransaction: string;
  amount: string;
  description: string;
};

export enum CSVColumnContent {
  UNKNOWN = 0,
  CARD_NUMBER = 1,
  DATE_INSCRIPTION = 2,
  DATE_TRANSACTION = 3,
  AMOUNT = 4,
  DESCRIPTION = 5
}

export type CSVContentByColumn = {[index: string]: CSVColumnContent}

export type CSVFileSettings = {
  delimiter: string;
  columns: CSVContentByColumn;
};


export type NamedCSVFileSettings = {[name: string]: CSVFileSettings};
