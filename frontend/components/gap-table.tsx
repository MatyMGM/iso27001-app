"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Gap } from "@/lib/score";

const CRIT_VARIANT = {
  alta: "destructive",
  media: "warning",
  baja: "secondary",
} as const;

const STATUS_LABEL: Record<Gap["status"], string> = {
  no: "No implementado",
  partial: "Parcial",
};

export function GapTable({ gaps }: { gaps: Gap[] }) {
  if (gaps.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No se identificaron brechas: todos los controles aplicables están
        implementados.
      </p>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[110px]">Control</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead className="hidden md:table-cell">Dominio</TableHead>
          <TableHead>Criticidad</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gaps.map((g) => (
          <TableRow key={g.controlRef}>
            <TableCell className="font-mono text-xs">{g.controlRef}</TableCell>
            <TableCell>
              <div className="font-medium">{g.controlName}</div>
              {g.notes ? (
                <div className="mt-1 text-xs text-muted-foreground">
                  {g.notes}
                </div>
              ) : null}
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
              {g.domain}
            </TableCell>
            <TableCell>
              <Badge
                variant={CRIT_VARIANT[g.criticality]}
                className="capitalize"
              >
                {g.criticality}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={g.status === "no" ? "destructive" : "warning"}>
                {STATUS_LABEL[g.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
