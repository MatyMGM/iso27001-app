"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { getUser, isAuthenticated } from "@/lib/auth";
import type { AssessmentFramework, AssessmentType } from "@/lib/types";
import { Loader2, Zap, Star, Crown, Shield, BookOpen, Target } from "lucide-react";

const PLAN_META: Record<
  AssessmentType,
  { label: string; icon: React.ElementType; variant: "secondary" | "warning" | "destructive" }
> = {
  free: { label: "Gratis", icon: Zap, variant: "secondary" },
  profesional: { label: "Profesional", icon: Star, variant: "warning" },
  premium: { label: "Premium", icon: Crown, variant: "destructive" },
};

const FRAMEWORK_META: Record<
  AssessmentFramework,
  { label: string; icon: React.ElementType }
> = {
  iso27001: { label: "ISO 27001:2022", icon: Shield },
  soc2: { label: "SOC 2", icon: BookOpen },
  cis: { label: "CIS Controls v8", icon: Target },
};

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawPlan = searchParams.get("plan") ?? "premium";
  const plan: AssessmentType = ["free", "profesional", "premium"].includes(rawPlan)
    ? (rawPlan as AssessmentType)
    : "premium";

  const rawFramework = searchParams.get("framework") ?? "iso27001";
  const framework: AssessmentFramework = ["iso27001", "soc2", "cis"].includes(rawFramework)
    ? (rawFramework as AssessmentFramework)
    : "iso27001";

  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre de la empresa es requerido");
      return;
    }
    setSubmitting(true);
    try {
      const user = getUser();
      const company = await api.createCompany({
        name: name.trim(),
        industry: industry.trim() || undefined,
        size: size.trim() || undefined,
        userId: user?.id,
      });
      const assessment = await api.createAssessment(company.id, plan, framework);
      router.push(`/assessment/${assessment.id}`);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo crear la evaluación. Verificá el backend.");
      setSubmitting(false);
    }
  }

  const planMeta = PLAN_META[plan];
  const PlanIcon = planMeta.icon;
  const fwMeta = FRAMEWORK_META[framework];
  const FwIcon = fwMeta.icon;

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5">
              <FwIcon className="h-3 w-3" />
              {fwMeta.label}
            </Badge>
            <Badge variant={planMeta.variant} className="flex items-center gap-1 px-2 py-0.5">
              <PlanIcon className="h-3 w-3" />
              Plan {planMeta.label}
            </Badge>
          </div>
          <CardTitle>Registrar empresa</CardTitle>
          <CardDescription>
            Completá los datos de tu organización para comenzar la evaluación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la empresa *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Acme S.A."
                autoFocus
                required
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">Industria</Label>
                <Input
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Tecnología, Finanzas, Salud..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Tamaño</Label>
                <Input
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="Pequeña / Mediana / Grande"
                />
              </div>
            </div>
            <Button type="submit" disabled={submitting} className="w-full" size="lg">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear evaluación
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
