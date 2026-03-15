import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Banknote,
  Users,
  Building2,
  GitCompare,
  FileCheck,
  Moon,
  Sun,
  Bell,
  Home,
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Shield,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { PagoNominaTab } from "../components/caja-bancos/pago-nomina-tab";
import { PagoProveedoresTab } from "../components/caja-bancos/pago-proveedores-tab";
import { ConciliacionBancariaTab } from "../components/caja-bancos/conciliacion-bancaria-tab";
import { ImpresionChequesTab } from "../components/caja-bancos/impresion-cheques-tab";
import { CuentasBancariasTab } from "../components/caja-bancos/cuentas-bancarias-tab";
import { IngresosEgresosTab } from "../components/caja-bancos/ingresos-egresos-tab";

type CajaBancosTab = "inicio" | "cuentas" | "ingresos-egresos" | "nomina" | "proveedores" | "conciliacion" | "cheques";

export function ModuleCajaBancosDetail() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const [activeTab, setActiveTab] = useState<CajaBancosTab>("inicio");

  return (
    <div className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-[#0D1B2A]"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
        {/* Fila principal del header */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Izquierda: botón volver + logo/título */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${
                isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Banknote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>
                  Comercial del Pacífico S.A.
                </h1>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Caja y Bancos
                </p>
              </div>
            </div>
          </div>

          {/* Derecha: acciones y usuario */}
          <div className="flex items-center gap-3">
            {/* Toggle tema */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-primary hover:bg-white/5"
              }`}
              title={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Notificaciones */}
            <button className={`p-2 rounded-lg transition-colors relative ${
              isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Usuario */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JP</span>
              </div>
              <div className="hidden md:block text-left">
                <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  Juan Pérez
                </p>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Contador • Matriz
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs horizontales */}
        <div className={`px-6 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab("inicio")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "inicio"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <Home className={`w-4 h-4 ${activeTab === "inicio" ? "text-primary" : ""}`} />
              Inicio
            </button>
            <button
              onClick={() => setActiveTab("cuentas")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "cuentas"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <Wallet className={`w-4 h-4 ${activeTab === "cuentas" ? "text-primary" : ""}`} />
              Cuentas Bancarias
            </button>
            <button
              onClick={() => setActiveTab("ingresos-egresos")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "ingresos-egresos"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <TrendingUp className={`w-4 h-4 ${activeTab === "ingresos-egresos" ? "text-primary" : ""}`} />
              Ingresos y Egresos
            </button>
            <button
              onClick={() => setActiveTab("nomina")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "nomina"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === "nomina" ? "text-primary" : ""}`} />
              Pago a Nómina
            </button>
            <button
              onClick={() => setActiveTab("proveedores")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "proveedores"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <Building2 className={`w-4 h-4 ${activeTab === "proveedores" ? "text-primary" : ""}`} />
              Pago a Proveedores
            </button>
            <button
              onClick={() => setActiveTab("conciliacion")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "conciliacion"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <GitCompare className={`w-4 h-4 ${activeTab === "conciliacion" ? "text-primary" : ""}`} />
              Conciliación Bancaria
            </button>
            <button
              onClick={() => setActiveTab("cheques")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "cheques"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <FileCheck className={`w-4 h-4 ${activeTab === "cheques" ? "text-primary" : ""}`} />
              Impresión de Cheques
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {activeTab === "inicio" && (
          <>
            <div className={`mb-8 border rounded-xl p-8 text-center ${
              isLight 
                ? "bg-gradient-to-br from-blue-50 to-white border-blue-200" 
                : "bg-gradient-to-br from-blue-500/10 to-secondary border-blue-500/20"
            }`}>
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Banknote className="w-9 h-9 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>Módulo de Caja y Bancos</h2>
              <p className={`text-sm max-w-2xl mx-auto ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}>
                Sistema completo para la gestión de tesorería, control de cuentas bancarias, pagos a nómina y proveedores, 
                conciliación bancaria automatizada e impresión de cheques con trazabilidad total
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab("cuentas")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Cuentas Bancarias
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Gestión completa de cuentas bancarias y saldos
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Registro de cuentas bancarias
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Control de saldos en tiempo real
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Gestión de múltiples bancos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("ingresos-egresos")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Ingresos y Egresos
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Registro y categorización de movimientos financieros
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Registro de ingresos y gastos
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Categorización por tipo
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Reportes de flujo de efectivo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("nomina")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Pago de Nómina
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Procesamiento automático de pagos de salarios
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Gestión de empleados y salarios
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Transferencias bancarias automáticas
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Comprobantes de pago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("proveedores")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Pago a Proveedores
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Administración de pagos y facturas pendientes
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Control de facturas pendientes
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Múltiples métodos de pago
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Alertas de vencimiento
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("conciliacion")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <GitCompare className="w-6 h-6 text-teal-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Conciliación Bancaria
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Comparación automática de extractos bancarios
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Carga de extractos bancarios
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Comparación automática
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Identificación de diferencias
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("cheques")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Impresión de Cheques
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Emisión e impresión de cheques corporativos
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Emisión de cheques digitales
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Control de estados y trazabilidad
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Registro de beneficiarios
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === "cuentas" && <CuentasBancariasTab theme={theme} isLight={isLight} />}
        {activeTab === "ingresos-egresos" && <IngresosEgresosTab theme={theme} isLight={isLight} />}
        {activeTab === "nomina" && <PagoNominaTab theme={theme} isLight={isLight} />}
        {activeTab === "proveedores" && <PagoProveedoresTab theme={theme} isLight={isLight} />}
        {activeTab === "conciliacion" && <ConciliacionBancariaTab theme={theme} isLight={isLight} />}
        {activeTab === "cheques" && <ImpresionChequesTab theme={theme} isLight={isLight} />}
      </main>
    </div>
  );
}