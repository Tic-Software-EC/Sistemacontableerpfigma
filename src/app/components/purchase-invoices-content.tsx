import { useState } from "react";
import { Search, FileText, Plus, X, Printer, Download, CheckCircle, Clock, AlertTriangle, Shield, ZoomOut, ZoomIn, RefreshCw, Code2, XCircle } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { CancelPurchaseInvoiceModal } from "./cancel-purchase-invoice-modal";
import { DatePicker } from "./date-picker-range";
import { CreatePurchaseInvoiceModal } from "./create-purchase-invoice-modal";

// FileCode icon replacement
const FileCode = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface PurchaseInvoiceItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  supplier: {
    name: string;
    ruc: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  items: PurchaseInvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  subtotal12: number;
  subtotal0: number;
  tax: number;
  total: number;
  status: "completed" | "cancelled" | "pending";
  authorizationNumber?: string;
  sriStatus?: "authorized" | "pending" | "rejected" | "not_sent";
  sriAuthDate?: string;
  // Datos del EMISOR (Proveedor)
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
  email: "compras@ticsoftec.com",
};

const genClave = () =>
  Array.from({ length: 49 }, () => Math.floor(Math.random() * 10)).join("");

const INVOICES_INIT: PurchaseInvoice[] = [
  {
    id: "1",
    invoiceNumber: "001-002-001234",
    date: "2026-03-05",
    time: "10:30",
    supplier: {
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
    status: "completed",
    authorizationNumber: "0803202601179001691900120010020012341234567891",
    sriStatus: "authorized",
    sriAuthDate: "2026-03-05 10:35",
    // EMISOR = Proveedor (quien emite la factura)
    emisor_razon: "Corporación Favorita C.A.",
    emisor_dir: "Av. General Enríquez km 4.5, Sangolquí",
    emisor_ruc: "1790016919001",
    emisor_telefono: "02-3456789",
    emisor_email: "facturacion@favorita.com",
    ambiente: "Pruebas",
    periodo_fiscal: "03/2026",
  },
  {
    id: "2",
    invoiceNumber: "002-001-005678",
    date: "2026-03-06",
    time: "14:15",
    supplier: {
      name: "Importadora del Pacífico Cía. Ltda.",
      ruc: "1712345678001",
      address: "Av. de la Prensa N47-148, Quito",
      email: "ventas@importadorapac.com",
      phone: "02-2876543"
    },
    items: [
      { code: "MAT001", name: "Cable UTP Cat6 305m", quantity: 3, price: 120.00, discount: 20, tax: 12, total: 340.00 },
      { code: "MAT002", name: "Conectores RJ45 x100", quantity: 5, price: 12.00, discount: 0, tax: 12, total: 60.00 },
    ],
    subtotal: 420.00,
    totalDiscount: 20.00,
    subtotal12: 400.00,
    subtotal0: 0,
    tax: 48.00,
    total: 448.00,
    status: "completed",
    sriStatus: "pending",
    // EMISOR = Proveedor
    emisor_razon: "Importadora del Pacífico Cía. Ltda.",
    emisor_dir: "Av. de la Prensa N47-148, Quito",
    emisor_ruc: "1712345678001",
    emisor_telefono: "02-2876543",
    emisor_email: "ventas@importadorapac.com",
    ambiente: "Pruebas",
    periodo_fiscal: "03/2026",
  },
  {
    id: "3",
    invoiceNumber: "003-001-000890",
    date: "2026-03-07",
    time: "09:45",
    supplier: {
      name: "Distribuidora El Sol S.A.",
      ruc: "1891123456001",
      address: "Av. Maldonado S14-50, Quito",
      email: "info@distrisol.com",
      phone: "02-2789012"
    },
    items: [
      { code: "OFI001", name: "Resma Papel A4", quantity: 10, price: 4.50, discount: 5, tax: 12, total: 40.00 },
      { code: "OFI002", name: "Toner HP 85A", quantity: 3, price: 65.00, discount: 0, tax: 12, total: 195.00 },
    ],
    subtotal: 240.00,
    totalDiscount: 5.00,
    subtotal12: 235.00,
    subtotal0: 0,
    tax: 28.20,
    total: 263.20,
    status: "cancelled",
    sriStatus: "not_sent",
    // EMISOR = Proveedor
    emisor_razon: "Distribuidora El Sol S.A.",
    emisor_dir: "Av. Maldonado S14-50, Quito",
    emisor_ruc: "1891123456001",
    emisor_telefono: "02-2789012",
    emisor_email: "info@distrisol.com",
    ambiente: "Pruebas",
    periodo_fiscal: "03/2026",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   GENERADOR XML SRI
══════════════════════════════════════════════════════════════════════ */
function generateInvoiceXML(inv: PurchaseInvoice): string {
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
    <razonSocialComprador>${inv.supplier.name}</razonSocialComprador>
    <identificacionComprador>${inv.supplier.ruc}</identificacionComprador>
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
    <importeTotal>${inv.total.toFixed(2)}</importeTotal>
  </infoFactura>
  <detalles>${detallesXml}
  </detalles>
</factura>`;
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE VISOR RIDE
══════════════════════════════════════════════════════════════════════ */
interface InvoiceRIDEProps {
  invoice: PurchaseInvoice;
  zoom: number;
  setZoom: (zoom: number) => void;
  onPrint: () => void;
  activeView: 'ride' | 'xml';
  setActiveView: (view: 'ride' | 'xml') => void;
}

function InvoiceRIDE({ invoice, zoom, setZoom, onPrint, activeView, setActiveView }: InvoiceRIDEProps) {
  const isAutorizada = invoice.sriStatus === "authorized";
  const fmt = (n: number) => `$${n.toFixed(2)}`;
  
  const xmlContent = generateInvoiceXML(invoice);
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
                  a.download = `factura-${invoice.invoiceNumber}.xml`;
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
                        <p style={{ fontWeight: 900, fontSize: 10.5, color: "#0D1B2A", marginBottom: 1 }}>{invoice.emisor_razon || invoice.supplier.name}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5 }}>{invoice.emisor_dir || invoice.supplier.address}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5 }}>Tel: {invoice.emisor_telefono || invoice.supplier.phone} | {invoice.emisor_email || invoice.supplier.email}</p>
                        <p style={{ color: "#4b5563", fontSize: 8.5, marginTop: 1 }}>Ambiente: <b>{invoice.ambiente || "Pruebas"}</b> | Emisión: Normal</p>
                      </div>
                    </div>
                    <div style={{ padding: "7px 8px", textAlign: "center" }}>
                      <div style={{ border: "1px solid #9ca3af", padding: "2px 4px", marginBottom: 3 }}>
                        <p style={{ color: "#6b7280", fontSize: 7.5, fontWeight: 700, textTransform: "uppercase" }}>R.U.C.</p>
                        <p style={{ fontWeight: 900, fontSize: 9.5, letterSpacing: 0.5, color: "#0D1B2A" }}>{invoice.emisor_ruc || invoice.supplier.ruc}</p>
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

                {/* Datos del Proveedor */}
                <div style={{ border: "1px solid #9ca3af", margin: "4px 7px 0" }}>
                  <div style={{ background: "#0D1B2A", color: "#fff", padding: "3px 7px", fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Datos del Proveedor
                  </div>
                  <div style={{ padding: "5px 7px", display: "grid", gridTemplateColumns: "1fr auto", gap: "3px 10px" }}>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>Razón Social: </span><span style={{ fontWeight: 600 }}>{invoice.supplier.name}</span></div>
                    <div><span style={{ color: "#6b7280", fontWeight: 700 }}>RUC/CI: </span><span style={{ fontFamily: "monospace", fontWeight: 600 }}>{invoice.supplier.ruc}</span></div>
                    <div style={{ gridColumn: "1/-1" }}><span style={{ color: "#6b7280", fontWeight: 700 }}>Dirección: </span>{invoice.supplier.address || "Ecuador"}</div>
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
        ) : (
          // Vista XML con syntax highlighting
          <div className="h-full flex flex-col">
            {/* Barra de información del archivo */}
            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: "#2d2d2d", borderColor: "#3e3e3e" }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-white text-xs font-mono font-semibold">{invoice.invoiceNumber}.xml</span>
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
                        const regex = /(<\/?)([\w]+)|(\s+[\w]+)=(")(.* ?)(")|([ <>])/g;
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
export function PurchaseInvoicesContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [invoices, setInvoices] = useState<PurchaseInvoice[]>(INVOICES_INIT);
  const [selected, setSelected] = useState<PurchaseInvoice | null>(INVOICES_INIT[0]);
  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [zoom, setZoom] = useState(100);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeView, setActiveView] = useState<'ride' | 'xml'>('ride');

  const filtered = invoices.filter((inv) => {
    const matchSearch = search
      ? inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        inv.supplier.ruc.includes(search)
      : true;
    const matchStatus = filterStatus === "all" || inv.sriStatus === filterStatus;
    
    // Filtro de fecha
    let matchFecha = true;
    if (fechaDesde || fechaHasta) {
      const invFecha = new Date(inv.date);
      if (fechaDesde) {
        const desde = new Date(fechaDesde);
        if (invFecha < desde) matchFecha = false;
      }
      if (fechaHasta) {
        const hasta = new Date(fechaHasta);
        if (invFecha > hasta) matchFecha = false;
      }
    }
    
    return matchSearch && matchStatus && matchFecha;
  });

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const opt = isLight ? "text-gray-900" : "text-white";
  const fmt = (num: number) => `$${num.toFixed(2)}`;

  const handlePrint = () => {
    toast.success("Imprimiendo factura...");
  };

  const handleCancelInvoice = (data: any) => {
    toast.success(`Factura ${data.invoice.number} anulada exitosamente`);
  };

  const handleSaveInvoice = (newInvoice: PurchaseInvoice) => {
    setInvoices([newInvoice, ...invoices]);
    setSelected(newInvoice);
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

          {/* ── ÚNICA FILA: FILTROS + ACCIONES ── */}
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
              <option value="factura" className={opt}>Factura</option>
              <option value="liquidacion" className={opt}>Liquidación Compra</option>
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
              Nueva Factura
            </button>
            
            <button 
              onClick={() => setShowCancelModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-red-300 text-red-700 hover:bg-red-50" : "border-red-500/30 text-red-400 hover:bg-red-500/10"}`}
            >
              <XCircle className="w-3.5 h-3.5" /> Anular Factura
            </button>
          </div>

          {/* ── TABLA ── */}
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto custom-scrollbar">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className={isLight ? "bg-gray-200" : "bg-[#0d1724]"}>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>N° FACTURA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>FECHA</th>
                  <th className={`px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>PROVEEDOR</th>
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
                          {inv.supplier.name}
                        </td>
                        <td className={`px-3 py-1.5 text-xs font-mono ${sub}`}>
                          {inv.supplier.ruc}
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

        {/* ══ Panel derecho: VISOR RIDE 40% ══ */}
        <div className={`flex flex-col flex-1 min-w-0 rounded-r-xl ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
          {selected ? (
            <InvoiceRIDE invoice={selected} zoom={zoom} setZoom={setZoom} onPrint={handlePrint} activeView={activeView} setActiveView={setActiveView} />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className={`w-16 h-16 mx-auto mb-4 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                <p className={`text-sm font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Selecciona una factura para ver los detalles
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Anulación */}
      <CancelPurchaseInvoiceModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSave={handleCancelInvoice}
        isLight={isLight}
      />

      {/* Modal de Creación */}
      <CreatePurchaseInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveInvoice}
        isLight={isLight}
      />
    </div>
  );
}