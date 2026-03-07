import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Edit,
  Eye,
  FileText,
  Users,
  ShoppingCart,
  BarChart3,
  Check,
  Package,
  Settings as SettingsIcon,
  Plus,
  CreditCard,
  CheckCircle2,
  DollarSign,
  Building2,
  X,
  Percent,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { AdminHeader } from "../components/admin-header";
import { useTheme } from "../contexts/theme-context";
import { PlanViewModal } from "../components/plan-view-modal";
import { PlanEditModal } from "../components/plan-edit-modal";
import { PlanNewModal } from "../components/plan-new-modal";
import { PlanModulesModal } from "../components/plan-modules-modal";
import { PLAN_CONFIGS } from "../config/plans";

interface Module {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  isEnabled: boolean;
  activeMenus: number;
  menus: {
    id: string;
    name: string;
    path: string;
    isEnabled: boolean;
    features: string;
  }[];
}

export default function PlanConfigurationPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlanForView, setSelectedPlanForView] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<any>(null);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showModulesModal, setShowModulesModal] = useState(false);

  // Estados de filtros
  const [planType, setPlanType] = useState("all");

  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador de Sistema",
    avatar: "",
  });

  const [plans, setPlans] = useState([
    {
      id: "free",
      name: "Free",
      price: 0,
      description: "Plan gratuito para comenzar",
      users: "1 Usuario",
      branches: "1 Sucursal",
      cashRegisters: "1 Caja",
      buttonColor: "bg-gray-600",
      buttonText: "Configurar Módulos",
      cardBorder: "border-gray-700",
      annualDiscountPercent: 0,
    },
    {
      id: "standard",
      name: "Standard",
      price: 99,
      description: "Plan ideal para pequeñas empresas",
      users: "10 Usuarios",
      branches: "5 Sucursales",
      cashRegisters: "3 Cajas",
      buttonColor: "bg-primary",
      buttonText: "Configurar Módulos",
      cardBorder: "border-primary",
      annualDiscountPercent: 15,
    },
    {
      id: "custom",
      name: "Custom",
      price: 299,
      description: "Plan personalizado para empresas grandes",
      users: "50 Usuarios",
      branches: "20 Sucursales",
      cashRegisters: "15 Cajas",
      buttonColor: "bg-cyan-500",
      buttonText: "Configurar Módulos",
      cardBorder: "border-cyan-600",
      annualDiscountPercent: 20,
    },
  ]);

  const [modules, setModules] = useState<Module[]>([
    {
      id: "1",
      name: "Facturas",
      icon: FileText,
      color: "#3B82F6",
      description: "Facturación electrónica completa",
      isEnabled: true,
      activeMenus: 5,
      menus: [
        { id: "1-1", name: "Crear Factura", path: "/facturas/crear", isEnabled: true, features: "Generar facturas electrónicas SRI" },
        { id: "1-2", name: "Lista de Facturas", path: "/facturas/lista", isEnabled: true, features: "Consultar y filtrar facturas" },
        { id: "1-3", name: "Facturas Anuladas", path: "/facturas/anuladas", isEnabled: true, features: "Gestión de facturas anuladas" },
        { id: "1-4", name: "Notas de Crédito", path: "/facturas/notas-credito", isEnabled: true, features: "Generar notas de crédito" },
        { id: "1-5", name: "Retenciones", path: "/facturas/retenciones", isEnabled: true, features: "Gestión de retenciones" },
        { id: "1-6", name: "Reportes de Facturación", path: "/facturas/reportes", isEnabled: false, features: "Análisis y estadísticas de ventas" },
        { id: "1-7", name: "Configuración SRI", path: "/facturas/config-sri", isEnabled: false, features: "Configurar datos del SRI" },
      ],
    },
    {
      id: "2",
      name: "Clientes",
      icon: Users,
      color: "#10B981",
      description: "Administración de clientes",
      isEnabled: true,
      activeMenus: 2,
      menus: [
        { id: "2-1", name: "Lista de Clientes", path: "/clientes/lista", isEnabled: true, features: "Ver y buscar clientes" },
        { id: "2-2", name: "Nuevo Cliente", path: "/clientes/nuevo", isEnabled: true, features: "Registrar nuevos clientes" },
        { id: "2-3", name: "Grupos de Clientes", path: "/clientes/grupos", isEnabled: false, features: "Segmentación de clientes" },
        { id: "2-4", name: "Historial de Compras", path: "/clientes/historial", isEnabled: false, features: "Ver compras anteriores" },
      ],
    },
    {
      id: "3",
      name: "Reportes",
      icon: BarChart3,
      color: "#A855F7",
      description: "Análisis y reportes detallados",
      isEnabled: false,
      activeMenus: 0,
      menus: [
        { id: "3-1", name: "Dashboard", path: "/reportes/dashboard", isEnabled: false, features: "Panel de métricas principales" },
        { id: "3-2", name: "Ventas", path: "/reportes/ventas", isEnabled: false, features: "Análisis de ventas detallado" },
        { id: "3-3", name: "Inventario", path: "/reportes/inventario", isEnabled: false, features: "Reporte de stock y movimientos" },
        { id: "3-4", name: "Financiero", path: "/reportes/financiero", isEnabled: false, features: "Estados financieros" },
      ],
    },
    {
      id: "4",
      name: "Inventario",
      icon: Package,
      color: "#F97316",
      description: "Control de stock y productos",
      isEnabled: true,
      activeMenus: 2,
      menus: [
        { id: "4-1", name: "Productos", path: "/inventario/productos", isEnabled: true, features: "Gestión completa de productos" },
        { id: "4-2", name: "Categorías", path: "/inventario/categorias", isEnabled: true, features: "Organizar productos por categorías" },
        { id: "4-3", name: "Movimientos", path: "/inventario/movimientos", isEnabled: false, features: "Registro de ingresos y egresos" },
        { id: "4-4", name: "Kardex", path: "/inventario/kardex", isEnabled: false, features: "Historial detallado de movimientos" },
        { id: "4-5", name: "Inventario Físico", path: "/inventario/fisico", isEnabled: false, features: "Conteo y ajuste de inventario" },
      ],
    },
    {
      id: "5",
      name: "Contabilidad",
      icon: FileText,
      color: "#EC4899",
      description: "Gestión contable completa",
      isEnabled: false,
      activeMenus: 0,
      menus: [
        { id: "5-1", name: "Libro Diario", path: "/contabilidad/libro-diario", isEnabled: false, features: "Registro cronológico de transacciones" },
        { id: "5-2", name: "Libro Mayor", path: "/contabilidad/libro-mayor", isEnabled: false, features: "Resumen por cuenta contable" },
        { id: "5-3", name: "Balance General", path: "/contabilidad/balance", isEnabled: false, features: "Estado de situación financiera" },
        { id: "5-4", name: "Estado de Resultados", path: "/contabilidad/resultados", isEnabled: false, features: "Pérdidas y ganancias" },
      ],
    },
    {
      id: "6",
      name: "Ventas",
      icon: ShoppingCart,
      color: "#06B6D4",
      description: "Gestión de ventas completa",
      isEnabled: true,
      activeMenus: 2,
      menus: [
        { id: "6-1", name: "Punto de Venta", path: "/ventas/pos", isEnabled: true, features: "Interfaz de venta rápida" },
        { id: "6-2", name: "Historial de Ventas", path: "/ventas/historial", isEnabled: true, features: "Consultar ventas realizadas" },
        { id: "6-3", name: "Cotizaciones", path: "/ventas/cotizaciones", isEnabled: false, features: "Generar y gestionar cotizaciones" },
        { id: "6-4", name: "Devoluciones", path: "/ventas/devoluciones", isEnabled: false, features: "Procesar devoluciones de productos" },
      ],
    },
  ]);

  const toggleModuleEnabled = (moduleId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, isEnabled: !m.isEnabled } : m
      )
    );
  };

  const toggleMenuEnabled = (moduleId: string, menuId: string) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId && m.menus) {
          const updatedMenus = m.menus.map((menu) =>
            menu.id === menuId ? { ...menu, isEnabled: !menu.isEnabled } : menu
          );
          const activeMenus = updatedMenus.filter(menu => menu.isEnabled).length;
          return { ...m, menus: updatedMenus, activeMenus };
        }
        return m;
      })
    );
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  // Convertir plan seleccionado al formato del modal
  const getPlanDataForModal = (plan: any) => {
    if (!plan) return null;
    
    // Intentar obtener la configuración del plan, si existe
    const planConfig = PLAN_CONFIGS[plan.id as keyof typeof PLAN_CONFIGS];
    
    // Si el plan existe en PLAN_CONFIGS, usar esos valores
    if (planConfig) {
      return {
        id: plan.id,
        name: plan.id,
        displayName: plan.name,
        price: plan.price,
        maxUsers: planConfig.maxUsers,
        maxBranches: planConfig.maxBranches,
        maxCashRegisters: planConfig.maxCashRegisters,
        description: plan.description,
      };
    }
    
    // Si es un plan nuevo (creado dinámicamente), extraer los valores del texto
    // Ej: "10 Usuarios" -> 10
    const extractNumber = (text: string): number => {
      const match = text.match(/\d+/);
      return match ? parseInt(match[0]) : 1;
    };
    
    return {
      id: plan.id,
      name: plan.id,
      displayName: plan.name,
      price: plan.price,
      maxUsers: extractNumber(plan.users || "1"),
      maxBranches: extractNumber(plan.branches || "1"),
      maxCashRegisters: extractNumber(plan.cashRegisters || "1"),
      description: plan.description,
    };
  };

  // Guardar cambios del plan editado
  const handleSavePlan = (updatedPlanData: any) => {
    setPlans(prevPlans => 
      prevPlans.map(p => 
        p.id === selectedPlanForEdit?.id 
          ? {
              ...p,
              // NO modificamos el nombre, solo los demás campos
              price: updatedPlanData.price,
              description: updatedPlanData.description,
              users: `${updatedPlanData.maxUsers} Usuario${updatedPlanData.maxUsers > 1 ? 's' : ''}`,
              branches: `${updatedPlanData.maxBranches} Sucursal${updatedPlanData.maxBranches > 1 ? 'es' : ''}`,
              cashRegisters: `${updatedPlanData.maxCashRegisters} Caja${updatedPlanData.maxCashRegisters > 1 ? 's' : ''}`,
              buttonColor: updatedPlanData.buttonColor || p.buttonColor,
              cardBorder: updatedPlanData.cardBorder || p.cardBorder,
              annualDiscountPercent: updatedPlanData.annualDiscountPercent || 0,
              durationMonths: updatedPlanData.durationMonths || 12,
            }
          : p
      )
    );
    setShowEditModal(false);
    // Aquí podrías agregar una notificación de éxito
  };
  
  // Lógica de filtrado
  const filteredPlans = plans.filter((plan) => {
    // Filtro por tipo de plan
    let matchesPlanType = true;
    if (planType !== "all") {
      matchesPlanType = plan.id === planType;
    }

    return matchesPlanType;
  });

  // Limpiar filtros
  const clearFilters = () => {
    setPlanType("all");
  };

  const hasActiveFilters = planType !== "all";

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
          : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"
      }`}
    >
      {/* Header */}
      <AdminHeader userProfile={userProfile} onProfileUpdate={setUserProfile} />

      {/* Main Content */}
      <div className="p-6">
        {/* 1. Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`border rounded-lg p-4 ${theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Total Planes</p>
                <p className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{plans.length}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          <div className={`border rounded-lg p-4 ${theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Plan Gratuito</p>
                <p className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>${plans.find(p => p.id === 'free')?.price || 0}</p>
              </div>
              <div className="p-2 bg-gray-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className={`border rounded-lg p-4 ${theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Plan Estándar</p>
                <p className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>${plans.find(p => p.id === 'standard')?.price || 0}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
          <div className={`border rounded-lg p-4 ${theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">Plan Custom</p>
                <p className={`text-2xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>${plans.find(p => p.id === 'custom')?.price || 0}</p>
              </div>
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Línea separadora */}
        <div className={`border-t mb-4 ${theme === "light" ? "border-gray-200" : "border-white/10"}`}></div>

        {/* 3. Botón de acción alineado a la derecha */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowNewPlanModal(true)}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Nuevo Plan
          </button>
        </div>

        {/* 4. Filtros inline */}
        <div className="flex items-center gap-3 mb-6">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre, precio, descripción..."
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                theme === "light"
                  ? "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  : "bg-secondary border-white/10 text-white placeholder-gray-500"
              }`}
            />
          </div>

          {/* Selector de tipo */}
          <div className="relative flex items-center">
            <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${theme === "light" ? "text-gray-400" : "text-gray-500"}`} />
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className={`pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 appearance-none ${
                theme === "light"
                  ? "bg-white border-gray-200 text-gray-700"
                  : "bg-secondary border-white/10 text-white"
              }`}
            >
              <option value="all">Todos los planes</option>
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="custom">Custom</option>
            </select>
            <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${theme === "light" ? "text-gray-400" : "text-gray-500"}`} />
          </div>

          {/* Limpiar */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className={`px-3 py-2 border rounded-lg flex items-center gap-2 transition-colors text-sm ${
                theme === "light"
                  ? "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  : "bg-secondary border-white/10 text-gray-400 hover:bg-white/5"
              }`}
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>

        {/* 5. Tabla de Planes */}
        <div className={`border rounded-lg overflow-hidden ${theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Usuarios</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sucursales</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cajas</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === "light" ? "divide-gray-100" : "divide-white/5"}`}>
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className={`transition-colors ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"}`}>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        plan.id === 'free' ? 'bg-[#4a5568] text-white'
                        : plan.id === 'standard' ? 'bg-[#B8581C] text-white'
                        : plan.id === 'custom' ? 'bg-[#0d6a74] text-white'
                        : `${plan.buttonColor} text-white`
                      }`}>
                        {plan.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                          ${plan.price}
                          <span className={`text-xs font-normal ml-0.5 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>/mes</span>
                        </span>
                        {plan.annualDiscountPercent && plan.annualDiscountPercent > 0 && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 rounded border border-green-500/20 text-green-500 text-[10px] font-semibold">
                            <Percent className="w-3 h-3" />
                            {plan.annualDiscountPercent}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>{plan.description}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>{plan.users}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>{plan.branches}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>{plan.cashRegisters}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => { setSelectedPlanId(plan.id); setShowModulesModal(true); }}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Configurar Módulos"
                        >
                          <SettingsIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedPlanForEdit(plan); setShowEditModal(true); }}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Editar Plan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedPlanForView(plan); setShowViewModal(true); }}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Ver Detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPlans.length === 0 && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No se encontraron planes</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Vista de Plan */}
      <PlanViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        plan={getPlanDataForModal(selectedPlanForView)}
      />

      {/* Modal de Edición de Plan */}
      <PlanEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        plan={getPlanDataForModal(selectedPlanForEdit)}
        onSave={handleSavePlan}
      />

      {/* Modal de Nuevo Plan */}
      <PlanNewModal
        isOpen={showNewPlanModal}
        onClose={() => setShowNewPlanModal(false)}
        onSave={(newPlanData) => {
          // Convertir el formato del modal al formato de la lista de planes
          const newPlan = {
            id: newPlanData.name.toLowerCase().replace(/\\s+/g, '-'),
            name: newPlanData.name,
            price: newPlanData.price,
            description: newPlanData.description,
            users: `${newPlanData.maxUsers} Usuario${newPlanData.maxUsers > 1 ? 's' : ''}`,
            branches: `${newPlanData.maxBranches} Sucursal${newPlanData.maxBranches > 1 ? 'es' : ''}`,
            cashRegisters: `${newPlanData.maxCashRegisters} Caja${newPlanData.maxCashRegisters > 1 ? 's' : ''}`,
            buttonColor: newPlanData.buttonColor,
            buttonText: "Configurar Módulos",
            cardBorder: newPlanData.cardBorder,
            annualDiscountPercent: newPlanData.annualDiscountPercent || 0,
            durationMonths: newPlanData.durationMonths || 12,
          };
          
          setPlans(prevPlans => [...prevPlans, newPlan]);
          setShowNewPlanModal(false);
        }}
      />

      {/* Modal de Módulos */}
      <PlanModulesModal
        isOpen={showModulesModal}
        onClose={() => setShowModulesModal(false)}
        plan={selectedPlan}
        modules={modules}
        onToggleModule={toggleModuleEnabled}
        onToggleMenu={toggleMenuEnabled}
      />
    </div>
  );
}