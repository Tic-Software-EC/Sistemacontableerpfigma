import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Printer,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle,
  Ban,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Calendar,
  FileEdit,
  Save,
  User,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

type OrderItem = {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
};

type Order = {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientRuc: string;
  clientAddress: string;
  clientPhone: string;
  date: string;
  deliveryDate: string;
  paymentMethod: "cash" | "credit" | "transfer" | "check";
  paymentTerms: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  status: "draft" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  isActive: boolean;
  createdBy: string;
  createdAt: string;
};

type TabType = "draft" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";

export function SalesOrdersContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("confirmed");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Datos de ejemplo
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      number: "PV-2026-001",
      clientId: "CLI-001",
      clientName: "Distribuidora Nacional S.A.",
      clientRuc: "1792345678001",
      clientAddress: "Av. Amazonas N24-155 y Coruña, Quito",
      clientPhone: "+593 2 2456789",
      date: "2026-03-10",
      deliveryDate: "2026-03-15",
      paymentMethod: "credit",
      paymentTerms: "30 días",
      items: [
        {
          id: "1",
          productCode: "PROD-001",
          productName: "Laptop Dell Inspiron 15",
          quantity: 5,
          unitPrice: 850.00,
          discount: 0,
          subtotal: 4250.00,
        }
      ],
      subtotal: 4250.00,
      tax: 510.00,
      discount: 0,
      total: 4760.00,
      notes: "Entregar en horario de oficina",
      status: "confirmed",
      isActive: true,
      createdBy: "Juan Pérez",
      createdAt: "2026-03-10T09:30:00",
    },
    {
      id: "2",
      number: "PV-2026-002",
      clientId: "CLI-002",
      clientName: "Comercial El Ahorro Cía. Ltda.",
      clientRuc: "1791234567001",
      clientAddress: "Av. 6 de Diciembre N33-42, Quito",
      clientPhone: "+593 2 2345678",
      date: "2026-03-09",
      deliveryDate: "2026-03-14",
      paymentMethod: "transfer",
      paymentTerms: "Pago anticipado",
      items: [
        {
          id: "1",
          productCode: "PROD-002",
          productName: "Monitor LG 24 pulgadas",
          quantity: 10,
          unitPrice: 310.05,
          discount: 0,
          subtotal: 3100.50,
        }
      ],
      subtotal: 3100.50,
      tax: 372.06,
      discount: 0,
      total: 3472.56,
      notes: "",
      status: "preparing",
      isActive: true,
      createdBy: "María López",
      createdAt: "2026-03-09T14:20:00",
    },
    {
      id: "3",
      number: "PV-2026-003",
      clientId: "CLI-003",
      clientName: "Súper Tiendas La Economía",
      clientRuc: "1790123456001",
      clientAddress: "Av. América N35-87, Quito",
      clientPhone: "+593 2 3456789",
      date: "2026-03-08",
      deliveryDate: "2026-03-12",
      paymentMethod: "cash",
      paymentTerms: "Contado",
      items: [
        {
          id: "1",
          productCode: "PROD-003",
          productName: "Teclado mecánico Logitech",
          quantity: 25,
          unitPrice: 227.23,
          discount: 0,
          subtotal: 5680.75,
        }
      ],
      subtotal: 5680.75,
      tax: 681.69,
      discount: 0,
      total: 6362.44,
      notes: "",
      status: "delivered",
      isActive: true,
      createdBy: "Carlos Ruiz",
      createdAt: "2026-03-08T11:15:00",
    },
    {
      id: "4",
      number: "PV-2026-004",
      clientId: "CLI-004",
      clientName: "Almacenes Pérez & Asociados",
      clientRuc: "1789012345001",
      clientAddress: "Av. Patria E4-123, Quito",
      clientPhone: "+593 2 4567890",
      date: "2026-03-07",
      deliveryDate: "2026-03-11",
      paymentMethod: "credit",
      paymentTerms: "60 días",
      items: [
        {
          id: "1",
          productCode: "PROD-004",
          productName: "Mouse inalámbrico HP",
          quantity: 50,
          unitPrice: 57.805,
          discount: 0,
          subtotal: 2890.25,
        }
      ],
      subtotal: 2890.25,
      tax: 346.83,
      discount: 0,
      total: 3237.08,
      notes: "",
      status: "shipped",
      isActive: true,
      createdBy: "Ana Torres",
      createdAt: "2026-03-07T16:45:00",
    },
    {
      id: "5",
      number: "PV-2026-005",
      clientId: "CLI-005",
      clientName: "Grupo Comercial Andino",
      clientRuc: "1788901234001",
      clientAddress: "Av. González Suárez N27-142, Quito",
      clientPhone: "+593 2 5678901",
      date: "2026-03-06",
      deliveryDate: "2026-03-10",
      paymentMethod: "cash",
      paymentTerms: "Contado",
      items: [
        {
          id: "1",
          productCode: "PROD-005",
          productName: "Impresora HP LaserJet",
          quantity: 3,
          unitPrice: 2040.00,
          discount: 0,
          subtotal: 6120.00,
        }
      ],
      subtotal: 6120.00,
      tax: 734.40,
      discount: 0,
      total: 6854.40,
      notes: "Cliente solicitó cancelación por problemas presupuestarios",
      status: "cancelled",
      isActive: false,
      createdBy: "Diego Morales",
      createdAt: "2026-03-06T10:00:00",
    },
  ]);

  // Filtros
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientRuc.includes(searchTerm);
    const matchesTab = order.status === activeTab;
    
    let matchesDate = true;
    if (dateFrom && dateTo) {
      const orderDate = new Date(order.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      matchesDate = orderDate >= fromDate && orderDate <= toDate;
    }
    
    return matchesSearch && matchesTab && matchesDate;
  });

  // Contadores
  const counts = {
    draft: orders.filter((o) => o.status === "draft").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  // Funciones
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredOrders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOrders.map((o) => o.id)));
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

  const handleActivateSelected = () => {
    if (selectedIds.size === 0) return;
    setOrders((prev) =>
      prev.map((order) =>
        selectedIds.has(order.id) ? { ...order, isActive: true } : order
      )
    );
    setSelectedIds(new Set());
    alert(`${selectedIds.size} pedido(s) activado(s) exitosamente`);
  };

  const handleDeactivateSelected = () => {
    if (selectedIds.size === 0) return;
    setOrders((prev) =>
      prev.map((order) =>
        selectedIds.has(order.id) ? { ...order, isActive: false } : order
      )
    );
    setSelectedIds(new Set());
    alert(`${selectedIds.size} pedido(s) desactivado(s) exitosamente`);
  };

  const handleDelete = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (confirm(`¿Está seguro de eliminar el pedido ${order?.number}?`)) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      alert("Pedido eliminado exitosamente");
    }
  };

  const handleExportCSV = () => {
    const headers = ["# Pedido", "Cliente", "RUC", "Fecha", "Fecha Entrega", "Subtotal", "IVA", "Total", "Estado"];
    const rows = filteredOrders.map(order => [
      order.number,
      order.clientName,
      order.clientRuc,
      order.date,
      order.deliveryDate,
      order.subtotal.toFixed(2),
      order.tax.toFixed(2),
      order.total.toFixed(2),
      getStatusConfig(order.status).label,
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pedidos_venta_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Listado de Pedidos de Venta</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #E8692E; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #0D1B2A; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Listado de Pedidos de Venta</h1>
          <p>Fecha de impresión: ${new Date().toLocaleString('es-EC')}</p>
          <table>
            <thead>
              <tr>
                <th># Pedido</th>
                <th>Cliente</th>
                <th>RUC</th>
                <th>Fecha</th>
                <th>Entrega</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => `
                <tr>
                  <td>${order.number}</td>
                  <td>${order.clientName}</td>
                  <td>${order.clientRuc}</td>
                  <td>${new Date(order.date).toLocaleDateString('es-EC')}</td>
                  <td>${new Date(order.deliveryDate).toLocaleDateString('es-EC')}</td>
                  <td>$${order.total.toFixed(2)}</td>
                  <td>${getStatusConfig(order.status).label}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleConfirmOrders = () => {
    if (selectedIds.size === 0) {
      alert("Por favor seleccione al menos un pedido");
      return;
    }
    
    setOrders((prev) =>
      prev.map((order) =>
        selectedIds.has(order.id) && order.status === "draft"
          ? { ...order, status: "confirmed" }
          : order
      )
    );
    setSelectedIds(new Set());
    alert(`${selectedIds.size} pedido(s) confirmado(s) exitosamente`);
  };

  const getStatusConfig = (status: Order["status"]) => {
    switch (status) {
      case "draft":
        return {
          label: "Borrador",
          color: isLight ? "bg-gray-100 text-gray-700" : "bg-gray-900/30 text-gray-400",
          icon: FileEdit,
        };
      case "confirmed":
        return {
          label: "Confirmado",
          color: isLight ? "bg-blue-100 text-blue-700" : "bg-blue-900/30 text-blue-400",
          icon: CheckCircle,
        };
      case "preparing":
        return {
          label: "En Preparación",
          color: isLight ? "bg-orange-100 text-orange-700" : "bg-orange-900/30 text-orange-400",
          icon: Package,
        };
      case "shipped":
        return {
          label: "Despachado",
          color: isLight ? "bg-purple-100 text-purple-700" : "bg-purple-900/30 text-purple-400",
          icon: Truck,
        };
      case "delivered":
        return {
          label: "Entregado",
          color: isLight ? "bg-green-100 text-green-700" : "bg-green-900/30 text-green-400",
          icon: CheckCircle2,
        };
      case "cancelled":
        return {
          label: "Cancelado",
          color: isLight ? "bg-red-100 text-red-700" : "bg-red-900/30 text-red-400",
          icon: XCircle,
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Tabs Horizontales ── */}
      <div className={`flex items-center border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <button
          onClick={() => setActiveTab("draft")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "draft"
              ? "border-primary text-primary"
              : isLight
              ? "border-transparent text-gray-500 hover:text-gray-700"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <FileEdit className="w-4 h-4" />
          Borrador
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === "draft"
              ? "bg-primary/10 text-primary"
              : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
          }`}>
            {counts.draft}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("confirmed")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "confirmed"
              ? "border-primary text-primary"
              : isLight
              ? "border-transparent text-gray-500 hover:text-gray-700"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Confirmados
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === "confirmed"
              ? "bg-primary/10 text-primary"
              : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
          }`}>
            {counts.confirmed}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("preparing")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "preparing"
              ? "border-primary text-primary"
              : isLight
              ? "border-transparent text-gray-500 hover:text-gray-700"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <Package className="w-4 h-4" />
          En Preparación
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === "preparing"
              ? "bg-primary/10 text-primary"
              : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
          }`}>
            {counts.preparing}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("shipped")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "shipped"
              ? "border-primary text-primary"
              : isLight
              ? "border-transparent text-gray-500 hover:text-gray-700"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <Truck className="w-4 h-4" />
          Despachados
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === "shipped"
              ? "bg-primary/10 text-primary"
              : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
          }`}>
            {counts.shipped}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("delivered")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "delivered"
              ? "border-primary text-primary"
              : isLight
              ? "border-transparent text-gray-500 hover:text-gray-700"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Entregados
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === "delivered"
              ? "bg-primary/10 text-primary"
              : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
          }`}>
            {counts.delivered}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("cancelled")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "cancelled"
              ? "border-primary text-primary"
              : isLight
              ? "border-transparent text-gray-500 hover:text-gray-700"
              : "border-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          <XCircle className="w-4 h-4" />
          Cancelados
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === "cancelled"
              ? "bg-primary/10 text-primary"
              : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
          }`}>
            {counts.cancelled}
          </span>
        </button>
      </div>

      {/* ── Fila de Filtros y Acciones ── */}
      <div className="flex items-center gap-3">
        {/* Buscador */}
        <div className="relative flex-1 max-w-xs">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
          <input
            type="text"
            placeholder="Buscar número, cliente, RUC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-sm border transition-colors ${
              isLight
                ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`}
          />
        </div>

        {/* Selector de fecha desde */}
        <div className="relative">
          <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={`w-40 pl-9 pr-3 py-1.5 rounded-lg text-sm border transition-colors ${
              isLight
                ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
                : "bg-[#0f1825] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`}
          />
        </div>

        {/* Separador */}
        <span className={isLight ? "text-gray-400" : "text-gray-500"}>—</span>

        {/* Selector de fecha hasta */}
        <div className="relative">
          <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={`w-40 pl-9 pr-3 py-1.5 rounded-lg text-sm border transition-colors ${
              isLight
                ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
                : "bg-[#0f1825] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
            }`}
          />
        </div>

        <div className="flex-1"></div>

        {/* Botón Confirmar */}
        {activeTab === "draft" && (
          <button
            onClick={handleConfirmOrders}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <CheckCircle className="w-4 h-4" />
            Confirmar
          </button>
        )}

        {/* Botón Nuevo Pedido */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Pedido
        </button>

        {/* Botón CSV */}
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

        {/* Botón Imprimir */}
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

      {/* ── Barra de Acciones Masivas (solo visible cuando hay selección) ── */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between gap-3">
          <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            {selectedIds.size} seleccionado(s)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleActivateSelected}
              disabled={selectedIds.size === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${
                selectedIds.size === 0
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Activar
            </button>
            <button
              onClick={handleDeactivateSelected}
              disabled={selectedIds.size === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${
                selectedIds.size === 0
                  ? "bg-red-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <Ban className="w-4 h-4" />
              Desactivar
            </button>
          </div>
        </div>
      )}

      {/* ── Tabla ── */}
      <div className={`rounded-xl border overflow-hidden ${
        isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isLight ? "bg-gray-50" : "bg-[#0D1B2A]"}>
              <tr>
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  # Pedido
                </th>
                <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Cliente
                </th>
                <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  RUC
                </th>
                <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Fecha
                </th>
                <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Entrega
                </th>
                <th className={`px-4 py-3 text-right text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Total
                </th>
                <th className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Estado
                </th>
                <th className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const isSelected = selectedIds.has(order.id);

                return (
                  <tr
                    key={order.id}
                    className={`relative ${
                      isSelected
                        ? isLight
                          ? "bg-blue-50"
                          : "bg-blue-900/20"
                        : isLight
                        ? "hover:bg-gray-50"
                        : "hover:bg-white/5"
                    } ${!order.isActive ? "opacity-50" : ""}`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    )}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(order.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className={`px-4 py-3 text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      {order.number}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      {order.clientName}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {order.clientRuc}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {new Date(order.date).toLocaleDateString("es-EC")}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {new Date(order.deliveryDate).toLocaleDateString("es-EC")}
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold text-right ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowViewModal(true);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight
                              ? "text-blue-600 hover:bg-blue-50"
                              : "text-blue-400 hover:bg-blue-900/20"
                          }`}
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowEditModal(true);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight
                              ? "text-orange-600 hover:bg-orange-50"
                              : "text-orange-400 hover:bg-orange-900/20"
                          }`}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight
                              ? "text-red-600 hover:bg-red-50"
                              : "text-red-400 hover:bg-red-900/20"
                          }`}
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
              <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                No se encontraron pedidos en esta categoría
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Ver Pedido ── */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${isLight ? "bg-white" : "bg-[#1a2936]"}`}>
            {/* Header */}
            <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${isLight ? "bg-white border-gray-200" : "bg-[#1a2936] border-white/10"}`}>
              <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Pedido {selectedOrder.number}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
              >
                <X className={`w-5 h-5 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Información del Cliente */}
              <div>
                <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <User className="w-4 h-4" />
                  Información del Cliente
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cliente</label>
                    <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>{selectedOrder.clientName}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>RUC</label>
                    <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>{selectedOrder.clientRuc}</p>
                  </div>
                  <div className="col-span-2">
                    <label className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Dirección</label>
                    <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>{selectedOrder.clientAddress}</p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Teléfono</label>
                    <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>{selectedOrder.clientPhone}</p>
                  </div>
                </div>
              </div>

              {/* Información del Pedido */}
              <div>
                <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <ShoppingCart className="w-4 h-4" />
                  Información del Pedido
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha</label>
                    <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                      {new Date(selectedOrder.date).toLocaleDateString("es-EC")}
                    </p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha de Entrega</label>
                    <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                      {new Date(selectedOrder.deliveryDate).toLocaleDateString("es-EC")}
                    </p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Método de Pago</label>
                    <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                      {selectedOrder.paymentMethod === "cash" ? "Efectivo" : 
                       selectedOrder.paymentMethod === "credit" ? "Crédito" :
                       selectedOrder.paymentMethod === "transfer" ? "Transferencia" : "Cheque"}
                    </p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Condiciones de Pago</label>
                    <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>{selectedOrder.paymentTerms}</p>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>Productos</h4>
                <div className={`rounded-lg border overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <table className="w-full">
                    <thead className={isLight ? "bg-gray-50" : "bg-[#0D1B2A]"}>
                      <tr>
                        <th className={`px-3 py-2 text-left text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Código</th>
                        <th className={`px-3 py-2 text-left text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Producto</th>
                        <th className={`px-3 py-2 text-right text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cant.</th>
                        <th className={`px-3 py-2 text-right text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>P. Unit</th>
                        <th className={`px-3 py-2 text-right text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/10"}`}>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className={`px-3 py-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.productCode}</td>
                          <td className={`px-3 py-2 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{item.productName}</td>
                          <td className={`px-3 py-2 text-sm text-right ${isLight ? "text-gray-900" : "text-white"}`}>{item.quantity}</td>
                          <td className={`px-3 py-2 text-sm text-right ${isLight ? "text-gray-900" : "text-white"}`}>${item.unitPrice.toFixed(2)}</td>
                          <td className={`px-3 py-2 text-sm font-medium text-right ${isLight ? "text-gray-900" : "text-white"}`}>${item.subtotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={isLight ? "text-gray-600" : "text-gray-400"}>Subtotal:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={isLight ? "text-gray-600" : "text-gray-400"}>IVA (12%):</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between text-base font-bold pt-2 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <span className={isLight ? "text-gray-900" : "text-white"}>TOTAL:</span>
                    <span className="text-primary">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {selectedOrder.notes && (
                <div>
                  <label className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Notas</label>
                  <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`sticky bottom-0 flex justify-end gap-3 p-6 border-t ${isLight ? "bg-white border-gray-200" : "bg-[#1a2936] border-white/10"}`}>
              <button
                onClick={() => setShowViewModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLight
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Editar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar - Placeholder */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl p-6 max-w-md w-full ${isLight ? "bg-white" : "bg-[#1a2936]"}`}>
            <h3 className={`text-lg font-bold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
              {showCreateModal ? "Nuevo Pedido de Venta" : "Editar Pedido de Venta"}
            </h3>
            <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Formulario completo en desarrollo. Esta funcionalidad incluirá:
            </p>
            <ul className={`text-sm mb-4 space-y-1 list-disc list-inside ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              <li>Selección de cliente</li>
              <li>Agregar productos con cantidad y precio</li>
              <li>Cálculo automático de totales</li>
              <li>Condiciones de pago</li>
              <li>Fecha de entrega</li>
            </ul>
            <button
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
              }}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
