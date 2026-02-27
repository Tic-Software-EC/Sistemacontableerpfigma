import { useState } from "react";
import { Search, FileText, Calendar, Package, TrendingUp, Download, Filter, X } from "lucide-react";

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
    alert("Exportar a PDF - Función en desarrollo");
  };

  const handleExportExcel = () => {
    alert("Exportar a Excel - Función en desarrollo");
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
      <div className="bg-secondary border border-white/10 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-white font-semibold text-base">Filtros de Consulta</h3>
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
            <label className="block text-gray-400 text-xs mb-1.5">
              Producto <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50"
              />
            </div>
            {searchTerm && filteredProducts.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-[#1a2332] border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <button
                    key={product.code}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(product);
                      setSearchTerm("");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                  >
                    <p className="text-white text-sm font-medium">{product.name}</p>
                    <p className="text-gray-400 text-xs">{product.code} • {product.unit}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fecha Desde */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">
              Fecha Desde <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Fecha Hasta */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">
              Fecha Hasta <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Almacén */}
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">
              Almacén
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
            >
              {WAREHOUSES.map(warehouse => (
                <option key={warehouse} value={warehouse}>{warehouse}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Producto Seleccionado */}
        {!searchTerm && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Producto Seleccionado:</p>
                <p className="text-white font-semibold text-base">{selectedProduct.name}</p>
                <p className="text-gray-400 text-xs">Código: {selectedProduct.code} • Unidad: {selectedProduct.unit}</p>
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

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-gray-400 text-xs">Total Entradas</p>
          </div>
          <p className="text-white text-2xl font-bold">{totalEntries}</p>
          <p className="text-gray-500 text-xs mt-1">{selectedProduct.unit}</p>
        </div>

        <div className="bg-secondary border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
            </div>
            <p className="text-gray-400 text-xs">Total Salidas</p>
          </div>
          <p className="text-white text-2xl font-bold">{totalExits}</p>
          <p className="text-gray-500 text-xs mt-1">{selectedProduct.unit}</p>
        </div>

        <div className="bg-secondary border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <p className="text-gray-400 text-xs">Saldo Actual</p>
          </div>
          <p className="text-white text-2xl font-bold">{currentBalance}</p>
          <p className="text-gray-500 text-xs mt-1">{selectedProduct.unit}</p>
        </div>

        <div className="bg-secondary border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-gray-400 text-xs">Valor en Stock</p>
          </div>
          <p className="text-white text-2xl font-bold">${currentValue.toFixed(2)}</p>
          <p className="text-gray-500 text-xs mt-1">USD</p>
        </div>
      </div>

      {/* Tabla del Kardex */}
      <div className="bg-secondary border border-white/10 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Kardex de Inventario
            </h3>
            <p className="text-gray-400 text-xs">
              {filteredEntries.length} movimiento(s) • Período: {new Date(dateFrom).toLocaleDateString('es-EC')} - {new Date(dateTo).toLocaleDateString('es-EC')}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#151f2e]">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Movimiento</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Motivo</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Almacén</th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Entrada</th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Salida</th>
                <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Saldo</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Costo Unit.</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEntries.map((entry) => {
                const typeInfo = getTypeInfo(entry.type);
                return (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-white text-xs">
                          {new Date(entry.date).toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-300 text-xs font-mono">{entry.movementCode}</span>
                      {entry.reference && (
                        <p className="text-gray-500 text-[10px] mt-0.5">{entry.reference}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium ${typeInfo.bg} ${typeInfo.text}`}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white text-xs">{entry.reason}</span>
                      {entry.notes && (
                        <p className="text-gray-500 text-[10px] mt-0.5">{entry.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-400 text-xs">{entry.warehouse}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entry.quantity > 0 ? (
                        <span className="text-green-400 text-sm font-semibold">+{entry.quantity}</span>
                      ) : (
                        <span className="text-gray-600 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {entry.quantity < 0 ? (
                        <span className="text-red-400 text-sm font-semibold">{Math.abs(entry.quantity)}</span>
                      ) : (
                        <span className="text-gray-600 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-white text-sm font-bold">{entry.balance}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-gray-300 text-xs">${entry.unitCost.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-white text-sm font-semibold">${entry.balanceValue.toFixed(2)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-[#151f2e] border-t-2 border-primary/30">
              <tr>
                <td colSpan={5} className="px-4 py-3 text-right">
                  <span className="text-white text-sm font-bold">SALDO FINAL:</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-green-400 text-sm font-bold">{totalEntries}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-red-400 text-sm font-bold">{totalExits}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-white text-base font-bold">{currentBalance}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-gray-400 text-xs">-</span>
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
