import { useState } from "react";
import {
  ShoppingCart, Building2, Plus, Check, AlertTriangle, X, Search,
  Eye, Trash2, Zap, Monitor, Printer, UserCheck, Hash,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { usePuntosEmision } from "../contexts/punto-emision-context";
import { useSucursales } from "../contexts/sucursal-context";
import { toast } from "sonner";

interface PosConfigContentProps { userPlan?: string; }

const SYSTEM_PRINTERS = [
  { id: "sp1", name: "EPSON TM-T20III",  type: "USB",       paperSize: "80mm", purpose: "Recibo / Ticket" },
  { id: "sp2", name: "HP LaserJet M15w", type: "Red / IP",  paperSize: "80mm", purpose: "Factura" },
  { id: "sp3", name: "BIXOLON SRP-350",  type: "Red / IP",  paperSize: "80mm", purpose: "Recibo / Ticket" },
  { id: "sp4", name: "Star TSP100",      type: "Bluetooth", paperSize: "58mm", purpose: "Recibo / Ticket" },
  { id: "sp5", name: "EPSON TM-U220",    type: "USB",       paperSize: "80mm", purpose: "Comanda / Cocina" },
  { id: "sp6", name: "Samsung ML-2160",  type: "Red / IP",  paperSize: "80mm", purpose: "Factura" },
  { id: "sp7", name: "Zebra ZD420",      type: "USB",       paperSize: "58mm", purpose: "Reporte" },
];

const EMPLOYEES = [
  { id: "e1", username: "cmendoza",  name: "Carlos Mendoza",  role: "Cajero",   sucursalId: "s1" },
  { id: "e2", username: "atorres",   name: "Ana Torres",      role: "Cajero",   sucursalId: "s1" },
  { id: "e3", username: "lparedes",  name: "Luis Paredes",    role: "Vendedor", sucursalId: "s1" },
  { id: "e4", username: "msalazar",  name: "María Salazar",   role: "Cajero",   sucursalId: "s2" },
  { id: "e5", username: "jrios",     name: "Jorge Ríos",      role: "Vendedor", sucursalId: "s2" },
  { id: "e6", username: "dcastro",   name: "Diana Castro",    role: "Cajero",   sucursalId: "s3" },
  { id: "e7", username: "rvera",     name: "Roberto Vera",    role: "Cajero",   sucursalId: "s4" },
  { id: "e8", username: "smejia",    name: "Sofía Mejía",     role: "Vendedor", sucursalId: "s4" },
];

interface Caja {
  id: string;
  code: string;
  name: string;
  sucursalId: string;
  puntoEmisionId: string | null;
  status: "active";
  printerIds: string[];
  employeeId: string | null;
}

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
  const { puntos }                     = usePuntosEmision();
  const { sucursales, activeSucursales } = useSucursales();

  const posLimit = userPlan === "Plan Básico" ? 3 : userPlan === "Plan Profesional" ? 10 : 999;

  const [cajas, setCajas] = useState<Caja[]>([
    { id: "c1", code: "CJ-001", name: "Caja Principal", sucursalId: "s1", puntoEmisionId: "pe1", status: "active", employeeId: "e1", printerIds: ["sp1","sp2"] },
    { id: "c2", code: "CJ-002", name: "Caja Rápida",    sucursalId: "s1", puntoEmisionId: "pe2", status: "active", employeeId: "e2", printerIds: ["sp3"] },
    { id: "c3", code: "CJ-001", name: "Caja 1",         sucursalId: "s2", puntoEmisionId: "pe3", status: "active", employeeId: null,  printerIds: [] },
    { id: "c4", code: "CJ-001", name: "Caja Principal", sucursalId: "s3", puntoEmisionId: null,  status: "active", employeeId: "e6", printerIds: ["sp4","sp5"] },
    { id: "c5", code: "CJ-001", name: "Caja Express",   sucursalId: "s4", puntoEmisionId: null,  status: "active", employeeId: null,  printerIds: [] },
  ]);

  const [searchTerm,   setSearchTerm]   = useState("");
  const [filterSuc,    setFilterSuc]    = useState("all");

  // Modal crear caja
  const [showForm,  setShowForm]  = useState(false);
  const [form, setForm] = useState({ code: "", name: "", sucursalId: "", puntoEmisionId: null as string | null });

  // Modal impresoras
  const [showPrinters,    setShowPrinters]    = useState(false);
  const [printersCajaId,  setPrintersCajaId]  = useState<string | null>(null);
  const [selPrinterIds,   setSelPrinterIds]   = useState<string[]>([]);
  const [printerQ,        setPrinterQ]        = useState("");

  // Modal empleado
  const [showEmp,    setShowEmp]    = useState(false);
  const [empCajaId,  setEmpCajaId]  = useState<string | null>(null);
  const [selEmpId,   setSelEmpId]   = useState<string | null>(null);
  const [empQ,       setEmpQ]       = useState("");

  // Modal punto de emisión
  const [showPunto,    setShowPunto]    = useState(false);
  const [puntoCajaId,  setPuntoCajaId]  = useState<string | null>(null);
  const [selPuntoId,   setSelPuntoId]   = useState<string | null>(null);

  // Modal ver
  const [showView,  setShowView]  = useState(false);
  const [viewing,   setViewing]   = useState<Caja | null>(null);

  // Helpers
  const getSucursal = (id: string) => sucursales.find(s => s.id === id);
  const getEmp      = (id: string | null) => id ? EMPLOYEES.find(e => e.id === id) ?? null : null;
  const getPrinter  = (id: string) => SYSTEM_PRINTERS.find(p => p.id === id);
  const getPunto    = (id: string | null) => id ? puntos.find(p => p.id === id) ?? null : null;

  // Puntos filtrados por sucursal de la caja activa (para el modal de asignar punto)
  const cajaPuntoActual = cajas.find(c => c.id === puntoCajaId);
  const puntosParaCaja  = cajaPuntoActual
    ? puntos.filter(p => p.sucursalId === cajaPuntoActual.sucursalId)
    : puntos;

  // Puntos disponibles al crear caja según sucursal seleccionada
  const puntosParaForm = form.sucursalId
    ? puntos.filter(p => p.sucursalId === form.sucursalId && p.activo)
    : [];

  const hasLimit = cajas.length >= posLimit;
  const filtered = cajas.filter(c => {
    const q = searchTerm.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      && (filterSuc === "all" || c.sucursalId === filterSuc);
  });

  const activeCaja    = cajas.find(c => c.id === printersCajaId);
  const empSucursalId = cajas.find(c => c.id === empCajaId)?.sucursalId;

  // CRUD Caja
  const saveForm = () => {
    if (!form.code.trim() || !form.name.trim() || !form.sucursalId) {
      toast.error("Código, nombre y sucursal son obligatorios."); return;
    }
    setCajas(p => [...p, { id: `c${Date.now()}`, ...form, status: "active", printerIds: [], employeeId: null }]);
    setShowForm(false);
  };
  const deleteCaja = (id: string) => {
    if (!confirm("¿Eliminar esta caja?")) return;
    setCajas(p => p.filter(c => c.id !== id));
  };

  // Impresoras
  const openPrinters = (caja: Caja) => { setPrintersCajaId(caja.id); setSelPrinterIds([...caja.printerIds]); setPrinterQ(""); setShowPrinters(true); };
  const togglePrinter = (pid: string) => setSelPrinterIds(prev => prev.includes(pid) ? prev.filter(x => x !== pid) : [...prev, pid]);
  const savePrinters  = () => { setCajas(prev => prev.map(c => c.id === printersCajaId ? { ...c, printerIds: selPrinterIds } : c)); setShowPrinters(false); };

  // Empleado
  const openEmp  = (caja: Caja) => { setEmpCajaId(caja.id); setSelEmpId(caja.employeeId); setEmpQ(""); setShowEmp(true); };
  const saveEmp  = () => { setCajas(prev => prev.map(c => c.id === empCajaId ? { ...c, employeeId: selEmpId } : c)); setShowEmp(false); };

  // Punto de emisión (solo los que pertenecen a la misma sucursal)
  const openPunto = (caja: Caja) => { setPuntoCajaId(caja.id); setSelPuntoId(caja.puntoEmisionId); setShowPunto(true); };
  const savePunto = () => { setCajas(prev => prev.map(c => c.id === puntoCajaId ? { ...c, puntoEmisionId: selPuntoId } : c)); setShowPunto(false); };

  // Estilos
  const D   = `border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`;
  const C   = `rounded-xl p-4 ${theme === "light" ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const OB  = "bg-[#0D1B2A]";
  const IN  = `w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const MB  = theme === "light" ? "bg-white border border-gray-200" : "bg-[#0D1B2A] border border-white/10";
  const txt = () => theme === "light" ? "text-gray-900" : "text-white";
  const sub = () => theme === "light" ? "text-gray-500" : "text-gray-400";

  const cajasPuntoAsignado = cajas.filter(c => c.puntoEmisionId).length;

  return (
    <div className="space-y-6">

      <div className={D} />

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Cajas",      value: cajas.length,                                            icon: <Monitor  className="w-5 h-5 text-primary" />,    bg: "bg-primary/20"    },
          { label: "Con Pto. Emisión", value: cajasPuntoAsignado,                                      icon: <Hash     className="w-5 h-5 text-green-400" />,  bg: "bg-green-500/20"  },
          { label: "Con Impresora",    value: cajas.filter(c => c.printerIds.length > 0).length,       icon: <Printer  className="w-5 h-5 text-blue-400" />,   bg: "bg-blue-500/20"   },
          { label: "Límite del Plan",  value: posLimit === 999 ? "∞" : `${cajas.length}/${posLimit}`,  icon: <Zap      className="w-5 h-5 text-yellow-400" />, bg: "bg-yellow-500/20" },
        ].map(m => (
          <div key={m.label} className={C}>
            <div className="flex items-center justify-between">
              <div><p className={`text-xs mb-1 ${sub()}`}>{m.label}</p><p className={`font-bold text-2xl ${txt()}`}>{m.value}</p></div>
              <div className={`w-10 h-10 ${m.bg} rounded-lg flex items-center justify-center`}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={D} />

      {/* Aviso cajas sin punto */}
      {cajas.some(c => !c.puntoEmisionId) && (
        null
      )}

      {hasLimit && posLimit !== 999 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">Límite de <strong>{posLimit}</strong> cajas alcanzado. Actualiza tu plan para agregar más.</p>
        </div>
      )}

      

      {/* ACCIÓN */}
      <div className="flex justify-end">
        <button
          onClick={() => { setForm({ code: "", name: "", sucursalId: activeSucursales[0]?.id ?? "", puntoEmisionId: null }); setShowForm(true); }}
          disabled={hasLimit}
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
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[200px] ${theme === "light" ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterSuc} onChange={e => setFilterSuc(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${sub()}`}>
            <option value="all" className={OB}>Todas las sucursales</option>
            {sucursales.map(s => <option key={s.id} value={s.id} className={OB}>[{s.establecimiento}] {s.name}</option>)}
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
                <th className="px-4 py-3 text-left whitespace-nowrap">Punto de Emisión</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">Usuario</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === "light" ? "divide-gray-100" : "divide-white/5"}`}>
              {filtered.length > 0 ? filtered.map(caja => {
                const suc   = getSucursal(caja.sucursalId);
                const emp   = getEmp(caja.employeeId);
                const punto = getPunto(caja.puntoEmisionId);
                return (
                  <tr key={caja.id} className={`transition-colors ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/[0.04]"}`}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-sm font-mono font-medium ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>{caja.code}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className={`text-sm font-medium ${txt()}`}>{caja.name}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className={`text-sm ${txt()}`}>{suc?.name ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {punto ? (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${theme === "light" ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary"}`}>
                          <Hash className="w-3 h-3" />{punto.establecimiento}-{punto.puntoEmision}
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-lg border ${theme === "light" ? "border-yellow-200 bg-yellow-50 text-yellow-600" : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"}`}>
                          <AlertTriangle className="w-3 h-3" />Sin asignar
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {emp
                        ? <span className={`text-sm ${txt()}`}>{emp.name}</span>
                        : <span className={`text-xs ${sub()}`}>Sin asignar</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setViewing(caja); setShowView(true); }} title="Ver detalle"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${theme === "light" ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openPunto(caja)} title="Asignar punto de emisión"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${theme === "light" ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                          <Hash className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEmp(caja)} title="Asignar usuario"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${theme === "light" ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button onClick={() => openPrinters(caja)} title="Asignar impresoras"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${theme === "light" ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                          <Printer className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteCaja(caja.id)} title="Eliminar"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${theme === "light" ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} className="px-4 py-12 text-center">
                  <Monitor className={`w-10 h-10 mx-auto mb-3 ${theme === "light" ? "text-gray-300" : "text-gray-600"}`} />
                  <p className={`text-sm ${sub()}`}>No se encontraron cajas</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL VER ── */}
      {showView && viewing && (() => {
        const suc   = getSucursal(viewing.sucursalId);
        const punto = getPunto(viewing.puntoEmisionId);
        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${MB}`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center"><Monitor className="w-4 h-4 text-primary" /></div>
                  <div>
                    <p className={`font-bold text-sm ${txt()}`}>{viewing.name}</p>
                    <p className={`text-xs font-mono ${sub()}`}>{viewing.code} · {suc?.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowView(false)} className={`p-2 rounded-lg ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}><X className="w-4 h-4" /></button>
              </div>
              <div className="px-5 py-3 space-y-0">
                {[
                  { label: "Estado",          value: "Activa",         tag: true },
                  { label: "Sucursal",        value: suc?.name ?? "—" },
                  { label: "Establecimiento", value: suc ? `${suc.establecimiento} (${suc.code})` : "—" },
                  { label: "Punto de Emisión",value: punto ? `${punto.establecimiento}-${punto.puntoEmision} · ${punto.descripcion}` : "Sin asignar", warn: !punto },
                  { label: "Usuario",         value: getEmp(viewing.employeeId)?.name ?? "Sin asignar" },
                  { label: "Impresoras",      value: viewing.printerIds.length > 0 ? `${viewing.printerIds.length} asignada(s)` : "Sin impresoras" },
                ].map(r => (
                  <div key={r.label} className={`flex items-center justify-between py-2.5 border-b last:border-0 ${theme === "light" ? "border-gray-100" : "border-white/5"}`}>
                    <span className={`text-xs ${sub()}`}>{r.label}</span>
                    {r.tag
                      ? <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-500/20 text-green-400">{r.value}</span>
                      : (r as any).warn
                        ? <span className={`text-xs font-medium px-2 py-0.5 rounded ${theme === "light" ? "bg-yellow-50 text-yellow-600" : "bg-yellow-500/10 text-yellow-400"}`}>{r.value}</span>
                        : <span className={`text-sm font-medium ${txt()}`}>{r.value}</span>
                    }
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
        );
      })()}

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

              {/* Paso 1: Sucursal */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${sub()}`}>
                  1. Sucursal <span className="text-red-400">*</span>
                </label>
                <select
                  value={form.sucursalId}
                  onChange={e => setForm(f => ({ ...f, sucursalId: e.target.value, puntoEmisionId: null }))}
                  className={IN}
                >
                  <option value="" className={OB}>— Selecciona sucursal —</option>
                  {activeSucursales.map(s => (
                    <option key={s.id} value={s.id} className={OB}>[{s.establecimiento}] {s.name}</option>
                  ))}
                </select>
              </div>

              {/* Paso 2: Punto de emisión (filtrado por sucursal) */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${sub()}`}>
                  2. Punto de Emisión
                  <span className={`ml-1 text-xs font-normal ${theme === "light" ? "text-yellow-600" : "text-yellow-400"}`}>(requerido para emitir)</span>
                </label>
                <select
                  value={form.puntoEmisionId ?? ""}
                  onChange={e => setForm(f => ({ ...f, puntoEmisionId: e.target.value || null }))}
                  className={IN}
                  disabled={!form.sucursalId}
                >
                  <option value="" className={OB}>— Sin asignar —</option>
                  {puntosParaForm.map(p => (
                    <option key={p.id} value={p.id} className={OB}>
                      {p.establecimiento}-{p.puntoEmision} · {p.descripcion}
                    </option>
                  ))}
                </select>
                {form.sucursalId && puntosParaForm.length === 0 && (
                  <p className={`text-xs mt-1 ${theme === "light" ? "text-yellow-600" : "text-yellow-400"}`}>
                    ⚠ Esta sucursal no tiene puntos de emisión activos. Configúralos en Ventas → Puntos de Emisión.
                  </p>
                )}
                {!form.sucursalId && (
                  <p className={`text-xs mt-1 ${sub()}`}>Selecciona primero una sucursal.</p>
                )}
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

      {/* ── MODAL ASIGNAR PUNTO DE EMISIÓN (filtrado por sucursal de la caja) ── */}
      {showPunto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${MB}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center"><Hash className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className={`font-bold text-base ${txt()}`}>Punto de Emisión</p>
                  <p className={`text-xs ${sub()}`}>
                    {cajaPuntoActual?.name} · {getSucursal(cajaPuntoActual?.sucursalId ?? "")?.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPunto(false)} className={`p-2 rounded-lg ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}><X className="w-4 h-4" /></button>
            </div>

            {/* Aviso: solo puntos de la misma sucursal */}
            <div className={`mx-4 mt-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${theme === "light" ? "bg-blue-50 border border-blue-100 text-blue-700" : "bg-blue-500/10 border border-blue-500/20 text-blue-300"}`}>
              <Building2 className="w-4 h-4 flex-shrink-0" />
              Solo se muestran puntos de la sucursal: <strong className="ml-1">{getSucursal(cajaPuntoActual?.sucursalId ?? "")?.name}</strong>
            </div>

            <div className="p-4 space-y-3">
              <button onClick={() => setSelPuntoId(null)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${selPuntoId === null ? "border-primary bg-primary/10" : theme === "light" ? "border-gray-200 hover:border-gray-300 bg-gray-50" : "border-white/10 hover:border-white/20 bg-white/5"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${theme === "light" ? "bg-gray-200" : "bg-white/10"}`}>
                  <X className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${selPuntoId === null ? "text-primary" : theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Sin asignar</p>
                  <p className={`text-xs ${sub()}`}>La caja no emitirá comprobantes electrónicos</p>
                </div>
                {selPuntoId === null && <Check className="w-4 h-4 text-primary ml-auto" />}
              </button>

              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {puntosParaCaja.length === 0 && (
                  <div className={`text-center py-6 ${sub()}`}>
                    <Hash className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">Esta sucursal no tiene puntos de emisión.</p>
                    <p className="text-xs mt-1">Ve a Ventas → Puntos de Emisión</p>
                  </div>
                )}
                {puntosParaCaja.map(p => {
                  const active = selPuntoId === p.id;
                  return (
                    <button key={p.id} onClick={() => setSelPuntoId(p.id)} disabled={!p.activo}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${active ? "border-primary bg-primary/10" : theme === "light" ? "border-gray-200 hover:border-gray-300 bg-gray-50" : "border-white/10 hover:border-white/20 bg-white/5"}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-primary/20" : theme === "light" ? "bg-blue-100" : "bg-blue-500/15"}`}>
                        <Hash className={`w-4 h-4 ${active ? "text-primary" : "text-blue-400"}`} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold font-mono ${active ? "text-primary" : txt()}`}>
                            {p.establecimiento}-{p.puntoEmision}
                          </p>
                          {!p.activo && <span className={`text-[10px] px-1.5 py-0.5 rounded ${theme === "light" ? "bg-gray-100 text-gray-500" : "bg-white/10 text-gray-500"}`}>Inactivo</span>}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${p.ambiente === "2" ? (theme === "light" ? "bg-green-100 text-green-600" : "bg-green-500/20 text-green-400") : (theme === "light" ? "bg-yellow-100 text-yellow-600" : "bg-yellow-500/20 text-yellow-400")}`}>
                            {p.ambiente === "2" ? "Prod" : "Prueba"}
                          </span>
                        </div>
                        <p className={`text-xs truncate ${sub()}`}>{p.descripcion}</p>
                      </div>
                      {active && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className={`flex gap-3 pt-2 border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                <button onClick={() => setShowPunto(false)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme === "light" ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>Cancelar</button>
                <button onClick={savePunto} className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL ASIGNAR IMPRESORAS ── */}
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
            <div className="px-4 pt-3 pb-2 flex-shrink-0">
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${theme === "light" ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Buscar impresora..." value={printerQ} onChange={e => setPrinterQ(e.target.value)}
                  className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${txt()}`} />
              </div>
              <p className={`text-xs mt-2 ${sub()}`}>{selPrinterIds.length} seleccionada(s)</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-1.5">
              {SYSTEM_PRINTERS.filter(p => p.name.toLowerCase().includes(printerQ.toLowerCase()) || p.purpose.toLowerCase().includes(printerQ.toLowerCase())).map(p => {
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
                  <p className={`font-bold text-base ${txt()}`}>Asignar Usuario</p>
                  <p className={`text-xs ${sub()}`}>{cajas.find(c => c.id === empCajaId)?.name} · {getSucursal(empSucursalId ?? "")?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowEmp(false)} className={`p-2 rounded-lg ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${theme === "light" ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input type="text" placeholder="Buscar usuario..." value={empQ} onChange={e => setEmpQ(e.target.value)}
                  className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${txt()}`} />
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {/* Sin asignar */}
                <button onClick={() => setSelEmpId(null)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${selEmpId === null ? "border-primary bg-primary/10" : theme === "light" ? "border-gray-200 hover:border-gray-300 bg-gray-50" : "border-white/10 hover:border-white/20 bg-white/5"}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${theme === "light" ? "bg-gray-200" : "bg-white/10"}`}>
                    <X className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className={`text-sm font-medium ${selEmpId === null ? "text-primary" : theme === "light" ? "text-gray-700" : "text-gray-300"}`}>Sin asignar</p>
                  {selEmpId === null && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>
                {EMPLOYEES
                  .filter(e => e.sucursalId === empSucursalId && e.name.toLowerCase().includes(empQ.toLowerCase()))
                  .map(e => {
                    const active = selEmpId === e.id;
                    return (
                      <button key={e.id} onClick={() => setSelEmpId(e.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${active ? "border-primary bg-primary/10" : theme === "light" ? "border-gray-200 hover:border-gray-300 bg-gray-50" : "border-white/10 hover:border-white/20 bg-white/5"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${active ? "bg-primary text-white" : theme === "light" ? "bg-gray-200 text-gray-600" : "bg-white/10 text-gray-300"}`}>
                          <span className="text-xs font-bold">{e.name.split(" ").map(n => n[0]).join("").slice(0,2)}</span>
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <p className={`text-sm font-medium ${active ? "text-primary" : txt()}`}>{e.name}</p>
                          <p className={`text-xs ${sub()}`}>{e.role} · @{e.username}</p>
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