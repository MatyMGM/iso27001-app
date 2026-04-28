import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

export interface ReportGap {
  control: string;
  description: string;
  priority: string;
  recommendation: string;
}

export interface ReportPhase {
  phase: string;
  objectives: string[];
  controls: string[];
}

export interface ReportPayload {
  companyName: string;
  generatedAt: Date;
  overallScore: number;
  domainScores: Record<string, number>;
  gaps: ReportGap[];
  remediationRoadmap: ReportPhase[];
  executiveSummary: string;
}

@Injectable()
export class PdfService implements OnModuleDestroy {
  private readonly logger = new Logger(PdfService.name);
  private browserPromise: Promise<Browser> | null = null;

  async generateAssessmentPdf(payload: ReportPayload): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page = await browser.newPage();
    try {
      await page.setContent(renderHtml(payload), { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
      });
      return Buffer.from(pdf);
    } finally {
      await page.close().catch(() => undefined);
    }
  }

  async onModuleDestroy() {
    if (this.browserPromise) {
      try {
        const browser = await this.browserPromise;
        await browser.close();
      } catch (err) {
        this.logger.warn(`Failed to close puppeteer browser: ${err}`);
      }
    }
  }

  private getBrowser(): Promise<Browser> {
    if (!this.browserPromise) {
      this.browserPromise = puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
    return this.browserPromise;
  }
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function priorityClass(priority: string): string {
  const p = priority?.toLowerCase();
  if (p === 'alta') return 'prio-alta';
  if (p === 'media') return 'prio-media';
  return 'prio-baja';
}

function renderHtml(p: ReportPayload): string {
  const dateStr = p.generatedAt.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const domainRows = Object.entries(p.domainScores)
    .map(
      ([domain, score]) => `
        <tr>
          <td>${escapeHtml(domain)}</td>
          <td class="num">${escapeHtml(Math.round(Number(score) || 0))}%</td>
          <td>
            <div class="bar"><div class="bar-fill" style="width:${Math.max(
              0,
              Math.min(100, Number(score) || 0),
            )}%"></div></div>
          </td>
        </tr>`,
    )
    .join('');

  const gapRows = p.gaps.length
    ? p.gaps
        .map(
          (g) => `
        <tr>
          <td class="mono">${escapeHtml(g.control)}</td>
          <td>${escapeHtml(g.description)}</td>
          <td><span class="badge ${priorityClass(g.priority)}">${escapeHtml(
            g.priority,
          )}</span></td>
          <td>${escapeHtml(g.recommendation)}</td>
        </tr>`,
        )
        .join('')
    : `<tr><td colspan="4" class="muted">No se detectaron brechas.</td></tr>`;

  const roadmap = p.remediationRoadmap.length
    ? p.remediationRoadmap
        .map(
          (ph) => `
        <div class="phase">
          <h3>${escapeHtml(ph.phase)}</h3>
          ${
            ph.objectives.length
              ? `<p class="phase-label">Objetivos</p><ul>${ph.objectives
                  .map((o) => `<li>${escapeHtml(o)}</li>`)
                  .join('')}</ul>`
              : ''
          }
          ${
            ph.controls.length
              ? `<p class="phase-label">Controles</p><p class="controls">${ph.controls
                  .map((c) => `<span class="chip mono">${escapeHtml(c)}</span>`)
                  .join(' ')}</p>`
              : ''
          }
        </div>`,
        )
        .join('')
    : `<p class="muted">No se definió hoja de ruta.</p>`;

  const summaryHtml = escapeHtml(p.executiveSummary)
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Reporte ISO 27001 — ${escapeHtml(p.companyName)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; font-size: 11pt; line-height: 1.45; }
  h1, h2, h3 { color: #0f172a; margin: 0 0 .5em; }
  h1 { font-size: 28pt; }
  h2 { font-size: 16pt; border-bottom: 2px solid #1d4ed8; padding-bottom: 4px; margin-top: 24px; }
  h3 { font-size: 12pt; color: #1d4ed8; }
  p { margin: .4em 0; }
  .muted { color: #64748b; }
  .mono { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; }
  .num { text-align: right; font-variant-numeric: tabular-nums; }

  /* Cover */
  .cover { page-break-after: always; padding: 60px 20px; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; }
  .cover .eyebrow { color: #1d4ed8; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; margin-bottom: 16px; }
  .cover h1 { font-size: 36pt; margin-bottom: 8px; }
  .cover .company { font-size: 18pt; color: #334155; margin-bottom: 40px; }
  .score-circle { width: 180px; height: 180px; border-radius: 50%; background: conic-gradient(#1d4ed8 calc(var(--s) * 1%), #e2e8f0 0); margin: 24px auto; position: relative; display: flex; align-items: center; justify-content: center; }
  .score-circle::before { content: ""; position: absolute; inset: 16px; background: white; border-radius: 50%; }
  .score-circle span { position: relative; font-size: 32pt; font-weight: 700; color: #1d4ed8; }
  .cover .date { margin-top: 32px; color: #64748b; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; font-size: 10pt; }
  th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  th { background: #f1f5f9; font-weight: 600; color: #334155; text-transform: uppercase; font-size: 8.5pt; letter-spacing: .04em; }
  tr { page-break-inside: avoid; }

  .bar { background: #e2e8f0; border-radius: 4px; height: 8px; width: 100%; }
  .bar-fill { background: #1d4ed8; height: 100%; border-radius: 4px; }

  .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 9pt; font-weight: 600; text-transform: capitalize; }
  .prio-alta { background: #fee2e2; color: #991b1b; }
  .prio-media { background: #fef3c7; color: #92400e; }
  .prio-baja { background: #dbeafe; color: #1e40af; }

  .phase { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid; background: #f8fafc; }
  .phase-label { font-size: 9pt; font-weight: 600; text-transform: uppercase; color: #64748b; margin: 8px 0 4px; }
  .phase ul { margin: 0; padding-left: 18px; }
  .phase li { margin: 2px 0; }
  .controls { margin: 0; }
  .chip { display: inline-block; padding: 2px 8px; border-radius: 4px; background: #e0e7ff; color: #1e3a8a; font-size: 9pt; margin: 2px 4px 2px 0; }

  section { page-break-inside: avoid; }
</style>
</head>
<body>
  <div class="cover">
    <p class="eyebrow">Reporte de madurez ISO/IEC 27001:2022</p>
    <h1>Evaluación de controles</h1>
    <p class="company">${escapeHtml(p.companyName)}</p>
    <div class="score-circle" style="--s:${Math.max(0, Math.min(100, p.overallScore))}">
      <span>${Math.round(p.overallScore)}%</span>
    </div>
    <p class="muted">Puntaje global de madurez</p>
    <p class="date">Generado el ${escapeHtml(dateStr)}</p>
  </div>

  <section>
    <h2>Resumen ejecutivo</h2>
    ${summaryHtml}
  </section>

  <section>
    <h2>Madurez por dominio</h2>
    <table>
      <thead><tr><th>Dominio</th><th class="num">Puntaje</th><th>Avance</th></tr></thead>
      <tbody>${domainRows}</tbody>
    </table>
  </section>

  <section>
    <h2>Brechas detectadas</h2>
    <table>
      <thead><tr><th>Control</th><th>Descripción</th><th>Prioridad</th><th>Recomendación</th></tr></thead>
      <tbody>${gapRows}</tbody>
    </table>
  </section>

  <section>
    <h2>Hoja de ruta de remediación</h2>
    ${roadmap}
  </section>
</body>
</html>`;
}
