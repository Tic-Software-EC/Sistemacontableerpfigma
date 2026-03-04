import { useState } from "react";
import {
  Printer, FileText, AlertCircle, Settings, Building2, Check,
  Plus, X, Search, Filter, Pencil, Trash2, Eye, ChevronRight, Info,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { SysTabBar, SysTab } from "./ui/sys-tab-bar";
import { toast } from "sonner";

// ── Sucursales ────────────────────────────────────────────────────────────────
const SUCURSALES = [
  { id: "suc-001", code: "MTZ", name: "Sucursal Principal - Centro" },
  { id: "suc-002", code: "NRT", name: "Sucursal Norte" },
  { id: "suc-003", code: "GYE", name: "Sucursal Guayaquil" },
  { id: "suc-004", code: "SUR", name: "Sucursal Sur" },
];

// ── Impresoras ────────────────────────────────────────────────────────────────
interface PrinterDevice {
  id: string; name: string; type: string; ip: string; port: string;
  status: "connected" | "disconnected"; driver: string; isDefault: boolean;
}
const INIT_PRINTERS: PrinterDevice[] = [
  { id: "p1", name: "Impresora Principal Láser", type: "Láser",   ip: "192.168.1.100", port: "9100", status: "connected",    driver: "Generic / PCL6", isDefault: true  },
  { id: "p2", name: "Térmica Caja - Centro",     type: "Térmica", ip: "192.168.1.101", port: "9100", status: "connected",    driver: "ESC/POS",        isDefault: false },
  { id: "p3", name: "Láser Norte",               type: "Láser",   ip: "192.168.1.110", port: "9100", status: "connected",    driver: "Generic / PCL6", isDefault: false },
  { id: "p4", name: "Térmica Norte",             type: "Térmica", ip: "192.168.1.111", port: "9100", status: "disconnected", driver: "ESC/POS",        isDefault: false },
  { id: "p5", name: "Láser Guayaquil",           type: "Láser",   ip: "192.168.1.120", port: "9100", status: "connected",    driver: "Generic / PCL6", isDefault: false },
  { id: "p6", name: "Térmica Sur",               type: "Térmica", ip: "192.168.1.130", port: "9100", status: "disconnected", driver: "ESC/POS",        isDefault: false },
];
const INIT_SUC_PRINTERS: Record<string, string[]> = {
  "suc-001": ["p1", "p2"], "suc-002": ["p3", "p4"],
  "suc-003": ["p5"],       "suc-004": ["p6"],
};

// ── Documentos ────────────────────────────────────────────────────────────────
interface DocType {
  id: string; code: string; name: string; category: string; active: boolean;
}
interface DocConfig {
  printerId: string; format: string; width: string; height: string;
  unit: string; marginTop: string; marginBottom: string;
  marginLeft: string; marginRight: string; orientation: string; copies: string;
}
interface DocForm extends DocType, DocConfig { sucursalId: string; }

const INIT_DOC_TYPES: DocType[] = [
  { id: "dt1", code: "FAC", name: "Factura Electrónica",    category: "Ventas",    active: true  },
  { id: "dt2", code: "REC", name: "Recibo / Ticket",        category: "Caja",      active: true  },
  { id: "dt3", code: "CPG", name: "Comprobante de Pago",    category: "Tesorería", active: true  },
  { id: "dt4", code: "GDM", name: "Guía de Remisión",       category: "Inventario",active: true  },
  { id: "dt5", code: "NCR", name: "Nota de Crédito",        category: "Ventas",    active: true  },
  { id: "dt6", code: "ORD", name: "Orden de Compra",        category: "Compras",   active: false },
];
const CATEGORIES = ["Ventas", "Compras", "Caja", "Tesorería", "Inventario", "Contabilidad", "Otro"];

const defaultCfg = (printerId = ""): DocConfig => ({
  printerId, format: "A4", width: "210", height: "297", unit: "mm",
  marginTop: "10", marginBottom: "10", marginLeft: "15", marginRight: "15",
  orientation: "portrait", copies: "1",
});
const emptyForm = (printerId = "", sucursalId = SUCURSALES[0].id): DocForm => ({
  id: "", code: "", name: "", category: "Ventas", active: true, sucursalId, ...defaultCfg(printerId),
});

type SucDocConfigs = Record<string, Record<string, DocConfig>>;

const buildInitialConfigs = (docTypes: DocType[]): SucDocConfigs => {
  const m: SucDocConfigs = {};
  SUCURSALES.forEach(suc => {
    m[suc.id] = {};
    docTypes.forEach((d, i) => {
      const pid = INIT_SUC_PRINTERS[suc.id]?.[i % 2] ?? INIT_SUC_PRINTERS[suc.id]?.[0] ?? "";
      m[suc.id][d.id] = defaultCfg(pid);
    });
    const term = INIT_SUC_PRINTERS[suc.id]?.find(pid =>
      INIT_PRINTERS.find(p => p.id === pid && p.type === "Térmica")
    );
    if (term) m[suc.id]["dt2"] = { ...m[suc.id]["dt2"], printerId: term, format: "ticket", width: "80", height: "200", marginTop: "5", marginBottom: "5", marginLeft: "5", marginRight: "5" };
  });
  return m;
};

// ── Tabs del sistema ──────────────────────────────────────────────────────────
const MAIN_TABS: SysTab[] = [
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "printers",  label: "Impresoras", icon: Settings  },
];
const MODAL_TABS: SysTab[] = [
  { id: "info",   label: "Identificación",        icon: Info     },
  { id: "config", label: "Configuración de Impresión", icon: Printer  },
];

// ─────────────────────────────────────────────────────────────────────────────
export function PrinterConfigContent() {
  const { theme } = useTheme();

  const [activeTab,    setActiveTab]   = useState("documents");
  const [activeSuc,    setActiveSuc]   = useState(SUCURSALES[0].id);
  const [saved,        setSaved]       = useState(false);

  // Impresoras
  const [printers,    setPrinters]    = useState<PrinterDevice[]>(INIT_PRINTERS);
  const [sucPrinters, setSucPrinters] = useState<Record<string, string[]>>(INIT_SUC_PRINTERS);
  const [selPrintId,  setSelPrintId]  = useState(INIT_PRINTERS[0].id);
  const [testing,     setTesting]     = useState<string | null>(null);
  const [showAssign,  setShowAssign]  = useState(false);

  // Documentos
  const [docTypes,     setDocTypes]    = useState<DocType[]>(INIT_DOC_TYPES);
  const [docConfigs,   setDocConfigs]  = useState<SucDocConfigs>(() => buildInitialConfigs(INIT_DOC_TYPES));
  const [docSearch,    setDocSearch]   = useState("");
  const [docCatFilter, setDocCatFilter]= useState("all");

  // Modales
  type ModalMode = "new" | "edit" | "view";
  const [modal,      setModal]      = useState<{ open: boolean; mode: ModalMode } | null>(null);
  const [modalTab,   setModalTab]   = useState("info");
  const [form,       setForm]       = useState<DocForm>(emptyForm());
  const [viewingDoc, setViewingDoc] = useState<DocType | null>(null);

  // ── Derivados ─────────────────────────────────────────────────────────────
  const sucPrinterIds  = sucPrinters[activeSuc] ?? [];
  const sucPrinterList = printers.filter(p => sucPrinterIds.includes(p.id));
  const selPrinter     = sucPrinterList.find(p => p.id === selPrintId) ?? sucPrinterList[0];

  const filteredDocs = docTypes.filter(d => {
    const q = docSearch.toLowerCase();
    return (d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q))
      && (docCatFilter === "all" || d.category === docCatFilter);
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const curCfg = (docId: string): DocConfig =>
    docConfigs[activeSuc]?.[docId] ?? defaultCfg(sucPrinterIds[0]);

  const openNew = () => {
    setForm(emptyForm(sucPrinterIds[0] ?? "", activeSuc));
    setModalTab("info");
    setModal({ open: true, mode: "new" });
  };
  const openEdit = (doc: DocType) => {
    const cfg = curCfg(doc.id);
    setForm({ ...doc, ...cfg, sucursalId: activeSuc });
    setModalTab("info");
    setModal({ open: true, mode: "edit" });
  };
  const openView = (doc: DocType) => {
    setViewingDoc(doc);
    setModalTab("info");
    setModal({ open: true, mode: "view" });
  };
  const closeModal = () => { setModal(null); setViewingDoc(null); };

  const saveDoc = () => {
    if (!form.code.trim() || !form.name.trim()) return;
    const { id, code, name, category, active, sucursalId } = form;
    const cfg: DocConfig = {
      printerId: form.printerId, format: form.format, width: form.width,
      height: form.height, unit: form.unit, marginTop: form.marginTop,
      marginBottom: form.marginBottom, marginLeft: form.marginLeft,
      marginRight: form.marginRight, orientation: form.orientation, copies: form.copies,
    };
    if (modal?.mode === "new") {
      const newId = `dt-${Date.now()}`;
      setDocTypes(prev => [...prev, { id: newId, code, name, category, active: true }]);
      setDocConfigs(prev => {
        const next = { ...prev };
        SUCURSALES.forEach(suc => {
          next[suc.id] = { ...next[suc.id], [newId]: { ...cfg, printerId: sucPrinters[suc.id]?.[0] ?? "" } };
        });
        next[sucursalId] = { ...next[sucursalId], [newId]: cfg };
        return next;
      });
    } else {
      setDocTypes(prev => prev.map(d => d.id === id ? { ...d, code, name, category, active } : d));
      setDocConfigs(prev => ({ ...prev, [sucursalId]: { ...prev[sucursalId], [id]: cfg } }));
    }
    closeModal();
  };

  const deleteDoc = (id: string) => {
    if (!confirm("¿Eliminar este tipo de documento?")) return;
    setDocTypes(prev => prev.filter(d => d.id !== id));
  };

  const toggleDocActive = (id: string) => {
    setDocTypes(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  // ── Impresoras ────────────────────────────────────────────────────────────
  const updatePrinter = (field: string, value: string | boolean) => {
    setPrinters(prev => prev.map(p => p.id === selPrinter?.id ? { ...p, [field]: value } as PrinterDevice : p));
  };
  const testConnection = async (pid: string) => {
    setTesting(pid);
    await new Promise(r => setTimeout(r, 1800));
    const ok = Math.random() > 0.3;
    setPrinters(prev => prev.map(p => p.id === pid ? { ...p, status: ok ? "connected" : "disconnected" } : p));
    setTesting(null);
    if (ok) toast.success("Conexión exitosa con la impresora");
    else toast.error("No se pudo conectar. Verifique IP y puerto.");
  };
  const addPrinter = () => {
    const np: PrinterDevice = {
      id: `p-${Date.now()}`, name: "Nueva Impresora", type: "Láser",
      ip: "192.168.1.200", port: "9100", status: "disconnected",
      driver: "Generic / PCL6", isDefault: false,
    };
    setPrinters(prev => [...prev, np]);
    setSucPrinters(prev => ({ ...prev, [activeSuc]: [...(prev[activeSuc] ?? []), np.id] }));
    setSelPrintId(np.id);
  };
  const removePrinterFromSuc = (pid: string) => {
    if (!confirm("¿Quitar esta impresora de la sucursal?")) return;
    setSucPrinters(prev => ({ ...prev, [activeSuc]: (prev[activeSuc] ?? []).filter(id => id !== pid) }));
    setSelPrintId(sucPrinterList.filter(p => p.id !== pid)[0]?.id ?? "");
  };
  const toggleAssign = (pid: string) => {
    setSucPrinters(prev => {
      const curr = prev[activeSuc] ?? [];
      return { ...prev, [activeSuc]: curr.includes(pid) ? curr.filter(id => id !== pid) : [...curr, pid] };
    });
  };

  // ── Estilos ──────────────────────────────────────────────────────────────
  const isLight = theme === "light";
  const txt  = isLight ? "text-gray-900"  : "text-white";
  const sub  = isLight ? "text-gray-500"  : "text-gray-400";
  const lbl  = isLight ? "text-gray-600"  : "text-gray-300";
  const D    = `border-t ${isLight ? "border-gray-200" : "border-white/10"}`;
  const card = `rounded-xl border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/[0.04] border-white/10"}`;
  const IN   = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const OB   = isLight ? "" : "bg-[#0D1B2A]";
  const rowHov = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.03]";
  const sideBtn = (active: boolean) => active
    ? "border-l-2 border-primary bg-primary/10 text-primary"
    : `border-l-2 border-transparent ${isLight ? "text-gray-700 hover:bg-gray-50" : "text-gray-400 hover:bg-white/[0.04]"}`;
  const modalBg = isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/10";

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  // ── Vista previa de papel ─────────────────────────────────────────────────
  const PaperPreview = ({ f }: { f: DocConfig }) => (
    <div className={`rounded-xl border flex flex-col items-center justify-center p-4 min-h-[160px] ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f1825] border-white/10"}`}>
      <p className={`text-xs mb-3 ${sub}`}>Vista previa</p>
      <div className="bg-white shadow-md transition-all"
        style={{
          width:  f.orientation === "portrait" ? "80px" : "130px",
          height: f.orientation === "portrait" ? "110px" : "80px",
          padding: `${Math.max(2, Math.round(parseInt(f.marginTop || "0") / 4))}px ${Math.max(2, Math.round(parseInt(f.marginRight || "0") / 4))}px ${Math.max(2, Math.round(parseInt(f.marginBottom || "0") / 4))}px ${Math.max(2, Math.round(parseInt(f.marginLeft || "0") / 4))}px`,
        }}>
        <div className="border border-dashed border-gray-300 w-full h-full flex items-center justify-center">
          <span className="text-gray-400 text-[7px] text-center leading-tight">
            {f.width}×{f.height}<br />{f.unit}
          </span>
        </div>
      </div>
      <p className={`text-xs mt-2 ${sub}`}>{f.copies} copia(s)</p>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 w-full">

      {/* TÍTULO */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Printer className="w-8 h-8 text-primary" />
          <h2 className={`font-bold text-3xl ${txt}`}>Configuración de Impresión</h2>
        </div>
        <p className={`text-sm ${sub}`}>Administra documentos e impresoras por sucursal</p>
      </div>

      <div className={D} />

      {/* GUARDAR CAMBIOS — debajo de la línea */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${saved ? "bg-green-600" : "bg-primary hover:bg-primary/90"} text-white`}>
          {saved ? <><Check className="w-4 h-4" /> Guardado</> : "Guardar Cambios"}
        </button>
      </div>

      {/* TABS PRINCIPALES */}
      <SysTabBar tabs={MAIN_TABS} active={activeTab} onChange={setActiveTab} />

      {/* ═══ TAB: DOCUMENTOS ═══ */}
      {activeTab === "documents" && (
        <div className="space-y-4">

          {/* Barra acciones */}
          <div className="flex items-center gap-3">
            <button onClick={openNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0">
              <Plus className="w-4 h-4" /> Nuevo Documento
            </button>
            {/* Sucursal - ahora en filtros */}
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-200" : "bg-transparent border-white/10"}`}>
              <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
              <select value={activeSuc} onChange={e => setActiveSuc(e.target.value)}
                className={`bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${isLight ? "text-gray-900" : "text-white"}`}>
                {SUCURSALES.map(s => (
                  <option key={s.id} value={s.id} className={OB}>[{s.code}] {s.name}</option>
                ))}
              </select>
            </div>
            <div className={`flex items-center gap-2 flex-1 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-200" : "bg-transparent border-white/10"}`}>
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Buscar por nombre o código…"
                value={docSearch} onChange={e => setDocSearch(e.target.value)}
                className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-400 ${isLight ? "text-gray-900" : "text-white"}`} />
            </div>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-200" : "bg-transparent border-white/10"}`}>
              <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <select value={docCatFilter} onChange={e => setDocCatFilter(e.target.value)}
                className={`bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${isLight ? "text-gray-900" : "text-white"}`}>
                <option value="all" className={OB}>Todas las categorías</option>
                {CATEGORIES.map(c => <option key={c} value={c} className={OB}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Tabla */}
          <div className={`${card} overflow-hidden`}>
            <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b text-xs font-semibold uppercase tracking-widest ${isLight ? "bg-gray-50 border-gray-200 text-gray-400" : "bg-white/[0.03] border-white/10 text-gray-500"}`}>
                  <th className="text-left px-5 py-3.5 w-20">Código</th>
                  <th className="text-left px-5 py-3.5">Nombre</th>
                  <th className="text-left px-5 py-3.5">Categoría</th>
                  <th className="text-left px-5 py-3.5">Impresora ({SUCURSALES.find(s => s.id === activeSuc)?.code})</th>
                  <th className="text-left px-5 py-3.5 w-24">Formato</th>
                  <th className="text-center px-5 py-3.5 w-28">Estado</th>
                  <th className="text-center px-5 py-3.5 w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/[0.05]"}`}>
                {filteredDocs.length === 0 ? (
                  <tr><td colSpan={7} className={`py-14 text-center text-sm ${sub}`}>No se encontraron documentos</td></tr>
                ) : filteredDocs.map(doc => {
                  const cfg    = curCfg(doc.id);
                  const prName = printers.find(p => p.id === cfg.printerId)?.name ?? "—";
                  return (
                    <tr key={doc.id} className={`transition-colors ${rowHov}`}>

                      {/* Código */}
                      <td className="px-5 py-4">
                        <span className={`text-sm font-mono font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          {doc.code}
                        </span>
                      </td>

                      {/* Nombre */}
                      <td className="px-5 py-4">
                        <span className={`text-sm font-semibold ${doc.active ? txt : sub}`}>{doc.name}</span>
                      </td>

                      {/* Categoría */}
                      <td className={`px-5 py-4 text-sm ${sub}`}>{doc.category}</td>

                      {/* Impresora */}
                      <td className={`px-5 py-4 text-sm ${sub} max-w-[180px]`}>
                        {sucPrinterIds.length === 0
                          ? <span className="text-amber-500 text-xs font-medium">Sin impresoras</span>
                          : <span className="truncate block" title={prName}>{prName}</span>}
                      </td>

                      {/* Formato */}
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                          isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-300"
                        }`}>
                          {cfg.format.toUpperCase()}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => toggleDocActive(doc.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            doc.active
                              ? isLight
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                              : isLight
                                ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                : "bg-white/10 text-gray-400 hover:bg-white/15"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${doc.active ? "bg-green-500" : "bg-gray-400"}`} />
                          {doc.active ? "Activo" : "Inactivo"}
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openView(doc)} title="Ver detalles"
                            className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-200 hover:bg-white/10"}`}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEdit(doc)} title="Editar"
                            className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-200 hover:bg-white/10"}`}>
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteDoc(doc.id)} title="Eliminar"
                            className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-red-500 hover:bg-red-50" : "text-gray-500 hover:text-red-400 hover:bg-red-500/10"}`}>
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
            <div className={`px-5 py-3 border-t ${isLight ? "border-gray-100 bg-gray-50" : "border-white/[0.05] bg-white/[0.02]"}`}>
              <p className={`text-xs ${sub}`}>{filteredDocs.length} documento(s) · Sucursal: {SUCURSALES.find(s => s.id === activeSuc)?.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB: IMPRESORAS ═══ */}
      {activeTab === "printers" && (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wide ${sub}`}>Impresoras ({sucPrinterList.length})</span>
              <div className="flex gap-1.5">
                <button onClick={() => setShowAssign(true)} title="Asignar"
                  className={`p-1.5 rounded-lg transition-colors ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-600" : "bg-white/10 hover:bg-white/15 text-gray-400"}`}>
                  <Building2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={addPrinter} title="Nueva"
                  className="p-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className={`${card} overflow-hidden`}>
              {sucPrinterList.length === 0 ? (
                <div className="py-10 flex flex-col items-center gap-2">
                  <Printer className={`w-8 h-8 ${isLight ? "text-gray-200" : "text-gray-700"}`} />
                  <p className={`text-xs ${sub}`}>Sin impresoras asignadas</p>
                  <button onClick={() => setShowAssign(true)} className="text-xs text-primary hover:underline">Asignar impresoras</button>
                </div>
              ) : (
                <div className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/[0.06]"}`}>
                  {sucPrinterList.map(p => (
                    <button key={p.id} onClick={() => setSelPrintId(p.id)}
                      className={`w-full text-left px-4 py-3 transition-colors ${sideBtn(selPrinter?.id === p.id)}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${selPrinter?.id === p.id ? "bg-primary/20" : isLight ? "bg-gray-100" : "bg-white/10"}`}>
                          <Printer className={`w-3.5 h-3.5 ${selPrinter?.id === p.id ? "text-primary" : sub}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${txt}`}>{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${p.status === "connected" ? "bg-green-400" : "bg-red-400"}`} />
                            <span className={`text-xs ${sub}`}>{p.type} · {p.status === "connected" ? "En línea" : "Fuera de línea"}</span>
                          </div>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${selPrinter?.id === p.id ? "text-primary" : sub}`} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-8">
            {!selPrinter ? (
              <div className={`${card} py-16 flex flex-col items-center gap-3`}>
                <Printer className={`w-10 h-10 ${isLight ? "text-gray-200" : "text-gray-700"}`} />
                <p className={`text-sm ${sub}`}>Selecciona una impresora para configurarla</p>
              </div>
            ) : (
              <div className={`${card} p-5 space-y-5`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Printer className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm ${txt}`}>{selPrinter.name}</h3>
                      <p className={`text-xs ${sub}`}>{SUCURSALES.find(s => s.id === activeSuc)?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => testConnection(selPrinter.id)} disabled={testing === selPrinter.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white disabled:opacity-50 rounded-lg text-xs font-medium transition-all">
                      {testing === selPrinter.id
                        ? <><div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />Probando…</>
                        : <><AlertCircle className="w-3 h-3" />Probar conexión</>}
                    </button>
                    <button onClick={() => removePrinterFromSuc(selPrinter.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-medium transition-all">
                      <X className="w-3 h-3" />Quitar
                    </button>
                  </div>
                </div>
                <div className={`border-t ${isLight ? "border-gray-100" : "border-white/10"}`} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Nombre</label>
                    <input type="text" value={selPrinter.name} onChange={e => updatePrinter("name", e.target.value)} className={IN} />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Tipo</label>
                    <select value={selPrinter.type} onChange={e => updatePrinter("type", e.target.value)} className={IN}>
                      <option value="Láser"     className={OB}>Láser</option>
                      <option value="Térmica"   className={OB}>Térmica</option>
                      <option value="Matricial" className={OB}>Matricial</option>
                      <option value="Inyección" className={OB}>Inyección de tinta</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Dirección IP</label>
                    <input type="text" value={selPrinter.ip} onChange={e => updatePrinter("ip", e.target.value)} className={IN} />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Puerto</label>
                    <input type="text" value={selPrinter.port} onChange={e => updatePrinter("port", e.target.value)} className={IN} />
                  </div>
                  <div className="col-span-2">
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Driver / Controlador</label>
                    <select value={selPrinter.driver} onChange={e => updatePrinter("driver", e.target.value)} className={IN}>
                      <option value="Generic / PCL6" className={OB}>Generic / PCL6</option>
                      <option value="ESC/POS"        className={OB}>ESC/POS (Térmica)</option>
                      <option value="ZPL"            className={OB}>ZPL (Zebra)</option>
                      <option value="PostScript"     className={OB}>PostScript</option>
                    </select>
                  </div>
                </div>
                <label className={`flex items-center gap-3 cursor-pointer px-4 py-3 rounded-lg border transition-colors ${
                  selPrinter.isDefault
                    ? isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"
                    : isLight ? "bg-gray-50 border-gray-200 hover:bg-gray-100" : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                }`}>
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${selPrinter.isDefault ? "bg-primary border-primary" : isLight ? "border-gray-300" : "border-white/20"}`}>
                    {selPrinter.isDefault && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${txt}`}>Impresora predeterminada</p>
                    <p className={`text-xs ${sub}`}>Se usará cuando ningún documento tenga impresora específica</p>
                  </div>
                  <input type="checkbox" checked={selPrinter.isDefault} onChange={e => updatePrinter("isDefault", e.target.checked)} className="sr-only" />
                </label>
                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs ${
                  selPrinter.status === "connected"
                    ? isLight ? "bg-green-50 border-green-200 text-green-700" : "bg-green-500/10 border-green-500/20 text-green-400"
                    : isLight ? "bg-red-50 border-red-200 text-red-600" : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  <div className={`w-2 h-2 rounded-full ${selPrinter.status === "connected" ? "bg-green-500" : "bg-red-500"}`} />
                  <span>{selPrinter.status === "connected" ? "Conectada y lista" : "Desconectada — verifique red"}</span>
                  <span className="ml-auto opacity-60">{selPrinter.ip}:{selPrinter.port}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ MODAL: Nuevo / Editar ═══════════ */}
      {modal?.open && (modal.mode === "new" || modal.mode === "edit") && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${modalBg}`}>

            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  {modal.mode === "new" ? <Plus className="w-4 h-4 text-primary" /> : <Pencil className="w-4 h-4 text-primary" />}
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${txt}`}>
                    {modal.mode === "new" ? "Nuevo Tipo de Documento" : `Editar: ${form.name || "Documento"}`}
                  </h3>
                  <p className={`text-xs ${sub}`}>{SUCURSALES.find(s => s.id === activeSuc)?.name}</p>
                </div>
              </div>
              <button onClick={closeModal} className={`p-1.5 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs del modal */}
            <div className="flex-shrink-0 px-6">
              <SysTabBar tabs={MODAL_TABS} active={modalTab} onChange={setModalTab} />
            </div>

            {/* Body scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5">

              {/* Tab: Identificación */}
              {modalTab === "info" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Código <span className="text-red-500">*</span></label>
                      <input type="text" maxLength={5} placeholder="FAC"
                        value={form.code}
                        onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                        className={IN} />
                    </div>
                    <div className="col-span-2">
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Nombre <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Nombre del documento"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={IN} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Sucursal <span className="text-red-500">*</span></label>
                      <select value={form.sucursalId} onChange={e => setForm(f => ({ ...f, sucursalId: e.target.value }))} className={IN}>
                        {SUCURSALES.map(s => <option key={s.id} value={s.id} className={OB}>[{s.code}] {s.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Categoría</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={IN}>
                        {CATEGORIES.map(c => <option key={c} value={c} className={OB}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  {modal.mode === "edit" && (
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Estado</label>
                      <select value={form.active ? "1" : "0"} onChange={e => setForm(f => ({ ...f, active: e.target.value === "1" }))} className={IN}>
                        <option value="1" className={OB}>Activo</option>
                        <option value="0" className={OB}>Inactivo</option>
                      </select>
                    </div>
                  )}
                  {/* Indicador para ir al siguiente tab */}
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-xs ${isLight ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-blue-500/10 border-blue-500/20 text-blue-400"}`}>
                    <Info className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Continúa en la pestaña <strong>Configuración de Impresión</strong> para asignar impresora y formato.</span>
                  </div>
                </div>
              )}

              {/* Tab: Configuración de Impresión */}
              {modalTab === "config" && (
                <div className="space-y-4">
                  {sucPrinterList.length === 0 ? (
                    <div className={`py-8 rounded-xl border text-center ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
                      <Printer className={`w-8 h-8 mx-auto mb-2 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                      <p className={`text-sm ${sub}`}>Esta sucursal no tiene impresoras asignadas.</p>
                      <p className={`text-xs ${sub}`}>Ve a la pestaña <strong>Impresoras</strong> para asignarlas.</p>
                    </div>
                  ) : (
                    <>
                      {/* Impresora */}
                      <div>
                        <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Impresora asignada</label>
                        <select value={form.printerId} onChange={e => setForm(f => ({ ...f, printerId: e.target.value }))} className={IN}>
                          <option value="" className={OB}>— Sin asignar —</option>
                          {sucPrinterList.map(p => (
                            <option key={p.id} value={p.id} className={OB}>
                              {p.name}{p.isDefault ? " (Predeterminada)" : ""} · {p.type}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Formato + Orientación */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Formato de papel</label>
                          <select value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))} className={IN}>
                            <option value="A4"     className={OB}>A4 (210 × 297 mm)</option>
                            <option value="A5"     className={OB}>A5 (148 × 210 mm)</option>
                            <option value="letter" className={OB}>Carta (216 × 279 mm)</option>
                            <option value="ticket" className={OB}>Ticket (80 mm)</option>
                            <option value="custom" className={OB}>Personalizado</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Orientación</label>
                          <select value={form.orientation} onChange={e => setForm(f => ({ ...f, orientation: e.target.value }))} className={IN}>
                            <option value="portrait"  className={OB}>Vertical (Portrait)</option>
                            <option value="landscape" className={OB}>Horizontal (Landscape)</option>
                          </select>
                        </div>
                      </div>
                      {/* Dimensiones */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Ancho</label>
                          <input type="number" value={form.width} onChange={e => setForm(f => ({ ...f, width: e.target.value }))} className={IN} />
                        </div>
                        <div>
                          <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Alto</label>
                          <input type="number" value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} className={IN} />
                        </div>
                        <div>
                          <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Unidad</label>
                          <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className={IN}>
                            <option value="mm" className={OB}>mm</option>
                            <option value="cm" className={OB}>cm</option>
                            <option value="in" className={OB}>pulg.</option>
                          </select>
                        </div>
                      </div>
                      {/* Márgenes + Vista previa */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block mb-2 text-xs font-medium ${lbl}`}>Márgenes ({form.unit})</label>
                          <div className="grid grid-cols-2 gap-2">
                            {([
                              { l: "Superior",  f: "marginTop"    },
                              { l: "Inferior",  f: "marginBottom" },
                              { l: "Izquierdo", f: "marginLeft"   },
                              { l: "Derecho",   f: "marginRight"  },
                            ] as { l: string; f: keyof DocForm }[]).map(x => (
                              <div key={x.f}>
                                <label className={`block mb-1 text-xs ${sub}`}>{x.l}</label>
                                <input type="number" value={form[x.f] as string}
                                  onChange={e => setForm(f => ({ ...f, [x.f]: e.target.value }))}
                                  className={IN} />
                              </div>
                            ))}
                          </div>
                          <div className="mt-3">
                            <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Número de copias</label>
                            <input type="number" min="1" max="10" value={form.copies}
                              onChange={e => setForm(f => ({ ...f, copies: e.target.value }))}
                              className={IN} />
                          </div>
                        </div>
                        <PaperPreview f={form} />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.02]"}`}>
              <button onClick={closeModal}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-100" : "border-white/15 text-gray-300 hover:bg-white/10"}`}>
                Cancelar
              </button>
              <button onClick={saveDoc}
                disabled={!form.code.trim() || !form.name.trim()}
                className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors">
                {modal.mode === "new" ? "Crear Documento" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ MODAL: Ver detalles ═══════════ */}
      {modal?.open && modal.mode === "view" && viewingDoc && (() => {
        const cfg = curCfg(viewingDoc.id);
        const pr  = printers.find(p => p.id === cfg.printerId);
        const Field = ({ label, value }: { label: string; value: string }) => (
          <div>
            <p className={`text-xs ${sub} mb-0.5`}>{label}</p>
            <p className={`text-sm font-medium ${txt}`}>{value || "—"}</p>
          </div>
        );
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-lg rounded-2xl shadow-2xl flex flex-col max-h-[90vh] ${modalBg}`}>

              {/* Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${txt}`}>{viewingDoc.name}</h3>
                    <p className={`text-xs ${sub}`}>{SUCURSALES.find(s => s.id === activeSuc)?.name}</p>
                  </div>
                </div>
                <button onClick={closeModal} className={`p-1.5 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex-shrink-0 px-6">
                <SysTabBar tabs={MODAL_TABS} active={modalTab} onChange={setModalTab} />
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {modalTab === "info" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Field label="Código"    value={viewingDoc.code} />
                      <Field label="Nombre"    value={viewingDoc.name} />
                      <Field label="Categoría" value={viewingDoc.category} />
                    </div>
                    <div>
                      <p className={`text-xs ${sub} mb-1`}>Estado</p>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        viewingDoc.active ? "bg-green-100 text-green-700" : isLight ? "bg-gray-100 text-gray-500" : "bg-white/10 text-gray-400"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${viewingDoc.active ? "bg-green-500" : "bg-gray-400"}`} />
                        {viewingDoc.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                )}
                {modalTab === "config" && (
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <Field label="Impresora"   value={pr ? `${pr.name} (${pr.type})` : "Sin asignar"} />
                      <Field label="Formato"     value={cfg.format.toUpperCase()} />
                      <Field label="Orientación" value={cfg.orientation === "portrait" ? "Vertical (Portrait)" : "Horizontal (Landscape)"} />
                      <Field label="Dimensiones" value={`${cfg.width} × ${cfg.height} ${cfg.unit}`} />
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Margen Superior" value={`${cfg.marginTop} ${cfg.unit}`} />
                        <Field label="Margen Inferior" value={`${cfg.marginBottom} ${cfg.unit}`} />
                        <Field label="Margen Izq."     value={`${cfg.marginLeft} ${cfg.unit}`} />
                        <Field label="Margen Der."     value={`${cfg.marginRight} ${cfg.unit}`} />
                      </div>
                      <Field label="Copias" value={cfg.copies} />
                    </div>
                    <PaperPreview f={cfg} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`flex justify-end gap-3 px-6 py-4 border-t flex-shrink-0 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.02]"}`}>
                <button onClick={() => { closeModal(); openEdit(viewingDoc); }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-100" : "border-white/15 text-gray-300 hover:bg-white/10"}`}>
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={closeModal}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══════════ MODAL: Asignar impresoras ═══════════ */}
      {showAssign && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${modalBg}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${txt}`}>Asignar Impresoras</p>
                  <p className={`text-xs ${sub}`}>{SUCURSALES.find(s => s.id === activeSuc)?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowAssign(false)} className={`p-1.5 rounded-lg ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-1.5 max-h-72 overflow-y-auto">
              {printers.map(p => {
                const assigned = (sucPrinters[activeSuc] ?? []).includes(p.id);
                return (
                  <button key={p.id} onClick={() => toggleAssign(p.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all text-left ${
                      assigned
                        ? isLight ? "border-primary/30 bg-primary/5" : "border-primary/30 bg-primary/10"
                        : isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/[0.05]"
                    }`}>
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${assigned ? "bg-primary border-primary" : isLight ? "border-gray-300" : "border-white/20"}`}>
                      {assigned && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${assigned ? "text-primary" : txt}`}>{p.name}</p>
                      <p className={`text-xs ${sub}`}>{p.type} · {p.ip}</p>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${p.status === "connected" ? "bg-green-400" : "bg-red-400"}`} />
                  </button>
                );
              })}
            </div>
            <div className={`px-4 py-3 border-t ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10"}`}>
              <button onClick={() => setShowAssign(false)}
                className="w-full py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}