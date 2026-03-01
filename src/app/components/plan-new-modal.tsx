import { useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  X,
  Save,
  Sparkles,
  Percent,
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
  annualDiscount?: number;
  hasAnnualDiscount?: boolean;
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
    buttonColor: "bg-primary",
    cardBorder: "border-primary",
    annualDiscount: 0,
    hasAnnualDiscount: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    displayName: "",
  });

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {
      name: "",
      displayName: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "El ID del plan es requerido";
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = "El nombre del plan es requerido";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.displayName;
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
      annualDiscount: formData.annualDiscount,
      hasAnnualDiscount: formData.hasAnnualDiscount,
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
      buttonColor: "bg-primary",
      cardBorder: "border-primary",
      annualDiscount: 0,
      hasAnnualDiscount: false,
    });
    setErrors({ name: "", displayName: "" });
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
          {/* Nombre ID del Plan */}
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              ID del Plan <span className="text-red-500">*</span>
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
              placeholder="ej: premium, enterprise, pro"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Nombre Visible del Plan */}
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
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                theme === "light"
                  ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
              } ${errors.displayName ? "border-red-500" : ""}`}
              placeholder="ej: Premium, Enterprise, Pro"
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
            )}
          </div>

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
                placeholder="0"
              />
            </div>
          </div>

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
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      buttonColor: option.value,
                      cardBorder: option.border,
                    })
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all border-2 ${
                    formData.buttonColor === option.value
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
              ))
            }
            </div>
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
                        : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
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
