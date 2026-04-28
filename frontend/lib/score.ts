import type { Answer, AnswerValue, Criticality, Question } from "./types";

const VALUE_WEIGHT: Record<AnswerValue, number | null> = {
  yes: 1,
  partial: 0.5,
  no: 0,
  na: null,
};

export function scoreFromAnswers(answers: { value: AnswerValue }[]): number {
  const counted = answers.filter((a) => VALUE_WEIGHT[a.value] !== null);
  if (counted.length === 0) return 0;
  const sum = counted.reduce((acc, a) => acc + (VALUE_WEIGHT[a.value] ?? 0), 0);
  return Math.round((sum / counted.length) * 100);
}

export function scoreByDomain(
  answers: (Answer & { question?: Question })[],
): Record<string, number> {
  const groups: Record<string, { value: AnswerValue }[]> = {};
  for (const a of answers) {
    const domain = a.question?.domain ?? "Otros";
    if (!groups[domain]) groups[domain] = [];
    groups[domain].push({ value: a.value });
  }
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(groups)) out[k] = scoreFromAnswers(v);
  return out;
}

export interface Gap {
  controlRef: string;
  controlName: string;
  domain: string;
  criticality: Criticality;
  status: "no" | "partial";
  notes?: string | null;
}

const CRIT_ORDER: Record<Criticality, number> = { alta: 0, media: 1, baja: 2 };

export function gapsFromAnswers(
  answers: (Answer & { question?: Question })[],
): Gap[] {
  return answers
    .filter((a) => (a.value === "no" || a.value === "partial") && a.question)
    .map((a) => ({
      controlRef: a.question!.controlRef,
      controlName: a.question!.controlName,
      domain: a.question!.domain,
      criticality: a.question!.criticality,
      status: a.value as "no" | "partial",
      notes: a.notes,
    }))
    .sort(
      (x, y) =>
        CRIT_ORDER[x.criticality] - CRIT_ORDER[y.criticality] ||
        x.controlRef.localeCompare(y.controlRef),
    );
}

export interface RoadmapPhase {
  title: string;
  window: string;
  items: Gap[];
}

export function roadmapFromGaps(gaps: Gap[]): RoadmapPhase[] {
  const corto = gaps.filter((g) => g.criticality === "alta" && g.status === "no");
  const medio = gaps.filter(
    (g) =>
      (g.criticality === "alta" && g.status === "partial") ||
      (g.criticality === "media" && g.status === "no"),
  );
  const largo = gaps.filter(
    (g) =>
      (g.criticality === "media" && g.status === "partial") ||
      g.criticality === "baja",
  );
  return [
    { title: "Fase 1 — Inmediato", window: "0–30 días", items: corto },
    { title: "Fase 2 — Corto plazo", window: "30–90 días", items: medio },
    { title: "Fase 3 — Mediano plazo", window: "90–180 días", items: largo },
  ];
}
