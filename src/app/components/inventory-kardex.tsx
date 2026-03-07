import { useState } from "react";
import { Package, FileText, Download, Calendar, Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../contexts/theme-context";

interface KardexEntry {
  id: string;
  date: string;
  movementCode: string;
  type: "entrada" | "salida" | "ajuste" | "transferencia";
  reason: string;
  warehouse: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  balance: number;
  balanceValue: number;
  reference?: string;
  notes?: string;
}

// Datos de ejemplo para el Kardex
const MOCK_PRODUCTS = [
  { code: "PROD-001", name: "Laptop Dell Inspiron 15", unit: "UND" },
  { code: "PROD-002", name: "Mouse Logitech M170", unit: "UND" },
  { code: "PROD-003", name: "Resma Papel Bond A4", unit: "UND" },
  { code: "PROD-004", name: "Teclado Mecánico RGB", unit: "UND" },
  { code: "PROD-005", name: "Monitor LG 24 pulgadas", unit: "UND" },
];

const WAREHOUSES = [
  "Todos",
  "Almacén Principal",
  "Sucursal Norte",
  "Bodega Sur",
];

// Generar datos de ejemplo del kardex
const generateMockKardex = (productCode: string): KardexEntry[] => {
  const entries: KardexEntry[] = [];
  let balance = 0;
  const unitCost = productCode === "PROD-001" ? 650 : productCode === "PROD-002" ? 12 : productCode === "PROD-003" ? 4.5 : productCode === "PROD-004" ? 85 : 320;

  // Saldo inicial
  const initialStock = 10;
  balance = initialStock;
  entries.push({
    id: "initial",
    date: "2026-02-01",
    movementCode: "SALDO-INICIAL",
    type: "entrada",
    reason: "Saldo inicial del período",
    warehouse: "Almacén Principal",
    quantity: initialStock,
    unitCost: unitCost,
    totalCost: initialStock * unitCost,
    balance: balance,
    balanceValue: balance * unitCost,
  });

  // Compra
  const purchaseQty = 20;
  balance += purchaseQty;
  entries.push({
    id: "mov-001",
    date: "2026-02-05",
    movementCode: "MOV-001001",
    type: "entrada",
    reason: "Compra a proveedor",
    warehouse: "Almacén Principal",
    quantity: purchaseQty,
    unitCost: unitCost,
    totalCost: purchaseQty * unitCost,
    balance: balance,
    balanceValue: balance * unitCost,
    reference: "#COMP-0045",
  });

  // Venta
  const saleQty = -8;
  balance += saleQty;
  entries.push({
    id: "mov-002",
    date: "2026-02-10",
    movementCode: "MOV-001015",
    type: "salida",
    reason: "Venta a cliente",
    warehouse: "Almacén Principal",
    quantity: saleQty,
    unitCost: unitCost,
    totalCost: saleQty * unitCost,
    balance: balance,
    balanceValue: balance * unitCost,
    reference: "#VENTA-0128",
  });

  // Transferencia salida
  const transferOutQty = -5;
  balance += transferOutQty;
  entries.push({
    id: "mov-003",
    date: "2026-02-15",
    movementCode: "MOV-001028",
    type: "transferencia",
    reason: "Reabastecimiento de bodega",
    warehouse: "Almacén Principal → Sucursal Norte",
    quantity: transferOutQty,
    unitCost: unitCost,
    totalCost: transferOutQty * unitCost,
    balance: balance,
    balanceValue: balance * unitCost,
    reference: "#TRANS-0012",
  });

  // Compra
  const purchaseQty2 = 15;
  balance += purchaseQty2;
  entries.push({
    id: "mov-004",
    date: "2026-02-18",
    movementCode: "MOV-001042",
    type: "entrada",
    reason: "Compra a proveedor",
    warehouse: "Almacén Principal",
    quantity: purchaseQty2,
    unitCost: unitCost,
    totalCost: purchaseQty2 * unitCost,
    balance: balance,
    balanceValue: balance * unitCost,
    reference: "#COMP-0052",
  });

  // Ajuste por inventario físico
  const adjustQty = -2;
  balance += adjustQty;
  entries.push({
    id: "mov-005",
    date: "2026-02-20",
    movementCode: "MOV-001053",
    type: "ajuste",
    reason: "Inventario físico",
    warehouse: "Almacén Principal",
    quantity: adjustQty,
    unitCost: unitCost,
    totalCost: adjustQty * unitCost,
    balance: balance,
    balanceValue: balance * unitCost,
    notes: "Ajuste por conteo físico mensual",
  });

  // Venta
  const saleQty2 = -12;
  balance += saleQty2;
  entries.push({
    id: "mov-006",
    date: "2026-02-25",
    movementCode: "MOV-001068",
    type: "salida",
    reason: "Venta a cliente",
    warehouse: "Almacén Principal",
    quantity: saleQty2,
    unitCost: unitCost,
    totalCost: saleQty2 * unitCost,
    balance: balance,
    balanceValue: balance * unitCost,
    reference: "#VENTA-0145",
  });

  return entries;
};

export function InventoryKardex() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0]);
  const [dateFrom, setDateFrom] = useState("2026-02-01");
  const [dateTo, setDateTo] = useState("2026-02-27");
  const [selectedWarehouse, setSelectedWarehouse] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const kardexEntries = generateMockKardex(selectedProduct.code);

  // Filtrar entradas por almacén
  const filteredEntries = selectedWarehouse === "Todos" 
    ? kardexEntries 
    : kardexEntries.filter(entry => 
        entry.id === "initial" || entry.warehouse.includes(selectedWarehouse)
      );

  const getTypeInfo = (type: string) => {
    const typeConfig = {
      entrada: { bg: "bg-green-500/10", text: "text-green-400", label: "Entrada" },
      salida: { bg: "bg-red-500/10", text: "text-red-400", label: "Salida" },
      ajuste: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Ajuste" },
      transferencia: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Transferencia" },
    };
    return typeConfig[type as keyof typeof typeConfig];
  };

  const handleExportPDF = () => {
    toast.info("Exportar a PDF - Función en desarrollo");
  };

  const handleExportExcel = () => {
    toast.info("Exportar a Excel - Función en desarrollo");
  };

  const totalEntries = filteredEntries.reduce((sum, entry) => entry.quantity > 0 ? sum + entry.quantity : sum, 0);
  const totalExits = Math.abs(filteredEntries.reduce((sum, entry) => entry.quantity < 0 ? sum + entry.quantity : sum, 0));
  const currentBalance = filteredEntries.length > 0 ? filteredEntries[filteredEntries.length - 1].balance : 0;
  const currentValue = filteredEntries.length > 0 ? filteredEntries[filteredEntries.length - 1].balanceValue : 0;

  // Filtrar productos por búsqueda
  const filteredProducts = MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filtros y Selección de Producto */}
      <div className={`rounded-lg p-5 border ${isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className={`font-semibold text-base ${isLight ? "text-gray-900" : "text-white"}`}>Filtros de Consulta</h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-xs flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            {showFilters ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-3 ${showFilters ? '' : 'hidden lg:grid'}`}>
          {/* Selección de Producto */}
          <div className="lg:col-span-2">
            <label className={`block text-xs mb-1.5 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Producto <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 ${
                  isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a2332] border-white/10 text-white"
                }`}
              />
            </div>
            {searchTerm && filteredProducts.length > 0 && (
              <div className={`absolute z-10 w-full mt-1 border rounded-lg shadow-xl max-h-48 overflow-y-auto ${
                isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
              }`}>
                {filteredProducts.map((product) => (
                  <button
                    key={product.code}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSearchTerm("");
                    }}
                    className={`w-full text-left px-3 py-2 transition-colors border-b last:border-b-0 ${
                      isLight 
                        ? "hover:bg-gray-50 border-gray-100" 
                        : "hover:bg-white/5 border-white/5"
                    }`}
                  >
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{product.name}</p>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{product.code} • {product.unit}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fecha Desde */}
          <div>
            <label className={`block text-xs mb-1.5 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Fecha Desde <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a2332] border-white/10 text-white"
              }`}
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className={`block text-xs mb-1.5 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Fecha Hasta <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a2332] border-white/10 text-white"
              }`}
            />
          </div>

          {/* Almacén */}
          <div>
            <label className={`block text-xs mb-1.5 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Almacén
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#1a2332] border-white/10 text-white"
              }`}
            >
              {WAREHOUSES.map(warehouse => (
                <option key={warehouse} value={warehouse}>{warehouse}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Producto Seleccionado */}
        {!searchTerm && (
          <div className={`mt-4 pt-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>Producto Seleccionado:</p>
                <p className={`font-semibold text-base ${isLight ? "text-gray-900" : "text-white"}`}>{selectedProduct.name}</p>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Código: {selectedProduct.code} • Unidad: {selectedProduct.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPDF}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  onClick={handleExportExcel}
                  className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Excel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla del Kardex */}
      <div className={`rounded-lg overflow-hidden border ${isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"}`}>
        <div className={`px-5 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold text-base flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
              <FileText className="w-5 h-5 text-primary" />
              Kardex de Inventario
            </h3>
            <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              {filteredEntries.length} movimiento(s) • Período: {new Date(dateFrom).toLocaleDateString('es-EC')} - {new Date(dateTo).toLocaleDateString('es-EC')}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isLight ? "bg-gray-50" : "bg-[#151f2e]"}>
              <tr>
                <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha</th>
                <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Movimiento</th>
                <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Tipo</th>
                <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Motivo</th>
                <th className={`px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Almacén</th>
                <th className={`px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Entrada</th>
                <th className={`px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Salida</th>
                <th className={`px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Saldo</th>
                <th className={`px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Costo Unit.</th>
                <th className={`px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>Valor Total</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
              {filteredEntries.map((entry) => {
                const typeInfo = getTypeInfo(entry.type);
                return (
                  <tr key={entry.id} className={isLight ? "hover:bg-gray-50 transition-colors" : "hover:bg-white/[0.02] transition-colors"}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className={`w-3.5 h-3.5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                        <span className={`text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                          {new Date(entry.date).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>{entry.movementCode}</span>
                      {entry.reference && (
                        <p className={`text-[10px] mt-0.5 ${isLight ? "text-gray-400" : "text-gray-500"}`}>{entry.reference}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium ${typeInfo.bg} ${typeInfo.text}`}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${isLight ? "text-gray-900" : "text-white"}`}>{entry.reason}</span>
                      {entry.notes && (
                        <p className={`text-[10px] mt-0.5 ${isLight ? "text-gray-400" : "text-gray-500"}`}>{entry.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>{entry.warehouse}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entry.quantity > 0 ? (
                        <span className="text-green-400 text-sm font-semibold">+{entry.quantity}</span>
                      ) : (
                        <span className={`text-sm ${isLight ? "text-gray-300" : "text-gray-600"}`}>-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entry.quantity < 0 ? (
                        <span className="text-red-400 text-sm font-semibold">{Math.abs(entry.quantity)}</span>
                      ) : (
                        <span className={`text-sm ${isLight ? "text-gray-300" : "text-gray-600"}`}>-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{entry.balance}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>${entry.unitCost.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>${entry.balanceValue.toFixed(2)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className={`border-t-2 border-primary/30 ${isLight ? "bg-gray-50" : "bg-[#151f2e]"}`}>
              <tr>
                <td colSpan={5} className="px-4 py-3 text-right">
                  <span className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>SALDO FINAL:</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-green-400 text-sm font-bold">{totalEntries}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-red-400 text-sm font-bold">{totalExits}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{currentBalance}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-xs ${isLight ? "text-gray-400" : "text-gray-400"}`}>-</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-primary text-base font-bold">${currentValue.toFixed(2)}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}