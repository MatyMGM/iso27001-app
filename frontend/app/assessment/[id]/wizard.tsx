"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BenchmarkConsentModal } from "@/components/benchmark-consent-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api, type AnswerInput } from "@/lib/api";
import type { AnswerValue, AssessmentFramework, AssessmentType, Criticality, Question } from "@/lib/types";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Save,
  AlertCircle,
  Zap,
  Star,
  Crown,
} from "lucide-react";

// ─── Framework domain config ──────────────────────────────────────────────────

interface DomainConfig {
  id: string;
  label: string;
}

const FRAMEWORK_DOMAINS: Record<AssessmentFramework, DomainConfig[]> = {
  iso27001: [
    { id: "Controles organizacionales", label: "A.5 Organizacionales" },
    { id: "Controles de personas", label: "A.6 Personas" },
    { id: "Controles físicos", label: "A.7 Físicos" },
    { id: "Controles tecnológicos", label: "A.8 Tecnológicos" },
  ],
  soc2: [
    { id: "Criterios Comunes", label: "CC — Criterios Comunes" },
    { id: "Disponibilidad", label: "A — Disponibilidad" },
    { id: "Confidencialidad", label: "C — Confidencialidad" },
    { id: "Integridad de Procesamiento", label: "PI — Integridad" },
    { id: "Privacidad", label: "P — Privacidad" },
  ],
  cis: [
    { id: "IG1", label: "IG1 — Higiene básica" },
    { id: "IG2", label: "IG2 — Intermedio" },
    { id: "IG3", label: "IG3 — Avanzado" },
  ],
};

const FRAMEWORK_LABEL: Record<AssessmentFramework, string> = {
  iso27001: "ISO/IEC 27001:2022",
  soc2: "SOC 2",
  cis: "CIS Controls v8",
};

// ─── Static data ──────────────────────────────────────────────────────────────

const ANSWER_OPTIONS: { value: AnswerValue; label: string; helper: string }[] = [
  { value: "yes", label: "Sí", helper: "Implementado completamente" },
  { value: "partial", label: "Parcialmente", helper: "Cubre solo parte" },
  { value: "no", label: "No", helper: "No implementado" },
  { value: "na", label: "N/A", helper: "No aplica" },
];

const CRIT_VARIANT: Record<Criticality, "destructive" | "warning" | "secondary"> = {
  alta: "destructive",
  media: "warning",
  baja: "secondary",
};

const PLAN_LABEL: Record<AssessmentType, { label: string; icon: React.ElementType }> = {
  free: { label: "Gratis", icon: Zap },
  profesional: { label: "Profesional", icon: Star },
  premium: { label: "Premium", icon: Crown },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnswerState {
  value?: AnswerValue;
  notes?: string;
}

type SaveState = "idle" | "saving" | "saved" | "error";

// ─── Component ────────────────────────────────────────────────────────────────

export function Wizard({ assessmentId }: { assessmentId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SaveState>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("premium");
  const [assessmentFramework, setAssessmentFramework] = useState<AssessmentFramework>("iso27001");
  const [showConsent, setShowConsent] = useState(false);

  const answersRef = useRef<Record<string, AnswerState>>({});
  const dirty = useRef<Set<string>>(new Set());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const assessment = await api.getAssessment(assessmentId);
        const type: AssessmentType = (assessment.type as AssessmentType) ?? "premium";
        const framework: AssessmentFramework = (assessment.framework as AssessmentFramework) ?? "iso27001";
        if (mounted) {
          setAssessmentType(type);
          setAssessmentFramework(framework);
          if (assessment.benchmarkConsent === null || assessment.benchmarkConsent === undefined) {
            setShowConsent(true);
          }
        }

        const [qs, existing] = await Promise.all([
          api.listQuestions(undefined, type === "free" ? "free" : undefined, framework),
          api.listAnswers(assessmentId),
        ]);
        if (!mounted) return;
        setQuestions(qs);
        const map: Record<string, AnswerState> = {};
        for (const a of existing) {
          map[a.questionId] = { value: a.value, notes: a.notes ?? "" };
        }
        setAnswers(map);
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar las preguntas");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [assessmentId]);

  const grouped = useMemo(() => {
    const map: Record<string, Question[]> = {};
    for (const q of questions) {
      if (!map[q.domain]) map[q.domain] = [];
      map[q.domain].push(q);
    }
    return map;
  }, [questions]);

  const allDomains = FRAMEWORK_DOMAINS[assessmentFramework] ?? FRAMEWORK_DOMAINS.iso27001;
  const activeDomains = allDomains.filter((d) => (grouped[d.id] ?? []).length > 0);

  const currentDomain = activeDomains[step];
  const currentQuestions = grouped[currentDomain?.id] ?? [];

  const totalAnswered = Object.values(answers).filter((a) => a.value).length;
  const progressPct =
    questions.length === 0 ? 0 : Math.round((totalAnswered / questions.length) * 100);

  const stepAnswered = currentQuestions.filter((q) => answers[q.id]?.value).length;

  async function flushSave() {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    const ids = Array.from(dirty.current);
    if (ids.length === 0) {
      setSaving((s) => (s === "saving" ? "idle" : s));
      return;
    }
    const payload: AnswerInput[] = [];
    for (const qid of ids) {
      const a = answersRef.current[qid];
      if (!a?.value) continue;
      payload.push({ questionId: qid, value: a.value, notes: a.notes || undefined });
    }
    dirty.current.clear();
    if (payload.length === 0) {
      setSaving("idle");
      return;
    }
    try {
      setSaving("saving");
      await api.bulkUpsertAnswers(assessmentId, payload);
      setSaving("saved");
      setTimeout(() => setSaving((s) => (s === "saved" ? "idle" : s)), 1500);
    } catch (err) {
      console.error(err);
      setSaving("error");
      toast.error("Error al guardar respuestas");
    }
  }

  function scheduleSave() {
    setSaving("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void flushSave(), 800);
  }

  function setValue(qid: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [qid]: { ...prev[qid], value } }));
    dirty.current.add(qid);
    scheduleSave();
  }

  function setNotes(qid: string, notes: string) {
    setAnswers((prev) => ({ ...prev, [qid]: { ...prev[qid], notes } }));
    if (answersRef.current[qid]?.value) {
      dirty.current.add(qid);
      scheduleSave();
    }
  }

  async function goNext() {
    await flushSave();
    setStep((s) => Math.min(activeDomains.length - 1, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goPrev() {
    setStep((s) => Math.max(0, s - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function jumpTo(i: number) {
    void flushSave();
    setStep(i);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleConsent(consent: boolean) {
    try {
      await api.updateAssessment(assessmentId, { benchmarkConsent: consent });
    } catch {
      // non-critical
    }
    setShowConsent(false);
  }

  async function finish() {
    setSubmitting(true);
    try {
      await flushSave();
      await api.updateAssessment(assessmentId, { status: "completed" });
      if (assessmentType === "premium") {
        await api.analyzeAssessment(assessmentId);
      }
      router.push(`/report/${assessmentId}`);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo finalizar la evaluación");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const planInfo = PLAN_LABEL[assessmentType];
  const PlanIcon = planInfo.icon;

  return (
    <>
      {showConsent && <BenchmarkConsentModal onConsent={handleConsent} />}
      <div className="space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {FRAMEWORK_LABEL[assessmentFramework]}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <PlanIcon className="h-3 w-3" />
                  Plan {planInfo.label}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold">
                Evaluación {FRAMEWORK_LABEL[assessmentFramework]}
              </h1>
              <p className="text-sm text-muted-foreground">
                Paso {step + 1} de {activeDomains.length} · {currentDomain?.label}
              </p>
            </div>
            <SaveBadge state={saving} />
          </div>
          <Progress value={progressPct} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {totalAnswered} de {questions.length} controles respondidos
            </span>
            <span>{progressPct}%</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {activeDomains.map((d, i) => {
              const count = (grouped[d.id] ?? []).length;
              const answered = (grouped[d.id] ?? []).filter((q) => answers[q.id]?.value).length;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={`text-xs rounded-md px-3 py-1.5 border transition-colors ${
                    i === step
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {d.label}{" "}
                  <span className="opacity-70">({answered}/{count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {currentQuestions.map((q) => {
            const a = answers[q.id];
            return (
              <Card key={q.id}>
                <CardHeader className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{q.controlRef}</span>
                    <Badge variant={CRIT_VARIANT[q.criticality]} className="capitalize">
                      {q.criticality}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{q.controlName}</CardTitle>
                  <CardDescription className="text-foreground/80">{q.questionText}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={a?.value ?? ""}
                    onValueChange={(v) => setValue(q.id, v as AnswerValue)}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
                  >
                    {ANSWER_OPTIONS.map((opt) => {
                      const id = `${q.id}-${opt.value}`;
                      const selected = a?.value === opt.value;
                      return (
                        <Label
                          key={opt.value}
                          htmlFor={id}
                          className={`cursor-pointer rounded-md border p-3 transition-colors ${
                            selected
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem id={id} value={opt.value} />
                            <span className="font-medium">{opt.label}</span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">{opt.helper}</p>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`${q.id}-notes`}
                      className="text-xs uppercase tracking-wide text-muted-foreground"
                    >
                      Notas (opcional)
                    </Label>
                    <Textarea
                      id={`${q.id}-notes`}
                      value={a?.notes ?? ""}
                      onChange={(e) => setNotes(q.id, e.target.value)}
                      placeholder="Evidencia, observaciones, responsables..."
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {stepAnswered < currentQuestions.length && step === activeDomains.length - 1 ? (
          <div className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">
            <AlertCircle className="h-4 w-4" />
            Te faltan {currentQuestions.length - stepAnswered} controles por responder en este paso.
          </div>
        ) : null}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
          <Button variant="outline" onClick={goPrev} disabled={step === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          {step < activeDomains.length - 1 ? (
            <Button onClick={goNext}>
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finish} disabled={submitting} size="lg">
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              {assessmentType === "premium" ? "Finalizar y analizar con IA" : "Finalizar evaluación"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function SaveBadge({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  if (state === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Guardando...
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-400">
        <Save className="h-3 w-3" /> Guardado
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle className="h-3 w-3" /> Error al guardar
    </span>
  );
}
