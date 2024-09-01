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
  DESCRIPTION = 5,
  TYPE = 6
}

export type CSVColumnContentMapping = {[index in CSVColumnContent]?: number}

export type CSVSettings = {
  delimiter: string;
  columns: CSVColumnContentMapping;
};

export type CSVSettingsTable = {[index: string]: CSVSettings};

//
// Deprecated csv types
/////////////////////////

export type CSVContentByColumn_Deprecated = {[index: string]: CSVColumnContent}

export type CSVFileSettings_Deprecated = {
  delimiter: string;
  columns: CSVContentByColumn_Deprecated;
};


export type NamedCSVFileSettings_Deprecated = {[name: string]: CSVFileSettings_Deprecated};
