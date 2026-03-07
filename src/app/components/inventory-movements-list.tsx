import { useState } from "react";
import { ArrowDown, ArrowUp, RefreshCw, Package, Eye } from "lucide-react";
import { Pagination } from "./pagination";
import { ViewMovementModal } from "./view-movement-modal";
import { useTheme } from "../contexts/theme-context";

interface MovementProduct {
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  currentStock: number;
}

interface Movement {
  id: string;
  code: string;
  date: string;
  type: "entrada" | "salida" | "ajuste" | "transferencia";
  warehouse: string;
  reason: string;
  reference: string;
  notes?: string;
  products: MovementProduct[];
  createdBy?: string;
  createdAt?: string;
}

const MOCK_MOVEMENTS: Movement[] = [
  {
    id: "1",
    code: "MOV-001005",
    date: "2026-02-27",
    type: "entrada",
    warehouse: "Almacén Principal",
    reason: "Compra masiva a proveedor TechSupplies",
    reference: "COMP-001004",
    notes: "Compra de equipos de cómputo para oficina central",
    createdBy: "Juan Pérez",
    createdAt: "2026-02-27T10:30:00",
    products: [
      {
        productCode: "PROD-001",
        productName: "Laptop Dell Inspiron 15",
        quantity: 10,
        unit: "UND",
        currentStock: 5
      },
      {
        productCode: "PROD-004",
        productName: "Teclado Mecánico RGB",
        quantity: 15,
        unit: "UND",
        currentStock: 8
      },
      {
        productCode: "PROD-002",
        productName: "Mouse Logitech M170",
        quantity: 20,
        unit: "UND",
        currentStock: 3
      }
    ]
  },
  {
    id: "2",
    code: "MOV-001004",
    date: "2026-02-27",
    type: "salida",
    warehouse: "Almacén Principal",
    reason: "Venta a cliente corporativo",
    reference: "VENTA-002134",
    notes: "Venta para empresa ACME Corp",
    createdBy: "María González",
    createdAt: "2026-02-27T14:15:00",
    products: [
      {
        productCode: "PROD-002",
        productName: "Mouse Logitech M170",
        quantity: -5,
        unit: "UND",
        currentStock: 23
      },
      {
        productCode: "PROD-003",
        productName: "Resma Papel Bond A4",
        quantity: -10,
        unit: "UND",
        currentStock: 45
      }
    ]
  },
  {
    id: "3",
    code: "MOV-001003",
    date: "2026-02-26",
    type: "transferencia",
    warehouse: "Almacén Principal → Sucursal Norte",
    reason: "Transferencia entre almacenes por apertura de nueva sucursal",
    reference: "TRANS-000045",
    notes: "Equipamiento inicial para sucursal norte",
    createdBy: "Carlos Ramírez",
    createdAt: "2026-02-26T09:00:00",
    products: [
      {
        productCode: "PROD-003",
        productName: "Resma Papel Bond A4",
        quantity: 20,
        unit: "UND",
        currentStock: 55
      },
      {
        productCode: "PROD-001",
        productName: "Laptop Dell Inspiron 15",
        quantity: 5,
        unit: "UND",
        currentStock: 15
      },
      {
        productCode: "PROD-005",
        productName: "Monitor LG 24 pulgadas",
        quantity: 3,
        unit: "UND",
        currentStock: 4
      }
    ]
  },
  {
    id: "4",
    code: "MOV-001002",
    date: "2026-02-26",
    type: "ajuste",
    warehouse: "Almacén Principal",
    reason: "Ajuste por inventario físico - diferencias encontradas",
    reference: "AJ-000012",
    notes: "Ajuste después de conteo físico mensual",
    createdBy: "Ana López",
    createdAt: "2026-02-26T16:45:00",
    products: [
      {
        productCode: "PROD-004",
        productName: "Teclado Mecánico RGB",
        quantity: -2,
        unit: "UND",
        currentStock: 10
      },
      {
        productCode: "PROD-002",
        productName: "Mouse Logitech M170",
        quantity: 3,
        unit: "UND",
        currentStock: 18
      }
    ]
  },
  {
    id: "5",
    code: "MOV-001001",
    date: "2026-02-25",
    type: "entrada",
    warehouse: "Sucursal Norte",
    reason: "Compra local a proveedor Importaciones del Pacífico",
    reference: "COMP-001003",
    notes: "Compra de monitores para equipamiento de sucursal",
    createdBy: "Roberto Díaz",
    createdAt: "2026-02-25T11:20:00",
    products: [
      {
        productCode: "PROD-005",
        productName: "Monitor LG 24 pulgadas",
        quantity: 8,
        unit: "UND",
        currentStock: 1
      }
    ]
  },
];

export function InventoryMovementsList() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);

  const filteredMovements = MOCK_MOVEMENTS.filter((movement) => {
    const matchesSearch =
      movement.products.some(product => product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      movement.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || movement.type === filterType;

    return matchesSearch && matchesType;
  });

  // Paginación
  const totalItems = filteredMovements.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredMovements.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      entrada: { bg: "bg-green-500/10", text: "text-green-400", label: "Entrada", icon: ArrowDown },
      salida: { bg: "bg-red-500/10", text: "text-red-400", label: "Salida", icon: ArrowUp },
      ajuste: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Ajuste", icon: RefreshCw },
      transferencia: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Transferencia", icon: Package }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${
            isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a2332] border-white/10 text-white"
          }`}
        >
          <option value="all">Todos los tipos</option>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
          <option value="ajuste">Ajuste</option>
          <option value="transferencia">Transferencia</option>
        </select>
      </div>

      {/* Table */}
      <div className={`rounded-lg overflow-hidden border ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/5"}`}>
        <table className="w-full">
          <thead className={isLight ? "bg-gray-50" : "bg-[#151f2e]"}>
            <tr>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Código</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Tipo</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Almacén</th>
              <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cantidad</th>
              <th className={`px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Acciones</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
            {currentItems.map((movement) => (
              <tr key={movement.id} className={isLight ? "hover:bg-gray-50 transition-colors" : "hover:bg-white/[0.02] transition-colors"}>
                <td className="px-4 py-3">
                  <span className={`font-mono text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{movement.code}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{new Date(movement.date).toLocaleDateString('es-EC')}</span>
                </td>
                <td className="px-4 py-3">
                  {getTypeBadge(movement.type)}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{movement.warehouse}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-medium ${movement.products.reduce((acc, product) => acc + product.quantity, 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {movement.products.reduce((acc, product) => acc + product.quantity, 0) > 0 ? '+' : ''}{movement.products.reduce((acc, product) => acc + product.quantity, 0)} {movement.products[0].unit}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button className={`p-1.5 rounded-md transition-colors ${isLight ? "text-primary hover:bg-primary/10" : "text-primary hover:bg-primary/10"}`} title="Ver" onClick={() => setSelectedMovement(movement)}>
                      <Eye className="w-4 h-4" />
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

      {/* View Movement Modal */}
      {selectedMovement && (
        <ViewMovementModal
          isOpen={!!selectedMovement}
          movement={selectedMovement}
          onClose={() => setSelectedMovement(null)}
        />
      )}
    </div>
  );
}