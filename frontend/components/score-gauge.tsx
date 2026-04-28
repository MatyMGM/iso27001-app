"use client";

interface Props {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 220 }: Props) {
  const safe = Math.max(0, Math.min(100, score));
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - safe / 100);
  const strokeColor =
    safe >= 75
      ? "hsl(142 71% 45%)"
      : safe >= 50
        ? "hsl(43 96% 56%)"
        : "hsl(0 75% 60%)";
  const label =
    safe >= 75 ? "Madurez alta" : safe >= 50 ? "Madurez media" : "Madurez baja";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(217 33% 22%)"
          strokeWidth={12}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={12}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 800ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tabular-nums">
          {Math.round(safe)}
        </span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          % madurez
        </span>
        <span
          className="mt-1 text-xs font-medium"
          style={{ color: strokeColor }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
