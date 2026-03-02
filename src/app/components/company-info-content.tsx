import { useState } from "react";
import { Building2, Calculator, FileText, Users } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

export function CompanyInfoContent() {
  const { theme } = useTheme();
  const [businessName, setBusinessName] = useState("Comercial del Pacífico S.A.");
  const [commercialName, setCommercialName] = useState("Comercial del Pacífico");
  const [ruc, setRuc] = useState("1234567890001");
  const [isAccountingRequired, setIsAccountingRequired] = useState(true);
  const [taxRegime, setTaxRegime] = useState("general");
  const [contributorType, setContributorType] = useState("especial");
  const [economicActivity, setEconomicActivity] = useState("Comercio al por mayor");
  const [retentionAgent, setRetentionAgent] = useState(true);
  const [ivaRate, setIvaRate] = useState("12");
  const [icePayer, setIcePayer] = useState(false);
  const [accountingStartDate, setAccountingStartDate] = useState("2024-01-01");
  const [fiscalYear, setFiscalYear] = useState("2024");
  const [legalRepresentative, setLegalRepresentative] = useState("Juan Carlos Pérez López");
  const [representativeId, setRepresentativeId] = useState("1234567890");
  const [address, setAddress] = useState("Av. Principal 123 y Secundaria");
  const [phone, setPhone] = useState("+593 2 123-4567");
  const [email, setEmail] = useState("contacto@comercialdelpacífico.com.ec");
  const [accountantName, setAccountantName] = useState("María Fernanda González");
  const [accountantId, setAccountantId] = useState("1765432109");
  const [accountantLicense, setAccountantLicense] = useState("CPA-2024-1234");
  const [accountantPhone, setAccountantPhone] = useState("+593 99 876-5432");
  const [accountantEmail, setAccountantEmail] = useState("contadora@comercialdelpacífico.com.ec");

  const handleSave = () => {
    console.log("Guardando información de la empresa...");
    alert("Información guardada exitosamente");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`font-bold text-3xl mb-2 flex items-center gap-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            <Building2 className="w-8 h-8 text-primary" />
            Información de la Empresa
          </h2>
          <p className="text-gray-400 text-sm">
            Configuración de datos fiscales y contables
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium"
        >
          Guardar Cambios
        </button>
      </div>

      <div className={`border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`}></div>

      {/* Datos Generales */}
      <div className={`rounded-xl p-5 ${theme === "light" ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`}>
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>Datos Generales</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Razón Social
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Nombre Comercial
            </label>
            <input
              type="text"
              value={commercialName}
              onChange={(e) => setCommercialName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              RUC
            </label>
            <input
              type="text"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div className="col-span-2">
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Dirección
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Teléfono
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>
        </div>
      </div>

      {/* Configuración Fiscal */}
      <div className={`rounded-xl p-5 ${theme === "light" ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`}>
        <div className="flex items-center gap-2 mb-5">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>Configuración Fiscal</h3>
        </div>

        <div className="space-y-4">
          <label className={`flex items-center gap-3 cursor-pointer group p-3 rounded-lg transition-colors ${theme === "light" ? "bg-gray-50 hover:bg-gray-100" : "bg-[#0f1825]/50 hover:bg-[#0f1825]"}`}>
            <div className="relative">
              <input
                type="checkbox"
                checked={isAccountingRequired}
                onChange={(e) => setIsAccountingRequired(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 border-2 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                {isAccountingRequired && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>Obligado a llevar contabilidad</span>
              <p className="text-gray-400 text-xs mt-0.5">Según el SRI</p>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                Régimen Tributario
              </label>
              <select
                value={taxRegime}
                onChange={(e) => setTaxRegime(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
              >
                <option value="general">Régimen General</option>
                <option value="rimpe">RIMPE</option>
                <option value="rise">RISE</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                Tipo de Contribuyente
              </label>
              <select
                value={contributorType}
                onChange={(e) => setContributorType(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
              >
                <option value="especial">Especial</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                Tarifa IVA
              </label>
              <select
                value={ivaRate}
                onChange={(e) => setIvaRate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
              >
                <option value="0">0%</option>
                <option value="12">12%</option>
                <option value="15">15%</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
                Actividad Económica
              </label>
              <input
                type="text"
                value={economicActivity}
                onChange={(e) => setEconomicActivity(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
              />
            </div>
          </div>

          <label className={`flex items-center gap-3 cursor-pointer group p-3 rounded-lg transition-colors ${theme === "light" ? "bg-gray-50 hover:bg-gray-100" : "bg-[#0f1825]/50 hover:bg-[#0f1825]"}`}>
            <div className="relative">
              <input
                type="checkbox"
                checked={retentionAgent}
                onChange={(e) => setRetentionAgent(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 border-2 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                {retentionAgent && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>Agente de Retención</span>
              <p className="text-gray-400 text-xs mt-0.5">Autorizado por el SRI</p>
            </div>
          </label>

          <label className={`flex items-center gap-3 cursor-pointer group p-3 rounded-lg transition-colors ${theme === "light" ? "bg-gray-50 hover:bg-gray-100" : "bg-[#0f1825]/50 hover:bg-[#0f1825]"}`}>
            <div className="relative">
              <input
                type="checkbox"
                checked={icePayer}
                onChange={(e) => setIcePayer(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 border-2 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center ${theme === "light" ? "border-gray-300" : "border-white/20"}`}>
                {icePayer && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className={`font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>Sujeto a ICE</span>
              <p className="text-gray-400 text-xs mt-0.5">Impuesto a Consumos Especiales</p>
            </div>
          </label>
        </div>
      </div>

      {/* Configuración Contable */}
      <div className={`rounded-xl p-5 ${theme === "light" ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`}>
        <div className="flex items-center gap-2 mb-5">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>Configuración Contable</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Fecha Inicio Contabilidad
            </label>
            <input
              type="date"
              value={accountingStartDate}
              onChange={(e) => setAccountingStartDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Año Fiscal
            </label>
            <input
              type="text"
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>
        </div>
      </div>

      {/* Representante Legal */}
      <div className={`rounded-xl p-5 ${theme === "light" ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`}>
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-primary" />
          <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>Representante Legal</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Nombre Completo
            </label>
            <input
              type="text"
              value={legalRepresentative}
              onChange={(e) => setLegalRepresentative(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Cédula / RUC
            </label>
            <input
              type="text"
              value={representativeId}
              onChange={(e) => setRepresentativeId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>
        </div>
      </div>

      {/* Contadora de la Empresa */}
      <div className={`rounded-xl p-5 ${theme === "light" ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`}>
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-primary" />
          <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>Contadora de la Empresa</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Nombre Completo
            </label>
            <input
              type="text"
              value={accountantName}
              onChange={(e) => setAccountantName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Cédula / RUC
            </label>
            <input
              type="text"
              value={accountantId}
              onChange={(e) => setAccountantId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Licencia
            </label>
            <input
              type="text"
              value={accountantLicense}
              onChange={(e) => setAccountantLicense(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Teléfono
            </label>
            <input
              type="text"
              value={accountantPhone}
              onChange={(e) => setAccountantPhone(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
              Email
            </label>
            <input
              type="email"
              value={accountantEmail}
              onChange={(e) => setAccountantEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
