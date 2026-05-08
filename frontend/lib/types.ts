export type AssessmentStatus = "draft" | "completed" | "analyzed";
export type AssessmentType = "free" | "profesional" | "premium";
export type AssessmentFramework = "iso27001" | "soc2" | "cis";
export type AnswerValue = "yes" | "partial" | "no" | "na";
export type Criticality = "alta" | "media" | "baja";

export interface Question {
  id: string;
  controlRef: string;
  controlName: string;
  domain: string;
  criticality: Criticality;
  questionText: string;
  framework?: AssessmentFramework;
}

export interface Answer {
  id: string;
  assessmentId: string;
  questionId: string;
  value: AnswerValue;
  notes?: string | null;
  question?: Question;
}

export interface Company {
  id: string;
  name: string;
  industry?: string | null;
  size?: string | null;
}

export interface Assessment {
  id: string;
  companyId: string;
  status: AssessmentStatus;
  type: AssessmentType;
  framework: AssessmentFramework;
  aiReport: unknown | null;
  benchmarkConsent: boolean | null;
  computedScore: number | null;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  answers?: (Answer & { question?: Question })[];
}

export interface BenchmarkData {
  totalAssessments: number;
  avgOverallScore: number;
  avgByDomain: { domain: string; avg: number }[];
  scoreDistribution: { label: string; count: number }[];
}
