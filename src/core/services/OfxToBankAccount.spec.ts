import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import '@/core/setupInversify'
import { FileReaderFactory } from '@services/FileReaderFactory'
import { OfxToBankAccount } from '@services/OfxToBankAccount'
import { type IOfxParser, OfxParser } from '@services/ofxParser'


describe('OfxToBankAccount', () => {

  let fileReaderFactory = new FileReaderFactory();
  let ofxParser: IOfxParser = new OfxParser();
  let ofxToBankAccount = new OfxToBankAccount(fileReaderFactory, ofxParser);

  beforeEach( async() => {
    fileReaderFactory = new FileReaderFactory();
    ofxParser = new OfxParser();
    ofxToBankAccount = new OfxToBankAccount(fileReaderFactory, ofxParser);
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

    vi.spyOn(ofxToBankAccount, 'ofxToBankAccount')
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
});
