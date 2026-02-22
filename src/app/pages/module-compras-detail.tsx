import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ShoppingCart,
  User,
  ChevronLeft,
  Bell,
  Settings,
  CreditCard,
  LogOut,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileText,
  X,
  Plus,
  Printer,
  Download,
  Edit,
  Mail,
  Phone,
  MapPin,
  Receipt,
  Package,
  DollarSign,
  Calendar,
  CreditCard as CardIcon,
} from "lucide-react";
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";
import { PurchaseOrdersContent } from "../components/purchase-orders-content";
import { SuppliersContent } from "../components/suppliers-content";
import { MerchandiseReceptionContent } from "../components/merchandise-reception-content";
import { SupplierInvoicesContent } from "../components/supplier-invoices-content";
import { RetentionsContent } from "../components/retentions-content";

// Mock data para las órdenes de compra con productos detallados
const mockOrders = [
  {
    id: "OC-2026-001",
    reference: "OC-2026-001",
    supplier: "Distribuidora Nacional S.A.",
    supplierInitials: "DN",
    supplierContact: "contacto@distrinacional.com",
    supplierPhone: "+593 99 234 5678",
    supplierAddress: "Av. Principal 123, Quito",
    buyer: "Juan Pérez",
    buyerInitials: "JP",
    orderDate: "2026-02-10",
    deliveryDate: "2026-02-20",
    dueDate: "2026-03-10",
    status: "pending",
    statusLabel: "Pendiente",
    items: 4,
    total: 5392.00,
    subtotal: 4850.00,
    tax: 582.00,
    discount: 40.00,
    paid: 0,
    pending: 5392.00,
    notes: "Urgente - Requiere aprobación del gerente",
    products: [
      { code: "PROD-001", name: "Laptop Dell Inspiron 15", description: "Core i5, 8GB RAM, 256GB SSD", quantity: 5, unit: "Unidad", unitPrice: 650.00, subtotal: 3250.00, tax: 390.00, discount: 0, total: 3640.00 },
      { code: "PROD-002", name: "Mouse Inalámbrico Logitech M185", description: "Conexión USB, color negro", quantity: 10, unit: "Unidad", unitPrice: 25.00, subtotal: 250.00, tax: 30.00, discount: 10.00, total: 270.00 },
      { code: "PROD-003", name: "Teclado Mecánico RGB Gamer", description: "Switch Blue, retroiluminado", quantity: 10, unit: "Unidad", unitPrice: 45.00, subtotal: 450.00, tax: 54.00, discount: 20.00, total: 484.00 },
      { code: "PROD-004", name: "Monitor LG 24 pulgadas Full HD", description: "IPS, HDMI, 75Hz", quantity: 5, unit: "Unidad", unitPrice: 180.00, subtotal: 900.00, tax: 108.00, discount: 10.00, total: 998.00 },
    ],
    payments: [],
    timeline: [
      { date: "2026-02-10 10:30", action: "Orden creada", user: "Juan Pérez", icon: "plus", color: "blue" },
      { date: "2026-02-10 14:20", action: "En revisión", user: "Sistema", icon: "clock", color: "yellow" },
    ]
  },
  {
    id: "OC-2026-002",
    reference: "OC-2026-002",
    supplier: "Kreafast",
    supplierInitials: "KF",
    supplierContact: "ventas@kreafast.com",
    supplierPhone: "+593 98 765 4321",
    supplierAddress: "Centro Comercial El Bosque, Local 45",
    buyer: "María García",
    buyerInitials: "MG",
    orderDate: "2026-02-08",
    deliveryDate: "2026-02-18",
    dueDate: "2026-03-08",
    status: "approved",
    statusLabel: "Aprobada",
    items: 1,
    total: 2240.00,
    subtotal: 2000.00,
    tax: 240.00,
    discount: 0,
    paid: 2240.00,
    pending: 0,
    notes: "",
    products: [
      { code: "PROD-005", name: "Silla Ergonómica Oficina Premium", description: "Respaldo malla, brazos ajustables, base cromada", quantity: 8, unit: "Unidad", unitPrice: 250.00, subtotal: 2000.00, tax: 240.00, discount: 0, total: 2240.00 },
    ],
    payments: [
      { date: "2026-02-09 09:30", amount: 2240.00, method: "Transferencia Bancaria", reference: "TRF-2026-0045", status: "completed" }
    ],
    timeline: [
      { date: "2026-02-08 09:15", action: "Orden creada", user: "María García", icon: "plus", color: "blue" },
      { date: "2026-02-08 11:30", action: "Aprobada", user: "Carlos Admin", icon: "check", color: "green" },
      { date: "2026-02-09 15:45", action: "Pago registrado", user: "Contador", icon: "dollar", color: "green" },
      { date: "2026-02-18 08:00", action: "Entregada", user: "Bodega", icon: "package", color: "green" },
    ]
  },
  {
    id: "OC-2026-003",
    reference: "OC-2026-003",
    supplier: "Proveedor Express Ltda.",
    supplierInitials: "PE",
    supplierContact: "info@provexpress.com",
    supplierPhone: "+593 97 654 3210",
    supplierAddress: "Parque Industrial Norte, Bodega 15",
    buyer: "Carlos Rodríguez",
    buyerInitials: "CR",
    orderDate: "2026-02-05",
    deliveryDate: "2026-02-15",
    dueDate: "2026-03-05",
    status: "delivered",
    statusLabel: "Entregada",
    items: 4,
    total: 840.00,
    subtotal: 750.00,
    tax: 90.00,
    discount: 0,
    paid: 840.00,
    pending: 0,
    notes: "",
    products: [
      { code: "PROD-006", name: "Papel Bond A4 Resma", description: "75gr, paquete x500 hojas", quantity: 20, unit: "Resma", unitPrice: 4.50, subtotal: 90.00, tax: 10.80, discount: 0, total: 100.80 },
      { code: "PROD-007", name: "Tóner HP LaserJet Negro CF280A", description: "Original, rendimiento 2700 páginas", quantity: 5, unit: "Unidad", unitPrice: 85.00, subtotal: 425.00, tax: 51.00, discount: 0, total: 476.00 },
      { code: "PROD-008", name: "Carpetas Archivadoras Tamaño Oficio", description: "Lomo ancho, color azul", quantity: 50, unit: "Unidad", unitPrice: 3.50, subtotal: 175.00, tax: 21.00, discount: 0, total: 196.00 },
      { code: "PROD-009", name: "Bolígrafos Azul Caja x12 unidades", description: "Punta fina 0.5mm", quantity: 10, unit: "Caja", unitPrice: 6.00, subtotal: 60.00, tax: 7.20, discount: 0, total: 67.20 },
    ],
    payments: [
      { date: "2026-02-16 10:15", amount: 840.00, method: "Efectivo", reference: "EFE-001", status: "completed" }
    ],
    timeline: [
      { date: "2026-02-05 14:20", action: "Orden creada", user: "Carlos Rodríguez", icon: "plus", color: "blue" },
      { date: "2026-02-05 16:10", action: "Aprobada", user: "Ana Admin", icon: "check", color: "green" },
      { date: "2026-02-15 10:30", action: "Entregada", user: "Bodeguero", icon: "package", color: "green" },
      { date: "2026-02-16 09:00", action: "Pago completado", user: "Contador", icon: "dollar", color: "green" },
    ]
  },
  {
    id: "OC-2026-004",
    reference: "OC-2026-004",
    supplier: "Comercial Andina",
    supplierInitials: "CA",
    supplierContact: "ventas@comercialandina.com",
    supplierPhone: "+593 96 543 2109",
    supplierAddress: "Av. Amazonas y Naciones Unidas",
    buyer: "Ana Martínez",
    buyerInitials: "AM",
    orderDate: "2026-01-28",
    deliveryDate: "2026-02-07",
    dueDate: "2026-02-28",
    status: "overdue",
    statusLabel: "Vencida",
    items: 4,
    total: 6832.00,
    subtotal: 6100.00,
    tax: 732.00,
    discount: 0,
    paid: 3000.00,
    pending: 3832.00,
    notes: "Requiere seguimiento urgente - Pagos atrasados",
    products: [
      { code: "PROD-010", name: "Escritorio Ejecutivo Madera MDF", description: "1.60m x 0.70m, color nogal, 3 cajones", quantity: 5, unit: "Unidad", unitPrice: 450.00, subtotal: 2250.00, tax: 270.00, discount: 0, total: 2520.00 },
      { code: "PROD-011", name: "Silla Gerencial Cuero Sintético", description: "Respaldo alto, base giratoria 360°", quantity: 5, unit: "Unidad", unitPrice: 380.00, subtotal: 1900.00, tax: 228.00, discount: 0, total: 2128.00 },
      { code: "PROD-012", name: "Archivador Metálico 4 Gavetas", description: "Color gris, con cerradura, rieles telescópicos", quantity: 5, unit: "Unidad", unitPrice: 320.00, subtotal: 1600.00, tax: 192.00, discount: 0, total: 1792.00 },
      { code: "PROD-013", name: "Lámpara LED Escritorio Regulable", description: "Touch, 3 niveles de brillo, USB", quantity: 10, unit: "Unidad", unitPrice: 35.00, subtotal: 350.00, tax: 42.00, discount: 0, total: 392.00 },
    ],
    payments: [
      { date: "2026-02-10 11:45", amount: 3000.00, method: "Transferencia Bancaria", reference: "TRF-2026-0032", status: "completed" },
    ],
    timeline: [
      { date: "2026-01-28 11:00", action: "Orden creada", user: "Ana Martínez", icon: "plus", color: "blue" },
      { date: "2026-01-28 15:30", action: "Aprobada", user: "Carlos Admin", icon: "check", color: "green" },
      { date: "2026-02-07 09:00", action: "Entrega parcial", user: "Bodega", icon: "alert", color: "yellow" },
      { date: "2026-02-10 14:20", action: "Pago parcial $3,000", user: "Contador", icon: "dollar", color: "yellow" },
      { date: "2026-02-28 23:59", action: "Vencida - Saldo pendiente", user: "Sistema", icon: "x", color: "red" },
    ]
  },
  {
    id: "OC-2026-005",
    reference: "OC-2026-005",
    supplier: "Importadora del Pacífico",
    supplierInitials: "IP",
    supplierContact: "info@importpacific.com",
    supplierPhone: "+593 95 432 1098",
    supplierAddress: "Zona Industrial, Calle 10 y Av. 6",
    buyer: "Luis Torres",
    buyerInitials: "LT",
    orderDate: "2026-02-12",
    deliveryDate: "2026-02-22",
    dueDate: "2026-03-12",
    status: "cancelled",
    statusLabel: "Cancelada",
    items: 2,
    total: 985.60,
    subtotal: 880.00,
    tax: 105.60,
    discount: 0,
    paid: 0,
    pending: 0,
    notes: "Cancelada por proveedor - Falta de stock",
    products: [
      { code: "PROD-014", name: "Proyector Epson 3000 Lúmenes", description: "HDMI, VGA, resolución 1080p", quantity: 2, unit: "Unidad", unitPrice: 380.00, subtotal: 760.00, tax: 91.20, discount: 0, total: 851.20 },
      { code: "PROD-015", name: "Pantalla Proyección 100 pulgadas", description: "Trípode, superficie matte white", quantity: 1, unit: "Unidad", unitPrice: 120.00, subtotal: 120.00, tax: 14.40, discount: 0, total: 134.40 },
    ],
    payments: [],
    timeline: [
      { date: "2026-02-12 10:00", action: "Orden creada", user: "Luis Torres", icon: "plus", color: "blue" },
      { date: "2026-02-12 16:30", action: "Aprobada", user: "Ana Admin", icon: "check", color: "green" },
      { date: "2026-02-14 11:00", action: "Cancelada por proveedor", user: "Proveedor", icon: "x", color: "gray" },
    ]
  },
];

export default function ModuleComprasDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterOrder, setFilterOrder] = useState<string>("all");
  const [filterSupplier, setFilterSupplier] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "dnd" | "offline">("online");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [detailTab, setDetailTab] = useState<"products" | "payments" | "timeline">("products");

  const companyName = localStorage.getItem("companyName") || "Mi Empresa";
  const userPlan = "Plan Profesional";
  const userRole = "Comprador"; // Rol del usuario con permisos al módulo de compras
  const userBranch = "Sucursal Matriz - Quito"; // Sucursal a la que pertenece el usuario

  const tabs = [
    { id: "orders", name: "Órdenes de Compra", icon: ShoppingCart },
    { id: "reception", name: "Recepción de Mercadería", icon: Package },
    { id: "suppliers", name: "Proveedores", icon: User },
    { id: "invoices", name: "Facturas a Proveedores", icon: FileText },
    { id: "retentions", name: "Retenciones a Proveedores", icon: Receipt },
    { id: "payments", name: "Pagos a Proveedores", icon: DollarSign },
  ];

  const [userProfile] = useState({
    name: "Juan Pérez",
    email: "juan.perez@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador de Empresa",
    avatar: "",
  });

  const handleSaveProfile = (profile: any) => {
    console.log("Perfil actualizado:", profile);
  };

  const getStatusInfo = () => {
    switch (userStatus) {
      case "online":
        return { color: "bg-green-500", label: "En línea" };
      case "away":
        return { color: "bg-yellow-500", label: "Ausente" };
      case "dnd":
        return { color: "bg-red-500", label: "No molestar" };
      case "offline":
        return { color: "bg-gray-400", label: "Desconectado" };
      default:
        return { color: "bg-green-500", label: "En línea" };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "approved":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "overdue":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "cancelled":
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
      default:
        return "bg-white/5 text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Calcular estadísticas
  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === "pending").length,
    approved: mockOrders.filter(o => o.status === "approved").length,
    delivered: mockOrders.filter(o => o.status === "delivered").length,
    overdue: mockOrders.filter(o => o.status === "overdue").length,
    cancelled: mockOrders.filter(o => o.status === "cancelled").length,
    totalAmount: mockOrders.reduce((acc, o) => acc + o.total, 0),
    totalPaid: mockOrders.reduce((acc, o) => acc + o.paid, 0),
    totalPending: mockOrders.reduce((acc, o) => acc + o.pending, 0),
  };

  // Filtrado múltiple de órdenes
  const filteredOrders = mockOrders.filter(order => {
    // Filtro por búsqueda (texto en cualquier campo)
    const matchesSearch = searchQuery === "" || 
      order.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtro por estado
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    // Filtro por orden (referencia)
    const matchesOrder = filterOrder === "all" || order.reference === filterOrder;
    
    // Filtro por proveedor
    const matchesSupplier = filterSupplier === "all" || order.supplier === filterSupplier;
    
    // Filtro por fecha (podría ser por mes o rango)
    const matchesDate = filterDate === "all" || order.orderDate.startsWith(filterDate);
    
    return matchesSearch && matchesStatus && matchesOrder && matchesSupplier && matchesDate;
  });

  // Obtener listas únicas para los filtros
  const uniqueOrders = Array.from(new Set(mockOrders.map(o => o.reference)));
  const uniqueSuppliers = Array.from(new Set(mockOrders.map(o => o.supplier)));
  const uniqueDates = Array.from(new Set(mockOrders.map(o => o.orderDate.substring(0, 7)))); // YYYY-MM

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]">
      {/* Header */}
      <header className="border-b border-white/10 bg-secondary/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Botón volver */}
            <button
              onClick={() => navigate("/modules")}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">{companyName}</h1>
                <p className="text-gray-400 text-xs">Compras</p>
              </div>
            </div>
          </div>

          {/* Derecha */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JP</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-secondary rounded-full"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">{userProfile.name}</p>
                  <p className="text-gray-400 text-xs">{userRole} • {userBranch}</p>
                </div>
              </button>

              {/* Menú desplegable del usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {profilePhoto ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img 
                              src={profilePhoto} 
                              alt="Avatar" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">JP</span>
                          </div>
                        )}
                        <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusInfo().color} border-2 border-[#1a1f2e] rounded-full`}></span>
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{userProfile.name}</p>
                        <p className="text-gray-400 text-xs">{userProfile.email}</p>
                        <p className="text-primary text-xs mt-1">{userRole} • {userBranch}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowPreferencesModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Mis preferencias</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowSubscriptionModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">Mi suscripción</span>
                    </button>

                    <div className="border-t border-white/10 my-2"></div>

                    <button
                      onClick={() => navigate("/")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs horizontales */}
        <div className="px-6 border-t border-white/10">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-primary text-white bg-primary/5"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-6">
        {activeTab === "orders" && (
          <PurchaseOrdersContent />
        )}

        {activeTab === "reception" && (
          <MerchandiseReceptionContent />
        )}

        {activeTab === "suppliers" && (
          <SuppliersContent />
        )}

        {activeTab === "invoices" && (
          <SupplierInvoicesContent />
        )}

        {activeTab === "retentions" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
                <Receipt className="w-8 h-8 text-primary" />
                Retenciones a Proveedores
              </h2>
              <p className="text-gray-400 text-sm">
                Administración de retenciones fiscales a proveedores
              </p>
            </div>
            <div className="border-t border-white/10"></div>
            <RetentionsContent />
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-primary" />
                Pagos a Proveedores
              </h2>
              <p className="text-gray-400 text-sm">
                Control de pagos y cuentas por pagar a proveedores
              </p>
            </div>
            <div className="border-t border-white/10"></div>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">Módulo en desarrollo</p>
            </div>
          </div>
        )}

        {activeTab === "config" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-2xl mb-2 flex items-center gap-3">
                <Settings className="w-7 h-7 text-primary" />
                Configuración de Compras
              </h2>
              <p className="text-gray-400 text-sm">
                Ajusta las preferencias del módulo de compras
              </p>
            </div>

            <div className="border-t border-white/10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Configuración de Órdenes
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Numeración automática</label>
                    <input
                      type="text"
                      defaultValue="OC-{YYYY}-{###}"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Aprobación requerida</label>
                    <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50">
                      <option>Siempre</option>
                      <option>Solo montos mayores a $1000</option>
                      <option>Nunca</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notificaciones
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5" defaultChecked />
                    <span className="text-white group-hover:text-primary transition-colors">Nuevas órdenes</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5" defaultChecked />
                    <span className="text-white group-hover:text-primary transition-colors">Órdenes vencidas</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5" />
                    <span className="text-white group-hover:text-primary transition-colors">Aprobaciones pendientes</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modales */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={handleSaveProfile}
      />

      <PreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
      />

      {/* Modal de suscripción */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-secondary border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Mi Suscripción</h3>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Plan actual</p>
                <p className="text-white font-bold text-lg">{userPlan}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Estado</p>
                <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  Activo
                </span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Próxima renovación</p>
                <p className="text-white font-semibold">16 de Marzo, 2026</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nueva orden */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-secondary border border-white/10 rounded-2xl p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <Plus className="w-6 h-6 text-primary" />
                Nueva Orden de Compra
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Proveedor *</label>
                  <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50">
                    <option>Seleccionar proveedor...</option>
                    <option>Distribuidora Nacional S.A.</option>
                    <option>Kreafast</option>
                    <option>Proveedor Express Ltda.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Comprador *</label>
                  <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50">
                    <option>Seleccionar comprador...</option>
                    <option>Juan Pérez</option>
                    <option>María García</option>
                    <option>Carlos Rodríguez</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Fecha de Orden *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Fecha de Entrega *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Notas</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50 resize-none"
                  placeholder="Agregar notas adicionales..."
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                >
                  Cancelar
                </button>
                <button className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium shadow-lg shadow-primary/20">
                  Crear Orden
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle de orden MEJORADO */}
      {showOrderDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-6xl bg-secondary border border-white/10 rounded-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-secondary pb-4 border-b border-white/10">
              <div>
                <h3 className="text-white font-bold text-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  Orden de Compra: {selectedOrder.reference}
                </h3>
                <p className="text-gray-400 text-sm mt-1 ml-13">Creada el {selectedOrder.orderDate}</p>
              </div>
              <button
                onClick={() => setShowOrderDetailModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Estado y acciones */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.statusLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10">
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                </div>
              </div>

              {/* Información general en 2 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del Proveedor */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    Información del Proveedor
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Proveedor</p>
                      <p className="text-white font-medium text-lg">{selectedOrder.supplier}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </p>
                      <p className="text-white">{selectedOrder.supplierContact}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Teléfono
                      </p>
                      <p className="text-white">{selectedOrder.supplierPhone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Dirección
                      </p>
                      <p className="text-white text-sm">{selectedOrder.supplierAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Información de Compra */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-400" />
                    </div>
                    Información de la Compra
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Comprador Asignado</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center">
                          <span className="text-blue-400 text-xs font-bold">{selectedOrder.buyerInitials}</span>
                        </div>
                        <p className="text-white font-medium">{selectedOrder.buyer}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Fecha de Orden</p>
                        <p className="text-white datetime-display">{selectedOrder.orderDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Fecha de Entrega</p>
                        <p className={selectedOrder.status === 'overdue' ? 'text-red-400 datetime-display' : 'text-white datetime-display'}>
                          {selectedOrder.deliveryDate}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Fecha de Vencimiento</p>
                      <p className="text-white datetime-display">{selectedOrder.dueDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs para Productos, Pagos, Timeline */}
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {/* Tabs Header */}
                <div className="flex items-center gap-1 bg-white/5 border-b border-white/10 p-1">
                  <button
                    onClick={() => setDetailTab("products")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      detailTab === "products"
                        ? "bg-primary text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    Productos ({selectedOrder.products?.length || 0})
                  </button>
                  <button
                    onClick={() => setDetailTab("payments")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      detailTab === "payments"
                        ? "bg-primary text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <CardIcon className="w-4 h-4" />
                    Pagos ({selectedOrder.payments?.length || 0})
                  </button>
                  <button
                    onClick={() => setDetailTab("timeline")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      detailTab === "timeline"
                        ? "bg-primary text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Historial
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-5">
                  {/* Pestaña de Productos */}
                  {detailTab === "products" && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Código</th>
                              <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Producto</th>
                              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Cantidad</th>
                              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Precio Unit.</th>
                              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Subtotal</th>
                              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">IVA</th>
                              <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {selectedOrder.products?.map((product: any, index: number) => (
                              <tr key={index} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-2.5">
                                  <span className="text-primary font-mono text-sm">{product.code}</span>
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className="text-white font-medium text-sm">{product.name}</span>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className="text-white text-sm">{product.quantity} {product.unit}</span>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className="text-white text-sm">${product.unitPrice.toFixed(2)}</span>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className="text-white font-medium text-sm">${product.subtotal.toFixed(2)}</span>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className="text-gray-400 text-sm">${product.tax.toFixed(2)}</span>
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <span className="text-white font-bold text-sm">${product.total.toFixed(2)}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Resumen de totales */}
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 mt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Subtotal</p>
                            <p className="text-white text-xl font-bold">${selectedOrder.subtotal.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">IVA (12%)</p>
                            <p className="text-white text-xl font-bold">${selectedOrder.tax.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Descuento</p>
                            <p className="text-green-400 text-xl font-bold">-${selectedOrder.discount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Total</p>
                            <p className="text-primary text-2xl font-bold">${selectedOrder.total.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pestaña de Pagos */}
                  {detailTab === "payments" && (
                    <div className="space-y-4">
                      {selectedOrder.payments && selectedOrder.payments.length > 0 ? (
                        <>
                          {selectedOrder.payments.map((payment: any, index: number) => (
                            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  payment.status === 'completed' ? 'bg-green-500/20' : 
                                  payment.status === 'pending' ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                                }`}>
                                  {payment.status === 'completed' ? (
                                    <CheckCircle className="w-6 h-6 text-green-400" />
                                  ) : payment.status === 'pending' ? (
                                    <Clock className="w-6 h-6 text-yellow-400" />
                                  ) : (
                                    <XCircle className="w-6 h-6 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{payment.method}</p>
                                  <p className="text-gray-400 text-sm">Ref: {payment.reference}</p>
                                  {payment.date !== '-' && (
                                    <p className="text-gray-400 text-xs mt-1">{payment.date}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`text-2xl font-bold ${
                                  payment.status === 'completed' ? 'text-green-400' : 
                                  payment.status === 'pending' ? 'text-yellow-400' : 'text-gray-400'
                                }`}>
                                  ${payment.amount.toFixed(2)}
                                </p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                                  payment.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                                  payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                                  'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {payment.status === 'completed' ? 'Pagado' : 
                                   payment.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Receipt className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-400">No hay pagos registrados</p>
                        </div>
                      )}

                      {/* Resumen de pagos */}
                      <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-xl p-5 mt-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Total Orden</p>
                            <p className="text-white text-xl font-bold">${selectedOrder.total.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Pagado</p>
                            <p className="text-green-400 text-xl font-bold">${selectedOrder.paid.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs mb-1">Pendiente</p>
                            <p className="text-yellow-400 text-xl font-bold">${selectedOrder.pending.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pestaña de Timeline */}
                  {detailTab === "timeline" && (
                    <div className="space-y-1">
                      {selectedOrder.timeline && selectedOrder.timeline.length > 0 ? (
                        selectedOrder.timeline.map((event: any, index: number) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                event.color === 'blue' ? 'bg-blue-500/20 border-2 border-blue-500' :
                                event.color === 'green' ? 'bg-green-500/20 border-2 border-green-500' :
                                event.color === 'yellow' ? 'bg-yellow-500/20 border-2 border-yellow-500' :
                                event.color === 'red' ? 'bg-red-500/20 border-2 border-red-500' :
                                'bg-gray-500/20 border-2 border-gray-500'
                              }`}>
                                {event.icon === 'plus' ? <Plus className="w-4 h-4 text-blue-400" /> :
                                 event.icon === 'check' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                                 event.icon === 'clock' ? <Clock className="w-4 h-4 text-yellow-400" /> :
                                 event.icon === 'dollar' ? <DollarSign className="w-4 h-4 text-green-400" /> :
                                 event.icon === 'package' ? <Package className="w-4 h-4 text-green-400" /> :
                                 event.icon === 'alert' ? <AlertTriangle className="w-4 h-4 text-yellow-400" /> :
                                 event.icon === 'x' ? <XCircle className="w-4 h-4 text-red-400" /> :
                                 <Clock className="w-4 h-4 text-gray-400" />}
                              </div>
                              {index < selectedOrder.timeline.length - 1 && (
                                <div className="w-0.5 h-16 bg-white/10"></div>
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="text-white font-medium">{event.action}</p>
                                  <span className="text-gray-400 text-xs datetime-display">{event.date}</span>
                                </div>
                                <p className="text-gray-400 text-sm">{event.description}</p>
                                <p className="text-gray-500 text-xs mt-2">Por: {event.user}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-gray-400">No hay historial disponible</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Notas importantes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">
                  <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Notas Importantes
                  </h4>
                  <p className="text-gray-300">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}