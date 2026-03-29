import { useEffect, useState, useRef } from "react";

const SECTIONS = [
  { id: "boot",     label: "SYSTEM BOOT",   step: 1, health: 100 },
  { id: "network",  label: "NETWORK SCAN",  step: 2, health: 76  },
  { id: "meltdown", label: "MELTDOWN",      step: 3, health: 31  },
  { id: "defense",  label: "ACTIVE DEFENSE",step: 4, health: 62  },
  { id: "recovery", label: "RECOVERY",      step: 5, health: 97  },
];

const HealthBar = () => {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [displayHealth, setDisplayHealth] = useState(100);
  const [pulse, setPulse]           = useState(false);
  const prevHealthRef               = useRef(100);

  // Observe all sections, update active on scroll
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }, idx) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(idx);
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Animate health bar change
  useEffect(() => {
    const target = SECTIONS[activeIdx].health;
    const prev   = prevHealthRef.current;
    if (target === prev) return;

    if (Math.abs(target - prev) > 10) {
      setPulse(true);
      setTimeout(() => setPulse(false), 700);
    }

    const step  = target > prev ? 1 : -1;
    const timer = setInterval(() => {
      setDisplayHealth((h) => {
        const next = h + step;
        if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
          clearInterval(timer);
          prevHealthRef.current = target;
          return target;
        }
        return next;
      });
    }, 14);

    return () => clearInterval(timer);
  }, [activeIdx]);

  const active = SECTIONS[activeIdx];

  const barColor =
    displayHealth > 65 ? "bg-cyber-blue"
    : displayHealth > 35 ? "bg-cyber-amber"
    : "bg-cyber-red";

  const glowClass =
    displayHealth > 65 ? "glow-blue"
    : displayHealth > 35 ? "glow-amber"
    : "glow-red";

  const textColor =
    displayHealth > 65 ? "text-cyber-blue"
    : displayHealth > 35 ? "text-cyber-amber"
    : "text-cyber-red";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-2">
        {/* Main row */}
        <div className="flex items-center gap-4">
          {/* Logo / section label */}
          <div className="hidden sm:flex items-center gap-2 shrink-0 min-w-[140px]">
            <span className="font-heading text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">
              SYS
            </span>
            <span className="text-muted-foreground/30">·</span>
            <span className="font-heading text-[10px] tracking-[0.15em] text-foreground/80 uppercase transition-all duration-500">
              {active.label}
            </span>
          </div>

          {/* Health label */}
          <span className="font-heading text-[10px] tracking-widest text-muted-foreground/70 uppercase shrink-0">
            INTEGRITY
          </span>

          {/* Bar */}
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor} ${glowClass} ${pulse ? "brightness-125" : ""}`}
              style={{ width: `${displayHealth}%` }}
            />
          </div>

          {/* Percentage */}
          <span className={`font-heading text-sm tabular-nums shrink-0 transition-colors duration-500 ${textColor}`}>
            {displayHealth}%
          </span>

          {/* Step dots */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-2">
            {SECTIONS.map((s, i) => (
              <div
                key={s.id}
                className={`rounded-full transition-all duration-400 ${
                  i === activeIdx
                    ? "w-4 h-1.5 bg-foreground/60"
                    : i < activeIdx
                    ? "w-1.5 h-1.5 bg-foreground/25"
                    : "w-1.5 h-1.5 bg-foreground/10"
                }`}
              />
            ))}
          </div>

          {/* Step counter */}
          <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0 tabular-nums">
            {active.step}/5
          </span>
        </div>
      </div>
    </div>
  );
};

export default HealthBar;
