import { useState } from "react";
import { Building2, Calculator, FileText, Users, Check, Lock, Zap, Upload, X, ShieldCheck, Key, FileSignature, AlertTriangle } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { SysTabBar, SysTab } from "./ui/sys-tab-bar";

const COMPANY_TABS: SysTab[] = [
  { id: "general",    label: "Datos Generales",      icon: Building2  },
  { id: "fiscal",     label: "Configuración Fiscal", icon: Calculator },
  { id: "accounting", label: "Config. Contable",     icon: FileText   },
  { id: "electronic", label: "Fact. Electrónica",    icon: Zap        },
  { id: "legal",      label: "Rep. Legal",           icon: Users      },
  { id: "accountant", label: "Contadora",            icon: Users      },
];

export function CompanyInfoContent() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");

  // ── Datos Generales ──
  const [businessName]   = useState("Comercial del Pacífico S.A.");
  const [ruc]            = useState("1234567890001");
  const [commercialName, setCommercialName] = useState("Comercial del Pacífico");
  const [address, setAddress] = useState("Av. Principal 123 y Secundaria");
  const [phone,   setPhone]   = useState("+593 2 123-4567");
  const [email,   setEmail]   = useState("contacto@comercialdelpacífico.com.ec");

  // ── Fiscal ──
  const [isAccountingRequired, setIsAccountingRequired] = useState(true);
  const [taxRegime,        setTaxRegime]        = useState("general");
  const [contributorType,  setContributorType]  = useState("especial");
  const [economicActivity, setEconomicActivity] = useState("Comercio al por mayor");
  const [retentionAgent,   setRetentionAgent]   = useState(true);
  const [ivaRate,          setIvaRate]          = useState("15");
  const [icePayer,         setIcePayer]         = useState(false);
  const [generaAnexo,      setGeneraAnexo]      = useState(true);

  // ── Facturación Electrónica ──
  const [feAmbiente,        setFeAmbiente]        = useState<"1"|"2">("2");
  const [feActiva,          setFeActiva]          = useState(true);
  const [feAutoEnvio,       setFeAutoEnvio]       = useState(true);
  const [feAutoRide,        setFeAutoRide]        = useState(true);
  const [feFirmaVigente,    setFeFirmaVigente]    = useState(true);
  const [feCertFile,        setFeCertFile]        = useState("firma_comercial_2025.p12");
  const [feCertPassword,    setFeCertPassword]    = useState("••••••••");
  const [feCertExpiry,      setFeCertExpiry]      = useState("2026-03-15");
  const [feEmailFrom,       setFeEmailFrom]       = useState("facturacion@comercialdelpacífico.com.ec");
  const [feEmailCC,         setFeEmailCC]         = useState("contadora@comercialdelpacífico.com.ec");
  const [feSecuencial,      setFeSecuencial]      = useState("000000001");
  const [feEstab,           setFeEstab]           = useState("001");
  const [fePtoEmision,      setFePtoEmision]      = useState("001");
  const [showCertPassword,  setShowCertPassword]  = useState(false);

  // ── Contable ──
  const [accountingStartDate, setAccountingStartDate] = useState("2024-01-01");
  const [fiscalYear,          setFiscalYear]          = useState("2024");
  const [fiscalYearEndMonth,  setFiscalYearEndMonth]  = useState("12");
  const [accountingPeriod,    setAccountingPeriod]    = useState("mensual");
  const [ivaDeclarationPeriod,setIvaDeclarationPeriod]= useState("mensual");
  const [irDeclarationMonth,  setIrDeclarationMonth]  = useState("04");

  // ── Rep. Legal ──
  const [legalRepresentative,           setLegalRepresentative]           = useState("Juan Carlos Pérez López");
  const [representativeId,              setRepresentativeId]              = useState("1234567890");
  const [representativePhone,           setRepresentativePhone]           = useState("+593 99 123-4567");
  const [representativeEmail,           setRepresentativeEmail]           = useState("jperez@comercialdelpacífico.com.ec");
  const [representativeAddress,         setRepresentativeAddress]         = useState("Av. Principal 123 y Secundaria");
  const [representativeAppointmentDate, setRepresentativeAppointmentDate] = useState("2022-03-15");

  // ── Contadora ──
  const [accountantName,    setAccountantName]    = useState("María Fernanda González");
  const [accountantId,      setAccountantId]      = useState("1765432109");
  const [accountantLicense, setAccountantLicense] = useState("CPA-2024-1234");
  const [accountantPhone,   setAccountantPhone]   = useState("+593 99 876-5432");
  const [accountantEmail,   setAccountantEmail]   = useState("contadora@comercialdelpacífico.com.ec");

  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const isLight = theme === "light";
  const D   = `border-t ${isLight ? "border-gray-200" : "border-white/10"}`;
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const lbl = isLight ? "text-gray-600" : "text-gray-300";
  const card= `rounded-2xl p-6 border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const sec = `rounded-xl p-4 border mb-5 ${isLight ? "border-gray-100 bg-gray-50" : "border-white/8 bg-white/[0.03]"}`;
  const IN  = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const RO  = `w-full px-3 py-2 border rounded-lg text-sm cursor-not-allowed ${isLight ? "bg-gray-100 border-gray-200 text-gray-500" : "bg-white/[0.03] border-white/5 text-gray-500"}`;
  const OB  = isLight ? "" : "bg-[#0D1B2A]";
  const SH  = `text-xs font-semibold uppercase tracking-wide mb-3 ${isLight ? "text-gray-400" : "text-gray-500"}`;

  const ReadField = ({ label, value }: { label: string; value: string }) => (
    <div>
      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
        <span className="inline-flex items-center gap-1">
          <Lock className="w-3 h-3 text-gray-400" />
          {label}
          <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${isLight ? "bg-gray-100 text-gray-400" : "bg-white/5 text-gray-500"}`}>Solo lectura</span>
        </span>
      </label>
      <input type="text" value={value} readOnly className={RO} />
    </div>
  );

  const Field = ({ label, children, colSpan }: { label: string; children: React.ReactNode; colSpan?: string }) => (
    <div className={colSpan}>
      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>{label}</label>
      {children}
    </div>
  );

  const CheckRow = ({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc: string }) => (
    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors ${isLight ? "bg-gray-50 hover:bg-gray-100" : "bg-[#0f1825]/50 hover:bg-[#0f1825]"}`}>
      <div className="flex-shrink-0">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${checked ? "bg-primary border-primary" : isLight ? "border-gray-300" : "border-white/20"}`}>
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      <div>
        <span className={`font-medium text-sm ${txt}`}>{label}</span>
        <p className={`text-xs mt-0.5 ${sub}`}>{desc}</p>
      </div>
    </label>
  );

  const MONTHS = [
    ["01","Enero"],["02","Febrero"],["03","Marzo"],["04","Abril"],
    ["05","Mayo"],["06","Junio"],["07","Julio"],["08","Agosto"],
    ["09","Septiembre"],["10","Octubre"],["11","Noviembre"],["12","Diciembre"],
  ];

  return (
    <div className="space-y-6 w-full">

      <div>
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="w-8 h-8 text-primary" />
          <h2 className={`font-bold text-3xl ${txt}`}>Información de la Empresa</h2>
        </div>
        <p className={`text-sm ${sub}`}>Configuración de datos fiscales y contables</p>
      </div>

      <div className={D} />

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 ${saved ? "bg-green-500" : "bg-primary hover:bg-primary/90"} text-white`}
        >
          {saved ? <><Check className="w-4 h-4" /> Guardado</> : "Guardar Cambios"}
        </button>
      </div>

      <SysTabBar tabs={COMPANY_TABS} active={activeTab} onChange={setActiveTab} />

      {/* ══ DATOS GENERALES ══ */}
      {activeTab === "general" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Datos Generales</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ReadField label="Razón Social" value={businessName} />
            <Field label="Nombre Comercial">
              <input type="text" value={commercialName} onChange={e => setCommercialName(e.target.value)} className={IN} />
            </Field>
            <ReadField label="RUC" value={ruc} />
            <Field label="Dirección" colSpan="sm:col-span-2">
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className={IN} />
            </Field>
            <Field label="Teléfono">
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={IN} />
            </Field>
            <Field label="Email">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={IN} />
            </Field>
          </div>
        </div>
      )}

      {/* ══ FISCAL ══ */}
      {activeTab === "fiscal" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Calculator className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Configuración Fiscal</h3>
          </div>
          <div className="space-y-3">
            <CheckRow checked={isAccountingRequired} onChange={setIsAccountingRequired} label="Obligado a llevar contabilidad" desc="Según resolución del SRI" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Field label="Régimen Tributario">
                <select value={taxRegime} onChange={e => setTaxRegime(e.target.value)} className={IN}>
                  <option value="general"           className={OB}>Régimen General</option>
                  <option value="rimpe_negocio"     className={OB}>RIMPE — Negocio Popular</option>
                  <option value="rimpe_emprendedor" className={OB}>RIMPE — Emprendedor</option>
                  <option value="rise"              className={OB}>RISE</option>
                </select>
              </Field>
              <Field label="Tipo de Contribuyente">
                <select value={contributorType} onChange={e => setContributorType(e.target.value)} className={IN}>
                  <option value="especial" className={OB}>Contribuyente Especial</option>
                  <option value="normal"   className={OB}>Contribuyente Normal</option>
                  <option value="artesano" className={OB}>Artesano Calificado</option>
                </select>
              </Field>
              <Field label="Tarifa IVA Vigente">
                <select value={ivaRate} onChange={e => setIvaRate(e.target.value)} className={IN}>
                  <option value="0"  className={OB}>0%</option>
                  <option value="5"  className={OB}>5%</option>
                  <option value="12" className={OB}>12%</option>
                  <option value="15" className={OB}>15% (vigente 2024)</option>
                </select>
              </Field>
              <Field label="Actividad Económica (CIIU)">
                <input type="text" value={economicActivity} onChange={e => setEconomicActivity(e.target.value)} className={IN} />
              </Field>
            </div>
            <CheckRow checked={retentionAgent} onChange={setRetentionAgent} label="Agente de Retención" desc="Autorizado por el SRI para retener IR e IVA" />
            <CheckRow checked={icePayer} onChange={setIcePayer} label="Sujeto a ICE" desc="Impuesto a Consumos Especiales" />
            <CheckRow checked={generaAnexo} onChange={setGeneraAnexo} label="Genera Anexo Transaccional (ATS)" desc="Obligado a presentar el Anexo Transaccional Simplificado al SRI" />
          </div>
        </div>
      )}

      {/* ══ FACTURACIÓN ELECTRÓNICA ══ */}
      {activeTab === "electronic" && (
        <div className="space-y-5">

          {/* Ambiente */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h3 className={`font-bold text-base ${txt}`}>Ambiente SRI</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                { val:"1", label:"Pruebas",    desc:"Ambiente de desarrollo y pruebas", color:"blue"   },
                { val:"2", label:"Producción", desc:"Emisión real de comprobantes",     color:"green"  },
              ].map(opt => (
                <label key={opt.val}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    feAmbiente === opt.val
                      ? opt.val === "2"
                        ? isLight ? "border-green-400 bg-green-50" : "border-green-500/50 bg-green-500/10"
                        : isLight ? "border-blue-400 bg-blue-50"   : "border-blue-500/50 bg-blue-500/10"
                      : isLight ? "border-gray-200 hover:border-gray-300" : "border-white/10 hover:border-white/20"
                  }`}>
                  <input type="radio" name="feAmbiente" value={opt.val}
                    checked={feAmbiente === opt.val}
                    onChange={() => setFeAmbiente(opt.val as "1"|"2")}
                    className="mt-0.5 accent-primary" />
                  <div>
                    <p className={`text-sm font-semibold ${txt}`}>{opt.label}</p>
                    <p className={`text-xs mt-0.5 ${sub}`}>{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {feAmbiente === "1" && (
              <div className={`flex items-start gap-3 p-3 rounded-lg border ${isLight ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-amber-500/10 border-amber-500/30 text-amber-300"}`}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-xs">Estás en ambiente de <strong>pruebas</strong>. Los comprobantes no tienen validez tributaria.</p>
              </div>
            )}

            <div className="mt-4 space-y-3">
              <CheckRow checked={feActiva}    onChange={setFeActiva}    label="Facturación electrónica activa"             desc="Habilita la emisión de comprobantes electrónicos al SRI" />
              <CheckRow checked={feAutoEnvio} onChange={setFeAutoEnvio} label="Envío automático al SRI"                    desc="Envía el comprobante al SRI inmediatamente al generarse" />
              <CheckRow checked={feAutoRide}  onChange={setFeAutoRide}  label="Envío automático de RIDE al cliente"        desc="Envía el PDF RIDE por email al destinatario al autorizarse" />
            </div>
          </div>

          {/* Firma electrónica */}
          <div className={card}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Key className="w-4 h-4 text-primary" />
                </div>
                <h3 className={`font-bold text-base ${txt}`}>Firma Electrónica (.p12)</h3>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                feFirmaVigente
                  ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300"
                  : isLight ? "bg-red-100 text-red-700"     : "bg-red-500/20 text-red-300"
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {feFirmaVigente ? "Vigente" : "Vencida"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Archivo cert */}
              <div className="sm:col-span-2">
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Archivo de firma (.p12)</label>
                <div className={`flex items-center gap-2 w-full px-3 py-2 border rounded-lg text-sm ${isLight ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
                  <FileSignature className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className={`flex-1 truncate ${feCertFile ? txt : "text-gray-400"}`}>{feCertFile || "Ningún archivo seleccionado"}</span>
                  <label className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer px-2.5 py-1 rounded-md transition-colors flex-shrink-0 ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/10 hover:bg-white/15 text-gray-300"}`}>
                    <Upload className="w-3.5 h-3.5" /> Subir
                    <input type="file" accept=".p12,.pfx" className="hidden"
                      onChange={e => { if (e.target.files?.[0]) setFeCertFile(e.target.files[0].name); }} />
                  </label>
                  {feCertFile && (
                    <button onClick={() => setFeCertFile("")}
                      className={`p-1 rounded transition-colors text-gray-400 ${isLight ? "hover:text-red-600" : "hover:text-red-400"}`}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Contraseña del certificado</label>
                <div className="relative">
                  <input type={showCertPassword ? "text" : "password"}
                    value={feCertPassword}
                    onChange={e => setFeCertPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${IN} pr-10`} />
                  <button type="button" onClick={() => setShowCertPassword(!showCertPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                    {showCertPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              {/* Vencimiento */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Fecha de vencimiento</label>
                <input type="date" value={feCertExpiry} onChange={e => { setFeCertExpiry(e.target.value); setFeFirmaVigente(new Date(e.target.value) > new Date()); }}
                  className={IN} />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══ CONFIGURACIÓN CONTABLE ══ */}
      {activeTab === "accounting" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Configuración Contable</h3>
          </div>

          {/* Ejercicio Fiscal */}
          <div className={sec}>
            <p className={SH}>Ejercicio Fiscal</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Fecha de Inicio de Contabilidad">
                <input type="date" value={accountingStartDate} onChange={e => setAccountingStartDate(e.target.value)} className={IN} />
              </Field>
              <Field label="Año Fiscal Actual">
                <input type="number" value={fiscalYear} onChange={e => setFiscalYear(e.target.value)} className={IN} min="2000" max="2099" />
              </Field>
              <Field label="Mes de Cierre del Ejercicio">
                <select value={fiscalYearEndMonth} onChange={e => setFiscalYearEndMonth(e.target.value)} className={IN}>
                  {MONTHS.map(([v, l]) => <option key={v} value={v} className={OB}>{l}</option>)}
                </select>
              </Field>
              <Field label="Período Contable">
                <select value={accountingPeriod} onChange={e => setAccountingPeriod(e.target.value)} className={IN}>
                  <option value="mensual"    className={OB}>Mensual</option>
                  <option value="trimestral" className={OB}>Trimestral</option>
                  <option value="semestral"  className={OB}>Semestral</option>
                  <option value="anual"      className={OB}>Anual</option>
                </select>
              </Field>
            </div>
          </div>

          {/* Declaraciones SRI */}
          <div className={sec} style={{ marginBottom: 0 }}>
            <p className={SH}>Declaraciones SRI</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Período de Declaración IVA (Form. 104)">
                <select value={ivaDeclarationPeriod} onChange={e => setIvaDeclarationPeriod(e.target.value)} className={IN}>
                  <option value="mensual"   className={OB}>Mensual</option>
                  <option value="semestral" className={OB}>Semestral (RISE / pequeños)</option>
                </select>
              </Field>
              <Field label="Mes Límite Declaración IR (Form. 101/102)">
                <select value={irDeclarationMonth} onChange={e => setIrDeclarationMonth(e.target.value)} className={IN}>
                  {MONTHS.map(([v, l]) => <option key={v} value={v} className={OB}>{l}</option>)}
                </select>
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* ══ REPRESENTANTE LEGAL ══ */}
      {activeTab === "legal" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Representante Legal</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre Completo">
              <input type="text" value={legalRepresentative} onChange={e => setLegalRepresentative(e.target.value)} className={IN} />
            </Field>
            <Field label="Cédula / Pasaporte">
              <input type="text" value={representativeId} onChange={e => setRepresentativeId(e.target.value)} className={IN} />
            </Field>
            <Field label="Teléfono">
              <input type="text" value={representativePhone} onChange={e => setRepresentativePhone(e.target.value)} className={IN} />
            </Field>
            <Field label="Email">
              <input type="email" value={representativeEmail} onChange={e => setRepresentativeEmail(e.target.value)} className={IN} />
            </Field>
            <Field label="Dirección" colSpan="sm:col-span-2">
              <input type="text" value={representativeAddress} onChange={e => setRepresentativeAddress(e.target.value)} className={IN} />
            </Field>
            <Field label="Fecha de Nombramiento">
              <input type="date" value={representativeAppointmentDate} onChange={e => setRepresentativeAppointmentDate(e.target.value)} className={IN} />
            </Field>
          </div>
        </div>
      )}

      {/* ══ CONTADORA ══ */}
      {activeTab === "accountant" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Contadora de la Empresa</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre Completo">
              <input type="text" value={accountantName} onChange={e => setAccountantName(e.target.value)} className={IN} />
            </Field>
            <Field label="Cédula / RUC">
              <input type="text" value={accountantId} onChange={e => setAccountantId(e.target.value)} className={IN} />
            </Field>
            <Field label="Número de Licencia / Registro">
              <input type="text" value={accountantLicense} onChange={e => setAccountantLicense(e.target.value)} className={IN} />
            </Field>
            <Field label="Teléfono">
              <input type="text" value={accountantPhone} onChange={e => setAccountantPhone(e.target.value)} className={IN} />
            </Field>
            <Field label="Email" colSpan="sm:col-span-2">
              <input type="email" value={accountantEmail} onChange={e => setAccountantEmail(e.target.value)} className={IN} />
            </Field>
          </div>
        </div>
      )}

    </div>
  );
}