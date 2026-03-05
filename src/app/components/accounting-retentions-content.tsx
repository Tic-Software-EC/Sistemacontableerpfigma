import { useState, useEffect } from "react";
import {
  Search, Plus, Filter, Download, Printer, CheckCircle, Clock,
  AlertTriangle, X, Save, Receipt, Eye, Edit, Trash2,
  ShoppingCart, TrendingUp, FileText, ZoomIn, ZoomOut, RefreshCw,
  Shield, Code2, FileCode, UserSearch, CheckCircle2,
  Send, Wifi, RotateCcw, ChevronRight, Loader2, CalendarDays,
  ChevronUp, ChevronDown, Calendar as CalendarIcon,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { printRetencion, printAllRetentions, downloadRetentionsCSV } from "../utils/print-download";
import { SUPPLIERS_DATA } from "../data/suppliers-data";
import { PURCHASE_INVOICES_DATA, PurchaseInvoice } from "../data/purchase-invoices-data";
import { AccountingKpiCard } from "./ui/accounting-kpi-card";
import { DatePicker } from "./date-picker-range";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface Retencion {
  id: string;
  num: string;
  clave_acceso: string;
  fecha: string;
  // Emisor (quién emite la retención)
  emisor_razon: string;
  emisor_ruc: string;
  emisor_dir: string;
  emisor_telefono: string;
  emisor_email: string;
  // Sujeto retenido
  contribuyente: string;
  ruc: string;
  direccion_sujeto: string;
  // Comprobante origen
  comprobante: string;
  tipo_comprobante: string;
  fecha_comprobante: string;
  periodo_fiscal: string;
  // Detalle
  detalles: DetalleRetencion[];
  // Control
  estado: "emitida" | "pendiente" | "anulada" | "autorizada";
  categoria: "compras" | "ventas";   // compras = nosotros retenemos; ventas = nos retienen a nosotros
  autorizacion_sri: string;
  ambiente: "Producción" | "Pruebas";
  total_retenido: number;
}

interface DetalleRetencion {
  codigo: string;
  concepto: string;
  tipo: "Fuente" | "IVA";
  base_imponible: number;
  porcentaje: number;
  valor_retenido: number;
}

/* ══════════════════════════════════════════════════════════════════════
   DATOS INICIALES
══════════════════════════════════════════════════════════════════════ */
const EMPRESA = {
  razon: "TicSoftEc Cía. Ltda.",
  ruc: "1791234567001",
  dir: "Av. Amazonas N35-17 y Japón, Quito - Ecuador",
  tel: "02-2547-891",
  email: "contabilidad@ticsoftec.com",
};

const genClave = () =>
  Array.from({ length: 49 }, () => Math.floor(Math.random() * 10)).join("");

const RETENCIONES_INIT: Retencion[] = [
  /* ── COMPRAS — nosotros emitimos la retención al proveedor ── */
  {
    id: "RET-C-2026-001",
    num: "001-001-000000045",
    clave_acceso: "0103202607179123456700110010010000000451234567817",
    fecha: "2026-03-01",
    emisor_razon: EMPRESA.razon,
    emisor_ruc: EMPRESA.ruc,
    emisor_dir: EMPRESA.dir,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    contribuyente: "Distribuidora Nacional S.A.",
    ruc: "1792145678001",
    direccion_sujeto: "Av. República del Salvador N34-45, Quito",
    comprobante: "001-001-000000890",
    tipo_comprobante: "Factura",
    fecha_comprobante: "2026-03-01",
    periodo_fiscal: "03/2026",
    detalles: [
      { codigo: "303", concepto: "Honorarios y demás pagos por servicios de personas naturales con título profesional", tipo: "Fuente", base_imponible: 5000.00, porcentaje: 10, valor_retenido: 500.00 },
      { codigo: "725", concepto: "IVA 70% - Prestación de Servicios (Persona Natural)", tipo: "IVA", base_imponible: 600.00, porcentaje: 70, valor_retenido: 420.00 },
    ],
    estado: "autorizada",
    categoria: "compras",
    autorizacion_sri: "4503202607179123456700110010010000000451234567817",
    ambiente: "Producción",
    total_retenido: 920.00,
  },
  {
    id: "RET-C-2026-002",
    num: "001-001-000000046",
    clave_acceso: "0203202607179123456700110010010000000461234567818",
    fecha: "2026-03-02",
    emisor_razon: EMPRESA.razon,
    emisor_ruc: EMPRESA.ruc,
    emisor_dir: EMPRESA.dir,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    contribuyente: "Kreafast S.A.",
    ruc: "0992876543001",
    direccion_sujeto: "Cdla. Kennedy Norte, Guayaquil",
    comprobante: "002-001-000000234",
    tipo_comprobante: "Factura",
    fecha_comprobante: "2026-03-02",
    periodo_fiscal: "03/2026",
    detalles: [
      { codigo: "312", concepto: "Transporte privado de pasajeros o servicio público o privado de carga", tipo: "Fuente", base_imponible: 2800.00, porcentaje: 1, valor_retenido: 28.00 },
      { codigo: "721", concepto: "IVA 30% - Bienes (Persona Natural)", tipo: "IVA", base_imponible: 336.00, porcentaje: 30, valor_retenido: 100.80 },
    ],
    estado: "autorizada",
    categoria: "compras",
    autorizacion_sri: "4503202607179123456700110010010000000461234567818",
    ambiente: "Producción",
    total_retenido: 128.80,
  },
  {
    id: "RET-C-2026-003",
    num: "001-001-000000047",
    clave_acceso: "0303202607179123456700110010010000000471234567819",
    fecha: "2026-03-03",
    emisor_razon: EMPRESA.razon,
    emisor_ruc: EMPRESA.ruc,
    emisor_dir: EMPRESA.dir,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    contribuyente: "Servicios TIC Ltda.",
    ruc: "1791234560001",
    direccion_sujeto: "Av. 6 de Diciembre N24-65, Quito",
    comprobante: "001-002-000001200",
    tipo_comprobante: "Factura",
    fecha_comprobante: "2026-03-03",
    periodo_fiscal: "03/2026",
    detalles: [
      { codigo: "332", concepto: "Pagos a través de liquidación de compra (nivel cultural o rusticidad)", tipo: "Fuente", base_imponible: 3500.00, porcentaje: 2, valor_retenido: 70.00 },
    ],
    estado: "pendiente",
    categoria: "compras",
    autorizacion_sri: "",
    ambiente: "Producción",
    total_retenido: 70.00,
  },
  {
    id: "RET-C-2026-004",
    num: "001-001-000000048",
    clave_acceso: "0403202607179123456700110010010000000481234567820",
    fecha: "2026-03-04",
    emisor_razon: EMPRESA.razon,
    emisor_ruc: EMPRESA.ruc,
    emisor_dir: EMPRESA.dir,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    contribuyente: "Importaciones Ecuador S.A.",
    ruc: "1790982340001",
    direccion_sujeto: "Av. Naciones Unidas E5-45, Quito",
    comprobante: "003-001-000000560",
    tipo_comprobante: "Factura",
    fecha_comprobante: "2026-03-04",
    periodo_fiscal: "03/2026",
    detalles: [
      { codigo: "320", concepto: "Arrendamiento mercantil (solo personas naturales)", tipo: "Fuente", base_imponible: 1200.00, porcentaje: 1, valor_retenido: 12.00 },
      { codigo: "723", concepto: "IVA 100% - Servicios (Persona Jurídica)", tipo: "IVA", base_imponible: 144.00, porcentaje: 100, valor_retenido: 144.00 },
    ],
    estado: "autorizada",
    categoria: "compras",
    autorizacion_sri: "4503202607179123456700110010010000000481234567820",
    ambiente: "Producción",
    total_retenido: 156.00,
  },

  {
    id: "RET-C-2026-005",
    num: "001-001-000000049",
    clave_acceso: "0403202607179123456700110010010000000491234567821",
    fecha: "2026-03-04",
    emisor_razon: EMPRESA.razon,
    emisor_ruc: EMPRESA.ruc,
    emisor_dir: EMPRESA.dir,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    contribuyente: "Andrés Mauricio Rivadeneira Pazos",
    ruc: "1712345678001",
    direccion_sujeto: "Calle Versalles N12-34 y Av. América, Quito",
    comprobante: "001-001-000000712",
    tipo_comprobante: "Factura",
    fecha_comprobante: "2026-03-03",
    periodo_fiscal: "03/2026",
    detalles: [
      { codigo: "303", concepto: "Honorarios — Servicios profesionales de desarrollo de software (persona natural con título)", tipo: "Fuente", base_imponible: 3200.00, porcentaje: 10, valor_retenido: 320.00 },
      { codigo: "725", concepto: "IVA 70% — Prestación de servicios (persona natural)", tipo: "IVA", base_imponible: 384.00, porcentaje: 70, valor_retenido: 268.80 },
    ],
    estado: "autorizada",
    categoria: "compras",
    autorizacion_sri: "4503202607179123456700110010010000000491234567821",
    ambiente: "Producción",
    total_retenido: 588.80,
  },

  /* ── VENTAS — el cliente nos retiene a nosotros ── */
  {
    id: "RET-V-2026-001",
    num: "001-001-000123456",
    clave_acceso: "0103202601799876543001100100100001234561234567891",
    fecha: "2026-03-01",
    emisor_razon: "Corporación Favorita C.A.",
    emisor_ruc: "1799876543001",
    emisor_dir: "Av. General Enríquez km 4.5, Sangolquí",
    emisor_telefono: "02-2999-000",
    emisor_email: "retenciones@favorita.com",
    contribuyente: EMPRESA.razon,
    ruc: EMPRESA.ruc,
    direccion_sujeto: EMPRESA.dir,
    comprobante: "001-001-000003456",
    tipo_comprobante: "Factura",
    fecha_comprobante: "2026-03-01",
    periodo_fiscal: "03/2026",
    detalles: [
      { codigo: "303", concepto: "Honorarios y demás pagos por servicios de personas jurídicas", tipo: "Fuente", base_imponible: 12500.00, porcentaje: 2, valor_retenido: 250.00 },
      { codigo: "721", concepto: "IVA 30% - Servicios (Persona Jurídica)", tipo: "IVA", base_imponible: 1500.00, porcentaje: 30, valor_retenido: 450.00 },
    ],
    estado: "autorizada",
    categoria: "ventas",
    autorizacion_sri: "4503202601799876543001100100100001234561234567891",
    ambiente: "Producción",
    total_retenido: 700.00,
  },
  {
    id: "RET-V-2026-002",
    num: "003-001-000089012",
    clave_acceso: "0203202601795678901001100100300000890121234567892",
    fecha: "2026-03-02",
    emisor_razon: "Banco del Pichincha C.A.",
    emisor_ruc: "1795678901001",
    emisor_dir: "Av. Amazonas N48-29 y Pérez Guerrero, Quito",
    emisor_telefono: "1800-227-566",
    emisor_email: "retenciones@pichincha.com",
    contribuyente: EMPRESA.razon,
    ruc: EMPRESA.ruc,
    direccion_sujeto: EMPRESA.dir,
    comprobante: "001-001-000004123",
    tipo_comprobante: "Factura",
    fecha_comprobante: "2026-03-02",
    periodo_fiscal: "03/2026",
    detalles: [
      { codigo: "312", concepto: "Servicios prestados por medios de comunicación y agencias de publicidad", tipo: "Fuente", base_imponible: 8400.00, porcentaje: 1, valor_retenido: 84.00 },
    ],
    estado: "autorizada",
    categoria: "ventas",
    autorizacion_sri: "4503202601795678901001100100300000890121234567892",
    ambiente: "Producción",
    total_retenido: 84.00,
  },
  {
    id: "RET-V-2026-003",
    num: "002-001-000045678",
    clave_acceso: "0303202601792234567001100200100004567812345678910",
    fecha: "2026-03-03",
    emisor_razon: "Municipio del Distrito Metropolitano de Quito",
    emisor_ruc: "1792234567001",
    emisor_dir: "Venezuela OE1-53 y Chile, Quito",
    emisor_telefono: "02-2957-000",
    emisor_email: "rentas@quito.gob.ec",
    contribuyente: EMPRESA.razon,
    ruc: EMPRESA.ruc,
    direccion_sujeto: EMPRESA.dir,
    comprobante: "001-001-000005890",
    tipo_comprobante: "Factura",
    fecha_comprobante: "2026-03-03",
    periodo_fiscal: "03/2026",
    detalles: [
      { codigo: "340", concepto: "Otras retenciones aplicables al 2%", tipo: "Fuente", base_imponible: 15000.00, porcentaje: 2, valor_retenido: 300.00 },
      { codigo: "723", concepto: "IVA 100% - Servicios (Sector Público)", tipo: "IVA", base_imponible: 1800.00, porcentaje: 100, valor_retenido: 1800.00 },
    ],
    estado: "autorizada",
    categoria: "ventas",
    autorizacion_sri: "4503202601792234567001100200100004567812345678910",
    ambiente: "Producción",
    total_retenido: 2100.00,
  },
];

const CONCEPTOS_FUENTE = [
  { cod: "303", desc: "Honorarios y demás pagos por servicios de personas naturales (título profesional)", pct: 10 },
  { cod: "304", desc: "Honorarios y demás pagos por servicios de personas naturales (sin título profesional)", pct: 8 },
  { cod: "307", desc: "Pagos a notarios y registradores de la propiedad y mercantil", pct: 8 },
  { cod: "308", desc: "Pagos a deportistas, entrenadores, árbitros, miembros del cuerpo técnico", pct: 8 },
  { cod: "309", desc: "Pagos a artistas nacionales o extranjeros residentes", pct: 8 },
  { cod: "310", desc: "Honorarios y demás pagos a personas naturales no residentes", pct: 25 },
  { cod: "312", desc: "Transporte privado de pasajeros o servicio público o privado de carga", pct: 1 },
  { cod: "319", desc: "Arrendamiento de bienes inmuebles", pct: 8 },
  { cod: "320", desc: "Arrendamiento mercantil (solo personas naturales)", pct: 1 },
  { cod: "322", desc: "Seguros y reaseguros (primas y cesiones)", pct: 1 },
  { cod: "323", desc: "Rendimientos financieros (intereses y descuentos)", pct: 2 },
  { cod: "325", desc: "Loterías, rifas, apuestas y similares", pct: 15 },
  { cod: "327", desc: "Transferencias bienes muebles de naturaleza corporal", pct: 1 },
  { cod: "332", desc: "Servicios entre sociedades y a personas naturales no obligadas a llevar contabilidad", pct: 2 },
  { cod: "340", desc: "Otras retenciones aplicables al 2%", pct: 2 },
  { cod: "343", desc: "Otras retenciones aplicables al 1%", pct: 1 },
];

const CONCEPTOS_IVA = [
  { cod: "721", desc: "IVA 30% — Adquisiciones y pagos (Bienes - Persona Natural)", pct: 30 },
  { cod: "723", desc: "IVA 100% — Adquisiciones y pagos (Servicios - Persona Jurídica)", pct: 100 },
  { cod: "724", desc: "IVA 100% — Adquisiciones y pagos (Sector Público)", pct: 100 },
  { cod: "725", desc: "IVA 70% — Prestación de Servicios (Persona Natural)", pct: 70 },
  { cod: "726", desc: "IVA 30% — Arrendamiento de Bienes Inmuebles", pct: 30 },
  { cod: "727", desc: "IVA 100% — Exportadores (servicios)", pct: 100 },
];

/* ══════════════════════════════════════════════════════════════════════
   GENERADOR XML SRI
══════════════════════════════════════════════════════════════════════ */
function generateXML(ret: Retencion): string {
  const detallesXml = ret.detalles.map(d => `
    <detalle>
      <codigo>${d.codigo}</codigo>
      <codigoRetencion>${d.codigo}</codigoRetencion>
      <baseImponible>${d.base_imponible.toFixed(2)}</baseImponible>
      <porcentajeRetener>${d.porcentaje}</porcentajeRetener>
      <valorRetenido>${d.valor_retenido.toFixed(2)}</valorRetenido>
    </detalle>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<comprobanteRetencion id="comprobante" version="1.0.0">
  <infoTributaria>
    <ambiente>${ret.ambiente === "Producción" ? "2" : "1"}</ambiente>
    <tipoEmision>1</tipoEmision>
    <razonSocial>${ret.emisor_razon}</razonSocial>
    <nombreComercial>${ret.emisor_razon}</nombreComercial>
    <ruc>${ret.emisor_ruc}</ruc>
    <claveAcceso>${ret.clave_acceso}</claveAcceso>
    <codDoc>07</codDoc>
    <estab>${ret.num.split("-")[0] || "001"}</estab>
    <ptoEmi>${ret.num.split("-")[1] || "001"}</ptoEmi>
    <secuencial>${ret.num.split("-")[2] || "000000001"}</secuencial>
    <dirMatriz>${ret.emisor_dir}</dirMatriz>
  </infoTributaria>
  <infoCompRetencion>
    <fechaEmision>${ret.fecha}</fechaEmision>
    <dirEstablecimiento>${ret.emisor_dir}</dirEstablecimiento>
    <obligadoContabilidad>SI</obligadoContabilidad>
    <tipoIdentificacionSujetoRetenido>04</tipoIdentificacionSujetoRetenido>
    <razonSocialSujetoRetenido>${ret.contribuyente}</razonSocialSujetoRetenido>
    <identificacionSujetoRetenido>${ret.ruc}</identificacionSujetoRetenido>
    <periodoFiscal>${ret.periodo_fiscal}</periodoFiscal>
  </infoCompRetencion>
  <impuestos>${detallesXml}
  </impuestos>
  <infoAdicional>
    <campoAdicional nombre="EMAIL">${ret.emisor_email}</campoAdicional>
    <campoAdicional nombre="TELEFONO">${ret.emisor_telefono}</campoAdicional>
    <campoAdicional nombre="COMPROBANTE_ORIGEN">${ret.comprobante}</campoAdicional>
  </infoAdicional>
</comprobanteRetencion>`;
}

function highlightXML(xml: string): string {
  return xml
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(&lt;\/?)([\w]+)/g, '<span style="color:#fb923c">$1$2</span>')
    .replace(/([\w]+)(=)(&quot;[^&]*&quot;)/g, '<span style="color:#7dd3fc">$1</span><span style="color:#94a3b8">$2</span><span style="color:#86efac">$3</span>')
    .replace(/(&lt;\?xml.*?&gt;)/g, '<span style="color:#94a3b8;font-style:italic">$1</span>');
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE VISOR DE DOCUMENTO SRI (RIDE) — compacto + XML
══════════════════════════════════════════════════════════════════════ */
function RideViewer({ ret, onClose, onPrint, onAuthorize, onAnular, isLight }: {
  ret: Retencion;
  onClose?: () => void;
  onPrint: () => void;
  onAuthorize?: (id: string) => void;
  onAnular?: (id: string) => void;
  isLight: boolean;
}) {
  const [zoom, setZoom] = useState(80);
  const [activeView, setActiveView] = useState<"ride" | "xml">("ride");
  const [xmlCopied, setXmlCopied] = useState(false);
  const [authStep, setAuthStep] = useState<"idle" | "validando" | "firmando" | "enviando" | "ok">("idle");
  const [anulStep, setAnulStep] = useState<"idle" | "validando" | "firmando" | "enviando" | "ok">("idle");

  // Resetear el flujo al cambiar de retención
  useEffect(() => { setAuthStep("idle"); setAnulStep("idle"); }, [ret.id]);

  const isPendiente = ret.estado === "pendiente";
  const isAnulable  = ret.estado === "autorizada" || ret.estado === "emitida";

  const handleAuthorizeFlow = () => {
    if (!onAuthorize) return;
    setAuthStep("validando");
    setTimeout(() => setAuthStep("firmando"), 1000);
    setTimeout(() => setAuthStep("enviando"), 2100);
    setTimeout(() => {
      setAuthStep("ok");
      onAuthorize(ret.id);
    }, 3400);
  };

  const handleAnulFlow = () => {
    if (!onAnular) return;
    setAnulStep("validando");
    setTimeout(() => setAnulStep("firmando"), 1000);
    setTimeout(() => setAnulStep("enviando"), 2100);
    setTimeout(() => {
      setAnulStep("ok");
      onAnular(ret.id);
    }, 3400);
  };

  const totalFuente = ret.detalles.filter(d => d.tipo === "Fuente").reduce((s, d) => s + d.valor_retenido, 0);
  const totalIVA    = ret.detalles.filter(d => d.tipo === "IVA").reduce((s, d) => s + d.valor_retenido, 0);
  const fmt = (v: number) => `$${v.toFixed(2)}`;
  const isAutorizada = ret.estado === "autorizada";
  const xmlContent = generateXML(ret);

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
    a.download = `${(ret.num || ret.id).replace(/\//g, "-")}.xml`;
    document.body.appendChild(a); a.click();
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
              <button onClick={() => setZoom(80)}
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
        </div>
      </div>

      {/* ══ Panel de Anulación SRI (solo autorizada/emitida) ══ */}
      {isAnulable && (
        <div className={`flex-shrink-0 border-b ${isLight ? "border-red-200 bg-red-50" : "border-red-500/20 bg-red-500/5"}`}>

          {/* Stepper */}
          <div className="flex items-center gap-0 px-4 pt-3 pb-2">
            {[
              { key: "idle",       label: "Solicitar",          icon: <Trash2 className="w-3.5 h-3.5" /> },
              { key: "validando",  label: "Validando XML",      icon: <FileText className="w-3.5 h-3.5" /> },
              { key: "firmando",   label: "Firma Electrónica",  icon: <Shield className="w-3.5 h-3.5" /> },
              { key: "enviando",   label: "Enviando al SRI",    icon: <Wifi className="w-3.5 h-3.5" /> },
              { key: "ok",         label: "Anulada",            icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            ].map((step, i, arr) => {
              const stepOrder = ["idle","validando","firmando","enviando","ok"];
              const currentIdx = stepOrder.indexOf(anulStep);
              const stepIdx = stepOrder.indexOf(step.key);
              const isDone   = currentIdx > stepIdx;
              const isActive = currentIdx === stepIdx;
              return (
                <div key={step.key} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isDone  ? "bg-green-500 text-white" :
                      isActive && anulStep !== "idle" ? "bg-red-500 text-white animate-pulse" :
                      step.key === "idle" ? "bg-red-400 text-white" :
                      isLight ? "bg-gray-200 text-gray-400" : "bg-white/10 text-gray-500"
                    }`}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       isActive && anulStep !== "idle" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                       step.icon}
                    </div>
                    <span className={`text-[9px] mt-0.5 text-center leading-tight max-w-[52px] ${
                      isDone ? (isLight ? "text-green-600" : "text-green-400") :
                      isActive && anulStep !== "idle" ? "text-red-500 font-bold" :
                      step.key === "idle" ? (isLight ? "text-red-600 font-bold" : "text-red-400 font-bold") :
                      isLight ? "text-gray-400" : "text-gray-600"
                    }`}>{step.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${isDone ? "bg-green-500" : isLight ? "bg-gray-200" : "bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Acción */}
          <div className="px-4 pb-3 flex items-center gap-3">
            {anulStep === "idle" && (
              <>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${isLight ? "text-red-700" : "text-red-400"}`}>
                    ⚠ Anular esta retención ante el SRI
                  </p>
                  <p className={`text-[10px] mt-0.5 ${isLight ? "text-red-500" : "text-red-500/80"}`}>
                    Se enviará la solicitud de anulación al SRI. Esta acción no se puede deshacer.
                  </p>
                </div>
                <button
                  onClick={handleAnulFlow}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-red-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Anular en SRI
                </button>
              </>
            )}
            {(anulStep === "validando" || anulStep === "firmando" || anulStep === "enviando") && (
              <div className={`flex-1 flex items-center gap-3 py-1 px-3 rounded-lg ${isLight ? "bg-red-100" : "bg-red-500/10"}`}>
                <Loader2 className="w-4 h-4 text-red-500 animate-spin flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-red-500">
                    {anulStep === "validando" && "Validando estructura XML…"}
                    {anulStep === "firmando"  && "Aplicando firma electrónica…"}
                    {anulStep === "enviando"  && "Enviando anulación al SRI…"}
                  </p>
                  <p className={`text-[10px] ${isLight ? "text-gray-500" : "text-gray-400"}`}>Por favor espere, no cierre esta ventana.</p>
                </div>
              </div>
            )}
            {anulStep === "ok" && (
              <div className={`flex-1 flex items-center gap-3 py-1 px-3 rounded-lg ${isLight ? "bg-green-50 border border-green-200" : "bg-green-500/10 border border-green-500/20"}`}>
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold ${isLight ? "text-green-700" : "text-green-400"}`}>¡Anulación aceptada por el SRI!</p>
                  <p className={`text-[10px] ${isLight ? "text-green-600" : "text-green-500"}`}>La retención ha sido anulada correctamente.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ Panel de Autorización SRI (solo pendiente) ══ */}
      {isPendiente && (
        <div className={`flex-shrink-0 border-b ${isLight ? "border-amber-200 bg-amber-50" : "border-amber-500/20 bg-amber-500/5"}`}>

          {/* Stepper de flujo */}
          <div className={`flex items-center gap-0 px-4 pt-3 pb-2`}>
            {[
              { key: "idle",       label: "Creada",           icon: <Receipt className="w-3.5 h-3.5" /> },
              { key: "validando",  label: "Validando XML",    icon: <FileText className="w-3.5 h-3.5" /> },
              { key: "firmando",   label: "Firma Electrónica",icon: <Shield className="w-3.5 h-3.5" /> },
              { key: "enviando",   label: "Enviando al SRI",  icon: <Wifi className="w-3.5 h-3.5" /> },
              { key: "ok",         label: "Autorizada",       icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            ].map((step, i, arr) => {
              const stepOrder = ["idle","validando","firmando","enviando","ok"];
              const currentIdx = stepOrder.indexOf(authStep);
              const stepIdx = stepOrder.indexOf(step.key);
              const isDone    = currentIdx > stepIdx;
              const isActive  = currentIdx === stepIdx;
              return (
                <div key={step.key} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isDone  ? "bg-green-500 text-white" :
                      isActive && authStep !== "idle" ? "bg-primary text-white animate-pulse" :
                      step.key === "idle" ? "bg-amber-400 text-white" :
                      isLight ? "bg-gray-200 text-gray-400" : "bg-white/10 text-gray-500"
                    }`}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       isActive && authStep !== "idle" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                       step.icon}
                    </div>
                    <span className={`text-[9px] mt-0.5 text-center leading-tight max-w-[52px] ${
                      isDone ? (isLight ? "text-green-600" : "text-green-400") :
                      isActive && authStep !== "idle" ? "text-primary font-bold" :
                      step.key === "idle" ? "text-amber-600 font-bold" :
                      isLight ? "text-gray-400" : "text-gray-600"
                    }`}>{step.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 transition-all duration-500 ${isDone ? "bg-green-500" : isLight ? "bg-gray-200" : "bg-white/10"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Acción principal */}
          <div className={`px-4 pb-3 flex items-center gap-3`}>
            {authStep === "idle" && (
              <>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${isLight ? "text-amber-800" : "text-amber-400"}`}>
                    ⚠ Retención pendiente de autorización SRI
                  </p>
                  <p className={`text-[10px] mt-0.5 ${isLight ? "text-amber-600" : "text-amber-500/80"}`}>
                    Revisa el documento, valida la firma electrónica y envía al SRI para obtener la autorización.
                  </p>
                </div>
                <button
                  onClick={handleAuthorizeFlow}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold transition-colors shadow-lg shadow-primary/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar al SRI
                </button>
              </>
            )}
            {(authStep === "validando" || authStep === "firmando" || authStep === "enviando") && (
              <div className={`flex-1 flex items-center gap-3 py-1 px-3 rounded-lg ${isLight ? "bg-primary/10" : "bg-primary/10"}`}>
                <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-primary">
                    {authStep === "validando" && "Validando estructura XML…"}
                    {authStep === "firmando"  && "Aplicando firma electrónica…"}
                    {authStep === "enviando"  && "Enviando comprobante al SRI…"}
                  </p>
                  <p className={`text-[10px] ${isLight ? "text-gray-500" : "text-gray-400"}`}>Por favor espere, no cierre esta ventana.</p>
                </div>
              </div>
            )}
            {authStep === "ok" && (
              <div className={`flex-1 flex items-center gap-3 py-1 px-3 rounded-lg ${isLight ? "bg-green-50 border border-green-200" : "bg-green-500/10 border border-green-500/20"}`}>
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold ${isLight ? "text-green-700" : "text-green-400"}`}>¡Retención autorizada por el SRI!</p>
                  <p className={`text-[10px] font-mono truncate ${isLight ? "text-green-600" : "text-green-500"}`}>Clave: {ret.autorizacion_sri || "Generando…"}</p>
                </div>
                <button onClick={onPrint} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold transition-colors">
                  <Printer className="w-3 h-3" /> Imprimir RIDE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Vista RIDE (compacta) ── */}
      {activeView === "ride" && (
        <div className={`flex-1 overflow-auto p-3 ${isLight ? "bg-gray-300" : "bg-[#06090f]"}`}>
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.15s" }}>
            {/* Documento — ancho 520px */}
            <div className="bg-white mx-auto shadow-2xl text-gray-800"
              style={{ width: 520, fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 9.5 }}>

              {!isAutorizada && (
                <div style={{ background: "#fbbf24", color: "#78350f", textAlign: "center", padding: "3px 8px", fontWeight: 700, fontSize: 9, letterSpacing: 1 }}>
                  ⚠ DOCUMENTO NO AUTORIZADO — {ret.estado.toUpperCase()}
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
                      <p style={{ fontWeight: 900, fontSize: 10.5, color: "#0D1B2A", marginBottom: 1 }}>{ret.emisor_razon}</p>
                      <p style={{ color: "#4b5563", fontSize: 8.5 }}>{ret.emisor_dir}</p>
                      <p style={{ color: "#4b5563", fontSize: 8.5 }}>Tel: {ret.emisor_telefono} | {ret.emisor_email}</p>
                      <p style={{ color: "#4b5563", fontSize: 8.5, marginTop: 1 }}>Ambiente: <b>{ret.ambiente}</b> | Emisión: Normal</p>
                    </div>
                  </div>
                  <div style={{ padding: "7px 8px", textAlign: "center" }}>
                    <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                      <p style={{ color: "#6b7280", fontSize: 7.5, fontWeight: 700, textTransform: "uppercase" }}>R.U.C.</p>
                      <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{ret.emisor_ruc}</p>
                    </div>
                    <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                      <p style={{ color: "#E8692E", fontSize: 8, fontWeight: 700, textTransform: "uppercase" }}>Comprobante de Retención</p>
                      <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{ret.num || "---"}</p>
                    </div>
                    <div style={{ border: `1px solid ${isAutorizada ? "#16a34a" : "#ca8a04"}`, background: isAutorizada ? "#f0fdf4" : "#fefce8", padding: "2px 4px" }}>
                      <p style={{ fontWeight: 700, fontSize: 8, color: isAutorizada ? "#15803d" : "#854d0e" }}>
                        {isAutorizada ? "✓ AUTORIZADO" : "PENDIENTE"}
                      </p>
                      {isAutorizada && ret.autorizacion_sri && (
                        <p style={{ fontSize: 7, color: "#4b5563", wordBreak: "break-all" }}>{ret.autorizacion_sri.slice(0, 28)}…</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clave acceso */}
              <div style={{ border: "1px solid #9ca3af", margin: "4px 7px", padding: "4px 7px" }}>
                <p style={{ fontWeight: 700, color: "#6b7280", fontSize: 7.5, textTransform: "uppercase", marginBottom: 2 }}>Clave de Acceso</p>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}>
                    {ret.clave_acceso.slice(0, 36).split("").map((c, i) => (
                      <div key={i} style={{ background: "#111", width: 1.8, height: 12 + (parseInt(c) % 3) * 3 }} />
                    ))}
                  </div>
                  <p style={{ fontFamily: "monospace", fontSize: 7.5, color: "#374151", wordBreak: "break-all" }}>{ret.clave_acceso}</p>
                </div>
              </div>

              {/* Sujeto retenido */}
              <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  Datos del Sujeto Retenido
                </div>
                <div style={{ padding: "5px 7px", display: "grid", gridTemplateColumns: "1fr auto", gap: "3px 10px" }}>
                  <div><span style={{ color: "#6b7280", fontWeight: 700 }}>Razón Social: </span><span style={{ fontWeight: 600 }}>{ret.contribuyente}</span></div>
                  <div><span style={{ color: "#6b7280", fontWeight: 700 }}>RUC/CI: </span><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{ret.ruc}</span></div>
                  <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#6b7280", fontWeight: 700 }}>Dirección: </span>{ret.direccion_sujeto}</div>
                </div>
              </div>

              {/* Comprobante origen */}
              <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  Comprobante que Origina la Retención
                </div>
                <div style={{ padding: "5px 7px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "3px 8px" }}>
                  {[
                    { l: "Tipo", v: ret.tipo_comprobante },
                    { l: "N° Comprobante", v: ret.comprobante },
                    { l: "Fecha Comprobante", v: ret.fecha_comprobante },
                    { l: "Fecha Retención", v: ret.fecha },
                    { l: "Período Fiscal", v: ret.periodo_fiscal },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <p style={{ color: "#6b7280", fontWeight: 700, fontSize: 8 }}>{l}</p>
                      <p style={{ fontWeight: 600, fontFamily: l.includes("N°") ? "monospace" : undefined, fontSize: 9 }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detalle retenciones */}
              <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  Detalle de Valores Retenidos
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f3f4f6", borderBottom: "1px solid #d1d5db" }}>
                      {["Cód.", "Concepto", "Tipo", "Base Imp.", "%", "Valor Ret."].map(h => (
                        <th key={h} style={{ padding: "3px 5px", textAlign: ["Base Imp.", "%", "Valor Ret."].includes(h) ? "right" : "left", fontSize: 8, fontWeight: 700, color: "#4b5563", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ret.detalles.map((d, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={{ padding: "3px 5px", fontFamily: "monospace", fontWeight: 700, color: "#E8692E", fontSize: 8.5 }}>{d.codigo}</td>
                        <td style={{ padding: "3px 5px", fontSize: 8.5, maxWidth: 160 }}>{d.concepto}</td>
                        <td style={{ padding: "3px 5px", textAlign: "center" }}>
                          <span style={{ background: d.tipo === "Fuente" ? "#dbeafe" : "#ede9fe", color: d.tipo === "Fuente" ? "#1e40af" : "#5b21b6", borderRadius: 3, padding: "1px 4px", fontSize: 7.5, fontWeight: 700 }}>{d.tipo}</span>
                        </td>
                        <td style={{ padding: "3px 5px", textAlign: "right", fontFamily: "monospace", fontSize: 8.5 }}>{fmt(d.base_imponible)}</td>
                        <td style={{ padding: "3px 5px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{d.porcentaje}%</td>
                        <td style={{ padding: "3px 5px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(d.valor_retenido)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div style={{ border: "1px solid #9ca3af", margin: "4px 7px" }}>
                {totalFuente > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ color: "#4b5563", fontSize: 8.5 }}>Subtotal Retención en la Fuente:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(totalFuente)}</span>
                  </div>
                )}
                {totalIVA > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ color: "#4b5563", fontSize: 8.5 }}>Subtotal Retención IVA:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(totalIVA)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 7px", background: "#E8692E" }}>
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: 10.5 }}>TOTAL RETENIDO:</span>
                  <span style={{ color: "#fff", fontWeight: 900, fontFamily: "monospace", fontSize: 11 }}>{fmt(ret.total_retenido)}</span>
                </div>
              </div>

              {/* Footer SRI */}
              <div style={{ background: "#0D1B2A", margin: "0 7px 7px", padding: "5px 7px", display: "flex", gap: 7, alignItems: "center", borderRadius: "0 0 4px 4px" }}>
                <Shield style={{ width: 18, height: 18, color: "#E8692E", flexShrink: 0 }} />
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 8, marginBottom: 1 }}>SERVICIO DE RENTAS INTERNAS — REPÚBLICA DEL ECUADOR</p>
                  <p style={{ color: "#9ca3af", fontSize: 7.5 }}>
                    Verifique en: <span style={{ color: "#E8692E" }}>www.sri.gob.ec</span>
                    {isAutorizada && ` | Fecha Auth: ${ret.fecha} | Firma Electrónica: Válida`}
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
          {/* Info bar */}
          <div className="flex items-center gap-3 px-4 py-2 border-b text-xs flex-shrink-0"
            style={{ background: "#1e293b", borderColor: "#334155", color: "#94a3b8" }}>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "#4ade80" }} />
              <span className="font-mono" style={{ color: "#e2e8f0" }}>{(ret.num || ret.id).replace(/\//g, "-")}.xml</span>
            </div>
            <span style={{ color: "#475569" }}>|</span>
            <span>SRI Ecuador · Comprobante v1.0.0</span>
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
              {xmlContent.split("\n").map((_, i) => (
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
interface AccountingRetentionsContentProps {
  filterByCategory?: "compras" | "ventas";
}

export function AccountingRetentionsContent({ filterByCategory }: AccountingRetentionsContentProps = {}) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [retenciones, setRetenciones] = useState<Retencion[]>(RETENCIONES_INIT);
  const [search, setSearch]             = useState("");
  const [filterTipo, setFilterTipo]     = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");
  const [categoria, setCategoria]       = useState<"todas" | "compras" | "ventas">(filterByCategory || "todas");
  const [fechaDesde, setFechaDesde]     = useState("");
  const [fechaHasta, setFechaHasta]     = useState("");

  const [selected, setSelected]   = useState<Retencion | null>(RETENCIONES_INIT[0]);
  const [showModal, setShowModal]   = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRet, setEditingRet] = useState<Retencion | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsRet, setDetailsRet] = useState<Retencion | null>(null);

  const [form, setForm] = useState({
    categoria: (filterByCategory || "compras") as "compras" | "ventas",
    tipo: "Fuente" as "Fuente" | "IVA",
    contribuyente: "", ruc: "", direccion_sujeto: "",
    comprobante: "", tipo_comprobante: "Factura",
    fecha: "2026-03-04", fecha_comprobante: "2026-03-04",
    periodo_fiscal: "03/2026",
    emisor_razon: "", emisor_ruc: "",
    codigo: "", concepto: "",
    porcentaje: 1, base_imponible: "",
  });

  // Buscador de proveedor por RUC/CI
  const [supplierQuery, setSupplierQuery] = useState("");
  const [supplierFound, setSupplierFound] = useState<typeof SUPPLIERS_DATA[0] | null>(null);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  // Documento seleccionado del proveedor
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);

  const supplierResults = supplierQuery.length >= 2
    ? SUPPLIERS_DATA.filter(s =>
        s.ruc.includes(supplierQuery) ||
        s.name.toLowerCase().includes(supplierQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  // Documentos del proveedor seleccionado (sin retención aún)
  const supplierInvoices = supplierFound
    ? PURCHASE_INVOICES_DATA.filter(inv => inv.supplierId === supplierFound.id)
    : [];

  const handleSelectSupplier = (s: typeof SUPPLIERS_DATA[0]) => {
    setSupplierFound(s);
    setSupplierQuery(s.ruc);
    setShowSupplierDropdown(false);
    setSelectedInvoice(null);
    setForm(prev => ({
      ...prev,
      contribuyente: s.name,
      ruc: s.ruc,
      direccion_sujeto: `${s.address}, ${s.city}`,
      comprobante: "",
      tipo_comprobante: "Factura",
      fecha_comprobante: "",
      base_imponible: "",
    }));
  };

  const handleSelectInvoice = (inv: PurchaseInvoice) => {
    setSelectedInvoice(inv);
    setForm(prev => ({
      ...prev,
      comprobante: inv.numero,
      tipo_comprobante: inv.tipo,
      fecha_comprobante: inv.fecha,
      base_imponible: inv.subtotal.toFixed(2),
    }));
  };

  const handleClearSupplier = () => {
    setSupplierFound(null);
    setSupplierQuery("");
    setSelectedInvoice(null);
    setForm(prev => ({ ...prev, contribuyente: "", ruc: "", direccion_sujeto: "", comprobante: "", fecha_comprobante: "", base_imponible: "" }));
  };

  /* ── filtrado ─────────────────────────────────────────────────────── */
  const filtered = retenciones.filter(r => {
    const q      = search.toLowerCase();
    const matchQ = !q || r.id.toLowerCase().includes(q) || r.contribuyente.toLowerCase().includes(q) ||
                   r.emisor_razon.toLowerCase().includes(q) ||
                   r.ruc.includes(q) || r.comprobante.includes(q) || r.num.includes(q);
    const matchT = filterTipo   === "all" || r.detalles.some(d => d.tipo === filterTipo);
    const matchE = filterEstado === "all" || r.estado === filterEstado;
    const matchC = categoria    === "todas" || r.categoria === categoria;
    const matchD = !fechaDesde  || r.fecha >= fechaDesde;
    const matchH = !fechaHasta  || r.fecha <= fechaHasta;
    return matchQ && matchT && matchE && matchC && matchD && matchH;
  });

  const kpi = {
    total:      retenciones.length,
    compras:    retenciones.filter(r => r.categoria === "compras").length,
    ventas:     retenciones.filter(r => r.categoria === "ventas").length,
    totalRet:   retenciones.filter(r => r.estado !== "anulada").reduce((s, r) => s + r.total_retenido, 0),
    porCobrar:  retenciones.filter(r => r.categoria === "ventas"  && r.estado !== "anulada").reduce((s, r) => s + r.total_retenido, 0),
    porPagar:   retenciones.filter(r => r.categoria === "compras" && r.estado !== "anulada").reduce((s, r) => s + r.total_retenido, 0),
  };

  /* ── acciones ─────────────────────────────────────────────────────── */
  const handleEmitir = (id: string) => {
    const clave = genClave();
    const num   = `001-001-000000${String(Math.floor(Math.random()*99999)).padStart(5,"0")}`;
    setRetenciones(prev => prev.map(r =>
      r.id === id ? { ...r, estado: "autorizada", num: r.num || num, autorizacion_sri: clave } : r
    ));
    // actualizar el panel derecho en tiempo real
    setSelected(prev => prev && prev.id === id ? { ...prev, estado: "autorizada", num: prev.num || num, autorizacion_sri: clave } : prev);
    toast.success("✓ Retención autorizada por el SRI");
  };

  const handleAnular = (id: string) => {
    setRetenciones(prev => prev.map(r => r.id === id ? { ...r, estado: "anulada" } : r));
    setSelected(prev => prev && prev.id === id ? { ...prev, estado: "anulada" } : prev);
    toast.success("✓ Anulación aceptada por el SRI. Retención anulada.");
  };

  // Función para cerrar modal y resetear formulario
  const closeModalAndReset = () => {
    setShowModal(false);
    setSupplierQuery("");
    setSupplierFound(null);
    setSelectedInvoice(null);
    setForm({
      categoria: (filterByCategory || "compras") as "compras" | "ventas",
      tipo: "Fuente" as "Fuente" | "IVA",
      contribuyente: "", ruc: "", direccion_sujeto: "",
      comprobante: "", tipo_comprobante: "Factura",
      fecha: "2026-03-04", fecha_comprobante: "2026-03-04",
      periodo_fiscal: "03/2026",
      emisor_razon: "", emisor_ruc: "",
      codigo: "", concepto: "",
      porcentaje: 1, base_imponible: "",
    });
  };

  const handleSave = () => {
    if (!form.contribuyente.trim() || !form.comprobante.trim() || !form.base_imponible || !form.codigo) {
      toast.error("Complete todos los campos obligatorios"); return;
    }
    const base  = parseFloat(form.base_imponible);
    const valor = base * form.porcentaje / 100;
    const detalle: DetalleRetencion = {
      codigo: form.codigo,
      concepto: form.concepto,
      tipo: form.tipo,
      base_imponible: base,
      porcentaje: form.porcentaje,
      valor_retenido: valor,
    };
    const isCompras = form.categoria === "compras";
    const newRet: Retencion = {
      id: `RET-${form.categoria === "compras" ? "C" : "V"}-2026-${String(retenciones.length + 1).padStart(3, "0")}`,
      num: "",
      clave_acceso: genClave(),
      fecha: form.fecha,
      emisor_razon:    isCompras ? EMPRESA.razon : form.emisor_razon,
      emisor_ruc:      isCompras ? EMPRESA.ruc   : form.emisor_ruc,
      emisor_dir:      isCompras ? EMPRESA.dir   : "",
      emisor_telefono: isCompras ? EMPRESA.tel   : "",
      emisor_email:    isCompras ? EMPRESA.email : "",
      contribuyente:   isCompras ? form.contribuyente : EMPRESA.razon,
      ruc:             isCompras ? form.ruc            : EMPRESA.ruc,
      direccion_sujeto: isCompras ? form.direccion_sujeto : EMPRESA.dir,
      comprobante:     form.comprobante,
      tipo_comprobante: form.tipo_comprobante,
      fecha_comprobante: form.fecha_comprobante,
      periodo_fiscal:  form.periodo_fiscal,
      detalles:        [detalle],
      estado:          "pendiente",
      categoria:       form.categoria,
      autorizacion_sri: "",
      ambiente:        "Producción",
      total_retenido:  valor,
    };
    setRetenciones(prev => [newRet, ...prev]);
    setSelected(newRet);
    toast.success("Retención creada. Pendiente de autorización.");
    closeModalAndReset();
  };

  /* ── estilos ──────────────────────────────────────────────────────── */
  const ic  = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const lbl = `block mb-1.5 text-sm font-medium ${isLight ? "text-gray-700" : "text-white"}`;
  const opt = "bg-[#0D1B2A]";
  const modalBg = `${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`;

  const estadoBadge = (estado: string) => {
    const m: Record<string, string> = {
      autorizada: isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300",
      emitida:    isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300",
      pendiente:  isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-300",
      anulada:    isLight ? "bg-red-100 text-red-600" : "bg-red-500/20 text-red-400",
    };
    return m[estado] ?? "bg-gray-500/20 text-gray-400";
  };

  const catLabel = (c: string) => c === "compras"
    ? { txt: "Compras", cls: isLight ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-blue-500/10 text-blue-400", Icon: ShoppingCart }
    : { txt: "Ventas",  cls: isLight ? "bg-green-50 text-green-600 border-green-200" : "bg-green-500/10 text-green-400", Icon: TrendingUp };

  const conceptos = form.tipo === "Fuente" ? CONCEPTOS_FUENTE : CONCEPTOS_IVA;

  /* ════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col gap-4 h-full">

      {/* ── KPIs ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
        {[
          { label: "Total Retenciones", value: kpi.total,                       icon: <Receipt      className="w-5 h-5 text-primary" />,      bg: "bg-primary/20"    },
          { label: "De Compras",        value: kpi.compras,                     icon: <ShoppingCart className="w-5 h-5 text-blue-400" />,     bg: "bg-blue-500/20"   },
          { label: "De Ventas",         value: kpi.ventas,                      icon: <TrendingUp   className="w-5 h-5 text-green-400" />,    bg: "bg-green-500/20"  },
          { label: "Retenido Total",    value: `$${kpi.totalRet.toFixed(2)}`,   icon: <FileText     className="w-5 h-5 text-purple-400" />,   bg: "bg-purple-500/20" },
        ].map(m => (
          <AccountingKpiCard key={m.label} label={m.label} value={m.value} icon={m.icon} iconBg={m.bg} />
        ))}
      </div>

      {/* ── Layout principal: lista + visor ──────────────────────────── */}
      <div className={`flex gap-0 rounded-xl overflow-hidden border flex-1 min-h-0 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-white/5"}`}>

        {/* ══ Panel izquierdo: TABLA 60% ══ */}
        <div className={`flex flex-col border-r flex-shrink-0 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0c1520]"}`} style={{ width: "60%" }}>

          {/* ── Barra de herramientas ── */}
          <div className={`px-4 py-3 border-b flex-shrink-0 flex flex-wrap items-center gap-2 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d1724]"}`}>
            {!filterByCategory && (
              <div className={`flex gap-1 p-0.5 rounded-lg ${isLight ? "bg-gray-100" : "bg-white/5"}`}>
                {(["todas","compras","ventas"] as const).map(c => (
                  <button key={c} onClick={() => setCategoria(c)}
                    className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${categoria === c ? "bg-primary text-white" : isLight ? "text-gray-600 hover:bg-gray-200" : "text-gray-400 hover:bg-white/5"}`}>
                    {c === "todas" ? "Todas" : c === "compras" ? "Compras" : "Ventas"}
                  </button>
                ))}
              </div>
            )}
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 flex-1 min-w-[160px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar número, contribuyente, comprobante..."
                className={`flex-1 bg-transparent text-xs focus:outline-none placeholder:text-gray-500 ${isLight ? "text-gray-900" : "text-white"}`} />
            </div>
            <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
              className={`text-xs px-2 py-1.5 border rounded-lg focus:outline-none ${isLight ? "bg-white border-gray-300 text-gray-700" : "bg-[#0d1724] border-white/10 text-gray-400"}`}>
              <option value="all" className={opt}>Tipo: Todos</option>
              <option value="Fuente" className={opt}>Ret. Fuente</option>
              <option value="IVA" className={opt}>Ret. IVA</option>
            </select>
            <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
              className={`text-xs px-2 py-1.5 border rounded-lg focus:outline-none ${isLight ? "bg-white border-gray-300 text-gray-700" : "bg-[#0d1724] border-white/10 text-gray-400"}`}>
              <option value="all" className={opt}>Estado: Todos</option>
              <option value="autorizada" className={opt}>Autorizada</option>
              <option value="pendiente" className={opt}>Pendiente</option>
              <option value="anulada" className={opt}>Anulada</option>
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
            <button onClick={() => downloadRetentionsCSV(filtered.map(r => ({ ...r, tipo: r.detalles[0]?.tipo ?? "", base: r.detalles[0]?.base_imponible ?? 0, porcentaje: r.detalles[0]?.porcentaje ?? 0, valor: r.total_retenido })))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button onClick={() => printAllRetentions(filtered.map(r => ({ ...r, tipo: r.detalles[0]?.tipo ?? "", base: r.detalles[0]?.base_imponible ?? 0, porcentaje: r.detalles[0]?.porcentaje ?? 0, valor: r.total_retenido })))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-primary/30">
              <Plus className="w-3.5 h-3.5" /> Nueva Retención
            </button>
          </div>

          {/* ── TABLA ── */}
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[620px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className={`text-xs font-semibold uppercase tracking-wider border-b ${isLight ? "bg-gray-100 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"}`}>
                  <th className="px-3 py-2.5 text-center">Estado</th>
                  <th className="px-3 py-2.5 text-left whitespace-nowrap">N° Retención</th>
                  <th className="px-3 py-2.5 text-left">Fecha</th>
                  <th className="px-3 py-2.5 text-left">Contribuyente</th>
                  <th className="px-3 py-2.5 text-right whitespace-nowrap">Total</th>
                  <th className="px-3 py-2.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Receipt className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                      <p className={`text-sm ${isLight ? "text-gray-400" : "text-gray-500"}`}>Sin retenciones para mostrar</p>
                    </td>
                  </tr>
                ) : filtered.map((ret) => {
                  const { txt: catTxt, cls: catCls, Icon: CatIcon } = catLabel(ret.categoria);
                  const isSelected = selected?.id === ret.id;
                  const sujeto = ret.categoria === "compras" ? ret.contribuyente : ret.emisor_razon;
                  const rucSujeto = ret.categoria === "compras" ? ret.ruc : ret.emisor_ruc;
                  return (
                    <tr key={ret.id} onClick={() => setSelected(ret)}
                      className={`border-b cursor-pointer transition-all ${isSelected
                        ? isLight ? "bg-primary/5 border-l-[3px] border-l-primary" : "bg-primary/10 border-l-[3px] border-l-primary"
                        : isLight ? "hover:bg-gray-50 border-gray-100 border-l-[3px] border-l-transparent" : "hover:bg-white/[0.03] border-white/5 border-l-[3px] border-l-transparent"}`}>
                      {/* Estado */}
                      <td className="px-3 py-2.5 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${estadoBadge(ret.estado)}`}>
                          {ret.estado.charAt(0).toUpperCase() + ret.estado.slice(1)}
                        </span>
                      </td>
                      {/* N° Retención */}
                      <td className="px-3 py-2.5">
                        <span className={`font-mono font-bold text-xs tracking-wide whitespace-nowrap ${isLight ? "text-gray-900" : "text-white"}`}>
                          {ret.num || ret.id}
                        </span>
                      </td>
                      {/* Fecha */}
                      <td className="px-3 py-2.5">
                        <span className={`text-xs font-mono whitespace-nowrap ${isLight ? "text-gray-600" : "text-gray-400"}`}>{ret.fecha}</span>
                      </td>
                      {/* Contribuyente */}
                      <td className="px-3 py-2.5" style={{ maxWidth: 200 }}>
                        <p className={`text-xs font-semibold truncate ${isLight ? "text-gray-800" : "text-gray-200"}`}>{sujeto}</p>
                        <p className={`text-[10px] font-mono truncate ${isLight ? "text-gray-400" : "text-gray-500"}`}>{rucSujeto}</p>
                      </td>
                      {/* Total */}
                      <td className="px-3 py-2.5 text-right">
                        <span className="font-bold font-mono text-sm text-primary whitespace-nowrap">${ret.total_retenido.toFixed(2)}</span>
                      </td>
                      {/* Acciones */}
                      <td className="px-3 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => { setDetailsRet(ret); setShowDetailsModal(true); }} title="Ver detalles"
                            className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100 hover:text-gray-800" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => printRetencion({ ...ret, tipo: ret.detalles[0]?.tipo ?? "", base: ret.total_retenido, porcentaje: ret.detalles[0]?.porcentaje ?? 0, valor: ret.total_retenido })} title="Imprimir"
                            className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100 hover:text-gray-800" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pie de tabla */}
            {filtered.length > 0 && (
              <div className={`px-4 py-2 border-t flex items-center justify-between sticky bottom-0 ${isLight ? "bg-white border-gray-100 text-gray-400" : "bg-[#0d1724] border-white/5 text-gray-500"}`}>
                <span className="text-xs">{filtered.length} retención{filtered.length !== 1 ? "es" : ""}</span>
                <span className="text-xs font-mono font-semibold text-primary">
                  Total retenido: ${filtered.reduce((s, r) => s + r.total_retenido, 0).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ══ Panel derecho: visor RIDE/XML 40% ══ */}
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {selected ? (
            <RideViewer
              ret={selected}
              isLight={isLight}
              onPrint={() => printRetencion({ ...selected, tipo: selected.detalles[0]?.tipo ?? "", base: selected.total_retenido, porcentaje: selected.detalles[0]?.porcentaje ?? 0, valor: selected.total_retenido })}
              onAuthorize={handleEmitir}
              onAnular={handleAnular}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Receipt className={`w-16 h-16 mx-auto mb-4 ${isLight ? "text-gray-200" : "text-gray-700"}`} />
                <p className={`font-medium ${isLight ? "text-gray-400" : "text-gray-500"}`}>Selecciona una retención para visualizar el documento</p>
                <p className={`text-sm mt-1 ${isLight ? "text-gray-300" : "text-gray-600"}`}>Haz clic en cualquier item de la lista</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ Modal Nueva Retención ══════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border max-h-[92vh] flex flex-col ${modalBg}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center"><Plus className="w-5 h-5 text-primary" /></div>
                <h3 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>Nueva Retención</h3>
              </div>
              <button onClick={closeModalAndReset} className={`p-2 rounded-lg ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-4">

              {/* Categoría */}
              {!filterByCategory ? (
                <div>
                  <label className={lbl}>Tipo de Retención</label>
                  <div className={`flex gap-2 p-1 rounded-lg ${isLight ? "bg-gray-100" : "bg-white/5"}`}>
                    {(["compras","ventas"] as const).map(c => (
                      <button key={c} onClick={() => setForm({...form, categoria: c})}
                        className={`flex-1 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors ${form.categoria === c ? "bg-primary text-white" : isLight ? "text-gray-600 hover:bg-gray-200" : "text-gray-400 hover:bg-white/5"}`}>
                        {c === "compras" ? <><ShoppingCart className="w-4 h-4" /> Emito (Compras)</> : <><TrendingUp className="w-4 h-4" /> Me retienen (Ventas)</>}
                      </button>
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    {form.categoria === "compras"
                      ? "Yo soy el agente de retención — le retengo a mi proveedor"
                      : "Mi cliente me aplica una retención sobre mi factura de venta"}
                  </p>
                </div>
              ) : (
                <div className={`p-4 rounded-xl border ${isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"}`}>
                  <div className="flex items-center gap-2">
                    {filterByCategory === "compras" ? (
                      <><ShoppingCart className="w-5 h-5 text-primary" />
                      <div>
                        <p className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>Retención de Compras</p>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Yo soy el agente de retención — le retengo a mi proveedor</p>
                      </div></>
                    ) : (
                      <><TrendingUp className="w-5 h-5 text-primary" />
                      <div>
                        <p className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>Retención de Ventas</p>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Mi cliente me aplica una retención sobre mi factura de venta</p>
                      </div></>
                    )}
                  </div>
                </div>
              )}

              {/* Emisor (solo para ventas) */}
              {form.categoria === "ventas" && (
                <div className={`p-4 rounded-xl border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                  <p className={`text-xs font-bold mb-3 uppercase ${isLight ? "text-blue-700" : "text-blue-300"}`}>Datos del Emisor (tu cliente)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={lbl}>Razón Social del Cliente</label>
                      <input type="text" value={form.emisor_razon} onChange={e => setForm({...form, emisor_razon: e.target.value})} placeholder="Corporación XYZ S.A." className={ic} />
                    </div>
                    <div>
                      <label className={lbl}>RUC del Cliente</label>
                      <input type="text" value={form.emisor_ruc} onChange={e => setForm({...form, emisor_ruc: e.target.value})} placeholder="1799999999001" className={ic} />
                    </div>
                  </div>
                </div>
              )}

              {/* Sujeto retenido */}
              {form.categoria === "compras" && (
                <div>
                  <p className={`text-xs font-bold mb-3 uppercase ${isLight ? "text-gray-500" : "text-gray-400"}`}>Datos del Proveedor</p>

                  {/* ── Buscador por RUC / CI ─────────────────────── */}
                  <div className="relative mb-3">
                    <label className={lbl}>Buscar por RUC / Cédula <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <UserSearch className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      <input
                        type="text"
                        value={supplierQuery}
                        onChange={e => { setSupplierQuery(e.target.value); setShowSupplierDropdown(true); if (!e.target.value) handleClearSupplier(); }}
                        onFocus={() => setShowSupplierDropdown(true)}
                        onBlur={() => setTimeout(() => setShowSupplierDropdown(false), 150)}
                        placeholder="Digite RUC, cédula o nombre del proveedor…"
                        className={`${ic} pl-9 ${supplierFound ? (isLight ? "border-green-400 bg-green-50" : "border-green-500/40 bg-green-500/5") : ""}`}
                      />
                      {supplierFound && (
                        <button onClick={handleClearSupplier} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Dropdown resultados */}
                    {showSupplierDropdown && supplierResults.length > 0 && (
                      <div className={`absolute z-50 top-full mt-1 w-full rounded-lg border shadow-xl overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-[#0f1825] border-white/10"}`}>
                        {supplierResults.map(s => (
                          <button key={s.id} onMouseDown={() => handleSelectSupplier(s)}
                            className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors ${isLight ? "hover:bg-primary/5 border-b border-gray-100" : "hover:bg-white/5 border-b border-white/5"}`}>
                            <div className={`mt-0.5 w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${isLight ? "bg-primary/10" : "bg-primary/20"}`}>
                              <UserSearch className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className={`text-xs font-semibold truncate ${isLight ? "text-gray-900" : "text-white"}`}>{s.name}</p>
                              <p className={`text-[10px] font-mono ${isLight ? "text-gray-500" : "text-gray-400"}`}>{s.ruc} · {s.city}</p>
                            </div>
                            <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 ${s.status === "active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-400"}`}>
                              {s.status === "active" ? "Activo" : "Inactivo"}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {showSupplierDropdown && supplierQuery.length >= 2 && supplierResults.length === 0 && (
                      <div className={`absolute z-50 top-full mt-1 w-full rounded-lg border shadow-xl px-4 py-3 text-xs ${isLight ? "bg-white border-gray-200 text-gray-500" : "bg-[#0f1825] border-white/10 text-gray-400"}`}>
                        No se encontró proveedor — puede ingresar los datos manualmente.
                      </div>
                    )}
                  </div>

                  {/* Tarjeta del proveedor seleccionado */}
                  {supplierFound ? (
                    <>
                      <div className={`rounded-lg px-3 py-2.5 mb-3 flex items-center gap-3 border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/5 border-green-500/20"}`}>
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-bold truncate ${isLight ? "text-gray-900" : "text-white"}`}>{supplierFound.name}</p>
                          <p className={`text-[10px] font-mono ${isLight ? "text-gray-500" : "text-gray-400"}`}>{supplierFound.ruc} · {supplierFound.address}, {supplierFound.city}</p>
                        </div>
                      </div>

                      {/* ── Documentos del proveedor ─────────────────── */}
                      <div className={`rounded-xl border overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <div className={`px-3 py-2 flex items-center gap-2 ${isLight ? "bg-gray-50 border-b border-gray-200" : "bg-white/5 border-b border-white/10"}`}>
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          <p className={`text-[11px] font-bold uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                            Documentos emitidos por este proveedor
                          </p>
                          <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${isLight ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary"}`}>
                            {supplierInvoices.length} doc{supplierInvoices.length !== 1 ? "s" : ""}
                          </span>
                        </div>

                        {supplierInvoices.length === 0 ? (
                          <div className={`px-4 py-5 text-center text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                            No hay documentos registrados para este proveedor.
                          </div>
                        ) : (
                          <div className="divide-y divide-white/5 max-h-52 overflow-y-auto">
                            {supplierInvoices.map(inv => {
                              const isSelected = selectedInvoice?.id === inv.id;
                              const estadoColor = inv.estado === "pagada"
                                ? isLight ? "text-green-600 bg-green-50 border-green-200" : "text-green-400 bg-green-500/10 border-green-500/20"
                                : inv.estado === "vencida"
                                ? isLight ? "text-red-600 bg-red-50 border-red-200" : "text-red-400 bg-red-500/10 border-red-500/20"
                                : isLight ? "text-yellow-700 bg-yellow-50 border-yellow-200" : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
                              return (
                                <button key={inv.id} onClick={() => handleSelectInvoice(inv)}
                                  className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors
                                    ${isSelected
                                      ? isLight ? "bg-primary/8 border-l-2 border-l-primary" : "bg-primary/10 border-l-2 border-l-primary"
                                      : isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
                                    }`}>
                                  {/* Ícono */}
                                  <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-primary text-white" : isLight ? "bg-gray-100 text-gray-500" : "bg-white/5 text-gray-400"}`}>
                                    {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                  </div>
                                  {/* Info */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`text-[11px] font-mono font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>{inv.numero}</span>
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${estadoColor}`}>{inv.estado}</span>
                                      {inv.retenida && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${isLight ? "text-purple-600 bg-purple-50 border-purple-200" : "text-purple-400 bg-purple-500/10 border-purple-500/20"}`}>
                                          ya retenida
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-[10px] truncate mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                      {inv.tipo} · {inv.fecha} · {inv.descripcion}
                                    </p>
                                  </div>
                                  {/* Total */}
                                  <div className="text-right flex-shrink-0">
                                    <p className={`text-xs font-bold ${isLight ? "text-gray-900" : "text-white"}`}>${inv.total.toFixed(2)}</p>
                                    <p className={`text-[9px] ${isLight ? "text-gray-400" : "text-gray-500"}`}>Base: ${inv.subtotal.toFixed(2)}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Confirmación documento seleccionado */}
                      {selectedInvoice && (
                        <div className={`mt-2 rounded-lg px-3 py-2 flex items-center gap-2 border ${isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"}`}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <p className={`text-[11px] ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            Documento seleccionado: <span className="font-mono font-bold text-primary">{selectedInvoice.numero}</span> — Base imponible autocompleta: <span className="font-bold">${selectedInvoice.subtotal.toFixed(2)}</span>
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Campos manuales si no hay proveedor de la lista */
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className={lbl}>Razón Social <span className="text-red-400">*</span></label>
                        <input type="text" value={form.contribuyente} onChange={e => setForm({...form, contribuyente: e.target.value})} placeholder="Nombre del proveedor" className={ic} />
                      </div>
                      <div>
                        <label className={lbl}>RUC / CI <span className="text-red-400">*</span></label>
                        <input type="text" value={form.ruc} onChange={e => setForm({...form, ruc: e.target.value})} placeholder="1799999999001" className={ic} />
                      </div>
                      <div>
                        <label className={lbl}>Dirección</label>
                        <input type="text" value={form.direccion_sujeto} onChange={e => setForm({...form, direccion_sujeto: e.target.value})} placeholder="Dirección del proveedor" className={ic} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Comprobante origen */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-xs font-bold uppercase ${isLight ? "text-gray-500" : "text-gray-400"}`}>Comprobante que Origina la Retención</p>
                  {selectedInvoice && (
                    <button onClick={() => { setSelectedInvoice(null); setForm(prev => ({...prev, comprobante: "", tipo_comprobante: "Factura", fecha_comprobante: "", base_imponible: ""})); }}
                      className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${isLight ? "border-gray-300 text-gray-500 hover:text-red-500 hover:border-red-300" : "border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30"}`}>
                      <X className="w-3 h-3" /> Cambiar doc.
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Tipo de Comprobante</label>
                    <select value={form.tipo_comprobante} onChange={e => setForm({...form, tipo_comprobante: e.target.value})}
                      disabled={!!selectedInvoice}
                      className={`${ic} ${selectedInvoice ? "opacity-60 cursor-not-allowed" : ""}`}>
                      {["Factura","Liquidación de Compra","Nota de Débito"].map(t => <option key={t} value={t} className={opt}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>N° Comprobante <span className="text-red-400">*</span></label>
                    <input type="text" value={form.comprobante} onChange={e => setForm({...form, comprobante: e.target.value})}
                      readOnly={!!selectedInvoice}
                      placeholder="001-001-000000001"
                      className={`${ic} ${selectedInvoice ? "opacity-60 cursor-not-allowed" : ""}`} />
                  </div>
                  <div>
                    <label className={lbl}>Fecha del Comprobante</label>
                    <input type="date" value={form.fecha_comprobante} onChange={e => setForm({...form, fecha_comprobante: e.target.value})}
                      readOnly={!!selectedInvoice}
                      className={`${ic} ${selectedInvoice ? "opacity-60 cursor-not-allowed" : ""}`} />
                  </div>
                  <div>
                    <label className={lbl}>Fecha de Retención</label>
                    <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} className={ic} />
                  </div>
                </div>
              </div>

              {/* Detalle de retención */}
              <div>
                <p className={`text-xs font-bold mb-3 uppercase ${isLight ? "text-gray-500" : "text-gray-400"}`}>Detalle de la Retención</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lbl}>Tipo</label>
                    <div className={`flex gap-1 p-1 rounded-lg ${isLight ? "bg-gray-100" : "bg-white/5"}`}>
                      {(["Fuente","IVA"] as const).map(t => (
                        <button key={t} onClick={() => setForm({...form, tipo: t, codigo: "", concepto: "", porcentaje: 1})}
                          className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${form.tipo === t ? "bg-primary text-white" : isLight ? "text-gray-600 hover:bg-white" : "text-gray-400 hover:bg-white/5"}`}>
                          Ret. {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>Concepto / Código <span className="text-red-400">*</span></label>
                    <select value={form.codigo} onChange={e => {
                      const found = conceptos.find(c => c.cod === e.target.value);
                      setForm({...form, codigo: e.target.value, concepto: found?.desc ?? "", porcentaje: found?.pct ?? 1});
                    }} className={ic}>
                      <option value="" className={opt}>— Seleccionar concepto —</option>
                      {conceptos.map(c => <option key={c.cod} value={c.cod} className={opt}>{c.cod} — {c.pct}% — {c.desc.slice(0,40)}…</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Base Imponible <span className="text-red-400">*</span></label>
                    <input type="number" step="0.01" value={form.base_imponible} onChange={e => setForm({...form, base_imponible: e.target.value})} placeholder="0.00" className={ic} />
                  </div>
                  <div>
                    <label className={lbl}>% de Retención</label>
                    <input type="number" step="0.01" value={form.porcentaje} onChange={e => setForm({...form, porcentaje: parseFloat(e.target.value)||0})} className={ic} />
                  </div>
                </div>
                {form.base_imponible && form.porcentaje > 0 && (
                  <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between">
                    <span className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`}>Valor a retener:</span>
                    <span className="text-lg font-black text-primary">
                      ${(parseFloat(form.base_imponible) * form.porcentaje / 100).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className={`border-t px-5 py-4 flex justify-end gap-3 flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button onClick={closeModalAndReset} className={`px-5 py-2 rounded-lg text-sm font-medium border ${isLight ? "bg-white border-gray-300 text-gray-700" : "bg-white/5 border-white/10 text-white"}`}>Cancelar</button>
              <button onClick={handleSave} className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Save className="w-4 h-4" /> Crear Retención
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: DETALLES DE RETENCIÓN
      ══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className={`max-w-3xl max-h-[90vh] overflow-y-auto ${isLight ? "bg-white" : "bg-[#1a2332] border-white/10"}`}>
          <DialogHeader>
            <DialogTitle className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
              Detalles de Retención
            </DialogTitle>
            <DialogDescription className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Información completa del documento de retención
            </DialogDescription>
          </DialogHeader>

          {detailsRet && (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className={`grid w-full grid-cols-4 ${isLight ? "bg-gray-100" : "bg-white/5"}`}>
                <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                <TabsTrigger value="comprobante" className="text-xs">Comprobante</TabsTrigger>
                <TabsTrigger value="detalles" className="text-xs">Detalles</TabsTrigger>
                <TabsTrigger value="adicional" className="text-xs">Adicional</TabsTrigger>
              </TabsList>

              {/* TAB: GENERAL */}
              <TabsContent value="general" className="space-y-4 mt-4">
                {/* Información del documento */}
                <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h3 className={`text-sm font-bold mb-3 uppercase ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Información del Documento
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs font-semibold ${isLight ? "text-gray-500" : "text-gray-400"}`}>N° Retención</label>
                      <p className={`text-sm font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {detailsRet.num || detailsRet.id}
                      </p>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${isLight ? "text-gray-500" : "text-gray-400"}`}>Estado</label>
                      <p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${estadoBadge(detailsRet.estado)}`}>
                          {detailsRet.estado.charAt(0).toUpperCase() + detailsRet.estado.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha Emisión</label>
                      <p className={`text-sm font-mono ${isLight ? "text-gray-800" : "text-gray-200"}`}>{detailsRet.fecha}</p>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${isLight ? "text-gray-500" : "text-gray-400"}`}>Periodo Fiscal</label>
                      <p className={`text-sm font-mono ${isLight ? "text-gray-800" : "text-gray-200"}`}>{detailsRet.periodo_fiscal}</p>
                    </div>
                    <div className="col-span-2">
                      <label className={`text-xs font-semibold ${isLight ? "text-gray-500" : "text-gray-400"}`}>Clave de Acceso</label>
                      <p className={`text-xs font-mono break-all ${isLight ? "text-gray-700" : "text-gray-300"}`}>{detailsRet.clave_acceso}</p>
                    </div>
                  </div>
                </div>

                {/* Datos del contribuyente */}
                <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                  <h3 className={`text-sm font-bold mb-3 uppercase ${isLight ? "text-blue-700" : "text-blue-300"}`}>
                    {detailsRet.categoria === "compras" ? "Datos del Proveedor (Sujeto Retenido)" : "Datos del Cliente (Emisor)"}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={`text-xs font-semibold ${isLight ? "text-blue-600" : "text-blue-400"}`}>Razón Social</label>
                      <p className={`text-sm font-bold ${isLight ? "text-blue-900" : "text-blue-200"}`}>
                        {detailsRet.categoria === "compras" ? detailsRet.contribuyente : detailsRet.emisor_razon}
                      </p>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${isLight ? "text-blue-600" : "text-blue-400"}`}>RUC/CI</label>
                      <p className={`text-sm font-mono ${isLight ? "text-blue-800" : "text-blue-200"}`}>
                        {detailsRet.categoria === "compras" ? detailsRet.ruc : detailsRet.emisor_ruc}
                      </p>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${isLight ? "text-blue-600" : "text-blue-400"}`}>Email</label>
                      <p className={`text-sm ${isLight ? "text-blue-800" : "text-blue-200"}`}>{detailsRet.emisor_email || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <label className={`text-xs font-semibold ${isLight ? "text-blue-600" : "text-blue-400"}`}>Dirección</label>
                      <p className={`text-sm ${isLight ? "text-blue-800" : "text-blue-200"}`}>{detailsRet.direccion_sujeto || "—"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB: COMPROBANTE ORIGEN */}
              <TabsContent value="comprobante" className="space-y-4 mt-4">
                <div className={`p-4 rounded-lg border ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20"}`}>
                  <h3 className={`text-sm font-bold mb-3 uppercase ${isLight ? "text-amber-700" : "text-amber-300"}`}>
                    Comprobante de Venta Origen
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs font-semibold ${isLight ? "text-amber-600" : "text-amber-400"}`}>Tipo de Comprobante</label>
                      <p className={`text-sm font-bold ${isLight ? "text-amber-900" : "text-amber-200"}`}>{detailsRet.tipo_comprobante}</p>
                    </div>
                    <div>
                      <label className={`text-xs font-semibold ${isLight ? "text-amber-600" : "text-amber-400"}`}>N° Comprobante</label>
                      <p className={`text-sm font-mono font-bold ${isLight ? "text-amber-900" : "text-amber-200"}`}>{detailsRet.comprobante}</p>
                    </div>
                    <div className="col-span-2">
                      <label className={`text-xs font-semibold ${isLight ? "text-amber-600" : "text-amber-400"}`}>Fecha del Comprobante</label>
                      <p className={`text-sm font-mono ${isLight ? "text-amber-800" : "text-amber-200"}`}>{detailsRet.fecha_comprobante}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB: DETALLES DE RETENCIONES */}
              <TabsContent value="detalles" className="space-y-4 mt-4">
                <div className={`p-4 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h3 className={`text-sm font-bold mb-3 uppercase ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Detalles de Retenciones Aplicadas
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`border-b ${isLight ? "bg-gray-100 border-gray-200" : "bg-white/5 border-white/10"}`}>
                          <th className={`px-3 py-2 text-left text-xs font-bold ${isLight ? "text-gray-700" : "text-gray-300"}`}>Tipo</th>
                          <th className={`px-3 py-2 text-left text-xs font-bold ${isLight ? "text-gray-700" : "text-gray-300"}`}>Código</th>
                          <th className={`px-3 py-2 text-right text-xs font-bold ${isLight ? "text-gray-700" : "text-gray-300"}`}>Base Imponible</th>
                          <th className={`px-3 py-2 text-right text-xs font-bold ${isLight ? "text-gray-700" : "text-gray-300"}`}>%</th>
                          <th className={`px-3 py-2 text-right text-xs font-bold ${isLight ? "text-gray-700" : "text-gray-300"}`}>Valor Retenido</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailsRet.detalles.map((det, i) => (
                          <tr key={i} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                            <td className={`px-3 py-2 ${isLight ? "text-gray-800" : "text-gray-200"}`}>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${det.tipo === "Fuente" ? (isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400") : (isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-400")}`}>
                                {det.tipo}
                              </span>
                            </td>
                            <td className={`px-3 py-2 font-mono text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>{det.codigo}</td>
                            <td className={`px-3 py-2 text-right font-mono ${isLight ? "text-gray-800" : "text-gray-200"}`}>${det.base_imponible.toFixed(2)}</td>
                            <td className={`px-3 py-2 text-right font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>{det.porcentaje}%</td>
                            <td className="px-3 py-2 text-right font-mono font-bold text-primary">${det.valor_retenido.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className={`border-t-2 ${isLight ? "bg-gray-50 border-gray-300" : "bg-white/5 border-white/20"}`}>
                          <td colSpan={4} className={`px-3 py-2 text-right font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            TOTAL RETENIDO:
                          </td>
                          <td className="px-3 py-2 text-right font-bold text-lg text-primary">
                            ${detailsRet.total_retenido.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </TabsContent>

              {/* TAB: INFORMACIÓN ADICIONAL */}
              <TabsContent value="adicional" className="space-y-4 mt-4">
                <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h3 className={`text-sm font-bold mb-3 uppercase ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Información Adicional
                  </h3>
                  {detailsRet.num_autorizacion && (
                    <div className="mb-3">
                      <label className={`text-xs font-semibold ${isLight ? "text-gray-500" : "text-gray-400"}`}>N° Autorización SRI</label>
                      <p className={`text-sm font-mono ${isLight ? "text-gray-800" : "text-gray-200"}`}>{detailsRet.num_autorizacion}</p>
                    </div>
                  )}
                  {detailsRet.observaciones && (
                    <div>
                      <label className={`text-xs font-semibold ${isLight ? "text-gray-500" : "text-gray-400"}`}>Observaciones</label>
                      <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{detailsRet.observaciones}</p>
                    </div>
                  )}
                  {!detailsRet.num_autorizacion && !detailsRet.observaciones && (
                    <p className={`text-sm italic ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      No hay información adicional disponible
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
                <button
                  onClick={() => printRetencion({ ...detailsRet, tipo: detailsRet.detalles[0]?.tipo ?? "", base: detailsRet.total_retenido, porcentaje: detailsRet.detalles[0]?.porcentaje ?? 0, valor: detailsRet.total_retenido })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
                >
                  <Printer className="w-4 h-4" /> Imprimir
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
