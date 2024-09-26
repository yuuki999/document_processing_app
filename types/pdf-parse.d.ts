declare module 'pdf-parse/lib/pdf-parse.js' {
  function parse(dataBuffer: Buffer, options?: any): Promise<{
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }>;

  export default parse;
}
