import { useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  Palette,
  Plus,
  X,
  Key,
  Package,
  Save,
  Upload,
  Calendar,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface CompanyFormData {
  name: string;
  ruc: string;
  email: string;
  phone: string;
  plan: "free" | "standard" | "custom";
  status: "active" | "trial" | "suspended" | "expired";
  maxUsers: number;
  maxBranches: number;
  maxCashRegisters: number;
  admin: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  expiresAt: string;
  monthlyPrice: number;
  nextPayment: string;
  autoRenewal: boolean;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  subscriptionMonths: number;
}

interface CompanyModalProps {
  isOpen: boolean;
  isEdit: boolean;
  formData: CompanyFormData;
  setFormData: (data: CompanyFormData) => void;
  onClose: () => void;
  onSave: () => void;
  handlePlanChange: (plan: "free" | "standard" | "custom") => void;
}

const predefinedColors = [
  "#4A90E2", "#10B981", "#F97316", "#A855F7", "#EC4899", "#06B6D4",
  "#EF4444", "#F59E0B", "#6366F1", "#14B8A6", "#84CC16", "#8B5CF6",
];

export function CompanyModal({
  isOpen,
  isEdit,
  formData,
  setFormData,
  onClose,
  onSave,
  handlePlanChange,
}: CompanyModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "subscription" | "personalization">("general");
  const [logoError, setLogoError] = useState("");
  const { theme } = useTheme();

  if (!isOpen) return null;

  // Calcular precio total con descuentos y fechas automáticamente
  const calculateSubscriptionDetails = (
    monthlyPrice: number,
    months: number
  ) => {
    const today = new Date();
    let totalPrice = 0;
    let discount = 0;
    let discountLabel = "";

    // Aplicar descuentos según cantidad de meses
    if (months >= 12) {
      // Descuento del 10% para suscripciones anuales (12+ meses)
      discount = 10;
      discountLabel = "Descuento Anual (10%)";
      totalPrice = monthlyPrice * months * 0.90; // 10% de descuento
    } else if (months >= 6) {
      // Descuento del 5% para suscripciones semestrales (6-11 meses)
      discount = 5;
      discountLabel = "Descuento Semestral (5%)";
      totalPrice = monthlyPrice * months * 0.95; // 5% de descuento
    } else {
      // Sin descuento para menos de 6 meses
      discount = 0;
      discountLabel = "";
      totalPrice = monthlyPrice * months;
    }

    // Calcular fechas
    let expirationDate = new Date(today);
    expirationDate.setMonth(expirationDate.getMonth() + months);
    
    let nextPaymentDate = new Date(today);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + months);

    // Validar que las fechas sean válidas
    if (isNaN(expirationDate.getTime()) || isNaN(nextPaymentDate.getTime())) {
      const fallbackDate = new Date();
      fallbackDate.setMonth(fallbackDate.getMonth() + (months || 1));
      return {
        subtotal: (monthlyPrice * months).toFixed(2),
        discount,
        discountLabel,
        totalPrice: totalPrice.toFixed(2),
        expiresAt: fallbackDate.toISOString().split("T")[0],
        nextPayment: fallbackDate.toISOString().split("T")[0],
      };
    }

    return {
      subtotal: (monthlyPrice * months).toFixed(2),
      discount,
      discountLabel,
      totalPrice: totalPrice.toFixed(2),
      expiresAt: expirationDate.toISOString().split("T")[0],
      nextPayment: nextPaymentDate.toISOString().split("T")[0],
    };
  };

  const subscriptionDetails = calculateSubscriptionDetails(
    formData.monthlyPrice || 0,
    formData.subscriptionMonths || 1
  );

  const handleMonthsChange = (months: number) => {
    const validMonths = Math.max(1, Math.min(120, months)); // 1-120 meses (10 años)
    const details = calculateSubscriptionDetails(
      formData.monthlyPrice,
      validMonths
    );
    setFormData({
      ...formData,
      subscriptionMonths: validMonths,
      expiresAt: details.expiresAt,
      nextPayment: details.nextPayment,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setLogoError("Formato no válido. Solo JPG, PNG, GIF o SVG");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setLogoError("El archivo es muy grande. Tamaño máximo: 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result as string });
      setLogoError("");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`w-full max-w-3xl border rounded-xl shadow-2xl my-8 ${
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
            <Plus className="w-5 h-5 text-primary" />
            {isEdit ? "Editar Empresa" : "Registrar Nueva Empresa"}
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

        {/* Tabs */}
        <div className={`flex gap-1 px-6 pt-4 ${
          theme === "light" ? "bg-white" : "bg-[#1a2332]"
        }`}>
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all text-sm font-medium ${
              activeTab === "general"
                ? theme === "light"
                  ? "bg-gray-50 text-gray-900 border-t-2 border-primary"
                  : "bg-[#232d3f] text-white border-t-2 border-primary"
                : theme === "light"
                ? "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Información General
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all text-sm font-medium ${
              activeTab === "subscription"
                ? theme === "light"
                  ? "bg-gray-50 text-gray-900 border-t-2 border-primary"
                  : "bg-[#232d3f] text-white border-t-2 border-primary"
                : theme === "light"
                ? "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Suscripción
          </button>
          <button
            onClick={() => setActiveTab("personalization")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all text-sm font-medium ${
              activeTab === "personalization"
                ? theme === "light"
                  ? "bg-gray-50 text-gray-900 border-t-2 border-primary"
                  : "bg-[#232d3f] text-white border-t-2 border-primary"
                : theme === "light"
                ? "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Palette className="w-4 h-4" />
            Personalización
          </button>
        </div>

        {/* Content */}
        <div className={`p-6 space-y-5 h-[500px] overflow-y-auto ${
          theme === "light" ? "bg-gray-50" : "bg-[#232d3f]"
        }`}>
          {/* Tab 1: Información General */}
          {activeTab === "general" && (
            <>
              {/* Información de la Empresa */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                    <Building2 className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                  </div>
                  <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Información de la Empresa</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Nombre de la Empresa <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                          : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                      }`}
                      placeholder="Nombre completo"
                    />
                  </div>

                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      RUC <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ruc}
                      onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                          : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                      }`}
                      placeholder="1792345678001"
                      maxLength={13}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                          : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                      }`}
                      placeholder="email@empresa.com"
                    />
                  </div>

                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Teléfono <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                          : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                      }`}
                      placeholder="+593 99 123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Administrador Principal */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                    <Users className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                  </div>
                  <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Administrador Principal</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Nombre del Administrador <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.admin}
                      onChange={(e) => setFormData({ ...formData, admin: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                          : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                      }`}
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Email del Administrador <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                          : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                      }`}
                      placeholder="admin@empresa.com"
                    />
                  </div>

                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Teléfono del Administrador <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.adminPhone}
                      onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                          : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                      }`}
                      placeholder="+593 99 123 4567"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Contraseña Inicial (opcional)
                    </label>
                    <div className="relative">
                      <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "light" ? "text-gray-400" : "text-gray-600"}`} />
                      <input
                        type="text"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none ${
                          theme === "light"
                            ? "bg-gray-100 border-gray-200 text-gray-500 placeholder:text-gray-400"
                            : "bg-[#0f1621] border-white/10 text-gray-600 placeholder:text-gray-600"
                        }`}
                        placeholder="Dejar vacío para generar automáticamente"
                        disabled
                      />
                    </div>
                    <p className={`text-xs mt-2 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                      Si no especifica una contraseña, se generará una automáticamente de forma segura
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Suscripción */}
          {activeTab === "subscription" && (
            <>
              {/* Configuración de Suscripción */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                    <CreditCard className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                  </div>
                  <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Configuración de Suscripción</h4>
                </div>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Plan <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.plan}
                      onChange={(e) => handlePlanChange(e.target.value as any)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                    >
                      <option value="free">Gratuito - $0.00/mes</option>
                      <option value="standard">Standard - ${formData.plan === "standard" ? formData.monthlyPrice.toFixed(2) : "99.00"}/mes</option>
                      <option value="custom">Personalizado</option>
                    </select>
                  </div>

                  {formData.plan === "custom" && (
                    <div>
                      <label className={`block text-xs mb-2 flex items-center gap-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        <span className="text-primary">💰</span>
                        Precio Mensual <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.monthlyPrice}
                        onChange={(e) => setFormData({ ...formData, monthlyPrice: parseFloat(e.target.value) || 0 })}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-white border-gray-200 text-gray-900"
                            : "bg-[#0f1621] border-white/10 text-white"
                        }`}
                        placeholder="$99.00"
                      />
                    </div>
                  )}
                </div>

                {/* Características del Plan */}
                <div className={`border rounded-lg p-3 mb-4 ${
                  theme === "light"
                    ? "bg-white border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Plan {formData.plan === "free" ? "Gratuito" : formData.plan === "standard" ? "Standard" : "Personalizado"}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{formData.maxUsers}</span>
                      <span className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>usuarios</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-green-400" />
                      <span className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{formData.maxBranches}</span>
                      <span className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>sucursales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-purple-400" />
                      <span className={`text-sm font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{formData.maxCashRegisters}</span>
                      <span className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>cajas</span>
                    </div>
                  </div>

                  {formData.plan === "custom" && (
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t ${
                      theme === "light" ? "border-gray-200" : "border-white/10"
                    }`}>
                      <div>
                        <label className={`block text-xs mb-1.5 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                          Usuarios
                        </label>
                        <input
                          type="number"
                          value={formData.maxUsers}
                          onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || 1 })}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                            theme === "light"
                              ? "bg-gray-50 border-gray-200 text-gray-900"
                              : "bg-[#1a2332] border-white/10 text-white"
                          }`}
                          min="1"
                        />
                      </div>

                      <div>
                        <label className={`block text-xs mb-1.5 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                          Sucursales
                        </label>
                        <input
                          type="number"
                          value={formData.maxBranches}
                          onChange={(e) => setFormData({ ...formData, maxBranches: parseInt(e.target.value) || 1 })}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                            theme === "light"
                              ? "bg-gray-50 border-gray-200 text-gray-900"
                              : "bg-[#1a2332] border-white/10 text-white"
                          }`}
                          min="1"
                        />
                      </div>

                      <div>
                        <label className={`block text-xs mb-1.5 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                          Cajas
                        </label>
                        <input
                          type="number"
                          value={formData.maxCashRegisters}
                          onChange={(e) => setFormData({ ...formData, maxCashRegisters: parseInt(e.target.value) || 1 })}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                            theme === "light"
                              ? "bg-gray-50 border-gray-200 text-gray-900"
                              : "bg-[#1a2332] border-white/10 text-white"
                          }`}
                          min="1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Período de Suscripción */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Meses de Suscripción <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={formData.subscriptionMonths}
                      onChange={(e) => handleMonthsChange(parseInt(e.target.value) || 1)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                      placeholder="1"
                    />
                    <p className={`text-xs mt-1.5 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                      <span className="text-green-400">✓</span> 6-11 meses: 5% descuento | 
                      <span className="text-green-400 ml-1">✓</span> 12+ meses: 10% descuento
                    </p>
                  </div>
                </div>

                {/* Resumen de Pago */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Resumen de Pago</span>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />
                      <span className="text-primary text-lg font-bold">
                        ${subscriptionDetails.totalPrice}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className={`rounded-lg p-2.5 ${
                      theme === "light" ? "bg-white/70" : "bg-[#0f1621]/50"
                    }`}>
                      <div className={theme === "light" ? "text-gray-600 mb-1" : "text-gray-500 mb-1"}>Período</div>
                      <div className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        {formData.subscriptionMonths} {formData.subscriptionMonths === 1 ? "Mes" : "Meses"}
                      </div>
                    </div>
                    <div className={`rounded-lg p-2.5 ${
                      theme === "light" ? "bg-white/70" : "bg-[#0f1621]/50"
                    }`}>
                      <div className={theme === "light" ? "text-gray-600 mb-1" : "text-gray-500 mb-1"}>Inicio</div>
                      <div className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        {new Date().toLocaleDateString("es-EC")}
                      </div>
                    </div>
                    <div className={`rounded-lg p-2.5 ${
                      theme === "light" ? "bg-white/70" : "bg-[#0f1621]/50"
                    }`}>
                      <div className={theme === "light" ? "text-gray-600 mb-1" : "text-gray-500 mb-1"}>Expira</div>
                      <div className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        {new Date(subscriptionDetails.expiresAt).toLocaleDateString("es-EC")}
                      </div>
                    </div>
                  </div>

                  {subscriptionDetails.discount > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
                      <div className={`rounded-lg p-2.5 ${
                        theme === "light" ? "bg-white/70" : "bg-[#0f1621]/50"
                      }`}>
                        <div className={theme === "light" ? "text-gray-600 mb-1" : "text-gray-500 mb-1"}>Subtotal</div>
                        <div className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                          ${subscriptionDetails.subtotal}
                        </div>
                      </div>
                      <div className={`rounded-lg p-2.5 ${
                        theme === "light" ? "bg-white/70" : "bg-[#0f1621]/50"
                      }`}>
                        <div className={theme === "light" ? "text-gray-600 mb-1" : "text-gray-500 mb-1"}>{subscriptionDetails.discountLabel}</div>
                        <div className="text-green-400 font-semibold">
                          -{subscriptionDetails.discount}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Auto Renovación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Auto Renovación <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.autoRenewal ? "yes" : "no"}
                      onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.value === "yes" })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                    >
                      <option value="yes">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tab 3: Personalización */}
          {activeTab === "personalization" && (
            <>
              {/* Logo de la Empresa */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                    <Palette className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                  </div>
                  <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Logo de la Empresa</h4>
                </div>
                
                <div className="flex items-start gap-4">
                  {/* Preview del Logo */}
                  <div className={`w-40 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
                    theme === "light"
                      ? "bg-white border-gray-300"
                      : "bg-[#0f1621] border-white/10"
                  }`}>
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                      <>
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-2 ${
                          theme === "light" ? "bg-gray-100" : "bg-white/5"
                        }`}>
                          <Building2 className={`w-8 h-8 ${theme === "light" ? "text-gray-400" : "text-gray-600"}`} />
                        </div>
                        <span className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>Sin logo</span>
                      </>
                    )}
                  </div>

                  {/* Información y Botón */}
                  <div className="flex-1">
                    <p className={`text-xs mb-3 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      El logo aparecerá en el sistema de la empresa. Formatos aceptados: PNG, JPG, GIF, SVG.
                      <br />
                      Tamaño máximo: 2MB.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all cursor-pointer text-sm font-medium shadow-lg shadow-primary/20">
                      <Upload className="w-4 h-4" />
                      Subir Logo
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/svg+xml"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {logoError && (
                      <p className="text-red-400 text-xs mt-2">{logoError}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Primario */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                    <Palette className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                  </div>
                  <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Color Primario</h4>
                </div>
                
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, primaryColor: color })}
                      className={`w-full aspect-square rounded-lg transition-all ${
                        formData.primaryColor === color
                          ? theme === "light"
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-gray-50 scale-110"
                            : "ring-2 ring-white ring-offset-2 ring-offset-[#232d3f] scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-lg border-2 flex-shrink-0 ${
                      theme === "light" ? "border-gray-200" : "border-white/10"
                    }`}
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={formData.primaryColor}
                      readOnly
                      className={`w-28 px-3 py-2 border rounded-lg text-xs font-mono ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                    />
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className={`w-10 h-10 bg-transparent border rounded-lg cursor-pointer ${
                        theme === "light" ? "border-gray-200" : "border-white/10"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Color Secundario */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                    <Palette className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                  </div>
                  <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Color Secundario</h4>
                </div>
                
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={`secondary-${color}`}
                      onClick={() => setFormData({ ...formData, secondaryColor: color })}
                      className={`w-full aspect-square rounded-lg transition-all ${
                        formData.secondaryColor === color
                          ? theme === "light"
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-gray-50 scale-110"
                            : "ring-2 ring-white ring-offset-2 ring-offset-[#232d3f] scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-lg border-2 flex-shrink-0 ${
                      theme === "light" ? "border-gray-200" : "border-white/10"
                    }`}
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      readOnly
                      className={`w-28 px-3 py-2 border rounded-lg text-xs font-mono ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                    />
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className={`w-10 h-10 bg-transparent border rounded-lg cursor-pointer ${
                        theme === "light" ? "border-gray-200" : "border-white/10"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </>
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
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 text-sm font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? "Guardar Cambios" : "Crear Empresa"}
          </button>
        </div>
      </div>
    </div>
  );
}
