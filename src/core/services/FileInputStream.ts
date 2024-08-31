import 'reflect-metadata';
import type { IInputStream } from '@services/Stream'
import { injectable } from 'inversify'


@injectable()
export class FileInputStream implements IInputStream {

  readonly file: File;
  reader: FileReader;

  constructor(
    file: File,
    reader: FileReader
  ) {
    this.file = file;
    this.reader = reader;
  }

  read(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.reader.onload = () => {
        const text = this.reader.result as string;
        if (text == null) {
          reject('Unable to read file content as text')
        }
        resolve(text);
      }

      this.reader.onerror = () => {
        reject();
      }

      this.reader.readAsText(this.file);
    });
  }

}
