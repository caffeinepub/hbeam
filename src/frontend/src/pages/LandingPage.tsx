import {
  DollarSign,
  ExternalLink,
  FileUp,
  Github,
  Lock,
  MessageSquare,
  Mic,
  Twitter,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { AppMockup } from "../components/AppMockup";
import { NetworkBackground } from "../components/NetworkBackground";
import { SendPaymentShowcase } from "../components/SendPaymentShowcase";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, oklch(0.16 0.015 180 / 0.4) 0%, oklch(0.11 0.012 240) 60%)",
      }}
    >
      {/* Header */}
      <header className="relative z-10 border-b border-surface-3">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "oklch(0.82 0.19 152)" }}
            >
              <span
                className="text-sm font-black"
                style={{ color: "oklch(0.10 0.01 150)" }}
              >
                H
              </span>
            </div>
            <span className="text-lg font-bold">HBeam</span>
          </div>

          {/* Nav */}
          <nav
            className="hidden md:flex items-center gap-7"
            data-ocid="nav.section"
          >
            {["Features", "Wallet", "Security", "Support"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid={`nav.${item.toLowerCase()}.link`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <button
            type="button"
            onClick={onGetStarted}
            className="rounded-full px-5 py-2 text-sm font-semibold transition-all hover:opacity-90 mint-glow"
            style={{
              background: "oklch(0.82 0.19 152)",
              color: "oklch(0.10 0.01 150)",
            }}
            data-ocid="nav.get_started.button"
          >
            Get Started
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section
          id="features"
          className="relative pt-20 pb-12 px-6 overflow-hidden"
        >
          <NetworkBackground />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left copy */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              >
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium mb-6"
                  style={{
                    background: "oklch(0.82 0.19 152 / 0.1)",
                    border: "1px solid oklch(0.82 0.19 152 / 0.25)",
                    color: "oklch(0.82 0.19 152)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-glow" />
                  Powered by Hoosat Blockchain
                </div>

                <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6">
                  Private Messaging
                  <br />
                  on <span className="text-mint">Hoosat</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
                  Send encrypted messages, files, voice notes, and HTN payments
                  — all in one blazing-fast app built on Hoosat&apos;s 1-second
                  block chain.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className="rounded-full px-7 py-3.5 font-semibold text-base transition-all hover:opacity-90 mint-glow"
                    style={{
                      background: "oklch(0.82 0.19 152)",
                      color: "oklch(0.10 0.01 150)",
                    }}
                    data-ocid="hero.launch.button"
                  >
                    Launch HBeam
                  </button>
                  <a
                    href="https://hub.hoosat.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="hero.hoosat_hub.link"
                  >
                    Explore Hoosat Hub
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-mint" />
                    <span>~1s blocks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-mint" />
                    <span>0.00001 HTN fees</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-mint" />
                    <span>E2E encrypted</span>
                  </div>
                </div>
              </motion.div>

              {/* Right: floating app preview card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="animate-float"
              >
                <div
                  className="rounded-3xl p-1"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.19 152 / 0.25), oklch(0.30 0.018 240 / 0.2))",
                  }}
                >
                  <div
                    className="rounded-[22px] overflow-hidden p-4"
                    style={{ background: "oklch(0.14 0.012 240)" }}
                  >
                    {/* Mini chat preview */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: "oklch(0.82 0.19 152 / 0.2)",
                          color: "oklch(0.82 0.19 152)",
                        }}
                      >
                        A
                      </div>
                      <div>
                        <div className="text-sm font-medium">Alice H.</div>
                        <div className="text-xs text-mint flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                          Online
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { me: false, text: "Payment received! 🎉" },
                        { me: true, text: "Sending 10 HTN..." },
                        { me: false, text: "Got it in 1 second! ⚡" },
                      ].map((msg) => (
                        <div
                          key={msg.text}
                          className={`flex ${
                            msg.me ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className="rounded-2xl px-4 py-2 text-sm max-w-[80%]"
                            style={{
                              background: msg.me
                                ? "oklch(0.82 0.19 152 / 0.18)"
                                : "oklch(0.22 0.016 240)",
                              color: msg.me
                                ? "oklch(0.90 0.15 152)"
                                : "oklch(0.90 0.01 220)",
                            }}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className="mt-4 rounded-full px-4 py-2.5 text-xs text-muted-foreground"
                      style={{ background: "oklch(0.20 0.016 240)" }}
                    >
                      Message or send HTN...
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Full-width app mockup */}
        <section className="px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <AppMockup />
          </motion.div>
        </section>

        {/* Features grid */}
        <section id="security" className="px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto text-center mb-14"
          >
            <h2 className="text-4xl font-extrabold mb-4">
              Everything you need,{" "}
              <span className="text-mint">nothing you don&apos;t</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built for privacy-first communication backed by Hoosat&apos;s
              blazing fast blockchain.
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: MessageSquare,
                title: "Private Messaging",
                desc: "End-to-end encrypted messages. Nobody reads your conversations.",
              },
              {
                icon: FileUp,
                title: "File Sharing",
                desc: "Send documents, images, and files securely through the app.",
              },
              {
                icon: Mic,
                title: "Voice Messages",
                desc: "Record and send voice notes with one tap. Fast and private.",
              },
              {
                icon: DollarSign,
                title: "HTN Payments",
                desc: "Send Hoosat HTN to any contact directly from your chat.",
              },
              {
                icon: Zap,
                title: "1-Second Blocks",
                desc: "Hoosat confirms transactions in about 1 second. No waiting.",
              },
              {
                icon: Lock,
                title: "Ultra Low Fees",
                desc: "Pay only 0.00001 HTN per transaction. Nearly free.",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="glass-card rounded-2xl p-6 hover:border-mint/30 transition-colors"
                data-ocid={`features.item.${i + 1}`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: "oklch(0.82 0.19 152 / 0.1)",
                    border: "1px solid oklch(0.82 0.19 152 / 0.2)",
                  }}
                >
                  <feat.icon className="w-5 h-5 text-mint" />
                </div>
                <h3 className="font-semibold text-base mb-1.5">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Send Payment showcase */}
        <section
          id="wallet"
          className="px-6 py-20 relative"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.16 0.015 180 / 0.2) 0%, transparent 70%)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto text-center mb-12"
          >
            <h2 className="text-4xl font-extrabold mb-4">
              Send HTN <span className="text-mint">in seconds</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Integrated wallet — pay contacts without leaving the conversation.
            </p>
          </motion.div>

          {/* Connecting line */}
          <div className="flex justify-center mb-6">
            <div
              className="w-px h-12"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.82 0.19 152 / 0.4), oklch(0.82 0.19 152 / 0.05))",
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SendPaymentShowcase />
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer id="support" className="border-t border-surface-3 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
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
                <span className="font-bold">HBeam</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Private messaging and HTN payments on Hoosat blockchain.
              </p>
            </div>

            {/* Footer link groups */}
            {[
              {
                label: "Product",
                links: [
                  { text: "Features", href: "#features" },
                  { text: "Wallet", href: "#wallet" },
                  { text: "Security", href: "#security" },
                ],
              },
              {
                label: "Hoosat",
                links: [
                  { text: "Hoosat Hub", href: "https://hub.hoosat.net/" },
                  { text: "Explorer", href: "https://explorer.hoosat.net/" },
                  { text: "Docs", href: "https://hub.hoosat.net/" },
                ],
              },
              {
                label: "Legal",
                links: [
                  { text: "Privacy Policy", href: "#" },
                  { text: "Terms of Service", href: "#" },
                ],
              },
            ].map((group) => (
              <div key={group.label}>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {group.label}
                </div>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.text}>
                      <a
                        href={link.href}
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        data-ocid={`footer.${link.text.toLowerCase().replace(/ /g, "_")}.link`}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-surface-3 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="footer.github.link"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="footer.twitter.link"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
