import { useState } from "react";
import { Save, Plus, Edit2, Trash2, Copy, Eye, Download, Upload, Search, X, Check, ChevronRight, ChevronDown, FileText, Hash, Tag, Layers, BarChart3, FolderTree, Filter } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════ */
interface CuentaContable {
  id: string;
  codigo: string;
  nombre: string;
  tipo: "Activo" | "Pasivo" | "Patrimonio" | "Ingreso" | "Gasto";
  categoria: string;
  nivel: number;
  activa: boolean;
}

interface LineaAsiento {
  cuenta: string;
  tipo: "debe" | "haber";
  formula?: string; // ej: "subtotal", "iva", "total * 0.15"
}

interface PlantillaAsiento {
  id: string;
  nombre: string;
  modulo: "Ventas" | "Compras" | "Inventario" | "Nómina" | "Tesorería";
  descripcion: string;
  activa: boolean;
  lineas: LineaAsiento[];
}

/* ══════════════════════════════════════════════════
   DATA INICIAL
══════════════════════════════════════════════════ */
const CUENTAS_INICIAL: CuentaContable[] = [
  { id: "1", codigo: "1", nombre: "ACTIVO", tipo: "Activo", categoria: "Raíz", nivel: 1, activa: true },
  { id: "2", codigo: "1.1", nombre: "ACTIVO CORRIENTE", tipo: "Activo", categoria: "Grupo", nivel: 2, activa: true },
  { id: "3", codigo: "1.1.1", nombre: "Efectivo y Equivalentes", tipo: "Activo", categoria: "Subgrupo", nivel: 3, activa: true },
  { id: "4", codigo: "1.1.1.01", nombre: "Caja General", tipo: "Activo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "5", codigo: "1.1.1.02", nombre: "Banco Pichincha Cte.", tipo: "Activo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "6", codigo: "1.1.1.03", nombre: "Banco Guayaquil Ahorros", tipo: "Activo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "7", codigo: "1.1.2", nombre: "Cuentas por Cobrar", tipo: "Activo", categoria: "Subgrupo", nivel: 3, activa: true },
  { id: "8", codigo: "1.1.2.01", nombre: "Clientes Locales", tipo: "Activo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "9", codigo: "1.1.2.02", nombre: "Clientes Exterior", tipo: "Activo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "10", codigo: "1.1.3", nombre: "Impuestos por Cobrar", tipo: "Activo", categoria: "Subgrupo", nivel: 3, activa: true },
  { id: "11", codigo: "1.1.3.01", nombre: "IVA en Compras", tipo: "Activo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "12", codigo: "1.1.3.02", nombre: "Retención IVA por Cobrar", tipo: "Activo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "13", codigo: "1.1.3.03", nombre: "Retención Renta por Cobrar", tipo: "Activo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "14", codigo: "1.1.4", nombre: "Inventarios", tipo: "Activo", categoria: "Subgrupo", nivel: 3, activa: true },
  { id: "15", codigo: "1.1.4.01", nombre: "Inventario de Mercadería", tipo: "Activo", categoria: "Detalle", nivel: 4, activa: true },
  
  { id: "20", codigo: "2", nombre: "PASIVO", tipo: "Pasivo", categoria: "Raíz", nivel: 1, activa: true },
  { id: "21", codigo: "2.1", nombre: "PASIVO CORRIENTE", tipo: "Pasivo", categoria: "Grupo", nivel: 2, activa: true },
  { id: "22", codigo: "2.1.1", nombre: "Cuentas por Pagar", tipo: "Pasivo", categoria: "Subgrupo", nivel: 3, activa: true },
  { id: "23", codigo: "2.1.1.01", nombre: "Proveedores Locales", tipo: "Pasivo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "24", codigo: "2.1.1.02", nombre: "Proveedores Exterior", tipo: "Pasivo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "25", codigo: "2.1.3", nombre: "Impuestos por Pagar", tipo: "Pasivo", categoria: "Subgrupo", nivel: 3, activa: true },
  { id: "26", codigo: "2.1.3.01", nombre: "IVA por Pagar", tipo: "Pasivo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "27", codigo: "2.1.3.02", nombre: "Retención IVA por Pagar", tipo: "Pasivo", categoria: "Detalle", nivel: 4, activa: true },
  { id: "28", codigo: "2.1.3.03", nombre: "Retención Renta por Pagar", tipo: "Pasivo", categoria: "Detalle", nivel: 4, activa: true },
  
  { id: "40", codigo: "4", nombre: "INGRESOS", tipo: "Ingreso", categoria: "Raíz", nivel: 1, activa: true },
  { id: "41", codigo: "4.1", nombre: "INGRESOS OPERACIONALES", tipo: "Ingreso", categoria: "Grupo", nivel: 2, activa: true },
  { id: "42", codigo: "4.1.1", nombre: "Ventas", tipo: "Ingreso", categoria: "Subgrupo", nivel: 3, activa: true },
  { id: "43", codigo: "4.1.1.01", nombre: "Ventas Locales", tipo: "Ingreso", categoria: "Detalle", nivel: 4, activa: true },
  { id: "44", codigo: "4.1.1.02", nombre: "Ventas Exterior", tipo: "Ingreso", categoria: "Detalle", nivel: 4, activa: true },
  
  { id: "50", codigo: "5", nombre: "GASTOS", tipo: "Gasto", categoria: "Raíz", nivel: 1, activa: true },
  { id: "51", codigo: "5.1", nombre: "COSTO DE VENTAS", tipo: "Gasto", categoria: "Grupo", nivel: 2, activa: true },
  { id: "52", codigo: "5.1.1", nombre: "Costo de Mercadería Vendida", tipo: "Gasto", categoria: "Subgrupo", nivel: 3, activa: true },
  { id: "53", codigo: "5.1.1.01", nombre: "Costo de Ventas", tipo: "Gasto", categoria: "Detalle", nivel: 4, activa: true },
];

const PLANTILLAS_INICIAL: PlantillaAsiento[] = [
  {
    id: "1",
    nombre: "Factura de Venta al Contado",
    modulo: "Ventas",
    descripcion: "Asiento generado al emitir una factura de venta con cobro inmediato",
    activa: true,
    lineas: [
      { cuenta: "1.1.1.01", tipo: "debe" },
      { cuenta: "1.1.3.03", tipo: "debe" },
      { cuenta: "1.1.3.02", tipo: "debe" },
      { cuenta: "4.1.1.01", tipo: "haber" },
      { cuenta: "2.1.3.01", tipo: "haber" },
    ],
  },
  {
    id: "2",
    nombre: "Factura de Compra al Contado",
    modulo: "Compras",
    descripcion: "Asiento generado al registrar una compra con pago inmediato",
    activa: true,
    lineas: [
      { cuenta: "1.1.4.01", tipo: "debe" },
      { cuenta: "1.1.3.01", tipo: "debe" },
      { cuenta: "1.1.1.01", tipo: "haber" },
      { cuenta: "2.1.3.03", tipo: "haber" },
      { cuenta: "2.1.3.02", tipo: "haber" },
    ],
  },
  {
    id: "3",
    nombre: "Factura de Venta a Crédito",
    modulo: "Ventas",
    descripcion: "Asiento generado al emitir una factura de venta a crédito",
    activa: true,
    lineas: [
      { cuenta: "1.1.2.01", tipo: "debe" },
      { cuenta: "1.1.3.03", tipo: "debe" },
      { cuenta: "1.1.3.02", tipo: "debe" },
      { cuenta: "4.1.1.01", tipo: "haber" },
      { cuenta: "2.1.3.01", tipo: "haber" },
    ],
  },
];

export function AccountingSettingsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [activeTab, setActiveTab] = useState<"cuentas" | "plantillas">("cuentas");
  
  // Estado para cuentas
  const [cuentas, setCuentas] = useState<CuentaContable[]>(CUENTAS_INICIAL);
  const [searchCuentas, setSearchCuentas] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [showModalCuenta, setShowModalCuenta] = useState(false);
  const [editingCuenta, setEditingCuenta] = useState<CuentaContable | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set(["1", "2", "40", "50"])); // IDs expandidos por defecto
  
  // Estado para plantillas
  const [plantillas, setPlantillas] = useState<PlantillaAsiento[]>(PLANTILLAS_INICIAL);
  const [searchPlantillas, setSearchPlantillas] = useState("");
  const [filterModulo, setFilterModulo] = useState<string>("all");
  const [showModalPlantilla, setShowModalPlantilla] = useState(false);
  const [editingPlantilla, setEditingPlantilla] = useState<PlantillaAsiento | null>(null);
  const [showPreview, setShowPreview] = useState<PlantillaAsiento | null>(null);

  // Clases comunes
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const inp = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
    isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
  }`;

  /* ── FUNCIONES PARA CUENTAS ─────────────────────────────────── */
  const toggleExpand = (cuentaId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(cuentaId)) {
      newExpanded.delete(cuentaId);
    } else {
      newExpanded.add(cuentaId);
    }
    setExpandedAccounts(newExpanded);
  };

  const hasChildren = (cuenta: CuentaContable) => {
    return cuentas.some(c => c.codigo.startsWith(cuenta.codigo + ".") && c.nivel === cuenta.nivel + 1);
  };

  const isChildOf = (child: CuentaContable, parent: CuentaContable) => {
    return child.codigo.startsWith(parent.codigo + ".") && child.nivel > parent.nivel;
  };

  const shouldShowAccount = (cuenta: CuentaContable) => {
    // Siempre mostrar nivel 1
    if (cuenta.nivel === 1) return true;
    
    // Buscar el padre directo
    const parentCode = cuenta.codigo.split('.').slice(0, -1).join('.');
    const parent = cuentas.find(c => c.codigo === parentCode);
    
    if (!parent) return true;
    
    // Verificar si el padre está expandido
    if (!expandedAccounts.has(parent.id)) return false;
    
    // Verificar recursivamente todos los ancestros
    return shouldShowAccount(parent);
  };

  const handleAddCuenta = () => {
    setEditingCuenta({
      id: "",
      codigo: "",
      nombre: "",
      tipo: "Activo",
      categoria: "Detalle",
      nivel: 4,
      activa: true,
    });
    setShowModalCuenta(true);
  };

  const handleEditCuenta = (cuenta: CuentaContable) => {
    setEditingCuenta({ ...cuenta });
    setShowModalCuenta(true);
  };

  const handleSaveCuenta = () => {
    if (!editingCuenta) return;
    
    if (!editingCuenta.codigo || !editingCuenta.nombre) {
      toast.error("Código y nombre son obligatorios");
      return;
    }

    // Asignar categoría automáticamente según el nivel
    const categoriaAuto = 
      editingCuenta.nivel === 1 ? "Raíz" :
      editingCuenta.nivel === 2 ? "Grupo" :
      editingCuenta.nivel === 3 ? "Subgrupo" : "Detalle";

    const cuentaFinal = {
      ...editingCuenta,
      categoria: categoriaAuto
    };

    if (editingCuenta.id) {
      setCuentas(cuentas.map(c => c.id === editingCuenta.id ? cuentaFinal : c));
      toast.success("Cuenta actualizada");
    } else {
      const newCuenta = { ...cuentaFinal, id: Date.now().toString() };
      setCuentas([...cuentas, newCuenta]);
      toast.success("Cuenta agregada");
    }
    
    setShowModalCuenta(false);
    setEditingCuenta(null);
  };

  const handleDeleteCuenta = (id: string) => {
    const cuenta = cuentas.find(c => c.id === id);
    if (!cuenta) return;
    
    // Verificar si tiene subcuentas
    if (hasChildren(cuenta)) {
      toast.error("No se puede eliminar una cuenta que tiene subcuentas. Elimine primero las subcuentas.");
      return;
    }
    
    if (window.confirm("¿Eliminar esta cuenta? Esta acción no se puede deshacer.")) {
      setCuentas(cuentas.filter(c => c.id !== id));
      toast.success("Cuenta eliminada");
    }
  };

  const handleToggleCuentaActiva = (id: string) => {
    setCuentas(cuentas.map(c => c.id === id ? { ...c, activa: !c.activa } : c));
    toast.success("Estado actualizado");
  };

  /* ── FUNCIONES PARA PLANTILLAS ──────────────────────────────── */
  const handleAddPlantilla = () => {
    setEditingPlantilla({
      id: "",
      nombre: "",
      modulo: "Ventas",
      descripcion: "",
      activa: true,
      lineas: [{ cuenta: "", tipo: "debe" }],
    });
    setShowModalPlantilla(true);
  };

  const handleEditPlantilla = (plantilla: PlantillaAsiento) => {
    setEditingPlantilla({ ...plantilla, lineas: plantilla.lineas.map(l => ({ ...l })) });
    setShowModalPlantilla(true);
  };

  const handleSavePlantilla = () => {
    if (!editingPlantilla) return;
    
    if (!editingPlantilla.nombre || !editingPlantilla.descripcion) {
      toast.error("Nombre y descripción son obligatorios");
      return;
    }

    if (editingPlantilla.lineas.length === 0 || editingPlantilla.lineas.some(l => !l.cuenta)) {
      toast.error("Debe agregar al menos una línea válida");
      return;
    }

    if (editingPlantilla.id) {
      setPlantillas(plantillas.map(p => p.id === editingPlantilla.id ? editingPlantilla : p));
      toast.success("Plantilla actualizada");
    } else {
      const newPlantilla = { ...editingPlantilla, id: Date.now().toString() };
      setPlantillas([...plantillas, newPlantilla]);
      toast.success("Plantilla creada");
    }
    
    setShowModalPlantilla(false);
    setEditingPlantilla(null);
  };

  const handleDeletePlantilla = (id: string) => {
    if (window.confirm("¿Eliminar esta plantilla de asiento?")) {
      setPlantillas(plantillas.filter(p => p.id !== id));
      toast.success("Plantilla eliminada");
    }
  };

  const handleDuplicatePlantilla = (plantilla: PlantillaAsiento) => {
    const duplicated = {
      ...plantilla,
      id: Date.now().toString(),
      nombre: `${plantilla.nombre} (Copia)`,
      lineas: plantilla.lineas.map(l => ({ ...l })),
    };
    setPlantillas([...plantillas, duplicated]);
    toast.success("Plantilla duplicada");
  };

  const handleTogglePlantillaActiva = (id: string) => {
    setPlantillas(plantillas.map(p => p.id === id ? { ...p, activa: !p.activa } : p));
    toast.success("Estado actualizado");
  };

  const addLineaPlantilla = () => {
    if (!editingPlantilla) return;
    setEditingPlantilla({
      ...editingPlantilla,
      lineas: [...editingPlantilla.lineas, { cuenta: "", tipo: "debe" }],
    });
  };

  const removeLineaPlantilla = (index: number) => {
    if (!editingPlantilla) return;
    setEditingPlantilla({
      ...editingPlantilla,
      lineas: editingPlantilla.lineas.filter((_, i) => i !== index),
    });
  };

  const updateLineaPlantilla = (index: number, field: keyof LineaAsiento, value: any) => {
    if (!editingPlantilla) return;
    const newLineas = [...editingPlantilla.lineas];
    newLineas[index] = { ...newLineas[index], [field]: value };
    setEditingPlantilla({ ...editingPlantilla, lineas: newLineas });
  };

  /* ── FILTRADO ───────────────────────────────────────────────── */
  const cuentasFiltradas = cuentas.filter(c => {
    const matchSearch = c.codigo.toLowerCase().includes(searchCuentas.toLowerCase()) || 
                       c.nombre.toLowerCase().includes(searchCuentas.toLowerCase());
    const matchTipo = filterTipo === "all" || c.tipo === filterTipo;
    return matchSearch && matchTipo;
  });

  const plantillasFiltradas = plantillas.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(searchPlantillas.toLowerCase()) || 
                       p.descripcion.toLowerCase().includes(searchPlantillas.toLowerCase());
    const matchModulo = filterModulo === "all" || p.modulo === filterModulo;
    return matchSearch && matchModulo;
  });

  const getCuentaNombre = (codigo: string) => {
    const cuenta = cuentas.find(c => c.codigo === codigo);
    return cuenta ? `${cuenta.codigo} - ${cuenta.nombre}` : codigo;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Configuración Contable</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>
            Gestiona el catálogo de cuentas y las plantillas de asientos automáticos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info("Exportar configuración")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => toast.info("Importar configuración")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            <Upload className="w-4 h-4" />
            Importar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab("cuentas")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "cuentas"
              ? "border-primary text-primary"
              : `border-transparent ${sub} hover:text-gray-700 dark:hover:text-gray-300`
          }`}
        >
          Catálogo de Cuentas ({cuentas.length})
        </button>
        <button
          onClick={() => setActiveTab("plantillas")}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "plantillas"
              ? "border-primary text-primary"
              : `border-transparent ${sub} hover:text-gray-700 dark:hover:text-gray-300`
          }`}
        >
          Asientos Automáticos ({plantillas.length})
        </button>
      </div>

      {/* CONTENIDO: Catálogo de Cuentas */}
      {activeTab === "cuentas" && (
        <div className="space-y-4">
          {/* Barra de acciones */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                <input
                  type="text"
                  placeholder="Buscar por código o nombre..."
                  value={searchCuentas}
                  onChange={(e) => setSearchCuentas(e.target.value)}
                  className={`${inp} pl-10 w-full`}
                />
              </div>
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className={`${inp} pl-10 pr-10 min-w-[180px]`}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="Activo">Activo</option>
                  <option value="Pasivo">Pasivo</option>
                  <option value="Patrimonio">Patrimonio</option>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Gasto">Gasto</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleAddCuenta}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Cuenta
            </button>
          </div>

          {/* Tabla de cuentas */}
          <div className={`${card} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${isLight ? "bg-gray-50" : "bg-white/5"} border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>Código</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>Nombre</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>Tipo</th>
                    <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide ${sub}`}>Nivel</th>
                    <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide ${sub}`}>Estado</th>
                    <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide ${sub}`}>Acciones</th>
                  </tr>
                </thead>
                <tbody className={isLight ? "bg-white" : ""}>
                  {cuentasFiltradas
                    .filter(cuenta => shouldShowAccount(cuenta))
                    .map((cuenta, idx) => {
                      const tienHijos = hasChildren(cuenta);
                      const estaExpandido = expandedAccounts.has(cuenta.id);
                      
                      return (
                        <tr
                          key={cuenta.id}
                          className={`border-b ${isLight ? "border-gray-100" : "border-white/5"} transition-colors`}
                        >
                          <td className={`px-4 py-3 text-sm font-mono ${txt}`}>
                            <div className="flex items-center gap-1.5" style={{ paddingLeft: `${(cuenta.nivel - 1) * 20}px` }}>
                              {tienHijos ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpand(cuenta.id);
                                  }}
                                  className={`p-0.5 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors ${sub}`}
                                >
                                  {estaExpandido ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              ) : (
                                <div className="w-5" />
                              )}
                              <span className={`${cuenta.nivel <= 2 ? "font-bold text-primary" : ""}`}>{cuenta.codigo}</span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-sm ${txt}`}>
                            <span className={cuenta.nivel <= 2 ? "font-bold" : cuenta.nivel === 3 ? "font-semibold" : ""}>
                              {cuenta.nombre}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                              cuenta.tipo === "Activo" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                              cuenta.tipo === "Pasivo" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                              cuenta.tipo === "Patrimonio" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                              cuenta.tipo === "Ingreso" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                              "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                            }`}>
                              {cuenta.tipo}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-sm text-center ${sub}`}>
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-semibold">
                              {cuenta.nivel}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleToggleCuentaActiva(cuenta.id)}
                              className={`inline-block px-3 py-1 rounded-md text-xs font-medium transition-all ${
                                cuenta.activa 
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
                                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                              }`}
                            >
                              {cuenta.activa ? "Activa" : "Inactiva"}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleEditCuenta(cuenta)}
                                className={`p-1.5 rounded-lg hover:bg-primary/10 transition-colors ${sub} hover:text-primary`}
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCuenta(cuenta.id)}
                                className={`p-1.5 rounded-lg hover:bg-red-500/10 transition-colors ${sub} hover:text-red-500`}
                                title="Eliminar"
                              >
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

            {cuentasFiltradas.length === 0 && (
              <div className="py-12 text-center">
                <p className={`text-sm ${sub}`}>No se encontraron cuentas</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO: Plantillas de Asientos */}
      {activeTab === "plantillas" && (
        <div className="space-y-4">
          {/* Barra de acciones */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                <input
                  type="text"
                  placeholder="Buscar plantilla..."
                  value={searchPlantillas}
                  onChange={(e) => setSearchPlantillas(e.target.value)}
                  className={`${inp} pl-10 w-full`}
                />
              </div>
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                <select
                  value={filterModulo}
                  onChange={(e) => setFilterModulo(e.target.value)}
                  className={`${inp} pl-10 pr-10 min-w-[180px]`}
                >
                  <option value="all">Todos los módulos</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Compras">Compras</option>
                  <option value="Inventario">Inventario</option>
                  <option value="Nómina">Nómina</option>
                  <option value="Tesorería">Tesorería</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={handleAddPlantilla}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nueva Plantilla
            </button>
          </div>

          {/* Tabla de plantillas */}
          <div className={`${card} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${isLight ? "bg-gray-50" : "bg-white/5"} border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>Nombre</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>Descripción</th>
                    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>Módulo</th>
                    <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide ${sub}`}>Líneas</th>
                    <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide ${sub}`}>Estado</th>
                    <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide ${sub}`}>Acciones</th>
                  </tr>
                </thead>
                <tbody className={isLight ? "bg-white" : ""}>
                  {plantillasFiltradas.map((plantilla) => (
                    <tr
                      key={plantilla.id}
                      className={`border-b ${isLight ? "border-gray-100" : "border-white/5"} transition-colors hover:bg-gray-50 dark:hover:bg-white/5`}
                    >
                      <td className={`px-4 py-3 text-sm font-semibold ${txt}`}>
                        {plantilla.nombre}
                      </td>
                      <td className={`px-4 py-3 text-sm ${sub}`}>
                        <div className="max-w-md truncate">
                          {plantilla.descripcion}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                          plantilla.modulo === "Ventas" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                          plantilla.modulo === "Compras" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                          plantilla.modulo === "Inventario" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                          plantilla.modulo === "Nómina" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" :
                          "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                        }`}>
                          {plantilla.modulo}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-sm text-center ${sub}`}>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 text-xs font-semibold">
                          {plantilla.lineas.length}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePlantillaActiva(plantilla.id)}
                          className={`inline-block px-3 py-1 rounded-md text-xs font-medium transition-all ${
                            plantilla.activa 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {plantilla.activa ? "Activa" : "Inactiva"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setShowPreview(plantilla)}
                            className={`p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors ${sub} hover:text-blue-500`}
                            title="Ver"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditPlantilla(plantilla)}
                            className={`p-1.5 rounded-lg hover:bg-primary/10 transition-colors ${sub} hover:text-primary`}
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlantilla(plantilla.id)}
                            className={`p-1.5 rounded-lg hover:bg-red-500/10 transition-colors ${sub} hover:text-red-500`}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {plantillasFiltradas.length === 0 && (
              <div className="py-12 text-center">
                <p className={`text-sm ${sub}`}>No se encontraron plantillas</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Cuenta */}
      {showModalCuenta && editingCuenta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A]"} shadow-2xl`}>
            {/* Header con icono y título */}
            <div className={`flex items-center justify-between px-6 py-5 ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className={`font-bold text-lg ${txt}`}>
                  {editingCuenta.id ? "Editar Cuenta" : "Nueva Cuenta"}
                </h3>
              </div>
              <button
                onClick={() => setShowModalCuenta(false)}
                className={`p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-colors ${sub}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del formulario */}
            <div className="p-6 space-y-5">
              {/* Fila 0: Cuenta Padre (opcional) */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Cuenta Padre
                </label>
                <div className="relative">
                  <FolderTree className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        const padre = cuentas.find(c => c.id === e.target.value);
                        if (padre) {
                          setEditingCuenta({
                            ...editingCuenta,
                            codigo: padre.codigo + ".",
                            tipo: padre.tipo,
                            nivel: padre.nivel + 1,
                            categoria: padre.nivel === 1 ? "Grupo" : padre.nivel === 2 ? "Subgrupo" : "Detalle"
                          });
                        }
                      }
                    }}
                    className={`${inp} pl-10 w-full`}
                  >
                    <option value="">Seleccionar cuenta padre (opcional)</option>
                    {cuentas
                      .filter(c => c.nivel < 4 && c.activa)
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.codigo} - {c.nombre} (Nivel {c.nivel})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Fila 1: Código y Tipo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Código <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                    <input
                      type="text"
                      value={editingCuenta.codigo}
                      onChange={(e) => setEditingCuenta({ ...editingCuenta, codigo: e.target.value })}
                      className={`${inp} pl-10 w-full`}
                      placeholder="1.1.1.01"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                    <select
                      value={editingCuenta.tipo}
                      onChange={(e) => setEditingCuenta({ ...editingCuenta, tipo: e.target.value as any })}
                      className={`${inp} pl-10 w-full`}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Pasivo">Pasivo</option>
                      <option value="Patrimonio">Patrimonio</option>
                      <option value="Ingreso">Ingreso</option>
                      <option value="Gasto">Gasto</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fila 2: Nombre */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Nombre <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                  <input
                    type="text"
                    value={editingCuenta.nombre}
                    onChange={(e) => setEditingCuenta({ ...editingCuenta, nombre: e.target.value })}
                    className={`${inp} pl-10 w-full`}
                    placeholder="Ej: Caja General"
                  />
                </div>
              </div>

              {/* Fila 3: Nivel (solo lectura) */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Nivel
                </label>
                <div className="relative">
                  <BarChart3 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={editingCuenta.nivel}
                    readOnly
                    className={`${inp} pl-10 w-full bg-gray-100 dark:bg-white/5 cursor-not-allowed`}
                  />
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className={`flex items-center justify-end gap-3 px-6 py-5 ${isLight ? "bg-white" : "bg-[#0D1B2A]"} border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button
                onClick={() => setShowModalCuenta(false)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                  isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCuenta}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Plantilla */}
      {showModalPlantilla && editingPlantilla && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A]"} shadow-2xl`}>
            {/* Header con icono y título */}
            <div className={`flex items-center justify-between px-6 py-5 ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <h3 className={`font-bold text-lg ${txt}`}>
                  {editingPlantilla.id ? "Editar Plantilla de Asiento" : "Nueva Plantilla de Asiento"}
                </h3>
              </div>
              <button
                onClick={() => setShowModalPlantilla(false)}
                className={`p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-colors ${sub}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del formulario */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                    <input
                      type="text"
                      value={editingPlantilla.nombre}
                      onChange={(e) => setEditingPlantilla({ ...editingPlantilla, nombre: e.target.value })}
                      className={`${inp} pl-10 w-full`}
                      placeholder="Ej: Factura de venta al contado"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Módulo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Layers className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                    <select
                      value={editingPlantilla.modulo}
                      onChange={(e) => setEditingPlantilla({ ...editingPlantilla, modulo: e.target.value as any })}
                      className={`${inp} pl-10 w-full`}
                    >
                      <option value="Ventas">Ventas</option>
                      <option value="Compras">Compras</option>
                      <option value="Inventario">Inventario</option>
                      <option value="Nómina">Nómina</option>
                      <option value="Tesorería">Tesorería</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Descripción <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-3 w-4 h-4 ${sub}`} />
                  <textarea
                    value={editingPlantilla.descripcion}
                    onChange={(e) => setEditingPlantilla({ ...editingPlantilla, descripcion: e.target.value })}
                    className={`${inp} pl-10 w-full min-h-[80px] resize-none`}
                    placeholder="Describe cuándo se genera este asiento automáticamente..."
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Líneas del Asiento <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={addLineaPlantilla}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar línea
                  </button>
                </div>

                <div className={`border rounded-lg overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <table className="w-full">
                    <thead>
                      <tr className={`${isLight ? "bg-gray-50" : "bg-white/5"} border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>Cuenta</th>
                        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub} w-40`}>Tipo</th>
                        <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide ${sub} w-24`}>Acción</th>
                      </tr>
                    </thead>
                    <tbody className={isLight ? "bg-white" : ""}>
                      {editingPlantilla.lineas.map((linea, idx) => (
                        <tr key={idx} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                          <td className="px-4 py-3">
                            <select
                              value={linea.cuenta}
                              onChange={(e) => updateLineaPlantilla(idx, "cuenta", e.target.value)}
                              className={`${inp} w-full`}
                            >
                              <option value="">Seleccionar cuenta...</option>
                              {cuentas
                                .filter(c => c.activa && c.nivel >= 3)
                                .map(c => (
                                  <option key={c.id} value={c.codigo}>
                                    {c.codigo} - {c.nombre}
                                  </option>
                                ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={linea.tipo}
                              onChange={(e) => updateLineaPlantilla(idx, "tipo", e.target.value)}
                              className={`${inp} w-full`}
                            >
                              <option value="debe">Debe</option>
                              <option value="haber">Haber</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => removeLineaPlantilla(idx)}
                              className={`p-1.5 rounded-lg hover:bg-red-500/10 transition-colors ${sub} hover:text-red-500`}
                              title="Eliminar línea"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className={`flex items-center justify-end gap-3 px-6 py-5 ${isLight ? "bg-white" : "bg-[#0D1B2A]"} border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button
                onClick={() => setShowModalPlantilla(false)}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                  isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlantilla}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Preview Plantilla */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-3xl rounded-2xl overflow-hidden ${isLight ? "bg-white" : "bg-[#0D1B2A]"} shadow-2xl`}>
            {/* Header con icono y título */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${txt}`}>{showPreview.nombre}</h3>
                  <p className={`text-xs mt-0.5 ${sub}`}>{showPreview.descripcion}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(null)}
                className={`p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded transition-colors ${sub}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <div className={`border rounded-lg overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <table className="w-full">
                  <thead>
                    <tr className={`${isLight ? "bg-gray-50" : "bg-white/5"} border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>Cuenta</th>
                      <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide ${sub} w-40`}>Debe</th>
                      <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide ${sub} w-40`}>Haber</th>
                    </tr>
                  </thead>
                  <tbody className={isLight ? "bg-white" : ""}>
                    {showPreview.lineas.map((linea, idx) => (
                      <tr key={idx} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                        <td className={`px-6 py-4 text-sm ${txt}`}>
                          {getCuentaNombre(linea.cuenta)}
                        </td>
                        <td className={`px-6 py-4 text-right text-sm font-mono ${linea.tipo === "debe" ? txt : sub}`}>
                          {linea.tipo === "debe" ? "XXX.XX" : ""}
                        </td>
                        <td className={`px-6 py-4 text-right text-sm font-mono ${linea.tipo === "haber" ? txt : sub}`}>
                          {linea.tipo === "haber" ? "XXX.XX" : ""}
                        </td>
                      </tr>
                    ))}
                    <tr className={`${isLight ? "bg-gray-100" : "bg-white/5"}`}>
                      <td className={`px-6 py-4 text-sm font-semibold ${txt}`}>TOTALES</td>
                      <td className={`px-6 py-4 text-right text-sm font-mono font-semibold ${txt}`}>XXX.XX</td>
                      <td className={`px-6 py-4 text-right text-sm font-mono font-semibold ${txt}`}>XXX.XX</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}