import { Building2, Calculator, FileText, Users, Check, Lock, Zap, Upload, X, ShieldCheck, Key, FileSignature, AlertTriangle, Mail, Plus, Pencil, Trash2, Server, Send, ChevronDown, ChevronUp, Eye, EyeOff, Palette, RotateCcw, ImageIcon, Camera } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useBrand } from "../contexts/brand-context";
import { SysTabBar, SysTab } from "./ui/sys-tab-bar";
import { useState, useRef } from "react";

const COMPANY_TABS: SysTab[] = [
  { id: "general",       label: "Datos Generales",      icon: Building2  },
  { id: "fiscal",        label: "Config. Fiscal",       icon: Calculator },
  { id: "accounting",    label: "Config. Contable",     icon: FileText   },
  { id: "electronic",    label: "Fact. Electrónica",    icon: Zap        },
  { id: "legal",         label: "Rep. Legal",           icon: Users      },
  { id: "accountant",    label: "Contadora",            icon: Users      },
];

// ── Tipos ──────────────────────────────────────────────────────────────────
interface SmtpServer {
  id: string;
  name: string;
  host: string;
  port: string;
  security: "tls" | "ssl" | "none";
  user: string;
  password: string;
}

interface MailSender {
  id: string;
  alias: string;
  fromName: string;
  fromEmail: string;
  purpose: string;
  smtpId: string;
}

const PURPOSES = [
  "Envío de RIDE (Factura electrónica)",
  "Envío de Comprobantes de Retención",
  "Envío de Notas de Crédito",
  "Envío de Notas de Débito",
  "Envío de Guías de Remisión",
  "Notificaciones al cliente",
  "Notificaciones internas",
  "Recuperación de contraseña",
  "Otro",
];

// ── Componentes auxiliares ─────────────────────────────────────────────────
function Field({ label, children, colSpan }: { label: string; children: React.ReactNode; colSpan?: string }) {
  return (
    <div className={colSpan}>
      <label className="block mb-1.5 text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}

export function CompanyInfoContent() {
  const { theme } = useTheme();
  const { primaryColor, secondaryColor, logoUrl, updateColors, updateLogo, removeLogo } = useBrand();
  const [activeTab, setActiveTab] = useState("general");
  const logoInputRef = useRef<HTMLInputElement>(null);

  // ── Colores de marca (preview local antes de guardar) ──
  const [localPrimary,   setLocalPrimary]   = useState(primaryColor);
  const [localSecondary, setLocalSecondary] = useState(secondaryColor);

  // ── Logo upload ──
  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => { if (e.target?.result) updateLogo(e.target.result as string); };
    reader.readAsDataURL(file);
  };

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

  // ── Servidores SMTP ──
  const [smtpServers, setSmtpServers] = useState<SmtpServer[]>([
    { id: "1", name: "Gmail Corporativo", host: "smtp.gmail.com", port: "587", security: "tls", user: "facturacion@empresa.com", password: "app_password_aqui" },
  ]);
  const [smtpExpanded,    setSmtpExpanded]    = useState<string | null>(null);
  const [smtpForm,        setSmtpForm]        = useState<SmtpServer | null>(null);
  const [smtpShowPwd,     setSmtpShowPwd]     = useState(false);
  const [smtpTesting,     setSmtpTesting]     = useState(false);
  const [smtpTestResult,  setSmtpTestResult]  = useState<Record<string, "ok"|"fail">>({});
  const [showSmtpNew,     setShowSmtpNew]     = useState(false);

  // ── Remitentes ──
  const [mailSenders, setMailSenders] = useState<MailSender[]>([
    { id: "1", alias: "Facturación RIDE", fromName: "Comercial del Pacífico", fromEmail: "facturacion@empresa.com", purpose: "Envío de RIDE (Factura electrónica)", smtpId: "1" },
    { id: "2", alias: "Retenciones",      fromName: "Comercial del Pacífico", fromEmail: "retenciones@empresa.com",  purpose: "Envío de Comprobantes de Retención",  smtpId: "1" },
  ]);
  const [senderExpanded, setSenderExpanded] = useState<string | null>(null);
  const [senderForm,     setSenderForm]     = useState<MailSender | null>(null);
  const [showSenderNew,  setShowSenderNew]  = useState(false);

  const newSmtp   = (): SmtpServer  => ({ id: Date.now().toString(), name: "", host: "", port: "587", security: "tls", user: "", password: "" });
  const newSender = (): MailSender  => ({ id: Date.now().toString(), alias: "", fromName: "", fromEmail: "", purpose: PURPOSES[0], smtpId: smtpServers[0]?.id ?? "" });

  const saveSmtp = () => {
    if (!smtpForm) return;
    setSmtpServers(prev => prev.some(s => s.id === smtpForm.id) ? prev.map(s => s.id === smtpForm.id ? smtpForm : s) : [...prev, smtpForm]);
    setSmtpForm(null); setSmtpExpanded(null); setShowSmtpNew(false);
  };
  const deleteSmtp = (id: string) => { setSmtpServers(prev => prev.filter(s => s.id !== id)); };

  const saveSender = () => {
    if (!senderForm) return;
    setMailSenders(prev => prev.some(s => s.id === senderForm.id) ? prev.map(s => s.id === senderForm.id ? senderForm : s) : [...prev, senderForm]);
    setSenderForm(null); setSenderExpanded(null); setShowSenderNew(false);
  };
  const deleteSender = (id: string) => { setMailSenders(prev => prev.filter(s => s.id !== id)); };

  const testSmtp = (id: string) => {
    setSmtpTesting(true);
    setTimeout(() => {
      setSmtpTestResult(prev => ({ ...prev, [id]: Math.random() > 0.2 ? "ok" : "fail" }));
      setSmtpTesting(false);
    }, 1800);
  };

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
        <div className="space-y-5">

          {/* Card datos */}
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

          {/* ── Card logo ── */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${txt}`}>Logo de la Empresa</h3>
                <p className={`text-xs mt-0.5 ${sub}`}>Se muestra en el sistema y en documentos</p>
              </div>
            </div>

            {/* Upload card — estilo avatar */}
            <div className={`flex items-center gap-4 p-4 rounded-2xl border ${isLight ? "border-gray-100 bg-gray-50" : "border-white/10 bg-white/[0.03]"}`}>
              {/* Miniatura con botón cámara */}
              <div className="relative flex-shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo empresa"
                    className="w-16 h-16 rounded-2xl object-contain bg-white border border-gray-100 p-1"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                )}
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
                <input
                  type="file"
                  ref={logoInputRef}
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={e => { if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]); }}
                  className="hidden"
                />
              </div>

              {/* Texto informativo */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${txt}`}>
                  {logoUrl ? "Logo cargado correctamente" : "Sube el logo de tu empresa"}
                </p>
                <p className={`text-xs mt-1 ${sub}`}>Formatos: PNG, JPG, SVG • Tamaño máximo: 2MB</p>
                {logoUrl && (
                  <button
                    onClick={removeLogo}
                    className="mt-2 text-xs text-red-400 hover:text-red-500 transition-colors"
                  >
                    Eliminar logo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Card colores de marca ── */}
          <div className={card}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${txt}`}>Colores de Marca</h3>
                  <p className={`text-xs mt-0.5 ${sub}`}>Se aplican en tiempo real a todo el sistema</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setLocalPrimary("#E8692E");
                  setLocalSecondary("#0D1B2A");
                  updateColors({ primaryColor: "#E8692E", secondaryColor: "#0D1B2A" });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700" : "border-white/10 hover:border-white/20 text-gray-400 hover:text-gray-300"}`}
              >
                <RotateCcw className="w-3 h-3" />
                Restablecer
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Color Primario */}
              <div>
                <label className={`block text-xs font-semibold mb-3 ${txt}`}>Color Primario</label>
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"}`}>
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: localPrimary }} />
                    <input
                      type="color"
                      value={localPrimary}
                      onChange={e => { setLocalPrimary(e.target.value); updateColors({ primaryColor: e.target.value }); }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={localPrimary.toUpperCase()}
                      onChange={e => {
                        const v = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                          setLocalPrimary(v);
                          if (v.length === 7) updateColors({ primaryColor: v });
                        }
                      }}
                      className={`w-full px-2 py-1.5 rounded-lg text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-primary/30 ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
                      maxLength={7}
                    />
                    <p className={`text-[10px] mt-1.5 ${sub}`}>Botones, acentos, íconos activos</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2.5">
                  {["#E8692E","#F97316","#EF4444","#8B5CF6","#3B82F6","#10B981","#F59E0B","#EC4899"].map(c => (
                    <button
                      key={c}
                      onClick={() => { setLocalPrimary(c); updateColors({ primaryColor: c }); }}
                      title={c}
                      style={{ backgroundColor: c, outline: localPrimary === c ? `2px solid ${c}` : undefined, outlineOffset: "2px" }}
                      className="w-6 h-6 rounded-lg transition-all hover:scale-110"
                    />
                  ))}
                </div>
              </div>

              {/* Color Secundario */}
              <div>
                <label className={`block text-xs font-semibold mb-3 ${txt}`}>Color Secundario</label>
                <div className={`flex items-center gap-3 p-3 rounded-xl border ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"}`}>
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg shadow-sm" style={{ backgroundColor: localSecondary }} />
                    <input
                      type="color"
                      value={localSecondary}
                      onChange={e => { setLocalSecondary(e.target.value); updateColors({ secondaryColor: e.target.value }); }}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={localSecondary.toUpperCase()}
                      onChange={e => {
                        const v = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                          setLocalSecondary(v);
                          if (v.length === 7) updateColors({ secondaryColor: v });
                        }
                      }}
                      className={`w-full px-2 py-1.5 rounded-lg text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-primary/30 ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
                      maxLength={7}
                    />
                    <p className={`text-[10px] mt-1.5 ${sub}`}>Sidebar, fondos oscuros, textos</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2.5">
                  {["#0D1B2A","#1E293B","#111827","#1F2937","#0F172A","#18181B","#1C1917","#0A0A0A"].map(c => (
                    <button
                      key={c}
                      onClick={() => { setLocalSecondary(c); updateColors({ secondaryColor: c }); }}
                      title={c}
                      style={{ backgroundColor: c, outline: localSecondary === c ? `2px solid ${localPrimary}` : undefined, outlineOffset: "2px" }}
                      className="w-6 h-6 rounded-lg transition-all hover:scale-110 border border-white/10"
                    />
                  ))}
                </div>
              </div>
            </div>
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <h3 className={`font-bold text-base ${txt}`}>Ambiente SRI</h3>
              </div>

              {/* Selector inline */}
              <div className={`inline-flex rounded-lg border overflow-hidden text-sm ${isLight ? "border-gray-200" : "border-white/10"}`}>
                {[
                  { val:"1", label:"Pruebas",    active: isLight ? "bg-blue-500 text-white"  : "bg-blue-600 text-white"  },
                  { val:"2", label:"Producción", active: isLight ? "bg-green-500 text-white" : "bg-green-600 text-white" },
                ].map(opt => (
                  <button key={opt.val} type="button"
                    onClick={() => setFeAmbiente(opt.val as "1"|"2")}
                    className={`px-4 py-1.5 font-medium transition-colors ${feAmbiente === opt.val ? opt.active : isLight ? "bg-white text-gray-500 hover:bg-gray-50" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {feAmbiente === "1" && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-3 ${isLight ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-amber-500/10 border-amber-500/30 text-amber-300"}`}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <p className="text-xs">Ambiente de <strong>pruebas</strong> — los comprobantes no tienen validez tributaria.</p>
              </div>
            )}

            {/* Checks en grid 3 columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { checked: feActiva,    onChange: setFeActiva,    label: "F.E. activa",            desc: "Habilita emisión electrónica" },
                { checked: feAutoEnvio, onChange: setFeAutoEnvio, label: "Envío automático al SRI", desc: "Envía al SRI al generarse"     },
                { checked: feAutoRide,  onChange: setFeAutoRide,  label: "RIDE automático",         desc: "Envía PDF al cliente"          },
              ].map(({ checked, onChange, label, desc }) => (
                <label key={label} className={`flex items-center gap-2.5 cursor-pointer px-3 py-2.5 rounded-lg border transition-colors ${
                  checked
                    ? isLight ? "border-primary/30 bg-primary/5" : "border-primary/30 bg-primary/10"
                    : isLight ? "border-gray-200 hover:border-gray-300" : "border-white/10 hover:border-white/20"
                }`}>
                  <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-primary border-primary" : isLight ? "border-gray-300" : "border-white/20"}`}>
                    {checked && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${txt}`}>{label}</p>
                    <p className={`text-[11px] ${sub}`}>{desc}</p>
                  </div>
                </label>
              ))}
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

      {/* ══ COMUNICACIONES ══ */}
      {activeTab === "comms" && (
        <div className="space-y-5">

          {/* ── Servidores SMTP ────────────────────────────────── */}
          <div className={card}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Server className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${txt}`}>Servidores SMTP</h3>
                  <p className={`text-xs ${sub}`}>Configura los servidores de salida de correo</p>
                </div>
              </div>
              <button type="button" onClick={() => { setSmtpForm(newSmtp()); setShowSmtpNew(true); setSmtpExpanded(null); }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Nuevo SMTP
              </button>
            </div>

            {/* Formulario nuevo SMTP */}
            {showSmtpNew && smtpForm && (
              <SmtpForm form={smtpForm} setForm={setSmtpForm} IN={IN} OB={OB} lbl={lbl} txt={txt} sub={sub} isLight={isLight}
                showPwd={smtpShowPwd} setShowPwd={setSmtpShowPwd}
                onSave={saveSmtp} onCancel={() => { setShowSmtpNew(false); setSmtpForm(null); }} />
            )}

            {/* Lista SMTP */}
            <div className="space-y-2">
              {smtpServers.map(server => (
                <div key={server.id} className={`rounded-xl border transition-all ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  {/* Cabecera fila */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-blue-50" : "bg-blue-500/10"}`}>
                      <Server className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${txt}`}>{server.name || "Sin nombre"}</p>
                      <p className={`text-xs ${sub} truncate`}>{server.host}:{server.port} · {server.security.toUpperCase()} · {server.user}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {smtpTestResult[server.id] && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${smtpTestResult[server.id] === "ok" ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300" : isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-300"}`}>
                          {smtpTestResult[server.id] === "ok" ? "✓ Conectado" : "✗ Falló"}
                        </span>
                      )}
                      <button type="button" onClick={() => testSmtp(server.id)} disabled={smtpTesting}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-200 hover:border-primary hover:text-primary text-gray-600" : "border-white/10 hover:border-primary hover:text-primary text-gray-400"}`}>
                        {smtpTesting ? "..." : "Probar"}
                      </button>
                      <button type="button" onClick={() => { setSmtpForm({ ...server }); setSmtpExpanded(smtpExpanded === server.id ? null : server.id); setShowSmtpNew(false); }}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${smtpExpanded === server.id ? "border-primary text-primary" : isLight ? "border-gray-200 hover:border-primary hover:text-primary text-gray-600" : "border-white/10 hover:border-primary hover:text-primary text-gray-400"}`}>
                        {smtpExpanded === server.id ? <ChevronUp className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                      </button>
                      <button type="button" onClick={() => deleteSmtp(server.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-600" : "border-white/10 hover:border-red-500/50 hover:text-red-400 text-gray-400"}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* Formulario edición inline */}
                  {smtpExpanded === server.id && smtpForm && (
                    <div className={`border-t px-4 pb-4 pt-3 ${isLight ? "border-gray-100 bg-gray-50/50" : "border-white/5 bg-white/[0.02]"}`}>
                      <SmtpForm form={smtpForm} setForm={setSmtpForm} IN={IN} OB={OB} lbl={lbl} txt={txt} sub={sub} isLight={isLight}
                        showPwd={smtpShowPwd} setShowPwd={setSmtpShowPwd}
                        onSave={saveSmtp} onCancel={() => { setSmtpExpanded(null); setSmtpForm(null); }} />
                    </div>
                  )}
                </div>
              ))}
              {smtpServers.length === 0 && (
                <p className={`text-center py-6 text-sm ${sub}`}>No hay servidores SMTP configurados.</p>
              )}
            </div>
          </div>

          {/* ── Remitentes ─────────────────────────────────────── */}
          <div className={card}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${txt}`}>Remitentes de Correo</h3>
                  <p className={`text-xs ${sub}`}>Cada remitente se asocia a un SMTP y a un propósito de envío</p>
                </div>
              </div>
              <button type="button" onClick={() => { setSenderForm(newSender()); setShowSenderNew(true); setSenderExpanded(null); }}
                disabled={smtpServers.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus className="w-4 h-4" /> Nuevo Remitente
              </button>
            </div>

            {smtpServers.length === 0 && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-3 ${isLight ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-amber-500/10 border-amber-500/30 text-amber-300"}`}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <p className="text-xs">Debes configurar al menos un servidor SMTP antes de agregar remitentes.</p>
              </div>
            )}

            {/* Formulario nuevo remitente */}
            {showSenderNew && senderForm && (
              <SenderForm form={senderForm} setForm={setSenderForm} smtpServers={smtpServers} IN={IN} OB={OB} lbl={lbl} txt={txt} isLight={isLight}
                onSave={saveSender} onCancel={() => { setShowSenderNew(false); setSenderForm(null); }} />
            )}

            <div className="space-y-2">
              {mailSenders.map(sender => {
                const smtp = smtpServers.find(s => s.id === sender.smtpId);
                return (
                  <div key={sender.id} className={`rounded-xl border transition-all ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-orange-50" : "bg-primary/10"}`}>
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${txt}`}>{sender.alias || "Sin alias"}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isLight ? "bg-gray-100 text-gray-500" : "bg-white/10 text-gray-400"}`}>
                            {smtp?.name ?? "SMTP no asignado"}
                          </span>
                        </div>
                        <p className={`text-xs ${sub} truncate`}>{sender.fromName} &lt;{sender.fromEmail}&gt;</p>
                        <p className={`text-[11px] mt-0.5 text-primary/80`}>{sender.purpose}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button type="button" onClick={() => { setSenderForm({ ...sender }); setSenderExpanded(senderExpanded === sender.id ? null : sender.id); setShowSenderNew(false); }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${senderExpanded === sender.id ? "border-primary text-primary" : isLight ? "border-gray-200 hover:border-primary hover:text-primary text-gray-600" : "border-white/10 hover:border-primary hover:text-primary text-gray-400"}`}>
                          {senderExpanded === sender.id ? <ChevronUp className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                        </button>
                        <button type="button" onClick={() => deleteSender(sender.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-600" : "border-white/10 hover:border-red-500/50 hover:text-red-400 text-gray-400"}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {senderExpanded === sender.id && senderForm && (
                      <div className={`border-t px-4 pb-4 pt-3 ${isLight ? "border-gray-100 bg-gray-50/50" : "border-white/5 bg-white/[0.02]"}`}>
                        <SenderForm form={senderForm} setForm={setSenderForm} smtpServers={smtpServers} IN={IN} OB={OB} lbl={lbl} txt={txt} isLight={isLight}
                          onSave={saveSender} onCancel={() => { setSenderExpanded(null); setSenderForm(null); }} />
                      </div>
                    )}
                  </div>
                );
              })}
              {mailSenders.length === 0 && (
                <p className={`text-center py-6 text-sm ${sub}`}>No hay remitentes configurados.</p>
              )}
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

// ── Formulario SMTP ────────────────────────────────────────────────────────
interface SmtpFormProps {
  form: SmtpServer;
  setForm: (v: SmtpServer) => void;
  IN: string;
  OB: string;
  lbl: string;
  txt: string;
  sub: string;
  isLight: boolean;
  showPwd: boolean;
  setShowPwd: (v: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

function SmtpForm({ form, setForm, IN, OB, lbl, txt, sub, isLight, showPwd, setShowPwd, onSave, onCancel }: SmtpFormProps) {
  return (
    <div className="space-y-3">
      <Field label="Nombre del Servidor">
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={IN} />
      </Field>
      <Field label="Host">
        <input type="text" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} className={IN} />
      </Field>
      <Field label="Puerto">
        <input type="text" value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} className={IN} />
      </Field>
      <Field label="Seguridad">
        <select value={form.security} onChange={e => setForm({ ...form, security: e.target.value as "tls"|"ssl"|"none" })} className={IN}>
          <option value="tls" className={OB}>TLS</option>
          <option value="ssl" className={OB}>SSL</option>
          <option value="none" className={OB}>Ninguna</option>
        </select>
      </Field>
      <Field label="Usuario">
        <input type="text" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} className={IN} />
      </Field>
      <Field label="Contraseña">
        <div className="relative">
          <input type={showPwd ? "text" : "password"}
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            className={`${IN} pr-10`} />
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
            {showPwd ? "Ocultar" : "Ver"}
          </button>
        </div>
      </Field>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSave}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/20`}>
          <Check className="w-4 h-4" /> Guardar
        </button>
        <button type="button" onClick={onCancel}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white transition-all shadow-lg shadow-gray-500/20`}>
          <X className="w-4 h-4" /> Cancelar
        </button>
      </div>
    </div>
  );
}

// ── Formulario Remitente ───────────────────────────────────────────────────
interface SenderFormProps {
  form: MailSender;
  setForm: (v: MailSender) => void;
  smtpServers: SmtpServer[];
  IN: string;
  OB: string;
  lbl: string;
  txt: string;
  isLight: boolean;
  onSave: () => void;
  onCancel: () => void;
}

function SenderForm({ form, setForm, smtpServers, IN, OB, lbl, txt, isLight, onSave, onCancel }: SenderFormProps) {
  return (
    <div className="space-y-3">
      <Field label="Alias">
        <input type="text" value={form.alias} onChange={e => setForm({ ...form, alias: e.target.value })} className={IN} />
      </Field>
      <Field label="Nombre del Remitente">
        <input type="text" value={form.fromName} onChange={e => setForm({ ...form, fromName: e.target.value })} className={IN} />
      </Field>
      <Field label="Email del Remitente">
        <input type="email" value={form.fromEmail} onChange={e => setForm({ ...form, fromEmail: e.target.value })} className={IN} />
      </Field>
      <Field label="Propósito">
        <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className={IN}>
          {PURPOSES.map(p => <option key={p} value={p} className={OB}>{p}</option>)}
        </select>
      </Field>
      <Field label="Servidor SMTP">
        <select value={form.smtpId} onChange={e => setForm({ ...form, smtpId: e.target.value })} className={IN}>
          {smtpServers.map(s => <option key={s.id} value={s.id} className={OB}>{s.name}</option>)}
        </select>
      </Field>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSave}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/20`}>
          <Check className="w-4 h-4" /> Guardar
        </button>
        <button type="button" onClick={onCancel}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gray-500 hover:bg-gray-600 text-white transition-all shadow-lg shadow-gray-500/20`}>
          <X className="w-4 h-4" /> Cancelar
        </button>
      </div>
    </div>
  );
}