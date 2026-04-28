"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { domain: string; score: number }[];
}

export function DomainRadar({ data }: Props) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="hsl(217 33% 28%)" />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fill: "hsl(210 40% 96%)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
            stroke="hsl(217 33% 28%)"
          />
          <Radar
            name="Madurez"
            dataKey="score"
            stroke="hsl(217 91% 60%)"
            fill="hsl(217 91% 60%)"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
