import { useState } from "react";
import {
  Search, Plus, Filter, Edit, Trash2, X, Save, Download, Printer,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { printChartOfAccounts, downloadChartOfAccountsCSV } from "../utils/print-download";

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
    setForm(emptyForm);
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
  const ic      = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const lbl     = `block mb-1.5 text-sm font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`;
  const card    = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const opt     = "bg-[#0D1B2A]";
  const modalBg = `${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`;
  const padLeft: Record<number, string> = { 1: "px-4", 2: "pl-8 pr-4", 3: "pl-12 pr-4", 4: "pl-16 pr-4" };

  const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;

  /* ── Totales ─────────────────────────────────────────────────────── */
  const totalCuentas = cuentas.length;
  const activas = cuentas.filter(c => c.activa).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-5 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-xl font-bold ${txt}`}>Plan de Cuentas</h2>
          <p className={`text-sm mt-1 ${sub}`}>{totalCuentas} cuentas · {activas} activas</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { downloadChartOfAccountsCSV(cuentas); toast.success("Plan de cuentas exportado"); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => printChartOfAccounts(cuentas)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button
            onClick={() => { setForm(emptyForm); setShowCreateModal(true); }}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Cuenta
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
            }`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${sub}`} />
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
            }`}
          >
            <option value="all" className={opt}>Todos los tipos</option>
            {TIPOS.map(t => <option key={t} value={t} className={opt}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className={`${card} overflow-hidden`}>
        <div className={`px-5 py-3 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide">
            <div className={`col-span-4 ${sub}`}>Cuenta</div>
            <div className={`col-span-2 ${sub}`}>Tipo</div>
            <div className={`col-span-2 text-right ${sub}`}>Saldo</div>
            <div className={`col-span-2 text-center ${sub}`}>Estado</div>
            <div className={`col-span-2 text-right ${sub}`}>Acciones</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {visible.map((c) => {
            const hasChild = hasChildren(c.codigo);
            const isExpanded = expandedCodes.has(c.codigo);
            const isLeaf = c.nivel === 4;

            return (
              <div
                key={c.codigo}
                className={`grid grid-cols-12 gap-4 items-center py-3 ${padLeft[c.nivel] || "px-4"} transition-colors ${
                  isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="col-span-4 flex items-center gap-2">
                  {hasChild ? (
                    <button onClick={() => toggle(c.codigo)} className={`flex-shrink-0 ${sub} hover:text-primary`}>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </button>
                  ) : (
                    <div className="w-4" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-mono ${c.nivel === 1 ? "font-bold" : ""} ${txt} truncate`}>
                      {c.codigo}
                    </span>
                    <span className={`text-sm ${c.nivel === 1 ? "font-semibold" : ""} ${sub} truncate`}>
                      {c.nombre}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    c.tipo === "Activo" ? (isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-300") :
                    c.tipo === "Pasivo" ? (isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-300") :
                    c.tipo === "Patrimonio" ? (isLight ? "bg-purple-100 text-purple-700" : "bg-purple-500/20 text-purple-300") :
                    c.tipo === "Ingreso" ? (isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300") :
                    (isLight ? "bg-orange-100 text-orange-700" : "bg-orange-500/20 text-orange-300")
                  }`}>
                    {c.tipo}
                  </span>
                </div>

                <div className={`col-span-2 text-right text-sm font-mono ${c.saldo !== 0 ? txt : sub}`}>
                  {isLeaf ? fmt(c.saldo) : "—"}
                </div>

                <div className="col-span-2 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    c.activa 
                      ? (isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300")
                      : (isLight ? "bg-gray-100 text-gray-600" : "bg-gray-500/20 text-gray-400")
                  }`}>
                    {c.activa ? "Activa" : "Inactiva"}
                  </span>
                </div>

                <div className="col-span-2 flex items-center justify-end gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className={`p-1.5 rounded transition-colors ${
                      isLight ? "hover:bg-blue-50 text-blue-600" : "hover:bg-blue-500/10 text-blue-400"
                    }`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    disabled={hasChild}
                    className={`p-1.5 rounded transition-colors ${
                      hasChild 
                        ? "opacity-30 cursor-not-allowed"
                        : isLight ? "hover:bg-red-50 text-red-600" : "hover:bg-red-500/10 text-red-400"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modales */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${modalBg} border rounded-lg w-full max-w-md`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <h3 className={`font-bold ${txt}`}>{showCreateModal ? "Nueva Cuenta" : "Editar Cuenta"}</h3>
              <button
                onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}
                className={`p-1 rounded transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
              >
                <X className={`w-5 h-5 ${sub}`} />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div>
                <label className={lbl}>Código</label>
                <input
                  type="text"
                  disabled={showEditModal}
                  value={form.codigo}
                  onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                  className={ic}
                  placeholder="1.1.1.01"
                />
              </div>

              <div>
                <label className={lbl}>Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className={ic}
                  placeholder="Caja General"
                />
              </div>

              <div>
                <label className={lbl}>Tipo</label>
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className={ic}>
                  {TIPOS.map(t => <option key={t} value={t} className={opt}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className={lbl}>Cuenta Padre (opcional)</label>
                <select value={form.padre} onChange={(e) => setForm({ ...form, padre: e.target.value })} className={ic}>
                  <option value="" className={opt}>Ninguna (cuenta raíz)</option>
                  {cuentas.filter(c => c.nivel < 4).map(c => (
                    <option key={c.codigo} value={c.codigo} className={opt}>{c.codigo} — {c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activa"
                  checked={form.activa}
                  onChange={(e) => setForm({ ...form, activa: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="activa" className={`text-sm ${txt}`}>Cuenta activa</label>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-2 px-5 py-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button
                onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={showCreateModal ? handleCreate : handleSaveEdit}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}