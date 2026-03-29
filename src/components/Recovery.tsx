import { useState, useEffect, useRef } from "react";
import { useReveal } from "@/hooks/useReveal";

interface Stat {
  label: string;
  target: number;
  display: string;
  suffix: string;
  change: string;
}

const STATS: Stat[] = [
  { label: "Threats Neutralized", target: 47,   display: "0",   suffix: "",   change: "+12 this session" },
  { label: "Nodes Recovered",     target: 80,   display: "0",   suffix: "%",  change: "8 of 10 nodes"    },
  { label: "System Uptime",       target: 99,   display: "0",   suffix: ".2%",change: "↑ 3.1% restored"  },
  { label: "Data Integrity",      target: 97,   display: "0",   suffix: ".8%",change: "Verified"          },
];

const TIMELINE = [
  { time: "00:00", event: "Initial breach detected in sector RTR-2",     status: "resolved" },
  { time: "02:15", event: "Network isolation protocol initiated",         status: "resolved" },
  { time: "03:48", event: "3 infected nodes quarantined",                 status: "resolved" },
  { time: "05:42", event: "Emergency patch deployed to core",             status: "resolved" },
  { time: "08:30", event: "System stabilization achieved",                status: "resolved" },
  { time: "10:17", event: "Defense perimeter re-established",             status: "resolved" },
  { time: "12:00", event: "Full recovery confirmed — mission complete",   status: "active"   },
];

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const animate = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3); // cubic ease-out
      setValue(Math.round(ease * target));
      if (pct < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [active, target, duration]);

  return value;
}

const StatCard = ({ stat, active, idx }: { stat: Stat; active: boolean; idx: number }) => {
  const count = useCountUp(stat.target, active, 1400 + idx * 100);

  return (
    <div
      className="cyber-panel p-4 text-center transition-all duration-500"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(12px)",
        transitionDelay: `${idx * 120}ms`,
      }}
    >
      <span className="text-[10px] font-heading tracking-wider text-muted-foreground uppercase block mb-2">
        {stat.label}
      </span>
      <span className="font-heading text-2xl text-foreground block tabular-nums">
        {count}{stat.suffix}
      </span>
      <span className="text-[11px] text-cyber-green mt-1.5 block font-mono">
        {stat.change}
      </span>
    </div>
  );
};

const Recovery = () => {
  const { ref, visible } = useReveal(0.1);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (visible) setTimeout(() => setEntered(true), 150);
  }, [visible]);

  return (
    <section
      id="recovery"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative"
    >
      {/* Calm green glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-cyber-green/[0.04] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-3xl space-y-10">

        {/* Header */}
        <div
          className="text-center transition-all duration-700"
          style={{ opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(16px)" }}
        >
          {/* Step badge */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="font-mono text-[10px] text-muted-foreground/45 tracking-widest uppercase">
              05 / 05 — RECOVERY
            </span>
          </div>

          {/* Success badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-green/35 bg-cyber-green/5 mb-6">
            <div className="w-2 h-2 rounded-full bg-cyber-green" />
            <span className="text-xs font-heading tracking-widest text-cyber-green uppercase">
              System Recovered
            </span>
          </div>

          <h2 className="font-heading text-2xl md:text-3xl text-foreground tracking-wider mb-4">
            Mission Complete
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            All threats have been neutralized and system integrity restored. Review the full incident report below.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} active={entered} idx={i} />
          ))}
        </div>

        {/* Timeline */}
        <div
          className="cyber-panel p-6 transition-all duration-700"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "400ms",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-heading tracking-wider text-muted-foreground uppercase">
              Incident Timeline
            </h3>
            <span className="text-[10px] font-mono text-cyber-green/50 tracking-wider">
              CASE #SEN-2024-0847
            </span>
          </div>

          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 transition-all duration-500"
                style={{
                  opacity: entered ? 1 : 0,
                  transform: entered ? "translateX(0)" : "translateX(-8px)",
                  transitionDelay: `${500 + i * 80}ms`,
                }}
              >
                <span className="font-mono text-xs text-muted-foreground/50 w-12 shrink-0 pt-0.5 tabular-nums">
                  {item.time}
                </span>
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-colors duration-500 ${
                      item.status === "active"
                        ? "bg-cyber-green glow-green"
                        : "bg-cyber-blue/50"
                    }`}
                  />
                  {i < TIMELINE.length - 1 && (
                    <div className="w-px bg-border mt-1" style={{ height: "20px" }} />
                  )}
                </div>
                <span
                  className={`text-sm leading-snug transition-colors duration-500 ${
                    item.status === "active" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.event}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center transition-all duration-700"
          style={{ opacity: entered ? 1 : 0, transitionDelay: "900ms" }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-cyber-green/20 bg-cyber-green/[0.04]">
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-soft" />
            <span className="font-mono text-xs text-cyber-green/70 tracking-wider">
              SENTINEL SYSTEM FULLY OPERATIONAL
            </span>
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-soft" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recovery;
