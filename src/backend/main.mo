import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

persistent actor {
  type HoosatAddress = Text;

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

  type Message = {
    sender : HoosatAddress;
    recipient : HoosatAddress;
    content : Text;
    timestamp : Nat;
    messageType : MessageType;
    fileMetadata : ?FileMetadata;
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

  let conversations = Map.empty<ConversationId, List.List<Message>>();
  let contacts = Map.empty<HoosatAddress, List.List<Contact>>();
  let walletAddresses = Map.empty<Principal, HoosatAddress>();

  func makeConvId(a : HoosatAddress, b : HoosatAddress) : ConversationId {
    switch (Text.compare(a, b)) {
      case (#less) { a # ":" # b };
      case (#greater) { b # ":" # a };
      case (#equal) { a # ":" # b };
    };
  };

  public shared ({ caller = _ }) func sendMessage(
    sender : HoosatAddress,
    recipient : HoosatAddress,
    content : Text,
    timestamp : Nat
  ) : async () {
    let convId = makeConvId(sender, recipient);
    let msg : Message = {
      sender;
      recipient;
      content;
      timestamp;
      messageType = #text;
      fileMetadata = null;
    };
    switch (conversations.get(convId)) {
      case (null) {
        let msgs = List.empty<Message>();
        msgs.add(msg);
        conversations.add(convId, msgs);
      };
      case (?existing) {
        existing.add(msg);
      };
    };
  };

  public query ({ caller = _ }) func getMessages(
    user1 : HoosatAddress,
    user2 : HoosatAddress
  ) : async [Message] {
    let convId = makeConvId(user1, user2);
    switch (conversations.get(convId)) {
      case (null) { [] };
      case (?msgs) { msgs.toArray() };
    };
  };

  public shared ({ caller = _ }) func addContact(userAddress : HoosatAddress, contactAddress : HoosatAddress, displayName : Text) : async () {
    switch (contacts.get(userAddress)) {
      case (null) {
        let newContacts = List.empty<Contact>();
        newContacts.add({ address = contactAddress; displayName });
        contacts.add(userAddress, newContacts);
      };
      case (?existingContacts) {
        existingContacts.add({ address = contactAddress; displayName });
      };
    };
  };

  public shared ({ caller = _ }) func removeContact(userAddress : HoosatAddress, contactAddress : HoosatAddress) : async () {
    switch (contacts.get(userAddress)) {
      case (null) { Runtime.trap("User has no contacts") };
      case (?existingContacts) {
        let filteredContacts = existingContacts.filter(func(c : Contact) : Bool { c.address != contactAddress });
        contacts.add(userAddress, filteredContacts);
      };
    };
  };

  public query ({ caller = _ }) func getContacts(userAddress : HoosatAddress) : async [Contact] {
    switch (contacts.get(userAddress)) {
      case (null) { [] };
      case (?userContacts) { userContacts.toArray() };
    };
  };

  public shared ({ caller }) func registerWalletAddress(hoosatAddress : HoosatAddress) : async () {
    walletAddresses.add(caller, hoosatAddress);
  };

  public query ({ caller = _ }) func getWalletAddress(user : Principal) : async HoosatAddress {
    switch (walletAddresses.get(user)) {
      case (null) { Runtime.trap("Wallet address not found") };
      case (?address) { address };
    };
  };

  public query ({ caller = _ }) func getAllWalletAddresses() : async [WalletAddress] {
    walletAddresses.entries()
      .map(func((p, h) : (Principal, HoosatAddress)) : WalletAddress {
        { principal = p; hoosatAddress = h }
      })
      .toArray();
  };
};
