import type { Metadata } from "next";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISO 27001 Assessment",
  description: "Evaluación de madurez ISO 27001:2022 — Anexo A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main className="container py-8">{children}</main>
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
