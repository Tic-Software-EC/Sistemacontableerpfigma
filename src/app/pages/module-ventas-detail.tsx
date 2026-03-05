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
  X,
  Receipt,
  DollarSign,
  Sun,
  Moon,
  Users,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";
import { AccountingRetentionsContent } from "../components/accounting-retentions-content";

export default function ModuleVentasDetail() {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();
  const { logoUrl } = useBrand();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const validTabs = ["quotes", "orders", "customers", "invoices", "retentions", "collections"];
  const activeTab = validTabs.includes(params.tab ?? "") ? params.tab! : "quotes";
  const setActiveTab = (tab: string) => {
    navigate(`/module-ventas-detail/${tab}`, { replace: true });
  };
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
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
    { id: "invoices", name: "Facturas de Venta", icon: Receipt },
    { id: "retentions", name: "Retenciones Recibidas", icon: FileText },
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
        <div className="px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo y breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/modules")}
                className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-300"}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="h-10 w-10 object-contain rounded-lg" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                )}
                <div>
                  <h1 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>{companyName}</h1>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Ventas</p>
                </div>
              </div>
            </div>

            {/* Acciones derecha */}
            <div className="flex items-center gap-3">
              {/* Toggle tema */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-300"}`}
              >
                {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Notificaciones */}
              <button className={`p-2 rounded-lg transition-colors relative ${isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-300"}`}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
              </button>

              {/* Menú de usuario */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}
                >
                  <div className="relative">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${statusInfo.color} border-2 ${isLight ? "border-white" : "border-[#0D1B2A]"} rounded-full`}></span>
                  </div>
                  <div className="text-left hidden md:block">
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userRole}</p>
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
                          {profilePhoto ? (
                            <img src={profilePhoto} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-sm truncate ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                            <p className={`text-xs truncate ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userProfile.email}</p>
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
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowSubscriptionModal(true);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isLight ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/5 text-gray-300"}`}
                        >
                          <CreditCard className="w-4 h-4" />
                          Suscripción
                        </button>
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

          {/* Tabs de navegación */}
          <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
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
        </div>
      </header>

      {/* ── Contenido principal ────────────────────────────────────────────── */}
      <main className={activeTab === "retentions" ? "p-6 flex flex-col" : "p-6"}
            style={activeTab === "retentions" ? { height: "calc(100vh - 165px)" } : undefined}>
        {activeTab === "quotes" && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                <FileText className="w-7 h-7 text-primary inline-block mr-2" />
                Cotizaciones
              </h2>
              <p className="text-gray-400 text-sm">Gestión de cotizaciones a clientes</p>
            </div>
            <div className={`p-8 rounded-xl border text-center ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
              <FileText className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
              <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>Módulo de cotizaciones en desarrollo</p>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                <ShoppingCart className="w-7 h-7 text-primary inline-block mr-2" />
                Pedidos de Venta
              </h2>
              <p className="text-gray-400 text-sm">Administración de pedidos de clientes</p>
            </div>
            <div className={`p-8 rounded-xl border text-center ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
              <ShoppingCart className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
              <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>Módulo de pedidos en desarrollo</p>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                <Users className="w-7 h-7 text-primary inline-block mr-2" />
                Clientes
              </h2>
              <p className="text-gray-400 text-sm">Gestión de base de clientes</p>
            </div>
            <div className={`p-8 rounded-xl border text-center ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
              <Users className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
              <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>Módulo de clientes en desarrollo</p>
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                <Receipt className="w-7 h-7 text-primary inline-block mr-2" />
                Facturas de Venta
              </h2>
              <p className="text-gray-400 text-sm">Administración de facturas emitidas a clientes</p>
            </div>
            <div className={`p-8 rounded-xl border text-center ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
              <Receipt className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
              <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>Módulo de facturas en desarrollo</p>
            </div>
          </div>
        )}

        {activeTab === "retentions" && (
          <div className="flex flex-col flex-1 min-h-0">
            <AccountingRetentionsContent filterByCategory="ventas" />
          </div>
        )}

        {activeTab === "collections" && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                <DollarSign className="w-7 h-7 text-primary inline-block mr-2" />
                Cobros
              </h2>
              <p className="text-gray-400 text-sm">Registro y seguimiento de cobros a clientes</p>
            </div>
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

      {/* Modal de Suscripción */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
            <div className={`flex items-center justify-between p-6 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div>
                <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>Información de Suscripción</h3>
                <p className={`text-sm mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>Detalles de tu plan actual</p>
              </div>
              <button onClick={() => setShowSubscriptionModal(false)} className={`p-2 rounded-lg ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className={`p-6 rounded-xl border ${isLight ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20" : "bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{userPlan}</h4>
                    <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Plan activo hasta: 31/12/2026</p>
                  </div>
                  <CreditCard className="w-12 h-12 text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Usuarios activos</p>
                    <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>5 / 10</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Módulos disponibles</p>
                    <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>8 / 12</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowSubscriptionModal(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
                >
                  Cerrar
                </button>
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors">Gestionar Plan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
