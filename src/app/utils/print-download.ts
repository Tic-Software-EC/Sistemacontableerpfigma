/** ─────────────────────────────────────────────────────────────────────────
 *  TicSoftEc ERP — Utilidades de impresión y descarga
 * ───────────────────────────────────────────────────────────────────────── */

const companyName = () => localStorage.getItem("companyName") || "Mi Empresa";
const now = () =>
  new Date().toLocaleDateString("es-EC", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ── Estilos compartidos para la ventana de impresión ─────────────────── */
const baseStyles = `
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; font-size: 13px; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; padding-bottom:16px; border-bottom:3px solid #E8692E; }
  .brand { display:flex; flex-direction:column; gap:4px; }
  .brand-name { font-size:22px; font-weight:800; color:#E8692E; }
  .brand-sub { font-size:12px; color:#666; }
  .doc-info { text-align:right; font-size:12px; color:#555; line-height:1.6; }
  h2 { font-size:16px; color:#0D1B2A; margin:20px 0 10px; border-left:4px solid #E8692E; padding-left:10px; }
  h3 { font-size:13px; color:#444; margin:14px 0 8px; }
  table { width:100%; border-collapse:collapse; margin-top:10px; font-size:12px; }
  thead th { background:#0D1B2A; color:#fff; padding:9px 12px; text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.5px; }
  thead th.right { text-align:right; }
  thead th.center { text-align:center; }
  tbody tr:nth-child(even) td { background:#f8f9fa; }
  tbody tr:hover td { background:#fff3ee; }
  td { padding:8px 12px; border-bottom:1px solid #e5e7eb; }
  td.right { text-align:right; font-family:monospace; }
  td.center { text-align:center; }
  td.mono { font-family:monospace; }
  .total-row td { background:#E8692E15 !important; font-weight:700; border-top:2px solid #E8692E; }
  .subtotal-row td { background:#f0f0f0 !important; font-weight:600; }
  .badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:600; }
  .badge-green  { background:#d1fae5; color:#065f46; }
  .badge-yellow { background:#fef3c7; color:#92400e; }
  .badge-red    { background:#fee2e2; color:#991b1b; }
  .badge-gray   { background:#f3f4f6; color:#6b7280; }
  .badge-blue   { background:#dbeafe; color:#1e40af; }
  .badge-purple { background:#ede9fe; color:#5b21b6; }
  .kpi-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:24px; }
  .kpi { background:#f8f9fa; border:1px solid #e5e7eb; border-radius:8px; padding:14px; text-align:center; }
  .kpi-label { font-size:11px; color:#888; margin-bottom:4px; }
  .kpi-value { font-size:18px; font-weight:800; color:#0D1B2A; }
  .section-box { border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; margin-bottom:16px; }
  .section-header { background:#0D1B2A; color:#fff; padding:10px 16px; display:flex; justify-content:space-between; align-items:center; font-weight:700; font-size:13px; }
  .section-header.activo { background:#1d4ed8; }
  .section-header.pasivo { background:#b91c1c; }
  .section-header.patrimonio { background:#6d28d9; }
  .section-header.ingreso { background:#15803d; }
  .section-header.gasto { background:#c2410c; }
  .section-header.utilidad { background:#E8692E; }
  .footer { margin-top:40px; text-align:center; font-size:11px; color:#aaa; border-top:1px solid #e5e7eb; padding-top:14px; }
  .note { background:#fff8f5; border-left:3px solid #E8692E; padding:10px 14px; border-radius:0 6px 6px 0; font-size:12px; color:#555; margin:12px 0; }
  @media print { body { padding:20px; } }
`;

/* ── Abrir ventana de impresión ─────────────────────────────────────────── */
export function printWindow(title: string, bodyContent: string): void {
  const w = window.open("", "_blank", "width=950,height=750");
  if (!w) {
    alert("Por favor permite ventanas emergentes para imprimir.");
    return;
  }
  w.document.write(`<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${title} — TicSoftEc ERP</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="header">
    <div class="brand">
      <div class="brand-name">TicSoftEc ERP</div>
      <div class="brand-sub">${companyName()}</div>
    </div>
    <div class="doc-info">
      <div><strong>${title}</strong></div>
      <div>Generado: ${now()}</div>
      <div>Usuario: Juan Pérez — Contador General</div>
    </div>
  </div>
  ${bodyContent}
  <div class="footer">TicSoftEc ERP v2.0 © 2026 — Sistema de Gestión Empresarial — Documento generado automáticamente</div>
</body>
</html>`);
  w.document.close();
  // Esperar a que cargue y luego imprimir
  w.addEventListener("load", () => w.print());
  setTimeout(() => { try { w.print(); } catch (_) {} }, 800);
}

/* ── Descarga CSV ───────────────────────────────────────────────────────── */
export function downloadCSV(rows: (string | number)[][], filename: string): void {
  const content = rows
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename);
}

/* ── Descarga HTML como PDF (mediante print → Save as PDF) ─────────────── */
export function downloadAsPDF(title: string, bodyContent: string): void {
  printWindow(title + " — Guardar como PDF", bodyContent);
}

/* ── Helper: dispara descarga de Blob ─────────────────────────────────── */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── Helpers de formato ─────────────────────────────────────────────────── */
export const fmtMoney = (v: number) =>
  "$" + v.toLocaleString("es-EC", { minimumFractionDigits: 2 });

const badgeHtml = (estado: string): string => {
  const map: Record<string, [string, string]> = {
    aprobado:  ["badge-green",  "Aprobado"],
    emitida:   ["badge-green",  "Emitida"],
    pendiente: ["badge-yellow", "Pendiente"],
    borrador:  ["badge-gray",   "Borrador"],
    anulada:   ["badge-red",    "Anulada"],
    cancelado: ["badge-red",    "Cancelado"],
    activo:    ["badge-blue",   "Activo"],
    inactivo:  ["badge-gray",   "Inactivo"],
  };
  const [cls, lbl] = map[estado] ?? ["badge-gray", estado];
  return `<span class="badge ${cls}">${lbl}</span>`;
};

/* ═══════════════════════════════════════════════════════════════════════════
 *  GENERADORES DE CONTENIDO POR MÓDULO
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ── Libro Diario — un asiento ─────────────────────────────────────────── */
export function printAsiento(asiento: any): void {
  const lineasRows = asiento.lineas
    .map(
      (l: any) => `
      <tr>
        <td class="mono">${l.cuenta}</td>
        <td>${l.nombre}</td>
        <td class="right">${l.debe > 0 ? fmtMoney(l.debe) : "—"}</td>
        <td class="right">${l.haber > 0 ? fmtMoney(l.haber) : "—"}</td>
      </tr>`
    )
    .join("");

  const html = `
    <h2>Asiento Contable</h2>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi"><div class="kpi-label">N° Asiento</div><div class="kpi-value" style="font-size:14px">${asiento.id}</div></div>
      <div class="kpi"><div class="kpi-label">Fecha</div><div class="kpi-value" style="font-size:14px">${asiento.fecha}</div></div>
      <div class="kpi"><div class="kpi-label">Estado</div><div class="kpi-value" style="font-size:14px">${badgeHtml(asiento.estado)}</div></div>
    </div>
    <div class="note"><strong>Descripción:</strong> ${asiento.descripcion}<br/><strong>Referencia:</strong> ${asiento.referencia} &nbsp;|&nbsp; <strong>Tipo:</strong> ${asiento.tipo}</div>
    <table>
      <thead>
        <tr><th>Código</th><th>Cuenta Contable</th><th class="right">Debe</th><th class="right">Haber</th></tr>
      </thead>
      <tbody>
        ${lineasRows}
        <tr class="total-row">
          <td colspan="2"><strong>TOTAL</strong></td>
          <td class="right">${fmtMoney(asiento.debe)}</td>
          <td class="right">${fmtMoney(asiento.haber)}</td>
        </tr>
      </tbody>
    </table>
    <div class="note" style="margin-top:20px">
      ${asiento.debe === asiento.haber ? "✔ Asiento <strong>BALANCEADO</strong> — Debe = Haber" : "⚠ ADVERTENCIA: El asiento no está balanceado"}
    </div>`;
  printWindow(`Asiento ${asiento.id}`, html);
}

/* ── Libro Diario — listado completo ──────────────────────────────────── */
export function printJournal(asientos: any[]): void {
  const rows = asientos
    .map(
      (a) => `
      <tr>
        <td class="mono">${a.id}</td>
        <td>${a.fecha}</td>
        <td>${a.descripcion}</td>
        <td class="center">${a.tipo}</td>
        <td class="right">${fmtMoney(a.debe)}</td>
        <td class="right">${fmtMoney(a.haber)}</td>
        <td class="center">${badgeHtml(a.estado)}</td>
      </tr>`
    )
    .join("");

  const total = asientos.reduce((s, a) => s + a.debe, 0);
  const html = `
    <h2>Libro Diario — Marzo 2026</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Total Asientos</div><div class="kpi-value">${asientos.length}</div></div>
      <div class="kpi"><div class="kpi-label">Aprobados</div><div class="kpi-value">${asientos.filter(a=>a.estado==="aprobado").length}</div></div>
      <div class="kpi"><div class="kpi-label">Total Debe</div><div class="kpi-value" style="font-size:14px">${fmtMoney(total)}</div></div>
      <div class="kpi"><div class="kpi-label">Total Haber</div><div class="kpi-value" style="font-size:14px">${fmtMoney(total)}</div></div>
    </div>
    <table>
      <thead><tr>
        <th>N° Asiento</th><th>Fecha</th><th>Descripción</th>
        <th class="center">Tipo</th><th class="right">Debe</th><th class="right">Haber</th><th class="center">Estado</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr class="total-row">
        <td colspan="4"><strong>TOTALES</strong></td>
        <td class="right">${fmtMoney(total)}</td>
        <td class="right">${fmtMoney(total)}</td>
        <td></td>
      </tr></tfoot>
    </table>`;
  printWindow("Libro Diario", html);
}

export function downloadJournalCSV(asientos: any[]): void {
  const headers = ["N° Asiento", "Fecha", "Descripción", "Referencia", "Tipo", "Debe", "Haber", "Estado"];
  const rows = asientos.map((a) => [a.id, a.fecha, a.descripcion, a.referencia, a.tipo, a.debe, a.haber, a.estado]);
  downloadCSV([headers, ...rows], `libro-diario-${new Date().toISOString().slice(0,10)}.csv`);
}

/* ── Plan de Cuentas ───────────────────────────────────────────────────── */
export function printChartOfAccounts(cuentas: any[]): void {
  const rows = cuentas
    .map(
      (c) => `
      <tr>
        <td class="mono" style="padding-left:${(c.nivel - 1) * 16 + 12}px">${c.codigo}</td>
        <td style="${c.nivel <= 2 ? "font-weight:700" : ""}">${c.nombre}</td>
        <td class="center">${c.tipo}</td>
        <td class="right">${c.nivel === 4 ? fmtMoney(c.saldo) : "—"}</td>
        <td class="center">${badgeHtml(c.activa ? "activo" : "inactivo")}</td>
      </tr>`
    )
    .join("");

  const html = `
    <h2>Plan de Cuentas Contables</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Total Cuentas</div><div class="kpi-value">${cuentas.length}</div></div>
      <div class="kpi"><div class="kpi-label">Activos</div><div class="kpi-value">${cuentas.filter(c=>c.tipo==="Activo").length}</div></div>
      <div class="kpi"><div class="kpi-label">Pasivos</div><div class="kpi-value">${cuentas.filter(c=>c.tipo==="Pasivo").length}</div></div>
      <div class="kpi"><div class="kpi-label">Ingresos/Gastos</div><div class="kpi-value">${cuentas.filter(c=>["Ingreso","Gasto"].includes(c.tipo)).length}</div></div>
    </div>
    <table>
      <thead><tr>
        <th>Código</th><th>Nombre de Cuenta</th><th class="center">Tipo</th>
        <th class="right">Saldo Actual</th><th class="center">Estado</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  printWindow("Plan de Cuentas", html);
}

export function downloadChartOfAccountsCSV(cuentas: any[]): void {
  const headers = ["Código", "Nombre", "Tipo", "Nivel", "Saldo", "Estado"];
  const rows = cuentas.map((c) => [c.codigo, c.nombre, c.tipo, c.nivel, c.saldo, c.activa ? "Activa" : "Inactiva"]);
  downloadCSV([headers, ...rows], `plan-cuentas-${new Date().toISOString().slice(0,10)}.csv`);
}

/* ── Balance General ───────────────────────────────────────────────────── */
export function printBalanceSheet(balance: any): void {
  const rowsHtml = (items: { nombre: string; valor: number }[]) =>
    items.map(i => `<tr><td style="padding-left:24px">${i.nombre}</td><td class="right">${fmtMoney(i.valor)}</td></tr>`).join("");

  const { activos, pasivos, patrimonio, totalActCor, totalActNoCor, totalActivo,
          totalPasCor, totalPasNoCor, totalPasivo, totalPatrimonio, totalPasPat } = balance;

  const html = `
    <h2>Balance General</h2>
    <p style="color:#666;margin-bottom:16px">Al 31 de Marzo, 2026</p>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Total Activos</div><div class="kpi-value" style="font-size:14px;color:#1d4ed8">${fmtMoney(totalActivo)}</div></div>
      <div class="kpi"><div class="kpi-label">Total Pasivos</div><div class="kpi-value" style="font-size:14px;color:#b91c1c">${fmtMoney(totalPasivo)}</div></div>
      <div class="kpi"><div class="kpi-label">Patrimonio</div><div class="kpi-value" style="font-size:14px;color:#15803d">${fmtMoney(totalPatrimonio)}</div></div>
      <div class="kpi"><div class="kpi-label">Cuadre</div><div class="kpi-value" style="font-size:13px;color:${Math.abs(totalActivo-totalPasPat)<0.01?"#15803d":"#b91c1c"}">${Math.abs(totalActivo-totalPasPat)<0.01?"✔ Cuadra":"✗ Diferencia"}</div></div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>
        <div class="section-box">
          <div class="section-header activo">ACTIVOS <span>${fmtMoney(totalActivo)}</span></div>
          <table><tbody>
            <tr><td colspan="2" style="font-weight:700;background:#eff6ff;padding:8px 12px">Activos Corrientes</td></tr>
            ${rowsHtml(activos.corrientes)}
            <tr class="subtotal-row"><td>Subtotal Corrientes</td><td class="right">${fmtMoney(totalActCor)}</td></tr>
            <tr><td colspan="2" style="font-weight:700;background:#eff6ff;padding:8px 12px">Activos No Corrientes</td></tr>
            ${rowsHtml(activos.noCorrientes)}
            <tr class="subtotal-row"><td>Subtotal No Corrientes</td><td class="right">${fmtMoney(totalActNoCor)}</td></tr>
            <tr class="total-row"><td>TOTAL ACTIVOS</td><td class="right">${fmtMoney(totalActivo)}</td></tr>
          </tbody></table>
        </div>
      </div>
      <div>
        <div class="section-box">
          <div class="section-header pasivo">PASIVOS + PATRIMONIO <span>${fmtMoney(totalPasPat)}</span></div>
          <table><tbody>
            <tr><td colspan="2" style="font-weight:700;background:#fef2f2;padding:8px 12px">Pasivos Corrientes</td></tr>
            ${rowsHtml(pasivos.corrientes)}
            <tr class="subtotal-row"><td>Subtotal Corrientes</td><td class="right">${fmtMoney(totalPasCor)}</td></tr>
            <tr><td colspan="2" style="font-weight:700;background:#fef2f2;padding:8px 12px">Pasivos No Corrientes</td></tr>
            ${rowsHtml(pasivos.noCorrientes)}
            <tr class="subtotal-row"><td>Subtotal No Corrientes</td><td class="right">${fmtMoney(totalPasNoCor)}</td></tr>
            <tr class="subtotal-row"><td>TOTAL PASIVOS</td><td class="right">${fmtMoney(totalPasivo)}</td></tr>
            <tr><td colspan="2" style="font-weight:700;background:#f5f3ff;padding:8px 12px">Patrimonio</td></tr>
            ${rowsHtml(patrimonio)}
            <tr class="subtotal-row"><td>Total Patrimonio</td><td class="right">${fmtMoney(totalPatrimonio)}</td></tr>
            <tr class="total-row"><td>TOTAL PASIVOS + PATRIMONIO</td><td class="right">${fmtMoney(totalPasPat)}</td></tr>
          </tbody></table>
        </div>
      </div>
    </div>`;
  printWindow("Balance General", html);
}

export function downloadBalanceSheetCSV(balance: any): void {
  const rows: (string | number)[][] = [
    ["BALANCE GENERAL — 31 de Marzo 2026", "", ""],
    ["", "", ""],
    ["ACTIVOS", "", ""],
    ["Activos Corrientes", "", ""],
    ...balance.activos.corrientes.map((i: any) => ["  " + i.nombre, i.valor, ""]),
    ["Subtotal Corrientes", balance.totalActCor, ""],
    ["Activos No Corrientes", "", ""],
    ...balance.activos.noCorrientes.map((i: any) => ["  " + i.nombre, i.valor, ""]),
    ["Subtotal No Corrientes", balance.totalActNoCor, ""],
    ["TOTAL ACTIVOS", balance.totalActivo, ""],
    ["", "", ""],
    ["PASIVOS", "", ""],
    ...balance.pasivos.corrientes.map((i: any) => ["  " + i.nombre, i.valor, ""]),
    ["Subtotal Pasivos Corrientes", balance.totalPasCor, ""],
    ...balance.pasivos.noCorrientes.map((i: any) => ["  " + i.nombre, i.valor, ""]),
    ["TOTAL PASIVOS", balance.totalPasivo, ""],
    ["", "", ""],
    ["PATRIMONIO", "", ""],
    ...balance.patrimonio.map((i: any) => ["  " + i.nombre, i.valor, ""]),
    ["TOTAL PATRIMONIO", balance.totalPatrimonio, ""],
    ["TOTAL PASIVOS + PATRIMONIO", balance.totalPasPat, ""],
  ];
  downloadCSV(rows, `balance-general-${new Date().toISOString().slice(0,10)}.csv`);
}

/* ── Estado de Resultados ─────────────────────────────────────────────── */
export function printIncomeStatement(data: any, periodo: string): void {
  const { ingresos, costos, gastos, totalIngresos, totalCostos,
          utilidadBruta, totalGastos, utilidadOper, utilidadNeta, margenNeto } = data;

  const rowsHtml = (items: { nombre: string; valor: number }[]) =>
    items
      .map(i => `<tr><td style="padding-left:24px">${i.nombre}</td><td class="right" style="color:${i.valor<0?"#b91c1c":"inherit"}">${i.valor < 0 ? `(${fmtMoney(Math.abs(i.valor))})` : fmtMoney(i.valor)}</td></tr>`)
      .join("");

  const html = `
    <h2>Estado de Resultados — ${periodo}</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Ingresos Totales</div><div class="kpi-value" style="color:#15803d;font-size:14px">${fmtMoney(totalIngresos)}</div></div>
      <div class="kpi"><div class="kpi-label">Utilidad Bruta</div><div class="kpi-value" style="color:#1d4ed8;font-size:14px">${fmtMoney(utilidadBruta)}</div></div>
      <div class="kpi"><div class="kpi-label">Utilidad Neta</div><div class="kpi-value" style="color:#E8692E;font-size:14px">${fmtMoney(utilidadNeta)}</div></div>
      <div class="kpi"><div class="kpi-label">Margen Neto</div><div class="kpi-value" style="color:#6d28d9">${margenNeto.toFixed(1)}%</div></div>
    </div>
    <table>
      <tbody>
        <tr><td colspan="2" style="font-weight:700;background:#f0fdf4;padding:9px 12px;font-size:13px">INGRESOS OPERACIONALES</td></tr>
        ${rowsHtml(ingresos)}
        <tr class="subtotal-row"><td>Total Ingresos</td><td class="right">${fmtMoney(totalIngresos)}</td></tr>
        <tr><td colspan="2" style="font-weight:700;background:#fef2f2;padding:9px 12px">COSTOS DE VENTAS</td></tr>
        ${rowsHtml(costos)}
        <tr class="subtotal-row"><td>Total Costos</td><td class="right">${fmtMoney(totalCostos)}</td></tr>
        <tr class="total-row"><td style="color:#1d4ed8">UTILIDAD BRUTA</td><td class="right" style="color:#1d4ed8">${fmtMoney(utilidadBruta)}</td></tr>
        <tr><td colspan="2" style="font-weight:700;background:#fff7ed;padding:9px 12px">GASTOS OPERACIONALES</td></tr>
        ${rowsHtml(gastos)}
        <tr class="subtotal-row"><td>Total Gastos</td><td class="right">${fmtMoney(totalGastos)}</td></tr>
        <tr class="total-row"><td>UTILIDAD OPERACIONAL</td><td class="right">${fmtMoney(utilidadOper)}</td></tr>
        <tr><td style="padding-left:24px">(-) Participación Trabajadores 15%</td><td class="right" style="color:#b91c1c">(${fmtMoney(utilidadOper*0.15)})</td></tr>
        <tr><td style="padding-left:24px">(-) Impuesto a la Renta 25%</td><td class="right" style="color:#b91c1c">(${fmtMoney(utilidadOper*0.25)})</td></tr>
        <tr class="total-row" style="background:#E8692E20!important"><td style="color:#E8692E;font-size:14px">UTILIDAD NETA DEL PERÍODO</td><td class="right" style="color:#E8692E;font-size:14px">${fmtMoney(utilidadNeta)}</td></tr>
      </tbody>
    </table>`;
  printWindow(`Estado de Resultados — ${periodo}`, html);
}

export function downloadIncomeStatementCSV(data: any, periodo: string): void {
  const rows: (string | number)[][] = [
    [`ESTADO DE RESULTADOS — ${periodo}`],
    [],
    ["INGRESOS OPERACIONALES", "Valor"],
    ...data.ingresos.map((i: any) => [i.nombre, i.valor]),
    ["Total Ingresos", data.totalIngresos],
    [],
    ["COSTOS DE VENTAS", ""],
    ...data.costos.map((i: any) => [i.nombre, i.valor]),
    ["Total Costos", data.totalCostos],
    [],
    ["UTILIDAD BRUTA", data.utilidadBruta],
    [],
    ["GASTOS OPERACIONALES", ""],
    ...data.gastos.map((i: any) => [i.nombre, i.valor]),
    ["Total Gastos", data.totalGastos],
    [],
    ["UTILIDAD OPERACIONAL", data.utilidadOper],
    ["(-) Participación 15%", -data.utilidadOper * 0.15],
    ["(-) Impuesto Renta 25%", -data.utilidadOper * 0.25],
    ["UTILIDAD NETA", data.utilidadNeta],
    ["Margen Neto", `${data.margenNeto.toFixed(1)}%`],
  ];
  downloadCSV(rows, `estado-resultados-${periodo.replace(" ", "-").toLowerCase()}.csv`);
}

/* ── Retenciones ───────────────────────────────────────────────────────── */
export function printRetencion(ret: any): void {
  const html = `
    <h2>Comprobante de Retención</h2>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="kpi"><div class="kpi-label">N° Retención</div><div class="kpi-value" style="font-size:13px">${ret.num || ret.id}</div></div>
      <div class="kpi"><div class="kpi-label">Fecha</div><div class="kpi-value" style="font-size:13px">${ret.fecha}</div></div>
      <div class="kpi"><div class="kpi-label">Estado</div><div class="kpi-value">${badgeHtml(ret.estado)}</div></div>
    </div>
    <div class="section-box">
      <div class="section-header">DATOS DEL CONTRIBUYENTE</div>
      <table><tbody>
        <tr><td style="width:40%;color:#666">Razón Social / Nombre</td><td><strong>${ret.contribuyente}</strong></td></tr>
        <tr><td style="color:#666">RUC / Cédula</td><td>${ret.ruc}</td></tr>
        <tr><td style="color:#666">Comprobante Origen</td><td>${ret.comprobante}</td></tr>
      </tbody></table>
    </div>
    <div class="section-box" style="margin-top:12px">
      <div class="section-header">DETALLE DE LA RETENCIÓN</div>
      <table>
        <thead><tr><th>Tipo</th><th class="right">Base Imponible</th><th class="center">Porcentaje</th><th class="right">Valor Retenido</th></tr></thead>
        <tbody>
          <tr>
            <td>Retención en ${ret.tipo}</td>
            <td class="right">${fmtMoney(ret.base)}</td>
            <td class="center">${ret.porcentaje}%</td>
            <td class="right"><strong>${fmtMoney(ret.valor)}</strong></td>
          </tr>
          <tr class="total-row"><td colspan="3">TOTAL RETENIDO</td><td class="right">${fmtMoney(ret.valor)}</td></tr>
        </tbody>
      </table>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:60px;text-align:center">
      <div style="border-top:1px solid #ccc;padding-top:8px;color:#666;font-size:11px">Firma del Agente de Retención<br/><strong>${companyName()}</strong></div>
      <div style="border-top:1px solid #ccc;padding-top:8px;color:#666;font-size:11px">Firma del Contribuyente<br/><strong>${ret.contribuyente}</strong></div>
    </div>`;
  printWindow(`Retención ${ret.num || ret.id}`, html);
}

export function printAllRetentions(retenciones: any[]): void {
  const rows = retenciones
    .map(r => `
      <tr>
        <td class="mono">${r.num || r.id}</td>
        <td>${r.fecha}</td>
        <td>${r.contribuyente}</td>
        <td class="mono">${r.ruc}</td>
        <td class="center">Ret. ${r.tipo}</td>
        <td>${r.comprobante}</td>
        <td class="right">${fmtMoney(r.base)}</td>
        <td class="center">${r.porcentaje}%</td>
        <td class="right"><strong>${fmtMoney(r.valor)}</strong></td>
        <td class="center">${badgeHtml(r.estado)}</td>
      </tr>`)
    .join("");

  const totalRet = retenciones.filter(r => r.estado !== "anulada").reduce((s,r) => s+r.valor, 0);
  const html = `
    <h2>Listado de Retenciones — Marzo 2026</h2>
    <div class="kpi-grid">
      <div class="kpi"><div class="kpi-label">Total</div><div class="kpi-value">${retenciones.length}</div></div>
      <div class="kpi"><div class="kpi-label">Emitidas</div><div class="kpi-value">${retenciones.filter(r=>r.estado==="emitida").length}</div></div>
      <div class="kpi"><div class="kpi-label">Pendientes</div><div class="kpi-value">${retenciones.filter(r=>r.estado==="pendiente").length}</div></div>
      <div class="kpi"><div class="kpi-label">Total Retenido</div><div class="kpi-value" style="font-size:14px">${fmtMoney(totalRet)}</div></div>
    </div>
    <table>
      <thead><tr>
        <th>N° Ret.</th><th>Fecha</th><th>Contribuyente</th><th>RUC</th>
        <th class="center">Tipo</th><th>Comprobante</th>
        <th class="right">Base</th><th class="center">%</th>
        <th class="right">Valor Ret.</th><th class="center">Estado</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr class="total-row">
        <td colspan="8">TOTAL RETENIDO (excl. anuladas)</td>
        <td class="right">${fmtMoney(totalRet)}</td><td></td>
      </tr></tfoot>
    </table>`;
  printWindow("Listado de Retenciones", html);
}

export function downloadRetentionsCSV(retenciones: any[]): void {
  const headers = ["N° Retención", "Fecha", "Contribuyente", "RUC", "Tipo", "Comprobante", "Base Imponible", "%", "Valor Retenido", "Estado"];
  const rows = retenciones.map(r => [r.num || r.id, r.fecha, r.contribuyente, r.ruc, r.tipo, r.comprobante, r.base, r.porcentaje, r.valor, r.estado]);
  downloadCSV([headers, ...rows], `retenciones-${new Date().toISOString().slice(0,10)}.csv`);
}

/* ── Reportes Financieros — genérico ──────────────────────────────────── */
export function printFinancialReport(nombre: string, tipo: string, periodo: string): void {
  const placeholder = `
    <div class="note">Este reporte se genera con los datos consolidados del período <strong>${periodo}</strong>.</div>
    <div class="section-box">
      <div class="section-header">${nombre.toUpperCase()} — ${periodo}</div>
      <div style="padding:24px;text-align:center;color:#666">
        <p style="font-size:14px;margin-bottom:8px">✔ Reporte generado correctamente</p>
        <p style="font-size:12px">Tipo: ${tipo} &nbsp;|&nbsp; Período: ${periodo}</p>
      </div>
    </div>`;
  printWindow(`${nombre} — ${periodo}`, placeholder);
}
