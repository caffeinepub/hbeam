import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type HoosatAddress = string;
export interface WalletAddress {
    principal: Principal;
    hoosatAddress: HoosatAddress;
}
export interface Contact {
    displayName: string;
    address: HoosatAddress;
}
export interface FileMetadata {
    fileName: string;
    fileSize: bigint;
    fileType: string;
}
export type MessageType = { text: null } | { file: null } | { voice: null };
export interface Message {
    sender: HoosatAddress;
    recipient: HoosatAddress;
    content: string;
    timestamp: bigint;
    messageType: MessageType;
    fileMetadata: [] | [FileMetadata];
}
export interface backendInterface {
    addContact(userAddress: HoosatAddress, contactAddress: HoosatAddress, displayName: string): Promise<void>;
    getAllWalletAddresses(): Promise<Array<WalletAddress>>;
    getContacts(userAddress: HoosatAddress): Promise<Array<Contact>>;
    getMessages(user1: HoosatAddress, user2: HoosatAddress): Promise<Array<Message>>;
    getWalletAddress(user: Principal): Promise<HoosatAddress>;
    registerWalletAddress(hoosatAddress: HoosatAddress): Promise<void>;
    removeContact(userAddress: HoosatAddress, contactAddress: HoosatAddress): Promise<void>;
    sendMessage(sender: HoosatAddress, recipient: HoosatAddress, content: string, timestamp: bigint): Promise<void>;
}
