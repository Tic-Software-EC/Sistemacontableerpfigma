import { useState } from "react";
import {
  CreditCard, Building2, Plus, Pencil, Trash2,
  Check, X, Search, SlidersHorizontal, ToggleLeft, ToggleRight,
  DollarSign, Percent, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../contexts/theme-context";

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

interface PaymentMethod {
  id: string;
  sucursalId: string;
  name: string;
  type: "cash" | "credit_card" | "debit_card" | "transfer" | "check" | "credit";
  enabled: boolean;
  commissionPercent: string;
  commissionFixed: string;
  requiresAuthorization: boolean;
  accountingAccount: string;
  allowPartialPayment: boolean;
  maxAmount: string;
  color: string;
}

const PAYMENT_TYPES = [
  { id: "cash",        name: "Efectivo",               icon: "💵" },
  { id: "credit_card", name: "Tarjeta de Crédito",     icon: "💳" },
  { id: "debit_card",  name: "Tarjeta de Débito",      icon: "💳" },
  { id: "transfer",    name: "Transferencia Bancaria",  icon: "🏦" },
  { id: "check",       name: "Cheque",                 icon: "📝" },
  { id: "credit",      name: "Crédito",                icon: "📋" },
];

const COLORS = [
  { id: "green",  name: "Verde",    value: "#10b981" },
  { id: "blue",   name: "Azul",     value: "#3b82f6" },
  { id: "purple", name: "Morado",   value: "#8b5cf6" },
  { id: "orange", name: "Naranja",  value: "#E8692E" },
  { id: "yellow", name: "Amarillo", value: "#f59e0b" },
  { id: "red",    name: "Rojo",     value: "#ef4444" },
  { id: "pink",   name: "Rosa",     value: "#ec4899" },
  { id: "gray",   name: "Gris",     value: "#6b7280" },
];

const EMPTY_FORM: Partial<PaymentMethod> = {
  name: "", type: "cash", enabled: true,
  commissionPercent: "0", commissionFixed: "0",
  requiresAuthorization: false, accountingAccount: "",
  allowPartialPayment: true, maxAmount: "", color: "#10b981",
};

const INITIAL_DATA: PaymentMethod[] = [
  { id: "pm-001", sucursalId: "suc-001", name: "Efectivo",                    type: "cash",        enabled: true,  commissionPercent: "0",   commissionFixed: "0",    requiresAuthorization: false, accountingAccount: "1101-001", allowPartialPayment: true,  maxAmount: "10000", color: "#10b981" },
  { id: "pm-002", sucursalId: "suc-001", name: "Tarjeta Visa/Mastercard",     type: "credit_card", enabled: true,  commissionPercent: "2.5", commissionFixed: "0",    requiresAuthorization: false, accountingAccount: "1102-001", allowPartialPayment: false, maxAmount: "50000", color: "#3b82f6" },
  { id: "pm-003", sucursalId: "suc-001", name: "Transferencia Banco Pichincha",type: "transfer",   enabled: true,  commissionPercent: "0",   commissionFixed: "0.50", requiresAuthorization: true,  accountingAccount: "1103-001", allowPartialPayment: true,  maxAmount: "100000",color: "#8b5cf6" },
  { id: "pm-004", sucursalId: "suc-001", name: "Crédito 30 días",             type: "credit",      enabled: true,  commissionPercent: "0",   commissionFixed: "0",    requiresAuthorization: true,  accountingAccount: "1301-001", allowPartialPayment: true,  maxAmount: "20000", color: "#E8692E" },
  { id: "pm-005", sucursalId: "suc-002", name: "Efectivo",                    type: "cash",        enabled: true,  commissionPercent: "0",   commissionFixed: "0",    requiresAuthorization: false, accountingAccount: "1101-002", allowPartialPayment: true,  maxAmount: "5000",  color: "#10b981" },
  { id: "pm-006", sucursalId: "suc-002", name: "Tarjeta de Débito",           type: "debit_card",  enabled: false, commissionPercent: "1.5", commissionFixed: "0",    requiresAuthorization: false, accountingAccount: "1102-002", allowPartialPayment: false, maxAmount: "30000", color: "#3b82f6" },
];

function Chk({ checked, onChange, label, desc }: { checked: boolean; onChange: () => void; label: string; desc?: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <button type="button" onClick={onChange}
        className={`mt-0.5 w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-primary border-primary" : "border-gray-400"}`}>
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs mt-0.5 text-gray-500">{desc}</p>}
      </div>
    </label>
  );
}

export function PaymentMethodsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── estilos adaptativos ──────────────────────────────────────────────────
  const txt   = isLight ? "text-gray-900"  : "text-white";
  const sub   = isLight ? "text-gray-500"  : "text-gray-400";
  const lbl   = isLight ? "text-gray-600"  : "text-gray-300";
  const divB  = isLight ? "border-gray-200" : "border-white/10";
  const rowHv = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.04]";
  const tHead = isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-white/5 border-white/10 text-gray-400";
  const tDiv  = isLight ? "divide-gray-100" : "divide-white/5";
  const tWrap = isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10";
  const MB    = isLight ? "bg-white border border-gray-200" : "bg-[#0D1B2A] border border-white/10";
  const IN    = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder:text-gray-500"}`;
  const OB    = "bg-[#0D1B2A]";
  const SEC   = isLight ? "bg-gray-50 border border-gray-200 rounded-xl p-4" : "bg-white/5 border border-white/10 rounded-xl p-4";

  const [selectedSucursal, setSelectedSucursal] = useState("suc-001");
  const [searchTerm,       setSearchTerm]       = useState("");
  const [showModal,        setShowModal]        = useState(false);
  const [editingMethod,    setEditingMethod]    = useState<PaymentMethod | null>(null);
  const [paymentMethods,   setPaymentMethods]  = useState<PaymentMethod[]>(INITIAL_DATA);
  const [formData,         setFormData]        = useState<Partial<PaymentMethod>>(EMPTY_FORM);

  const filtered = paymentMethods.filter(m =>
    m.sucursalId === selectedSucursal &&
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalActivos   = paymentMethods.filter(m => m.sucursalId === selectedSucursal && m.enabled).length;
  const totalDesact    = paymentMethods.filter(m => m.sucursalId === selectedSucursal && !m.enabled).length;
  const totalSucursal  = paymentMethods.filter(m => m.sucursalId === selectedSucursal).length;

  const getTypeName = (t: string) => PAYMENT_TYPES.find(p => p.id === t)?.name ?? t;
  const getTypeIcon = (t: string) => PAYMENT_TYPES.find(p => p.id === t)?.icon ?? "💰";

  const openNew = () => {
    setEditingMethod(null);
    setFormData({ ...EMPTY_FORM, sucursalId: selectedSucursal });
    setShowModal(true);
  };

  const openEdit = (m: PaymentMethod) => {
    setEditingMethod(m);
    setFormData(m);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMethod(null);
    setFormData(EMPTY_FORM);
  };

  const handleSave = () => {
    if (!formData.name?.trim() || !formData.accountingAccount?.trim()) {
      toast.error("Nombre y cuenta contable son obligatorios");
      return;
    }
    if (editingMethod) {
      setPaymentMethods(prev => prev.map(m => m.id === editingMethod.id ? { ...m, ...formData } as PaymentMethod : m));
      toast.success("Método de pago actualizado");
    } else {
      const nm: PaymentMethod = { id: `pm-${Date.now()}`, sucursalId: selectedSucursal, ...formData as PaymentMethod };
      setPaymentMethods(prev => [...prev, nm]);
      toast.success("Método de pago creado");
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este método de pago?")) return;
    setPaymentMethods(prev => prev.filter(m => m.id !== id));
    toast.success("Método eliminado");
  };

  const toggleEnabled = (id: string) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const f = (field: keyof PaymentMethod, val: any) => setFormData(prev => ({ ...prev, [field]: val }));

  return (
    <div className="space-y-6 w-full">

      {/* ── TÍTULO ── */}
      <div>
        <h2 className={`font-bold text-3xl mb-1 flex items-center gap-3 ${txt}`}>
          <CreditCard className="w-8 h-8 text-primary" />
          Métodos de Pago
        </h2>
        <p className={`text-sm ${sub}`}>Configura los métodos de pago disponibles por sucursal</p>
      </div>

      {/* ── MÉTRICAS ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total",       value: totalSucursal, color: "text-primary",    bg: "bg-primary/15"    },
          { label: "Activos",     value: totalActivos,  color: "text-green-500",  bg: "bg-green-500/15"  },
          { label: "Inactivos",   value: totalDesact,   color: "text-gray-400",   bg: "bg-gray-500/15"   },
        ].map(m => (
          <div key={m.label} className={`rounded-xl border p-4 ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`}>
            <p className={`text-xs mb-1 ${sub}`}>{m.label}</p>
            <p className={`font-bold text-2xl ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className={`border-t ${divB}`} />

      {/* ── BOTÓN ACCIÓN ── */}
      <div className="flex justify-end">
        <button onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nuevo Método
        </button>
      </div>

      {/* ── FILTROS ── */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Búsqueda */}
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar método de pago..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${txt}`} />
        </div>
        {/* Filtro sucursal */}
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[220px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={selectedSucursal} onChange={e => setSelectedSucursal(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${sub}`}>
            {SUCURSALES.map(s => <option key={s.id} value={s.id} className={OB}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* ── TABLA ── */}
      <div className={`rounded-xl overflow-hidden border ${tWrap}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${tHead}`}>
                <th className="px-4 py-3 text-left">Método</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Tipo</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Cta. Contable</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Comisión</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Opciones</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${tDiv}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <CreditCard className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm ${sub}`}>No hay métodos de pago configurados para esta sucursal</p>
                  </td>
                </tr>
              ) : filtered.map(m => {
                const hasComm = parseFloat(m.commissionPercent) > 0 || parseFloat(m.commissionFixed) > 0;
                return (
                  <tr key={m.id} className={`transition-colors ${rowHv}`}>
                    {/* Método */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{ backgroundColor: `${m.color}20`, border: `1.5px solid ${m.color}` }}>
                          {getTypeIcon(m.type)}
                        </div>
                        <span className={`text-sm font-semibold ${txt}`}>{m.name}</span>
                      </div>
                    </td>
                    {/* Tipo */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs px-2 py-0.5 rounded-md ${isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-300"}`}>
                        {getTypeName(m.type)}
                      </span>
                    </td>
                    {/* Cuenta */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-sm font-mono ${isLight ? "text-gray-500" : "text-gray-400"}`}>{m.accountingAccount}</span>
                    </td>
                    {/* Comisión */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      {hasComm ? (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${isLight ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-yellow-500/10 text-yellow-400"}`}>
                          {parseFloat(m.commissionPercent) > 0 && `${m.commissionPercent}%`}
                          {parseFloat(m.commissionPercent) > 0 && parseFloat(m.commissionFixed) > 0 && " + "}
                          {parseFloat(m.commissionFixed) > 0 && `$${m.commissionFixed}`}
                        </span>
                      ) : (
                        <span className={`text-xs ${sub}`}>—</span>
                      )}
                    </td>
                    {/* Opciones */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {m.requiresAuthorization && (
                          <span title="Requiere autorización">
                            <ShieldCheck className="w-4 h-4 text-orange-400" />
                          </span>
                        )}
                        {m.allowPartialPayment && (
                          <span title="Pago parcial permitido">
                            <Percent className="w-4 h-4 text-blue-400" />
                          </span>
                        )}
                        {m.maxAmount && (
                          <span title={`Máx. $${parseFloat(m.maxAmount).toLocaleString()}`}>
                            <DollarSign className="w-4 h-4 text-green-400" />
                          </span>
                        )}
                        {!m.requiresAuthorization && !m.allowPartialPayment && !m.maxAmount && (
                          <span className={`text-xs ${sub}`}>—</span>
                        )}
                      </div>
                    </td>
                    {/* Estado toggle */}
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleEnabled(m.id)}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                          m.enabled
                            ? isLight ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                            : isLight ? "bg-gray-100 text-gray-500 hover:bg-gray-200"   : "bg-white/5 text-gray-500 hover:bg-white/10"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.enabled ? "bg-green-500" : "bg-gray-400"}`} />
                        {m.enabled ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(m)} title="Editar"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-blue-600 hover:bg-blue-50" : "hover:text-blue-400 hover:bg-white/10"}`}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(m.id)} title="Eliminar"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-red-600 hover:bg-red-50" : "hover:text-red-400 hover:bg-white/10"}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL CREAR / EDITAR ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] flex flex-col ${MB}`}>

            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${divB}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <p className={`font-bold text-base ${txt}`}>
                  {editingMethod ? "Editar Método de Pago" : "Nuevo Método de Pago"}
                </p>
              </div>
              <button onClick={closeModal}
                className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {/* Nombre + Tipo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                    Nombre <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="Ej: Efectivo" value={formData.name ?? ""}
                    onChange={e => f("name", e.target.value)} className={IN} />
                </div>
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Tipo de pago</label>
                  <select value={formData.type ?? "cash"} onChange={e => f("type", e.target.value)} className={IN}>
                    {PAYMENT_TYPES.map(t => <option key={t.id} value={t.id} className={OB}>{t.icon} {t.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Color + Cuenta contable */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Color identificador</label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border-2 flex-shrink-0"
                      style={{ backgroundColor: formData.color ?? "#10b981", borderColor: formData.color ?? "#10b981" }} />
                    <select value={formData.color ?? "#10b981"} onChange={e => f("color", e.target.value)} className={`${IN} flex-1`}>
                      {COLORS.map(c => <option key={c.id} value={c.value} className={OB}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                    Cuenta contable <span className="text-red-400">*</span>
                  </label>
                  <input type="text" placeholder="Ej: 1.1.01.001" value={formData.accountingAccount ?? ""}
                    onChange={e => f("accountingAccount", e.target.value)} className={IN} />
                </div>
              </div>

              {/* Comisiones */}
              <div className={SEC}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${sub}`}>Comisiones</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Comisión porcentual (%)</label>
                    <input type="number" min="0" step="0.01" placeholder="0.00" value={formData.commissionPercent ?? "0"}
                      onChange={e => f("commissionPercent", e.target.value)} className={IN} />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Comisión fija ($)</label>
                    <input type="number" min="0" step="0.01" placeholder="0.00" value={formData.commissionFixed ?? "0"}
                      onChange={e => f("commissionFixed", e.target.value)} className={IN} />
                  </div>
                </div>
              </div>

              {/* Monto máximo */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Monto máximo permitido ($)</label>
                <input type="number" min="0" step="0.01" placeholder="Sin límite" value={formData.maxAmount ?? ""}
                  onChange={e => f("maxAmount", e.target.value)} className={IN} />
              </div>

              {/* Opciones */}
              <div className={`${SEC} space-y-3`}>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${sub}`}>Opciones</p>
                <div className={txt}>
                  <Chk checked={!!formData.enabled}
                    onChange={() => f("enabled", !formData.enabled)}
                    label="Método habilitado"
                    desc="Permitir usar este método de pago en las ventas" />
                </div>
                <div className={txt}>
                  <Chk checked={!!formData.requiresAuthorization}
                    onChange={() => f("requiresAuthorization", !formData.requiresAuthorization)}
                    label="Requiere autorización"
                    desc="Solicitar aprobación de un supervisor antes de usar este método" />
                </div>
                <div className={txt}>
                  <Chk checked={!!formData.allowPartialPayment}
                    onChange={() => f("allowPartialPayment", !formData.allowPartialPayment)}
                    label="Permitir pago parcial"
                    desc="Habilitar pagos parciales con este método" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`px-5 py-4 border-t flex gap-3 flex-shrink-0 ${divB}`}>
              <button onClick={closeModal}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                Cancelar
              </button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                {editingMethod ? "Guardar Cambios" : "Crear Método"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
