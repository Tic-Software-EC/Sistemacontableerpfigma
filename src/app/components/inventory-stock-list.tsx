import { useState } from "react";
import { Package, AlertTriangle, CheckCircle2, Eye, Edit, Trash2 } from "lucide-react";
import { Pagination } from "./pagination";
import { ViewProductModal } from "./view-product-modal";
import { NewProductModal } from "./new-product-modal";

interface StockItem {
  id: string;
  code: string;
  productName: string;
  category: string;
  warehouse: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPrice: number;
  salePrice: number;
  status: "normal" | "low" | "critical" | "overstock";
  lastMovement: string;
  description?: string;
  supplier?: string;
  imagePreview?: string | null;
  characteristics?: Array<{ id: string; name: string; value: string }>;
}

const MOCK_STOCK: StockItem[] = [
  {
    id: "1",
    code: "PROD-001",
    productName: "Laptop Dell Inspiron 15",
    category: "Tecnología",
    warehouse: "Almacén Principal",
    quantity: 15,
    minStock: 10,
    maxStock: 50,
    unit: "UND",
    costPrice: 750.00,
    salePrice: 950.00,
    status: "normal",
    lastMovement: "2026-02-25",
    description: "Laptop empresarial con procesador Intel Core i5, ideal para trabajo profesional y multitarea",
    supplier: "TechSupplies Ltda.",
    imagePreview: null,
    characteristics: [
      { id: "1", name: "Procesador", value: "Intel Core i5 11va Gen" },
      { id: "2", name: "RAM", value: "8GB DDR4" },
      { id: "3", name: "Almacenamiento", value: "256GB SSD" },
      { id: "4", name: "Pantalla", value: "15.6 pulgadas Full HD" },
      { id: "5", name: "Sistema Operativo", value: "Windows 11 Pro" },
      { id: "6", name: "Garantía", value: "1 año" }
    ]
  },
  {
    id: "2",
    code: "PROD-002",
    productName: "Mouse Logitech M170",
    category: "Tecnología",
    warehouse: "Almacén Principal",
    quantity: 3,
    minStock: 20,
    maxStock: 100,
    unit: "UND",
    costPrice: 8.50,
    salePrice: 12.99,
    status: "critical",
    lastMovement: "2026-02-26",
    description: "Mouse inalámbrico con diseño ergonómico y batería de larga duración",
    supplier: "Distribuidora Nacional",
    imagePreview: null,
    characteristics: [
      { id: "1", name: "Conectividad", value: "Inalámbrico 2.4GHz" },
      { id: "2", name: "DPI", value: "1000 DPI" },
      { id: "3", name: "Batería", value: "12 meses" },
      { id: "4", name: "Color", value: "Negro" }
    ]
  },
  {
    id: "3",
    code: "PROD-003",
    productName: "Resma Papel Bond A4",
    category: "Papelería",
    warehouse: "Sucursal Norte",
    quantity: 45,
    minStock: 30,
    maxStock: 80,
    unit: "UND",
    costPrice: 3.50,
    salePrice: 4.99,
    status: "normal",
    lastMovement: "2026-02-24",
    description: "Papel bond tamaño A4 de alta calidad para impresión láser e inyección de tinta",
    supplier: "Suministros Corporativos",
    imagePreview: null,
    characteristics: [
      { id: "1", name: "Tamaño", value: "A4 (21 x 29.7 cm)" },
      { id: "2", name: "Gramaje", value: "75 g/m²" },
      { id: "3", name: "Hojas por resma", value: "500 hojas" },
      { id: "4", name: "Blancura", value: "96%" }
    ]
  },
  {
    id: "4",
    code: "PROD-004",
    productName: "Teclado Mecánico RGB",
    category: "Tecnología",
    warehouse: "Almacén Principal",
    quantity: 8,
    minStock: 15,
    maxStock: 40,
    unit: "UND",
    costPrice: 45.00,
    salePrice: 69.99,
    status: "low",
    lastMovement: "2026-02-23",
    description: "Teclado mecánico gaming con iluminación RGB personalizable y switches mecánicos",
    supplier: "TechSupplies Ltda.",
    imagePreview: null,
    characteristics: [
      { id: "1", name: "Tipo de Switch", value: "Mecánico Blue" },
      { id: "2", name: "Iluminación", value: "RGB 16.8M colores" },
      { id: "3", name: "Conectividad", value: "USB Cable" },
      { id: "4", name: "Distribución", value: "Español" },
      { id: "5", name: "Anti-Ghosting", value: "Sí" }
    ]
  },
  {
    id: "5",
    code: "PROD-005",
    productName: "Monitor LG 24 pulgadas",
    category: "Tecnología",
    warehouse: "Sucursal Norte",
    quantity: 1,
    minStock: 5,
    maxStock: 20,
    unit: "UND",
    costPrice: 180.00,
    salePrice: 249.99,
    status: "critical",
    lastMovement: "2026-02-27",
    description: "Monitor LED Full HD con tecnología IPS para colores vibrantes y amplios ángulos de visión",
    supplier: "Importaciones del Pacífico",
    imagePreview: null,
    characteristics: [
      { id: "1", name: "Tamaño", value: "24 pulgadas" },
      { id: "2", name: "Resolución", value: "1920 x 1080 Full HD" },
      { id: "3", name: "Panel", value: "IPS" },
      { id: "4", name: "Frecuencia", value: "75Hz" },
      { id: "5", name: "Puertos", value: "HDMI, VGA" },
      { id: "6", name: "Tiempo de Respuesta", value: "5ms" }
    ]
  },
];

export function InventoryStockList() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados para modales
  const [viewProduct, setViewProduct] = useState<StockItem | null>(null);
  const [editProduct, setEditProduct] = useState<StockItem | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredStock = MOCK_STOCK.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesWarehouse = filterWarehouse === "all" || item.warehouse === filterWarehouse;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;

    return matchesSearch && matchesWarehouse && matchesStatus && matchesCategory;
  });

  // Paginación
  const totalItems = filteredStock.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredStock.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      normal: { bg: "bg-green-500/10", text: "text-green-400", label: "Normal", icon: CheckCircle2 },
      low: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Stock Bajo", icon: AlertTriangle },
      critical: { bg: "bg-red-500/10", text: "text-red-400", label: "Crítico", icon: AlertTriangle },
      overstock: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Sobrestock", icon: Package }
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

  const handleViewProduct = (product: StockItem) => {
    setViewProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product: StockItem) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product: StockItem) => {
    if (confirm(`¿Estás seguro de eliminar el producto "${product.productName}"?`)) {
      console.log("Eliminando producto:", product);
      // Aquí iría la lógica para eliminar el producto
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
        >
          <option value="all">Todas las categorías</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Papelería">Papelería</option>
        </select>
        <select
          value={filterWarehouse}
          onChange={(e) => setFilterWarehouse(e.target.value)}
          className="px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
        >
          <option value="all">Todos los almacenes</option>
          <option value="Almacén Principal">Almacén Principal</option>
          <option value="Sucursal Norte">Sucursal Norte</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
        >
          <option value="all">Todos los estados</option>
          <option value="normal">Normal</option>
          <option value="low">Stock Bajo</option>
          <option value="critical">Crítico</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a2332] rounded-lg overflow-hidden border border-white/5">
        <table className="w-full">
          <thead className="bg-[#151f2e]">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Código</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Producto</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Categoría</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Almacén</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Precio Venta</th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <span className="text-white font-mono text-sm">{item.code}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white text-sm">{item.productName}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-400 text-sm">{item.category}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-gray-300 text-sm">{item.warehouse}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-white text-sm">{item.quantity} {item.unit}</span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-4 py-3">
                  <span className="text-white text-sm font-medium">${item.salePrice.toFixed(2)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors" title="Ver" onClick={() => handleViewProduct(item)}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:bg-white/5 rounded-md transition-colors" title="Editar" onClick={() => handleEditProduct(item)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Eliminar" onClick={() => handleDeleteProduct(item)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
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

      {/* Modales */}
      <ViewProductModal 
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewProduct(null);
        }}
        product={viewProduct}
      />

      <NewProductModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditProduct(null);
        }}
        productData={editProduct ? {
          code: editProduct.code,
          name: editProduct.productName,
          category: editProduct.category,
          description: editProduct.description || "", // Los datos mock no tienen descripción, se puede agregar
          supplier: editProduct.supplier || "", // Los datos mock no tienen proveedor, se puede agregar
          warehouse: editProduct.warehouse,
          quantity: editProduct.quantity.toString(),
          minStock: editProduct.minStock.toString(),
          maxStock: editProduct.maxStock.toString(),
          unit: editProduct.unit,
          unitsPerPackage: "", // Los datos mock no tienen esto, se puede agregar
          costPrice: editProduct.costPrice.toString(),
          salePrice: editProduct.salePrice.toString(),
          imagePreview: editProduct.imagePreview, // Los datos mock no tienen imagen
          characteristics: editProduct.characteristics || [], // Los datos mock no tienen características
        } : undefined}
        mode="edit"
      />
    </div>
  );
}