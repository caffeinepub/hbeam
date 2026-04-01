import { HoosatCrypto } from "hoosat-sdk-web";
import { useCallback, useState } from "react";

const STORAGE_KEY = "hbeam_encrypted_wallet";
const SALT_STRING = "hbeam-wallet-v1";

interface StoredWallet {
  encryptedPrivKey: string; // hex
  iv: string; // hex
  address: string;
}

async function deriveKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(SALT_STRING),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptPrivKey(
  privKeyHex: string,
  password: string,
): Promise<{ encryptedPrivKey: string; iv: string }> {
  const key = await deriveKey(password);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(privKeyHex),
  );
  return {
    encryptedPrivKey: Buffer.from(ciphertext).toString("hex"),
    iv: Buffer.from(iv).toString("hex"),
  };
}

async function decryptPrivKey(
  encryptedHex: string,
  ivHex: string,
  password: string,
): Promise<string> {
  const key = await deriveKey(password);
  const iv = Buffer.from(ivHex, "hex");
  const ciphertext = Buffer.from(encryptedHex, "hex");
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );
  return new TextDecoder().decode(plaintext);
}

export interface WalletState {
  address: string | null;
  privateKey: Buffer | null;
  isLocked: boolean;
  hasStoredWallet: () => boolean;
  generateWallet: (password: string) => Promise<string>;
  importWallet: (privateKeyHex: string, password: string) => Promise<string>;
  unlockWallet: (password: string) => Promise<string>;
  lockWallet: () => void;
  storedAddress: string | null;
}

export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<Buffer | null>(null);

  const hasStoredWallet = useCallback(() => {
    return !!localStorage.getItem(STORAGE_KEY);
  }, []);

  const storedAddress = (() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return (JSON.parse(raw) as StoredWallet).address;
    } catch {
      return null;
    }
  })();

  const generateWallet = useCallback(
    async (password: string): Promise<string> => {
      const keyPair = HoosatCrypto.generateKeyPair("mainnet");
      const privKeyHex = keyPair.privateKey.toString("hex");
      const { encryptedPrivKey, iv } = await encryptPrivKey(
        privKeyHex,
        password,
      );
      const stored: StoredWallet = {
        encryptedPrivKey,
        iv,
        address: keyPair.address,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      setAddress(keyPair.address);
      setPrivateKey(keyPair.privateKey);
      return keyPair.address;
    },
    [],
  );

  const importWallet = useCallback(
    async (privateKeyHex: string, password: string): Promise<string> => {
      const keyPair = HoosatCrypto.importKeyPair(privateKeyHex, "mainnet");
      const { encryptedPrivKey, iv } = await encryptPrivKey(
        privateKeyHex,
        password,
      );
      const stored: StoredWallet = {
        encryptedPrivKey,
        iv,
        address: keyPair.address,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      setAddress(keyPair.address);
      setPrivateKey(keyPair.privateKey);
      return keyPair.address;
    },
    [],
  );

  const unlockWallet = useCallback(
    async (password: string): Promise<string> => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) throw new Error("No stored wallet found");
      const stored: StoredWallet = JSON.parse(raw);
      const privKeyHex = await decryptPrivKey(
        stored.encryptedPrivKey,
        stored.iv,
        password,
      );
      const keyPair = HoosatCrypto.importKeyPair(privKeyHex, "mainnet");
      setAddress(keyPair.address);
      setPrivateKey(keyPair.privateKey);
      return keyPair.address;
    },
    [],
  );

  const lockWallet = useCallback(() => {
    setPrivateKey(null);
  }, []);

  return {
    address,
    privateKey,
    isLocked: privateKey === null,
    hasStoredWallet,
    generateWallet,
    importWallet,
    unlockWallet,
    lockWallet,
    storedAddress,
  };
}
