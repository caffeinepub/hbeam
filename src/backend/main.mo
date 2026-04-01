import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

actor {
  type HoosatAddress = Text;

  type Message = {
    sender : HoosatAddress;
    recipient : HoosatAddress;
    content : Text;
    timestamp : Nat;
    messageType : MessageType;
    fileMetadata : ?FileMetadata;
  };

  type MessageType = {
    #text;
    #file;
    #voice;
  };

  type FileMetadata = {
    fileName : Text;
    fileSize : Nat;
    fileType : Text;
  };

  type Contact = {
    address : HoosatAddress;
    displayName : Text;
  };

  type ConversationId = Text;

  type WalletAddress = {
    principal : Principal;
    hoosatAddress : HoosatAddress;
  };

  module WalletAddress {
    public func compare(a : WalletAddress, b : WalletAddress) : Order.Order {
      Text.compare(a.hoosatAddress, b.hoosatAddress);
    };
  };

  let conversations = Map.empty<ConversationId, List.List<Message>>();
  let contacts = Map.empty<HoosatAddress, List.List<Contact>>();
  let walletAddresses = Map.empty<Principal, HoosatAddress>();

  public shared ({ caller }) func addContact(userAddress : HoosatAddress, contactAddress : HoosatAddress, displayName : Text) : async () {
    switch (contacts.get(userAddress)) {
      case (null) {
        let newContacts = List.empty<Contact>();
        newContacts.add({ address = contactAddress; displayName });
        contacts.add(userAddress, newContacts);
      };
      case (?existingContacts) {
        let newContact : Contact = {
          address = contactAddress;
          displayName;
        };
        existingContacts.add(newContact);
      };
    };
  };

  public shared ({ caller }) func removeContact(userAddress : HoosatAddress, contactAddress : HoosatAddress) : async () {
    switch (contacts.get(userAddress)) {
      case (null) { Runtime.trap("User has no contacts") };
      case (?existingContacts) {
        let filteredContacts = existingContacts.filter(func(c) { c.address != contactAddress });
        contacts.add(userAddress, filteredContacts);
      };
    };
  };

  public query ({ caller }) func getContacts(userAddress : HoosatAddress) : async [Contact] {
    switch (contacts.get(userAddress)) {
      case (null) { [] };
      case (?userContacts) { userContacts.toArray() };
    };
  };

  public shared ({ caller }) func registerWalletAddress(hoosatAddress : HoosatAddress) : async () {
    walletAddresses.add(caller, hoosatAddress);
  };

  public query ({ caller }) func getWalletAddress(user : Principal) : async HoosatAddress {
    switch (walletAddresses.get(user)) {
      case (null) { Runtime.trap("Wallet address not found") };
      case (?address) { address };
    };
  };

  public query ({ caller }) func getAllWalletAddresses() : async [WalletAddress] {
    walletAddresses.entries().map(func((principal, hoosatAddress)) { { principal; hoosatAddress } }).toArray().sort();
  };
};
