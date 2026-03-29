import { useState, useEffect, useRef, useCallback } from "react";
import { useReveal } from "@/hooks/useReveal";

const INITIAL_SECONDS = 5 * 60 + 42;

const Meltdown = () => {
  const { ref, visible } = useReveal();
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [sliderValue, setSliderValue] = useState(35);
  const [patched, setPatched]         = useState(false);
  const [patchFailed, setPatchFailed] = useState(false);
  const [patchMsg, setPatchMsg]       = useState("");
  const [shakeTick, setShakeTick]     = useState(0);
  const [entered, setEntered]         = useState(false);

  const sliderRef  = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (visible) setTimeout(() => setEntered(true), 80);
  }, [visible]);

  // Countdown
  useEffect(() => {
    if (patched || secondsLeft <= 0) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(t); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [patched]);

  // Shake effect when critical
  useEffect(() => {
    if (secondsLeft > 0 && secondsLeft <= 59 && !patched) {
      const t = setInterval(() => setShakeTick((n) => n + 1), 3000);
      return () => clearInterval(t);
    }
  }, [secondsLeft, patched]);

  const minutes    = Math.floor(secondsLeft / 60);
  const secs       = secondsLeft % 60;
  const minStr     = String(minutes).padStart(2, "0");
  const secStr     = String(secs).padStart(2, "0");
  const isCritical = secondsLeft <= 59 && !patched;
  const isWarning  = secondsLeft <= 179 && !isCritical && !patched;

  // Derived colors
  const timerColor = patched ? "text-cyber-green"
    : isCritical ? "text-cyber-red"
    : isWarning  ? "text-cyber-amber"
    : "text-foreground";

  const timerPanelClass = patched
    ? "bg-cyber-green/8 border border-cyber-green/20"
    : isCritical
    ? "bg-cyber-red/10 border border-cyber-red/20"
    : "bg-secondary border border-transparent";

  // Slider drag
  const updateSlider = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setSliderValue(Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging.current) updateSlider(e.clientX); };
    const onUp   = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [updateSlider]);

  const sliderColor   = sliderValue >= 70 ? "bg-cyber-green glow-green" : sliderValue >= 40 ? "bg-cyber-amber glow-amber" : "bg-cyber-red";
  const thumbBorder   = sliderValue >= 70 ? "border-cyber-green" : sliderValue >= 40 ? "border-cyber-amber" : "border-cyber-red";
  const sliderLabel   = sliderValue >= 70 ? "text-cyber-green" : sliderValue >= 40 ? "text-cyber-amber" : "text-cyber-red";

  const handlePatch = () => {
    if (patched) return;
    if (sliderValue >= 70) {
      setPatched(true);
      setPatchMsg("✓ EMERGENCY PATCH DEPLOYED — System stabilizing");
    } else {
      setPatchFailed(true);
      setPatchMsg(`⚠ INSUFFICIENT STABILITY (${sliderValue}% / 70% required)`);
      setTimeout(() => { setPatchFailed(false); setPatchMsg(""); }, 2800);
    }
  };

  const btnClass = patched
    ? "bg-cyber-green/10 border-cyber-green/40 text-cyber-green cursor-default glow-green"
    : patchFailed
    ? "bg-cyber-red/20 border-cyber-red/60 text-cyber-red"
    : sliderValue >= 70
    ? "bg-cyber-green/10 border-cyber-green/40 text-cyber-green hover:bg-cyber-green/20 glow-green"
    : "bg-cyber-red/10 border-cyber-red/40 text-cyber-red hover:bg-cyber-red/20 glow-red";

  return (
    <section
      id="meltdown"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
    >
      {/* Ambient glow — grows when critical */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1500">
        <div
          className="w-[900px] h-[900px] rounded-full blur-[130px] transition-all duration-1000"
          style={{
            background: patched
              ? "hsl(142 71% 45% / 0.05)"
              : isCritical
              ? "hsl(0 84% 60% / 0.09)"
              : isWarning
              ? "hsl(0 84% 60% / 0.06)"
              : "hsl(0 84% 60% / 0.04)",
          }}
        />
      </div>

      <div
        className={`relative w-full max-w-lg text-center space-y-8 transition-all duration-700 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"} ${isCritical && shakeTick > 0 ? "animate-shake" : ""}`}
        key={shakeTick}
      >
        {/* Step badge */}
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/45 tracking-widest uppercase">
            03 / 05 — SYSTEM MELTDOWN
          </span>
        </div>

        {/* Status badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-500 ${
          patched ? "border-cyber-green/30 bg-cyber-green/5"
          : isCritical ? "border-cyber-red/40 bg-cyber-red/8"
          : "border-cyber-red/30 bg-cyber-red/5"
        }`}>
          <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
            patched ? "bg-cyber-green" : "bg-cyber-red animate-pulse-soft"
          }`} />
          <span className={`text-xs font-heading tracking-widest uppercase transition-colors duration-500 ${
            patched ? "text-cyber-green" : "text-cyber-red"
          }`}>
            {patched ? "System Stabilized" : isCritical ? "IMMINENT FAILURE" : "Critical Alert"}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground tracking-wider mb-4">
            SYSTEM<br />
            <span className={`transition-colors duration-700 ${patched ? "text-cyber-green text-glow-green" : "text-cyber-red text-glow-red"}`}>
              {patched ? "RESTORED" : "MELTDOWN"}
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            {patched
              ? "Emergency patch deployed. Core temperature normalizing."
              : secondsLeft === 0
              ? "Critical failure threshold exceeded. System offline."
              : "Core temperature exceeding safe limits. Immediate containment required."}
          </p>
        </div>

        {/* Guidance hint */}
        {!patched && secondsLeft > 0 && (
          <p className="text-[11px] font-mono text-muted-foreground/50 tracking-wide">
            Drag slider to ≥70% stability, then deploy the emergency patch
          </p>
        )}

        {/* Countdown */}
        <div className="cyber-panel p-6">
          <span className="text-[10px] text-muted-foreground font-heading tracking-wider uppercase block mb-4">
            {patched ? "Time Frozen" : "Time Until Failure"}
          </span>
          <div className="flex items-center justify-center gap-3">
            {/* Minutes */}
            <div className={`rounded-lg px-4 py-3 min-w-[72px] transition-all duration-300 ${timerPanelClass}`}>
              <span className={`font-heading text-3xl tabular-nums transition-colors duration-300 ${timerColor}`}>
                {minStr}
              </span>
            </div>
            <span className={`text-2xl font-heading transition-all duration-300 ${isCritical ? "text-cyber-red animate-blink" : "text-muted-foreground/40"}`}>:</span>
            {/* Seconds */}
            <div className={`rounded-lg px-4 py-3 min-w-[72px] transition-all duration-300 ${timerPanelClass}`}>
              <span className={`font-heading text-3xl tabular-nums transition-colors duration-300 ${timerColor}`}>
                {secStr}
              </span>
            </div>
            <span className={`text-2xl font-heading transition-all duration-300 ${isCritical ? "text-cyber-red animate-blink" : "text-muted-foreground/40"}`}>:</span>
            {/* Milliseconds (visual only) */}
            <div className={`rounded-lg px-4 py-3 min-w-[72px] transition-all duration-300 ${timerPanelClass}`}>
              <span className={`font-heading text-3xl tabular-nums transition-colors duration-300 ${timerColor}`}>
                00
              </span>
            </div>
          </div>
          <div className="flex justify-center gap-[68px] mt-2">
            {["MIN", "SEC", "MS"].map((label) => (
              <span key={label} className="text-[10px] text-muted-foreground font-heading tracking-wider">{label}</span>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div className="cyber-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-heading tracking-wider uppercase">
              System Stabilization
            </span>
            <span className={`text-sm font-mono font-semibold tabular-nums transition-colors duration-150 ${sliderLabel}`}>
              {sliderValue}%
              {sliderValue >= 70 && <span className="ml-2 text-[10px]">✓ READY</span>}
            </span>
          </div>

          <div
            ref={sliderRef}
            className="relative h-8 flex items-center cursor-pointer select-none"
            onMouseDown={(e) => { isDragging.current = true; updateSlider(e.clientX); }}
          >
            {/* Track */}
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-colors duration-150 ${sliderColor}`}
                style={{ width: `${sliderValue}%` }}
              />
            </div>
            {/* 70% threshold marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-px h-5 bg-muted-foreground/25"
              style={{ left: "70%" }}
            />
            {/* Threshold label */}
            <span
              className="absolute -top-4 text-[9px] font-mono text-muted-foreground/40 -translate-x-1/2"
              style={{ left: "70%" }}
            >
              70%
            </span>
            {/* Thumb */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 shadow-md transition-colors duration-150 ${thumbBorder}`}
              style={{ left: `calc(${sliderValue}% - 8px)` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-muted-foreground/50">
            <span>UNSTABLE</span>
            <span className={`transition-colors duration-200 ${sliderValue >= 70 ? "text-cyber-green" : "text-muted-foreground/30"}`}>
              {sliderValue >= 70 ? "PATCH READY" : `${70 - sliderValue}% MORE NEEDED`}
            </span>
            <span>STABLE</span>
          </div>
        </div>

        {/* Feedback message */}
        {patchMsg && (
          <p className={`text-xs font-mono tracking-wider animate-fade-in ${patched ? "text-cyber-green" : "text-cyber-red"}`}>
            {patchMsg}
          </p>
        )}

        {/* Patch button */}
        <button
          onClick={handlePatch}
          disabled={patched}
          className={`px-8 py-3.5 border rounded-lg font-heading text-sm tracking-[0.2em] transition-all duration-200 active:scale-95 ${btnClass}`}
        >
          {patched ? "✓ SYSTEM RESTORED" : patchFailed ? "⚠ STABILIZE FIRST" : "⚡ DEPLOY EMERGENCY PATCH"}
        </button>
      </div>
    </section>
  );
};

export default Meltdown;
