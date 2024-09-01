import {describe, test, expect} from 'vitest';
import { FileReaderFactory } from '@services/FileReaderFactory'

describe('FileReaderFactory', () => {

  test('create file reader', () => {
    // Arrange
    const factory = new FileReaderFactory();

    // Act
    const reader = factory.createReader();

    // Assert
    expect(reader).toBeInstanceOf(FileReader);
  });
});
