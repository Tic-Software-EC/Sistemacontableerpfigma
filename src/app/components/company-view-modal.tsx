import {
  Building2,
  Users,
  CreditCard,
  Package,
  Bell,
  Palette,
  X,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface Company {
  id: string;
  name: string;
  ruc: string;
  email: string;
  phone: string;
  plan: "free" | "standard" | "custom";
  status: "active" | "trial" | "suspended" | "expired";
  users: number;
  maxUsers: number;
  maxBranches: number;
  maxCashRegisters: number;
  admin: string;
  adminEmail: string;
  createdAt: string;
  expiresAt: string;
  monthlyPrice: number;
  nextPayment: string;
  autoRenewal: boolean;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface CompanyViewModalProps {
  isOpen: boolean;
  company: Company | null;
  onClose: () => void;
  onEdit: (company: Company) => void;
  getPlanBadge: (plan: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
  onManagePlans?: () => void;
}

export function CompanyViewModal({
  isOpen,
  company,
  onClose,
  onEdit,
  getPlanBadge,
  getStatusBadge,
  onManagePlans,
}: CompanyViewModalProps) {
  if (!isOpen || !company) return null;

  // Calcular meses de suscripción
  const calculateSubscriptionMonths = () => {
    const startDate = new Date(company.createdAt);
    const endDate = new Date(company.expiresAt);
    
    const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthsDiff = endDate.getMonth() - startDate.getMonth();
    
    return yearsDiff * 12 + monthsDiff;
  };

  // Determinar tipo de pago
  const getPaymentType = () => {
    const months = calculateSubscriptionMonths();
    
    if (months >= 12) {
      return "Anual";
    } else if (months >= 6) {
      return "Semestral";
    } else if (months >= 3) {
      return "Trimestral";
    } else {
      return "Mensual";
    }
  };

  const subscriptionMonths = calculateSubscriptionMonths();
  const paymentType = getPaymentType();

  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`w-full max-w-2xl border rounded-xl shadow-2xl my-8 ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-[#1a2332] border-white/10"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-3.5 border-b ${
          theme === "light"
            ? "border-gray-200 bg-gray-50"
            : "border-white/10 bg-[#232d3f]"
        }`}>
          <h3 className={`font-bold text-lg flex items-center gap-3 ${
            theme === "light" ? "text-gray-900" : "text-white"
          }`}>
            <Eye className="w-5 h-5 text-primary" />
            Ver Detalles de Empresa
          </h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "light"
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 space-y-5 max-h-[600px] overflow-y-auto ${
          theme === "light" ? "bg-white" : "bg-[#232d3f]"
        }`}>
          {/* Información de la Empresa */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className={`w-5 h-5 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
              <h4 className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Información de la Empresa</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Nombre de la Empresa <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200 text-gray-900"
                    : "bg-[#0f1621] border-white/10 text-white"
                }`}>
                  {company.name}
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  RUC <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm font-mono ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200 text-gray-900"
                    : "bg-[#0f1621] border-white/10 text-white"
                }`}>
                  {company.ruc}
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Email <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200 text-gray-900"
                    : "bg-[#0f1621] border-white/10 text-white"
                }`}>
                  {company.email}
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Teléfono <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200 text-gray-900"
                    : "bg-[#0f1621] border-white/10 text-white"
                }`}>
                  {company.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Administrador Principal */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className={`w-5 h-5 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
              <h4 className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Administrador Principal</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Nombre del Administrador <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200 text-gray-900"
                    : "bg-[#0f1621] border-white/10 text-white"
                }`}>
                  {company.admin}
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Email del Administrador <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200 text-gray-900"
                    : "bg-[#0f1621] border-white/10 text-white"
                }`}>
                  {company.adminEmail}
                </div>
              </div>
            </div>
          </div>

          {/* Plan y Suscripción */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className={`w-5 h-5 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
              <h4 className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Plan y Suscripción</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Plan <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  {getPlanBadge(company.plan)}
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Estado <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  {getStatusBadge(company.status)}
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Tipo de Pago <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{paymentType}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Duración <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {subscriptionMonths} {subscriptionMonths === 1 ? "mes" : "meses"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Precio Mensual <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-primary text-sm font-bold ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  ${company.monthlyPrice.toFixed(2)}
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Auto-renovación <span className="text-red-400">*</span>
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  {company.autoRenewal ? (
                    <span className="text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Activa
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Inactiva
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Límites y Recursos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className={`w-5 h-5 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
              <h4 className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Límites y Recursos</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Usuarios
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {company.users} / {company.maxUsers}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-1.5 ${theme === "light" ? "bg-gray-200" : "bg-white/10"}`}>
                    <div
                      className="bg-blue-400 h-1.5 rounded-full"
                      style={{
                        width: `${(company.users / company.maxUsers) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Sucursales
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-green-400" />
                    <span className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {company.maxBranches}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Cajas Registradoras
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-400" />
                    <span className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {company.maxCashRegisters}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas Importantes */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className={`w-5 h-5 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
              <h4 className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Fechas Importantes</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Fecha de Creación
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200 text-gray-900"
                    : "bg-[#0f1621] border-white/10 text-white"
                }`}>
                  {new Date(company.createdAt).toLocaleDateString("es-EC")}
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Fecha de Expiración
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200 text-gray-900"
                    : "bg-[#0f1621] border-white/10 text-white"
                }`}>
                  {new Date(company.expiresAt).toLocaleDateString("es-EC")}
                </div>
              </div>

              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Próximo Pago
                </label>
                <div className={`w-full px-3 py-2 border rounded-lg text-sm ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200 text-gray-900"
                    : "bg-[#0f1621] border-white/10 text-white"
                }`}>
                  {new Date(company.nextPayment).toLocaleDateString("es-EC")}
                </div>
              </div>
            </div>
          </div>

          {/* Personalización */}
          {(company.primaryColor || company.secondaryColor) && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Palette className={`w-5 h-5 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                <h4 className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>Personalización</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.primaryColor && (
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Color Primario
                    </label>
                    <div className={`w-full px-3 py-2 border rounded-lg ${
                      theme === "light"
                        ? "bg-gray-50 border-gray-200"
                        : "bg-[#0f1621] border-white/10"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg border ${theme === "light" ? "border-gray-200" : "border-white/10"}`}
                          style={{ backgroundColor: company.primaryColor }}
                        />
                        <span className={`font-mono text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                          {company.primaryColor}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {company.secondaryColor && (
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Color Secundario
                    </label>
                    <div className={`w-full px-3 py-2 border rounded-lg ${
                      theme === "light"
                        ? "bg-gray-50 border-gray-200"
                        : "bg-[#0f1621] border-white/10"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg border ${theme === "light" ? "border-gray-200" : "border-white/10"}`}
                          style={{ backgroundColor: company.secondaryColor }}
                        />
                        <span className={`font-mono text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                          {company.secondaryColor}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
          theme === "light"
            ? "border-gray-200 bg-gray-50"
            : "border-white/10 bg-[#1a2332]"
        }`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              theme === "light"
                ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                : "bg-white/5 hover:bg-white/10 text-white"
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}