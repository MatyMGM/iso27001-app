"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Zap,
  Star,
  Crown,
  ArrowRight,
  Lock,
  Shield,
  BookOpen,
  Target,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { clearAuth, getUser, isAuthenticated } from "@/lib/auth";
import type { AssessmentFramework, AssessmentType } from "@/lib/types";

// ─── Frameworks ───────────────────────────────────────────────────────────────

interface Framework {
  id: AssessmentFramework;
  name: string;
  shortName: string;
  description: string;
  icon: React.ElementType;
  badge: string;
  controls: string;
  features: string[];
}

const FRAMEWORKS: Framework[] = [
  {
    id: "iso27001",
    name: "ISO/IEC 27001:2022",
    shortName: "ISO 27001",
    description: "Estándar internacional para sistemas de gestión de seguridad de la información.",
    icon: Shield,
    badge: "93 controles",
    controls: "Anexo A · 4 dominios",
    features: [
      "A.5 Controles organizacionales (37)",
      "A.6 Controles de personas (8)",
      "A.7 Controles físicos (14)",
      "A.8 Controles tecnológicos (34)",
    ],
  },
  {
    id: "soc2",
    name: "SOC 2",
    shortName: "SOC 2",
    description: "Marco del AICPA para evaluar controles sobre seguridad, disponibilidad, confidencialidad, integridad del procesamiento y privacidad.",
    icon: BookOpen,
    badge: "53 criterios",
    controls: "Trust Service Criteria · 5 categorías",
    features: [
      "CC — Criterios Comunes (33 criterios)",
      "A — Disponibilidad (3 criterios)",
      "C — Confidencialidad (2 criterios)",
      "PI — Integridad de Procesamiento (5)",
      "P — Privacidad (10 criterios)",
    ],
  },
  {
    id: "cis",
    name: "CIS Controls v8",
    shortName: "CIS v8",
    description: "Controles priorizados de ciberseguridad del Center for Internet Security, organizados por Implementation Groups.",
    icon: Target,
    badge: "56 salvaguardas",
    controls: "3 Implementation Groups (IG1/IG2/IG3)",
    features: [
      "IG1 — Higiene básica (25 salvaguardas)",
      "IG2 — Controles intermedios (20 salvaguardas)",
      "IG3 — Controles avanzados (11 salvaguardas)",
    ],
  },
];

// ─── Plans ────────────────────────────────────────────────────────────────────

interface Plan {
  id: AssessmentType;
  name: string;
  badge: string | null;
  badgeVariant: "secondary" | "warning" | "destructive";
  price: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  cta: string;
  paid: boolean;
}

function getPlans(framework: AssessmentFramework): Plan[] {
  const freeLabel =
    framework === "iso27001"
      ? "~25 controles de alta criticidad"
      : framework === "soc2"
      ? "~25 criterios CC de alta criticidad"
      : "~25 salvaguardas IG1 de alta criticidad";

  const fullLabel =
    framework === "iso27001"
      ? "93 controles del Anexo A"
      : framework === "soc2"
      ? "53 Trust Service Criteria"
      : "56 salvaguardas (IG1 + IG2 + IG3)";

  return [
    {
      id: "free",
      name: "Gratis",
      badge: "GRATIS",
      badgeVariant: "secondary",
      price: "$0",
      description: "Evaluación rápida con los controles/criterios de mayor criticidad.",
      icon: Zap,
      features: [
        freeLabel,
        "Puntaje global por dominio",
        "Listado de brechas detectadas",
        "Hoja de ruta básica",
      ],
      cta: "Comenzar gratis",
      paid: false,
    },
    {
      id: "profesional",
      name: "Profesional",
      badge: "PAGO",
      badgeVariant: "warning",
      price: "$XX/mes",
      description: `Evaluación completa — ${fullLabel}.`,
      icon: Star,
      features: [
        fullLabel,
        "Puntaje detallado por dominio",
        "Radar de madurez interactivo",
        "Hoja de ruta priorizada",
      ],
      cta: "Iniciar evaluación",
      paid: true,
    },
    {
      id: "premium",
      name: "Premium",
      badge: "PAGO",
      badgeVariant: "destructive",
      price: "$XX/mes",
      description: "Todo lo del plan Profesional más análisis ejecutivo con IA y reporte PDF.",
      icon: Crown,
      features: [
        fullLabel,
        "Análisis ejecutivo con IA (LLaMA)",
        "Hoja de ruta con recomendaciones IA",
        "Descarga del reporte en PDF",
      ],
      cta: "Iniciar evaluación",
      paid: true,
    },
  ];
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<AssessmentFramework | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const user = getUser();
    setUserName(user?.name ?? user?.email ?? null);
  }, [router]);

  function selectPlan(plan: Plan) {
    if (!selectedFramework) return;
    router.push(`/register?plan=${plan.id}&framework=${selectedFramework}`);
  }

  function handleLogout() {
    clearAuth();
    router.push("/login");
  }

  const plans = selectedFramework ? getPlans(selectedFramework) : [];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {userName ? `Bienvenido, ${userName.split(" ")[0]}` : "Bienvenido"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedFramework
              ? "Elegí el tipo de evaluación que querés realizar."
              : "Elegí el marco de evaluación con el que querés trabajar."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 text-sm">
        <div className={`flex items-center gap-1.5 font-medium ${!selectedFramework ? "text-primary" : "text-muted-foreground"}`}>
          <span className={`flex items-center justify-center rounded-full h-6 w-6 text-xs font-bold ${!selectedFramework ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>1</span>
          Marco de evaluación
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className={`flex items-center gap-1.5 font-medium ${selectedFramework ? "text-primary" : "text-muted-foreground"}`}>
          <span className={`flex items-center justify-center rounded-full h-6 w-6 text-xs font-bold ${selectedFramework ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>2</span>
          Plan
        </div>
      </div>

      {/* Step 1: Framework selection */}
      {!selectedFramework && (
        <div className="grid gap-6 md:grid-cols-3">
          {FRAMEWORKS.map((fw) => {
            const Icon = fw.icon;
            return (
              <Card
                key={fw.id}
                className="relative flex flex-col cursor-pointer transition-shadow hover:shadow-lg hover:border-primary/50"
                onClick={() => setSelectedFramework(fw.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center justify-center rounded-md bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">{fw.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{fw.name}</CardTitle>
                  <p className="text-xs text-primary font-medium">{fw.controls}</p>
                  <CardDescription>{fw.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {fw.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline">
                    Seleccionar <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Step 2: Plan selection */}
      {selectedFramework && (
        <>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedFramework(null)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Cambiar marco
            </Button>
            <div className="flex items-center gap-2">
              {(() => {
                const fw = FRAMEWORKS.find((f) => f.id === selectedFramework);
                if (!fw) return null;
                const Icon = fw.icon;
                return (
                  <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
                    <Icon className="h-3.5 w-3.5" />
                    {fw.name}
                  </Badge>
                );
              })()}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col transition-shadow hover:shadow-lg ${
                    plan.id === "premium"
                      ? "border-primary/50 shadow-primary/10 shadow-md"
                      : ""
                  }`}
                >
                  {plan.id === "premium" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3">
                        Más completo
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center justify-center rounded-md bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {plan.badge && (
                        <Badge variant={plan.badgeVariant}>{plan.badge}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-2xl font-bold">
                      {plan.paid ? (
                        <span className="flex items-center gap-2">
                          {plan.price}
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </span>
                      ) : (
                        plan.price
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.paid && (
                      <p className="mt-4 text-xs text-muted-foreground border-t border-border pt-3">
                        * Pago no implementado — podés acceder durante el período de prueba.
                      </p>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={plan.id === "premium" ? "default" : "outline"}
                      onClick={() => selectPlan(plan)}
                    >
                      {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
