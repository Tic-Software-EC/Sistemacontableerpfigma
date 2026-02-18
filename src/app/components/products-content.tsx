import { useState } from "react";
import { Package, Search, Eye, Tag, X, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Box, DollarSign, TrendingUp, ShoppingCart, Calendar, User } from "lucide-react";

interface PurchasedProduct {
  id: string;
  code: string;
  name: string;
  category: string;
  supplier: string;
  totalOrdered: number;
  totalReceived: number;
  totalPending: number;
  unit: string;
  lastPurchasePrice: number;
  averagePrice: number;
  lastOrderDate: string;
  lastOrderId: string;
  totalOrders: number;
  status: "active" | "discontinued";
}

interface ProductHistory {
  orderId: string;
  orderDate: string;
  supplier: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
  total: number;
  status: "pending" | "partial" | "received" | "cancelled";
}

const PRODUCT_CATEGORIES = [
  "all",
  "Tecnología",
  "Papelería",
  "Muebles",
  "Construcción",
  "Consumibles",
  "Equipos",
  "Otros"
];

export function ProductsContent() {
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<PurchasedProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Productos que se han comprado a través de órdenes de compra
  const [purchasedProducts] = useState<PurchasedProduct[]>([
    {
      id: "pp-001",
      code: "PROD-001",
      name: "Laptop Dell Inspiron 15",
      category: "Tecnología",
      supplier: "Distribuidora Nacional S.A.",
      totalOrdered: 15,
      totalReceived: 10,
      totalPending: 5,
      unit: "Unidad",
      lastPurchasePrice: 650.00,
      averagePrice: 645.00,
      lastOrderDate: "2026-02-10",
      lastOrderId: "OC-2026-001",
      totalOrders: 3,
      status: "active"
    },
    {
      id: "pp-002",
      code: "PROD-002",
      name: "Mouse Inalámbrico Logitech M185",
      category: "Tecnología",
      supplier: "Distribuidora Nacional S.A.",
      totalOrdered: 30,
      totalReceived: 30,
      totalPending: 0,
      unit: "Unidad",
      lastPurchasePrice: 25.00,
      averagePrice: 24.50,
      lastOrderDate: "2026-02-10",
      lastOrderId: "OC-2026-001",
      totalOrders: 2,
      status: "active"
    },
    {
      id: "pp-003",
      code: "PROD-003",
      name: "Teclado Mecánico RGB Gamer",
      category: "Tecnología",
      supplier: "Distribuidora Nacional S.A.",
      totalOrdered: 20,
      totalReceived: 20,
      totalPending: 0,
      unit: "Unidad",
      lastPurchasePrice: 45.00,
      averagePrice: 46.00,
      lastOrderDate: "2026-02-10",
      lastOrderId: "OC-2026-001",
      totalOrders: 2,
      status: "active"
    },
    {
      id: "pp-004",
      code: "PROD-004",
      name: "Monitor LG 24 pulgadas Full HD",
      category: "Tecnología",
      supplier: "Distribuidora Nacional S.A.",
      totalOrdered: 10,
      totalReceived: 5,
      totalPending: 5,
      unit: "Unidad",
      lastPurchasePrice: 180.00,
      averagePrice: 182.00,
      lastOrderDate: "2026-02-10",
      lastOrderId: "OC-2026-001",
      totalOrders: 2,
      status: "active"
    },
    {
      id: "pp-005",
      code: "PROD-005",
      name: "Impresora HP OfficeJet Pro 9015",
      category: "Tecnología",
      supplier: "Kreafast",
      totalOrdered: 5,
      totalReceived: 0,
      totalPending: 5,
      unit: "Unidad",
      lastPurchasePrice: 400.00,
      averagePrice: 400.00,
      lastOrderDate: "2026-02-08",
      lastOrderId: "OC-2026-002",
      totalOrders: 1,
      status: "active"
    },
    {
      id: "pp-006",
      code: "PROD-006",
      name: "Silla Ergonómica Ejecutiva",
      category: "Muebles",
      supplier: "Papelería Corporativa Ltda.",
      totalOrdered: 25,
      totalReceived: 25,
      totalPending: 0,
      unit: "Unidad",
      lastPurchasePrice: 185.00,
      averagePrice: 180.00,
      lastOrderDate: "2026-02-05",
      lastOrderId: "OC-2026-003",
      totalOrders: 3,
      status: "active"
    },
    {
      id: "pp-007",
      code: "PROD-007",
      name: "Resma Papel Bond A4 75g",
      category: "Papelería",
      supplier: "Papelería Corporativa Ltda.",
      totalOrdered: 500,
      totalReceived: 500,
      totalPending: 0,
      unit: "Resma",
      lastPurchasePrice: 4.50,
      averagePrice: 4.45,
      lastOrderDate: "2026-02-01",
      lastOrderId: "OC-2026-004",
      totalOrders: 5,
      status: "active"
    },
    {
      id: "pp-008",
      code: "PROD-008",
      name: "Marcadores Permanentes x12",
      category: "Papelería",
      supplier: "Distribuidora La Favorita C.A.",
      totalOrdered: 50,
      totalReceived: 50,
      totalPending: 0,
      unit: "Caja",
      lastPurchasePrice: 8.00,
      averagePrice: 7.80,
      lastOrderDate: "2026-01-28",
      lastOrderId: "OC-2026-005",
      totalOrders: 4,
      status: "active"
    },
    {
      id: "pp-009",
      code: "PROD-009",
      name: "Escritorio Ejecutivo en L",
      category: "Muebles",
      supplier: "Industrial Supplies Corp.",
      totalOrdered: 8,
      totalReceived: 8,
      totalPending: 0,
      unit: "Unidad",
      lastPurchasePrice: 320.00,
      averagePrice: 315.00,
      lastOrderDate: "2026-01-25",
      lastOrderId: "OC-2026-006",
      totalOrders: 2,
      status: "active"
    },
    {
      id: "pp-010",
      code: "PROD-010",
      name: "Archivador de Palanca Oficio",
      category: "Papelería",
      supplier: "Papelería Corporativa Ltda.",
      totalOrdered: 100,
      totalReceived: 100,
      totalPending: 0,
      unit: "Unidad",
      lastPurchasePrice: 3.25,
      averagePrice: 3.20,
      lastOrderDate: "2026-01-20",
      lastOrderId: "OC-2026-007",
      totalOrders: 6,
      status: "active"
    }
  ]);

  // Historial de compras por producto (mock data)
  const productHistory: Record<string, ProductHistory[]> = {
    "pp-001": [
      { orderId: "OC-2026-001", orderDate: "2026-02-10", supplier: "Distribuidora Nacional S.A.", quantityOrdered: 5, quantityReceived: 0, unitPrice: 650.00, total: 3250.00, status: "pending" },
      { orderId: "OC-2025-045", orderDate: "2025-12-15", supplier: "Distribuidora Nacional S.A.", quantityOrdered: 8, quantityReceived: 8, unitPrice: 640.00, total: 5120.00, status: "received" },
      { orderId: "OC-2025-012", orderDate: "2025-08-20", supplier: "Tecnología Avanzada S.A.", quantityOrdered: 2, quantityReceived: 2, unitPrice: 645.00, total: 1290.00, status: "received" }
    ],
    "pp-002": [
      { orderId: "OC-2026-001", orderDate: "2026-02-10", supplier: "Distribuidora Nacional S.A.", quantityOrdered: 10, quantityReceived: 10, unitPrice: 25.00, total: 250.00, status: "received" },
      { orderId: "OC-2025-030", orderDate: "2025-10-05", supplier: "Distribuidora Nacional S.A.", quantityOrdered: 20, quantityReceived: 20, unitPrice: 24.00, total: 480.00, status: "received" }
    ],
    "pp-005": [
      { orderId: "OC-2026-002", orderDate: "2026-02-08", supplier: "Kreafast", quantityOrdered: 5, quantityReceived: 0, unitPrice: 400.00, total: 2000.00, status: "pending" }
    ]
  };

  const filteredProducts = purchasedProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "pending" && product.totalPending > 0) ||
      (filterStatus === "received" && product.totalPending === 0);

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime();
  });

  const handleViewProduct = (product: PurchasedProduct) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getStatusBadge = (product: PurchasedProduct) => {
    if (product.totalPending === 0) {
      return { color: "bg-green-500/20 text-green-400 border-green-500/30", label: "Recibido" };
    } else if (product.totalReceived > 0) {
      return { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", label: "Parcial" };
    } else {
      return { color: "bg-blue-500/20 text-blue-400 border-blue-500/30", label: "Pendiente" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "partial":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "received":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-white/5 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header estándar con diseño corporativo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Productos Comprados
          </h2>
          <p className="text-gray-400 text-sm">
            Historial y seguimiento de productos adquiridos mediante órdenes de compra
          </p>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Sección de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Buscar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        {/* Categoría */}
        <div className="relative">
          <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            {PRODUCT_CATEGORIES.filter(cat => cat !== "all").map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Estado de recepción */}
        <div className="relative">
          <Box className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Con pendientes</option>
            <option value="received">Completamente recibidos</option>
          </select>
        </div>
      </div>

      {/* Lista de productos comprados - Tabla */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No se encontraron productos</p>
            <p className="text-gray-500 text-sm">
              Intenta ajustar los filtros o crea una orden de compra
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Proveedor Principal
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ordenado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Recibido
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Pendiente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Precio Promedio
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
                {currentItems.map((product) => {
                  const statusBadge = getStatusBadge(product);
                  return (
                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Código */}
                      <td className="px-6 py-4">
                        <span className="text-white font-mono font-bold">{product.code}</span>
                      </td>

                      {/* Producto */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{product.name}</span>
                          <span className="text-gray-500 text-xs mt-1">
                            {product.totalOrders} {product.totalOrders === 1 ? 'orden' : 'órdenes'} de compra
                          </span>
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-300">
                          {product.category}
                        </span>
                      </td>

                      {/* Proveedor */}
                      <td className="px-6 py-4">
                        <span className="text-gray-300 text-sm">{product.supplier}</span>
                      </td>

                      {/* Ordenado */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-white font-bold text-lg">{product.totalOrdered}</span>
                          <span className="text-gray-500 text-xs">{product.unit}</span>
                        </div>
                      </td>

                      {/* Recibido */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-green-400 font-bold text-lg">{product.totalReceived}</span>
                          <span className="text-gray-500 text-xs">{product.unit}</span>
                        </div>
                      </td>

                      {/* Pendiente */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold text-lg ${product.totalPending > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                            {product.totalPending}
                          </span>
                          <span className="text-gray-500 text-xs">{product.unit}</span>
                        </div>
                      </td>

                      {/* Precio Promedio */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-primary font-bold">${product.averagePrice.toFixed(2)}</span>
                          <span className="text-gray-500 text-xs">por {product.unit}</span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                            title="Ver historial"
                          >
                            <Eye className="w-4 h-4" />
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
      {filteredProducts.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Información de registros */}
          <div className="text-gray-400 text-sm">
            Mostrando <span className="text-white font-medium">{indexOfFirstItem + 1}</span> a{" "}
            <span className="text-white font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> de{" "}
            <span className="text-white font-medium">{filteredProducts.length}</span> productos
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

      {/* Modal de vista detallada - Historial de compras */}
      {showViewModal && viewingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-white font-bold text-xl">
                  {viewingProduct.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1 font-mono">
                  {viewingProduct.code}
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Resumen estadístico */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Total Ordenado</p>
                      <p className="text-white font-bold text-2xl">{viewingProduct.totalOrdered}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">{viewingProduct.unit}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Total Recibido</p>
                      <p className="text-green-400 font-bold text-2xl">{viewingProduct.totalReceived}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">{viewingProduct.unit}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <Box className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Pendiente</p>
                      <p className="text-yellow-400 font-bold text-2xl">{viewingProduct.totalPending}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">{viewingProduct.unit}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Precio Promedio</p>
                      <p className="text-primary font-bold text-2xl">${viewingProduct.averagePrice.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">por {viewingProduct.unit}</p>
                </div>
              </div>

              {/* Información general */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h4 className="text-gray-400 text-xs font-medium mb-4 uppercase flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Información General
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Categoría</p>
                      <p className="text-white font-medium">{viewingProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Proveedor Principal</p>
                      <p className="text-white font-medium">{viewingProduct.supplier}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Total de Órdenes</p>
                      <p className="text-white font-medium">{viewingProduct.totalOrders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h4 className="text-gray-400 text-xs font-medium mb-4 uppercase flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Última Compra
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Fecha</p>
                      <p className="text-white font-medium">
                        {new Date(viewingProduct.lastOrderDate).toLocaleDateString('es-EC', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Orden de Compra</p>
                      <p className="text-white font-medium font-mono">{viewingProduct.lastOrderId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Precio Unitario</p>
                      <p className="text-primary font-bold text-lg">${viewingProduct.lastPurchasePrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historial de órdenes de compra */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-gray-400 text-xs font-medium mb-4 uppercase flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Historial de Órdenes de Compra
                </h4>

                {productHistory[viewingProduct.id] ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Orden</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Fecha</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Proveedor</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Ordenado</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Recibido</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Precio Unit.</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {productHistory[viewingProduct.id].map((history, index) => (
                          <tr key={index} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-white font-mono text-sm font-bold">{history.orderId}</td>
                            <td className="px-4 py-3 text-gray-300 text-sm">
                              {new Date(history.orderDate).toLocaleDateString('es-EC')}
                            </td>
                            <td className="px-4 py-3 text-gray-300 text-sm">{history.supplier}</td>
                            <td className="px-4 py-3 text-center text-white font-bold">{history.quantityOrdered}</td>
                            <td className="px-4 py-3 text-center text-green-400 font-bold">{history.quantityReceived}</td>
                            <td className="px-4 py-3 text-primary font-bold">${history.unitPrice.toFixed(2)}</td>
                            <td className="px-4 py-3 text-white font-bold">${history.total.toFixed(2)}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(history.status)}`}>
                                {history.status === 'pending' && 'Pendiente'}
                                {history.status === 'partial' && 'Parcial'}
                                {history.status === 'received' && 'Recibido'}
                                {history.status === 'cancelled' && 'Cancelado'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No hay historial disponible</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
