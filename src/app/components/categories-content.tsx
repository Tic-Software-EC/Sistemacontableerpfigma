import { useState } from "react";
import {
  FolderTree, Search, Plus, Edit, Trash2, X,
  Filter, Tag, FolderOpen, Palette, Save, ChevronDown, ChevronRight, Settings,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string;
  parent: string | null;
  active: boolean;
}

const INITIAL: Category[] = [
  { id:"1", name:"Electrónica",  description:"Productos electrónicos y tecnológicos",  parent:null, active:true  },
  { id:"2", name:"Computadoras", description:"Laptops, desktops y accesorios",         parent:"1",  active:true  },
  { id:"3", name:"Celulares",    description:"Smartphones y accesorios móviles",        parent:"1",  active:true  },
  { id:"4", name:"Ropa",         description:"Vestimenta y accesorios",                parent:null, active:true  },
  { id:"5", name:"Camisas",      description:"Camisas formales e informales",           parent:"4",  active:true  },
  { id:"6", name:"Pantalones",   description:"Pantalones de todo tipo",                 parent:"4",  active:false },
  { id:"7", name:"Alimentos",    description:"Productos alimenticios",                 parent:null, active:true  },
  { id:"8", name:"Herramientas", description:"Herramientas manuales y eléctricas",     parent:null, active:true  },
  { id:"9", name:"Muebles",      description:"Muebles para hogar y oficina",           parent:null, active:true  },
];

export function CategoriesContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [categories,   setCategories]   = useState<Category[]>(INITIAL);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId,   setExpandedId]   = useState<string | null>(null);

  // Inline child form
  const [addingChildTo, setAddingChildTo] = useState<string | null>(null);
  const [childForm,     setChildForm]     = useState({ name:"", description:"", active:true });

  // Modal crear/editar
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create"|"edit">("create");
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const emptyForm = { name:"", description:"", parent:"", active:true };
  const [formData, setFormData] = useState(emptyForm);

  // ── helpers ──────────────────────────────────────────
  const parentCats = () => categories.filter(c => c.parent === null);
  const children   = (id: string) => categories.filter(c => c.parent === id);

  // ── filtered (solo padres) ────────────────────────────
  const filtered = categories.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchQ = c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchS = filterStatus === "all" ? true : filterStatus === "active" ? c.active : !c.active;
    return c.parent === null && matchQ && matchS;
  });

  // ── toggle expand ─────────────────────────────────────
  const toggleExpand = (id: string) => {
    if (expandedId === id) { setExpandedId(null); setAddingChildTo(null); }
    else { setExpandedId(id); setAddingChildTo(null); }
    setChildForm({ name:"", description:"", active:true });
  };

  // ── handlers crear/editar ─────────────────────────────
  const openCreate = () => { setModalMode("create"); setEditingCat(null); setFormData(emptyForm); setShowModal(true); };
  const openEdit   = (c: Category) => {
    setModalMode("edit"); setEditingCat(c);
    setFormData({ name:c.name, description:c.description, parent:c.parent||"", active:c.active });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingCat(null); };

  const handleSave = () => {
    if (!formData.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    if (modalMode === "create") {
      setCategories([...categories, { id: Date.now().toString(), name:formData.name, description:formData.description, parent:formData.parent||null, active:formData.active }]);
      toast.success("Categoría creada exitosamente");
    } else {
      setCategories(categories.map(c => c.id === editingCat?.id ? { ...c, ...formData, parent:formData.parent||null } : c));
      toast.success("Categoría actualizada exitosamente");
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (categories.some(c => c.parent === id)) { toast.error("No puedes eliminar una categoría con subcategorías"); return; }
    if (confirm("¿Eliminar esta categoría?")) {
      setCategories(categories.filter(c => c.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast.success("Categoría eliminada");
    }
  };

  const handleDeleteChild = (id: string) => {
    if (confirm("¿Eliminar esta subcategoría?")) {
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("Subcategoría eliminada");
    }
  };

  const handleToggleStatus = (id: string) => {
    const cat = categories.find(c => c.id === id);
    setCategories(categories.map(c => c.id === id ? { ...c, active: !c.active } : c));
    toast.success(cat?.active ? "Desactivada" : "Activada");
  };

  const handleSaveChild = (parentId: string) => {
    if (!childForm.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    setCategories(prev => [...prev, { id: Date.now().toString(), name:childForm.name, description:childForm.description, parent:parentId, active:childForm.active }]);
    setChildForm({ name:"", description:"", active:true });
    setAddingChildTo(null);
    toast.success("Subcategoría agregada");
  };

  // ── styles ────────────────────────────────────────────
  const txt     = isLight ? "text-gray-900" : "text-white";
  const divider = `border-t ${isLight ? "border-gray-200" : "border-white/10"}`;
  const card    = `rounded-xl p-4 ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const optBg   = "bg-[#0D1B2A]";
  const ic      = `w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const lbl     = `block mb-1.5 text-sm font-medium ${isLight ? "text-gray-700" : "text-white"}`;

  return (
    <div className="space-y-6">

      <div className={divider} />

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:"Total",         value: categories.length,                             icon:<FolderTree className="w-5 h-5 text-primary" />,   bg:"bg-primary/20"    },
          { label:"Principales",   value: categories.filter(c=>c.parent===null).length, icon:<FolderOpen className="w-5 h-5 text-blue-400" />,  bg:"bg-blue-500/20"   },
          { label:"Subcategorías", value: categories.filter(c=>c.parent!==null).length, icon:<Tag        className="w-5 h-5 text-green-400" />,  bg:"bg-green-500/20"  },
          { label:"Activas",       value: categories.filter(c=>c.active).length,        icon:<Palette    className="w-5 h-5 text-purple-400" />, bg:"bg-purple-500/20" },
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
        <button onClick={openCreate}
          className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nueva Categoría
        </button>
      </div>

      {/* Búsqueda + filtros */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar categorías principales…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${isLight ? "text-gray-900" : "text-white"}`} />
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[160px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${isLight ? "text-gray-700" : "text-gray-300"}`}>
            <option value="all"      className={optBg}>Todos los estados</option>
            <option value="active"   className={optBg}>Activas</option>
            <option value="inactive" className={optBg}>Inactivas</option>
          </select>
        </div>
      </div>

      {/* Tabla con filas expandibles */}
      <div className={`rounded-xl overflow-hidden border ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-white/5 border-white/10 text-gray-400"}`}>
                <th className="px-4 py-3 text-left w-8"></th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-center">Subcategorías</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(cat => {
                const kids = children(cat.id);
                const isExpanded = expandedId === cat.id;
                return [
                  // Fila padre
                  <tr key={cat.id}
                    className={`border-b transition-colors ${
                      isExpanded
                        ? isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"
                        : isLight ? "hover:bg-gray-50 border-gray-100" : "hover:bg-white/[0.04] border-white/5"
                    }`}>
                    {/* Toggle expand */}
                    <td className="px-3 py-3">
                      <button onClick={() => toggleExpand(cat.id)}
                        className={`p-1 rounded transition-colors ${isExpanded ? "text-primary" : isLight ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"}`}>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FolderOpen className={`w-4 h-4 flex-shrink-0 ${isExpanded ? "text-primary" : "text-gray-400"}`} />
                        <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <span className={`text-sm truncate block ${isLight ? "text-gray-500" : "text-gray-400"}`}>{cat.description || "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                        kids.length > 0
                          ? isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-300"
                          : isLight ? "bg-gray-100 text-gray-500" : "bg-white/5 text-gray-500"
                      }`}>
                        <Tag className="w-3 h-3" />{kids.length}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleToggleStatus(cat.id)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          cat.active
                            ? isLight ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200" : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                            : isLight ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"         : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        }`}>
                        {cat.active ? "Activa" : "Inactiva"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => toggleExpand(cat.id)} title="Gestionar subcategorías"
                          className={`p-1.5 rounded-lg transition-colors ${isExpanded ? "text-primary bg-primary/10" : `text-gray-400 ${isLight ? "hover:text-primary hover:bg-primary/10" : "hover:text-primary hover:bg-primary/10"}`}`}>
                          <Settings className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(cat)} title="Editar"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} title="Eliminar"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-red-600 hover:bg-red-50" : "hover:text-red-400 hover:bg-red-500/10"}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>,

                  // Panel expandido de subcategorías
                  isExpanded && (
                    <tr key={`${cat.id}-expanded`}>
                      <td colSpan={6} className={`px-0 py-0 border-b ${isLight ? "border-primary/10" : "border-primary/10"}`}>
                        <div className={`${isLight ? "bg-primary/[0.03]" : "bg-primary/[0.06]"}`}>

                          {/* Sub-tabla de hijos */}
                          {kids.length > 0 && (
                            <div className={`border-b ${isLight ? "border-primary/10" : "border-primary/10"}`}>
                              <table className="w-full">
                                <thead>
                                  <tr className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-400 bg-primary/5" : "text-gray-500 bg-primary/5"}`}>
                                    <th className="pl-14 pr-4 py-2 text-left">Subcategoría</th>
                                    <th className="px-4 py-2 text-left">Descripción</th>
                                    <th className="px-4 py-2 text-center">Estado</th>
                                    <th className="px-4 py-2 text-center">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {kids.map((child, idx) => (
                                    <tr key={child.id}
                                      className={`transition-colors ${idx < kids.length - 1 ? (isLight ? "border-b border-primary/5" : "border-b border-primary/5") : ""} ${isLight ? "hover:bg-primary/5" : "hover:bg-primary/5"}`}>
                                      <td className="pl-14 pr-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0`} />
                                          <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-200"}`}>{child.name}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-2.5 max-w-[180px]">
                                        <span className={`text-xs truncate block ${isLight ? "text-gray-400" : "text-gray-500"}`}>{child.description || "—"}</span>
                                      </td>
                                      <td className="px-4 py-2.5 text-center">
                                        <button onClick={() => handleToggleStatus(child.id)}
                                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                                            child.active
                                              ? isLight ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                                              : isLight ? "bg-red-100 text-red-700 hover:bg-red-200"       : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                                          }`}>
                                          {child.active ? "Activa" : "Inactiva"}
                                        </button>
                                      </td>
                                      <td className="px-4 py-2.5">
                                        <div className="flex items-center justify-center gap-1">
                                          <button onClick={() => openEdit(child)} title="Editar"
                                            className={`p-1 rounded transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                                            <Edit className="w-3.5 h-3.5" />
                                          </button>
                                          <button onClick={() => handleDeleteChild(child.id)} title="Eliminar"
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

                          {/* Formulario agregar hijo */}
                          {addingChildTo === cat.id ? (
                            <div className="pl-14 pr-4 py-3 flex items-center gap-3">
                              <input autoFocus type="text" value={childForm.name}
                                onChange={e => setChildForm({...childForm, name:e.target.value})}
                                placeholder="Nombre de la subcategoría"
                                className={`${ic} max-w-[220px]`}
                                onKeyDown={e => { if (e.key === "Enter") handleSaveChild(cat.id); if (e.key === "Escape") { setAddingChildTo(null); setChildForm({name:"", description:"", active:true}); } }}
                              />
                              <input type="text" value={childForm.description}
                                onChange={e => setChildForm({...childForm, description:e.target.value})}
                                placeholder="Descripción (opcional)"
                                className={`${ic} max-w-[200px]`}
                              />
                              <label className={`flex items-center gap-1.5 text-xs cursor-pointer flex-shrink-0 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                <input type="checkbox" checked={childForm.active}
                                  onChange={e => setChildForm({...childForm, active:e.target.checked})}
                                  className="w-3.5 h-3.5 accent-primary" />
                                Activa
                              </label>
                              <button onClick={() => handleSaveChild(cat.id)}
                                className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors flex-shrink-0">
                                <Save className="w-3.5 h-3.5" /> Guardar
                              </button>
                              <button onClick={() => { setAddingChildTo(null); setChildForm({name:"", description:"", active:true}); }}
                                className={`p-2 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:bg-gray-100 hover:text-gray-600" : "hover:bg-white/10 hover:text-gray-200"}`}>
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="pl-14 pr-4 py-2.5">
                              <button
                                onClick={() => setAddingChildTo(cat.id)}
                                className={`flex items-center gap-1.5 text-xs font-medium transition-colors text-primary hover:text-primary/80`}>
                                <Plus className="w-3.5 h-3.5" /> Agregar subcategoría
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
                    <FolderTree className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className="text-gray-400 text-sm">No se encontraron categorías</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MODAL CREAR / EDITAR
      ══════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${isLight ? "bg-white border border-gray-200" : "bg-[#0D1B2A] border border-white/10"}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10 ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  {modalMode === "create" ? <Plus className="w-5 h-5 text-primary" /> : <Edit className="w-5 h-5 text-primary" />}
                </div>
                <h3 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>
                  {modalMode === "create" ? "Nueva Categoría" : "Editar Categoría"}
                </h3>
              </div>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className={lbl}>Nombre <span className="text-red-400">*</span></label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})}
                  placeholder="Ej: Electrónica" className={ic} />
              </div>
              <div>
                <label className={lbl}>Descripción</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description:e.target.value})}
                  placeholder="Descripción breve de la categoría…" rows={3} className={`${ic} resize-none`} />
              </div>
              <div>
                <label className={lbl}>Categoría padre <span className={`font-normal text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>(opcional)</span></label>
                <select value={formData.parent} onChange={e => setFormData({...formData, parent:e.target.value})} className={ic}>
                  <option value="" className={optBg}>Sin categoría padre (principal)</option>
                  {parentCats().filter(c => c.id !== editingCat?.id).map(c => (
                    <option key={c.id} value={c.id} className={optBg}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className={`flex items-center gap-4 p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f1825]/50 border-white/5"}`}>
                <input type="checkbox" checked={formData.active} id="catActive"
                  onChange={e => setFormData({...formData, active:e.target.checked})}
                  className="w-4 h-4 accent-primary" />
                <div>
                  <label htmlFor="catActive" className={`text-sm font-medium cursor-pointer ${isLight ? "text-gray-900" : "text-white"}`}>Categoría activa</label>
                  <p className="text-gray-400 text-xs mt-0.5">Solo las categorías activas pueden asignarse a productos</p>
                </div>
              </div>
            </div>

            <div className={`border-t px-5 py-4 flex justify-end gap-3 ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button onClick={closeModal}
                className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}>
                Cancelar
              </button>
              <button onClick={handleSave}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Save className="w-4 h-4" />
                {modalMode === "create" ? "Crear Categoría" : "Actualizar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}