import { X, Package, Menu as MenuIcon } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useState } from "react";

interface Module {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  isEnabled: boolean;
  activeMenus: number;
  menus?: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  path: string;
  isEnabled: boolean;
  features?: string;
}

interface PlanModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  modules: Module[];
  onToggleModule: (moduleId: string) => void;
  onToggleMenu?: (moduleId: string, menuId: string) => void;
}

export function PlanModulesModal({
  isOpen,
  onClose,
  plan,
  modules,
  onToggleModule,
  onToggleMenu,
}: PlanModulesModalProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"modules" | "menus">("modules");

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className={`relative w-[1000px] h-[700px] overflow-hidden rounded-xl shadow-2xl ${
          theme === "light" ? "bg-white" : "bg-[#1a2332]"
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            theme === "light" ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0f1621]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3
                className={`font-bold text-lg ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Configuración del Plan: {plan.name}
              </h3>
              <p
                className={`text-xs ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Selecciona los módulos y menús disponibles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "light"
                ? "hover:bg-gray-200 text-gray-600"
                : "hover:bg-white/10 text-gray-400"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className={`${
            theme === "light" ? "bg-white" : "bg-[#1a2332]"
          }`}
        >
          <div className="flex items-center gap-2 px-6 pt-6">
            <button
              onClick={() => setActiveTab("modules")}
              className={`px-4 py-2.5 font-medium text-sm transition-all flex items-center gap-2 rounded-t-lg relative ${
                activeTab === "modules"
                  ? theme === "light"
                    ? "text-gray-900"
                    : "text-white"
                  : theme === "light"
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              style={
                activeTab === "modules"
                  ? {
                      borderTop: "4px solid #E8692E",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }
                  : {}
              }
            >
              <Package className="w-4 h-4" />
              Módulos
            </button>
            <button
              onClick={() => setActiveTab("menus")}
              className={`px-4 py-2.5 font-medium text-sm transition-all flex items-center gap-2 rounded-t-lg relative ${
                activeTab === "menus"
                  ? theme === "light"
                    ? "text-gray-900"
                    : "text-white"
                  : theme === "light"
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-400 hover:text-gray-300"
              }`}
              style={
                activeTab === "menus"
                  ? {
                      borderTop: "4px solid #E8692E",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }
                  : {}
              }
            >
              <MenuIcon className="w-4 h-4" />
              Menús
            </button>
          </div>
          <div
            className={`h-px mt-2 ${
              theme === "light" ? "bg-gray-200" : "bg-white/10"
            }`}
          ></div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[470px]">
          {/* Modules Table */}
          {activeTab === "modules" && (
            <div
              className={`border rounded-lg overflow-hidden ${
                theme === "light" ? "border-gray-200" : "border-white/10"
              }`}
            >
              <table className="w-full">
                <thead
                  className={`${
                    theme === "light" ? "bg-gray-50" : "bg-[#0f1621]"
                  }`}
                >
                  <tr>
                    <th
                      className={`px-4 py-3 text-left text-xs font-semibold ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Módulo
                    </th>
                    <th
                      className={`px-4 py-3 text-left text-xs font-semibold ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Descripción
                    </th>
                    <th
                      className={`px-4 py-3 text-center text-xs font-semibold ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Menús
                    </th>
                    <th
                      className={`px-4 py-3 text-center text-xs font-semibold ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((module, index) => {
                    const Icon = module.icon;
                    return (
                      <tr
                        key={module.id}
                        className={`border-t ${
                          theme === "light"
                            ? "border-gray-200 hover:bg-gray-50"
                            : "border-white/10 hover:bg-white/5"
                        } transition-colors`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${module.color}20` }}
                            >
                              <Icon className="w-4 h-4" style={{ color: module.color }} />
                            </div>
                            <span
                              className={`font-medium text-sm ${
                                theme === "light" ? "text-gray-900" : "text-white"
                              }`}
                            >
                              {module.name}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`px-4 py-3 text-xs ${
                            theme === "light" ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {module.description}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`text-xs px-2 py-1 rounded-md ${
                              theme === "light"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-white/5 text-gray-300"
                            }`}
                          >
                            {module.activeMenus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={module.isEnabled}
                                onChange={() => onToggleModule(module.id)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Menus Table */}
          {activeTab === "menus" && (
            <div className="space-y-4">
              {modules.map((module) => {
                const Icon = module.icon;
                const enabledMenus = module.menus?.filter((m) => m.isEnabled).length || 0;
                const totalMenus = module.menus?.length || 0;

                if (!module.menus || module.menus.length === 0) return null;

                return (
                  <div
                    key={module.id}
                    className={`border rounded-lg overflow-hidden ${
                      theme === "light" ? "border-gray-200" : "border-white/10"
                    } ${!module.isEnabled ? "opacity-50" : ""}`}
                  >
                    {/* Module Header */}
                    <div
                      className={`px-4 py-2 flex items-center justify-between ${
                        theme === "light" ? "bg-gray-50" : "bg-[#0f1621]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: module.color }} />
                        </div>
                        <span
                          className={`font-semibold text-sm ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {module.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-md ${
                          module.isEnabled
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : theme === "light"
                            ? "bg-gray-200 text-gray-600"
                            : "bg-white/5 text-gray-400"
                        }`}
                      >
                        {enabledMenus}/{totalMenus} activos
                      </span>
                    </div>

                    {/* Menus Table */}
                    <table className="w-full">
                      <thead
                        className={`${
                          theme === "light" ? "bg-gray-100" : "bg-[#0d1520]"
                        }`}
                      >
                        <tr>
                          <th
                            className={`px-4 py-2 text-left text-xs font-semibold ${
                              theme === "light" ? "text-gray-700" : "text-gray-300"
                            }`}
                          >
                            Menú
                          </th>
                          <th
                            className={`px-4 py-2 text-left text-xs font-semibold ${
                              theme === "light" ? "text-gray-700" : "text-gray-300"
                            }`}
                          >
                            Características
                          </th>
                          <th
                            className={`px-4 py-2 text-left text-xs font-semibold ${
                              theme === "light" ? "text-gray-700" : "text-gray-300"
                            }`}
                          >
                            Ruta
                          </th>
                          <th
                            className={`px-4 py-2 text-center text-xs font-semibold ${
                              theme === "light" ? "text-gray-700" : "text-gray-300"
                            }`}
                          >
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {module.menus.map((menu) => (
                          <tr
                            key={menu.id}
                            className={`border-t ${
                              theme === "light"
                                ? "border-gray-200 hover:bg-gray-50"
                                : "border-white/10 hover:bg-white/5"
                            } transition-colors`}
                          >
                            <td
                              className={`px-4 py-2 text-sm ${
                                theme === "light" ? "text-gray-900" : "text-white"
                              }`}
                            >
                              {menu.name}
                            </td>
                            <td
                              className={`px-4 py-2 text-xs ${
                                theme === "light" ? "text-gray-600" : "text-gray-400"
                              }`}
                            >
                              {menu.features || "N/A"}
                            </td>
                            <td
                              className={`px-4 py-2 text-xs ${
                                theme === "light" ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              {menu.path}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center justify-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={menu.isEnabled}
                                    onChange={() => onToggleMenu?.(module.id, menu.id)}
                                    disabled={!module.isEnabled}
                                    className="sr-only peer"
                                  />
                                  <div className={`w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 ${!module.isEnabled ? "opacity-50 cursor-not-allowed" : ""}`}></div>
                                </label>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
            theme === "light" ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0f1621]"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              theme === "light"
                ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                : "bg-white/5 hover:bg-white/10 text-gray-300"
            }`}
          >
            Cerrar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium text-sm transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}