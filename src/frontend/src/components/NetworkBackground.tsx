export function NetworkBackground() {
  const nodes = [
    { cx: 80, cy: 60 },
    { cx: 220, cy: 40 },
    { cx: 350, cy: 90 },
    { cx: 480, cy: 55 },
    { cx: 600, cy: 120 },
    { cx: 150, cy: 170 },
    { cx: 300, cy: 200 },
    { cx: 430, cy: 160 },
    { cx: 550, cy: 190 },
    { cx: 680, cy: 80 },
    { cx: 720, cy: 200 },
    { cx: 50, cy: 230 },
  ];

  const lines = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 5],
    [2, 6],
    [3, 7],
    [4, 8],
    [5, 6],
    [6, 7],
    [7, 8],
    [4, 9],
    [9, 10],
    [8, 10],
    [0, 11],
    [5, 11],
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 800 280"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#35E08A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#35E08A" stopOpacity="0" />
          </radialGradient>
        </defs>
        {lines.map(([a, b]) => (
          <line
            key={`line-${a}-${b}`}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="#35E08A"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
        ))}
        {nodes.map((node) => (
          <g key={`node-${node.cx}-${node.cy}`}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r="8"
              fill="#35E08A"
              fillOpacity="0.05"
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="3"
              fill="#35E08A"
              fillOpacity="0.5"
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="1.5"
              fill="#35E08A"
              fillOpacity="0.9"
            />
          </g>
        ))}
      </svg>
      {/* Ambient glow */}
      <div
        className="absolute"
        style={{
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          background:
            "radial-gradient(ellipse, oklch(0.82 0.19 152 / 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
