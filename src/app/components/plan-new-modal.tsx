import { useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  X,
  Save,
  Sparkles,
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
  buttonColor: string;
  cardBorder: string;
  hasDiscount?: boolean;
  discountStartMonth?: number;
  discountPercentage?: number;
}

interface PlanNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: PlanData) => void;
}

export function PlanNewModal({
  isOpen,
  onClose,
  onSave,
}: PlanNewModalProps) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    price: 0,
    maxUsers: 1,
    maxBranches: 1,
    maxCashRegisters: 1,
    description: "",
    buttonColor: "#E8692E",
    cardBorder: "#E8692E",
    hasDiscount: false,
    discountStartMonth: 1,
    discountPercentage: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {
      name: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del plan es requerido";
    }

    setErrors(newErrors);
    return !newErrors.name;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newPlan: PlanData = {
      id: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      displayName: formData.displayName,
      price: formData.price,
      maxUsers: formData.maxUsers,
      maxBranches: formData.maxBranches,
      maxCashRegisters: formData.maxCashRegisters,
      description: formData.description,
      buttonColor: formData.buttonColor,
      cardBorder: formData.cardBorder,
      hasDiscount: formData.hasDiscount,
      discountStartMonth: formData.discountStartMonth,
      discountPercentage: formData.discountPercentage,
    };

    onSave(newPlan);
    
    // Resetear formulario
    setFormData({
      name: "",
      displayName: "",
      price: 0,
      maxUsers: 1,
      maxBranches: 1,
      maxCashRegisters: 1,
      description: "",
      buttonColor: "#E8692E",
      cardBorder: "#E8692E",
      hasDiscount: false,
      discountStartMonth: 1,
      discountPercentage: 0,
    });
    setErrors({ name: "" });
  };

  const colorOptions = [
    { value: "bg-primary", border: "border-primary", label: "Naranja (Primario)", color: "#E8692E" },
    { value: "bg-blue-500", border: "border-blue-500", label: "Azul", color: "#3B82F6" },
    { value: "bg-green-500", border: "border-green-500", label: "Verde", color: "#10B981" },
    { value: "bg-purple-500", border: "border-purple-500", label: "Morado", color: "#A855F7" },
    { value: "bg-cyan-500", border: "border-cyan-600", label: "Cyan", color: "#06B6D4" },
    { value: "bg-pink-500", border: "border-pink-500", label: "Rosa", color: "#EC4899" },
    { value: "bg-gray-600", border: "border-gray-700", label: "Gris", color: "#4B5563" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-2xl border rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-[#1a2332] border-white/10"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10 ${
            theme === "light"
              ? "border-gray-200 bg-gray-50"
              : "border-white/10 bg-[#232d3f]"
          }`}
        >
          <div>
            <h3
              className={`font-bold text-lg flex items-center gap-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              <Sparkles className="w-5 h-5 text-primary" />
              Crear Nuevo Plan
            </h3>
            <p
              className={`text-xs mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Configura un nuevo plan de suscripción para tus clientes
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
          {/* Nombre del Plan */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Nombre del Plan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                theme === "light"
                  ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
              } ${errors.name ? "border-red-500" : ""}`}
              placeholder="ej: Premium, Enterprise, Pro"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

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
                      : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
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
                      : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
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
                      : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
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
                      : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
                  }`}
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Configuración de Descuento Personalizado */}
          <div className={`p-4 rounded-lg border ${
            theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#0f1621] border-white/10"
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
                    value={formData.discountStartMonth}
                    onChange={(e) => setFormData({ ...formData, discountStartMonth: Math.max(1, parseInt(e.target.value) || 1) })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-[#1a2332] border-[#4a5f75] text-white placeholder:text-gray-500"
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
                    value={formData.discountPercentage}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      setFormData({ ...formData, discountPercentage: value });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-[#1a2332] border-[#4a5f75] text-white placeholder:text-gray-500"
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
                  : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
              }`}
              placeholder="Descripción del plan de suscripción"
            />
          </div>

          {/* Color del Plan (Hexadecimal) */}
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
                style={{ backgroundColor: formData.buttonColor.startsWith('#') ? formData.buttonColor : '#E8692E' }}
              />
              <input
                type="color"
                value={formData.buttonColor.startsWith('#') ? formData.buttonColor : '#E8692E'}
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
                value={formData.buttonColor.startsWith('#') ? formData.buttonColor : '#E8692E'}
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
                    : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
                }`}
                placeholder="#E8692E"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end gap-3 px-6 py-4 border-t sticky bottom-0 ${
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
            Crear Plan
          </button>
        </div>
      </div>
    </div>
  );
}