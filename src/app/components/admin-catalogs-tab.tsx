import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderTree,
  Folder,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  AlertCircle,
  Filter,
  Eye,
  EyeOff,
  Save,
  FileText,
  Layers,
  Package,
  ShoppingCart,
  TrendingUp,
  Calculator,
  Wallet,
  Users,
  FileText as FileTextIcon,
  BarChart3,
  Settings,
  Home,
  Briefcase,
  Tag,
  Truck,
  DollarSign,
  CreditCard,
  PieChart,
  Calendar,
  Clock,
  Target,
  Award,
  Activity,
  Globe,
  MapPin,
  Shield,
  Monitor,
  Smartphone,
  Laptop,
} from "lucide-react";
import { toast } from "sonner";
import { catalogosIniciales, type Catalogo } from "../data/catalogs-data";
import { IconPicker } from "./icon-picker";

interface AdminCatalogsTabProps {
  theme: string;
  isLight: boolean;
}

export function AdminCatalogsTab({ theme, isLight }: AdminCatalogsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNuevoCatalogo, setShowNuevoCatalogo] = useState(false);
  const [showEditarCatalogo, setShowEditarCatalogo] = useState(false);
  const [catalogoSeleccionado, setCatalogoSeleccionado] = useState<Catalogo | null>(null);
  // Inicialmente todos contraídos
  const [expandedCatalogos, setExpandedCatalogos] = useState<Set<string>>(new Set());
  const [filterActivo, setFilterActivo] = useState<"all" | "activo" | "inactivo">("all");
  const [errors, setErrors] = useState<{ codigo?: string; nombre?: string }>({});
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [esSubcatalogo, setEsSubcatalogo] = useState(false);

  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    padreId: "",
    activo: true,
    // Campos para módulos
    orden: 0,
    icono: "",
    color: "#E8692E",
  });

  const [catalogos, setCatalogos] = useState<Catalogo[]>(catalogosIniciales);

  // Lista de iconos disponibles
  const availableIcons = [
    { name: "ShoppingCart", Icon: ShoppingCart },
    { name: "TrendingUp", Icon: TrendingUp },
    { name: "Package", Icon: Package },
    { name: "Calculator", Icon: Calculator },
    { name: "Wallet", Icon: Wallet },
    { name: "Users", Icon: Users },
    { name: "FileText", Icon: FileTextIcon },
    { name: "BarChart3", Icon: BarChart3 },
    { name: "Settings", Icon: Settings },
    { name: "Home", Icon: Home },
    { name: "Briefcase", Icon: Briefcase },
    { name: "Tag", Icon: Tag },
    { name: "Truck", Icon: Truck },
    { name: "DollarSign", Icon: DollarSign },
    { name: "CreditCard", Icon: CreditCard },
    { name: "PieChart", Icon: PieChart },
    { name: "Calendar", Icon: Calendar },
    { name: "Clock", Icon: Clock },
    { name: "Target", Icon: Target },
    { name: "Award", Icon: Award },
    { name: "Activity", Icon: Activity },
    { name: "Globe", Icon: Globe },
    { name: "MapPin", Icon: MapPin },
    { name: "Shield", Icon: Shield },
    { name: "Monitor", Icon: Monitor },
    { name: "Smartphone", Icon: Smartphone },
    { name: "Laptop", Icon: Laptop },
    { name: "Layers", Icon: Layers },
    { name: "FolderTree", Icon: FolderTree },
    { name: "Folder", Icon: Folder },
  ];

  const filteredIcons = availableIcons.filter((icon) =>
    icon.name.toLowerCase().includes(iconSearchTerm.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find((i) => i.name === iconName);
    return icon ? icon.Icon : Package;
  };

  // Auto-expandir catálogos cuando se busca
  const autoExpandSearch = (cats: Catalogo[], term: string) => {
    if (!term) {
      setExpandedCatalogos(new Set());
      return;
    }
    const newExpanded = new Set<string>();
    const searchInCatalog = (cat: Catalogo) => {
      // Si el catálogo padre coincide con la búsqueda y tiene hijos, expandirlo
      const padreCoincide = 
        cat.nombre.toLowerCase().includes(term.toLowerCase()) ||
        cat.codigo.toLowerCase().includes(term.toLowerCase());
      
      if (cat.hijos && cat.hijos.length > 0) {
        // Si el padre coincide, expandir
        if (padreCoincide) {
          newExpanded.add(cat.id);
        } else {
          // Si algún hijo coincide, también expandir el padre
          const hasMatch = cat.hijos.some(
            (hijo) =>
              hijo.nombre.toLowerCase().includes(term.toLowerCase()) ||
              hijo.codigo.toLowerCase().includes(term.toLowerCase())
          );
          if (hasMatch) {
            newExpanded.add(cat.id);
          }
        }
        cat.hijos.forEach(searchInCatalog);
      }
    };
    cats.forEach(searchInCatalog);
    setExpandedCatalogos(newExpanded);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedCatalogos);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCatalogos(newExpanded);
  };

  const expandirTodos = () => {
    const allIds = new Set<string>();
    const collectIds = (cats: Catalogo[]) => {
      cats.forEach((cat) => {
        if (cat.hijos && cat.hijos.length > 0) {
          allIds.add(cat.id);
          collectIds(cat.hijos);
        }
      });
    };
    collectIds(catalogos);
    setExpandedCatalogos(allIds);
  };

  const contraerTodos = () => {
    setExpandedCatalogos(new Set());
  };

  const validateForm = (): boolean => {
    const newErrors: { codigo?: string; nombre?: string } = {};
    
    if (!formData.codigo.trim()) {
      newErrors.codigo = "El código es obligatorio";
    } else if (formData.codigo.length < 2) {
      newErrors.codigo = "El código debe tener al menos 2 caracteres";
    }
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNuevoCatalogo = () => {
    if (!validateForm()) {
      toast.error("Formulario incompleto", {
        description: "Por favor, corrija los errores antes de continuar",
      });
      return;
    }

    const nuevoCatalogo: Catalogo = {
      id: Date.now().toString(),
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      nivel: formData.padreId ? 2 : 1,
      padreId: formData.padreId || null,
      activo: formData.activo,
      // Solo agregar orden, icono y color si es subcatálogo
      ...(formData.padreId && {
        orden: formData.orden,
        icono: formData.icono,
        color: formData.color,
      }),
    };

    if (!formData.padreId) {
      setCatalogos([...catalogos, nuevoCatalogo]);
    } else {
      const agregarHijo = (cats: Catalogo[]): Catalogo[] => {
        return cats.map((cat) => {
          if (cat.id === formData.padreId) {
            return {
              ...cat,
              hijos: [...(cat.hijos || []), nuevoCatalogo],
            };
          }
          if (cat.hijos) {
            return { ...cat, hijos: agregarHijo(cat.hijos) };
          }
          return cat;
        });
      };
      setCatalogos(agregarHijo(catalogos));
    }

    toast.success("Catálogo creado exitosamente", {
      description: `${formData.codigo} - ${formData.nombre}`,
    });
    resetForm();
    setShowNuevoCatalogo(false);
  };

  const handleEditarCatalogo = () => {
    if (!catalogoSeleccionado || !validateForm()) {
      return;
    }

    const actualizarCatalogo = (cats: Catalogo[]): Catalogo[] => {
      return cats.map((cat) => {
        if (cat.id === catalogoSeleccionado.id) {
          return {
            ...cat,
            codigo: formData.codigo.trim(),
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
            activo: formData.activo,
            // Solo actualizar orden, icono y color si es subcatálogo
            ...(cat.padreId && {
              orden: formData.orden,
              icono: formData.icono,
              color: formData.color,
            }),
          };
        }
        if (cat.hijos) {
          return { ...cat, hijos: actualizarCatalogo(cat.hijos) };
        }
        return cat;
      });
    };

    setCatalogos(actualizarCatalogo(catalogos));
    toast.success("Catálogo actualizado exitosamente");
    setShowEditarCatalogo(false);
    setCatalogoSeleccionado(null);
    resetForm();
  };

  const handleEliminarCatalogo = (catalogo: Catalogo) => {
    if (catalogo.hijos && catalogo.hijos.length > 0) {
      toast.error("No se puede eliminar", {
        description: "El catálogo tiene subcatálogos asociados",
      });
      return;
    }

    const eliminarCatalogo = (cats: Catalogo[]): Catalogo[] => {
      return cats
        .filter((cat) => cat.id !== catalogo.id)
        .map((cat) => ({
          ...cat,
          hijos: cat.hijos ? eliminarCatalogo(cat.hijos) : undefined,
        }));
    };

    setCatalogos(eliminarCatalogo(catalogos));
    toast.success("Catálogo eliminado");
  };

  const abrirModalEditar = (catalogo: Catalogo) => {
    setCatalogoSeleccionado(catalogo);
    setFormData({
      codigo: catalogo.codigo,
      nombre: catalogo.nombre,
      descripcion: catalogo.descripcion,
      padreId: catalogo.padreId || "",
      activo: catalogo.activo,
      orden: catalogo.orden || 0,
      icono: catalogo.icono || "",
      color: catalogo.color || "#E8692E",
    });
    setErrors({});
    setShowEditarCatalogo(true);
  };

  const resetForm = () => {
    setFormData({
      codigo: "",
      nombre: "",
      descripcion: "",
      padreId: "",
      activo: true,
      // Campos para módulos
      orden: 0,
      icono: "",
      color: "#E8692E",
    });
    setErrors({});
    setEsSubcatalogo(false);
  };

  const obtenerCatalogosPlanos = (cats: Catalogo[], nivel = 0): Catalogo[] => {
    let result: Catalogo[] = [];
    cats.forEach((cat) => {
      result.push({ ...cat, nivel });
      if (cat.hijos) {
        result = result.concat(obtenerCatalogosPlanos(cat.hijos, nivel + 1));
      }
    });
    return result;
  };

  const catalogosPlanos = obtenerCatalogosPlanos(catalogos);

  const renderCatalogo = (catalogo: Catalogo, nivel = 0) => {
    const isExpanded = expandedCatalogos.has(catalogo.id);
    const hasChildren = catalogo.hijos && catalogo.hijos.length > 0;

    // Filtro por estado activo/inactivo
    if (filterActivo === "activo" && !catalogo.activo) return null;
    if (filterActivo === "inactivo" && catalogo.activo) return null;

    // Solo buscar en catálogos padre (nivel 0)
    if (searchTerm && nivel === 0) {
      const catalogoCoincide = 
        catalogo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        catalogo.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Si es nivel 0 y no coincide, no mostrarlo
      if (!catalogoCoincide) {
        return null;
      }
    }

    // Si es hijo (nivel > 0), solo mostrarlo si no hay búsqueda activa o si el padre ya pasó el filtro
    if (searchTerm && nivel > 0) {
      // Los hijos siempre se muestran cuando el padre coincide
      // No filtrar hijos individualmente
    }

    const cardBg = isLight ? "bg-white" : "bg-secondary";
    const borderColor = isLight ? "border-gray-100" : "border-white/5";
    const hoverBg = isLight ? "hover:bg-gray-50/50" : "hover:bg-white/[0.02]";

    return (
      <div key={catalogo.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 border-b transition-all ${borderColor} ${hoverBg}`}
          style={{ paddingLeft: `${nivel * 2 + 0.75}rem` }}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleExpand(catalogo.id)}
              className={`p-1 rounded transition-all ${ 
                isLight ? "hover:bg-gray-100" : "hover:bg-white/10"
              }`}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-500" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          <div
            className={`p-1.5 rounded ${
              nivel === 0
                ? "bg-primary/10 border border-primary/20"
                : "bg-gray-500/5 border border-gray-500/10"
            }`}
          >
            {nivel === 0 ? (
              <FolderTree className="w-3 h-3 text-primary" />
            ) : (
              <Folder className="w-3 h-3 text-gray-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold font-mono ${
                  isLight
                    ? "bg-gray-100 text-gray-700"
                    : "bg-white/5 text-gray-300"
                }`}
              >
                {catalogo.codigo}
              </span>
              <span
                className={`text-sm font-medium ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {catalogo.nombre}
              </span>
              {catalogo.activo ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-medium">
                  <div className="w-1 h-1 bg-red-500 rounded-full" />
                </span>
              )}
              {hasChildren && (
                <span
                  className={`text-[11px] ${ 
                    isLight ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  ({catalogo.hijos?.length})
                </span>
              )}
              {/* Mostrar orden, icono y color si existen */}
              {catalogo.orden !== undefined && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-medium">
                  #{catalogo.orden}
                </span>
              )}
              {catalogo.icono && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-medium">
                  {catalogo.icono}
                </span>
              )}
              {catalogo.color && (
                <span 
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium"
                  style={{ 
                    backgroundColor: `${catalogo.color}15`, 
                    borderColor: `${catalogo.color}30`,
                    color: catalogo.color
                  }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: catalogo.color }} />
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => abrirModalEditar(catalogo)}
              className={`p-1.5 rounded transition-all border ${
                isLight
                  ? "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 text-yellow-600"
                  : "border-white/10 hover:border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400"
              }`}
              title="Editar"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleEliminarCatalogo(catalogo)}
              className={`p-1.5 rounded transition-all border ${
                isLight
                  ? "border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600"
                  : "border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-red-400"
              }`}
              title="Eliminar"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className={`${isLight ? "bg-gray-50/30" : "bg-black/10"}`}>
            {catalogo.hijos?.map((hijo) => renderCatalogo(hijo, nivel + 1))}
          </div>
        )}
      </div>
    );
  };

  const totalCatalogos = catalogosPlanos.length;
  const catalogosActivos = catalogosPlanos.filter((c) => c.activo).length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-lg font-bold ${ 
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Gestión de Catálogos
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {totalCatalogos} totales · {catalogosActivos} activos
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowNuevoCatalogo(true);
          }}
          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 shadow-lg shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5" />
          Nuevo
        </button>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar catálogo..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              autoExpandSearch(catalogos, e.target.value);
            }}
            className={`w-full pl-8 pr-3 py-1.5 border rounded-lg text-sm transition-all ${
              isLight
                ? "bg-white border-gray-200 text-gray-900 focus:border-primary/50 focus:ring-1 focus:ring-primary/10"
                : "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/10"
            }`}
          />
        </div>
        
        <select
          value={filterActivo}
          onChange={(e) => setFilterActivo(e.target.value as any)}
          className={`px-2.5 py-1.5 border rounded-lg text-sm transition-all ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="all">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </select>
        
        <button
          onClick={expandirTodos}
          className={`p-1.5 border rounded-lg text-sm transition-all ${
            isLight
              ? "border-gray-200 hover:bg-gray-50 text-gray-700"
              : "border-white/10 hover:bg-white/5 text-gray-300"
          }`}
          title="Expandir todos"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        
        <button
          onClick={contraerTodos}
          className={`p-1.5 border rounded-lg text-sm transition-all ${
            isLight
              ? "border-gray-200 hover:bg-gray-50 text-gray-700"
              : "border-white/10 hover:bg-white/5 text-gray-300"
          }`}
          title="Contraer todos"
        >
          <EyeOff className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Árbol de catálogos */}
      <div
        className={`border rounded-lg overflow-hidden ${
          isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
        }`}
      >
        <div className="max-h-[calc(100vh-240px)] overflow-y-auto">
          {catalogos.map((catalogo) => renderCatalogo(catalogo))}
        </div>
      </div>

      {/* Modal Nuevo Catálogo */}
      {showNuevoCatalogo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
              isLight ? "bg-white" : "bg-card"
            }`}
          >
            {/* Header del modal */}
            <div
              className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between ${
                isLight
                  ? "bg-white border-gray-200"
                  : "bg-card border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3
                    className={`font-bold text-lg ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Crear Nuevo Catálogo
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Complete los campos para agregar un catálogo al sistema
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowNuevoCatalogo(false);
                  resetForm();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-5">
              {/* Fila 1: Código y Nombre */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`text-sm font-semibold mb-2 block ${
                      isLight ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Código del Catálogo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        codigo: e.target.value.toUpperCase(),
                      });
                      if (errors.codigo) setErrors({ ...errors, codigo: undefined });
                    }}
                    placeholder="Ej: NUEVO-CATALOGO"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm font-mono transition-all ${
                      errors.codigo
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : isLight
                        ? "bg-white border-gray-200 text-gray-900 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                        : "bg-white/5 border-white/10 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                    }`}
                  />
                  {errors.codigo && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.codigo}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`text-sm font-semibold mb-2 block ${
                      isLight ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Nombre del Catálogo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => {
                      setFormData({ ...formData, nombre: e.target.value });
                      if (errors.nombre) setErrors({ ...errors, nombre: undefined });
                    }}
                    placeholder="Ej: Clasificación de Nuevos Tipos"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm transition-all ${
                      errors.nombre
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : isLight
                        ? "bg-white border-gray-200 text-gray-900 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                        : "bg-white/5 border-white/10 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                    }`}
                  />
                  {errors.nombre && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.nombre}
                    </p>
                  )}
                </div>
              </div>

              {/* Fila 2: Descripción */}
              <div>
                <label
                  className={`text-sm font-semibold mb-2 block ${
                    isLight ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Descripción (Opcional)
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  placeholder="Descripción detallada del propósito y uso del catálogo..."
                  rows={2}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm transition-all resize-none ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                      : "bg-white/5 border-white/10 text-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  }`}
                />
              </div>

              {/* Checkbox para indicar si es subcatálogo */}
              <div
                className={`p-4 rounded-lg border ${
                  isLight
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={esSubcatalogo}
                    onChange={(e) => {
                      setEsSubcatalogo(e.target.checked);
                      if (!e.target.checked) {
                        setFormData({ ...formData, padreId: "" });
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >Este es un subcatálogo</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Active esta opción si este catálogo pertenece a un catálogo padre
                    </p>
                  </div>
                </label>
              </div>

              {/* Selector de catálogo padre - Siempre visible, bloqueado si no es subcatálogo */}
              <div>
                <label
                  className={`text-sm font-semibold mb-1.5 block ${
                    isLight ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Seleccionar Catálogo Padre {esSubcatalogo && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={formData.padreId}
                  onChange={(e) =>
                    setFormData({ ...formData, padreId: e.target.value })
                  }
                  disabled={!esSubcatalogo}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm transition-all ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                      : "bg-white/5 border-white/10 text-white disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
                  }`}
                >
                  <option value="">Seleccione un catálogo padre...</option>
                  {catalogosPlanos
                    .filter((cat) => !cat.padreId) // Solo catálogos de nivel raíz
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.codigo} - {cat.nombre}
                      </option>
                    ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Solo se muestran catálogos principales (padres)
                </p>
              </div>

              {/* Configuración de Subcatálogo - Siempre visible, bloqueada si no es subcatálogo */}
              <div className={`p-3 rounded-lg border transition-all ${
                !esSubcatalogo
                  ? isLight 
                    ? "bg-gray-100 border-gray-200 opacity-60"
                    : "bg-white/5 border-white/10 opacity-50"
                  : isLight
                    ? "bg-blue-50 border-blue-200"
                    : "bg-blue-500/5 border-blue-500/20"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1 bg-blue-500/10 rounded">
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className={`text-xs font-bold ${
                    isLight ? "text-blue-900" : "text-blue-400"
                  }`}>
                    Configuración de Subcatálogo
                  </h4>
                </div>

                <div className="space-y-3">
                  {/* Fila 1: Orden y Color */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Orden */}
                    <div>
                      <label
                        className={`text-xs font-semibold mb-1.5 block ${
                          isLight ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        Orden
                      </label>
                      <input
                        type="number"
                        value={formData.orden}
                        onChange={(e) =>
                          setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })
                        }
                        disabled={!esSubcatalogo}
                        min="0"
                        placeholder="0"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm transition-all ${
                          isLight
                            ? "bg-white border-gray-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                            : "bg-white/5 border-white/10 text-white disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
                        }`}
                      />
                      
                    </div>

                    {/* Color */}
                    <div>
                      <label
                        className={`text-xs font-semibold mb-1.5 block ${
                          isLight ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.color}
                          onChange={(e) =>
                            setFormData({ ...formData, color: e.target.value })
                          }
                          disabled={!esSubcatalogo}
                          className="w-10 h-8 rounded border border-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) =>
                            setFormData({ ...formData, color: e.target.value })
                          }
                          disabled={!esSubcatalogo}
                          placeholder="#E8692E"
                          className={`flex-1 px-2 py-1.5 border rounded-lg text-xs font-mono transition-all ${
                            isLight
                              ? "bg-white border-gray-200 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                              : "bg-white/5 border-white/10 text-white disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
                          }`}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5"></p>
                    </div>
                  </div>

                  {/* Fila 2: Icono (fila completa) */}
                  <div>
                    <label
                      className={`text-xs font-semibold mb-1.5 block ${
                        isLight ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Icono
                    </label>
                    <div className={!esSubcatalogo ? "pointer-events-none opacity-50" : ""}>
                      <IconPicker
                        value={formData.icono}
                        onChange={(iconName) =>
                          setFormData({ ...formData, icono: iconName })
                        }
                        isLight={isLight}
                      />
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* Fila 4: Estado */}
              <div
                className={`p-4 rounded-lg border ${
                  isLight
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) =>
                      setFormData({ ...formData, activo: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Catálogo activo
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Los catálogos inactivos no estarán disponibles para su uso
                      en el sistema
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer del modal */}
            <div
              className={`sticky bottom-0 px-6 py-4 border-t flex items-center justify-between gap-3 ${
                isLight
                  ? "bg-gray-50 border-gray-200"
                  : "bg-card/95 border-white/10"
              }`}
            >
              <p className="text-xs text-gray-400">
                Los campos marcados con <span className="text-red-500">*</span> son
                obligatorios
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowNuevoCatalogo(false);
                    resetForm();
                  }}
                  className={`px-5 py-2.5 border rounded-lg text-sm font-semibold transition-all ${
                    isLight
                      ? "border-gray-200 hover:bg-gray-100 text-gray-700"
                      : "border-white/10 hover:bg-white/5 text-gray-300"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleNuevoCatalogo}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <Save className="w-4 h-4" />
                  Crear Catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Catálogo */}
      {showEditarCatalogo && catalogoSeleccionado && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto ${
              isLight ? "bg-white" : "bg-card"
            }`}
          >
            {/* Header del modal */}
            <div
              className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between ${
                isLight
                  ? "bg-white border-gray-200"
                  : "bg-card border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Edit className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3
                    className={`font-bold text-lg ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Editar Catálogo
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Modificando: {catalogoSeleccionado.codigo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditarCatalogo(false);
                  resetForm();
                }}
                className={`p-2 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`text-sm font-semibold mb-2 block ${
                      isLight ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Código <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        codigo: e.target.value.toUpperCase(),
                      });
                      if (errors.codigo) setErrors({ ...errors, codigo: undefined });
                    }}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono ${
                      errors.codigo
                        ? "border-red-500"
                        : isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                  {errors.codigo && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.codigo}</p>
                  )}
                </div>

                <div>
                  <label
                    className={`text-sm font-semibold mb-2 block ${
                      isLight ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => {
                      setFormData({ ...formData, nombre: e.target.value });
                      if (errors.nombre) setErrors({ ...errors, nombre: undefined });
                    }}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm ${
                      errors.nombre
                        ? "border-red-500"
                        : isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                  {errors.nombre && (
                    <p className="text-xs text-red-500 mt-1.5">{errors.nombre}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  className={`text-sm font-semibold mb-2 block ${
                    isLight ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  rows={4}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm resize-none ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              {/* Campos adicionales para subcatálogos */}
              {catalogoSeleccionado.padreId && (
                <div className={`p-3 rounded-lg border ${
                  isLight
                    ? "bg-blue-50 border-blue-200"
                    : "bg-blue-500/5 border-blue-500/20"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 bg-blue-500/10 rounded">
                      <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className={`text-xs font-bold ${
                      isLight ? "text-blue-900" : "text-blue-400"
                    }`}>
                      Configuración de Subcatálogo
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {/* Fila 1: Orden y Color */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Orden */}
                      <div>
                        <label
                          className={`text-xs font-semibold mb-1.5 block ${
                            isLight ? "text-gray-700" : "text-gray-300"
                          }`}
                        >
                          Orden
                        </label>
                        <input
                          type="number"
                          value={formData.orden}
                          onChange={(e) =>
                            setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })
                          }
                          min="0"
                          placeholder="0"
                          className={`w-full px-3 py-1.5 border rounded-lg text-sm transition-all ${
                            isLight
                              ? "bg-white border-gray-200 text-gray-900"
                              : "bg-white/5 border-white/10 text-white"
                          }`}
                        />
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Posición en el menú
                        </p>
                      </div>

                      {/* Color */}
                      <div>
                        <label
                          className={`text-xs font-semibold mb-1.5 block ${
                            isLight ? "text-gray-700" : "text-gray-300"
                          }`}
                        >
                          Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={formData.color}
                            onChange={(e) =>
                              setFormData({ ...formData, color: e.target.value })
                            }
                            className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.color}
                            onChange={(e) =>
                              setFormData({ ...formData, color: e.target.value })
                            }
                            placeholder="#E8692E"
                            className={`flex-1 px-2 py-1.5 border rounded-lg text-xs font-mono transition-all ${
                              isLight
                                ? "bg-white border-gray-200 text-gray-900"
                                : "bg-white/5 border-white/10 text-white"
                            }`}
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Color hexadecimal
                        </p>
                      </div>
                    </div>

                    {/* Fila 2: Icono (fila completa) */}
                    <div>
                      <label
                        className={`text-xs font-semibold mb-1.5 block ${
                          isLight ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        Icono
                      </label>
                      <IconPicker
                        value={formData.icono}
                        onChange={(iconName) =>
                          setFormData({ ...formData, icono: iconName })
                        }
                        isLight={isLight}
                      />
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Icono del subcatálogo
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`p-4 rounded-lg border ${
                  isLight
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) =>
                      setFormData({ ...formData, activo: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Catálogo activo
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Los catálogos inactivos no estarán disponibles en el sistema
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`sticky bottom-0 px-6 py-4 border-t flex justify-end gap-3 ${
                isLight
                  ? "bg-gray-50 border-gray-200"
                  : "bg-card/95 border-white/10"
              }`}
            >
              <button
                onClick={() => {
                  setShowEditarCatalogo(false);
                  resetForm();
                }}
                className={`px-5 py-2.5 border rounded-lg text-sm font-semibold transition-all ${
                  isLight
                    ? "border-gray-200 hover:bg-gray-100 text-gray-700"
                    : "border-white/10 hover:bg-white/5 text-gray-300"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleEditarCatalogo}
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}