import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Edit,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Mail,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Copy,
  Key,
  Users,
  X,
} from "lucide-react";
import { AdminHeader } from "../components/admin-header";
import { CompanyModal } from "../components/company-modal";
import { CompanyViewModal } from "../components/company-view-modal";
import { PlanEditModal } from "../components/plan-edit-modal";
import { PlansManagerModal } from "../components/plans-manager-modal";
import { Pagination } from "../components/pagination";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { PLAN_CONFIGS } from "../config/plans";

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
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<"all" | "free" | "standard" | "custom">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "trial" | "suspended" | "expired">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador de Sistema",
    avatar: "",
  });

  const predefinedColors = [
    "#4A90E2", "#10B981", "#F97316", "#A855F7", "#EC4899", "#06B6D4",
    "#EF4444", "#F59E0B", "#6366F1", "#14B8A6", "#84CC16", "#8B5CF6",
  ];

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlanToEdit, setSelectedPlanToEdit] = useState<any>(null);
  const [generatedCredentials, setGeneratedCredentials] = useState<CredentialsData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [logoError, setLogoError] = useState<string>("");

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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

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
    adminUsername: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    companyDomain: "",
    expiresAt: "",
    monthlyPrice: PLAN_CONFIGS.standard.price,
    nextPayment: "",
    autoRenewal: true,
    logo: "",
    primaryColor: "#E8692E",
    secondaryColor: "#0D1B2A",
    subscriptionMonths: 1,
  });

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

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.ruc.includes(searchTerm) ||
      company.admin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "all" || company.plan === filterPlan;
    const matchesStatus = selectedStatus === "all" || company.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

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
      adminUsername: "",
      adminEmail: "",
      adminPhone: "",
      adminPassword: "",
      companyDomain: "",
      expiresAt: "",
      monthlyPrice: PLAN_CONFIGS.standard.price,
      nextPayment: "",
      autoRenewal: true,
      logo: "",
      primaryColor: "#E8692E",
      secondaryColor: "#0D1B2A",
      subscriptionMonths: 1,
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
    
    // Calcular los meses de suscripción basado en las fechas
    const createdDate = new Date(company.createdAt);
    const expiresDate = new Date(company.expiresAt);
    const monthsDiff = Math.round((expiresDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
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
      adminUsername: (company as any).adminUsername || "",
      adminEmail: company.adminEmail,
      adminPhone: (company as any).adminPhone || "",
      adminPassword: "",
      companyDomain: (company as any).companyDomain || "",
      expiresAt: company.expiresAt,
      monthlyPrice: company.monthlyPrice,
      nextPayment: company.nextPayment,
      autoRenewal: company.autoRenewal,
      logo: company.logo || "",
      primaryColor: company.primaryColor || "#E8692E",
      secondaryColor: company.secondaryColor || "#0D1B2A",
      subscriptionMonths: monthsDiff > 0 ? monthsDiff : 1,
    });
    setShowEditModal(true);
  };

  const handleUpdateCompany = () => {
    console.log("Actualizando empresa:", selectedCompany?.id);
    console.log("Datos actualizados:", formData);
    // Aquí iría la lógica para actualizar en el backend/localStorage
    toast.success(`Empresa "${formData.name}" actualizada exitosamente`);
    setShowEditModal(false);
    setSelectedCompany(null);
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

  const stats = {
    totalCompanies: companies.length,
    activeCompanies: companies.filter(c => c.status === 'active').length,
    trialCompanies: companies.filter(c => c.status === 'trial').length,
    totalRevenue: companies.reduce((sum, c) => sum + c.monthlyPrice, 0),
  };

  return (
    <div className={`min-h-screen ${
      theme === "light"
        ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"
    }`}>
      {/* Header */}
      <AdminHeader userProfile={userProfile} onProfileUpdate={setUserProfile} />

      {/* Main Content */}
      <div className="p-6">
        {/* Métricas compactas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`border rounded-lg p-4 ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Total Empresas</p>
                <p className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{stats.totalCompanies}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-4 ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Activas</p>
                <p className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{stats.activeCompanies}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-4 ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Prueba</p>
                <p className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{stats.trialCompanies}</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-4 ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Ingresos/Mes</p>
                <p className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>${stats.totalRevenue.toFixed(0)}</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className={`border-t mb-6 ${theme === "light" ? "border-gray-200" : "border-white/10"}`}></div>

        {/* Botón Nueva Empresa */}
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
        <div className="flex items-center gap-3 mb-6">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar empresa, RUC, administrador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                theme === "light"
                  ? "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  : "bg-secondary border-white/10 text-white placeholder-gray-500"
              }`}
            />
          </div>

          {/* Filtro Plan */}
          <div className="relative flex items-center">
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${theme === "light" ? "text-gray-400" : "text-gray-500"}`} />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value as any)}
              className={`pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 appearance-none ${
                theme === "light"
                  ? "bg-white border-gray-200 text-gray-700"
                  : "bg-secondary border-white/10 text-white"
              }`}
            >
              <option value="all">Todos los planes</option>
              <option value="free">Gratuito</option>
              <option value="standard">Estándar</option>
              <option value="custom">Personalizado</option>
            </select>
            <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${theme === "light" ? "text-gray-400" : "text-gray-500"}`} />
          </div>

          {/* Filtro Estado */}
          <div className="relative flex items-center">
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${theme === "light" ? "text-gray-400" : "text-gray-500"}`} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className={`pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 appearance-none ${
                theme === "light"
                  ? "bg-white border-gray-200 text-gray-700"
                  : "bg-secondary border-white/10 text-white"
              }`}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activa</option>
              <option value="trial">Prueba</option>
              <option value="suspended">Suspendida</option>
              <option value="expired">Expirada</option>
            </select>
            <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${theme === "light" ? "text-gray-400" : "text-gray-500"}`} />
          </div>
        </div>

        {/* Tabla de empresas */}
        <div className={`border rounded-lg overflow-hidden ${
          theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Administrador</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuarios</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vigencia</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === "light" ? "divide-gray-200" : "divide-white/5"}`}>
                {paginatedCompanies.map((company) => (
                  <tr key={company.id} className={`transition-colors ${
                    theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"
                  }`}>
                    <td className="px-4 py-3">
                      <p className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>{company.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white"}`}>{company.admin}</p>
                    </td>
                    <td className="px-4 py-3">{getPlanBadge(company.plan)}</td>
                    <td className="px-4 py-3">{getStatusBadge(company.status)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>{company.users}</span>
                      <span className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>/{company.maxUsers}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white"}`}>
                        {new Date(company.expiresAt).toLocaleDateString("es-EC", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit"
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleViewCompany(company)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditCompany(company)}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toast.info(`Enviar email a: ${company.adminEmail}`)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Enviar email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
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
          <div className={`text-center py-12 border rounded-lg ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
          }`}>
            <Building2 className={`w-12 h-12 mx-auto mb-2 ${theme === "light" ? "text-gray-400" : "text-gray-600"}`} />
            <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>No se encontraron empresas</p>
          </div>
        )}
      </div>

      {/* Modal Ver Empresa */}
      <CompanyViewModal
        isOpen={showViewModal}
        company={selectedCompany}
        onClose={() => setShowViewModal(false)}
        onEdit={handleEditCompany}
        getPlanBadge={getPlanBadge}
        getStatusBadge={getStatusBadge}
        onManagePlans={() => setShowPlanModal(true)}
      />

      {/* Modal Nueva/Editar Empresa */}
      <CompanyModal
        isOpen={showNewModal || showEditModal}
        isEdit={showEditModal}
        formData={formData}
        setFormData={setFormData}
        onClose={() => {
          setShowNewModal(false);
          setShowEditModal(false);
        }}
        onSave={showNewModal ? handleSaveCompany : handleUpdateCompany}
        handlePlanChange={handlePlanChange}
      />

      {/* Modal de Credenciales */}
      {showCredentialsModal && generatedCredentials && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl border rounded-2xl shadow-2xl ${ 
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-secondary border-white/10"
          }`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${
              theme === "light" ? "border-gray-200" : "border-white/10"
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>¡Empresa Creada Exitosamente!</h3>
                  <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Credenciales de acceso generadas</p>
                </div>
              </div>
              <button
                onClick={handleCloseCredentialsModal}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "light"
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className={`p-4 border rounded-lg ${
                theme === "light"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-yellow-500/10 border-yellow-500/20"
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    theme === "light" ? "text-yellow-600" : "text-yellow-400"
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === "light" ? "text-yellow-900" : "text-yellow-400"
                    }`}>Importante: Guarda estas credenciales</p>
                    <p className={`text-xs mt-1 ${
                      theme === "light" ? "text-yellow-800" : "text-yellow-400/80"
                    }`}>
                      Esta es la única vez que verás la contraseña generada. Asegúrate de copiarla y entregarla al administrador de la empresa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className={`p-4 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs flex items-center gap-2 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <Building2 className="w-4 h-4" />
                      Empresa
                    </label>
                  </div>
                  <p className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>{generatedCredentials.companyName}</p>
                </div>

                <div className={`p-4 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs flex items-center gap-2 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <Users className="w-4 h-4" />
                      Administrador
                    </label>
                  </div>
                  <p className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>{generatedCredentials.adminName}</p>
                </div>

                <div className={`p-4 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs flex items-center gap-2 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <Mail className="w-4 h-4" />
                      Usuario / Email
                    </label>
                    <button
                      onClick={() => copyToClipboard(generatedCredentials.email, "email")}
                      className={`p-1.5 rounded-md transition-colors ${
                        theme === "light"
                          ? "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      title="Copiar"
                    >
                      {copiedField === "email" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className={`font-mono text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>{generatedCredentials.email}</p>
                </div>

                <div className={`p-4 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs flex items-center gap-2 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <Key className="w-4 h-4" />
                      Contraseña
                    </label>
                    <button
                      onClick={() => copyToClipboard(generatedCredentials.password, "password")}
                      className={`p-1.5 rounded-md transition-colors ${
                        theme === "light"
                          ? "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      title="Copiar"
                    >
                      {copiedField === "password" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className={`font-mono text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>{generatedCredentials.password}</p>
                </div>
              </div>

              <div className={`p-4 border rounded-lg ${
                theme === "light"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-blue-500/10 border-blue-500/20"
              }`}>
                <p className={`text-xs ${
                  theme === "light" ? "text-blue-900" : "text-blue-400"
                }`}>
                  💡 <strong>Nota:</strong> El administrador podrá cambiar su contraseña una vez inicie sesión por primera vez.
                </p>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
              theme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-[#1a2332] border-white/10"
            }`}>
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

      {/* Modal de Gestión de Planes */}
      <PlansManagerModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
      />
    </div>
  );
}