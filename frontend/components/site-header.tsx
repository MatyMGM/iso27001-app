"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  PanelRightOpen,
  X,
  LogOut,
  User,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Star,
  Crown,
  ClipboardList,
  Plus,
  FileText,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { clearAuth, getUser, isAuthenticated } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";
import { api } from "@/lib/api";
import { scoreFromAnswers } from "@/lib/score";
import type { Answer, Assessment, AssessmentType, Question } from "@/lib/types";

// ─── types ───────────────────────────────────────────────────────────────────

type AssessmentWithAnswers = Assessment & {
  answers?: (Answer & { question?: Question })[];
};

// ─── helpers ─────────────────────────────────────────────────────────────────

const PLAN_META: Record<
  AssessmentType,
  { label: string; icon: React.ElementType; variant: "secondary" | "warning" | "destructive" }
> = {
  free:         { label: "Gratis",       icon: Zap,   variant: "secondary"   },
  profesional:  { label: "Profesional",  icon: Star,  variant: "warning"     },
  premium:      { label: "Premium",      icon: Crown, variant: "destructive" },
};

function getScore(a: AssessmentWithAnswers): number | null {
  if (a.status === "draft") return null;
  const rep = a.aiReport as Record<string, unknown> | null;
  if (rep?.overallScore !== undefined) return Math.round(Number(rep.overallScore));
  if (a.answers?.length) return scoreFromAnswers(a.answers);
  return null;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

// ─── sub-components ──────────────────────────────────────────────────────────

function Delta({ delta }: { delta: number | null }) {
  if (delta === null) return null;
  if (delta > 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-emerald-400 font-medium">
        <TrendingUp className="h-3 w-3" />+{delta}%
      </span>
    );
  if (delta < 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-red-400 font-medium">
        <TrendingDown className="h-3 w-3" />{delta}%
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" />0%
    </span>
  );
}

// ─── sidebar content panels ───────────────────────────────────────────────────

function GuestPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-4 p-6 flex-1">
      <div className="flex flex-col items-center text-center gap-3 py-6">
        <Image src="/logo.png" alt="MGM Certifications" width={64} height={64} className="rounded-xl" />
        <h3 className="font-semibold text-base">Accedé a tu historial</h3>
        <p className="text-sm text-muted-foreground">
          Iniciá sesión para ver tus evaluaciones anteriores y el seguimiento de
          tu madurez en seguridad.
        </p>
      </div>

      <Button asChild className="w-full" onClick={onClose}>
        <Link href="/login">
          Iniciar sesión <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" className="w-full" onClick={onClose}>
        <Link href="/signup">Registrarse</Link>
      </Button>
    </div>
  );
}

function UserPanel({
  user,
  onClose,
  onLogout,
}: {
  user: AuthUser;
  onClose: () => void;
  onLogout: () => void;
}) {
  const [assessments, setAssessments] = useState<AssessmentWithAnswers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .getUserAssessments(user.id)
      .then((d) => { if (mounted) setAssessments(d as AssessmentWithAnswers[]); })
      .catch(console.error)
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [user.id]);

  const completed = assessments.filter((a) => a.status !== "draft");
  const scores = completed.map(getScore);
  const hasChart = completed.filter((_, i) => scores[i] !== null).length >= 2;

  const chartData = completed
    .map((a, i) => ({ date: fmtDateShort(a.createdAt), score: scores[i] }))
    .filter((d) => d.score !== null);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* user info */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center rounded-full bg-primary/10 h-8 w-8 shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {user.name ?? user.email}
            </p>
            {user.name && (
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={onLogout}
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* header evaluaciones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <ClipboardList className="h-3.5 w-3.5" />
            Tus evaluaciones
          </div>
          <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onClose}>
            <Link href="/dashboard">
              <Plus className="h-3 w-3 mr-1" />Nueva
            </Link>
          </Button>
        </div>

        {/* chart evolución */}
        {hasChart && (
          <div className="rounded-md border border-border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground mb-2 font-medium">
              Evolución de madurez
            </p>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false} axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 8, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false} axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "11px",
                  }}
                  formatter={(v: number) => [`${v}%`, "Madurez"]}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#sg)"
                  dot={{ r: 3, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* lista de evaluaciones */}
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm text-muted-foreground">
              Aún no realizaste ninguna evaluación.
            </p>
            <Button asChild size="sm" onClick={onClose}>
              <Link href="/dashboard">Comenzar ahora</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {[...assessments].reverse().map((a, revIdx) => {
              const origIdx = assessments.length - 1 - revIdx;
              const score = getScore(a);
              const prev = origIdx > 0 ? getScore(assessments[origIdx - 1]) : null;
              const delta = score !== null && prev !== null ? score - prev : null;
              const meta = PLAN_META[(a.type as AssessmentType) ?? "premium"];
              const PlanIcon = meta.icon;
              const canView = a.status !== "draft";

              return (
                <Link
                  key={a.id}
                  href={`/report/${a.id}`}
                  onClick={onClose}
                  className="block rounded-md border border-border bg-card/60 hover:bg-accent/60 hover:border-primary/40 transition-colors p-3 space-y-2 cursor-pointer"
                >
                  {/* top row: empresa + plan */}
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium truncate">
                      {a.company?.name ?? "Empresa"}
                    </p>
                    <Badge variant={meta.variant} className="text-xs flex items-center gap-0.5 px-1.5 py-0 shrink-0">
                      <PlanIcon className="h-2.5 w-2.5" />
                      {meta.label}
                    </Badge>
                  </div>

                  {/* bottom row: score + delta + fecha + icono */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {score !== null ? (
                        <span className="text-base font-bold text-primary">{score}%</span>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          {a.status === "draft" ? "En progreso" : "Sin puntaje"}
                        </span>
                      )}
                      <Delta delta={delta} />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{fmtDate(a.createdAt)}</span>
                      <FileText className="h-3 w-3 text-primary/60" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── main header component ────────────────────────────────────────────────────

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authed, setAuthed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const authedNow = isAuthenticated();
    setAuthed(authedNow);
    if (authedNow) setUser(getUser());
    else setUser(null);
  }, [pathname]);

  // close sidebar on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function handleLogout() {
    clearAuth();
    setUser(null);
    setAuthed(false);
    setOpen(false);
    router.push("/login");
  }

  return (
    <>
      {/* ── sticky top bar ── */}
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="MGM" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold tracking-tight">MGM Certifications</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Anexo A — 2022
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir panel"
            >
              <PanelRightOpen className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ── backdrop ── */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* ── sidebar panel ── */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="MGM" width={28} height={28} className="rounded-md" />
            <span className="font-semibold text-sm">MGM Certifications</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setOpen(false)}
            aria-label="Cerrar panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* sidebar body */}
        {authed && user ? (
          <UserPanel user={user} onClose={() => setOpen(false)} onLogout={handleLogout} />
        ) : (
          <GuestPanel onClose={() => setOpen(false)} />
        )}
      </div>
    </>
  );
}
