import { Buffer as Buffer_2 } from 'buffer';

export declare interface AddressBalance {
    balance: string;
}

export declare interface AddressUtxos {
    address: string;
    utxos: UtxoEntry_2[];
}

export declare interface ApiProvider {
    getBalance(address: string): Promise<AddressBalance>;
    getUtxos(addresses: string[]): Promise<AddressUtxos>;
    submitTransaction(tx: Transaction): Promise<TransactionSubmission>;
    getNetworkInfo(): Promise<NetworkInfo>;
    getFeeEstimate(): Promise<FeeRecommendation>;
    ping(): Promise<boolean>;
}

/**
 * Type definitions for Hoosat Browser API Client
 */
export declare interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: number;
    path: string;
}

export declare abstract class BaseProvider implements ApiProvider {
    protected readonly baseUrl: string;
    protected readonly timeout: number;
    protected readonly headers: Record<string, string>;
    protected readonly debug: boolean;
    constructor(config: ProviderConfig);
    protected request<T>(endpoint: string, options?: RequestInit & RequestOptions): Promise<T>;
    protected abstract transformResponse<T>(data: any): T;
    protected abstract get endpoints(): EndpointConfig;
    abstract getBalance(address: string): Promise<AddressBalance>;
    abstract getUtxos(addresses: string[]): Promise<AddressUtxos>;
    abstract submitTransaction(tx: Transaction): Promise<TransactionSubmission>;
    abstract getNetworkInfo(): Promise<NetworkInfo>;
    abstract getFeeEstimate(): Promise<FeeRecommendation>;
    ping(): Promise<boolean>;
}

export declare interface BrowserClientConfig {
    baseUrl: string;
    timeout?: number;
    headers?: Record<string, string>;
    debug?: boolean;
}

export declare const createHoosatNetworkProvider: (baseUrl: string, options?: Partial<ProviderConfig>) => HoosatNetworkProvider;

export declare const createHoosatProxyProvider: (baseUrl: string, options?: Partial<ProviderConfig>) => HoosatProxyProvider;

export declare const createMultiProvider: (providers: ApiProvider[], strategy?: MultiProviderConfig["strategy"]) => MultiProvider;

export declare interface EndpointConfig {
    balance: string;
    utxos: string;
    submitTransaction: string;
    networkInfo: string;
    feeEstimate: string;
}

export declare interface FeeRecommendation {
    feeRate: number;
    totalFee: string;
    priority: PriorityFee;
    percentile: number;
    basedOnSamples: number;
}

/**
 * Format message with Hoosat standard prefix
 *
 * @param message - The message to format
 * @returns Formatted message with prefix
 *
 * @example
 * formatMessage("Hello World")
 * // Returns: "Hoosat Signed Message:\nHello World"
 */
export declare function formatMessage(message: string): string;

/**
 * Hash a raw buffer (without prefix)
 * Use this for signing already-formatted data
 *
 * @param buffer - Raw buffer to hash
 * @returns BLAKE3 hash as Uint8Array (32 bytes)
 */
export declare function hashBuffer(buffer: Buffer_2 | Uint8Array): Uint8Array;

/**
 * Hash a message using BLAKE3
 *
 * @param message - The message to hash (will be prefixed automatically)
 * @returns BLAKE3 hash as Uint8Array (32 bytes)
 *
 * @example
 * const hash = hashMessage("Hello World");
 * // Returns 32-byte Uint8Array
 */
export declare function hashMessage(message: string): Uint8Array;

export declare const HOOSAT_MASS: {
    readonly BaseTxOverhead: 106;
    readonly EstimatedInputSize: 159;
    readonly EstimatedOutputSize: 53;
    readonly MassPerTxByte: 1;
    readonly MassPerScriptPubKeyByte: 10;
    readonly MassPerSigOp: 1000;
    readonly ScriptPubKeyBytesPerOutput: 36;
};

export declare const HOOSAT_PARAMS: {
    readonly MAINNET_PREFIX: "hoosat";
    readonly TESTNET_PREFIX: "hoosattest";
    readonly MAINNET_ADDRESS_PREFIX: "hoosat:";
    readonly TESTNET_ADDRESS_PREFIX: "hoosattest:";
    readonly SIGHASH_ALL: 1;
    readonly SIGHASH_NONE: 2;
    readonly SIGHASH_SINGLE: 4;
    readonly SIGHASH_ANYONECANPAY: 128;
    readonly COINBASE_MATURITY: 100;
    readonly MIN_FEE: 3250;
    readonly SUBNETWORK_ID_NATIVE: Buffer_2<ArrayBuffer>;
};

/**
 * Browser-compatible cryptography implementation for Hoosat blockchain
 * Uses Web Crypto API and pure JavaScript libraries instead of Node.js native modules
 */
export declare class HoosatCrypto {
    /**
     * Computes Blake3 hash (single pass)
     * @param data - Data to hash
     * @returns 32-byte hash
     * @example
     * const hash = HoosatCrypto.blake3Hash(Buffer.from('hello'));
     */
    static blake3Hash(data: Buffer_2 | Uint8Array): Buffer_2;
    /**
     * Computes double Blake3 hash (for transaction IDs)
     * @param data - Data to hash
     * @returns 32-byte double hash
     * @example
     * const doubleHash = HoosatCrypto.doubleBlake3Hash(txData);
     */
    static doubleBlake3Hash(data: Buffer_2 | Uint8Array): Buffer_2;
    /**
     * Computes Blake3 keyed hash (Hoosat-specific)
     * Used internally for signature hashing
     * @param key - 32-byte key or string (auto-padded with zeros)
     * @param data - Data to hash
     * @returns 32-byte keyed hash
     * @example
     * const hash = HoosatCrypto.blake3KeyedHash('TransactionSigningHash', data);
     */
    static blake3KeyedHash(key: Buffer_2 | string | Uint8Array, data: Buffer_2 | Uint8Array): Buffer_2;
    /* Excluded from this release type: sha256Hash */
    /* Excluded from this release type: doubleSha256Hash */
    /**
     * Calculates transaction ID (double Blake3 hash)
     * @param transaction - Signed transaction object
     * @returns 64-character hex transaction ID
     * @example
     * const txId = HoosatCrypto.getTransactionId(signedTx);
     */
    static getTransactionId(transaction: Transaction): string;
    /**
     * Generates a new ECDSA key pair with Hoosat address
     * Uses Web Crypto API for secure random generation
     * @param network - Network type: 'mainnet' or 'testnet' (default: 'mainnet')
     * @returns KeyPair object containing privateKey, publicKey, and address
     * @example
     * const mainnetWallet = HoosatCrypto.generateKeyPair();
     * const testnetWallet = HoosatCrypto.generateKeyPair('testnet');
     */
    static generateKeyPair(network?: HoosatNetwork): KeyPair;
    /**
     * Derives public key from private key
     * @param privateKey - 32-byte private key buffer
     * @returns 33-byte compressed ECDSA public key
     * @example
     * const publicKey = HoosatCrypto.getPublicKey(privateKey);
     */
    static getPublicKey(privateKey: Buffer_2 | Uint8Array): Buffer_2;
    /**
     * Imports wallet from hex-encoded private key
     * @param privateKeyHex - 64-character hex string (32 bytes)
     * @param network - Network type: 'mainnet' or 'testnet' (default: 'mainnet')
     * @throws Error if private key is invalid
     * @example
     * const mainnetWallet = HoosatCrypto.importKeyPair('33a4a81e...');
     * const testnetWallet = HoosatCrypto.importKeyPair('33a4a81e...', 'testnet');
     */
    static importKeyPair(privateKeyHex: string, network?: HoosatNetwork): KeyPair;
    /**
     * Converts Schnorr public key to Hoosat address (version 0x00)
     * @param publicKey - 32-byte Schnorr public key
     * @param network - Network type: 'mainnet' or 'testnet' (default: 'mainnet')
     * @returns Bech32-encoded address
     * @example
     * const mainnetAddr = HoosatCrypto.publicKeyToAddress(schnorrPubkey);
     * const testnetAddr = HoosatCrypto.publicKeyToAddress(schnorrPubkey, 'testnet');
     */
    static publicKeyToAddress(publicKey: Buffer_2 | Uint8Array, network?: HoosatNetwork): string;
    /**
     * Converts ECDSA public key to Hoosat address (version 0x01)
     * @param publicKey - 33-byte compressed ECDSA public key
     * @param network - Network type: 'mainnet' or 'testnet' (default: 'mainnet')
     * @returns Bech32-encoded address with network prefix
     * @example
     * const mainnetAddr = HoosatCrypto.publicKeyToAddressECDSA(pubkey);
     * const testnetAddr = HoosatCrypto.publicKeyToAddressECDSA(pubkey, 'testnet');
     */
    static publicKeyToAddressECDSA(publicKey: Buffer_2 | Uint8Array, network?: HoosatNetwork): string;
    /**
     * Converts Hoosat address to ScriptPublicKey for transaction outputs
     * @param address - Bech32-encoded Hoosat address
     * @returns Script buffer (format: length + pubkey + opcode)
     * @throws Error for unsupported address versions
     * @example
     * const script = HoosatCrypto.addressToScriptPublicKey('hoosat:qyp...');
     * // For ECDSA: 0x21 + 33-byte pubkey + 0xAB (OP_CHECKSIGECDSA)
     */
    static addressToScriptPublicKey(address: string): Buffer_2;
    /**
     * Calculate minimum transaction fee using MASS-based calculation
     * Based on HTND implementation (util\txmass\calculator.go)
     *
     * Formula:
     * 1. size = overhead + (inputs × inputSize) + (outputs × outputSize)
     * 2. massForSize = size × 1
     * 3. massForScriptPubKey = (outputs × scriptPubKeySize) × 10
     * 4. massForSigOps = inputs × 1000
     * 5. massForPayload = payloadSize × 1
     * 6. totalMass = massForSize + massForScriptPubKey + massForSigOps + massForPayload
     * 7. fee = totalMass (minimumRelayTxFee = 1)
     *
     * @param inputCount - Number of inputs
     * @param outputCount - Number of outputs
     * @param payloadSize - Payload size in bytes (default: 0, for future subnetwork usage)
     * @returns Fee amount in sompi as string
     *
     * @example
     * const fee = HoosatCrypto.calculateMinFee(5, 2);
     * // Returns: "6653" (for 5 inputs, 2 outputs)
     *
     * @example
     * // With payload
     * const fee = HoosatCrypto.calculateMinFee(5, 2, 256);
     * // Returns: "6909" (for 5 inputs, 2 outputs, 256 byte payload)
     */
    static calculateMinFee(inputCount: number, outputCount: number, payloadSize?: number): string;
    /* Excluded from this release type: getSignatureHashSchnorr */
    /* Excluded from this release type: getSignatureHashECDSA */
    /* Excluded from this release type: signTransactionInput */
    /* Excluded from this release type: verifyTransactionSignature */
    private static _getPreviousOutputsHash;
    private static _getSequencesHash;
    private static _getSigOpCountsHash;
    private static _getOutputsHash;
    private static _getPayloadHash;
    /* Excluded from this release type: serializeTransactionForID */
}

export declare type HoosatNetwork = 'mainnet' | 'testnet';

export declare class HoosatNetworkProvider extends BaseProvider {
    protected get endpoints(): EndpointConfig;
    protected transformResponse<T>(data: any): T;
    getBalance(address: string): Promise<AddressBalance>;
    getUtxos(addresses: string[]): Promise<AddressUtxos>;
    submitTransaction(transaction: Transaction): Promise<TransactionSubmission>;
    getNetworkInfo(): Promise<NetworkInfo>;
    getFeeEstimate(): Promise<FeeRecommendation>;
}

export declare class HoosatProxyProvider extends BaseProvider {
    protected get endpoints(): EndpointConfig;
    protected transformResponse<T>(data: any): T;
    getBalance(address: string): Promise<AddressBalance>;
    getUtxos(addresses: string[]): Promise<AddressUtxos>;
    submitTransaction(transaction: Transaction): Promise<TransactionSubmission>;
    getNetworkInfo(): Promise<NetworkInfo>;
    getFeeEstimate(): Promise<FeeRecommendation>;
}

/**
 * QR Code generator and parser for Hoosat addresses and payment URIs
 *
 * @example
 * ```typescript
 * // Generate simple address QR
 * const qr = await HoosatQR.generateAddressQR('hoosat:qz7ulu...');
 * console.log(qr); // Data URL for <img src="...">
 *
 * // Generate payment request QR
 * const paymentQR = await HoosatQR.generatePaymentQR({
 *   address: 'hoosat:qz7ulu...',
 *   amount: 100, // 100 HTN
 *   label: 'Coffee Shop',
 *   message: 'Thank you!'
 * });
 *
 * // Parse QR from mobile wallet
 * const parsed = HoosatQR.parsePaymentURI('hoosat:qz7ulu...?amount=100');
 * console.log(parsed.amount); // Amount in sompi
 * ```
 */
export declare class HoosatQR {
    /**
     * Generate QR code for a simple Hoosat address
     *
     * @param address - Hoosat address (with or without 'hoosat:' prefix)
     * @param options - QR code generation options
     * @returns Data URL (base64 PNG image) for use in <img> tag
     *
     * @example
     * ```typescript
     * const qr = await HoosatQR.generateAddressQR('hoosat:qz7ulu...');
     * // Use in HTML: <img src="${qr}" />
     * ```
     */
    static generateAddressQR(address: string, options?: QRCodeOptions): Promise<string>;
    /**
     * Generate QR code for a payment request with amount and metadata
     *
     * @param params - Payment URI parameters
     * @param options - QR code generation options
     * @returns Data URL (base64 PNG image)
     *
     * @example
     * ```typescript
     * const qr = await HoosatQR.generatePaymentQR({
     *   address: 'hoosat:qz7ulu...',
     *   amount: 100,
     *   label: 'Coffee Shop',
     *   message: 'Order #12345'
     * });
     * ```
     */
    static generatePaymentQR(params: PaymentURIParams, options?: QRCodeOptions): Promise<string>;
    /**
     * Generate QR code as SVG string
     *
     * @param address - Hoosat address or payment URI
     * @param options - QR code generation options
     * @returns SVG string
     *
     * @example
     * ```typescript
     * const svg = await HoosatQR.generateQRSVG('hoosat:qz7ulu...');
     * document.getElementById('qr').innerHTML = svg;
     * ```
     */
    static generateQRSVG(address: string, options?: QRCodeOptions): Promise<string>;
    /**
     * Generate QR code as terminal string (ASCII art)
     * Useful for CLI applications
     *
     * @param address - Hoosat address or payment URI
     * @returns Terminal-friendly QR code string
     *
     * @example
     * ```typescript
     * const qr = await HoosatQR.generateQRTerminal('hoosat:qz7ulu...');
     * console.log(qr);
     * ```
     */
    static generateQRTerminal(address: string): Promise<string>;
    /**
     * Generate QR code as Buffer (for Node.js file saving)
     *
     * @param address - Hoosat address or payment URI
     * @param options - QR code generation options
     * @returns PNG image as Buffer
     *
     * @example
     * ```typescript
     * const buffer = await HoosatQR.generateQRBuffer('hoosat:qz7ulu...');
     * fs.writeFileSync('qr.png', buffer);
     * ```
     */
    static generateQRBuffer(address: string, options?: QRCodeOptions): Promise<Buffer>;
    /**
     * Build payment URI from parameters
     * Format: hoosat:address?amount=X&label=Y&message=Z
     *
     * @param params - Payment parameters
     * @returns Formatted payment URI
     *
     * @example
     * ```typescript
     * const uri = HoosatQR.buildPaymentURI({
     *   address: 'hoosat:qz7ulu...',
     *   amount: 100,
     *   label: 'Coffee'
     * });
     * // Result: "hoosat:qz7ulu...?amount=100&label=Coffee"
     * ```
     */
    static buildPaymentURI(params: PaymentURIParams): string;
    /**
     * Parse payment URI from QR code
     *
     * @param uri - Payment URI string
     * @returns Parsed payment information
     * @throws Error if URI is invalid
     *
     * @example
     * ```typescript
     * const parsed = HoosatQR.parsePaymentURI(
     *   'hoosat:qz7ulu...?amount=100&label=Coffee'
     * );
     * console.log(parsed.address); // "hoosat:qz7ulu..."
     * console.log(parsed.amount);  // "10000000000" (sompi)
     * console.log(parsed.label);   // "Coffee"
     * ```
     */
    static parsePaymentURI(uri: string): ParsedPaymentURI;
    /**
     * Validate if string is a valid Hoosat payment URI
     *
     * @param uri - URI string to validate
     * @returns true if valid payment URI
     *
     * @example
     * ```typescript
     * HoosatQR.isValidPaymentURI('hoosat:qz7ulu...'); // true
     * HoosatQR.isValidPaymentURI('bitcoin:...'); // false
     * ```
     */
    static isValidPaymentURI(uri: string): boolean;
    /**
     * Generate QR code as Data URL (base64 PNG)
     */
    private static generateQRDataURL;
    /**
     * Build QR code options from custom options
     */
    private static buildQROptions;
}

/**
 * Main class for message signing operations
 *
 * @example
 * ```typescript
 * import { HoosatSigner } from 'hoosat-sdk-web';
 *
 * // Sign a message
 * const privateKey = 'a1b2c3d4...'; // 64 hex chars
 * const signature = HoosatSigner.signMessage(privateKey, 'Hello World');
 *
 * // Verify a signature
 * const isValid = HoosatSigner.verifyMessage(signature, 'Hello World', publicKey);
 * ```
 */
export declare class HoosatSigner {
    /**
     * Sign a message with a private key
     *
     * @param privateKey - Hex string private key (64 chars without 0x prefix)
     * @param message - Message to sign (plain text)
     * @returns Compact signature in hex format (128 chars)
     *
     * @throws Error if private key is invalid
     * @throws Error if signing fails
     *
     * @example
     * ```typescript
     * const privateKey = 'a1b2c3d4...'; // 64 char hex
     * const signature = HoosatSigner.signMessage(privateKey, 'Hello World');
     * console.log(signature); // "3045022100ab12cd34..."
     * ```
     */
    static signMessage(privateKey: string, message: string): string;
    /**
     * Verify a message signature
     *
     * @param signature - Compact signature hex (128 chars)
     * @param message - Original message that was signed
     * @param publicKey - Public key hex (66 chars, compressed format with 02/03 prefix)
     * @returns True if signature is valid
     *
     * @example
     * ```typescript
     * const isValid = HoosatSigner.verifyMessage(
     *   signature,
     *   'Hello World',
     *   publicKey
     * );
     * console.log(isValid); // true or false
     * ```
     */
    static verifyMessage(signature: string, message: string, publicKey: string): boolean;
    /**
     * Recover public key from signature
     *
     * Note: This method requires trying different recovery IDs (0-3)
     * to find the correct public key. Use verifyMessage() when possible.
     *
     * @param signature - Compact signature hex (128 chars)
     * @param message - Original message
     * @param recoveryId - Recovery ID (0-3), default 0
     * @returns Recovered public key in compressed format (66 hex chars)
     *
     * @throws Error if recovery fails
     *
     * @example
     * ```typescript
     * const publicKey = HoosatSigner.recoverPublicKey(
     *   signature,
     *   'Hello World',
     *   0
     * );
     * ```
     */
    static recoverPublicKey(signature: string, message: string, recoveryId?: number): string;
    /**
     * Get public key from private key
     *
     * @param privateKey - Private key hex (64 chars)
     * @param compressed - Return compressed format (default: true)
     * @returns Public key hex string (66 chars if compressed, 130 if uncompressed)
     *
     * @example
     * ```typescript
     * const publicKey = HoosatSigner.getPublicKey(privateKey);
     * console.log(publicKey); // "02a1b2c3d4..."
     * ```
     */
    static getPublicKey(privateKey: string, compressed?: boolean): string;
    /**
     * Create a complete signed message object
     *
     * @param privateKey - Private key to sign with
     * @param message - Message to sign
     * @param address - Hoosat address (for metadata)
     * @returns Complete SignedMessage object with timestamp
     *
     * @example
     * ```typescript
     * const signedMsg = HoosatSigner.createSignedMessage(
     *   privateKey,
     *   'Hello World',
     *   'hoosat:qyp...'
     * );
     * // Returns: { message, signature, address, timestamp }
     * ```
     */
    static createSignedMessage(privateKey: string, message: string, address: string): SignedMessage;
    /**
     * Verify a complete signed message object
     *
     * @param signedMessage - SignedMessage object to verify
     * @param publicKey - Public key to verify against
     * @returns Verification result with details
     *
     * @example
     * ```typescript
     * const result = HoosatSigner.verifySignedMessage(signedMsg, publicKey);
     * if (result.valid) {
     *   console.log('Signature is valid');
     * } else {
     *   console.log('Invalid:', result.error);
     * }
     * ```
     */
    static verifySignedMessage(signedMessage: SignedMessage, publicKey: string): VerificationResult;
}

/**
 * Builder class for creating and signing Hoosat transactions
 *
 * @example
 * const builder = new TxBuilder({ debug: true });
 *
 * builder
 *   .addInput(utxo, privateKey)
 *   .addOutput(recipientAddress, '100000000')
 *   .addChangeOutput(changeAddress)
 *   .setFee('1000');
 *
 * const signedTx = builder.sign();
 */
export declare class HoosatTxBuilder {
    private _inputs;
    private _outputs;
    private _lockTime;
    private _fee;
    private _subnetworkId;
    private _payload;
    private _reusedValues;
    private _debug;
    /**
     * Creates a new transaction builder
     * @param options - Builder options
     */
    constructor(options?: TxBuilderOptions);
    /**
     * Adds an input to the transaction
     * @param utxo - UTXO to spend
     * @param privateKey - Private key for this specific input (optional if using global key in sign())
     * @returns This builder instance for chaining
     * @example
     * builder.addInput(utxo, privateKey);
     */
    addInput(utxo: UtxoForSigning, privateKey?: Buffer): this;
    /**
     * Adds an output to the transaction (for recipients only)
     *
     * ⚠️ Use addChangeOutput() for change to avoid spam protection check
     *
     * @param address - Recipient address
     * @param amount - Amount in sompi as string
     * @returns This builder instance for chaining
     * @throws Error if address is invalid
     * @throws Error if exceeds spam protection limit (max 2 recipients)
     *
     * @remarks
     * **Spam Protection:** Hoosat inherits anti-dust-attack protection from Kaspa.
     * Transactions are limited to 3 total outputs (2 recipients + 1 change) to prevent
     * spam attacks. This is a hardcoded network rule, not a configuration setting.
     *
     * **Important:** This validation only counts recipient outputs, not change.
     * Always use `addChangeOutput()` for change outputs.
     *
     * @example
     * // ✅ Correct usage
     * builder.addOutput('hoosat:qz7ulu...', '100000000');     // recipient 1
     * builder.addOutput('hoosat:qr97kz...', '50000000');      // recipient 2
     * builder.addChangeOutput(wallet.address);                // change (no check)
     *
     * @example
     * // ❌ Wrong - manually adding change
     * builder.addOutput(wallet.address, changeAmount); // ← will trigger spam check!
     */
    addOutput(address: string, amount: string): this;
    /**
     * Adds change output with automatic amount calculation
     * Change outputs bypass spam protection check
     *
     * @param changeAddress - Address to receive change
     * @returns This builder instance for chaining
     * @throws Error if insufficient funds or invalid address
     * @example
     * builder.addChangeOutput('hoosat:qz7ulu...');
     */
    addChangeOutput(changeAddress: string): this;
    /**
     * Adds a raw output to the transaction (bypasses validation)
     * Use for change outputs or advanced scenarios
     *
     * @param output - Pre-formatted transaction output
     * @returns This builder instance for chaining
     * @example
     * builder.addOutputRaw({ amount: '100000000', scriptPublicKey: {...} });
     */
    addOutputRaw(output: TransactionOutput): this;
    /**
     * Sets transaction fee
     * @param fee - Fee amount in sompi as string
     * @returns This builder instance for chaining
     * @example
     * builder.setFee('1000');
     */
    setFee(fee: string): this;
    /**
     * Sets transaction lock time
     * @param lockTime - Lock time as string
     * @returns This builder instance for chaining
     * @example
     * builder.setLockTime('0');
     */
    setLockTime(lockTime: string): this;
    /**
     * Sets subnetwork ID for the transaction
     *
     * ⚠️ Payload is disabled on the native subnetwork (0x00...00) until hardfork.
     * Alternative subnetwork IDs may allow payload before the hardfork.
     *
     * @param subnetworkId - Subnetwork ID as hex string (40 chars, 20 bytes)
     * @returns This builder instance for chaining
     * @throws Error if subnetworkId format is invalid
     *
     * @example
     * // Use alternative subnetwork that may support payload
     * builder.setSubnetworkId('0300000000000000000000000000000000000000');
     *
     * @example
     * // Use native subnetwork (default)
     * builder.setSubnetworkId('0000000000000000000000000000000000000000');
     */
    setSubnetworkId(subnetworkId: string): this;
    /**
     * Sets payload data for the transaction
     *
     * ⚠️ Payload is disabled on the native subnetwork (0x00...00) until hardfork.
     * Use alternative subnetwork IDs to test payload functionality.
     *
     * @param payload - Payload data as hex string or Buffer
     * @returns This builder instance for chaining
     *
     * @example
     * // Set payload as hex string
     * builder.setPayload('48656c6c6f20576f726c64'); // "Hello World"
     *
     * @example
     * // Set payload from Buffer
     * const data = Buffer.from('Hello World', 'utf-8');
     * builder.setPayload(data.toString('hex'));
     *
     * @example
     * // With alternative subnetwork
     * builder
     *   .setSubnetworkId('0300000000000000000000000000000000000000')
     *   .setPayload('48656c6c6f');
     */
    setPayload(payload: string): this;
    /**
     * Builds unsigned transaction
     * @returns Unsigned transaction object
     * @throws Error if validation fails
     * @example
     * const unsignedTx = builder.build();
     */
    build(): Transaction;
    /**
     * Signs the transaction with provided private key(s)
     * @param globalPrivateKey - Global private key to use for all inputs without specific keys
     * @returns Signed transaction ready for broadcast
     * @throws Error if no private key provided for any input
     * @example
     * const signedTx = builder.sign(privateKey);
     */
    sign(globalPrivateKey?: Buffer): Transaction;
    /**
     * Builds and signs transaction in one step
     * @param globalPrivateKey - Private key to use for all inputs
     * @returns Signed transaction
     * @example
     * const signedTx = builder.buildAndSign(privateKey);
     */
    buildAndSign(globalPrivateKey?: Buffer): Transaction;
    /**
     * Estimates minimum transaction fee based on inputs/outputs count
     * @param payloadSize - Payload size in bytes (default: 0)
     * @returns Minimum fee as string
     * @example
     * const fee = builder.estimateFee();
     */
    estimateFee(payloadSize?: number): string;
    /**
     * Gets total amount of all inputs
     * @returns Total input amount as bigint
     * @example
     * const totalIn = builder.getTotalInputAmount();
     */
    getTotalInputAmount(): bigint;
    /**
     * Gets total amount of all outputs
     * @returns Total output amount as bigint
     * @example
     * const totalOut = builder.getTotalOutputAmount();
     */
    getTotalOutputAmount(): bigint;
    /**
     * Validates transaction amounts
     * @throws Error if outputs + fee exceed inputs
     * @example
     * builder.validate(); // throws if invalid
     */
    validate(): void;
    /**
     * Resets builder to initial state
     * @returns This builder instance for chaining
     * @example
     * builder.clear().addInput(...).addOutput(...);
     */
    clear(): this;
    /**
     * Gets current number of inputs
     * @returns Number of inputs
     */
    getInputCount(): number;
    /**
     * Gets current number of outputs
     * @returns Number of outputs
     */
    getOutputCount(): number;
}

export declare class HoosatUtils {
    /**
     * Formats an amount from sompi (smallest unit) to HTN (readable format)
     * @param sompi - Amount in sompi as string or bigint
     * @returns Formatted amount in HTN with 8 decimal places
     * @example
     * HoosatUtils.sompiToAmount('100000000') // '1.00000000'
     */
    static sompiToAmount(sompi: string | bigint): string;
    /**
     * Parses an amount from HTN (readable format) to sompi (smallest unit)
     * @param htn - Amount in HTN as string
     * @returns Amount in sompi as string
     * @example
     * HoosatUtils.amountToSompi('1.5') // '150000000'
     */
    static amountToSompi(htn: string): string;
    /**
     * Formats amount with thousands separators for display
     * @param htn - Amount in HTN as string
     * @param decimals - Number of decimal places (default: 8)
     * @returns Formatted string with separators
     * @example
     * HoosatUtils.formatAmount('1234567.89') // '1,234,567.89000000'
     */
    static formatAmount(htn: string, decimals?: number): string;
    /**
     * Validates a Hoosat address format (both mainnet and testnet)
     * @param address - HTN address as string
     * @returns True if valid, false otherwise
     * @example
     * HoosatUtils.isValidAddress('hoosat:qz7ulu...') // mainnet - true
     * HoosatUtils.isValidAddress('hoosattest:qreey20...') // testnet - true
     */
    static isValidAddress(address: string): boolean;
    /**
     * Validates an array of Hoosat addresses
     * @param addresses - Array of addresses to validate
     * @param checkUnique - Whether to check for duplicate addresses (default: false)
     * @returns True if all addresses are valid, false otherwise
     * @example
     * HoosatUtils.isValidAddresses(['hoosat:qz7...', 'hoosat:qyp...']) // true
     */
    static isValidAddresses(addresses: string[], checkUnique?: boolean): boolean;
    /**
     * Gets the version of a Hoosat address
     * @param address - HTN address as string
     * @returns Version number (0x00, 0x01, 0x08) or null if invalid
     * @example
     * HoosatUtils.getAddressVersion('hoosat:qyp...') // 0x01 (ECDSA)
     */
    static getAddressVersion(address: string): number | null;
    /**
     * Gets the type of a Hoosat address
     * @param address - HTN address as string
     * @returns Address type: 'schnorr' | 'ecdsa' | 'p2sh' | null if invalid
     * @example
     * HoosatUtils.getAddressType('hoosat:qyp...') // 'ecdsa'
     */
    static getAddressType(address: string): 'schnorr' | 'ecdsa' | 'p2sh' | null;
    /**
     * Gets the network type from a Hoosat address
     * @param address - HTN address as string
     * @returns Network type: 'mainnet' | 'testnet' | null if invalid
     * @example
     * HoosatUtils.getAddressNetwork('hoosat:qz7ulu...') // 'mainnet'
     * HoosatUtils.getAddressNetwork('hoosattest:qreey20...') // 'testnet'
     */
    static getAddressNetwork(address: string): 'mainnet' | 'testnet' | null;
    /**
     * Validates a hexadecimal hash
     * @param hash - Hash string to validate
     * @param length - Expected length in characters (default: 64 for 32 bytes)
     * @returns True if valid hex hash, false otherwise
     * @example
     * HoosatUtils.isValidHash('a1b2c3...') // true if 64 chars
     */
    static isValidHash(hash: string, length?: number): boolean;
    /**
     * Validates a transaction ID
     * @param txId - Transaction ID to validate
     * @returns True if valid transaction ID, false otherwise
     * @example
     * HoosatUtils.isValidTransactionId('091ea22a707ac840...') // true
     */
    static isValidTransactionId(txId: string): boolean;
    /**
     * Validates a block hash
     * @param blockHash - Block hash to validate
     * @returns True if valid block hash, false otherwise
     * @example
     * HoosatUtils.isValidBlockHash('a1b2c3d4e5f6...') // true
     */
    static isValidBlockHash(blockHash: string): boolean;
    /**
     * Validates an array of hashes
     * @param hashes - Array of hashes to validate
     * @param length - Expected length of each hash (default: 64)
     * @returns True if all hashes are valid, false otherwise
     * @example
     * HoosatUtils.isValidHashes(['a1b2...', 'c3d4...']) // true
     */
    static isValidHashes(hashes: string[], length?: 64): boolean;
    /**
     * Validates a private key
     * @param privateKey - Private key as hex string
     * @returns True if valid 32-byte private key, false otherwise
     * @example
     * HoosatUtils.isValidPrivateKey('33a4a81e...') // true if 64 chars
     */
    static isValidPrivateKey(privateKey: string): boolean;
    /**
     * Validates a public key
     * @param publicKey - Public key as hex string
     * @param compressed - Whether key is compressed (default: true)
     * @returns True if valid public key, false otherwise
     * @example
     * HoosatUtils.isValidPublicKey('02eddf8d...') // true if 66 chars (compressed)
     */
    static isValidPublicKey(publicKey: string, compressed?: boolean): boolean;
    /**
     * Validates an amount string
     * @param amount - Amount to validate (in HTN or sompi)
     * @param maxDecimals - Maximum decimal places (default: 8)
     * @returns True if valid amount, false otherwise
     * @example
     * HoosatUtils.isValidAmount('1.5') // true
     * HoosatUtils.isValidAmount('1.123456789') // false (too many decimals)
     */
    static isValidAmount(amount: string, maxDecimals?: number): boolean;
    /**
     * Truncates an address for display in UI
     * @param address - Full address
     * @param startChars - Characters to show at start (default: 12)
     * @param endChars - Characters to show at end (default: 8)
     * @returns Truncated address with ellipsis
     * @example
     * HoosatUtils.truncateAddress('hoosat:qz7ulu...abc123')
     * // 'hoosat:qz7ul...abc123'
     */
    static truncateAddress(address: string, startChars?: number, endChars?: number): string;
    /**
     * Truncates a hash for display in UI
     * @param hash - Full hash
     * @param startChars - Characters to show at start (default: 8)
     * @param endChars - Characters to show at end (default: 8)
     * @returns Truncated hash with ellipsis
     * @example
     * HoosatUtils.truncateHash('a1b2c3d4e5f6...xyz') // 'a1b2c3d4...xyz'
     */
    static truncateHash(hash: string, startChars?: number, endChars?: number): string;
    /**
     * Compares two addresses for equality (case-insensitive)
     * @param address1 - First address
     * @param address2 - Second address
     * @returns True if addresses are equal, false otherwise
     * @example
     * HoosatUtils.compareAddresses('hoosat:QZ7...', 'hoosat:qz7...') // true
     */
    static compareAddresses(address1: string, address2: string): boolean;
    /**
     * Compares two hashes for equality (case-insensitive)
     * @param hash1 - First hash
     * @param hash2 - Second hash
     * @returns True if hashes are equal, false otherwise
     * @example
     * HoosatUtils.compareHashes('A1B2C3...', 'a1b2c3...') // true
     */
    static compareHashes(hash1: string, hash2: string): boolean;
    /**
     * Formats hashrate to human-readable format with automatic unit selection
     * @param hashrate - Hashrate value as number or string (H/s)
     * @param decimals - Number of decimal places (default: 2)
     * @returns Formatted hashrate string with unit (e.g., '1.50 TH/s')
     * @example
     * HoosatUtils.formatHashrate(1500000000000) // '1.50 TH/s'
     * HoosatUtils.formatHashrate('150000000') // '150.00 MH/s'
     */
    static formatHashrate(hashrate: number | string, decimals?: number): string;
    /**
     * Formats difficulty to human-readable format with automatic unit selection
     * @param difficulty - Difficulty value as number or string
     * @param decimals - Number of decimal places (default: 2)
     * @returns Formatted difficulty string with unit (e.g., '1.50 T')
     * @example
     * HoosatUtils.formatDifficulty(1500000000000) // '1.50 T'
     * HoosatUtils.formatDifficulty('150000000') // '150.00 M'
     */
    static formatDifficulty(difficulty: number | string, decimals?: number): string;
    /**
     * Parses formatted hashrate string to numeric value in H/s
     * @param formatted - Formatted hashrate string (e.g., '1.5 TH/s')
     * @returns Numeric hashrate value in H/s or null if invalid
     * @example
     * HoosatUtils.parseHashrate('1.5 TH/s') // 1500000000000
     */
    static parseHashrate(formatted: string): number | null;
    /**
     * Converts hex string to Buffer
     * @param hex - Hex string
     * @returns Buffer or null if invalid
     * @example
     * HoosatUtils.hexToBuffer('a1b2c3') // Buffer<a1 b2 c3>
     */
    static hexToBuffer(hex: string): Buffer | null;
    /**
     * Converts Buffer to hex string
     * @param buffer - Buffer to convert
     * @returns Hex string
     * @example
     * HoosatUtils.bufferToHex(Buffer.from([161, 178, 195])) // 'a1b2c3'
     */
    static bufferToHex(buffer: Buffer): string;
    /**
     * Decodes hex-encoded payload to UTF-8 string
     * @param hexPayload - Hex-encoded payload string (with or without 0x prefix)
     * @returns Decoded UTF-8 string
     * @throws Error if payload is not valid hex
     * @example
     * HoosatUtils.decodePayload('48656c6c6f') // 'Hello'
     */
    static decodePayload(hexPayload: string): string;
    /**
     * Decodes hex-encoded payload and parses it as JSON
     * @param hexPayload - Hex-encoded JSON payload string
     * @returns Parsed JSON object
     * @throws Error if payload is not valid hex or JSON
     * @example
     * const data = HoosatUtils.parsePayloadAsJson('7b2274797065223a22766f7465227d');
     * // Returns: { type: 'vote' }
     */
    static parsePayloadAsJson<T = any>(hexPayload: string): T;
    /**
     * Encodes UTF-8 string to hex payload
     * @param payload - UTF-8 string to encode
     * @returns Hex-encoded payload string
     * @example
     * HoosatUtils.encodePayload('Hello') // '48656c6c6f'
     */
    static encodePayload(payload: string): string;
    /**
     * Encodes JSON object to hex payload
     * @param data - Object to encode as JSON payload
     * @returns Hex-encoded JSON payload string
     * @example
     * HoosatUtils.encodePayloadAsJson({ type: 'vote' }) // '7b2274797065223a22766f7465227d'
     */
    static encodePayloadAsJson(data: any): string;
    /**
     * Checks if payload is valid JSON after decoding
     * @param hexPayload - Hex-encoded payload string
     * @returns True if payload is valid JSON, false otherwise
     * @example
     * HoosatUtils.isJsonPayload('7b7d') // true (empty object)
     * HoosatUtils.isJsonPayload('48656c6c6f') // false ('Hello' is not JSON)
     */
    static isJsonPayload(hexPayload: string): boolean;
    /**
     * Decodes payload with fallback to raw hex if not valid UTF-8
     * @param hexPayload - Hex-encoded payload string
     * @returns Object with decoded string and metadata
     * @example
     * HoosatUtils.decodePayloadSafe('48656c6c6f')
     * // Returns: { decoded: 'Hello', isValidUtf8: true, isJson: false }
     */
    static decodePayloadSafe(hexPayload: string): {
        decoded: string;
        isValidUtf8: boolean;
        isJson: boolean;
        raw: string;
    };
}

/**
 * HoosatWebClient - REST API client for browser-based Hoosat applications
 *
 * Now supports multiple API providers with automatic fallback and extensible architecture.
 * All methods return promises and handle errors gracefully.
 *
 * @example
 * ```typescript
 * // Using single provider (backward compatible)
 * const client = new HoosatWebClient({
 *   baseUrl: 'https://proxy.hoosat.net/api/v1',
 *   timeout: 30000
 * });
 *
 * // Using custom provider
 * const customProvider = new HoosatProxyProvider({ baseUrl: 'https://proxy.hoosat.net/api/v1' });
 * const client = new HoosatWebClient({ provider: customProvider });
 *
 * // Using multiple providers with fallback
 * const multiProvider = new MultiProvider({
 *   providers: [proxyProvider, networkProvider],
 *   strategy: 'failover'
 * });
 * const client = new HoosatWebClient({ provider: multiProvider });
 * ```
 */
export declare class HoosatWebClient {
    private readonly provider;
    /**
     * Creates a new HoosatWebClient instance
     *
     * @param config - Client configuration
     * @param config.baseUrl - Base URL of the API (backward compatibility)
     * @param config.provider - Custom API provider instance
     * @param config.timeout - Request timeout in milliseconds (default: 30000)
     * @param config.headers - Additional headers to include in requests
     * @param config.debug - Enable debug logging (default: false)
     */
    constructor(config: BrowserClientConfig & {
        provider?: ApiProvider;
    });
    /**
     * Get balance for a Hoosat address
     *
     * @param address - Hoosat address (e.g., 'hoosat:qz7ulu...')
     * @returns Address balance in sompi
     *
     * @example
     * ```typescript
     * const balance = await client.getBalance('hoosat:qz7ulu...');
     * console.log(`Balance: ${balance.balance} sompi`);
     * // Convert to HTN: parseFloat(balance.balance) / 100_000_000
     * ```
     */
    getBalance(address: string): Promise<AddressBalance>;
    /**
     * Get UTXOs for Hoosat addresses
     * Required for building transactions
     *
     * @param addresses - Array of Hoosat addresses
     * @returns List of unspent transaction outputs
     *
     * @example
     * ```typescript
     * const utxos = await client.getUtxos(['hoosat:qz7ulu...']);
     * console.log(`Found ${utxos.utxos.length} UTXOs`);
     *
     * // Use with HoosatTxBuilder
     * const builder = new HoosatTxBuilder();
     * utxos.utxos.forEach(utxo => {
     *   builder.addInput(utxo, privateKey);
     * });
     * ```
     */
    getUtxos(addresses: string[]): Promise<AddressUtxos>;
    /**
     * Submit a signed transaction to the network
     *
     * @param transaction - Signed transaction object (from HoosatTxBuilder)
     * @returns Transaction ID
     *
     * @example
     * ```typescript
     * // Build and sign transaction
     * const builder = new HoosatTxBuilder();
     * // ... add inputs, outputs, sign ...
     * const signedTx = builder.sign(privateKey);
     *
     * // Submit to network
     * const result = await client.submitTransaction(signedTx);
     * console.log(`Transaction submitted: ${result.transactionId}`);
     * ```
     */
    submitTransaction(transaction: Transaction): Promise<TransactionSubmission>;
    /**
     * Get network information
     *
     * @returns Network status and sync information
     *
     * @example
     * ```typescript
     * const info = await client.getNetworkInfo();
     * console.log(`Network: ${info.networkName}`);
     * console.log(`Synced: ${info.isSynced}`);
     * console.log(`Block height: ${info.blockCount}`);
     * ```
     */
    getNetworkInfo(): Promise<NetworkInfo>;
    /**
     * Get recommended transaction fees
     *
     * @returns Fee recommendations in sompi per byte
     *
     * @example
     * ```typescript
     * const fees = await client.getFeeEstimate();
     * console.log(`Normal fee: ${fees.medium} sompi/byte`);
     *
     * // Use with HoosatCrypto.calculateMinFee()
     * const fee = HoosatCrypto.calculateMinFee(inputCount, outputCount);
     * ```
     */
    getFeeEstimate(): Promise<FeeRecommendation>;
    /**
     * Check if API is reachable
     *
     * @returns true if API responds successfully
     *
     * @example
     * ```typescript
     * const isOnline = await client.ping();
     * if (!isOnline) {
     *   console.error('API is unreachable');
     * }
     * ```
     */
    ping(): Promise<boolean>;
    /**
     * Get the current API provider instance
     *
     * @returns Current provider
     */
    getProvider(): ApiProvider;
}

export declare interface KeyPair {
    privateKey: Buffer;
    publicKey: Buffer;
    address: string;
    network?: HoosatNetwork;
}

/**
 * Standard message prefix for Hoosat signatures
 * Similar to Bitcoin's "Bitcoin Signed Message:\n"
 * This prevents transaction replay attacks
 */
export declare const MESSAGE_PREFIX = "Hoosat Signed Message:\n";

export declare class MultiProvider implements ApiProvider {
    private readonly providers;
    private readonly strategy;
    private readonly maxRetries;
    private readonly retryDelay;
    private readonly debug;
    private currentProviderIndex;
    constructor(config: MultiProviderConfig);
    private withFallback;
    getBalance(address: string): Promise<AddressBalance>;
    getUtxos(addresses: string[]): Promise<AddressUtxos>;
    submitTransaction(tx: Transaction): Promise<TransactionSubmission>;
    getNetworkInfo(): Promise<NetworkInfo>;
    getFeeEstimate(): Promise<FeeRecommendation>;
    ping(): Promise<boolean>;
    getProviders(): ApiProvider[];
    getStrategy(): string;
}

export declare interface MultiProviderConfig {
    providers: ApiProvider[];
    strategy?: 'failover' | 'fastest' | 'round-robin';
    maxRetries?: number;
    retryDelay?: number;
    debug?: boolean;
}

export declare interface NetworkInfo {
    p2pId: string;
    mempoolSize: string;
    serverVersion: string;
    isUtxoIndexed: string[];
    isSynced: number;
}

/**
 * Parsed payment URI result
 */
export declare interface ParsedPaymentURI {
    address: string;
    amount?: string;
    label?: string;
    message?: string;
    rawUri: string;
}

/**
 * Payment URI parameters for Hoosat transactions
 */
export declare interface PaymentURIParams {
    address: string;
    amount?: string | number;
    label?: string;
    message?: string;
}

export declare enum PriorityFee {
    Low = "low",
    Normal = "normal",
    High = "high",
    Urgent = "urgent"
}

export declare interface ProviderConfig {
    baseUrl: string;
    timeout?: number;
    headers?: Record<string, string>;
    debug?: boolean;
}

/**
 * QR code generation options
 */
export declare interface QRCodeOptions {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    width?: number;
    margin?: number;
    color?: {
        dark?: string;
        light?: string;
    };
}

export declare interface RequestOptions {
    timeout?: number;
    headers?: Record<string, string>;
    retries?: number;
}

declare interface SighashReusedValues {
    previousOutputsHash?: Buffer;
    sequencesHash?: Buffer;
    sigOpCountsHash?: Buffer;
    outputsHash?: Buffer;
    payloadHash?: Buffer;
}

/**
 * TypeScript type definitions for Hoosat message signing
 */
/**
 * A signed message with metadata
 */
export declare interface SignedMessage {
    /** Original message that was signed */
    message: string;
    /** Compact signature in hex format (128 chars) */
    signature: string;
    /** Hoosat address that signed the message */
    address: string;
    /** Optional timestamp when message was signed */
    timestamp?: number;
    /** Optional metadata */
    metadata?: Record<string, any>;
}

export declare interface Transaction {
    version: number;
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
    lockTime: string;
    subnetworkId: string;
    gas: string;
    payload: string;
    fee?: string;
}

export declare interface TransactionInput {
    previousOutpoint: {
        transactionId: string;
        index: number;
    };
    signatureScript: string;
    sequence: string;
    sigOpCount: number;
    utxoEntry?: UtxoEntry;
}

export declare interface TransactionOutput {
    amount: string;
    scriptPublicKey: {
        version: number;
        scriptPublicKey: string;
    };
}

export declare interface TransactionSignature {
    signature: Buffer;
    publicKey: Buffer;
    sigHashType: number;
}

export declare interface TransactionSubmission {
    transactionId: string;
}

export declare interface TxBuilderOptions {
    debug?: boolean;
}

export declare interface UtxoEntry {
    amount: string;
    scriptPublicKey: {
        script: string;
        version: number;
    };
    blockDaaScore: string;
    isCoinbase: boolean;
}

declare interface UtxoEntry_2 {
    outpoint: {
        transactionId: string;
        index: number;
    };
    utxoEntry: {
        amount: string;
        scriptPublicKey: {
            script: string;
            version: number;
        };
        blockDaaScore: string;
        isCoinbase: boolean;
    };
}

export declare interface UtxoForSigning {
    outpoint: {
        transactionId: string;
        index: number;
    };
    utxoEntry: UtxoEntry;
}

/**
 * Message verification result
 */
export declare interface VerificationResult {
    /** True if signature is valid */
    valid: boolean;
    /** Recovered public key (if verification succeeded) */
    publicKey?: string;
    /** Error message (if verification failed) */
    error?: string;
}

export { }
