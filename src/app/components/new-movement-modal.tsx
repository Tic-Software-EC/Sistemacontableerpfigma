import { useState } from "react";
import { X, Plus, Trash2, Package, TrendingUp, FileText, Search, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../contexts/theme-context";

interface NewMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MovementProduct {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  currentStock: number;
}

// Productos disponibles para agregar al movimiento
const AVAILABLE_PRODUCTS = [
  { code: "PROD-001", name: "Laptop Dell Inspiron 15", unit: "UND", currentStock: 15 },
  { code: "PROD-002", name: "Mouse Logitech M170", unit: "UND", currentStock: 3 },
  { code: "PROD-003", name: "Resma Papel Bond A4", unit: "UND", currentStock: 45 },
  { code: "PROD-004", name: "Teclado Mecánico RGB", unit: "UND", currentStock: 8 },
  { code: "PROD-005", name: "Monitor LG 24 pulgadas", unit: "UND", currentStock: 1 },
];

// Motivos según tipo de movimiento
const REASONS_BY_TYPE = {
  entrada: [
    { value: "Compra a proveedor", label: "Compra a proveedor" },
    { value: "Devolución de cliente", label: "Devolución de cliente" },
    { value: "Producción interna", label: "Producción interna" },
    { value: "Donación recibida", label: "Donación recibida" },
    { value: "Otros ingresos", label: "Otros ingresos" },
  ],
  salida: [
    { value: "Venta a cliente", label: "Venta a cliente" },
    { value: "Devolución a proveedor", label: "Devolución a proveedor" },
    { value: "Consumo interno", label: "Consumo interno" },
    { value: "Producto dañado", label: "Producto dañado" },
    { value: "Otros egresos", label: "Otros egresos" },
  ],
  ajuste: [
    { value: "Inventario físico", label: "Inventario físico" },
    { value: "Corrección de error", label: "Corrección de error" },
    { value: "Producto vencido", label: "Producto vencido" },
    { value: "Merma", label: "Merma" },
    { value: "Otros ajustes", label: "Otros ajustes" },
  ],
  transferencia: [
    { value: "Reabastecimiento de bodega", label: "Reabastecimiento de bodega" },
    { value: "Redistribución de stock", label: "Redistribución de stock" },
    { value: "Apertura de sucursal", label: "Apertura de sucursal" },
    { value: "Cierre de sucursal", label: "Cierre de sucursal" },
    { value: "Otros", label: "Otros" },
  ],
};

export function NewMovementModal({ isOpen, onClose }: NewMovementModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const [formData, setFormData] = useState({
    type: "entrada",
    date: new Date().toISOString().split('T')[0],
    warehouse: "",
    warehouseTo: "", // Para transferencias
    reason: "",
    reference: "",
    notes: "",
  });

  const [products, setProducts] = useState<MovementProduct[]>([]);
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (products.length === 0) {
      toast.error("Debe agregar al menos un producto al movimiento");
      return;
    }

    const movementData = {
      ...formData,
      products,
      totalProducts: products.length,
      totalQuantity: products.reduce((sum, p) => sum + Math.abs(p.quantity), 0),
    };
    
    console.log("Movimiento a guardar:", movementData);
    onClose();
    // Reset form
    setProducts([]);
    setFormData({
      type: "entrada",
      date: new Date().toISOString().split('T')[0],
      warehouse: "",
      warehouseTo: "",
      reason: "",
      reference: "",
      notes: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset reason cuando cambia el tipo
    if (name === "type") {
      setFormData(prev => ({ ...prev, reason: "" }));
    }
  };

  const addProduct = (product: typeof AVAILABLE_PRODUCTS[0]) => {
    // Verificar si el producto ya está agregado
    if (products.find(p => p.productCode === product.code)) {
      toast.error("Este producto ya está en la lista");
      return;
    }

    const newProduct: MovementProduct = {
      id: Date.now().toString(),
      productCode: product.code,
      productName: product.name,
      quantity: formData.type === "salida" ? -1 : 1,
      unit: product.unit,
      currentStock: product.currentStock,
    };

    setProducts([...products, newProduct]);
    setShowProductSearch(false);
    setSearchQuery("");
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProductQuantity = (id: string, quantity: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, quantity } : p
    ));
  };

  const filteredProducts = AVAILABLE_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalQuantity = products.reduce((sum, p) => sum + Math.abs(p.quantity), 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`w-full max-w-5xl border rounded-xl shadow-2xl my-8 ${
        isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? "border-gray-200" : "border-white/10"
        }`}>
          <div>
            <h3 className={`font-bold text-lg ${
              isLight ? "text-gray-900" : "text-white"
            }`}>Nuevo Movimiento de Inventario</h3>
            <p className={`text-xs mt-0.5 ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              Complete los datos del movimiento y agregue los productos
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight 
                ? "text-gray-400 hover:text-gray-900 hover:bg-gray-100" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Información General */}
            <div>
              <h4 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>
                <FileText className="w-4 h-4 text-primary" />
                Información del Movimiento
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tipo de Movimiento */}
                <div>
                  <label className={`block text-xs mb-1.5 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Tipo <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900" 
                        : "bg-[#1a2332] border-white/10 text-white"
                    }`}
                  >
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                    <option value="ajuste">Ajuste</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>

                {/* Fecha */}
                <div>
                  <label className={`block text-xs mb-1.5 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Fecha <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900" 
                        : "bg-[#1a2332] border-white/10 text-white"
                    }`}
                  />
                </div>

                {/* Referencia */}
                <div>
                  <label className={`block text-xs mb-1.5 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Referencia #
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="#REF-0001"
                    className={`w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900" 
                        : "bg-[#1a2332] border-white/10 text-white"
                    }`}
                  />
                </div>

                {/* Almacén Origen */}
                <div>
                  <label className={`block text-xs mb-1.5 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {formData.type === "transferencia" ? "Almacén Origen" : "Almacén"} <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="warehouse"
                    value={formData.warehouse}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900" 
                        : "bg-[#1a2332] border-white/10 text-white"
                    }`}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Almacén Principal">Almacén Principal</option>
                    <option value="Sucursal Norte">Sucursal Norte</option>
                    <option value="Bodega Sur">Bodega Sur</option>
                  </select>
                </div>

                {/* Almacén Destino (solo para transferencias) */}
                {formData.type === "transferencia" && (
                  <div>
                    <label className={`block text-xs mb-1.5 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      Almacén Destino <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="warehouseTo"
                      value={formData.warehouseTo}
                      onChange={handleChange}
                      required={formData.type === "transferencia"}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${
                        isLight 
                          ? "bg-white border-gray-300 text-gray-900" 
                          : "bg-[#1a2332] border-white/10 text-white"
                      }`}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Almacén Principal">Almacén Principal</option>
                      <option value="Sucursal Norte">Sucursal Norte</option>
                      <option value="Bodega Sur">Bodega Sur</option>
                    </select>
                  </div>
                )}

                {/* Motivo */}
                <div className={formData.type === "transferencia" ? "" : "md:col-span-2"}>
                  <label className={`block text-xs mb-1.5 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Motivo <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900" 
                        : "bg-[#1a2332] border-white/10 text-white"
                    }`}
                  >
                    <option value="">Seleccionar motivo...</option>
                    {REASONS_BY_TYPE[formData.type as keyof typeof REASONS_BY_TYPE].map(reason => (
                      <option key={reason.value} value={reason.value}>{reason.label}</option>
                    ))}
                  </select>
                </div>

                {/* Notas */}
                <div className="md:col-span-3">
                  <label className={`block text-xs mb-1.5 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Notas
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Información adicional..."
                    className={`w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900" 
                        : "bg-[#1a2332] border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Productos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-semibold text-sm flex items-center gap-2 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}>
                  <Package className="w-4 h-4 text-primary" />
                  Detalle de Productos
                </h4>
                <button
                  type="button"
                  onClick={() => setShowProductSearch(!showProductSearch)}
                  className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar
                </button>
              </div>

              {/* Buscador de Productos */}
              {showProductSearch && (
                <div className={`mb-3 border rounded-lg p-3 ${
                  isLight 
                    ? "bg-gray-50 border-gray-200" 
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por código o nombre de producto..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 ${
                        isLight 
                          ? "bg-white border-gray-300 text-gray-900" 
                          : "bg-secondary border-white/10 text-white"
                      }`}
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.code}
                        type="button"
                        onClick={() => addProduct(product)}
                        disabled={products.some(p => p.productCode === product.code)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isLight 
                            ? "bg-white hover:bg-gray-100 border border-gray-200" 
                            : "bg-secondary hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm font-medium ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}>{product.name}</p>
                            <p className="text-gray-400 text-xs">{product.code}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-xs">Stock: {product.currentStock}</p>
                            <p className="text-gray-500 text-xs">{product.unit}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    {filteredProducts.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">No se encontraron productos</p>
                    )}
                  </div>
                </div>
              )}

              {/* Tabla de Productos */}
              {products.length > 0 ? (
                <div className={`border rounded-lg overflow-hidden ${
                  isLight 
                    ? "bg-white border-gray-200" 
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <table className="w-full">
                    <thead className={isLight ? "bg-gray-50" : "bg-[#151f2e]"}>
                      <tr>
                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}>#</th>
                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}>Código</th>
                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}>Producto</th>
                        <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}>Stock Actual</th>
                        <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}>Cantidad</th>
                        <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}>Unidad</th>
                        <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${
                      isLight ? "divide-gray-200" : "divide-white/5"
                    }`}>
                      {products.map((product, index) => (
                        <tr key={product.id} className={
                          isLight 
                            ? "hover:bg-gray-50 transition-colors" 
                            : "hover:bg-white/[0.02] transition-colors"
                        }>
                          <td className="px-4 py-2.5">
                            <span className="text-gray-400 text-sm font-mono">{index + 1}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`text-sm font-mono ${
                              isLight ? "text-gray-700" : "text-gray-300"
                            }`}>{product.productCode}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`text-sm ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}>{product.productName}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-gray-400 text-sm">{product.currentStock}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <input
                              type="number"
                              value={Math.abs(product.quantity)}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                updateProductQuantity(product.id, formData.type === "salida" ? -value : value);
                              }}
                              min="1"
                              max={formData.type === "salida" ? product.currentStock : undefined}
                              className={`w-20 px-2 py-1.5 border rounded-lg text-sm text-center focus:outline-none focus:border-primary/50 ${
                                isLight 
                                  ? "bg-white border-gray-300 text-gray-900" 
                                  : "bg-secondary border-white/10 text-white"
                              }`}
                            />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-gray-400 text-sm">{product.unit}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className={`border-t ${
                      isLight 
                        ? "bg-gray-50 border-gray-200" 
                        : "bg-[#151f2e] border-white/10"
                    }`}>
                      <tr>
                        <td colSpan={4} className="px-4 py-2.5 text-right">
                          <span className="text-gray-400 text-sm font-semibold">Total:</span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`text-sm font-bold ${
                            isLight ? "text-gray-900" : "text-white"
                          }`}>{totalQuantity}</span>
                        </td>
                        <td colSpan={2} className="px-4 py-2.5 text-center">
                          <span className="text-gray-400 text-xs">{products.length} producto(s)</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className={`text-center py-12 border border-dashed rounded-lg ${
                  isLight 
                    ? "bg-gray-50 border-gray-300" 
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No hay productos agregados</p>
                  <p className="text-gray-500 text-xs mt-1">Haz clic en "Agregar" para seleccionar productos</p>
                </div>
              )}

              {/* Advertencia para salidas con stock insuficiente */}
              {formData.type === "salida" && products.some(p => Math.abs(p.quantity) > p.currentStock) && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 text-xs font-medium">Stock insuficiente</p>
                    <p className="text-red-400/80 text-xs mt-0.5">
                      Algunos productos tienen una cantidad mayor al stock disponible
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
            isLight 
              ? "border-gray-200 bg-gray-50" 
              : "border-white/10 bg-[#1a2332]"
          }`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors font-medium text-xs ${
                isLight 
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300" 
                  : "bg-white/5 hover:bg-white/10 text-white"
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={products.length === 0}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium shadow-lg shadow-primary/20 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
