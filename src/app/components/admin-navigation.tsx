import { useNavigate } from "react-router";
import { Building2, Settings, Package, Menu } from "lucide-react";

interface AdminNavigationProps {
  activeSection: "companies" | "plans" | "modules" | "menus";
}

export function AdminNavigation({ activeSection }: AdminNavigationProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-1 inline-flex gap-1">
      <button
        onClick={() => navigate("/admin/companies")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
          activeSection === "companies"
            ? "bg-primary text-white"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        <Building2 className="w-4 h-4" />
        Gestión de Empresas
      </button>

      <button
        onClick={() => navigate("/admin/plan-configuration")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
          activeSection === "plans"
            ? "bg-primary text-white"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        <Settings className="w-4 h-4" />
        Configuración de Planes
      </button>

      <button
        onClick={() => navigate("/admin/module-configuration")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
          activeSection === "modules"
            ? "bg-primary text-white"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        <Package className="w-4 h-4" />
        Configuración de Módulos
      </button>

      <button
        onClick={() => navigate("/admin/menu-management")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
          activeSection === "menus"
            ? "bg-primary text-white"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        <Menu className="w-4 h-4" />
        Gestión de Menús
      </button>
    </div>
  );
}
