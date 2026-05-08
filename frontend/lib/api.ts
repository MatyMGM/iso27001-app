import { getToken } from "./auth";
import type {
  Answer,
  AnswerValue,
  Assessment,
  AssessmentFramework,
  AssessmentStatus,
  AssessmentType,
  BenchmarkData,
  Company,
  Question,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export interface AuthResponse {
  user: { id: string; email: string; name?: string | null; createdAt: string };
  token: string;
}

export const api = {
  // Auth
  register: (data: { email: string; password: string; name?: string }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<{ id: string; email: string; name?: string | null }>("/auth/me"),

  // Companies
  createCompany: (data: {
    name: string;
    industry?: string;
    size?: string;
    userId?: string;
  }) =>
    request<Company>("/companies", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Assessments
  createAssessment: (companyId: string, type?: AssessmentType, framework?: AssessmentFramework) =>
    request<Assessment>("/assessments", {
      method: "POST",
      body: JSON.stringify({ companyId, type, framework }),
    }),

  getAssessment: (id: string) => request<Assessment>(`/assessments/${id}`),

  updateAssessment: (
    id: string,
    data: { status?: AssessmentStatus; benchmarkConsent?: boolean },
  ) =>
    request<Assessment>(`/assessments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  getBenchmark: () => request<BenchmarkData>("/assessments/benchmark"),

  analyzeAssessment: (id: string) =>
    request<{ status: string }>(`/assessments/${id}/analyze`, {
      method: "POST",
    }),

  // Questions
  listQuestions: (domain?: string, tier?: AssessmentType, framework?: AssessmentFramework) =>
    request<Question[]>(
      `/questions${buildQueryString({ domain, tier, framework })}`,
    ),

  getUserAssessments: (userId: string) =>
    request<Assessment[]>(`/assessments/by-user/${userId}`),

  // Answers
  listAnswers: (assessmentId: string) =>
    request<(Answer & { question?: Question })[]>(
      `/assessments/${assessmentId}/answers`,
    ),

  bulkUpsertAnswers: (assessmentId: string, answers: AnswerInput[]) =>
    request<Answer[]>(`/assessments/${assessmentId}/answers/bulk`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  // PDF
  reportPdfUrl: (assessmentId: string) =>
    `${API_URL}/assessments/${assessmentId}/report/pdf`,

  downloadReportPdf: async (assessmentId: string) => {
    const token = getToken();
    const res = await fetch(
      `${API_URL}/assessments/${assessmentId}/report/pdf`,
      {
        method: "GET",
        cache: "no-store",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
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

function buildQueryString(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join("&");
}
