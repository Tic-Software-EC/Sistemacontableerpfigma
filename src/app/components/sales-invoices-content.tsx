import { useState } from "react";
import {
  Search,
  Calendar,
  DollarSign,
  Eye,
  Printer,
  XCircle,
  CheckCircle,
  Download,
  Cloud,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

interface InvoiceItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
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
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card" | "transfer" | "mixed" | "credit";
  status: "completed" | "cancelled" | "pending";
  seller: string;
  branch: string;
  authorizationNumber?: string;
  sriStatus?: "authorized" | "pending" | "rejected" | "not_sent";
  syncedFromSri?: boolean;
  sriAuthDate?: string;
}

// Datos mock de facturas
const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "001-001-000123",
    date: "2026-03-05",
    time: "14:32",
    customer: {
      name: "María González López",
      ruc: "1234567890001",
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
    seller: "Juan Pérez",
    branch: "Sucursal Centro",
    authorizationNumber: "0503202601179001234500120010010000012341234567890",
    sriStatus: "authorized",
    syncedFromSri: false,
    sriAuthDate: "2026-03-05 14:35",
  },
  {
    id: "2",
    invoiceNumber: "001-001-000124",
    date: "2026-03-05",
    time: "09:15",
    customer: {
      name: "Carlos Ramírez S.A.",
      ruc: "1791234567001",
    },
    items: [
      { code: "PROD010", name: "Monitor Samsung 24\"", quantity: 3, price: 280.00, total: 840.00 },
    ],
    subtotal: 840.00,
    tax: 100.80,
    discount: 42.00,
    total: 898.80,
    paymentMethod: "transfer",
    status: "completed",
    seller: "Ana Torres",
    branch: "Sucursal Norte",
    authorizationNumber: "0503202601179123456700120010010000012451234567890",
    sriStatus: "authorized",
    syncedFromSri: false,
    sriAuthDate: "2026-03-05 09:20",
  },
  {
    id: "3",
    invoiceNumber: "001-001-000125",
    date: "2026-03-04",
    time: "16:45",
    customer: {
      name: "Consumidor Final",
      ruc: "9999999999999",
    },
    items: [
      { code: "PROD015", name: "Teclado Mecánico", quantity: 1, price: 120.00, total: 120.00 },
    ],
    subtotal: 120.00,
    tax: 14.40,
    discount: 0,
    total: 134.40,
    paymentMethod: "cash",
    status: "completed",
    seller: "Juan Pérez",
    branch: "Sucursal Centro",
    authorizationNumber: "0403202601179001234500120010010000012561234567890",
    sriStatus: "authorized",
    syncedFromSri: false,
    sriAuthDate: "2026-03-04 16:48",
  },
];

export function SalesInvoicesContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Variables de tema consistentes
  const rootBg  = isLight ? "bg-gray-50" : "bg-[#0A0F1A]";
  const card    = isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10";
  const txt     = isLight ? "text-gray-900" : "text-white";
  const sub     = isLight ? "text-gray-600" : "text-gray-400";
  const secBg   = isLight ? "bg-gray-50" : "bg-white/5";
  const inp     = isLight ? "bg-white border border-gray-300 text-gray-900 focus:border-primary" : "bg-white/5 border border-white/10 text-white focus:border-primary";
  const divider = isLight ? "border-gray-200" : "border-white/10";

  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Función para sincronizar con SRI
  const syncWithSRI = async () => {
    setIsSyncing(true);
    setShowSyncModal(true);

    try {
      // Simular llamada al API del SRI
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Mock: Simular documentos obtenidos del SRI
      const sriDocuments: Invoice[] = [
        {
          id: "sri-001",
          invoiceNumber: "001-001-000200",
          date: "2026-03-05",
          time: "10:15",
          customer: {
            name: "Distribuidora El Progreso",
            ruc: "1723456789001",
          },
          items: [
            { code: "PROD005", name: "Monitor LG 27\" UltraWide", quantity: 2, price: 420.00, total: 840.00 },
          ],
          subtotal: 840.00,
          tax: 100.80,
          discount: 0,
          total: 940.80,
          paymentMethod: "card",
          status: "completed",
          seller: "Sistema SRI",
          branch: "Sucursal Centro",
          authorizationNumber: "0503202601179001234500120010010000020001234567890",
          sriStatus: "authorized",
          syncedFromSri: true,
          sriAuthDate: "2026-03-05 10:18",
        },
        {
          id: "sri-002",
          invoiceNumber: "001-001-000201",
          date: "2026-03-05",
          time: "11:30",
          customer: {
            name: "Comercial Andina S.A.",
            ruc: "1798765432001",
          },
          items: [
            { code: "PROD006", name: "Impresora Multifunción HP", quantity: 1, price: 350.00, total: 350.00 },
            { code: "PROD007", name: "Resma Papel Bond", quantity: 5, price: 4.50, total: 22.50 },
          ],
          subtotal: 372.50,
          tax: 44.70,
          discount: 0,
          total: 417.20,
          paymentMethod: "transfer",
          status: "completed",
          seller: "Sistema SRI",
          branch: "Sucursal Norte",
          authorizationNumber: "0503202601179876543200120010010000020101234567890",
          sriStatus: "authorized",
          syncedFromSri: true,
          sriAuthDate: "2026-03-05 11:33",
        },
      ];

      // Agregar documentos del SRI a las facturas existentes (evitando duplicados)
      setInvoices(prevInvoices => {
        const existingInvoices = prevInvoices.map(i => i.invoiceNumber);
        const newDocuments = sriDocuments.filter(doc => !existingInvoices.includes(doc.invoiceNumber));
        return [...newDocuments, ...prevInvoices];
      });

      // Mostrar notificación de éxito
      setTimeout(() => {
        setIsSyncing(false);
        setShowSyncModal(false);
        toast.success(`Se sincronizaron ${sriDocuments.length} factura(s) desde el SRI`, {
          description: "Las facturas electrónicas autorizadas están ahora en tu sistema"
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error al sincronizar con SRI:", error);
      setIsSyncing(false);
      setShowSyncModal(false);
      toast.error("Error al sincronizar con el SRI", {
        description: "Por favor intenta nuevamente"
      });
    }
  };

  // Filtrar facturas
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.ruc.includes(searchTerm);

    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;

    let matchesDate = true;
    const today = new Date();
    const invoiceDate = new Date(invoice.date);
    
    if (filterDate === "today") {
      matchesDate = invoiceDate.toDateString() === today.toDateString();
    } else if (filterDate === "week") {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = invoiceDate >= weekAgo;
    } else if (filterDate === "month") {
      matchesDate = invoiceDate.getMonth() === today.getMonth() && invoiceDate.getFullYear() === today.getFullYear();
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calcular totales
  const totalInvoices = filteredInvoices.filter(i => i.status === "completed").length;
  const totalAmount = filteredInvoices.filter(i => i.status === "completed").reduce((sum, inv) => sum + inv.total, 0);
  const syncedFromSriCount = invoices.filter(i => i.syncedFromSri).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-semibold"><CheckCircle className="w-3 h-3" />Completada</span>;
      case "cancelled":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs font-semibold"><XCircle className="w-3 h-3" />Anulada</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs font-semibold"><AlertCircle className="w-3 h-3" />Pendiente</span>;
      default:
        return null;
    }
  };

  const getPaymentBadge = (method: string) => {
    switch (method) {
      case "cash":
        return <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded">Efectivo</span>;
      case "card":
        return <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded">Tarjeta</span>;
      case "transfer":
        return <span className="text-xs text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 px-2 py-1 rounded">Transferencia</span>;
      case "mixed":
        return <span className="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400 px-2 py-1 rounded">Mixto</span>;
      case "credit":
        return <span className="text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 px-2 py-1 rounded">Crédito</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* ============================================================
          SECCIÓN 1: INDICADORES (3 tarjetas en fila)
         ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Indicador 1: Total Facturas */}
        <div className={`${card} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs mb-1 ${sub}`}>Total Facturas</p>
              <p className={`text-2xl font-bold ${txt}`}>{totalInvoices}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        {/* Indicador 2: Monto Total */}
        <div className={`${card} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs mb-1 ${sub}`}>Monto Total</p>
              <p className={`text-2xl font-bold ${txt}`}>${totalAmount.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Indicador 3: Docs desde SRI */}
        <div className={`${card} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs mb-1 ${sub}`}>Sincronizados SRI</p>
              <p className={`text-2xl font-bold ${txt}`}>{syncedFromSriCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Cloud className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          LÍNEA SEPARADORA
         ============================================================ */}
      <div className={`border-t ${divider}`}></div>

      {/* ============================================================
          SECCIÓN 2: BOTÓN "CONSULTAR SRI" (alineado a la derecha)
         ============================================================ */}
      <div className="flex justify-end">
        <button 
          onClick={syncWithSRI}
          disabled={isSyncing}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            isSyncing 
              ? "bg-blue-400 cursor-not-allowed text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isSyncing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <Cloud className="w-4 h-4" />
              Consultar SRI
            </>
          )}
        </button>
      </div>

      {/* ============================================================
          SECCIÓN 3: FILA DE FILTROS
         ============================================================ */}
      <div className={`${card} rounded-lg p-3`}>
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Buscador expandible */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número de factura, cliente o RUC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 px-3 py-2 rounded-lg text-sm placeholder-gray-500 focus:outline-none transition-all ${inp}`}
            />
          </div>

          {/* Selector de fecha */}
          <select 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)} 
            className={`px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>

          {/* Selector de estado */}
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className={`px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}
          >
            <option value="all">Todos los estados</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Anuladas</option>
            <option value="pending">Pendientes</option>
          </select>

          {/* Botón Exportar */}
          <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* ============================================================
          SECCIÓN 4: TABLA CON ENCABEZADO OSCURO
         ============================================================ */}
      <div className={`${card} rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${divider} ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                {/* Col 1 */}
                <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Factura</th>
                {/* Col 2 */}
                <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Fecha/Hora</th>
                {/* Col 3 */}
                <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Cliente</th>
                {/* Col 4 - AUTORIZACIÓN SRI */}
                <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Autorización SRI</th>
                {/* Col 5 */}
                <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Pago</th>
                {/* Col 6 */}
                <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Total</th>
                {/* Col 7 */}
                <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Estado</th>
                {/* Col 8 */}
                <th className={`px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider ${sub}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${divider}`}>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}>
                    {/* Col 1: Factura */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-mono ${txt}`}>{invoice.invoiceNumber}</span>
                        {invoice.syncedFromSri && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[10px] font-semibold" title="Documento sincronizado desde el SRI">
                            <Cloud className="w-3 h-3" />
                            SRI
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Col 2: Fecha/Hora */}
                    <td className="px-4 py-2.5">
                      <span className={`text-sm ${sub}`}>{invoice.date} {invoice.time}</span>
                    </td>
                    {/* Col 3: Cliente */}
                    <td className="px-4 py-2.5">
                      <div>
                        <p className={`text-sm font-medium ${txt}`}>{invoice.customer.name}</p>
                        <p className={`text-xs font-mono ${sub}`}>{invoice.customer.ruc}</p>
                      </div>
                    </td>
                    {/* Col 4: Autorización SRI */}
                    <td className="px-4 py-2.5">
                      {invoice.authorizationNumber ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-xs text-green-500 font-medium">✓ Autorizado</span>
                        </div>
                      ) : (
                        <span className={`text-xs ${sub}`}>Sin autorizar</span>
                      )}
                    </td>
                    {/* Col 5: Método de Pago */}
                    <td className="px-4 py-2.5">
                      {getPaymentBadge(invoice.paymentMethod)}
                    </td>
                    {/* Col 6: Total */}
                    <td className="px-4 py-2.5">
                      <span className={`text-sm font-bold ${txt}`}>${invoice.total.toFixed(2)}</span>
                    </td>
                    {/* Col 7: Estado */}
                    <td className="px-4 py-2.5">
                      {getStatusBadge(invoice.status)}
                    </td>
                    {/* Col 8: Acciones */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedInvoice(invoice)}
                          className={`p-1.5 rounded transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className={`p-1.5 rounded transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}
                          title="Imprimir"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <p className={sub}>No se encontraron facturas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================
          MODAL: DETALLE DE FACTURA
         ============================================================ */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`${isLight ? "bg-white border border-gray-200" : "bg-gradient-to-br from-[#1a1f2e] to-[#0D1B2A] border border-white/10"} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl`}>
            {/* Header del modal */}
            <div className={`sticky top-0 border-b px-6 py-4 backdrop-blur-sm ${isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-bold text-xl ${txt}`}>Detalle de Factura</h3>
                  <p className={`text-sm ${sub}`}>Factura: {selectedInvoice.invoiceNumber}</p>
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)} 
                  className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-4">
              {/* Información general */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`${secBg} rounded-xl p-3`}>
                  <p className={`text-xs mb-1 ${sub}`}>Fecha y Hora</p>
                  <p className={`font-medium text-sm ${txt}`}>{selectedInvoice.date} - {selectedInvoice.time}</p>
                </div>
                <div className={`${secBg} rounded-xl p-3`}>
                  <p className={`text-xs mb-1 ${sub}`}>Estado</p>
                  <div>{getStatusBadge(selectedInvoice.status)}</div>
                </div>
                <div className={`${secBg} rounded-xl p-3`}>
                  <p className={`text-xs mb-1 ${sub}`}>Vendedor</p>
                  <p className={`font-medium text-sm ${txt}`}>{selectedInvoice.seller}</p>
                </div>
                <div className={`${secBg} rounded-xl p-3`}>
                  <p className={`text-xs mb-1 ${sub}`}>Sucursal</p>
                  <p className={`font-medium text-sm ${txt}`}>{selectedInvoice.branch}</p>
                </div>
              </div>

              {/* Autorización SRI */}
              {selectedInvoice.authorizationNumber && (
                <div className={`${secBg} rounded-xl p-4 border-2 ${selectedInvoice.syncedFromSri ? (isLight ? "border-blue-200" : "border-blue-500/20") : (isLight ? "border-green-200" : "border-green-500/20")}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-xs uppercase font-semibold ${sub}`}>Autorización SRI</p>
                    {selectedInvoice.syncedFromSri && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[10px] font-semibold">
                        <Cloud className="w-3 h-3" />
                        Sincronizado desde SRI
                      </span>
                    )}
                  </div>
                  <p className={`font-mono text-sm ${txt} break-all`}>{selectedInvoice.authorizationNumber}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-500 text-xs font-medium">Factura Autorizada</span>
                    </div>
                    {selectedInvoice.sriAuthDate && (
                      <div className={`text-xs ${sub}`}>
                        {selectedInvoice.sriAuthDate}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cliente */}
              <div className={`${secBg} rounded-xl p-4`}>
                <p className={`text-xs mb-3 ${sub}`}>Cliente</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {selectedInvoice.customer.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className={`font-medium text-sm ${txt}`}>{selectedInvoice.customer.name}</p>
                    <p className={`text-sm font-mono ${sub}`}>{selectedInvoice.customer.ruc}</p>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className={`${secBg} rounded-xl overflow-hidden`}>
                <div className={`px-4 py-2.5 border-b ${divider}`}>
                  <p className={`font-medium text-sm ${txt}`}>Productos</p>
                </div>
                <div className={`divide-y ${divider}`}>
                  {selectedInvoice.items.map((item, index) => (
                    <div key={index} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${txt}`}>{item.name}</p>
                        <p className={`text-xs ${sub}`}>Código: {item.code}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${sub}`}>{item.quantity} × ${item.price.toFixed(2)}</p>
                        <p className="text-primary font-bold text-sm">${item.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className={`${secBg} rounded-xl p-4 space-y-2`}>
                <div className="flex justify-between text-sm">
                  <span className={sub}>Subtotal:</span>
                  <span className={txt}>${selectedInvoice.subtotal.toFixed(2)}</span>
                </div>
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={sub}>Descuento:</span>
                    <span className="text-green-500">-${selectedInvoice.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className={sub}>IVA (12%):</span>
                  <span className={txt}>${selectedInvoice.tax.toFixed(2)}</span>
                </div>
                <div className={`border-t ${divider} pt-2 flex justify-between`}>
                  <span className={`font-bold ${txt}`}>Total:</span>
                  <span className="text-primary font-bold text-xl">${selectedInvoice.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botón imprimir */}
              <button className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <Printer className="w-4 h-4" />
                Imprimir Factura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL: SINCRONIZACIÓN CON SRI
         ============================================================ */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${card} rounded-2xl p-8 max-w-md w-full shadow-2xl`}>
            <div className="text-center space-y-6">
              {/* Icono animado */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center">
                    {isSyncing ? (
                      <Cloud className="w-10 h-10 text-blue-500 animate-pulse" />
                    ) : (
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    )}
                  </div>
                  {isSyncing && (
                    <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </div>

              {/* Texto */}
              <div>
                <h3 className={`text-xl font-bold mb-2 ${txt}`}>
                  {isSyncing ? "Consultando SRI..." : "¡Sincronización Completada!"}
                </h3>
                <p className={sub}>
                  {isSyncing 
                    ? "Obteniendo facturas electrónicas autorizadas" 
                    : "Las facturas del SRI se han agregado correctamente"}
                </p>
              </div>

              {/* Barra de progreso */}
              {isSyncing && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{ width: "70%" }}></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
