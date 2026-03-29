import { useState, useEffect } from "react";
import { useReveal } from "@/hooks/useReveal";

type NodeStatus = "safe" | "infected" | "isolated";

interface NetworkNode {
  id: number;
  x: number;
  y: number;
  status: NodeStatus;
  label: string;
}

const INITIAL_NODES: NetworkNode[] = [
  { id: 1,  x: 50, y: 28, status: "safe",     label: "HUB-01" },
  { id: 2,  x: 24, y: 50, status: "safe",     label: "SRV-A"  },
  { id: 3,  x: 76, y: 50, status: "infected", label: "SRV-B"  },
  { id: 4,  x: 14, y: 74, status: "safe",     label: "END-01" },
  { id: 5,  x: 40, y: 70, status: "infected", label: "END-02" },
  { id: 6,  x: 60, y: 74, status: "safe",     label: "END-03" },
  { id: 7,  x: 86, y: 70, status: "safe",     label: "END-04" },
  { id: 8,  x: 50, y: 90, status: "safe",     label: "GW-01"  },
  { id: 9,  x: 34, y: 40, status: "safe",     label: "RTR-1"  },
  { id: 10, x: 70, y: 34, status: "infected", label: "RTR-2"  },
];

const CONNECTIONS: [number, number][] = [
  [1, 2], [1, 3], [1, 9], [1, 10],
  [2, 4], [2, 5], [2, 9],
  [3, 6], [3, 7], [3, 10],
  [4, 8], [5, 6], [5, 8],
  [6, 7], [7, 8],
];

const NODE_COLOR: Record<NodeStatus, string> = {
  safe:     "hsl(142 71% 45%)",
  infected: "hsl(0 84% 60%)",
  isolated: "hsl(38 92% 50%)",
};

const Network = () => {
  const { ref, visible } = useReveal();
  const [nodes, setNodes]         = useState<NetworkNode[]>(INITIAL_NODES);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [justIsolated, setJustIsolated] = useState<number | null>(null);
  const [entered, setEntered]     = useState(false);

  useEffect(() => {
    if (visible) setTimeout(() => setEntered(true), 100);
  }, [visible]);

  const infectedCount = nodes.filter((n) => n.status === "infected").length;
  const isolatedCount = nodes.filter((n) => n.status === "isolated").length;
  const isSecured     = infectedCount === 0;

  const handleNodeClick = (node: NetworkNode) => {
    if (node.status !== "infected") return;
    setJustIsolated(node.id);
    setTimeout(() => setJustIsolated(null), 600);
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, status: "isolated" } : n))
    );
  };

  const getEdgeStroke = (a: NetworkNode, b: NetworkNode) => {
    if (a.status === "isolated" || b.status === "isolated") return NODE_COLOR.isolated;
    if (a.status === "infected" || b.status === "infected") return NODE_COLOR.infected;
    return "hsl(214 20% 34%)";
  };

  const getEdgeOpacity = (a: NetworkNode, b: NetworkNode) => {
    if (a.status === "isolated" || b.status === "isolated") return 0.18;
    if (a.status === "infected" || b.status === "infected") return 0.45;
    return 0.25;
  };

  const isEdgeAnimated = (a: NetworkNode, b: NetworkNode) =>
    a.status === "infected" && b.status === "infected";

  return (
    <section
      id="network"
      ref={ref as React.RefObject<HTMLElement>}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
    >
      {/* Ambient threat glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000"
          style={{ background: isSecured ? "hsl(142 71% 45% / 0.03)" : "hsl(0 84% 60% / 0.04)" }}
        />
      </div>

      {/* Header */}
      <div className={`text-center mb-8 transition-all duration-700 ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* Step badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-mono text-[10px] text-muted-foreground/45 tracking-widest uppercase">
            02 / 05 — NETWORK SCAN
          </span>
        </div>

        <h2 className="font-heading text-2xl md:text-3xl text-foreground tracking-wider mb-3">
          Network Topology
        </h2>

        {/* Guided instruction */}
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-3 transition-all duration-500 ${
          isSecured
            ? "border-cyber-green/30 bg-cyber-green/5"
            : "border-cyber-red/30 bg-cyber-red/5"
        }`}>
          <div className={`w-2 h-2 rounded-full ${isSecured ? "bg-cyber-green" : "bg-cyber-red animate-pulse-soft"}`} />
          <span className={`text-xs font-heading tracking-widest uppercase ${isSecured ? "text-cyber-green" : "text-cyber-red"}`}>
            {isSecured
              ? "All Threats Isolated"
              : `${infectedCount} Active Infection${infectedCount !== 1 ? "s" : ""} Detected`}
          </span>
        </div>

        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          {isSecured
            ? "Network quarantine successful. Proceed to meltdown containment."
            : "Identify and isolate infected nodes before the infection spreads."}
        </p>

        {/* Animated hint */}
        {!isSecured && (
          <div className="flex items-center justify-center gap-2 mt-3 animate-pulse-soft">
            <span className="text-[11px] font-mono text-cyber-red/50">
              ↑ Click red nodes to isolate them
            </span>
          </div>
        )}
      </div>

      {/* SVG map */}
      <div
        className={`relative w-full max-w-2xl transition-all duration-700 delay-100 ${entered ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ aspectRatio: "1 / 1" }}
      >
        <svg className="w-full h-full" viewBox="0 0 100 100" style={{ overflow: "visible" }}>
          <defs>
            <filter id="net-glow-red"   x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="1.4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="net-glow-green" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="0.9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="net-glow-amber" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="0.9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Edges */}
          {CONNECTIONS.map(([fromId, toId], i) => {
            const a = nodes.find((n) => n.id === fromId)!;
            const b = nodes.find((n) => n.id === toId)!;
            const animated = isEdgeAnimated(a, b);
            return (
              <line
                key={i}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={getEdgeStroke(a, b)}
                strokeWidth={animated ? "0.45" : "0.28"}
                opacity={getEdgeOpacity(a, b)}
                strokeDasharray={animated ? "1.5 1" : undefined}
              >
                {animated && (
                  <animate attributeName="stroke-dashoffset" from="0" to="-5" dur="1.1s" repeatCount="indefinite" />
                )}
              </line>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, idx) => {
            const color     = NODE_COLOR[node.status];
            const isInfected = node.status === "infected";
            const isIsolated = node.status === "isolated";
            const isHovered  = hoveredId === node.id;
            const wasJustIsolated = justIsolated === node.id;
            const filter    = isInfected ? "url(#net-glow-red)" : isIsolated ? "url(#net-glow-amber)" : "url(#net-glow-green)";
            const entranceDelay = idx * 60;

            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  cursor: isInfected ? "pointer" : "default",
                  opacity: entered ? 1 : 0,
                  transform: entered ? "scale(1)" : "scale(0.4)",
                  transformOrigin: `${node.x}% ${node.y}%`,
                  transition: `opacity 0.5s ease ${entranceDelay}ms, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${entranceDelay}ms`,
                }}
              >
                {/* Infection pulse ring 1 */}
                {isInfected && (
                  <circle cx={node.x} cy={node.y} r="1.5" fill={color} opacity="0">
                    <animate attributeName="r"       values="1.5;5.5;1.5"   dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Pulse ring 2 (offset) */}
                {isInfected && (
                  <circle cx={node.x} cy={node.y} r="1.5" fill={color} opacity="0">
                    <animate attributeName="r"       values="1.5;5.5;1.5"   dur="1.8s" begin="0.9s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="1.8s" begin="0.9s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Isolation burst */}
                {wasJustIsolated && (
                  <circle cx={node.x} cy={node.y} r="1.5" fill={NODE_COLOR.isolated} opacity="0.6">
                    <animate attributeName="r"       values="1.5;8"   dur="0.5s" fill="freeze" />
                    <animate attributeName="opacity" values="0.6;0"   dur="0.5s" fill="freeze" />
                  </circle>
                )}

                {/* Isolated dashed ring */}
                {isIsolated && (
                  <circle cx={node.x} cy={node.y} r="3.8" fill="none"
                    stroke={color} strokeWidth="0.35" strokeDasharray="0.7 0.5" opacity={0.5} />
                )}

                {/* Hover ring */}
                {isHovered && (
                  <circle cx={node.x} cy={node.y} r="3.2" fill="none"
                    stroke={color} strokeWidth="0.4" opacity={0.55} />
                )}

                {/* Glow halo */}
                <circle cx={node.x} cy={node.y} r="2.6" fill={color}
                  opacity={isInfected ? 0.14 : 0.07} filter={filter} />

                {/* Core */}
                <circle cx={node.x} cy={node.y} r="1.5" fill={color}
                  opacity={isIsolated ? 0.45 : 0.88} />

                {/* Inner dot */}
                <circle cx={node.x} cy={node.y} r="0.55"
                  fill={isIsolated ? "hsl(38 92% 75%)" : isInfected ? "hsl(0 84% 78%)" : "hsl(142 71% 72%)"} />

                {/* Label on hover */}
                {isHovered && (
                  <text x={node.x} y={node.y - 3.8} textAnchor="middle"
                    fontSize="2.4" fill={color} opacity={0.9} fontFamily="monospace">
                    {isInfected ? "CLICK TO ISOLATE" : node.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className={`flex flex-wrap items-center justify-center gap-6 mt-6 transition-all duration-700 delay-200 ${entered ? "opacity-100" : "opacity-0"}`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-green/80" />
          <span className="text-xs text-muted-foreground font-mono">
            Secure ({nodes.filter((n) => n.status === "safe").length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-red/80" />
          <span className="text-xs text-muted-foreground font-mono">
            Infected ({infectedCount})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyber-amber/80" />
          <span className="text-xs text-muted-foreground font-mono">
            Isolated ({isolatedCount})
          </span>
        </div>
      </div>
    </section>
  );
};

export default Network;
