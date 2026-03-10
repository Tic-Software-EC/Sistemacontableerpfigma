import { useState } from "react";
import {
  Search, Plus, Download, Printer, CheckCircle, Clock,
  AlertTriangle, X, FileText, ZoomIn, ZoomOut,
  Shield, Code2, RefreshCw, FileCode, TrendingUp, XCircle,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { DatePicker } from "./date-picker-range";
import { CreateDebitNoteModal } from "./create-debit-note-modal";
import { CancelCreditNoteModal } from "./cancel-credit-note-modal";
import { CancelDebitNoteSearchModal } from "./cancel-debit-note-search-modal";
import { SRICancellationProcessModal } from "./sri-cancellation-process-modal";

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface DebitNote {
  id: string;
  noteNumber: string;
  date: string;
  time: string;
  invoiceRef: string;
  reason: string;
  customer: {
    name: string;
    ruc: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  description: string;
  subtotal: number;
  tax: number;
  total: number;
  status: "completed" | "cancelled" | "pending";
  seller: string;
  branch: string;
  authorizationNumber?: string;
  sriStatus?: "authorized" | "pending" | "rejected" | "not_sent";
  sriAuthDate?: string;
  emisor_razon?: string;
  emisor_dir?: string;
  emisor_ruc?: string;
  emisor_telefono?: string;
  emisor_email?: string;
  ambiente?: string;
  cancellationReason?: string;
}

/* ══════════════════════════════════════════════════════════════════════
   DATOS MOCK
══════════════════════════════════════════════════════════════════════ */
const EMPRESA = {
  razon: "TicSoftEc S.A.",
  ruc: "1790123456001",
  dir: "Av. Amazonas N35-17 y Japón, Quito - Ecuador",
  tel: "02-2345-678",
  email: "facturacion@ticsoftec.com",
};

const genClave = () =>
  Array.from({ length: 49 }, () => Math.floor(Math.random() * 10)).join("");

const DEBIT_NOTES_INIT: DebitNote[] = [
  {
    id: "1",
    noteNumber: "005-001-000001",
    date: "2026-03-05",
    time: "10:20",
    invoiceRef: "001-001-000123",
    reason: "Intereses por mora en el pago",
    customer: {
      name: "Corporación Favorita C.A.",
      ruc: "1790016919001",
      address: "Av. General Enríquez km 4.5, Sangolquí",
      email: "facturacion@favorita.com",
      phone: "02-3456789"
    },
    description: "Intereses calculados al 15% anual por mora de 30 días",
    subtotal: 125.00,
    tax: 15.00,
    total: 140.00,
    status: "completed",
    seller: "Juan Pérez",
    branch: "Sucursal Centro",
    authorizationNumber: "0503202601179001234500120010050000000141234567890",
    sriStatus: "authorized",
    sriAuthDate: "2026-03-05 10:25",
    emisor_razon: EMPRESA.razon,
    emisor_dir: EMPRESA.dir,
    emisor_ruc: EMPRESA.ruc,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    ambiente: "Pruebas",
  },
  {
    id: "2",
    noteNumber: "005-001-000002",
    date: "2026-03-07",
    time: "14:15",
    invoiceRef: "001-001-000125",
    reason: "Gastos adicionales por transporte",
    customer: {
      name: "Distribuidora Andina S.A.",
      ruc: "1791234567001",
      address: "Calle Bolívar 234 y Rocafuerte, Cuenca",
      email: "ventas@andina.com.ec",
      phone: "07-2890123"
    },
    description: "Flete adicional por cambio de ruta y entrega urgente",
    subtotal: 85.00,
    tax: 10.20,
    total: 95.20,
    status: "completed",
    seller: "Ana Torres",
    branch: "Sucursal Sur",
    authorizationNumber: "0703202601179001234500120010050000000241234567891",
    sriStatus: "authorized",
    sriAuthDate: "2026-03-07 14:20",
    emisor_razon: EMPRESA.razon,
    emisor_dir: EMPRESA.dir,
    emisor_ruc: EMPRESA.ruc,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    ambiente: "Pruebas",
  },
  {
    id: "3",
    noteNumber: "005-001-000003",
    date: "2026-03-09",
    time: "09:30",
    invoiceRef: "001-001-000127",
    reason: "Recargos por servicios adicionales",
    customer: {
      name: "Supermercados La Rebaja S.A.",
      ruc: "1790345678001",
      address: "Av. Maldonado S15-78, Quito",
      email: "facturacion@larebaja.com",
      phone: "02-2667788"
    },
    description: "Instalación y configuración de equipos",
    subtotal: 150.00,
    tax: 18.00,
    total: 168.00,
    status: "pending",
    seller: "Carlos Mendoza",
    branch: "Sucursal Norte",
    sriStatus: "pending",
    emisor_razon: EMPRESA.razon,
    emisor_dir: EMPRESA.dir,
    emisor_ruc: EMPRESA.ruc,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    ambiente: "Pruebas",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   GENERADOR XML SRI
═════════════════════════════════════════════════════════════════════ */
function generateDebitNoteXML(note: DebitNote): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<notaDebito id="comprobante" version="1.0.0">
  <infoTributaria>
    <ambiente>${note.ambiente === "Producción" ? "2" : "1"}</ambiente>
    <tipoEmision>1</tipoEmision>
    <razonSocial>${note.emisor_razon}</razonSocial>
    <nombreComercial>${note.emisor_razon}</nombreComercial>
    <ruc>${note.emisor_ruc}</ruc>
    <claveAcceso>${note.authorizationNumber || genClave()}</claveAcceso>
    <codDoc>05</codDoc>
    <estab>005</estab>
    <ptoEmi>001</ptoEmi>
    <secuencial>${note.noteNumber.split('-')[2]}</secuencial>
    <dirMatriz>${note.emisor_dir}</dirMatriz>
  </infoTributaria>
  <infoNotaDebito>
    <fechaEmision>${note.date.split('-').reverse().join('/')}</fechaEmision>
    <dirEstablecimiento>${note.emisor_dir}</dirEstablecimiento>
    <tipoIdentificacionComprador>04</tipoIdentificacionComprador>
    <razonSocialComprador>${note.customer.name}</razonSocialComprador>
    <identificacionComprador>${note.customer.ruc}</identificacionComprador>
    <obligadoContabilidad>SI</obligadoContabilidad>
    <rise>NO</rise>
    <codDocModificado>01</codDocModificado>
    <numDocModificado>${note.invoiceRef}</numDocModificado>
    <fechaEmisionDocSustento>${note.date.split('-').reverse().join('/')}</fechaEmisionDocSustento>
    <totalSinImpuestos>${note.subtotal.toFixed(2)}</totalSinImpuestos>
    <moneda>DOLAR</moneda>
    <impuestos>
      <impuesto>
        <codigo>2</codigo>
        <codigoPorcentaje>2</codigoPorcentaje>
        <tarifa>12</tarifa>
        <baseImponible>${note.subtotal.toFixed(2)}</baseImponible>
        <valor>${note.tax.toFixed(2)}</valor>
      </impuesto>
    </impuestos>
    <valorTotal>${note.total.toFixed(2)}</valorTotal>
  </infoNotaDebito>
  <motivos>
    <motivo>
      <razon>${note.reason}</razon>
      <valor>${note.total.toFixed(2)}</valor>
    </motivo>
  </motivos>
  <infoAdicional>
    <campoAdicional nombre="EMAIL">${note.customer.email || note.emisor_email}</campoAdicional>
    <campoAdicional nombre="TELEFONO">${note.customer.phone || note.emisor_telefono}</campoAdicional>
    <campoAdicional nombre="VENDEDOR">${note.seller}</campoAdicional>
    <campoAdicional nombre="DESCRIPCION">${note.description}</campoAdicional>
  </infoAdicional>
</notaDebito>`;
}

function highlightXML(xml: string): string {
  return xml
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(&lt;\/?)(\w+)/g, '<span style="color:#fb923c">$1$2</span>')
    .replace(/(\w+)(=)(&quot;[^&]*&quot;)/g, '<span style="color:#7dd3fc">$1</span><span style="color:#94a3b8">$2</span><span style="color:#86efac">$3</span>')
    .replace(/(&lt;\?xml.*?&gt;)/g, '<span style="color:#94a3b8;font-style:italic">$1</span>');
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE VISOR DE NOTA DE DÉBITO SRI (RIDE + XML)
══════════════════════════════════════════════════════════════════════ */
function DebitNoteViewer({ note, onPrint, onCancel, isLight }: {
  note: DebitNote;
  onPrint: () => void;
  onCancel?: () => void;
  isLight: boolean;
}) {
  const [zoom, setZoom] = useState(100);
  const [activeView, setActiveView] = useState<"ride" | "xml">("ride");
  const [xmlCopied, setXmlCopied] = useState(false);

  const isAutorizada = note.sriStatus === "authorized";
  const xmlContent = generateDebitNoteXML(note);
  const fmt = (v: number) => `$${v.toFixed(2)}`;

  const handleCopyXML = () => {
    navigator.clipboard.writeText(xmlContent).then(() => {
      setXmlCopied(true);
      toast.success("XML copiado al portapapeles");
      setTimeout(() => setXmlCopied(false), 2000);
    });
  };

  const handleDownloadXML = () => {
    const blob = new Blob([xmlContent], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ND-${note.noteNumber.replace(/\\//g, "-")}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("XML descargado");
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Toolbar ── */}
      <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0c1520] border-white/10"}`}>
        {/* Tabs RIDE / XML */}
        <div className={`flex gap-0.5 p-0.5 rounded-lg ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
          <button onClick={() => setActiveView("ride")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeView === "ride" ? "bg-primary text-white shadow" : isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
            <FileText className="w-3.5 h-3.5" /> RIDE
          </button>
          <button onClick={() => setActiveView("xml")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeView === "xml" ? "bg-primary text-white shadow" : isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
            <FileCode className="w-3.5 h-3.5" /> XML
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Controles zoom (solo RIDE) */}
          {activeView === "ride" && (
            <div className={`flex items-center gap-0.5 border rounded-lg px-1 ${isLight ? "border-gray-300" : "border-white/10"}`}>
              <button onClick={() => setZoom(z => Math.max(50, z - 10))}
                className={`p-1 rounded transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/10"}`}>
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className={`text-xs font-mono w-9 text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(130, z + 10))}
                className={`p-1 rounded transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/10"}`}>
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setZoom(100)}
                className={`p-1 rounded transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-500 hover:bg-white/10"}`}>
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Controles XML */}
          {activeView === "xml" && (
            <>
              <button onClick={handleCopyXML}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-100" : "border-white/10 text-gray-300 hover:bg-white/10"}`}>
                <Code2 className="w-3.5 h-3.5" /> {xmlCopied ? "¡Copiado!" : "Copiar"}
              </button>
              <button onClick={handleDownloadXML}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-100" : "border-white/10 text-gray-300 hover:bg-white/10"}`}>
                <Download className="w-3.5 h-3.5" /> .xml
              </button>
            </>
          )}

          <button onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors">
            <Printer className="w-3.5 h-3.5" /> PDF
          </button>
          
          {/* Botón Anular - solo visible si está autorizada y no ha sido cancelada */}
          {onCancel && note.sriStatus === "authorized" && note.status !== "cancelled" && (
            <button onClick={onCancel}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${isLight ? "border-red-300 text-red-700 hover:bg-red-50" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}`}>
              <XCircle className="w-3.5 h-3.5" /> Anular
            </button>
          )}
        </div>
      </div>

      {/* ── Vista RIDE ── */}
      {activeView === "ride" && (
        <div className={`flex-1 overflow-auto p-3 ${isLight ? "bg-gray-300" : "bg-[#06090f]"}`}>
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.15s" }}>
            <div className="bg-white mx-auto shadow-2xl text-gray-800"
              style={{ width: 520, fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 9.5 }}>

              {!isAutorizada && (
                <div style={{ background: "#fbbf24", color: "#78350f", textAlign: "center", padding: "3px 8px", fontWeight: 700, fontSize: 9, letterSpacing: 1 }}>
                  ⚠ DOCUMENTO NO AUTORIZADO — {note.sriStatus?.toUpperCase()}
                </div>
              )}

              {/* Cabecera */}
              <div style={{ border: "1.5px solid #374151", margin: "7px 7px 0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 148px" }}>
                  <div style={{ borderRight: "1.5px solid #374151", padding: "7px 9px", display: "flex", gap: 7, alignItems: "flex-start" }}>
                    <div style={{ width: 34, height: 34, background: "#E8692E", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "#fff", fontWeight: 900, fontSize: 7, lineHeight: 1.2, textAlign: "center" }}>TIC<br/>SOFT<br/>EC</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 900, fontSize: 10.5, color: "#0D1B2A", marginBottom: 1 }}>{note.emisor_razon || EMPRESA.razon}</p>
                      <p style={{ color: "#4b5563", fontSize: 8.5 }}>{note.emisor_dir || EMPRESA.dir}</p>
                      <p style={{ color: "#4b5563", fontSize: 8.5 }}>Tel: {note.emisor_telefono || EMPRESA.tel} | {note.emisor_email || EMPRESA.email}</p>
                      <p style={{ color: "#4b5563", fontSize: 8.5, marginTop: 1 }}>Ambiente: <b>{note.ambiente || "Pruebas"}</b> | Emisión: Normal</p>
                    </div>
                  </div>
                  <div style={{ padding: "7px 8px", textAlign: "center" }}>
                    <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                      <p style={{ color: "#6b7280", fontSize: 7.5, fontWeight: 700, textTransform: "uppercase" }}>R.U.C.</p>
                      <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{note.emisor_ruc || EMPRESA.ruc}</p>
                    </div>
                    <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                      <p style={{ color: "#9333ea", fontSize: 8, fontWeight: 700, textTransform: "uppercase" }}>NOTA DE DÉBITO</p>
                      <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{note.noteNumber}</p>
                    </div>
                    <div style={{ border: `1px solid ${isAutorizada ? "#16a34a" : "#ca8a04"}`, background: isAutorizada ? "#f0fdf4" : "#fefce8", padding: "2px 4px" }}>
                      <p style={{ fontWeight: 700, fontSize: 8, color: isAutorizada ? "#15803d" : "#854d0e" }}>
                        {isAutorizada ? "✓ AUTORIZADO" : "PENDIENTE"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clave acceso */}
              {note.authorizationNumber && (
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px", padding: "4px 7px" }}>
                  <p style={{ fontWeight: 700, color: "#6b7280", fontSize: 7.5, textTransform: "uppercase", marginBottom: 2 }}>Clave de Acceso</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}>
                      {note.authorizationNumber.slice(0, 36).split("").map((c, i) => (
                        <div key={i} style={{ background: "#111", width: 1.8, height: 12 + (parseInt(c) % 3) * 3 }} />
                      ))}
                    </div>
                    <p style={{ fontFamily: "monospace", fontSize: 7.5, color: "#374151", wordBreak: "break-all" }}>{note.authorizationNumber}</p>
                  </div>
                </div>
              )}

              {/* Datos del Cliente */}
              <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  Datos del Cliente
                </div>
                <div style={{ padding: "5px 7px", display: "grid", gridTemplateColumns: "1fr auto", gap: "3px 10px" }}>
                  <div><span style={{ color: "#6b7280", fontWeight: 700 }}>Razón Social: </span><span style={{ fontWeight: 600 }}>{note.customer.name}</span></div>
                  <div><span style={{ color: "#6b7280", fontWeight: 700 }}>RUC/CI: </span><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{note.customer.ruc}</span></div>
                  <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#6b7280", fontWeight: 700 }}>Dirección: </span>{note.customer.address || "Ecuador"}</div>
                </div>
              </div>

              {/* Documento modificado */}
              <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0", background: "#fef3e5" }}>
                <div style={{ padding: "4px 7px", display: "flex", alignItems: "center", gap: 5 }}>
                  <TrendingUp style={{ width: 14, height: 14, color: "#92400e", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 8, color: "#92400e" }}>Documento Modificado:</p>
                    <p style={{ fontFamily: "monospace", fontSize: 8.5, color: "#78350f", fontWeight: 700 }}>Factura {note.invoiceRef}</p>
                    <p style={{ fontSize: 8, color: "#92400e", marginTop: 1 }}><b>Motivo:</b> {note.reason}</p>
                  </div>
                </div>
              </div>

              {/* Detalle del Cargo */}
              <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  Detalle del Cargo Adicional
                </div>
                <div style={{ padding: "6px 7px" }}>
                  <p style={{ fontSize: 8.5, color: "#374151", lineHeight: 1.4 }}>{note.description}</p>
                </div>
              </div>

              {/* Totales */}
              <div style={{ border: "1px solid #9ca3af", margin: "4px 7px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{ color: "#4b5563", fontSize: 8.5 }}>Subtotal:</span>
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(note.subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{ color: "#4b5563", fontSize: 8.5 }}>IVA 12%:</span>
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(note.tax)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 7px", background: "#9333ea" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 10.5 }}>VALOR A DEBITAR:</span>
                  <span style={{ color: "#fff", fontWeight: 900, fontFamily: "monospace", fontSize: 11 }}>{fmt(note.total)}</span>
                </div>
              </div>

              {/* Footer SRI */}
              <div style={{ background: "#0D1B2A", margin: "0 7px 7px", padding: "5px 7px", display: "flex", gap: 7, alignItems: "center", borderRadius: "0 0 4px 4px" }}>
                <Shield style={{ width: 18, height: 18, color: "#E8692E", flexShrink: 0 }} />
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 8, marginBottom: 1 }}>SERVICIO DE RENTAS INTERNAS — REPÚBLICA DEL ECUADOR</p>
                  <p style={{ color: "#9ca3af", fontSize: 7.5 }}>
                    Verifique en: <span style={{ color: "#E8692E" }}>www.sri.gob.ec</span>
                    {isAutorizada && note.sriAuthDate && ` | Fecha Auth: ${note.sriAuthDate}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Vista XML ── */}
      {activeView === "xml" && (
        <div className="flex-1 overflow-auto flex flex-col" style={{ background: "#0f172a" }}>
          {/* Barra info del XML */}
          <div className="flex items-center gap-3 px-4 py-2 border-b text-xs flex-shrink-0"
            style={{ background: "#1e293b", borderColor: "#334155", color: "#94a3b8" }}>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${isAutorizada ? "bg-green-500" : "bg-yellow-500"}`}></div>
              <span className="font-mono" style={{ color: "#e2e8f0" }}>ND-{note.noteNumber.replace(/\\//g, "-")}.xml</span>
            </div>
            <span style={{ color: "#475569" }}>|</span>
            <span>SRI Ecuador · Nota de Débito v1.0.0</span>
            <span style={{ color: "#475569" }}>|</span>
            <span style={{ color: isAutorizada ? "#4ade80" : "#fbbf24" }}>
              {isAutorizada ? "✓ Autorizado" : "⚠ Pendiente"}
            </span>
            <span className="ml-auto" style={{ color: "#475569" }}>{xmlContent.length} bytes</span>
          </div>

          {/* Líneas numeradas + código */}
          <div className="flex flex-1 overflow-auto">
            {/* Números de línea */}
            <div className="flex-shrink-0 px-3 py-4 text-right select-none"
              style={{ background: "#1e293b", borderRight: "1px solid #334155", color: "#475569", fontFamily: "monospace", fontSize: 11, lineHeight: "20px", minWidth: 44 }}>
              {xmlContent.split('\\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Código */}
            <div className="flex-1 overflow-x-auto p-4">
              <pre style={{ fontFamily: "monospace", fontSize: 11, lineHeight: "20px", color: "#e2e8f0", margin: 0 }}
                dangerouslySetInnerHTML={{ __html: highlightXML(xmlContent) }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function SalesDebitNotesContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados
  const [notes, setNotes] = useState<DebitNote[]>(DEBIT_NOTES_INIT);
  const [selected, setSelected] = useState<DebitNote | null>(DEBIT_NOTES_INIT[0]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelSearchModal, setShowCancelSearchModal] = useState(false);
  const [showSRICancellationProcessModal, setShowSRICancellationProcessModal] = useState(false);
  const [pendingCancellationNote, setPendingCancellationNote] = useState<DebitNote | null>(null);
  const [pendingNote, setPendingNote] = useState<DebitNote | null>(null);

  // Variables de tema
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-600" : "text-gray-400";
  const opt = isLight ? "text-gray-900" : "text-white";

  // Filtrar notas
  const filtered = notes.filter((note) => {
    const matchesSearch =
      note.noteNumber.toLowerCase().includes(search.toLowerCase()) ||
      note.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      note.customer.ruc.includes(search) ||
      note.invoiceRef.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "all" || note.sriStatus === filterStatus;
    
    let matchesFecha = true;
    if (fechaDesde && note.date < fechaDesde) matchesFecha = false;
    if (fechaHasta && note.date > fechaHasta) matchesFecha = false;

    return matchesSearch && matchesStatus && matchesFecha;
  });

  const fmt = (num: number) => `$${num.toFixed(2)}`;

  const handlePrint = () => {
    toast.success("Imprimiendo nota de débito...");
  };

  /* ════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6 h-full">

      {/* ── Layout principal: lista + visor ──────────────────────────── */}
      <div className={`flex gap-0 rounded-xl border flex-1 min-h-0 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-white/5"}`}>

        {/* ══ Panel izquierdo: TABLA 60% ══ */}
        <div className={`flex flex-col border-r flex-shrink-0 min-w-0 rounded-l-xl ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0c1520]"}`} style={{ width: "60%" }}>

          {/* ── Barra de herramientas ── */}
          <div className={`px-4 py-3 border-b flex-shrink-0 flex flex-wrap items-center gap-2 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d1724]"}`}>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 flex-1 min-w-[160px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Buscar número, factura, cliente..." 
                className={`flex-1 bg-transparent text-xs focus:outline-none placeholder:text-gray-500 ${isLight ? "text-gray-900" : "text-white"}`} 
              />
            </div>
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              className={`text-xs px-2 py-1.5 border rounded-lg focus:outline-none ${isLight ? "bg-white border-gray-300 text-gray-700" : "bg-[#0d1724] border-white/10 text-gray-400"}`}
            >
              <option value="all" className={opt}>Estado: Todos</option>
              <option value="authorized" className={opt}>Autorizada</option>
              <option value="pending" className={opt}>Pendiente</option>
              <option value="rejected" className={opt}>Rechazada</option>
            </select>
            
            {/* ── Filtro fechas ── */}
            <div className="flex items-center gap-2">
              <DatePicker
                value={fechaDesde}
                onChange={setFechaDesde}
                placeholder="Desde"
                isLight={isLight}
              />
              <span className="text-gray-400 text-xs">—</span>
              <DatePicker
                value={fechaHasta}
                onChange={setFechaHasta}
                placeholder="Hasta"
                isLight={isLight}
              />
              {(fechaDesde || fechaHasta) && (
                <button onClick={() => { setFechaDesde(""); setFechaHasta(""); }} title="Limpiar fechas"
                  className="text-gray-400 hover:text-primary">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </button>
            
            <button 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-primary/30"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva ND
            </button>
            
            <button 
              onClick={() => setShowCancelSearchModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-red-300 text-red-700 hover:bg-red-50" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}`}>
              <XCircle className="w-3.5 h-3.5" /> Anular ND
            </button>
          </div>

          {/* ── TABLA ── */}
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto custom-scrollbar">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className={isLight ? "bg-gray-200" : "bg-[#0d1724]"}>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>N° NOTA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>FECHA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>FACTURA REF.</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>CLIENTE</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>RUC</th>
                  <th className={`px-3 py-2.5 text-right font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>VALOR</th>
                  <th className={`px-3 py-2.5 text-center font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((note) => {
                    const isSelected = selected?.id === note.id;
                    return (
                      <tr
                        key={note.id}
                        onClick={() => setSelected(note)}
                        className={`border-b cursor-pointer transition-colors ${
                          isLight ? "border-gray-100" : "border-white/5"
                        } ${
                          isSelected
                            ? (isLight ? "bg-orange-50/30" : "bg-primary/10")
                            : (isLight ? "hover:bg-gray-50" : "hover:bg-white/5")
                        }`}
                        style={isSelected ? { borderLeft: "3px solid #E8692E" } : undefined}
                      >
                        <td className={`px-3 py-1.5 ${txt}`}>
                          <div className="font-mono font-bold text-xs">{note.noteNumber}</div>
                        </td>
                        <td className={`px-3 py-1.5 text-xs ${txt}`}>{note.date}</td>
                        <td className={`px-3 py-1.5 ${txt}`}>
                          <div className="font-mono text-xs text-purple-600">{note.invoiceRef}</div>
                        </td>
                        <td className={`px-3 py-1.5 text-xs font-medium ${txt}`}>
                          {note.customer.name}
                        </td>
                        <td className={`px-3 py-1.5 text-xs font-mono ${sub}`}>
                          {note.customer.ruc}
                        </td>
                        <td className={`px-3 py-1.5 text-right font-mono font-bold text-xs ${txt}`}>
                          {fmt(note.total)}
                        </td>
                        <td className="px-3 py-1.5 text-center">
                          {note.sriStatus === "authorized" && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"}`}>
                              <CheckCircle className="w-3 h-3" />
                              Autorizada
                            </span>
                          )}
                          {note.sriStatus === "pending" && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-400"}`}>
                              <Clock className="w-3 h-3" />
                              Pendiente
                            </span>
                          )}
                          {note.sriStatus === "rejected" && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400"}`}>
                              <AlertTriangle className="w-3 h-3" />
                              Rechazada
                            </span>
                          )}
                          {note.status === "cancelled" && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-gray-100 text-gray-700" : "bg-gray-500/20 text-gray-400"}`}>
                              <XCircle className="w-3 h-3" />
                              Cancelada
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className={`w-12 h-12 ${sub}`} />
                        <p className={`text-sm ${sub}`}>No se encontraron notas de débito</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ Panel derecho: VISOR 40% ══ */}
        <div className="flex-1 flex flex-col min-w-0 rounded-r-xl overflow-hidden">
          {selected ? (
            <DebitNoteViewer note={selected} onPrint={handlePrint} onCancel={() => setShowCancelModal(true)} isLight={isLight} />
          ) : (
            <div className={`flex-1 flex items-center justify-center ${isLight ? "bg-gray-50" : "bg-[#0c1520]"}`}>
              <div className="text-center">
                <FileText className={`w-16 h-16 mx-auto mb-4 ${sub}`} />
                <p className={`text-sm ${sub}`}>Seleccione una nota de débito para ver el detalle</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modales */}
      {showCreateModal && (
        <CreateDebitNoteModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={(newNote) => {
            // El proceso SRI ya está completo en el modal, solo agregar la nota
            const noteWithId = {
              ...newNote,
              id: Date.now().toString(),
              sriStatus: "authorized" as const,
              status: "completed" as const,
              authorizationNumber: newNote.noteNumber.replace(/-/g, "") + Array.from({ length: 39 }, () => Math.floor(Math.random() * 10)).join(""),
              sriAuthDate: `${newNote.date} ${newNote.time}`
            };
            setNotes([noteWithId, ...notes]);
            setSelected(noteWithId);
            toast.success("Nota de débito autorizada por el SRI");
          }}
          isLight={isLight}
        />
      )}
      {pendingNote && (
        <SRICancellationProcessModal
          isOpen={true}
          onClose={() => setPendingNote(null)}
          noteNumber={pendingNote.noteNumber}
          reason={pendingNote.cancellationReason || "Sin motivo"}
          onComplete={() => {
            const finalNote = { ...pendingNote, status: "cancelled" as const };
            setNotes([finalNote, ...notes]);
            setSelected(finalNote);
            setPendingNote(null);
            toast.success("Nota de débito autorizada por el SRI");
          }}
          isLight={isLight}
        />
      )}
      {showCancelModal && (
        <CancelCreditNoteModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          noteData={selected!}
          onConfirm={(reason) => {
            setPendingCancellationNote({ ...selected!, cancellationReason: reason });
            setShowCancelModal(false);
            setShowSRICancellationProcessModal(true);
          }}
          isLight={isLight}
        />
      )}
      {showSRICancellationProcessModal && pendingCancellationNote && (
        <SRICancellationProcessModal
          isOpen={showSRICancellationProcessModal}
          onClose={() => setShowSRICancellationProcessModal(false)}
          noteNumber={pendingCancellationNote.noteNumber}
          reason={pendingCancellationNote.cancellationReason || "Sin motivo"}
          onComplete={() => {
            const updatedNotes = notes.map(n => 
              n.id === pendingCancellationNote.id 
                ? { ...n, status: "cancelled" as const }
                : n
            );
            setNotes(updatedNotes);
            setSelected({ ...pendingCancellationNote, status: "cancelled" as const });
            setPendingCancellationNote(null);
            toast.success("Nota de débito anulada exitosamente");
          }}
          isLight={isLight}
        />
      )}
      {showCancelSearchModal && (
        <CancelDebitNoteSearchModal
          isOpen={showCancelSearchModal}
          onClose={() => setShowCancelSearchModal(false)}
          onSave={(data) => {
            // data contiene: { note, reason, cancelDate }
            const updatedNotes = notes.map(n => 
              n.noteNumber === data.note.number 
                ? { ...n, status: "cancelled" as const }
                : n
            );
            setNotes(updatedNotes);
            toast.success(`Nota de débito ${data.note.number} anulada exitosamente`);
          }}
          isLight={isLight}
        />
      )}
    </div>
  );
}