import { useState } from "react";
import { Search, FileText, Plus, Calendar, X, Printer, Send, Eye, Download, CheckCircle, Clock, AlertTriangle, Shield, ZoomOut, ZoomIn, RefreshCw, Code2 } from "lucide-react";
import { DatePicker } from "./date-picker-range";
import { CreateInvoiceModal } from "./create-invoice-modal";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

// FileCode icon replacement (not in lucide)
const FileCode = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface InvoiceItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  customer: {
    name: string;
    ruc: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  subtotal12: number;
  subtotal0: number;
  tax: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer" | "mixed" | "credit";
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

const genClave = () =>
  Array.from({ length: 49 }, () => Math.floor(Math.random() * 10)).join("");

const INVOICES_INIT: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "001-001-000123",
    date: "2026-03-05",
    time: "14:32",
    customer: {
      name: "Corporación Favorita C.A.",
      ruc: "1790016919001",
      address: "Av. General Enríquez km 4.5, Sangolquí",
      email: "facturacion@favorita.com",
      phone: "02-3456789"
    },
    items: [
      { code: "PROD001", name: "Laptop HP 15-dy", quantity: 1, price: 850.00, discount: 0, tax: 12, total: 850.00 },
      { code: "PROD002", name: "Mouse Logitech MX", quantity: 2, price: 45.00, discount: 0, tax: 12, total: 90.00 },
      { code: "SERV001", name: "Consultoría IT", quantity: 5, price: 60.00, discount: 50, tax: 12, total: 250.00 },
    ],
    subtotal: 1190.00,
    totalDiscount: 50.00,
    subtotal12: 1140.00,
    subtotal0: 0,
    tax: 136.80,
    total: 1276.80,
    paymentMethod: "credit",
    status: "completed",
    seller: "Juan Pérez",
    branch: "Sucursal Centro",
    authorizationNumber: "0503202601179001234500120010010000012341234567890",
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
    invoiceNumber: "001-001-000124",
    date: "2026-03-06",
    time: "09:15",
    customer: {
      name: "Importadora del Pacífico Cía. Ltda.",
      ruc: "1712345678001",
      address: "Av. de las Américas y José Mascote, Guayaquil",
      email: "info@importadorapacifico.com",
      phone: "04-2567890"
    },
    items: [
      { code: "PROD010", name: "Monitor Samsung 24\"", quantity: 3, price: 280.00, discount: 40, tax: 12, total: 800.00 },
    ],
    subtotal: 840.00,
    totalDiscount: 40.00,
    subtotal12: 800.00,
    subtotal0: 0,
    tax: 96.00,
    total: 896.00,
    paymentMethod: "transfer",
    status: "completed",
    seller: "Ana Torres",
    branch: "Sucursal Norte",
    authorizationNumber: "0603202601179001234500120010010000012441234567891",
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
    invoiceNumber: "001-001-000125",
    date: "2026-03-07",
    time: "11:45",
    customer: {
      name: "Distribuidora El Sol S.A.",
      ruc: "1891234567001",
      address: "Calle Bolívar 234 y Rocafuerte, Cuenca",
      email: "ventas@elsol.com.ec",
      phone: "07-2890123"
    },
    items: [
      { code: "PROD015", name: "Teclado Mecánico RGB", quantity: 5, price: 120.00, discount: 60, tax: 12, total: 540.00 },
      { code: "PROD016", name: "Webcam Logitech C920", quantity: 2, price: 95.00, discount: 0, tax: 12, total: 190.00 },
    ],
    subtotal: 790.00,
    totalDiscount: 60.00,
    subtotal12: 730.00,
    subtotal0: 0,
    tax: 87.60,
    total: 817.60,
    paymentMethod: "card",
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
    invoiceNumber: "001-001-000126",
    date: "2026-03-08",
    time: "16:20",
    customer: {
      name: "Comercial Andina Ltda.",
      ruc: "0992345678001",
      address: "Av. 6 de Diciembre N34-45, Quito",
      email: "compras@andina.ec",
      phone: "02-2445566"
    },
    items: [
      { code: "PROD020", name: "Impresora Epson L3210", quantity: 1, price: 285.00, discount: 0, tax: 12, total: 285.00 },
    ],
    subtotal: 285.00,
    totalDiscount: 0,
    subtotal12: 285.00,
    subtotal0: 0,
    tax: 34.20,
    total: 319.20,
    paymentMethod: "cash",
    status: "cancelled",
    seller: "María González",
    branch: "Sucursal Centro",
    sriStatus: "not_sent",
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
    invoiceNumber: "001-001-000127",
    date: "2026-03-08",
    time: "10:15",
    customer: {
      name: "Supermercados La Rebaja S.A.",
      ruc: "1790345678001",
      address: "Av. Maldonado S15-78, Quito",
      email: "facturacion@larebaja.com",
      phone: "02-2667788"
    },
    items: [
      { code: "PROD025", name: "Router TP-Link AC1200", quantity: 4, price: 65.00, discount: 20, tax: 12, total: 240.00 },
      { code: "PROD026", name: "Switch Gigabit 8 puertos", quantity: 2, price: 85.00, discount: 0, tax: 12, total: 170.00 },
    ],
    subtotal: 430.00,
    totalDiscount: 20.00,
    subtotal12: 410.00,
    subtotal0: 0,
    tax: 49.20,
    total: 459.20,
    paymentMethod: "transfer",
    status: "completed",
    seller: "Ana Torres",
    branch: "Sucursal Norte",
    authorizationNumber: "0803202601179001234500120010010000012741234567892",
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
    id: "6",
    invoiceNumber: "001-001-000128",
    date: "2026-03-08",
    time: "14:50",
    customer: {
      name: "Ferretería Industrial S.A.",
      ruc: "1791456789001",
      address: "Av. Mariscal Sucre Km 7.5, Quito",
      email: "ventas@ferreteriaind.com",
      phone: "02-2334455"
    },
    items: [
      { code: "PROD030", name: "UPS APC 1500VA", quantity: 3, price: 320.00, discount: 100, tax: 12, total: 860.00 },
    ],
    subtotal: 960.00,
    totalDiscount: 100.00,
    subtotal12: 860.00,
    subtotal0: 0,
    tax: 103.20,
    total: 963.20,
    paymentMethod: "credit",
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
    id: "7",
    invoiceNumber: "001-001-000129",
    date: "2026-03-09",
    time: "09:30",
    customer: {
      name: "Tecnología Avanzada Cía. Ltda.",
      ruc: "1792567890001",
      address: "Av. González Suárez N27-142, Quito",
      email: "compras@tecnoavanzada.ec",
      phone: "02-2998877"
    },
    items: [
      { code: "PROD035", name: "Proyector Epson EB-X06", quantity: 1, price: 485.00, discount: 0, tax: 12, total: 485.00 },
      { code: "PROD036", name: "Pantalla de Proyección 100\\\"", quantity: 1, price: 125.00, discount: 0, tax: 12, total: 125.00 },
    ],
    subtotal: 610.00,
    totalDiscount: 0,
    subtotal12: 610.00,
    subtotal0: 0,
    tax: 73.20,
    total: 683.20,
    paymentMethod: "card",
    status: "completed",
    seller: "Juan Pérez",
    branch: "Sucursal Centro",
    authorizationNumber: "0903202601179001234500120010010000012941234567893",
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
  {
    id: "8",
    invoiceNumber: "001-001-000130",
    date: "2026-03-09",
    time: "11:00",
    customer: {
      name: "Almacenes Japón S.A.",
      ruc: "1790567890001",
      address: "Av. Amazonas y Naciones Unidas, Quito",
      email: "facturas@almjapon.com",
      phone: "02-2556677"
    },
    items: [
      { code: "PROD040", name: "Disco Duro Externo 2TB", quantity: 10, price: 95.00, discount: 150, tax: 12, total: 800.00 },
    ],
    subtotal: 950.00,
    totalDiscount: 150.00,
    subtotal12: 800.00,
    subtotal0: 0,
    tax: 96.00,
    total: 896.00,
    paymentMethod: "transfer",
    status: "completed",
    seller: "María González",
    branch: "Sucursal Norte",
    sriStatus: "rejected",
    emisor_razon: EMPRESA.razon,
    emisor_dir: EMPRESA.dir,
    emisor_ruc: EMPRESA.ruc,
    emisor_telefono: EMPRESA.tel,
    emisor_email: EMPRESA.email,
    ambiente: "Pruebas",
    periodo_fiscal: "03/2026",
  },
  {
    id: "9",
    invoiceNumber: "001-001-000131",
    date: "2026-03-09",
    time: "15:45",
    customer: {
      name: "Megamaxi S.A.",
      ruc: "1790987654001",
      address: "Av. 6 de Diciembre y Eloy Alfaro, Quito",
      email: "proveedores@megamaxi.com",
      phone: "02-2443322"
    },
    items: [
      { code: "PROD045", name: "Memoria RAM DDR4 16GB", quantity: 8, price: 75.00, discount: 80, tax: 12, total: 520.00 },
      { code: "PROD046", name: "SSD M.2 500GB", quantity: 6, price: 85.00, discount: 0, tax: 12, total: 510.00 },
    ],
    subtotal: 1110.00,
    totalDiscount: 80.00,
    subtotal12: 1030.00,
    subtotal0: 0,
    tax: 123.60,
    total: 1153.60,
    paymentMethod: "credit",
    status: "completed",
    seller: "Ana Torres",
    branch: "Sucursal Centro",
    sriStatus: "rejected",
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
   GENERADOR XML SRI
═════════════════════════════════════════════════════════════════════ */
function generateInvoiceXML(inv: Invoice): string {
  const detallesXml = inv.items.map(item => `
    <detalle>
      <codigoPrincipal>${item.code}</codigoPrincipal>
      <descripcion>${item.name}</descripcion>
      <cantidad>${item.quantity.toFixed(2)}</cantidad>
      <precioUnitario>${item.price.toFixed(6)}</precioUnitario>
      <descuento>${item.discount.toFixed(2)}</descuento>
      <precioTotalSinImpuesto>${item.total.toFixed(2)}</precioTotalSinImpuesto>
      <impuestos>
        <impuesto>
          <codigo>2</codigo>
          <codigoPorcentaje>${item.tax === 12 ? '2' : '0'}</codigoPorcentaje>
          <tarifa>${item.tax}</tarifa>
          <baseImponible>${item.total.toFixed(2)}</baseImponible>
          <valor>${(item.total * item.tax / 100).toFixed(2)}</valor>
        </impuesto>
      </impuestos>
    </detalle>`).join("");
    
  return `<?xml version="1.0" encoding="UTF-8"?>
<factura id="comprobante" version="1.0.0">
  <infoTributaria>
    <ambiente>${inv.ambiente === "Producción" ? "2" : "1"}</ambiente>
    <tipoEmision>1</tipoEmision>
    <razonSocial>${inv.emisor_razon}</razonSocial>
    <nombreComercial>${inv.emisor_razon}</nombreComercial>
    <ruc>${inv.emisor_ruc}</ruc>
    <claveAcceso>${inv.authorizationNumber || genClave()}</claveAcceso>
    <codDoc>01</codDoc>
    <estab>001</estab>
    <ptoEmi>001</ptoEmi>
    <secuencial>${inv.invoiceNumber.split('-')[2]}</secuencial>
    <dirMatriz>${inv.emisor_dir}</dirMatriz>
  </infoTributaria>
  <infoFactura>
    <fechaEmision>${inv.date.split('-').reverse().join('/')}</fechaEmision>
    <dirEstablecimiento>${inv.emisor_dir}</dirEstablecimiento>
    <obligadoContabilidad>SI</obligadoContabilidad>
    <tipoIdentificacionComprador>04</tipoIdentificacionComprador>
    <razonSocialComprador>${inv.customer.name}</razonSocialComprador>
    <identificacionComprador>${inv.customer.ruc}</identificacionComprador>
    <totalSinImpuestos>${inv.subtotal.toFixed(2)}</totalSinImpuestos>
    <totalDescuento>${inv.totalDiscount.toFixed(2)}</totalDescuento>
    <totalConImpuestos>
      <totalImpuesto>
        <codigo>2</codigo>
        <codigoPorcentaje>2</codigoPorcentaje>
        <baseImponible>${inv.subtotal12.toFixed(2)}</baseImponible>
        <valor>${inv.tax.toFixed(2)}</valor>
      </totalImpuesto>
    </totalConImpuestos>
    <propina>0.00</propina>
    <importeTotal>${inv.total.toFixed(2)}</importeTotal>
    <moneda>DOLAR</moneda>
    <pagos>
      <pago>
        <formaPago>${inv.paymentMethod === 'cash' ? '01' : inv.paymentMethod === 'card' ? '19' : inv.paymentMethod === 'transfer' ? '17' : '20'}</formaPago>
        <total>${inv.total.toFixed(2)}</total>
      </pago>
    </pagos>
  </infoFactura>
  <detalles>${detallesXml}
  </detalles>
  <infoAdicional>
    <campoAdicional nombre="EMAIL">${inv.customer.email || inv.emisor_email}</campoAdicional>
    <campoAdicional nombre="TELEFONO">${inv.customer.phone || inv.emisor_telefono}</campoAdicional>
    <campoAdicional nombre="VENDEDOR">${inv.seller}</campoAdicional>
  </infoAdicional>
</factura>`;
}

function highlightXML(xml: string): string {
  return xml
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(&lt;\/?)(\w+)/g, '<span style="color:#fb923c">$1$2</span>')
    .replace(/(\w+)(=)(&quot;[^&]*&quot;)/g, '<span style="color:#7dd3fc">$1</span><span style="color:#94a3b8">$2</span><span style="color:#86efac">$3</span>')
    .replace(/(&lt;\?xml.*?&gt;)/g, '<span style="color:#94a3b8;font-style:italic">$1</span>');
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE VISOR DE FACTURA SRI (RIDE + XML)
══════════════════════════════════════════════════════════════════════ */
function InvoiceViewer({ invoice, onPrint, isLight }: {
  invoice: Invoice;
  onPrint: () => void;
  isLight: boolean;
}) {
  const [zoom, setZoom] = useState(100);
  const [activeView, setActiveView] = useState<"ride" | "xml">("ride");
  const [xmlCopied, setXmlCopied] = useState(false);

  const isAutorizada = invoice.sriStatus === "authorized";
  const xmlContent = generateInvoiceXML(invoice);
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
    a.download = `${invoice.invoiceNumber.replace(/\//g, "-")}.xml`;
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
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className={`flex-1 min-h-0 ${activeView === "xml" ? "flex flex-col" : "overflow-auto"} ${activeView === "ride" ? (isLight ? "bg-gray-300" : "bg-[#06090f]") : ""}`}>
        {/* ── Vista RIDE ── */}
        {activeView === "ride" && (
          <div className={`flex-1 overflow-auto p-3 ${isLight ? "bg-gray-300" : "bg-[#06090f]"}`}>
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.15s" }}>
              <div className="bg-white mx-auto shadow-2xl text-gray-800"
                style={{ width: 520, fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 9.5 }}>

                {!isAutorizada && (
                  <div style={{ background: "#fbbf24", color: "#78350f", textAlign: "center", padding: "3px 8px", fontWeight: 700, fontSize: 9, letterSpacing: 1 }}>
                    ⚠ DOCUMENTO NO AUTORIZADO — {invoice.sriStatus?.toUpperCase()}
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
                        <p style={{ fontWeight: 900, fontSize: 10.5, color: "#0D1B2A", marginBottom: 1 }}>{invoice.emisor_razon || EMPRESA.razon}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5 }}>{invoice.emisor_dir || EMPRESA.dir}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5 }}>Tel: {invoice.emisor_telefono || EMPRESA.tel} | {invoice.emisor_email || EMPRESA.email}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5, marginTop: 1 }}>Ambiente: <b>{invoice.ambiente || "Pruebas"}</b> | Emisión: Normal</p>
                      </div>
                    </div>
                    <div style={{ padding: "7px 8px", textAlign: "center" }}>
                      <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                        <p style={{ color: "#6b7280", fontSize: 7.5, fontWeight: 700, textTransform: "uppercase" }}>R.U.C.</p>
                        <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{invoice.emisor_ruc || EMPRESA.ruc}</p>
                      </div>
                      <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                        <p style={{ color: "#E8692E", fontSize: 8, fontWeight: 700, textTransform: "uppercase" }}>FACTURA</p>
                        <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{invoice.invoiceNumber}</p>
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
                {invoice.authorizationNumber && (
                  <div style={{ border: "1px solid #9ca3af", margin: "4px 7px", padding: "4px 7px" }}>
                    <p style={{ fontWeight: 700, color: "#6b7280", fontSize: 7.5, textTransform: "uppercase", marginBottom: 2 }}>Clave de Acceso</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}>
                        {invoice.authorizationNumber.slice(0, 36).split("").map((c, i) => (
                          <div key={i} style={{ background: "#111", width: 1.8, height: 12 + (parseInt(c) % 3) * 3 }} />
                        ))}
                      </div>
                      <p style={{ fontFamily: "monospace", fontSize: 7.5, color: "#374151", wordBreak: "break-all" }}>{invoice.authorizationNumber}</p>
                    </div>
                  </div>
                )}

                {/* Datos del Cliente */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                  <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Datos del Cliente
                  </div>
                  <div style={{ padding: "5px 7px", display: "grid", gridTemplateColumns: "1fr auto", gap: "3px 10px" }}>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>Razón Social: </span><span style={{ fontWeight: 600 }}>{invoice.customer.name}</span></div>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>RUC/CI: </span><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{invoice.customer.ruc}</span></div>
                    <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#6b7280", fontWeight: 700 }}>Dirección: </span>{invoice.customer.address || "Ecuador"}</div>
                  </div>
                </div>

                {/* Detalle de Productos/Servicios */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                  <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Detalle de Productos/Servicios
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f3f4f6", borderBottom: "1px solid #d1d5db" }}>
                        {["Cód.", "Descripción", "Cant.", "P. Unit.", "Desc.", "Total"].map(h => (
                          <th key={h} style={{ padding: "3px 5px", textAlign: ["Cant.", "P. Unit.", "Desc.", "Total"].includes(h) ? "right" : "left", fontSize: 8, fontWeight: 700, color: "#4b5563", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.items.map((item, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <td style={{ padding: "3px 5px", fontFamily: "monospace", fontWeight: 700, color: "#E8692E", fontSize: 8.5 }}>{item.code}</td>
                          <td style={{ padding: "3px 5px", fontSize: 8.5, maxWidth: 200 }}>{item.name}</td>
                          <td style={{ padding: "3px 5px", textAlign: "right", fontFamily: "monospace", fontSize: 8.5 }}>{item.quantity}</td>
                          <td style={{ padding: "3px 5px", textAlign: "right", fontFamily: "monospace", fontSize: 8.5 }}>{fmt(item.price)}</td>
                          <td style={{ padding: "3px 5px", textAlign: "right", fontFamily: "monospace", fontSize: 8.5 }}>{fmt(item.discount)}</td>
                          <td style={{ padding: "3px 5px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totales */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ color: "#4b5563", fontSize: 8.5 }}>Subtotal:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(invoice.subtotal)}</span>
                  </div>
                  {invoice.totalDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                      <span style={{ color: "#4b5563", fontSize: 8.5 }}>Descuento:</span>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>-{fmt(invoice.totalDiscount)}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ color: "#4b5563", fontSize: 8.5 }}>Subtotal 12%:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(invoice.subtotal12)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 7px", borderBottom: "1px solid #e5e7eb" }}>
                    <span style={{ color: "#4b5563", fontSize: 8.5 }}>IVA 12%:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 8.5 }}>{fmt(invoice.tax)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 7px", background: "#E8692E" }}>
                    <span style={{ color: "#fff", fontWeight: 900, fontSize: 10.5 }}>TOTAL FACTURA:</span>
                    <span style={{ color: "#fff", fontWeight: 900, fontFamily: "monospace", fontSize: 11 }}>{fmt(invoice.total)}</span>
                  </div>
                </div>

                {/* Footer SRI */}
                <div style={{ background: "#0D1B2A", margin: "0 7px 7px", padding: "5px 7px", display: "flex", gap: 7, alignItems: "center", borderRadius: "0 0 4px 4px" }}>
                  <Shield style={{ width: 18, height: 18, color: "#E8692E", flexShrink: 0 }} />
                  <div>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 8, marginBottom: 1 }}>SERVICIO DE RENTAS INTERNAS — REPÚBLICA DEL ECUADOR</p>
                    <p style={{ color: "#9ca3af", fontSize: 7.5 }}>
                      Verifique en: <span style={{ color: "#E8692E" }}>www.sri.gob.ec</span>
                      {isAutorizada && invoice.sriAuthDate && ` | Fecha Auth: ${invoice.sriAuthDate}`}
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
                <span className="font-mono" style={{ color: "#e2e8f0" }}>{invoice.invoiceNumber.replace(/\//g, "-")}.xml</span>
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
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function SalesInvoicesContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES_INIT);
  const [selected, setSelected] = useState<Invoice | null>(INVOICES_INIT[0]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Variables de tema
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-600" : "text-gray-400";
  const opt = isLight ? "text-gray-900" : "text-white";

  // Filtrar facturas
  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.ruc.includes(search);

    const matchesStatus = filterStatus === "all" || inv.sriStatus === filterStatus;
    
    let matchesFecha = true;
    if (fechaDesde && inv.date < fechaDesde) matchesFecha = false;
    if (fechaHasta && inv.date > fechaHasta) matchesFecha = false;

    return matchesSearch && matchesStatus && matchesFecha;
  });

  const fmt = (num: number) => `$${num.toFixed(2)}`;

  const handlePrint = () => {
    toast.success("Imprimiendo factura...");
  };

  const handleSaveInvoice = (newInvoice: Invoice) => {
    setInvoices([newInvoice, ...invoices]);
    setSelected(newInvoice);
    toast.success(`Factura ${newInvoice.invoiceNumber} creada exitosamente`);
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
                placeholder="Buscar número, cliente, RUC..." 
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
              Nueva Factura
            </button>
          </div>

          {/* ── TABLA ── */}
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto custom-scrollbar">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className={isLight ? "bg-gray-200" : "bg-[#0d1724]"}>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>N° FACTURA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>FECHA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>CLIENTE</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>RUC</th>
                  <th className={`px-3 py-2.5 text-right font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>TOTAL</th>
                  <th className={`px-3 py-2.5 text-center font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((inv) => {
                    const isSelected = selected?.id === inv.id;
                    return (
                      <tr
                        key={inv.id}
                        onClick={() => setSelected(inv)}
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
                          <div className="font-mono font-bold text-xs">{inv.invoiceNumber}</div>
                        </td>
                        <td className={`px-3 py-1.5 text-xs ${txt}`}>{inv.date}</td>
                        <td className={`px-3 py-1.5 text-xs font-medium ${txt}`}>
                          {inv.customer.name}
                        </td>
                        <td className={`px-3 py-1.5 text-xs font-mono ${sub}`}>
                          {inv.customer.ruc}
                        </td>
                        <td className={`px-3 py-1.5 text-right font-mono font-bold text-xs ${txt}`}>
                          {fmt(inv.total)}
                        </td>
                        <td className="px-3 py-1.5 text-center">
                          {inv.sriStatus === "authorized" && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"}`}>
                              <CheckCircle className="w-3 h-3" />
                              Autorizada
                            </span>
                          )}
                          {inv.sriStatus === "pending" && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-400"}`}>
                              <Clock className="w-3 h-3" />
                              Pendiente
                            </span>
                          )}
                          {inv.sriStatus === "rejected" && (
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
                        <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>No se encontraron facturas</p>
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
            <InvoiceViewer invoice={selected} onPrint={handlePrint} isLight={isLight} />
          ) : (
            <div className={`flex-1 flex items-center justify-center ${isLight ? "bg-gray-50" : "bg-[#0c1520]"}`}>
              <div className="text-center">
                <FileText className={`w-16 h-16 mx-auto mb-4 ${sub}`} />
                <p className={`text-sm ${sub}`}>Seleccione una factura para ver el detalle</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal de creación */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveInvoice}
        isLight={isLight}
      />
    </div>
  );
}