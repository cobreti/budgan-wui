

export interface IStream extends IInputStream, IOutputStream{

}


export interface IInputStream {
  read(): Promise<string>;
}

export interface IOutputStream {

}
