import { useState } from "react";
import { X, Plus, Trash2, Search, User, ShoppingCart, DollarSign } from "lucide-react";

interface InvoiceItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface Product {
  code: string;
  name: string;
  price: number;
  tax: number;
  stock: number;
  category: string;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: any) => void;
  isLight: boolean;
}

// Catálogo de productos
const PRODUCTS_CATALOG: Product[] = [
  { code: "PROD001", name: "Laptop HP 15-dy Intel Core i5", price: 850.00, tax: 12, stock: 15, category: "Computadoras" },
  { code: "PROD002", name: "Mouse Logitech MX Master 3", price: 45.00, tax: 12, stock: 50, category: "Accesorios" },
  { code: "PROD003", name: "Teclado Mecánico RGB Corsair K95", price: 120.00, tax: 12, stock: 25, category: "Accesorios" },
  { code: "PROD004", name: "Monitor Samsung 24\" Full HD", price: 280.00, tax: 12, stock: 30, category: "Monitores" },
  { code: "PROD005", name: "Impresora Epson L3210 Multifunción", price: 285.00, tax: 12, stock: 20, category: "Impresoras" },
  { code: "PROD006", name: "Disco Duro Externo Seagate 2TB", price: 95.00, tax: 12, stock: 40, category: "Almacenamiento" },
  { code: "PROD007", name: "Memoria RAM DDR4 16GB Kingston", price: 75.00, tax: 12, stock: 60, category: "Componentes" },
  { code: "PROD008", name: "SSD M.2 NVMe 500GB Samsung", price: 85.00, tax: 12, stock: 35, category: "Almacenamiento" },
  { code: "PROD009", name: "Webcam Logitech C920 Pro HD", price: 95.00, tax: 12, stock: 28, category: "Accesorios" },
  { code: "PROD010", name: "Router TP-Link AC1200 Dual Band", price: 65.00, tax: 12, stock: 45, category: "Redes" },
  { code: "PROD011", name: "Switch Gigabit 8 puertos", price: 85.00, tax: 12, stock: 22, category: "Redes" },
  { code: "PROD012", name: "UPS APC 1500VA Back-UPS Pro", price: 320.00, tax: 12, stock: 12, category: "Energía" },
  { code: "PROD013", name: "Proyector Epson EB-X06 3600 Lúmenes", price: 485.00, tax: 12, stock: 8, category: "Proyección" },
  { code: "PROD014", name: "Pantalla de Proyección 100\" Portátil", price: 125.00, tax: 12, stock: 15, category: "Proyección" },
  { code: "PROD015", name: "Audífonos Sony WH-1000XM4 Bluetooth", price: 320.00, tax: 12, stock: 18, category: "Audio" },
  { code: "SERV001", name: "Consultoría IT - Hora", price: 60.00, tax: 12, stock: 999, category: "Servicios" },
  { code: "SERV002", name: "Soporte Técnico - Mensual", price: 150.00, tax: 12, stock: 999, category: "Servicios" },
  { code: "SERV003", name: "Instalación y Configuración", price: 80.00, tax: 12, stock: 999, category: "Servicios" },
];

// Clientes
const CUSTOMERS = [
  { name: "Corporación Favorita C.A.", ruc: "1790016919001", address: "Av. General Enríquez km 4.5, Sangolquí", email: "facturacion@favorita.com", phone: "02-3456789" },
  { name: "Importadora del Pacífico Cía. Ltda.", ruc: "1712345678001", address: "Av. de las Américas y José Mascote, Guayaquil", email: "info@importadorapacifico.com", phone: "04-2567890" },
  { name: "Distribuidora El Sol S.A.", ruc: "1891234567001", address: "Calle Bolívar 234 y Rocafuerte, Cuenca", email: "ventas@elsol.com.ec", phone: "07-2890123" },
  { name: "Comercial Andina Ltda.", ruc: "0992345678001", address: "Av. 6 de Diciembre N34-45, Quito", email: "compras@andina.ec", phone: "02-2445566" },
  { name: "Supermercados La Rebaja S.A.", ruc: "1790345678001", address: "Av. Maldonado S15-78, Quito", email: "facturacion@larebaja.com", phone: "02-2667788" },
  { name: "Ferretería Industrial S.A.", ruc: "1791456789001", address: "Av. Mariscal Sucre Km 7.5, Quito", email: "ventas@ferreteriaind.com", phone: "02-2334455" },
  { name: "Tecnología Avanzada Cía. Ltda.", ruc: "1792567890001", address: "Av. González Suárez N27-142, Quito", email: "compras@tecnoavanzada.ec", phone: "02-2998877" },
  { name: "Almacenes Japón S.A.", ruc: "1790567890001", address: "Av. Amazonas y Naciones Unidas, Quito", email: "facturas@almjapon.com", phone: "02-2556677" },
  { name: "Megamaxi S.A.", ruc: "1790987654001", address: "Av. 6 de Diciembre y Eloy Alfaro, Quito", email: "proveedores@megamaxi.com", phone: "02-2443322" },
  { name: "TecnoComputer S.A.", ruc: "1790123456001", address: "Av. América N35-87, Quito", email: "info@tecnocomputer.com", phone: "02-2456789" },
];

export function CreateInvoiceModal({ isOpen, onClose, onSave, isLight }: CreateInvoiceModalProps) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showCustomerList, setShowCustomerList] = useState(false);
  
  const [productSearch, setProductSearch] = useState("");
  const [showProductList, setShowProductList] = useState(false);
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
    // Verificar si el producto ya está en la lista
    const existingIndex = items.findIndex(item => item.code === product.code);
    
    if (existingIndex >= 0) {
      // Si ya existe, incrementar cantidad
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      newItems[existingIndex].total = newItems[existingIndex].quantity * newItems[existingIndex].price - newItems[existingIndex].discount;
      setItems(newItems);
    } else {
      // Si no existe, agregar nuevo
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
    setShowProductList(false);
  };

  // Actualizar cantidad
  const updateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newItems = [...items];
    newItems[index].quantity = quantity;
    newItems[index].total = quantity * newItems[index].price - newItems[index].discount;
    setItems(newItems);
  };

  // Actualizar descuento
  const updateDiscount = (index: number, discount: number) => {
    if (discount < 0) return;
    const newItems = [...items];
    newItems[index].discount = discount;
    newItems[index].total = newItems[index].quantity * newItems[index].price - discount;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Cálculos
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const subtotal12 = items.reduce((sum, item) => item.tax === 12 ? sum + item.total : sum, 0);
  const subtotal0 = items.reduce((sum, item) => item.tax === 0 ? sum + item.total : sum, 0);
  const tax = subtotal12 * 0.12;
  const total = subtotal12 + subtotal0 + tax;

  const handleSave = () => {
    if (!selectedCustomer) {
      alert("Seleccione un cliente");
      return;
    }
    if (items.length === 0) {
      alert("Agregue al menos un producto");
      return;
    }

    const now = new Date();
    const invoice = {
      id: Date.now().toString(),
      invoiceNumber: `001-001-${String(Math.floor(Math.random() * 900000) + 100000).padStart(9, "0")}`,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().split(" ")[0].substring(0, 5),
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
      emisor_razon: "TICSOFTEC S.A.",
      emisor_dir: "Av. Principal 123",
      emisor_ruc: "1790012345001",
      emisor_telefono: "02-2345678",
      emisor_email: "info@ticsoftec.com",
      ambiente: "Pruebas",
      periodo_fiscal: `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`,
    };

    onSave(invoice);
    
    // Reset form
    setSelectedCustomer(null);
    setCustomerSearch("");
    setItems([]);
    setProductSearch("");
    setPaymentMethod("cash");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-6xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-gray-200 bg-gradient-to-r from-primary/5 to-primary/10" : "border-white/10 bg-gradient-to-r from-primary/10 to-primary/5"}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Punto de Venta - Nueva Factura
              </h2>
              <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Busque cliente y productos para generar la factura
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}
          >
            <X className={`w-5 h-5 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex gap-4 p-6">
          {/* Panel Izquierdo: Productos y Cliente */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            
            {/* Búsqueda de Cliente */}
            <div>
              <label className={`block text-xs font-bold mb-2 uppercase tracking-wide flex items-center gap-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                <User className="w-4 h-4" />
                Cliente
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o RUC..."
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerList(true);
                  }}
                  onFocus={() => setShowCustomerList(true)}
                  className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg text-sm transition-all ${
                    selectedCustomer 
                      ? "border-green-500 bg-green-50" 
                      : isLight ? "bg-white border-gray-300 text-gray-900 focus:border-primary" : "bg-[#1a2332] border-white/10 text-white focus:border-primary"
                  }`}
                />
                {showCustomerList && customerSearch && filteredCustomers.length > 0 && !selectedCustomer && (
                  <div className={`absolute z-20 w-full mt-1 border-2 rounded-lg shadow-xl max-h-64 overflow-y-auto ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                    {filteredCustomers.map((customer, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerSearch(customer.name);
                          setShowCustomerList(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors border-b ${
                          isLight 
                            ? "hover:bg-primary/5 border-gray-100" 
                            : "hover:bg-white/5 border-white/5"
                        }`}
                      >
                        <div className={`font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{customer.name}</div>
                        <div className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          RUC: {customer.ruc} • {customer.address}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedCustomer && (
                <div className={`mt-2 p-3 rounded-lg border-2 border-green-500 text-xs ${isLight ? "bg-green-50" : "bg-green-500/10"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className={`font-bold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>{selectedCustomer.name}</div>
                      <div className={isLight ? "text-gray-700" : "text-gray-300"}>RUC: {selectedCustomer.ruc}</div>
                      <div className={isLight ? "text-gray-600" : "text-gray-400"}>{selectedCustomer.address}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCustomer(null);
                        setCustomerSearch("");
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Búsqueda de Productos */}
            <div className="flex-1 flex flex-col min-h-0">
              <label className={`block text-xs font-bold mb-2 uppercase tracking-wide flex items-center gap-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                <ShoppingCart className="w-4 h-4" />
                Buscar Productos
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por código, nombre o categoría..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductList(true);
                  }}
                  onFocus={() => setShowProductList(true)}
                  className={`w-full pl-10 pr-3 py-2.5 border-2 rounded-lg text-sm transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 focus:border-primary" : "bg-[#1a2332] border-white/10 text-white focus:border-primary"}`}
                />
              </div>

              {/* Catálogo de Productos */}
              {showProductList && productSearch && (
                <div className={`flex-1 border-2 rounded-lg overflow-hidden flex flex-col ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#1a2332]"}`}>
                  <div className={`px-3 py-2 border-b text-xs font-bold uppercase ${isLight ? "bg-gray-200 text-gray-700 border-gray-300" : "bg-[#0d1724] text-gray-400 border-white/10"}`}>
                    {filteredProducts.length} productos encontrados
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.code}
                        onClick={() => addProduct(product)}
                        className={`w-full text-left px-3 py-2.5 border-b transition-colors ${
                          isLight 
                            ? "hover:bg-primary/5 border-gray-200" 
                            : "hover:bg-white/5 border-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${isLight ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary"}`}>
                                {product.code}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded ${isLight ? "bg-gray-200 text-gray-700" : "bg-white/10 text-gray-400"}`}>
                                {product.category}
                              </span>
                            </div>
                            <div className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                              {product.name}
                            </div>
                            <div className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                              Stock: {product.stock} unidades
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold text-base ${isLight ? "text-primary" : "text-primary"}`}>
                              ${product.price.toFixed(2)}
                            </div>
                            <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                              +IVA {product.tax}%
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensaje inicial */}
              {!productSearch && (
                <div className={`flex-1 border-2 border-dashed rounded-lg flex items-center justify-center ${isLight ? "border-gray-300 bg-gray-50" : "border-white/10 bg-[#1a2332]/50"}`}>
                  <div className="text-center">
                    <Search className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Busque productos para agregar a la factura
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel Derecho: Carrito y Totales */}
          <div className={`w-[420px] flex flex-col border-2 rounded-xl ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#1a2332]"}`}>
            {/* Header del carrito */}
            <div className={`px-4 py-3 border-b ${isLight ? "bg-gray-200 border-gray-300" : "bg-[#0d1724] border-white/10"}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold uppercase ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Carrito de Compras
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isLight ? "bg-primary text-white" : "bg-primary text-white"}`}>
                  {items.length} items
                </span>
              </div>
            </div>

            {/* Lista de items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-[#0d1724] border-white/10"}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className={`font-mono text-xs font-bold mb-1 ${isLight ? "text-primary" : "text-primary"}`}>
                          {item.code}
                        </div>
                        <div className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {item.name}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className={`block mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Cant.</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(idx, parseInt(e.target.value) || 1)}
                          className={`w-full px-2 py-1 border rounded text-center font-bold ${isLight ? "bg-white border-gray-300" : "bg-[#1a2332] border-white/10 text-white"}`}
                        />
                      </div>
                      <div>
                        <label className={`block mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>P. Unit</label>
                        <div className={`px-2 py-1 border rounded text-center font-mono ${isLight ? "bg-gray-100 border-gray-300 text-gray-700" : "bg-white/5 border-white/10 text-gray-300"}`}>
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <label className={`block mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Desc.</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.discount}
                          onChange={(e) => updateDiscount(idx, parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 py-1 border rounded text-center ${isLight ? "bg-white border-gray-300" : "bg-[#1a2332] border-white/10 text-white"}`}
                        />
                      </div>
                    </div>
                    
                    <div className={`mt-2 pt-2 border-t flex justify-between items-center ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Subtotal:</span>
                      <span className={`font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                        ${item.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <ShoppingCart className={`w-16 h-16 mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                  <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Carrito vacío
                  </p>
                </div>
              )}
            </div>

            {/* Método de Pago */}
            <div className={`px-4 py-3 border-t ${isLight ? "border-gray-300" : "border-white/10"}`}>
              <label className={`block text-xs font-bold mb-2 uppercase ${isLight ? "text-gray-700" : "text-gray-400"}`}>
                Método de Pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm font-medium ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}
              >
                <option value="cash">💵 Efectivo</option>
                <option value="card">💳 Tarjeta</option>
                <option value="transfer">🏦 Transferencia</option>
                <option value="credit">📋 Crédito</option>
              </select>
            </div>

            {/* Totales */}
            <div className={`px-4 py-4 border-t space-y-2 ${isLight ? "bg-white border-gray-300" : "bg-[#0d1724] border-white/10"}`}>
              <div className="flex justify-between text-sm">
                <span className={isLight ? "text-gray-600" : "text-gray-400"}>Subtotal:</span>
                <span className={`font-mono font-medium ${isLight ? "text-gray-900" : "text-white"}`}>${subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className={isLight ? "text-gray-600" : "text-gray-400"}>Descuento:</span>
                  <span className={`font-mono font-medium text-red-600`}>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className={isLight ? "text-gray-600" : "text-gray-400"}>Subtotal 12%:</span>
                <span className={`font-mono font-medium ${isLight ? "text-gray-900" : "text-white"}`}>${subtotal12.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isLight ? "text-gray-600" : "text-gray-400"}>IVA 12%:</span>
                <span className={`font-mono font-medium ${isLight ? "text-gray-900" : "text-white"}`}>${tax.toFixed(2)}</span>
              </div>
              <div className={`pt-3 border-t flex justify-between items-center ${isLight ? "border-gray-300" : "border-white/10"}`}>
                <span className={`font-bold text-base ${isLight ? "text-gray-900" : "text-white"}`}>TOTAL:</span>
                <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className={`p-4 border-t space-y-2 ${isLight ? "border-gray-300" : "border-white/10"}`}>
              <button
                onClick={handleSave}
                disabled={!selectedCustomer || items.length === 0}
                className={`w-full py-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                  !selectedCustomer || items.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
                }`}
              >
                <DollarSign className="w-5 h-5" />
                Generar Factura
              </button>
              <button
                onClick={onClose}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-gray-200 hover:bg-gray-300 text-gray-700" : "bg-white/5 hover:bg-white/10 text-gray-300"}`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}