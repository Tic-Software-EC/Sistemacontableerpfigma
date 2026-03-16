import { useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  Package,
  X,
  Save,
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
  hasDiscount?: boolean;
  discountStartMonth?: number;
  discountPercentage?: number;
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
          {/* Grid: Precio, Usuarios, Sucursales, Cajas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Configuración de Descuento Personalizado */}
          <div className={`p-4 rounded-lg border ${
            theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Descuento Personalizado
              </h4>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasDiscount: !formData.hasDiscount })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.hasDiscount ? "bg-primary" : theme === "light" ? "bg-gray-300" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.hasDiscount ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {formData.hasDiscount && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    A partir de mes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.discountStartMonth || 1}
                    onChange={(e) => setFormData({ ...formData, discountStartMonth: Math.max(1, parseInt(e.target.value) || 1) })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                    }`}
                    placeholder="6"
                  />
                  <p className={`text-xs mt-1 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                    Ej: 6 meses = descuento desde el mes 6
                  </p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    Porcentaje de Descuento
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage || 0}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      setFormData({ ...formData, discountPercentage: value });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                    }`}
                    placeholder="10"
                  />
                  <p className={`text-xs mt-1 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                    Porcentaje entre 0% y 100%
                  </p>
                </div>
              </div>
            )}
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
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg border-2 flex-shrink-0 ${
                  theme === "light" ? "border-gray-300" : "border-white/10"
                }`}
                style={{ backgroundColor: (formData.buttonColor && formData.buttonColor.startsWith('#')) ? formData.buttonColor : '#E8692E' }}
              />
              <input
                type="color"
                value={(formData.buttonColor && formData.buttonColor.startsWith('#')) ? formData.buttonColor : '#E8692E'}
                onChange={(e) => {
                  const hexColor = e.target.value;
                  setFormData({
                    ...formData,
                    buttonColor: hexColor,
                    cardBorder: hexColor,
                  });
                }}
                className="w-16 h-12 bg-transparent border-2 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={(formData.buttonColor && formData.buttonColor.startsWith('#')) ? formData.buttonColor : '#E8692E'}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
                    setFormData({
                      ...formData,
                      buttonColor: value,
                      cardBorder: value,
                    });
                  }
                }}
                className={`flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                }`}
                placeholder="#E8692E"
                maxLength={7}
              />
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