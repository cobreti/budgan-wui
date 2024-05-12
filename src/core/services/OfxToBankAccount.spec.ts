import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import '@/core/setupInversify'
import { FileReaderFactory } from '@services/FileReaderFactory'
import { OfxToBankAccount } from '@services/OfxToBankAccount'
import { type IOfxParser, OfxParser } from '@services/ofxParser'
import type { OfxDocument } from '@models/ofxDocument'
import { IdGenerator, type IIdGenerator } from '@services/IdGenerator'


describe('OfxToBankAccount', () => {

  let fileReaderFactory = new FileReaderFactory();
  let ofxParser: IOfxParser = new OfxParser();
  let idGenerator: IIdGenerator = new IdGenerator();
  let ofxToBankAccount = new OfxToBankAccount(fileReaderFactory, ofxParser, idGenerator);

  beforeEach( async() => {
    fileReaderFactory = new FileReaderFactory();
    ofxParser = new OfxParser();
    idGenerator = new IdGenerator();
    ofxToBankAccount = new OfxToBankAccount(fileReaderFactory, ofxParser, idGenerator);
  });

  afterEach( async() => {
    vi.resetAllMocks();
  })


  test('loadOfxFile calls ofxToBankAccount', async () => {

    const file = new File([''], 'file.ofx');
    const fileReader = {
      result: "",
      readAsText(blob: Blob, encoding?: string) {
        if (fileReader.onload) {
          const ev : ProgressEvent<FileReader> = new ProgressEvent('load', {}) as ProgressEvent<FileReader>;
          fileReader.onload(ev);
        }
      }
    } as FileReader;

    vi.spyOn(fileReaderFactory, 'createReader').mockReturnValue(fileReader);

    vi.spyOn(ofxToBankAccount, 'convertOfxToBankAccount')
      .mockImplementation((ofxContent)  => {
        return {
          name: 'account',
          accountId: '1234',
          accountType: 'account-type',
          transactions: []
        };
      });

    const result = ofxToBankAccount.loadOfxFile(file);

    await expect(result).resolves.toEqual({
      name: 'account',
      accountId: '1234',
      accountType: 'account-type',
      transactions: []
    });
  });

  test('loadOfxFile rejects if fileReader fails', async () => {
    const file = new File([''], 'file.ofx');
    const fileReader = {
      result: "",
      readAsText(blob: Blob, encoding?: string) {
        if (fileReader.onerror) {
          const ev : ProgressEvent<FileReader> = new ProgressEvent('error', {}) as ProgressEvent<FileReader>;
          fileReader.onerror(ev);
        }
      }
    } as FileReader;

    vi.spyOn(fileReaderFactory, 'createReader').mockReturnValue(fileReader);

    const result = ofxToBankAccount.loadOfxFile(file);

    await expect(result).rejects.toBeUndefined();
  });

  test('loadOfxFile reject with not a text content', async () => {
    const file = new File([''], 'file.ofx');
    const fileReader = {
      result: null,
      readAsText(blob: Blob, encoding?: string) {
        if (fileReader.onload) {
          const ev : ProgressEvent<FileReader> = new ProgressEvent('load', {}) as ProgressEvent<FileReader>;
          fileReader.onload(ev);
        }
      }
    } as FileReader;

    vi.spyOn(fileReaderFactory, 'createReader').mockReturnValue(fileReader);

    const result = ofxToBankAccount.loadOfxFile(file);

    await expect(result).rejects.toBe('Unable to read file content as text');
  });

  test('convertOfxToBankAccount throws error if document not found', async () => {
    vi.spyOn(ofxParser, 'parse').mockReturnValue({});

    expect(() => ofxToBankAccount.convertOfxToBankAccount('')).toThrowError('OFX document not found.');
  });

  test('convertOfxToBankAccount success', async () => {
    vi.spyOn(ofxParser, 'parse').mockReturnValue({
      document: {
        version: '',
        security: '',
        encoding: '',
        charset: '',
        compression: '',
        transactions: []
      }
    });

    const fctRet = {
      name: 'account',
      accountId: '1234',
      accountType: 'account-type',
      transactions: []
    };

    const fctSpy = vi.spyOn(ofxToBankAccount, 'createAccountFromOfxDocument').mockReturnValue(fctRet);

    const result = ofxToBankAccount.convertOfxToBankAccount('');

    expect(fctSpy).toHaveBeenCalled();
    expect(result).toEqual(fctRet);
  });

  test('OfxToBankAccountTransaction success path', () => {
    const ofxTransaction = {
      fitId: 'id',
      datePosted: new Date(),
      amount: 100,
      type: 'type',
      name: 'name'
    };

    const result = ofxToBankAccount.OfxToBankAccountTransaction(ofxTransaction);

    expect(result).toEqual({
      transactionId: 'id',
      date: ofxTransaction.datePosted,
      amount: 100,
      type: 'type',
      description: 'name'
    });
  });

  test('OfxToBankAccountTransaction success with name absent', () => {
    const ofxTransaction = {
      fitId: 'id',
      datePosted: new Date(),
      amount: 100,
      type: 'type'
    };

    const result = ofxToBankAccount.OfxToBankAccountTransaction(ofxTransaction);

    expect(result).toEqual({
      transactionId: 'id',
      date: ofxTransaction.datePosted,
      amount: 100,
      type: 'type',
      description: ''
    });
  });

  test('OfxToBankAccountTransaction throws error if fitId not found', () => {
    const ofxTransaction = {
      datePosted: new Date(),
      amount: 100,
      type: 'type'
    };

    expect(() => ofxToBankAccount.OfxToBankAccountTransaction(ofxTransaction)).toThrowError('Transaction ID not found in OFX file.');
  });

  test('OfxToBankAccountTransaction throws error if datePosted not found', () => {
    const ofxTransaction = {
      fitId: 'id',
      amount: 100,
      type: 'type'
    };

    expect(() => ofxToBankAccount.OfxToBankAccountTransaction(ofxTransaction)).toThrowError('Transaction date not found in OFX file.');
  });

  test('OfxToBankAccountTransaction throws error if amount not found', () => {
    const ofxTransaction = {
      fitId: 'id',
      datePosted: new Date(),
      type: 'type'
    };

    expect(() => ofxToBankAccount.OfxToBankAccountTransaction(ofxTransaction)).toThrowError('Transaction amount not found in OFX file.');
  });

  test('OfxToBankAccountTransaction throws error if type not found', () => {
    const ofxTransaction = {
      fitId: 'id',
      datePosted: new Date(),
      amount: 100
    };

    expect(() => ofxToBankAccount.OfxToBankAccountTransaction(ofxTransaction)).toThrowError('Transaction type not found in OFX file.');
  });

  test('createAccountFromOfxDocument success', () => {
    const startDate = new Date();
    const endDate = new Date(startDate.getDate() + 7);
    const postedDates = [
      new Date(startDate.getDate() + 1),
      new Date(startDate.getDate() + 2)
    ];

    const document : OfxDocument = {
      version: '1.0',
      security: 'security',
      encoding: 'utf',
      charset: 'ansi',
      compression: 'none',
      startDate,
      endDate,
      transactions: [
        {
          type: 'type1',
          datePosted: postedDates[0],
          amount: 100,
          fitId: 'id1',
          name: 'name1'
        },
        {
          type: 'type2',
          datePosted: postedDates[1],
          amount: 200,
          fitId: 'id2',
          name: 'name2'
        }
      ],
      accountId: '1234',
      accountType: 'account-type'
    };

    vi.spyOn(idGenerator, 'generateId').mockReturnValue('id');

    const result = ofxToBankAccount.createAccountFromOfxDocument(document);

    expect(result).toEqual({
      name: '1234',
      accountId: '1234',
      accountType: 'account-type',
      transactions: [
        {
          dateEnd: document.endDate,
          dateStart: document.startDate,
          id: 'id',
          name: `${document.startDate?.toDateString()} - ${document.endDate?.toDateString()}`,
          transactions: [
            {
              transactionId: 'id1',
              date: document.transactions[0].datePosted,
              amount: 100,
              type: 'type1',
              description: 'name1'
            },
            {
              transactionId: 'id2',
              date: document.transactions[1].datePosted,
              amount: 200,
              type: 'type2',
              description: 'name2'
            }
          ]
        }
      ]
    });
  });

  test('createAccountFromOfxDocument success with no transactions', () => {
    const startDate = new Date();
    const endDate = new Date(startDate.getDate() + 7);

    const document : OfxDocument = {
      version: '1.0',
      security: 'security',
      encoding: 'utf',
      charset: 'ansi',
      compression: 'none',
      startDate,
      endDate,
      transactions: [],
      accountId: '1234',
      accountType: 'account-type'
    };

    vi.spyOn(idGenerator, 'generateId').mockReturnValue('id');

    const result = ofxToBankAccount.createAccountFromOfxDocument(document);

    expect(result).toEqual({
      name: '1234',
      accountId: '1234',
      accountType: 'account-type',
      transactions: []
    });
  });

  test('createAccountFromOfxDocument throws error if accountId not found', () => {
    const document : OfxDocument = {
      version: '1.0',
      security: 'security',
      encoding: 'utf',
      charset: 'ansi',
      compression: 'none',
      startDate: new Date(),
      endDate: new Date(),
      transactions: [],
      accountType: 'account-type'
    };

    expect(() => ofxToBankAccount.createAccountFromOfxDocument(document)).toThrowError('Account ID not found in OFX file.');
  });

  test('createAccountFromOfxDocument throws error if startDate not found', () => {
    const document : OfxDocument = {
      version: '1.0',
      security: 'security',
      encoding: 'utf',
      charset: 'ansi',
      compression: 'none',
      endDate: new Date(),
      transactions: [],
      accountId: '1234',
      accountType: 'account-type'
    };

    expect(() => ofxToBankAccount.createAccountFromOfxDocument(document)).toThrowError('Start date not found in OFX file.');
  });

  test('createAccountFromOfxDocument throws error if endDate not found', () => {
    const document : OfxDocument = {
      version: '1.0',
      security: 'security',
      encoding: 'utf',
      charset: 'ansi',
      compression: 'none',
      startDate: new Date(),
      transactions: [],
      accountId: '1234',
      accountType: 'account-type'
    };

    expect(() => ofxToBankAccount.createAccountFromOfxDocument(document)).toThrowError('End date not found in OFX file.');
  });

});
