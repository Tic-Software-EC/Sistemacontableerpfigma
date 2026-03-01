import {
  X,
  Eye,
  Package,
  Users,
  Building2,
  CreditCard,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface PlanData {
  id: string;
  name: string;
  displayName: string;
  price: number;
  maxUsers: number;
  maxBranches: number;
  maxCashRegisters: number;
  description: string;
}

interface PlanViewModalProps {
  isOpen: boolean;
  plan: PlanData | null;
  onClose: () => void;
}

export function PlanViewModal({ isOpen, plan, onClose }: PlanViewModalProps) {
  const { theme } = useTheme();

  if (!isOpen || !plan) return null;

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "free":
        return {
          bg: "bg-gray-700",
          text: "text-gray-300",
          border: "border-gray-600",
          badge: "bg-gray-700 text-gray-300 border-gray-600",
        };
      case "standard":
        return {
          bg: "bg-[#3d2817]",
          text: "text-[#E8692E]",
          border: "border-[#E8692E]/40",
          badge: "bg-[#3d2817] text-[#E8692E] border-[#E8692E]/40",
        };
      case "custom":
        return {
          bg: "bg-[#0d3d4a]",
          text: "text-cyan-400",
          border: "border-cyan-500/40",
          badge: "bg-[#0d3d4a] text-cyan-400 border-cyan-500/40",
        };
      default:
        return {
          bg: "bg-gray-700",
          text: "text-gray-300",
          border: "border-gray-600",
          badge: "bg-gray-700 text-gray-300 border-gray-600",
        };
    }
  };

  const planColor = getPlanColor(plan.name);

  // Características del plan según su tipo
  const getFeatures = () => {
    const baseFeatures = [
      "Dashboard empresarial",
      "Gestión de inventario",
      "Punto de venta (POS)",
      "Reportes básicos",
    ];

    if (plan.name === "standard") {
      return [
        ...baseFeatures,
        "Múltiples sucursales",
        "Múltiples cajas",
        "Reportes avanzados",
        "Soporte prioritario",
      ];
    } else if (plan.name === "custom") {
      return [
        ...baseFeatures,
        "Múltiples sucursales",
        "Múltiples cajas",
        "Reportes avanzados",
        "Soporte prioritario 24/7",
        "API personalizada",
        "Módulos personalizados",
        "Capacitación incluida",
      ];
    }

    return baseFeatures;
  };

  const features = getFeatures();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        className={`w-full max-w-2xl border rounded-xl shadow-2xl my-8 ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-[#1a2332] border-white/10"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            theme === "light"
              ? "border-gray-200 bg-gray-50"
              : "border-white/10 bg-[#232d3f]"
          }`}
        >
          <h3
            className={`font-bold text-lg flex items-center gap-3 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}
          >
            <Eye className="w-5 h-5 text-primary" />
            Detalles del Plan
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
        <div className="p-6 space-y-6">
          {/* Plan Header */}
          <div className="text-center pb-6 border-b border-gray-200 dark:border-white/10">
            <span
              className={`inline-flex px-4 py-1.5 rounded-lg text-sm font-medium border mb-4 ${planColor.badge}`}
            >
              {plan.displayName}
            </span>
            <div className="flex items-baseline justify-center gap-2 mb-3">
              <span className="text-primary text-4xl font-bold">
                ${plan.price}
              </span>
              <span
                className={`text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                /mes
              </span>
            </div>
            <p
              className={`text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {plan.description}
            </p>
          </div>

          {/* Recursos del Plan */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package
                className={`w-5 h-5 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              />
              <h4
                className={`font-semibold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Recursos Incluidos
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className={`border rounded-lg p-4 ${
                  theme === "light"
                    ? "bg-blue-50 border-blue-200"
                    : "bg-blue-500/10 border-blue-500/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span
                    className={`text-xs font-medium ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Usuarios
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {plan.maxUsers}
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 ${
                  theme === "light"
                    ? "bg-green-50 border-green-200"
                    : "bg-green-500/10 border-green-500/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-green-500" />
                  <span
                    className={`text-xs font-medium ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Sucursales
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {plan.maxBranches}
                </p>
              </div>

              <div
                className={`border rounded-lg p-4 ${
                  theme === "light"
                    ? "bg-purple-50 border-purple-200"
                    : "bg-purple-500/10 border-purple-500/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-purple-500" />
                  <span
                    className={`text-xs font-medium ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Cajas
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {plan.maxCashRegisters}
                </p>
              </div>
            </div>
          </div>

          {/* Características del Plan */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2
                className={`w-5 h-5 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              />
              <h4
                className={`font-semibold ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Características
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-3 rounded-lg border ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200"
                      : "bg-[#0f1621] border-white/10"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span
                    className={`text-sm ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
            theme === "light"
              ? "border-gray-200 bg-gray-50"
              : "border-white/10 bg-[#1a2332]"
          }`}
        >
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
