import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Building2,
  Package,
  Menu as MenuIcon,
  Sun,
  Moon,
  Home,
  FolderTree,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { ProfileModal } from "./profile-modal";

interface AdminHeaderProps {
  userProfile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
  };
  onProfileUpdate?: (profile: any) => void;
}

export function AdminHeader({ userProfile, onProfileUpdate }: AdminHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const tabs = [
    { path: "/admin", icon: Home, label: "Inicio" },
    { path: "/admin/companies", icon: Building2, label: "Gestión de Empresas" },
    { path: "/admin/plan-configuration", icon: SettingsIcon, label: "Configuración de Planes" },
    { path: "/admin/catalogs-admin", icon: FolderTree, label: "Gestión de Catálogos" },
    { path: "/admin/menu-management", icon: MenuIcon, label: "Gestión de Menús" },
  ];

  const isActiveTab = (path: string) => {
    // Para el tab de inicio, debe estar activo solo cuando la ruta es exactamente /admin
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname === path;
  };

  const currentTab = tabs.find((tab) => tab.path === location.pathname || 
    (tab.path === "/admin" && (location.pathname === "/admin" || location.pathname === "/admin/")));
  const pageTitle = currentTab?.label ?? "Panel de Administración";

  return (
    <>
      <header className={`border-b sticky top-0 z-40 ${
        theme === "light"
          ? "border-gray-200 bg-white/90 backdrop-blur-sm"
          : "border-white/10 bg-secondary/50 backdrop-blur-sm"
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo y título */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-3 group"
              title="Ir al Panel de Administración"
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </button>
            <div className="text-left">
              <h1 className={`font-bold text-xl ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                TicSoftEc
              </h1>
              <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                {pageTitle}
              </p>
            </div>
          </div>

          {/* Iconos derecha: Bell → Theme → User */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <button className={`p-2 rounded-lg transition-colors relative ${
              theme === "light"
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Botón de tema */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === "light"
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SA</span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full ${
                    theme === "light" ? "border-white" : "border-secondary"
                  }`}></div>
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                    {userProfile.name}
                  </p>
                  <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                    {userProfile.role}
                  </p>
                </div>
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-64 border rounded-xl shadow-2xl overflow-hidden z-50 ${
                  theme === "light"
                    ? "bg-white border-gray-200"
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <div className={`px-4 py-3 border-b ${
                    theme === "light" ? "border-gray-200" : "border-white/10"
                  }`}>
                    <p className={`font-medium text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {userProfile.name}
                    </p>
                    <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      {userProfile.email}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                        theme === "light"
                          ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <SettingsIcon className="w-4 h-4" />
                      <span className="text-sm">Mi Perfil</span>
                    </button>
                    <div className={`border-t my-2 ${theme === "light" ? "border-gray-200" : "border-white/10"}`}></div>
                    <button
                      onClick={() => navigate("/")}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 transition-colors text-left ${
                        theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/5"
                      } hover:text-red-300`}
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
        <div className={`px-6 border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActiveTab(tab.path);
              
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
                    active
                      ? `border-primary ${
                          theme === "light"
                            ? "text-primary bg-primary/5"
                            : "text-white bg-primary/5"
                        }`
                      : `border-transparent ${
                          theme === "light"
                            ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                            : "text-gray-500 hover:text-white hover:bg-white/5"
                        }`
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active && theme === "light" ? "text-primary" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Modal de perfil */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userProfile={userProfile}
          onSave={(updatedProfile) => {
            if (onProfileUpdate) {
              onProfileUpdate(updatedProfile);
            }
            setShowProfileModal(false);
          }}
        />
      )}
    </>
  );
}