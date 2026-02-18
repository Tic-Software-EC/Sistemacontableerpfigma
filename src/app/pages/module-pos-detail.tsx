import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ShoppingCart,
  User,
  BarChart3,
  ChevronLeft,
  Bell,
  Settings,
  CreditCard,
  LogOut,
  Receipt,
  Clock,
  History,
} from "lucide-react";
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";
import { POS } from "./pos";

export default function ModulePosDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pos");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "dnd" | "offline">("online");

  // Obtener nombre de empresa desde localStorage
  const companyName = localStorage.getItem("companyName") || "Mi Empresa";

  const [userProfile, setUserProfile] = useState({
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    phone: "+593 99 123 4567",
    role: "Cajero",
    branch: "Sucursal Matriz - Quito",
  });

  const userRole = "Comprador";
  const userBranch = "Sucursal Centro";

  const handleProfileUpdate = (profile: any) => {
    setUserProfile(profile);
    setShowProfileModal(false);
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

  const tabs = [
    { id: "pos", label: "Punto de Venta", icon: ShoppingCart },
    { id: "historial", label: "Historial de Ventas", icon: History },
    { id: "reportes", label: "Reportes", icon: BarChart3 },
  ];

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
                <p className="text-gray-400 text-xs">Punto de Venta</p>
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
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusInfo().color} border-2 border-secondary rounded-full`}></div>
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
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">JP</span>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${getStatusInfo().color} border-2 border-[#1a1f2e] rounded-full`}></div>
                      </div>
                      <div>
                        <p className="text-white font-medium">{userProfile.name}</p>
                        <p className="text-gray-400 text-sm">{userProfile.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Mi Perfil</span>
                    </button>

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

                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left">
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

        {/* Tabs de navegación */}
        <div className="border-t border-white/10">
          <div className="px-6">
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                      activeTab === tab.id
                        ? "text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="h-[calc(100vh-145px)]">
        {activeTab === "pos" && <POS />}
        {activeTab === "historial" && (
          <div className="p-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">Historial de Ventas</h3>
              <p className="text-gray-400">
                Aquí se mostrará el historial completo de todas las ventas realizadas
              </p>
            </div>
          </div>
        )}
        {activeTab === "reportes" && (
          <div className="p-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">Reportes de Ventas</h3>
              <p className="text-gray-400">
                Visualiza estadísticas y análisis detallados de tus ventas
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={userProfile}
          onSave={handleProfileUpdate}
        />
      )}

      {showPreferencesModal && (
        <PreferencesModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
        />
      )}
    </div>
  );
}
