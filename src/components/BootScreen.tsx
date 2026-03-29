import { useState, useEffect, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

const BOOT_LINES = [
  { text: "$ initializing secure environment...", delay: 0 },
  { text: "$ loading kernel modules.............. [OK]", delay: 280 },
  { text: "$ establishing encrypted channel...... [OK]", delay: 560 },
  { text: "$ verifying system integrity.......... [OK]", delay: 840 },
  { text: "$ scanning for intrusion signatures... [OK]", delay: 1200 },
  { text: "$ mounting classified data store...... [OK]", delay: 1550 },
  { text: "$ awaiting operator authentication...", delay: 1950 },
];

const TYPING_SPEED = 20; // ms per char

const BootScreen = () => {
  const { ref, visible } = useReveal();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [activeLineText, setActiveLineText] = useState("");
  const [allDone, setAllDone]   = useState(false);
  const [callsign, setCallsign] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);

  const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;

    const typeLine = (idx: number, charIdx: number) => {
      if (cancelled || idx >= BOOT_LINES.length) {
        if (!cancelled) setAllDone(true);
        return;
      }
      const { text } = BOOT_LINES[idx];

      if (charIdx <= text.length) {
        setActiveLineText(text.slice(0, charIdx));
        charTimerRef.current = setTimeout(() => typeLine(idx, charIdx + 1), TYPING_SPEED);
      } else {
        setDisplayedLines((prev) => {
          const copy = [...prev];
          copy[idx] = text;
          return copy;
        });
        setActiveLineText("");
        const nextIdx = idx + 1;
        if (nextIdx < BOOT_LINES.length) {
          const gap = BOOT_LINES[nextIdx].delay - BOOT_LINES[idx].delay;
          lineTimerRef.current = setTimeout(() => typeLine(nextIdx, 0), gap);
        } else {
          if (!cancelled) setAllDone(true);
        }
      }
    };

    typeLine(0, 0);
    return () => {
      cancelled = true;
      if (charTimerRef.current) clearTimeout(charTimerRef.current);
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
    };
  }, []);

  const handleLogin = () => {
    if (!callsign.trim()) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      inputRef.current?.focus();
      return;
    }
    setSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <section
      id="boot"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex items-center justify-center px-4 relative"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-cyber-green/[0.04] blur-[140px]" />
      </div>

      <div className={`relative w-full max-w-xl ${visible ? "animate-slide-up" : "section-hidden"}`}>
        {/* Step badge */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="font-mono text-[10px] text-muted-foreground/50 tracking-widest uppercase">
            01 / 05 — SYSTEM BOOT
          </span>
          <span className="font-mono text-[10px] text-cyber-green/40 tracking-wider">
            SENTINEL OS v2.4
          </span>
        </div>

        {/* Terminal window */}
        <div className="cyber-panel overflow-hidden shadow-2xl relative">

          {/* Scanline overlay */}
          <div className="scanline-overlay" />

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
            <div className="w-3 h-3 rounded-full bg-cyber-red/60" />
            <div className="w-3 h-3 rounded-full bg-cyber-amber/60" />
            <div className="w-3 h-3 rounded-full bg-cyber-green/60" />
            <span className="ml-3 text-xs text-muted-foreground font-mono tracking-wider">
              secure-shell — root@sentinel
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse-soft" />
              <span className="text-[10px] font-mono text-cyber-green/60 tracking-widest">LIVE</span>
            </div>
          </div>

          {/* Terminal body */}
          <div className="p-6 font-mono text-sm space-y-1.5 min-h-[210px]">
            {displayedLines.map((line, i) => (
              <div
                key={i}
                className="leading-relaxed"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <span className="text-cyber-green/65">
                  {line.replace(" [OK]", "")}
                </span>
                {line.includes("[OK]") && (
                  <span className="text-cyber-green font-semibold"> [OK]</span>
                )}
              </div>
            ))}

            {/* Active typing line */}
            {!allDone && (
              <div className="leading-relaxed flex items-center">
                <span className="text-cyber-green/80">{activeLineText}</span>
                <span className="inline-block w-[2px] h-[14px] bg-cyber-green/90 ml-px animate-blink" />
              </div>
            )}

            {/* Idle cursor after done */}
            {allDone && !submitted && (
              <div className="flex items-center gap-1.5 mt-1 leading-relaxed">
                <span className="text-cyber-green/50">$</span>
                <span className="inline-block w-[2px] h-[14px] bg-cyber-green/70 animate-blink" />
              </div>
            )}

            {/* Success line */}
            {submitted && (
              <div className="flex items-center gap-2 mt-2 animate-fade-in">
                <span className="text-cyber-green/50">$</span>
                <span className="text-cyber-green font-semibold">
                  ACCESS GRANTED — Welcome, {callsign}
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-border" />

          {/* Auth input */}
          <div className="px-6 py-5">
            {submitted ? (
              <div className="flex items-center gap-3 py-0.5 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-soft" />
                <p className="text-xs text-muted-foreground font-mono">
                  Operator authenticated. Proceed to network scan.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-[11px] text-muted-foreground font-heading tracking-[0.15em] uppercase">
                    Enter your callsign to initialize system
                  </label>
                  {allDone && (
                    <span className="text-[10px] font-mono text-cyber-green/40 animate-blink">
                      ↵ ENTER
                    </span>
                  )}
                </div>
                <div className={`flex gap-2.5 ${shakeInput ? "animate-shake" : ""}`}>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-green/45 font-mono text-sm select-none pointer-events-none">
                      ›
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={callsign}
                      onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                      onKeyDown={handleKeyDown}
                      placeholder="OPERATOR-001"
                      maxLength={20}
                      className="w-full bg-secondary/60 border border-border rounded-md pl-8 pr-4 py-2.5 text-sm text-foreground font-mono placeholder:text-muted-foreground/35 focus:outline-none focus:ring-1 focus:ring-cyber-green/50 focus:border-cyber-green/50 transition-all duration-200 tracking-wider"
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    className="px-5 py-2.5 bg-cyber-green/10 border border-cyber-green/30 rounded-md text-cyber-green text-xs font-heading tracking-[0.15em] hover:bg-cyber-green/20 hover:border-cyber-green/50 active:scale-95 transition-all duration-150 glow-green whitespace-nowrap"
                  >
                    AUTHENTICATE
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Narrative footer */}
        <div className="mt-5 flex items-center gap-3 px-1">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-green/10 to-transparent" />
          <span className="text-[10px] font-mono text-muted-foreground/30 tracking-wider text-center">
            Scroll down to begin the incident response sequence
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyber-green/10 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default BootScreen;
