import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Package, TrendingUp, ArrowLeftRight, Plus, Bell, FileText, Sun, Moon, Info } from "lucide-react";
import { InventoryStockList } from "../components/inventory-stock-list";
import { InventoryMovementsList } from "../components/inventory-movements-list";
import { InventoryTransfersList } from "../components/inventory-transfers-list";
import { InventoryKardex } from "../components/inventory-kardex";
import { NewProductModal } from "../components/new-product-modal";
import { NewMovementModal } from "../components/new-movement-modal";
import { useTheme } from "../contexts/theme-context";

export default function ModuleInventoryDetail() {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const validTabs = ["stock", "movements", "transfers", "kardex"] as const;
  type TabType = typeof validTabs[number];
  const activeTab: TabType | null = validTabs.includes(params.tab as TabType) ? (params.tab as TabType) : null;
  const setActiveTab = (tab: TabType) => {
    navigate(`/module-inventory-detail/${tab}`, { replace: true });
  };
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showNewMovementModal, setShowNewMovementModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Establecer porcentaje de ganancia por defecto si no existe
  if (!localStorage.getItem("defaultProfitMargin")) {
    localStorage.setItem("defaultProfitMargin", "30");
  }

  const companyName = localStorage.getItem("companyName") || "Comercial del Pacífico S.A.";
  const userRole = "Bodeguero";
  const userBranch = "Sucursal Matriz - Quito";

  const tabs = [
    { id: "stock", name: "Stock Actual", icon: Package },
    { id: "movements", name: "Movimientos de Inventario", icon: TrendingUp },
    { id: "transfers", name: "Transferencias", icon: ArrowLeftRight },
    { id: "kardex", name: "Kardex", icon: FileText },
  ];

  const [userProfile] = useState({
    name: "Juan Pérez",
    email: "juan.perez@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Bodeguero",
    avatar: "",
  });

  const getModuleIcon = () => {
    return <Package className="w-5 h-5 text-white" />;
  };

  // Descripciones de cada submódulo
  const moduleDescriptions = {
    stock: {
      title: "Stock Actual",
      description: "Control completo del inventario disponible",
      features: [
        "Consulta las existencias actuales de todos tus productos",
        "Visualiza precios de compra, venta y márgenes de ganancia",
        "Identifica productos con stock bajo o crítico",
        "Gestiona categorías, unidades de medida y códigos de productos",
      ]
    },
    movements: {
      title: "Movimientos de Inventario",
      description: "Registro de todas las operaciones que afectan el inventario",
      features: [
        "Entradas: Compras a proveedores, devoluciones de clientes, producción interna",
        "Salidas: Ventas a clientes, devoluciones a proveedores, consumo interno",
        "Ajustes: Correcciones de inventario físico, mermas, productos vencidos",
        "Transferencias: Redistribución de stock entre almacenes (también desde pestaña Transferencias)",
      ]
    },
    transfers: {
      title: "Transferencias Entre Almacenes",
      description: "Gestión especializada de movimientos internos de mercadería",
      features: [
        "Redistribuye productos entre diferentes almacenes o sucursales",
        "El stock total de la empresa NO cambia, solo la ubicación",
        "Seguimiento de transferencias en tránsito y pendientes",
        "Historial completo de movimientos entre bodegas",
      ]
    },
    kardex: {
      title: "Kardex de Productos",
      description: "Historial detallado de movimientos por producto",
      features: [
        "Visualiza todo el historial de entradas y salidas de un producto específico",
        "Análisis de movimientos por fecha, tipo, almacén y motivo",
        "Seguimiento de saldos anteriores y resultantes por operación",
        "Ideal para auditorías, conciliaciones y análisis de rotación",
      ]
    }
  };

  const renderContent = () => {
    // Vista general cuando no hay pestaña seleccionada
    if (activeTab === null) {
      return (
        <div>
          {/* Bienvenida al módulo */}
          <div className={`mb-8 border rounded-xl p-8 text-center ${
            isLight 
              ? "bg-gradient-to-br from-blue-50 to-white border-blue-200" 
              : "bg-gradient-to-br from-blue-500/10 to-secondary border-blue-500/20"
          }`}>
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-9 h-9 text-white" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${
              isLight ? "text-gray-900" : "text-white"
            }`}>Módulo de Inventario</h2>
            <p className={`text-sm max-w-2xl mx-auto ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              Sistema completo para la gestión y control de inventarios, movimientos de mercadería, 
              transferencias entre almacenes y análisis detallado por producto
            </p>
          </div>

          {/* Grid de submódulos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stock Actual */}
            <button
              onClick={() => setActiveTab("stock")}
              className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                isLight 
                  ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                  : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}>Stock Actual</h3>
                  <p className={`text-sm mb-4 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Control completo del inventario disponible</p>
                  <ul className="space-y-2">
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Consulta existencias actuales de productos</span>
                    </li>
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Visualiza precios y márgenes de ganancia</span>
                    </li>
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Identifica productos con stock bajo o crítico</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>

            {/* Movimientos de Inventario */}
            <button
              onClick={() => setActiveTab("movements")}
              className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                isLight 
                  ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                  : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}>Movimientos de Inventario</h3>
                  <p className={`text-sm mb-4 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Registro de todas las operaciones que afectan el inventario</p>
                  <ul className="space-y-2">
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>Entradas: Compras, devoluciones de clientes</span>
                    </li>
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>Salidas: Ventas, consumo interno</span>
                    </li>
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>Ajustes: Correcciones, mermas, vencimientos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>

            {/* Transferencias */}
            <button
              onClick={() => setActiveTab("transfers")}
              className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                isLight 
                  ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                  : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ArrowLeftRight className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}>Transferencias Entre Almacenes</h3>
                  <p className={`text-sm mb-4 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Gestión especializada de movimientos internos de mercadería</p>
                  <ul className="space-y-2">
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-purple-500 mt-0.5">✓</span>
                      <span>Redistribuye productos entre almacenes</span>
                    </li>
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-purple-500 mt-0.5">✓</span>
                      <span>Stock total NO cambia, solo la ubicación</span>
                    </li>
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-purple-500 mt-0.5">✓</span>
                      <span>Seguimiento de transferencias en tránsito</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>

            {/* Kardex */}
            <button
              onClick={() => setActiveTab("kardex")}
              className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                isLight 
                  ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                  : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg mb-2 ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}>Kardex de Productos</h3>
                  <p className={`text-sm mb-4 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Historial detallado de movimientos por producto</p>
                  <ul className="space-y-2">
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-orange-500 mt-0.5">✓</span>
                      <span>Historial completo de entradas y salidas</span>
                    </li>
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-orange-500 mt-0.5">✓</span>
                      <span>Análisis por fecha, tipo y almacén</span>
                    </li>
                    <li className={`text-xs flex items-start gap-2 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>
                      <span className="text-orange-500 mt-0.5">✓</span>
                      <span>Ideal para auditorías y conciliaciones</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>
          </div>
        </div>
      );
    }

    const currentModule = moduleDescriptions[activeTab];
    
    switch (activeTab) {
      case "stock":
        return (
          <div>
            {/* Presentación del módulo */}
            

            {/* Título y botón de acción */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Gestiona el inventario disponible y realiza seguimiento de productos
                </p>
              </div>
              <button
                onClick={() => setShowNewProductModal(true)}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                Nuevo Producto
              </button>
            </div>

            <InventoryStockList />
          </div>
        );
      case "movements":
        return (
          <div>
            {/* Presentación del módulo */}
            

            {/* Título y botón de acción */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Visualiza todas las entradas, salidas y ajustes del inventario
                </p>
              </div>
              <button
                onClick={() => setShowNewMovementModal(true)}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
                Nuevo Movimiento
              </button>
            </div>

            <InventoryMovementsList />
          </div>
        );
      case "transfers":
        return (
          <div>
            {/* Presentación del módulo */}
            

            {/* Título y botón de acción */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Gestiona las transferencias entre almacenes
                </p>
              </div>
              <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm">
                <Plus className="w-4 h-4" />
                Nueva Transferencia
              </button>
            </div>

            <InventoryTransfersList />
          </div>
        );
      case "kardex":
        return (
          <div>
            {/* Presentación del módulo */}
            

            {/* Título y botón de acción */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Visualiza el historial de movimientos de un producto específico
                </p>
              </div>
            </div>

            <InventoryKardex />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"}`}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-sm ${isLight ? "border-gray-200 bg-white/90" : "border-white/10 bg-secondary/50"}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Botón volver */}
            <button
              onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>{companyName}</h1>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Inventario</p>
              </div>
            </div>
          </div>

          {/* Derecha */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <button className={`p-2 rounded-lg transition-colors relative ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Toggle Tema Sol/Luna */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-primary hover:bg-white/5"}`}
              title={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
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
                  <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full ${isLight ? "border-white" : "border-secondary"}`}></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userRole} • {userBranch}</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs horizontales */}
        <div className={`px-6 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-white bg-primary/5"}`
                      : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {renderContent()}
      </div>

      {/* Modal de nuevo producto */}
      <NewProductModal 
        isOpen={showNewProductModal} 
        onClose={() => setShowNewProductModal(false)} 
      />

      {/* Modal de nuevo movimiento */}
      <NewMovementModal 
        isOpen={showNewMovementModal} 
        onClose={() => setShowNewMovementModal(false)} 
      />
    </div>
  );
}