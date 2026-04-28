import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  ShieldCheck,
  ListChecks,
  LineChart,
  Map,
} from "lucide-react";

const FEATURES = [
  {
    icon: ListChecks,
    title: "93 controles del Anexo A",
    desc: "Cuestionario guiado dividido por dominios A.5, A.6, A.7 y A.8.",
  },
  {
    icon: LineChart,
    title: "Diagnóstico de madurez",
    desc: "Puntaje global y radar por dominio para identificar fortalezas.",
  },
  {
    icon: Map,
    title: "Hoja de ruta",
    desc: "Acciones priorizadas por criticidad para cerrar brechas.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="mx-auto max-w-3xl text-center pt-8 md:pt-16">
        <div className="mx-auto mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Evaluación de madurez{" "}
          <span className="text-primary">ISO 27001:2022</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Respondé un cuestionario sobre los 93 controles del Anexo A y obtené
          un reporte de brechas, hoja de ruta y nivel de madurez de seguridad de
          la información.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register">
              Comenzar evaluación <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
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
    </div>
  );
}
