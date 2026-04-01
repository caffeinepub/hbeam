export function SendPaymentShowcase() {
  return (
    <div className="rounded-2xl p-6 w-full max-w-sm mx-auto glass-card shadow-card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground">Send Payment</h3>
        <span className="text-xs text-muted-foreground bg-surface-3 px-2 py-1 rounded-full">
          Instant
        </span>
      </div>

      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-1">Recipient</div>
        <div
          className="rounded-xl px-4 py-3 text-sm text-muted-foreground truncate"
          style={{
            background: "oklch(0.20 0.016 240)",
            border: "1px solid oklch(0.28 0.018 240)",
          }}
        >
          hoosat:qrece...7f3a
        </div>
      </div>

      <div className="mb-5">
        <div className="text-xs text-muted-foreground mb-1">Amount</div>
        <div
          className="rounded-xl px-4 py-4 flex items-center justify-between"
          style={{
            background: "oklch(0.20 0.016 240)",
            border: "1px solid oklch(0.82 0.19 152 / 0.3)",
          }}
        >
          <span className="text-2xl font-bold text-mint">250</span>
          <span className="text-sm text-muted-foreground font-medium">HTN</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5 text-xs text-muted-foreground">
        <span>Network fee</span>
        <span className="text-foreground">~0.00001 HTN</span>
      </div>

      <button
        type="button"
        className="w-full rounded-full py-3 font-semibold text-sm transition-all hover:opacity-90 mint-glow"
        style={{
          background: "oklch(0.82 0.19 152)",
          color: "oklch(0.10 0.01 150)",
        }}
      >
        Confirm Payment
      </button>

      <div className="mt-3 text-center text-xs text-muted-foreground">
        Powered by Hoosat blockchain · ~1s confirmation
      </div>
    </div>
  );
}
