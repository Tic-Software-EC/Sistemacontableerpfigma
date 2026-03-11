import { useState } from "react";
import { Search, Truck, Plus, Calendar, X, Printer, Send, FileText, Download, CheckCircle, Clock, AlertTriangle, Shield, ZoomOut, ZoomIn, RefreshCw, Code2, XCircle, FileCode } from "lucide-react";
import { DatePicker } from "./date-picker-range";
import { CreateRemissionGuideModal } from "./create-remission-guide-modal";
import { CancelRemissionGuideModal } from "./cancel-remission-guide-modal";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface RemissionItem {
  code: string;
  name: string;
  quantity: number;
  unit: string;
}

interface RemissionGuide {
  id: string;
  guideNumber: string;
  date: string;
  time: string;
  destinatario: {
    name: string;
    ruc: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  transportista: {
    name: string;
    ruc: string;
    placa: string;
  };
  puntoPartida: string;
  puntoDestino: string;
  motivoTraslado: "venta" | "compra" | "devolucion" | "importacion" | "exportacion" | "traslado_entre_establecimientos" | "otros";
  motivoTrasladoDesc?: string;
  items: RemissionItem[];
  relatedInvoice?: string;
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
  periodo_fiscal?: string;
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

const GUIDES_INIT: RemissionGuide[] = [
  {
    id: "1",
    guideNumber: "001-001-000045",
    date: "2026-03-05",
    time: "14:32",
    destinatario: {
      name: "Corporación Favorita C.A.",
      ruc: "1790016919001",
      address: "Av. General Enríquez km 4.5, Sangolquí",
      email: "recepcion@favorita.com",
      phone: "02-3456789"
    },
    transportista: {
      name: "Transportes Rápidos S.A.",
      ruc: "1790234567001",
      placa: "GYE-1234"
    },
    puntoPartida: "Av. Amazonas N35-17 y Japón, Quito",
    puntoDestino: "Av. General Enríquez km 4.5, Sangolquí",
    motivoTraslado: "venta",
    items: [
      { code: "PROD001", name: "Laptop HP 15-dy", quantity: 1, unit: "UND" },
      { code: "PROD002", name: "Mouse Logitech MX", quantity: 2, unit: "UND" },
    ],
    relatedInvoice: "001-001-000123",
    status: "completed",
    seller: "Juan Pérez",
    branch: "Sucursal Centro",
    authorizationNumber: "0503202601179001234500160010010000004541234567890",
    sriStatus: "authorized",
    sriAuthDate: "2026-03-05 14:35",
    emisor_razon: EMPRESA.razon,
    emisor_dir: EMPRESA.dir,
    emisor_ruc: EMPRESA.ruc,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    ambiente: "Pruebas",
    periodo_fiscal: "03/2026",
  },
  {
    id: "2",
    guideNumber: "001-001-000046",
    date: "2026-03-06",
    time: "09:15",
    destinatario: {
      name: "Importadora del Pacífico Cía. Ltda.",
      ruc: "1712345678001",
      address: "Av. de las Américas y José Mascote, Guayaquil",
      email: "info@importadorapacifico.com",
      phone: "04-2567890"
    },
    transportista: {
      name: "Servientrega Ecuador S.A.",
      ruc: "1790345678001",
      placa: "UIO-5678"
    },
    puntoPartida: "Av. Amazonas N35-17 y Japón, Quito",
    puntoDestino: "Av. de las Américas y José Mascote, Guayaquil",
    motivoTraslado: "venta",
    items: [
      { code: "PROD010", name: "Monitor Samsung 24\"", quantity: 3, unit: "UND" },
    ],
    relatedInvoice: "001-001-000124",
    status: "completed",
    seller: "Ana Torres",
    branch: "Sucursal Norte",
    authorizationNumber: "0603202601179001234500160010010000004641234567891",
    sriStatus: "authorized",
    sriAuthDate: "2026-03-06 09:20",
    emisor_razon: EMPRESA.razon,
    emisor_dir: EMPRESA.dir,
    emisor_ruc: EMPRESA.ruc,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    ambiente: "Pruebas",
    periodo_fiscal: "03/2026",
  },
  {
    id: "3",
    guideNumber: "001-001-000047",
    date: "2026-03-07",
    time: "11:45",
    destinatario: {
      name: "Distribuidora El Sol S.A.",
      ruc: "1891234567001",
      address: "Calle Bolívar 234 y Rocafuerte, Cuenca",
      email: "ventas@elsol.com.ec",
      phone: "07-2890123"
    },
    transportista: {
      name: "Transportes del Sur S.A.",
      ruc: "1790456789001",
      placa: "CUE-9012"
    },
    puntoPartida: "Av. Amazonas N35-17 y Japón, Quito",
    puntoDestino: "Calle Bolívar 234 y Rocafuerte, Cuenca",
    motivoTraslado: "traslado_entre_establecimientos",
    items: [
      { code: "PROD015", name: "Teclado Mecánico RGB", quantity: 5, unit: "UND" },
      { code: "PROD016", name: "Webcam Logitech C920", quantity: 2, unit: "UND" },
    ],
    status: "pending",
    seller: "Carlos Mendoza",
    branch: "Sucursal Sur",
    sriStatus: "pending",
    emisor_razon: EMPRESA.razon,
    emisor_dir: EMPRESA.dir,
    emisor_ruc: EMPRESA.ruc,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    ambiente: "Pruebas",
    periodo_fiscal: "03/2026",
  },
  {
    id: "4",
    guideNumber: "001-001-000048",
    date: "2026-03-08",
    time: "10:15",
    destinatario: {
      name: "Supermercados La Rebaja S.A.",
      ruc: "1790345678001",
      address: "Av. Maldonado S15-78, Quito",
      email: "facturacion@larebaja.com",
      phone: "02-2667788"
    },
    transportista: {
      name: "Logística Express S.A.",
      ruc: "1790567890001",
      placa: "QTO-3456"
    },
    puntoPartida: "Av. Amazonas N35-17 y Japón, Quito",
    puntoDestino: "Av. Maldonado S15-78, Quito",
    motivoTraslado: "venta",
    items: [
      { code: "PROD025", name: "Router TP-Link AC1200", quantity: 4, unit: "UND" },
      { code: "PROD026", name: "Switch Gigabit 8 puertos", quantity: 2, unit: "UND" },
    ],
    relatedInvoice: "001-001-000127",
    status: "completed",
    seller: "Ana Torres",
    branch: "Sucursal Norte",
    authorizationNumber: "0803202601179001234500160010010000004841234567892",
    sriStatus: "authorized",
    sriAuthDate: "2026-03-08 10:20",
    emisor_razon: EMPRESA.razon,
    emisor_dir: EMPRESA.dir,
    emisor_ruc: EMPRESA.ruc,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    ambiente: "Pruebas",
    periodo_fiscal: "03/2026",
  },
  {
    id: "5",
    guideNumber: "001-001-000049",
    date: "2026-03-09",
    time: "09:30",
    destinatario: {
      name: "Tecnología Avanzada Cía. Ltda.",
      ruc: "1792567890001",
      address: "Av. González Suárez N27-142, Quito",
      email: "compras@tecnoavanzada.ec",
      phone: "02-2998877"
    },
    transportista: {
      name: "Courier Nacional S.A.",
      ruc: "1790678901001",
      placa: "UIO-7890"
    },
    puntoPartida: "Av. Amazonas N35-17 y Japón, Quito",
    puntoDestino: "Av. González Suárez N27-142, Quito",
    motivoTraslado: "venta",
    items: [
      { code: "PROD035", name: "Proyector Epson EB-X06", quantity: 1, unit: "UND" },
      { code: "PROD036", name: "Pantalla de Proyección 100\"", quantity: 1, unit: "UND" },
    ],
    relatedInvoice: "001-001-000129",
    status: "completed",
    seller: "Juan Pérez",
    branch: "Sucursal Centro",
    authorizationNumber: "0903202601179001234500160010010000004941234567893",
    sriStatus: "rejected",
    sriAuthDate: "2026-03-09 09:35",
    emisor_razon: EMPRESA.razon,
    emisor_dir: EMPRESA.dir,
    emisor_ruc: EMPRESA.ruc,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    ambiente: "Pruebas",
    periodo_fiscal: "03/2026",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE RIDE VIEWER (idéntico al diseño de notas de crédito)
══════════════════════════════════════════════════════════════════════ */
interface RIDEViewerProps {
  guide: RemissionGuide | null;
  onPrint: () => void;
  onDownloadPDF: () => void;
  onDownloadXML: () => void;
  onCancel?: () => void;
  isLight: boolean;
}

function RIDEViewer({ guide, onPrint, onDownloadPDF, onDownloadXML, onCancel, isLight }: RIDEViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [activeView, setActiveView] = useState<"ride" | "xml">("ride");
  const [xmlCopied, setXmlCopied] = useState(false);

  if (!guide) {
    return (
      <div className={`flex-1 flex items-center justify-center ${isLight ? "bg-gray-50" : "bg-[#0D1B2A]"}`}>
        <div className="text-center">
          <Truck className={`w-16 h-16 mx-auto mb-4 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
          <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Selecciona una guía para ver su RIDE
          </p>
        </div>
      </div>
    );
  }

  const isAutorizada = guide.sriStatus === "authorized";

  const getMotivoLabel = () => {
    switch (guide.motivoTraslado) {
      case "venta": return "Venta";
      case "compra": return "Compra";
      case "devolucion": return "Devolución";
      case "importacion": return "Importación";
      case "exportacion": return "Exportación";
      case "traslado_entre_establecimientos": return "Traslado entre establecimientos";
      case "otros": return guide.motivoTrasladoDesc || "Otros";
      default: return "No especificado";
    }
  };

  // Generar XML completo de la guía de remisión
  const generateGuideXML = (): string => {
    const items = guide.items.map((item, idx) => `
    <detalle>
      <codigoInterno>${item.code}</codigoInterno>
      <descripcion>${item.name}</descripcion>
      <cantidad>${item.quantity}</cantidad>
      <unidadMedida>${item.unit}</unidadMedida>
    </detalle>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<guiaRemision id="comprobante" version="1.0.0">
  <infoTributaria>
    <ambiente>1</ambiente>
    <tipoEmision>1</tipoEmision>
    <razonSocial>${guide.emisor_razon || EMPRESA.razon}</razonSocial>
    <nombreComercial>TicSoftEc</nombreComercial>
    <ruc>${guide.emisor_ruc || EMPRESA.ruc}</ruc>
    <claveAcceso>${guide.authorizationNumber || "0000000000000000000000000000000000000000000000000"}</claveAcceso>
    <codDoc>06</codDoc>
    <estab>001</estab>
    <ptoEmi>001</ptoEmi>
    <secuencial>${guide.guideNumber.split('-')[2]}</secuencial>
    <dirMatriz>${guide.emisor_dir || EMPRESA.dir}</dirMatriz>
  </infoTributaria>
  <infoGuiaRemision>
    <dirEstablecimiento>${guide.emisor_dir || EMPRESA.dir}</dirEstablecimiento>
    <dirPartida>${guide.puntoPartida}</dirPartida>
    <razonSocialTransportista>${guide.transportista.name}</razonSocialTransportista>
    <tipoIdentificacionTransportista>04</tipoIdentificacionTransportista>
    <rucTransportista>${guide.transportista.ruc}</rucTransportista>
    <placa>${guide.transportista.placa}</placa>
    <fechaIniTransporte>${guide.date.split('-').reverse().join('/')}</fechaIniTransporte>
    <fechaFinTransporte>${guide.date.split('-').reverse().join('/')}</fechaFinTransporte>
  </infoGuiaRemision>
  <destinatarios>
    <destinatario>
      <identificacionDestinatario>${guide.destinatario.ruc}</identificacionDestinatario>
      <razonSocialDestinatario>${guide.destinatario.name}</razonSocialDestinatario>
      <dirDestinatario>${guide.puntoDestino}</dirDestinatario>
      <motivoTraslado>${getMotivoLabel()}</motivoTraslado>${guide.relatedInvoice ? `
      <docAduaneroUnico>${guide.relatedInvoice}</docAduaneroUnico>` : ''}
      <detalles>${items}
      </detalles>
    </destinatario>
  </destinatarios>
  <infoAdicional>
    <campoAdicional nombre="Email">${guide.destinatario.email || guide.emisor_email || EMPRESA.email}</campoAdicional>
    <campoAdicional nombre="Telefono">${guide.destinatario.phone || guide.emisor_telefono || EMPRESA.tel}</campoAdicional>
    <campoAdicional nombre="Vendedor">${guide.seller}</campoAdicional>
    <campoAdicional nombre="Sucursal">${guide.branch}</campoAdicional>
  </infoAdicional>
</guiaRemision>`;
  };

  const xmlContent = generateGuideXML();

  const handleCopyXML = () => {
    navigator.clipboard.writeText(xmlContent).then(() => {
      setXmlCopied(true);
      toast.success("XML copiado al portapapeles");
      setTimeout(() => setXmlCopied(false), 2000);
    });
  };

  const handleDownloadXMLFile = () => {
    const blob = new Blob([xmlContent], { type: "application/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${guide.guideNumber.replace(/\//g, "-")}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("XML descargado");
  };

  const highlightXML = (xml: string) => {
    return xml
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/(&lt;\/?)([\w]+)/g, '<span style="color:#fb923c">$1$2</span>')
      .replace(/([\w]+)(=)(&quot;[^&]*&quot;)/g, '<span style="color:#7dd3fc">$1</span><span style="color:#94a3b8">$2</span><span style="color:#86efac">$3</span>')
      .replace(/(&lt;\?xml.*?&gt;)/g, '<span style="color:#94a3b8;font-style:italic">$1</span>');
  };

  return (
    <div className={`flex flex-col h-full ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
      {/* ── Header fijo ── */}
      <div className={`flex items-center justify-between px-3 py-2 border-b flex-shrink-0 ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#1a2936] border-white/10"}`}>
        {/* Tabs RIDE / XML */}
        <div className={`flex gap-0.5 p-0.5 rounded-lg ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
          <button 
            onClick={() => setActiveView("ride")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeView === "ride" 
                ? "bg-primary text-white shadow" 
                : isLight 
                ? "text-gray-600 hover:bg-gray-100" 
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> RIDE
          </button>
          <button 
            onClick={() => setActiveView("xml")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-medium transition-colors ${
              activeView === "xml" 
                ? "bg-primary text-white shadow" 
                : isLight 
                ? "text-gray-600 hover:bg-gray-100" 
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" /> XML
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Controles zoom (solo RIDE) */}
          {activeView === "ride" && (
            <div className={`flex items-center gap-0.5 border rounded-lg px-1 ${isLight ? "border-gray-300" : "border-white/10"}`}>
              <button 
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className={`p-1 rounded transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/10"}`}
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className={`text-xs font-mono w-9 text-center ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                {zoom}%
              </span>
              <button 
                onClick={() => setZoom(Math.min(130, zoom + 10))}
                className={`p-1 rounded transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/10"}`}
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoom(100)}
                className={`p-1 rounded transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-500 hover:bg-white/10"}`}
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Controles XML */}
          {activeView === "xml" && (
            <>
              <button 
                onClick={handleCopyXML}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-100" : "border-white/10 text-gray-300 hover:bg-white/10"}`}
              >
                <Code2 className="w-3.5 h-3.5" /> {xmlCopied ? "¡Copiado!" : "Copiar"}
              </button>
              <button 
                onClick={handleDownloadXMLFile}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-100" : "border-white/10 text-gray-300 hover:bg-white/10"}`}
              >
                <Download className="w-3.5 h-3.5" /> .xml
              </button>
            </>
          )}

          {/* Botón PDF */}
          <button 
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className={`flex-1 min-h-0 ${activeView === "xml" ? "flex flex-col" : "overflow-auto"} ${activeView === "ride" ? (isLight ? "bg-gray-300" : "bg-[#0D1B2A]") : ""}`}>
        {/* ── Vista RIDE ── */}
        {activeView === "ride" && (
          <div className={`flex-1 overflow-auto p-3 ${isLight ? "bg-gray-300" : "bg-[#0D1B2A]"}`}>
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.15s" }}>
              <div className="bg-white mx-auto shadow-2xl text-gray-800"
                style={{ width: 520, fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 9.5 }}>

                {!isAutorizada && (
                  <div style={{ background: "#fbbf24", color: "#78350f", textAlign: "center", padding: "3px 8px", fontWeight: 700, fontSize: 9, letterSpacing: 1 }}>
                    ⚠ DOCUMENTO NO AUTORIZADO — {guide.sriStatus?.toUpperCase()}
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
                        <p style={{ fontWeight: 900, fontSize: 10.5, color: "#0D1B2A", marginBottom: 1 }}>{guide.emisor_razon || EMPRESA.razon}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5 }}>{guide.emisor_dir || EMPRESA.dir}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5 }}>Tel: {guide.emisor_telefono || EMPRESA.tel} | {guide.emisor_email || EMPRESA.email}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5, marginTop: 1 }}>Ambiente: <b>{guide.ambiente || "Pruebas"}</b> | Emisión: Normal</p>
                      </div>
                    </div>
                    <div style={{ padding: "7px 8px", textAlign: "center" }}>
                      <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                        <p style={{ color: "#6b7280", fontSize: 7.5, fontWeight: 700, textTransform: "uppercase" }}>R.U.C.</p>
                        <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{guide.emisor_ruc || EMPRESA.ruc}</p>
                      </div>
                      <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                        <p style={{ color: "#E8692E", fontSize: 8, fontWeight: 700, textTransform: "uppercase" }}>GUÍA DE REMISIÓN</p>
                        <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{guide.guideNumber}</p>
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
                {guide.authorizationNumber && (
                  <div style={{ border: "1px solid #9ca3af", margin: "4px 7px", padding: "4px 7px" }}>
                    <p style={{ fontWeight: 700, color: "#6b7280", fontSize: 7.5, textTransform: "uppercase", marginBottom: 2 }}>Clave de Acceso</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}>
                        {guide.authorizationNumber.slice(0, 36).split("").map((c, i) => (
                          <div key={i} style={{ background: "#111", width: 1.8, height: 12 + (parseInt(c) % 3) * 3 }} />
                        ))}
                      </div>
                      <p style={{ fontFamily: "monospace", fontSize: 7.5, color: "#374151", wordBreak: "break-all" }}>{guide.authorizationNumber}</p>
                    </div>
                  </div>
                )}

                {/* Datos del Destinatario */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                  <div style={{ background: "#1e40af", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Datos del Destinatario
                  </div>
                  <div style={{ padding: "5px 7px", display: "grid", gridTemplateColumns: "1fr auto", gap: "3px 10px" }}>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>Razón Social: </span><span style={{ fontWeight: 600 }}>{guide.destinatario.name}</span></div>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>RUC/CI: </span><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{guide.destinatario.ruc}</span></div>
                    <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#6b7280", fontWeight: 700 }}>Dirección: </span>{guide.destinatario.address || "Ecuador"}</div>
                  </div>
                </div>

                {/* Información del Traslado */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0", background: "#dbeafe" }}>
                  <div style={{ padding: "4px 7px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 10px" }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 7.5, color: "#1e40af", textTransform: "uppercase" }}>Punto de Partida:</p>
                        <p style={{ fontSize: 8.5, color: "#1e3a8a", fontWeight: 600 }}>{guide.puntoPartida}</p>
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 7.5, color: "#1e40af", textTransform: "uppercase" }}>Punto de Destino:</p>
                        <p style={{ fontSize: 8.5, color: "#1e3a8a", fontWeight: 600 }}>{guide.puntoDestino}</p>
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 7.5, color: "#1e40af", textTransform: "uppercase" }}>Motivo del Traslado:</p>
                        <p style={{ fontSize: 8.5, color: "#1e3a8a", fontWeight: 700 }}>{getMotivoLabel()}</p>
                      </div>
                      {guide.relatedInvoice && (
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 7.5, color: "#1e40af", textTransform: "uppercase" }}>Factura Relacionada:</p>
                          <p style={{ fontSize: 8.5, color: "#1e3a8a", fontWeight: 700, fontFamily: "monospace" }}>{guide.relatedInvoice}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Datos del Transportista */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                  <div style={{ background: "#1e40af", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Datos del Transportista
                  </div>
                  <div style={{ padding: "5px 7px", display: "grid", gridTemplateColumns: "1fr auto auto", gap: "3px 10px" }}>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>Razón Social: </span><span style={{ fontWeight: 600 }}>{guide.transportista.name}</span></div>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>RUC: </span><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{guide.transportista.ruc}</span></div>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>Placa: </span><span style={{ fontFamily: "monospace", fontWeight: 700, color: "#E8692E" }}>{guide.transportista.placa}</span></div>
                  </div>
                </div>

                {/* Detalle de Productos */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                  <div style={{ background: "#1e40af", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Detalle de Productos
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f3f4f6", borderBottom: "1px solid #d1d5db" }}>
                        {["Cód.", "Descripción", "Cant.", "Unidad"].map(h => (
                          <th key={h} style={{ padding: "3px 5px", textAlign: ["Cant.", "Unidad"].includes(h) ? "center" : "left", fontSize: 8, fontWeight: 700, color: "#4b5563", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {guide.items.map((item, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <td style={{ padding: "3px 5px", fontFamily: "monospace", fontWeight: 700, color: "#E8692E", fontSize: 8.5 }}>{item.code}</td>
                          <td style={{ padding: "3px 5px", fontSize: 8.5, maxWidth: 280 }}>{item.name}</td>
                          <td style={{ padding: "3px 5px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{item.quantity}</td>
                          <td style={{ padding: "3px 5px", textAlign: "center", fontFamily: "monospace", fontSize: 8.5 }}>{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Info adicional */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 7px", padding: "5px 7px", display: "grid", gridTemplateColumns: "1fr auto", gap: "2px 10px", background: "#f9fafb" }}>
                  <div><span style={{ color: "#6b7280", fontWeight: 700, fontSize: 8.5 }}>Fecha de emisión: </span><span style={{ fontSize: 8.5, fontWeight: 600 }}>{guide.date} {guide.time}</span></div>
                  <div><span style={{ color: "#6b7280", fontWeight: 700, fontSize: 8.5 }}>Vendedor: </span><span style={{ fontSize: 8.5, fontWeight: 600 }}>{guide.seller}</span></div>
                  <div><span style={{ color: "#6b7280", fontWeight: 700, fontSize: 8.5 }}>Sucursal: </span><span style={{ fontSize: 8.5 }}>{guide.branch}</span></div>
                  {guide.sriAuthDate && (
                    <div><span style={{ color: "#6b7280", fontWeight: 700, fontSize: 8.5 }}>Fecha autorización: </span><span style={{ fontSize: 8.5, fontWeight: 600 }}>{guide.sriAuthDate}</span></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Vista XML ── */}
        {activeView === "xml" && (
          <div className={`flex-1 overflow-hidden ${isLight ? "bg-[#1e293b]" : "bg-[#1e293b]"}`}>
            <div className="flex h-full">
              {/* Números de línea */}
              <div className="text-right select-none py-4 pr-3"
                style={{ background: "#1e293b", borderRight: "1px solid #334155", color: "#475569", fontFamily: "monospace", fontSize: 11, lineHeight: "20px", minWidth: 44 }}>
                {xmlContent.split('\n').map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              {/* Código */}
              <div className="flex-1 overflow-x-auto p-4">
                <pre style={{ fontFamily: "monospace", fontSize: 11, lineHeight: "20px", color: "#e2e8f0", margin: 0 }}
                  dangerouslySetInnerHTML={{ __html: highlightXML(xmlContent) }} />
              </div>
            </div>
            <div className="flex justify-end px-4 py-2 bg-[#1e293b] border-t border-white/10">
              <button
                onClick={handleCopyXML}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}
              >
                <FileCode className="w-3.5 h-3.5" /> {xmlCopied ? "Copiado" : "Copiar XML"}
              </button>
              <button
                onClick={handleDownloadXMLFile}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}
              >
                <Download className="w-3.5 h-3.5" /> Descargar XML
              </button>
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
export function SalesRemissionGuidesContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados
  const [guides, setGuides] = useState<RemissionGuide[]>(GUIDES_INIT);
  const [selected, setSelected] = useState<RemissionGuide | null>(GUIDES_INIT[0]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Variables de tema
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-600" : "text-gray-400";
  const opt = isLight ? "text-gray-900" : "text-white";

  // Filtrar guías
  const filtered = guides.filter((guide) => {
    const matchesSearch =
      guide.guideNumber.toLowerCase().includes(search.toLowerCase()) ||
      guide.destinatario.name.toLowerCase().includes(search.toLowerCase()) ||
      guide.destinatario.ruc.includes(search) ||
      guide.transportista.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "all" || guide.sriStatus === filterStatus;
    
    let matchesFecha = true;
    if (fechaDesde && guide.date < fechaDesde) matchesFecha = false;
    if (fechaHasta && guide.date > fechaHasta) matchesFecha = false;

    return matchesSearch && matchesStatus && matchesFecha;
  });

  const handlePrint = () => {
    toast.success("Imprimiendo guía de remisión...");
  };

  const handleDownloadPDF = () => {
    toast.success("Descargando PDF...");
  };

  const handleDownloadXML = () => {
    toast.success("Descargando XML...");
  };

  const handleSaveGuide = (newGuide: RemissionGuide) => {
    setGuides([newGuide, ...guides]);
    setSelected(newGuide);
    toast.success(`Guía ${newGuide.guideNumber} creada exitosamente`);
  };

  const handleCancelGuide = (data: any) => {
    toast.success(`Guía ${data.guide.guideNumber} anulada exitosamente`);
    // Aquí podrías actualizar el estado de la guía a 'cancelled'
  };

  /* ════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-6 h-full">

      {/* ── Layout principal: lista + visor ──────────────────────────── */}
      <div className={`flex gap-0 rounded-xl border flex-1 min-h-0 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-white/5"}`}>

        {/* ══ Panel izquierdo: TABLA 60% ══ */}
        <div className={`flex flex-col border-r flex-shrink-0 min-w-0 rounded-l-xl ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#1a2936]"}`} style={{ width: "60%" }}>

          {/* ── Barra de herramientas ── */}
          <div className={`px-4 py-3 border-b flex-shrink-0 flex flex-wrap items-center gap-2 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0D1B2A]"}`}>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 flex-1 min-w-[160px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Buscar número, destinatario, transportista..." 
                className={`flex-1 bg-transparent text-xs focus:outline-none placeholder:text-gray-500 ${isLight ? "text-gray-900" : "text-white"}`} 
              />
            </div>
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              className={`text-xs px-2 py-1.5 border rounded-lg focus:outline-none ${isLight ? "bg-white border-gray-300 text-gray-700" : "bg-[#1a2936] border-white/10 text-gray-400"}`}
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
              onClick={() => toast.info("Exportando a CSV...")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button 
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </button>
            
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-primary/30"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva Guía
            </button>
            
            {selected?.sriStatus === "authorized" && selected.status !== "cancelled" && (
              <button 
                onClick={() => setShowCancelModal(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-red-300 text-red-700 hover:bg-red-50" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}`}
              >
                <XCircle className="w-3.5 h-3.5" /> Anular Guía
              </button>
            )}
          </div>

          {/* ── Tabla de guías ── */}
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto custom-scrollbar">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className={`sticky top-0 z-10 ${isLight ? "bg-gray-200" : "bg-[#0D1B2A]"}`}>
                <tr>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>N° GUÍA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>FECHA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>DESTINATARIO</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>RUC</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>TRANSPORTISTA</th>
                  <th className={`px-3 py-2.5 text-center font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>ESTADO</th>
                </tr>
              </thead>
              <tbody className={isLight ? "bg-white" : "bg-[#1a2936]"}>
                {filtered.map((guide) => {
                  const isSelected = selected?.id === guide.id;
                  return (
                    <tr
                      key={guide.id}
                      onClick={() => setSelected(guide)}
                      className={`border-b cursor-pointer transition-colors ${
                        isLight
                          ? "border-gray-100"
                          : "border-white/5"
                      } ${
                        isSelected
                          ? (isLight ? "bg-orange-50/30" : "bg-primary/10")
                          : (isLight ? "hover:bg-gray-50" : "hover:bg-white/5")
                      }`}
                      style={isSelected ? { borderLeft: "3px solid #E8692E" } : undefined}
                    >
                      <td className={`px-3 py-1.5 ${txt}`}>
                        <div className="font-mono font-bold text-xs">{guide.guideNumber}</div>
                      </td>
                      <td className={`px-3 py-1.5 text-xs ${txt}`}>{guide.date}</td>
                      <td className={`px-3 py-1.5 text-xs font-medium ${txt}`}>
                        {guide.destinatario.name}
                      </td>
                      <td className={`px-3 py-1.5 text-xs font-mono ${sub}`}>{guide.destinatario.ruc}</td>
                      <td className={`px-3 py-1.5 text-xs ${sub}`}>
                        {guide.transportista.name}
                      </td>
                      <td className="px-3 py-1.5 text-center">
                        {guide.sriStatus === "authorized" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"}`}>
                            <CheckCircle className="w-3 h-3" />
                            Autorizada
                          </span>
                        )}
                        {guide.sriStatus === "pending" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-400"}`}>
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        )}
                        {guide.sriStatus === "rejected" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400"}`}>
                            <AlertTriangle className="w-3 h-3" />
                            Rechazada
                          </span>
                        )}
                        {guide.sriStatus === "not_sent" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-gray-100 text-gray-700" : "bg-gray-500/20 text-gray-400"}`}>
                            <Shield className="w-3 h-3" />
                            No enviada
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ Panel derecho: RIDE 40% ══ */}
        <div className={`flex-shrink-0 min-w-0 rounded-r-xl overflow-hidden ${isLight ? "bg-gray-50" : "bg-[#0D1B2A]"}`} style={{ width: "40%" }}>
          <RIDEViewer
            guide={selected}
            onPrint={handlePrint}
            onDownloadPDF={handleDownloadPDF}
            onDownloadXML={handleDownloadXML}
            onCancel={selected?.sriStatus === "authorized" && selected.status !== "cancelled" ? () => setShowCancelModal(true) : undefined}
            isLight={isLight}
          />
        </div>
      </div>

      {/* ── Modales ── */}
      {showCreateModal && (
        <CreateRemissionGuideModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveGuide}
        />
      )}

      {showCancelModal && (
        <CancelRemissionGuideModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onCancel={handleCancelGuide}
        />
      )}
    </div>
  );
}