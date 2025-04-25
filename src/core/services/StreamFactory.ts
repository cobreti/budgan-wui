import 'reflect-metadata';
import { inject, injectable } from 'inversify'
import { ServicesTypes } from '@services/types'
import type { IReaderFactory } from '@services/FileReaderFactory'
import type { IInputStream } from '@services/Stream'
import { FileInputStream } from '@services/FileInputStream'

export interface IStreamFactory {
  createFileReader(file: File) : IInputStream;
}

@injectable()
export class StreamFactory implements IStreamFactory {

  constructor(
    @inject(ServicesTypes.FileReaderFactory) private fileReaderFactory: IReaderFactory
  ) {

  }

  createFileReader(file: File) : IInputStream {
    const reader = this.fileReaderFactory.createReader();
    return new FileInputStream(file, reader);
  }
}
