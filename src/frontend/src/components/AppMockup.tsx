export function AppMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-card border border-surface-3"
      style={{ background: "oklch(0.14 0.012 240)" }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-surface-3"
        style={{ background: "oklch(0.12 0.010 240)" }}
      >
        <div className="w-3 h-3 rounded-full bg-destructive opacity-70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70" />
        <div className="w-3 h-3 rounded-full bg-mint opacity-70" />
        <div
          className="ml-4 flex-1 rounded-full px-3 py-1 text-xs text-muted-foreground text-center"
          style={{ background: "oklch(0.18 0.013 240)" }}
        >
          HBeam — Private Messenger
        </div>
      </div>

      {/* 3-column layout */}
      <div className="flex" style={{ height: "320px" }}>
        {/* Contacts sidebar */}
        <div
          className="w-48 border-r border-surface-3 flex flex-col"
          style={{ background: "oklch(0.15 0.013 240)" }}
        >
          <div className="px-3 py-3 border-b border-surface-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Contacts
            </div>
          </div>
          {[
            { name: "Alice H.", addr: "hoosat:qaa...", active: true },
            { name: "Bob W.", addr: "hoosat:qbb...", active: false },
            { name: "Carol M.", addr: "hoosat:qcc...", active: false },
          ].map((c) => (
            <div
              key={c.name}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                c.active ? "bg-mint/10" : "hover:bg-surface-2"
              }`}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: c.active
                    ? "oklch(0.82 0.19 152 / 0.2)"
                    : "oklch(0.22 0.016 240)",
                  color: c.active
                    ? "oklch(0.82 0.19 152)"
                    : "oklch(0.70 0.02 220)",
                }}
              >
                {c.name[0]}
              </div>
              <div>
                <div
                  className={`text-xs font-medium ${
                    c.active ? "text-mint" : "text-foreground"
                  }`}
                >
                  {c.name}
                </div>
                <div className="text-[10px] text-muted-foreground truncate w-24">
                  {c.addr}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat thread */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-surface-3 flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "oklch(0.82 0.19 152 / 0.2)",
                color: "oklch(0.82 0.19 152)",
              }}
            >
              A
            </div>
            <span className="text-sm font-medium">Alice H.</span>
          </div>
          <div className="flex-1 px-4 py-3 overflow-hidden flex flex-col gap-2">
            <div className="flex justify-start">
              <div
                className="rounded-2xl rounded-tl-sm px-3 py-2 text-xs max-w-[70%]"
                style={{ background: "oklch(0.22 0.016 240)" }}
              >
                Hey! Want to send me some HTN?
              </div>
            </div>
            <div className="flex justify-end">
              <div
                className="rounded-2xl rounded-tr-sm px-3 py-2 text-xs max-w-[70%]"
                style={{
                  background: "oklch(0.82 0.19 152 / 0.15)",
                  color: "oklch(0.82 0.19 152)",
                }}
              >
                Sure! Sending 10 HTN now 🚀
              </div>
            </div>
            <div className="flex justify-start">
              <div
                className="rounded-2xl rounded-tl-sm px-3 py-2 text-xs max-w-[70%]"
                style={{ background: "oklch(0.22 0.016 240)" }}
              >
                Got it! So fast ⚡
              </div>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-surface-3">
            <div
              className="rounded-full px-4 py-2 text-xs text-muted-foreground"
              style={{ background: "oklch(0.20 0.016 240)" }}
            >
              Type a message...
            </div>
          </div>
        </div>

        {/* Wallet panel */}
        <div
          className="w-44 border-l border-surface-3 flex flex-col"
          style={{ background: "oklch(0.15 0.013 240)" }}
        >
          <div className="px-3 py-3 border-b border-surface-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Wallet
            </div>
          </div>
          <div className="p-3 flex flex-col gap-3">
            <div
              className="rounded-xl p-3"
              style={{
                background: "oklch(0.82 0.19 152 / 0.08)",
                border: "1px solid oklch(0.82 0.19 152 / 0.2)",
              }}
            >
              <div className="text-[10px] text-muted-foreground">Balance</div>
              <div className="text-lg font-bold text-mint">142.5</div>
              <div className="text-[10px] text-muted-foreground">HTN</div>
            </div>
            <button
              type="button"
              className="rounded-full py-2 text-xs font-semibold"
              style={{
                background: "oklch(0.82 0.19 152)",
                color: "oklch(0.10 0.01 150)",
              }}
            >
              Send HTN
            </button>
            <div className="text-[10px] text-muted-foreground">
              <div>Fee: ~0.00001 HTN</div>
              <div className="mt-1">Confirm in ~1s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
