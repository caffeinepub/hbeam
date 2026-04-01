declare module "hoosat-sdk-web" {
  export interface KeyPair {
    privateKey: Buffer;
    publicKey: Buffer;
    address: string;
  }

  export interface UTXO {
    txId: string;
    vout: number;
    amount: number;
    scriptPubKey?: string;
  }

  export interface UTXOsResult {
    utxos: UTXO[];
    balance: number;
  }

  export interface SignedTransaction {
    rawTx: string;
    txId: string;
  }

  export interface SubmitResult {
    transactionId: string;
  }

  export interface HoosatCryptoInterface {
    generateKeyPair(network: string): KeyPair;
    importKeyPair(privateKeyHex: string, network: string): KeyPair;
    calculateMinFee(inputCount: number, outputCount: number): number;
  }

  export interface HoosatUtilsInterface {
    amountToSompi(amount: string | number): number;
    sompiToAmount(sompi: number): number;
  }

  export const HoosatCrypto: HoosatCryptoInterface;
  export const HoosatUtils: HoosatUtilsInterface;

  export class HoosatTxBuilder {
    addInput(utxo: UTXO, privateKey?: Buffer | null): this;
    addOutput(address: string, amount: number): this;
    setFee(fee: number): this;
    addChangeOutput(address: string): this;
    sign(): SignedTransaction;
  }

  export class HoosatWebClient {
    constructor(options: {
      baseUrl?: string;
      network?: string;
      apiUrl?: string;
    });
    getUtxos(addresses: string[]): Promise<UTXOsResult>;
    getUTXOs(address: string): Promise<UTXOsResult>;
    broadcastTransaction(rawTx: string): Promise<{ txId: string }>;
    submitTransaction(signed: SignedTransaction): Promise<SubmitResult>;
    getBalance(address: string): Promise<number>;
  }
}
