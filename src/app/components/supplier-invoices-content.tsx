import { useState } from "react";
import { FileText, Search, Calendar, Eye, Plus, X, Printer, Download, Truck, User, DollarSign, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Filter, CheckCircle, Clock, XCircle, AlertTriangle, Edit, Save, Trash2 } from "lucide-react";
import { NewSupplierInvoiceModal } from "./new-supplier-invoice-modal";

// Usuario logueado
const LOGGED_USER = {
  name: "María López Contreras",
  role: "administrador",
  email: "maria.lopez@empresa.com"
};

interface InvoiceItem {
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
}

interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  receptionNumber?: string;
  purchaseOrder: string;
  supplier: string;
  supplierRuc: string;
  invoiceDate: string;
  dueDate: string;
  receivedDate: string;
  registeredBy: string;
  status: "pending" | "approved" | "paid" | "overdue" | "rejected";
  statusLabel: string;
  paymentTerms: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
  notes: string;
  authorizationNumber?: string;
  establishment: string;
  emissionPoint: string;
  sequential: string;
}

const MOCK_SUPPLIER_INVOICES: SupplierInvoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "FAC-001-001234",
    receptionNumber: "REC-2026-001",
    purchaseOrder: "OC-2026-001",
    supplier: "Distribuidora Nacional S.A.",
    supplierRuc: "1790016919001",
    invoiceDate: "2026-02-18",
    dueDate: "2026-03-20",
    receivedDate: "2026-02-19",
    registeredBy: "Carlos Mendoza",
    status: "approved",
    statusLabel: "Aprobada",
    paymentTerms: "Crédito 30 días",
    establishment: "001",
    emissionPoint: "001",
    sequential: "000001234",
    authorizationNumber: "1802202601179001691900120010010000012341234567810",
    items: [
      {
        productCode: "PROD-001",
        productName: "Laptop Dell Inspiron 15",
        quantity: 5,
        unit: "Unidad",
        unitPrice: 850.00,
        taxRate: 15,
        discount: 0,
        subtotal: 4250.00,
        tax: 637.50,
        total: 4887.50
      },
      {
        productCode: "PROD-002",
        productName: "Mouse Inalámbrico Logitech M185",
        quantity: 10,
        unit: "Unidad",
        unitPrice: 15.00,
        taxRate: 15,
        discount: 0,
        subtotal: 150.00,
        tax: 22.50,
        total: 172.50
      },
      {
        productCode: "PROD-003",
        productName: "Teclado Mecánico RGB Gamer",
        quantity: 10,
        unit: "Unidad",
        unitPrice: 45.00,
        taxRate: 15,
        discount: 0,
        subtotal: 450.00,
        tax: 67.50,
        total: 517.50
      },
      {
        productCode: "PROD-004",
        productName: "Monitor LG 24 pulgadas Full HD",
        quantity: 5,
        unit: "Unidad",
        unitPrice: 180.00,
        taxRate: 15,
        discount: 0,
        subtotal: 900.00,
        tax: 135.00,
        total: 1035.00
      }
    ],
    subtotal: 5750.00,
    taxAmount: 862.50,
    discount: 0,
    total: 6612.50,
    notes: "Factura recibida completa y correcta"
  },
  {
    id: "inv-002",
    invoiceNumber: "FAC-002-005678",
    receptionNumber: "REC-2026-002",
    purchaseOrder: "OC-2026-002",
    supplier: "Kreafast",
    supplierRuc: "1792345678001",
    invoiceDate: "2026-02-19",
    dueDate: "2026-03-06",
    receivedDate: "2026-02-20",
    registeredBy: "Ana Torres",
    status: "pending",
    statusLabel: "Pendiente",
    paymentTerms: "Crédito 15 días",
    establishment: "001",
    emissionPoint: "002",
    sequential: "000005678",
    authorizationNumber: "1902202601179234567800120010020000056781234567810",
    items: [
      {
        productCode: "PROD-005",
        productName: "Resma papel bond A4",
        quantity: 20,
        unit: "Unidad",
        unitPrice: 4.50,
        taxRate: 15,
        discount: 0,
        subtotal: 90.00,
        tax: 13.50,
        total: 103.50
      },
      {
        productCode: "PROD-006",
        productName: "Marcadores permanentes x12",
        quantity: 15,
        unit: "Caja",
        unitPrice: 8.00,
        taxRate: 15,
        discount: 5,
        subtotal: 120.00,
        tax: 18.00,
        total: 133.00
      }
    ],
    subtotal: 210.00,
    taxAmount: 31.50,
    discount: 5.00,
    total: 236.50,
    notes: "Factura recibida, pendiente de aprobación"
  },
  {
    id: "inv-003",
    invoiceNumber: "FAC-003-002345",
    purchaseOrder: "OC-2026-003",
    supplier: "Tecnología Avanzada S.A.",
    supplierRuc: "1798765432001",
    invoiceDate: "2026-02-15",
    dueDate: "2026-02-15",
    receivedDate: "2026-02-16",
    registeredBy: "Luis Ramírez",
    status: "paid",
    statusLabel: "Pagada",
    paymentTerms: "Contado",
    establishment: "002",
    emissionPoint: "001",
    sequential: "000002345",
    authorizationNumber: "1502202601179876543200120020010000023451234567810",
    items: [
      {
        productCode: "PROD-011",
        productName: "Impresora multifunción",
        quantity: 3,
        unit: "Unidad",
        unitPrice: 320.00,
        taxRate: 15,
        discount: 30,
        subtotal: 960.00,
        tax: 144.00,
        total: 1074.00
      }
    ],
    subtotal: 960.00,
    taxAmount: 144.00,
    discount: 30.00,
    total: 1074.00,
    notes: "Factura pagada al contado con descuento"
  },
  {
    id: "inv-004",
    invoiceNumber: "FAC-004-009876",
    purchaseOrder: "OC-2026-005",
    supplier: "Importadora del Pacífico",
    supplierRuc: "1790123456001",
    invoiceDate: "2026-01-20",
    dueDate: "2026-02-19",
    receivedDate: "2026-01-22",
    registeredBy: "María López",
    status: "overdue",
    statusLabel: "Vencida",
    paymentTerms: "Crédito 30 días",
    establishment: "001",
    emissionPoint: "001",
    sequential: "000009876",
    authorizationNumber: "2001202601179012345600120010010000098761234567810",
    items: [
      {
        productCode: "PROD-015",
        productName: "Cable UTP Cat6 x305m",
        quantity: 5,
        unit: "Rollo",
        unitPrice: 85.00,
        taxRate: 15,
        discount: 0,
        subtotal: 425.00,
        tax: 63.75,
        total: 488.75
      }
    ],
    subtotal: 425.00,
    taxAmount: 63.75,
    discount: 0,
    total: 488.75,
    notes: "URGENTE: Factura vencida desde el 19/02/2026"
  },
  {
    id: "inv-005",
    invoiceNumber: "FAC-005-001111",
    purchaseOrder: "OC-2026-004",
    supplier: "Comercial Andina",
    supplierRuc: "1791234567001",
    invoiceDate: "2026-02-20",
    dueDate: "2026-04-05",
    receivedDate: "2026-02-20",
    registeredBy: "Juan Pérez",
    status: "approved",
    statusLabel: "Aprobada",
    paymentTerms: "Crédito 45 días",
    establishment: "003",
    emissionPoint: "001",
    sequential: "000001111",
    authorizationNumber: "2002202601179123456700120030010000011111234567810",
    items: [
      {
        productCode: "PROD-008",
        productName: "Silla ergonómica oficina",
        quantity: 12,
        unit: "Unidad",
        unitPrice: 95.00,
        taxRate: 15,
        discount: 50,
        subtotal: 1140.00,
        tax: 171.00,
        total: 1261.00
      },
      {
        productCode: "PROD-009",
        productName: "Escritorio ejecutivo",
        quantity: 6,
        unit: "Unidad",
        unitPrice: 220.00,
        taxRate: 15,
        discount: 0,
        subtotal: 1320.00,
        tax: 198.00,
        total: 1518.00
      }
    ],
    subtotal: 2460.00,
    taxAmount: 369.00,
    discount: 50.00,
    total: 2779.00,
    notes: "Factura aprobada, pago programado para marzo"
  }
];

export function SupplierInvoicesContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SupplierInvoice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredInvoices = MOCK_SUPPLIER_INVOICES.filter(invoice => {
    const matchesSearch = searchTerm === "" ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.purchaseOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.supplierRuc.includes(searchTerm);

    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    const matchesSupplier = filterSupplier === "all" || invoice.supplier === filterSupplier;
    const matchesDate = filterDate === "all" || invoice.invoiceDate.startsWith(filterDate);

    return matchesSearch && matchesStatus && matchesSupplier && matchesDate;
  });

  const uniqueSuppliers = Array.from(new Set(MOCK_SUPPLIER_INVOICES.map(i => i.supplier)));
  const uniqueDates = Array.from(new Set(MOCK_SUPPLIER_INVOICES.map(i => i.invoiceDate.substring(0, 7)))).sort().reverse();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 border border-green-500/20 text-green-400";
      case "paid":
        return "bg-blue-500/10 border border-blue-500/20 text-blue-400";
      case "pending":
        return "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400";
      case "overdue":
        return "bg-red-500/10 border border-red-500/20 text-red-400";
      case "rejected":
        return "bg-gray-500/10 border border-gray-500/20 text-gray-400";
      default:
        return "bg-white/5 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleViewDetail = (invoice: SupplierInvoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Calcular días para vencimiento
  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Estadísticas rápidas
  const totalInvoices = MOCK_SUPPLIER_INVOICES.length;
  const totalAmount = MOCK_SUPPLIER_INVOICES.reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = MOCK_SUPPLIER_INVOICES.filter(i => i.status === "pending" || i.status === "approved").reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = MOCK_SUPPLIER_INVOICES.filter(i => i.status === "overdue").length;

  return (
    <div className="space-y-6">
      {/* Header estándar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Facturas a Proveedores
          </h2>
          <p className="text-gray-400 text-sm">
            Gestión y control de facturas recibidas de proveedores
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowNewInvoiceModal(true)}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nueva Factura
          </button>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs uppercase">Total Facturas</p>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-white font-bold text-2xl">{totalInvoices}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs uppercase">Total General</p>
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-white font-bold text-2xl">{formatCurrency(totalAmount)}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs uppercase">Por Pagar</p>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-white font-bold text-2xl">{formatCurrency(pendingAmount)}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs uppercase">Vencidas</p>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-red-400 font-bold text-2xl">{overdueCount}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Buscar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        {/* Estado */}
        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobada</option>
            <option value="paid">Pagada</option>
            <option value="overdue">Vencida</option>
            <option value="rejected">Rechazada</option>
          </select>
        </div>

        {/* Proveedor */}
        <div className="relative">
          <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todos los proveedores</option>
            {uniqueSuppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todas las fechas</option>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date + "-01").toLocaleDateString("es-EC", { year: "numeric", month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de facturas */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No se encontraron facturas</p>
            <p className="text-gray-500 text-sm">
              Intenta ajustar los filtros o crea una nueva factura
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nº Factura
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Orden Compra
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Fecha Emisión
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentItems.map((invoice) => {
                  const daysUntilDue = getDaysUntilDue(invoice.dueDate);
                  return (
                    <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Número de Factura */}
                      <td className="px-6 py-3">
                        <span className="text-white font-bold font-mono text-sm">{invoice.invoiceNumber}</span>
                      </td>

                      {/* Proveedor */}
                      <td className="px-6 py-3">
                        <span className="text-white text-sm">{invoice.supplier}</span>
                      </td>

                      {/* Orden de Compra */}
                      <td className="px-6 py-3">
                        <span className="text-white text-sm font-mono">{invoice.purchaseOrder}</span>
                      </td>

                      {/* Fecha Emisión */}
                      <td className="px-6 py-3">
                        <span className="text-white text-sm">{formatDate(invoice.invoiceDate)}</span>
                      </td>

                      {/* Vencimiento */}
                      <td className="px-6 py-3">
                        <span className="text-white text-sm">{formatDate(invoice.dueDate)}</span>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-3 text-right">
                        <span className="text-white font-bold text-sm">{formatCurrency(invoice.total)}</span>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          {invoice.statusLabel}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewDetail(invoice)}
                            className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                            title="Imprimir"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {filteredInvoices.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Información de registros */}
          <div className="text-gray-400 text-sm">
            Mostrando <span className="text-white font-medium">{indexOfFirstItem + 1}</span> a{" "}
            <span className="text-white font-medium">{Math.min(indexOfLastItem, filteredInvoices.length)}</span> de{" "}
            <span className="text-white font-medium">{filteredInvoices.length}</span> facturas
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center gap-2">
            {/* Selector de items por página */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>

            {/* Botones de navegación */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Primera página"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm min-w-[100px] text-center">
                {currentPage} / {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Última página"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      {showDetailModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-white font-bold text-xl font-mono">
                  {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {selectedInvoice.supplier} - RUC: {selectedInvoice.supplierRuc}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Orden de Compra</p>
                  <p className="text-white font-medium font-mono">{selectedInvoice.purchaseOrder}</p>
                </div>
                {selectedInvoice.receptionNumber && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-2">Recepción</p>
                    <p className="text-white font-medium font-mono">{selectedInvoice.receptionNumber}</p>
                  </div>
                )}
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Fecha de Emisión</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {formatDate(selectedInvoice.invoiceDate)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Fecha de Vencimiento</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    {formatDate(selectedInvoice.dueDate)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Términos de Pago</p>
                  <p className="text-white font-medium">{selectedInvoice.paymentTerms}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Registrado por</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    {selectedInvoice.registeredBy}
                  </p>
                </div>
              </div>

              {/* Estado */}
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-400 text-xs mb-2">Estado de la Factura</p>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedInvoice.status)}`}>
                  {getStatusIcon(selectedInvoice.status)}
                  {selectedInvoice.statusLabel}
                </span>
              </div>

              {/* Datos fiscales */}
              {selectedInvoice.authorizationNumber && (
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2 uppercase">Datos Fiscales</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs">Establecimiento</p>
                      <p className="text-white font-mono">{selectedInvoice.establishment}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Punto de Emisión</p>
                      <p className="text-white font-mono">{selectedInvoice.emissionPoint}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-500 text-xs">Número de Autorización</p>
                      <p className="text-white font-mono text-sm break-all">{selectedInvoice.authorizationNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Productos */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4">Detalle de Productos</h4>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Producto</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-24">Cant.</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase w-32">P. Unit.</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase w-32">Subtotal</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-20">IVA</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase w-32">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {selectedInvoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-white text-sm font-medium">{item.productName}</span>
                              <span className="text-gray-400 text-xs font-mono">{item.productCode}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-white text-sm font-mono">{item.quantity} {item.unit}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-white text-sm">{formatCurrency(item.unitPrice)}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-white text-sm font-medium">{formatCurrency(item.subtotal)}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-gray-400 text-xs">{item.taxRate}%</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-white font-bold text-sm">{formatCurrency(item.total)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Subtotal:</span>
                    <span className="text-white font-medium">{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Descuento:</span>
                      <span className="text-red-400 font-medium">-{formatCurrency(selectedInvoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">IVA (15%):</span>
                    <span className="text-white font-medium">{formatCurrency(selectedInvoice.taxAmount)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">TOTAL:</span>
                      <span className="text-primary font-bold text-2xl">{formatCurrency(selectedInvoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {selectedInvoice.notes && (
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Observaciones</p>
                  <p className="text-white text-sm">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cerrar
              </button>
              <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
              <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nueva factura */}
      {showNewInvoiceModal && (
        <NewSupplierInvoiceModal
          onClose={() => setShowNewInvoiceModal(false)}
        />
      )}
    </div>
  );
}