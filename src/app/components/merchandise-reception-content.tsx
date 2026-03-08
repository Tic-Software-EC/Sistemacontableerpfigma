import { useState } from "react";
import { Package, Search, Calendar, Eye, CheckCircle, XCircle, Clock, AlertTriangle, Filter, Plus, X, Printer, Download, Truck, User, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Warehouse, ShoppingCart, Save, Edit } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../contexts/theme-context";

// Usuario logueado (esto vendría del contexto de autenticación)
const LOGGED_USER = {
  name: "María López Contreras",
  role: "administrador",
  email: "maria.lopez@empresa.com"
};

interface ReceptionItem {
  productCode: string;
  productName: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
  warehouse: string; // Bodega específica para este producto
  condition: "good" | "damaged" | "incomplete"; // Estado del producto
  notes?: string; // Notas específicas por producto
}

interface Reception {
  id: string;
  receptionNumber: string;
  purchaseOrder: string;
  supplier: string;
  receptionDate: string;
  receivedBy: string;
  status: "pending" | "completed" | "partial" | "rejected";
  statusLabel: string;
  items: ReceptionItem[];
  totalItems: number;
  receivedItems: number;
  notes: string;
  warehouse?: string;
  inventoryProcessed?: boolean;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  items: {
    productCode: string;
    productName: string;
    orderedQty: number;
    unit: string;
  }[];
}

const MOCK_WAREHOUSES = [
  { id: "bod-001", name: "Bodega Principal - Matriz" },
  { id: "bod-002", name: "Bodega Secundaria - Sucursal Norte" },
  { id: "bod-003", name: "Bodega de Tránsito" },
  { id: "bod-004", name: "Bodega de Productos Terminados" },
];

const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "oc-001",
    orderNumber: "OC-2026-001",
    supplier: "Distribuidora Nacional S.A.",
    items: [
      { productCode: "PROD-001", productName: "Laptop Dell Inspiron 15", orderedQty: 5, unit: "Unidad" },
      { productCode: "PROD-002", productName: "Mouse Inalámbrico Logitech M185", orderedQty: 10, unit: "Unidad" },
      { productCode: "PROD-003", productName: "Teclado Mecánico RGB Gamer", orderedQty: 10, unit: "Unidad" },
      { productCode: "PROD-004", productName: "Monitor LG 24 pulgadas Full HD", orderedQty: 5, unit: "Unidad" },
    ]
  },
  {
    id: "oc-004",
    orderNumber: "OC-2026-004",
    supplier: "TechSupply Corp.",
    items: [
      { productCode: "PROD-020", productName: "Router Cisco 2900", orderedQty: 3, unit: "Unidad" },
      { productCode: "PROD-021", productName: "Switch 24 puertos Gigabit", orderedQty: 5, unit: "Unidad" },
    ]
  },
];

const MOCK_RECEPTIONS: Reception[] = [
  {
    id: "rec-001",
    receptionNumber: "REC-2026-001",
    purchaseOrder: "OC-2026-001",
    supplier: "Distribuidora Nacional S.A.",
    receptionDate: "2026-02-18",
    receivedBy: "Carlos Mendoza",
    status: "completed",
    statusLabel: "Completado",
    totalItems: 4,
    receivedItems: 4,
    notes: "Mercadería recibida en perfecto estado",
    items: [
      { productCode: "PROD-001", productName: "Laptop Dell Inspiron 15", orderedQty: 5, receivedQty: 5, unit: "Unidad", warehouse: "bod-001", condition: "good" },
      { productCode: "PROD-002", productName: "Mouse Inalámbrico Logitech M185", orderedQty: 10, receivedQty: 10, unit: "Unidad", warehouse: "bod-001", condition: "good" },
      { productCode: "PROD-003", productName: "Teclado Mecánico RGB Gamer", orderedQty: 10, receivedQty: 10, unit: "Unidad", warehouse: "bod-001", condition: "good" },
      { productCode: "PROD-004", productName: "Monitor LG 24 pulgadas Full HD", orderedQty: 5, receivedQty: 5, unit: "Unidad", warehouse: "bod-001", condition: "good" },
    ]
  },
  {
    id: "rec-002",
    receptionNumber: "REC-2026-002",
    purchaseOrder: "OC-2026-002",
    supplier: "Kreafast",
    receptionDate: "2026-02-19",
    receivedBy: "Ana Torres",
    status: "partial",
    statusLabel: "Parcial",
    totalItems: 3,
    receivedItems: 2,
    notes: "Faltan 2 unidades del producto PROD-007",
    items: [
      { productCode: "PROD-005", productName: "Resma papel bond A4", orderedQty: 20, receivedQty: 20, unit: "Unidad", warehouse: "bod-002", condition: "good" },
      { productCode: "PROD-006", productName: "Marcadores permanentes x12", orderedQty: 15, receivedQty: 15, unit: "Caja", warehouse: "bod-002", condition: "good" },
      { productCode: "PROD-007", productName: "Archivador de palanca", orderedQty: 10, receivedQty: 8, unit: "Unidad", warehouse: "bod-002", condition: "incomplete" },
    ]
  },
  {
    id: "rec-003",
    receptionNumber: "REC-2026-003",
    purchaseOrder: "OC-2026-003",
    supplier: "Tecnología Avanzada S.A.",
    receptionDate: "2026-02-20",
    receivedBy: "Luis Ramírez",
    status: "pending",
    statusLabel: "Pendiente",
    totalItems: 2,
    receivedItems: 0,
    notes: "Pendiente de recepción",
    items: [
      { productCode: "PROD-011", productName: "Impresora multifunción", orderedQty: 3, receivedQty: 0, unit: "Unidad", warehouse: "bod-003", condition: "good" },
      { productCode: "PROD-015", productName: "Cable UTP Cat6 x305m", orderedQty: 5, receivedQty: 0, unit: "Rollo", warehouse: "bod-003", condition: "good" },
    ]
  },
];

export function MerchandiseReceptionContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // Estilos adaptativos
  const txt = isLight ? "text-gray-900" : "text-white";
  const txtSub = isLight ? "text-gray-600" : "text-gray-400";
  const bg = isLight ? "bg-white" : "bg-white/5";
  const bgHover = isLight ? "hover:bg-gray-50" : "hover:bg-white/10";
  const border = isLight ? "border-gray-200" : "border-white/10";
  const inputBg = isLight ? "bg-white" : "bg-white/5";
  const inputBorder = isLight ? "border-gray-300" : "border-white/10";
  const inputText = isLight ? "text-gray-900" : "text-white";
  const placeholder = isLight ? "placeholder-gray-400" : "placeholder-gray-500";
  const modal = isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10";
  const headerBg = isLight ? "bg-gray-50" : "bg-white/5";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReception, setSelectedReception] = useState<Reception | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados para nueva recepción
  const [showNewReceptionModal, setShowNewReceptionModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<string>("");
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");
  const [receptionDate, setReceptionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [receivedBy, setReceivedBy] = useState<string>(LOGGED_USER.name);
  const [generalNotes, setGeneralNotes] = useState<string>("");
  const [receptionItems, setReceptionItems] = useState<ReceptionItem[]>([]);
  const [step, setStep] = useState<1 | 2>(1); // 1: Seleccionar OC y productos, 2: Confirmar e ingresar a inventario
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingReceptionId, setEditingReceptionId] = useState<string | null>(null);

  const filteredReceptions = MOCK_RECEPTIONS.filter(reception => {
    const matchesSearch = searchTerm === "" ||
      reception.receptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.purchaseOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || reception.status === filterStatus;
    const matchesSupplier = filterSupplier === "all" || reception.supplier === filterSupplier;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const uniqueSuppliers = Array.from(new Set(MOCK_RECEPTIONS.map(r => r.supplier)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border border-green-500/20 text-green-400";
      case "partial":
        return "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400";
      case "pending":
        return "bg-blue-500/10 border border-blue-500/20 text-blue-400";
      case "rejected":
        return "bg-red-500/10 border border-red-500/20 text-red-400";
      default:
        return "bg-white/5 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "partial":
        return <AlertTriangle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "good":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-xs font-medium">Bueno</span>;
      case "damaged":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs font-medium">Dañado</span>;
      case "incomplete":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded text-xs font-medium">Incompleto</span>;
      default:
        return null;
    }
  };

  const handleViewDetail = (reception: Reception) => {
    setSelectedReception(reception);
    setShowDetailModal(true);
  };

  // Funciones para nueva recepción
  const handleOpenNewReception = () => {
    setShowNewReceptionModal(true);
    setSelectedPO("");
    setSelectedWarehouse("");
    setReceptionItems([]);
    setGeneralNotes("");
    setStep(1);
    setIsEditMode(false);
    setEditingReceptionId(null);
  };

  const handleSelectPO = (poId: string) => {
    setSelectedPO(poId);
    const po = MOCK_PURCHASE_ORDERS.find(p => p.id === poId);
    if (po) {
      // Inicializar items de recepción con los productos de la OC
      const items: ReceptionItem[] = po.items.map(item => ({
        productCode: item.productCode,
        productName: item.productName,
        orderedQty: item.orderedQty,
        receivedQty: item.orderedQty, // Por defecto, todo recibido
        unit: item.unit,
        warehouse: "", // Inicialmente vacío, se llenará en el paso 2
        condition: "good" // Estado por defecto: Bueno
      }));
      setReceptionItems(items);
    }
  };

  const handleUpdateReceptionItem = (index: number, field: keyof ReceptionItem, value: any) => {
    const updatedItems = [...receptionItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setReceptionItems(updatedItems);
  };

  const handleProcessReception = () => {
    // Validar que los productos que se están recibiendo (qty > 0) tengan bodega asignada
    const itemsToReceive = receptionItems.filter(item => item.receivedQty > 0);
    const allReceivedProductsHaveWarehouse = itemsToReceive.every(item => item.warehouse !== "");
    
    if (itemsToReceive.length === 0) {
      toast.error("Debes recibir al menos un producto para procesar la recepción.");
      return;
    }
    
    if (!allReceivedProductsHaveWarehouse) {
      toast.error("Todos los productos con cantidad recibida mayor a 0 deben tener una bodega asignada.");
      return;
    }
    
    // Calcular estado de la recepción
    const totalOrdered = receptionItems.reduce((sum, item) => sum + item.orderedQty, 0);
    const totalReceived = receptionItems.reduce((sum, item) => sum + item.receivedQty, 0);
    const hasPartialProducts = receptionItems.some(item => item.receivedQty > 0 && item.receivedQty < item.orderedQty);
    const hasZeroProducts = receptionItems.some(item => item.receivedQty === 0);
    
    let receptionStatus = "";
    if (totalReceived === totalOrdered && !hasPartialProducts) {
      receptionStatus = "✅ Recepción COMPLETA";
    } else if (totalReceived > 0 && (hasPartialProducts || hasZeroProducts)) {
      receptionStatus = "⚠️ Recepción PARCIAL";
    } else if (totalReceived === 0) {
      receptionStatus = "⏳ Recepción PENDIENTE";
    }
    
    console.log("Procesando recepción:", {
      selectedPO,
      receptionDate,
      receivedBy,
      generalNotes,
      receptionItems,
      totalOrdered,
      totalReceived,
      receptionStatus
    });
    
    // Crear un resumen de bodegas afectadas
    const warehousesSummary = itemsToReceive.reduce((acc, item) => {
      const warehouse = MOCK_WAREHOUSES.find(w => w.id === item.warehouse);
      if (warehouse && !acc.includes(warehouse.name)) {
        acc.push(warehouse.name);
      }
      return acc;
    }, [] as string[]);
    
    // Crear resumen de productos no recibidos o parciales
    const pendingItems = receptionItems.filter(item => item.receivedQty < item.orderedQty);
    const pendingMessage = pendingItems.length > 0 
      ? `\\n\\n⚠️ Productos pendientes o parciales:\\n${pendingItems.map(item => `  • ${item.productName}: Faltante ${item.orderedQty - item.receivedQty} ${item.unit}`).join('\\n')}`
      : '';
    
    toast.success("Recepción procesada exitosamente. La mercadería ha sido registrada en el inventario.");
    setShowNewReceptionModal(false);
  };

  const handleEditReception = (reception: Reception) => {
    setShowNewReceptionModal(true);
    setIsEditMode(true);
    setEditingReceptionId(reception.id);
    setSelectedPO(reception.purchaseOrder);
    setReceptionDate(reception.receptionDate);
    setReceivedBy(reception.receivedBy);
    setGeneralNotes(reception.notes);
    setReceptionItems(reception.items);
    setStep(1);
  };

  const canProceedToStep2 = selectedPO && receptionItems.length > 0 && receptionItems.filter(item => item.receivedQty > 0).every(item => item.warehouse !== "");
  const canProcessReception = canProceedToStep2;

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReceptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReceptions.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2" onClick={handleOpenNewReception}>
            <Plus className="w-5 h-5" />
            Nueva Recepción
          </button>
        </div>
      </div>

      {/* Separador */}
      <div className={`border-t ${border}`}></div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Buscar */}
        <div className="relative">
          <Search className={`w-4 h-4 ${txtSub} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
          <input
            type="text"
            placeholder="Buscar recepción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${inputBorder} rounded-lg ${inputText} text-sm ${placeholder} focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all`}
          />
        </div>

        {/* Estado */}
        <div className="relative">
          <Filter className={`w-4 h-4 ${txtSub} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${inputBorder} rounded-lg ${inputText} text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer`}
          >
            <option value="all">Todos los estados</option>
            <option value="completed">Completado</option>
            <option value="partial">Parcial</option>
            <option value="pending">Pendiente</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>

        {/* Proveedor */}
        <div className="relative">
          <Truck className={`w-4 h-4 ${txtSub} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
          <select
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${inputBorder} rounded-lg ${inputText} text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer`}
          >
            <option value="all">Todos los proveedores</option>
            {uniqueSuppliers.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de recepciones */}
      <div className={`${bg} border ${border} rounded-2xl overflow-hidden`}>
        {filteredReceptions.length === 0 ? (
          <div className="p-12 text-center">
            <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Package className={`w-8 h-8 ${txtSub}`} />
            </div>
            <p className={`${txtSub} mb-2`}>No se encontraron recepciones</p>
            <p className={`${txtSub} text-sm`}>
              Intenta ajustar los filtros o crea una nueva recepción
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${headerBg} border-b ${border}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Nº Recepción
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Orden de Compra
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Proveedor
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Fecha
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Recibido por
                  </th>
                  <th className={`px-6 py-4 text-center text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Items
                  </th>
                  <th className={`px-6 py-4 text-center text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Estado
                  </th>
                  <th className={`px-6 py-4 text-center text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/5"}`}>
                {currentItems.map((reception) => (
                  <tr key={reception.id} className={`${isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"} transition-colors`}>
                    {/* Número de Recepción */}
                    <td className="px-6 py-3">
                      <span className={`${txt} font-bold font-mono`}>{reception.receptionNumber}</span>
                    </td>

                    {/* Orden de Compra */}
                    <td className="px-6 py-3">
                      <span className={`${txt} text-sm font-mono`}>{reception.purchaseOrder}</span>
                    </td>

                    {/* Proveedor */}
                    <td className="px-6 py-3">
                      <span className={`${txt} text-sm`}>{reception.supplier}</span>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-3">
                      <span className={`${txt} text-sm`}>
                        {new Date(reception.receptionDate).toLocaleDateString("es-EC")}
                      </span>
                    </td>

                    {/* Recibido por */}
                    <td className="px-6 py-3">
                      <span className={`${txt} text-sm`}>{reception.receivedBy}</span>
                    </td>

                    {/* Items */}
                    <td className="px-6 py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`${txt} font-bold`}>{reception.receivedItems}/{reception.totalItems}</span>
                        <span className={`${txtSub} text-xs`}>productos</span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(reception.status)}`}>
                        {getStatusIcon(reception.status)}
                        {reception.statusLabel}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {(reception.status === "pending" || reception.status === "partial") && (
                          <button
                            onClick={() => handleEditReception(reception)}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="Editar / Completar recepción"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleViewDetail(reception)}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {filteredReceptions.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Información de registros */}
          <div className="text-gray-400 text-sm">
            Mostrando <span className="text-white font-medium">{indexOfFirstItem + 1}</span> a{" "}
            <span className="text-white font-medium">{Math.min(indexOfLastItem, filteredReceptions.length)}</span> de{" "}
            <span className="text-white font-medium">{filteredReceptions.length}</span> recepciones
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
      {showDetailModal && selectedReception && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl ${modal} rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}>
            {/* Header del modal */}
            <div className={`sticky top-0 ${isLight ? "bg-white" : "bg-secondary"} border-b ${border} px-6 py-4 flex items-center justify-between z-10`}>
              <div>
                <h3 className={`${txt} font-bold text-xl font-mono`}>
                  {selectedReception.receptionNumber}
                </h3>
                <p className={`${txtSub} text-sm mt-1`}>
                  Orden de Compra: {selectedReception.purchaseOrder}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className={`p-2 ${txtSub} ${isLight ? "hover:text-gray-900 hover:bg-gray-100" : "hover:text-white hover:bg-white/5"} rounded-lg transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`${bg} rounded-xl p-4`}>
                  <p className={`${txtSub} text-xs mb-2`}>Proveedor</p>
                  <p className={`${txt} font-medium flex items-center gap-2`}>
                    <Truck className="w-4 h-4 text-primary" />
                    {selectedReception.supplier}
                  </p>
                </div>
                <div className={`${bg} rounded-xl p-4`}>
                  <p className={`${txtSub} text-xs mb-2`}>Fecha de Recepción</p>
                  <p className={`${txt} font-medium flex items-center gap-2`}>
                    <Calendar className="w-4 h-4 text-primary" />
                    {new Date(selectedReception.receptionDate).toLocaleDateString("es-EC")}
                  </p>
                </div>
                <div className={`${bg} rounded-xl p-4`}>
                  <p className={`${txtSub} text-xs mb-2`}>Recibido por</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    {selectedReception.receivedBy}
                  </p>
                </div>
              </div>

              {/* Estado */}
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-gray-400 text-xs mb-2">Estado de la Recepción</p>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedReception.status)}`}>
                  {getStatusIcon(selectedReception.status)}
                  {selectedReception.statusLabel}
                </span>
              </div>

              {/* Productos recibidos */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4">Productos Recibidos</h4>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Producto</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-28">Ordenado</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-28">Recibido</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-24">Faltante</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-32">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase w-48">Bodega</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Notas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {selectedReception.items.map((item, index) => {
                        const faltante = item.orderedQty - item.receivedQty;
                        const warehouse = MOCK_WAREHOUSES.find(w => w.id === item.warehouse);
                        return (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-white text-sm font-medium">{item.productName}</span>
                              <span className="text-gray-400 text-xs font-mono">{item.productCode}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-white text-sm font-mono">{item.orderedQty} {item.unit}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`font-bold text-sm font-mono ${item.receivedQty === item.orderedQty ? "text-green-400" : "text-yellow-400"}`}>
                              {item.receivedQty} {item.unit}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {faltante > 0 ? (
                              <span className="text-red-400 font-bold text-sm flex items-center justify-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {faltante}
                              </span>
                            ) : (
                              <span className="text-green-400 text-sm">✓</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {getConditionBadge(item.condition)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-white text-sm">{warehouse?.name || "-"}</span>
                          </td>
                          <td className="px-4 py-3">
                            {item.notes ? (
                              <span className="text-white text-xs">{item.notes}</span>
                            ) : (
                              <span className="text-gray-500 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notas */}
              {selectedReception.notes && (
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Observaciones</p>
                  <p className="text-white text-sm">{selectedReception.notes}</p>
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
              <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nueva recepción */}
      {showNewReceptionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl ${modal} rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}>
            {/* Header del modal */}
            <div className={`sticky top-0 ${isLight ? "bg-white" : "bg-secondary"} border-b ${border} px-6 py-4 flex items-center justify-between z-10`}>
              <div>
                <h3 className={`${txt} font-bold text-xl font-mono`}>
                  Nueva Recepción
                </h3>
                <p className={`${txtSub} text-sm mt-1`}>
                  Proceso de recepción de mercadería
                </p>
              </div>
              <button
                onClick={() => setShowNewReceptionModal(false)}
                className={`p-2 ${txtSub} ${isLight ? "hover:text-gray-900 hover:bg-gray-100" : "hover:text-white hover:bg-white/5"} rounded-lg transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Paso 1: Seleccionar OC y productos */}
              {step === 1 && (
                <div>
                  <h4 className="text-white font-bold text-lg mb-4">Seleccionar Orden de Compra</h4>
                  <div className="relative">
                    <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={selectedPO}
                      onChange={(e) => handleSelectPO(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Selecciona una OC</option>
                      {MOCK_PURCHASE_ORDERS.map(po => (
                        <option key={po.id} value={po.id}>
                          {po.orderNumber} - {po.supplier}
                        </option>
                      ))}
                    </select>
                  </div>

                  <h4 className="text-white font-bold text-lg mb-4 mt-6">Fecha de Recepción</h4>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={receptionDate}
                      onChange={(e) => setReceptionDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    />
                  </div>

                  <h4 className="text-white font-bold text-lg mb-4 mt-6">Recibido por</h4>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      {receivedBy}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">Usuario logueado actualmente</p>
                  </div>

                  <h4 className="text-white font-bold text-lg mb-4 mt-6">Notas Generales</h4>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <textarea
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      rows={3}
                    />
                  </div>

                  <h4 className="text-white font-bold text-lg mb-4 mt-6">Productos a Recibir</h4>
                  
                  {/* Mensaje informativo sobre recepciones parciales */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-400 font-medium text-sm mb-1">Recepción Parcial Permitida</p>
                        <p className="text-blue-300 text-xs">
                          • Puedes ajustar la cantidad recibida de cada producto (incluso a 0 si no lo recibiste)<br />
                          • Solo los productos con cantidad mayor a 0 necesitan una bodega asignada<br />
                          • Los productos no recibidos (cantidad 0) pueden dejarse sin bodega
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Producto</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-28">Ordenado</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-28">Recibido</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-24">Faltante</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase w-40">Estado</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase w-56">Bodega</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Notas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {receptionItems.map((item, index) => {
                          const faltante = item.orderedQty - item.receivedQty;
                          return (
                          <tr key={index}>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="text-white text-sm font-medium">{item.productName}</span>
                                <span className="text-gray-400 text-xs font-mono">{item.productCode}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-white text-sm font-mono">{item.orderedQty} {item.unit}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="number"
                                value={item.receivedQty}
                                onChange={(e) => handleUpdateReceptionItem(index, "receivedQty", Number(e.target.value))}
                                min="0"
                                max={item.orderedQty}
                                className="w-20 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              {faltante > 0 ? (
                                <span className="text-red-400 font-bold text-sm flex items-center justify-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  {faltante}
                                </span>
                              ) : (
                                <span className="text-green-400 text-sm">✓</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={item.condition}
                                onChange={(e) => handleUpdateReceptionItem(index, "condition", e.target.value as "good" | "damaged" | "incomplete")}
                                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
                                disabled={item.receivedQty === 0}
                              >
                                <option value="good">Bueno</option>
                                <option value="damaged">Dañado</option>
                                <option value="incomplete">Incompleto</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={item.warehouse}
                                onChange={(e) => handleUpdateReceptionItem(index, "warehouse", e.target.value)}
                                className={`w-full px-2 py-1.5 bg-white/5 border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer ${
                                  item.receivedQty > 0 && item.warehouse === "" ? "border-red-500/50" : "border-white/10"
                                }`}
                                disabled={item.receivedQty === 0}
                              >
                                <option value="">{item.receivedQty === 0 ? "No recibido" : "Seleccionar..."}</option>
                                {MOCK_WAREHOUSES.map(w => (
                                  <option key={w.id} value={w.id}>
                                    {w.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={item.notes || ""}
                                onChange={(e) => handleUpdateReceptionItem(index, "notes", e.target.value)}
                                placeholder="Notas del producto..."
                                className="w-full px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                              />
                            </td>
                          </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-end mt-6">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!canProceedToStep2}
                      className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirmar y Procesar
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 2: Confirmar e ingresar a inventario */}
              {step === 2 && (() => {
                // Calcular dinámicamente el estado de la recepción
                const totalOrdered = receptionItems.reduce((sum, item) => sum + item.orderedQty, 0);
                const totalReceived = receptionItems.reduce((sum, item) => sum + item.receivedQty, 0);
                const hasPartialProducts = receptionItems.some(item => item.receivedQty > 0 && item.receivedQty < item.orderedQty);
                const hasZeroProducts = receptionItems.some(item => item.receivedQty === 0);
                
                let currentStatus = "completed";
                let currentStatusLabel = "Completado";
                
                if (totalReceived === 0) {
                  currentStatus = "pending";
                  currentStatusLabel = "Pendiente";
                } else if (hasPartialProducts || hasZeroProducts) {
                  currentStatus = "partial";
                  currentStatusLabel = "Parcial";
                }
                
                return (
                <div>
                  <h4 className="text-white font-bold text-lg mb-4">Resumen de Recepción</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-2">Proveedor</p>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        {MOCK_PURCHASE_ORDERS.find(po => po.id === selectedPO)?.supplier}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-2">Fecha de Recepción</p>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {new Date(receptionDate).toLocaleDateString("es-EC")}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-2">Recibido por</p>
                      <p className="text-white font-medium flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        {receivedBy}
                      </p>
                    </div>
                  </div>

                  {/* Notas y Observaciones */}
                  {generalNotes && (
                    <div className="bg-white/5 rounded-xl p-4 mt-4">
                      <p className="text-gray-400 text-xs mb-2">Notas y Observaciones</p>
                      <p className="text-white text-sm">{generalNotes}</p>
                    </div>
                  )}

                  <div className="bg-white/5 rounded-xl p-4 mt-4">
                    <p className="text-gray-400 text-xs mb-2">Estado de la Recepción</p>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(currentStatus)}`}>
                      {getStatusIcon(currentStatus)}
                      {currentStatusLabel}
                    </span>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-white font-bold text-lg mb-4">Productos Recibidos</h4>
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Producto</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-28">Ordenado</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-28">Recibido</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-24">Faltante</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase w-32">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase w-48">Bodega</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Notas</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {receptionItems.map((item, index) => {
                            const faltante = item.orderedQty - item.receivedQty;
                            const warehouse = MOCK_WAREHOUSES.find(w => w.id === item.warehouse);
                            return (
                            <tr key={index}>
                              <td className="px-4 py-3">
                                <div className="flex flex-col">
                                  <span className="text-white text-sm font-medium">{item.productName}</span>
                                  <span className="text-gray-400 text-xs font-mono">{item.productCode}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-white text-sm font-mono">{item.orderedQty} {item.unit}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`font-bold text-sm font-mono ${item.receivedQty === item.orderedQty ? "text-green-400" : item.receivedQty > 0 ? "text-yellow-400" : "text-gray-500"}`}>
                                  {item.receivedQty} {item.unit}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {faltante > 0 ? (
                                  <span className="text-red-400 font-bold text-sm flex items-center justify-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    {faltante}
                                  </span>
                                ) : (
                                  <span className="text-green-400 text-sm">✓</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item.receivedQty > 0 ? getConditionBadge(item.condition) : <span className="text-gray-500 text-xs">-</span>}
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-white text-sm">{item.receivedQty > 0 ? (warehouse?.name || "-") : "No recibido"}</span>
                              </td>
                              <td className="px-4 py-3">
                                {item.notes ? (
                                  <span className="text-white text-xs">{item.notes}</span>
                                ) : (
                                  <span className="text-gray-500 text-xs">-</span>
                                )}
                              </td>
                            </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Volver a Editar
                    </button>
                    <button
                      onClick={() => handleProcessReception()}
                      disabled={!canProcessReception}
                      className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      Procesar e Ingresar a Inventario
                    </button>
                  </div>
                </div>
                );
              })()}
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowNewReceptionModal(false)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cerrar
              </button>
              <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}