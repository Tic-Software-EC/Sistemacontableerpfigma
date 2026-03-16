import { useState } from "react";
import { Globe, Shield, Languages, Calendar, Clock, DollarSign, Check } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface RegionalSettingsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function RegionalSettingsTab({ formData, setFormData }: RegionalSettingsProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // Estados para Configuración Regional
  const [language, setLanguage] = useState(formData.language || "es");
  const [country, setCountry] = useState(formData.country || "EC");
  const [dateFormat, setDateFormat] = useState(formData.dateFormat || "DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState(formData.timeFormat || "24");
  const [currency, setCurrency] = useState(formData.currency || "USD");
  const [timezone, setTimezone] = useState(formData.timezone || "America/Guayaquil");
  
  // Estados para Configuración de Seguridad
  const [twoFactorAuth, setTwoFactorAuth] = useState(formData.twoFactorAuth || false);
  const [passwordExpiry, setPasswordExpiry] = useState(formData.passwordExpiry || 90);
  const [sessionTimeout, setSessionTimeout] = useState(formData.sessionTimeout || 30);
  const [ipWhitelist, setIpWhitelist] = useState(formData.ipWhitelist || "");
  const [auditLog, setAuditLog] = useState(formData.auditLog || true);
  
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const IN = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
    isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
  }`;
  const OB = isLight ? "" : "bg-[#0D1B2A]";

  return (
    <div className="space-y-4">
      {/* SECCIÓN: CONFIGURACIÓN REGIONAL */}
      
      {/* Idioma y País */}
      <div className={`border rounded-xl p-5 ${
        isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`}>
            <Languages className={`w-4 h-4 ${isLight ? "text-gray-900" : "text-white"}`} />
          </div>
          <h4 className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
            Idioma y País
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs mb-2 font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Idioma del Sistema
            </label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className={IN}>
              <option value="es" className={OB}>Español</option>
              <option value="en" className={OB}>English</option>
              <option value="pt" className={OB}>Português</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs mb-2 font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              País
            </label>
            <select value={country} onChange={e => setCountry(e.target.value)} className={IN}>
              <option value="EC" className={OB}>Ecuador</option>
              <option value="CO" className={OB}>Colombia</option>
              <option value="PE" className={OB}>Perú</option>
              <option value="MX" className={OB}>México</option>
              <option value="AR" className={OB}>Argentina</option>
              <option value="CL" className={OB}>Chile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fecha y Hora */}
      <div className={`border rounded-xl p-5 ${
        isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`}>
            <Calendar className={`w-4 h-4 ${isLight ? "text-gray-900" : "text-white"}`} />
          </div>
          <h4 className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
            Fecha y Hora
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs mb-2 font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Formato de Fecha
            </label>
            <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className={IN}>
              <option value="DD/MM/YYYY" className={OB}>DD/MM/YYYY</option>
              <option value="MM/DD/YYYY" className={OB}>MM/DD/YYYY</option>
              <option value="YYYY-MM-DD" className={OB}>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs mb-2 font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Formato de Hora
            </label>
            <select value={timeFormat} onChange={e => setTimeFormat(e.target.value)} className={IN}>
              <option value="24" className={OB}>24 horas (14:30)</option>
              <option value="12" className={OB}>12 horas (2:30 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Moneda y Zona Horaria */}
      <div className={`border rounded-xl p-5 ${
        isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`}>
            <DollarSign className={`w-4 h-4 ${isLight ? "text-gray-900" : "text-white"}`} />
          </div>
          <h4 className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
            Moneda y Zona Horaria
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs mb-2 font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Moneda
            </label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} className={IN}>
              <option value="USD" className={OB}>USD - Dólar Estadounidense</option>
              <option value="EUR" className={OB}>EUR - Euro</option>
              <option value="COP" className={OB}>COP - Peso Colombiano</option>
              <option value="PEN" className={OB}>PEN - Sol Peruano</option>
              <option value="MXN" className={OB}>MXN - Peso Mexicano</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs mb-2 font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Zona Horaria
            </label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className={IN}>
              <option value="America/Guayaquil" className={OB}>América/Guayaquil (GMT-5)</option>
              <option value="America/Bogota" className={OB}>América/Bogotá (GMT-5)</option>
              <option value="America/Lima" className={OB}>América/Lima (GMT-5)</option>
              <option value="America/Mexico_City" className={OB}>América/México (GMT-6)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SecuritySettingsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function SecuritySettingsTab({ formData, setFormData }: SecuritySettingsProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // Estados para Seguridad
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordExpiry, setPasswordExpiry] = useState("90");
  const [loginAttempts, setLoginAttempts] = useState("3");
  const [minPassLength, setMinPassLength] = useState("8");
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSymbols, setRequireSymbols] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const IN = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${
    isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
  }`;

  return (
    <div className="space-y-4">
      {/* SECCIÓN: CONFIGURACIÓN DE SEGURIDAD */}
      
      {/* Autenticación */}
      <div className={`border rounded-xl p-5 ${
        isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`}>
            <Shield className={`w-4 h-4 ${isLight ? "text-gray-900" : "text-white"}`} />
          </div>
          <h4 className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
            Autenticación
          </h4>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {twoFactorAuth && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                Autenticación de Dos Factores (2FA)
              </span>
              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                Requiere un código adicional al iniciar sesión
              </p>
            </div>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={`block text-xs mb-2 font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Tiempo de sesión (minutos)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                className={IN}
                min="5"
                max="480"
              />
            </div>
            <div>
              <label className={`block text-xs mb-2 font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Vencimiento de contraseña (días)
              </label>
              <input
                type="number"
                value={passwordExpiry}
                onChange={(e) => setPasswordExpiry(parseInt(e.target.value))}
                className={IN}
                min="30"
                max="365"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Registro de Auditoría */}
      <div className={`border rounded-xl p-5 ${
        isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg ${isLight ? "bg-gray-200" : "bg-white/5"}`}>
            <Shield className={`w-4 h-4 ${isLight ? "text-gray-900" : "text-white"}`} />
          </div>
          <h4 className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
            Registro de Auditoría
          </h4>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={auditLog}
                onChange={(e) => setAuditLog(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {auditLog && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                Habilitar Registro de Auditoría
              </span>
              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                Registra todas las acciones de los usuarios
              </p>
            </div>
          </label>

          <div>
            <label className={`block text-xs mb-2 font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              IPs Permitidas (opcional)
            </label>
            <textarea
              value={ipWhitelist}
              onChange={(e) => setIpWhitelist(e.target.value)}
              className={IN}
              rows={3}
              placeholder="192.168.1.1&#10;10.0.0.1"
            />
            <p className={`text-xs mt-1.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              Una IP por línea. Dejar vacío para permitir todas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}