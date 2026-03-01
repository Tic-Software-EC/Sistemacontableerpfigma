import { useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  Package,
  X,
  Save,
  Percent,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface PlanData {
  name: string;
  price: number;
  maxUsers: number;
  maxBranches: number;
  maxCashRegisters: number;
  description: string;
  annualDiscount?: number;
  hasAnnualDiscount?: boolean;
}

interface PlanEditModalProps {
  isOpen: boolean;
  plan: PlanData | null;
  onClose: () => void;
  onSave: (plan: PlanData) => void;
}

export function PlanEditModal({
  isOpen,
  plan,
  onClose,
  onSave,
}: PlanEditModalProps) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<PlanData>(
    plan || {
      name: "",
      price: 0,
      maxUsers: 1,
      maxBranches: 1,
      maxCashRegisters: 1,
      description: "",
    }
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-2xl border rounded-xl shadow-2xl ${
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
          <div>
            <h3
              className={`font-bold text-lg ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Editar Plan {formData.name}
            </h3>
            <p
              className={`text-xs mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Configura los límites y precio del plan
            </p>
          </div>
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
        <div
          className={`p-6 space-y-4 ${
            theme === "light" ? "bg-white" : "bg-[#232d3f]"
          }`}
        >
          {/* Precio Mensual */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Precio Mensual (USD)
            </label>
            <div className="relative">
              <span
                className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-full pl-8 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                }`}
                placeholder="0"
              />
            </div>
          </div>

          {/* Usuarios Máximos */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Usuarios Máximos
            </label>
            <div className="relative">
              <Users
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <input
                type="number"
                min="1"
                value={formData.maxUsers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxUsers: parseInt(e.target.value) || 1,
                  })
                }
                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                }`}
                placeholder="1"
              />
            </div>
          </div>

          {/* Sucursales Máximas */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Sucursales Máximas
            </label>
            <div className="relative">
              <Building2
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <input
                type="number"
                min="1"
                value={formData.maxBranches}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxBranches: parseInt(e.target.value) || 1,
                  })
                }
                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                }`}
                placeholder="1"
              />
            </div>
          </div>

          {/* Cajas Máximas */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Cajas Máximas
            </label>
            <div className="relative">
              <CreditCard
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <input
                type="number"
                min="1"
                value={formData.maxCashRegisters}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxCashRegisters: parseInt(e.target.value) || 1,
                  })
                }
                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                }`}
                placeholder="1"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                theme === "light"
                  ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
              }`}
              placeholder="Plan gratuito para comenzar"
            />
          </div>

          {/* Descuento Anual */}
          <div className={`border rounded-lg p-4 ${
            theme === "light"
              ? "bg-gray-50 border-gray-200"
              : "bg-[#0f1621] border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <label className={`text-sm font-medium ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}>
                ¿Ofrece descuento por pago anual?
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    hasAnnualDiscount: !formData.hasAnnualDiscount,
                    annualDiscount: !formData.hasAnnualDiscount ? 0 : formData.annualDiscount,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.hasAnnualDiscount
                    ? "bg-primary"
                    : theme === "light"
                    ? "bg-gray-300"
                    : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.hasAnnualDiscount ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {formData.hasAnnualDiscount && (
              <div className="mt-3">
                <label className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}>
                  Porcentaje de descuento
                </label>
                <div className="relative">
                  <Percent className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`} />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.annualDiscount || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        annualDiscount: parseInt(e.target.value) || 0,
                      })
                    }
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                    }`}
                    placeholder="Ej: 20"
                  />
                </div>
                {formData.annualDiscount > 0 && (
                  <p className={`text-xs mt-2 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Precio anual: ${((formData.price * 12) * (1 - formData.annualDiscount / 100)).toFixed(2)} 
                    <span className="ml-1">(ahorro de ${((formData.price * 12) * (formData.annualDiscount / 100)).toFixed(2)})</span>
                  </p>
                )}
              </div>
            )}
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
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 text-sm font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}