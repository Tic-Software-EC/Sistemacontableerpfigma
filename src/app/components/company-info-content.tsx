import { useState } from "react";
import { Building2, Calculator, FileText, Users } from "lucide-react";

export function CompanyInfoContent() {
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
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
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

      <div className="border-t border-white/10"></div>

      {/* Datos Generales */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="text-white font-bold text-lg">Datos Generales</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Razón Social
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Nombre Comercial
            </label>
            <input
              type="text"
              value={commercialName}
              onChange={(e) => setCommercialName(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              RUC
            </label>
            <input
              type="text"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Dirección
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Teléfono
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Configuración Fiscal */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="text-white font-bold text-lg">Configuración Fiscal</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group p-3 bg-[#0f1825]/50 rounded-lg hover:bg-[#0f1825] transition-colors">
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
              <span className="text-white font-medium">Obligado a llevar contabilidad</span>
              <p className="text-gray-400 text-xs mt-0.5">Según el SRI</p>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Régimen Tributario
              </label>
              <select
                value={taxRegime}
                onChange={(e) => setTaxRegime(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="general">Régimen General</option>
                <option value="rimpe">RIMPE</option>
                <option value="rise">RISE</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Tipo de Contribuyente
              </label>
              <select
                value={contributorType}
                onChange={(e) => setContributorType(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="especial">Especial</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Tarifa IVA
              </label>
              <select
                value={ivaRate}
                onChange={(e) => setIvaRate(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="0">0%</option>
                <option value="12">12%</option>
                <option value="15">15%</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Actividad Económica
              </label>
              <input
                type="text"
                value={economicActivity}
                onChange={(e) => setEconomicActivity(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer group p-3 bg-[#0f1825]/50 rounded-lg hover:bg-[#0f1825] transition-colors">
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
              <span className="text-white font-medium">Agente de Retención</span>
              <p className="text-gray-400 text-xs mt-0.5">Autorizado por el SRI</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group p-3 bg-[#0f1825]/50 rounded-lg hover:bg-[#0f1825] transition-colors">
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
              <span className="text-white font-medium">Sujeto a ICE</span>
              <p className="text-gray-400 text-xs mt-0.5">Impuesto a Consumos Especiales</p>
            </div>
          </label>
        </div>
      </div>

      {/* Configuración Contable */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-white font-bold text-lg">Configuración Contable</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Fecha Inicio Contabilidad
            </label>
            <input
              type="date"
              value={accountingStartDate}
              onChange={(e) => setAccountingStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Año Fiscal
            </label>
            <input
              type="text"
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Representante Legal */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-white font-bold text-lg">Representante Legal</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Nombre Completo
            </label>
            <input
              type="text"
              value={legalRepresentative}
              onChange={(e) => setLegalRepresentative(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Cédula / RUC
            </label>
            <input
              type="text"
              value={representativeId}
              onChange={(e) => setRepresentativeId(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Contadora de la Empresa */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-white font-bold text-lg">Contadora de la Empresa</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Nombre Completo
            </label>
            <input
              type="text"
              value={accountantName}
              onChange={(e) => setAccountantName(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Cédula / RUC
            </label>
            <input
              type="text"
              value={accountantId}
              onChange={(e) => setAccountantId(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Licencia
            </label>
            <input
              type="text"
              value={accountantLicense}
              onChange={(e) => setAccountantLicense(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Teléfono
            </label>
            <input
              type="text"
              value={accountantPhone}
              onChange={(e) => setAccountantPhone(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Email
            </label>
            <input
              type="email"
              value={accountantEmail}
              onChange={(e) => setAccountantEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}