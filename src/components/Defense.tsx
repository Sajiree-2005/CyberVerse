import { useState, useEffect, useRef, useCallback } from "react";
import { useReveal } from "@/hooks/useReveal";

type ThreatType = "MALWR" | "DDoS" | "PHISH" | "RANSOM" | "TROJAN";

interface Packet {
  id: number;
  x: number;   // % from left
  y: number;   // % from top
  vx: number;
  vy: number;
  type: ThreatType;
  exploding: boolean;
}

const THREAT_STYLES: Record<ThreatType, string> = {
  MALWR:  "border-cyber-red/60    bg-cyber-red/15    text-cyber-red",
  DDoS:   "border-cyber-amber/60  bg-cyber-amber/15  text-cyber-amber",
  PHISH:  "border-cyber-red/50    bg-cyber-red/10    text-cyber-red/80",
  RANSOM: "border-cyber-red/70    bg-cyber-red/20    text-cyber-red",
  TROJAN: "border-cyber-amber/50  bg-cyber-amber/10  text-cyber-amber/80",
};

const TYPES: ThreatType[] = ["MALWR", "DDoS", "PHISH", "RANSOM", "TROJAN"];
const SPEED     = 0.09;
const MAX_LIVES = 5;
const WIN_SCORE = 12;

let UID = 1;

const makePacket = (): Packet => {
  const edge = Math.floor(Math.random() * 4);
  let x: number, y: number;
  if      (edge === 0) { x = 5 + Math.random() * 90; y = 2; }
  else if (edge === 1) { x = 98; y = 5 + Math.random() * 90; }
  else if (edge === 2) { x = 5 + Math.random() * 90; y = 98; }
  else                 { x = 2; y = 5 + Math.random() * 90; }

  const dx = 50 - x, dy = 50 - y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const spd  = SPEED + Math.random() * 0.05;
  return {
    id: UID++, x, y,
    vx: (dx / dist) * spd,
    vy: (dy / dist) * spd,
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    exploding: false,
  };
};

const Defense = () => {
  const { ref, visible } = useReveal();
  const [packets, setPackets] = useState<Packet[]>([]);
  const [score, setScore]     = useState(0);
  const [lives, setLives]     = useState(MAX_LIVES);
  const [coreShake, setCoreShake] = useState(false);
  const [gameOver, setGameOver]   = useState(false);
  const [victory, setVictory]     = useState(false);
  const [entered, setEntered]     = useState(false);
  const [started, setStarted]     = useState(false);
  const [flash, setFlash]         = useState<"hit" | "kill" | null>(null);

  const packetsRef = useRef(packets);
  packetsRef.current = packets;
  const livesRef    = useRef(lives);
  livesRef.current  = lives;
  const gameRef     = useRef({ over: false, won: false });

  useEffect(() => {
    if (visible) setTimeout(() => setEntered(true), 80);
  }, [visible]);

  // Movement loop
  useEffect(() => {
    if (!started || gameOver || victory) return;
    const t = setInterval(() => {
      setPackets((prev) => {
        const updated: Packet[] = [];
        let missCount = 0;
        for (const p of prev) {
          if (p.exploding) { updated.push(p); continue; }
          const nx = p.x + p.vx;
          const ny = p.y + p.vy;
          const dist = Math.sqrt((nx - 50) ** 2 + (ny - 50) ** 2);
          if (dist < 5.5) {
            // Hit the core
            missCount++;
          } else {
            updated.push({ ...p, x: nx, y: ny });
          }
        }
        if (missCount > 0) {
          setLives((l) => {
            const nl = l - missCount;
            if (nl <= 0) { gameRef.current.over = true; setGameOver(true); return 0; }
            return nl;
          });
          setCoreShake(true);
          setFlash("hit");
          setTimeout(() => { setCoreShake(false); setFlash(null); }, 500);
        }
        return updated;
      });
    }, 33);
    return () => clearInterval(t);
  }, [started, gameOver, victory]);

  // Spawn loop
  useEffect(() => {
    if (!started || gameOver || victory) return;
    const t = setInterval(() => {
      if (packetsRef.current.length < 7) {
        setPackets((p) => [...p, makePacket()]);
      }
    }, 2200);
    return () => clearInterval(t);
  }, [started, gameOver, victory]);

  // Remove exploding packets
  useEffect(() => {
    const exploding = packets.filter((p) => p.exploding);
    if (exploding.length === 0) return;
    const t = setTimeout(() => {
      setPackets((p) => p.filter((pk) => !pk.exploding));
    }, 450);
    return () => clearTimeout(t);
  }, [packets]);

  const handlePacketClick = useCallback((id: number) => {
    setPackets((prev) =>
      prev.map((p) => (p.id === id && !p.exploding ? { ...p, exploding: true } : p))
    );
    setScore((s) => {
      const ns = s + 1;
      if (ns >= WIN_SCORE) { gameRef.current.won = true; setVictory(true); }
      return ns;
    });
    setFlash("kill");
    setTimeout(() => setFlash(null), 200);
  }, []);

  const reset = () => {
    setPackets([]);
    setScore(0);
    setLives(MAX_LIVES);
    setGameOver(false);
    setVictory(false);
    setCoreShake(false);
    gameRef.current = { over: false, won: false };
    setStarted(true);
  };

  const coreColor = victory ? "border-cyber-green/50 glow-green"
    : lives <= 1  ? "border-cyber-red/60 glow-red"
    : lives <= 2  ? "border-cyber-amber/50 glow-amber"
    : "border-cyber-blue/40 glow-blue";

  const coreText = victory ? "text-cyber-green"
    : lives <= 1  ? "text-cyber-red"
    : lives <= 2  ? "text-cyber-amber"
    : "text-cyber-blue";

  return (
    <section
      id="defense"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
    >
      {/* Header */}
      <div className={`text-center mb-6 transition-all duration-700 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-mono text-[10px] text-muted-foreground/45 tracking-widest uppercase">
            04 / 05 — ACTIVE DEFENSE
          </span>
        </div>
        <h2 className="font-heading text-2xl md:text-3xl text-foreground tracking-wider mb-3">
          Active Defense
        </h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          {!started
            ? "Click incoming threats before they reach the core. Protect system integrity."
            : victory
            ? `All threats neutralized. ${score} attacks intercepted.`
            : gameOver
            ? "Core breached. System compromised. Initiate recovery."
            : "Click incoming attack packets to neutralize them before they reach the core."}
        </p>
        {!started && !gameOver && !victory && (
          <p className="text-[11px] font-mono text-cyber-blue/50 mt-2 animate-pulse-soft">
            ↓ Click the field below to start defense protocol
          </p>
        )}
      </div>

      {/* Stats bar */}
      <div className={`flex items-center gap-6 mb-4 transition-all duration-700 delay-100 ${entered ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground/50 uppercase">NEUTRALIZED</span>
          <span className="font-heading text-sm text-cyber-green tabular-nums">{score}</span>
          <span className="font-mono text-[10px] text-muted-foreground/30">/ {WIN_SCORE}</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-muted-foreground/50 uppercase mr-1">SHIELD</span>
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-sm transition-all duration-300 ${
                i < lives ? "bg-cyber-blue/70" : "bg-secondary"
              }`}
            />
          ))}
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${started && !gameOver && !victory ? "bg-cyber-green animate-pulse-soft" : "bg-muted-foreground/30"}`} />
          <span className="text-[10px] font-mono text-muted-foreground/50 uppercase">
            {!started ? "STANDBY" : gameOver ? "OFFLINE" : victory ? "SECURED" : "ACTIVE"}
          </span>
        </div>
      </div>

      {/* Defense field */}
      <div
        className={`relative w-full max-w-2xl aspect-[16/10] cyber-panel overflow-hidden cursor-crosshair transition-all duration-700 delay-150 ${entered ? "opacity-100 scale-100" : "opacity-0 scale-95"} ${flash === "hit" ? "brightness-150" : ""}`}
        onClick={() => { if (!started && !gameOver && !victory) setStarted(true); }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(hsl(214 20% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(214 20% 50%) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radar rings (decorative) */}
        {[40, 65, 85].map((r) => (
          <div
            key={r}
            className="absolute rounded-full border border-cyber-blue/[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: `${r}%`, height: `${r}%` }}
          />
        ))}

        {/* Core shield */}
        <div
          className={`absolute top-1/2 left-1/2 transition-all duration-300 ${coreShake ? "animate-shake" : ""} animate-float`}
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <div
            className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${coreColor}`}
            style={{ transform: "translate(0, 0)" }}
          >
            <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-500 ${
              victory ? "border-cyber-green/60" : lives <= 1 ? "border-cyber-red/60" : "border-cyber-blue/50"
            }`}>
              <span className={`font-heading text-[9px] tracking-widest transition-colors duration-500 ${coreText}`}>
                {victory ? "OK" : gameOver ? "X" : "CORE"}
              </span>
            </div>
          </div>
        </div>

        {/* Attack packets */}
        {packets.map((p) => (
          <div
            key={p.id}
            className={`absolute w-9 h-9 rounded-md border flex items-center justify-center transition-none select-none
              ${THREAT_STYLES[p.type]}
              ${p.exploding ? "animate-explosion pointer-events-none" : "hover:brightness-125 hover:scale-110 cursor-pointer"}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: p.exploding ? undefined : "translate(-50%, -50%)",
            }}
            onClick={(e) => { e.stopPropagation(); if (!p.exploding) handlePacketClick(p.id); }}
          >
            <span className="text-[8px] font-mono font-semibold uppercase">
              {p.type}
            </span>
          </div>
        ))}

        {/* Overlay states */}
        {!started && !gameOver && !victory && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px]">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full border-2 border-cyber-blue/50 flex items-center justify-center mx-auto mb-3 animate-pulse-soft">
                <span className="font-heading text-cyber-blue text-xs">▶</span>
              </div>
              <p className="font-heading text-sm text-foreground/80 tracking-wider">CLICK TO ENGAGE</p>
              <p className="font-mono text-[10px] text-muted-foreground/50 mt-1">Defense protocol standby</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <div className="text-center">
              <p className="font-heading text-xl text-cyber-red tracking-widest mb-2">BREACH DETECTED</p>
              <p className="font-mono text-xs text-muted-foreground/60 mb-4">Core integrity compromised. {score} threats neutralized.</p>
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="px-6 py-2 border border-cyber-red/40 rounded-md text-cyber-red text-xs font-heading tracking-wider hover:bg-cyber-red/10 transition-colors"
              >
                REINITIALIZE DEFENSE
              </button>
            </div>
          </div>
        )}

        {victory && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
            <div className="text-center animate-fade-in">
              <p className="font-heading text-xl text-cyber-green tracking-widest mb-2 text-glow-green">DEFENSE SUCCESSFUL</p>
              <p className="font-mono text-xs text-muted-foreground/60 mb-4">{score} threats intercepted. Proceed to recovery.</p>
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="px-6 py-2 border border-cyber-green/40 rounded-md text-cyber-green text-xs font-heading tracking-wider hover:bg-cyber-green/10 transition-colors"
              >
                REPLAY
              </button>
            </div>
          </div>
        )}

        {/* HUD */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground/40">
            THREATS ACTIVE: {packets.filter((p) => !p.exploding).length}
          </span>
          <span className="text-[10px] font-mono text-cyber-blue/40">
            FIREWALL: {started && !gameOver ? "ACTIVE" : "STANDBY"}
          </span>
        </div>
      </div>

      {/* Threat legend */}
      <div className={`flex flex-wrap justify-center gap-3 mt-5 transition-all duration-700 delay-200 ${entered ? "opacity-100" : "opacity-0"}`}>
        {(Object.keys(THREAT_STYLES) as ThreatType[]).map((t) => (
          <span key={t} className={`text-[9px] font-mono uppercase px-2 py-1 rounded border ${THREAT_STYLES[t]}`}>
            {t}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Defense;
