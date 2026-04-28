import type {
  Answer,
  AnswerValue,
  Assessment,
  AssessmentStatus,
  Company,
  Question,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface AnswerInput {
  questionId: string;
  value: AnswerValue;
  notes?: string;
}

export const api = {
  createCompany: (data: { name: string; industry?: string; size?: string }) =>
    request<Company>("/companies", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createAssessment: (companyId: string) =>
    request<Assessment>("/assessments", {
      method: "POST",
      body: JSON.stringify({ companyId }),
    }),

  getAssessment: (id: string) => request<Assessment>(`/assessments/${id}`),

  updateAssessment: (id: string, data: { status?: AssessmentStatus }) =>
    request<Assessment>(`/assessments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  analyzeAssessment: (id: string) =>
    request<{ status: string }>(`/assessments/${id}/analyze`, {
      method: "POST",
    }),

  listQuestions: (domain?: string) =>
    request<Question[]>(
      `/questions${domain ? `?domain=${encodeURIComponent(domain)}` : ""}`,
    ),

  listAnswers: (assessmentId: string) =>
    request<(Answer & { question?: Question })[]>(
      `/assessments/${assessmentId}/answers`,
    ),

  bulkUpsertAnswers: (assessmentId: string, answers: AnswerInput[]) =>
    request<Answer[]>(`/assessments/${assessmentId}/answers/bulk`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  reportPdfUrl: (assessmentId: string) =>
    `${API_URL}/assessments/${assessmentId}/report/pdf`,

  downloadReportPdf: async (assessmentId: string) => {
    const res = await fetch(
      `${API_URL}/assessments/${assessmentId}/report/pdf`,
      { method: "GET", cache: "no-store" },
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API ${res.status}: ${text || res.statusText}`);
    }
    const disposition = res.headers.get("content-disposition") ?? "";
    const match = /filename="?([^"]+)"?/i.exec(disposition);
    const filename = match?.[1] ?? `iso27001-reporte-${assessmentId}.pdf`;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
