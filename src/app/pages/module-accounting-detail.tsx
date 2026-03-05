import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useBrand } from "../contexts/brand-context";
import {
  BookOpen, ChevronLeft, Bell, Settings, LogOut,
  Sun, Moon, X, CreditCard,
  BarChart2, PieChart, TrendingUp, FileText, Receipt, List,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";
import { JournalContent } from "../components/journal-content";
import { ChartOfAccountsContent } from "../components/chart-of-accounts-content";
import { BalanceSheetContent } from "../components/balance-sheet-content";
import { IncomeStatementContent } from "../components/income-statement-content";
import { FinancialReportsContent } from "../components/financial-reports-content";

const TABS = [
  { id: "journal",    name: "Libro Diario",          icon: BookOpen    },
  { id: "accounts",   name: "Plan de Cuentas",        icon: List        },
  { id: "balance",    name: "Balance General",        icon: BarChart2   },
  { id: "income",     name: "Estado de Resultados",   icon: TrendingUp  },
  { id: "reports",    name: "Reportes Financieros",   icon: PieChart    },
];

export default function ModuleAccountingDetail() {
  const navigate   = useNavigate();
  const params     = useParams<{ tab?: string }>();
  const { logoUrl } = useBrand();
  const { theme, toggleTheme } = useTheme();
  const isLight    = theme === "light";

  const validTabs  = TABS.map(t => t.id);
  const activeTab  = validTabs.includes(params.tab ?? "") ? params.tab! : "journal";
  const setActiveTab = (tab: string) => navigate(`/module-accounting-detail/${tab}`, { replace: true });

  const [showUserMenu,         setShowUserMenu]         = useState(false);
  const [showProfileModal,     setShowProfileModal]     = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showSubscriptionModal,setShowSubscriptionModal]= useState(false);
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
            {/* Toggle tema */}
            <button onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-primary hover:bg-white/5"}`}
              title={isLight ? "Modo oscuro" : "Modo claro"}>
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Notificaciones */}
            <button className={`p-2 rounded-lg transition-colors relative ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
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
                      <div className="relative">
                        {profilePhoto ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img src={profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">JP</span>
                          </div>
                        )}
                        <button onClick={() => setShowStatusMenu(!showStatusMenu)}
                          className={`absolute bottom-0 right-0 w-3 h-3 ${statusInfo().color} border-2 rounded-full cursor-pointer hover:scale-125 transition-transform ${isLight ? "border-white" : "border-[#1a1f2e]"}`} />
                      </div>
                      <div>
                        <p className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userProfile.email}</p>
                        <p className={`text-xs mt-0.5 ${statusInfo().color.replace("bg-", "text-").replace("500", "400").replace("400", "400")}`}>{statusInfo().label}</p>
                      </div>
                    </div>
                    {showStatusMenu && (
                      <div className={`mt-3 p-2 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                        <p className={`text-xs mb-2 font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cambiar estado</p>
                        {statusOptions.map(s => (
                          <button key={s.key} onClick={() => { setUserStatus(s.key as any); setShowStatusMenu(false); }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${userStatus === s.key ? "bg-primary/10 text-primary" : isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/5"}`}>
                            <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Plan */}
                  <div className={`px-4 py-2.5 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userPlan}</span>
                      <button onClick={() => { setShowSubscriptionModal(true); setShowUserMenu(false); }}
                        className="text-xs text-primary hover:underline">Ver detalles</button>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="p-2">
                    {[
                      { icon: <Settings className="w-4 h-4" />, label: "Mi Perfil",     action: () => { setShowProfileModal(true);     setShowUserMenu(false); } },
                      { icon: <CreditCard className="w-4 h-4" />, label: "Preferencias", action: () => { setShowPreferencesModal(true); setShowUserMenu(false); } },
                    ].map(item => (
                      <button key={item.label} onClick={item.action}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/5"}`}>
                        <span className="text-gray-400">{item.icon}</span>{item.label}
                      </button>
                    ))}
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
        {/* Libro Diario */}
        {activeTab === "journal" && <JournalContent />}

        {/* Plan de Cuentas */}
        {activeTab === "accounts" && <ChartOfAccountsContent />}

        {/* Balance General */}
        {activeTab === "balance" && <BalanceSheetContent />}

        {/* Estado de Resultados */}
        {activeTab === "income" && <IncomeStatementContent />}

        {/* Reportes Financieros */}
        {activeTab === "reports" && <FinancialReportsContent />}
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

      {/* Suscripción */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 ${isLight ? "bg-white border border-gray-200" : "bg-secondary border border-white/10"}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>Mi Suscripción</h3>
              <button onClick={() => setShowSubscriptionModal(false)}
                className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Plan actual",        value: userPlan },
                { label: "Estado",             value: "Activo", badge: true },
                { label: "Próxima renovación", value: "16 de Marzo, 2026" },
              ].map(r => (
                <div key={r.label} className={`p-4 rounded-xl ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                  <p className="text-gray-400 text-sm mb-1">{r.label}</p>
                  {r.badge
                    ? <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">Activo</span>
                    : <p className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>{r.value}</p>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Click fuera cierra menús */}
      {(showUserMenu) && (
        <div className="fixed inset-0 z-30" onClick={() => { setShowUserMenu(false); setShowStatusMenu(false); }} />
      )}
    </div>
  );
}