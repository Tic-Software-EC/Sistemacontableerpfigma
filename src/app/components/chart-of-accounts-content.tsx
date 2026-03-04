import { useState } from "react";
import {
  Search, Plus, Filter, Edit, Trash2, X, Save, Download, Printer,
  ChevronDown, ChevronRight, List, DollarSign, TrendingUp, TrendingDown,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { printChartOfAccounts, downloadChartOfAccountsCSV } from "../utils/print-download";
import { AccountingKpiCard } from "./ui/accounting-kpi-card";

interface Cuenta {
  codigo: string;
  nombre: string;
  tipo: string;
  nivel: number;
  padre: string | null;
  activa: boolean;
  saldo: number;
}

const CUENTAS_INIT: Cuenta[] = [
  { codigo: "1",        nombre: "ACTIVOS",                        tipo: "Activo",     nivel: 1, padre: null,    activa: true, saldo: 0 },
  { codigo: "1.1",      nombre: "Activos Corrientes",             tipo: "Activo",     nivel: 2, padre: "1",     activa: true, saldo: 0 },
  { codigo: "1.1.1",    nombre: "Efectivo y Equivalentes",        tipo: "Activo",     nivel: 3, padre: "1.1",   activa: true, saldo: 0 },
  { codigo: "1.1.1.01", nombre: "Caja General",                   tipo: "Activo",     nivel: 4, padre: "1.1.1", activa: true, saldo: 12500.00 },
  { codigo: "1.1.1.02", nombre: "Banco Pichincha Cte.",           tipo: "Activo",     nivel: 4, padre: "1.1.1", activa: true, saldo: 85400.00 },
  { codigo: "1.1.1.03", nombre: "Banco Guayaquil Ahorros",        tipo: "Activo",     nivel: 4, padre: "1.1.1", activa: true, saldo: 24300.00 },
  { codigo: "1.1.2",    nombre: "Cuentas por Cobrar",             tipo: "Activo",     nivel: 3, padre: "1.1",   activa: true, saldo: 0 },
  { codigo: "1.1.2.01", nombre: "Clientes Locales",               tipo: "Activo",     nivel: 4, padre: "1.1.2", activa: true, saldo: 34200.00 },
  { codigo: "1.1.2.02", nombre: "Anticipos a Empleados",          tipo: "Activo",     nivel: 4, padre: "1.1.2", activa: true, saldo: 1800.00 },
  { codigo: "1.1.3",    nombre: "Crédito Tributario",             tipo: "Activo",     nivel: 3, padre: "1.1",   activa: true, saldo: 0 },
  { codigo: "1.1.3.01", nombre: "IVA en Compras",                 tipo: "Activo",     nivel: 4, padre: "1.1.3", activa: true, saldo: 4320.00 },
  { codigo: "1.1.4",    nombre: "Inventarios",                    tipo: "Activo",     nivel: 3, padre: "1.1",   activa: true, saldo: 0 },
  { codigo: "1.1.4.01", nombre: "Mercadería en Stock",            tipo: "Activo",     nivel: 4, padre: "1.1.4", activa: true, saldo: 68500.00 },
  { codigo: "1.2",      nombre: "Activos No Corrientes",          tipo: "Activo",     nivel: 2, padre: "1",     activa: true, saldo: 0 },
  { codigo: "1.2.1",    nombre: "Propiedad, Planta y Equipo",     tipo: "Activo",     nivel: 3, padre: "1.2",   activa: true, saldo: 0 },
  { codigo: "1.2.1.01", nombre: "Equipos de Computación",         tipo: "Activo",     nivel: 4, padre: "1.2.1", activa: true, saldo: 18500.00 },
  { codigo: "1.2.1.02", nombre: "(-) Dep. Acum. Equipos",        tipo: "Activo",     nivel: 4, padre: "1.2.1", activa: true, saldo: -5200.00 },
  { codigo: "2",        nombre: "PASIVOS",                        tipo: "Pasivo",     nivel: 1, padre: null,    activa: true, saldo: 0 },
  { codigo: "2.1",      nombre: "Pasivos Corrientes",             tipo: "Pasivo",     nivel: 2, padre: "2",     activa: true, saldo: 0 },
  { codigo: "2.1.1",    nombre: "Cuentas por Pagar",              tipo: "Pasivo",     nivel: 3, padre: "2.1",   activa: true, saldo: 0 },
  { codigo: "2.1.1.01", nombre: "Proveedores Locales",            tipo: "Pasivo",     nivel: 4, padre: "2.1.1", activa: true, saldo: 28600.00 },
  { codigo: "2.1.2",    nombre: "Obligaciones Laborales",         tipo: "Pasivo",     nivel: 3, padre: "2.1",   activa: true, saldo: 0 },
  { codigo: "2.1.2.01", nombre: "Sueldos por Pagar",              tipo: "Pasivo",     nivel: 4, padre: "2.1.2", activa: true, saldo: 12400.00 },
  { codigo: "2.1.3",    nombre: "Obligaciones Fiscales",          tipo: "Pasivo",     nivel: 3, padre: "2.1",   activa: true, saldo: 0 },
  { codigo: "2.1.3.01", nombre: "IVA por Pagar",                  tipo: "Pasivo",     nivel: 4, padre: "2.1.3", activa: true, saldo: 9800.00 },
  { codigo: "2.1.3.02", nombre: "Ret. Fuente por Pagar",          tipo: "Pasivo",     nivel: 4, padre: "2.1.3", activa: true, saldo: 1240.00 },
  { codigo: "3",        nombre: "PATRIMONIO",                     tipo: "Patrimonio", nivel: 1, padre: null,    activa: true, saldo: 0 },
  { codigo: "3.1",      nombre: "Capital Social",                 tipo: "Patrimonio", nivel: 2, padre: "3",     activa: true, saldo: 0 },
  { codigo: "3.1.1.01", nombre: "Capital Suscrito y Pagado",      tipo: "Patrimonio", nivel: 4, padre: "3.1",   activa: true, saldo: 50000.00 },
  { codigo: "3.2",      nombre: "Resultados",                     tipo: "Patrimonio", nivel: 2, padre: "3",     activa: true, saldo: 0 },
  { codigo: "3.2.1.01", nombre: "Utilidad del Ejercicio",         tipo: "Patrimonio", nivel: 4, padre: "3.2",   activa: true, saldo: 154180.00 },
  { codigo: "4",        nombre: "INGRESOS",                       tipo: "Ingreso",    nivel: 1, padre: null,    activa: true, saldo: 0 },
  { codigo: "4.1",      nombre: "Ingresos Operacionales",         tipo: "Ingreso",    nivel: 2, padre: "4",     activa: true, saldo: 0 },
  { codigo: "4.1.1.01", nombre: "Ventas Netas",                   tipo: "Ingreso",    nivel: 4, padre: "4.1",   activa: true, saldo: 342000.00 },
  { codigo: "4.1.1.02", nombre: "Descuentos en Ventas",           tipo: "Ingreso",    nivel: 4, padre: "4.1",   activa: true, saldo: -8400.00 },
  { codigo: "5",        nombre: "GASTOS",                         tipo: "Gasto",      nivel: 1, padre: null,    activa: true, saldo: 0 },
  { codigo: "5.1",      nombre: "Gastos Operacionales",           tipo: "Gasto",      nivel: 2, padre: "5",     activa: true, saldo: 0 },
  { codigo: "5.1.1.01", nombre: "Sueldos y Salarios",             tipo: "Gasto",      nivel: 4, padre: "5.1",   activa: true, saldo: 148200.00 },
  { codigo: "5.1.1.02", nombre: "Beneficios Sociales",            tipo: "Gasto",      nivel: 4, padre: "5.1",   activa: true, saldo: 24600.00 },
  { codigo: "5.2",      nombre: "Gastos Financieros",             tipo: "Gasto",      nivel: 2, padre: "5",     activa: true, saldo: 0 },
  { codigo: "5.2.1.01", nombre: "Gastos Bancarios",               tipo: "Gasto",      nivel: 4, padre: "5.2",   activa: true, saldo: 1240.00 },
  { codigo: "5.2.1.02", nombre: "Intereses Pagados",              tipo: "Gasto",      nivel: 4, padre: "5.2",   activa: true, saldo: 3200.00 },
];

const TIPO_COLORS: Record<string, { light: string; dark: string }> = {
  "Activo":     { light: "bg-blue-100 text-blue-700",     dark: "bg-blue-500/20 text-blue-300"     },
  "Pasivo":     { light: "bg-red-100 text-red-700",       dark: "bg-red-500/20 text-red-300"       },
  "Patrimonio": { light: "bg-purple-100 text-purple-700", dark: "bg-purple-500/20 text-purple-300" },
  "Ingreso":    { light: "bg-green-100 text-green-700",   dark: "bg-green-500/20 text-green-300"   },
  "Gasto":      { light: "bg-orange-100 text-orange-700", dark: "bg-orange-500/20 text-orange-300" },
};

const TIPOS = ["Activo", "Pasivo", "Patrimonio", "Ingreso", "Gasto"];

export function ChartOfAccountsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [cuentas, setCuentas]             = useState<Cuenta[]>(CUENTAS_INIT);
  const [search, setSearch]               = useState("");
  const [filterTipo, setFilterTipo]       = useState("all");
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set(["1","2","3","4","5"]));

  /* ── Modales ────────────────────────────────────────────────────────── */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal,   setShowEditModal]   = useState(false);
  const [editingCuenta,   setEditingCuenta]   = useState<Cuenta | null>(null);

  const emptyForm = { codigo: "", nombre: "", tipo: "Activo", padre: "", activa: true, saldo: 0 };
  const [form, setForm] = useState(emptyForm);

  /* ── Filtrado ─────────────────────────────────────────────────────── */
  const searching = search.trim() !== "" || filterTipo !== "all";
  const visible   = cuentas.filter(c => {
    const q       = search.toLowerCase();
    const matchQ  = c.codigo.includes(q) || c.nombre.toLowerCase().includes(q);
    const matchT  = filterTipo === "all" || c.tipo === filterTipo;
    if (!matchQ || !matchT) return false;
    if (searching) return true;
    if (!c.padre) return true;
    return expandedCodes.has(c.padre);
  });

  const hasChildren = (cod: string) => cuentas.some(c => c.padre === cod);
  const toggle      = (cod: string) => setExpandedCodes(prev => { const n = new Set(prev); n.has(cod) ? n.delete(cod) : n.add(cod); return n; });

  /* ── Guardar nueva cuenta ────────────────────────────────────────── */
  const handleCreate = () => {
    if (!form.codigo.trim() || !form.nombre.trim()) { toast.error("Código y nombre son obligatorios"); return; }
    if (cuentas.some(c => c.codigo === form.codigo)) { toast.error("Ya existe una cuenta con ese código"); return; }
    const nivel = form.padre ? (cuentas.find(c => c.codigo === form.padre)?.nivel ?? 0) + 1 : 1;
    setCuentas(prev => [...prev, { ...form, nivel, padre: form.padre || null }]);
    toast.success("Cuenta creada correctamente");
    setShowCreateModal(false);
  };

  /* ── Guardar edición ─────────────────────────────────────────────── */
  const openEdit = (c: Cuenta) => {
    setEditingCuenta(c);
    setForm({ codigo: c.codigo, nombre: c.nombre, tipo: c.tipo, padre: c.padre ?? "", activa: c.activa, saldo: c.saldo });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!form.nombre.trim()) { toast.error("El nombre es obligatorio"); return; }
    setCuentas(prev => prev.map(c => c.codigo === editingCuenta!.codigo ? { ...c, nombre: form.nombre, tipo: form.tipo, activa: form.activa, saldo: form.saldo } : c));
    toast.success("Cuenta actualizada correctamente");
    setShowEditModal(false);
    setEditingCuenta(null);
  };

  /* ── Eliminar ─────────────────────────────────────────────────────── */
  const handleDelete = (c: Cuenta) => {
    if (hasChildren(c.codigo)) { toast.error("No se puede eliminar una cuenta con subcuentas"); return; }
    if (!confirm(`¿Eliminar la cuenta ${c.codigo} — ${c.nombre}?`)) return;
    setCuentas(prev => prev.filter(x => x.codigo !== c.codigo));
    toast.success("Cuenta eliminada");
  };

  /* ── Estilos ─────────────────────────────────────────────────────── */
  const ic      = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const lbl     = `block mb-1.5 text-sm font-medium ${isLight ? "text-gray-700" : "text-white"}`;
  const card    = `rounded-xl p-4 ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const divider = `border-t ${isLight ? "border-gray-200" : "border-white/10"}`;
  const opt     = "bg-[#0D1B2A]";
  const modalBg = `${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`;
  const tipoClr = (tipo: string) => isLight ? TIPO_COLORS[tipo]?.light || "bg-gray-100 text-gray-600" : TIPO_COLORS[tipo]?.dark || "bg-white/10 text-gray-400";
  const padLeft: Record<number, string> = { 1: "px-4", 2: "pl-8 pr-4", 3: "pl-12 pr-4", 4: "pl-16 pr-4" };

  /* ── Modal compartido crear/editar ───────────────────────────────── */
  const renderFormModal = (mode: "create" | "edit", onClose: () => void, onSave: () => void) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${modalBg}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              {mode === "create" ? <Plus className="w-5 h-5 text-primary" /> : <Edit className="w-5 h-5 text-primary" />}
            </div>
            <h3 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>
              {mode === "create" ? "Nueva Cuenta" : `Editar Cuenta — ${editingCuenta?.codigo}`}
            </h3>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Código <span className="text-red-400">*</span></label>
              <input type="text" value={form.codigo}
                onChange={e => setForm({...form, codigo: e.target.value})}
                disabled={mode === "edit"}
                placeholder="Ej: 1.1.1.04"
                className={`${ic} ${mode === "edit" ? "opacity-60 cursor-not-allowed" : ""}`} />
            </div>
            <div>
              <label className={lbl}>Tipo <span className="text-red-400">*</span></label>
              <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className={ic}>
                {TIPOS.map(t => <option key={t} value={t} className={opt}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl}>Nombre <span className="text-red-400">*</span></label>
            <input type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
              placeholder="Nombre de la cuenta" className={ic} />
          </div>
          {mode === "create" && (
            <div>
              <label className={lbl}>Cuenta Padre</label>
              <select value={form.padre} onChange={e => setForm({...form, padre: e.target.value})} className={ic}>
                <option value="" className={opt}>Sin padre (cuenta principal)</option>
                {cuentas.filter(c => c.nivel < 4).map(c => (
                  <option key={c.codigo} value={c.codigo} className={opt}>{c.codigo} – {c.nombre}</option>
                ))}
              </select>
            </div>
          )}
          {mode === "edit" && (
            <>
              <div>
                <label className={lbl}>Saldo Actual ($)</label>
                <input type="number" step="0.01" value={form.saldo}
                  onChange={e => setForm({...form, saldo: parseFloat(e.target.value) || 0})}
                  className={ic} />
              </div>
              <div className="flex items-center gap-3">
                <label className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-white"}`}>Estado:</label>
                <button onClick={() => setForm({...form, activa: !form.activa})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.activa ? "bg-primary" : isLight ? "bg-gray-300" : "bg-white/10"}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.activa ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{form.activa ? "Activa" : "Inactiva"}</span>
              </div>
            </>
          )}
        </div>
        <div className={`border-t px-5 py-4 flex justify-end gap-3 ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <button onClick={onClose}
            className={`px-5 py-2 rounded-lg text-sm font-medium border ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}>
            Cancelar
          </button>
          <button onClick={onSave}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> {mode === "create" ? "Crear Cuenta" : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Cuentas",   value: cuentas.length,                                         icon: <List         className="w-5 h-5 text-primary" />,       bg: "bg-primary/20"    },
          { label: "Activos",         value: cuentas.filter(c=>c.tipo==="Activo").length,             icon: <TrendingUp   className="w-5 h-5 text-blue-400" />,       bg: "bg-blue-500/20"   },
          { label: "Pasivos + Patr.", value: cuentas.filter(c=>["Pasivo","Patrimonio"].includes(c.tipo)).length, icon: <TrendingDown className="w-5 h-5 text-red-400" />,  bg: "bg-red-500/20"   },
          { label: "Ingresos/Gastos", value: cuentas.filter(c=>["Ingreso","Gasto"].includes(c.tipo)).length,    icon: <DollarSign   className="w-5 h-5 text-green-400" />, bg: "bg-green-500/20" },
        ].map(m => (
          <AccountingKpiCard key={m.label} label={m.label} value={m.value} icon={m.icon} iconBg={m.bg} />
        ))}
      </div>

      <div className={divider} />

      {/* Acciones */}
      <div className="flex justify-end gap-2">
        <button onClick={() => downloadChartOfAccountsCSV(cuentas)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
        <button onClick={() => printChartOfAccounts(cuentas)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
          <Printer className="w-4 h-4" /> Imprimir
        </button>
        <button onClick={() => { setForm(emptyForm); setShowCreateModal(true); }}
          className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center gap-2 text-sm shadow-lg shadow-primary/20 transition-colors">
          <Plus className="w-4 h-4" /> Nueva Cuenta
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar por código o nombre..." value={search} onChange={e => setSearch(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${isLight ? "text-gray-900" : "text-white"}`} />
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[160px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${isLight ? "text-gray-700" : "text-gray-300"}`}>
            <option value="all" className={opt}>Todos los tipos</option>
            {TIPOS.map(t => <option key={t} value={t} className={opt}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Tabla árbol */}
      <div className={`rounded-xl overflow-hidden border ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"}`}>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-right">Saldo Actual</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(cuenta => {
                const hasKids = hasChildren(cuenta.codigo);
                const isOpen  = expandedCodes.has(cuenta.codigo);
                const isGroup = cuenta.nivel <= 3;
                return (
                  <tr key={cuenta.codigo}
                    className={`border-b transition-colors ${isGroup ? isLight ? "bg-gray-50/60 border-gray-100" : "bg-white/[0.02] border-white/5" : isLight ? "hover:bg-gray-50 border-gray-100" : "hover:bg-white/[0.03] border-white/5"}`}>
                    <td className={`${padLeft[cuenta.nivel] || "px-4"} py-2.5`}>
                      <div className="flex items-center gap-2">
                        {hasKids ? (
                          <button onClick={() => toggle(cuenta.codigo)}
                            className={`p-0.5 rounded transition-colors ${isLight ? "text-gray-400 hover:text-primary" : "text-gray-500 hover:text-primary"}`}>
                            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          </div>
                        )}
                        <span className={`font-mono text-sm ${isGroup ? isLight ? "font-bold text-gray-700" : "font-bold text-white" : isLight ? "text-gray-600" : "text-gray-300"}`}>
                          {cuenta.codigo}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-sm ${isGroup ? isLight ? "font-semibold text-gray-800" : "font-semibold text-white" : isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {cuenta.nombre}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tipoClr(cuenta.tipo)}`}>
                        {cuenta.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {cuenta.nivel === 4 ? (
                        <span className={`font-mono text-sm ${cuenta.saldo < 0 ? "text-red-400" : isLight ? "text-gray-800" : "text-gray-200"}`}>
                          {cuenta.saldo < 0 ? `(${Math.abs(cuenta.saldo).toLocaleString("es-EC",{minimumFractionDigits:2})})` : `$${cuenta.saldo.toLocaleString("es-EC",{minimumFractionDigits:2})}`}
                        </span>
                      ) : <span className="text-gray-400 text-sm">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cuenta.activa ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300" : isLight ? "bg-gray-100 text-gray-500" : "bg-white/5 text-gray-500"}`}>
                        {cuenta.activa ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(cuenta)} title="Editar"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-blue-600 hover:bg-blue-50" : "hover:text-blue-400 hover:bg-blue-500/10"}`}>
                          <Edit className="w-4 h-4" />
                        </button>
                        {cuenta.nivel > 1 && (
                          <button onClick={() => handleDelete(cuenta)} title="Eliminar"
                            className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-red-600 hover:bg-red-50" : "hover:text-red-400 hover:bg-red-500/10"}`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && renderFormModal("create", () => setShowCreateModal(false), handleCreate)}
      {showEditModal   && renderFormModal("edit",   () => { setShowEditModal(false); setEditingCuenta(null); }, handleSaveEdit)}
    </div>
  );
}