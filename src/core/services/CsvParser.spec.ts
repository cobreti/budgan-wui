import { describe, beforeEach, afterEach, vi, test } from 'vitest';

import { headerAndData } from '@services/tests-files/CsvReader/samples';
import { CsvParser } from '@services/CsvParser'

describe('CsvReader', () => {

  beforeEach(() => {

  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('test', () => {
    const parser = new CsvParser();
    parser.minimumColumnsCount = 3;

    const result = parser.parse(headerAndData);

    console.log(JSON.stringify(result));
  });
});
