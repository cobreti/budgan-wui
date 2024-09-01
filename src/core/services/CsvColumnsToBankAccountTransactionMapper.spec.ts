import {describe, beforeEach, afterEach, vi, test, expect} from 'vitest';
import { CSVColumnContent, type CSVColumnContentMapping } from '@/core/models/csvDocument'
import type { CsvContent } from '@services/CsvParser'
import { CsvColumnsToBankAccountTransactionMapper } from '@services/CsvColumnsToBankAccountTransactionMapper'
import moment from 'moment';

describe('CsvColumnsToBankAccountTransactionMapper', () => {

  const columnsMapping : CSVColumnContentMapping = {
    [CSVColumnContent.CARD_NUMBER]: 0,
    [CSVColumnContent.TYPE]: 1,
    [CSVColumnContent.DATE_INSCRIPTION]: 2,
    [CSVColumnContent.AMOUNT]: 3,
    [CSVColumnContent.DESCRIPTION]: 4
  };

  const sampeCsvContent : CsvContent = {
    header: {records: ['cardNumber', 'type', 'dateInscription', 'amount', 'description']},
    rows: [
      {records: ['1234', 'debit', '2021-01-01', '123.45', 'description 1']},
      {records: ['1234', 'credit', '2021-01-02', '234.56', 'description 2']}
    ]
  };


  beforeEach(() => {

  });

  afterEach(() => {
    vi.resetAllMocks();
  })

  test('construction', () => {

    const mapper = new  CsvColumnsToBankAccountTransactionMapper(columnsMapping);

    expect(mapper.dateInscriptionColIndex).toBe(2);
    expect(mapper.dateTransactionColIndex).toBe(undefined);
    expect(mapper.amountColIndex).toBe(3);
    expect(mapper.cardNumberColIndex).toBe(0);
    expect(mapper.descriptionColIndex).toBe(4);
    expect(mapper.typeColIndex).toBe(1);

    expect(mapper.valid).toBe(true);
  });

  test('mapCsvToTransaction', () => {

      const mapper = new  CsvColumnsToBankAccountTransactionMapper(columnsMapping);

      const transaction = mapper.mapCsvToTransaction(sampeCsvContent.rows[0]);

      expect(transaction).toEqual({
        transactionId: '2021-01-01-123.45-description 1-debit',
        type: 'debit',
        dateInscription: moment('2021-01-01', 'YYYYMMDD').toDate(),
        amount: 123.45,
        description: 'description 1'
      });
  });
});
