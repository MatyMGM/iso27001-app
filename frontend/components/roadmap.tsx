import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import type { RoadmapPhase } from "@/lib/score";

export function Roadmap({ phases }: { phases: RoadmapPhase[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {phases.map((phase) => (
        <Card key={phase.title}>
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                {phase.window}
              </span>
            </div>
            <CardTitle className="text-base">{phase.title}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {phase.items.length} acción
              {phase.items.length === 1 ? "" : "es"}
            </p>
          </CardHeader>
          <CardContent>
            {phase.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sin acciones pendientes en esta fase.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {phase.items.slice(0, 8).map((g) => (
                  <li key={g.controlRef} className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-muted-foreground shrink-0">
                      {g.controlRef}
                    </span>
                    <span className="leading-snug">{g.controlName}</span>
                  </li>
                ))}
                {phase.items.length > 8 && (
                  <li className="text-xs text-muted-foreground">
                    + {phase.items.length - 8} controles más
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
