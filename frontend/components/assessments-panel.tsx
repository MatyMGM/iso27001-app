"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { scoreFromAnswers } from "@/lib/score";
import type { Answer, Assessment, AssessmentType, Question } from "@/lib/types";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Zap,
  Star,
  Crown,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

type AssessmentWithAnswers = Assessment & {
  answers?: (Answer & { question?: Question })[];
};

const PLAN_META: Record<AssessmentType, { label: string; icon: React.ElementType; variant: "secondary" | "warning" | "destructive" }> = {
  free: { label: "Gratis", icon: Zap, variant: "secondary" },
  profesional: { label: "Profesional", icon: Star, variant: "warning" },
  premium: { label: "Premium", icon: Crown, variant: "destructive" },
};

const STATUS_LABEL: Record<string, string> = {
  draft: "En progreso",
  completed: "Completada",
  analyzed: "Analizada",
};

function getScore(assessment: AssessmentWithAnswers): number | null {
  if (assessment.status === "draft") return null;
  const aiReport = assessment.aiReport as Record<string, unknown> | null;
  if (aiReport?.overallScore !== undefined) {
    return Math.round(Number(aiReport.overallScore));
  }
  if (assessment.answers && assessment.answers.length > 0) {
    return scoreFromAnswers(assessment.answers);
  }
  return null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function ScoreDelta({ delta }: { delta: number | null }) {
  if (delta === null) return null;
  if (delta > 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-emerald-400 font-medium">
        <TrendingUp className="h-3 w-3" />+{delta}%
      </span>
    );
  if (delta < 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-red-400 font-medium">
        <TrendingDown className="h-3 w-3" />{delta}%
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" />0%
    </span>
  );
}

export function AssessmentsPanel({ userId }: { userId: string }) {
  const [assessments, setAssessments] = useState<AssessmentWithAnswers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getUserAssessments(userId)
      .then((data) => { if (mounted) setAssessments(data as AssessmentWithAnswers[]); })
      .catch(console.error)
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [userId]);

  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-base">Tus evaluaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const completed = assessments.filter((a) => a.status !== "draft");
  const scores = completed.map((a) => getScore(a));
  const hasChart = completed.filter((_, i) => scores[i] !== null).length >= 2;

  const chartData = completed
    .map((a, i) => ({ date: formatDateShort(a.createdAt), score: scores[i], label: a.company?.name ?? `Eval ${i + 1}` }))
    .filter((d) => d.score !== null);

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          <CardTitle className="text-base">Tus evaluaciones</CardTitle>
        </div>
        <CardDescription>
          {assessments.length === 0
            ? "Aún no realizaste ninguna evaluación."
            : `${assessments.length} evaluación${assessments.length > 1 ? "es" : ""} · ${completed.length} completada${completed.length !== 1 ? "s" : ""}`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {assessments.length === 0 ? (
          <div className="text-center py-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              Comenzá tu primera evaluación de madurez con MGM Certifications.
            </p>
          </div>
        ) : (
          <>
            {hasChart && (
              <div className="rounded-md border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                  Evolución de madurez
                </p>
                <ResponsiveContainer width="100%" height={110}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "12px",
                      }}
                      formatter={(v: number) => [`${v}%`, "Madurez"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#scoreGrad)"
                      dot={{ r: 3, fill: "hsl(var(--primary))" }}
                      activeDot={{ r: 5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="space-y-2">
              {[...assessments].reverse().map((assessment, reversedIdx) => {
                const originalIdx = assessments.length - 1 - reversedIdx;
                const score = getScore(assessment);
                const prevScore = originalIdx > 0 ? getScore(assessments[originalIdx - 1]) : null;
                const delta =
                  score !== null && prevScore !== null ? score - prevScore : null;
                const meta = PLAN_META[assessment.type as AssessmentType] ?? PLAN_META.premium;
                const PlanIcon = meta.icon;
                const canViewReport = assessment.status !== "draft";

                return (
                  <div
                    key={assessment.id}
                    className="rounded-md border border-border bg-card/50 p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {assessment.company?.name ?? "Empresa"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(assessment.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant={meta.variant} className="text-xs flex items-center gap-0.5 px-1.5 py-0">
                          <PlanIcon className="h-2.5 w-2.5" />
                          {meta.label}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {score !== null ? (
                          <span className="text-lg font-bold text-primary">{score}%</span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            {STATUS_LABEL[assessment.status] ?? assessment.status}
                          </span>
                        )}
                        <ScoreDelta delta={delta} />
                      </div>
                      {canViewReport && (
                        <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <Link href={`/report/${assessment.id}`}>
                            Ver reporte <ExternalLink className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full text-xs mt-1"
        >
          <Link href="/dashboard">
            Nueva evaluación <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
