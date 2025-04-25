import { describe, beforeEach, afterEach, vi, test, expect } from 'vitest';
import { FileInputStream } from '@services/FileInputStream'

describe('FileInputStream', () => {

  const file = new File([], 'test.txt');

  function getReaderWithValue(value: any = null) {
    const reader = {
      onload: null,
      onerror: null,
      result: value,
      readAsText: (blob: Blob, encoding?: string | undefined) => {
        if (reader.onload) {
          const ev: ProgressEvent<FileReader> = new ProgressEvent('load', {}) as ProgressEvent<FileReader>;
          reader.onload(ev);
        }
      }
    } as FileReader;

    return reader;
  }

  beforeEach(() => {

  })

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('construction', () => {
    const reader = getReaderWithValue();

    const inputStream = new FileInputStream(file, reader);

    expect(inputStream.file).toBe(file);
    expect(inputStream.reader).toBe(reader);
  });

  test('read success', async() => {

    const reader = getReaderWithValue('test');

    const inputStream = new FileInputStream(file, reader);

    const result = await inputStream.read();

    expect(result).toBe('test');
  })

  test('read failure not a string', async() => {

      const reader = getReaderWithValue(null);

      const inputStream = new FileInputStream(file, reader);

      try {
        await inputStream.read();
      }
      catch (error) {
        expect(error).toBe('Unable to read file content as text');
      }
  });

  test('read failure', async() => {
    const reader = getReaderWithValue('');
    vi.spyOn(reader, 'readAsText').mockImplementation(() => {
      if (reader.onerror) {
        const ev: ProgressEvent<FileReader> = new ProgressEvent('error', {}) as ProgressEvent<FileReader>;
        reader.onerror(ev);
      }
    });

    const inputStream = new FileInputStream(file, reader);

    try {
      await inputStream.read();
    }
    catch (error) {
      expect(error).toBe(undefined);
    }

  });
});
