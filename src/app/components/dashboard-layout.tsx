import { Outlet, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Package, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export function DashboardLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Facturas", path: "/dashboard/invoices" },
    { icon: Users, label: "Clientes", path: "/dashboard/clients" },
    { icon: BarChart3, label: "Reportes", path: "/dashboard/reports" },
    { icon: Package, label: "Inventario", path: "/dashboard/inventory" },
    { icon: Settings, label: "Configuración", path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="size-full flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-secondary text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h1 className="text-xl font-black tracking-tight">TicSoftEc</h1>
            <p className="text-xs font-light text-white/60 mt-1">Sistema ERP</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menú de Navegación */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all font-normal text-sm group"
            >
              <item.icon className="w-5 h-5 group-hover:text-primary transition-colors" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer del Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-red-500/20 rounded-lg transition-all font-normal text-sm group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-secondary hover:text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-normal text-secondary">Admin User</p>
                <p className="text-xs font-light text-gray-500">admin@ticsoftec.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Contenido de la Página */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
