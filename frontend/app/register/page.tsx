"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre de la empresa es requerido");
      return;
    }
    setSubmitting(true);
    try {
      const company = await api.createCompany({
        name: name.trim(),
        industry: industry.trim() || undefined,
        size: size.trim() || undefined,
      });
      const assessment = await api.createAssessment(company.id);
      router.push(`/assessment/${assessment.id}`);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo crear la evaluación. Verificá el backend.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Registrar empresa</CardTitle>
          <CardDescription>
            Comenzá una nueva evaluación de seguridad de la información.
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
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
              size="lg"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear evaluación
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
