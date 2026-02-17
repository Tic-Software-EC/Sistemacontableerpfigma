import { X, Settings, Shield, Building2, FileText, Calculator, DollarSign, Users, Camera } from "lucide-react";
import { useState } from "react";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  const [activeTab, setActiveTab] = useState("preferences");
  const [theme, setTheme] = useState("Oscuro");
  const [language, setLanguage] = useState("Español");
  const [timezone, setTimezone] = useState("GMT-5 (Ecuador)");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(false);

  // Estados para Información de la Empresa
  const [companyName, setCompanyName] = useState("Comercial del Pacífico S.A.");
  const [ruc, setRuc] = useState("1234567890001");
  const [businessName, setBusinessName] = useState("Comercial del Pacífico S.A.");
  const [isAccountingRequired, setIsAccountingRequired] = useState(true);
  const [taxRegime, setTaxRegime] = useState("general");
  const [contributorType, setContributorType] = useState("especial");
  const [economicActivity, setEconomicActivity] = useState("Comercio al por mayor");
  const [retentionAgent, setRetentionAgent] = useState(true);
  const [ivaRate, setIvaRate] = useState("12");
  const [icePayer, setIcePayer] = useState(false);
  const [riseRegime, setRiseRegime] = useState(false);
  const [accountingStartDate, setAccountingStartDate] = useState("2024-01-01");
  const [fiscalYear, setFiscalYear] = useState("2024");
  const [legalRepresentative, setLegalRepresentative] = useState("Juan Carlos Pérez López");
  const [representativeId, setRepresentativeId] = useState("1234567890");
  const [address, setAddress] = useState("Av. Principal 123 y Secundaria");
  const [phone, setPhone] = useState("+593 2 123-4567");
  const [email, setEmail] = useState("contacto@comercialdelpacífico.com.ec");

  // Estados para Contadora de la Empresa
  const [accountantName, setAccountantName] = useState("María Fernanda González");
  const [accountantId, setAccountantId] = useState("1765432109");
  const [accountantLicense, setAccountantLicense] = useState("CPA-2024-1234");
  const [accountantPhone, setAccountantPhone] = useState("+593 99 876-5432");
  const [accountantEmail, setAccountantEmail] = useState("contadora@comercialdelpacífico.com.ec");

  // Estados para Seguridad
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [trustedDevices, setTrustedDevices] = useState(true);
  const [profileImage, setProfileImage] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    console.log("Guardando cambios...", {
      theme,
      language,
      timezone,
      emailNotifications,
      pushNotifications,
      systemAlerts,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a2332] border border-white/10 rounded-2xl w-full max-w-5xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-white font-bold text-2xl">Mis Preferencias</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar de pestañas */}
          <div className="w-72 bg-[#141d2b] border-r border-white/10 p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                  activeTab === "preferences"
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Preferencias</span>
              </button>

              

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                  activeTab === "security"
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Seguridad</span>
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === "preferences" && (
              <div className="space-y-8">
                {/* Configuración General */}
                <div>
                  <h3 className="text-white font-bold text-xl mb-6">
                    Configuración General
                  </h3>

                  <div className="space-y-5">
                    {/* Tema */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Tema
                      </label>
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="Oscuro">Oscuro</option>
                        <option value="Claro">Claro</option>
                        <option value="Automático">Automático</option>
                      </select>
                    </div>

                    {/* Idioma */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Idioma
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="Español">Español</option>
                        <option value="English">English</option>
                        <option value="Português">Português</option>
                      </select>
                    </div>

                    {/* Zona Horaria */}
                    
                  </div>
                </div>

                {/* Notificaciones */}
                <div>
                  <h3 className="text-white font-bold text-xl mb-6">
                    Notificaciones
                  </h3>

                  <div className="space-y-4">
                    {/* Notificaciones de email */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                          {emailNotifications && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        Notificaciones de email
                      </span>
                    </label>

                    {/* Notificaciones push */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                          {pushNotifications && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        Notificaciones push
                      </span>
                    </label>

                    {/* Alertas de sistema */}
                    
                  </div>
                </div>
              </div>
            )}

            {activeTab === "company" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">
                    Información de la Empresa
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Configuración de datos fiscales y contables
                  </p>
                </div>

                {/* Datos Generales */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h4 className="text-white font-bold text-lg">Datos Generales</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Razón Social
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        RUC
                      </label>
                      <input
                        type="text"
                        value={ruc}
                        onChange={(e) => setRuc(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-gray-300 text-sm mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Configuración Fiscal */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="w-5 h-5 text-primary" />
                    <h4 className="text-white font-bold text-lg">Configuración Fiscal</h4>
                  </div>

                  <div className="space-y-4">
                    {/* Obligado a llevar contabilidad */}
                    <label className="flex items-center gap-3 cursor-pointer group p-3 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isAccountingRequired}
                          onChange={(e) => setIsAccountingRequired(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                          {isAccountingRequired && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">Obligado a llevar contabilidad</span>
                        <p className="text-gray-400 text-xs">Según el SRI</p>
                      </div>
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Régimen Tributario
                        </label>
                        <select
                          value={taxRegime}
                          onChange={(e) => setTaxRegime(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                        >
                          <option value="general">Régimen General</option>
                          <option value="rimpe">RIMPE</option>
                          <option value="rise">RISE</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Tipo de Contribuyente
                        </label>
                        <select
                          value={contributorType}
                          onChange={(e) => setContributorType(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                        >
                          <option value="especial">Especial</option>
                          <option value="normal">Normal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Tarifa IVA
                        </label>
                        <select
                          value={ivaRate}
                          onChange={(e) => setIvaRate(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                        >
                          <option value="0">0%</option>
                          <option value="12">12%</option>
                          <option value="15">15%</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          Actividad Económica
                        </label>
                        <input
                          type="text"
                          value={economicActivity}
                          onChange={(e) => setEconomicActivity(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                        />
                      </div>
                    </div>

                    {/* Agente de retención */}
                    <label className="flex items-center gap-3 cursor-pointer group p-3 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={retentionAgent}
                          onChange={(e) => setRetentionAgent(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                          {retentionAgent && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">Agente de Retención</span>
                        <p className="text-gray-400 text-xs">Autorizado por el SRI</p>
                      </div>
                    </label>

                    {/* Sujeto a ICE */}
                    <label className="flex items-center gap-3 cursor-pointer group p-3 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={icePayer}
                          onChange={(e) => setIcePayer(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                          {icePayer && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-white font-medium text-sm">Sujeto a ICE</span>
                        <p className="text-gray-400 text-xs">Impuesto a Consumos Especiales</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Configuración Contable */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <h4 className="text-white font-bold text-lg">Configuración Contable</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Fecha Inicio Contabilidad
                      </label>
                      <input
                        type="date"
                        value={accountingStartDate}
                        onChange={(e) => setAccountingStartDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Año Fiscal
                      </label>
                      <input
                        type="text"
                        value={fiscalYear}
                        onChange={(e) => setFiscalYear(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Representante Legal */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h4 className="text-white font-bold text-lg">Representante Legal</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={legalRepresentative}
                        onChange={(e) => setLegalRepresentative(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Cédula / RUC
                      </label>
                      <input
                        type="text"
                        value={representativeId}
                        onChange={(e) => setRepresentativeId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Contadora de la Empresa */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-primary" />
                    <h4 className="text-white font-bold text-lg">Contadora de la Empresa</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={accountantName}
                        onChange={(e) => setAccountantName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Cédula / RUC
                      </label>
                      <input
                        type="text"
                        value={accountantId}
                        onChange={(e) => setAccountantId(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Licencia
                      </label>
                      <input
                        type="text"
                        value={accountantLicense}
                        onChange={(e) => setAccountantLicense(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={accountantPhone}
                        onChange={(e) => setAccountantPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={accountantEmail}
                        onChange={(e) => setAccountantEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">
                    Configuración de Seguridad
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Protege tu cuenta con configuraciones avanzadas de seguridad
                  </p>
                </div>

                {/* Foto de Perfil */}
                <div>
                  <h4 className="text-white font-bold text-lg mb-4">Foto de Perfil</h4>
                  
                  <div className="flex items-start gap-6 p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          "JD"
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">Actualizar foto de perfil</p>
                      <p className="text-gray-400 text-sm mb-4">
                        Formatos soportados: JPG, PNG o GIF. Tamaño máximo: 2MB
                      </p>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium text-sm cursor-pointer">
                          <Camera className="w-4 h-4" />
                          Subir foto
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  setProfileImage(event.target?.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden" 
                          />
                        </label>
                        <button 
                          onClick={() => setProfileImage("")}
                          className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cambiar Contraseña */}
                <div>
                  <h4 className="text-white font-bold text-lg mb-4">Cambiar Contraseña</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Contraseña actual
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña actual"
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Ingresa tu nueva contraseña"
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-500"
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas y números
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        Confirmar nueva contraseña
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-gray-500"
                      />
                    </div>

                    <button className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium text-sm">
                      Actualizar contraseña
                    </button>
                  </div>
                </div>

                {/* Autenticación de Dos Factores */}
                <div>
                  
                  
                  <div className="space-y-4">
                    

                    {twoFactorEnabled && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-green-400 font-medium text-sm mb-1">2FA Activado</p>
                            <p className="text-gray-400 text-xs">
                              Tu cuenta está protegida con autenticación de dos factores
                            </p>
                            <button className="mt-3 text-green-400 text-xs font-medium hover:underline">
                              Configurar aplicación de autenticación
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sesiones y Dispositivos */}
                <div>
                  <h4 className="text-white font-bold text-lg mb-4">Sesiones y Dispositivos</h4>
                  
                  <div className="space-y-4">
                    {/* Tiempo de sesión */}
                    <div>
                      
                      
                    </div>

                    {/* Notificaciones de inicio de sesión */}
                    <label className="flex items-center justify-between gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                      <div>
                        <span className="text-white font-medium text-sm">Notificar inicios de sesión</span>
                        <p className="text-gray-400 text-xs mt-0.5">
                          Recibe una notificación cada vez que alguien accede a tu cuenta
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={loginNotifications}
                          onChange={(e) => setLoginNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </div>
                    </label>

                    {/* Dispositivos de confianza */}
                    
                  </div>
                </div>

                {/* Sesiones Activas */}
                

                {/* Historial de Actividad */}
                <div>
                  <h4 className="text-white font-bold text-lg mb-4">Historial de Actividad Reciente</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-[#0f1825]/50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Inicio de sesión exitoso</p>
                        <p className="text-gray-400 text-xs mt-0.5">Hoy a las 14:30 • IP: 186.4.*.* (Quito)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-[#0f1825]/50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Contraseña actualizada</p>
                        <p className="text-gray-400 text-xs mt-0.5">15 Feb 2026 • IP: 186.4.*.*</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-[#0f1825]/50 rounded-lg">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">Inicio de sesión exitoso</p>
                        <p className="text-gray-400 text-xs mt-0.5">14 Feb 2026 • IP: 190.15.*.* (Guayaquil)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#141d2b]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}