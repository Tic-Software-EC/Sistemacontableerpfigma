import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, CreditCard, DollarSign, Trash2, Plus, Minus, X, Receipt, User, Package, Calendar, Clock, Banknote, Smartphone, Building2, CheckCircle, Printer, AlertTriangle, UserPlus, Phone, Mail, MapPin, TrendingUp, TrendingDown, FileText, Info, AlertCircle, Pause, Play, Save, Percent, Camera, Loader2, Users, Heart, Briefcase, LayoutList, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";
import { CustomerModal } from "./pos-customer-modal";
import { CreateCustomerModal } from "./pos-create-customer-modal";
import { useTheme } from "../contexts/theme-context";
import { useCaja } from "../contexts/caja-context";

interface Product {
  code: string;
  name: string;
  price: number;
  tax: number;
  stock: number;
  category: string;
  description?: string;
  specifications?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
  discount: number;
  subtotal: number;
}

interface Expense {
  id: string;
  tipo: string; // Tipo de gasto
  concepto: string;
  monto: number;
  fecha: string;
  hora: string;
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
  paymentReference?: string;
  amountPaid: number;
  change: number;
  customerName?: string;
  customerRuc?: string;
  status: "completed" | "cancelled";
  creditInfo?: CreditInfo;
  downPayment?: number; // Entrada/Abono inicial para créditos
  sriAuthorization?: string; // Número de autorización del SRI
  sriAuthorizationDate?: string; // Fecha de autorización SRI
  sriAuthorizationTime?: string; // Hora de autorización SRI
}

interface CreditInfo {
  months: number;
  interestRate: number;
  monthlyPayment: number;
  totalWithInterest: number;
  amortizationTable: AmortizationRow[];
  downPayment?: number; // Entrada pagada
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

interface HeldSale {
  id: string;
  timestamp: string;
  cart: CartItem[];
  customer: Customer | null;
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
}

// Mock data de clientes
const MOCK_CUSTOMERS: Customer[] = [
  {
    ruc: "9999999999999",
    name: "Consumidor Final",
    email: "",
    phone: "",
    address: "",
    totalPurchases: 0,
    pendingBalance: 0,
    lastPurchaseDate: ""
  },
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
  { 
    code: "PROD-001", 
    name: "Laptop Dell Latitude 5420", 
    price: 850.00, 
    tax: 12, 
    stock: 15, 
    category: "Tecnología",
    description: "Laptop profesional de alto rendimiento para trabajo empresarial",
    specifications: ["Intel Core i5 11va Gen", "8GB RAM DDR4", "256GB SSD", "Pantalla 14 FHD", "Windows 11 Pro", "Puerto HDMI, USB-C, USB 3.0"]
  },
  { 
    code: "PROD-002", 
    name: "Monitor LG 27 pulgadas", 
    price: 320.00, 
    tax: 12, 
    stock: 25, 
    category: "Tecnología",
    description: "Monitor Full HD con tecnología IPS para colores vibrantes",
    specifications: ["27 pulgadas Full HD", "Panel IPS", "Frecuencia 75Hz", "HDMI + DisplayPort", "Soporte VESA", "Tiempo de respuesta 5ms"]
  },
  { 
    code: "PROD-003", 
    name: "Teclado mecánico Logitech", 
    price: 89.99, 
    tax: 12, 
    stock: 40, 
    category: "Tecnología",
    description: "Teclado mecánico gaming con retroiluminación RGB",
    specifications: ["Switches mecánicos", "RGB personalizable", "Reposamuñecas", "Cable trenzado", "Anti-ghosting", "Teclas programables"]
  },
  { 
    code: "PROD-004", 
    name: "Mouse inalámbrico", 
    price: 25.50, 
    tax: 12, 
    stock: 60, 
    category: "Tecnología",
    description: "Mouse ergonómico inalámbrico con batería de larga duración",
    specifications: ["Conexión 2.4GHz", "1600 DPI ajustable", "Batería 12 meses", "6 botones", "Compatible Windows/Mac", "Diseño ergonómico"]
  },
  { 
    code: "PROD-005", 
    name: "Resma papel bond A4", 
    price: 4.50, 
    tax: 0, 
    stock: 200, 
    category: "Papelería",
    description: "Resma de 500 hojas papel bond tamaño A4",
    specifications: ["500 hojas", "Tamaño A4", "75g/m²", "Blancura 95%", "Uso universal", "Certificado FSC"]
  },
  { 
    code: "PROD-006", 
    name: "Marcadores permanentes x12", 
    price: 8.75, 
    tax: 12, 
    stock: 80, 
    category: "Papelería",
    description: "Set de 12 marcadores permanentes de colores variados",
    specifications: ["12 unidades", "Colores surtidos", "Punta redonda", "Tinta permanente", "Secado rápido", "Para múltiples superficies"]
  },
  { 
    code: "PROD-007", 
    name: "Archivador de palanca", 
    price: 2.30, 
    tax: 12, 
    stock: 150, 
    category: "Papelería",
    description: "Archivador de palanca tamaño oficio",
    specifications: ["Tamaño oficio", "Lomo 7cm", "Cartón prensado", "Mecanismo de palanca", "Ojalillos metálicos", "Capacidad 500 hojas"]
  },
  { 
    code: "PROD-008", 
    name: "Silla ergonómica oficina", 
    price: 185.00, 
    tax: 12, 
    stock: 12, 
    category: "Muebles",
    description: "Silla ergonómica con soporte lumbar ajustable",
    specifications: ["Altura ajustable", "Soporte lumbar", "Reposabrazos 3D", "Base cromada", "Ruedas 360°", "Capacidad 120kg"]
  },
  { 
    code: "PROD-009", 
    name: "Escritorio ejecutivo", 
    price: 450.00, 
    tax: 12, 
    stock: 8, 
    category: "Muebles",
    description: "Escritorio ejecutivo en L con acabado premium",
    specifications: ["Forma en L", "Melamina 18mm", "150x150cm", "Pasa cables", "3 cajones con llave", "Soporte para monitor"]
  },
  { 
    code: "PROD-010", 
    name: "Lámpara LED escritorio", 
    price: 35.00, 
    tax: 12, 
    stock: 30, 
    category: "Muebles",
    description: "Lámpara LED regulable con brazo flexible",
    specifications: ["LED 10W", "Brazo flexible", "3 niveles de brillo", "Luz blanca/cálida", "Base con clip", "Puerto USB"]
  },
  { 
    code: "PROD-011", 
    name: "Impresora multifunción", 
    price: 280.00, 
    tax: 12, 
    stock: 10, 
    category: "Tecnología",
    description: "Impresora multifunción con WiFi y ADF",
    specifications: ["Imprime/Escanea/Copia", "WiFi integrado", "ADF 35 hojas", "Duplex automático", "Pantalla táctil", "Tinta continua"]
  },
  { 
    code: "PROD-012", 
    name: "Caja de bolígrafos x50", 
    price: 12.50, 
    tax: 12, 
    stock: 100, 
    category: "Papelería",
    description: "Caja de 50 bolígrafos azules de alta calidad",
    specifications: ["50 unidades", "Tinta azul", "Punta 0.7mm", "Cuerpo plástico", "Trazo suave", "Tapa ventilada"]
  },
];

const PAYMENT_METHODS = [
  { id: "cash", name: "Efectivo", icon: Banknote },
  { id: "card", name: "Tarjeta", icon: CreditCard },
  { id: "transfer", name: "Transferencia", icon: Building2 },
  { id: "mobile", name: "Pago Móvil", icon: Smartphone },
];

export function POS() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── Theme tokens ────────────────────────────────────────────────────────
  const rootBg  = isLight ? "bg-gray-50" : "bg-gradient-to-br from-[#0D1B2A] via-[#1a2332] to-[#0D1B2A]";
  const txt     = isLight ? "text-gray-900" : "text-white";
  const sub     = isLight ? "text-gray-500" : "text-gray-400";
  const lbl     = isLight ? "text-gray-600" : "text-gray-400";
  const bdr     = isLight ? "border-gray-200" : "border-white/10";
  const bdrSub  = isLight ? "border-gray-100" : "border-white/5";
  const card    = isLight ? "bg-white border border-gray-200 shadow-sm" : "bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-xl";
  const cardHdr = isLight ? "bg-gray-50 border-b border-gray-200" : "bg-[#1a2332] border-b border-white/10";
  const tblHdr  = isLight ? "bg-gray-100 border-b border-gray-200 text-gray-500" : "bg-[#1a2332] border-b border-white/10 text-gray-400";
  const rowHov  = isLight ? `border-b border-gray-100 hover:bg-gray-50` : `border-b border-white/5 hover:bg-white/5`;
  const inp     = isLight
    ? "bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30"
    : "bg-[#0f1825] border border-white/10 text-white placeholder-gray-500 focus:border-primary/50 focus:ring-2 focus:ring-primary/20";
  const secBg   = isLight ? "bg-gray-50 border border-gray-200" : "bg-white/5 border border-white/10";
  const qtyBg   = isLight ? "bg-gray-100 border border-gray-200" : "bg-[#0f1825] border border-white/10";
  const modalBg = isLight ? "bg-white" : "bg-[#0D1B2A]";
  const btnSec  = isLight
    ? "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700"
    : "bg-white/10 hover:bg-white/15 border border-white/20 text-white";
  const btnDis  = isLight ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300" : "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600";
  const cajaCard = isLight ? "bg-white border border-gray-200 shadow-sm" : "bg-gradient-to-br from-white/10 to-white/5 border border-white/20";
  // ────────────────────────────────────────────────────────────────────────

  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [showAmortizationPrintModal, setShowAmortizationPrintModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentType, setPaymentType] = useState<"cash" | "credit">("cash");
  const [paymentReference, setPaymentReference] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerRuc, setCustomerRuc] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [lastSale, setLastSale] = useState<Sale | null>(null);
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    birthPlace: "",
    civilStatus: "Soltero/a",
    spouseName: "",
    occupation: "",
    workplace: "",
    workPhone: "",
    city: "",
    parish: "",
    neighborhood: "",
    reference: "",
    guarantorName: "",
    guarantorCedula: "",
    guarantorPhone: "",
    guarantorRelationship: "",
    photo: "",
    signature: "",
  });
  // Estados para consulta de registro civil
  const [consultingCedula, setConsultingCedula] = useState(false);
  const [registroCivilData, setRegistroCivilData] = useState<{
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    lugarNacimiento: string;
  } | null>(null);
  // Estados para crédito
  const [creditMonths, setCreditMonths] = useState(3);
  const [interestRate, setInterestRate] = useState(12);
  const [downPayment, setDownPayment] = useState(0); // Entrada/Abono inicial
  
  // Estados para búsqueda de cliente
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  
  // Estados para filtros y categorías
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Panel de catálogo de productos (oculto por defecto, F3 para mostrar/ocultar)
  const [showProductPanel, setShowProductPanel] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Estados para control de caja (desde contexto compartido)
  const { isCajaOpen, montoInicialCaja, horaApertura, expenses, sales, openCaja: ctxOpenCaja, addExpense, addSale } = useCaja();
  const [showOpenCajaModal, setShowOpenCajaModal] = useState(false);
  const [montoInicial, setMontoInicial] = useState("");

  // Estados para gastos de caja (UI local)
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTipo, setExpenseTipo] = useState(""); // Tipo de gasto
  const [expenseConcepto, setExpenseConcepto] = useState("");
  const [expenseMonto, setExpenseMonto] = useState("");
  const [showExpensesList, setShowExpensesList] = useState(false); // Para ver lista de gastos
  const [expenseFilterTipo, setExpenseFilterTipo] = useState("todos"); // Filtro de tipo

  // Historial de ventas desde contexto compartido (addSale ya viene del useCaja arriba)

  // Estados para ventas en espera
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);
  const [showHeldSalesModal, setShowHeldSalesModal] = useState(false);

  // Calcular totales de ventas y gastos
  const totalVentas = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalGastos = expenses.reduce((sum, expense) => sum + expense.monto, 0);

  // Reloj en tiempo real
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const currentDate = currentTime.toLocaleDateString("es-EC", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  const currentClock = currentTime.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  // Duración de sesión
  const sessionDuration = (() => {
    if (!isCajaOpen || !horaApertura) return "--";
    const [h, m] = horaApertura.split(":").map(Number);
    const open = new Date(); open.setHours(h, m, 0);
    const diff = Math.max(0, Math.floor((currentTime.getTime() - open.getTime()) / 60000));
    const hours = Math.floor(diff / 60), mins = diff % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  })();

  // Desglose por método de pago (IDs: cash, card, transfer, mobile)
  const ventasPorMetodo = {
    efectivo:      sales.filter(s => s.paymentMethod === "cash").reduce((a, s) => a + s.total, 0),
    tarjeta:       sales.filter(s => s.paymentMethod === "card").reduce((a, s) => a + s.total, 0),
    transferencia: sales.filter(s => s.paymentMethod === "transfer" || s.paymentMethod === "mobile").reduce((a, s) => a + s.total, 0),
  };

  // Estadísticas de sesión
  const ticketPromedio = sales.length > 0 ? totalVentas / sales.length : 0;
  const totalProductosVendidos = sales.reduce((sum, sale) => sum + sale.items.reduce((a, i) => a + i.quantity, 0), 0);

  // Calcular tabla de amortización
  const generateAmortizationTable = (): CreditInfo => {
    const principal = Math.max(0, totals.total - downPayment); // Saldo a financiar (total - entrada)
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
      amortizationTable: table,
      downPayment: downPayment // Incluir la entrada en la info del crédito
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
    setCustomerPhone(customer.phone || "");
    setCustomerAddress(customer.address || "");
    setCustomerEmail(customer.email || "");
    setCustomerSearchTerm("");
    setShowCustomerResults(false);
    setShowCustomerModal(true);
    setIsEditingCustomer(false);
  };

  // Actualizar datos del cliente
  const handleUpdateCustomer = () => {
    if (!foundCustomer) return;
    
    // Aquí iría la lógica para actualizar el cliente en la base de datos
    // Por ahora solo mostramos un mensaje de confirmación
    toast.success("Datos del cliente actualizados");
    
    // Actualizar el foundCustomer con los nuevos datos
    setFoundCustomer({
      ...foundCustomer,
      name: customerName,
      ruc: customerRuc,
      phone: customerPhone,
      address: customerAddress,
      email: customerEmail
    });
    
    setIsEditingCustomer(false);
  };

  // Abrir modal para crear nuevo cliente
  const openCreateCustomerModal = () => {
    setShowCustomerResults(false);
    setCustomerName(customerSearchTerm);
    setCustomerRuc("");
    setRegistroCivilData(null);
    setShowCreateCustomerModal(true);
  };

  // Consultar datos del registro civil (simulado)
  const consultarRegistroCivil = async (cedula: string) => {
    if (cedula.length < 10) {
      return;
    }

    setConsultingCedula(true);
    
    // Simulación de consulta a API del Registro Civil
    setTimeout(() => {
      // Datos mock del registro civil
      const mockData = {
        nombres: "JUAN CARLOS",
        apellidos: "PÉREZ GONZÁLEZ",
        fechaNacimiento: "15/03/1985",
        lugarNacimiento: "QUITO - PICHINCHA",
      };
      
      setRegistroCivilData(mockData);
      setCustomerName(`${mockData.nombres} ${mockData.apellidos}`);
      
      // Completar automáticamente los campos del formulario
      setNewCustomerData({
        ...newCustomerData,
        birthDate: mockData.fechaNacimiento,
        birthPlace: mockData.lugarNacimiento,
      });
      
      setConsultingCedula(false);
      toast.success("Datos obtenidos del Registro Civil y completados automáticamente");
    }, 1500);
  };

  // Manejar carga de foto
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCustomerData({ ...newCustomerData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Manejar carga de firma
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCustomerData({ ...newCustomerData, signature: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const createNewCustomer = () => {
    // Validar que tenga nombre y RUC
    if (!customerName.trim() || !customerRuc.trim()) {
      toast.error("El nombre y RUC/Cédula son obligatorios"); 
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
    setRegistroCivilData(null);
    setCustomerName("");
    setCustomerRuc("");
    setNewCustomerData({ 
      email: "", 
      phone: "", 
      address: "",
      birthDate: "",
      birthPlace: "",
      civilStatus: "Soltero/a",
      spouseName: "",
      occupation: "",
      workplace: "",
      workPhone: "",
      city: "",
      parish: "",
      neighborhood: "",
      reference: "",
      guarantorName: "", 
      guarantorCedula: "", 
      guarantorPhone: "",
      guarantorRelationship: "",
      photo: "",
      signature: ""
    });
    toast.success("Cliente registrado exitosamente");
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

  // Funciones para abrir y cerrar caja
  const handleOpenCaja = () => {
    const monto = parseFloat(montoInicial);
    if (isNaN(monto) || monto < 0) {
      toast.error("Ingresa un monto inicial válido");
      return;
    }
    ctxOpenCaja(monto);
    setShowOpenCajaModal(false);
    setMontoInicial("");
    toast.success("Caja abierta exitosamente", {
      description: `Monto inicial: $${monto.toFixed(2)}`
    });
  };

  // Función para registrar gasto
  const handleAddExpense = () => {
    if (!expenseTipo) {
      toast.error("Debes seleccionar un tipo de gasto");
      return;
    }

    if (!expenseConcepto.trim()) {
      toast.error("Debes ingresar un concepto para el gasto");
      return;
    }

    const monto = parseFloat(expenseMonto);
    if (isNaN(monto) || monto <= 0) {
      toast.error("El monto debe ser un número mayor a 0");
      return;
    }

    if (!isCajaOpen) {
      toast.error("Debes abrir la caja antes de registrar gastos");
      return;
    }

    const now = new Date();
    const newExpense: Expense = {
      id: Date.now().toString(),
      tipo: expenseTipo,
      concepto: expenseConcepto,
      monto: monto,
      fecha: now.toLocaleDateString("es-EC"),
      hora: now.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
    };

    addExpense(newExpense);
    setExpenseTipo("");
    setExpenseConcepto("");
    setExpenseMonto("");
    setShowExpenseModal(false);
    
    toast.success("Gasto registrado exitosamente", {
      description: `${expenseTipo}: $${monto.toFixed(2)}`
    });
  };

  // Calcular total de gastos
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.monto, 0);

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    if (!isCajaOpen) {
      toast.error("Debes abrir la caja antes de realizar ventas");
      return;
    }
    
    // Validar que haya un cliente seleccionado
    if (!customerName || customerName.trim() === "") {
      toast.error("Debe seleccionar un cliente", {
        description: "Selecciona o crea un cliente antes de agregar productos"
      });
      return;
    }
    
    const existingItem = cart.find((item) => item.product.code === product.code);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error(`Solo quedan ${product.stock} unidades de ${product.name}`);
        return;
      }
      updateQuantity(product.code, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        discount: 0,
        subtotal: product.price,
      };
      setCart([...cart, newItem]);
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
      toast.error("No hay suficiente stock disponible");
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
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerEmail("");
      setCustomerSearchTerm("");
      setFoundCustomer(null);
    }
  };

  // Pausar venta actual
  const holdCurrentSale = () => {
    if (cart.length === 0) {
      toast.error("No hay productos en el carrito para pausar");
      return;
    }

    const heldSale: HeldSale = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      cart: [...cart],
      customer: foundCustomer,
      totals: { ...totals }
    };

    setHeldSales([...heldSales, heldSale]);
    
    // Limpiar carrito y cliente
    setCart([]);
    setCustomerName("");
    setCustomerRuc("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerEmail("");
    setFoundCustomer(null);
    setCustomerSearchTerm("");
    setPaymentType("cash");

    toast.success("Venta pausada exitosamente", {
      description: `Venta guardada - Total: $${totals.total.toFixed(2)}`
    });
  };

  // Recuperar venta pausada
  const resumeHeldSale = (heldSale: HeldSale) => {
    // Si hay algo en el carrito actual, preguntar si desea pausarlo
    if (cart.length > 0) {
      if (!confirm("¿Deseas pausar la venta actual antes de recuperar la otra?")) {
        return;
      }
      holdCurrentSale();
    }

    // Restaurar la venta pausada
    setCart(heldSale.cart);
    if (heldSale.customer) {
      setFoundCustomer(heldSale.customer);
      setCustomerName(heldSale.customer.name);
      setCustomerRuc(heldSale.customer.ruc);
      setCustomerPhone(heldSale.customer.phone || "");
      setCustomerAddress(heldSale.customer.address || "");
      setCustomerEmail(heldSale.customer.email || "");
    }

    // Eliminar de la lista de ventas en espera
    setHeldSales(heldSales.filter(sale => sale.id !== heldSale.id));
    setShowHeldSalesModal(false);

    toast.success("Venta recuperada", {
      description: `Total: $${heldSale.totals.total.toFixed(2)}`
    });
  };

  // Eliminar venta pausada
  const deleteHeldSale = (heldSaleId: string) => {
    if (confirm("¿Estás seguro de eliminar esta venta pausada?")) {
      setHeldSales(heldSales.filter(sale => sale.id !== heldSaleId));
      toast.success("Venta pausada eliminada");
    }
  };

  // Procesar pago
  const processSale = () => {
    if (cart.length === 0) {
      toast.error("Agrega productos antes de procesar el pago");
      return;
    }

    // Validar que ventas a crédito requieren cliente
    if (paymentType === "credit" && !customerName.trim() && !foundCustomer) {
      toast.error("Las ventas a crédito requieren seleccionar un cliente");
      return;
    }

    // Validar referencia para pagos no efectivo
    if (paymentMethod !== "cash" && !paymentReference.trim()) {
      toast.error("Debes ingresar la referencia o número de comprobante del pago");
      return;
    }

    const paidAmount = parseFloat(amountPaid) || 0;
    if (paymentMethod === "cash" && paymentType === "cash" && paidAmount < totals.total) {
      toast.error(`Monto insuficiente. Falta: $${(totals.total - paidAmount).toFixed(2)}`);
      return;
    }

    // Generar número de autorización del SRI (49 dígitos)
    const generateSRIAuthorization = () => {
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
      const authNumber = timestamp + random;
      return authNumber.padEnd(49, '0').substring(0, 49);
    };

    const currentDate = new Date();
    const authorizationDate = currentDate.toISOString().split("T")[0];
    const authorizationTime = currentDate.toLocaleTimeString("es-EC", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit" 
    });

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
      paymentReference: paymentReference || undefined,
      amountPaid: paidAmount,
      change: paymentMethod === "cash" ? paidAmount - totals.total : 0,
      customerName: customerName || undefined,
      customerRuc: customerRuc || undefined,
      status: "completed",
      downPayment: paymentType === "credit" && downPayment > 0 ? downPayment : undefined,
      sriAuthorization: generateSRIAuthorization(), // Generar autorización SRI
      sriAuthorizationDate: authorizationDate, // Fecha de autorización
      sriAuthorizationTime: authorizationTime, // Hora de autorización
    };

    if (paymentType === "credit") {
      const creditInfo = generateAmortizationTable();
      sale.creditInfo = creditInfo;
    }

    setLastSale(sale);
    addSale(sale); // Agregar venta al historial compartido
    setCart([]);
    setShowPaymentModal(false);
    
    // Lógica de modales según tipo de pago
    if (paymentType === "credit") {
      // Si hay entrada, mostrar recibo primero, sino ir directo a tabla de amortización
      if (downPayment > 0) {
        setShowReceiptModal(true);
      } else {
        setShowAmortizationPrintModal(true);
      }
    } else {
      // Pago de contado: mostrar recibo normal
      setShowReceiptModal(true);
    }
    
    setAmountPaid("");
    setPaymentReference("");
    setCustomerName("");
    setCustomerRuc("");
    setCustomerSearchTerm("");
    setFoundCustomer(null);
    setDownPayment(0); // Resetear entrada
    
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
    if (!isCajaOpen) {
      toast.error("Debes abrir la caja antes de procesar pagos");
      return;
    }

    if (cart.length === 0) {
      toast.error("Agrega productos antes de procesar el pago");
      return;
    }
    
    // Cliente ya no es obligatorio - removida validación
    
    setAmountPaid(totals.total.toFixed(2));
    setPaymentReference(""); // Limpiar referencia anterior
    setShowPaymentModal(true);
  };

  const printReceipt = () => {
    window.print();
  };

  // ── Atajo F3: mostrar/ocultar panel de catálogo de productos ────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F3 → toggle popup catálogo (solo si caja abierta)
      if (e.key === "F3") {
        e.preventDefault();
        if (!isCajaOpen) return;
        setShowProductPanel((v) => {
          const next = !v;
          if (next) setTimeout(() => searchInputRef.current?.focus(), 80);
          else setSearchTerm("");
          return next;
        });
      }
      // Escape → cierra el popup si está abierto
      if (e.key === "Escape" && showProductPanel) {
        setShowProductPanel(false);
        setSearchTerm("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showProductPanel]);

  return (
    <div className={`h-full ${rootBg} overflow-auto`}>
      <div className="p-4">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Título principal */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            
            
          </div>
        </div>

        {/* ── LAYOUT PRINCIPAL: [Cliente + Carrito] | [Caja estrecha] ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_270px] lg:grid-rows-[auto_1fr] gap-3">

          {/* Sección de Cliente — col 1, fila 1 */}
          <div className={`${card} rounded-xl transition-all lg:col-start-1 lg:row-start-1 overflow-visible`}>
            <div className="px-3 py-2.5 flex items-center gap-3">

              {/* Buscador */}
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${sub} pointer-events-none`} />
                <input
                  type="text"
                  placeholder={foundCustomer ? "Cambiar cliente..." : "Buscar cliente por nombre o cédula..."}
                  value={customerSearchTerm}
                  onChange={(e) => handleCustomerSearch(e.target.value)}
                  onFocus={() => customerSearchTerm && setShowCustomerResults(true)}
                  onBlur={() => setTimeout(() => setShowCustomerResults(false), 200)}
                  disabled={!isCajaOpen}
                  className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp} disabled:opacity-40 disabled:cursor-not-allowed`}
                />

                {/* Dropdown */}
                {showCustomerResults && (
                  <div className={`absolute z-[200] w-full mt-1 rounded-xl overflow-hidden shadow-2xl max-h-64 overflow-y-auto ${modalBg} border ${bdrSub}`}>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <button
                          key={customer.ruc}
                          onClick={() => selectCustomer(customer)}
                          className={`w-full text-left px-4 py-2.5 transition-colors border-b last:border-b-0 ${bdrSub} ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm truncate ${txt}`}>{customer.name}</p>
                              <p className={`text-xs font-mono ${sub}`}>{customer.ruc} · {customer.phone}</p>
                            </div>
                            {customer.pendingBalance > 0 && (
                              <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded border border-red-500/20 flex-shrink-0">
                                ${customer.pendingBalance.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-5 text-center">
                        <p className={`text-sm mb-3 ${sub}`}>No se encontraron clientes</p>
                        <button
                          onClick={openCreateCustomerModal}
                          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 mx-auto"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Crear nuevo
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info del cliente seleccionado */}
              {foundCustomer ? (
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className={`h-7 w-px ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate max-w-[180px] ${txt}`}>{customerName}</p>
                    <p className={`text-xs font-mono ${sub}`}>{customerRuc}</p>
                  </div>
                  <button
                    onClick={() => {
                      setFoundCustomer(null);
                      setCustomerName(""); setCustomerRuc(""); setCustomerPhone("");
                      setCustomerEmail(""); setCustomerAddress(""); setCustomerSearchTerm("");
                    }}
                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${isLight ? "hover:bg-gray-100 text-gray-400" : "hover:bg-white/5 text-gray-500"}`}
                    title="Quitar cliente"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={openCreateCustomerModal}
                  disabled={!isCajaOpen}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isLight ? "text-gray-500 hover:bg-gray-100 border border-gray-200" : "text-gray-400 hover:bg-white/5 border border-white/10"}`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Nuevo
                </button>
              )}


            </div>
          </div>

          {/* ── Caja — col 2, span 2 filas (altura completa) ── */}
          <div className={`${secBg} rounded-xl p-3 flex flex-col gap-3 lg:col-start-2 lg:row-start-1 lg:row-span-2 overflow-y-auto`}>
            {/* ── IDENTIDAD ── */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className={`text-base font-bold ${txt}`}>Caja 1</p>
                  <p className={`text-xs ${sub}`}>Punto de Venta</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full inline-block ${isCajaOpen ? "bg-green-500" : "bg-gray-400"}`} />
                <span className={`text-sm font-semibold ${isCajaOpen ? "text-green-500" : "text-gray-400"}`}>
                  {isCajaOpen ? "Abierta" : "Cerrada"}
                </span>
              </div>
            </div>

            {/* ── RELOJ ── */}
            <div className={`rounded-xl p-4 text-center border ${bdrSub} ${isLight ? "bg-white/40" : "bg-black/20"}`}>
              <p className={`text-4xl font-bold font-mono tracking-normal ${isCajaOpen ? txt : sub}`}>
                {currentClock}
              </p>
              <p className={`text-sm capitalize mt-1 ${sub}`}>{currentDate}</p>
              {isCajaOpen && (
                <p className={`text-xs mt-1.5 ${sub}`}>Sesión activa · {sessionDuration}</p>
              )}
            </div>

            {/* ── MÉTRICAS ── */}
            <div className={`flex flex-col divide-y ${bdr}`}>
              {[
                { label: "Inicial", val: isCajaOpen ? montoInicialCaja : 0, color: txt },
                { label: "Ventas",  val: isCajaOpen ? totalVentas : 0,      color: "text-green-500" },
                { label: "Gastos",  val: isCajaOpen ? totalGastos : 0,      color: "text-red-400" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <span className={`text-sm ${sub}`}>{label}</span>
                  <span className={`text-base font-bold font-mono ${color}`}>${val.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* ── TOTAL EN CAJA ── */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs uppercase tracking-widest mb-1 text-primary/70">Total en Caja</p>
              <p className="text-3xl font-bold font-mono text-primary">
                ${isCajaOpen ? (montoInicialCaja + totalVentas - totalGastos).toFixed(2) : '0.00'}
              </p>
              <p className={`text-xs mt-1.5 ${sub}`}>
                {sales.length} venta{sales.length !== 1 ? "s" : ""} · {expenses.length} gasto{expenses.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* ── APERTURA ── */}
            {isCajaOpen && (
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className={`w-3.5 h-3.5 ${sub}`} />
                  <span className={`text-sm ${sub}`}>Apertura</span>
                </div>
                <span className={`text-sm font-mono font-semibold ${txt}`}>{horaApertura}</span>
              </div>
            )}

            {/* ── BOTONES ── */}
            <div className="flex flex-col gap-2">
              {!isCajaOpen ? (
                <button
                  onClick={() => setShowOpenCajaModal(true)}
                  className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Abrir Caja
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${btnSec}`}
                  >
                    <TrendingDown className="w-4 h-4" />
                    Registrar Gasto
                  </button>
                  {expenses.length > 0 && (
                    <button
                      onClick={() => setShowExpensesList(true)}
                      className={`w-full px-4 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${btnSec}`}
                    >
                      <FileText className="w-4 h-4" />
                      Ver Gastos ({expenses.length})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>{/* fin Caja - REEMPLAZO LIMPIO */}



          {/* ── Carrito + Totales — col 1, fila 2 ── */}
          <div className="lg:col-start-1 lg:row-start-2 flex flex-col gap-2 h-full">
            {/* Carrito */}
            <div className={`${card} rounded-xl overflow-hidden flex flex-col flex-1`}>
              {/* Header del carrito */}
              <div className={`${cardHdr} px-4 py-2.5 flex items-center justify-between`}>
                <h3 className={`font-bold text-base flex items-center gap-2 ${txt}`}>
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  Carrito
                  <span className={`text-xs font-normal ${sub}`}>({cart.length})</span>
                </h3>
                <div className="flex items-center gap-2">
                  {/* Botón para mostrar/ocultar catálogo */}
                  <button
                    disabled={!isCajaOpen}
                    onClick={() => {
                      setShowProductPanel((v) => {
                        const next = !v;
                        if (next) setTimeout(() => searchInputRef.current?.focus(), 80);
                        return next;
                      });
                    }}
                    title={showProductPanel ? "Ocultar catálogo (F3)" : "Mostrar catálogo (F3)"}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      showProductPanel
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : isLight
                          ? "bg-gray-100 border-gray-300 text-gray-600 hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
                          : "bg-white/5 border-white/15 text-gray-400 hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    <LayoutList className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{showProductPanel ? "Ocultar" : "Catálogo"}</span>
                    <kbd className={`text-[10px] px-1 py-0.5 rounded font-mono border ${
                      isLight ? "bg-gray-200 border-gray-300 text-gray-500" : "bg-white/10 border-white/20 text-gray-400"
                    }`}>F3</kbd>
                  </button>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className={`transition-colors text-xs flex items-center gap-1 ${sub} hover:text-red-500`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              {/* Contenido del carrito con altura fija y scroll */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className={`p-6 rounded-2xl border mb-4 ${secBg}`}>
                      <ShoppingCart className={`w-16 h-16 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    </div>
                    <p className={`font-bold text-lg mb-2 ${txt}`}>Carrito vacío</p>
                    <p className={`text-sm text-center mb-4 ${sub}`}>
                      Presiona <kbd className={`text-xs px-1.5 py-0.5 rounded font-mono border mx-1 ${isLight ? "bg-gray-100 border-gray-300 text-gray-600" : "bg-white/10 border-white/20 text-gray-300"}`}>F3</kbd> para abrir el catálogo y agregar productos
                    </p>
                    <button
                      disabled={!isCajaOpen}
                      onClick={() => {
                        setShowProductPanel(true);
                        setTimeout(() => searchInputRef.current?.focus(), 80);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      <LayoutList className="w-4 h-4" />
                      Abrir Catálogo de Productos
                    </button>
                  </div>
                ) : (
                  <div className="w-full">
                    {/* Encabezado de la tabla */}
                    <div className={`grid grid-cols-[90px_1fr_140px_90px_100px_30px] gap-2 px-3 py-2 text-xs font-semibold uppercase sticky top-0 z-10 ${tblHdr}`}>
                      <div>Código</div>
                      <div>Producto</div>
                      <div>Cantidad</div>
                      <div>P. Unit.</div>
                      <div>Total</div>
                      <div></div>
                    </div>

                    {/* Filas de productos */}
                    {cart.map((item) => (
                      <div
                        key={item.product.code}
                        className={`grid grid-cols-[90px_1fr_140px_90px_100px_30px] gap-2 px-3 py-2 transition-colors items-center ${rowHov}`}
                      >
                        {/* Código */}
                        <div className={`text-xs font-mono uppercase ${sub}`}>
                          {item.product.code}
                        </div>

                        {/* Producto */}
                        <div className={`text-sm truncate ${txt}`} title={item.product.name}>
                          {item.product.name}
                        </div>

                        {/* Cantidad con botones */}
                        <div className={`flex items-center gap-1 rounded w-fit ${qtyBg}`}>
                          <button
                            onClick={() => updateQuantity(item.product.code, item.quantity - 1)}
                            className={`p-1 transition-colors ${sub} ${isLight ? "hover:text-gray-900" : "hover:text-white"}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              updateQuantity(item.product.code, val);
                            }}
                            className={`w-12 bg-transparent text-center text-sm font-mono focus:outline-none ${txt}`}
                            min="1"
                          />
                          <button
                            onClick={() => updateQuantity(item.product.code, item.quantity + 1)}
                            className={`p-1 transition-colors ${sub} ${isLight ? "hover:text-gray-900" : "hover:text-white"}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Precio Unitario */}
                        <div className={`text-sm font-mono ${sub}`}>
                          ${item.product.price.toFixed(2)}
                        </div>

                        {/* Total */}
                        <div className={`text-sm font-bold font-mono ${txt}`}>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>

                        {/* Botón eliminar */}
                        <div>
                          <button
                            onClick={() => removeFromCart(item.product.code)}
                            className={`p-1 transition-colors ${sub} hover:text-red-500`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer - Totales y acciones */}
              {cart.length > 0 && (
                <div className={`p-3 space-y-2 border-t ${bdr} ${isLight ? "bg-gray-50" : "bg-[#1a2332]"}`}>
                  {/* Desglose de totales */}
                  <div className="space-y-1.5 px-3">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${sub}`}>Subtotal:</span>
                      <span className={`text-sm font-mono ${txt}`}>${totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${sub}`}>IVA (15%):</span>
                      <span className={`text-sm font-mono ${txt}`}>${totals.tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total a Pagar - Header destacado */}
                  <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${secBg}`}>
                    <span className={`font-bold text-sm uppercase ${txt}`}>TOTAL A PAGAR:</span>
                    <span className={`font-bold text-2xl font-mono ${txt}`}>${totals.total.toFixed(2)}</span>
                  </div>

                  {/* Botones de acción */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Pausar */}
                    <button
                      onClick={holdCurrentSale}
                      disabled={!isCajaOpen}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        isCajaOpen ? btnSec : btnDis
                      }`}
                    >
                      <Pause className="w-4 h-4" />
                      Pausar
                    </button>

                    {/* En Espera */}
                    <button
                      onClick={() => setShowHeldSalesModal(true)}
                      disabled={!isCajaOpen}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 relative ${
                        isCajaOpen ? btnSec : btnDis
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      En Espera
                      {heldSales.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {heldSales.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Procesar Pago - Botón grande */}
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={!isCajaOpen}
                    className={`w-full px-4 py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 ${
                      isCajaOpen
                        ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30'
                        : btnDis
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Procesar Pago
                  </button>
                </div>
              )}
            </div>
          </div>{/* fin carrito col-1 row-2 */}

        </div>{/* fin grid principal */}

      {/* ── POPUP CATÁLOGO DE PRODUCTOS (F3) ────────────────────────────────── */}
      {showProductPanel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          onClick={() => { setShowProductPanel(false); setSearchTerm(""); }}
        >
          <div
            className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col ${modalBg}`}
            style={{ maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del popup */}
            <div className={`${cardHdr} px-5 py-3 flex items-center justify-between flex-shrink-0`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <LayoutList className="w-4 h-4 text-primary" />
                </div>
                <span className={`font-bold text-base ${txt}`}>Catálogo de Productos</span>
                <kbd className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ml-1 ${isLight ? "bg-gray-100 border-gray-300 text-gray-500" : "bg-white/10 border-white/20 text-gray-400"}`}>F3</kbd>
              </div>
              <button
                onClick={() => { setShowProductPanel(false); setSearchTerm(""); }}
                className={`p-1.5 rounded-lg transition-colors ${isLight ? "hover:bg-gray-200 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}
                title="Cerrar (Esc o F3)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de búsqueda y filtro */}
            <div className={`px-5 py-3 border-b flex-shrink-0 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/3"}`}>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                {/* Búsqueda */}
                <div className="relative">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${sub}`} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && (setShowProductPanel(false), setSearchTerm(""))}
                    className={`w-full pl-10 pr-8 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className={`absolute right-2 top-1/2 -translate-y-1/2 ${sub} hover:text-primary`}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {/* Categoría */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`pl-3 pr-7 py-2 rounded-lg text-sm appearance-none focus:outline-none transition-all cursor-pointer ${inp}`}
                  >
                    <option value="all">Todas</option>
                    {categories.filter(c => c !== "all").map((cat) => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                  <svg className={`w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${sub}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Contador */}
              <p className={`text-xs mt-2 ${sub}`}>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
                {searchTerm && <span> para "<strong>{searchTerm}</strong>"</span>}
              </p>
            </div>

            {/* Lista de productos */}
            <div className="overflow-y-auto custom-scrollbar flex-1">
              {filteredProducts.length > 0 ? (
                <div className="w-full">
                  {/* Encabezado tabla */}
                  <div className={`grid grid-cols-[100px_1fr_90px_80px_40px_40px] gap-2 px-5 py-2 text-xs font-semibold uppercase sticky top-0 z-10 ${tblHdr}`}>
                    <div>Código</div>
                    <div>Producto</div>
                    <div className="text-right">Precio</div>
                    <div className="text-center">Stock</div>
                    <div></div>
                    <div></div>
                  </div>

                  {/* Filas */}
                  {filteredProducts.map((product) => (
                    <div
                      key={product.code}
                      onClick={() => {
                        if (!isCajaOpen) return;
                        addToCart(product);
                        setShowProductPanel(false);
                        setSearchTerm("");
                      }}
                      className={`grid grid-cols-[100px_1fr_90px_80px_40px_40px] gap-2 px-5 py-2.5 transition-colors items-center border-b ${bdrSub} ${
                        isCajaOpen
                          ? `cursor-pointer group ${isLight ? "hover:bg-primary/5" : "hover:bg-primary/10"}`
                          : "cursor-not-allowed opacity-40"
                      }`}
                    >
                      {/* Código */}
                      <div className={`text-xs font-mono ${sub}`}>{product.code}</div>

                      {/* Nombre + categoría */}
                      <div>
                        <p className={`text-sm font-medium truncate ${txt} ${isCajaOpen ? "group-hover:text-primary transition-colors" : ""}`} title={product.name}>
                          {product.name}
                        </p>
                        <p className={`text-xs capitalize ${sub}`}>{product.category}</p>
                      </div>

                      {/* Precio */}
                      <div className="text-right">
                        <p className={`text-sm font-bold font-mono text-primary`}>${product.price.toFixed(2)}</p>
                        <p className={`text-xs ${sub}`}>IVA {product.tax}%</p>
                      </div>

                      {/* Stock */}
                      <div className="text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          product.stock > 10
                            ? "bg-green-500/15 text-green-600"
                            : product.stock > 0
                              ? "bg-yellow-500/15 text-yellow-600"
                              : "bg-red-500/15 text-red-500"
                        }`}>
                          {product.stock}
                        </span>
                      </div>

                      {/* Botón agregar */}
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isCajaOpen) return;
                            addToCart(product);
                            setShowProductPanel(false);
                            setSearchTerm("");
                          }}
                          disabled={!isCajaOpen || product.stock === 0}
                          className={`p-1.5 rounded-lg transition-all ${
                            isCajaOpen && product.stock > 0
                              ? "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                              : "opacity-30 cursor-not-allowed text-gray-400"
                          }`}
                          title="Agregar al carrito"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Botón ver detalles */}
                      <div className="flex justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            setShowProductDetailModal(true);
                          }}
                          className={`p-1.5 rounded-lg transition-all ${isLight ? "text-gray-400 hover:bg-gray-100 hover:text-primary" : "text-gray-500 hover:bg-white/10 hover:text-primary"}`}
                          title="Ver especificaciones del producto"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className={`p-5 rounded-2xl border mb-3 ${secBg}`}>
                    <Package className={`w-14 h-14 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                  </div>
                  <p className={`font-bold mb-1 ${txt}`}>Sin resultados</p>
                  <p className={`text-sm mb-4 ${sub}`}>
                    {searchTerm ? `No hay productos para "${searchTerm}"` : "No hay productos disponibles"}
                  </p>
                  {(searchTerm || selectedCategory !== "all") && (
                    <button
                      onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2"
                    >
                      <X className="w-3.5 h-3.5" /> Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer del popup */}
            <div className={`px-5 py-2.5 border-t flex items-center justify-between flex-shrink-0 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/3"}`}>
              <p className={`text-xs ${sub}`}>
                Clic en una fila o en <Plus className="w-3 h-3 inline" /> para agregar al carrito
              </p>
              <button
                onClick={() => { setShowProductPanel(false); setSearchTerm(""); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-100" : "border-white/15 text-gray-400 hover:bg-white/10"}`}
              >
                Cerrar <kbd className={`ml-1 text-[10px] px-1 py-0.5 rounded font-mono border ${isLight ? "bg-gray-200 border-gray-300" : "bg-white/10 border-white/20"}`}>Esc</kbd>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ────────────────────────────────────────────────────────────────────── */}
      </div>

      {/* Modal de pago - DISEÑO RENOVADO */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl ${modalBg}`}>
            
            {/* Header Compacto */}
            <div className={`${cardHdr} px-4 py-3`}>
              <h3 className={`font-bold text-base flex items-center gap-2 ${txt}`}>
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                Procesar Pago
              </h3>
            </div>

            {/* Contenido del Modal */}
            <div className="p-5">
              
              {/* Formulario en 2 columnas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Columna Izquierda: Selecciones y Detalles */}
                <div className="space-y-4">
                  {/* Método de Pago */}
                  <div>
                    <label className={`block text-xs mb-2 font-bold flex items-center gap-1.5 ${txt}`}>
                      <CreditCard className="w-3.5 h-3.5 text-primary" />
                      Método de Pago
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all ${inp}`}
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tipo de Pago */}
                  <div>
                    <label className={`block text-xs mb-2 font-bold flex items-center gap-1.5 ${txt}`}>
                      <DollarSign className="w-3.5 h-3.5 text-primary" />
                      Tipo de Pago
                    </label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as "cash" | "credit")}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-all ${inp}`}
                    >
                      <option value="cash">Contado - Pago inmediato</option>
                      <option value="credit">Crédito - Pagos diferidos</option>
                    </select>
                  </div>

                  {/* Detalles según método seleccionado */}
                  <div className="space-y-4">

                    {/* Campo de Monto Recibido (solo efectivo + contado) */}
                    {paymentMethod === "cash" && paymentType === "cash" && (
                      <div className={`rounded-lg p-3 space-y-2 ${secBg}`}>
                        <div>
                          <label className={`block text-xs mb-2 font-medium flex items-center gap-1.5 ${txt}`}>
                            <Banknote className="w-3.5 h-3.5 text-primary" />
                            Monto Recibido
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg font-bold">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={amountPaid}
                              onChange={(e) => setAmountPaid(e.target.value)}
                              className={`w-full pl-8 pr-3 py-2.5 rounded-lg text-lg font-bold focus:outline-none transition-all ${inp}`}
                              placeholder="0.00"
                              autoFocus
                            />
                          </div>
                        </div>
                        
                        {parseFloat(amountPaid) >= totals.total && (
                          <div className={`rounded-lg p-2.5 ${secBg}`}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className={`text-xs font-medium ${txt}`}>Cambio:</span>
                              </div>
                              <span className="text-primary font-bold text-xl">
                                ${Math.max(0, parseFloat(amountPaid) - totals.total).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {parseFloat(amountPaid) > 0 && parseFloat(amountPaid) < totals.total && (
                          <div className="bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/20 rounded-lg p-2.5">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-red-500 text-xs font-medium">Falta:</span>
                              </div>
                              <span className="text-red-500 font-bold text-lg">
                                ${(totals.total - parseFloat(amountPaid)).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Campo de Referencia (tarjeta, transferencia, pago móvil) */}
                    {paymentMethod !== "cash" && (
                      <div className={`rounded-lg p-3 ${secBg}`}>
                        <label className={`block text-xs mb-2 font-medium flex items-center gap-1.5 ${txt}`}>
                          <CreditCard className="w-3.5 h-3.5 text-primary" />
                          Referencia / N° de Comprobante
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-lg text-sm font-mono focus:outline-none transition-all ${inp}`}
                          placeholder={
                            paymentMethod === "card" ? "Ej: 1234-5678-9012" :
                            paymentMethod === "transfer" ? "Ej: TRANS-2024-001234" :
                            "Ej: REF-123456"
                          }
                          required
                        />
                        <p className={`text-xs mt-2 flex items-start gap-1.5 ${sub}`}>
                          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>
                            {paymentMethod === "card" && "Ingrese los últimos 4 dígitos de la tarjeta o número de autorización"}
                            {paymentMethod === "transfer" && "Ingrese el número de comprobante de transferencia bancaria"}
                            {paymentMethod === "mobile" && "Ingrese el código de confirmación del pago móvil"}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Columna Derecha: Resumen o Configuración de Crédito */}
                <div>
                  {paymentType === "credit" ? (
                    /* Configuración de Crédito con Tabla de Amortización */
                    <div className={`rounded-lg p-4 h-full flex flex-col ${secBg}`}>
                      <div className="flex items-start gap-2 mb-4">
                        <div className={`p-1.5 rounded-lg ${secBg}`}>
                          <AlertTriangle className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${txt}`}>Venta a Crédito</h4>
                          <p className={`text-xs mt-0.5 ${sub}`}>
                            Configure el plan de pagos mensuales
                          </p>
                        </div>
                      </div>

                      {/* Resumen financiero compacto */}
                      <div className={`rounded-lg p-3 mb-3 border ${bdr} ${isLight ? "bg-white" : "bg-[#141c29]"}`}>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <p className={`text-[10px] uppercase font-medium mb-1 ${sub}`}>Total Compra</p>
                            <p className={`font-bold text-base ${txt}`}>${totals.total.toFixed(2)}</p>
                            {totals.discount > 0 && (
                              <p className="text-red-500 text-[10px] mt-0.5">-${totals.discount.toFixed(2)}</p>
                            )}
                          </div>
                          <div>
                            <p className={`text-[10px] uppercase font-medium mb-1 ${sub}`}>Entrada</p>
                            <p className="text-primary font-bold text-base">${downPayment.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className={`text-[10px] uppercase font-medium mb-1 ${sub}`}>A Financiar</p>
                            <p className={`font-bold text-base ${txt}`}>${Math.max(0, totals.total - downPayment).toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className={`border-t ${bdr} pt-2`}>
                          <label className={`block text-[10px] uppercase font-medium mb-1.5 ${sub}`}>
                            Entrada / Abono Inicial (Opcional)
                          </label>
                          <div className="relative">
                            <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-xs ${sub}`}>$</span>
                            <input
                              type="number"
                              min="0"
                              max={totals.total}
                              step="0.01"
                              value={downPayment}
                              onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                              className={`w-full pl-7 pr-3 py-1.5 rounded text-sm font-bold focus:outline-none transition-all ${inp}`}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className={`block text-xs mb-1.5 font-medium ${txt}`}>
                            Plazo (meses)
                          </label>
                          <select
                            value={creditMonths}
                            onChange={(e) => setCreditMonths(parseInt(e.target.value))}
                            className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}
                          >
                            <option value={3}>3 meses</option>
                            <option value={6}>6 meses</option>
                            <option value={12}>12 meses</option>
                            <option value={18}>18 meses</option>
                            <option value={24}>24 meses</option>
                          </select>
                        </div>

                        <div>
                          <label className={`block text-xs mb-1.5 font-medium ${txt}`}>
                            Tasa Anual (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                            className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}
                          />
                        </div>
                      </div>

                      {/* Resumen de cuota y totales - Profesional */}
                      <div className={`rounded-lg p-3 mb-3 border ${bdr} ${isLight ? "bg-white" : "bg-[#141c29]"}`}>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className={`text-[10px] uppercase font-medium mb-1 ${sub}`}>Cuota Mensual</p>
                            <p className={`font-bold text-base ${txt}`}>
                              ${(() => {
                                const principal = Math.max(0, totals.total - downPayment);
                                const monthlyRate = interestRate / 100 / 12;
                                const n = creditMonths;
                                const monthlyPayment = monthlyRate === 0 
                                  ? principal / n 
                                  : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
                                return monthlyPayment.toFixed(2);
                              })()} <span className={`text-xs font-normal ${sub}`}>x {creditMonths} meses</span>
                            </p>
                          </div>
                          <div>
                            <p className={`text-[10px] uppercase font-medium mb-1 ${sub}`}>Total a Pagar</p>
                            <p className="text-primary font-bold text-base">
                              ${(() => {
                                const principal = Math.max(0, totals.total - downPayment);
                                const monthlyRate = interestRate / 100 / 12;
                                const n = creditMonths;
                                const monthlyPayment = monthlyRate === 0 
                                  ? principal / n 
                                  : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
                                return ((monthlyPayment * n) + downPayment).toFixed(2);
                              })()} <span className="text-red-400 text-[10px]">+${(() => {
                                const principal = Math.max(0, totals.total - downPayment);
                                const monthlyRate = interestRate / 100 / 12;
                                const n = creditMonths;
                                const monthlyPayment = monthlyRate === 0 
                                  ? principal / n 
                                  : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
                                return ((monthlyPayment * n) - principal).toFixed(2);
                              })()}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tabla de amortización compacta con scroll */}
                      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                        <h5 className={`font-bold text-xs mb-2 flex items-center gap-1.5 ${txt}`}>
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          Tabla de Amortización
                        </h5>
                        <div className={`rounded-lg overflow-hidden flex-1 flex flex-col min-h-0 border ${bdr} ${isLight ? "bg-white" : "bg-[#141c29]"}`}>
                          <div className="overflow-y-auto flex-1" style={{ maxHeight: '200px' }}>
                            <table className="w-full text-xs">
                              <thead className={`sticky top-0 z-10 border-b ${bdr} ${isLight ? "bg-gray-50" : "bg-[#141c29]"}`}>
                                <tr>
                                  <th className={`px-2 py-1.5 text-left font-bold ${sub}`}>#</th>
                                  <th className={`px-2 py-1.5 text-left font-bold ${sub}`}>Fecha</th>
                                  <th className={`px-2 py-1.5 text-right font-bold ${sub}`}>Cuota</th>
                                  <th className={`px-2 py-1.5 text-right font-bold ${sub}`}>Interés</th>
                                  <th className={`px-2 py-1.5 text-right font-bold ${sub}`}>Capital</th>
                                  <th className={`px-2 py-1.5 text-right font-bold ${sub}`}>Saldo</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  const principal = Math.max(0, totals.total - downPayment); // Saldo a financiar
                                  const monthlyRate = interestRate / 100 / 12;
                                  const n = creditMonths;
                                  
                                  if (principal === 0) {
                                    return (
                                      <tr>
                                        <td colSpan={6} className="px-2 py-4 text-center text-gray-400 text-xs">
                                          No hay saldo a financiar. La entrada cubre el total.
                                        </td>
                                      </tr>
                                    );
                                  }
                                  
                                  const monthlyPayment = monthlyRate === 0 
                                    ? principal / n 
                                    : principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
                                  
                                  let balance = principal;
                                  const rows = [];
                                  const today = new Date();
                                  
                                  for (let i = 1; i <= n; i++) {
                                    const interestPayment = balance * monthlyRate;
                                    const principalPayment = monthlyPayment - interestPayment;
                                    balance -= principalPayment;
                                    
                                    // Calcular fecha de pago: mismo día del mes siguiente
                                    const paymentDate = new Date(today);
                                    paymentDate.setMonth(paymentDate.getMonth() + i);
                                    
                                    // Formatear fecha con día/mes/año (ej: 21/03/2026)
                                    const day = paymentDate.getDate().toString().padStart(2, '0');
                                    const month = (paymentDate.getMonth() + 1).toString().padStart(2, '0');
                                    const year = paymentDate.getFullYear();
                                    
                                    rows.push(
                                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-2 py-1.5 text-white font-mono">{i}</td>
                                        <td className="px-2 py-1.5 text-gray-300 font-mono">{day}/{month}/{year}</td>
                                        <td className="px-2 py-1.5 text-right text-white font-bold">${monthlyPayment.toFixed(2)}</td>
                                        <td className="px-2 py-1.5 text-right text-red-500">${interestPayment.toFixed(2)}</td>
                                        <td className="px-2 py-1.5 text-right text-green-500">${principalPayment.toFixed(2)}</td>
                                        <td className="px-2 py-1.5 text-right text-orange-500 font-bold">${Math.max(0, balance).toFixed(2)}</td>
                                      </tr>
                                    );
                                  }
                                  
                                  return rows;
                                })()}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Resumen de Pago de Contado */
                    <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4 h-full flex flex-col">
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 border ${bdr} ${secBg}`}>
                          <CheckCircle className="w-9 h-9 text-primary" />
                        </div>
                        <h4 className={`font-bold text-base mb-2 ${txt}`}>Pago de Contado</h4>
                        <p className={`text-xs mb-4 max-w-xs ${sub}`}>
                          El cliente pagará el monto total en este momento
                        </p>
                        
                        <div className={`w-full rounded-lg p-3 ${secBg}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs ${sub}`}>Subtotal:</span>
                            <span className={`text-sm font-bold ${txt}`}>${totals.subtotal.toFixed(2)}</span>
                          </div>
                          {totals.discount > 0 && (
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-xs ${sub}`}>Descuento:</span>
                              <span className="text-red-500 text-sm font-bold">-${totals.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs ${sub}`}>IVA (12%):</span>
                            <span className={`text-sm font-bold ${txt}`}>${totals.tax.toFixed(2)}</span>
                          </div>
                          <div className={`h-px my-2 ${isLight ? "bg-gray-200" : "bg-white/20"}`}></div>
                          <div className="flex items-center justify-between">
                            <span className={`font-bold text-sm ${txt}`}>TOTAL:</span>
                            <span className="text-primary font-bold text-2xl">${totals.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className={`border-t ${bdr} px-5 py-3 ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setDownPayment(0);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-lg transition-all font-medium text-sm ${btnSec}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={processSale}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirmar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de comprobante */}
      {showReceiptModal && lastSale && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden">
            {/* Comprobante */}
            <div className="p-5">
              <div className="text-center mb-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-lg font-bold text-[#0D1B2A] mb-0.5">¡Venta Exitosa!</h2>
                <p className="text-gray-600 text-xs">TicSoftEc - Sistema ERP</p>
              </div>

              <div className="border-t border-b border-gray-200 py-2 mb-2">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600">N° Venta:</span>
                  <span className="font-mono font-bold text-[#0D1B2A]">{lastSale.saleNumber}</span>
                </div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="text-[#0D1B2A] datetime-display">{lastSale.date}</span>
                </div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-600">Hora:</span>
                  <span className="text-[#0D1B2A] datetime-display">{lastSale.time}</span>
                </div>
                {lastSale.sriAuthorization && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs mb-1">
                      <span className="text-gray-600 font-semibold">Autorización SRI:</span>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <span className="font-mono text-[10px] text-green-800 font-bold break-all">
                        {lastSale.sriAuthorization}
                      </span>
                    </div>
                    {lastSale.sriAuthorizationDate && lastSale.sriAuthorizationTime && (
                      <div className="flex justify-between mt-2 text-xs">
                        <div>
                          <span className="text-gray-600">Fecha Aut.:</span>
                          <span className="ml-1 text-green-700 datetime-display">{lastSale.sriAuthorizationDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Hora Aut.:</span>
                          <span className="ml-1 text-green-700 datetime-display">{lastSale.sriAuthorizationTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {(lastSale.customerName || lastSale.customerRuc) && (
                <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                  {lastSale.customerName && (
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Cliente:</span>
                      <span className="text-[#0D1B2A] font-medium">{lastSale.customerName}</span>
                    </div>
                  )}
                  {lastSale.customerRuc && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">RUC/CI:</span>
                      <span className="text-[#0D1B2A] font-mono">{lastSale.customerRuc}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Solo mostrar productos si es pago de contado */}
              {lastSale.paymentType === "cash" && (
                <>
                  <div className="mb-2">
                    <h4 className="text-xs font-bold text-[#0D1B2A] mb-1.5">Productos:</h4>
                    <div className="space-y-1.5">
                      {lastSale.items.map((item, index) => (
                        <div key={index} className="text-xs">
                          <div className="flex justify-between mb-0.5">
                            <span className="text-gray-800 font-medium">{item.product.name}</span>
                            <span className="text-[#0D1B2A] font-bold">
                              ${(item.subtotal * (1 - item.discount / 100)).toFixed(2)}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-500 flex justify-between">
                            <span>{item.quantity} x ${item.product.price.toFixed(2)}</span>
                            {item.discount > 0 && <span className="text-red-600">-{item.discount}%</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-2 space-y-1 mb-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-[#0D1B2A]">${lastSale.subtotal.toFixed(2)}</span>
                    </div>
                    {lastSale.discount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Descuento:</span>
                        <span className="text-red-600">-${lastSale.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">IVA:</span>
                      <span className="text-[#0D1B2A]">${lastSale.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-1.5">
                      <span className="text-[#0D1B2A]">TOTAL:</span>
                      <span className="text-primary text-lg">${lastSale.total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="bg-gray-50 rounded-lg p-2 mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Tipo de Pago:</span>
                  <span className="text-[#0D1B2A] font-bold">
                    {lastSale.paymentType === "credit" ? "CRÉDITO" : "CONTADO"}
                  </span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Método de Pago:</span>
                  <span className="text-[#0D1B2A] font-medium">
                    {PAYMENT_METHODS.find(m => m.id === lastSale.paymentMethod)?.name}
                  </span>
                </div>
                
                {lastSale.paymentType === "credit" && lastSale.downPayment && lastSale.downPayment > 0 && (
                  <div className="border-t border-gray-300 pt-1 mt-1">
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-[#0D1B2A] font-bold">Entrada Pagada:</span>
                      <span className="text-[#0D1B2A] font-bold">${lastSale.downPayment.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                {lastSale.paymentMethod === "cash" && lastSale.paymentType === "cash" && (
                  <>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-600">Efectivo Recibido:</span>
                      <span className="text-[#0D1B2A]">${lastSale.amountPaid.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Cambio:</span>
                      <span className="text-primary font-bold">${lastSale.change.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                {lastSale.paymentReference && (
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-600">Referencia:</span>
                    <span className="text-[#0D1B2A] font-mono font-bold">{lastSale.paymentReference}</span>
                  </div>
                )}
              </div>

              {/* Resumen de crédito si aplica */}
              {lastSale.paymentType === "credit" && lastSale.creditInfo && (
                <div className="border border-gray-300 rounded-lg p-2 mb-2">
                  <h4 className="text-[#0D1B2A] font-bold text-xs mb-1">Resumen del Crédito</h4>
                  <div className="space-y-0.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saldo a Financiar:</span>
                      <span className="text-[#0D1B2A] font-bold">${(lastSale.total - (lastSale.downPayment || 0)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cuotas:</span>
                      <span className="text-[#0D1B2A] font-bold">{lastSale.creditInfo.months} x ${lastSale.creditInfo.monthlyPayment.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plazo:</span>
                      <span className="text-[#0D1B2A] font-bold">{lastSale.creditInfo.months} meses</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 text-center italic">
                    Ver Tabla para plan de pagos completo
                  </p>
                </div>
              )}

              <p className="text-center text-xs text-gray-500 mb-2">
                ¡Gracias por su compra!
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
              {lastSale.paymentType === "credit" && lastSale.creditInfo ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={printReceipt}
                      className="px-3 py-2 bg-white border border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                    >
                      <Receipt className="w-4 h-4" />
                      Imprimir
                    </button>
                    <button
                      onClick={() => {
                        setShowReceiptModal(false);
                        setShowAmortizationPrintModal(true);
                      }}
                      className="px-3 py-2 bg-primary border border-primary text-white hover:bg-primary/90 rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                    >
                      <FileText className="w-4 h-4" />
                      Ver Tabla
                    </button>
                  </div>
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 text-[#0D1B2A] rounded-lg transition-colors font-medium text-xs"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={printReceipt}
                    className="flex-1 px-3 py-2 bg-white border border-primary text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </button>
                  <button
                    onClick={() => setShowReceiptModal(false)}
                    className="flex-1 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium text-xs"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de impresión de tabla de amortización */}
      {showAmortizationPrintModal && lastSale && lastSale.creditInfo && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header simple */}
            <div className="bg-[#0D1B2A] px-6 py-4 border-b-2 border-gray-300">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Tabla de Amortización
              </h3>
              <p className="text-white/80 text-sm mt-1">TicSoftEc - Sistema ERP Contable</p>
            </div>

            {/* Contenido */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Información completa del cliente y venta */}
              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b-2 border-gray-300">
                <div>
                  <p className="text-gray-500 text-xs mb-2 uppercase font-bold">Información del Cliente</p>
                  <div className="space-y-1">
                    <div>
                      <span className="text-gray-600 text-sm">Nombre:</span>
                      <p className="text-[#0D1B2A] font-bold">{lastSale.customerName}</p>
                    </div>
                    {lastSale.customerRuc && (
                      <div>
                        <span className="text-gray-600 text-sm">RUC/CI:</span>
                        <p className="text-[#0D1B2A] font-mono font-bold">{lastSale.customerRuc}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-2 uppercase font-bold">Información de Venta</p>
                  <div className="space-y-1">
                    <div>
                      <span className="text-gray-600 text-sm">N° Venta:</span>
                      <p className="text-[#0D1B2A] font-mono font-bold">{lastSale.saleNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Fecha:</span>
                      <p className="text-[#0D1B2A] font-bold">{lastSale.date} - {lastSale.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desglose de la venta */}
              <div className="border-2 border-gray-300 rounded-lg p-4 mb-6">
                <p className="text-gray-500 text-xs mb-3 uppercase font-bold">Desglose de la Venta</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Subtotal:</span>
                    <span className="text-[#0D1B2A] font-bold">${lastSale.subtotal.toFixed(2)}</span>
                  </div>
                  {lastSale.discount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Descuento Aplicado:</span>
                      <span className="text-red-600 font-bold">-${lastSale.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">IVA (12%):</span>
                    <span className="text-[#0D1B2A] font-bold">${lastSale.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
                    <span className="text-[#0D1B2A] font-bold">Total a Pagar:</span>
                    <span className="text-[#0D1B2A] font-bold text-xl">${lastSale.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Resumen del crédito - Simplificado sin colores */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <p className="text-gray-600 text-xs mb-1">Monto Total</p>
                  <p className="text-[#0D1B2A] font-bold text-xl">${lastSale.total.toFixed(2)}</p>
                </div>
                {lastSale.creditInfo.downPayment && lastSale.creditInfo.downPayment > 0 && (
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <p className="text-gray-600 text-xs mb-1">Entrada Pagada</p>
                    <p className="text-[#0D1B2A] font-bold text-xl">${lastSale.creditInfo.downPayment.toFixed(2)}</p>
                  </div>
                )}
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <p className="text-gray-600 text-xs mb-1">Saldo a Financiar</p>
                  <p className="text-[#0D1B2A] font-bold text-xl">
                    ${(lastSale.total - (lastSale.creditInfo.downPayment || 0)).toFixed(2)}
                  </p>
                </div>
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <p className="text-gray-600 text-xs mb-1">Plazo</p>
                  <p className="text-[#0D1B2A] font-bold text-xl">{lastSale.creditInfo.months} meses</p>
                </div>
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <p className="text-gray-600 text-xs mb-1">Cuota Mensual</p>
                  <p className="text-[#0D1B2A] font-bold text-xl">${lastSale.creditInfo.monthlyPayment.toFixed(2)}</p>
                </div>
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <p className="text-gray-600 text-xs mb-1">Total a Pagar</p>
                  <p className="text-[#0D1B2A] font-bold text-xl">
                    ${((lastSale.creditInfo.downPayment || 0) + lastSale.creditInfo.totalWithInterest).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Tabla de amortización - Sin colores */}
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200 border-b-2 border-gray-300">
                      <th className="px-4 py-3 text-left text-xs font-bold text-[#0D1B2A]">#</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-[#0D1B2A]">Fecha</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-[#0D1B2A]">Cuota</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-[#0D1B2A]">Interés</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-[#0D1B2A]">Capital</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-[#0D1B2A]">Saldo</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-[#0D1B2A]">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastSale.creditInfo.amortizationTable.map((row, index) => (
                      <tr 
                        key={row.paymentNumber} 
                        className={`border-b border-gray-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3 text-[#0D1B2A] text-sm font-medium">{row.paymentNumber}</td>
                        <td className="px-4 py-3 text-[#0D1B2A] text-sm font-mono">{row.date}</td>
                        <td className="px-4 py-3 text-right text-[#0D1B2A] text-sm font-bold">
                          ${row.payment.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-[#0D1B2A] text-sm">
                          ${row.interest.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-[#0D1B2A] text-sm">
                          ${row.principal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-[#0D1B2A] text-sm font-bold">
                          ${row.balance.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2 py-1 rounded-md text-xs font-medium border border-gray-400 text-gray-700">
                            Pendiente
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-200 font-bold border-t-2 border-gray-300">
                      <td colSpan={2} className="px-4 py-3 text-[#0D1B2A] text-sm">TOTALES</td>
                      <td className="px-4 py-3 text-right text-[#0D1B2A] text-sm">
                        ${lastSale.creditInfo.totalWithInterest.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#0D1B2A] text-sm">
                        ${(lastSale.creditInfo.totalWithInterest - (lastSale.total - (lastSale.creditInfo.downPayment || 0))).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#0D1B2A] text-sm">
                        ${(lastSale.total - (lastSale.creditInfo.downPayment || 0)).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right text-[#0D1B2A] text-sm">$0.00</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Nota al pie */}
              <div className="mt-6 p-4 border-2 border-gray-300 rounded-lg bg-gray-50">
                <p className="text-xs text-gray-700 text-center">
                  <strong>Nota:</strong> Esta tabla de amortización es un plan de pagos proyectado. 
                  Las fechas y montos están sujetos a las condiciones acordadas con el cliente.
                </p>
              </div>
            </div>

            {/* Footer con botones */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex gap-3">
              <button
                onClick={printReceipt}
                className="flex-1 px-4 py-3 bg-white border-2 border-primary text-primary hover:bg-primary/5 rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Imprimir Tabla
              </button>
              {lastSale.downPayment && lastSale.downPayment > 0 && (
                <button
                  onClick={() => {
                    setShowAmortizationPrintModal(false);
                    setShowReceiptModal(true);
                  }}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-[#0D1B2A] rounded-xl transition-colors font-bold"
                >
                  Volver
                </button>
              )}
              <button
                onClick={() => setShowAmortizationPrintModal(false)}
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
        <CustomerModal
          customer={foundCustomer}
          onConfirm={() => setShowCustomerModal(false)}
          onCancel={() => {
            setShowCustomerModal(false);
            setFoundCustomer(null);
            setCustomerName("");
            setCustomerRuc("");
            setCustomerPhone("");
            setCustomerAddress("");
            setCustomerEmail("");
          }}
        />
      )}

      {/* Modal de crear cliente */}
      {showCreateCustomerModal && (
        <CreateCustomerModal
          existingCustomers={MOCK_CUSTOMERS}
          onConfirm={(newCustomer) => {
            // Agregar al array mock (en producción se guardaría en BD)
            MOCK_CUSTOMERS.push(newCustomer);
            setFoundCustomer(newCustomer);
            setCustomerSearchTerm(""); // Campo de búsqueda vacío
            // Llenar todos los campos con la información del nuevo cliente
            setCustomerName(newCustomer.name);
            setCustomerRuc(newCustomer.ruc);
            setCustomerPhone(newCustomer.phone || "");
            setCustomerEmail(newCustomer.email || "");
            setCustomerAddress(newCustomer.address || "");
            setShowCreateCustomerModal(false);
          }}
          onCancel={() => {
            setShowCreateCustomerModal(false);
          }}
        />
      )}



      {/* Modal de detalles del producto */}
      {showProductDetailModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowProductDetailModal(false)}>
          <div className={`w-full max-w-3xl rounded-2xl overflow-hidden border ${bdr} ${modalBg} shadow-2xl`} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className={`bg-primary/10 border-b ${bdr} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${txt}`}>Ficha del Producto</h3>
                  <p className={`text-xs font-mono ${sub}`}>{selectedProduct.code}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProductDetailModal(false)}
                className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-black/5 text-gray-400" : "hover:bg-white/10 text-gray-400"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body — dos columnas */}
            <div className="flex flex-col md:flex-row overflow-y-auto" style={{ maxHeight: "70vh" }}>

              {/* Columna izquierda — icono + precio */}
              <div className={`md:w-56 flex-shrink-0 flex flex-col items-center gap-4 p-6 border-b md:border-b-0 md:border-r ${bdr} ${isLight ? "bg-gray-50" : "bg-white/3"}`}>
                {/* Icono grande */}
                <div className="w-28 h-28 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Package className="w-14 h-14 text-primary/60" />
                </div>

                {/* Badges */}
                <div className="flex flex-col gap-2 w-full">
                  <span className="px-3 py-1.5 bg-primary/15 text-primary rounded-lg text-xs font-bold border border-primary/25 text-center capitalize">
                    {selectedProduct.category}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold text-center ${
                    selectedProduct.stock > 20
                      ? "bg-green-500/15 text-green-600 border border-green-500/25"
                      : selectedProduct.stock > 5
                      ? "bg-yellow-500/15 text-yellow-600 border border-yellow-500/25"
                      : "bg-red-500/15 text-red-600 border border-red-500/25"
                  }`}>
                    {selectedProduct.stock > 0 ? `${selectedProduct.stock} en stock` : "Sin stock"}
                  </span>
                </div>

                {/* Precios */}
                <div className={`w-full rounded-xl p-4 border ${bdr} ${secBg} space-y-3`}>
                  <div>
                    <p className={`text-[10px] uppercase tracking-wide font-semibold ${sub}`}>Precio base</p>
                    <p className="text-primary font-bold text-xl">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                  <div className={`border-t pt-3 ${bdr}`}>
                    <p className={`text-[10px] uppercase tracking-wide font-semibold ${sub}`}>IVA {selectedProduct.tax}%</p>
                    <p className={`font-semibold text-base ${txt}`}>+${(selectedProduct.price * selectedProduct.tax / 100).toFixed(2)}</p>
                  </div>
                  <div className="bg-primary/10 border border-primary/25 rounded-lg p-2.5">
                    <p className={`text-[10px] uppercase tracking-wide font-semibold ${sub}`}>Total con IVA</p>
                    <p className="text-primary font-bold text-2xl">${(selectedProduct.price * (1 + selectedProduct.tax / 100)).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Columna derecha — detalles */}
              <div className="flex-1 p-6 space-y-5 overflow-y-auto custom-scrollbar">

                {/* Nombre + descripción */}
                <div>
                  <h2 className={`font-bold text-xl mb-1.5 ${txt}`}>{selectedProduct.name}</h2>
                  {selectedProduct.description ? (
                    <p className={`text-sm leading-relaxed ${sub}`}>{selectedProduct.description}</p>
                  ) : (
                    <p className={`text-sm italic ${sub} opacity-50`}>Sin descripción disponible</p>
                  )}
                </div>

                {/* Info rápida */}
                <div className={`grid grid-cols-2 gap-3`}>
                  {[
                    { label: "Código", value: selectedProduct.code, mono: true },
                    { label: "Categoría", value: selectedProduct.category, mono: false },
                    { label: "IVA aplicado", value: `${selectedProduct.tax}%`, mono: false },
                    { label: "Unidades disponibles", value: `${selectedProduct.stock} uds.`, mono: false },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className={`rounded-lg p-3 border ${bdr} ${secBg}`}>
                      <p className={`text-[10px] uppercase tracking-wide font-semibold mb-0.5 ${sub}`}>{label}</p>
                      <p className={`text-sm font-semibold ${txt} ${mono ? "font-mono" : ""}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Especificaciones técnicas */}
                {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                  <div>
                    <h4 className={`font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2 ${sub}`}>
                      <FileText className="w-4 h-4 text-primary" />
                      Especificaciones Técnicas
                    </h4>
                    <div className={`rounded-xl border ${bdr} ${secBg} p-4`}>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedProduct.specifications.map((spec, index) => (
                          <li key={index} className={`flex items-start gap-2 text-sm ${sub}`}>
                            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Alerta sin stock */}
                {selectedProduct.stock === 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm font-medium">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    Este producto no tiene stock disponible para venta.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className={`border-t ${bdr} px-6 py-4 flex items-center gap-3 flex-shrink-0`}>
              <button
                onClick={() => setShowProductDetailModal(false)}
                className={`flex-1 px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${btnSec}`}
              >
                Cerrar
              </button>
              <button
                onClick={() => { 
                  if (!isCajaOpen) { toast.error("Debes abrir la caja antes de realizar ventas"); return; }
                  addToCart(selectedProduct); 
                  setShowProductDetailModal(false);
                  setShowProductPanel(false);
                }}
                disabled={selectedProduct.stock === 0 || !isCajaOpen}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedProduct.stock === 0 || !isCajaOpen
                    ? "bg-gray-400/30 text-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Abrir Caja */}
      {showOpenCajaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border ${bdr} ${modalBg}`}>
            {/* Header naranja */}
            <div className="bg-primary px-6 pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-[10px] uppercase tracking-widest">Punto de Venta</p>
                    <h3 className="text-white font-bold text-lg">Abrir Caja</h3>
                  </div>
                </div>
                <button
                  onClick={() => { setShowOpenCajaModal(false); setMontoInicial(""); }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Fecha y hora */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className={`rounded-xl p-3 border ${bdrSub} ${isLight ? "bg-white/60" : "bg-white/5"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span className={`text-[10px] uppercase tracking-wide ${sub}`}>Fecha</span>
                  </div>
                  <p className={`text-xs font-semibold ${txt}`}>
                    {new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className={`rounded-xl p-3 border ${bdrSub} ${isLight ? "bg-white/60" : "bg-white/5"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className={`text-[10px] uppercase tracking-wide ${sub}`}>Hora</span>
                  </div>
                  <p className={`text-xs font-semibold ${txt}`}>
                    {new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              {/* Campo monto */}
              <div>
                <label className={`block text-xs font-semibold mb-2 ${txt}`}>
                  Monto Inicial en Efectivo <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary text-lg">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={montoInicial}
                    onChange={(e) => setMontoInicial(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${inp}`}
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
                <p className={`text-[10px] mt-1.5 ${sub}`}>
                  Base para el cuadre al cierre del turno
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 flex gap-2.5">
              <button
                onClick={() => { setShowOpenCajaModal(false); setMontoInicial(""); }}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${btnSec}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleOpenCaja}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                <CheckCircle className="w-4 h-4" />
                Abrir Caja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Gasto */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl overflow-hidden border ${bdr} ${modalBg}`}>
            <div className={`bg-orange-500/10 border-b ${bdr} px-6 py-4`}>
              <h3 className={`font-bold text-xl flex items-center gap-2 ${txt}`}>
                <TrendingDown className="w-6 h-6 text-orange-500" />
                Registrar Gasto
              </h3>
              <p className={`text-sm mt-1 ${sub}`}>Ingresa los detalles del gasto de caja</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm mb-2 ${sub}`}>Tipo de Gasto *</label>
                <select value={expenseTipo} onChange={(e) => setExpenseTipo(e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}>
                  <option value="">Seleccione tipo de gasto...</option>
                  <option value="Suministros">Suministros</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Servicios">Servicios (Luz, Agua, Internet)</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Marketing">Marketing/Publicidad</option>
                  <option value="Personal">Personal/Nómina</option>
                  <option value="Compras">Compras de Mercadería</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${sub}`}>Concepto del Gasto *</label>
                <input type="text" value={expenseConcepto} onChange={(e) => setExpenseConcepto(e.target.value)} placeholder="Descripción detallada del gasto..." className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`} />
              </div>

              <div>
                <label className={`block text-sm mb-2 ${sub}`}>Monto del Gasto *</label>
                <div className="relative">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${sub}`}>$</span>
                  <input type="number" value={expenseMonto} onChange={(e) => setExpenseMonto(e.target.value)} placeholder="0.00" step="0.01" min="0" className={`w-full pl-8 pr-4 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`} />
                </div>
              </div>

              {expenses.length > 0 && (
                <div className={`rounded-xl p-4 border ${bdr} ${secBg}`}>
                  <h4 className={`font-bold text-sm flex items-center gap-2 mb-3 ${txt}`}>
                    <FileText className="w-4 h-4 text-primary" />
                    Resumen del Turno
                  </h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`text-sm ${sub}`}>Gastos Registrados:</span>
                      <span className={`text-sm font-semibold ml-2 ${txt}`}>{expenses.length}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs block mb-1 ${sub}`}>Total</span>
                      <span className="text-red-500 font-bold text-xl">${totalExpenses.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`border-t ${bdr} px-6 py-4 flex gap-3 ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
              <button onClick={() => { setShowExpenseModal(false); setExpenseTipo(""); setExpenseConcepto(""); setExpenseMonto(""); }} className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${btnSec}`}>
                Cancelar
              </button>
              <button onClick={handleAddExpense} className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Registrar Gasto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Gastos */}
      {showExpensesList && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col border ${bdr} ${modalBg}`}>
            <div className={`bg-red-500/10 border-b ${bdr} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-bold text-xl flex items-center gap-2 ${txt}`}>
                    <FileText className="w-6 h-6 text-red-500" />
                    Detalle de Gastos
                  </h3>
                  <p className={`text-sm mt-1 ${sub}`}>
                    {expenses.length} {expenses.length === 1 ? 'gasto registrado' : 'gastos registrados'} en el turno
                  </p>
                </div>
                <button onClick={() => setShowExpensesList(false)} className={`transition-colors ${sub} ${isLight ? "hover:text-gray-900" : "hover:text-white"}`}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <label className={`block text-sm mb-2 font-semibold ${sub}`}>Filtrar por tipo de gasto</label>
                <select value={expenseFilterTipo} onChange={(e) => setExpenseFilterTipo(e.target.value)} className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`}>
                  <option value="todos">Todos los tipos</option>
                  <option value="Suministros">Suministros</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Limpieza">Limpieza</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Personal">Personal</option>
                  <option value="Compras">Compras</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className={`rounded-lg p-4 border ${bdr} ${secBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    <span className={`text-xs ${sub}`}>Total Gastos</span>
                  </div>
                  <span className="text-red-500 text-2xl font-bold font-mono">
                    ${expenses.filter(e => expenseFilterTipo === 'todos' || e.tipo === expenseFilterTipo).reduce((s, e) => s + e.monto, 0).toFixed(2)}
                  </span>
                </div>
                <div className={`rounded-lg p-4 border ${bdr} ${secBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className={`w-5 h-5 ${sub}`} />
                    <span className={`text-xs ${sub}`}>Cantidad</span>
                  </div>
                  <span className={`text-2xl font-bold ${txt}`}>
                    {expenses.filter(e => expenseFilterTipo === 'todos' || e.tipo === expenseFilterTipo).length}
                  </span>
                </div>
                <div className={`rounded-lg p-4 border ${bdr} ${secBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className={`w-5 h-5 ${sub}`} />
                    <span className={`text-xs ${sub}`}>Promedio</span>
                  </div>
                  <span className={`text-2xl font-bold font-mono ${txt}`}>
                    ${(() => { const f = expenses.filter(e => expenseFilterTipo === 'todos' || e.tipo === expenseFilterTipo); return f.length > 0 ? (f.reduce((s, e) => s + e.monto, 0) / f.length).toFixed(2) : '0.00'; })()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {expenses.filter(e => expenseFilterTipo === 'todos' || e.tipo === expenseFilterTipo).length > 0 ? (
                  expenses.filter(e => expenseFilterTipo === 'todos' || e.tipo === expenseFilterTipo).map((expense) => (
                    <div key={expense.id} className={`rounded-xl p-4 transition-colors border ${bdr} ${isLight ? "bg-white hover:bg-gray-50" : "bg-white/5 hover:bg-white/10"}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-primary text-xs font-bold bg-primary/20 px-3 py-1 rounded-lg">{expense.tipo}</span>
                            <span className={`text-xs flex items-center gap-1 ${sub}`}><Clock className="w-3.5 h-3.5" />{expense.hora}</span>
                            <span className={`text-xs flex items-center gap-1 ${sub}`}><Calendar className="w-3.5 h-3.5" />{expense.fecha}</span>
                          </div>
                          <p className={`text-base font-medium ${txt}`}>{expense.concepto}</p>
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-red-500 font-bold text-2xl">${expense.monto.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border ${bdr} ${secBg}`}>
                      <FileText className={`w-8 h-8 ${isLight ? "text-gray-300" : "text-gray-500"}`} />
                    </div>
                    <p className={`text-sm ${sub}`}>No hay gastos registrados para el tipo seleccionado</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`border-t ${bdr} px-6 py-4 ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
              <button onClick={() => setShowExpensesList(false)} className={`w-full px-4 py-3 rounded-xl font-medium transition-colors ${btnSec}`}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de ventas en espera */}
      {showHeldSalesModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col border ${bdr} ${modalBg}`}>
            <div className={`bg-blue-500/10 border-b ${bdr} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-bold text-xl flex items-center gap-2 ${txt}`}>
                    <Save className="w-6 h-6 text-blue-500" />
                    Ventas en Espera
                  </h3>
                  <p className={`text-sm mt-1 ${sub}`}>{heldSales.length} {heldSales.length === 1 ? 'venta pausada' : 'ventas pausadas'}</p>
                </div>
                <button onClick={() => setShowHeldSalesModal(false)} className={`p-2 rounded-lg transition-colors ${sub} ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {heldSales.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border ${bdr} ${secBg}`}>
                    <Save className={`w-10 h-10 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                  </div>
                  <p className={`font-bold text-lg mb-2 ${txt}`}>No hay ventas en espera</p>
                  <p className={`text-sm ${sub}`}>Las ventas pausadas aparecerán aquí</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {heldSales.map((heldSale) => (
                    <div key={heldSale.id} className={`rounded-xl p-5 transition-all border ${isLight ? "bg-white border-gray-200 hover:border-blue-300" : "bg-white/5 border-white/10 hover:border-blue-500/30"}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <p className={`font-bold text-lg ${txt}`}>Venta pausada</p>
                            <p className={`text-sm ${sub}`}>Hora: {heldSale.timestamp}</p>
                            {heldSale.customer && (
                              <div className="flex items-center gap-2 mt-2">
                                <User className="w-4 h-4 text-primary" />
                                <span className={`text-sm ${sub}`}>{heldSale.customer.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs mb-1 ${sub}`}>Total</p>
                          <p className="text-primary font-bold text-2xl">${heldSale.totals.total.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className={`rounded-lg overflow-hidden mb-4 border ${bdr} ${secBg}`}>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className={`border-b ${bdr} ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                                <th className={`text-left text-xs font-medium px-3 py-2 uppercase ${sub}`}>Código</th>
                                <th className={`text-left text-xs font-medium px-3 py-2 uppercase ${sub}`}>Producto</th>
                                <th className={`text-center text-xs font-medium px-3 py-2 uppercase ${sub}`}>Cantidad</th>
                                <th className={`text-right text-xs font-medium px-3 py-2 uppercase ${sub}`}>P. Unit.</th>
                                <th className={`text-right text-xs font-medium px-3 py-2 uppercase ${sub}`}>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {heldSale.cart.map((item, index) => (
                                <tr key={index} className={`border-b ${bdrSub} last:border-b-0 transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}>
                                  <td className={`text-sm px-3 py-2.5 ${sub}`}>{item.product.code}</td>
                                  <td className={`text-sm px-3 py-2.5 ${txt}`}>{item.product.name}</td>
                                  <td className={`text-sm px-3 py-2.5 text-center ${txt}`}>{item.quantity}</td>
                                  <td className={`text-sm px-3 py-2.5 text-right ${sub}`}>${item.product.price.toFixed(2)}</td>
                                  <td className={`font-bold text-sm px-3 py-2.5 text-right ${txt}`}>${(item.quantity * item.product.price).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => resumeHeldSale(heldSale)} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                          <Play className="w-4 h-4" />
                          Recuperar Venta
                        </button>
                        <button onClick={() => deleteHeldSale(heldSale.id)} className="px-4 py-2.5 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`border-t ${bdr} px-6 py-4 ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
              <button onClick={() => setShowHeldSalesModal(false)} className={`w-full px-4 py-3 rounded-xl transition-colors font-medium ${btnSec}`}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}