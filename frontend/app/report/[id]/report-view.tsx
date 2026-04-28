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
import { Loader2, Download, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { Answer, AnswerValue, Assessment, Question } from "@/lib/types";
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

const ALL_DOMAINS = [
  "Controles organizacionales",
  "Controles de personas",
  "Controles físicos",
  "Controles tecnológicos",
];

const DOMAIN_SHORT: Record<string, string> = {
  "Controles organizacionales": "A.5 Org.",
  "Controles de personas": "A.6 Personas",
  "Controles físicos": "A.7 Físicos",
  "Controles tecnológicos": "A.8 Tec.",
};

// Backend `/analyze` is a stub: we keep polling for `status === "analyzed"`
// but fall back to a client-computed report after a few seconds so the user
// always lands on a useful screen.
const FALLBACK_AFTER_MS = 6000;
const POLL_INTERVAL_MS = 2000;

export function ReportView({ assessmentId }: { assessmentId: string }) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<(Answer & { question?: Question })[]>(
    [],
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

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
    let cancelled = false;
    api
      .listQuestions()
      .then((qs) => {
        if (!cancelled) setQuestions(qs);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

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
        <h2 className="text-xl font-semibold">Analizando respuestas</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Estamos generando tu reporte de madurez. Esto puede tomar unos
          segundos...
        </p>
      </div>
    );
  }

  const answeredIds = new Set(answers.map((a) => a.questionId));
  const unanswered: (Answer & { question?: Question })[] = questions
    .filter((q) => !answeredIds.has(q.id))
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
  const radarData = ALL_DOMAINS.map((d) => ({
    domain: DOMAIN_SHORT[d] ?? d,
    score: byDomain[d] ?? 0,
  }));
  const gaps = gapsFromAnswers(allAnswers);
  const phases = roadmapFromGaps(gaps);
  const totalAnswered = answers.length;
  const totalControls = questions.length || allAnswers.length;
  const totalUnanswered = unanswered.length;
  const totalGaps = gaps.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Reporte de madurez
          </h1>
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
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Puntaje global</CardTitle>
            <CardDescription>
              Madurez ponderada de los controles del Anexo A
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <ScoreGauge score={overall} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Madurez por dominio</CardTitle>
            <CardDescription>
              A.5 Org · A.6 Personas · A.7 Físicos · A.8 Tec.
            </CardDescription>
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
            Controles con implementación nula o parcial, ordenados por
            criticidad.
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
    </div>
  );
}
