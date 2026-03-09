import { useState } from "react";
import {
  Search, Plus, Download, Printer, CheckCircle, Clock,
  AlertCircle, X, FileText, Eye, Edit, Copy, Send,
  Calendar, DollarSign, Package, User as UserIcon, Mail, Check,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface QuoteItem {
  code: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface Quote {
  id: string;
  quoteNumber: string;
  date: string;
  validUntil: string;
  customer: {
    name: string;
    ruc: string;
    address?: string;
    email?: string;
    phone?: string;
    contact?: string;
  };
  items: QuoteItem[];
  subtotal: number;
  totalDiscount: number;
  subtotal12: number;
  subtotal0: number;
  tax: number;
  total: number;
  status: "pending" | "sent" | "approved" | "rejected" | "expired" | "converted";
  seller: string;
  branch: string;
  notes?: string;
  paymentTerms?: string;
  deliveryTime?: string;
}

/* ══════════════════════════════════════════════════════════════════════
   DATOS MOCK
══════════════════════════════════════════════════════════════════════ */
const EMPRESA = {
  razon: "TicSoftEc S.A.",
  ruc: "1790123456001",
  dir: "Av. Amazonas N35-17 y Japón, Quito - Ecuador",
  tel: "02-2345-678",
  email: "ventas@ticsoftec.com",
};

const QUOTES_INIT: Quote[] = [
  {
    id: "1",
    quoteNumber: "COT-2026-001234",
    date: "2026-03-09",
    validUntil: "2026-03-19",
    customer: {
      name: "Corporación Favorita C.A.",
      ruc: "1790016919001",
      address: "Av. General Enríquez km 4.5, Sangolquí",
      email: "compras@favorita.com",
      phone: "02-3456789",
      contact: "Ing. María Rodríguez"
    },
    items: [
      { code: "PROD001", name: "Laptop Dell Inspiron 15", description: "Intel Core i7, 16GB RAM, SSD 512GB", quantity: 5, price: 850.00, discount: 42.50, tax: 12, total: 4207.50 },
      { code: "PROD002", name: "Mouse Logitech MX Master 3", description: "Inalámbrico, recargable", quantity: 5, price: 45.00, discount: 0, tax: 12, total: 225.00 },
      { code: "SERV001", name: "Instalación y configuración", description: "Servicio técnico especializado", quantity: 1, price: 120.00, discount: 0, tax: 12, total: 120.00 },
    ],
    subtotal: 4552.50,
    totalDiscount: 42.50,
    subtotal12: 4552.50,
    subtotal0: 0,
    tax: 546.30,
    total: 5098.80,
    status: "pending",
    seller: "Juan Pérez",
    branch: "Sucursal Centro",
    notes: "Precios incluyen garantía de 1 año. Tiempo de entrega: 5 días hábiles.",
    paymentTerms: "50% anticipo, 50% contra entrega",
    deliveryTime: "5 días hábiles",
  },
  {
    id: "2",
    quoteNumber: "COT-2026-001235",
    date: "2026-03-08",
    validUntil: "2026-03-15",
    customer: {
      name: "Importadora del Pacífico Cía. Ltda.",
      ruc: "1712345678001",
      address: "Av. de las Américas y José Mascote, Guayaquil",
      email: "logistica@importadorapacifico.com",
      phone: "04-2567890",
      contact: "Sr. Carlos Mendoza"
    },
    items: [
      { code: "PROD010", name: "Monitor Samsung 27\" 4K", description: "Resolución 3840x2160, HDR10", quantity: 10, price: 320.00, discount: 160.00, tax: 12, total: 3040.00 },
      { code: "PROD011", name: "Teclado mecánico RGB", description: "Switches Cherry MX Red", quantity: 10, price: 85.00, discount: 0, tax: 12, total: 850.00 },
    ],
    subtotal: 3890.00,
    totalDiscount: 160.00,
    subtotal12: 3890.00,
    subtotal0: 0,
    tax: 466.80,
    total: 4356.80,
    status: "sent",
    seller: "Ana Torres",
    branch: "Sucursal Norte",
    notes: "Descuento por volumen aplicado. Incluye cable HDMI de cortesía.",
    paymentTerms: "30 días crédito",
    deliveryTime: "3 días hábiles",
  },
  {
    id: "5",
    quoteNumber: "COT-2026-001238",
    date: "2026-03-07",
    validUntil: "2026-03-17",
    customer: {
      name: "Distribuidora Nacional S.A.",
      ruc: "1790987654001",
      address: "Av. Francisco de Orellana, Guayaquil",
      email: "compras@distnacional.com",
      phone: "04-2998877",
      contact: "Lcda. Patricia Gómez"
    },
    items: [
      { code: "PROD050", name: "Disco Duro Externo 2TB", quantity: 20, price: 75.00, discount: 150.00, tax: 12, total: 1350.00 },
    ],
    subtotal: 1350.00,
    totalDiscount: 150.00,
    subtotal12: 1350.00,
    subtotal0: 0,
    tax: 162.00,
    total: 1512.00,
    status: "approved",
    seller: "Luis Morales",
    branch: "Sucursal Sur",
    paymentTerms: "Contado contra entrega",
    deliveryTime: "24 horas",
  },
  {
    id: "3",
    quoteNumber: "COT-2026-001236",
    date: "2026-03-01",
    validUntil: "2026-03-08",
    customer: {
      name: "Tecnología Avanzada S.A.",
      ruc: "0991234567001",
      address: "Av. 6 de Diciembre N34-120, Quito",
      email: "ventas@tecnoavanzada.com",
      phone: "02-2445566",
      contact: "Lic. Pedro Salazar"
    },
    items: [
      { code: "PROD020", name: "Impresora HP LaserJet Pro", quantity: 2, price: 450.00, discount: 0, tax: 12, total: 900.00 },
    ],
    subtotal: 900.00,
    totalDiscount: 0,
    subtotal12: 900.00,
    subtotal0: 0,
    tax: 108.00,
    total: 1008.00,
    status: "expired",
    seller: "María González",
    branch: "Sucursal Centro",
    paymentTerms: "Contado",
    deliveryTime: "2 días hábiles",
  },
  {
    id: "4",
    quoteNumber: "COT-2026-001237",
    date: "2026-03-07",
    validUntil: "2026-03-14",
    customer: {
      name: "Soluciones Empresariales del Ecuador",
      ruc: "1790234567001",
      address: "Av. República del Salvador N36-84, Quito",
      email: "adquisiciones@solempec.com",
      phone: "02-3334455",
      contact: "Ing. Laura Vásquez"
    },
    items: [
      { code: "PROD030", name: "Tablet Samsung Galaxy Tab S8", quantity: 15, price: 680.00, discount: 1020.00, tax: 12, total: 9180.00 },
      { code: "ACC001", name: "Funda protectora premium", quantity: 15, price: 25.00, discount: 0, tax: 12, total: 375.00 },
    ],
    subtotal: 9555.00,
    totalDiscount: 1020.00,
    subtotal12: 9555.00,
    subtotal0: 0,
    tax: 1146.60,
    total: 10701.60,
    status: "converted",
    seller: "Carlos Ramírez",
    branch: "Sucursal Norte",
    notes: "Cotización convertida a factura 001-001-000125",
    paymentTerms: "15 días crédito",
    deliveryTime: "7 días hábiles",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE VISOR DE COTIZACIÓN
══════════════════════════════════════════════════════════════════════ */
function QuoteViewer({ quote, onClose, isLight }: {
  quote: Quote;
  onClose: () => void;
  isLight: boolean;
}) {
  const fmt = (v: number) => `$${v.toFixed(2)}`;
  
  const getStatusInfo = (status: Quote["status"]) => {
    switch (status) {
      case "pending":
        return { color: "#f59e0b", bg: "#fef3c7", label: "Pendiente" };
      case "sent":
        return { color: "#3b82f6", bg: "#dbeafe", label: "Enviada" };
      case "approved":
        return { color: "#10b981", bg: "#d1fae5", label: "Aprobada" };
      case "rejected":
        return { color: "#ef4444", bg: "#fee2e2", label: "Rechazada" };
      case "expired":
        return { color: "#6b7280", bg: "#f3f4f6", label: "Expirada" };
      case "converted":
        return { color: "#3b82f6", bg: "#dbeafe", label: "Convertida" };
      default:
        return { color: "#6b7280", bg: "#f3f4f6", label: "Desconocido" };
    }
  };

  const statusInfo = getStatusInfo(quote.status);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-auto rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0c1520] border-white/10"}`}>
          <h2 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
            Cotización {quote.quoteNumber}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.success("Imprimiendo cotización...")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-200 text-gray-600" : "hover:bg-white/10 text-gray-400"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Info empresa y cliente */}
          <div className="grid grid-cols-2 gap-6">
            {/* Emisor */}
            <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <h3 className={`text-xs font-bold uppercase mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Emisor</h3>
              <p className={`font-bold text-sm mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>{EMPRESA.razon}</p>
              <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>RUC: {EMPRESA.ruc}</p>
              <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>{EMPRESA.dir}</p>
              <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>{EMPRESA.tel} | {EMPRESA.email}</p>
            </div>

            {/* Cliente */}
            <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <h3 className={`text-xs font-bold uppercase mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Cliente</h3>
              <p className={`font-bold text-sm mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>{quote.customer.name}</p>
              <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>RUC: {quote.customer.ruc}</p>
              <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>{quote.customer.address}</p>
              {quote.customer.contact && (
                <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Contacto: {quote.customer.contact}</p>
              )}
            </div>
          </div>

          {/* Detalles de la cotización */}
          <div className={`grid grid-cols-3 gap-4 p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
            <div>
              <p className={`text-xs font-semibold mb-1 ${isLight ? "text-blue-700" : "text-blue-400"}`}>Fecha de Emisión</p>
              <p className={`text-sm font-mono ${isLight ? "text-blue-900" : "text-blue-300"}`}>{quote.date}</p>
            </div>
            <div>
              <p className={`text-xs font-semibold mb-1 ${isLight ? "text-blue-700" : "text-blue-400"}`}>Válida Hasta</p>
              <p className={`text-sm font-mono ${isLight ? "text-blue-900" : "text-blue-300"}`}>{quote.validUntil}</p>
            </div>
            <div>
              <p className={`text-xs font-semibold mb-1 ${isLight ? "text-blue-700" : "text-blue-400"}`}>Estado</p>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* Tabla de items */}
          <div className={`rounded-lg border overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <div className={`px-4 py-2 text-xs font-bold uppercase ${isLight ? "bg-[#0D1B2A] text-white" : "bg-[#0d1724] text-white"}`}>
              Detalle de Productos/Servicios
            </div>
            <table className="w-full">
              <thead className={isLight ? "bg-gray-50" : "bg-white/5"}>
                <tr className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  <th className="px-3 py-2 text-left font-semibold">Código</th>
                  <th className="px-3 py-2 text-left font-semibold">Descripción</th>
                  <th className="px-3 py-2 text-right font-semibold">Cant.</th>
                  <th className="px-3 py-2 text-right font-semibold">P. Unit.</th>
                  <th className="px-3 py-2 text-right font-semibold">Desc.</th>
                  <th className="px-3 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, i) => (
                  <tr key={i} className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <td className={`px-3 py-2 text-xs font-mono font-bold text-primary`}>{item.code}</td>
                    <td className={`px-3 py-2 text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                      <div className="font-semibold">{item.name}</div>
                      {item.description && (
                        <div className={`text-[10px] ${isLight ? "text-gray-500" : "text-gray-400"}`}>{item.description}</div>
                      )}
                    </td>
                    <td className={`px-3 py-2 text-xs text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>{item.quantity}</td>
                    <td className={`px-3 py-2 text-xs text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>{fmt(item.price)}</td>
                    <td className={`px-3 py-2 text-xs text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>{fmt(item.discount)}</td>
                    <td className={`px-3 py-2 text-xs text-right font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{fmt(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="flex justify-end">
            <div className={`w-80 rounded-lg border overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className={`flex justify-between px-4 py-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Subtotal:</span>
                <span className={`text-sm font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{fmt(quote.subtotal)}</span>
              </div>
              <div className={`flex justify-between px-4 py-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Descuento:</span>
                <span className={`text-sm font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>-{fmt(quote.totalDiscount)}</span>
              </div>
              <div className={`flex justify-between px-4 py-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>IVA 12%:</span>
                <span className={`text-sm font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{fmt(quote.tax)}</span>
              </div>
              <div className="flex justify-between px-4 py-3 bg-primary">
                <span className="text-sm font-bold text-white">TOTAL:</span>
                <span className="text-lg font-mono font-bold text-white">{fmt(quote.total)}</span>
              </div>
            </div>
          </div>

          {/* Términos y condiciones */}
          {(quote.paymentTerms || quote.deliveryTime || quote.notes) && (
            <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <h3 className={`text-xs font-bold uppercase mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Términos y Condiciones</h3>
              <div className="space-y-2">
                {quote.paymentTerms && (
                  <div>
                    <span className={`text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>Forma de Pago: </span>
                    <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>{quote.paymentTerms}</span>
                  </div>
                )}
                {quote.deliveryTime && (
                  <div>
                    <span className={`text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>Tiempo de Entrega: </span>
                    <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>{quote.deliveryTime}</span>
                  </div>
                )}
                {quote.notes && (
                  <div>
                    <span className={`text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>Observaciones: </span>
                    <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>{quote.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pie de página */}
          <div className={`text-center text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
            <p>Vendedor: {quote.seller} | {quote.branch}</p>
            <p className="mt-1">Esta cotización tiene una validez de 10 días desde la fecha de emisión</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MODAL NUEVA COTIZACIÓN
═════════════════════════════════════════════════════════════════════ */
function NewQuoteModal({ onClose, onSave, isLight }: {
  onClose: () => void;
  onSave: (quote: Quote) => void;
  isLight: boolean;
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerRUC, setCustomerRUC] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [validDays, setValidDays] = useState("10");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    if (!customerName || !customerRUC) {
      toast.error("Complete los datos del cliente");
      return;
    }

    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(validUntil.getDate() + parseInt(validDays));

    const newQuote: Quote = {
      id: String(Date.now()),
      quoteNumber: `COT-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
      date: today.toISOString().split("T")[0],
      validUntil: validUntil.toISOString().split("T")[0],
      customer: {
        name: customerName,
        ruc: customerRUC,
        email: customerEmail,
      },
      items: [],
      subtotal: 0,
      totalDiscount: 0,
      subtotal12: 0,
      subtotal0: 0,
      tax: 0,
      total: 0,
      status: "pending",
      seller: "Usuario Actual",
      branch: "Sucursal Centro",
      notes,
      paymentTerms,
      deliveryTime: "Por definir",
    };

    onSave(newQuote);
    toast.success(`Cotización ${newQuote.quoteNumber} creada exitosamente`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0c1520] border-white/10"}`}>
          <h2 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
            Nueva Cotización
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-200 text-gray-600" : "hover:bg-white/10 text-gray-400"}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                Cliente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Nombre del cliente"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                RUC/Cédula <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerRUC}
                onChange={e => setCustomerRUC(e.target.value)}
                placeholder="1234567890001"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                Email del Cliente
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="cliente@ejemplo.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                Validez (días)
              </label>
              <input
                type="number"
                value={validDays}
                onChange={e => setValidDays(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
              Forma de Pago
            </label>
            <input
              type="text"
              value={paymentTerms}
              onChange={e => setPaymentTerms(e.target.value)}
              placeholder="Ej: 30 días crédito, 50% anticipo"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
              Observaciones
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notas adicionales sobre la cotización..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}
            />
          </div>

          <div className={`p-3 rounded-lg ${isLight ? "bg-blue-50 border border-blue-200" : "bg-blue-500/10 border border-blue-500/20"}`}>
            <p className={`text-xs ${isLight ? "text-blue-700" : "text-blue-400"}`}>
              <strong>Nota:</strong> Después de crear la cotización, podrás agregar productos y servicios desde la pantalla de edición.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0c1520] border-white/10"}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-white/10 hover:bg-white/20 text-gray-300"}`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Crear Cotización
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function SalesQuotesContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados
  const [quotes, setQuotes] = useState<Quote[]>(QUOTES_INIT);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showNewQuoteModal, setShowNewQuoteModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  // Variables de tema
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-600" : "text-gray-400";

  // Filtrar cotizaciones
  const filtered = quotes.filter((quote) => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(search.toLowerCase()) ||
      quote.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      quote.customer.ruc.includes(search);

    const matchesStatus = activeTab === "all" || quote.status === activeTab;
    
    let matchesFecha = true;
    if (fechaDesde && quote.date < fechaDesde) matchesFecha = false;
    if (fechaHasta && quote.date > fechaHasta) matchesFecha = false;

    return matchesSearch && matchesStatus && matchesFecha;
  });

  const fmt = (num: number) => `$${num.toFixed(2)}`;

  // Contadores por estado
  const counts = {
    pending: quotes.filter(q => q.status === "pending").length,
    sent: quotes.filter(q => q.status === "sent").length,
    approved: quotes.filter(q => q.status === "approved").length,
    rejected: quotes.filter(q => q.status === "rejected").length,
    expired: quotes.filter(q => q.status === "expired").length,
    converted: quotes.filter(q => q.status === "converted").length,
  };

  // Funciones de selección
  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(q => q.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // Función para obtener badge de estado
  const getStatusBadge = (status: Quote["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-400"}`}>
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case "sent":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-400"}`}>
            <Send className="w-3 h-3" />
            Enviada
          </span>
        );
      case "approved":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"}`}>
            <CheckCircle className="w-3 h-3" />
            Aprobada
          </span>
        );
      case "rejected":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400"}`}>
            <AlertCircle className="w-3 h-3" />
            Rechazada
          </span>
        );
      case "expired":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-gray-100 text-gray-700" : "bg-gray-500/20 text-gray-400"}`}>
            <Calendar className="w-3 h-3" />
            Expirada
          </span>
        );
      case "converted":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-400"}`}>
            <CheckCircle className="w-3 h-3" />
            Convertida
          </span>
        );
    }
  };

  // Funciones de acciones masivas
  const handleSendSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos una cotización");
      return;
    }
    const selectedQuotes = quotes.filter(q => selectedIds.has(q.id));
    const emails = selectedQuotes.filter(q => q.customer.email).map(q => q.customer.email);
    
    if (emails.length === 0) {
      toast.error("Ninguna cotización seleccionada tiene email del cliente");
      return;
    }

    // Cambia de "pending" a "sent"
    setQuotes(quotes.map(q => 
      selectedIds.has(q.id) && q.status === "pending"
        ? { ...q, status: "sent" as const }
        : q
    ));

    toast.success(`${selectedIds.size} cotización(es) enviada(s) por email`);
    setSelectedIds(new Set());
  };

  const handleApproveSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos una cotización");
      return;
    }

    // Cambia de "sent" a "approved"
    setQuotes(quotes.map(q => 
      selectedIds.has(q.id) && q.status === "sent"
        ? { ...q, status: "approved" as const }
        : q
    ));
    
    toast.success(`${selectedIds.size} cotización(es) aprobada(s) manualmente`);
    setSelectedIds(new Set());
  };

  const handleRejectSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos una cotización");
      return;
    }

    // Cambia de "sent" a "rejected"
    setQuotes(quotes.map(q => 
      selectedIds.has(q.id) && q.status === "sent"
        ? { ...q, status: "rejected" as const }
        : q
    ));
    
    toast.success(`${selectedIds.size} cotización(es) rechazada(s)`);
    setSelectedIds(new Set());
  };

  const handleConvertToInvoice = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos una cotización");
      return;
    }
    toast.success(`${selectedIds.size} cotización(es) convertida(s) a factura`);
    setQuotes(quotes.map(q => 
      selectedIds.has(q.id) && q.status === "approved"
        ? { ...q, status: "converted" as const }
        : q
    ));
    setSelectedIds(new Set());
  };

  const handleRenewSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos una cotización");
      return;
    }
    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(validUntil.getDate() + 10);
    
    setQuotes(quotes.map(q => 
      selectedIds.has(q.id) && q.status === "expired"
        ? { 
            ...q, 
            status: "pending" as const,
            date: today.toISOString().split("T")[0],
            validUntil: validUntil.toISOString().split("T")[0]
          }
        : q
    ));
    toast.success(`${selectedIds.size} cotización(es) renovada(s)`);
    setSelectedIds(new Set());
  };

  /* ════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <div className="flex flex-col gap-4">
        {/* ── TABS de Estados ── */}
        <div className={`flex items-center gap-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <button
            onClick={() => {setActiveTab("pending"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "pending"
                ? isLight
                  ? "text-yellow-700"
                  : "text-yellow-400"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pendientes
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.pending}
              </span>
            </div>
            {activeTab === "pending" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("sent"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "sent"
                ? isLight
                  ? "text-blue-700"
                  : "text-blue-400"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Enviadas
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "sent"
                  ? "bg-blue-100 text-blue-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.sent}
              </span>
            </div>
            {activeTab === "sent" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("approved"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "approved"
                ? isLight
                  ? "text-green-700"
                  : "text-green-400"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Aprobadas
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "approved"
                  ? "bg-green-100 text-green-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.approved}
              </span>
            </div>
            {activeTab === "approved" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("rejected"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "rejected"
                ? isLight
                  ? "text-red-700"
                  : "text-red-400"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Rechazadas
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "rejected"
                  ? "bg-red-100 text-red-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.rejected}
              </span>
            </div>
            {activeTab === "rejected" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("expired"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "expired"
                ? isLight
                  ? "text-gray-700"
                  : "text-gray-300"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Expiradas
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "expired"
                  ? "bg-gray-200 text-gray-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.expired}
              </span>
            </div>
            {activeTab === "expired" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("converted"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "converted"
                ? isLight
                  ? "text-blue-700"
                  : "text-blue-400"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Convertidas
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "converted"
                  ? "bg-blue-100 text-blue-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.converted}
              </span>
            </div>
            {activeTab === "converted" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
        </div>

        {/* ─ Barra de acciones específicas por tab ── */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Filtros de búsqueda y fechas */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 min-w-[250px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Buscar número, cliente, RUC..." 
                className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400 ${isLight ? "text-gray-900" : "text-white"}`} 
              />
            </div>
            
            {/* Filtro fechas */}
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/10"}`}>
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={fechaDesde}
                onChange={e => setFechaDesde(e.target.value)}
                className={`bg-transparent text-sm focus:outline-none ${isLight ? "text-gray-700" : "text-gray-300"}`}
              />
            </div>
            <span className="text-gray-400">—</span>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/10"}`}>
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={fechaHasta}
                onChange={e => setFechaHasta(e.target.value)}
                className={`bg-transparent text-sm focus:outline-none ${isLight ? "text-gray-700" : "text-gray-300"}`}
              />
            </div>
          </div>

          {/* Botones de acción específicos según el tab activo */}
          <div className="flex flex-wrap items-center gap-2">
            {/* BOTONES PARA TAB PENDIENTE */}
            {activeTab === "pending" && (
              <button
                onClick={handleSendSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" /> Enviar
              </button>
            )}

            {/* BOTONES PARA TAB ENVIADA */}
            {activeTab === "sent" && (
              <>
                <button
                  onClick={handleApproveSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Aprobar
                </button>
                <button
                  onClick={handleRejectSelected}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <AlertCircle className="w-4 h-4" /> Rechazar
                </button>
              </>
            )}

            {/* BOTONES PARA TAB APROBADA */}
            {activeTab === "approved" && (
              <button
                onClick={handleConvertToInvoice}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FileText className="w-4 h-4" /> Convertir a Factura
              </button>
            )}

            {/* BOTONES PARA TAB EXPIRADA */}
            {activeTab === "expired" && (
              <button
                onClick={handleRenewSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Clock className="w-4 h-4" /> Renovar
              </button>
            )}

            {/* Botón Nueva Cotización - SIEMPRE VISIBLE */}
            <button
              onClick={() => setShowNewQuoteModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Nueva Cotización
            </button>

            {/* Botones comunes */}
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Download className="w-4 h-4" /> CSV
            </button>
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
              <Printer className="w-4 h-4" /> Imprimir
            </button>
          </div>
        </div>

        {/* ── Banner informativo ── */}
        <div className={`flex items-start gap-2 p-2.5 rounded-lg ${isLight ? "bg-blue-50 border border-blue-200" : "bg-blue-500/10 border border-blue-500/20"}`}>
          <FileText className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isLight ? "text-blue-600" : "text-blue-400"}`} />
          <div>
            <p className={`text-sm font-semibold ${isLight ? "text-blue-900" : "text-blue-300"}`}>
              {activeTab === "pending" && "Cotizaciones Pendientes"}
              {activeTab === "sent" && "Cotizaciones Enviadas"}
              {activeTab === "approved" && "Cotizaciones Aprobadas"}
              {activeTab === "rejected" && "Cotizaciones Rechazadas"}
              {activeTab === "expired" && "Cotizaciones Expiradas"}
              {activeTab === "converted" && "Cotizaciones Convertidas"}
            </p>
            <p className={`text-xs mt-0.5 ${isLight ? "text-blue-700" : "text-blue-400"}`}>
              {activeTab === "pending" && "Estas cotizaciones están creadas pero aún no han sido enviadas al cliente. Usa el botón 'Enviar' para enviarlas por email."}
              {activeTab === "sent" && "Estas cotizaciones ya fueron enviadas al cliente y están esperando respuesta. Puedes aprobarlas o rechazarlas manualmente según la respuesta del cliente."}
              {activeTab === "approved" && "Estas cotizaciones han sido aprobadas por el cliente. Están listas para convertirse en facturas."}
              {activeTab === "rejected" && "Estas cotizaciones fueron rechazadas por el cliente."}
              {activeTab === "expired" && "Estas cotizaciones expiraron sin respuesta del cliente. Puedes renovarlas para extender su validez."}
              {activeTab === "converted" && "Estas cotizaciones ya fueron convertidas a facturas de venta."}
            </p>
          </div>
        </div>

        {/* ── Tabla ── */}
        <div className={`rounded-lg border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className={`text-xs font-semibold uppercase tracking-wider border-b ${isLight ? "bg-gray-100 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"}`}>
                  {/* Checkbox - Solo en tabs con acciones masivas */}
                  {(activeTab === "pending" || activeTab === "sent" || activeTab === "approved" || activeTab === "expired") && (
                    <th className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="px-3 py-2 text-left whitespace-nowrap">N° Cotización</th>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Válida Hasta</th>
                  <th className="px-3 py-2 text-left">Cliente</th>
                  <th className="px-3 py-2 text-left">RUC</th>
                  <th className="px-3 py-2 text-right whitespace-nowrap">Total</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((quote, index) => (
                    <tr
                      key={quote.id}
                      className={`border-t transition-colors relative ${
                        isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/5"
                      }`}
                    >
                      {/* Checkbox - Solo en tabs con acciones masivas */}
                      {(activeTab === "pending" || activeTab === "sent" || activeTab === "approved" || activeTab === "expired") && (
                        <td className="px-3 py-1.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(quote.id)}
                            onChange={() => toggleSelect(quote.id)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </td>
                      )}
                      
                      {/* N° Cotización con barra naranja */}
                      <td className="px-3 py-1.5 relative">
                        {index === 0 && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                        )}
                        <div className={`font-mono font-semibold text-xs ${txt}`}>{quote.quoteNumber}</div>
                      </td>
                      
                      <td className={`px-3 py-1.5 text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>{quote.date}</td>
                      <td className={`px-3 py-1.5 text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>{quote.validUntil}</td>
                      
                      {/* Cliente */}
                      <td className="px-3 py-1.5">
                        <div className={`font-medium text-xs ${txt}`}>{quote.customer.name}</div>
                        {quote.customer.email && (
                          <div className={`text-[10px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>{quote.customer.email}</div>
                        )}
                      </td>
                      
                      <td className={`px-3 py-1.5 text-xs font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>{quote.customer.ruc}</td>
                      
                      <td className={`px-3 py-1.5 text-right font-mono font-semibold text-xs ${txt}`}>
                        {fmt(quote.total)}
                      </td>
                      
                      <td className="px-3 py-1.5 text-center">
                        {getStatusBadge(quote.status)}
                      </td>
                      
                      <td className="px-3 py-1.5">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedQuote(quote)}
                            className={`p-1 rounded transition-colors ${isLight ? "hover:bg-gray-200 text-gray-600" : "hover:bg-white/10 text-gray-400"}`}
                            title="Ver detalle"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className={`p-1 rounded transition-colors ${isLight ? "hover:bg-gray-200 text-gray-600" : "hover:bg-white/10 text-gray-400"}`}
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className={`p-1 rounded transition-colors ${isLight ? "hover:bg-gray-200 text-gray-600" : "hover:bg-white/10 text-gray-400"}`}
                            title="Duplicar"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={(activeTab === "pending" || activeTab === "sent" || activeTab === "approved" || activeTab === "expired") ? 9 : 8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className={`w-12 h-12 ${sub}`} />
                        <p className={`text-sm ${sub}`}>No se encontraron cotizaciones</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal visor */}
      {selectedQuote && (
        <QuoteViewer
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          isLight={isLight}
        />
      )}

      {/* Modal nueva cotización */}
      {showNewQuoteModal && (
        <NewQuoteModal
          onClose={() => setShowNewQuoteModal(false)}
          onSave={(quote) => setQuotes([...quotes, quote])}
          isLight={isLight}
        />
      )}
    </>
  );
}