import { useState } from "react";
import { Search, FileText, Download, Printer, CheckCircle, Clock, AlertTriangle, XCircle, Plus, Shield, ZoomIn, ZoomOut, RefreshCw, Code2, X, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../contexts/theme-context";
import { DatePicker } from "./date-picker-range";
import { CreatePurchaseDebitNoteModal } from "./create-purchase-debit-note-modal";

/* ══════════════════════════════════════════════════════════════════════
   TIPOS - DOCUMENTOS RECIBIDOS DE PROVEEDORES
══════════════════════════════════════════════════════════════════════ */
interface PurchaseDebitNote {
  id: string;
  noteNumber: string;
  date: string;
  time: string;
  invoiceRef: string;
  reason: string;
  supplier: {
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
  status: "authorized" | "pending" | "rejected";
  authorizationNumber?: string;
  sriStatus?: "authorized" | "pending" | "rejected" | "not_sent";
  sriAuthDate?: string;
  ambiente?: string;
}

/* ══════════════════════════════════════════════════════════════════════
   DATOS MOCK - NUESTRA EMPRESA (receptor)
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

/* ══════════════════════════════════════════════════════════════════════
   FUNCIÓN: GENERAR XML
══════════════════════════════════════════════════════════════════════ */
function generateDebitNoteXML(note: PurchaseDebitNote): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<notaDebito id="comprobante" version="1.0.0">
  <infoTributaria>
    <ambiente>${note.ambiente === "Producción" ? "2" : "1"}</ambiente>
    <tipoEmision>1</tipoEmision>
    <razonSocial>${note.supplier.name}</razonSocial>
    <nombreComercial>${note.supplier.name}</nombreComercial>
    <ruc>${note.supplier.ruc}</ruc>
    <claveAcceso>${note.authorizationNumber || genClave()}</claveAcceso>
    <codDoc>05</codDoc>
    <estab>${note.noteNumber.split('-')[0]}</estab>
    <ptoEmi>${note.noteNumber.split('-')[1]}</ptoEmi>
    <secuencial>${note.noteNumber.split('-')[2]}</secuencial>
    <dirMatriz>${note.supplier.address || 'Ecuador'}</dirMatriz>
  </infoTributaria>
  <infoNotaDebito>
    <fechaEmision>${note.date.split('-').reverse().join('/')}</fechaEmision>
    <dirEstablecimiento>${note.supplier.address || 'Ecuador'}</dirEstablecimiento>
    <tipoIdentificacionComprador>04</tipoIdentificacionComprador>
    <razonSocialComprador>${EMPRESA.razon}</razonSocialComprador>
    <identificacionComprador>${EMPRESA.ruc}</identificacionComprador>
    <obligadoContabilidad>SI</obligadoContabilidad>
    <codDocModificado>01</codDocModificado>
    <numDocModificado>${note.invoiceRef}</numDocModificado>
    <fechaEmisionDocSustento>${note.date.split('-').reverse().join('/')}</fechaEmisionDocSustento>
    <totalSinImpuestos>${note.subtotal.toFixed(2)}</totalSinImpuestos>
    <moneda>DOLAR</moneda>
    <totalConImpuestos>
      <totalImpuesto>
        <codigo>2</codigo>
        <codigoPorcentaje>2</codigoPorcentaje>
        <baseImponible>${note.subtotal.toFixed(2)}</baseImponible>
        <valor>${note.tax.toFixed(2)}</valor>
      </totalImpuesto>
    </totalConImpuestos>
    <valorTotal>${note.total.toFixed(2)}</valorTotal>
    <motivo>${note.reason}</motivo>
  </infoNotaDebito>
</notaDebito>`;
}

const DEBIT_NOTES_INIT: PurchaseDebitNote[] = [
  {
    id: "1",
    noteNumber: "005-001-000001",
    date: "2026-03-05",
    time: "10:20",
    invoiceRef: "001-002-001234",
    reason: "Intereses por mora en el pago",
    supplier: {
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
    status: "authorized",
    authorizationNumber: "0503202601179001691900120050010000000141234567890",
    sriStatus: "authorized",
    sriAuthDate: "2026-03-05 10:25",
    ambiente: "Pruebas",
  },
  {
    id: "2",
    noteNumber: "003-002-000045",
    date: "2026-03-07",
    time: "14:30",
    invoiceRef: "003-002-002345",
    reason: "Recargo por transporte adicional",
    supplier: {
      name: "Distribuidora El Sol S.A.",
      ruc: "1891234567001",
      address: "Calle Bolívar 234 y Rocafuerte, Cuenca",
      email: "ventas@elsol.com.ec",
      phone: "07-2890123"
    },
    description: "Cargo adicional por entrega fuera de horario",
    subtotal: 85.00,
    tax: 10.20,
    total: 95.20,
    status: "authorized",
    authorizationNumber: "0703202601188912345670011230020000004541234567891",
    sriStatus: "authorized",
    sriAuthDate: "2026-03-07 14:35",
    ambiente: "Pruebas",
  },
  {
    id: "3",
    noteNumber: "002-001-000012",
    date: "2026-03-08",
    time: "11:15",
    invoiceRef: "002-001-003456",
    reason: "Recargo por servicio express",
    supplier: {
      name: "Importadora del Pacífico Cía. Ltda.",
      ruc: "1712345678001",
      address: "Av. de las Américas y José Mascote, Guayaquil",
      email: "info@importadorapacifico.com",
      phone: "04-2567890"
    },
    description: "Entrega urgente solicitada con 24h de anticipación",
    subtotal: 150.00,
    tax: 18.00,
    total: 168.00,
    status: "pending",
    sriStatus: "pending",
    ambiente: "Pruebas",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE: VISOR RIDE
══════════════════════════════════════════════════════════════════════ */
interface DebitNoteRIDEProps {
  note: PurchaseDebitNote;
  zoom: number;
  setZoom: (zoom: number) => void;
  onPrint: () => void;
  activeView: 'ride' | 'xml';
  setActiveView: (view: 'ride' | 'xml') => void;
  isLight: boolean;
}

function DebitNoteRIDE({ note, zoom, setZoom, onPrint, activeView, setActiveView, isLight }: DebitNoteRIDEProps) {
  const fmt = (num: number) => `$${num.toFixed(2)}`;
  const isAutorizada = note.sriStatus === "authorized";
  
  const xmlContent = generateDebitNoteXML(note);
  const xmlLines = xmlContent.split('\n');
  const xmlSize = new Blob([xmlContent]).size;

  return (
    <div className="flex flex-col h-full">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0" style={{ background: "#f9fafb", borderColor: "#e5e7eb" }}>
        {/* Tabs RIDE / XML */}
        <div className="flex gap-0.5 p-0.5 rounded-lg" style={{ background: "#e5e7eb" }}>
          <button 
            onClick={() => setActiveView('ride')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeView === 'ride' 
                ? 'text-white shadow' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={activeView === 'ride' ? { background: '#E8692E' } : {}}
          >
            <FileText className="w-3.5 h-3.5" /> RIDE
          </button>
          <button 
            onClick={() => setActiveView('xml')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeView === 'xml' 
                ? 'text-white shadow' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            style={activeView === 'xml' ? { background: '#E8692E' } : {}}
          >
            <Code2 className="w-3.5 h-3.5" /> XML
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Controles zoom (solo RIDE) */}
          {activeView === 'ride' && (
            <div className="flex items-center gap-0.5 border rounded-lg px-1 border-gray-300">
              <button 
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 rounded transition-colors text-gray-600 hover:bg-gray-100"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono w-9 text-center text-gray-600">{zoom}%</span>
              <button 
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-1 rounded transition-colors text-gray-600 hover:bg-gray-100"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoom(100)}
                className="p-1 rounded transition-colors text-gray-500 hover:bg-gray-100"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Controles XML */}
          {activeView === 'xml' && (
            <>
              <button 
                onClick={() => {
                  const textarea = document.createElement('textarea');
                  textarea.value = xmlContent;
                  textarea.style.position = 'fixed';
                  textarea.style.opacity = '0';
                  document.body.appendChild(textarea);
                  textarea.select();
                  try {
                    document.execCommand('copy');
                    toast.success('XML copiado al portapapeles');
                  } catch (err) {
                    toast.error('Error al copiar XML');
                  }
                  document.body.removeChild(textarea);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <Code2 className="w-3.5 h-3.5" /> Copiar
              </button>
              
              <button 
                onClick={() => {
                  const blob = new Blob([xmlContent], { type: 'application/xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `nota-debito-${note.noteNumber}.xml`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success('XML descargado');
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <Download className="w-3.5 h-3.5" /> .xml
              </button>
            </>
          )}

          <button 
            onClick={onPrint} 
            className="flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-medium transition-colors"
            style={{ background: '#E8692E' }}
          >
            <Printer className="w-3.5 h-3.5" /> PDF
          </button>
          
          
        </div>
      </div>

      {/* Contenedor con zoom */}
      <div className="flex-1 overflow-auto" style={{ background: activeView === 'xml' ? '#1e1e1e' : '#f9fafb' }}>
        {activeView === 'ride' ? (
          <div className="p-4">
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.15s" }}>
              <div className="bg-white mx-auto shadow-2xl text-gray-800" style={{ width: 520, fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 9.5 }}>

                {note.sriStatus !== "authorized" && (
                  <div style={{ background: "#fbbf24", color: "#78350f", textAlign: "center", padding: "3px 8px", fontWeight: 700, fontSize: 9, letterSpacing: 1 }}>
                    ⚠ DOCUMENTO NO AUTORIZADO — {note.sriStatus?.toUpperCase()}
                  </div>
                )}

                {/* Cabecera */}
                <div style={{ border: "1.5px solid #374151", margin: "7px 7px 0" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 148px" }}>
                    <div style={{ borderRight: "1.5px solid #374151", padding: "7px 9px", display: "flex", gap: 7, alignItems: "flex-start" }}>
                      <div style={{ width: 34, height: 34, background: "#666", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: "#fff", fontWeight: 900, fontSize: 7, lineHeight: 1.2, textAlign: "center" }}>PROV</span>
                      </div>
                      <div>
                        <p style={{ fontWeight: 900, fontSize: 10.5, color: "#0D1B2A", marginBottom: 1 }}>{note.supplier.name}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5 }}>{note.supplier.address || 'Ecuador'}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5 }}>Tel: {note.supplier.phone || 'N/A'} | {note.supplier.email || 'N/A'}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5, marginTop: 1 }}>Ambiente: <b>{note.ambiente || "Pruebas"}</b> | Emisión: Normal</p>
                      </div>
                    </div>
                    <div style={{ padding: "7px 8px", textAlign: "center" }}>
                      <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                        <p style={{ color: "#6b7280", fontSize: 7.5, fontWeight: 700, textTransform: "uppercase" }}>R.U.C.</p>
                        <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{note.supplier.ruc}</p>
                      </div>
                      <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                        <p style={{ color: "#E8692E", fontSize: 8, fontWeight: 700, textTransform: "uppercase" }}>NOTA DE DÉBITO</p>
                        <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{note.noteNumber}</p>
                      </div>
                      <div style={{ border: `1px solid ${note.sriStatus === "authorized" ? "#16a34a" : "#ca8a04"}`, background: note.sriStatus === "authorized" ? "#f0fdf4" : "#fefce8", padding: "2px 4px" }}>
                        <p style={{ fontWeight: 700, fontSize: 8, color: note.sriStatus === "authorized" ? "#15803d" : "#854d0e" }}>
                          {note.sriStatus === "authorized" ? "✓ AUTORIZADO" : "PENDIENTE"}
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

                {/* Datos del Receptor (nosotros) */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                  <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Datos del Receptor (Cliente)
                  </div>
                  <div style={{ padding: "5px 7px", display: "grid", gridTemplateColumns: "1fr auto", gap: "3px 10px" }}>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>Razón Social: </span><span style={{ fontWeight: 600 }}>{EMPRESA.razon}</span></div>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>RUC/CI: </span><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{EMPRESA.ruc}</span></div>
                    <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#6b7280", fontWeight: 700 }}>Dirección: </span>{EMPRESA.dir}</div>
                  </div>
                </div>

                {/* Documento modificado */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0", background: "#fef3c7" }}>
                  <div style={{ padding: "4px 7px", display: "flex", alignItems: "center", gap: 5 }}>
                    <TrendingUp style={{ width: 14, height: 14, color: "#92400e", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 8, color: "#92400e" }}>Documento Modificado:</p>
                      <p style={{ fontFamily: "monospace", fontSize: 8.5, color: "#78350f", fontWeight: 700 }}>Factura {note.invoiceRef}</p>
                      <p style={{ fontSize: 8, color: "#92400e", marginTop: 1 }}><b>Motivo:</b> {note.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Detalle/Motivo */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                  <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Motivo de la Nota de Débito
                  </div>
                  <div style={{ padding: "7px" }}>
                    <p style={{ fontSize: 8.5, color: "#374151", lineHeight: 1.5 }}>{note.description}</p>
                  </div>
                </div>

                {/* Totales */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ color: "#4b5563", fontSize: 8.5 }}>SUBTOTAL:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(note.subtotal)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ color: "#4b5563", fontSize: 8.5 }}>IVA 12%:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(note.tax)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 7px", background: "#E8692E" }}>
                    <span style={{ color: "#fff", fontWeight: 900, fontSize: 10.5 }}>TOTAL NOTA:</span>
                    <span style={{ color: "#fff", fontWeight: 900, fontFamily: "monospace", fontSize: 11 }}>{fmt(note.total)}</span>
                  </div>
                </div>

                {/* Footer SRI */}
                <div style={{ background: "#0D1B2A", margin: "4px 7px 7px", padding: "5px 7px", display: "flex", gap: 7, alignItems: "center", borderRadius: "0 0 4px 4px" }}>
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
        ) : (
          // Vista XML con syntax highlighting
          <div className="h-full flex flex-col">
            {/* Barra de información del archivo */}
            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: "#2d2d2d", borderColor: "#3e3e3e" }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-white text-xs font-mono font-semibold">{note.noteNumber}.xml</span>
                </div>
                <span className="text-gray-400 text-xs">|</span>
                <span className="text-gray-400 text-xs">SRI Ecuador · Comprobante v1.0.0</span>
                <span className="text-gray-400 text-xs">|</span>
                <span className="text-green-400 text-xs flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {isAutorizada ? 'Autorizado' : 'Pendiente'}
                </span>
                <span className="text-gray-500 text-xs">{xmlSize} bytes</span>
              </div>
            </div>

            {/* Código XML con numeración */}
            <div className="flex-1 overflow-auto">
              <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left", transition: "transform 0.15s" }}>
                <div className="flex" style={{ fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace", fontSize: '13px', lineHeight: '1.6' }}>
                  {/* Números de línea */}
                  <div className="select-none flex-shrink-0 text-right pr-4 pl-4 py-3" style={{ background: "#1e1e1e", color: "#858585", borderRight: "1px solid #3e3e3e" }}>
                    {xmlLines.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  
                  {/* Contenido XML con syntax highlighting */}
                  <div className="flex-1 px-4 py-3" style={{ background: "#1e1e1e" }}>
                    {xmlLines.map((line, i) => {
                      if (!line.trim()) return <div key={i}><br/></div>;
                      
                      const parts: React.ReactNode[] = [];
                      
                      // Parseo más preciso del XML con colores correctos
                      const processLine = (text: string) => {
                        const result: React.ReactNode[] = [];
                        let index = 0;
                        
                        // Regex mejorado para capturar todos los componentes XML
                        const regex = /(<\/?)([\w]+)|(\s+[\w]+)=(")(.*?)(")|([<>])/g;
                        let match;
                        let lastIndex = 0;
                        
                        while ((match = regex.exec(text)) !== null) {
                          // Añadir texto antes del match
                          if (match.index > lastIndex) {
                            const before = text.substring(lastIndex, match.index);
                            if (before) result.push(<span key={`txt${lastIndex}`} style={{ color: '#ffffff' }}>{before}</span>);
                          }
                          
                          if (match[1] && match[2]) {
                            // Etiqueta: < o </ + nombre
                            result.push(<span key={`open${match.index}`} style={{ color: '#808080' }}>{match[1]}</span>);
                            result.push(<span key={`tag${match.index}`} style={{ color: '#e8692e' }}>{match[2]}</span>);
                          } else if (match[3] && match[4] && match[5] && match[6]) {
                            // Atributo="valor"
                            result.push(<span key={`attr${match.index}`} style={{ color: '#9cdcfe' }}>{match[3]}</span>);
                            result.push(<span key={`eq${match.index}`} style={{ color: '#ffffff' }}>=</span>);
                            result.push(<span key={`q1${match.index}`} style={{ color: '#ce9178' }}>{match[4]}</span>);
                            result.push(<span key={`val${match.index}`} style={{ color: '#ce9178' }}>{match[5]}</span>);
                            result.push(<span key={`q2${match.index}`} style={{ color: '#ce9178' }}>{match[6]}</span>);
                          } else if (match[7]) {
                            // > o caracteres sueltos
                            result.push(<span key={`char${match.index}`} style={{ color: '#808080' }}>{match[7]}</span>);
                          }
                          
                          lastIndex = regex.lastIndex;
                        }
                        
                        // Texto restante
                        if (lastIndex < text.length) {
                          const remaining = text.substring(lastIndex);
                          result.push(<span key={`end${i}`} style={{ color: '#ffffff' }}>{remaining}</span>);
                        }
                        
                        return result;
                      };
                      
                      const highlighted = processLine(line);
                      return <div key={i}>{highlighted.length > 0 ? highlighted : <span style={{ color: '#ffffff' }}>{line}</span>}</div>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function PurchaseDebitNotesContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [notes, setNotes] = useState<PurchaseDebitNote[]>(DEBIT_NOTES_INIT);
  const [selected, setSelected] = useState<PurchaseDebitNote | null>(DEBIT_NOTES_INIT[0]);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [zoom, setZoom] = useState(100);
  const [activeView, setActiveView] = useState<'ride' | 'xml'>('ride');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = notes.filter((note) => {
    const matchSearch = search
      ? note.noteNumber.toLowerCase().includes(search.toLowerCase()) ||
        note.supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        note.supplier.ruc.includes(search)
      : true;
    const matchStatus = filterStatus === "all" || note.sriStatus === filterStatus;
    
    // Filtro de fecha
    let matchFecha = true;
    if (fechaDesde || fechaHasta) {
      const noteFecha = new Date(note.date);
      if (fechaDesde) {
        const desde = new Date(fechaDesde);
        if (noteFecha < desde) matchFecha = false;
      }
      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        if (noteFecha > hasta) matchFecha = false;
      }
    }
    
    return matchSearch && matchStatus && matchFecha;
  });

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const opt = isLight ? "text-gray-900" : "text-white";
  const fmt = (num: number) => `$${num.toFixed(2)}`;

  const handlePrint = () => {
    toast.success("Imprimiendo nota de débito...");
  };

  /* ═══════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6 h-full">

      {/* ── Layout principal: lista + visor ──────────────────────────── */}
      <div className={`flex gap-0 rounded-xl border flex-1 min-h-0 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-white/5"}`}>

        {/* ══ Panel izquierdo: TABLA 60% ══ */}
        <div className={`flex flex-col border-r flex-shrink-0 min-w-0 rounded-l-xl ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0c1520]"}`} style={{ width: "60%" }}>

          {/* ── FILA 1: FILTROS ── */}
          <div className={`px-4 py-3 border-b flex-shrink-0 flex flex-wrap items-center gap-2 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d1724]"}`}>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 flex-1 min-w-[160px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Buscar número, contribuyente" 
                className={`flex-1 bg-transparent text-xs focus:outline-none placeholder:text-gray-500 ${isLight ? "text-gray-900" : "text-white"}`} 
              />
            </div>
            
            <select 
              value={filterTipo} 
              onChange={e => setFilterTipo(e.target.value)}
              className={`text-xs px-2 py-1.5 border rounded-lg focus:outline-none ${isLight ? "bg-white border-gray-300 text-gray-700" : "bg-[#0d1724] border-white/10 text-gray-400"}`}
            >
              <option value="all" className={opt}>Tipo: Todos</option>
              <option value="intereses" className={opt}>Intereses</option>
              <option value="recargo" className={opt}>Recargo</option>
              <option value="otros" className={opt}>Otros</option>
            </select>
            
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
          </div>

          {/* ── FILA 2: BOTONES DE ACCIÓN ── */}
          <div className={`px-4 py-2.5 border-b flex-shrink-0 flex items-center gap-2 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0d1724]/50"}`}>
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </button>

            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-primary/30"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Nota de Débito
            </button>

            <button 
              onClick={() => {
                if (!selected) {
                  toast.error("Seleccione una nota de débito para anular");
                  return;
                }
                toast.info("Función en desarrollo");
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-red-300 text-red-700 hover:bg-red-50" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}`}
            >
              <XCircle className="w-3.5 h-3.5" /> Anular Nota de Débito
            </button>
          </div>

          {/* ── TABLA ── */}
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto custom-scrollbar">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className={isLight ? "bg-gray-200" : "bg-[#0d1724]"}>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>N° NOTA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>FECHA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>PROVEEDOR</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>RUC</th>
                  <th className={`px-3 py-2.5 text-right font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>TOTAL</th>
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
                        <td className={`px-3 py-1.5 text-xs font-medium ${txt}`}>
                          {note.supplier.name}
                        </td>
                        <td className={`px-3 py-1.5 text-xs font-mono ${sub}`}>
                          {note.supplier.ruc}
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
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FileText className={`w-12 h-12 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                        <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>No se encontraron notas de débito</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ Panel derecho: VISOR RIDE 40% ══ */}
        <div className={`flex flex-col flex-1 min-w-0 rounded-r-xl ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
          {selected ? (
            <DebitNoteRIDE note={selected} zoom={zoom} setZoom={setZoom} onPrint={handlePrint} activeView={activeView} setActiveView={setActiveView} isLight={isLight} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className={`w-16 h-16 mx-auto mb-4 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                <p className={`text-sm font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Selecciona una nota de débito para ver los detalles
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ MODAL: CREAR NUEVA NOTA DE DÉBITO ══ */}
      {showCreateModal && (
        <CreatePurchaseDebitNoteModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={(data) => {
            const newNote: PurchaseDebitNote = {
              id: String(notes.length + 1),
              noteNumber: data.noteNumber,
              date: data.date,
              time: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
              invoiceRef: data.invoiceRef,
              reason: data.reason,
              supplier: data.supplier,
              description: data.description,
              subtotal: data.subtotal,
              tax: data.tax,
              total: data.total,
              status: "pending",
              sriStatus: "not_sent",
              ambiente: data.ambiente || "Pruebas",
            };
            setNotes([newNote, ...notes]);
            setSelected(newNote);
            setShowCreateModal(false);
            toast.success("Nota de débito registrada exitosamente");
          }}
        />
      )}
    </div>
  );
}