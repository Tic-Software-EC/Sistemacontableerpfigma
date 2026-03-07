import { useState } from "react";
import { Package, ArrowRight, CheckCircle, Clock, XCircle, Eye, Edit, X } from "lucide-react";
import { Pagination } from "./pagination";
import { useTheme } from "../contexts/theme-context";

interface Transfer {
  id: string;
  code: string;
  date: string;
  product: string;
  productCode: string;
  originWarehouse: string;
  destinationWarehouse: string;
  quantity: number;
  unit: string;
  status: "pendiente" | "en_transito" | "completada" | "cancelada";
  requestedBy: string;
  notes: string;
}

const MOCK_TRANSFERS: Transfer[] = [
  {
    id: "1",
    code: "TRANS-000048",
    date: "2026-02-27",
    product: "Laptop Dell Inspiron 15",
    productCode: "PROD-001",
    originWarehouse: "Almacén Principal",
    destinationWarehouse: "Sucursal Norte",
    quantity: 5,
    unit: "UND",
    status: "en_transito",
    requestedBy: "Juan Pérez",
    notes: "Transferencia urgente para reposición"
  },
  {
    id: "2",
    code: "TRANS-000047",
    date: "2026-02-26",
    product: "Mouse Logitech M170",
    productCode: "PROD-002",
    originWarehouse: "Sucursal Norte",
    destinationWarehouse: "Almacén Principal",
    quantity: 15,
    unit: "UND",
    status: "completada",
    requestedBy: "María García",
    notes: "Exceso de inventario en sucursal"
  },
  {
    id: "3",
    code: "TRANS-000046",
    date: "2026-02-26",
    product: "Resma Papel Bond A4",
    productCode: "PROD-003",
    originWarehouse: "Almacén Principal",
    destinationWarehouse: "Sucursal Norte",
    quantity: 30,
    unit: "UND",
    status: "completada",
    requestedBy: "Carlos Rodríguez",
    notes: ""
  },
  {
    id: "4",
    code: "TRANS-000045",
    date: "2026-02-25",
    product: "Teclado Mecánico RGB",
    productCode: "PROD-004",
    originWarehouse: "Almacén Principal",
    destinationWarehouse: "Sucursal Norte",
    quantity: 10,
    unit: "UND",
    status: "pendiente",
    requestedBy: "Juan Pérez",
    notes: "Verificar disponibilidad antes de transferir"
  },
  {
    id: "5",
    code: "TRANS-000044",
    date: "2026-02-24",
    product: "Monitor LG 24 pulgadas",
    productCode: "PROD-005",
    originWarehouse: "Sucursal Norte",
    destinationWarehouse: "Almacén Principal",
    quantity: 3,
    unit: "UND",
    status: "cancelada",
    requestedBy: "María García",
    notes: "Cancelada por falta de stock"
  },
];

export function InventoryTransfersList() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);

  const filteredTransfers = MOCK_TRANSFERS.filter((transfer) => {
    const matchesSearch =
      transfer.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transfer.productCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || transfer.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalItems = filteredTransfers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredTransfers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendiente: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Pendiente", icon: Clock },
      en_transito: { bg: "bg-blue-500/10", text: "text-blue-400", label: "En Tránsito", icon: Package },
      completada: { bg: "bg-green-500/10", text: "text-green-400", label: "Completada", icon: CheckCircle },
      cancelada: { bg: "bg-red-500/10", text: "text-red-400", label: "Cancelada", icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const handleViewDetails = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          <input
            type="text"
            placeholder="Buscar por código, producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors ${
              isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a2332] border-white/10 text-white"
            }`}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${
              isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a2332] border-white/10 text-white"
            }`}
          >
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_transito">En Tránsito</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-lg overflow-hidden border ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/5"}`}>
        <table className="w-full">
          <thead className={isLight ? "bg-gray-50" : "bg-[#151f2e]"}>
            <tr>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Código</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cód. Producto</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Producto</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Origen → Destino</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cantidad</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Estado</th>
              <th className={`px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Acciones</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
            {currentItems.map((transfer) => (
              <tr key={transfer.id} className={isLight ? "hover:bg-gray-50 transition-colors" : "hover:bg-white/[0.02] transition-colors"}>
                <td className="px-4 py-3">
                  <span className={`font-mono text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{transfer.code}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{new Date(transfer.date).toLocaleDateString('es-EC')}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-mono text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{transfer.productCode}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{transfer.product}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{transfer.originWarehouse}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{transfer.destinationWarehouse}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{transfer.quantity} {transfer.unit}</span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(transfer.status)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleViewDetails(transfer)}
                      className={`p-1.5 rounded-md transition-colors ${isLight ? "text-primary hover:bg-primary/10" : "text-primary hover:bg-primary/10"}`}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {transfer.status === "pendiente" && (
                      <>
                        <button className={`p-1.5 rounded-md transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`} title="Editar">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className={`p-1.5 rounded-md transition-colors ${isLight ? "text-red-600 hover:bg-red-50" : "text-red-400 hover:bg-red-500/10"}`} title="Cancelar">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {/* Modal Detalle de Transferencia */}
      {showDetailModal && selectedTransfer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-secondary border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-bold text-xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  Detalle de Transferencia
                </h3>
                <p className="text-gray-400 text-sm mt-1 ml-13">{selectedTransfer.code}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Estado */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedTransfer.status)}
                  <span className="text-gray-400 text-sm">Estado actual</span>
                </div>
                <div className="text-gray-300 text-sm">
                  {new Date(selectedTransfer.date).toLocaleDateString('es-EC', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Información del Producto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-xs mb-1">Producto</p>
                  <p className="text-white font-medium">{selectedTransfer.product}</p>
                  <p className="text-gray-500 text-xs font-mono mt-1">{selectedTransfer.productCode}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-xs mb-1">Cantidad</p>
                  <p className="text-white font-bold text-lg">{selectedTransfer.quantity} {selectedTransfer.unit}</p>
                </div>
              </div>

              {/* Transferencia */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400 text-xs mb-3">Ruta de Transferencia</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Origen</p>
                    <p className="text-white font-medium">{selectedTransfer.originWarehouse}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Destino</p>
                    <p className="text-white font-medium">{selectedTransfer.destinationWarehouse}</p>
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-xs mb-1">Solicitado por</p>
                  <p className="text-white font-medium">{selectedTransfer.requestedBy}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-xs mb-1">Fecha de Solicitud</p>
                  <p className="text-white font-medium">
                    {new Date(selectedTransfer.date).toLocaleDateString('es-EC')}
                  </p>
                </div>
              </div>

              {/* Notas */}
              {selectedTransfer.notes && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-gray-400 text-xs mb-2">Notas</p>
                  <p className="text-gray-300 text-sm">{selectedTransfer.notes}</p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                >
                  Cerrar
                </button>
                {selectedTransfer.status === "pendiente" && (
                  <button className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium shadow-lg shadow-primary/20">
                    Aprobar Transferencia
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}