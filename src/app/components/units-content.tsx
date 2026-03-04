import { useState, Fragment } from "react";
import {
  Ruler, Search, Plus, Edit, Trash2, X, Save,
  Filter, Scale, Package, Activity, ChevronDown, ChevronRight, Settings,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

// ── tipos ────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  description: string;
}

interface Unit {
  id: string;
  categoryId: string;
  name: string;
  abbreviation: string;
  conversionFactor: number;
  baseUnitId: string | null;
  description: string;
  active: boolean;
}

// ── datos iniciales ──────────────────────────────────────
const CATEGORIES: Category[] = [
  { id:"1", name:"Electrónica",  description:"Productos electrónicos y tecnológicos"  },
  { id:"2", name:"Alimentos",    description:"Productos alimenticios y bebidas"       },
  { id:"3", name:"Ropa",         description:"Vestimenta y accesorios"                },
  { id:"4", name:"Herramientas", description:"Herramientas manuales y eléctricas"     },
  { id:"5", name:"Muebles",      description:"Muebles para hogar y oficina"           },
  { id:"6", name:"Bazar",        description:"Artículos diversos y decoración"        },
];

const UNITS_INIT: Unit[] = [
  // Electrónica
  { id:"u1",  categoryId:"1", name:"Unidad",    abbreviation:"un",  conversionFactor:1,    baseUnitId:null,  description:"Producto individual",           active:true  },
  { id:"u2",  categoryId:"1", name:"Caja",      abbreviation:"cja", conversionFactor:12,   baseUnitId:"u1",  description:"Caja de 12 unidades",           active:true  },
  { id:"u3",  categoryId:"1", name:"Paquete",   abbreviation:"paq", conversionFactor:6,    baseUnitId:"u1",  description:"Paquete de 6 unidades",         active:true  },
  // Alimentos
  { id:"u4",  categoryId:"2", name:"Kilogramo", abbreviation:"kg",  conversionFactor:1,    baseUnitId:null,  description:"Unidad base de peso",           active:true  },
  { id:"u5",  categoryId:"2", name:"Gramo",     abbreviation:"g",   conversionFactor:0.001,baseUnitId:"u4",  description:"Milésima parte del kilogramo",  active:true  },
  { id:"u6",  categoryId:"2", name:"Libra",     abbreviation:"lb",  conversionFactor:0.454,baseUnitId:"u4",  description:"Unidad anglosajona de peso",    active:true  },
  { id:"u7",  categoryId:"2", name:"Litro",     abbreviation:"L",   conversionFactor:1,    baseUnitId:null,  description:"Unidad base de volumen",        active:true  },
  { id:"u8",  categoryId:"2", name:"Mililitro", abbreviation:"mL",  conversionFactor:0.001,baseUnitId:"u7",  description:"Milésima parte del litro",      active:false },
  // Ropa
  { id:"u9",  categoryId:"3", name:"Unidad",    abbreviation:"un",  conversionFactor:1,    baseUnitId:null,  description:"Prenda individual",             active:true  },
  { id:"u10", categoryId:"3", name:"Docena",    abbreviation:"doc", conversionFactor:12,   baseUnitId:"u9",  description:"Conjunto de 12 prendas",        active:true  },
  // Herramientas
  { id:"u11", categoryId:"4", name:"Unidad",    abbreviation:"un",  conversionFactor:1,    baseUnitId:null,  description:"Herramienta individual",        active:true  },
  { id:"u12", categoryId:"4", name:"Juego",     abbreviation:"jgo", conversionFactor:1,    baseUnitId:null,  description:"Conjunto de herramientas",      active:true  },
  { id:"u13", categoryId:"4", name:"Kit",       abbreviation:"kit", conversionFactor:1,    baseUnitId:null,  description:"Kit completo",                  active:true  },
  // Muebles
  { id:"u14", categoryId:"5", name:"Unidad",    abbreviation:"un",  conversionFactor:1,    baseUnitId:null,  description:"Mueble individual",             active:true  },
  { id:"u15", categoryId:"5", name:"Juego",     abbreviation:"jgo", conversionFactor:1,    baseUnitId:null,  description:"Juego de muebles",              active:true  },
];

export function UnitsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [units,        setUnits]        = useState<Unit[]>(UNITS_INIT);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId,   setExpandedId]   = useState<string | null>(null);

  // inline add-unit form
  const [addingTo,   setAddingTo]   = useState<string | null>(null);
  const emptyChild = { name:"", abbreviation:"", conversionFactor:1, baseUnitId:"", description:"", active:true };
  const [childForm, setChildForm]   = useState(emptyChild);

  // modal editar unidad
  const [showModal,   setShowModal]   = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formData,    setFormData]    = useState(emptyChild);

  // ── helpers ──────────────────────────────────────────
  const unitsOf   = (catId: string) => units.filter(u => u.categoryId === catId);
  const baseUnits = (catId: string) => units.filter(u => u.categoryId === catId && u.baseUnitId === null);
  const baseName  = (id: string | null, catId: string) => {
    if (!id) return "Base";
    return units.find(u => u.id === id && u.categoryId === catId)?.abbreviation ?? "—";
  };

  // ── filtered categories ───────────────────────────────
  const filtered = CATEGORIES.filter(cat => {
    const q = searchTerm.toLowerCase();
    return cat.name.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q);
  }).filter(cat => {
    if (filterStatus === "all") return true;
    const us = unitsOf(cat.id);
    if (filterStatus === "with") return us.length > 0;
    return us.length === 0;
  });

  // ── toggle expand ─────────────────────────────────────
  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
    setAddingTo(null);
    setChildForm(emptyChild);
  };

  // ── handlers inline ───────────────────────────────────
  const handleSaveChild = (catId: string) => {
    if (!childForm.name.trim())         { toast.error("El nombre es obligatorio");         return; }
    if (!childForm.abbreviation.trim()) { toast.error("La abreviatura es obligatoria");    return; }
    setUnits(prev => [...prev, {
      id: Date.now().toString(),
      categoryId: catId,
      name: childForm.name,
      abbreviation: childForm.abbreviation,
      conversionFactor: childForm.conversionFactor,
      baseUnitId: childForm.baseUnitId || null,
      description: childForm.description,
      active: childForm.active,
    }]);
    setChildForm(emptyChild);
    setAddingTo(null);
    toast.success("Unidad agregada");
  };

  const handleDeleteUnit = (id: string) => {
    if (units.some(u => u.baseUnitId === id)) { toast.error("No puedes eliminar una unidad base con dependientes"); return; }
    if (confirm("¿Eliminar esta unidad de medida?")) {
      setUnits(prev => prev.filter(u => u.id !== id));
      toast.success("Unidad eliminada");
    }
  };

  const handleToggleUnit = (id: string) => {
    setUnits(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const openEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({ name:unit.name, abbreviation:unit.abbreviation, conversionFactor:unit.conversionFactor, baseUnitId:unit.baseUnitId||"", description:unit.description, active:unit.active });
    setShowModal(true);
  };

  const handleSaveEdit = () => {
    if (!formData.name.trim())         { toast.error("El nombre es obligatorio");      return; }
    if (!formData.abbreviation.trim()) { toast.error("La abreviatura es obligatoria"); return; }
    setUnits(prev => prev.map(u => u.id === editingUnit!.id ? { ...u, ...formData, baseUnitId: formData.baseUnitId || null } : u));
    toast.success("Unidad actualizada");
    setShowModal(false); setEditingUnit(null);
  };

  // ── estilos ───────────────────────────────────────────
  const txt     = isLight ? "text-gray-900"   : "text-white";
  const divider = `border-t ${isLight ? "border-gray-200" : "border-white/10"}`;
  const card    = `rounded-xl p-4 ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const optBg   = "bg-[#0D1B2A]";
  const ic      = `w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const lbl     = `block mb-1.5 text-sm font-medium ${isLight ? "text-gray-700" : "text-white"}`;
  const tblWrap = `rounded-xl overflow-hidden border ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`;
  const thead   = `border-b text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-white/5 border-white/10 text-gray-400"}`;

  return (
    <div className="space-y-6">



      <div className={divider} />

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"Total unidades",   value: units.length,                          icon:<Ruler    className="w-5 h-5 text-primary"      />, bg:"bg-primary/20"    },
          { label:"Categorías",       value: CATEGORIES.length,                     icon:<Package  className="w-5 h-5 text-blue-400"     />, bg:"bg-blue-500/20"   },
          { label:"Activas",          value: units.filter(u=>u.active).length,      icon:<Scale    className="w-5 h-5 text-green-400"    />, bg:"bg-green-500/20"  },
          { label:"Unidades base",    value: units.filter(u=>!u.baseUnitId).length, icon:<Activity className="w-5 h-5 text-purple-400"   />, bg:"bg-purple-500/20" },
        ].map(m => (
          <div key={m.label} className={card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">{m.label}</p>
                <p className={`font-bold text-2xl ${txt}`}>{m.value}</p>
              </div>
              <div className={`w-10 h-10 ${m.bg} rounded-lg flex items-center justify-center`}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={divider} />

      {/* Acción */}
      <div className="flex justify-end">
        <button
          onClick={() => { if (expandedId) { setAddingTo(expandedId); } else { toast.info("Expande una categoría primero usando el engranaje"); } }}
          className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nueva Unidad
        </button>
      </div>

      {/* Búsqueda + filtros */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar categoría…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${isLight ? "text-gray-900" : "text-white"}`} />
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[180px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${isLight ? "text-gray-700" : "text-gray-300"}`}>
            <option value="all"  className={optBg}>Todas las categorías</option>
            <option value="with" className={optBg}>Con unidades</option>
            <option value="none" className={optBg}>Sin unidades</option>
          </select>
        </div>
      </div>

      {/* Tabla principal — categorías con unidades expandibles */}
      <div className={tblWrap}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={thead}>
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-center">Unidades</th>
                <th className="px-4 py-3 text-center">Activas</th>
                <th className="px-4 py-3 text-center">Gestionar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(cat => {
                const catUnits   = unitsOf(cat.id);
                const activeOnes = catUnits.filter(u => u.active).length;
                const isExp      = expandedId === cat.id;

                return [
                  // Fila categoría
                  <tr key={cat.id} className={`border-b transition-colors ${
                    isExp
                      ? isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"
                      : isLight ? "hover:bg-gray-50 border-gray-100" : "hover:bg-white/[0.04] border-white/5"
                  }`}>
                    <td className="px-3 py-3">
                      <button onClick={() => toggleExpand(cat.id)}
                        className={`p-1 rounded transition-colors ${isExp ? "text-primary" : isLight ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"}`}>
                        {isExp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{cat.name}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[220px]">
                      <span className={`text-sm truncate block ${isLight ? "text-gray-500" : "text-gray-400"}`}>{cat.description}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        catUnits.length > 0
                          ? isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-300"
                          : isLight ? "bg-gray-100 text-gray-500" : "bg-white/5 text-gray-500"
                      }`}>
                        <Ruler className="w-3 h-3" />{catUnits.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        {activeOnes}/{catUnits.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => toggleExpand(cat.id)} title="Gestionar unidades"
                        className={`p-1.5 rounded-lg transition-colors ${isExp ? "text-primary bg-primary/10" : `text-gray-400 ${isLight ? "hover:text-primary hover:bg-primary/10" : "hover:text-primary hover:bg-primary/10"}`}`}>
                        <Settings className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>,

                  // Panel expandido
                  isExp && (
                    <tr key={`${cat.id}-exp`}>
                      <td colSpan={6} className={`px-0 py-0 border-b ${isLight ? "border-primary/10" : "border-primary/10"}`}>
                        <div className={isLight ? "bg-primary/[0.02]" : "bg-primary/[0.05]"}>

                          {/* Sub-tabla de unidades */}
                          {catUnits.length > 0 && (
                            <div className={`border-b ${isLight ? "border-primary/10" : "border-primary/10"}`}>
                              <table className="w-full">
                                <thead>
                                  <tr className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-400 bg-primary/5" : "text-gray-500 bg-primary/5"}`}>
                                    <th className="pl-14 pr-4 py-2 text-left">Nombre</th>
                                    <th className="px-4 py-2 text-center">Abrev.</th>
                                    <th className="px-4 py-2 text-left">Descripción</th>
                                    <th className="px-4 py-2 text-center">Unidad base</th>
                                    <th className="px-4 py-2 text-center">Factor</th>
                                    <th className="px-4 py-2 text-center">Estado</th>
                                    <th className="px-4 py-2 text-center">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {catUnits.map((unit, idx) => (
                                    <tr key={unit.id}
                                      className={`transition-colors ${idx < catUnits.length - 1 ? (isLight ? "border-b border-primary/5" : "border-b border-primary/5") : ""} ${isLight ? "hover:bg-primary/5" : "hover:bg-primary/5"}`}>
                                      <td className="pl-14 pr-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                                          <span className={`text-sm font-medium ${isLight ? "text-gray-800" : "text-gray-100"}`}>{unit.name}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-2.5 text-center">
                                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${isLight ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary"}`}>
                                          {unit.abbreviation}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2.5 max-w-[160px]">
                                        <span className={`text-xs truncate block ${isLight ? "text-gray-400" : "text-gray-500"}`}>{unit.description || "—"}</span>
                                      </td>
                                      <td className="px-4 py-2.5 text-center">
                                        {unit.baseUnitId
                                          ? <span className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{baseName(unit.baseUnitId, cat.id)}</span>
                                          : <span className={`px-2 py-0.5 rounded text-xs ${isLight ? "bg-amber-100 text-amber-700" : "bg-amber-500/20 text-amber-300"}`}>Base</span>
                                        }
                                      </td>
                                      <td className="px-4 py-2.5 text-center">
                                        <span className={`text-xs font-mono ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                          {unit.baseUnitId ? unit.conversionFactor : "—"}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2.5 text-center">
                                        <button onClick={() => handleToggleUnit(unit.id)}
                                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                                            unit.active
                                              ? isLight ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                                              : isLight ? "bg-red-100 text-red-700 hover:bg-red-200"       : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                          }`}>
                                          {unit.active ? "Activa" : "Inactiva"}
                                        </button>
                                      </td>
                                      <td className="px-4 py-2.5">
                                        <div className="flex items-center justify-center gap-1">
                                          <button onClick={() => openEdit(unit)} title="Editar"
                                            className={`p-1 rounded transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                                            <Edit className="w-3.5 h-3.5" />
                                          </button>
                                          <button onClick={() => handleDeleteUnit(unit.id)} title="Eliminar"
                                            className={`p-1 rounded transition-colors text-gray-400 ${isLight ? "hover:text-red-600 hover:bg-red-50" : "hover:text-red-400 hover:bg-red-500/10"}`}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          {/* Formulario inline agregar */}
                          {addingTo === cat.id ? (
                            <div className={`pl-14 pr-4 py-3 flex flex-wrap items-end gap-3 border-b ${isLight ? "border-primary/10 bg-primary/5" : "border-primary/10 bg-primary/5"}`}>
                              <div className="flex flex-col gap-1 min-w-[160px]">
                                <label className={`text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>Nombre *</label>
                                <input autoFocus type="text" value={childForm.name}
                                  onChange={e => setChildForm({...childForm, name:e.target.value})}
                                  placeholder="Ej: Kilogramo"
                                  className={`${ic} !w-auto`}
                                  onKeyDown={e => e.key === "Escape" && setAddingTo(null)}
                                />
                              </div>
                              <div className="flex flex-col gap-1 w-[90px]">
                                <label className={`text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>Abrev. *</label>
                                <input type="text" value={childForm.abbreviation}
                                  onChange={e => setChildForm({...childForm, abbreviation:e.target.value})}
                                  placeholder="kg"
                                  className={`${ic} !w-auto`}
                                />
                              </div>
                              <div className="flex flex-col gap-1 min-w-[140px]">
                                <label className={`text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>Unidad base</label>
                                <select value={childForm.baseUnitId}
                                  onChange={e => setChildForm({...childForm, baseUnitId:e.target.value})}
                                  className={`${ic} !w-auto`}>
                                  <option value="" className={optBg}>Es base</option>
                                  {baseUnits(cat.id).map(u => (
                                    <option key={u.id} value={u.id} className={optBg}>{u.name} ({u.abbreviation})</option>
                                  ))}
                                </select>
                              </div>
                              {childForm.baseUnitId && (
                                <div className="flex flex-col gap-1 w-[100px]">
                                  <label className={`text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>Factor</label>
                                  <input type="number" step="0.001" value={childForm.conversionFactor}
                                    onChange={e => setChildForm({...childForm, conversionFactor:parseFloat(e.target.value)||0})}
                                    className={`${ic} !w-auto`}
                                  />
                                </div>
                              )}
                              <div className="flex flex-col gap-1 min-w-[150px]">
                                <label className={`text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>Descripción</label>
                                <input type="text" value={childForm.description}
                                  onChange={e => setChildForm({...childForm, description:e.target.value})}
                                  placeholder="Opcional"
                                  className={`${ic} !w-auto`}
                                />
                              </div>
                              <label className={`flex items-center gap-1.5 text-xs cursor-pointer mb-2 flex-shrink-0 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                <input type="checkbox" checked={childForm.active}
                                  onChange={e => setChildForm({...childForm, active:e.target.checked})}
                                  className="w-3.5 h-3.5 accent-primary" />
                                Activa
                              </label>
                              <div className="flex gap-2 mb-0.5">
                                <button onClick={() => handleSaveChild(cat.id)}
                                  className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors flex-shrink-0">
                                  <Save className="w-3.5 h-3.5" /> Guardar
                                </button>
                                <button onClick={() => { setAddingTo(null); setChildForm(emptyChild); }}
                                  className={`p-2 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:bg-gray-100 hover:text-gray-600" : "hover:bg-white/10 hover:text-gray-200"}`}>
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="pl-14 pr-4 py-2.5">
                              <button onClick={() => setAddingTo(cat.id)}
                                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Agregar unidad
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ),
                ];
              }) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Ruler className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className="text-gray-400 text-sm">No se encontraron categorías</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MODAL EDITAR UNIDAD
      ══════════════════════════════════════════════════ */}
      {showModal && editingUnit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${isLight ? "bg-white border border-gray-200" : "bg-[#0D1B2A] border border-white/10"}`}>

            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10 ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>Editar Unidad</h3>
                  <p className="text-gray-400 text-xs">{CATEGORIES.find(c => c.id === editingUnit.categoryId)?.name}</p>
                </div>
              </div>
              <button onClick={() => { setShowModal(false); setEditingUnit(null); }}
                className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Nombre <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})}
                    placeholder="Ej: Kilogramo" className={ic} />
                </div>
                <div>
                  <label className={lbl}>Abreviatura <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.abbreviation} onChange={e => setFormData({...formData, abbreviation:e.target.value})}
                    placeholder="kg" className={ic} />
                </div>
              </div>
              <div>
                <label className={lbl}>Descripción</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description:e.target.value})}
                  placeholder="Descripción breve…" className={ic} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Unidad base <span className={`font-normal text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>(opcional)</span></label>
                  <select value={formData.baseUnitId} onChange={e => setFormData({...formData, baseUnitId:e.target.value})} className={ic}>
                    <option value="" className={optBg}>Es unidad base</option>
                    {baseUnits(editingUnit.categoryId).filter(u => u.id !== editingUnit.id).map(u => (
                      <option key={u.id} value={u.id} className={optBg}>{u.name} ({u.abbreviation})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Factor de conversión</label>
                  <input type="number" step="0.000001" value={formData.conversionFactor}
                    onChange={e => setFormData({...formData, conversionFactor:parseFloat(e.target.value)||0})}
                    disabled={!formData.baseUnitId}
                    className={`${ic} disabled:opacity-50 disabled:cursor-not-allowed`} />
                  {formData.baseUnitId && (
                    <p className="text-gray-400 text-xs mt-1">
                      1 {formData.abbreviation || "un"} = {formData.conversionFactor} {baseName(formData.baseUnitId, editingUnit.categoryId)}
                    </p>
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f1825]/50 border-white/5"}`}>
                <input type="checkbox" id="uActive" checked={formData.active}
                  onChange={e => setFormData({...formData, active:e.target.checked})}
                  className="w-4 h-4 accent-primary" />
                <label htmlFor="uActive" className={`text-sm cursor-pointer ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Unidad activa
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className={`border-t px-5 py-4 flex justify-end gap-3 ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button onClick={() => { setShowModal(false); setEditingUnit(null); }}
                className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}>
                Cancelar
              </button>
              <button onClick={handleSaveEdit}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Save className="w-4 h-4" /> Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}