// v26 — add _immutableObjectStorageCreateCertificate for object-storage extension
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
  // convMsgIds: convId -> ordered List of msgIds (index i = msgId for message i)
  // Enables O(1) index→msgId lookup instead of scanning all of msgIdMap
  let convMsgIds = Map.empty<ConversationId, List.List<Text>>();
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

  // O(1) lookup: get msgId for a message at (convId, idx) using convMsgIds index
  func getMsgId(convId : ConversationId, idx : Nat) : Text {
    switch (convMsgIds.get(convId)) {
      case (?ids) {
        let id : ?Text = if (idx < ids.size()) { ?ids.at(idx) } else { null };
        switch (id) {
          case (?id) { id };
          case (null) { convId # ":" # idx.toText() };
        };
      };
      case (null) { convId # ":" # idx.toText() };
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
      // Pre-format as arrays here — avoids repeated List-to-Array on every caller
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
        // Initialize convMsgIds for this conversation
        let ids = List.empty<Text>();
        ids.add(msgId);
        convMsgIds.add(convId, ids);
      };
      case (?existing) {
        let idx = existing.size();
        existing.add(msg);
        msgIdMap.add(msgId, (convId, idx));
        // Append msgId to convMsgIds for O(1) future lookups
        switch (convMsgIds.get(convId)) {
          case (?ids) { ids.add(msgId) };
          case (null) {
            let ids = List.empty<Text>();
            ids.add(msgId);
            convMsgIds.add(convId, ids);
          };
        };
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
        let totalSize = msgs.size();
        if (totalSize == 0) { return [] };

        // Default to 50 most recent messages when no limit specified
        let pageSize : Nat = switch (limit) {
          case (?n) { n };
          case (null) { 50 };
        };

        // When `since` is provided, find messages after that timestamp.
        // Iterate from the end (newest first) to collect up to pageSize messages
        // that satisfy the since filter, then reverse to return ascending order.
        // This is O(pageSize) in the common case vs O(n) full scan.
        let result = List.empty<MessagePublic>();

        switch (since) {
          case (null) {
            // No since filter: take last `pageSize` messages directly
            let start : Int = if (totalSize > pageSize) { totalSize - pageSize } else { 0 };
            let startNat : Nat = if (start < 0) { 0 } else { start.toNat() };
            var idx = startNat;
            while (idx < totalSize) {
              let m = msgs.at(idx);
              let msgId = getMsgId(convId, idx);
              result.add(toPublicMsg(m, convId, idx, msgId));
              idx += 1;
            };
          };
          case (?ts) {
            // With since filter: collect matching messages from the end, up to pageSize
            let window = List.empty<(Message, Nat)>();
            var idx : Int = totalSize - 1;
            var collected = 0;
            while (idx >= 0 and collected < pageSize) {
              let i = idx.toNat();
              let m = msgs.at(i);
              if (m.timestamp > ts) {
                window.add((m, i));
                collected += 1;
              };
              idx -= 1;
            };
            // window is newest-first; reverse to ascending timestamp order
            window.reverseInPlace();
            // Sort ascending by timestamp to handle any out-of-order inserts
            window.sortInPlace(func(a : (Message, Nat), b : (Message, Nat)) : Order.Order {
              Nat.compare(a.0.timestamp, b.0.timestamp)
            });
            window.forEach(func(pair : (Message, Nat)) {
              let (m, i) = pair;
              let msgId = getMsgId(convId, i);
              result.add(toPublicMsg(m, convId, i, msgId));
            });
          };
        };

        result.toArray();
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

  // Compute unread count in a single pass — avoids redundant meta-key building per call
  public query ({ caller = _ }) func getUnreadCount(
    userId : HoosatAddress,
    contactAddress : HoosatAddress
  ) : async Nat {
    let convId = makeConvId(userId, contactAddress);
    switch (conversations.get(convId)) {
      case (null) { 0 };
      case (?msgs) {
        // Single pass: count messages addressed to userId that have no readBy entry for userId
        var count : Nat = 0;
        var idx = 0;
        msgs.forEach(func(m : Message) {
          if (m.recipient == userId) {
            // Only look up meta when the message is addressed to this user
            let key = metaKey(convId, idx);
            switch (msgMeta.get(key)) {
              case (null) {
                // No meta at all means unread
                count += 1;
              };
              case (?meta) {
                let read = meta.readBy.find(func(u : HoosatAddress) : Bool { u == userId });
                switch (read) {
                  case (null) { count += 1 };
                  case (?_) { () };
                };
              };
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

  // Filter out stale typing records (older than 30 seconds) on read
  // Timestamps are in milliseconds; 30s = 30_000ms
  public query ({ caller = _ }) func getTypingStatus(convId : Text) : async [HoosatAddress] {
    let staleThresholdMs : Nat = 30_000;
    switch (typingStatus.get(convId)) {
      case (null) { [] };
      case (?records) {
        let maxTs = records.foldLeft(0, func(acc : Nat, r : TypingRecord) : Nat {
          if (r.timestamp > acc) { r.timestamp } else { acc }
        });
        // Skip records where the newest timestamp minus this record's timestamp exceeds 30s
        let active = records.filter(func(r : TypingRecord) : Bool {
          let diff : Nat = if (maxTs > r.timestamp) { maxTs - r.timestamp } else { 0 };
          diff < staleThresholdMs
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

  // Filter out stale presence records (lastSeen older than 5 minutes) on read
  // Timestamps are in milliseconds; 5min = 300_000ms
  public query ({ caller = _ }) func getPresence(
    userIds : [HoosatAddress]
  ) : async [PresenceRecord] {
    let staleThresholdMs : Nat = 300_000;
    // Compute max lastSeen across all requested users to derive "now" approximation
    // We use the max known timestamp as a proxy since we have no Time.now() in query context
    let maxLastSeen = userIds.foldLeft(0, func(acc : Nat, uid : HoosatAddress) : Nat {
      switch (presence.get(uid)) {
        case (?rec) { if (rec.lastSeen > acc) { rec.lastSeen } else { acc } };
        case (null) { acc };
      };
    });
    userIds.filterMap<HoosatAddress, PresenceRecord>(func(uid) {
      switch (presence.get(uid)) {
        case (null) { null };
        case (?rec) {
          // Skip records where presence hasn't been updated in more than 5 minutes
          let diff : Nat = if (maxLastSeen > rec.lastSeen) { maxLastSeen - rec.lastSeen } else { 0 };
          if (diff > staleThresholdMs) {
            ?{ rec with isOnline = false }
          } else {
            ?rec
          };
        };
      };
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

  // ── Object Storage Extension ─────────────────────────────────────────────
  // Required by @caffeineai/object-storage StorageClient.getCertificate().
  // The IC replica attaches a certified response certificate to every query call
  // in the v3 HTTP response envelope. The function body is a no-op; only its
  // existence as a certified query matters so the replica can generate the cert.
  public query func _immutableObjectStorageCreateCertificate(_hash : Text) : async Blob {
    "" : Blob;
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
