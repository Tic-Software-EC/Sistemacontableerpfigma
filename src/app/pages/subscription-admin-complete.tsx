import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Users,
  Plus,
  Search,
  Settings as SettingsIcon,
  LogOut,
  CreditCard,
  Check,
  AlertCircle,
  Package,
  Eye,
  Edit,
  Trash2,
  X,
  Mail,
  Phone,
  Calendar,
  Save,
  Image as ImageIcon,
  Palette,
  Upload,
  Copy,
  CheckCircle2,
  Key,
  Lock,
  RefreshCw,
  Bell,
  Menu as MenuIcon,
} from "lucide-react";
import { Pagination } from "../components/pagination";
import { PLAN_CONFIGS } from "../config/plans";
import { ProfileModal } from "../components/profile-modal";

interface Company {
  id: string;
  name: string;
  ruc: string;
  email: string;
  phone: string;
  plan: "free" | "standard" | "custom";
  status: "active" | "trial" | "suspended" | "expired";
  users: number;
  maxUsers: number;
  maxBranches: number;
  maxCashRegisters: number;
  admin: string;
  adminEmail: string;
  createdAt: string;
  expiresAt: string;
  monthlyPrice: number;
  nextPayment: string;
  autoRenewal: boolean;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface CredentialsData {
  email: string;
  password: string;
  companyName: string;
  adminName: string;
}

export default function SubscriptionAdminPage() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"all" | "free" | "standard" | "custom">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "trial" | "suspended" | "expired">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Estado para perfil de usuario
  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador de Sistema",
    avatar: "",
  });

  // Paleta de colores predefinidos
  const predefinedColors = [
    "#4A90E2", "#10B981", "#F97316", "#A855F7", "#EC4899", "#06B6D4",
    "#EF4444", "#F59E0B", "#6366F1", "#14B8A6", "#84CC16", "#8B5CF6",
  ];

  // Estados para modales
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<CredentialsData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [logoError, setLogoError] = useState<string>("");

  // Función para generar contraseña segura
  const generateSecurePassword = (): string => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let password = "";
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%&*"[Math.floor(Math.random() * 7)];
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Función para copiar al portapapeles
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Función para manejar la subida del logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setLogoError("Formato no válido. Solo JPG, PNG, GIF o SVG");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setLogoError("El archivo es muy grande. Tamaño máximo: 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result as string });
      setLogoError("");
    };
    reader.readAsDataURL(file);
  };

  // Estados para formulario
  const [formData, setFormData] = useState({
    name: "",
    ruc: "",
    email: "",
    phone: "",
    plan: "standard" as "free" | "standard" | "custom",
    status: "active" as "active" | "trial" | "suspended" | "expired",
    maxUsers: PLAN_CONFIGS.standard.maxUsers,
    maxBranches: PLAN_CONFIGS.standard.maxBranches,
    maxCashRegisters: PLAN_CONFIGS.standard.maxCashRegisters,
    admin: "",
    adminEmail: "",
    adminPassword: "",
    expiresAt: "",
    monthlyPrice: PLAN_CONFIGS.standard.price,
    nextPayment: "",
    autoRenewal: true,
    logo: "",
    primaryColor: "#E8692E",
    secondaryColor: "#0D1B2A",
  });

  // Función para manejar cambio de plan
  const handlePlanChange = (newPlan: "free" | "standard" | "custom") => {
    const planConfig = PLAN_CONFIGS[newPlan];
    setFormData({
      ...formData,
      plan: newPlan,
      maxUsers: planConfig.maxUsers,
      maxBranches: planConfig.maxBranches,
      maxCashRegisters: planConfig.maxCashRegisters,
      monthlyPrice: planConfig.price,
    });
  };

  // Datos de ejemplo de empresas
  const [companies] = useState<Company[]>([
    {
      id: "1",
      name: "TechCorp S.A.",
      ruc: "1792345678001",
      email: "contacto@techcorp.com",
      phone: "+593 99 123 4567",
      plan: "standard",
      status: "active",
      users: 5,
      maxUsers: 10,
      maxBranches: 5,
      maxCashRegisters: 3,
      admin: "Juan Pérez",
      adminEmail: "juan.perez@techcorp.com",
      createdAt: "2024-01-15",
      expiresAt: "2025-01-15",
      monthlyPrice: 99.00,
      nextPayment: "2024-03-15",
      autoRenewal: true,
    },
    {
      id: "2",
      name: "Innovatech Solutions",
      ruc: "1792876543001",
      email: "info@innovatech.com",
      phone: "+593 98 765 4321",
      plan: "custom",
      status: "active",
      users: 15,
      maxUsers: 50,
      maxBranches: 20,
      maxCashRegisters: 15,
      admin: "María González",
      adminEmail: "maria@innovatech.com",
      createdAt: "2023-11-20",
      expiresAt: "2025-11-20",
      monthlyPrice: 299.00,
      nextPayment: "2024-03-20",
      autoRenewal: true,
    },
    {
      id: "3",
      name: "StartupXYZ",
      ruc: "1792111222001",
      email: "admin@startupxyz.com",
      phone: "+593 99 888 7777",
      plan: "free",
      status: "trial",
      users: 1,
      maxUsers: 1,
      maxBranches: 1,
      maxCashRegisters: 1,
      admin: "Carlos Rodríguez",
      adminEmail: "carlos@startupxyz.com",
      createdAt: "2024-02-10",
      expiresAt: "2024-03-10",
      monthlyPrice: 0,
      nextPayment: "2024-03-10",
      autoRenewal: false,
    },
    {
      id: "4",
      name: "Comercial López & Asociados",
      ruc: "1792444555001",
      email: "info@lopezasoc.com",
      phone: "+593 99 456 7890",
      plan: "standard",
      status: "active",
      users: 7,
      maxUsers: 10,
      maxBranches: 8,
      maxCashRegisters: 5,
      admin: "Pedro López",
      adminEmail: "pedro@lopezasoc.com",
      createdAt: "2023-09-05",
      expiresAt: "2025-09-05",
      monthlyPrice: 99.00,
      nextPayment: "2024-03-05",
      autoRenewal: true,
    },
    {
      id: "5",
      name: "Distribuidora Nacional",
      ruc: "1792666777001",
      email: "ventas@distnac.com",
      phone: "+593 98 234 5678",
      plan: "custom",
      status: "active",
      users: 25,
      maxUsers: 50,
      maxBranches: 30,
      maxCashRegisters: 25,
      admin: "Ana Martínez",
      adminEmail: "ana.martinez@distnac.com",
      createdAt: "2023-06-12",
      expiresAt: "2025-06-12",
      monthlyPrice: 299.00,
      nextPayment: "2024-03-12",
      autoRenewal: true,
    },
  ]);

  // Filtrado de empresas
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.ruc.includes(searchTerm) ||
      company.admin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "all" || company.plan === selectedPlan;
    const matchesStatus = selectedStatus === "all" || company.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleOpenNewModal = () => {
    setFormData({
      name: "",
      ruc: "",
      email: "",
      phone: "",
      plan: "standard",
      status: "active",
      maxUsers: PLAN_CONFIGS.standard.maxUsers,
      maxBranches: PLAN_CONFIGS.standard.maxBranches,
      maxCashRegisters: PLAN_CONFIGS.standard.maxCashRegisters,
      admin: "",
      adminEmail: "",
      adminPassword: "",
      expiresAt: "",
      monthlyPrice: PLAN_CONFIGS.standard.price,
      nextPayment: "",
      autoRenewal: true,
      logo: "",
      primaryColor: "#E8692E",
      secondaryColor: "#0D1B2A",
    });
    setShowNewModal(true);
  };

  const handleSaveCompany = () => {
    const credentials: CredentialsData = {
      email: formData.adminEmail,
      password: formData.adminPassword || generateSecurePassword(),
      companyName: formData.name,
      adminName: formData.admin,
    };
    setGeneratedCredentials(credentials);
    setShowNewModal(false);
    setShowCredentialsModal(true);
  };

  const handleCloseCredentialsModal = () => {
    setShowCredentialsModal(false);
    setGeneratedCredentials(null);
  };

  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setShowViewModal(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      ruc: company.ruc,
      email: company.email,
      phone: company.phone,
      plan: company.plan,
      status: company.status,
      maxUsers: company.maxUsers,
      maxBranches: company.maxBranches,
      maxCashRegisters: company.maxCashRegisters,
      admin: company.admin,
      adminEmail: company.adminEmail,
      adminPassword: "",
      expiresAt: company.expiresAt,
      monthlyPrice: company.monthlyPrice,
      nextPayment: company.nextPayment,
      autoRenewal: company.autoRenewal,
      logo: company.logo || "",
      primaryColor: company.primaryColor || "#E8692E",
      secondaryColor: company.secondaryColor || "#0D1B2A",
    });
    setShowEditModal(true);
  };

  const handleUpdateCompany = () => {
    console.log("Actualizando empresa:", selectedCompany?.id);
    setShowEditModal(false);
  };

  const handleDeleteCompany = (company: Company) => {
    if (confirm(`¿Estás seguro de eliminar la empresa "${company.name}"?`)) {
      console.log("Eliminando empresa:", company.id);
    }
  };

  const getPlanBadge = (plan: string) => {
    const planStyles = {
      free: "bg-gray-700 text-gray-300 border border-gray-600",
      standard: "bg-[#3d2817] text-[#E8692E] border border-[#E8692E]/40",
      custom: "bg-[#0d3d4a] text-cyan-400 border border-cyan-500/40",
    };
    const planNames = {
      free: "Free",
      standard: "Standard",
      custom: "Custom",
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${planStyles[plan as keyof typeof planStyles]}`}>
        {planNames[plan as keyof typeof planNames]}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: "bg-[#0d3d2a] text-green-400 border border-green-500/40",
      trial: "bg-[#3d3417] text-yellow-400 border border-yellow-500/40",
      suspended: "bg-[#3d1a1f] text-red-400 border border-red-500/40",
      expired: "bg-gray-700 text-gray-400 border border-gray-600",
    };
    const statusNames = {
      active: "Activo",
      trial: "Prueba",
      suspended: "Suspendido",
      expired: "Expirado",
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {statusNames[status as keyof typeof statusNames]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]">
      {/* Header */}
      <header className="border-b border-white/10 bg-secondary/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">TicSoftEc</h1>
                <p className="text-gray-400 text-xs">Administración</p>
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
                    <span className="text-white font-bold text-sm">SA</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-secondary rounded-full"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">{userProfile.name}</p>
                  <p className="text-gray-400 text-xs">{userProfile.role}</p>
                </div>
              </button>

              {/* Menú de usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1a2332] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm">{userProfile.name}</p>
                    <p className="text-gray-400 text-xs">{userProfile.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      <span className="text-sm">Mi Perfil</span>
                    </button>
                    <div className="border-t border-white/10 my-2"></div>
                    <button
                      onClick={() => navigate("/")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-left"
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

        {/* Tabs de navegación según la imagen */}
        <div className="px-6 border-t border-white/10">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => navigate("/admin/companies")}
              className="flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 border-primary text-white bg-primary/5 transition-all"
            >
              <Building2 className="w-4 h-4" />
              Gestión de Empresas
            </button>
            <button
              onClick={() => navigate("/admin/plan-configuration")}
              className="flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 border-transparent text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <SettingsIcon className="w-4 h-4" />
              Configuración de Planes
            </button>
            <button
              onClick={() => navigate("/admin/module-configuration")}
              className="flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 border-transparent text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Package className="w-4 h-4" />
              Configuración de Módulos
            </button>
            <button
              onClick={() => navigate("/admin/menu-management")}
              className="flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 border-transparent text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <MenuIcon className="w-4 h-4" />
              Gestión de Menús
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Título */}
        <div className="mb-6">

          <p className="text-gray-400 text-sm pl-11">
            Administra las empresas suscritas y sus configuraciones
          </p>
        </div>

        {/* 1. Estadísticas primero */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-secondary border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Total Empresas</p>
                <p className="text-white text-2xl font-bold">{companies.length}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-secondary border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Activas</p>
                <p className="text-white text-2xl font-bold">{companies.filter(c => c.status === 'active').length}</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Check className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-secondary border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Prueba</p>
                <p className="text-white text-2xl font-bold">{companies.filter(c => c.status === 'trial').length}</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-secondary border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Ingresos/Mes</p>
                <p className="text-white text-2xl font-bold">
                  ${companies.reduce((sum, c) => sum + c.monthlyPrice, 0).toFixed(0)}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Línea separatoria */}
        <div className="border-t border-white/10 mb-4"></div>

        {/* 3. Botón de acción alineado a la derecha */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleOpenNewModal}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Nueva Empresa
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-secondary border border-white/10 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, RUC o administrador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            {/* Filtro por plan */}
            <div>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
              >
                <option value="all">Todos los planes</option>
                <option value="free">Gratuito</option>
                <option value="standard">Estándar</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activa</option>
                <option value="trial">Prueba</option>
                <option value="suspended">Suspendida</option>
                <option value="expired">Expirada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de empresas */}
        <div className="bg-secondary border border-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#151f2e]">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Empresa</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">RUC</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Plan</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Usuarios</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Administrador</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Precio/Mes</th>
                  <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-white text-sm font-medium">{company.name}</p>
                      <p className="text-gray-400 text-xs">{company.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-300 text-sm font-mono">{company.ruc}</span>
                    </td>
                    <td className="px-4 py-3">{getPlanBadge(company.plan)}</td>
                    <td className="px-4 py-3">{getStatusBadge(company.status)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-white text-sm font-medium">{company.users}</span>
                      <span className="text-gray-500 text-xs">/{company.maxUsers}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm">{company.admin}</p>
                      <p className="text-gray-400 text-xs">{company.adminEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-white text-sm font-semibold">${company.monthlyPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleViewCompany(company)}
                          className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="p-1.5 text-yellow-400 hover:bg-yellow-500/10 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {filteredCompanies.length > itemsPerPage && (
            <div className="px-4 py-3 border-t border-white/10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12 bg-secondary border border-white/10 rounded-lg">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No se encontraron empresas</p>
          </div>
        )}
      </div>

      {/* Modal de perfil */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={(updatedProfile) => {
          setUserProfile(updatedProfile);
          setShowProfileModal(false);
        }}
      />

      {/* Modal Ver Empresa */}
      {showViewModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-secondary border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-white font-bold text-lg">Detalles de la Empresa</h3>
              <button onClick={() => setShowViewModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Nombre de la Empresa</p>
                  <p className="text-white font-medium">{selectedCompany.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">RUC</p>
                  <p className="text-white font-medium">{selectedCompany.ruc}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Email</p>
                  <p className="text-white font-medium">{selectedCompany.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Teléfono</p>
                  <p className="text-white font-medium">{selectedCompany.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Plan</p>
                  {getPlanBadge(selectedCompany.plan)}
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Estado</p>
                  {getStatusBadge(selectedCompany.status)}
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Administrador</p>
                  <p className="text-white font-medium">{selectedCompany.admin}</p>
                  <p className="text-gray-500 text-xs">{selectedCompany.adminEmail}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Usuarios</p>
                  <p className="text-white font-medium">{selectedCompany.users} / {selectedCompany.maxUsers}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Fecha de Creación</p>
                  <p className="text-white font-medium">{new Date(selectedCompany.createdAt).toLocaleDateString('es-EC')}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Vence</p>
                  <p className="text-white font-medium">{new Date(selectedCompany.expiresAt).toLocaleDateString('es-EC')}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Precio Mensual</p>
                  <p className="text-white font-medium text-lg">${selectedCompany.monthlyPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Auto-renovación</p>
                  <p className="text-white font-medium">{selectedCompany.autoRenewal ? "Activa" : "Inactiva"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#1a2332]">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva/Editar Empresa */}
      {(showNewModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-secondary border border-white/10 rounded-2xl shadow-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-white font-bold text-lg">
                {showNewModal ? "Nueva Empresa" : "Editar Empresa"}
              </h3>
              <button
                onClick={() => {
                  setShowNewModal(false);
                  setShowEditModal(false);
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    Nombre de la Empresa <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                    placeholder="Ej: TechCorp S.A."
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    RUC <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.ruc}
                    onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                    placeholder="1792345678001"
                    maxLength={13}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                    placeholder="contacto@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    Teléfono <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                    placeholder="+593 99 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    Plan <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => handlePlanChange(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                  >
                    <option value="free">Gratuito - $0/mes</option>
                    <option value="standard">Estándar - ${PLAN_CONFIGS.standard.price}/mes</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    Estado <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                  >
                    <option value="active">Activa</option>
                    <option value="trial">Prueba</option>
                    <option value="suspended">Suspendida</option>
                    <option value="expired">Expirada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    Nombre del Administrador <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.admin}
                    onChange={(e) => setFormData({ ...formData, admin: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    Email del Administrador <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                    placeholder="admin@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    Fecha de Vencimiento <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs mb-1.5">
                    Precio Mensual (USD) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.monthlyPrice}
                    onChange={(e) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                    placeholder="99.00"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRenewal"
                  checked={formData.autoRenewal}
                  onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.checked })}
                  className="w-4 h-4 bg-[#1a2332] border-white/10 rounded"
                />
                <label htmlFor="autoRenewal" className="text-white text-sm">
                  Activar renovación automática
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#1a2332]">
              <button
                onClick={() => {
                  setShowNewModal(false);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={showNewModal ? handleSaveCompany : handleUpdateCompany}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {showNewModal ? "Crear Empresa" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Credenciales */}
      {showCredentialsModal && generatedCredentials && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-secondary border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">¡Empresa Creada Exitosamente!</h3>
                  <p className="text-gray-400 text-xs">Credenciales de acceso generadas</p>
                </div>
              </div>
              <button
                onClick={handleCloseCredentialsModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-400 text-sm font-medium">Importante: Guarda estas credenciales</p>
                    <p className="text-yellow-400/80 text-xs mt-1">
                      Esta es la única vez que verás la contraseña generada. Asegúrate de copiarla y entregarla al administrador de la empresa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-[#1a2332] border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-xs flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Empresa
                    </label>
                  </div>
                  <p className="text-white font-medium">{generatedCredentials.companyName}</p>
                </div>

                <div className="p-4 bg-[#1a2332] border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-xs flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Administrador
                    </label>
                  </div>
                  <p className="text-white font-medium">{generatedCredentials.adminName}</p>
                </div>

                <div className="p-4 bg-[#1a2332] border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-xs flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Usuario / Email
                    </label>
                    <button
                      onClick={() => copyToClipboard(generatedCredentials.email, "email")}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                      title="Copiar"
                    >
                      {copiedField === "email" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-white font-mono text-sm">{generatedCredentials.email}</p>
                </div>

                <div className="p-4 bg-[#1a2332] border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-gray-400 text-xs flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Contraseña
                    </label>
                    <button
                      onClick={() => copyToClipboard(generatedCredentials.password, "password")}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                      title="Copiar"
                    >
                      {copiedField === "password" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-white font-mono text-sm">{generatedCredentials.password}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-xs">
                  💡 <strong>Nota:</strong> El administrador podrá cambiar su contraseña una vez inicie sesión por primera vez.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#1a2332]">
              <button
                onClick={handleCloseCredentialsModal}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 text-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}