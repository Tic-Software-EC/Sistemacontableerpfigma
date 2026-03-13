/* Módulo de Recepción de Mercadería - TicSoftEc */
import { useState } from "react";
import {
  Search, Plus, Download, Printer, CheckCircle, Clock,
  X, FileText, Eye, Edit,
  Calendar, Package, PackageCheck, AlertTriangle,
  Warehouse, Truck, Save, ChevronRight, ChevronLeft,
  Minus, PlusIcon,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface ReceptionItem {
  productCode: string;
  productName: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
  warehouse: string;
  condition: "good" | "damaged" | "incomplete";
  notes?: string;
}

interface Reception {
  id: string;
  receptionNumber: string;
  purchaseOrder: string;
  supplier: string;
  receptionDate: string;
  receivedBy: string;
  status: "pending" | "completed" | "partial";
  items: ReceptionItem[];
  totalItems: number;
  receivedItems: number;
  notes: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplier: string;
  orderDate: string;
  status: string;
  items: {
    productCode: string;
    productName: string;
    orderedQty: number;
    unit: string;
  }[];
}

/* ══════════════════════════════════════════════════════════════════════
   DATOS MOCK
══════════════════════════════════════════════════════════════════════ */
const MOCK_WAREHOUSES = [
  { id: "bod-001", name: "Bodega Principal - Matriz" },
  { id: "bod-002", name: "Bodega Secundaria - Sucursal Norte" },
  { id: "bod-003", name: "Bodega de Tránsito" },
  { id: "bod-004", name: "Bodega de Productos Terminados" },
];

const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: "po-001",
    orderNumber: "OC-2026-001240",
    supplier: "Distribuidora TechWorld S.A.",
    orderDate: "2026-03-10",
    status: "approved",
    items: [
      { productCode: "PROD-030", productName: "Laptop HP ProBook 450", orderedQty: 8, unit: "Unidad" },
      { productCode: "PROD-031", productName: "Mouse Logitech MX Master 3", orderedQty: 15, unit: "Unidad" },
      { productCode: "PROD-032", productName: "Teclado Mecánico Corsair", orderedQty: 12, unit: "Unidad" },
    ]
  },
  {
    id: "po-002",
    orderNumber: "OC-2026-001241",
    supplier: "Suministros Oficina Express",
    orderDate: "2026-03-09",
    status: "approved",
    items: [
      { productCode: "PROD-040", productName: "Papel Bond A4 75gr x500", orderedQty: 100, unit: "Resma" },
      { productCode: "PROD-041", productName: "Bolígrafos BIC azul x50", orderedQty: 20, unit: "Caja" },
    ]
  },
  {
    id: "po-003",
    orderNumber: "OC-2026-001242",
    supplier: "Industrial Components Ltd.",
    orderDate: "2026-03-08",
    status: "approved",
    items: [
      { productCode: "PROD-050", productName: "Cable HDMI 2.0 - 2 metros", orderedQty: 25, unit: "Unidad" },
      { productCode: "PROD-051", productName: "Adaptador USB-C a HDMI", orderedQty: 30, unit: "Unidad" },
      { productCode: "PROD-052", productName: "Hub USB 3.0 - 4 puertos", orderedQty: 20, unit: "Unidad" },
    ]
  },
];

const RECEPTIONS_INIT: Reception[] = [
  {
    id: "1",
    receptionNumber: "REC-2026-001",
    purchaseOrder: "OC-2026-001234",
    supplier: "Tecnología Avanzada S.A.",
    receptionDate: "2026-03-09",
    receivedBy: "Carlos Mendoza",
    status: "completed",
    totalItems: 4,
    receivedItems: 4,
    notes: "Mercadería recibida en perfecto estado",
    items: [
      { productCode: "PROD-001", productName: "Laptop Dell Latitude 5420", orderedQty: 5, receivedQty: 5, unit: "Unidad", warehouse: "bod-001", condition: "good" },
      { productCode: "PROD-002", productName: "Monitor LG 27 pulgadas", orderedQty: 10, receivedQty: 10, unit: "Unidad", warehouse: "bod-001", condition: "good" },
      { productCode: "PROD-003", productName: "Teclado mecánico", orderedQty: 10, receivedQty: 10, unit: "Unidad", warehouse: "bod-001", condition: "good" },
      { productCode: "PROD-004", productName: "Mouse inalámbrico", orderedQty: 5, receivedQty: 5, unit: "Unidad", warehouse: "bod-001", condition: "good" },
    ]
  },
  {
    id: "2",
    receptionNumber: "REC-2026-002",
    purchaseOrder: "OC-2026-001235",
    supplier: "Papelería Corporativa Ltda.",
    receptionDate: "2026-03-08",
    receivedBy: "Ana Torres",
    status: "partial",
    totalItems: 3,
    receivedItems: 2,
    notes: "Faltan 2 unidades del producto PROD-007",
    items: [
      { productCode: "PROD-005", productName: "Resma papel bond A4", orderedQty: 50, receivedQty: 50, unit: "Unidad", warehouse: "bod-002", condition: "good" },
      { productCode: "PROD-006", productName: "Marcadores permanentes x12", orderedQty: 20, receivedQty: 20, unit: "Caja", warehouse: "bod-002", condition: "good" },
      { productCode: "PROD-007", productName: "Archivador de palanca", orderedQty: 10, receivedQty: 8, unit: "Unidad", warehouse: "bod-002", condition: "incomplete" },
    ]
  },
  {
    id: "3",
    receptionNumber: "REC-2026-003",
    purchaseOrder: "OC-2026-001236",
    supplier: "Distribuidora La Favorita C.A.",
    receptionDate: "2026-03-07",
    receivedBy: "Luis Ramírez",
    status: "pending",
    totalItems: 2,
    receivedItems: 0,
    notes: "Pendiente de recepción",
    items: [
      { productCode: "PROD-011", productName: "Impresora multifunción", orderedQty: 3, receivedQty: 0, unit: "Unidad", warehouse: "bod-003", condition: "good" },
      { productCode: "PROD-015", productName: "Cable UTP Cat6 x305m", orderedQty: 5, receivedQty: 0, unit: "Rollo", warehouse: "bod-003", condition: "good" },
    ]
  },
  {
    id: "4",
    receptionNumber: "REC-2026-004",
    purchaseOrder: "OC-2026-001237",
    supplier: "Industrial Supplies Corp.",
    receptionDate: "2026-03-06",
    receivedBy: "Pedro Morales",
    status: "partial",
    totalItems: 2,
    receivedItems: 1,
    notes: "Una impresora con daño en empaque",
    items: [
      { productCode: "PROD-020", productName: "Router Cisco 2900", orderedQty: 3, receivedQty: 3, unit: "Unidad", warehouse: "bod-001", condition: "good" },
      { productCode: "PROD-021", productName: "Switch 24 puertos", orderedQty: 5, receivedQty: 4, unit: "Unidad", warehouse: "bod-001", condition: "damaged", notes: "1 unidad con empaque dañado" },
    ]
  },
  {
    id: "5",
    receptionNumber: "REC-2026-005",
    purchaseOrder: "OC-2026-001238",
    supplier: "Construcciones Andinas S.A.",
    receptionDate: "2026-03-05",
    receivedBy: "Laura Jiménez",
    status: "completed",
    totalItems: 2,
    receivedItems: 2,
    notes: "Material para obra civil recibido completo",
    items: [
      { productCode: "PROD-013", productName: "Cemento Portland x50kg", orderedQty: 100, receivedQty: 100, unit: "Saco", warehouse: "bod-004", condition: "good" },
      { productCode: "PROD-014", productName: "Varilla de hierro 12mm", orderedQty: 50, receivedQty: 50, unit: "Unidad", warehouse: "bod-004", condition: "good" },
    ]
  },
];

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function MerchandiseReceptionContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados principales
  const [receptions, setReceptions] = useState<Reception[]>(RECEPTIONS_INIT);
  const [activeTab, setActiveTab] = useState<"pending" | "partial" | "completed">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingReception, setViewingReception] = useState<Reception | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Estados para Nueva Recepción
  const [showNewReceptionModal, setShowNewReceptionModal] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [receptionDate, setReceptionDate] = useState(new Date().toISOString().split('T')[0]);
  const [receivedBy, setReceivedBy] = useState("María López Contreras"); // Usuario logueado
  const [generalNotes, setGeneralNotes] = useState("");
  const [receptionItems, setReceptionItems] = useState<ReceptionItem[]>([]);

  // Contadores por estado
  const counts = {
    pending: receptions.filter(r => r.status === "pending").length,
    partial: receptions.filter(r => r.status === "partial").length,
    completed: receptions.filter(r => r.status === "completed").length,
  };

  // Filtrar recepciones
  const filteredReceptions = receptions
    .filter(reception => reception.status === activeTab)
    .filter(reception =>
      reception.receptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.purchaseOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.receptionDate).getTime() - new Date(a.receptionDate).getTime());

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredReceptions.map(r => r.id)));
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

  const handleView = (reception: Reception) => {
    setViewingReception(reception);
    setShowViewModal(true);
  };

  const handleNewReception = () => {
    setShowNewReceptionModal(true);
    setWizardStep(1);
    setSelectedPO(null);
    setReceptionDate(new Date().toISOString().split('T')[0]);
    setReceivedBy("María López Contreras");
    setGeneralNotes("");
    setReceptionItems([]);
  };

  const handleSelectPO = (poId: string) => {
    const po = MOCK_PURCHASE_ORDERS.find(p => p.id === poId);
    if (po) {
      setSelectedPO(po);
      // Inicializar items con cantidades recibidas igual a ordenadas por defecto
      const items: ReceptionItem[] = po.items.map(item => ({
        productCode: item.productCode,
        productName: item.productName,
        orderedQty: item.orderedQty,
        receivedQty: item.orderedQty,
        unit: item.unit,
        warehouse: "bod-001", // Bodega por defecto
        condition: "good",
        notes: ""
      }));
      setReceptionItems(items);
    } else {
      setSelectedPO(null);
      setReceptionItems([]);
    }
  };

  const handleUpdateItem = (index: number, field: keyof ReceptionItem, value: any) => {
    const newItems = [...receptionItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setReceptionItems(newItems);
  };

  const handleSaveReception = () => {
    // Validaciones
    if (!selectedPO) {
      toast.error("Debes seleccionar una orden de compra");
      return;
    }

    // Validar que los productos con cantidad recibida > 0 tengan bodega
    const itemsToReceive = receptionItems.filter(item => item.receivedQty > 0);
    if (itemsToReceive.length === 0) {
      toast.error("Debes recibir al menos un producto");
      return;
    }

    const itemsWithoutWarehouse = itemsToReceive.filter(item => !item.warehouse);
    if (itemsWithoutWarehouse.length > 0) {
      toast.error("Todos los productos recibidos deben tener una bodega asignada");
      return;
    }

    // Calcular estado de la recepción
    const totalOrdered = receptionItems.reduce((sum, item) => sum + item.orderedQty, 0);
    const totalReceived = receptionItems.reduce((sum, item) => sum + item.receivedQty, 0);
    
    let status: "pending" | "completed" | "partial";
    if (totalReceived === 0) {
      status = "pending";
    } else if (totalReceived === totalOrdered && receptionItems.every(item => item.receivedQty === item.orderedQty)) {
      status = "completed";
    } else {
      status = "partial";
    }

    // Crear nueva recepción
    const newReception: Reception = {
      id: String(receptions.length + 1),
      receptionNumber: `REC-2026-${String(receptions.length + 1).padStart(3, '0')}`,
      purchaseOrder: selectedPO.orderNumber,
      supplier: selectedPO.supplier,
      receptionDate: receptionDate,
      receivedBy: receivedBy,
      status: status,
      items: receptionItems,
      totalItems: receptionItems.length,
      receivedItems: itemsToReceive.length,
      notes: generalNotes
    };

    setReceptions([newReception, ...receptions]);
    toast.success("✓ Recepción guardada exitosamente");
    setShowNewReceptionModal(false);
  };

  const handleCompleteReception = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos una recepción");
      return;
    }
    toast.success(`${selectedIds.size} recepción(es) completada(s)`);
    setSelectedIds(new Set());
  };

  const handleExportCSV = () => {
    toast.success("✓ Exportando recepciones a CSV...");
  };

  const handlePrint = () => {
    toast.success("✓ Imprimiendo recepciones...");
  };

  const canProceedToStep2 = selectedPO !== null;

  /* ════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <div className={`flex flex-col gap-4 ${isLight ? "bg-white" : "bg-[#0D1B2A]"} rounded-xl p-5`}>
        {/* ── TABS de Estados ── */}
        <div className={`flex items-center gap-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <button
            onClick={() => {setActiveTab("pending"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "pending"
                ? isLight
                  ? "text-blue-700"
                  : "text-blue-400"
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
                  ? "bg-blue-100 text-blue-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.pending}
              </span>
            </div>
            {activeTab === "pending" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("partial"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "partial"
                ? isLight
                  ? "text-yellow-700"
                  : "text-yellow-400"
                : isLight
                ? "text-gray-500 hover:text-gray-700"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Parciales
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "partial"
                  ? "bg-yellow-100 text-yellow-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.partial}
              </span>
            </div>
            {activeTab === "partial" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("completed"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "completed"
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
              Completadas
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "completed"
                  ? "bg-green-100 text-green-700"
                  : isLight
                  ? "bg-gray-100 text-gray-600"
                  : "bg-white/10 text-gray-400"
              }`}>
                {counts.completed}
              </span>
            </div>
            {activeTab === "completed" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
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
                placeholder="Buscar número, OC, proveedor..."
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

          {/* Botones de Acción */}
          <div className="flex items-center gap-2">
            {/* Botón Completar - Solo en tabs pending y partial */}
            {(activeTab === "pending" || activeTab === "partial") && (
              <button
                onClick={handleCompleteReception}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Completar
              </button>
            )}

            <button
              onClick={handleNewReception}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-primary hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Nueva Recepción
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
          activeTab === "pending"
            ? isLight
              ? "bg-blue-50 border-blue-200"
              : "bg-blue-500/10 border-blue-500/20"
            : activeTab === "partial"
            ? isLight
              ? "bg-yellow-50 border-yellow-200"
              : "bg-yellow-500/10 border-yellow-500/20"
            : isLight
            ? "bg-green-50 border-green-200"
            : "bg-green-500/10 border-green-500/20"
        }`}>
          <div className="flex items-start gap-2">
            <Package className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              activeTab === "pending" ? (isLight ? "text-blue-600" : "text-blue-400")
              : activeTab === "partial" ? (isLight ? "text-yellow-600" : "text-yellow-400")
              : (isLight ? "text-green-600" : "text-green-400")
            }`} />
            <div>
              <p className={`text-sm font-semibold ${
                activeTab === "pending" ? (isLight ? "text-blue-900" : "text-blue-300")
                : activeTab === "partial" ? (isLight ? "text-yellow-900" : "text-yellow-300")
                : (isLight ? "text-green-900" : "text-green-300")
              }`}>
                {activeTab === "pending" && "Recepciones Pendientes"}
                {activeTab === "partial" && "Recepciones Parciales"}
                {activeTab === "completed" && "Recepciones Completadas"}
              </p>
              <p className={`text-xs mt-0.5 ${
                activeTab === "pending" ? (isLight ? "text-blue-700" : "text-blue-400")
                : activeTab === "partial" ? (isLight ? "text-yellow-700" : "text-yellow-400")
                : (isLight ? "text-green-700" : "text-green-400")
              }`}>
                {activeTab === "pending" && "Estas recepciones están pendientes de procesar. Selecciona una para completar el ingreso al inventario."}
                {activeTab === "partial" && "Estas recepciones están parcialmente completadas. Algunos productos aún no han sido recibidos."}
                {activeTab === "completed" && "Estas recepciones han sido completadas exitosamente y registradas en el inventario."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabla de Recepciones ── */}
        <div className={`rounded-lg border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className={`text-xs font-semibold uppercase tracking-wider border-b ${
                  isLight ? "bg-gray-100 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"
                }`}>
                  {/* Checkbox - Solo en tabs pending y partial */}
                  {(activeTab === "pending" || activeTab === "partial") && (
                    <th className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredReceptions.length && filteredReceptions.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="px-3 py-2 text-left whitespace-nowrap">N° Recepción</th>
                  <th className="px-3 py-2 text-left">Orden Compra</th>
                  <th className="px-3 py-2 text-left">Proveedor</th>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Recibido Por</th>
                  <th className="px-3 py-2 text-center">Items</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceptions.length > 0 ? (
                  filteredReceptions.map((reception, index) => (
                    <tr
                      key={reception.id}
                      className={`border-t transition-colors relative ${
                        isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/5"
                      }`}
                    >
                      {/* Checkbox */}
                      {(activeTab === "pending" || activeTab === "partial") && (
                        <td className="px-3 py-1.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(reception.id)}
                            onChange={(e) => handleSelectOne(reception.id, e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </td>
                      )}

                      {/* N° Recepción con barra naranja */}
                      <td className="px-3 py-1.5 relative">
                        {index === 0 && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                        )}
                        <div className={`font-mono font-semibold text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                          {reception.receptionNumber}
                        </div>
                      </td>

                      <td className={`px-3 py-1.5 text-xs font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {reception.purchaseOrder}
                      </td>

                      <td className="px-3 py-1.5">
                        <div className={`font-medium text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                          {reception.supplier}
                        </div>
                      </td>

                      <td className={`px-3 py-1.5 text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {new Date(reception.receptionDate).toLocaleDateString("es-EC")}
                      </td>

                      <td className={`px-3 py-1.5 text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {reception.receivedBy}
                      </td>

                      <td className="px-3 py-1.5 text-center">
                        <div className={`font-semibold text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                          {reception.receivedItems}/{reception.totalItems}
                        </div>
                      </td>

                      <td className="px-3 py-1.5 text-center">
                        {reception.status === "pending" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-400"
                          }`}>
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        )}
                        {reception.status === "partial" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            <AlertTriangle className="w-3 h-3" />
                            Parcial
                          </span>
                        )}
                        {reception.status === "completed" && (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                          }`}>
                            <PackageCheck className="w-3 h-3" />
                            Completada
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-1.5">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(reception)}
                            className={`p-1 rounded transition-colors ${
                              isLight ? "hover:bg-gray-200 text-gray-600" : "hover:bg-white/10 text-gray-400"
                            }`}
                            title="Ver detalles"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {(reception.status === "pending" || reception.status === "partial") && (
                            <button
                              onClick={() => toast.info("Función de editar en desarrollo")}
                              className="p-1 rounded transition-colors hover:bg-blue-500/10 text-blue-500"
                              title="Editar recepción"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={(activeTab === "pending" || activeTab === "partial") ? 9 : 8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Package className={`w-12 h-12 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                        <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          No se encontraron recepciones
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
      {showViewModal && viewingReception && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-4xl rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/20"}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                    Recepción: {viewingReception.receptionNumber}
                  </h3>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    OC: {viewingReception.purchaseOrder}
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
                {/* Info General */}
                <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                    INFORMACIÓN GENERAL
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Proveedor:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingReception.supplier}</span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        {new Date(viewingReception.receptionDate).toLocaleDateString("es-EC")}
                      </span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Recibido por:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingReception.receivedBy}</span>
                    </div>
                  </div>
                  {viewingReception.notes && (
                    <div className="mt-3">
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Notas:</span>
                      <span className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{viewingReception.notes}</span>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                    PRODUCTOS ({viewingReception.items.length})
                  </h4>
                  <div className="space-y-2">
                    {viewingReception.items.map((item, idx) => (
                      <div key={idx} className={`p-3 rounded ${isLight ? "bg-white" : "bg-white/5"}`}>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <span className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{item.productName}</span>
                            <span className={`text-xs ml-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}>({item.productCode})</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.condition === "good" 
                              ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                              : item.condition === "damaged"
                              ? isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400"
                              : isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {item.condition === "good" ? "Bueno" : item.condition === "damaged" ? "Dañado" : "Incompleto"}
                          </span>
                        </div>
                        <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          Ordenado: {item.orderedQty} {item.unit} | Recibido: {item.receivedQty} {item.unit}
                          {item.warehouse && (
                            <span className="ml-2">| Bodega: {MOCK_WAREHOUSES.find(w => w.id === item.warehouse)?.name}</span>
                          )}
                        </div>
                        {item.notes && (
                          <div className={`text-xs mt-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Nota: {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
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

      {/* ═════════════════════════════════════════════════════════════
          MODAL: Nueva Recepción (WIZARD 2 PASOS)
      ══════════════════════════════════════════════════════════════ */}
      {showNewReceptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-5xl rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/20"}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                    Nueva Recepción de Mercadería
                  </h3>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Paso {wizardStep} de 2
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewReceptionModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[65vh] overflow-y-auto">
              {/* PASO 1: Seleccionar Orden de Compra e Información General */}
              {wizardStep === 1 && (
                <div className="space-y-5">
                  <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                    <p className={`text-sm font-semibold ${isLight ? "text-blue-900" : "text-blue-300"}`}>
                      Paso 1: Información General
                    </p>
                    <p className={`text-xs mt-1 ${isLight ? "text-blue-700" : "text-blue-400"}`}>
                      Selecciona la orden de compra y completa los datos básicos de la recepción.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Orden de Compra <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedPO?.id || ""}
                        onChange={(e) => handleSelectPO(e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                          isLight
                            ? "bg-white border-gray-300 text-gray-900"
                            : "bg-white/5 border-white/15 text-white"
                        }`}
                      >
                        <option value="">-- Selecciona una orden --</option>
                        {MOCK_PURCHASE_ORDERS.map(po => (
                          <option key={po.id} value={po.id}>
                            {po.orderNumber} - {po.supplier}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Fecha de Recepción <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={receptionDate}
                        onChange={(e) => setReceptionDate(e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                          isLight
                            ? "bg-white border-gray-300 text-gray-900"
                            : "bg-white/5 border-white/15 text-white"
                        }`}
                        style={{ colorScheme: isLight ? "light" : "dark" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Recibido Por <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={receivedBy}
                      onChange={(e) => setReceivedBy(e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Notas Generales
                    </label>
                    <textarea
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      rows={3}
                      placeholder="Observaciones generales sobre la recepción..."
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-gray-500 ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  {selectedPO && (
                    <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                      <h4 className={`text-sm font-bold mb-2 ${isLight ? "text-darkBg" : "text-white"}`}>
                        Información de la Orden de Compra
                      </h4>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className={isLight ? "text-gray-500" : "text-gray-400"}>Proveedor:</span>
                          <div className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{selectedPO.supplier}</div>
                        </div>
                        <div>
                          <span className={isLight ? "text-gray-500" : "text-gray-400"}>Fecha OC:</span>
                          <div className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            {new Date(selectedPO.orderDate).toLocaleDateString("es-EC")}
                          </div>
                        </div>
                        <div>
                          <span className={isLight ? "text-gray-500" : "text-gray-400"}>Total Productos:</span>
                          <div className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{selectedPO.items.length}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PASO 2: Detalles de Productos */}
              {wizardStep === 2 && selectedPO && (
                <div className="space-y-5">
                  <div className={`p-4 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20"}`}>
                    <p className={`text-sm font-semibold ${isLight ? "text-green-900" : "text-green-300"}`}>
                      Paso 2: Detalle de Productos Recibidos
                    </p>
                    <p className={`text-xs mt-1 ${isLight ? "text-green-700" : "text-green-400"}`}>
                      Especifica las cantidades recibidas, el estado y la bodega para cada producto.
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                      <div>
                        <span className={isLight ? "text-gray-500" : "text-gray-400"}>Proveedor:</span>
                        <div className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{selectedPO.supplier}</div>
                      </div>
                      <div>
                        <span className={isLight ? "text-gray-500" : "text-gray-400"}>Fecha Recepción:</span>
                        <div className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {new Date(receptionDate).toLocaleDateString("es-EC")}
                        </div>
                      </div>
                      <div>
                        <span className={isLight ? "text-gray-500" : "text-gray-400"}>Recibido por:</span>
                        <div className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{receivedBy}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {receptionItems.map((item, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                              {item.productName}
                            </h5>
                            <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                              Código: {item.productCode} | Ordenado: {item.orderedQty} {item.unit}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              Cantidad Recibida
                            </label>
                            <input
                              type="number"
                              min="0"
                              max={item.orderedQty}
                              value={item.receivedQty}
                              onChange={(e) => handleUpdateItem(index, "receivedQty", Number(e.target.value))}
                              className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                                isLight
                                  ? "bg-white border-gray-300 text-gray-900"
                                  : "bg-white/5 border-white/15 text-white"
                              }`}
                            />
                          </div>

                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              Estado
                            </label>
                            <select
                              value={item.condition}
                              onChange={(e) => handleUpdateItem(index, "condition", e.target.value)}
                              className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                                isLight
                                  ? "bg-white border-gray-300 text-gray-900"
                                  : "bg-white/5 border-white/15 text-white"
                              }`}
                            >
                              <option value="good">Bueno</option>
                              <option value="damaged">Dañado</option>
                              <option value="incomplete">Incompleto</option>
                            </select>
                          </div>

                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              Bodega <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={item.warehouse}
                              onChange={(e) => handleUpdateItem(index, "warehouse", e.target.value)}
                              className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                                isLight
                                  ? "bg-white border-gray-300 text-gray-900"
                                  : "bg-white/5 border-white/15 text-white"
                              }`}
                            >
                              <option value="">-- Selecciona --</option>
                              {MOCK_WAREHOUSES.map(wh => (
                                <option key={wh.id} value={wh.id}>{wh.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              Notas del Producto
                            </label>
                            <input
                              type="text"
                              value={item.notes || ""}
                              onChange={(e) => handleUpdateItem(index, "notes", e.target.value)}
                              placeholder="Observaciones..."
                              className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-gray-500 ${
                                isLight
                                  ? "bg-white border-gray-300 text-gray-900"
                                  : "bg-white/5 border-white/15 text-white"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer con Navegación */}
            <div className={`flex items-center justify-between px-6 py-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-2">
                {/* Indicador de pasos */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    wizardStep === 1
                      ? "bg-primary text-white"
                      : isLight
                      ? "bg-green-100 text-green-700"
                      : "bg-green-500/20 text-green-400"
                  }`}>
                    1
                  </div>
                  <div className={`w-12 h-0.5 ${wizardStep === 2 ? "bg-primary" : isLight ? "bg-gray-300" : "bg-white/10"}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    wizardStep === 2
                      ? "bg-primary text-white"
                      : isLight
                      ? "bg-gray-200 text-gray-500"
                      : "bg-white/10 text-gray-500"
                  }`}>
                    2
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNewReceptionModal(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  Cancelar
                </button>

                {wizardStep === 2 && (
                  <button
                    onClick={() => setWizardStep(1)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      isLight
                        ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                        : "border-white/20 text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                )}

                {wizardStep === 1 && (
                  <button
                    onClick={() => setWizardStep(2)}
                    disabled={!canProceedToStep2}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity ${
                      canProceedToStep2 ? "bg-primary hover:opacity-90" : "bg-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {wizardStep === 2 && (
                  <button
                    onClick={handleSaveReception}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Recepción
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
