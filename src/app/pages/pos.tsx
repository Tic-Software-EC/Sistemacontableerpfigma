import { useState } from "react";
import { ShoppingCart, Search, CreditCard, DollarSign, Trash2, Plus, Minus, X, Receipt, User, Package, Calendar, Clock, Banknote, Smartphone, Building2, CheckCircle, Printer, AlertTriangle, UserPlus, Phone, Mail, MapPin, TrendingUp, TrendingDown, FileText } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Product {
  code: string;
  name: string;
  price: number;
  tax: number;
  stock: number;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
  subtotal: number;
}

interface Sale {
  id: string;
  saleNumber: string;
  date: string;
  time: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentType: "cash" | "credit";
  amountPaid: number;
  change: number;
  customerName?: string;
  customerRuc?: string;
  status: "completed" | "cancelled";
  creditInfo?: CreditInfo;
}

interface CreditInfo {
  months: number;
  interestRate: number;
  monthlyPayment: number;
  totalWithInterest: number;
  amortizationTable: AmortizationRow[];
}

interface AmortizationRow {
  paymentNumber: number;
  date: string;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
  status: "pending" | "paid";
}

interface Customer {
  ruc: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  pendingBalance: number;
  lastPurchaseDate?: string;
}

// Mock data de clientes
const MOCK_CUSTOMERS: Customer[] = [
  {
    ruc: "1234567890",
    name: "María González López",
    email: "maria.gonzalez@email.com",
    phone: "+593 99 123 4567",
    address: "Av. 6 de Diciembre N34-145, Quito",
    totalPurchases: 15,
    pendingBalance: 250.00,
    lastPurchaseDate: "2026-02-15"
  },
  {
    ruc: "0987654321",
    name: "Carlos Ramírez Sánchez",
    email: "carlos.ramirez@empresa.com",
    phone: "+593 98 765 4321",
    address: "Calle Las Palmeras 456, Guayaquil",
    totalPurchases: 8,
    pendingBalance: 0,
    lastPurchaseDate: "2026-02-10"
  },
  {
    ruc: "1726384950001",
    name: "Distribuidora El Éxito CIA. LTDA.",
    email: "ventas@elexito.com",
    phone: "+593 2 245 6789",
    address: "Parque Industrial Norte, Bodega 12",
    totalPurchases: 45,
    pendingBalance: 1250.50,
    lastPurchaseDate: "2026-02-17"
  },
  {
    ruc: "5555555555",
    name: "Ana Patricia Morales",
    email: "ana.morales@gmail.com",
    phone: "+593 99 888 7777",
    address: "Urbanización Los Pinos, Casa 23",
    totalPurchases: 3,
    pendingBalance: 0,
    lastPurchaseDate: "2026-01-20"
  },
];

const PRODUCTS: Product[] = [
  { code: "PROD-001", name: "Laptop Dell Latitude 5420", price: 850.00, tax: 12, stock: 15, category: "Tecnología" },
  { code: "PROD-002", name: "Monitor LG 27 pulgadas", price: 320.00, tax: 12, stock: 25, category: "Tecnología" },
  { code: "PROD-003", name: "Teclado mecánico Logitech", price: 89.99, tax: 12, stock: 40, category: "Tecnología" },
  { code: "PROD-004", name: "Mouse inalámbrico", price: 25.50, tax: 12, stock: 60, category: "Tecnología" },
  { code: "PROD-005", name: "Resma papel bond A4", price: 4.50, tax: 0, stock: 200, category: "Papelería" },
  { code: "PROD-006", name: "Marcadores permanentes x12", price: 8.75, tax: 12, stock: 80, category: "Papelería" },
  { code: "PROD-007", name: "Archivador de palanca", price: 2.30, tax: 12, stock: 150, category: "Papelería" },
  { code: "PROD-008", name: "Silla ergonómica oficina", price: 185.00, tax: 12, stock: 12, category: "Muebles" },
  { code: "PROD-009", name: "Escritorio ejecutivo", price: 450.00, tax: 12, stock: 8, category: "Muebles" },
  { code: "PROD-010", name: "Lámpara LED escritorio", price: 35.00, tax: 12, stock: 30, category: "Muebles" },
  { code: "PROD-011", name: "Impresora multifunción", price: 280.00, tax: 12, stock: 10, category: "Tecnología" },
  { code: "PROD-012", name: "Caja de bolígrafos x50", price: 12.50, tax: 12, stock: 100, category: "Papelería" },
];

const PAYMENT_METHODS = [
  { id: "cash", name: "Efectivo", icon: Banknote },
  { id: "card", name: "Tarjeta", icon: CreditCard },
  { id: "transfer", name: "Transferencia", icon: Building2 },
  { id: "mobile", name: "Pago Móvil", icon: Smartphone },
];

export function POS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentType, setPaymentType] = useState<"cash" | "credit">("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerRuc, setCustomerRuc] = useState("");
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showAmortizationModal, setShowAmortizationModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    email: "",
    phone: "",
    address: "",
  });
  // Estados para crédito
  const [creditMonths, setCreditMonths] = useState(3);
  const [interestRate, setInterestRate] = useState(12);
  
  // Estados para búsqueda de cliente
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  
  // Estados para filtros y categorías
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Calcular tabla de amortización
  const generateAmortizationTable = (): CreditInfo => {
    const principal = totals.total;
    const monthlyRate = interestRate / 100 / 12;
    const n = creditMonths;
    
    // Fórmula de cuota fija: PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = monthlyRate === 0 
      ? principal / n 
      : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    
    let balance = principal;
    const table: AmortizationRow[] = [];
    const today = new Date();
    
    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      
      const paymentDate = new Date(today);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      
      table.push({
        paymentNumber: i,
        date: paymentDate.toISOString().split('T')[0],
        payment: monthlyPayment,
        interest: interestPayment,
        principal: principalPayment,
        balance: Math.max(0, balance),
        status: "pending"
      });
    }
    
    return {
      months: n,
      interestRate,
      monthlyPayment,
      totalWithInterest: monthlyPayment * n,
      amortizationTable: table
    };
  };

  // Obtener categorías únicas
  const categories = ["all", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  // Buscar clientes por apellido o cédula
  const handleCustomerSearch = (value: string) => {
    setCustomerSearchTerm(value);
    
    if (value.trim().length === 0) {
      setFilteredCustomers([]);
      setShowCustomerResults(false);
      return;
    }

    // Buscar por nombre (apellido) o RUC/Cédula
    const results = MOCK_CUSTOMERS.filter(customer => 
      customer.name.toLowerCase().includes(value.toLowerCase()) ||
      customer.ruc.includes(value)
    );

    setFilteredCustomers(results);
    setShowCustomerResults(true);
  };

  // Seleccionar cliente del dropdown
  const selectCustomer = (customer: Customer) => {
    setFoundCustomer(customer);
    setCustomerName(customer.name);
    setCustomerRuc(customer.ruc);
    setCustomerSearchTerm(`${customer.name} - ${customer.ruc}`);
    setShowCustomerResults(false);
    setShowCustomerModal(true);
  };

  // Abrir modal para crear nuevo cliente
  const openCreateCustomerModal = () => {
    setShowCustomerResults(false);
    setCustomerName(customerSearchTerm);
    setCustomerRuc("");
    setShowCreateCustomerModal(true);
  };

  const createNewCustomer = () => {
    // Validar que tenga nombre y RUC
    if (!customerName.trim() || !customerRuc.trim()) {
      toast.error("Datos incompletos", {
        description: "El nombre y RUC/Cédula son obligatorios"
      });
      return;
    }

    // Aquí se guardaría el nuevo cliente en la base de datos
    const newCustomer: Customer = {
      ruc: customerRuc,
      name: customerName,
      email: newCustomerData.email || undefined,
      phone: newCustomerData.phone || undefined,
      address: newCustomerData.address || undefined,
      totalPurchases: 0,
      pendingBalance: 0,
    };

    // Agregar al array mock (en producción se guardaría en BD)
    MOCK_CUSTOMERS.push(newCustomer);
    setFoundCustomer(newCustomer);
    setCustomerSearchTerm(`${newCustomer.name} - ${newCustomer.ruc}`);
    setShowCreateCustomerModal(false);
    setNewCustomerData({ email: "", phone: "", address: "" });
    
    toast.success("Cliente creado exitosamente", {
      description: `${newCustomer.name} ha sido registrado`
    });
  };

  // Filtrar productos por búsqueda y categoría
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calcular totales del carrito
  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;
    let tax = 0;

    cart.forEach((item) => {
      const itemSubtotal = item.product.price * item.quantity;
      const itemDiscount = (itemSubtotal * item.discount) / 100;
      const taxableAmount = itemSubtotal - itemDiscount;
      const itemTax = (taxableAmount * item.product.tax) / 100;

      subtotal += itemSubtotal;
      discount += itemDiscount;
      tax += itemTax;
    });

    const total = subtotal - discount + tax;

    return { subtotal, discount, tax, total };
  };

  const totals = calculateTotals();

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.code === product.code);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error("No hay suficiente stock disponible", {
          description: `Solo quedan ${product.stock} unidades de ${product.name}`
        });
        return;
      }
      updateQuantity(product.code, existingItem.quantity + 1);
      toast.success("Cantidad actualizada", {
        description: `${product.name} - Cantidad: ${existingItem.quantity + 1}`
      });
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        discount: 0,
        subtotal: product.price,
      };
      setCart([...cart, newItem]);
      toast.success("Producto agregado", {
        description: `${product.name} - $${product.price.toFixed(2)}`
      });
    }
  };

  // Actualizar cantidad
  const updateQuantity = (productCode: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productCode);
      return;
    }

    const item = cart.find((item) => item.product.code === productCode);
    if (item && newQuantity > item.product.stock) {
      alert("No hay suficiente stock disponible");
      return;
    }

    setCart(
      cart.map((item) =>
        item.product.code === productCode
          ? { ...item, quantity: newQuantity, subtotal: item.product.price * newQuantity }
          : item
      )
    );
  };

  // Actualizar descuento
  const updateDiscount = (productCode: string, discount: number) => {
    setCart(
      cart.map((item) =>
        item.product.code === productCode ? { ...item, discount: Math.min(100, Math.max(0, discount)) } : item
      )
    );
  };

  // Eliminar del carrito
  const removeFromCart = (productCode: string) => {
    setCart(cart.filter((item) => item.product.code !== productCode));
  };

  // Limpiar carrito
  const clearCart = () => {
    if (cart.length === 0) return;
    if (confirm("¿Estás seguro de limpiar todo el carrito?")) {
      setCart([]);
      setCustomerName("");
      setCustomerRuc("");
      setCustomerSearchTerm("");
      setFoundCustomer(null);
    }
  };

  // Procesar pago
  const processSale = () => {
    if (cart.length === 0) {
      toast.error("Carrito vacío", {
        description: "Agrega productos antes de procesar el pago"
      });
      return;
    }

    const paidAmount = parseFloat(amountPaid) || 0;
    if (paymentMethod === "cash" && paymentType === "cash" && paidAmount < totals.total) {
      toast.error("Monto insuficiente", {
        description: `Falta: $${(totals.total - paidAmount).toFixed(2)}`
      });
      return;
    }

    const sale: Sale = {
      id: `sale-${Date.now()}`,
      saleNumber: `VTA-${String(Math.floor(Math.random() * 10000)).padStart(6, "0")}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      items: cart,
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      paymentMethod,
      paymentType,
      amountPaid: paidAmount,
      change: paymentMethod === "cash" ? paidAmount - totals.total : 0,
      customerName: customerName || undefined,
      customerRuc: customerRuc || undefined,
      status: "completed",
    };

    if (paymentType === "credit") {
      const creditInfo = generateAmortizationTable();
      sale.creditInfo = creditInfo;
      setShowAmortizationModal(true);
    }

    setLastSale(sale);
    setCart([]);
    setShowPaymentModal(false);
    setShowReceiptModal(true);
    setAmountPaid("");
    setCustomerName("");
    setCustomerRuc("");
    setCustomerSearchTerm("");
    setFoundCustomer(null);
    
    // Notificación de éxito
    if (paymentType === "credit") {
      toast.success("Venta a crédito procesada", {
        description: `${sale.saleNumber} - Total: $${sale.total.toFixed(2)}`
      });
    } else {
      toast.success("Venta completada", {
        description: `${sale.saleNumber} - Total: $${sale.total.toFixed(2)}`
      });
    }
  };

  const openPaymentModal = () => {
    if (cart.length === 0) {
      toast.error("Carrito vacío", {
        description: "Agrega productos antes de procesar el pago"
      });
      return;
    }
    
    // Validar que los datos del cliente sean obligatorios
    if (!customerName.trim()) {
      toast.error("Datos del cliente requeridos", {
        description: "Debes seleccionar o crear un cliente para continuar"
      });
      return;
    }
    
    if (!customerRuc.trim()) {
      alert("Debe ingresar el RUC/Cédula del cliente para continuar");
      return;
    }
    
    setAmountPaid(totals.total.toFixed(2));
    setShowPaymentModal(true);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#0D1B2A] via-[#1a2332] to-[#0D1B2A] p-6 overflow-auto">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de productos - 2 columnas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barra de búsqueda y filtros */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Campo de búsqueda */}
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[#0f1825] border border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Filtro por categoría como combo */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 bg-[#0f1825] border border-white/10 rounded-xl text-white text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.filter(c => c !== "all").map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Contador de productos y limpiar filtros */}
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  <span className="font-bold text-white">{filteredProducts.length}</span> {filteredProducts.length === 1 ? "producto encontrado" : "productos encontrados"}
                </span>
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {/* Grid de productos */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.code}
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/10 rounded-xl overflow-hidden hover:border-primary hover:from-primary/10 hover:to-primary/5 hover:scale-[1.02] transition-all duration-200 cursor-pointer group shadow-lg hover:shadow-primary/30"
                  >
                    {/* Header con categoría y stock */}
                    <div className="bg-gradient-to-r from-primary/20 to-orange-600/20 border-b border-white/10 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gradient-to-br from-primary to-orange-600 rounded-md group-hover:scale-110 transition-transform shadow-lg">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-300 text-xs font-medium">
                          {product.category}
                        </span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-lg ${
                        product.stock > 20
                          ? "bg-green-500 text-white"
                          : product.stock > 5
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                      }`}>
                        {product.stock} unid.
                      </span>
                    </div>

                    <div className="p-4">
                      {/* Nombre del producto */}
                      <h3 className="text-white font-bold text-base mb-3 line-clamp-2 min-h-[48px] group-hover:text-primary transition-colors leading-tight">
                        {product.name}
                      </h3>

                      {/* Características del producto */}
                      <div className="space-y-2 mb-4">
                        {/* Código de barras */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                          <svg className="w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="6" width="2" height="12"/>
                            <rect x="6" y="6" width="1" height="12"/>
                            <rect x="9" y="6" width="2" height="12"/>
                            <rect x="13" y="6" width="1" height="12"/>
                            <rect x="16" y="6" width="2" height="12"/>
                            <rect x="20" y="6" width="2" height="12"/>
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-500 text-[10px]">Código</p>
                            <p className="text-white text-xs font-mono truncate">{product.code}</p>
                          </div>
                        </div>

                        {/* Stock disponible */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-gray-500 text-[10px]">Disponibilidad</p>
                            <p className={`text-xs font-bold ${
                              product.stock > 20 ? "text-green-400" : product.stock > 5 ? "text-yellow-400" : "text-red-400"
                            }`}>
                              {product.stock > 20 ? "En stock" : product.stock > 5 ? "Stock bajo" : "Últimas unidades"}
                            </p>
                          </div>
                        </div>

                        {/* IVA */}
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-gray-500 text-[10px]">Impuesto incluido</p>
                            <p className="text-white text-xs font-medium">IVA {product.tax}%</p>
                          </div>
                        </div>
                      </div>

                      {/* Precio */}
                      <div className="bg-gradient-to-r from-primary/10 to-orange-600/10 border border-primary/20 rounded-lg p-3">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Precio base</p>
                            <span className="text-primary font-bold text-2xl group-hover:text-3xl transition-all">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-xs mb-1">Precio final</p>
                            <p className="text-white text-lg font-bold">
                              ${(product.price * (1 + product.tax / 100)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Indicador de hover */}
                      <div className="mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-center gap-2 text-primary text-sm font-bold animate-pulse">
                          <Plus className="w-5 h-5" />
                          <span>Agregar al carrito</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <div className="inline-block p-6 bg-white/5 rounded-2xl border border-white/10 mb-4">
                    <Package className="w-20 h-20 text-gray-600 mx-auto" />
                  </div>
                  <p className="text-white font-bold text-lg mb-2">No se encontraron productos</p>
                  <p className="text-gray-400 text-sm mb-4">
                    {searchTerm || selectedCategory !== "all" 
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "No hay productos disponibles"
                    }
                  </p>
                  {(searchTerm || selectedCategory !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                      className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium inline-flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Panel de carrito - 1 columna */}
          <div className="lg:col-span-1 space-y-6">
            {/* Buscador de cliente */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative">
              <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Buscar Cliente
                <span className="text-red-400 text-xs ml-auto">* Obligatorio</span>
              </h3>
              
              {/* Campo de búsqueda */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por apellido o cédula..."
                  value={customerSearchTerm}
                  onChange={(e) => handleCustomerSearch(e.target.value)}
                  onFocus={() => customerSearchTerm && setShowCustomerResults(true)}
                  onBlur={() => setTimeout(() => setShowCustomerResults(false), 200)}
                  className={`w-full pl-10 pr-3 py-2 bg-[#0f1825] border rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none transition-all ${
                    customerName.trim() ? "border-white/10 focus:border-primary/50" : "border-red-500/50 focus:border-red-500"
                  }`}
                />
              </div>

              {/* Dropdown de resultados */}
              {showCustomerResults && (
                <div className="absolute z-10 w-[calc(100%-2rem)] mt-1 bg-[#0f1825] border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    <>
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.ruc}
                          onClick={() => selectCustomer(customer)}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs">
                                {customer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm truncate">{customer.name}</p>
                              <p className="text-gray-400 text-xs font-mono">{customer.ruc}</p>
                            </div>
                            {customer.pendingBalance > 0 && (
                              <div className="flex-shrink-0">
                                <span className="text-xs px-2 py-1 bg-red-500/10 text-red-400 rounded-md">
                                  Saldo: ${customer.pendingBalance.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={openCreateCustomerModal}
                        className="w-full text-left px-4 py-3 bg-primary/10 hover:bg-primary/20 transition-colors border-t border-primary/20"
                      >
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-primary" />
                          <span className="text-primary font-medium text-sm">Crear nuevo cliente</span>
                        </div>
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <User className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm mb-3">No se encontraron clientes</p>
                      <button
                        onClick={openCreateCustomerModal}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
                      >
                        <UserPlus className="w-4 h-4" />
                        Crear nuevo cliente
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Cliente seleccionado */}
              {foundCustomer && (
                <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{foundCustomer.name}</p>
                      <p className="text-gray-400 text-xs">RUC: {foundCustomer.ruc}</p>
                    </div>
                    <button
                      onClick={() => {
                        setFoundCustomer(null);
                        setCustomerName("");
                        setCustomerRuc("");
                        setCustomerSearchTerm("");
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Carrito */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col" style={{ height: "calc(100vh - 400px)" }}>
              {/* Header del carrito */}
              <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  Carrito ({cart.length})
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Items del carrito */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Carrito vacío</p>
                    <p className="text-gray-500 text-xs mt-2">
                      Selecciona productos para agregar
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.code}
                      className="bg-[#0f1825] border border-white/10 rounded-xl p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 mr-2">
                          <p className="text-white font-medium text-sm line-clamp-2">
                            {item.product.name}
                          </p>
                          <p className="text-gray-500 text-xs font-mono">
                            {item.product.code}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.code)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => updateQuantity(item.product.code, item.quantity - 1)}
                          className="p-1 bg-white/5 hover:bg-white/10 text-white rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={item.product.stock}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product.code, parseInt(e.target.value) || 1)
                          }
                          className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-center text-sm focus:outline-none focus:border-primary/50"
                        />
                        <button
                          onClick={() => updateQuantity(item.product.code, item.quantity + 1)}
                          className="p-1 bg-white/5 hover:bg-white/10 text-white rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-gray-400 text-xs ml-auto">
                          ${item.product.price.toFixed(2)} c/u
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">Desc%:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={item.discount}
                            onChange={(e) =>
                              updateDiscount(item.product.code, parseFloat(e.target.value) || 0)
                            }
                            className="w-14 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs text-center focus:outline-none focus:border-primary/50"
                          />
                        </div>
                        <span className="text-primary font-bold">
                          ${(item.subtotal * (1 - item.discount / 100)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totales */}
              {cart.length > 0 && (
                <div className="border-t border-white/10 bg-gradient-to-br from-primary/10 to-primary/5 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white font-medium">
                      ${totals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Descuento:</span>
                      <span className="text-red-400 font-medium">
                        -${totals.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">IVA:</span>
                    <span className="text-white font-medium">
                      ${totals.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg border-t border-white/20 pt-2">
                    <span className="text-white font-bold">TOTAL:</span>
                    <span className="text-primary font-bold text-2xl">
                      ${totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {/* Botón de pago */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={openPaymentModal}
                  disabled={cart.length === 0}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-6 h-6" />
                  Procesar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-secondary border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-white/10 px-6 py-4">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-primary" />
                Procesar Pago
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Total a pagar: <span className="text-primary font-bold text-lg">${totals.total.toFixed(2)}</span>
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Tipo de pago: Contado o Crédito */}
              <div>
                <label className="block text-gray-300 text-sm mb-3 font-medium">
                  Tipo de Pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentType("cash")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentType === "cash"
                        ? "border-primary bg-primary/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                      paymentType === "cash" ? "text-primary" : "text-gray-400"
                    }`} />
                    <span className={`text-sm font-medium ${
                      paymentType === "cash" ? "text-white" : "text-gray-400"
                    }`}>
                      Contado
                    </span>
                  </button>
                  <button
                    onClick={() => setPaymentType("credit")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentType === "credit"
                        ? "border-primary bg-primary/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <FileText className={`w-6 h-6 mx-auto mb-2 ${
                      paymentType === "credit" ? "text-primary" : "text-gray-400"
                    }`} />
                    <span className={`text-sm font-medium ${
                      paymentType === "credit" ? "text-white" : "text-gray-400"
                    }`}>
                      Crédito
                    </span>
                  </button>
                </div>
              </div>

              {/* Configuración de crédito */}
              {paymentType === "credit" && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 space-y-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-bold text-sm">Venta a Crédito</p>
                      <p className="text-gray-300 text-xs mt-1">
                        Configure el plan de pagos mensuales
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 text-xs mb-2 font-medium">
                        Plazo (meses)
                      </label>
                      <select
                        value={creditMonths}
                        onChange={(e) => setCreditMonths(parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                      >
                        <option value={3}>3 meses</option>
                        <option value={6}>6 meses</option>
                        <option value={12}>12 meses</option>
                        <option value={18}>18 meses</option>
                        <option value={24}>24 meses</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-xs mb-2 font-medium">
                        Tasa Anual (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  {/* Preview de la cuota */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-xs">Cuota Mensual</p>
                        <p className="text-white font-bold text-xl">
                          ${(() => {
                            const principal = totals.total;
                            const monthlyRate = interestRate / 100 / 12;
                            const n = creditMonths;
                            const monthlyPayment = monthlyRate === 0 
                              ? principal / n 
                              : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
                            return monthlyPayment.toFixed(2);
                          })()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">Total a Pagar</p>
                        <p className="text-primary font-bold text-lg">
                          ${(() => {
                            const principal = totals.total;
                            const monthlyRate = interestRate / 100 / 12;
                            const n = creditMonths;
                            const monthlyPayment = monthlyRate === 0 
                              ? principal / n 
                              : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
                            return (monthlyPayment * n).toFixed(2);
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Método de pago */}
              <div>
                <label className="block text-gray-300 text-sm mb-3 font-medium">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === method.id
                            ? "border-primary bg-primary/10"
                            : "border-white/10 bg-white/5 hover:border-white/20"
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          paymentMethod === method.id ? "text-primary" : "text-gray-400"
                        }`} />
                        <span className={`text-sm font-medium ${
                          paymentMethod === method.id ? "text-white" : "text-gray-400"
                        }`}>
                          {method.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Monto pagado (solo para efectivo en contado) */}
              {paymentMethod === "cash" && paymentType === "cash" && (
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Monto Recibido
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white text-lg font-bold focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="0.00"
                  />
                  {parseFloat(amountPaid) > 0 && (
                    <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Cambio:</span>
                        <span className="text-primary font-bold text-lg">
                          ${Math.max(0, parseFloat(amountPaid) - totals.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botones de acción rápida para efectivo */}
              {paymentMethod === "cash" && paymentType === "cash" && (
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 20, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setAmountPaid((parseFloat(amountPaid || "0") + amount).toFixed(2))}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      +${amount}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex items-center gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={processSale}
                className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de comprobante */}
      {showReceiptModal && lastSale && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden">
            {/* Comprobante */}
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#0D1B2A] mb-1">¡Venta Exitosa!</h2>
                <p className="text-gray-600 text-sm">TicSoftEc - Sistema ERP</p>
              </div>

              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">N° Venta:</span>
                  <span className="font-mono font-bold text-[#0D1B2A]">{lastSale.saleNumber}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="text-[#0D1B2A]">{lastSale.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hora:</span>
                  <span className="text-[#0D1B2A]">{lastSale.time}</span>
                </div>
              </div>

              {(lastSale.customerName || lastSale.customerRuc) && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  {lastSale.customerName && (
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Cliente:</span>
                      <span className="text-[#0D1B2A] font-medium">{lastSale.customerName}</span>
                    </div>
                  )}
                  {lastSale.customerRuc && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">RUC/CI:</span>
                      <span className="text-[#0D1B2A] font-mono">{lastSale.customerRuc}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-sm font-bold text-[#0D1B2A] mb-2">Productos:</h4>
                <div className="space-y-2">
                  {lastSale.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-800 font-medium">{item.product.name}</span>
                        <span className="text-[#0D1B2A] font-bold">
                          ${(item.subtotal * (1 - item.discount / 100)).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>{item.quantity} x ${item.product.price.toFixed(2)}</span>
                        {item.discount > 0 && <span className="text-red-600">-{item.discount}%</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-[#0D1B2A]">${lastSale.subtotal.toFixed(2)}</span>
                </div>
                {lastSale.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Descuento:</span>
                    <span className="text-red-600">-${lastSale.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">IVA:</span>
                  <span className="text-[#0D1B2A]">${lastSale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span className="text-[#0D1B2A]">TOTAL:</span>
                  <span className="text-primary text-2xl">${lastSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Método de Pago:</span>
                  <span className="text-[#0D1B2A] font-medium">
                    {PAYMENT_METHODS.find(m => m.id === lastSale.paymentMethod)?.name}
                  </span>
                </div>
                {lastSale.paymentMethod === "cash" && (
                  <>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Efectivo Recibido:</span>
                      <span className="text-[#0D1B2A]">${lastSale.amountPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cambio:</span>
                      <span className="text-primary font-bold">${lastSale.change.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <p className="text-center text-xs text-gray-500 mb-4">
                ¡Gracias por su compra!
              </p>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3">
              <button
                onClick={printReceipt}
                className="flex-1 px-4 py-3 bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Imprimir
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cliente encontrado */}
      {showCustomerModal && foundCustomer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-secondary border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-white/10 px-6 py-4">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Cliente Encontrado
              </h3>
              <p className="text-gray-400 text-sm mt-1">RUC/Cédula: {foundCustomer.ruc}</p>
            </div>

            <div className="p-6">
              {/* Información del cliente */}
              <div className="mb-6 space-y-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {foundCustomer.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{foundCustomer.name}</p>
                      <p className="text-gray-400 text-sm">Cliente Registrado</p>
                    </div>
                  </div>

                  {foundCustomer.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{foundCustomer.email}</span>
                    </div>
                  )}

                  {foundCustomer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{foundCustomer.phone}</span>
                    </div>
                  )}

                  {foundCustomer.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{foundCustomer.address}</span>
                    </div>
                  )}
                </div>

                {/* Estadísticas del cliente */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <p className="text-gray-400 text-xs">Total Compras</p>
                    </div>
                    <p className="text-white font-bold text-2xl">{foundCustomer.totalPurchases}</p>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-blue-400" />
                      <p className="text-gray-400 text-xs">Última Compra</p>
                    </div>
                    <p className="text-white font-bold text-sm">
                      {foundCustomer.lastPurchaseDate || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Alerta de saldo pendiente */}
                {foundCustomer.pendingBalance > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-bold text-sm mb-1">¡Saldo Pendiente!</p>
                        <p className="text-white font-bold text-2xl">
                          ${foundCustomer.pendingBalance.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Este cliente tiene un saldo pendiente por pagar
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sin saldo pendiente */}
                {foundCustomer.pendingBalance === 0 && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-green-400 font-bold text-sm">Sin Saldos Pendientes</p>
                        <p className="text-gray-400 text-xs mt-1">
                          El cliente está al día con sus pagos
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Continuar con este Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crear cliente */}
      {showCreateCustomerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-secondary border border-white/10 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-white/10 px-6 py-4">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                Crear Nuevo Cliente
              </h3>
              <p className="text-gray-400 text-sm mt-1">Complete los datos del cliente</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-xs mb-2 font-medium">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    placeholder="Ingrese el nombre completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-2 font-medium">
                    RUC/Cédula *
                  </label>
                  <input
                    type="text"
                    placeholder="Ingrese RUC o cédula"
                    value={customerRuc}
                    onChange={(e) => setCustomerRuc(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-2 font-medium">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={newCustomerData.email}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-2 font-medium">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    placeholder="+593 99 123 4567"
                    value={newCustomerData.phone}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-xs mb-2 font-medium">
                    Dirección
                  </label>
                  <input
                    type="text"
                    placeholder="Calle, número, ciudad"
                    value={newCustomerData.address}
                    onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-xs">
                  * Los campos marcados son obligatorios
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex items-center gap-3">
              <button
                onClick={() => {
                  setShowCreateCustomerModal(false);
                  setCustomerSearchTerm("");
                  setCustomerName("");
                  setCustomerRuc("");
                  setNewCustomerData({ email: "", phone: "", address: "" });
                }}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={createNewCustomer}
                className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Guardar Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de amortización */}
      {showAmortizationModal && lastSale && lastSale.creditInfo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-secondary border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-white/10 px-6 py-4">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Tabla de Amortización - Venta a Crédito
              </h3>
              <p className="text-gray-400 text-sm mt-1">N° Venta: {lastSale.saleNumber} | Cliente: {lastSale.customerName}</p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Resumen del crédito */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Monto del Crédito</p>
                  <p className="text-white font-bold text-xl">${lastSale.total.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Plazo</p>
                  <p className="text-white font-bold text-xl">{lastSale.creditInfo.months} meses</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Tasa Anual</p>
                  <p className="text-white font-bold text-xl">{lastSale.creditInfo.interestRate}%</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Cuota Mensual</p>
                  <p className="text-primary font-bold text-xl">${lastSale.creditInfo.monthlyPayment.toFixed(2)}</p>
                </div>
              </div>

              {/* Resumen total */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm mb-1">Total a Pagar (Capital + Intereses)</p>
                    <p className="text-yellow-400 font-bold text-2xl">${lastSale.creditInfo.totalWithInterest.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs mb-1">Interés Total</p>
                    <p className="text-red-400 font-bold text-lg">
                      ${(lastSale.creditInfo.totalWithInterest - lastSale.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabla de amortización */}
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/10 border-b border-white/10">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-300">#</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-300">Fecha</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-300">Cuota</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-300">Interés</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-300">Capital</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-300">Saldo</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-300">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastSale.creditInfo.amortizationTable.map((row, index) => (
                        <tr 
                          key={row.paymentNumber} 
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                            index % 2 === 0 ? 'bg-white/[0.02]' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-white text-sm font-medium">{row.paymentNumber}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm font-mono">{row.date}</td>
                          <td className="px-4 py-3 text-right text-white text-sm font-bold">
                            ${row.payment.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-red-400 text-sm">
                            ${row.interest.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-green-400 text-sm">
                            ${row.principal.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-primary text-sm font-bold">
                            ${row.balance.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              row.status === "paid" 
                                ? "bg-green-500/10 text-green-400" 
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}>
                              {row.status === "paid" ? "Pagado" : "Pendiente"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white/10 font-bold">
                        <td colSpan={2} className="px-4 py-3 text-white text-sm">TOTALES</td>
                        <td className="px-4 py-3 text-right text-white text-sm">
                          ${lastSale.creditInfo.totalWithInterest.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-red-400 text-sm">
                          ${(lastSale.creditInfo.totalWithInterest - lastSale.total).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-green-400 text-sm">
                          ${lastSale.total.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-white text-sm">$0.00</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-4 flex gap-3">
              <button
                onClick={printReceipt}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Imprimir
              </button>
              <button
                onClick={() => {
                  setShowAmortizationModal(false);
                  setPaymentType("cash");
                }}
                className="flex-1 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster 
        position="top-right" 
        richColors 
        expand={true}
        theme="dark"
      />
    </div>
  );
}