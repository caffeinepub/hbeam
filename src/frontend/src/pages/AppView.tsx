import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Copy,
  Loader2,
  MessageSquare,
  Mic,
  Paperclip,
  Plus,
  Send,
  Trash2,
  UserPlus,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Contact } from "../backend.d.ts";
import {
  useAddContact,
  useGetContacts,
  useHoosatBalance,
  useRegisterWallet,
  useRemoveContact,
} from "../hooks/useQueries";

// Local message type for demo
interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  type: "text" | "file" | "voice";
}

// Seed demo messages
const DEMO_MESSAGES: Message[] = [
  {
    id: "1",
    from: "hoosat:qalice",
    to: "me",
    content: "Hey! Can you send me some HTN?",
    timestamp: Date.now() - 300000,
    type: "text",
  },
  {
    id: "2",
    from: "me",
    to: "hoosat:qalice",
    content: "Sure, sending 10 HTN now!",
    timestamp: Date.now() - 240000,
    type: "text",
  },
  {
    id: "3",
    from: "hoosat:qalice",
    to: "me",
    content: "Got it in about 1 second ⚡ Hoosat is fast!",
    timestamp: Date.now() - 180000,
    type: "text",
  },
];

// Connect screen
function ConnectScreen({ onConnect }: { onConnect: (addr: string) => void }) {
  const [address, setAddress] = useState("");
  const registerWallet = useRegisterWallet();

  const handleConnect = async () => {
    if (!address.startsWith("hoosat:") && !address.startsWith("kaspa:")) {
      toast.error("Please enter a valid Hoosat address (hoosat:q...)");
      return;
    }
    try {
      await registerWallet.mutateAsync(address);
      onConnect(address);
      toast.success("Wallet connected!");
    } catch {
      // Still allow local usage even if canister fails
      onConnect(address);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.16 0.015 180 / 0.35) 0%, oklch(0.11 0.012 240) 65%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-2xl p-8 w-full max-w-md shadow-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.82 0.19 152)" }}
          >
            <span
              className="font-black text-base"
              style={{ color: "oklch(0.10 0.01 150)" }}
            >
              H
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold">HBeam</h1>
            <p className="text-xs text-muted-foreground">
              Connect your Hoosat wallet
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-5">
          Enter your Hoosat address to access your messages and wallet.
        </p>

        <div className="space-y-3">
          <Input
            id="hoosat-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="hoosat:q..."
            className="bg-surface-2 border-surface-3 text-foreground placeholder:text-muted-foreground h-11"
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
            data-ocid="connect.input"
          />
          <Button
            type="button"
            onClick={handleConnect}
            disabled={!address || registerWallet.isPending}
            className="w-full h-11 rounded-full font-semibold text-sm mint-glow"
            style={{
              background: address ? "oklch(0.82 0.19 152)" : undefined,
              color: address ? "oklch(0.10 0.01 150)" : undefined,
            }}
            data-ocid="connect.submit_button"
          >
            {registerWallet.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Connect Wallet
          </Button>
        </div>

        <div
          className="mt-6 p-3 rounded-xl text-xs text-muted-foreground"
          style={{
            background: "oklch(0.82 0.19 152 / 0.06)",
            border: "1px solid oklch(0.82 0.19 152 / 0.15)",
          }}
        >
          <p className="font-medium text-mint mb-1">What is Hoosat?</p>
          <p>
            Hoosat is a fast, low-fee blockchain. Get HTN at{" "}
            <a
              href="https://hub.hoosat.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              hub.hoosat.net
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Send HTN modal
function SendHTNModal({
  myAddress,
  recipientAddress,
  onClose,
}: {
  myAddress: string;
  recipientAddress: string;
  onClose: () => void;
}) {
  const [recipient, setRecipient] = useState(recipientAddress);
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const { data: balance } = useHoosatBalance(myAddress);

  const handleSend = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (Number(amount) > (balance ?? 0)) {
      toast.error("Insufficient balance");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast.success(`Sent ${amount} HTN to ${recipient.slice(0, 16)}...`);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="send-recipient"
          className="text-xs text-muted-foreground mb-1 block"
        >
          Recipient
        </label>
        <Input
          id="send-recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="hoosat:q..."
          className="bg-surface-2 border-surface-3 text-sm"
          data-ocid="send_htn.recipient.input"
        />
      </div>
      <div>
        <label
          htmlFor="send-amount"
          className="text-xs text-muted-foreground mb-1 block"
        >
          Amount (HTN)
        </label>
        <Input
          id="send-amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          type="number"
          min="0"
          className="bg-surface-2 border-surface-3 text-sm"
          data-ocid="send_htn.amount.input"
        />
      </div>
      <div
        className="flex items-center justify-between rounded-xl px-4 py-3 text-sm"
        style={{ background: "oklch(0.20 0.016 240)" }}
      >
        <span className="text-muted-foreground">Your balance</span>
        <span className="font-semibold text-mint">
          {balance?.toFixed(4) ?? "–"} HTN
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Network fee</span>
        <span>~0.00001 HTN</span>
      </div>
      <Button
        type="button"
        onClick={handleSend}
        disabled={sending || !amount}
        className="w-full h-11 rounded-full font-semibold"
        style={{
          background: "oklch(0.82 0.19 152)",
          color: "oklch(0.10 0.01 150)",
        }}
        data-ocid="send_htn.confirm_button"
      >
        {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Confirm Payment
      </Button>
    </div>
  );
}

// Main app view
export function AppView({
  myAddress,
  onDisconnect,
}: {
  myAddress: string;
  onDisconnect: () => void;
}) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newContactAddr, setNewContactAddr] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [sendOpen, setSendOpen] = useState(false);

  const { data: contacts = [], isLoading: contactsLoading } =
    useGetContacts(myAddress);
  const addContact = useAddContact(myAddress);
  const removeContact = useRemoveContact(myAddress);
  const { data: balance, isLoading: balanceLoading } =
    useHoosatBalance(myAddress);

  const displayContacts: Contact[] =
    contacts.length > 0
      ? contacts
      : [
          { address: "hoosat:qalice", displayName: "Alice H." },
          { address: "hoosat:qbobwilson", displayName: "Bob Wilson" },
          { address: "hoosat:qcarolmint", displayName: "Carol M." },
        ];

  const conversationMessages = selectedContact
    ? messages.filter(
        (m) =>
          (m.from === selectedContact.address && m.to === "me") ||
          (m.from === "me" && m.to === selectedContact.address),
      )
    : [];

  const sendMessage = () => {
    if (!input.trim() || !selectedContact) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      from: "me",
      to: selectedContact.address,
      content: input.trim(),
      timestamp: Date.now(),
      type: "text",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const handleAddContact = async () => {
    if (!newContactAddr) return;
    const name = newContactName || `${newContactAddr.slice(0, 16)}...`;
    try {
      await addContact.mutateAsync({
        contactAddress: newContactAddr,
        displayName: name,
      });
      toast.success("Contact added!");
    } catch {
      toast.error("Failed to add contact");
    }
    setAddOpen(false);
    setNewContactAddr("");
    setNewContactName("");
  };

  const handleRemoveContact = async (addr: string) => {
    try {
      await removeContact.mutateAsync(addr);
      if (selectedContact?.address === addr) setSelectedContact(null);
      toast.success("Contact removed");
    } catch {
      toast.error("Failed to remove contact");
    }
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="h-screen flex flex-col"
      style={{ background: "oklch(0.11 0.012 240)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-surface-3 flex-shrink-0"
        style={{ background: "oklch(0.13 0.011 240)" }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDisconnect}
            className="text-muted-foreground hover:text-foreground transition-colors mr-2"
            data-ocid="app.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "oklch(0.82 0.19 152)" }}
          >
            <span
              className="text-xs font-black"
              style={{ color: "oklch(0.10 0.01 150)" }}
            >
              H
            </span>
          </div>
          <span className="font-bold text-sm">HBeam</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="max-w-[160px] truncate font-mono" title={myAddress}>
            {myAddress.slice(0, 20)}...
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(myAddress);
              toast.success("Address copied!");
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="app.copy_address.button"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3-column */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Contacts */}
        <div
          className="w-60 border-r border-surface-3 flex flex-col flex-shrink-0"
          style={{ background: "oklch(0.13 0.011 240)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contacts
            </span>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-mint transition-colors"
                  data-ocid="contacts.add.open_modal_button"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent
                className="glass-card border-surface-3"
                data-ocid="contacts.add.dialog"
              >
                <DialogHeader>
                  <DialogTitle>Add Contact</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-2">
                  <Input
                    value={newContactAddr}
                    onChange={(e) => setNewContactAddr(e.target.value)}
                    placeholder="hoosat:q..."
                    className="bg-surface-2 border-surface-3"
                    data-ocid="contacts.add.input"
                  />
                  <Input
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Display name (optional)"
                    className="bg-surface-2 border-surface-3"
                    data-ocid="contacts.name.input"
                  />
                  <Button
                    type="button"
                    onClick={handleAddContact}
                    disabled={!newContactAddr || addContact.isPending}
                    className="w-full rounded-full"
                    style={{
                      background: "oklch(0.82 0.19 152)",
                      color: "oklch(0.10 0.01 150)",
                    }}
                    data-ocid="contacts.add.confirm_button"
                  >
                    {addContact.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Add Contact
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="flex-1">
            {contactsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2
                  className="w-5 h-5 animate-spin text-muted-foreground"
                  data-ocid="contacts.loading_state"
                />
              </div>
            ) : (
              <div>
                {displayContacts.length === 0 ? (
                  <div
                    className="text-center py-8 px-4 text-sm text-muted-foreground"
                    data-ocid="contacts.empty_state"
                  >
                    No contacts yet. Add someone to start chatting.
                  </div>
                ) : (
                  displayContacts.map((contact, i) => (
                    <button
                      key={contact.address}
                      type="button"
                      className={`group flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors ${
                        selectedContact?.address === contact.address
                          ? "bg-mint/10 border-r-2 border-mint"
                          : "hover:bg-surface-2"
                      }`}
                      onClick={() => setSelectedContact(contact)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setSelectedContact(contact)
                      }
                      data-ocid={`contacts.item.${i + 1}`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background:
                            selectedContact?.address === contact.address
                              ? "oklch(0.82 0.19 152 / 0.2)"
                              : "oklch(0.22 0.016 240)",
                          color:
                            selectedContact?.address === contact.address
                              ? "oklch(0.82 0.19 152)"
                              : "oklch(0.70 0.02 220)",
                        }}
                      >
                        {contact.displayName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium truncate ${
                            selectedContact?.address === contact.address
                              ? "text-mint"
                              : "text-foreground"
                          }`}
                        >
                          {contact.displayName}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {contact.address.slice(0, 18)}...
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveContact(contact.address);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                        data-ocid={`contacts.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </button>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Middle: Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedContact ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "oklch(0.82 0.19 152 / 0.2)",
                      color: "oklch(0.82 0.19 152)",
                    }}
                  >
                    {selectedContact.displayName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {selectedContact.displayName}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {selectedContact.address.slice(0, 22)}...
                    </div>
                  </div>
                </div>
                <Dialog open={sendOpen} onOpenChange={setSendOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-full text-xs font-semibold h-8 px-4"
                      style={{
                        background: "oklch(0.82 0.19 152 / 0.15)",
                        color: "oklch(0.82 0.19 152)",
                        border: "1px solid oklch(0.82 0.19 152 / 0.3)",
                      }}
                      data-ocid="chat.send_htn.open_modal_button"
                    >
                      <Wallet className="w-3.5 h-3.5 mr-1.5" />
                      Send HTN
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="glass-card border-surface-3"
                    data-ocid="chat.send_htn.dialog"
                  >
                    <DialogHeader>
                      <DialogTitle>Send HTN</DialogTitle>
                    </DialogHeader>
                    <SendHTNModal
                      myAddress={myAddress}
                      recipientAddress={selectedContact.address}
                      onClose={() => setSendOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-5 py-4">
                <AnimatePresence initial={false}>
                  {conversationMessages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full py-16 text-center"
                      data-ocid="chat.empty_state"
                    >
                      <MessageSquare className="w-10 h-10 text-muted-foreground mb-3 opacity-40" />
                      <p className="text-sm text-muted-foreground">
                        No messages yet. Say hello!
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {conversationMessages.map((msg, i) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex ${
                            msg.from === "me" ? "justify-end" : "justify-start"
                          }`}
                          data-ocid={`chat.item.${i + 1}`}
                        >
                          <div className="max-w-[72%]">
                            <div
                              className="rounded-2xl px-4 py-2.5 text-sm"
                              style={{
                                background:
                                  msg.from === "me"
                                    ? "oklch(0.82 0.19 152 / 0.15)"
                                    : "oklch(0.22 0.016 240)",
                                color:
                                  msg.from === "me"
                                    ? "oklch(0.90 0.15 152)"
                                    : "oklch(0.90 0.01 220)",
                                borderRadius:
                                  msg.from === "me"
                                    ? "18px 18px 4px 18px"
                                    : "18px 18px 18px 4px",
                              }}
                            >
                              {msg.content}
                            </div>
                            <div
                              className={`text-[10px] text-muted-foreground mt-1 ${
                                msg.from === "me" ? "text-right" : "text-left"
                              }`}
                            >
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>

              {/* Message input */}
              <div className="px-5 py-3.5 border-t border-surface-3 flex-shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-mint transition-colors"
                  data-ocid="chat.attach.button"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-mint transition-colors"
                  data-ocid="chat.voice.button"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface-2 border-surface-3 rounded-full h-10 text-sm"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  data-ocid="chat.message.input"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
                  style={{
                    background: "oklch(0.82 0.19 152)",
                    color: "oklch(0.10 0.01 150)",
                  }}
                  data-ocid="chat.send.button"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div
              className="flex-1 flex flex-col items-center justify-center text-center px-8"
              data-ocid="chat.empty_state"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "oklch(0.82 0.19 152 / 0.1)" }}
                >
                  <MessageSquare className="w-7 h-7 text-mint" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Select a conversation
                </h2>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Choose a contact from the left to start chatting or send HTN.
                </p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Right: Wallet */}
        <div
          className="w-64 border-l border-surface-3 flex flex-col flex-shrink-0"
          style={{ background: "oklch(0.13 0.011 240)" }}
        >
          <div className="px-4 py-3 border-b border-surface-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Wallet
            </span>
          </div>

          <div className="p-4 space-y-4">
            {/* Balance card */}
            <div
              className="rounded-2xl p-4"
              style={{
                background: "oklch(0.82 0.19 152 / 0.07)",
                border: "1px solid oklch(0.82 0.19 152 / 0.2)",
              }}
            >
              <div className="text-xs text-muted-foreground mb-1">
                HTN Balance
              </div>
              {balanceLoading ? (
                <div
                  className="flex items-center gap-2"
                  data-ocid="wallet.loading_state"
                >
                  <Loader2 className="w-4 h-4 animate-spin text-mint" />
                  <span className="text-sm text-muted-foreground">
                    Loading...
                  </span>
                </div>
              ) : (
                <div className="text-3xl font-extrabold text-mint">
                  {balance !== null && balance !== undefined
                    ? balance.toFixed(4)
                    : "—"}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-0.5">HTN</div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Your address</div>
              <div
                className="rounded-xl px-3 py-2 text-[11px] font-mono text-muted-foreground break-all leading-relaxed"
                style={{ background: "oklch(0.18 0.013 240)" }}
              >
                {myAddress}
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(myAddress);
                  toast.success("Address copied!");
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="wallet.copy_address.button"
              >
                <Copy className="w-3 h-3" />
                Copy address
              </button>
            </div>

            {/* Send HTN */}
            <Dialog open={sendOpen} onOpenChange={setSendOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="w-full rounded-full font-semibold"
                  style={{
                    background: "oklch(0.82 0.19 152)",
                    color: "oklch(0.10 0.01 150)",
                  }}
                  data-ocid="wallet.send_htn.open_modal_button"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Send HTN
                </Button>
              </DialogTrigger>
              <DialogContent
                className="glass-card border-surface-3"
                data-ocid="wallet.send_htn.dialog"
              >
                <DialogHeader>
                  <DialogTitle>Send HTN</DialogTitle>
                </DialogHeader>
                <SendHTNModal
                  myAddress={myAddress}
                  recipientAddress={selectedContact?.address ?? ""}
                  onClose={() => setSendOpen(false)}
                />
              </DialogContent>
            </Dialog>

            {/* Stats */}
            <div className="space-y-2">
              <div
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs"
                style={{ background: "oklch(0.18 0.013 240)" }}
              >
                <span className="text-muted-foreground">Network</span>
                <span className="text-mint font-medium">Hoosat</span>
              </div>
              <div
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs"
                style={{ background: "oklch(0.18 0.013 240)" }}
              >
                <span className="text-muted-foreground">Block time</span>
                <span className="text-foreground">~1 second</span>
              </div>
              <div
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs"
                style={{ background: "oklch(0.18 0.013 240)" }}
              >
                <span className="text-muted-foreground">Tx fee</span>
                <span className="text-foreground">0.00001 HTN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Root export: handles connect screen + app
export function AppRoot() {
  const [myAddress, setMyAddress] = useState<string | null>(() => {
    return sessionStorage.getItem("hbeam_address");
  });

  useEffect(() => {
    if (myAddress) {
      sessionStorage.setItem("hbeam_address", myAddress);
    } else {
      sessionStorage.removeItem("hbeam_address");
    }
  }, [myAddress]);

  if (!myAddress) {
    return <ConnectScreen onConnect={setMyAddress} />;
  }

  return (
    <AppView myAddress={myAddress} onDisconnect={() => setMyAddress(null)} />
  );
}
