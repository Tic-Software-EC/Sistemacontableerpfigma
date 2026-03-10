import { useState } from "react";
import { X, Plus, Trash2, Search, User, ShoppingCart, DollarSign, Package, Grid3x3, Minus, CreditCard, Clock, Pause } from "lucide-react";
import { 
  PRODUCTS_CATALOG, 
  CUSTOMERS, 
  COMPANY_INFO, 
  PAYMENT_METHODS,
  generateDocumentNumber,
  getCurrentDate,
  getCurrentTime,
  getCurrentPeriod,
  type Product,
  type Customer
} from "../data/test-data";

interface InvoiceItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: any) => void;
  isLight: boolean;
}

export function CreateInvoiceModal({ isOpen, onClose, onSave, isLight }: CreateInvoiceModalProps) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerList, setShowCustomerList] = useState(false);
  
  const [productSearch, setProductSearch] = useState("");
  const [showCatalog, setShowCatalog] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Filtrar clientes
  const filteredCustomers = CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.ruc.includes(customerSearch)
  );

  // Filtrar productos
  const filteredProducts = PRODUCTS_CATALOG.filter(p => 
    p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Agregar producto desde el catálogo
  const addProduct = (product: Product) => {
    const existingIndex = items.findIndex(item => item.code === product.code);
    
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      newItems[existingIndex].total = newItems[existingIndex].quantity * newItems[existingIndex].price - newItems[existingIndex].discount;
      setItems(newItems);
    } else {
      const newItem: InvoiceItem = {
        code: product.code,
        name: product.name,
        quantity: 1,
        price: product.price,
        discount: 0,
        tax: product.tax,
        total: product.price
      };
      setItems([...items, newItem]);
    }
    
    setProductSearch("");
    setShowCatalog(false);
  };

  // Actualizar cantidad
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newItems = [...items];
    newItems[index].quantity = quantity;
    newItems[index].total = quantity * newItems[index].price - newItems[index].discount;
    setItems(newItems);
  };

  // Incrementar/Decrementar cantidad
  const incrementQuantity = (index: number) => {
    updateQuantity(index, items[index].quantity + 1);
  };

  const decrementQuantity = (index: number) => {
    if (items[index].quantity > 1) {
      updateQuantity(index, items[index].quantity - 1);
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Cálculos
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const tax = subtotal * 0.15; // IVA 15% como en la imagen
  const total = subtotal + tax;

  const handleSave = () => {
    if (!selectedCustomer) {
      alert("Seleccione un cliente");
      return;
    }
    if (items.length === 0) {
      alert("Agregue al menos un producto");
      return;
    }

    const subtotal12 = items.reduce((sum, item) => item.tax === 12 ? sum + item.total : sum, 0);
    const subtotal0 = items.reduce((sum, item) => item.tax === 0 ? sum + item.total : sum, 0);

    const invoice = {
      id: Date.now().toString(),
      invoiceNumber: generateDocumentNumber("01"),
      date: getCurrentDate(),
      time: getCurrentTime(),
      customer: selectedCustomer,
      items,
      subtotal,
      totalDiscount,
      subtotal12,
      subtotal0,
      tax,
      total,
      paymentMethod,
      status: "pending",
      seller: "Usuario Actual",
      branch: "Sucursal Centro",
      sriStatus: "pending",
      emisor_razon: COMPANY_INFO.razon_social,
      emisor_dir: COMPANY_INFO.address,
      emisor_ruc: COMPANY_INFO.ruc,
      emisor_telefono: COMPANY_INFO.phone,
      emisor_email: COMPANY_INFO.email,
      ambiente: "Pruebas",
      periodo_fiscal: getCurrentPeriod(),
    };

    onSave(invoice);
    
    // Reset form
    setSelectedCustomer(null);
    setCustomerSearch("");
    setItems([]);
    setProductSearch("");
    setPaymentMethod("cash");
    setShowCatalog(false);
    onClose();
  };

  // Manejar tecla F3
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "F3") {
      e.preventDefault();
      setShowCatalog(!showCatalog);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Principal */}
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className={`w-full max-w-5xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
          
          {/* Header con búsqueda de cliente */}
          <div className={`px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="text"
                  placeholder={selectedCustomer ? selectedCustomer.name : "Buscar cliente por nombre o RUC..."}
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerList(true);
                    if (selectedCustomer && e.target.value !== selectedCustomer.name) {
                      setSelectedCustomer(null);
                    }
                  }}
                  onFocus={() => !selectedCustomer && setShowCustomerList(true)}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                    selectedCustomer
                      ? isLight 
                        ? "bg-green-50 border-green-500 text-gray-900" 
                        : "bg-green-500/10 border-green-500 text-white"
                      : isLight 
                        ? "bg-gray-50 border-gray-300 text-gray-900 focus:border-primary" 
                        : "bg-[#1a2332] border-white/10 text-white focus:border-primary"
                  }`}
                />
                {showCustomerList && customerSearch && filteredCustomers.length > 0 && !selectedCustomer && (
                  <div className={`absolute z-20 w-full mt-2 border rounded-lg shadow-2xl max-h-72 overflow-y-auto ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                    {filteredCustomers.map((customer, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerSearch(customer.name);
                          setShowCustomerList(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors border-b last:border-b-0 ${
                          isLight 
                            ? "hover:bg-primary/5 border-gray-100" 
                            : "hover:bg-white/5 border-white/5"
                        }`}
                      >
                        <div className={`font-semibold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>{customer.name}</div>
                        <div className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          RUC/CI: {customer.ruc} • {customer.email}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedCustomer && (
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCustomerSearch("");
                  }}
                  className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-red-50 text-red-600" : "hover:bg-red-500/10 text-red-500"}`}
                  title="Quitar cliente"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Información del Cliente Seleccionado */}
            {selectedCustomer && (
              <div className={`mt-3 p-3 rounded-lg border-2 ${isLight ? "bg-green-50 border-green-500" : "bg-green-500/10 border-green-500"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-green-600" />
                      <div className={`font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                        {selectedCustomer.name}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={isLight ? "text-gray-700" : "text-gray-300"}>
                        <span className="font-medium">RUC/CI:</span> {selectedCustomer.ruc}
                      </div>
                      <div className={isLight ? "text-gray-700" : "text-gray-300"}>
                        <span className="font-medium">Teléfono:</span> {selectedCustomer.phone}
                      </div>
                      <div className={`col-span-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        <span className="font-medium">Dirección:</span> {selectedCustomer.address}
                      </div>
                      <div className={`col-span-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        <span className="font-medium">Email:</span> {selectedCustomer.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerSearch("");
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-100 rounded p-1 transition-colors"
                    title="Cambiar cliente"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Carrito Header */}
          <div className={`px-6 py-3 border-b flex items-center justify-between ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0a0f1a]"}`}>
            <div className="flex items-center gap-2">
              <ShoppingCart className={`w-3.5 h-3.5 ${isLight ? "text-primary" : "text-primary"}`} />
              <span className={`font-bold text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                Carrito
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isLight ? "bg-gray-200 text-gray-700" : "bg-white/10 text-gray-300"}`}>
                {items.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCatalog(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-[#1a2332] border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                <Grid3x3 className="w-3 h-3" />
                Catálogo
                <kbd className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
                  F3
                </kbd>
              </button>
              
              <button
                onClick={clearCart}
                disabled={items.length === 0}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  items.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                } ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-[#1a2332] border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                <Trash2 className="w-3 h-3" />
                Limpiar
              </button>
            </div>
          </div>

          {/* Tabla de Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length > 0 ? (
              <table className="w-full">
                <thead className={`sticky top-0 ${isLight ? "bg-gray-100 border-b border-gray-200" : "bg-[#0a0f1a] border-b border-white/10"}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Código
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Producto
                    </th>
                    <th className={`px-6 py-3 text-center text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Cantidad
                    </th>
                    <th className={`px-6 py-3 text-right text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      P. Unit.
                    </th>
                    <th className={`px-6 py-3 text-right text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Total
                    </th>
                    <th className="px-6 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/10"}`}>
                  {items.map((item, idx) => (
                    <tr key={idx} className={`${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"} transition-colors`}>
                      <td className={`px-6 py-4 text-sm font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {item.code}
                      </td>
                      <td className={`px-6 py-4 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                        {item.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => decrementQuantity(idx)}
                            className={`w-7 h-7 flex items-center justify-center rounded border transition-colors ${isLight ? "bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700" : "bg-[#1a2332] border-white/10 hover:bg-white/10 text-gray-300"}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className={`w-10 text-center font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(idx)}
                            className={`w-7 h-7 flex items-center justify-center rounded border transition-colors ${isLight ? "bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700" : "bg-[#1a2332] border-white/10 hover:bg-white/10 text-gray-300"}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                        ${item.price.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-sm text-right font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => removeItem(idx)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 ${isLight ? "bg-gray-100" : "bg-white/5"}`}>
                  <ShoppingCart className={`w-10 h-10 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                </div>
                <h3 className={`text-base font-bold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  El carrito está vacío
                </h3>
                <p className={`text-sm text-center mb-4 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Presiona <kbd className={`px-2 py-1 rounded text-xs font-mono ${isLight ? "bg-gray-200" : "bg-white/10"}`}>F3</kbd> para abrir el catálogo
                </p>
                <button
                  onClick={() => setShowCatalog(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/30"
                >
                  <Package className="w-4 h-4" />
                  Abrir Catálogo de Productos
                </button>
              </div>
            )}
          </div>

          {/* Footer con Totales */}
          <div className={`px-6 py-4 border-t ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0a0f1a]"}`}>
            {/* Subtotales */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Subtotal:</span>
                <span className={`text-base font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>IVA (15%):</span>
                <span className={`text-base font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                  ${tax.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Total a Pagar */}
            <div className={`flex justify-between items-center mb-4 pb-4 border-b ${isLight ? "border-gray-300" : "border-white/10"}`}>
              <span className={`text-base font-bold uppercase ${isLight ? "text-gray-900" : "text-white"}`}>
                Total a Pagar:
              </span>
              <span className="text-3xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Botones */}
            <div className="space-y-2">
              <button
                onClick={handleSave}
                disabled={!selectedCustomer || items.length === 0}
                className={`w-full py-3.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                  !selectedCustomer || items.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Procesar Pago
              </button>
              
              <button
                onClick={onClose}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors border ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-[#1a2332] border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal del Catálogo */}
      {showCatalog && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"
          onClick={() => setShowCatalog(false)}
        >
          <div 
            className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col ${isLight ? "bg-white" : "bg-[#0d1724]"}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Catálogo */}
            <div className={`px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isLight ? "bg-primary/10" : "bg-primary/20"}`}>
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Catálogo de Productos
                  </h3>
                  <kbd className={`px-2 py-1 rounded text-[10px] font-mono ${isLight ? "bg-gray-200 text-gray-600" : "bg-white/10 text-gray-400"}`}>
                    F3
                  </kbd>
                </div>
                <button
                  onClick={() => setShowCatalog(false)}
                  className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}
                >
                  <X className={`w-4 h-4 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    autoFocus
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-all ${isLight ? "bg-gray-50 border-gray-300 text-gray-900 focus:border-primary" : "bg-[#1a2332] border-white/10 text-white focus:border-primary"}`}
                  />
                </div>
                <select
                  className={`px-4 py-2 border rounded-lg text-sm transition-all ${isLight ? "bg-gray-50 border-gray-300 text-gray-900" : "bg-[#1a2332] border-white/10 text-white"}`}
                >
                  <option>Todas</option>
                  <option>Computadoras</option>
                  <option>Monitores</option>
                  <option>Accesorios</option>
                  <option>Servicios</option>
                </select>
              </div>
              
              <div className={`mt-3 text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                {filteredProducts.length} productos encontrados
              </div>
            </div>

            {/* Tabla de Productos */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full">
                <thead className={`sticky top-0 ${isLight ? "bg-gray-50 border-b border-gray-200" : "bg-[#0a0f1a] border-b border-white/10"}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Código
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Producto
                    </th>
                    <th className={`px-4 py-3 text-right text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Precio
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Stock
                    </th>
                    <th className="px-4 py-3 w-16"></th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/5"}`}>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr 
                        key={product.code} 
                        className={`group cursor-pointer transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                        onClick={() => addProduct(product)}
                      >
                        <td className={`px-4 py-3.5 text-sm font-mono ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          {product.code}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            {product.name}
                          </div>
                          <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            {product.category}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="font-bold text-primary text-base">
                            ${product.price.toFixed(2)}
                          </div>
                          <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            IVA {product.tax}%
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className={`flex justify-center`}>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              product.stock > 50 
                                ? "bg-green-100 text-green-700" 
                                : product.stock > 20
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {product.stock}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addProduct(product);
                            }}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isLight ? "bg-primary/10 text-primary hover:bg-primary hover:text-white" : "bg-primary/20 text-primary hover:bg-primary hover:text-white"}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${isLight ? "text-gray-400 hover:bg-gray-100" : "text-gray-500 hover:bg-white/5"}`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-12">
                        <div className="flex flex-col items-center justify-center">
                          <Package className={`w-12 h-12 mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                          <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            No se encontraron productos
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t flex items-center justify-between ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0a0f1a]"}`}>
              <div className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Clic en una fila o en <span className="text-primary font-semibold">+</span> para agregar al carrito
              </div>
              <button
                onClick={() => setShowCatalog(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-[#1a2332] border-white/10 text-gray-300 hover:bg-white/5"}`}
              >
                Cerrar
                <kbd className={`px-1.5 py-0.5 rounded text-xs font-mono ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
                  Esc
                </kbd>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}