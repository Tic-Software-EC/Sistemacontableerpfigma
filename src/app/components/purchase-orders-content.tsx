/* Módulo de Órdenes de Compra - TicSoftEc */
import { useState } from "react";
import {
  Search, Plus, Download, Printer, CheckCircle, Clock,
  X, FileText, Eye, Trash2, AlertCircle,
  Calendar, Package, PackageCheck, XCircle,
  Send, Check,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { PurchaseOrderWizard } from "./purchase-order-wizard";

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface OrderItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  subtotal: number;
  receivedQuantity?: number;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  date: string;
  deliveryDate: string;
  supplier: {
    name: string;
    ruc: string;
    address?: string;
    email?: string;
    phone?: string;
    contact?: string;
  };
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  tax: number;
  total: number;
  status: "draft" | "pending" | "approved" | "partial" | "received" | "cancelled";
  buyer: string;
  branch: string;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  approvedDate?: string;
  receivedDate?: string;
}

/* ══════════════════════════════════════════════════════════════════════
   DATOS MOCK
══════════════════════════════════════════════════════════════════════ */
const ORDERS_INIT: PurchaseOrder[] = [
  {
    id: "1",
    orderNumber: "OC-2026-001234",
    date: "2026-03-09",
    deliveryDate: "2026-03-19",
    supplier: {
      name: "Tecnología Avanzada S.A.",
      ruc: "1792345678001",
      address: "Av. República 456, Quito",
      email: "ventas@tecnoavanzada.com",
      phone: "02-2456789",
      contact: "Ing. Carlos Pérez"
    },
    items: [
      { id: "1", productCode: "PROD-001", productName: "Laptop Dell Latitude 5420", quantity: 5, unitPrice: 850.00, discount: 42.50, tax: 12, subtotal: 4207.50, receivedQuantity: 0 },
      { id: "2", productCode: "PROD-002", productName: "Monitor LG 27 pulgadas", quantity: 10, unitPrice: 320.00, discount: 0, tax: 12, subtotal: 3200.00, receivedQuantity: 0 },
    ],
    subtotal: 7407.50,
    totalDiscount: 42.50,
    tax: 888.90,
    total: 8296.40,
    status: "draft",
    buyer: "Juan Pérez",
    branch: "Sucursal Centro",
    notes: "Equipamiento para nuevo proyecto",
    createdBy: "Juan Pérez",
  },
  {
    id: "2",
    orderNumber: "OC-2026-001235",
    date: "2026-03-08",
    deliveryDate: "2026-03-15",
    supplier: {
      name: "Papelería Corporativa Ltda.",
      ruc: "1798765432001",
      address: "Calle Bolívar 234, Cuenca",
      email: "ventas@papeleriacorp.com",
      phone: "07-2890123",
      contact: "Lcda. María González"
    },
    items: [
      { id: "3", productCode: "PROD-005", productName: "Resma papel bond A4", quantity: 50, unitPrice: 4.50, discount: 0, tax: 0, subtotal: 225.00, receivedQuantity: 0 },
      { id: "4", productCode: "PROD-006", productName: "Marcadores permanentes x12", quantity: 20, unitPrice: 8.75, discount: 0, tax: 12, subtotal: 175.00, receivedQuantity: 0 },
    ],
    subtotal: 400.00,
    totalDiscount: 0,
    tax: 21.00,
    total: 421.00,
    status: "pending",
    buyer: "Carlos Méndez",
    branch: "Sucursal Centro",
    notes: "Material de oficina mensual",
    createdBy: "Carlos Méndez",
  },
  {
    id: "3",
    orderNumber: "OC-2026-001236",
    date: "2026-03-07",
    deliveryDate: "2026-03-17",
    supplier: {
      name: "Distribuidora La Favorita C.A.",
      ruc: "1790016919001",
      address: "Av. General Enríquez km 4.5, Sangolquí",
      email: "ventas@favorita.com",
      phone: "02-3456789",
      contact: "Sr. Roberto Torres"
    },
    items: [
      { id: "5", productCode: "PROD-008", productName: "Silla ergonómica oficina", quantity: 15, unitPrice: 185.00, discount: 277.50, tax: 12, subtotal: 2497.50, receivedQuantity: 0 },
      { id: "6", productCode: "PROD-009", productName: "Escritorio ejecutivo", quantity: 8, unitPrice: 450.00, discount: 0, tax: 12, subtotal: 3600.00, receivedQuantity: 0 },
    ],
    subtotal: 6097.50,
    totalDiscount: 277.50,
    tax: 731.70,
    total: 6551.70,
    status: "approved",
    buyer: "Ana López",
    branch: "Sucursal Norte",
    notes: "Para ampliación de oficinas",
    createdBy: "Ana López",
    approvedBy: "María González",
    approvedDate: "2026-03-08",
  },
  {
    id: "4",
    orderNumber: "OC-2026-001237",
    date: "2026-03-06",
    deliveryDate: "2026-03-16",
    supplier: {
      name: "Industrial Supplies Corp.",
      ruc: "US-987654321",
      address: "Miami, FL, USA",
      email: "sales@industrialsupplies.com",
      phone: "+1-305-123-4567",
      contact: "Mr. John Smith"
    },
    items: [
      { id: "7", productCode: "PROD-011", productName: "Impresora multifunción", quantity: 3, unitPrice: 280.00, discount: 0, tax: 12, subtotal: 840.00, receivedQuantity: 2 },
      { id: "8", productCode: "PROD-015", productName: "Cable UTP Cat6 x305m", quantity: 5, unitPrice: 120.00, discount: 0, tax: 12, subtotal: 600.00, receivedQuantity: 3 },
    ],
    subtotal: 1440.00,
    totalDiscount: 0,
    tax: 172.80,
    total: 1612.80,
    status: "partial",
    buyer: "Pedro Morales",
    branch: "Sucursal Sur",
    notes: "Recepción parcial - Falta 1 impresora y 2 cables",
    createdBy: "Pedro Morales",
    approvedBy: "María González",
    approvedDate: "2026-03-06",
  },
  {
    id: "5",
    orderNumber: "OC-2026-001238",
    date: "2026-03-05",
    deliveryDate: "2026-03-12",
    supplier: {
      name: "Construcciones Andinas S.A.",
      ruc: "1790123456001",
      address: "Av. 6 de Diciembre N34-123, Quito",
      email: "ventas@constandinas.com",
      phone: "02-2567890",
      contact: "Ing. Luis Ramírez"
    },
    items: [
      { id: "9", productCode: "PROD-013", productName: "Cemento Portland x50kg", quantity: 100, unitPrice: 8.90, discount: 0, tax: 12, subtotal: 890.00, receivedQuantity: 100 },
      { id: "10", productCode: "PROD-014", productName: "Varilla de hierro 12mm", quantity: 50, unitPrice: 15.50, discount: 0, tax: 12, subtotal: 775.00, receivedQuantity: 50 },
    ],
    subtotal: 1665.00,
    totalDiscount: 0,
    tax: 199.80,
    total: 1864.80,
    status: "received",
    buyer: "Laura Jiménez",
    branch: "Sucursal Sur",
    notes: "Material para obra civil - Recibido completamente",
    createdBy: "Laura Jiménez",
    approvedBy: "María González",
    approvedDate: "2026-03-05",
    receivedDate: "2026-03-11",
  },
  {
    id: "6",
    orderNumber: "OC-2026-001239",
    date: "2026-03-04",
    deliveryDate: "2026-03-14",
    supplier: {
      name: "Tecnología Avanzada S.A.",
      ruc: "1792345678001",
      address: "Av. República 456, Quito",
      email: "ventas@tecnoavanzada.com",
      phone: "02-2456789",
      contact: "Ing. Carlos Pérez"
    },
    items: [
      { id: "11", productCode: "PROD-001", productName: "Laptop Dell Latitude 5420", quantity: 3, unitPrice: 850.00, discount: 0, tax: 12, subtotal: 2550.00, receivedQuantity: 0 },
    ],
    subtotal: 2550.00,
    totalDiscount: 0,
    tax: 306.00,
    total: 2856.00,
    status: "cancelled",
    buyer: "Roberto Sánchez",
    branch: "Sucursal Centro",
    notes: "Cancelado por demora del proveedor",
    createdBy: "Roberto Sánchez",
  },
];

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function PurchaseOrdersContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados principales
  const [orders, setOrders] = useState<PurchaseOrder[]>(ORDERS_INIT);
  const [activeTab, setActiveTab] = useState<"draft" | "pending" | "approved" | "partial" | "received" | "cancelled">("draft");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<PurchaseOrder | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Contadores por estado
  const counts = {
    draft: orders.filter(o => o.status === "draft").length,
    pending: orders.filter(o => o.status === "pending").length,
    approved: orders.filter(o => o.status === "approved").length,
    partial: orders.filter(o => o.status === "partial").length,
    received: orders.filter(o => o.status === "received").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  // Filtrar órdenes por tab y búsqueda
  const filteredOrders = orders
    .filter(order => order.status === activeTab)
    .filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.ruc.includes(searchTerm)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredOrders.map(o => o.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleView = (order: PurchaseOrder) => {
    setViewingOrder(order);
    setShowViewModal(true);
  };

  const handleApprove = (orderId: string) => {
    setOrders(orders.map(o =>
      o.id === orderId
        ? { ...o, status: "approved", approvedBy: "Usuario Actual", approvedDate: new Date().toISOString().split("T")[0] }
        : o
    ));
    toast.success("✓ Orden aprobada correctamente");
  };

  const handleSend = (orderId: string) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: "pending" } : o
    ));
    toast.success("✓ Orden enviada al proveedor");
  };

  const handleDelete = (orderId: string) => {
    if (confirm("¿Estás seguro de eliminar esta orden?")) {
      setOrders(orders.filter(o => o.id !== orderId));
      toast.success("✓ Orden eliminada");
    }
  };

  const handleReject = (orderId: string) => {
    setOrders(orders.map(o =>
      o.id === orderId ? { ...o, status: "cancelled" } : o
    ));
    toast.success("✓ Orden rechazada");
  };

  const handleExportCSV = () => {
    toast.success("✓ Exportando órdenes a CSV...");
  };

  const handlePrint = () => {
    toast.success("✓ Imprimiendo órdenes...");
  };

  const handleBulkSend = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos una orden");
      return;
    }
    setOrders(orders.map(o =>
      selectedIds.has(o.id) ? { ...o, status: "pending" } : o
    ));
    toast.success(`✓ ${selectedIds.size} orden(es) enviada(s) al proveedor`);
    setSelectedIds(new Set());
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos una orden");
      return;
    }
    setOrders(orders.map(o =>
      selectedIds.has(o.id)
        ? { ...o, status: "approved", approvedBy: "Usuario Actual", approvedDate: new Date().toISOString().split("T")[0] }
        : o
    ));
    toast.success(`✓ ${selectedIds.size} orden(es) aprobada(s) correctamente`);
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos una orden");
      return;
    }
    setOrders(orders.map(o =>
      selectedIds.has(o.id) ? { ...o, status: "cancelled" } : o
    ));
    toast.success(`✓ ${selectedIds.size} orden(es) rechazada(s)`);
    setSelectedIds(new Set());
  };

  /* ════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <div className={`flex flex-col gap-4 ${isLight ? "bg-white" : "bg-[#0D1B2A]"} rounded-xl p-5`}>
        {/* ── TABS de Estados ── */}
        <div className={`flex items-center gap-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <button
            onClick={() => {setActiveTab("draft"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "draft"
                ? isLight
                  ? "text-gray-700"
                  : "text-gray-300"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Borradores
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "draft"
                  ? "bg-gray-200 text-gray-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.draft}
              </span>
            </div>
            {activeTab === "draft" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-500"></div>
            )}
          </button>

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
            onClick={() => {setActiveTab("approved"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "approved"
                ? isLight
                  ? "text-blue-700"
                  : "text-blue-400"
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
                  ? "bg-blue-100 text-blue-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.approved}
              </span>
            </div>
            {activeTab === "approved" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("partial"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "partial"
                ? isLight
                  ? "text-purple-700"
                  : "text-purple-400"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Parciales
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "partial"
                  ? "bg-purple-100 text-purple-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.partial}
              </span>
            </div>
            {activeTab === "partial" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("received"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "received"
                ? isLight
                  ? "text-green-700"
                  : "text-green-400"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4" />
              Recibidas
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "received"
                  ? "bg-green-100 text-green-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.received}
              </span>
            </div>
            {activeTab === "received" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("cancelled"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "cancelled"
                ? isLight
                  ? "text-red-700"
                  : "text-red-400"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Canceladas
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.cancelled}
              </span>
            </div>
            {activeTab === "cancelled" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
            )}
          </button>
        </div>

        {/* ── Barra de Acciones Superior ── */}
        <div className="flex items-center justify-between gap-3">
          {/* Buscador y Filtros de Fecha */}
          <div className="flex items-center gap-2 flex-1">
            {/* Buscador */}
            <div className={`w-64 flex items-center gap-2 border rounded-lg px-3 py-1.5 ${
              isLight ? "bg-white border-gray-300" : "bg-white/5 border-white/15"
            }`}>
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar número, proveedor, RUC..."
                className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              />
            </div>

            {/* Filtro Fecha Desde */}
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${
              isLight ? "bg-white border-gray-300" : "bg-white/5 border-white/15"
            }`}>
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={`bg-transparent text-sm focus:outline-none ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
                style={{ colorScheme: isLight ? "light" : "dark" }}
              />
            </div>

            <span className="text-gray-400">—</span>

            {/* Filtro Fecha Hasta */}
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${
              isLight ? "bg-white border-gray-300" : "bg-white/5 border-white/15"
            }`}>
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={`bg-transparent text-sm focus:outline-none ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
                style={{ colorScheme: isLight ? "light" : "dark" }}
              />
            </div>
          </div>

          {/* Botones de Acción - Siempre visibles según el tab */}
          <div className="flex items-center gap-2">
            {/* Botón Enviar - Solo en tab draft */}
            {activeTab === "draft" && (
              <button
                onClick={handleBulkSend}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            )}

            {/* Botones para tab pending */}
            {activeTab === "pending" && (
              <>
                <button
                  onClick={handleBulkApprove}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprobar
                </button>
                <button
                  onClick={handleBulkReject}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm bg-red-600 hover:bg-red-700"
                >
                  <AlertCircle className="w-4 h-4" />
                  Rechazar
                </button>
              </>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-primary hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nueva Orden
            </button>
            <button
              onClick={handleExportCSV}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                isLight
                  ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  : "border-white/20 text-gray-300 bg-white/5 hover:bg-white/10"
              }`}
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={handlePrint}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                isLight
                  ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  : "border-white/20 text-gray-300 bg-white/5 hover:bg-white/10"
              }`}
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>

        {/* ── Banner Informativo ── */}
        <div className={`rounded-lg p-4 border ${
          activeTab === "draft"
            ? isLight
              ? "bg-gray-50 border-gray-200"
              : "bg-[#1a2936] border-white/10"
            : activeTab === "pending"
            ? isLight
              ? "bg-yellow-50 border-yellow-200"
              : "bg-yellow-500/10 border-yellow-500/20"
            : activeTab === "approved"
            ? isLight
              ? "bg-blue-50 border-blue-200"
              : "bg-blue-500/10 border-blue-500/20"
            : activeTab === "partial"
            ? isLight
              ? "bg-purple-50 border-purple-200"
              : "bg-purple-500/10 border-purple-500/20"
            : activeTab === "received"
            ? isLight
              ? "bg-green-50 border-green-200"
              : "bg-green-500/10 border-green-500/20"
            : isLight
            ? "bg-red-50 border-red-200"
            : "bg-red-500/10 border-red-500/20"
        }`}>
          <div className="flex items-start gap-2">
            <FileText className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              activeTab === "draft" ? (isLight ? "text-gray-600" : "text-gray-400")
              : activeTab === "pending" ? (isLight ? "text-yellow-600" : "text-yellow-400")
              : activeTab === "approved" ? (isLight ? "text-blue-600" : "text-blue-400")
              : activeTab === "partial" ? (isLight ? "text-purple-600" : "text-purple-400")
              : activeTab === "received" ? (isLight ? "text-green-600" : "text-green-400")
              : (isLight ? "text-red-600" : "text-red-400")
            }`} />
            <div>
              <p className={`text-sm font-semibold ${
                activeTab === "draft" ? (isLight ? "text-gray-900" : "text-gray-300")
                : activeTab === "pending" ? (isLight ? "text-yellow-900" : "text-yellow-300")
                : activeTab === "approved" ? (isLight ? "text-blue-900" : "text-blue-300")
                : activeTab === "partial" ? (isLight ? "text-purple-900" : "text-purple-300")
                : activeTab === "received" ? (isLight ? "text-green-900" : "text-green-300")
                : (isLight ? "text-red-900" : "text-red-300")
              }`}>
                {activeTab === "draft" && "Órdenes en Borrador"}
                {activeTab === "pending" && "Órdenes Pendientes de Aprobación"}
                {activeTab === "approved" && "Órdenes Aprobadas"}
                {activeTab === "partial" && "Órdenes con Recepción Parcial"}
                {activeTab === "received" && "Órdenes Recibidas Completamente"}
                {activeTab === "cancelled" && "Órdenes Canceladas"}
              </p>
              <p className={`text-xs mt-0.5 ${
                activeTab === "draft" ? (isLight ? "text-gray-700" : "text-gray-400")
                : activeTab === "pending" ? (isLight ? "text-yellow-700" : "text-yellow-400")
                : activeTab === "approved" ? (isLight ? "text-blue-700" : "text-blue-400")
                : activeTab === "partial" ? (isLight ? "text-purple-700" : "text-purple-400")
                : activeTab === "received" ? (isLight ? "text-green-700" : "text-green-400")
                : (isLight ? "text-red-700" : "text-red-400")
              }`}>
                {activeTab === "draft" && "Estas órdenes están en borrador y no han sido enviadas. Usa el botón 'Enviar' para enviarlas al proveedor."}
                {activeTab === "pending" && "Estas órdenes han sido enviadas y están esperando aprobación. Puedes aprobarlas o rechazarlas."}
                {activeTab === "approved" && "Estas órdenes han sido aprobadas y están listas para recibir la mercancía."}
                {activeTab === "partial" && "Estas órdenes tienen recepción parcial de mercancía. Falta recibir algunos items."}
                {activeTab === "received" && "Estas órdenes han sido recibidas completamente."}
                {activeTab === "cancelled" && "Estas órdenes fueron canceladas y no se procesarán."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabla de Órdenes ── */}
        <div className={`rounded-lg border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className={`text-xs font-semibold uppercase tracking-wider border-b ${
                  isLight ? "bg-gray-100 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"
                }`}>
                  {/* Checkbox - Solo en tabs con acciones masivas */}
                  {(activeTab === "draft" || activeTab === "pending") && (
                    <th className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredOrders.length && filteredOrders.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="px-3 py-2 text-left whitespace-nowrap">N° Orden</th>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Entrega</th>
                  <th className="px-3 py-2 text-left">Proveedor</th>
                  <th className="px-3 py-2 text-left">RUC</th>
                  <th className="px-3 py-2 text-right whitespace-nowrap">Total</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      className={`border-t transition-colors relative ${
                        isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/5"
                      }`}
                    >
                      {/* Checkbox - Solo en tabs con acciones masivas */}
                      {(activeTab === "draft" || activeTab === "pending") && (
                        <td className="px-3 py-1.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(order.id)}
                            onChange={(e) => handleSelectOne(order.id, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </td>
                      )}

                      {/* N° Orden con barra naranja en el primer item */}
                      <td className="px-3 py-1.5 relative">
                        {index === 0 && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                        )}
                        <div className={`font-mono font-semibold text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                          {order.orderNumber}
                        </div>
                      </td>

                      <td className={`px-3 py-1.5 text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {new Date(order.date).toLocaleDateString("es-EC")}
                      </td>
                      
                      <td className={`px-3 py-1.5 text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {new Date(order.deliveryDate).toLocaleDateString("es-EC")}
                      </td>

                      <td className="px-3 py-1.5">
                        <div className={`font-medium text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                          {order.supplier.name}
                        </div>
                        {order.supplier.email && (
                          <div className={`text-[10px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                            {order.supplier.email}
                          </div>
                        )}
                      </td>

                      <td className={`px-3 py-1.5 text-xs font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {order.supplier.ruc}
                      </td>

                      <td className={`px-3 py-1.5 text-right font-mono font-semibold text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                        ${order.total.toFixed(2)}
                      </td>

                      <td className="px-3 py-1.5 text-center">
                        {order.status === "draft" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLight ? "bg-gray-100 text-gray-700" : "bg-gray-500/20 text-gray-400"
                          }`}>
                            <FileText className="w-3 h-3" />
                            Borrador
                          </span>
                        )}
                        {order.status === "pending" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        )}
                        {order.status === "approved" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-400"
                          }`}>
                            <CheckCircle className="w-3 h-3" />
                            Aprobada
                          </span>
                        )}
                        {order.status === "partial" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLight ? "bg-purple-100 text-purple-700" : "bg-purple-500/20 text-purple-400"
                          }`}>
                            <Package className="w-3 h-3" />
                            Parcial
                          </span>
                        )}
                        {order.status === "received" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                          }`}>
                            <PackageCheck className="w-3 h-3" />
                            Recibida
                          </span>
                        )}
                        {order.status === "cancelled" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400"
                          }`}>
                            <XCircle className="w-3 h-3" />
                            Cancelada
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-1.5">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(order)}
                            className={`p-1 rounded transition-colors ${
                              isLight ? "hover:bg-gray-200 text-gray-600" : "hover:bg-white/10 text-gray-400"
                            }`}
                            title="Ver detalles"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {activeTab === "draft" && (
                            <>
                              <button
                                onClick={() => handleSend(order.id)}
                                className="p-1 rounded transition-colors hover:bg-blue-500/10 text-blue-500"
                                title="Enviar"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(order.id)}
                                className="p-1 rounded transition-colors hover:bg-red-500/10 text-red-500"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {activeTab === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(order.id)}
                                className="p-1 rounded transition-colors hover:bg-green-500/10 text-green-500"
                                title="Aprobar"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleReject(order.id)}
                                className="p-1 rounded transition-colors hover:bg-red-500/10 text-red-500"
                                title="Rechazar"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}

                          {(activeTab === "approved" || activeTab === "partial") && (
                            <button
                              onClick={() => toast.info("Recepción de mercancía en desarrollo")}
                              className="p-1 rounded transition-colors hover:bg-purple-500/10 text-purple-500"
                              title="Recibir mercancía"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={(activeTab === "draft" || activeTab === "pending") ? 9 : 8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className={`w-12 h-12 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                        <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          No se encontraron órdenes
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          MODAL: Ver Detalles
      ══════════════════════════════════════════════════════════════ */}
      {showViewModal && viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-4xl rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/20"}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                    Orden de Compra: {viewingOrder.orderNumber}
                  </h3>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Creada el {new Date(viewingOrder.date).toLocaleDateString("es-EC")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Info del Proveedor */}
                <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                    PROVEEDOR
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Razón Social:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingOrder.supplier.name}</span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>RUC:</span>
                      <span className={`font-medium font-mono ${isLight ? "text-gray-900" : "text-white"}`}>{viewingOrder.supplier.ruc}</span>
                    </div>
                    {viewingOrder.supplier.contact && (
                      <div>
                        <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Contacto:</span>
                        <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingOrder.supplier.contact}</span>
                      </div>
                    )}
                    {viewingOrder.supplier.email && (
                      <div>
                        <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Email:</span>
                        <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingOrder.supplier.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                    ITEMS ({viewingOrder.items.length})
                  </h4>
                  <div className="space-y-2">
                    {viewingOrder.items.map((item) => (
                      <div key={item.id} className={`p-3 rounded ${isLight ? "bg-white" : "bg-white/5"}`}>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <span className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{item.productName}</span>
                            <span className={`text-xs ml-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}>({item.productCode})</span>
                          </div>
                          <span className={`font-mono font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            ${item.subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          Cant: {item.quantity} × ${item.unitPrice.toFixed(2)} | Desc: ${item.discount.toFixed(2)} | IVA: {item.tax}%
                          {item.receivedQuantity !== undefined && item.receivedQuantity > 0 && (
                            <span className="ml-2 text-green-600">| Recibido: {item.receivedQuantity}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totales */}
                <div className={`rounded-lg border p-4 ${isLight ? "bg-orange-50 border-primary/30" : "bg-primary/10 border-primary/30"}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                    TOTALES
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={isLight ? "text-gray-700" : "text-gray-300"}>Subtotal:</span>
                      <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${viewingOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isLight ? "text-gray-700" : "text-gray-300"}>Descuento:</span>
                      <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${viewingOrder.totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isLight ? "text-gray-700" : "text-gray-300"}>IVA:</span>
                      <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${viewingOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between pt-2 border-t ${isLight ? "border-primary/20" : "border-white/20"}`}>
                      <span className={`font-bold ${isLight ? "text-darkBg" : "text-white"}`}>TOTAL:</span>
                      <span className="font-mono font-bold text-lg text-primary">${viewingOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-end px-6 py-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button
                onClick={() => setShowViewModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: Nueva Orden (Wizard)
      ══════════════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <PurchaseOrderWizard
          onClose={() => setShowCreateModal(false)}
          onCreate={(newOrder) => setOrders([newOrder, ...orders])}
        />
      )}
    </>
  );
}
