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
  HoosatCrypto,
  HoosatTxBuilder,
  HoosatUtils,
  HoosatWebClient,
} from "hoosat-sdk-web";
import {
  ArrowLeft,
  Copy,
  Download,
  KeyRound,
  Loader2,
  Lock,
  MessageSquare,
  Mic,
  Paperclip,
  Plus,
  Send,
  Trash2,
  Unlock,
  UserPlus,
  Wallet,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Contact } from "../backend.d.ts";
import { useActor } from "../hooks/useActor";
import {
  useAddContact,
  useGetContacts,
  useGetMessages,
  useHoosatBalance,
  useRegisterWallet,
  useRemoveContact,
  useSendMessage,
} from "../hooks/useQueries";
import { useWallet } from "../hooks/useWallet";

// Message type matching the backend schema
type MessageType = { text: null } | { file: null } | { voice: null };
interface BackendMessage {
  sender: string;
  recipient: string;
  content: string;
  timestamp: bigint;
  messageType: MessageType;
  fileMetadata: [] | [{ fileName: string; fileSize: bigint; fileType: string }];
}

type ConnectTab = "generate" | "import" | "unlock";
type MobileView = "contacts" | "chat" | "wallet";

// Connect screen
function ConnectScreen({
  onConnect,
  wallet,
}: {
  onConnect: (addr: string) => void;
  wallet: ReturnType<typeof useWallet>;
}) {
  const hasStored = wallet.hasStoredWallet();
  const [tab, setTab] = useState<ConnectTab>(hasStored ? "unlock" : "generate");
  const [password, setPassword] = useState("");
  const [importKey, setImportKey] = useState("");
  const [loading, setLoading] = useState(false);
  const registerWallet = useRegisterWallet();

  const connectWithAddress = async (addr: string) => {
    try {
      await registerWallet.mutateAsync(addr);
    } catch {
      // allow local usage
    }
    onConnect(addr);
    toast.success("Wallet connected!");
  };

  const handleGenerate = async () => {
    if (!password) {
      toast.error("Enter a password to secure your wallet");
      return;
    }
    setLoading(true);
    try {
      const addr = await wallet.generateWallet(password);
      await connectWithAddress(addr);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importKey.trim()) {
      toast.error("Enter a private key");
      return;
    }
    if (!password) {
      toast.error("Enter a password to encrypt your wallet");
      return;
    }
    setLoading(true);
    try {
      const addr = await wallet.importWallet(importKey.trim(), password);
      await connectWithAddress(addr);
    } catch (e: any) {
      toast.error(e?.message ?? "Invalid private key");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!password) {
      toast.error("Enter your password");
      return;
    }
    setLoading(true);
    try {
      const addr = await wallet.unlockWallet(password);
      await connectWithAddress(addr);
    } catch {
      toast.error("Wrong password or corrupted wallet");
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: ConnectTab; label: string; icon: React.ReactNode }[] = [
    ...(hasStored
      ? [
          {
            id: "unlock" as ConnectTab,
            label: "Unlock",
            icon: <Unlock className="w-3.5 h-3.5" />,
          },
        ]
      : []),
    {
      id: "generate",
      label: "Generate",
      icon: <KeyRound className="w-3.5 h-3.5" />,
    },
    {
      id: "import",
      label: "Import",
      icon: <Download className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, oklch(0.16 0.015 180 / 0.35) 0%, oklch(0.11 0.012 240) 65%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
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
              Hoosat wallet &amp; messenger
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 rounded-xl p-1 mb-5"
          style={{ background: "oklch(0.16 0.014 240)" }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-all"
              style={{
                background:
                  tab === t.id ? "oklch(0.82 0.19 152 / 0.15)" : "transparent",
                color:
                  tab === t.id
                    ? "oklch(0.82 0.19 152)"
                    : "oklch(0.55 0.02 240)",
                border:
                  tab === t.id
                    ? "1px solid oklch(0.82 0.19 152 / 0.3)"
                    : "1px solid transparent",
              }}
              data-ocid={`connect.${t.id}.tab`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "unlock" && hasStored && (
            <motion.div
              key="unlock"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              <div
                className="rounded-xl px-3 py-2.5 text-xs font-mono text-muted-foreground break-all"
                style={{
                  background: "oklch(0.18 0.013 240)",
                  border: "1px solid oklch(0.22 0.016 240)",
                }}
              >
                {wallet.storedAddress ?? "Stored wallet"}
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-surface-2 border-surface-3 h-12 text-base"
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                data-ocid="connect.unlock.input"
              />
              <Button
                type="button"
                onClick={handleUnlock}
                disabled={loading || !password}
                className="w-full h-12 rounded-full font-semibold"
                style={{
                  background: "oklch(0.82 0.19 152)",
                  color: "oklch(0.10 0.01 150)",
                }}
                data-ocid="connect.unlock.submit_button"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Unlock className="w-4 h-4 mr-2" />
                )}
                Unlock Wallet
              </Button>
            </motion.div>
          )}

          {tab === "generate" && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              <p className="text-xs text-muted-foreground">
                Generate a new Hoosat wallet. A fresh keypair will be created
                and your private key encrypted with your password.
              </p>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="bg-surface-2 border-surface-3 h-12 text-base"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                data-ocid="connect.generate.input"
              />
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={loading || !password}
                className="w-full h-12 rounded-full font-semibold"
                style={{
                  background: "oklch(0.82 0.19 152)",
                  color: "oklch(0.10 0.01 150)",
                }}
                data-ocid="connect.generate.submit_button"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <KeyRound className="w-4 h-4 mr-2" />
                )}
                Generate &amp; Connect
              </Button>
            </motion.div>
          )}

          {tab === "import" && (
            <motion.div
              key="import"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-3"
            >
              <Input
                value={importKey}
                onChange={(e) => setImportKey(e.target.value)}
                placeholder="Private key (64 hex chars)"
                className="bg-surface-2 border-surface-3 h-12 font-mono text-xs"
                data-ocid="connect.import.key_input"
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password to encrypt key"
                className="bg-surface-2 border-surface-3 h-12 text-base"
                onKeyDown={(e) => e.key === "Enter" && handleImport()}
                data-ocid="connect.import.input"
              />
              <Button
                type="button"
                onClick={handleImport}
                disabled={loading || !importKey || !password}
                className="w-full h-12 rounded-full font-semibold"
                style={{
                  background: "oklch(0.82 0.19 152)",
                  color: "oklch(0.10 0.01 150)",
                }}
                data-ocid="connect.import.submit_button"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Import &amp; Connect
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

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
  privateKey,
  onClose,
}: {
  myAddress: string;
  recipientAddress: string;
  privateKey: Buffer | null;
  onClose: () => void;
}) {
  const [recipient, setRecipient] = useState(recipientAddress);
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const { data: balance } = useHoosatBalance(myAddress);

  if (!privateKey) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-6 text-center"
        data-ocid="send_htn.locked_state"
      >
        <Lock className="w-8 h-8 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">
          Unlock your wallet to send HTN.
        </p>
      </div>
    );
  }

  if (txId) {
    return (
      <div className="space-y-4" data-ocid="send_htn.success_state">
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-3"
          style={{
            background: "oklch(0.82 0.19 152 / 0.1)",
            border: "1px solid oklch(0.82 0.19 152 / 0.25)",
          }}
        >
          <div className="text-mint font-semibold text-sm">
            ✓ Transaction Submitted
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">
            Transaction ID
          </div>
          <div
            className="rounded-xl px-3 py-2 text-[11px] font-mono text-muted-foreground break-all leading-relaxed"
            style={{ background: "oklch(0.18 0.013 240)" }}
          >
            {txId}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 rounded-full text-xs border-surface-3 h-11"
            onClick={() => {
              navigator.clipboard.writeText(txId);
              toast.success("TX ID copied!");
            }}
            data-ocid="send_htn.copy_txid.button"
          >
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Copy TX ID
          </Button>
          <Button
            type="button"
            size="sm"
            className="flex-1 rounded-full text-xs h-11"
            style={{
              background: "oklch(0.82 0.19 152)",
              color: "oklch(0.10 0.01 150)",
            }}
            onClick={() =>
              window.open(
                `https://explorer.hoosat.net/transactions/${txId}`,
                "_blank",
              )
            }
            data-ocid="send_htn.view_explorer.button"
          >
            View in Explorer
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground h-11"
          onClick={onClose}
          data-ocid="send_htn.close_button"
        >
          Close
        </Button>
      </div>
    );
  }

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
    try {
      const client = new HoosatWebClient({
        baseUrl: "https://proxy.hoosat.net/api/v1",
      });
      const utxosRes = await client.getUtxos([myAddress]);
      const builder = new HoosatTxBuilder();
      for (const utxo of utxosRes.utxos) {
        builder.addInput(utxo, privateKey);
      }
      // Add recipient output first
      builder.addOutput(recipient, HoosatUtils.amountToSompi(amount));
      // Calculate fee accounting for 2 outputs (recipient + change)
      const fee = HoosatCrypto.calculateMinFee(utxosRes.utxos.length, 2);
      builder.setFee(fee).addChangeOutput(myAddress);
      const signed = builder.sign();
      const result = await client.submitTransaction(signed);
      setTxId(result.transactionId);
    } catch (e: any) {
      toast.error(e?.message ?? "Transaction failed");
    } finally {
      setSending(false);
    }
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
          className="bg-surface-2 border-surface-3 text-sm h-12"
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
          className="bg-surface-2 border-surface-3 text-sm h-12"
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
        className="w-full h-12 rounded-full font-semibold"
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
  privateKey,
  onDisconnect,
  onLock,
}: {
  myAddress: string;
  privateKey: Buffer | null;
  onDisconnect: () => void;
  onLock: () => void;
}) {
  const { actor } = useActor();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const sendMessageMutation = useSendMessage(myAddress);
  const {
    data: messages = [] as BackendMessage[],
    isLoading: messagesLoading,
  } = useGetMessages(myAddress, selectedContact?.address ?? "");
  const [input, setInput] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newContactAddr, setNewContactAddr] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [sendOpen, setSendOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>("contacts");

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

  const conversationMessages = messages;

  const sendMessage = async () => {
    if (!input.trim() || !selectedContact) return;
    try {
      await sendMessageMutation.mutateAsync({
        content: input.trim(),
        contactAddress: selectedContact.address,
      });
      setInput("");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to send message");
    }
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
      setAddOpen(false);
      setNewContactAddr("");
      setNewContactName("");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to add contact");
      // keep dialog open so user can retry
    }
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

  const selectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setMobileView("chat");
  };

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ background: "oklch(0.11 0.012 240)", height: "100dvh" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-surface-3 flex-shrink-0"
        style={{ background: "oklch(0.13 0.011 240)" }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDisconnect}
            className="text-muted-foreground hover:text-foreground transition-colors mr-1"
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span
            className="text-xs text-muted-foreground hidden sm:block max-w-[140px] truncate font-mono"
            title={myAddress}
          >
            {myAddress.slice(0, 20)}...
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(myAddress);
              toast.success("Address copied!");
            }}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            data-ocid="app.copy_address.button"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onLock}
            title={privateKey ? "Lock wallet" : "Wallet locked"}
            className="transition-colors ml-0.5 p-1"
            style={{
              color: privateKey
                ? "oklch(0.55 0.02 240)"
                : "oklch(0.75 0.15 35)",
            }}
            data-ocid="app.lock.button"
          >
            {privateKey ? (
              <Unlock className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main 3-column (responsive) */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: Contacts — full width on mobile when mobileView=contacts, sidebar on desktop */}
        <div
          className={`${
            mobileView === "contacts" ? "flex" : "hidden"
          } md:flex w-full md:w-60 border-r border-surface-3 flex-col flex-shrink-0`}
          style={{ background: "oklch(0.13 0.011 240)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contacts
            </span>
            <Dialog
              open={addOpen}
              onOpenChange={(open) => {
                setAddOpen(open);
                if (open) {
                  setNewContactAddr("");
                  setNewContactName("");
                }
              }}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-mint transition-colors p-1"
                  data-ocid="contacts.add.open_modal_button"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent
                className="glass-card border-surface-3 w-[calc(100vw-2rem)] max-w-md mx-auto"
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
                    className="bg-surface-2 border-surface-3 h-12 text-base"
                    data-ocid="contacts.add.input"
                  />
                  <Input
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Display name (optional)"
                    className="bg-surface-2 border-surface-3 h-12 text-base"
                    data-ocid="contacts.name.input"
                  />
                  <Button
                    type="button"
                    onClick={handleAddContact}
                    disabled={!newContactAddr || addContact.isPending || !actor}
                    className="w-full rounded-full h-12"
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
                      className={`group flex items-center gap-2 px-4 py-3.5 w-full cursor-pointer transition-colors ${
                        selectedContact?.address === contact.address
                          ? "bg-mint/10 border-r-2 border-mint"
                          : "hover:bg-surface-2"
                      }`}
                      onClick={() => selectContact(contact)}
                      data-ocid={`contacts.item.${i + 1}`}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
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
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 touch-manipulation"
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

        {/* Middle: Chat — full width on mobile when mobileView=chat */}
        <div
          className={`${
            mobileView === "chat" ? "flex" : "hidden"
          } md:flex flex-1 flex-col overflow-hidden min-w-0`}
        >
          {selectedContact ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-3 sm:px-5 py-3.5 border-b border-surface-3 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Back to contacts on mobile */}
                  <button
                    type="button"
                    className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1 flex-shrink-0"
                    onClick={() => setMobileView("contacts")}
                    data-ocid="chat.back.button"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{
                      background: "oklch(0.82 0.19 152 / 0.2)",
                      color: "oklch(0.82 0.19 152)",
                    }}
                  >
                    {selectedContact.displayName[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {selectedContact.displayName}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">
                      {selectedContact.address.slice(0, 22)}...
                    </div>
                  </div>
                </div>
                <Dialog open={sendOpen} onOpenChange={setSendOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      size="sm"
                      className="rounded-full text-xs font-semibold h-9 px-3 flex-shrink-0"
                      style={{
                        background: "oklch(0.82 0.19 152 / 0.15)",
                        color: "oklch(0.82 0.19 152)",
                        border: "1px solid oklch(0.82 0.19 152 / 0.3)",
                      }}
                      data-ocid="chat.send_htn.open_modal_button"
                    >
                      <Wallet className="w-3.5 h-3.5 mr-1" />
                      <span className="hidden sm:inline">Send HTN</span>
                      <span className="sm:hidden">Send</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="glass-card border-surface-3 w-[calc(100vw-2rem)] max-w-md mx-auto"
                    data-ocid="chat.send_htn.dialog"
                  >
                    <DialogHeader>
                      <DialogTitle>Send HTN</DialogTitle>
                    </DialogHeader>
                    <SendHTNModal
                      myAddress={myAddress}
                      recipientAddress={selectedContact.address}
                      privateKey={privateKey}
                      onClose={() => setSendOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 px-3 sm:px-5 py-4">
                <AnimatePresence initial={false}>
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : conversationMessages.length === 0 ? (
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
                          key={`${msg.sender}-${String(msg.timestamp)}-${i}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex ${
                            msg.sender === myAddress
                              ? "justify-end"
                              : "justify-start"
                          }`}
                          data-ocid={`chat.item.${i + 1}`}
                        >
                          <div className="max-w-[85%] sm:max-w-[72%]">
                            <div
                              className="rounded-2xl px-4 py-2.5 text-sm"
                              style={{
                                background:
                                  msg.sender === myAddress
                                    ? "oklch(0.82 0.19 152 / 0.15)"
                                    : "oklch(0.22 0.016 240)",
                                color:
                                  msg.sender === myAddress
                                    ? "oklch(0.90 0.15 152)"
                                    : "oklch(0.90 0.01 220)",
                                borderRadius:
                                  msg.sender === myAddress
                                    ? "18px 18px 4px 18px"
                                    : "18px 18px 18px 4px",
                              }}
                            >
                              {msg.content}
                            </div>
                            <div
                              className={`text-[10px] text-muted-foreground mt-1 ${
                                msg.sender === myAddress
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              {formatTime(Number(msg.timestamp))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </ScrollArea>

              {/* Message input */}
              <div className="px-3 sm:px-5 py-3 border-t border-surface-3 flex-shrink-0 flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  className="text-muted-foreground hover:text-mint transition-colors p-1.5 touch-manipulation"
                  data-ocid="chat.attach.button"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-mint transition-colors p-1.5 touch-manipulation"
                  data-ocid="chat.voice.button"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface-2 border-surface-3 rounded-full h-11 text-sm"
                  style={{ fontSize: "16px" }}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  data-ocid="chat.message.input"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!input.trim() || sendMessageMutation.isPending}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0 touch-manipulation"
                  style={{
                    background: "oklch(0.82 0.19 152)",
                    color: "oklch(0.10 0.01 150)",
                  }}
                  data-ocid="chat.send.button"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </>
          ) : (
            <div
              className="flex-1 flex flex-col items-center justify-center text-center px-6"
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
                  Choose a contact from the list to start chatting or send HTN.
                </p>
                <button
                  type="button"
                  className="mt-4 md:hidden text-sm text-mint underline underline-offset-2"
                  onClick={() => setMobileView("contacts")}
                >
                  View contacts
                </button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Right: Wallet — full width on mobile when mobileView=wallet, sidebar on desktop */}
        <div
          className={`${
            mobileView === "wallet" ? "flex" : "hidden"
          } md:flex w-full md:w-64 border-l border-surface-3 flex-col flex-shrink-0`}
          style={{ background: "oklch(0.13 0.011 240)" }}
        >
          <div className="px-4 py-3 border-b border-surface-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Wallet
            </span>
            {!privateKey && (
              <span
                className="flex items-center gap-1 text-[11px] font-medium"
                style={{ color: "oklch(0.75 0.15 35)" }}
              >
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>

          <ScrollArea className="flex-1">
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
                <div className="text-xs text-muted-foreground">
                  Your address
                </div>
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
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 touch-manipulation"
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
                    className="w-full rounded-full font-semibold h-12"
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
                  className="glass-card border-surface-3 w-[calc(100vw-2rem)] max-w-md mx-auto"
                  data-ocid="wallet.send_htn.dialog"
                >
                  <DialogHeader>
                    <DialogTitle>Send HTN</DialogTitle>
                  </DialogHeader>
                  <SendHTNModal
                    myAddress={myAddress}
                    recipientAddress={selectedContact?.address ?? ""}
                    privateKey={privateKey}
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
          </ScrollArea>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <div
        className="md:hidden flex items-center justify-around border-t border-surface-3 flex-shrink-0"
        style={{
          background: "oklch(0.13 0.011 240)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <button
          type="button"
          onClick={() => setMobileView("contacts")}
          className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors touch-manipulation ${
            mobileView === "contacts" ? "text-mint" : "text-muted-foreground"
          }`}
          data-ocid="nav.contacts.tab"
        >
          <UserPlus className="w-5 h-5" />
          <span className="text-[10px] font-medium">Contacts</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView("chat")}
          className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors touch-manipulation ${
            mobileView === "chat" ? "text-mint" : "text-muted-foreground"
          }`}
          data-ocid="nav.chat.tab"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium">Chat</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView("wallet")}
          className={`flex flex-col items-center gap-1 py-3 px-6 transition-colors touch-manipulation ${
            mobileView === "wallet" ? "text-mint" : "text-muted-foreground"
          }`}
          data-ocid="nav.wallet.tab"
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px] font-medium">Wallet</span>
        </button>
      </div>
    </div>
  );
}

// Root export: handles connect screen + app
export function AppRoot() {
  const wallet = useWallet();
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

  const handleDisconnect = () => {
    wallet.lockWallet();
    setMyAddress(null);
  };

  if (!myAddress) {
    return <ConnectScreen onConnect={setMyAddress} wallet={wallet} />;
  }

  return (
    <AppView
      myAddress={myAddress}
      privateKey={wallet.privateKey}
      onDisconnect={handleDisconnect}
      onLock={wallet.lockWallet}
    />
  );
}
