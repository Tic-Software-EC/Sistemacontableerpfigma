import { useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Eye,
  Printer,
  XCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Banknote,
  Download,
  RefreshCcw,
  TrendingUp,
  ShoppingBag,
  Calculator,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { ArqueoModal } from "../components/arqueo-modal";
import { useTheme } from "../contexts/theme-context";

interface SaleItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Sale {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  customer: {
    name: string;
    ruc: string;
  };
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer" | "mixed" | "credit";
  status: "completed" | "cancelled" | "pending";
  cashier: string;
  branch: string;
}

// Datos mock de ventas
const MOCK_SALES: Sale[] = [
  {
    id: "1",
    invoiceNumber: "001-001-000123",
    date: "2026-02-19",
    time: "14:32",
    customer: {
      name: "María González López",
      ruc: "1234567890",
    },
    items: [
      { code: "PROD001", name: "Laptop HP 15-dy", quantity: 1, price: 850.00, total: 850.00 },
      { code: "PROD002", name: "Mouse Logitech MX", quantity: 2, price: 45.00, total: 90.00 },
    ],
    subtotal: 940.00,
    tax: 112.80,
    discount: 0,
    total: 1052.80,
    paymentMethod: "credit",
    status: "completed",
    cashier: "Juan Pérez",
    branch: "Sucursal Centro",
  },
  {
    id: "2",
    invoiceNumber: "001-001-000122",
    date: "2026-02-19",
    time: "13:15",
    customer: {
      name: "Carlos Ramírez Sánchez",
      ruc: "0987654321",
    },
    items: [
      { code: "PROD010", name: "Monitor Samsung 24\"", quantity: 1, price: 320.00, total: 320.00 },
      { code: "PROD011", name: "Teclado Mecánico", quantity: 1, price: 85.00, total: 85.00 },
    ],
    subtotal: 405.00,
    tax: 48.60,
    discount: 20.25,
    total: 433.35,
    paymentMethod: "credit",
    status: "completed",
    cashier: "Juan Pérez",
    branch: "Sucursal Centro",
  },
  {
    id: "3",
    invoiceNumber: "001-001-000121",
    date: "2026-02-19",
    time: "11:45",
    customer: {
      name: "Consumidor Final",
      ruc: "9999999999999",
    },
    items: [
      { code: "PROD005", name: "Cable USB-C", quantity: 3, price: 12.00, total: 36.00 },
      { code: "PROD006", name: "Adaptador HDMI", quantity: 1, price: 18.00, total: 18.00 },
    ],
    subtotal: 54.00,
    tax: 6.48,
    discount: 0,
    total: 60.48,
    paymentMethod: "cash",
    status: "completed",
    cashier: "Juan Pérez",
    branch: "Sucursal Centro",
  },
  {
    id: "4",
    invoiceNumber: "001-001-000120",
    date: "2026-02-18",
    time: "16:20",
    customer: {
      name: "Distribuidora El Éxito CIA. LTDA.",
      ruc: "1726384950001",
    },
    items: [
      { code: "PROD015", name: "Impresora Epson L3250", quantity: 2, price: 450.00, total: 900.00 },
      { code: "PROD016", name: "Resma Papel A4", quantity: 10, price: 4.50, total: 45.00 },
    ],
    subtotal: 945.00,
    tax: 113.40,
    discount: 47.25,
    total: 1011.15,
    paymentMethod: "credit",
    status: "completed",
    cashier: "Juan Pérez",
    branch: "Sucursal Centro",
  },
  {
    id: "5",
    invoiceNumber: "001-001-000119",
    date: "2026-02-18",
    time: "10:30",
    customer: {
      name: "Ana Martínez",
      ruc: "1756473829",
    },
    items: [
      { code: "PROD020", name: "Audífonos Sony WH-1000", quantity: 1, price: 280.00, total: 280.00 },
    ],
    subtotal: 280.00,
    tax: 33.60,
    discount: 0,
    total: 313.60,
    paymentMethod: "card",
    status: "cancelled",
    cashier: "Juan Pérez",
    branch: "Sucursal Centro",
  },
  {
    id: "6",
    invoiceNumber: "001-001-000118",
    date: "2026-02-18",
    time: "09:15",
    customer: {
      name: "Comercial Andina S.A.",
      ruc: "1792345678001",
    },
    items: [
      { code: "PROD025", name: "Router TP-Link AC1200", quantity: 5, price: 65.00, total: 325.00 },
      { code: "PROD026", name: "Switch 8 puertos Gigabit", quantity: 3, price: 120.00, total: 360.00 },
      { code: "PROD027", name: "Cable UTP Cat6 305m", quantity: 2, price: 180.00, total: 360.00 },
    ],
    subtotal: 1045.00,
    tax: 125.40,
    discount: 52.25,
    total: 1118.15,
    paymentMethod: "credit",
    status: "completed",
    cashier: "Juan Pérez",
    branch: "Sucursal Centro",
  },
];

export function SalesHistory() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const rootBg = isLight ? "bg-gray-50" : "bg-gradient-to-br from-[#0D1B2A] via-[#1a2332] to-[#0D1B2A]";
  const txt    = isLight ? "text-gray-900" : "text-white";
  const sub    = isLight ? "text-gray-500" : "text-gray-400";
  const card   = isLight ? "bg-white border border-gray-200 shadow-sm" : "bg-white/5 border border-white/10";
  const secBg  = isLight ? "bg-gray-100 border border-gray-200" : "bg-white/5 border border-white/10";
  const inp    = isLight ? "bg-white border border-gray-300 text-gray-900 focus:border-primary" : "bg-white/5 border border-white/10 text-white focus:border-primary";
  const divider= isLight ? "border-gray-200" : "border-white/10";

  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("today");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showArqueoModal, setShowArqueoModal] = useState(false);

  // Estados para arqueo de caja
  const [montoInicial] = useState(500.00); // Monto inicial de caja
  const [gastos] = useState(45.50); // Gastos de caja
  const [montoReal, setMontoReal] = useState(0);
  const [billetes, setBilletes] = useState({
    b100: 0,
    b50: 0,
    b20: 0,
    b10: 0,
    b5: 0,
    b1: 0,
  });
  const [monedas, setMonedas] = useState({
    m1: 0,
    m050: 0,
    m025: 0,
    m010: 0,
    m005: 0,
    m001: 0,
  });

  // Calcular totales
  const completedSales = sales.filter(s => s.status === "completed");
  const totalSales = completedSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = completedSales.length;

  // Filtrar ventas
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.ruc.includes(searchTerm);

    const matchesStatus = filterStatus === "all" || sale.status === filterStatus;
    const matchesPayment = filterPayment === "all" || sale.paymentMethod === filterPayment;
    
    let matchesDate = true;
    if (filterDate === "today") {
      matchesDate = sale.date === "2026-02-19";
    } else if (filterDate === "yesterday") {
      matchesDate = sale.date === "2026-02-18";
    }

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const getStatusBadge = (status: Sale["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-green-400 text-[10px] font-medium">
            <CheckCircle className="w-3 h-3" />
            Completada
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-[10px] font-medium">
            <XCircle className="w-3 h-3" />
            Anulada
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
    }
  };

  const getPaymentIcon = (method: Sale["paymentMethod"]) => {
    switch (method) {
      case "cash":
        return <Banknote className="w-4 h-4 text-green-400" />;
      case "card":
        return <CreditCard className="w-4 h-4 text-blue-400" />;
      case "transfer":
        return <RefreshCcw className="w-4 h-4 text-purple-400" />;
      case "mixed":
        return <DollarSign className="w-4 h-4 text-orange-400" />;
      case "credit":
        return <CreditCard className="w-4 h-4 text-red-400" />;
    }
  };

  const getPaymentLabel = (method: Sale["paymentMethod"]) => {
    switch (method) {
      case "cash":
        return "Efectivo";
      case "card":
        return "Tarjeta";
      case "transfer":
        return "Transferencia";
      case "mixed":
        return "Mixto";
      case "credit":
        return "Crédito";
    }
  };

  // Calcular totales del arqueo
  const totalBilletes = 
    billetes.b100 * 100 +
    billetes.b50 * 50 +
    billetes.b20 * 20 +
    billetes.b10 * 10 +
    billetes.b5 * 5 +
    billetes.b1 * 1;

  const totalMonedas =
    monedas.m1 * 1 +
    monedas.m050 * 0.50 +
    monedas.m025 * 0.25 +
    monedas.m010 * 0.10 +
    monedas.m005 * 0.05 +
    monedas.m001 * 0.01;

  const totalContado = totalBilletes + totalMonedas;

  // Calcular ventas por método de pago
  const ventasEfectivo = completedSales
    .filter(s => s.paymentMethod === "cash")
    .reduce((sum, sale) => sum + sale.total, 0);
  
  const ventasTarjeta = completedSales
    .filter(s => s.paymentMethod === "card")
    .reduce((sum, sale) => sum + sale.total, 0);

  const ventasTransferencia = completedSales
    .filter(s => s.paymentMethod === "transfer")
    .reduce((sum, sale) => sum + sale.total, 0);

  const saldoEsperado = montoInicial + ventasEfectivo - gastos;
  const diferencia = totalContado - saldoEsperado;

  return (
    <div className={`h-full ${rootBg} overflow-auto`}>
      <div className="p-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Título principal */}
          <div className="mb-6">
            <p className={`text-sm ${sub}`}>
              Consulta y gestiona el historial completo de transacciones
            </p>
          </div>

          {/* Filtros y búsqueda */}
          <div className={`${card} rounded-xl p-4 mb-4`}>
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por factura, cliente o RUC..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm placeholder-gray-500 focus:outline-none transition-all ${inp}`}
                />
              </div>
              {/* Filtro de fecha */}
              <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className={`px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}>
                <option value="all">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
              </select>
              {/* Filtro de estado */}
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}>
                <option value="all">Todos los estados</option>
                <option value="completed">Completadas</option>
                <option value="cancelled">Anuladas</option>
                <option value="pending">Pendientes</option>
              </select>
              {/* Filtro de método de pago */}
              <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className={`px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}>
                <option value="all">Todos los pagos</option>
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
                <option value="mixed">Mixto</option>
                <option value="credit">Crédito</option>
              </select>
              <button onClick={() => setShowArqueoModal(true)} className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2">
                <Calculator className="w-4 h-4" />Arqueo
              </button>
              <button className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />Exportar
              </button>
            </div>
          </div>

          {/* Tabla de ventas */}
          <div className={`${card} rounded-xl overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${divider} ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                    <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Factura</th>
                    <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Fecha/Hora</th>
                    <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Cliente</th>
                    <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Items</th>
                    <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Pago</th>
                    <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Total</th>
                    <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Estado</th>
                    <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Acciones</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${divider}`}>
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                      <tr key={sale.id} className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}>
                        <td className="px-4 py-2.5"><span className={`text-sm font-mono ${txt}`}>{sale.invoiceNumber}</span></td>
                        <td className="px-4 py-2.5"><span className={`text-sm ${sub}`}>{sale.date} {sale.time}</span></td>
                        <td className="px-4 py-2.5"><span className={`text-sm font-medium ${txt}`}>{sale.customer.name}</span></td>
                        <td className="px-4 py-2.5"><span className={`text-sm ${sub}`}>{sale.items.length} items</span></td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            {getPaymentIcon(sale.paymentMethod)}
                            <span className={`text-sm ${sub}`}>{getPaymentLabel(sale.paymentMethod)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5"><span className={`font-bold text-sm ${txt}`}>${sale.total.toFixed(2)}</span></td>
                        <td className="px-4 py-2.5">{getStatusBadge(sale.status)}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setSelectedSale(sale)} className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Ver detalles">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`} title="Imprimir">
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Search className={`w-10 h-10 ${sub}`} />
                          <p className={`font-medium ${sub}`}>No se encontraron ventas</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalles de venta */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${isLight ? "bg-white border border-gray-200" : "bg-gradient-to-br from-[#1a1f2e] to-[#0D1B2A] border border-white/10"} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl`}>
            <div className={`sticky top-0 border-b px-6 py-4 backdrop-blur-sm ${isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-bold text-xl ${txt}`}>Detalle de Venta</h3>
                  <p className={`text-sm ${sub}`}>Factura: {selectedSale.invoiceNumber}</p>
                </div>
                <button onClick={() => setSelectedSale(null)} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className={`${secBg} rounded-xl p-3`}><p className={`text-xs mb-1 ${sub}`}>Fecha y Hora</p><p className={`font-medium text-sm ${txt}`}>{selectedSale.date} - {selectedSale.time}</p></div>
                <div className={`${secBg} rounded-xl p-3`}><p className={`text-xs mb-1 ${sub}`}>Estado</p><div>{getStatusBadge(selectedSale.status)}</div></div>
                <div className={`${secBg} rounded-xl p-3`}><p className={`text-xs mb-1 ${sub}`}>Cajero</p><p className={`font-medium text-sm ${txt}`}>{selectedSale.cashier}</p></div>
                <div className={`${secBg} rounded-xl p-3`}><p className={`text-xs mb-1 ${sub}`}>Sucursal</p><p className={`font-medium text-sm ${txt}`}>{selectedSale.branch}</p></div>
              </div>
              <div className={`${secBg} rounded-xl p-4`}>
                <p className={`text-xs mb-3 ${sub}`}>Cliente</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{selectedSale.customer.name.split(" ").map(n => n[0]).join("").substring(0, 2)}</span>
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${txt}`}>{selectedSale.customer.name}</p>
                    <p className={`text-sm font-mono ${sub}`}>{selectedSale.customer.ruc}</p>
                  </div>
                </div>
              </div>
              <div className={`${secBg} rounded-xl overflow-hidden`}>
                <div className={`px-4 py-2.5 border-b ${divider}`}><p className={`font-medium text-sm ${txt}`}>Productos</p></div>
                <div className={`divide-y ${divider}`}>
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="px-4 py-3 flex items-center justify-between">
                      <div><p className={`text-sm font-medium ${txt}`}>{item.name}</p><p className={`text-xs ${sub}`}>Código: {item.code}</p></div>
                      <div className="text-right">
                        <p className={`text-sm ${sub}`}>{item.quantity} × ${item.price.toFixed(2)}</p>
                        <p className="text-primary font-bold text-sm">${item.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${secBg} rounded-xl p-4 space-y-2`}>
                <div className="flex justify-between text-sm"><span className={sub}>Subtotal:</span><span className={txt}>${selectedSale.subtotal.toFixed(2)}</span></div>
                {selectedSale.discount > 0 && <div className="flex justify-between text-sm"><span className={sub}>Descuento:</span><span className="text-green-500">-${selectedSale.discount.toFixed(2)}</span></div>}
                <div className="flex justify-between text-sm"><span className={sub}>IVA (12%):</span><span className={txt}>${selectedSale.tax.toFixed(2)}</span></div>
                <div className={`border-t ${divider} pt-2 flex justify-between`}><span className={`font-bold ${txt}`}>Total:</span><span className="text-primary font-bold text-xl">${selectedSale.total.toFixed(2)}</span></div>
              </div>
              <button className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />Imprimir Factura
              </button>
            </div>
          </div>
        </div>
      )}

      {showArqueoModal && (
        <ArqueoModal
          isOpen={showArqueoModal}
          onClose={() => setShowArqueoModal(false)}
          montoInicial={montoInicial}
          gastos={gastos}
          ventasEfectivo={ventasEfectivo}
          ventasTarjeta={ventasTarjeta}
          ventasTransferencia={ventasTransferencia}
        />
      )}
    </div>
  );
}