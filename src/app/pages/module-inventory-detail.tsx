import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Package, TrendingUp, ArrowLeftRight, Plus, Bell, FileText } from "lucide-react";
import { InventoryStockList } from "../components/inventory-stock-list";
import { InventoryMovementsList } from "../components/inventory-movements-list";
import { InventoryTransfersList } from "../components/inventory-transfers-list";
import { InventoryKardex } from "../components/inventory-kardex";
import { NewProductModal } from "../components/new-product-modal";
import { NewMovementModal } from "../components/new-movement-modal";

export default function ModuleInventoryDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"stock" | "movements" | "transfers" | "kardex">("stock");
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

  const renderContent = () => {
    switch (activeTab) {
      case "stock":
        return (
          <div>
            {/* Título y botón de acción */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-8 h-8 text-primary" />
                  <h2 className="text-white font-bold text-3xl">Stock Actual</h2>
                </div>
                <p className="text-gray-400 text-sm">
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
            {/* Título y botón de acción */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <h2 className="text-white font-bold text-3xl">Movimientos de Inventario</h2>
                </div>
                <p className="text-gray-400 text-sm">
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
            {/* Título y botón de acción */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <ArrowLeftRight className="w-8 h-8 text-primary" />
                  <h2 className="text-white font-bold text-3xl">Transferencias</h2>
                </div>
                <p className="text-gray-400 text-sm">
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
            {/* Título y botón de acción */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-8 h-8 text-primary" />
                  <h2 className="text-white font-bold text-3xl">Kardex</h2>
                </div>
                <p className="text-gray-400 text-sm">
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
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">{companyName}</h1>
                <p className="text-gray-400 text-xs">Inventario</p>
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
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-secondary rounded-full"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">{userProfile.name}</p>
                  <p className="text-gray-400 text-xs">{userRole} • {userBranch}</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs horizontales */}
        <div className="px-6 border-t border-white/10">
          <div className="flex items-center gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "border-primary text-white bg-primary/5"
                      : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
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