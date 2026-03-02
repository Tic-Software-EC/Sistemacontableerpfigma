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
  displayName?: string;
  price: number;
  maxUsers: number;
  maxBranches: number;
  maxCashRegisters: number;
  description: string;
  buttonColor?: string;
  cardBorder?: string;
  annualDiscountPercent?: number;
  durationMonths?: number;
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
          className={`p-6 space-y-4 max-h-[calc(90vh-180px)] overflow-y-auto ${
            theme === "light" ? "bg-white" : "bg-[#232d3f]"
          }`}
        >
          {/* Grid: Precio, Duración y Descuento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Duración en Meses */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Duración (Meses)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.durationMonths || 12}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationMonths: parseInt(e.target.value) || 1,
                  })
                }
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                }`}
                placeholder="12"
              />
            </div>

            {/* Descuento (%) */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Descuento (%)
              </label>
              <div className="relative">
                <Percent
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.annualDiscountPercent || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      annualDiscountPercent: parseInt(e.target.value) || 0,
                    })
                  }
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                  }`}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Cálculo del Precio Total con Descuento */}
          {formData.price > 0 && (formData.durationMonths || 12) > 0 && (
            <div
              className={`border rounded-lg p-4 ${
                theme === "light"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-blue-500/10 border-blue-500/20"
              }`}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-xs font-medium mb-1 ${
                      theme === "light" ? "text-blue-800" : "text-blue-400"
                    }`}
                  >
                    Precio Total (sin descuento)
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      theme === "light" ? "text-blue-900" : "text-blue-300"
                    }`}
                  >
                    ${(formData.price * (formData.durationMonths || 12)).toFixed(2)}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      theme === "light" ? "text-blue-700" : "text-blue-400"
                    }`}
                  >
                    ${formData.price.toFixed(2)} × {formData.durationMonths || 12}{" "}
                    {(formData.durationMonths || 12) === 1 ? "mes" : "meses"}
                  </p>
                </div>

                {formData.annualDiscountPercent && formData.annualDiscountPercent > 0 && (
                  <div className={`border-l pl-4 ${
                    theme === "light" ? "border-blue-300" : "border-blue-500/30"
                  }`}>
                    <p
                      className={`text-xs font-medium mb-1 ${
                        theme === "light" ? "text-green-800" : "text-green-400"
                      }`}
                    >
                      Precio con {formData.annualDiscountPercent}% Descuento
                    </p>
                    <p
                      className={`text-xl font-bold ${
                        theme === "light" ? "text-green-900" : "text-green-300"
                      }`}
                    >
                      $
                      {(
                        formData.price *
                        (formData.durationMonths || 12) *
                        (1 - formData.annualDiscountPercent / 100)
                      ).toFixed(2)}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        theme === "light" ? "text-green-700" : "text-green-400"
                      }`}
                    >
                      Ahorro: $
                      {(
                        (formData.price *
                          (formData.durationMonths || 12) *
                          formData.annualDiscountPercent) /
                        100
                      ).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grid de Límites */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Usuarios Máximos */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}
              >
                Usuarios Máx.
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
                Sucursales Máx.
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
                Cajas Máx.
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

          {/* Color del Plan */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Color del Plan
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: "bg-primary", border: "border-primary", label: "Naranja (Primario)", color: "#E8692E" },
                { value: "bg-blue-500", border: "border-blue-500", label: "Azul", color: "#3B82F6" },
                { value: "bg-green-500", border: "border-green-500", label: "Verde", color: "#10B981" },
                { value: "bg-purple-500", border: "border-purple-500", label: "Morado", color: "#A855F7" },
                { value: "bg-cyan-500", border: "border-cyan-600", label: "Cyan", color: "#06B6D4" },
                { value: "bg-pink-500", border: "border-pink-500", label: "Rosa", color: "#EC4899" },
                { value: "bg-gray-600", border: "border-gray-700", label: "Gris", color: "#4B5563" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      buttonColor: option.value,
                      cardBorder: option.border,
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all border-2 ${
                    (formData.buttonColor || "bg-primary") === option.value
                      ? `${option.border} ${theme === "light" ? "bg-gray-100" : "bg-white/10"}`
                      : theme === "light"
                      ? "border-gray-200 bg-white hover:bg-gray-50"
                      : "border-white/10 bg-[#0f1621] hover:bg-white/5"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: option.color }}
                  ></div>
                  <span
                    className={
                      theme === "light" ? "text-gray-900" : "text-white"
                    }
                  >
                    {option.label}
                  </span>
                </button>
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