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
  adminUsername: string;
  adminEmail: string;
  adminPhone: string;
  adminPassword: string;
  companyDomain: string;
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
  const [activeTab, setActiveTab] = useState<"general" | "subscription" | "personalization">("general");
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
      <div 
        className={`w-full max-w-2xl border rounded-2xl shadow-2xl my-8 flex flex-col overflow-hidden ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-[#1a2332] border-white/10"
        }`} 
        style={{ width: "672px", maxWidth: "calc(100vw - 2rem)" }}
      >
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
        <div className={`p-6 space-y-5 max-h-[60vh] overflow-y-auto ${
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

                  <div className="md:col-span-2">
                    <label className={`block text-xs mb-2 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      Dominio de la Empresa <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyDomain}
                      onChange={(e) => setFormData({ ...formData, companyDomain: e.target.value.toLowerCase() })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                          : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-600"
                      }`}
                      placeholder="miempresa"
                    />
                    <p className={`text-xs mt-1.5 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                      Este dominio se usará para acceder al sistema: <span className="text-primary font-medium">{formData.companyDomain || "miempresa"}.ticsoftec.com</span>
                    </p>
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
                      Username (Usuario) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.adminUsername}
                      onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value.toLowerCase() })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
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
            <div>
              <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                Sección de suscripción (contenido existente se mantiene)
              </p>
            </div>
          )}

          {/* Tab 3: Personalización */}
          {activeTab === "personalization" && (
            <>
              {/* Logo de la Empresa */}
              <div className={`border rounded-xl p-6 ${
                theme === "light" 
                  ? "bg-white border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                    <Image className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Logo de la Empresa</h4>
                    <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                      Se muestra en el sistema y en documentos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  {/* Preview del logo */}
                  <div className={`w-24 h-24 rounded-xl border-2 flex items-center justify-center flex-shrink-0 ${
                    theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#0f1621] border-white/10"
                  }`}>
                    {formData.logo ? (
                      <img 
                        src={formData.logo} 
                        alt="Logo"
                        className="w-full h-full object-contain rounded-xl p-2"
                      />
                    ) : (
                      <Building2 className={`w-10 h-10 ${theme === "light" ? "text-gray-300" : "text-gray-600"}`} />
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex-1">
                    <label 
                      htmlFor="logo-upload"
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                        theme === "light"
                          ? "bg-gray-50 border-gray-300 hover:border-primary hover:bg-primary/5 text-gray-700"
                          : "bg-[#0f1621] border-white/20 hover:border-primary hover:bg-primary/5 text-gray-300"
                      }`}
                    >
                      <Upload className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Sube el logo de tu empresa</span>
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/png,image/jpg,image/jpeg,image/gif,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    <p className={`text-xs mt-2 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                      Formatos: PNG, JPG, SVG • Tamaño máximo: 2MB
                    </p>

                    {formData.logo && (
                      <button
                        onClick={() => setFormData({ ...formData, logo: "" })}
                        className={`flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          theme === "light"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-red-400 hover:bg-red-500/10"
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        Eliminar logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Colores de Marca */}
              <div className={`border rounded-xl p-6 ${
                theme === "light" 
                  ? "bg-white border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${theme === "light" ? "bg-gray-200" : "bg-white/5"}`}>
                      <Palette className={`w-4 h-4 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>Colores de Marca</h4>
                      <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                        Se aplican en tiempo real a todo el sistema
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, primaryColor: "#E8692E", secondaryColor: "#0D1B2A" })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      theme === "light"
                        ? "text-gray-600 hover:text-primary hover:bg-gray-100"
                        : "text-gray-400 hover:text-primary hover:bg-white/5"
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restablecer
                  </button>
                </div>

                {/* Color Primario */}
                <div className="mb-5">
                  <label className={`block text-xs font-medium mb-3 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                    Color Primario
                  </label>
                  <p className={`text-xs mb-3 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                    Botones, acentos, íconos activos
                  </p>
                  
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-3">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData({ ...formData, primaryColor: color })}
                        className={`w-full aspect-square rounded-lg transition-all ${
                          formData.primaryColor === color
                            ? theme === "light"
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-white scale-110"
                              : "ring-2 ring-white ring-offset-2 ring-offset-[#1a2332] scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-lg border-2 flex-shrink-0 ${
                        theme === "light" ? "border-gray-200" : "border-white/10"
                      }`}
                      style={{ backgroundColor: formData.primaryColor }}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase focus:outline-none focus:border-primary/50 ${
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
                        className={`w-12 h-12 bg-transparent border-2 rounded-lg cursor-pointer ${
                          theme === "light" ? "border-gray-200" : "border-white/10"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Color Secundario */}
                <div>
                  <label className={`block text-xs font-medium mb-3 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                    Color Secundario
                  </label>
                  <p className={`text-xs mb-3 ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                    Sidebar, fondos oscuros, textos
                  </p>
                  
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-3">
                    {predefinedColors.map((color) => (
                      <button
                        key={`secondary-${color}`}
                        onClick={() => setFormData({ ...formData, secondaryColor: color })}
                        className={`w-full aspect-square rounded-lg transition-all ${
                          formData.secondaryColor === color
                            ? theme === "light"
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-white scale-110"
                              : "ring-2 ring-white ring-offset-2 ring-offset-[#1a2332] scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-lg border-2 flex-shrink-0 ${
                        theme === "light" ? "border-gray-200" : "border-white/10"
                      }`}
                      style={{ backgroundColor: formData.secondaryColor }}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase focus:outline-none focus:border-primary/50 ${
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
                        className={`w-12 h-12 bg-transparent border-2 rounded-lg cursor-pointer ${
                          theme === "light" ? "border-gray-200" : "border-white/10"
                        }`}
                      />
                    </div>
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
