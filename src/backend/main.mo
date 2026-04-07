import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

actor {
  type HoosatAddress = Text;
  type ConversationId = Text;

  type MessageType = {
    #text;
    #file;
    #voice;
  };

  type PaymentStatus = {
    #pending;
    #broadcasted;
    #confirmed;
    #failed;
  };

  // Exactly matches the old stable state schema
  type FileMetadata = {
    fileName : Text;
    fileSize : Nat;
    fileType : Text;
  };

  // Exactly matches the old stable state schema for Message
  // Old fields: {sender, recipient, content, timestamp, messageType, fileMetadata}
  // MessageType in old state: {#file, #text, #voice} — no #payment
  type Message = {
    sender : HoosatAddress;
    recipient : HoosatAddress;
    content : Text;
    timestamp : Nat;
    messageType : MessageType;
    fileMetadata : ?FileMetadata;
  };

  // Extended type for public API (adds #payment variant)
  type MessageTypePublic = {
    #text;
    #file;
    #voice;
    #payment;
  };

  // Shared (API boundary) — adds computed/supplemental fields
  type MessagePublic = {
    id : Text;
    sender : HoosatAddress;
    recipient : HoosatAddress;
    content : Text;
    timestamp : Nat;
    messageType : MessageTypePublic;
    fileMetadata : ?FileMetadata;
    txId : ?Text;
    paymentStatus : ?PaymentStatus;
    readBy : [HoosatAddress];
    reactions : [Reaction];
  };

  type Reaction = {
    userId : HoosatAddress;
    emoji : Text;
    timestamp : Nat;
  };

  // Supplemental state indexed by convId+msgIndex
  type MsgMeta = {
    txId : ?Text;
    paymentStatus : ?PaymentStatus;
    readBy : List.List<HoosatAddress>;
    reactions : List.List<Reaction>;
  };

  type Contact = {
    address : HoosatAddress;
    displayName : Text;
  };

  type WalletAddress = {
    principal : Principal;
    hoosatAddress : HoosatAddress;
  };

  type PresenceRecord = {
    userId : HoosatAddress;
    isOnline : Bool;
    lastSeen : Nat;
  };

  type TypingRecord = {
    userId : HoosatAddress;
    conversationId : Text;
    timestamp : Nat;
  };

  type PaymentRecord = {
    messageId : Text;
    txId : Text;
    amount : Text;
    sender : HoosatAddress;
    recipient : HoosatAddress;
    status : PaymentStatus;
    createdAt : Nat;
    updatedAt : Nat;
  };

  // Persistent state
  let conversations = Map.empty<ConversationId, List.List<Message>>();
  // msgMeta key: convId # ":" # Nat.toText(msgIndex)
  let msgMeta = Map.empty<Text, MsgMeta>();
  let contacts = Map.empty<HoosatAddress, List.List<Contact>>();
  let walletAddresses = Map.empty<Principal, HoosatAddress>();
  let presence = Map.empty<HoosatAddress, PresenceRecord>();
  let typingStatus = Map.empty<Text, List.List<TypingRecord>>();
  let payments = Map.empty<Text, PaymentRecord>();
  // msgIdMap: msgId (e.g. "msg-5") -> (convId, index)
  let msgIdMap = Map.empty<Text, (ConversationId, Nat)>();
  var nextMsgId : Nat = 0;

  // ── Helpers ──────────────────────────────────────────────────────────────

  func makeConvId(a : HoosatAddress, b : HoosatAddress) : ConversationId {
    switch (Text.compare(a, b)) {
      case (#less) { a # ":" # b };
      case (#greater) { b # ":" # a };
      case (#equal) { a # ":" # b };
    };
  };

  func genMsgId() : Text {
    nextMsgId += 1;
    "msg-" # nextMsgId.toText();
  };

  func metaKey(convId : ConversationId, idx : Nat) : Text {
    convId # ":" # idx.toText();
  };

  func getMetaOrDefault(convId : ConversationId, idx : Nat) : MsgMeta {
    switch (msgMeta.get(metaKey(convId, idx))) {
      case (?m) { m };
      case (null) {
        {
          txId = null;
          paymentStatus = null;
          readBy = List.empty<HoosatAddress>();
          reactions = List.empty<Reaction>();
        };
      };
    };
  };

  func toPublicMsg(m : Message, convId : ConversationId, idx : Nat, msgId : Text) : MessagePublic {
    let meta = getMetaOrDefault(convId, idx);
    // Derive public messageType: payment messages are stored as #text but have paymentStatus in meta
    let pubType : MessageTypePublic = switch (meta.paymentStatus) {
      case (?_) { #payment };
      case (null) {
        switch (m.messageType) {
          case (#text) { #text };
          case (#file) { #file };
          case (#voice) { #voice };
        };
      };
    };
    {
      id = msgId;
      sender = m.sender;
      recipient = m.recipient;
      content = m.content;
      timestamp = m.timestamp;
      messageType = pubType;
      fileMetadata = m.fileMetadata;
      txId = meta.txId;
      paymentStatus = meta.paymentStatus;
      readBy = meta.readBy.toArray();
      reactions = meta.reactions.toArray();
    };
  };

  func insertMessageInConv(convId : ConversationId, msg : Message, msgId : Text) {
    switch (conversations.get(convId)) {
      case (null) {
        let msgs = List.empty<Message>();
        msgs.add(msg);
        conversations.add(convId, msgs);
        msgIdMap.add(msgId, (convId, 0));
      };
      case (?existing) {
        let idx = existing.size();
        existing.add(msg);
        msgIdMap.add(msgId, (convId, idx));
      };
    };
  };

  // ── Message & Conversation API ────────────────────────────────────────────

  public shared ({ caller = _ }) func sendMessage(
    sender : HoosatAddress,
    recipient : HoosatAddress,
    content : Text,
    timestamp : Nat,
    messageType : MessageType,
    fileMetadata : ?FileMetadata
  ) : async Text {
    if (sender == "") { Runtime.trap("Sender address cannot be empty") };
    if (recipient == "") { Runtime.trap("Recipient address cannot be empty") };
    if (content == "") { Runtime.trap("Message content cannot be empty") };
    let msgId = genMsgId();
    let msg : Message = { sender; recipient; content; timestamp; messageType; fileMetadata };
    let convId = makeConvId(sender, recipient);
    insertMessageInConv(convId, msg, msgId);
    msgId;
  };

  public query ({ caller = _ }) func getMessages(
    user1 : HoosatAddress,
    user2 : HoosatAddress,
    limit : ?Nat,
    since : ?Nat
  ) : async [MessagePublic] {
    let convId = makeConvId(user1, user2);
    switch (conversations.get(convId)) {
      case (null) { [] };
      case (?msgs) {
        // Build indexed array
        let arr = msgs.toArray();
        // Collect messages with their original index
        let indexed = List.empty<(Message, Nat)>();
        var i = 0;
        for (m in arr.values()) {
          switch (since) {
            case (null) { indexed.add((m, i)) };
            case (?ts) { if (m.timestamp > ts) { indexed.add((m, i)) } };
          };
          i += 1;
        };
        // Sort ascending by timestamp
        let sortedArr = indexed.toArray().sort(
          func(a : (Message, Nat), b : (Message, Nat)) : Order.Order {
            Nat.compare(a.0.timestamp, b.0.timestamp)
          }
        );
        // Apply limit (take last n)
        let limited : [(Message, Nat)] = switch (limit) {
          case (null) { sortedArr };
          case (?n) {
            let size = sortedArr.size();
            let start : Int = if (size > n) { size - n } else { 0 };
            sortedArr.sliceToArray(start, size)
          };
        };
        // Convert to public, look up msgId from msgIdMap by (convId, idx)
        // Build reverse map: (convId, idx) -> msgId by scanning msgIdMap
        // For efficiency, map convId+idx -> msgId
        let idxToMsgId = Map.empty<Nat, Text>();
        for ((mId, (cId, idx)) in msgIdMap.entries()) {
          if (cId == convId) {
            idxToMsgId.add(idx, mId);
          };
        };
        limited.map<(Message, Nat), MessagePublic>(func(pair) {
          let (m, idx) = pair;
          let msgId = switch (idxToMsgId.get(idx)) {
            case (?id) { id };
            case (null) { convId # ":" # idx.toText() };
          };
          toPublicMsg(m, convId, idx, msgId)
        });
      };
    };
  };

  public shared ({ caller = _ }) func addReaction(
    userId : HoosatAddress,
    convId : Text,
    messageId : Text,
    emoji : Text,
    timestamp : Nat
  ) : async () {
    switch (msgIdMap.get(messageId)) {
      case (null) { () };
      case (?(_, idx)) {
        let key = metaKey(convId, idx);
        let meta = getMetaOrDefault(convId, idx);
        let filtered = meta.reactions.filter(func(r : Reaction) : Bool {
          not (r.userId == userId and r.emoji == emoji)
        });
        filtered.add({ userId; emoji; timestamp });
        msgMeta.add(key, { meta with reactions = filtered });
      };
    };
  };

  public shared ({ caller = _ }) func removeReaction(
    userId : HoosatAddress,
    convId : Text,
    messageId : Text,
    emoji : Text
  ) : async () {
    switch (msgIdMap.get(messageId)) {
      case (null) { () };
      case (?(_, idx)) {
        let key = metaKey(convId, idx);
        let meta = getMetaOrDefault(convId, idx);
        let filtered = meta.reactions.filter(func(r : Reaction) : Bool {
          not (r.userId == userId and r.emoji == emoji)
        });
        msgMeta.add(key, { meta with reactions = filtered });
      };
    };
  };

  public shared ({ caller = _ }) func markMessagesRead(
    userId : HoosatAddress,
    convId : Text,
    upToTimestamp : Nat
  ) : async () {
    switch (conversations.get(convId)) {
      case (null) { () };
      case (?msgs) {
        var idx = 0;
        msgs.forEach(func(m : Message) {
          if (m.timestamp <= upToTimestamp) {
            let key = metaKey(convId, idx);
            let meta = getMetaOrDefault(convId, idx);
            let alreadyRead = meta.readBy.find(func(u : HoosatAddress) : Bool { u == userId });
            switch (alreadyRead) {
              case (?_) { () };
              case (null) {
                let newReadBy = meta.readBy.clone();
                newReadBy.add(userId);
                msgMeta.add(key, { meta with readBy = newReadBy });
              };
            };
          };
          idx += 1;
        });
      };
    };
  };

  public query ({ caller = _ }) func getUnreadCount(
    userId : HoosatAddress,
    contactAddress : HoosatAddress
  ) : async Nat {
    let convId = makeConvId(userId, contactAddress);
    switch (conversations.get(convId)) {
      case (null) { 0 };
      case (?msgs) {
        var count : Nat = 0;
        var idx = 0;
        msgs.forEach(func(m : Message) {
          if (m.recipient == userId) {
            let meta = getMetaOrDefault(convId, idx);
            let read = meta.readBy.find(func(u : HoosatAddress) : Bool { u == userId });
            switch (read) {
              case (null) { count += 1 };
              case (?_) { () };
            };
          };
          idx += 1;
        });
        count;
      };
    };
  };

  // ── Typing & Presence ─────────────────────────────────────────────────────

  public shared ({ caller = _ }) func setTypingStatus(
    userId : HoosatAddress,
    convId : Text,
    isTyping : Bool,
    timestamp : Nat
  ) : async () {
    switch (typingStatus.get(convId)) {
      case (null) {
        if (isTyping) {
          let records = List.empty<TypingRecord>();
          records.add({ userId; conversationId = convId; timestamp });
          typingStatus.add(convId, records);
        };
      };
      case (?records) {
        let filtered = records.filter(func(r : TypingRecord) : Bool { r.userId != userId });
        if (isTyping) {
          filtered.add({ userId; conversationId = convId; timestamp });
        };
        typingStatus.add(convId, filtered);
      };
    };
  };

  public query ({ caller = _ }) func getTypingStatus(convId : Text) : async [HoosatAddress] {
    let staleThresholdMs : Nat = 5000;
    switch (typingStatus.get(convId)) {
      case (null) { [] };
      case (?records) {
        let maxTs = records.foldLeft(0, func(acc : Nat, r : TypingRecord) : Nat {
          if (r.timestamp > acc) { r.timestamp } else { acc }
        });
        let active = records.filter(func(r : TypingRecord) : Bool {
          r.timestamp >= maxTs or maxTs - r.timestamp < staleThresholdMs
        });
        active.toArray().map<TypingRecord, HoosatAddress>(func(r) { r.userId });
      };
    };
  };

  public shared ({ caller = _ }) func setPresence(
    userId : HoosatAddress,
    isOnline : Bool,
    timestamp : Nat
  ) : async () {
    presence.add(userId, { userId; isOnline; lastSeen = timestamp });
  };

  public query ({ caller = _ }) func getPresence(
    userIds : [HoosatAddress]
  ) : async [PresenceRecord] {
    userIds.filterMap<HoosatAddress, PresenceRecord>(func(uid) {
      presence.get(uid)
    });
  };

  // ── HTN Payment Flow ──────────────────────────────────────────────────────

  public shared ({ caller = _ }) func createPaymentMessage(
    sender : HoosatAddress,
    recipient : HoosatAddress,
    amountHtn : Text,
    timestamp : Nat
  ) : async Text {
    if (sender == "") { Runtime.trap("Sender address cannot be empty") };
    if (recipient == "") { Runtime.trap("Recipient address cannot be empty") };
    if (amountHtn == "") { Runtime.trap("Amount cannot be empty") };
    let msgId = genMsgId();
    let msg : Message = {
      sender;
      recipient;
      content = "HTN Payment: " # amountHtn # " HTN";
      timestamp;
      messageType = #text;
      fileMetadata = null;
    };
    let convId = makeConvId(sender, recipient);
    insertMessageInConv(convId, msg, msgId);
    // Set initial payment status in meta
    switch (msgIdMap.get(msgId)) {
      case (?(_, idx)) {
        let key = metaKey(convId, idx);
        let meta = getMetaOrDefault(convId, idx);
        msgMeta.add(key, { meta with paymentStatus = ?#pending });
      };
      case (null) { () };
    };
    let paymentRec : PaymentRecord = {
      messageId = msgId;
      txId = "";
      amount = amountHtn;
      sender;
      recipient;
      status = #pending;
      createdAt = timestamp;
      updatedAt = timestamp;
    };
    payments.add(msgId, paymentRec);
    msgId;
  };

  public shared ({ caller = _ }) func updatePaymentStatus(
    messageId : Text,
    txId : Text,
    newStatus : PaymentStatus,
    timestamp : Nat
  ) : async () {
    switch (payments.get(messageId)) {
      case (null) { Runtime.trap("Payment record not found") };
      case (?rec) {
        payments.add(messageId, { rec with txId; status = newStatus; updatedAt = timestamp });
      };
    };
    switch (msgIdMap.get(messageId)) {
      case (null) { () };
      case (?(convId, idx)) {
        let key = metaKey(convId, idx);
        let meta = getMetaOrDefault(convId, idx);
        msgMeta.add(key, { meta with txId = ?txId; paymentStatus = ?newStatus });
      };
    };
  };

  public query ({ caller = _ }) func getPaymentStatus(
    messageId : Text
  ) : async ?(PaymentStatus, Text) {
    switch (payments.get(messageId)) {
      case (null) { null };
      case (?rec) { ?(rec.status, rec.txId) };
    };
  };

  public query ({ caller = _ }) func getPaymentHistory(
    userAddress : HoosatAddress
  ) : async [PaymentRecord] {
    let result = List.empty<PaymentRecord>();
    for ((_, rec) in payments.entries()) {
      if (rec.sender == userAddress or rec.recipient == userAddress) {
        result.add(rec);
      };
    };
    result.toArray();
  };

  // ── Contact Management ────────────────────────────────────────────────────

  public shared ({ caller = _ }) func addContact(
    userAddress : HoosatAddress,
    contactAddress : HoosatAddress,
    displayName : Text
  ) : async () {
    let newContact : Contact = { address = contactAddress; displayName };
    switch (contacts.get(userAddress)) {
      case (null) {
        let newList = List.empty<Contact>();
        newList.add(newContact);
        contacts.add(userAddress, newList);
      };
      case (?existingContacts) {
        let exists = existingContacts.find(func(c : Contact) : Bool { c.address == contactAddress });
        switch (exists) {
          case (?_) {
            existingContacts.mapInPlace(func(c : Contact) : Contact {
              if (c.address == contactAddress) { { c with displayName } } else { c }
            });
          };
          case (null) { existingContacts.add(newContact) };
        };
      };
    };
  };

  public shared ({ caller = _ }) func removeContact(
    userAddress : HoosatAddress,
    contactAddress : HoosatAddress
  ) : async () {
    switch (contacts.get(userAddress)) {
      case (null) { () };
      case (?existingContacts) {
        let filtered = existingContacts.filter(func(c : Contact) : Bool { c.address != contactAddress });
        contacts.add(userAddress, filtered);
      };
    };
  };

  public query ({ caller = _ }) func getContacts(
    userAddress : HoosatAddress
  ) : async [Contact] {
    switch (contacts.get(userAddress)) {
      case (null) { [] };
      case (?userContacts) { userContacts.toArray() };
    };
  };

  // ── Wallet Registry ───────────────────────────────────────────────────────

  public shared ({ caller }) func registerWalletAddress(
    hoosatAddress : HoosatAddress
  ) : async () {
    walletAddresses.add(caller, hoosatAddress);
  };

  public query ({ caller = _ }) func getWalletAddress(
    user : Principal
  ) : async HoosatAddress {
    switch (walletAddresses.get(user)) {
      case (null) { Runtime.trap("Wallet address not found") };
      case (?address) { address };
    };
  };

  public query ({ caller = _ }) func getAllWalletAddresses() : async [WalletAddress] {
    let result = List.empty<WalletAddress>();
    for ((p, h) in walletAddresses.entries()) {
      result.add({ principal = p; hoosatAddress = h });
    };
    result.toArray();
  };
};
