"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { BenchmarkData } from "@/lib/types";
import { BarChart2, Users, ShieldCheck } from "lucide-react";

const DOMAIN_SHORT: Record<string, string> = {
  "Controles organizacionales": "A.5 Org.",
  "Controles de personas":      "A.6 Personas",
  "Controles físicos":          "A.7 Físicos",
  "Controles tecnológicos":     "A.8 Tec.",
};

function scoreColor(score: number): string {
  if (score >= 75) return "hsl(142 71% 45%)";   // green
  if (score >= 50) return "hsl(var(--primary))"; // blue/primary
  if (score >= 25) return "hsl(38 92% 50%)";     // amber
  return "hsl(0 84% 60%)";                       // red
}

function ScoreLabel({ score }: { score: number }) {
  const color =
    score >= 75
      ? "text-emerald-400"
      : score >= 50
      ? "text-primary"
      : score >= 25
      ? "text-amber-400"
      : "text-red-400";
  return <span className={color}>{score}%</span>;
}

export function BenchmarkChart() {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBenchmark()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </section>
    );
  }

  if (!data || data.totalAssessments === 0) {
    return (
      <section className="rounded-xl border border-border bg-muted/20 p-8 text-center space-y-2">
        <BarChart2 className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
        <p className="text-sm font-medium">Benchmark aún sin datos</p>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Cuando las empresas autoricen el uso anónimo de sus resultados, el
          benchmark estará disponible aquí.
        </p>
      </section>
    );
  }

  const domainData = data.avgByDomain.map((d) => ({
    ...d,
    label: DOMAIN_SHORT[d.domain] ?? d.domain,
  }));

  const distData = data.scoreDistribution.map((d) => ({
    ...d,
    fill: d.label.startsWith("76")
      ? "hsl(142 71% 45%)"
      : d.label.startsWith("51")
      ? "hsl(var(--primary))"
      : d.label.startsWith("26")
      ? "hsl(38 92% 50%)"
      : "hsl(0 84% 60%)",
  }));

  return (
    <section className="space-y-5">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              Benchmark de la industria
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Resultados anónimos consolidados de empresas evaluadas.
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1.5 h-7 self-start sm:self-auto">
          <Users className="h-3 w-3" />
          {data.totalAssessments} evaluación{data.totalAssessments !== 1 ? "es" : ""}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* overall score card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Madurez promedio general
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-2 pb-6 gap-3">
            <div className="relative flex items-center justify-center h-32 w-32">
              <svg className="absolute inset-0" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke={scoreColor(data.avgOverallScore)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(data.avgOverallScore / 100) * 314} 314`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
              </svg>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  <ScoreLabel score={data.avgOverallScore} />
                </div>
                <div className="text-xs text-muted-foreground">promedio</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-primary" />
              Basado en {data.totalAssessments} empresa{data.totalAssessments !== 1 ? "s" : ""}
            </div>
          </CardContent>
        </Card>

        {/* domain bar chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Promedio por dominio
            </CardTitle>
            <CardDescription>Madurez media del Anexo A por área</CardDescription>
          </CardHeader>
          <CardContent>
            {domainData.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={domainData} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={72} />
                  <Tooltip
                    formatter={(v: number) => [`${v}%`, "Promedio"]}
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }}
                  />
                  <Bar dataKey="avg" radius={[0, 4, 4, 0]} maxBarSize={20}>
                    {domainData.map((d) => (
                      <Cell key={d.domain} fill={scoreColor(d.avg)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-8">Sin datos de dominio aún.</p>
            )}
          </CardContent>
        </Card>

        {/* distribution chart */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Distribución de empresas por nivel de madurez
            </CardTitle>
            <CardDescription>Cantidad de empresas en cada rango de puntaje</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={distData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: number) => [v, "Empresas"]}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={64}>
                  {distData.map((d) => (
                    <Cell key={d.label} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
