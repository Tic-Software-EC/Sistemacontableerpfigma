import { useState } from "react";
import {
  ShoppingCart, Building2, Plus, Check, AlertTriangle, X, Search,
  Eye, Trash2, Zap, Monitor, Printer, UserCheck, User,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface PosConfigContentProps { userPlan?: string; }

// Catálogo global de impresoras del sistema (creadas en la sección de Impresoras)
const SYSTEM_PRINTERS = [
  { id: "sp1", name: "EPSON TM-T20III",  type: "USB",       paperSize: "80mm", purpose: "Recibo / Ticket" },
  { id: "sp2", name: "HP LaserJet M15w", type: "Red / IP",  paperSize: "80mm", purpose: "Factura" },
  { id: "sp3", name: "BIXOLON SRP-350",  type: "Red / IP",  paperSize: "80mm", purpose: "Recibo / Ticket" },
  { id: "sp4", name: "Star TSP100",      type: "Bluetooth", paperSize: "58mm", purpose: "Recibo / Ticket" },
  { id: "sp5", name: "EPSON TM-U220",    type: "USB",       paperSize: "80mm", purpose: "Comanda / Cocina" },
  { id: "sp6", name: "Samsung ML-2160",  type: "Red / IP",  paperSize: "80mm", purpose: "Factura" },
  { id: "sp7", name: "Zebra ZD420",      type: "USB",       paperSize: "58mm", purpose: "Reporte" },
];

interface Caja {
  id: string; code: string; name: string; branchId: string;
  status: "active"; printerIds: string[]; employeeId: string | null;
}

const BRANCHES = [
  { id: "b1", code: "MTZ-001", name: "Matriz - Centro" },
  { id: "b2", code: "NRT-002", name: "Sucursal Norte" },
  { id: "b3", code: "SUR-003", name: "Sucursal Sur" },
  { id: "b4", code: "VLL-004", name: "Sucursal Valle" },
  { id: "b5", code: "CCA-005", name: "Sucursal C. Comercial" },
];
const EMPLOYEES = [
  { id: "e1", code: "EMP-001", name: "Carlos Mendoza",  role: "Cajero",   branch: "b1" },
  { id: "e2", code: "EMP-002", name: "Ana Torres",      role: "Cajero",   branch: "b1" },
  { id: "e3", code: "EMP-003", name: "Luis Paredes",    role: "Vendedor", branch: "b1" },
  { id: "e4", code: "EMP-004", name: "María Salazar",   role: "Cajero",   branch: "b2" },
  { id: "e5", code: "EMP-005", name: "Jorge Ríos",      role: "Vendedor", branch: "b2" },
  { id: "e6", code: "EMP-006", name: "Diana Castro",    role: "Cajero",   branch: "b3" },
  { id: "e7", code: "EMP-007", name: "Roberto Vera",    role: "Cajero",   branch: "b4" },
  { id: "e8", code: "EMP-008", name: "Sofía Mejía",     role: "Vendedor", branch: "b4" },
];

const initialCajas: Caja[] = [
  { id: "c1", code: "CJ-001", name: "Caja Principal", branchId: "b1", status: "active", employeeId: "e1",  printerIds: ["sp1", "sp2"] },
  { id: "c2", code: "CJ-002", name: "Caja Rápida",    branchId: "b1", status: "active", employeeId: "e2",  printerIds: ["sp3"] },
  { id: "c3", code: "CJ-001", name: "Caja 1",         branchId: "b2", status: "active", employeeId: null,  printerIds: [] },
  { id: "c4", code: "CJ-001", name: "Caja Principal", branchId: "b3", status: "active", employeeId: "e6",  printerIds: ["sp4", "sp5"] },
  { id: "c5", code: "CJ-001", name: "Caja Express",   branchId: "b4", status: "active", employeeId: null,  printerIds: [] },
];

function Chk({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer ${checked ? "bg-primary border-primary" : "border-gray-400"}`}>
      {checked && <Check className="w-3 h-3 text-white" />}
    </button>
  );
}

export function PosConfigContent({ userPlan = "Plan Básico" }: PosConfigContentProps) {
  const { theme } = useTheme();
  const posLimit = userPlan === "Plan Básico" ? 3 : userPlan === "Plan Profesional" ? 10 : 999;

  const [cajas, setCajas] = useState<Caja[]>(initialCajas);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");

  // Modal crear caja
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", branchId: "b1" });

  // Modal asignar impresoras (selector)
  const [showPrinters, setShowPrinters] = useState(false);
  const [printersCajaId, setPrintersCajaId] = useState<string | null>(null);
  const [selPrinterIds, setSelPrinterIds] = useState<string[]>([]);
  const [printerQ, setPrinterQ] = useState("");

  // Modal empleado
  const [showEmp, setShowEmp] = useState(false);
  const [empCajaId, setEmpCajaId] = useState<string | null>(null);
  const [selEmpId, setSelEmpId] = useState<string | null>(null);
  const [empQ, setEmpQ] = useState("");

  // Modal ver
  const [showView, setShowView] = useState(false);
  const [viewing, setViewing] = useState<Caja | null>(null);

  const hasLimit = cajas.length >= posLimit;
  const filtered = cajas.filter(c => {
    const q = searchTerm.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      && (filterBranch === "all" || c.branchId === filterBranch);
  });

  const getBranch = (id: string) => BRANCHES.find(b => b.id === id);
  const getEmp    = (id: string | null) => id ? EMPLOYEES.find(e => e.id === id) ?? null : null;
  const getPrinter = (id: string) => SYSTEM_PRINTERS.find(p => p.id === id);
  const empBranchId = cajas.find(c => c.id === empCajaId)?.branchId;
  const activeCaja  = cajas.find(c => c.id === printersCajaId);

  // Caja CRUD
  const saveForm = () => {
    if (!form.code.trim() || !form.name.trim()) { alert("Código y nombre son obligatorios."); return; }
    setCajas(p => [...p, { id: `c${Date.now()}`, ...form, status: "active", printerIds: [], employeeId: null }]);
    setShowForm(false);
  };
  const deleteCaja = (id: string) => { if (!confirm("¿Eliminar esta caja?")) return; setCajas(p => p.filter(c => c.id !== id)); };

  // Impresoras — solo selección
  const openPrinters = (caja: Caja) => {
    setPrintersCajaId(caja.id);
    setSelPrinterIds([...caja.printerIds]);
    setPrinterQ("");
    setShowPrinters(true);
  };
  const togglePrinter = (pid: string) => setSelPrinterIds(prev => prev.includes(pid) ? prev.filter(x => x !== pid) : [...prev, pid]);
  const savePrinters  = () => {
    setCajas(prev => prev.map(c => c.id === printersCajaId ? { ...c, printerIds: selPrinterIds } : c));
    setShowPrinters(false);
  };

  // Empleado
  const openEmp = (caja: Caja) => { setEmpCajaId(caja.id); setSelEmpId(caja.employeeId); setEmpQ(""); setShowEmp(true); };
  const saveEmp = () => { setCajas(prev => prev.map(c => c.id === empCajaId ? { ...c, employeeId: selEmpId } : c)); setShowEmp(false); };

  // Estilos
  const D  = `border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`;
  const C  = `rounded-xl p-4 ${theme === "light" ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const OB = "bg-[#0D1B2A]";
  const IN = `w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const MB = theme === "light" ? "bg-white border border-gray-200" : "bg-[#0D1B2A] border border-white/10";
  const txt = () => theme === "light" ? "text-gray-900" : "text-white";
  const sub = () => theme === "light" ? "text-gray-500" : "text-gray-400";

  return (
    <div className="space-y-6">

      {/* TÍTULO */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h2 className={`font-bold text-3xl ${txt()}`}>Cajas POS</h2>
        </div>
        <p className={`text-sm ${sub()}`}>Gestiona las cajas registradoras del sistema • <span className="text-primary font-medium">{userPlan}</span></p>
      </div>
      <div className={D} />

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Cajas",     value: cajas.length,                                             icon: <Monitor   className="w-5 h-5 text-primary" />,    bg: "bg-primary/20"    },
          { label: "Con Empleado",    value: cajas.filter(c => c.employeeId).length,                   icon: <UserCheck className="w-5 h-5 text-green-400" />,  bg: "bg-green-500/20"  },
          { label: "Con Impresora",   value: cajas.filter(c => c.printerIds.length > 0).length,        icon: <Printer   className="w-5 h-5 text-blue-400" />,   bg: "bg-blue-500/20"   },
          { label: "Límite del Plan", value: posLimit === 999 ? "∞" : `${cajas.length}/${posLimit}`,   icon: <Zap       className="w-5 h-5 text-yellow-400" />, bg: "bg-yellow-500/20" },
        ].map(m => (
          <div key={m.label} className={C}>
            <div className="flex items-center justify-between">
              <div><p className={`text-xs mb-1 ${sub()}`}>{m.label}</p><p className={`font-bold text-2xl ${txt()}`}>{m.value}</p></div>
              <div className={`w-10 h-10 ${m.bg} rounded-lg flex items-center justify-center`}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {hasLimit && posLimit !== 999 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">Límite de <strong>{posLimit}</strong> cajas alcanzado. Actualiza tu plan para agregar más.</p>
        </div>
      )}

      <div className={D} />

      {/* ACCIÓN */}
      <div className="flex justify-end">
        <button onClick={() => { setForm({ code: "", name: "", branchId: "b1" }); setShowForm(true); }} disabled={hasLimit}
          className="px-5 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nueva Caja
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${theme === "light" ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar por nombre o código..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${txt()}`} />
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[180px] ${theme === "light" ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${sub()}`}>
            <option value="all" className={OB}>Todas las sucursales</option>
            {BRANCHES.map(b => <option key={b.id} value={b.id} className={OB}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className={`rounded-xl overflow-hidden border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${theme === "light" ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-white/5 border-white/10 text-gray-400"}`}>
                <th className="px-4 py-3 text-left whitespace-nowrap">Código</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Nombre</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Sucursal</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Empleado Asignado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === "light" ? "divide-gray-100" : "divide-white/5"}`}>
              {filtered.length > 0 ? filtered.map(caja => {
                const emp = getEmp(caja.employeeId);
                const br  = getBranch(caja.branchId);
                return (
                  <tr key={caja.id} className={`transition-colors ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/[0.04]"}`}>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`text-sm font-mono ${sub()}`}>{caja.code}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap"><span className={`text-sm font-medium ${txt()}`}>{caja.name}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-mono ${sub()}`}>{br?.code}</span>
                        <span className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>{br?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {emp
                        ? <span className={`text-sm ${txt()}`}>{emp.name}</span>
                        : <span className={`text-xs ${sub()}`}>Sin asignar</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setViewing(caja); setShowView(true); }} title="Ver"
                          className={`p-1.5 rounded-lg transition-colors ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/10"}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEmp(caja)} title="Asignar empleado"
                          className={`p-1.5 rounded-lg transition-colors ${theme === "light" ? "text-green-600 hover:bg-green-50" : "text-green-400 hover:bg-green-500/10"}`}>
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button onClick={() => openPrinters(caja)} title="Asignar impresoras"
                          className={`p-1.5 rounded-lg transition-colors ${theme === "light" ? "text-blue-600 hover:bg-blue-50" : "text-blue-400 hover:bg-blue-500/10"}`}>
                          <Printer className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteCaja(caja.id)} title="Eliminar"
                          className={`p-1.5 rounded-lg transition-colors ${theme === "light" ? "text-red-500 hover:bg-red-50" : "text-red-400 hover:bg-red-500/10"}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={5} className="px-4 py-12 text-center">
                  <Monitor className={`w-10 h-10 mx-auto mb-3 ${theme === "light" ? "text-gray-300" : "text-gray-600"}`} />
                  <p className={`text-sm ${sub()}`}>No se encontraron cajas</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL VER ── */}
      {showView && viewing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${MB}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center"><Monitor className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className={`font-bold text-sm ${txt()}`}>{viewing.name}</p>
                  <p className={`text-xs font-mono ${sub()}`}>{viewing.code} · {getBranch(viewing.branchId)?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowView(false)} className={`p-2 rounded-lg ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="px-5 py-3 space-y-0">
              {[
                { label: "Estado",    value: "Activa", tag: true },
                { label: "Sucursal",  value: getBranch(viewing.branchId)?.name ?? "—" },
                { label: "Empleado",  value: getEmp(viewing.employeeId)?.name ?? "Sin asignar" },
                { label: "Impresoras", value: viewing.printerIds.length > 0 ? `${viewing.printerIds.length} asignada(s)` : "Sin impresoras" },
              ].map(r => (
                <div key={r.label} className={`flex items-center justify-between py-2.5 border-b last:border-0 ${theme === "light" ? "border-gray-100" : "border-white/5"}`}>
                  <span className={`text-xs ${sub()}`}>{r.label}</span>
                  {r.tag
                    ? <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-500/20 text-green-400">{r.value}</span>
                    : <span className={`text-sm font-medium ${txt()}`}>{r.value}</span>}
                </div>
              ))}
              {viewing.printerIds.length > 0 && (
                <div className="pt-1 pb-2 space-y-1.5">
                  {viewing.printerIds.map(pid => {
                    const p = getPrinter(pid);
                    return p ? (
                      <div key={pid} className={`flex items-center justify-between px-3 py-2 rounded-lg ${theme === "light" ? "bg-gray-50" : "bg-white/5"}`}>
                        <div>
                          <p className={`text-xs font-medium ${txt()}`}>{p.name}</p>
                          <p className={`text-xs ${sub()}`}>{p.purpose} · {p.type}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded ${theme === "light" ? "bg-blue-100 text-blue-600" : "bg-blue-500/20 text-blue-300"}`}>{p.paperSize}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            <div className="px-5 pb-5 pt-2">
              <button onClick={() => setShowView(false)} className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${theme === "light" ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CREAR CAJA ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${MB}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center"><Plus className="w-4 h-4 text-primary" /></div>
                <p className={`font-bold text-base ${txt()}`}>Nueva Caja</p>
              </div>
              <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${sub()}`}>Código <span className="text-red-400">*</span></label>
                  <input type="text" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="CJ-001" className={IN} />
                </div>
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${sub()}`}>Nombre <span className="text-red-400">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Caja Principal" className={IN} />
                </div>
              </div>
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${sub()}`}>Sucursal <span className="text-red-400">*</span></label>
                <select value={form.branchId} onChange={e => setForm(f => ({ ...f, branchId: e.target.value }))} className={IN}>
                  {BRANCHES.map(b => <option key={b.id} value={b.id} className={OB}>{b.code} — {b.name}</option>)}
                </select>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${theme === "light" ? "bg-green-50" : "bg-green-500/10"}`}>
                <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <p className="text-green-600 text-xs">La caja se creará en estado <strong>Activa</strong> automáticamente</p>
              </div>
              <div className={`flex gap-3 pt-1 border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                <button onClick={() => setShowForm(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme === "light" ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>Cancelar</button>
                <button onClick={saveForm} className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">Crear Caja</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL ASIGNAR IMPRESORAS (solo selección) ── */}
      {showPrinters && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl max-h-[85vh] flex flex-col ${MB}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center"><Printer className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className={`font-bold text-base ${txt()}`}>Asignar Impresoras</p>
                  <p className={`text-xs ${sub()}`}>{activeCaja?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowPrinters(false)} className={`p-2 rounded-lg ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}><X className="w-4 h-4" /></button>
            </div>

            {/* Búsqueda */}
            <div className={`px-4 pt-3 pb-2 flex-shrink-0`}>
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${theme === "light" ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Buscar impresora..." value={printerQ} onChange={e => setPrinterQ(e.target.value)}
                  className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${txt()}`} />
              </div>
              <p className={`text-xs mt-2 ${sub()}`}>{selPrinterIds.length} seleccionada(s)</p>
            </div>

            {/* Lista de impresoras del catálogo */}
            <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-1.5">
              {SYSTEM_PRINTERS
                .filter(p => p.name.toLowerCase().includes(printerQ.toLowerCase()) || p.purpose.toLowerCase().includes(printerQ.toLowerCase()))
                .map(p => {
                  const selected = selPrinterIds.includes(p.id);
                  return (
                    <button key={p.id} type="button" onClick={() => togglePrinter(p.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${selected ? "border-primary bg-primary/10" : theme === "light" ? "border-gray-200 hover:border-gray-300 bg-gray-50" : "border-white/10 hover:border-white/20 bg-white/5"}`}>
                      <Chk checked={selected} onChange={() => togglePrinter(p.id)} />
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? "bg-primary/20" : theme === "light" ? "bg-blue-100" : "bg-blue-500/15"}`}>
                        <Printer className={`w-4 h-4 ${selected ? "text-primary" : "text-blue-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${selected ? "text-primary" : txt()}`}>{p.name}</p>
                        <p className={`text-xs ${sub()}`}>{p.purpose} · {p.type} · {p.paperSize}</p>
                      </div>
                      {selected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
            </div>

            <div className={`px-4 py-3 border-t flex gap-3 flex-shrink-0 ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
              <button onClick={() => setShowPrinters(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme === "light" ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>Cancelar</button>
              <button onClick={savePrinters} className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL ASIGNAR EMPLEADO ── */}
      {showEmp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${MB}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center"><UserCheck className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className={`font-bold text-base ${txt()}`}>Asignar Empleado</p>
                  <p className={`text-xs ${sub()}`}>{cajas.find(c => c.id === empCajaId)?.name} · {getBranch(empBranchId ?? "")?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowEmp(false)} className={`p-2 rounded-lg ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${theme === "light" ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Buscar empleado..." value={empQ} onChange={e => setEmpQ(e.target.value)}
                  className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${txt()}`} />
              </div>

              <button onClick={() => setSelEmpId(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${selEmpId === null ? "border-primary bg-primary/10" : theme === "light" ? "border-gray-200 hover:border-gray-300 bg-gray-50" : "border-white/10 hover:border-white/20 bg-white/5"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${theme === "light" ? "bg-gray-200" : "bg-white/10"}`}><User className="w-4 h-4 text-gray-400" /></div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${selEmpId === null ? "text-primary" : theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Sin asignar</p>
                  <p className={`text-xs ${sub()}`}>Ningún empleado en esta caja</p>
                </div>
                {selEmpId === null && <Check className="w-4 h-4 text-primary ml-auto" />}
              </button>

              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {EMPLOYEES
                  .filter(e => e.branch === empBranchId && (e.name.toLowerCase().includes(empQ.toLowerCase()) || e.code.toLowerCase().includes(empQ.toLowerCase())))
                  .map(emp => {
                    const active = selEmpId === emp.id;
                    return (
                      <button key={emp.id} onClick={() => setSelEmpId(emp.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${active ? "border-primary bg-primary/10" : theme === "light" ? "border-gray-200 hover:border-gray-300 bg-gray-50" : "border-white/10 hover:border-white/20 bg-white/5"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${active ? "bg-primary text-white" : theme === "light" ? "bg-gray-200 text-gray-600" : "bg-white/10 text-gray-300"}`}>
                          {emp.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${active ? "text-primary" : txt()}`}>{emp.name}</p>
                          <p className={`text-xs ${sub()}`}>{emp.role} · {emp.code}</p>
                        </div>
                        {active && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                      </button>
                    );
                  })}
              </div>

              <div className={`flex gap-3 pt-2 border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                <button onClick={() => setShowEmp(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme === "light" ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>Cancelar</button>
                <button onClick={saveEmp} className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
