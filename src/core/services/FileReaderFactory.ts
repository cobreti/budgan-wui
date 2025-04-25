import 'reflect-metadata';
import { injectable } from 'inversify'

export interface IReaderFactory {
    createReader(): FileReader;
}

@injectable()
export class FileReaderFactory implements IReaderFactory {
    createReader(): FileReader {
        return new FileReader();
    }
}

