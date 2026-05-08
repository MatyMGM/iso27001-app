"use client";

import { useState } from "react";
import { ShieldCheck, BarChart2, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onConsent: (consent: boolean) => Promise<void>;
}

export function BenchmarkConsentModal({ onConsent }: Props) {
  const [loading, setLoading] = useState(false);

  async function handle(consent: boolean) {
    setLoading(true);
    await onConsent(consent);
    setLoading(false);
  }

  return (
    /* full-screen overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 space-y-5">
        {/* icon + title */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-3">
              <BarChart2 className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">Contribuir al benchmark</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Antes de comenzar la evaluación, queremos preguntarte algo.
            </p>
          </div>
        </div>

        {/* body */}
        <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3 text-sm">
          <p className="text-foreground/90 leading-relaxed">
            ¿Autorizás el uso <strong>anónimo</strong> de los resultados de esta
            evaluación para calcular el benchmark de madurez de seguridad de la
            industria?
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              Los datos se publican de forma completamente anónima, sin
              identificación de empresa ni personas.
            </li>
            <li className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              Solo se usa el puntaje numérico final, nunca los detalles de las
              respuestas individuales.
            </li>
            <li className="flex items-start gap-2">
              <BarChart2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              Permite a todas las organizaciones compararse con el promedio de
              la industria.
            </li>
          </ul>
        </div>

        {/* actions */}
        <div className="flex flex-col gap-2">
          <Button
            className="w-full"
            onClick={() => handle(true)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BarChart2 className="mr-2 h-4 w-4" />
            )}
            Sí, autorizo el uso anónimo
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => handle(false)}
            disabled={loading}
          >
            No, prefiero no participar
          </Button>
        </div>
      </div>
    </div>
  );
}
