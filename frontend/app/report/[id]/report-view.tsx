"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, AlertCircle, Lock } from "lucide-react";
import { api } from "@/lib/api";
import type { Answer, AnswerValue, Assessment, AssessmentFramework, AssessmentType, Question } from "@/lib/types";
import {
  gapsFromAnswers,
  roadmapFromGaps,
  scoreByDomain,
  scoreFromAnswers,
} from "@/lib/score";
import { ScoreGauge } from "@/components/score-gauge";
import { DomainRadar } from "@/components/domain-radar";
import { GapTable } from "@/components/gap-table";
import { Roadmap } from "@/components/roadmap";

// ─── Framework configuration ──────────────────────────────────────────────────

interface FrameworkMeta {
  label: string;
  domains: string[];
  domainShort: Record<string, string>;
  radarDesc: string;
  controlsDesc: string;
}

const FRAMEWORK_META: Record<AssessmentFramework, FrameworkMeta> = {
  iso27001: {
    label: "ISO/IEC 27001:2022",
    domains: [
      "Controles organizacionales",
      "Controles de personas",
      "Controles físicos",
      "Controles tecnológicos",
    ],
    domainShort: {
      "Controles organizacionales": "A.5 Org.",
      "Controles de personas": "A.6 Personas",
      "Controles físicos": "A.7 Físicos",
      "Controles tecnológicos": "A.8 Tec.",
    },
    radarDesc: "A.5 Org · A.6 Personas · A.7 Físicos · A.8 Tec.",
    controlsDesc: "del Anexo A",
  },
  soc2: {
    label: "SOC 2",
    domains: [
      "Criterios Comunes",
      "Disponibilidad",
      "Confidencialidad",
      "Integridad de Procesamiento",
      "Privacidad",
    ],
    domainShort: {
      "Criterios Comunes": "CC",
      "Disponibilidad": "A",
      "Confidencialidad": "C",
      "Integridad de Procesamiento": "PI",
      "Privacidad": "P",
    },
    radarDesc: "CC · Disponibilidad · Confidencialidad · PI · Privacidad",
    controlsDesc: "Trust Service Criteria",
  },
  cis: {
    label: "CIS Controls v8",
    domains: ["IG1", "IG2", "IG3"],
    domainShort: {
      "IG1": "IG1 Básico",
      "IG2": "IG2 Interm.",
      "IG3": "IG3 Avanz.",
    },
    radarDesc: "IG1 Básico · IG2 Intermedio · IG3 Avanzado",
    controlsDesc: "CIS Controls v8",
  },
};

// ─── AI summary card ──────────────────────────────────────────────────────────

function AiSummaryCard({ aiReport, framework }: { aiReport: Record<string, unknown>; framework: AssessmentFramework }) {
  const summary =
    typeof aiReport.executiveSummary === "string"
      ? aiReport.executiveSummary
      : "Resumen ejecutivo no disponible.";
  const fwLabel = FRAMEWORK_META[framework]?.label ?? framework;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis ejecutivo IA</CardTitle>
        <CardDescription>
          Generado por LLaMA 3.3 70B · Groq · Marco: {fwLabel}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FALLBACK_AFTER_MS = 6000;
const POLL_INTERVAL_MS = 2000;

// ─── Main component ───────────────────────────────────────────────────────────

export function ReportView({ assessmentId }: { assessmentId: string }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<(Answer & { question?: Question })[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const assessmentType: AssessmentType = (assessment?.type as AssessmentType) ?? "premium";
  const assessmentFramework: AssessmentFramework = (assessment?.framework as AssessmentFramework) ?? "iso27001";
  const isPremium = assessmentType === "premium";
  const isFree = assessmentType === "free";
  const fwMeta = FRAMEWORK_META[assessmentFramework] ?? FRAMEWORK_META.iso27001;

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();
    let timer: ReturnType<typeof setTimeout> | null = null;

    async function tick() {
      try {
        const a = await api.getAssessment(assessmentId);
        if (cancelled) return;
        setAssessment(a);
        if (a.answers) setAnswers(a.answers);

        const elapsed = Date.now() - start;
        const type: AssessmentType = (a.type as AssessmentType) ?? "premium";

        if (type !== "premium") {
          setReady(true);
          return;
        }

        if (a.status === "analyzed" || elapsed >= FALLBACK_AFTER_MS) {
          setReady(true);
          return;
        }
        timer = setTimeout(tick, POLL_INTERVAL_MS);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        }
      }
    }
    void tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [assessmentId]);

  useEffect(() => {
    if (!assessment) return;
    const framework: AssessmentFramework = (assessment.framework as AssessmentFramework) ?? "iso27001";
    let cancelled = false;
    api
      .listQuestions(undefined, undefined, framework)
      .then((qs) => { if (!cancelled) setQuestions(qs); })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [assessment]);

  if (error) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>No se pudo cargar el reporte</CardTitle>
          </div>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Analizando respuestas con IA</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Estamos generando tu reporte de madurez con análisis inteligente. Esto puede tomar unos segundos...
        </p>
      </div>
    );
  }

  const answeredQuestionIds = new Set(answers.map((a) => a.questionId));
  const relevantQuestions = isFree
    ? questions.filter((q) => answeredQuestionIds.has(q.id))
    : questions;

  const unanswered: (Answer & { question?: Question })[] = relevantQuestions
    .filter((q) => !answeredQuestionIds.has(q.id))
    .map((q) => ({
      id: `synthetic-${q.id}`,
      assessmentId,
      questionId: q.id,
      value: "no" as AnswerValue,
      notes: null,
      question: q,
    }));
  const allAnswers = [...answers, ...unanswered];

  const overall = scoreFromAnswers(allAnswers);
  const byDomain = scoreByDomain(allAnswers);
  const radarData = fwMeta.domains.map((d) => ({
    domain: fwMeta.domainShort[d] ?? d,
    score: byDomain[d] ?? 0,
  }));
  const gaps = gapsFromAnswers(allAnswers);
  const phases = roadmapFromGaps(gaps);
  const totalAnswered = answers.length;
  const totalControls = relevantQuestions.length || allAnswers.length;
  const totalUnanswered = unanswered.length;
  const totalGaps = gaps.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs">{fwMeta.label}</Badge>
            {isFree && (
              <Badge variant="secondary" className="text-xs">
                Plan Gratis — evaluación reducida (alta criticidad)
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Reporte de madurez</h1>
          <p className="text-sm text-muted-foreground">
            {assessment?.company?.name ?? "Empresa"} · {totalAnswered} de{" "}
            {totalControls} controles respondidos
            {totalUnanswered > 0
              ? ` · ${totalUnanswered} sin respuesta (no implementados)`
              : ""}{" "}
            · {totalGaps} brechas detectadas
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {isPremium ? (
            <>
              <Button
                variant="outline"
                disabled={downloading}
                onClick={async () => {
                  setDownloading(true);
                  setDownloadError(null);
                  try {
                    await api.downloadReportPdf(assessmentId);
                  } catch (err) {
                    setDownloadError(
                      err instanceof Error ? err.message : "Error al descargar",
                    );
                  } finally {
                    setDownloading(false);
                  }
                }}
              >
                {downloading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {downloading ? "Generando PDF..." : "Descargar PDF"}
              </Button>
              {downloadError && (
                <p className="text-xs text-destructive">{downloadError}</p>
              )}
            </>
          ) : (
            <Button variant="outline" disabled className="opacity-60">
              <Lock className="mr-2 h-4 w-4" />
              PDF — Plan Premium
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Puntaje global</CardTitle>
            <CardDescription>
              Madurez ponderada de los controles{isFree ? " de alta criticidad" : ` ${fwMeta.controlsDesc}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <ScoreGauge score={overall} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Madurez por dominio</CardTitle>
            <CardDescription>{fwMeta.radarDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <DomainRadar data={radarData} />
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {radarData.map((d) => (
                <div
                  key={d.domain}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                >
                  <span className="text-muted-foreground">{d.domain}</span>
                  <Badge variant="outline">{d.score}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brechas detectadas</CardTitle>
          <CardDescription>
            Controles con implementación nula o parcial, ordenados por criticidad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GapTable gaps={gaps} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hoja de ruta de remediación</CardTitle>
          <CardDescription>
            Acciones priorizadas según criticidad y nivel de implementación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Roadmap phases={phases} />
        </CardContent>
      </Card>

      {isPremium && assessment?.aiReport
        ? <AiSummaryCard
            aiReport={assessment.aiReport as Record<string, unknown>}
            framework={assessmentFramework}
          />
        : null}
    </div>
  );
}
