import { useState } from "react";
import { X, ShoppingCart, User, Check, Search, ChevronDown } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface Supplier {
  id: string;
  name: string;
  ruc: string;
  address: string;
  email: string;
  phone: string;
  contact: string;
}

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  taxRate: number;
  stock: number;
}

interface OrderItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  subtotal: number;
}

/* ══════════════════════════════════════════════════════════════════════
   DATOS MOCK
═════════════════════════════════════════════════════════════════════ */
const SUPPLIERS_MOCK: Supplier[] = [
  {
    id: "1",
    name: "Tecnología Avanzada S.A.",
    ruc: "1792345678001",
    address: "Av. República 456, Quito",
    email: "ventas@tecnoavanzada.com",
    phone: "02-2456789",
    contact: "Ing. Carlos Pérez"
  },
  {
    id: "2",
    name: "Papelería Corporativa Ltda.",
    ruc: "1798765432001",
    address: "Calle Bolívar 234, Cuenca",
    email: "ventas@papeleriacorp.com",
    phone: "07-2890123",
    contact: "Lcda. María González"
  },
  {
    id: "3",
    name: "Distribuidora La Favorita C.A.",
    ruc: "1790016919001",
    address: "Av. General Enríquez km 4.5, Sangolquí",
    email: "ventas@favorita.com",
    phone: "02-3456789",
    contact: "Sr. Roberto Torres"
  },
];

const PRODUCTS_MOCK: Product[] = [
  { id: "1", code: "PROD-001", name: "Laptop Dell Latitude 5420", price: 850.00, taxRate: 12, stock: 15 },
  { id: "2", code: "PROD-002", name: "Monitor LG 27 pulgadas", price: 320.00, taxRate: 12, stock: 25 },
  { id: "3", code: "PROD-005", name: "Resma papel bond A4", price: 4.50, taxRate: 0, stock: 200 },
  { id: "4", code: "PROD-006", name: "Marcadores permanentes x12", price: 8.75, taxRate: 12, stock: 50 },
  { id: "5", code: "PROD-008", name: "Silla ergonómica oficina", price: 185.00, taxRate: 12, stock: 30 },
  { id: "6", code: "PROD-009", name: "Escritorio ejecutivo", price: 450.00, taxRate: 12, stock: 12 },
];

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
interface PurchaseOrderWizardProps {
  onClose: () => void;
  onCreate: (data: any) => void;
}

export function PurchaseOrderWizard({ onClose, onCreate }: PurchaseOrderWizardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados del wizard
  const [currentStep, setCurrentStep] = useState(1);

  // Paso 1: Selección de proveedor
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  // Paso 2: Detalles y productos
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Filtros
  const filteredSuppliers = SUPPLIERS_MOCK.filter(s =>
    s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    s.ruc.includes(supplierSearch)
  );

  const filteredProducts = PRODUCTS_MOCK.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.code.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Funciones de navegación
  const canGoNext = () => {
    if (currentStep === 1) return selectedSupplier !== null;
    if (currentStep === 2) return items.length > 0 && deliveryDate !== "";
    return true;
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Funciones de productos
  const handleAddProduct = (product: Product) => {
    const existingItem = items.find(item => item.productId === product.id);
    if (existingItem) {
      toast.error("Este producto ya está agregado");
      return;
    }

    const newItem: OrderItem = {
      id: Date.now().toString(),
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price,
      tax: product.taxRate,
      discount: 0,
      subtotal: product.price,
    };

    setItems([...items, newItem]);
    setProductSearch("");
    setShowProductDropdown(false);
    toast.success("✓ Producto agregado");
  };

  const handleUpdateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      
      const updated = { ...item, [field]: value };
      
      // Recalcular subtotal
      const subtotalBase = updated.quantity * updated.unitPrice;
      const subtotalConDescuento = subtotalBase - updated.discount;
      updated.subtotal = subtotalConDescuento;
      
      return updated;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Cálculos totales
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const subtotalConDescuento = subtotal - totalDiscount;
  const totalTax = items.reduce((sum, item) => {
    const itemSubtotal = (item.quantity * item.unitPrice) - item.discount;
    return sum + (itemSubtotal * item.tax / 100);
  }, 0);
  const total = subtotalConDescuento + totalTax;

  // Crear orden
  const handleCreate = () => {
    if (!selectedSupplier || items.length === 0) {
      toast.error("Completa todos los campos requeridos");
      return;
    }

    const newOrder = {
      id: Date.now().toString(),
      orderNumber: `OC-2026-${String(Math.floor(Math.random() * 999999)).padStart(6, "0")}`,
      date: orderDate,
      deliveryDate,
      supplier: {
        name: selectedSupplier.name,
        ruc: selectedSupplier.ruc,
        address: selectedSupplier.address,
        email: selectedSupplier.email,
        phone: selectedSupplier.phone,
        contact: selectedSupplier.contact,
      },
      items: items.map(item => ({
        id: item.id,
        productCode: item.productCode,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        tax: item.tax,
        discount: item.discount,
        subtotal: item.subtotal,
        receivedQuantity: 0,
      })),
      subtotal: subtotalConDescuento,
      totalDiscount,
      tax: totalTax,
      total,
      status: "draft" as const,
      buyer: "Usuario Actual",
      branch: "Sucursal Centro",
      notes,
      createdBy: "Usuario Actual",
    };

    onCreate(newOrder);
    toast.success("✓ Orden de compra creada correctamente");
    onClose();
  };

  /* ════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full max-w-5xl max-h-[60vh] flex flex-col rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/20"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-2.5 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                Nueva Orden de Compra
              </h3>
              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                Completa los datos para crear una nueva orden
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Indicator */}
        <div className={`px-6 py-2.5 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Paso 1 */}
            <div className="flex items-center gap-2.5 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                currentStep >= 1
                  ? "bg-primary text-white"
                  : isLight
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white/10 text-gray-400"
              }`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= 1
                  ? isLight ? "text-darkBg" : "text-white"
                  : isLight ? "text-gray-500" : "text-gray-400"
              }`}>
                Proveedor
              </span>
            </div>

            <div className={`h-0.5 flex-1 ${currentStep > 1 ? "bg-primary" : isLight ? "bg-gray-200" : "bg-white/10"}`}></div>

            {/* Paso 2 */}
            <div className="flex items-center gap-2.5 flex-1 justify-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                currentStep >= 2
                  ? "bg-primary text-white"
                  : isLight
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white/10 text-gray-400"
              }`}>
                {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= 2
                  ? isLight ? "text-darkBg" : "text-white"
                  : isLight ? "text-gray-500" : "text-gray-400"
              }`}>
                Productos
              </span>
            </div>

            <div className={`h-0.5 flex-1 ${currentStep > 2 ? "bg-primary" : isLight ? "bg-gray-200" : "bg-white/10"}`}></div>

            {/* Paso 3 */}
            <div className="flex items-center gap-2.5 flex-1 justify-end">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                currentStep >= 3
                  ? "bg-primary text-white"
                  : isLight
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white/10 text-gray-400"
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${
                currentStep >= 3
                  ? isLight ? "text-darkBg" : "text-white"
                  : isLight ? "text-gray-500" : "text-gray-400"
              }`}>
                Confirmación
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* ═══ PASO 1: Selección de Proveedor ═══ */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className={`rounded-lg border p-4 ${
                isLight ? "bg-blue-50 border-blue-200" : "bg-blue-900/20 border-blue-500/30"
              }`}>
                <p className={`text-sm font-medium ${isLight ? "text-blue-900" : "text-blue-200"}`}>
                  Selecciona el proveedor para esta orden de compra
                </p>
              </div>

              {/* Buscador de proveedor */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Buscar Proveedor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${
                    isLight ? "bg-white border-gray-300" : "bg-white/5 border-white/15"
                  }`}>
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={supplierSearch}
                      onChange={(e) => {
                        setSupplierSearch(e.target.value);
                        setShowSupplierDropdown(true);
                      }}
                      onFocus={() => setShowSupplierDropdown(true)}
                      placeholder="Buscar por nombre o RUC..."
                      className={`flex-1 bg-transparent text-sm focus:outline-none ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    />
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Dropdown de Proveedores - Altura aumentada a 96 (384px) */}
                  {showSupplierDropdown && filteredSuppliers.length > 0 && (
                    <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto ${
                      isLight ? "bg-white border-gray-300" : "bg-[#1a2332] border-white/15"
                    }`}>
                      {filteredSuppliers.map((supplier) => (
                        <button
                          key={supplier.id}
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setSupplierSearch(supplier.name);
                            setShowSupplierDropdown(false);
                          }}
                          className={`w-full text-left px-5 py-4 hover:bg-primary/10 transition-colors border-b last:border-b-0 ${
                            isLight ? "border-gray-200" : "border-white/10"
                          }`}
                        >
                          <div className={`font-bold text-lg mb-1.5 ${isLight ? "text-gray-900" : "text-white"}`}>
                            {supplier.name}
                          </div>
                          <div className={`text-base ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                            RUC: {supplier.ruc} • {supplier.contact}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Proveedor seleccionado */}
              {selectedSupplier && (
                <div className={`rounded-lg border p-4 ${
                  isLight ? "bg-green-50 border-green-200" : "bg-green-900/20 border-green-500/30"
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${isLight ? "text-green-900" : "text-green-200"}`}>
                        {selectedSupplier.name}
                      </p>
                      <p className={`text-xs mt-0.5 ${isLight ? "text-green-700" : "text-green-300"}`}>
                        RUC: {selectedSupplier.ruc}
                      </p>
                      <p className={`text-xs mt-0.5 ${isLight ? "text-green-700" : "text-green-300"}`}>
                        {selectedSupplier.address}
                      </p>
                      <p className={`text-xs mt-0.5 ${isLight ? "text-green-700" : "text-green-300"}`}>
                        Contacto: {selectedSupplier.contact} • {selectedSupplier.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ PASO 2: Productos ═══ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Fecha de Orden <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-lg border text-sm ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/15 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Fecha de Entrega <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={orderDate}
                    className={`w-full px-3 py-1.5 rounded-lg border text-sm ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/15 text-white"
                    }`}
                  />
                </div>
              </div>

              {/* Buscador de productos */}
              <div className="relative">
                <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Agregar Producto
                </label>
                <div className="relative">
                  <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${
                    isLight ? "bg-white border-gray-300" : "bg-white/5 border-white/15"
                  }`}>
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductDropdown(true);
                      }}
                      onFocus={() => setShowProductDropdown(true)}
                      placeholder="Buscar por código o nombre..."
                      className={`flex-1 bg-transparent text-sm focus:outline-none ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    />
                  </div>

                  {/* Dropdown productos */}
                  {showProductDropdown && filteredProducts.length > 0 && (
                    <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto ${
                      isLight ? "bg-white border-gray-300" : "bg-[#1a2332] border-white/15"
                    }`}>
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleAddProduct(product)}
                          className={`w-full text-left px-3 py-2.5 hover:bg-primary/10 transition-colors border-b last:border-b-0 ${
                            isLight ? "border-gray-200" : "border-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                                {product.name}
                              </div>
                              <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                Código: {product.code} • Stock: {product.stock}
                              </div>
                            </div>
                            <div className={`font-mono font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                              ${product.price.toFixed(2)}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Lista de productos agregados */}
              {items.length > 0 && (
                <div className={`rounded-lg border ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <div className={`px-4 py-2 border-b font-semibold text-sm ${
                    isLight ? "bg-gray-50 border-gray-200 text-darkBg" : "bg-white/5 border-white/10 text-white"
                  }`}>
                    Productos Agregados ({items.length})
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-white/5">
                    {items.map((item) => (
                      <div key={item.id} className={`p-4 ${isLight ? "" : "hover:bg-white/5"} transition-colors`}>
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className={`font-medium text-sm mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                              {item.productName}
                              <span className={`text-xs ml-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                ({item.productCode})
                              </span>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                              <div>
                                <label className={`block text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                  Cantidad
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleUpdateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                                  className={`w-full px-2 py-1 rounded text-sm border ${
                                    isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                                  }`}
                                />
                              </div>
                              <div>
                                <label className={`block text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                  Precio Unit.
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.unitPrice}
                                  onChange={(e) => handleUpdateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                  className={`w-full px-2 py-1 rounded text-sm border ${
                                    isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                                  }`}
                                />
                              </div>
                              <div>
                                <label className={`block text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                  Descuento
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={item.discount}
                                  onChange={(e) => handleUpdateItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                                  className={`w-full px-2 py-1 rounded text-sm border ${
                                    isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                                  }`}
                                />
                              </div>
                              <div>
                                <label className={`block text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                  Subtotal
                                </label>
                                <div className={`px-2 py-1 rounded text-sm font-mono font-bold border ${
                                  isLight ? "bg-gray-50 border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                                }`}>
                                  ${item.subtotal.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notas */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Notas / Observaciones
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Observaciones adicionales..."
                  className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${
                    isLight
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-white/5 border-white/15 text-white"
                  }`}
                />
              </div>
            </div>
          )}

          {/* ═══ PASO 3: Confirmación ═══ */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className={`rounded-lg border p-4 ${
                isLight ? "bg-green-50 border-green-200" : "bg-green-900/20 border-green-500/30"
              }`}>
                <p className={`text-sm font-medium ${isLight ? "text-green-900" : "text-green-200"}`}>
                  Revisa los datos antes de crear la orden
                </p>
              </div>

              {/* Resumen Proveedor */}
              <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  PROVEEDOR
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Razón Social:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{selectedSupplier?.name}</span>
                  </div>
                  <div>
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>RUC:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{selectedSupplier?.ruc}</span>
                  </div>
                </div>
              </div>

              {/* Resumen Productos */}
              <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  PRODUCTOS ({items.length})
                </h4>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className={`p-2 rounded text-xs ${isLight ? "bg-white" : "bg-white/5"}`}>
                      <div className="flex justify-between">
                        <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {item.productName} ({item.productCode})
                        </span>
                        <span className={`font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className={`${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Cant: {item.quantity} × ${item.unitPrice.toFixed(2)} | Desc: ${item.discount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className={`rounded-lg border p-4 ${isLight ? "bg-orange-50 border-primary/30" : "bg-primary/10 border-primary/30"}`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  TOTALES
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>Subtotal:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>Descuento:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>IVA:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${totalTax.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between pt-2 border-t ${isLight ? "border-primary/20" : "border-white/20"}`}>
                    <span className={`font-bold ${isLight ? "text-darkBg" : "text-white"}`}>TOTAL:</span>
                    <span className="font-mono font-bold text-lg text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-5 py-3 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"
            }`}
          >
            {currentStep === 1 ? "Cancelar" : "Anterior"}
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!canGoNext()}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity ${
                  canGoNext() ? "bg-primary hover:opacity-90" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleCreate}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-primary hover:opacity-90 transition-opacity"
              >
                Crear Orden
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}