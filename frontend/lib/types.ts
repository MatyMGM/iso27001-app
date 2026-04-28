export type AssessmentStatus = "draft" | "completed" | "analyzed";
export type AnswerValue = "yes" | "partial" | "no" | "na";
export type Criticality = "alta" | "media" | "baja";

export interface Question {
  id: string;
  controlRef: string;
  controlName: string;
  domain: string;
  criticality: Criticality;
  questionText: string;
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
  aiReport: unknown | null;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  answers?: (Answer & { question?: Question })[];
}
