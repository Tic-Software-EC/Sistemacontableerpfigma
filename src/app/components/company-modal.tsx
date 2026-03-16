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
  Image,
  RotateCcw,
  Globe,
  Shield,
  Settings,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { RegionalSettingsTab } from "./company-settings-tabs";

// Company Modal Component
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
  adminUsername: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  companyDomain: string;
  startDate: string;
  expiresAt: string;
  monthlyPrice: number;
  nextPaymentDay: number;
  autoRenewal: boolean;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  subscriptionMonths: number;
  hasDiscount: boolean;
  discountStartMonth: number;
  discountPercentage: number;
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
  "#E8692E", "#F97316", "#EF4444", "#EC4899", "#A855F7", "#8B5CF6",
  "#6366F1", "#4A90E2", "#06B6D4", "#14B8A6", "#10B981", "#84CC16",
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
  const [activeTab, setActiveTab] = useState<"general" | "subscription" | "personalization" | "settings">("general");
  const { theme } = useTheme();

  if (!isOpen) return null;

  // Calcular precio total con descuentos y fechas automáticamente
  const calculateSubscriptionDetails = (
    monthlyPrice: number,
    months: number,
    startDate: string
  ) => {
    let totalPrice = 0;
    let discount = 0;
    let discountLabel = "";

    // Aplicar descuento personalizado si está configurado
    if (formData.hasDiscount && months >= formData.discountStartMonth) {
      discount = formData.discountPercentage;
      discountLabel = `Descuento (${discount}% desde mes ${formData.discountStartMonth})`;
      totalPrice = monthlyPrice * months * (1 - discount / 100);
    } else {
      discount = 0;
      discountLabel = "";
      totalPrice = monthlyPrice * months;
    }

    // Calcular fecha de vencimiento desde la fecha de inicio
    let expirationDate = new Date(startDate || new Date());
    expirationDate.setMonth(expirationDate.getMonth() + months);

    // Validar que las fechas sean válidas
    if (isNaN(expirationDate.getTime())) {
      const fallbackDate = new Date();
      fallbackDate.setMonth(fallbackDate.getMonth() + (months || 1));
      return {
        subtotal: (monthlyPrice * months).toFixed(2),
        discount,
        discountLabel,
        totalPrice: totalPrice.toFixed(2),
        expiresAt: fallbackDate.toISOString().split("T")[0],
      };
    }

    return {
      subtotal: (monthlyPrice * months).toFixed(2),
      discount,
      discountLabel,
      totalPrice: totalPrice.toFixed(2),
      expiresAt: expirationDate.toISOString().split("T")[0],
    };
  };

  const subscriptionDetails = calculateSubscriptionDetails(
    formData.monthlyPrice || 0,
    formData.subscriptionMonths || 1,
    formData.startDate
  );

  const handleMonthsChange = (months: number) => {
    const validMonths = Math.max(1, Math.min(120, months));
    const details = calculateSubscriptionDetails(
      formData.monthlyPrice,
      validMonths,
      formData.startDate
    );
    setFormData({
      ...formData,
      subscriptionMonths: validMonths,
      expiresAt: details.expiresAt,
    });
  };

  const handleStartDateChange = (newStartDate: string) => {
    const details = calculateSubscriptionDetails(
      formData.monthlyPrice,
      formData.subscriptionMonths,
      newStartDate
    );
    setFormData({
      ...formData,
      startDate: newStartDate,
      expiresAt: details.expiresAt,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      alert("Formato de archivo no válido. Por favor, seleccione PNG, JPG, GIF o SVG.");
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("El archivo es demasiado grande. El tamaño máximo es 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`w-full max-w-5xl border rounded-xl p-4 my-8 ${
        theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between mb-3 pb-3 border-b ${
          theme === "light" ? "border-gray-200" : "border-white/10"
        }`}>
          <div>
            <h3 className={`font-bold text-lg flex items-center gap-2 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary" />
              </div>
              {isEdit ? "Editar Empresa" : "Nueva Empresa"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === "light" 
                ? "text-gray-400 hover:text-gray-900 hover:bg-gray-100" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex items-center gap-1 mb-4 border-b overflow-x-auto ${
          theme === "light" ? "border-gray-200" : "border-white/10"
        }`}>
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
              activeTab === "general"
                ? theme === "light"
                  ? "border-primary text-gray-900"
                  : "border-primary text-white"
                : theme === "light"
                  ? "border-transparent text-gray-400 hover:text-gray-900"
                  : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Información General
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
              activeTab === "subscription"
                ? theme === "light"
                  ? "border-primary text-gray-900"
                  : "border-primary text-white"
                : theme === "light"
                  ? "border-transparent text-gray-400 hover:text-gray-900"
                  : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Suscripción
          </button>
          <button
            onClick={() => setActiveTab("personalization")}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
              activeTab === "personalization"
                ? theme === "light"
                  ? "border-primary text-gray-900"
                  : "border-primary text-white"
                : theme === "light"
                  ? "border-transparent text-gray-400 hover:text-gray-900"
                  : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Palette className="w-4 h-4" />
            Personalización
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
              activeTab === "settings"
                ? theme === "light"
                  ? "border-primary text-gray-900"
                  : "border-primary text-white"
                : theme === "light"
                  ? "border-transparent text-gray-400 hover:text-gray-900"
                  : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            Configuración Regional
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[300px]">
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
                <div className="space-y-4">
                  {/* Fila 1: Nombre, RUC, Email */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        Nombre de la Empresa <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
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
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
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
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                            : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                        }`}
                        placeholder="email@empresa.com"
                      />
                    </div>
                  </div>

                  {/* Fila 2: Teléfono, Dominio */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        Teléfono <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                            : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                        }`}
                        placeholder="+593 99 123 4567"
                      />
                    </div>

                    <div>
                      <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        Dominio de la Empresa <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyDomain}
                        onChange={(e) => setFormData({ ...formData, companyDomain: e.target.value.toLowerCase() })}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                            : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                        }`}
                        placeholder="miempresa"
                      />
                      <p className={`text-xs mt-1.5 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                        Acceso: <span className="text-primary font-medium">{formData.companyDomain || "miempresa"}.ticsoftec.com</span>
                      </p>
                    </div>
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
                <div className="space-y-4">
                  {/* Fila 3: Nombre, Usuario, Email */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        Nombre del Administrador <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.admin}
                        onChange={(e) => setFormData({ ...formData, admin: e.target.value })}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                            : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                        }`}
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div>
                      <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        Username (Usuario) <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.adminUsername}
                        onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value.toLowerCase() })}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                            : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                        }`}
                        placeholder="jperez"
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
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                            : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                        }`}
                        placeholder="admin@empresa.com"
                      />
                    </div>
                  </div>

                  {/* Fila 4: Teléfono, Contraseña */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        Teléfono del Administrador <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.adminPhone}
                        onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                            : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                        }`}
                        placeholder="+593 99 123 4567"
                      />
                    </div>

                    <div>
                      <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        Contraseña Inicial (opcional)
                      </label>
                      <div className="relative">
                        <Key className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "light" ? "text-gray-400" : "text-gray-600"}`} />
                        <input
                          type="text"
                          className={`w-full pl-10 pr-3 py-1.5 border rounded-lg text-sm focus:outline-none ${
                            theme === "light"
                              ? "bg-gray-100 border-gray-200 text-gray-500 placeholder:text-gray-400"
                              : "bg-[#0f1621] border-white/10 text-gray-600 placeholder:text-gray-600"
                          }`}
                          placeholder="Se genera automáticamente"
                          disabled
                        />
                      </div>
                      <p className={`text-xs mt-1.5 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                        Se generará una contraseña segura automáticamente
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Suscripción */}
          {activeTab === "subscription" && (
            <div className="space-y-4">
              {/* Selección de Plan */}
              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Seleccionar Plan <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => handlePlanChange(e.target.value as any)}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                    theme === "light"
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-[#0f1621] border-white/10 text-white"
                  }`}
                >
                  <option value="free">Gratuito - 1 Usuario, 1 Sucursal, Básico</option>
                  <option value="standard">Estándar - 5 Usuarios, 3 Sucursales, Completo</option>
                  <option value="custom">Personalizado - Ilimitado, A medida</option>
                </select>
              </div>

              {/* Configuración del Plan */}
              {formData.plan === "custom" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Máx. Usuarios
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxUsers}
                      onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) || 1 })}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Máx. Sucursales
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxBranches}
                      onChange={(e) => setFormData({ ...formData, maxBranches: parseInt(e.target.value) || 1 })}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Máx. Cajas
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxCashRegisters}
                      onChange={(e) => setFormData({ ...formData, maxCashRegisters: parseInt(e.target.value) || 1 })}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Precio y Duración */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    Precio Mensual (USD)
                  </label>
                  <input
                    type="text"
                    value={`$${formData.monthlyPrice.toFixed(2)}`}
                    disabled
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none ${
                      theme === "light"
                        ? "bg-gray-100 border-gray-200 text-gray-600"
                        : "bg-[#0f1621]/50 border-white/5 text-gray-400"
                    }`}
                  />
                  <p className={`text-xs mt-1.5 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                    El precio se hereda del plan seleccionado
                  </p>
                </div>
                <div>
                  <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    Duración (meses)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={formData.subscriptionMonths}
                    onChange={(e) => handleMonthsChange(parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      theme === "light"
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-[#0f1621] border-white/10 text-white"
                    }`}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Resumen de Facturación */}
              <div className={`p-4 rounded-lg border ${
                theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#0f1621] border-white/10"
              }`}>
                <h4 className={`font-semibold text-sm mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  Resumen de Facturación
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={theme === "light" ? "text-gray-600" : "text-gray-400"}>
                      Subtotal ({formData.subscriptionMonths} {formData.subscriptionMonths === 1 ? "mes" : "meses"})
                    </span>
                    <span className={theme === "light" ? "text-gray-900" : "text-white"}>
                      ${subscriptionDetails.subtotal}
                    </span>
                  </div>
                  {subscriptionDetails.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{subscriptionDetails.discountLabel}</span>
                      <span>-{subscriptionDetails.discount}%</span>
                    </div>
                  )}
                  <div className={`flex justify-between pt-2 border-t font-semibold ${
                    theme === "light" ? "border-gray-200 text-gray-900" : "border-white/10 text-white"
                  }`}>
                    <span>Total a Pagar</span>
                    <span className="text-primary">${subscriptionDetails.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha de Inicio
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "light" ? "text-gray-400" : "text-gray-600"}`} />
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className={`w-full pl-10 pr-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha de Vencimiento
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "light" ? "text-gray-400" : "text-gray-600"}`} />
                    <input
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className={`w-full pl-10 pr-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-[#0f1621] border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Estado y Renovación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      theme === "light"
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-[#0f1621] border-white/10 text-white"
                    }`}
                  >
                    <option value="active">Activo</option>
                    <option value="trial">Prueba</option>
                    <option value="suspended">Suspendido</option>
                    <option value="expired">Vencido</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    Día de Próximo Pago
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.nextPaymentDay}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(31, parseInt(e.target.value) || 1));
                      setFormData({ ...formData, nextPaymentDay: value });
                    }}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      theme === "light"
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-[#0f1621] border-white/10 text-white"
                    }`}
                    placeholder="1-31"
                  />
                  <p className={`text-xs mt-1.5 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                    Día del mes para el cobro automático
                  </p>
                </div>
              </div>

              {/* Renovación Automática */}
              <div>
                <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Renovación Automática
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, autoRenewal: !formData.autoRenewal })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.autoRenewal ? "bg-primary" : theme === "light" ? "bg-gray-300" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.autoRenewal ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                    {formData.autoRenewal ? "Activada" : "Desactivada"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Personalización */}
          {activeTab === "personalization" && (
            <div className="space-y-4">
              {/* Logo de la Empresa */}
              <div className={`border rounded-xl p-4 ${
                theme === "light" 
                  ? "bg-white border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                    <Image className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                  </div>
                  <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Logo de la Empresa</h4>
                </div>

                <div className="flex items-start gap-3">
                  {/* Preview del logo */}
                  <div className={`w-20 h-20 rounded-lg border flex items-center justify-center flex-shrink-0 ${
                    theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#0f1621] border-white/10"
                  }`}>
                    {formData.logo ? (
                      <img 
                        src={formData.logo} 
                        alt="Logo"
                        className="w-full h-full object-contain rounded-lg p-1.5"
                      />
                    ) : (
                      <Building2 className={`w-8 h-8 ${theme === "light" ? "text-gray-300" : "text-gray-600"}`} />
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex-1">
                    <label 
                      htmlFor="logo-upload"
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer transition-all ${
                        theme === "light"
                          ? "bg-gray-50 border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-700"
                          : "bg-[#0f1621] border-white/20 hover:border-primary hover:bg-primary/5 text-gray-300"
                      }`}
                    >
                      <Upload className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Subir logo (PNG, JPG, SVG • Max 2MB)</span>
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/png,image/jpg,image/jpeg,image/gif,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    {formData.logo && (
                      <button
                        onClick={() => setFormData({ ...formData, logo: "" })}
                        className={`flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          theme === "light"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-red-400 hover:bg-red-500/10"
                        }`}
                      >
                        <X className="w-3 h-3" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Colores de Marca */}
              <div className={`border rounded-xl p-4 ${
                theme === "light" 
                  ? "bg-white border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                    <Palette className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                  </div>
                  <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Colores de Marca</h4>
                </div>

                {/* Color Primario y Secundario en grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Color Primario */}
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                      Color Primario
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-lg border flex-shrink-0 ${
                          theme === "light" ? "border-gray-200" : "border-white/10"
                        }`}
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className={`flex-1 px-2.5 py-1.5 border rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-gray-50 border-gray-200 text-gray-900"
                            : "bg-[#0f1621] border-white/10 text-white"
                        }`}
                        placeholder="#E8692E"
                        maxLength={7}
                      />
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-10 h-10 bg-transparent border rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Color Secundario */}
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                      Color Secundario
                    </label>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-lg border flex-shrink-0 ${
                          theme === "light" ? "border-gray-200" : "border-white/10"
                        }`}
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className={`flex-1 px-2.5 py-1.5 border rounded-lg text-xs font-mono uppercase focus:outline-none focus:border-primary/50 ${
                          theme === "light"
                            ? "bg-gray-50 border-gray-200 text-gray-900"
                            : "bg-[#0f1621] border-white/10 text-white"
                        }`}
                        placeholder="#0D1B2A"
                        maxLength={7}
                      />
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-10 h-10 bg-transparent border rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Configuración Regional */}
          {activeTab === "settings" && (
            <RegionalSettingsTab formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 mt-6 pt-4 border-t ${
          theme === "light" ? "border-gray-200" : "border-white/10"
        }`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              theme === "light"
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
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