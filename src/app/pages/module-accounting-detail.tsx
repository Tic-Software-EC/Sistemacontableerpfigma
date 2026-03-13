import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useBrand } from "../contexts/brand-context";
import {
  BookOpen, ChevronLeft, Bell, Settings, LogOut,
  Sun, Moon, X,
  BarChart2, PieChart, TrendingUp, FileText, Receipt, List, FileDown, GitBranch,
  Wallet, Home,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";
import { JournalContent } from "../components/journal-content";
import { LedgerContent } from "../components/ledger-content";
import { BalanceSheetContent } from "../components/balance-sheet-content";
import { IncomeStatementContent } from "../components/income-statement-content";
import { FinancialReportsContent } from "../components/financial-reports-content";
import { AtsContent } from "../components/ats-content";
import { AccountingConfigContent } from "../components/accounting-config-content";
import { AccountingSettingsContent } from "../components/accounting-settings-content";
import { ManualEntryContent } from "../components/manual-entry-content";

const TABS = [
  { id: "inicio",     name: "Inicio",                 icon: Home        },
  { id: "journal",    name: "Libro Diario",          icon: BookOpen    },
  { id: "ledger",     name: "Libro Mayor",           icon: Receipt     },
  { id: "balance",    name: "Balance General",        icon: BarChart2   },
  { id: "income",     name: "Estado de Resultados",   icon: TrendingUp  },
  { id: "reports",    name: "Reportes Financieros",   icon: PieChart    },
  { id: "ats",        name: "ATS",                    icon: FileDown    },
  { id: "config",     name: "Configuración",          icon: Settings    },
];

export default function ModuleAccountingDetail() {
  const navigate   = useNavigate();
  const params     = useParams<{ tab?: string }>();
  const { logoUrl } = useBrand();
  const { theme, toggleTheme } = useTheme();
  const isLight    = theme === "light";

  const validTabs  = TABS.map(t => t.id);
  type TabType = typeof validTabs[number];
  const activeTab: TabType | null = validTabs.includes(params.tab as TabType) ? (params.tab as TabType) : "inicio";
  const setActiveTab = (tab: TabType) => navigate(`/module-accounting-detail/${tab}`, { replace: true });

  const [showUserMenu,         setShowUserMenu]         = useState(false);
  const [showProfileModal,     setShowProfileModal]     = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [userStatus,           setUserStatus]           = useState<"online"|"away"|"dnd"|"offline">("online");
  const [profilePhoto,         setProfilePhoto]         = useState<string | null>(null);
  const [showStatusMenu,       setShowStatusMenu]       = useState(false);

  const companyName = localStorage.getItem("companyName") || "Mi Empresa";
  const userPlan    = "Plan Profesional";

  const [userProfile] = useState({
    name: "Juan Pérez", email: "juan.perez@ticsoftec.com",
    phone: "+593 99 123 4567", role: "Contador General", avatar: "",
  });

  const handleSaveProfile = (profile: any) => console.log("Perfil:", profile);

  const getModuleIcon = () => {
    return <BookOpen className="w-5 h-5 text-white" />;
  };

  const statusInfo = () => ({
    online:  { color: "bg-green-500",  label: "En línea"      },
    away:    { color: "bg-yellow-500", label: "Ausente"       },
    dnd:     { color: "bg-red-500",    label: "No molestar"   },
    offline: { color: "bg-gray-400",   label: "Desconectado"  },
  }[userStatus]);

  const statusOptions = [
    { key: "online",  label: "En línea",    color: "bg-green-500"  },
    { key: "away",    label: "Ausente",     color: "bg-yellow-500" },
    { key: "dnd",     label: "No molestar", color: "bg-red-500"    },
    { key: "offline", label: "Desconectado",color: "bg-gray-400"   },
  ];

  return (
    <div className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"}`}>

      {/* ── Header principal ───────────────────────────────────────────────── */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-sm ${isLight ? "border-gray-200 bg-white/90" : "border-white/10 bg-secondary/50"}`}>
        <div className="flex items-center justify-between px-6 py-4">

          {/* Izquierda */}
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>{companyName}</h1>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Contabilidad</p>
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

            {/* Toggle tema */}
            <button onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-primary hover:bg-white/5"}`}
              title={isLight ? "Modo oscuro" : "Modo claro"}>
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Usuario */}
            <div className="relative">
              <button onClick={() => { setShowUserMenu(!showUserMenu); setShowStatusMenu(false); }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}>
                <div className="relative">
                  {profilePhoto ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img src={profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">JP</span>
                    </div>
                  )}
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusInfo().color} border-2 rounded-full ${isLight ? "border-white" : "border-secondary"}`}></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userProfile.role}</p>
                </div>
              </button>

              {/* Menú usuario */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-72 border rounded-xl shadow-2xl overflow-hidden z-50 ${isLight ? "bg-white border-gray-200" : "bg-[#1a1f2e] border-white/10"}`}>
                  {/* Perfil */}
                  <div className={`px-4 py-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        {getModuleIcon()}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{companyName}</p>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Contabilidad</p>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="p-2">
                    <button onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/5"}`}>
                      <span className="text-gray-400"><Settings className="w-4 h-4" /></span>Mi Perfil
                    </button>
                    {/* Solo administradores pueden ver Preferencias */}
                    {userProfile.role.toLowerCase().includes("administrador") && (
                      <button onClick={() => { setShowPreferencesModal(true); setShowUserMenu(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/5"}`}>
                        <Settings className="w-4 h-4" />Preferencias
                      </button>
                    )}
                    <div className={`my-1 border-t ${isLight ? "border-gray-200" : "border-white/10"}`} />
                    <button onClick={() => navigate("/")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-red-400 ${isLight ? "hover:bg-red-50" : "hover:bg-red-500/10"}`}>
                      <LogOut className="w-4 h-4" /> Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs de navegación ─────────────────────────────────────────────── */}
        <div className={`border-t overflow-x-auto ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex px-6">
            {TABS.map(tab => {
              const Icon     = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                    isActive
                      ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                      : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
                  }`}>
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Contenido principal ──────────────────────────────────────────────── */}
      <main className="p-6">
        {/* Vista general cuando no hay pestaña seleccionada o está en inicio */}
        {(activeTab === null || activeTab === "inicio") && (
          <div>
            {/* Bienvenida al módulo */}
            <div className={`mb-8 border rounded-xl p-8 text-center ${
              isLight 
                ? "bg-gradient-to-br from-blue-50 to-white border-blue-200" 
                : "bg-gradient-to-br from-blue-500/10 to-secondary border-blue-500/20"
            }`}>
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-9 h-9 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>Módulo de Contabilidad</h2>
              <p className={`text-sm max-w-2xl mx-auto ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}>
                Sistema integral de gestión contable con libros diario y mayor, estados financieros,
                reportes tributarios y configuración del plan de cuentas
              </p>
            </div>

            {/* Grid de submódulos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Libro Diario */}
              <button
                onClick={() => setActiveTab("journal")}
                className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                    : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}>Libro Diario</h3>
                    <p className={`text-sm mb-4 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Registro cronológico de operaciones contables</p>
                    <ul className="space-y-2">
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>Asientos contables por fecha</span>
                      </li>
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-blue-500 mt-0.5">✓</span>
                        <span>Debe, Haber y Balance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* Libro Mayor */}
              <button
                onClick={() => setActiveTab("ledger")}
                className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                    : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Receipt className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}>Libro Mayor</h3>
                    <p className={`text-sm mb-4 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Movimientos agrupados por cuenta contable</p>
                    <ul className="space-y-2">
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Saldos por cuenta</span>
                      </li>
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Auxiliares contables</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* Balance General */}
              <button
                onClick={() => setActiveTab("balance")}
                className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                    : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart2 className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}>Balance General</h3>
                    <p className={`text-sm mb-4 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Estado de situación financiera</p>
                    <ul className="space-y-2">
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-purple-500 mt-0.5">✓</span>
                        <span>Activos, Pasivos y Patrimonio</span>
                      </li>
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-purple-500 mt-0.5">✓</span>
                        <span>Comparativos por período</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* Estado de Resultados */}
              <button
                onClick={() => setActiveTab("income")}
                className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                    : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}>Estado de Resultados</h3>
                    <p className={`text-sm mb-4 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Análisis de ingresos, costos y utilidades</p>
                    <ul className="space-y-2">
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span>Ingresos y Gastos</span>
                      </li>
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span>Utilidad neta del ejercicio</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* Reportes Financieros */}
              <button
                onClick={() => setActiveTab("reports")}
                className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                    : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <PieChart className="w-6 h-6 text-pink-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}>Reportes Financieros</h3>
                    <p className={`text-sm mb-4 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Análisis y reportes personalizados</p>
                    <ul className="space-y-2">
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-pink-500 mt-0.5">✓</span>
                        <span>Flujo de efectivo</span>
                      </li>
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-pink-500 mt-0.5">✓</span>
                        <span>Ratios financieros</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* ATS */}
              <button
                onClick={() => setActiveTab("ats")}
                className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                    : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileDown className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}>ATS</h3>
                    <p className={`text-sm mb-4 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Anexo Transaccional Simplificado</p>
                    <ul className="space-y-2">
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-red-500 mt-0.5">✓</span>
                        <span>Generación XML para SRI</span>
                      </li>
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-red-500 mt-0.5">✓</span>
                        <span>Declaración mensual</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </button>

              {/* Configuración */}
              <button
                onClick={() => setActiveTab("config")}
                className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                    : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}>Configuración</h3>
                    <p className={`text-sm mb-4 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Plan de cuentas y parámetros contables</p>
                    <ul className="space-y-2">
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-gray-500 mt-0.5">✓</span>
                        <span>Catálogo de cuentas</span>
                      </li>
                      <li className={`text-xs flex items-start gap-2 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        <span className="text-gray-500 mt-0.5">✓</span>
                        <span>Centros de costo</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
        
        {/* Libro Diario */}
        {activeTab === "journal" && <JournalContent />}

        {/* Libro Mayor */}
        {activeTab === "ledger" && <LedgerContent />}

        {/* Balance General */}
        {activeTab === "balance" && <BalanceSheetContent />}

        {/* Estado de Resultados */}
        {activeTab === "income" && <IncomeStatementContent />}

        {/* Reportes Financieros */}
        {activeTab === "reports" && <FinancialReportsContent />}

        {/* ATS - Anexo Transaccional Simplificado */}
        {activeTab === "ats" && <AtsContent />}

        {/* Configuración de Cuentas Contables */}
        {activeTab === "config" && <AccountingSettingsContent />}
      </main>

      {/* ── Modales ──────────────────────────────────────────────────────────── */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={handleSaveProfile}
      />
      <PreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
      />

      {/* Click fuera cierra menús */}
      {(showUserMenu) && (
        <div className="fixed inset-0 z-30" onClick={() => { setShowUserMenu(false); setShowStatusMenu(false); }} />
      )}
    </div>
  );
}