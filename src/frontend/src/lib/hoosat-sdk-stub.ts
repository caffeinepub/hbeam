/**
 * Stub implementation of hoosat-sdk-web.
 * Replace with the real SDK package when available.
 */

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

const notAvailable = (fn: string) => {
  throw new Error(
    `hoosat-sdk-web: '${fn}' is not available. Install the real SDK package to enable on-chain features.`,
  );
};

export const HoosatCrypto = {
  generateKeyPair(_network: string): KeyPair {
    notAvailable("generateKeyPair");
    return null as unknown as KeyPair;
  },
  importKeyPair(_privateKeyHex: string, _network: string): KeyPair {
    notAvailable("importKeyPair");
    return null as unknown as KeyPair;
  },
  calculateMinFee(_inputCount: number, _outputCount: number): number {
    notAvailable("calculateMinFee");
    return 0;
  },
};

export const HoosatUtils = {
  amountToSompi(amount: string | number): number {
    return Math.round(Number(amount) * 1e8);
  },
  sompiToAmount(sompi: number): number {
    return sompi / 1e8;
  },
};

export class HoosatTxBuilder {
  addInput(_utxo: UTXO, _privateKey?: Buffer | null): this {
    notAvailable("HoosatTxBuilder.addInput");
    return this;
  }
  addOutput(_address: string, _amount: number): this {
    notAvailable("HoosatTxBuilder.addOutput");
    return this;
  }
  setFee(_fee: number): this {
    notAvailable("HoosatTxBuilder.setFee");
    return this;
  }
  addChangeOutput(_address: string): this {
    notAvailable("HoosatTxBuilder.addChangeOutput");
    return this;
  }
  sign(): SignedTransaction {
    notAvailable("HoosatTxBuilder.sign");
    return null as unknown as SignedTransaction;
  }
}

type ClientOptions = { baseUrl?: string; network?: string; apiUrl?: string };

export class HoosatWebClient {
  private readonly _opts: ClientOptions;

  constructor(options: ClientOptions) {
    this._opts = options;
  }

  async getUtxos(_addresses: string[]): Promise<UTXOsResult> {
    notAvailable("HoosatWebClient.getUtxos");
    return null as unknown as UTXOsResult;
  }

  async getUTXOs(_address: string): Promise<UTXOsResult> {
    notAvailable("HoosatWebClient.getUTXOs");
    return null as unknown as UTXOsResult;
  }

  async broadcastTransaction(_rawTx: string): Promise<{ txId: string }> {
    notAvailable("HoosatWebClient.broadcastTransaction");
    return null as unknown as { txId: string };
  }

  async submitTransaction(_signed: SignedTransaction): Promise<SubmitResult> {
    notAvailable("HoosatWebClient.submitTransaction");
    return null as unknown as SubmitResult;
  }

  async getBalance(_address: string): Promise<number> {
    notAvailable("HoosatWebClient.getBalance");
    return 0;
  }
}
