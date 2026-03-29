import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReveal } from "@/hooks/useReveal";

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// Text hierarchy: text-white → text-slate-200 → text-slate-400
// Cards: bg-[#131920] border border-[#1e2a35]
// Accent surfaces: bg-[color]/10 border-[color]/30
// ─────────────────────────────────────────────────────────────────

// ─── Shared helpers ───────────────────────────────────────────────

const CARD = "rounded-xl border border-[#1e2a35] bg-[#0f1520]";
const CARD_ELEVATED = "rounded-xl border border-[#243040] bg-[#131920]";

function StepBadge({
  step,
  total,
  tag,
}: {
  step: number;
  total: number;
  tag: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#1e2a35] bg-[#0f1520]">
        <span className="font-mono text-[11px] text-slate-500 tracking-widest">
          {String(step).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
        <div className="w-px h-3 bg-[#1e2a35]" />
        <span className="font-mono text-[11px] text-slate-400 tracking-wider uppercase">
          {tag}
        </span>
      </div>
    </div>
  );
}

function InfoCallout({
  color,
  children,
}: {
  color: "blue" | "green" | "amber" | "red";
  children: React.ReactNode;
}) {
  const map = {
    blue: "border-cyber-blue/25  bg-cyber-blue/[0.06]  text-blue-300",
    green: "border-cyber-green/25 bg-cyber-green/[0.06] text-green-300",
    amber: "border-cyber-amber/25 bg-cyber-amber/[0.06] text-amber-300",
    red: "border-cyber-red/25   bg-cyber-red/[0.06]   text-red-300",
  };
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${map[color]}`}
    >
      <span className="mt-0.5 text-[10px]">▸</span>
      <p className="text-[13px] leading-relaxed">{children}</p>
    </div>
  );
}

function QuizQuestion({
  question,
  options,
  accentColor = "blue",
  onAnswer,
}: {
  question: string;
  options: { text: string; correct: boolean; explanation: string }[];
  accentColor?: "blue" | "green" | "amber" | "red";
  onAnswer?: (correct: boolean) => void;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const colorMap = {
    blue: {
      ring: "focus:ring-cyber-blue/40",
      active: "border-cyber-blue/50 bg-cyber-blue/10 text-blue-200",
    },
    green: {
      ring: "focus:ring-cyber-green/40",
      active: "border-cyber-green/50 bg-cyber-green/10 text-green-200",
    },
    amber: {
      ring: "focus:ring-cyber-amber/40",
      active: "border-cyber-amber/50 bg-cyber-amber/10 text-amber-200",
    },
    red: {
      ring: "focus:ring-cyber-red/40",
      active: "border-cyber-red/50 bg-cyber-red/10 text-red-200",
    },
  };
  const correct = chosen !== null ? options[chosen].correct : false;

  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-2 h-2 rounded-full ${accentColor === "blue" ? "bg-cyber-blue" : accentColor === "green" ? "bg-cyber-green" : accentColor === "amber" ? "bg-cyber-amber" : "bg-cyber-red"} animate-pulse-soft`}
        />
        <span className="text-[11px] font-heading tracking-widest text-slate-400 uppercase">
          Knowledge Check
        </span>
      </div>
      <p className="text-[15px] text-slate-200 font-medium mb-4 leading-snug">
        {question}
      </p>
      {chosen === null ? (
        <div className="grid sm:grid-cols-2 gap-2">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                setChosen(i);
                onAnswer?.(opt.correct);
              }}
              className="text-left px-4 py-3 rounded-lg border border-[#1e2a35] text-[13px] text-slate-300 hover:border-slate-500 hover:text-white hover:bg-white/[0.03] transition-all duration-150 leading-snug"
            >
              <span className="text-slate-600 font-mono text-[11px] mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      ) : (
        <div
          className={`rounded-lg border p-4 animate-fade-in ${correct ? "border-cyber-green/40 bg-cyber-green/[0.06]" : "border-cyber-red/30 bg-cyber-red/[0.05]"}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-lg ${correct ? "text-cyber-green" : "text-cyber-red"}`}
            >
              {correct ? "✓" : "✗"}
            </span>
            <span
              className={`text-[13px] font-semibold ${correct ? "text-green-300" : "text-red-300"}`}
            >
              {correct
                ? "Correct!"
                : `Not quite — the answer was: ${options.find((o) => o.correct)?.text}`}
            </span>
          </div>
          <p className="text-[13px] text-slate-400 leading-relaxed">
            {options[chosen].explanation}
          </p>
          <button
            onClick={() => setChosen(null)}
            className="mt-3 text-[11px] font-mono text-slate-500 hover:text-slate-300 tracking-wider transition-colors"
          >
            ↺ TRY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}

function RevealWrapper({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal(0.08);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Side progress ────────────────────────────────────────────────

const SECTION_IDS = ["s-boot", "s-cpu", "s-memory", "s-network", "s-synthesis"];
const SECTION_LABELS = ["Boot", "CPU", "Memory", "Network", "Synthesis"];

function SideProgress() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers = SECTION_IDS.map((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActive(idx);
        },
        { threshold: 0.25 },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3">
      {SECTION_IDS.map((id, i) => (
        <button
          key={id}
          onClick={() =>
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
          }
          title={SECTION_LABELS[i]}
          className="group flex items-center gap-2"
        >
          <span
            className={`font-mono text-[9px] tracking-widest transition-all duration-300 ${i === active ? "text-slate-400 opacity-100" : "text-slate-600 opacity-0 group-hover:opacity-100"}`}
          >
            {SECTION_LABELS[i]}
          </span>
          <div
            className={`rounded-full transition-all duration-500 ${
              i === active
                ? "w-[3px] h-7 bg-white/60"
                : i < active
                  ? "w-1.5 h-1.5 bg-white/20"
                  : "w-1.5 h-1.5 bg-white/8 group-hover:bg-white/20"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Top Navigation ───────────────────────────────────────────────

function TopNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#080c10]/90 backdrop-blur-xl border-b border-[#1a2535]" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="CyberVerse"
            className="w-6 h-6 object-contain"
          />
          <span className="font-heading text-sm tracking-[0.18em] text-white/80 uppercase">
            CyberVerse
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {SECTION_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() =>
                document
                  .getElementById(SECTION_IDS[i])
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-3 py-1.5 font-mono text-[11px] text-slate-500 hover:text-slate-200 tracking-wider uppercase transition-colors duration-200 rounded"
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            window.scrollTo(0, 0);
            navigate("/simulation");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg text-cyber-blue text-[12px] font-heading tracking-wider hover:bg-cyber-blue/20 hover:border-cyber-blue/50 transition-all duration-200"
          style={{ boxShadow: "0 0 20px hsl(217 91% 60% / 0.1)" }}
        >
          Launch Simulation <span className="text-cyber-blue/50">↗</span>
        </button>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 1: SYSTEM BOOT
// ─────────────────────────────────────────────────────────────────

type BootMode = "fast" | "secure" | null;

const FAST_BOOT = [
  { text: "$ skipping POST checks...", ms: 0 },
  { text: "$ loading last-known state......... [CACHED]", ms: 280 },
  { text: "$ resuming kernel.................. [OK]", ms: 560 },
  { text: "$ system up in 0.8s — FAST BOOT COMPLETE", ms: 840 },
];

const SECURE_BOOT = [
  { text: "$ running Power-On Self Test (POST)...", ms: 0 },
  { text: "$ verifying firmware signature......... [OK]", ms: 350 },
  { text: "$ checking bootloader integrity........ [OK]", ms: 700 },
  { text: "$ scanning driver signatures........... [OK]", ms: 1050 },
  { text: "$ validating kernel modules............ [OK]", ms: 1400 },
  { text: "$ establishing encrypted channels...... [OK]", ms: 1750 },
  { text: "$ SECURE BOOT COMPLETE — all signatures verified", ms: 2100 },
];

function HeroSection() {
  const [bootMode, setBootMode] = useState<BootMode>(null);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [booting, setBooting] = useState(false);
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();

  const runBoot = (mode: BootMode) => {
    if (booting || !mode) return;
    setBootMode(mode);
    setLogLines([]);
    setComplete(false);
    setBooting(true);
    const seq = mode === "fast" ? FAST_BOOT : SECURE_BOOT;
    seq.forEach(({ text, ms }) => {
      setTimeout(() => setLogLines((p) => [...p, text]), ms);
    });
    setTimeout(
      () => {
        setBooting(false);
        setComplete(true);
      },
      seq[seq.length - 1].ms + 500,
    );
  };

  const glowColor =
    bootMode === "fast"
      ? "hsl(38 92% 50% / 0.07)"
      : bootMode === "secure"
        ? "hsl(142 71% 45% / 0.07)"
        : "hsl(217 91% 60% / 0.06)";

  return (
    <section
      id="s-boot"
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
    >
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(217 91% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217 91% 60%) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] transition-all duration-2000 animate-background-glow"
          style={{ background: glowColor }}
        />
        {/* Secondary glow for depth */}
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-40"
          style={{ background: "hsl(142 71% 45% / 0.04)" }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30"
          style={{ background: "hsl(38 92% 50% / 0.03)" }}
        />
      </div>

      {/* Decorative SVGs */}
      <div className="absolute top-28 left-10 w-16 h-16 opacity-[0.08] animate-drift-y">
        <svg
          viewBox="0 0 64 64"
          fill="none"
          stroke="hsl(217 91% 60%)"
          strokeWidth="1"
        >
          <rect x="8" y="8" width="48" height="48" rx="4" />
          <line x1="8" y1="22" x2="56" y2="22" />
          <circle cx="14" cy="15" r="2.5" fill="hsl(217 91% 60%)" />
          <circle cx="22" cy="15" r="2.5" fill="hsl(217 91% 60%)" />
          <circle cx="30" cy="15" r="2.5" fill="hsl(217 91% 60%)" />
        </svg>
      </div>
      <div className="absolute bottom-32 right-12 w-20 h-20 opacity-[0.07] animate-drift-x">
        <svg
          viewBox="0 0 80 80"
          fill="none"
          stroke="hsl(142 71% 45%)"
          strokeWidth="1"
        >
          <circle cx="40" cy="40" r="32" strokeDasharray="4 4" />
          <circle cx="40" cy="40" r="20" />
          <circle cx="40" cy="40" r="5" fill="hsl(142 71% 45%)" />
        </svg>
      </div>

      <div className="relative max-w-4xl w-full">
        {/* Eyebrow */}
        <RevealWrapper>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-cyber-blue/40" />
            <span className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase">
              An Interactive Journey
            </span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-cyber-blue/40" />
          </div>
        </RevealWrapper>

        <RevealWrapper delay={80}>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] mb-6">
            Inside a<br />
            <span className="text-cyber-blue">Computer</span>
          </h1>
        </RevealWrapper>

        <RevealWrapper delay={160}>
          <p className="text-slate-300 text-lg md:text-xl max-w-xl mb-3 leading-relaxed">
            A cinematic exploration of how machines think, remember,
            communicate, and defend themselves.
          </p>
          <p className="text-slate-500 text-[15px] italic mb-10">
            "Every computation is a story. You're about to read one."
          </p>
        </RevealWrapper>

        {/* ── CHOICE: Fast vs Secure Boot ── */}
        <RevealWrapper delay={240}>
          <div className={`${CARD_ELEVATED} p-6 mb-6`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse-soft" />
              <span className="text-[11px] font-heading tracking-widest text-slate-400 uppercase">
                Your First Decision
              </span>
            </div>
            <p className="text-white text-[16px] font-medium mb-1">
              How should the system start?
            </p>
            <p className="text-slate-400 text-[13px] mb-5 leading-relaxed">
              Real computers face this tradeoff every boot. Speed means skipping
              checks. Security means verifying everything.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              {/* Fast Boot */}
              <button
                onClick={() => runBoot("fast")}
                disabled={booting}
                className={`group relative text-left p-4 rounded-xl border-2 transition-all duration-250 active:scale-[0.98] ${
                  bootMode === "fast" && complete
                    ? "border-amber-400/50 bg-amber-500/[0.08]"
                    : "border-[#1e2a35] hover:border-amber-400/40 hover:bg-amber-500/[0.05]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⚡</span>
                  <span className="font-heading text-[13px] tracking-wider text-amber-300">
                    FAST BOOT
                  </span>
                </div>
                <p className="text-[12px] text-slate-400 leading-snug">
                  Skip hardware checks, restore cached state. Boots in ~0.8s.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[10px] font-mono text-amber-400">
                      SPEED: HIGH
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                    <span className="text-[10px] font-mono text-red-400">
                      SECURITY: LOW
                    </span>
                  </div>
                </div>
              </button>

              {/* Secure Boot */}
              <button
                onClick={() => runBoot("secure")}
                disabled={booting}
                className={`group relative text-left p-4 rounded-xl border-2 transition-all duration-250 active:scale-[0.98] ${
                  bootMode === "secure" && complete
                    ? "border-green-400/50 bg-green-500/[0.08]"
                    : "border-[#1e2a35] hover:border-green-400/40 hover:bg-green-500/[0.05]"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🔒</span>
                  <span className="font-heading text-[13px] tracking-wider text-green-300">
                    SECURE BOOT
                  </span>
                </div>
                <p className="text-[12px] text-slate-400 leading-snug">
                  Verify every signature from firmware to kernel. Takes ~3s.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                    <span className="text-[10px] font-mono text-green-400">
                      SPEED: LOW
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                    <span className="text-[10px] font-mono text-green-400">
                      SECURITY: HIGH
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Boot log */}
            {logLines.length > 0 && (
              <div className="rounded-lg bg-[#080c10] border border-[#1a2535] p-4 font-mono text-[12px] space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1a2535]">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${booting ? "bg-cyber-amber animate-pulse-soft" : "bg-cyber-green"}`}
                  />
                  <span className="text-[10px] text-slate-500 tracking-widest">
                    {booting
                      ? "BOOTING..."
                      : bootMode === "fast"
                        ? "FAST BOOT COMPLETE"
                        : "SECURE BOOT COMPLETE"}
                  </span>
                </div>
                {logLines.map((line, i) => (
                  <div
                    key={i}
                    className={`${line.includes("COMPLETE") ? "text-cyber-green font-semibold" : line.includes("[OK]") || line.includes("[CACHED]") ? "text-slate-300" : "text-slate-500"}`}
                  >
                    <span className="text-slate-700 mr-2">&gt;</span>
                    {line}
                  </div>
                ))}
                {booting && (
                  <span className="inline-block w-[2px] h-[13px] bg-cyber-green/80 ml-4 animate-blink" />
                )}
              </div>
            )}

            {/* Outcome explanation */}
            {complete && (
              <div
                className={`mt-4 rounded-lg border p-4 animate-fade-in ${bootMode === "fast" ? "border-amber-500/25 bg-amber-500/[0.05]" : "border-green-500/25 bg-green-500/[0.05]"}`}
              >
                <p
                  className={`text-[13px] font-semibold mb-1 ${bootMode === "fast" ? "text-amber-300" : "text-green-300"}`}
                >
                  {bootMode === "fast"
                    ? "⚡ Fast boot complete — but at a cost."
                    : "🔒 Secure boot complete — the system is trusted."}
                </p>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  {bootMode === "fast"
                    ? "Fast boot skips firmware signature checks. If malware injected itself into the bootloader between sessions, it would go undetected. Used for developer machines and trusted environments."
                    : "Secure boot verified a cryptographic chain from UEFI firmware → bootloader → kernel. No tampered code can run. This is why modern phones and enterprise systems require it."}
                </p>
              </div>
            )}
          </div>
        </RevealWrapper>

        {/* Quiz */}
        <RevealWrapper delay={320}>
          <QuizQuestion
            accentColor="blue"
            question="What does UEFI Secure Boot actually verify?"
            options={[
              {
                text: "That the operating system files haven't been modified",
                correct: false,
                explanation:
                  "UEFI Secure Boot specifically validates cryptographic signatures on the bootloader and kernel, not OS files generally. That's the job of tools like dm-verity or Windows Defender.",
              },
              {
                text: "Cryptographic signatures on the bootloader and kernel image",
                correct: true,
                explanation:
                  "Correct! UEFI uses a certificate database (db) to verify that each piece of boot software is signed by a trusted key. Unsigned or tampered code fails to load — this stops bootkit malware cold.",
              },
              {
                text: "That the CPU temperature is safe before booting",
                correct: false,
                explanation:
                  "Temperature checks are done by the hardware/BIOS but are unrelated to Secure Boot. Secure Boot is purely about cryptographic trust chains.",
              },
              {
                text: "That your password is correct before the system starts",
                correct: false,
                explanation:
                  "Password authentication happens at the OS login screen, after the boot process. Secure Boot operates at firmware level, before any OS code runs.",
              },
            ]}
          />
        </RevealWrapper>

        {/* Scroll cue */}
        <RevealWrapper delay={420}>
          <div className="flex flex-col items-center gap-2 mt-10 opacity-35">
            <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">
              Scroll to continue
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent animate-pulse-soft" />
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 2: CPU PROCESSING
// ─────────────────────────────────────────────────────────────────

type TaskType = "cpu-bound" | "io-bound" | "realtime" | null;

const TASK_PROFILES: Record<
  NonNullable<TaskType>,
  {
    label: string;
    color: string;
    borderColor: string;
    bgColor: string;
    textColor: string;
    speed: number;
    priority: string;
    icon: string;
    example: string;
    pipelineMs: number;
    description: string;
    tradeoff: string;
  }
> = {
  "cpu-bound": {
    label: "CPU-Bound",
    color: "cyber-amber",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/[0.08]",
    textColor: "text-amber-300",
    speed: 95,
    priority: "HIGH",
    icon: "⚙️",
    example: "Video encoding, 3D rendering, compression",
    pipelineMs: 550,
    description:
      "CPU-bound tasks max out processor cycles. All 4 pipeline stages run at full intensity.",
    tradeoff:
      "Dominates CPU time. Other tasks get starved. OS scheduler must time-slice aggressively.",
  },
  "io-bound": {
    label: "I/O-Bound",
    color: "cyber-blue",
    borderColor: "border-blue-500/50",
    bgColor: "bg-blue-500/[0.08]",
    textColor: "text-blue-300",
    speed: 30,
    priority: "NORMAL",
    icon: "💾",
    example: "File reads, database queries, network calls",
    pipelineMs: 900,
    description:
      "I/O-bound tasks mostly wait. The CPU stalls at EXECUTE stage while awaiting data from disk or network.",
    tradeoff:
      "Low CPU usage. Perfect for multitasking — the CPU idles while waiting and runs other threads.",
  },
  realtime: {
    label: "Real-Time",
    color: "cyber-red",
    borderColor: "border-red-500/50",
    bgColor: "bg-red-500/[0.08]",
    textColor: "text-red-300",
    speed: 60,
    priority: "CRITICAL",
    icon: "⏱️",
    example: "Audio drivers, pacemakers, ABS brakes",
    pipelineMs: 700,
    description:
      "Real-time tasks have hard deadlines. Missing one is a system failure. The OS guarantees they run on time.",
    tradeoff:
      "Highest scheduling priority. Preempts everything. Used in embedded systems where a missed deadline is catastrophic.",
  },
};

const STAGES = ["FETCH", "DECODE", "EXECUTE", "WRITE"];
const STAGE_DESCS = [
  "Load instruction from memory",
  "Parse opcode and operands",
  "Run the operation in ALU",
  "Store result to register",
];
const STAGE_COLORS = [
  "text-blue-300 border-blue-500/40",
  "text-amber-300 border-amber-500/40",
  "text-red-300 border-red-500/40",
  "text-green-300 border-green-500/40",
];
const STAGE_BGS = [
  "bg-blue-500/[0.06]",
  "bg-amber-500/[0.06]",
  "bg-red-500/[0.06]",
  "bg-green-500/[0.06]",
];

type PipelineTask = { id: number; label: string; stage: number; color: string };

// ─────────────────────────────────────────────────────────────────
// INTRO SECTION: GUIDE FOR FIRST-TIME VISITORS
// ─────────────────────────────────────────────────────────────────

function IntroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background storytelling figures */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left side: Binary figure */}
        <svg
          className="absolute left-0 top-1/4 w-40 h-40 opacity-[0.12]"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient
              id="binary-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(217 91% 60%)" />
              <stop offset="100%" stopColor="hsl(142 71% 45%)" />
            </linearGradient>
          </defs>
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#binary-gradient)"
            strokeWidth="2"
          />
          <text
            x="100"
            y="105"
            textAnchor="middle"
            fontSize="40"
            fill="url(#binary-gradient)"
            className="font-mono"
          >
            01
          </text>
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#binary-gradient)"
            strokeWidth="1"
            opacity="0.5"
          />
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="url(#binary-gradient)"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>

        {/* Right side: Network figure */}
        <svg
          className="absolute right-0 bottom-1/4 w-48 h-48 opacity-[0.12]"
          viewBox="0 0 200 200"
        >
          <defs>
            <linearGradient
              id="network-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(142 71% 45%)" />
              <stop offset="100%" stopColor="hsl(38 92% 50%)" />
            </linearGradient>
          </defs>
          {/* Network nodes and connections */}
          <circle cx="50" cy="50" r="6" fill="url(#network-gradient)" />
          <circle cx="150" cy="50" r="6" fill="url(#network-gradient)" />
          <circle cx="100" cy="150" r="6" fill="url(#network-gradient)" />
          <circle cx="100" cy="100" r="8" fill="url(#network-gradient)" />
          <line
            x1="50"
            y1="50"
            x2="100"
            y2="100"
            stroke="url(#network-gradient)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="150"
            y1="50"
            x2="100"
            y2="100"
            stroke="url(#network-gradient)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="100"
            y1="150"
            x2="100"
            y2="100"
            stroke="url(#network-gradient)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="50"
            y1="50"
            x2="150"
            y2="50"
            stroke="url(#network-gradient)"
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="5,5"
          />
        </svg>

        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-cyan-500/[0.04] blur-[140px]" />
        </div>
      </div>

      <div className="relative max-w-4xl w-full">
        <RevealWrapper>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-cyber-blue/40" />
              <span className="font-mono text-[11px] tracking-[0.28em] text-slate-500 uppercase">
                Welcome Aboard
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyber-blue/40" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl text-white tracking-tight mb-4">
              What You're About to Experience
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-2">
              This interactive story reveals the hidden world of computation —
              the systems that power everything you use.
            </p>
          </div>
        </RevealWrapper>

        {/* Guide cards */}
        <RevealWrapper delay={80}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              {
                icon: "⚙️",
                title: "CPU",
                description:
                  "The brain that executes billions of instructions per second through a precise pipeline.",
              },
              {
                icon: "💾",
                title: "Memory",
                description:
                  "Layers of storage that trade speed for capacity — from cache to RAM to disk.",
              },
              {
                icon: "🌐",
                title: "Network",
                description:
                  "How computers speak to each other across the globe using packets and protocols.",
              },
              {
                icon: "🛡️",
                title: "Security",
                description:
                  "The vulnerabilities and defenses in each layer, from CPU to application.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="rounded-xl border border-[#1e2a35] bg-[#0f1520]/50 p-4 hover:border-cyan-500/30 hover:bg-[#0f1520]/80 transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-500/[0.15]"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="font-heading text-sm tracking-wider text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-[13px] text-slate-400 leading-snug group-hover:text-slate-300 transition-colors duration-300">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </RevealWrapper>

        {/* Tips for first-time visitors */}
        <RevealWrapper delay={160}>
          <div className={`${CARD_ELEVATED} p-6 mb-8`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💡</span>
              <h3 className="font-heading text-sm tracking-wider text-cyan-300 uppercase">
                Interactive Learning
              </h3>
            </div>
            <ul className="space-y-2 text-[13px] text-slate-300">
              <li className="flex gap-2">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span>
                  <strong>Click and interact:</strong> Every component is
                  interactive. Try running simulations, clicking through
                  quizzes, and experimenting with settings.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span>
                  <strong>Scroll to explore:</strong> Each section reveals new
                  concepts. Move at your own pace — there's no time pressure.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span>
                  <strong>Spot the story:</strong> Watch how each layer builds
                  on the previous one. Computing is a carefully orchestrated
                  dance.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-400 flex-shrink-0">•</span>
                <span>
                  <strong>Challenge yourself:</strong> Test your understanding
                  with embedded quizzes. You'll learn by doing.
                </span>
              </li>
            </ul>
          </div>
        </RevealWrapper>

        {/* Navigation hint */}
        <RevealWrapper delay={240}>
          <div className="flex items-center justify-center gap-4 text-slate-400 text-[13px]">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-500/40" />
            <span>Scroll down to begin your journey</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-500/40" />
          </div>
          <div className="flex justify-center mt-6">
            <div className="text-3xl animate-bounce text-cyan-400">↓</div>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}

function CPUSection() {
  const { ref, visible } = useReveal(0.12);
  const [selectedTask, setSelectedTask] = useState<TaskType>(null);
  const [tasks, setTasks] = useState<PipelineTask[]>([]);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [cycleCount, setCycleCount] = useState(0);
  const [customInput, setCustomInput] = useState("SORT_ARRAY");
  const nextId = useRef(1);

  const submitTask = (label: string, pipelineMs?: number) => {
    const id = nextId.current++;
    const profile = selectedTask ? TASK_PROFILES[selectedTask] : null;
    const color = profile?.textColor ?? "text-slate-300";
    const ms = pipelineMs ?? profile?.pipelineMs ?? 700;

    setTasks((p) => [...p, { id, label, stage: 0, color }]);
    setCycleCount((c) => c + 1);
    STAGES.forEach((_, i) => {
      setTimeout(() => {
        setActiveStage(i);
        setTasks((p) => p.map((t) => (t.id === id ? { ...t, stage: i } : t)));
      }, i * ms);
    });
    setTimeout(
      () => {
        setActiveStage(null);
        setTasks((p) => p.filter((t) => t.id !== id));
      },
      STAGES.length * ms + 350,
    );
  };

  const profile = selectedTask ? TASK_PROFILES[selectedTask] : null;

  return (
    <section
      id="s-cpu"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative"
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Main glow */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-amber-500/[0.03] blur-[130px]" />

        {/* Animated data streams */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.12]">
          <defs>
            <linearGradient
              id="stream-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity="0" />
              <stop
                offset="50%"
                stopColor="hsl(38 92% 50%)"
                stopOpacity="0.8"
              />
              <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Vertical data streams */}
          <line
            x1="20%"
            y1="0"
            x2="20%"
            y2="100%"
            stroke="url(#stream-gradient)"
            strokeWidth="2"
            className="animate-data-stream"
          />
          <line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke="url(#stream-gradient)"
            strokeWidth="2"
            className="animate-data-stream delay-0\.8s"
          />
          <line
            x1="80%"
            y1="0"
            x2="80%"
            y2="100%"
            stroke="url(#stream-gradient)"
            strokeWidth="2"
            className="animate-data-stream delay-1\.6s"
          />
        </svg>

        {/* Decorative circuit lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="cpu-grid"
              x="80"
              y="80"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="0"
                y="0"
                width="80"
                height="80"
                fill="none"
                stroke="hsl(38 92% 50%)"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="3" fill="hsl(38 92% 50%)" />
              <circle cx="80" cy="80" r="3" fill="hsl(38 92% 50%)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cpu-grid)" />
        </svg>

        {/* Orbiting particles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
          <div className="absolute w-3 h-3 bg-amber-400/40 rounded-full top-0 left-1/2 -translate-x-1/2 animate-orbit" />
          <div className="absolute w-2 h-2 bg-amber-300/30 rounded-full top-1/2 right-0 -translate-y-1/2 animate-orbit delay-2s" />
          <div className="absolute w-2.5 h-2.5 bg-amber-500/25 rounded-full bottom-0 left-1/2 -translate-x-1/2 animate-orbit delay-4s" />
        </div>

        {/* Pulsing nodes */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.15]">
          <circle
            cx="15%"
            cy="25%"
            r="4"
            fill="hsl(38 92% 50%)"
            className="animate-ping-slow"
          />
          <circle
            cx="85%"
            cy="35%"
            r="3"
            fill="hsl(38 92% 50%)"
            className="animate-ping-slow delay-0\.5s"
          />
          <circle
            cx="45%"
            cy="75%"
            r="3.5"
            fill="hsl(38 92% 50%)"
            className="animate-ping-slow delay-1s"
          />
          <circle
            cx="70%"
            cy="20%"
            r="2.5"
            fill="hsl(38 92% 50%)"
            className="animate-ping-slow delay-1\.5s"
          />
        </svg>

        {/* Animated corner accents */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-amber-500/20 rounded-lg animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border border-amber-500/15 rounded-full animate-spin-slow" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-2 border-amber-500/10 rounded-xl rotate-45 animate-drift-x" />

        {/* Quantum field effect */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none quantum-field animate-aurora" />

        {/* CPU Pipeline Story Visualization */}
        <svg
          className="absolute left-0 top-1/3 w-32 h-64 opacity-[0.08]"
          viewBox="0 0 100 400"
        >
          <defs>
            <linearGradient
              id="cpu-story-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(38 92% 50%)" />
              <stop offset="100%" stopColor="hsl(217 91% 60%)" />
            </linearGradient>
          </defs>
          {/* Pipeline stages visualization */}
          <rect
            x="10"
            y="20"
            width="80"
            height="50"
            fill="none"
            stroke="url(#cpu-story-gradient)"
            strokeWidth="2"
          />
          <text
            x="50"
            y="52"
            textAnchor="middle"
            fontSize="10"
            fill="url(#cpu-story-gradient)"
          >
            FETCH
          </text>
          <rect
            x="10"
            y="100"
            width="80"
            height="50"
            fill="none"
            stroke="url(#cpu-story-gradient)"
            strokeWidth="2"
            opacity="0.7"
          />
          <text
            x="50"
            y="132"
            textAnchor="middle"
            fontSize="10"
            fill="url(#cpu-story-gradient)"
            opacity="0.7"
          >
            DECODE
          </text>
          <rect
            x="10"
            y="180"
            width="80"
            height="50"
            fill="none"
            stroke="url(#cpu-story-gradient)"
            strokeWidth="2"
            opacity="0.5"
          />
          <text
            x="50"
            y="212"
            textAnchor="middle"
            fontSize="10"
            fill="url(#cpu-story-gradient)"
            opacity="0.5"
          >
            EXECUTE
          </text>
          <rect
            x="10"
            y="260"
            width="80"
            height="50"
            fill="none"
            stroke="url(#cpu-story-gradient)"
            strokeWidth="2"
            opacity="0.3"
          />
          <text
            x="50"
            y="292"
            textAnchor="middle"
            fontSize="10"
            fill="url(#cpu-story-gradient)"
            opacity="0.3"
          >
            STORE
          </text>
          {/* Arrows between stages */}
          <line
            x1="50"
            y1="70"
            x2="50"
            y2="100"
            stroke="url(#cpu-story-gradient)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <line
            x1="50"
            y1="150"
            x2="50"
            y2="180"
            stroke="url(#cpu-story-gradient)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <line
            x1="50"
            y1="230"
            x2="50"
            y2="260"
            stroke="url(#cpu-story-gradient)"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </svg>

        {/* Memory Hierarchy Story Visualization */}
        <svg
          className="absolute right-0 bottom-1/4 w-32 h-48 opacity-[0.08]"
          viewBox="0 0 100 200"
        >
          <defs>
            <linearGradient
              id="memory-story-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(217 91% 60%)" />
              <stop offset="100%" stopColor="hsl(142 71% 45%)" />
            </linearGradient>
          </defs>
          {/* Cache levels */}
          <rect
            x="10"
            y="10"
            width="80"
            height="30"
            fill="none"
            stroke="url(#memory-story-gradient)"
            strokeWidth="2"
          />
          <text
            x="50"
            y="30"
            textAnchor="middle"
            fontSize="9"
            fill="url(#memory-story-gradient)"
          >
            L1 Cache
          </text>
          <rect
            x="5"
            y="50"
            width="90"
            height="35"
            fill="none"
            stroke="url(#memory-story-gradient)"
            strokeWidth="2"
            opacity="0.7"
          />
          <text
            x="50"
            y="73"
            textAnchor="middle"
            fontSize="9"
            fill="url(#memory-story-gradient)"
            opacity="0.7"
          >
            L2/L3 Cache
          </text>
          <rect
            x="0"
            y="100"
            width="100"
            height="40"
            fill="none"
            stroke="url(#memory-story-gradient)"
            strokeWidth="2"
            opacity="0.5"
          />
          <text
            x="50"
            y="126"
            textAnchor="middle"
            fontSize="9"
            fill="url(#memory-story-gradient)"
            opacity="0.5"
          >
            RAM
          </text>
          <rect
            x="-5"
            y="155"
            width="110"
            height="35"
            fill="none"
            stroke="url(#memory-story-gradient)"
            strokeWidth="2"
            opacity="0.3"
          />
          <text
            x="50"
            y="176"
            textAnchor="middle"
            fontSize="8"
            fill="url(#memory-story-gradient)"
            opacity="0.3"
          >
            Storage
          </text>
        </svg>
      </div>

      <div className="relative max-w-5xl w-full">
        {/* Header */}
        <RevealWrapper>
          <StepBadge step={2} total={5} tag="CPU Processing" />
          <h2 className="font-heading text-4xl md:text-5xl text-white tracking-tight mb-4 leading-tight">
            The Brain of
            <br />
            <span
              className="text-amber-300"
              style={{ textShadow: "0 0 40px hsl(38 92% 50% / 0.3)" }}
            >
              Every Computation
            </span>
          </h2>
          <p className="text-slate-300 text-[15px] max-w-2xl mb-2 leading-relaxed">
            The Central Processing Unit executes billions of instructions per
            second through a rigid four-stage pipeline. But not all tasks are
            equal — and that's where scheduling gets interesting.
          </p>
          <p className="text-slate-500 text-[14px] italic mb-10">
            "The CPU doesn't think. It obeys. But it obeys at 3 billion times
            per second."
          </p>
        </RevealWrapper>

        {/* ── CHOICE: Task Type ── */}
        <RevealWrapper delay={120}>
          <div className={`${CARD_ELEVATED} p-6 mb-6`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft" />
              <span className="text-[11px] font-heading tracking-widest text-slate-400 uppercase">
                Choose a Task Type
              </span>
            </div>
            <p className="text-white text-[15px] font-medium mb-1">
              What kind of work should the CPU prioritize?
            </p>
            <p className="text-slate-400 text-[13px] mb-5">
              Each task type behaves differently in the pipeline. Watch how the
              speed and stall pattern changes.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              {(
                Object.entries(TASK_PROFILES) as [
                  TaskType,
                  (typeof TASK_PROFILES)[NonNullable<TaskType>],
                ][]
              ).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTask(key)}
                  className={`text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${selectedTask === key ? `${p.borderColor} ${p.bgColor}` : "border-[#1e2a35] hover:border-slate-600"}`}
                >
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <div
                    className={`font-heading text-[12px] tracking-wider mb-1 ${selectedTask === key ? p.textColor : "text-slate-300"}`}
                  >
                    {p.label}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {p.example}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono text-slate-600 uppercase">
                        CPU Load
                      </span>
                      <span
                        className={`text-[9px] font-mono ${selectedTask === key ? p.textColor : "text-slate-600"}`}
                      >
                        {p.speed}%
                      </span>
                    </div>
                    <div className="h-1 bg-[#1a2535] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${selectedTask === key ? (key === "cpu-bound" ? "bg-amber-400" : key === "io-bound" ? "bg-blue-400" : "bg-red-400") : "bg-slate-700"}`}
                        style={{
                          width: selectedTask === key ? `${p.speed}%` : "20%",
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Outcome explanation */}
            {profile && (
              <div
                className={`rounded-xl border p-4 mb-5 animate-fade-in ${profile.borderColor} ${profile.bgColor}`}
              >
                <p
                  className={`text-[14px] font-semibold mb-1 ${profile.textColor}`}
                >
                  {profile.icon} {profile.description}
                </p>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  {profile.tradeoff}
                </p>
              </div>
            )}

            {/* Pipeline visualization */}
            <div className="mb-4">
              <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                4-Stage Pipeline
              </p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {STAGES.map((stage, i) => {
                  const active = activeStage === i;
                  return (
                    <div
                      key={stage}
                      className={`rounded-lg p-3 border text-center transition-all duration-300 ${STAGE_COLORS[i]} ${active ? `${STAGE_BGS[i]} scale-[1.04]` : "border-[#1e2a35]"}`}
                    >
                      <div className="font-mono text-[9px] text-slate-600 mb-1 tracking-wider">
                        STAGE {i + 1}
                      </div>
                      <div className="font-heading text-[11px] tracking-wider mb-1">
                        {stage}
                      </div>
                      <div className="text-[9px] text-slate-500 leading-tight">
                        {STAGE_DESCS[i]}
                      </div>
                      {tasks.find((t) => t.stage === i) && (
                        <div className="mt-2 px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 animate-fade-in">
                          <span
                            className={`font-mono text-[9px] ${tasks.find((t) => t.stage === i)?.color}`}
                          >
                            {tasks.find((t) => t.stage === i)?.label}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Flow arrows */}
              <div className="flex justify-between px-[12.5%] mb-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className={`h-px w-8 transition-all duration-300 ${activeStage !== null && activeStage > i ? "bg-slate-400" : "bg-[#1e2a35]"}`}
                    />
                    <span
                      className={`text-[10px] transition-colors duration-300 ${activeStage !== null && activeStage > i ? "text-slate-400" : "text-[#1e2a35]"}`}
                    >
                      ▶
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <div className="flex flex-1 gap-2">
                <input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) =>
                    e.key === "Enter" && submitTask(customInput)
                  }
                  placeholder="TASK_NAME"
                  className="flex-1 bg-[#080c10] border border-[#1e2a35] rounded-lg px-3 py-2 font-mono text-[13px] text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all tracking-wider"
                />
                <button
                  onClick={() => submitTask(customInput)}
                  className="px-5 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-[12px] font-heading tracking-widest hover:bg-amber-500/20 transition-all duration-150 active:scale-95 whitespace-nowrap"
                >
                  ▶ RUN
                </button>
              </div>
              <div className="flex items-center gap-3">
                {profile && (
                  <button
                    onClick={() =>
                      submitTask(profile.label.toUpperCase().replace(/-/g, "_"))
                    }
                    className={`px-4 py-2 rounded-lg border text-[11px] font-heading tracking-wider transition-all duration-150 active:scale-95 ${profile.borderColor} ${profile.bgColor} ${profile.textColor}`}
                  >
                    Run {profile.label}
                  </button>
                )}
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-600 uppercase mb-0.5">
                    Cycles
                  </div>
                  <div className="font-heading text-xl text-amber-300 tabular-nums">
                    {cycleCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealWrapper>

        {/* Quizzes */}
        <RevealWrapper delay={200}>
          <div className="grid md:grid-cols-2 gap-4">
            <QuizQuestion
              accentColor="amber"
              question="What causes a pipeline stall?"
              options={[
                {
                  text: "Too many cores running simultaneously",
                  correct: false,
                  explanation:
                    "Multiple cores don't stall each other — that's the point of multi-core CPUs. Each core has its own pipeline.",
                },
                {
                  text: "A data dependency: stage needs output from a stage that hasn't finished",
                  correct: true,
                  explanation:
                    "Correct! If instruction B needs the result of instruction A, and A is still in EXECUTE, B must wait. CPUs use 'out-of-order execution' to run other independent instructions instead.",
                },
                {
                  text: "When the CPU gets too hot",
                  correct: false,
                  explanation:
                    "Thermal throttling slows the clock speed but doesn't cause pipeline stalls. Stalls are a logical problem, not a thermal one.",
                },
                {
                  text: "When RAM runs out of space",
                  correct: false,
                  explanation:
                    "Full RAM causes page faults and swapping, which is slow — but that's a memory management issue, not a pipeline stall.",
                },
              ]}
            />
            <QuizQuestion
              accentColor="amber"
              question="Why do CPUs have caches (L1/L2/L3)?"
              options={[
                {
                  text: "To store the operating system permanently",
                  correct: false,
                  explanation:
                    "The OS lives in RAM and storage, not in CPU cache. Cache is tiny (a few MB) and purely temporary.",
                },
                {
                  text: "Because RAM is hundreds of times slower than the CPU",
                  correct: true,
                  explanation:
                    "Correct! A modern CPU can execute an instruction in 0.3ns, but RAM access takes ~60ns — 200× slower. Caches (L1: 1ns, L2: 4ns, L3: 15ns) bridge this gap by holding frequently used data close to the cores.",
                },
                {
                  text: "To provide backup storage when the hard drive fails",
                  correct: false,
                  explanation:
                    "Caches are volatile and tiny — they can't act as storage. They're speed buffers between the CPU and RAM.",
                },
                {
                  text: "To enable multiple cores to share instructions",
                  correct: false,
                  explanation:
                    "While L3 cache is shared between cores, the primary purpose of cache is speed — reducing the latency of memory access.",
                },
              ]}
            />
          </div>
        </RevealWrapper>

        <RevealWrapper delay={280}>
          <div className="mt-16">
            <InfoCallout color="amber">
              Modern CPUs use{" "}
              <strong className="text-amber-200">speculative execution</strong>{" "}
              — they predict which branch of an if/else will run and execute it
              before knowing for sure. If wrong, they discard the work and
              retry. This gamble wins ~95% of the time and massively boosts
              throughput. It also introduced the{" "}
              <strong className="text-amber-200">Spectre/Meltdown</strong>{" "}
              security vulnerabilities discovered in 2018.
            </InfoCallout>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 3: MEMORY
// ─────────────────────────────────────────────────────────────────

type MemStrategy = "compress" | "clear" | null;

const TOTAL_CELLS = 56;

function MemorySection() {
  const { ref, visible } = useReveal(0.12);
  const [cells, setCells] = useState<("free" | "used" | "cached")[]>(
    Array(TOTAL_CELLS)
      .fill("free")
      .map((_, i) => {
        if (i < 18) return "used";
        if (i < 26) return "cached";
        return "free";
      }),
  );
  const [mode, setMode] = useState<"allocate" | "free">("allocate");
  const [strategy, setStrategy] = useState<MemStrategy>(null);
  const [strategyApplied, setStrategyApplied] = useState(false);
  const [animating, setAnimating] = useState(false);

  const usedCount = cells.filter((c) => c === "used").length;
  const cachedCount = cells.filter((c) => c === "cached").length;
  const freeCount = cells.filter((c) => c === "free").length;
  const usedPct = Math.round((usedCount / TOTAL_CELLS) * 100);
  const pressure =
    usedPct >= 80 ? "critical" : usedPct >= 55 ? "moderate" : "normal";

  const pressureColor =
    pressure === "critical"
      ? "text-red-400"
      : pressure === "moderate"
        ? "text-amber-400"
        : "text-green-400";
  const pressureBarColor =
    pressure === "critical"
      ? "bg-red-500"
      : pressure === "moderate"
        ? "bg-amber-400"
        : "bg-blue-400";

  const cellColor = {
    free: "bg-[#0f1824] border-[#1a2535] hover:border-green-500/30 hover:bg-green-500/[0.04]",
    used: "bg-blue-500/20 border-blue-500/45",
    cached: "bg-amber-500/15 border-amber-500/35",
  };

  const handleCell = (i: number) => {
    setCells((prev) => {
      const next = [...prev];
      if (mode === "allocate" && next[i] === "free") next[i] = "used";
      if (mode === "free" && next[i] === "used") next[i] = "cached";
      if (mode === "free" && next[i] === "cached") next[i] = "free";
      return next;
    });
  };

  const applyStrategy = (s: MemStrategy) => {
    if (animating || !s) return;
    setStrategy(s);
    setAnimating(true);

    if (s === "clear") {
      // Clear cached cells immediately, free used over time
      setCells((prev) => prev.map((c) => (c === "cached" ? "free" : c)));
      let delay = 0;
      setCells((prev) => {
        const next = [...prev];
        next.forEach((c, i) => {
          if (c === "used") {
            setTimeout(() => {
              setCells((p) => {
                const n = [...p];
                n[i] = "free";
                return n;
              });
            }, delay);
            delay += 40;
          }
        });
        return prev;
      });
      setTimeout(() => {
        setAnimating(false);
        setStrategyApplied(true);
      }, delay + 400);
    } else {
      // Compress: convert used→cached to simulate compression
      setCells((prev) => {
        const usedIdxs = prev
          .map((c, i) => (c === "used" ? i : -1))
          .filter((i) => i >= 0);
        const toCompress = usedIdxs.slice(0, Math.floor(usedIdxs.length * 0.4));
        return prev.map((c, i) => (toCompress.includes(i) ? "cached" : c));
      });
      setTimeout(() => {
        setAnimating(false);
        setStrategyApplied(true);
      }, 600);
    }
  };

  const reset = () => {
    setStrategy(null);
    setStrategyApplied(false);
    setCells(
      Array(TOTAL_CELLS)
        .fill("free")
        .map((_, i) => {
          if (i < 18) return "used";
          if (i < 26) return "cached";
          return "free";
        }),
    );
  };

  const randomAlloc = () => {
    setCells((prev) => {
      const next = [...prev];
      const freeIdxs = next
        .map((c, i) => (c === "free" ? i : -1))
        .filter((i) => i >= 0);
      if (freeIdxs.length === 0) return prev;
      const pick = freeIdxs[Math.floor(Math.random() * freeIdxs.length)];
      next[pick] = "used";
      return next;
    });
  };

  return (
    <section
      id="s-memory"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative"
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full bg-blue-500/[0.03] blur-[130px]" />

        {/* Memory Stack Story Visualization */}
        <svg
          className="absolute top-1/4 left-8 w-40 h-96 opacity-[0.12]"
          viewBox="0 0 150 600"
        >
          <defs>
            <linearGradient
              id="memory-stack-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(217 91% 60%)" />
              <stop offset="100%" stopColor="hsl(38 92% 50%)" />
            </linearGradient>
          </defs>
          {/* L1 Cache */}
          <rect
            x="20"
            y="20"
            width="110"
            height="60"
            fill="none"
            stroke="url(#memory-stack-gradient)"
            strokeWidth="2"
          />
          <text
            x="75"
            y="55"
            textAnchor="middle"
            fontSize="11"
            fill="url(#memory-stack-gradient)"
          >
            L1 Cache
          </text>
          <text
            x="75"
            y="72"
            textAnchor="middle"
            fontSize="8"
            fill="url(#memory-stack-gradient)"
            opacity="0.6"
          >
            ~32KB
          </text>
          {/* L2 Cache */}
          <rect
            x="10"
            y="110"
            width="130"
            height="70"
            fill="none"
            stroke="url(#memory-stack-gradient)"
            strokeWidth="2"
            opacity="0.8"
          />
          <text
            x="75"
            y="152"
            textAnchor="middle"
            fontSize="11"
            fill="url(#memory-stack-gradient)"
            opacity="0.8"
          >
            L2 Cache
          </text>
          <text
            x="75"
            y="170"
            textAnchor="middle"
            fontSize="8"
            fill="url(#memory-stack-gradient)"
            opacity="0.6"
          >
            ~256KB
          </text>
          {/* L3 Cache */}
          <rect
            x="0"
            y="210"
            width="150"
            height="80"
            fill="none"
            stroke="url(#memory-stack-gradient)"
            strokeWidth="2"
            opacity="0.6"
          />
          <text
            x="75"
            y="257"
            textAnchor="middle"
            fontSize="11"
            fill="url(#memory-stack-gradient)"
            opacity="0.6"
          >
            L3 Cache
          </text>
          <text
            x="75"
            y="275"
            textAnchor="middle"
            fontSize="8"
            fill="url(#memory-stack-gradient)"
            opacity="0.5"
          >
            ~8-20MB
          </text>
          {/* RAM */}
          <rect
            x="-10"
            y="320"
            width="170"
            height="100"
            fill="none"
            stroke="url(#memory-stack-gradient)"
            strokeWidth="2"
            opacity="0.4"
          />
          <text
            x="75"
            y="375"
            textAnchor="middle"
            fontSize="12"
            fill="url(#memory-stack-gradient)"
            opacity="0.4"
          >
            RAM
          </text>
          <text
            x="75"
            y="393"
            textAnchor="middle"
            fontSize="8"
            fill="url(#memory-stack-gradient)"
            opacity="0.3"
          >
            ~8-32GB
          </text>
          {/* Storage */}
          <rect
            x="-20"
            y="450"
            width="190"
            height="120"
            fill="none"
            stroke="url(#memory-stack-gradient)"
            strokeWidth="2"
            opacity="0.2"
          />
          <text
            x="75"
            y="515"
            textAnchor="middle"
            fontSize="12"
            fill="url(#memory-stack-gradient)"
            opacity="0.2"
          >
            Storage
          </text>
          <text
            x="75"
            y="535"
            textAnchor="middle"
            fontSize="8"
            fill="url(#memory-stack-gradient)"
            opacity="0.15"
          >
            ~256GB-2TB
          </text>
        </svg>

        {/* Data Flow Story Visualization */}
        <svg
          className="absolute bottom-1/3 right-8 w-40 h-96 opacity-[0.12]"
          viewBox="0 0 150 600"
        >
          <defs>
            <linearGradient
              id="dataflow-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(142 71% 45%)" />
              <stop offset="100%" stopColor="hsl(217 91% 60%)" />
            </linearGradient>
          </defs>
          {/* CPU requesting */}
          <circle
            cx="75"
            cy="40"
            r="15"
            fill="none"
            stroke="url(#dataflow-gradient)"
            strokeWidth="2"
          />
          <text
            x="75"
            y="46"
            textAnchor="middle"
            fontSize="9"
            fill="url(#dataflow-gradient)"
          >
            CPU
          </text>
          {/* Request arrow */}
          <path
            d="M 75 55 L 75 100"
            fill="none"
            stroke="url(#dataflow-gradient)"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
          {/* L1 check */}
          <rect
            x="40"
            y="110"
            width="70"
            height="50"
            fill="none"
            stroke="url(#dataflow-gradient)"
            strokeWidth="2"
          />
          <text
            x="75"
            y="135"
            textAnchor="middle"
            fontSize="10"
            fill="url(#dataflow-gradient)"
          >
            L1
          </text>
          <text
            x="75"
            y="151"
            textAnchor="middle"
            fontSize="7"
            fill="url(#dataflow-gradient)"
            opacity="0.7"
          >
            HIT?
          </text>
          {/* L2 check */}
          <rect
            x="30"
            y="200"
            width="90"
            height="60"
            fill="none"
            stroke="url(#dataflow-gradient)"
            strokeWidth="2"
            opacity="0.7"
          />
          <text
            x="75"
            y="230"
            textAnchor="middle"
            fontSize="10"
            fill="url(#dataflow-gradient)"
            opacity="0.7"
          >
            L2/L3
          </text>
          {/* RAM fetch */}
          <rect
            x="20"
            y="310"
            width="110"
            height="70"
            fill="none"
            stroke="url(#dataflow-gradient)"
            strokeWidth="2"
            opacity="0.5"
          />
          <text
            x="75"
            y="345"
            textAnchor="middle"
            fontSize="10"
            fill="url(#dataflow-gradient)"
            opacity="0.5"
          >
            RAM
          </text>
          {/* Return arrow */}
          <path
            d="M 145 460 L 145 520 Q 145 540 125 540 L 25 540 Q 5 540 5 520"
            fill="none"
            stroke="url(#dataflow-gradient)"
            strokeWidth="2"
            opacity="0.4"
          />
          <text
            x="75"
            y="560"
            textAnchor="middle"
            fontSize="8"
            fill="url(#dataflow-gradient)"
            opacity="0.3"
          >
            CPU retrieves data
          </text>
        </svg>
      </div>

      <div className="relative max-w-5xl w-full">
        <RevealWrapper>
          <StepBadge step={3} total={5} tag="Memory System" />
          <h2 className="font-heading text-4xl md:text-5xl text-white tracking-tight mb-4 leading-tight">
            Where Ideas
            <br />
            <span
              className="text-blue-300"
              style={{ textShadow: "0 0 40px hsl(217 91% 60% / 0.3)" }}
            >
              Take Shape
            </span>
          </h2>
          <p className="text-slate-300 text-[15px] max-w-2xl mb-2 leading-relaxed">
            RAM is your computer's working memory — every open app, every loaded
            file lives here, racing against the limits of available space.
          </p>
          <p className="text-slate-500 text-[14px] italic mb-10">
            "RAM is not storage — it's consciousness. When power dies, it
            forgets everything."
          </p>
        </RevealWrapper>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left */}
          <div>
            {/* Memory pressure stats */}
            <RevealWrapper delay={80}>
              <div className={`${CARD_ELEVATED} p-5 mb-5`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] font-heading tracking-widest text-slate-400 uppercase">
                    Memory Pressure
                  </span>
                  <span
                    className={`text-[12px] font-heading tracking-widest uppercase ${pressureColor}`}
                  >
                    {pressure}
                  </span>
                </div>
                <div className="h-2 bg-[#0f1824] rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${pressureBarColor}`}
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      label: "Used",
                      v: usedCount,
                      pct: Math.round((usedCount / TOTAL_CELLS) * 100),
                      color: "text-blue-300",
                      bg: "bg-blue-500/10 border-blue-500/20",
                    },
                    {
                      label: "Cached",
                      v: cachedCount,
                      pct: Math.round((cachedCount / TOTAL_CELLS) * 100),
                      color: "text-amber-300",
                      bg: "bg-amber-500/10 border-amber-500/20",
                    },
                    {
                      label: "Free",
                      v: freeCount,
                      pct: Math.round((freeCount / TOTAL_CELLS) * 100),
                      color: "text-green-300",
                      bg: "bg-green-500/10 border-green-500/20",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`rounded-lg border p-2.5 text-center ${s.bg}`}
                    >
                      <div className="text-[9px] font-mono text-slate-500 uppercase mb-1">
                        {s.label}
                      </div>
                      <div
                        className={`font-heading text-[18px] tabular-nums ${s.color}`}
                      >
                        {s.pct}%
                      </div>
                      <div className="text-[9px] font-mono text-slate-600">
                        {s.v} cells
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealWrapper>

            {/* ── CHOICE: Memory Strategy ── */}
            <RevealWrapper delay={160}>
              <div className={`${CARD_ELEVATED} p-5 mb-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-soft" />
                  <span className="text-[11px] font-heading tracking-widest text-slate-400 uppercase">
                    Memory Crisis Decision
                  </span>
                </div>
                <p className="text-white text-[15px] font-medium mb-1">
                  Memory is running low. What's your strategy?
                </p>
                <p className="text-slate-400 text-[13px] mb-4 leading-relaxed">
                  Operating systems face this constantly. Each choice has real
                  performance tradeoffs.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => applyStrategy("clear")}
                    disabled={animating || strategyApplied}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all duration-200 active:scale-[0.97] ${
                      strategy === "clear"
                        ? "border-red-500/50 bg-red-500/[0.07]"
                        : "border-[#1e2a35] hover:border-red-500/30 hover:bg-red-500/[0.04]"
                    }`}
                  >
                    <div className="text-lg mb-1.5">🗑️</div>
                    <div className="font-heading text-[12px] tracking-wider text-red-300 mb-1">
                      CLEAR CACHE
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Free all cached and used pages immediately. Fast — but
                      data is lost.
                    </p>
                  </button>
                  <button
                    onClick={() => applyStrategy("compress")}
                    disabled={animating || strategyApplied}
                    className={`text-left p-3.5 rounded-xl border-2 transition-all duration-200 active:scale-[0.97] ${
                      strategy === "compress"
                        ? "border-blue-500/50 bg-blue-500/[0.07]"
                        : "border-[#1e2a35] hover:border-blue-500/30 hover:bg-blue-500/[0.04]"
                    }`}
                  >
                    <div className="text-lg mb-1.5">📦</div>
                    <div className="font-heading text-[12px] tracking-wider text-blue-300 mb-1">
                      COMPRESS PAGES
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Compress used pages to free space. Slower access, but data
                      preserved.
                    </p>
                  </button>
                </div>

                {strategyApplied && (
                  <div
                    className={`rounded-lg border p-3 animate-fade-in mb-3 ${strategy === "clear" ? "border-red-500/25 bg-red-500/[0.05]" : "border-blue-500/25 bg-blue-500/[0.05]"}`}
                  >
                    <p
                      className={`text-[13px] font-semibold mb-1 ${strategy === "clear" ? "text-red-300" : "text-blue-300"}`}
                    >
                      {strategy === "clear"
                        ? "🗑️ Cache cleared — memory reclaimed."
                        : "📦 Pages compressed — data preserved."}
                    </p>
                    <p className="text-[12px] text-slate-400 leading-relaxed">
                      {strategy === "clear"
                        ? "Linux uses this as a last resort. Applications need to reload data from disk — slower but prevents OOM kills. Windows prefers this approach with its 'Superfetch' clearing."
                        : "macOS and Windows use memory compression (zswap on Linux). Compressed pages take ~50% space. Decompression adds latency but avoids disk swapping, which is 1000× slower."}
                    </p>
                    <button
                      onClick={reset}
                      className="mt-2 text-[11px] font-mono text-slate-500 hover:text-slate-300 tracking-wider transition-colors"
                    >
                      ↺ RESET
                    </button>
                  </div>
                )}

                {/* Manual controls */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-[#1a2535]">
                  {[
                    {
                      label: "+ ALLOCATE",
                      action: () => setMode("allocate"),
                      active: mode === "allocate",
                      color:
                        "border-blue-500/30 text-blue-300 bg-blue-500/[0.06]",
                    },
                    {
                      label: "− FREE",
                      action: () => setMode("free"),
                      active: mode === "free",
                      color:
                        "border-amber-500/30 text-amber-300 bg-amber-500/[0.06]",
                    },
                    {
                      label: "RANDOM ALLOC",
                      action: randomAlloc,
                      active: false,
                      color:
                        "border-[#1e2a35] text-slate-400 hover:border-slate-500",
                    },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.action}
                      className={`px-3 py-1.5 rounded-lg border text-[11px] font-heading tracking-wider transition-all duration-150 ${btn.active ? btn.color : "border-[#1e2a35] text-slate-500 hover:text-slate-300 hover:border-slate-600"}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-mono text-slate-600 mt-2">
                  {mode === "allocate"
                    ? "Click empty cells to allocate memory"
                    : "Click used cells to free them → cached → free"}
                </p>
              </div>
            </RevealWrapper>
          </div>

          {/* Right — grid */}
          <RevealWrapper delay={140} className="w-full">
            <div
              className={`${CARD} p-5 transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono text-[11px] text-slate-500 tracking-wider uppercase block">
                    RAM — {TOTAL_CELLS} Pages
                  </span>
                  <span
                    className={`font-mono text-[10px] ${pressureColor} tracking-wider`}
                  >
                    {pressure === "critical"
                      ? "⚠ CRITICAL — system may page to disk"
                      : pressure === "moderate"
                        ? "▲ MODERATE — watch for swapping"
                        : "● NORMAL"}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-600 uppercase mb-0.5">
                    Utilization
                  </div>
                  <div
                    className={`font-heading text-2xl tabular-nums ${pressureColor}`}
                  >
                    {usedPct}%
                  </div>
                </div>
              </div>

              <div
                className="grid gap-1.5"
                style={{ gridTemplateColumns: "repeat(8, 1fr)" }}
              >
                {cells.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleCell(i)}
                    className={`aspect-square rounded border transition-all duration-200 ${cellColor[c]} ${c === "free" ? "hover:scale-110" : "hover:brightness-125"}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-5 mt-4 pt-3 border-t border-[#1a2535]">
                {[
                  { c: "bg-blue-500/30 border-blue-500/40", label: "Used" },
                  { c: "bg-amber-500/20 border-amber-500/30", label: "Cached" },
                  { c: "bg-[#0f1824] border-[#1a2535]", label: "Free" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded border ${l.c}`} />
                    <span className="text-[11px] font-mono text-slate-500">
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Memory hierarchy card */}
            <div className={`${CARD} p-4 mt-4`}>
              <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                Memory Hierarchy — Speed vs Cost
              </p>
              <div className="space-y-2">
                {[
                  {
                    label: "L1 Cache",
                    speed: "0.3 ns",
                    size: "64 KB",
                    pct: 98,
                    color: "bg-amber-400",
                  },
                  {
                    label: "L2 Cache",
                    speed: "4 ns",
                    size: "512 KB",
                    pct: 82,
                    color: "bg-amber-400/70",
                  },
                  {
                    label: "L3 Cache",
                    speed: "15 ns",
                    size: "8 MB",
                    pct: 64,
                    color: "bg-blue-400/80",
                  },
                  {
                    label: "RAM",
                    speed: "60 ns",
                    size: "16 GB",
                    pct: 40,
                    color: "bg-blue-400/50",
                  },
                  {
                    label: "SSD",
                    speed: "100 µs",
                    size: "1 TB",
                    pct: 20,
                    color: "bg-slate-500/50",
                  },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-500 w-16 shrink-0">
                      {m.label}
                    </span>
                    <div className="flex-1 h-1.5 bg-[#0f1824] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${m.color} transition-all duration-700`}
                        style={{ width: visible ? `${m.pct}%` : "0%" }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-slate-600 w-12 text-right">
                      {m.speed}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </RevealWrapper>
        </div>

        <RevealWrapper delay={280}>
          <div className="mt-6">
            <QuizQuestion
              accentColor="blue"
              question="What happens when your computer 'runs out of RAM'?"
              options={[
                {
                  text: "The computer immediately crashes with a fatal error",
                  correct: false,
                  explanation:
                    "Crashing is rare. Modern OSes use virtual memory to avoid this. An OOM (Out Of Memory) killer may terminate processes, but the system usually stays up.",
                },
                {
                  text: "The OS starts using disk space as slower virtual memory (swapping)",
                  correct: true,
                  explanation:
                    "Correct! The OS moves 'cold' memory pages to a swap partition on disk. SSD swap adds ~100µs latency vs 60ns RAM — roughly 1,600× slower. This is why a 'low RAM' computer feels sluggish, not just crashed.",
                },
                {
                  text: "New RAM is automatically ordered from the cloud",
                  correct: false,
                  explanation:
                    "There's no cloud RAM provisioning for personal computers. Cloud VMs can be resized, but that's a different architecture entirely.",
                },
                {
                  text: "All programs stop until you restart",
                  correct: false,
                  explanation:
                    "Programs may slow dramatically due to swap thrashing, but they don't all stop. The OS continues scheduling and the system stays responsive — just very slowly.",
                },
              ]}
            />
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 4: NETWORK
// ─────────────────────────────────────────────────────────────────

type RouteChoice = "cdn" | "direct" | null;
type ProtocolChoice = "http" | "https" | null;

function NetworkStorySection() {
  const { ref } = useReveal(0.12);
  const [pinging, setPinging] = useState(false);
  const [pingCount, setPingCount] = useState(0);
  const [latency, setLatency] = useState<number | null>(null);
  const [packetPos, setPacketPos] = useState<
    "idle" | "hop1" | "hop2" | "arrived"
  >("idle");
  const [protocol, setProtocol] = useState<ProtocolChoice>(null);
  const [routeChoice, setRouteChoice] = useState<RouteChoice>(null);
  const [routeOutcome, setRouteOutcome] = useState<{
    latency: number;
    hops: number;
  } | null>(null);

  const HOPS = [
    { label: "YOUR DEVICE", icon: "💻", desc: "Client" },
    { label: "ROUTER", icon: "📡", desc: "ISP Gateway" },
    { label: "SERVER", icon: "🖥️", desc: "Destination" },
  ];

  const sendPing = () => {
    if (pinging) return;
    setPinging(true);
    setLatency(null);
    setPacketPos("idle");
    const basems = protocol === "https" ? 10 : 0; // TLS adds overhead
    const ms = 18 + basems + Math.floor(Math.random() * 50);
    setTimeout(() => setPacketPos("hop1"), 200);
    setTimeout(() => setPacketPos("hop2"), 900);
    setTimeout(() => setPacketPos("arrived"), 1600);
    setTimeout(() => {
      setLatency(ms);
      setPingCount((n) => n + 1);
      setPinging(false);
      setPacketPos("idle");
    }, 2400);
  };

  const applyRoute = (r: RouteChoice) => {
    if (!r) return;
    setRouteChoice(r);
    const outcome =
      r === "cdn"
        ? { latency: 8 + Math.floor(Math.random() * 12), hops: 2 }
        : { latency: 60 + Math.floor(Math.random() * 80), hops: 14 };
    setRouteOutcome(outcome);
  };

  return (
    <section
      id="s-network"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative"
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-green-500/[0.03] blur-[130px]" />
      </div>

      <div className="relative max-w-5xl w-full">
        <RevealWrapper>
          <StepBadge step={4} total={5} tag="Network Layer" />
          <h2 className="font-heading text-4xl md:text-5xl text-white tracking-tight mb-4 leading-tight">
            Information
            <br />
            <span
              className="text-green-300"
              style={{ textShadow: "0 0 40px hsl(142 71% 45% / 0.3)" }}
            >
              Never Travels Alone
            </span>
          </h2>
          <p className="text-slate-300 text-[15px] max-w-2xl mb-2 leading-relaxed">
            Every byte you send is broken into packets, routed through dozens of
            nodes across continents, then reassembled in the right order — all
            in under 100ms.
          </p>
          <p className="text-slate-500 text-[14px] italic mb-10">
            "The internet doesn't have a center. It routes around damage — by
            design."
          </p>
        </RevealWrapper>

        {/* ── CHOICE 1: Protocol ── */}
        <RevealWrapper delay={100}>
          <div className={`${CARD_ELEVATED} p-6 mb-5`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-soft" />
              <span className="text-[11px] font-heading tracking-widest text-slate-400 uppercase">
                Decision 1 — Protocol
              </span>
            </div>
            <p className="text-white text-[15px] font-medium mb-1">
              Should this connection be encrypted?
            </p>
            <p className="text-slate-400 text-[13px] mb-5">
              HTTP sends data as plain text — anyone on the network can read it.
              HTTPS wraps it in TLS encryption.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setProtocol("http")}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${protocol === "http" ? "border-red-500/50 bg-red-500/[0.07]" : "border-[#1e2a35] hover:border-red-500/30"}`}
              >
                <div className="font-mono text-base mb-2 text-red-300">
                  HTTP://
                </div>
                <p className="text-[12px] text-slate-400 leading-snug mb-2">
                  Plain text. No encryption. Fast setup. Used internally or for
                  public static assets.
                </p>
                <div className="flex gap-2">
                  <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                    <span className="text-[9px] font-mono text-green-400">
                      FASTER SETUP
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
                    <span className="text-[9px] font-mono text-red-400">
                      VULNERABLE
                    </span>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setProtocol("https")}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${protocol === "https" ? "border-green-500/50 bg-green-500/[0.07]" : "border-[#1e2a35] hover:border-green-500/30"}`}
              >
                <div className="font-mono text-base mb-2 text-green-300">
                  HTTPS:// 🔒
                </div>
                <p className="text-[12px] text-slate-400 leading-snug mb-2">
                  TLS encrypted. Adds ~1 round-trip for handshake. Required for
                  any sensitive data.
                </p>
                <div className="flex gap-2">
                  <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[9px] font-mono text-amber-400">
                      +TLS HANDSHAKE
                    </span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                    <span className="text-[9px] font-mono text-green-400">
                      ENCRYPTED
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Packet hop visualizer */}
            <div className="rounded-xl bg-[#080c10] border border-[#1a2535] p-4">
              <div className="grid grid-cols-3 gap-3 mb-4 relative">
                {HOPS.map((hop, i) => {
                  const isActive =
                    (i === 0 && packetPos === "hop1") ||
                    (i === 1 && packetPos === "hop2") ||
                    (i === 2 && packetPos === "arrived");
                  return (
                    <div
                      key={hop.label}
                      className={`rounded-xl border p-3 text-center transition-all duration-400 ${isActive ? "border-green-500/40 bg-green-500/[0.06] scale-[1.02]" : "border-[#1a2535]"}`}
                    >
                      <div className="text-xl mb-1">{hop.icon}</div>
                      <div
                        className={`font-heading text-[10px] tracking-wider mb-0.5 ${isActive ? "text-green-300" : "text-slate-400"}`}
                      >
                        {hop.label}
                      </div>
                      <div className="font-mono text-[9px] text-slate-600">
                        {hop.desc}
                      </div>
                      {protocol && isActive && (
                        <div
                          className={`mt-1.5 text-[9px] font-mono ${protocol === "https" ? "text-green-400" : "text-red-400"}`}
                        >
                          {protocol === "https" ? "🔒 TLS" : "⚠ PLAIN"}
                        </div>
                      )}
                      {isActive && (
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-green-400 mx-auto animate-pulse-soft" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={sendPing}
                    disabled={pinging}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-heading text-[11px] tracking-wider transition-all duration-150 active:scale-95 ${pinging ? "border-green-500/25 bg-green-500/[0.04] text-green-400/50 cursor-wait" : "border-green-500/35 bg-green-500/[0.07] text-green-300 hover:bg-green-500/15"}`}
                  >
                    {pinging ? (
                      <>
                        <span className="animate-pulse-soft">●</span> SENDING...
                      </>
                    ) : (
                      <>▶ SEND PACKET</>
                    )}
                  </button>
                  <span className="font-mono text-[10px] text-slate-600">
                    × {pingCount} sent
                  </span>
                </div>
                {latency !== null && (
                  <div className="text-right animate-fade-in">
                    <div className="text-[10px] font-mono text-slate-600 uppercase mb-0.5">
                      Round-trip
                    </div>
                    <div
                      className={`font-heading text-lg tabular-nums ${latency < 40 ? "text-green-300" : "text-amber-300"}`}
                    >
                      {latency}ms
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </RevealWrapper>

        {/* ── CHOICE 2: Routing decision ── */}
        <RevealWrapper delay={180}>
          <div className={`${CARD_ELEVATED} p-6 mb-5`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-soft" />
              <span className="text-[11px] font-heading tracking-widest text-slate-400 uppercase">
                Decision 2 — Routing Strategy
              </span>
            </div>
            <p className="text-white text-[15px] font-medium mb-1">
              Where should your content be served from?
            </p>
            <p className="text-slate-400 text-[13px] mb-5">
              CDN vs origin server is one of the most impactful infrastructure
              decisions in web performance.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => applyRoute("cdn")}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${routeChoice === "cdn" ? "border-green-500/50 bg-green-500/[0.07]" : "border-[#1e2a35] hover:border-green-500/30"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🌐</span>
                  <span className="font-heading text-[12px] tracking-wider text-green-300">
                    VIA CDN EDGE
                  </span>
                </div>
                <p className="text-[12px] text-slate-400 leading-snug">
                  Serve from the nearest edge node (maybe 20km away). ~2 hops.
                </p>
              </button>
              <button
                onClick={() => applyRoute("direct")}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 active:scale-[0.98] ${routeChoice === "direct" ? "border-blue-500/50 bg-blue-500/[0.07]" : "border-[#1e2a35] hover:border-blue-500/30"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🏢</span>
                  <span className="font-heading text-[12px] tracking-wider text-blue-300">
                    DIRECT TO ORIGIN
                  </span>
                </div>
                <p className="text-[12px] text-slate-400 leading-snug">
                  Route straight to the origin server (maybe across an ocean).
                  ~14 hops.
                </p>
              </button>
            </div>

            {routeOutcome && (
              <div
                className={`rounded-lg border p-4 animate-fade-in ${routeChoice === "cdn" ? "border-green-500/25 bg-green-500/[0.05]" : "border-blue-500/25 bg-blue-500/[0.05]"}`}
              >
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-[10px] font-mono text-slate-600 uppercase mb-1">
                      Measured Latency
                    </div>
                    <div
                      className={`font-heading text-2xl tabular-nums ${routeChoice === "cdn" ? "text-green-300" : "text-blue-300"}`}
                    >
                      {routeOutcome.latency}ms
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-600 uppercase mb-1">
                      Network Hops
                    </div>
                    <div
                      className={`font-heading text-2xl tabular-nums ${routeChoice === "cdn" ? "text-green-300" : "text-blue-300"}`}
                    >
                      {routeOutcome.hops}
                    </div>
                  </div>
                </div>
                <p
                  className={`text-[13px] font-semibold mb-1 ${routeChoice === "cdn" ? "text-green-300" : "text-blue-300"}`}
                >
                  {routeChoice === "cdn"
                    ? "🌐 CDN edge win — content was cached nearby."
                    : "🏢 Direct path — every hop adds latency."}
                </p>
                <p className="text-[12px] text-slate-400 leading-relaxed">
                  {routeChoice === "cdn"
                    ? "CDNs like Cloudflare and Akamai have 200+ edge locations globally. Static assets are cached there. A user in Mumbai gets content from Mumbai, not San Francisco. This is why major sites load fast worldwide."
                    : "Without a CDN, packets physically travel across undersea cables. The speed of light sets a hard floor — a packet from New York to Tokyo takes at minimum ~60ms just from physics. Add routing overhead and it's 120-180ms."}
                </p>
                <button
                  onClick={() => {
                    setRouteChoice(null);
                    setRouteOutcome(null);
                  }}
                  className="mt-2 text-[11px] font-mono text-slate-500 hover:text-slate-300 tracking-wider transition-colors"
                >
                  ↺ TRY OTHER
                </button>
              </div>
            )}
          </div>
        </RevealWrapper>

        {/* Quizzes */}
        <RevealWrapper delay={240}>
          <div className="grid md:grid-cols-2 gap-4">
            <QuizQuestion
              accentColor="green"
              question="Why are large files split into packets instead of sent as one chunk?"
              options={[
                {
                  text: "Because routers physically can't hold large data",
                  correct: false,
                  explanation:
                    "Routers have buffers that can technically hold large packets, but there's a practical MTU (Maximum Transmission Unit) limit of ~1500 bytes per Ethernet frame for good reasons.",
                },
                {
                  text: "To allow parallel routing, error recovery, and fair bandwidth sharing",
                  correct: true,
                  explanation:
                    "Correct! Packets take different paths simultaneously (parallel routing), only failed packets are resent (not the whole file), and every connection gets fair turns using the network — that's TCP's congestion control.",
                },
                {
                  text: "To make encryption simpler to implement",
                  correct: false,
                  explanation:
                    "TLS works at the TCP stream level and is independent of packet size. Packetization serves performance and reliability goals, not encryption.",
                },
                {
                  text: "It's a legacy system that no longer makes sense today",
                  correct: false,
                  explanation:
                    "Packetization is more relevant than ever. HTTP/3 over QUIC still uses UDP packets. The packet model is fundamental to how the internet scales.",
                },
              ]}
            />
            <QuizQuestion
              accentColor="green"
              question="What does TCP guarantee that UDP does not?"
              options={[
                {
                  text: "That data arrives faster than UDP",
                  correct: false,
                  explanation:
                    "TCP is actually slower due to its overhead — handshakes, acknowledgments, and retransmission. UDP is faster precisely because it skips these guarantees.",
                },
                {
                  text: "That packets arrive in order, complete, and without errors",
                  correct: true,
                  explanation:
                    "Correct! TCP's three-way handshake, sequence numbers, ACK messages, and retransmission ensure your data arrives completely and in order. UDP just fires-and-forgets — perfect for live video where a dropped frame is better than buffering.",
                },
                {
                  text: "That the connection is always encrypted",
                  correct: false,
                  explanation:
                    "Neither TCP nor UDP provides encryption natively. That's TLS's job, which sits on top of TCP. DTLS provides encryption over UDP.",
                },
                {
                  text: "That the server has enough bandwidth to handle the request",
                  correct: false,
                  explanation:
                    "TCP does include flow control and congestion control, but it doesn't guarantee the server has capacity — just that the data transfer itself is reliable.",
                },
              ]}
            />
          </div>
        </RevealWrapper>

        <RevealWrapper delay={300}>
          <InfoCallout color="green">
            The internet was designed to survive nuclear war. ARPANET's
            packet-switching model means data automatically reroutes around
            damaged nodes — there's no central point of failure. This is why{" "}
            <strong className="text-green-200">
              BGP (Border Gateway Protocol)
            </strong>
            , the internet's routing language, constantly recalculates paths as
            links go up and down across 100,000+ autonomous networks.
          </InfoCallout>
        </RevealWrapper>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 5: SYNTHESIS + CTA
// ─────────────────────────────────────────────────────────────────

function SynthesisSection() {
  const navigate = useNavigate();
  const { ref, visible } = useReveal(0.1);
  const [checklist, setChecklist] = useState([false, false, false, false]);

  const CHECKLIST = [
    { text: "Understand the CPU pipeline", color: "text-amber-300" },
    { text: "Know how RAM manages pressure", color: "text-blue-300" },
    { text: "Understand packet routing", color: "text-green-300" },
    { text: "Ready to defend the system", color: "text-red-300" },
  ];

  const allChecked = checklist.every(Boolean);
  const toggle = (i: number) =>
    setChecklist((p) => p.map((v, idx) => (idx === i ? !v : v)));

  const COMPONENTS = [
    {
      label: "CPU",
      color: "text-amber-300",
      border: "border-amber-500/30",
      bg: "bg-amber-500/[0.07]",
      glyph: "⚙",
    },
    {
      label: "RAM",
      color: "text-blue-300",
      border: "border-blue-500/30",
      bg: "bg-blue-500/[0.07]",
      glyph: "▣",
    },
    {
      label: "NETWORK",
      color: "text-green-300",
      border: "border-green-500/30",
      bg: "bg-green-500/[0.07]",
      glyph: "⬡",
    },
    {
      label: "STORAGE",
      color: "text-slate-400",
      border: "border-[#1e2a35]",
      bg: "",
      glyph: "▤",
    },
    {
      label: "I/O",
      color: "text-slate-400",
      border: "border-[#1e2a35]",
      bg: "",
      glyph: "⇌",
    },
  ];

  return (
    <section
      id="s-synthesis"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[180px] transition-all duration-1000"
          style={{
            background: visible
              ? allChecked
                ? "hsl(142 71% 45% / 0.07)"
                : "hsl(142 71% 45% / 0.04)"
              : "transparent",
          }}
        />
      </div>

      <div className="relative max-w-4xl w-full">
        <RevealWrapper>
          <div className="text-center mb-12">
            <StepBadge step={5} total={5} tag="System Synthesis" />
            <h2 className="font-heading text-4xl md:text-6xl text-white tracking-tight mb-5 leading-tight">
              The Machine
              <br />
              <span
                className="text-green-300"
                style={{ textShadow: "0 0 50px hsl(142 71% 45% / 0.35)" }}
              >
                Awakens
              </span>
            </h2>
            <p className="text-slate-300 text-[15px] max-w-lg mx-auto mb-3 leading-relaxed">
              You've journeyed through boot sequences, pipeline stages, memory
              pages, and network hops. Every layer you explored works in
              concert, billions of times per second.
            </p>
            <p className="text-slate-500 text-[14px] italic">
              "You've explored the anatomy. Ready to defend it?"
            </p>
          </div>
        </RevealWrapper>

        {/* System diagram */}
        <RevealWrapper delay={120}>
          <div className={`${CARD} p-6 mb-8`}>
            <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest text-center mb-5">
              System Architecture
            </p>
            <div className="flex justify-center mb-5">
              <div
                className={`w-20 h-20 rounded-full border-2 border-green-500/40 bg-green-500/[0.08] flex items-center justify-center`}
                style={{
                  boxShadow: visible
                    ? "0 0 40px hsl(142 71% 45% / 0.15)"
                    : "none",
                }}
              >
                <div className="text-center">
                  <div className="font-heading text-[9px] text-green-300 tracking-widest">
                    SYS
                  </div>
                  <div className="font-heading text-[9px] text-green-500/60">
                    BUS
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {COMPONENTS.map((c, i) => (
                <div
                  key={c.label}
                  className={`rounded-xl border p-3 text-center transition-all duration-500 ${c.border} ${c.bg}`}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible
                      ? "translateY(0) scale(1)"
                      : "translateY(16px) scale(0.9)",
                    transitionDelay: `${i * 100 + 300}ms`,
                  }}
                >
                  <div className={`text-xl mb-1 ${c.color}`}>{c.glyph}</div>
                  <div
                    className={`font-heading text-[9px] tracking-wider ${c.color}`}
                  >
                    {c.label}
                  </div>
                </div>
              ))}
            </div>
            <svg
              className="w-full h-8 mt-2 opacity-15"
              viewBox="0 0 500 30"
              style={{
                opacity: visible ? 0.15 : 0,
                transition: "opacity 1s ease 1s",
              }}
            >
              {[50, 150, 250, 350, 450].map((x, i) => (
                <line
                  key={i}
                  x1={x}
                  y1="28"
                  x2="250"
                  y2="2"
                  stroke="hsl(142 71% 45%)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="15"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </line>
              ))}
            </svg>
          </div>
        </RevealWrapper>

        {/* Pre-launch checklist */}
        <RevealWrapper delay={200}>
          <div className={`${CARD_ELEVATED} p-6 mb-8`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-soft" />
              <span className="text-[11px] font-heading tracking-widest text-slate-400 uppercase">
                Pre-Launch Checklist
              </span>
            </div>
            <p className="text-white text-[15px] font-medium mb-4">
              Confirm your readiness before entering the simulation.
            </p>
            <div className="space-y-2.5 mb-4">
              {CHECKLIST.map((item, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 active:scale-[0.99] ${
                    checklist[i]
                      ? "border-green-500/30 bg-green-500/[0.05]"
                      : "border-[#1e2a35] hover:border-slate-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                      checklist[i]
                        ? "border-green-500/60 bg-green-500/20"
                        : "border-slate-700"
                    }`}
                  >
                    {checklist[i] && (
                      <span className="text-green-400 text-[12px]">✓</span>
                    )}
                  </div>
                  <span
                    className={`text-[14px] transition-colors duration-200 ${checklist[i] ? item.color : "text-slate-400"}`}
                  >
                    {item.text}
                  </span>
                </button>
              ))}
            </div>

            {allChecked && (
              <div className="rounded-lg border border-green-500/25 bg-green-500/[0.05] px-4 py-3 animate-fade-in">
                <p className="text-green-300 text-[13px] font-semibold">
                  ✓ All systems verified. You're ready.
                </p>
                <p className="text-slate-400 text-[12px] mt-0.5">
                  The simulation will put everything you've learned to the test.
                </p>
              </div>
            )}
          </div>
        </RevealWrapper>

        {/* Final quiz */}
        <RevealWrapper delay={260}>
          <div className="mb-8">
            <QuizQuestion
              accentColor="red"
              question="A computer's CPU, RAM, and network all fail simultaneously. What fails last, keeping the system partially alive?"
              options={[
                {
                  text: "RAM — it holds the OS in memory so CPU can still execute",
                  correct: false,
                  explanation:
                    "If RAM fails, the CPU has nothing to execute — no instructions, no data. The system halts immediately.",
                },
                {
                  text: "The network — it's external and independent of local hardware",
                  correct: false,
                  explanation:
                    "The network interface is a hardware component. Without CPU to drive it and RAM to buffer packets, it can't function.",
                },
                {
                  text: "The CPU — it can execute from cache even without RAM",
                  correct: true,
                  explanation:
                    "Correct! Modern CPUs have L1/L2/L3 caches that store a small amount of data. If RAM fails, the CPU can briefly execute instructions and read data from cache before exhausting it. This is why some firmware operations run entirely from CPU cache.",
                },
                {
                  text: "Storage — SSDs are self-contained and keep running",
                  correct: false,
                  explanation:
                    "SSDs need the CPU and bus to receive commands. Without CPU control, an SSD just sits idle. It won't spontaneously transfer data.",
                },
              ]}
            />
          </div>
        </RevealWrapper>

        {/* CTA */}
        <RevealWrapper delay={320}>
          <div className="text-center">
            <div className="flex items-center gap-3 justify-center mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/30" />
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-soft" />
                <span className="font-mono text-[10px] text-red-400/80 tracking-widest uppercase">
                  Live Threat Detected
                </span>
              </div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/30" />
            </div>

            <button
              onClick={() => {
                window.scrollTo(0, 0);
                navigate("/simulation");
              }}
              className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-2xl border-2 border-red-500/40 bg-red-500/[0.07] text-red-300 font-heading text-[16px] tracking-[0.1em] hover:bg-red-500/12 hover:border-red-500/60 transition-all duration-300 active:scale-[0.97] overflow-hidden mb-4"
              style={{
                boxShadow:
                  "0 0 50px hsl(0 84% 60% / 0.12), 0 0 100px hsl(0 84% 60% / 0.05)",
              }}
            >
              <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent top-0" />
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse-soft" />
                <span>EXPERIENCE THE ATTACK</span>
              </div>
              <span className="text-red-500/60 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </button>

            <p className="text-slate-600 text-[12px] font-mono tracking-wider">
              Launch the live cybersecurity incident simulation
            </p>
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────

const Story = () => (
  <div
    className="relative"
    style={{ backgroundColor: "#080d12", overflow: "hidden" }}
  >
    {/* Animated Background Elements */}
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.015] bg-grid" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-drift-slow bg-orb-blue" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-15 animate-drift-x bg-orb-green" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full blur-[100px] opacity-10 animate-drift-y bg-orb-amber" />

      {/* Top Gradient Fade */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#0a0f18] via-transparent to-transparent" />

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-noise" />
    </div>

    <TopNav />
    <SideProgress />
    <main className="pt-16 relative z-10">
      <HeroSection />
      <div className="py-12 px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1e2a35] to-transparent" />
      </div>
      <IntroSection />
      <div className="py-12 px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1e2a35] to-transparent" />
      </div>
      <CPUSection />
      <div className="py-12 px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1e2a35] to-transparent" />
      </div>
      <MemorySection />
      <div className="py-12 px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1e2a35] to-transparent" />
      </div>
      <NetworkStorySection />
      <div className="py-12 px-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#1e2a35] to-transparent" />
      </div>
      <SynthesisSection />
    </main>
  </div>
);

export default Story;
