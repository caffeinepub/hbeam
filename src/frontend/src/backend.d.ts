import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MessagePublic {
    id: string;
    paymentStatus?: PaymentStatus;
    content: string;
    txId?: string;
    recipient: HoosatAddress;
    sender: HoosatAddress;
    messageType: MessageTypePublic;
    fileMetadata?: FileMetadata;
    timestamp: bigint;
    reactions: Array<Reaction>;
    readBy: Array<HoosatAddress>;
}
export interface PresenceRecord {
    userId: HoosatAddress;
    isOnline: boolean;
    lastSeen: bigint;
}
export type HoosatAddress = string;
export interface FileMetadata {
    fileName: string;
    fileSize: bigint;
    fileType: string;
}
export interface Contact {
    displayName: string;
    address: HoosatAddress;
}
export interface PaymentRecord {
    status: PaymentStatus;
    messageId: string;
    createdAt: bigint;
    txId: string;
    recipient: HoosatAddress;
    sender: HoosatAddress;
    updatedAt: bigint;
    amount: string;
}
export interface WalletAddress {
    principal: Principal;
    hoosatAddress: HoosatAddress;
}
export interface Reaction {
    userId: HoosatAddress;
    emoji: string;
    timestamp: bigint;
}
export enum MessageType {
    voice = "voice",
    file = "file",
    text = "text"
}
export enum MessageTypePublic {
    voice = "voice",
    file = "file",
    text = "text",
    payment = "payment"
}
export enum PaymentStatus {
    broadcasted = "broadcasted",
    pending = "pending",
    confirmed = "confirmed",
    failed = "failed"
}
export interface backendInterface {
    addContact(userAddress: HoosatAddress, contactAddress: HoosatAddress, displayName: string): Promise<void>;
    addReaction(userId: HoosatAddress, convId: string, messageId: string, emoji: string, timestamp: bigint): Promise<void>;
    createPaymentMessage(sender: HoosatAddress, recipient: HoosatAddress, amountHtn: string, timestamp: bigint): Promise<string>;
    getAllWalletAddresses(): Promise<Array<WalletAddress>>;
    getContacts(userAddress: HoosatAddress): Promise<Array<Contact>>;
    getMessages(user1: HoosatAddress, user2: HoosatAddress, limit: bigint | null, since: bigint | null): Promise<Array<MessagePublic>>;
    getPaymentHistory(userAddress: HoosatAddress): Promise<Array<PaymentRecord>>;
    getPaymentStatus(messageId: string): Promise<[PaymentStatus, string] | null>;
    getPresence(userIds: Array<HoosatAddress>): Promise<Array<PresenceRecord>>;
    getTypingStatus(convId: string): Promise<Array<HoosatAddress>>;
    getUnreadCount(userId: HoosatAddress, contactAddress: HoosatAddress): Promise<bigint>;
    getWalletAddress(user: Principal): Promise<HoosatAddress>;
    markMessagesRead(userId: HoosatAddress, convId: string, upToTimestamp: bigint): Promise<void>;
    registerWalletAddress(hoosatAddress: HoosatAddress): Promise<void>;
    removeContact(userAddress: HoosatAddress, contactAddress: HoosatAddress): Promise<void>;
    removeReaction(userId: HoosatAddress, convId: string, messageId: string, emoji: string): Promise<void>;
    sendMessage(sender: HoosatAddress, recipient: HoosatAddress, content: string, timestamp: bigint, messageType: MessageType, fileMetadata: FileMetadata | null): Promise<string>;
    setPresence(userId: HoosatAddress, isOnline: boolean, timestamp: bigint): Promise<void>;
    setTypingStatus(userId: HoosatAddress, convId: string, isTyping: boolean, timestamp: bigint): Promise<void>;
    updatePaymentStatus(messageId: string, txId: string, newStatus: PaymentStatus, timestamp: bigint): Promise<void>;
}
