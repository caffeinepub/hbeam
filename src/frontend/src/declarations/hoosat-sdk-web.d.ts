declare module "hoosat-sdk-web" {
  export class HoosatCrypto {
    static generateKeyPair(network: string): { privateKey: any; address: string };
    static importKeyPair(privateKeyHex: string, network: string): { privateKey: any; address: string };
    static calculateMinFee(inputCount: number, outputCount: number): bigint;
  }
  export class HoosatTxBuilder {
    constructor(network?: string);
    addInput(utxo: any, privateKey?: any): this;
    addOutput(address: string, amount: bigint): this;
    setFee(fee: bigint): this;
    addChangeOutput(address: string): this;
    estimateFee(): bigint;
    sign(privateKey?: any): any;
    build(): any;
  }
  export class HoosatUtils {
    static sompiToHtn(sompi: bigint): string;
    static htnToSompi(htn: string): bigint;
    static amountToSompi(amount: string | number): bigint;
  }
  export class HoosatWebClient {
    constructor(options: string | { baseUrl: string });
    getBalance(address: string): Promise<{ balance: bigint }>;
    getUtxos(addresses: string | string[]): Promise<{ utxos: any[] }>;
    submitTransaction(tx: any): Promise<{ transactionId: string }>;
  }
}
