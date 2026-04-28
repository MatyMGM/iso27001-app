import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-semibold tracking-tight">
            ISO 27001 Assessment
          </span>
        </Link>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Anexo A — 2022
        </span>
      </div>
    </header>
  );
}
