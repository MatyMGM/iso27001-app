"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ListChecks, LineChart, Map } from "lucide-react";
import Image from "next/image";
import { isAuthenticated } from "@/lib/auth";
import { BenchmarkChart } from "@/components/benchmark-chart";

const FEATURES = [
  {
    icon: ListChecks,
    title: "Múltiples marcos de evaluación",
    desc: "ISO 27001:2022, SOC 2 Trust Service Criteria y CIS Controls v8 en un mismo flujo guiado.",
  },
  {
    icon: LineChart,
    title: "Diagnóstico de madurez",
    desc: "Puntaje global y radar por dominio para identificar fortalezas y brechas.",
  },
  {
    icon: Map,
    title: "Hoja de ruta",
    desc: "Acciones priorizadas por criticidad para cerrar brechas de seguridad.",
  },
];

export default function HomePage() {
  const router = useRouter();

  function handleStart() {
    router.push(isAuthenticated() ? "/dashboard" : "/login");
  }

  return (
    <div className="space-y-12">
      <section className="mx-auto max-w-3xl text-center pt-8 md:pt-16">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="MGM Certifications"
            width={100}
            height={100}
            className="rounded-2xl"
            priority
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="text-primary">MGM Certifications</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground font-medium">
          Evaluaciones de madurez en ciberseguridad
        </p>
        <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
          Evaluá tu organización contra los principales marcos de seguridad —
          ISO 27001, SOC 2 y CIS Controls — y obtené un reporte de brechas,
          hoja de ruta y nivel de madurez.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" onClick={handleStart}>
            Comenzar evaluación <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <CardContent className="pt-6">
              <f.icon className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <BenchmarkChart />
    </div>
  );
}
