import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useBrand } from "../contexts/brand-context";
import {
  ShoppingCart,
  User,
  ChevronLeft,
  Bell,
  Settings,
  CreditCard,
  LogOut,
  FileText,
  DollarSign,
  Sun,
  Moon,
  Users,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";
import { SalesCustomersContent } from "../components/sales-customers-content";
import { SalesQuotesContent } from "../components/sales-quotes-content";
import { SalesElectronicDocumentsContent } from "../components/sales-electronic-documents-content";

export default function ModuleVentasDetail() {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();
  const { logoUrl } = useBrand();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  // Module: Sales Management

  const validTabs = ["quotes", "orders", "customers", "electronic-documents", "collections"];
  const activeTab = validTabs.includes(params.tab ?? "") ? params.tab! : "quotes";
  const setActiveTab = (tab: string) => {
    navigate(`/module-ventas-detail/${tab}`, { replace: true });
  };
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "dnd" | "offline">("online");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const companyName = localStorage.getItem("companyName") || "Mi Empresa";
  const userPlan = "Plan Profesional";
  const userRole = "Vendedor"; // Rol del usuario con permisos al módulo de ventas
  const userBranch = "Sucursal Matriz - Quito"; // Sucursal a la que pertenece el usuario

  const tabs = [
    { id: "quotes", name: "Cotizaciones", icon: FileText },
    { id: "orders", name: "Pedidos de Venta", icon: ShoppingCart },
    { id: "customers", name: "Clientes", icon: Users },
    { id: "electronic-documents", name: "Documentos Electrónicos", icon: FileCheck },
    { id: "collections", name: "Cobros", icon: DollarSign },
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

  const getModuleIcon = () => {
    return <TrendingUp className="w-5 h-5 text-white" />;
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

  const statusInfo = getStatusInfo();

  return (
    <div className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-[#0A0F1A]"}`}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 border-b ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
        {/* Fila principal del header */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Izquierda: botón volver + logo/título */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>{companyName}</h1>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Ventas</p>
              </div>
            </div>
          </div>

          {/* Derecha: acciones y usuario */}
          <div className="flex items-center gap-3">
            {/* Toggle tema */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-primary hover:bg-white/5"}`}
                title={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
              >
                {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Notificaciones */}
              <button className={`p-2 rounded-lg transition-colors relative ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </button>

              {/* Usuario */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">JP</span>
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusInfo.color} border-2 rounded-full ${isLight ? "border-white" : "border-secondary"}`}></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userRole} • {userBranch}</p>
                  </div>
                </button>

                {/* Dropdown menú de usuario */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                    <div className={`absolute right-0 mt-2 w-64 rounded-xl border shadow-2xl z-50 ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
                      {/* Info del usuario */}
                      <div className={`p-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            {getModuleIcon()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm truncate ${isLight ? "text-gray-900" : "text-white"}`}>{companyName}</p>
                            <p className={`text-xs truncate ${isLight ? "text-gray-500" : "text-gray-400"}`}>Ventas</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>Estado:</span>
                          <select
                            value={userStatus}
                            onChange={(e) => setUserStatus(e.target.value as any)}
                            className={`text-xs px-2 py-1 rounded border ${isLight ? "bg-white border-gray-300 text-gray-700" : "bg-[#0A0F1A] border-white/10 text-white"}`}
                          >
                            <option value="online">En línea</option>
                            <option value="away">Ausente</option>
                            <option value="dnd">No molestar</option>
                            <option value="offline">Desconectado</option>
                          </select>
                        </div>
                      </div>

                      {/* Plan y sucursal */}
                      <div className={`p-3 border-b ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
                        <div className="flex items-center gap-2 text-xs">
                          <CreditCard className="w-3.5 h-3.5 text-primary" />
                          <span className={isLight ? "text-gray-600" : "text-gray-400"}>{userPlan}</span>
                        </div>
                        <div className={`mt-1.5 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>{userBranch}</div>
                      </div>

                      {/* Opciones */}
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowProfileModal(true);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isLight ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-gray-300"}`}
                        >
                          <User className="w-4 h-4" />
                          Mi Perfil
                        </button>
                        {/* Solo administradores pueden ver Preferencias */}
                        {userProfile.role.toLowerCase().includes("administrador") && (
                          <>
                            <button
                              onClick={() => {
                                setShowUserMenu(false);
                                setShowPreferencesModal(true);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isLight ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-gray-300"}`}
                            >
                              <Settings className="w-4 h-4" />
                              Preferencias
                            </button>
                          </>
                        )}
                      </div>

                      <div className={`p-2 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <button
                          onClick={() => navigate("/login")}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isLight ? "hover:bg-red-50 text-red-600" : "hover:bg-red-500/10 text-red-400"}`}
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
          </div>
        </div>

        {/* Tabs horizontales */}
        <div className={`px-6 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-0 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                    isActive
                      ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                      : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Contenido principal ────────────────────────────────────────────── */}
      <main className="p-6">
        {activeTab === "quotes" && (
          <div className="space-y-6">
            <SalesQuotesContent />
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className={`p-8 rounded-xl border text-center ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
              <ShoppingCart className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
              <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>Módulo de pedidos en desarrollo</p>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-6">
            <SalesCustomersContent />
          </div>
        )}

        {activeTab === "electronic-documents" && (
          <div className="space-y-6">
            <SalesElectronicDocumentsContent />
          </div>
        )}

        {activeTab === "collections" && (
          <div className="space-y-6">
            <div className={`p-8 rounded-xl border text-center ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
              <DollarSign className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
              <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>Módulo de cobros en desarrollo</p>
            </div>
          </div>
        )}
      </main>

      {/* ── Modales ────────────────────────────────────────────────────────── */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userProfile={userProfile}
          onSave={handleSaveProfile}
          profilePhoto={profilePhoto}
          onPhotoChange={setProfilePhoto}
        />
      )}

      {showPreferencesModal && <PreferencesModal isOpen={showPreferencesModal} onClose={() => setShowPreferencesModal(false)} />}
    </div>
  );
}