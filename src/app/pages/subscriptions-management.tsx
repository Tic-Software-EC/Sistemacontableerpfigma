import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Building2,
  Users,
  Search,
  Settings,
  LogOut,
  X,
  CreditCard,
  Check,
  AlertCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  Clock,
  RefreshCw,
  FileText,
  Download,
  Menu,
  Package,
} from "lucide-react";
import { Pagination } from "../components/pagination";
import { ProfileModal } from "../components/profile-modal";

interface Subscription {
  id: string;
  companyName: string;
  companyRuc: string;
  plan: "free" | "standard" | "custom";
  status: "active" | "trial" | "suspended" | "expired" | "pending";
  users: number;
  maxUsers: number;
  monthlyPrice: number;
  startDate: string;
  endDate: string;
  lastPayment: string;
  nextPayment: string;
  paymentMethod: string;
  autoRenew: boolean;
}

export default function SubscriptionsManagementPage() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"all" | "free" | "standard" | "custom">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "trial" | "suspended" | "expired" | "pending">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Estado para perfil de usuario
  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador",
    avatar: "",
  });

  // Datos de ejemplo de suscripciones
  const [subscriptions] = useState<Subscription[]>([
    {
      id: "1",
      companyName: "TechCorp S.A.",
      companyRuc: "1792345678001",
      plan: "standard",
      status: "active",
      users: 5,
      maxUsers: 10,
      monthlyPrice: 44.75,
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      lastPayment: "2024-12-15",
      nextPayment: "2025-01-15",
      paymentMethod: "Tarjeta de Crédito",
      autoRenew: true,
    },
    {
      id: "2",
      companyName: "Innovatech Solutions",
      companyRuc: "1792876543001",
      plan: "custom",
      status: "active",
      users: 15,
      maxUsers: 50,
      monthlyPrice: 250.00,
      startDate: "2023-11-20",
      endDate: "2025-11-20",
      lastPayment: "2024-11-20",
      nextPayment: "2025-02-20",
      paymentMethod: "Transferencia",
      autoRenew: true,
    },
    {
      id: "3",
      companyName: "StartupXYZ",
      companyRuc: "1792111222001",
      plan: "free",
      status: "trial",
      users: 1,
      maxUsers: 1,
      monthlyPrice: 0,
      startDate: "2024-02-10",
      endDate: "2024-02-25",
      lastPayment: "-",
      nextPayment: "-",
      paymentMethod: "N/A",
      autoRenew: false,
    },
    {
      id: "4",
      companyName: "Global Services Inc.",
      companyRuc: "1792555666001",
      plan: "standard",
      status: "suspended",
      users: 8,
      maxUsers: 10,
      monthlyPrice: 71.60,
      startDate: "2023-08-05",
      endDate: "2024-08-05",
      lastPayment: "2024-06-05",
      nextPayment: "Suspendida",
      paymentMethod: "Tarjeta de Crédito",
      autoRenew: false,
    },
    {
      id: "5",
      companyName: "Digital Marketing Pro",
      companyRuc: "1792333444001",
      plan: "standard",
      status: "pending",
      users: 3,
      maxUsers: 5,
      monthlyPrice: 26.85,
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      lastPayment: "2024-12-01",
      nextPayment: "2025-02-16",
      paymentMethod: "Transferencia",
      autoRenew: true,
    },
  ]);

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "standard":
        return "bg-primary/20 text-primary border-primary/30";
      case "custom":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "trial":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "suspended":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "expired":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "pending":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case "free":
        return "Free";
      case "standard":
        return "Standard";
      case "custom":
        return "Custom";
      default:
        return plan;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "trial":
        return "Prueba";
      case "suspended":
        return "Suspendido";
      case "expired":
        return "Expirado";
      case "pending":
        return "Pago Pendiente";
      default:
        return status;
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.companyRuc.includes(searchTerm);
    const matchesPlan = selectedPlan === "all" || sub.plan === selectedPlan;
    const matchesStatus = selectedStatus === "all" || sub.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalRevenue = subscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => acc + s.monthlyPrice, 0);

  const pendingPayments = subscriptions.filter((s) => s.status === "pending").length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-secondary border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">TicSoftEc</h1>
                <p className="text-gray-400 text-xs">Administrador de Suscripciones</p>
              </div>
            </div>

            {/* Usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SA</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Super Admin</p>
                  <p className="text-gray-400 text-xs">Administrador</p>
                </div>
              </button>

              {/* Menú de usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#3a3f4f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm">Super Admin</p>
                    <p className="text-gray-400 text-xs">admin@ticsoftec.com</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Configuración</span>
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

          {/* Navegación entre secciones */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate("/admin/companies")}
              className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Gestión de Empresas
              </div>
            </button>
            <button
              className="px-4 py-2 bg-primary/10 text-primary border-b-2 border-primary rounded-lg text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Gestión de Suscripciones
              </div>
            </button>
            <button
              onClick={() => navigate("/admin/plan-configuration")}
              className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuración de Planes
              </div>
            </button>
            <button
              onClick={() => navigate("/admin/module-configuration")}
              className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Configuración de Módulos
              </div>
            </button>
            <button
              onClick={() => navigate("/admin/menu-management")}
              className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4" />
                Gestión de Menús
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header con estadísticas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Gestión de Suscripciones
              </h2>
              <p className="text-gray-400">
                Administra pagos, renovaciones y suscripciones activas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => alert("Exportar reporte - En desarrollo")}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                Exportar Reporte
              </button>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Suscripciones Activas</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {subscriptions.filter((s) => s.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Ingresos Mensuales</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pagos Pendientes</p>
                  <p className="text-white text-2xl font-bold mt-1">{pendingPayments}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">En Prueba</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {subscriptions.filter((s) => s.status === "trial").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por empresa o RUC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filtro por plan */}
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
            >
              <option value="all">Todos los planes</option>
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="custom">Custom</option>
            </select>

            {/* Filtro por estado */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="trial">Prueba</option>
              <option value="pending">Pago Pendiente</option>
              <option value="suspended">Suspendido</option>
              <option value="expired">Expirado</option>
            </select>
          </div>
        </div>

        {/* Tabla de suscripciones */}
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Usuarios
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Precio Mensual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Próximo Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Auto-Renovación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {currentItems.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{sub.companyName}</p>
                        <p className="text-gray-400 text-sm">RUC: {sub.companyRuc}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getPlanBadgeColor(
                          sub.plan
                        )}`}
                      >
                        {getPlanLabel(sub.plan)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusBadgeColor(
                          sub.status
                        )}`}
                      >
                        {getStatusLabel(sub.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {sub.users}/{sub.maxUsers}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">
                        ${sub.monthlyPrice.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-sm">{sub.nextPayment}</p>
                        <p className="text-gray-400 text-xs">{sub.paymentMethod}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.autoRenew ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">Sí</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <X className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-500 text-sm">No</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => alert(`Ver detalles de suscripción ${sub.companyName}`)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert(`Renovar suscripción de ${sub.companyName}`)}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Renovar"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        {sub.status === "pending" && (
                          <button
                            onClick={() => alert(`Registrar pago de ${sub.companyName}`)}
                            className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors"
                            title="Registrar pago"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubscriptions.length === 0 && (
            <div className="py-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No se encontraron suscripciones</p>
            </div>
          )}
        </div>

        {/* Paginación */}
        <div className="mt-4">
          <Pagination
            totalItems={filteredSubscriptions.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-gray-500 text-xs">
            TicSoftEc ERP v2.0 © 2024 - Panel de Administración de Suscripciones
          </p>
        </div>
      </footer>

      {/* Modal de Configuración de Perfil */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={(newProfile) => setUserProfile(newProfile)}
      />
    </div>
  );
}