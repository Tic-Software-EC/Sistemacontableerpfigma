import { useState } from "react";
import {
  Ruler,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Package,
  Scale,
  Activity,
} from "lucide-react";

interface Unit {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
  baseUnit: string | null;
  conversionFactor: number;
  description: string;
  active: boolean;
}

const unitTypes = [
  { value: "length", label: "Longitud", icon: "📏" },
  { value: "weight", label: "Peso", icon: "⚖️" },
  { value: "volume", label: "Volumen", icon: "🧊" },
  { value: "area", label: "Área", icon: "📐" },
  { value: "quantity", label: "Cantidad", icon: "🔢" },
  { value: "time", label: "Tiempo", icon: "⏱️" },
];

export function UnitsContent() {
  const [units, setUnits] = useState<Unit[]>([
    // Unidades de longitud
    {
      id: "1",
      name: "Metro",
      abbreviation: "m",
      type: "length",
      baseUnit: null,
      conversionFactor: 1,
      description: "Unidad base de longitud",
      active: true,
    },
    {
      id: "2",
      name: "Centímetro",
      abbreviation: "cm",
      type: "length",
      baseUnit: "1",
      conversionFactor: 0.01,
      description: "Centésima parte del metro",
      active: true,
    },
    {
      id: "3",
      name: "Milímetro",
      abbreviation: "mm",
      type: "length",
      baseUnit: "1",
      conversionFactor: 0.001,
      description: "Milésima parte del metro",
      active: true,
    },
    {
      id: "4",
      name: "Pulgada",
      abbreviation: "in",
      type: "length",
      baseUnit: "1",
      conversionFactor: 0.0254,
      description: "Unidad de longitud anglosajona",
      active: true,
    },
    // Unidades de peso
    {
      id: "5",
      name: "Kilogramo",
      abbreviation: "kg",
      type: "weight",
      baseUnit: null,
      conversionFactor: 1,
      description: "Unidad base de peso",
      active: true,
    },
    {
      id: "6",
      name: "Gramo",
      abbreviation: "g",
      type: "weight",
      baseUnit: "5",
      conversionFactor: 0.001,
      description: "Milésima parte del kilogramo",
      active: true,
    },
    {
      id: "7",
      name: "Libra",
      abbreviation: "lb",
      type: "weight",
      baseUnit: "5",
      conversionFactor: 0.453592,
      description: "Unidad de peso anglosajona",
      active: true,
    },
    {
      id: "8",
      name: "Onza",
      abbreviation: "oz",
      type: "weight",
      baseUnit: "5",
      conversionFactor: 0.0283495,
      description: "Decimosexta parte de la libra",
      active: true,
    },
    // Unidades de volumen
    {
      id: "9",
      name: "Litro",
      abbreviation: "L",
      type: "volume",
      baseUnit: null,
      conversionFactor: 1,
      description: "Unidad base de volumen",
      active: true,
    },
    {
      id: "10",
      name: "Mililitro",
      abbreviation: "mL",
      type: "volume",
      baseUnit: "9",
      conversionFactor: 0.001,
      description: "Milésima parte del litro",
      active: true,
    },
    {
      id: "11",
      name: "Galón",
      abbreviation: "gal",
      type: "volume",
      baseUnit: "9",
      conversionFactor: 3.78541,
      description: "Unidad de volumen anglosajona",
      active: true,
    },
    // Unidades de cantidad
    {
      id: "12",
      name: "Unidad",
      abbreviation: "un",
      type: "quantity",
      baseUnit: null,
      conversionFactor: 1,
      description: "Unidad individual",
      active: true,
    },
    {
      id: "13",
      name: "Docena",
      abbreviation: "doc",
      type: "quantity",
      baseUnit: "12",
      conversionFactor: 12,
      description: "Conjunto de 12 unidades",
      active: true,
    },
    {
      id: "14",
      name: "Caja",
      abbreviation: "cja",
      type: "quantity",
      baseUnit: "12",
      conversionFactor: 1,
      description: "Contenedor de productos",
      active: true,
    },
    {
      id: "15",
      name: "Paquete",
      abbreviation: "paq",
      type: "quantity",
      baseUnit: "12",
      conversionFactor: 1,
      description: "Conjunto de unidades empaquetadas",
      active: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    type: "quantity",
    baseUnit: "",
    conversionFactor: 1,
    description: "",
    active: true,
  });

  const handleOpenModal = (unit?: Unit) => {
    if (unit) {
      setEditingUnit(unit);
      setFormData({
        name: unit.name,
        abbreviation: unit.abbreviation,
        type: unit.type,
        baseUnit: unit.baseUnit || "",
        conversionFactor: unit.conversionFactor,
        description: unit.description,
        active: unit.active,
      });
    } else {
      setEditingUnit(null);
      setFormData({
        name: "",
        abbreviation: "",
        type: "quantity",
        baseUnit: "",
        conversionFactor: 1,
        description: "",
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUnit(null);
    setFormData({
      name: "",
      abbreviation: "",
      type: "quantity",
      baseUnit: "",
      conversionFactor: 1,
      description: "",
      active: true,
    });
  };

  const handleSaveUnit = () => {
    if (!formData.name.trim()) {
      alert("El nombre de la unidad es obligatorio");
      return;
    }

    if (!formData.abbreviation.trim()) {
      alert("La abreviatura es obligatoria");
      return;
    }

    if (formData.baseUnit && formData.conversionFactor <= 0) {
      alert("El factor de conversión debe ser mayor a 0");
      return;
    }

    if (editingUnit) {
      setUnits(
        units.map((unit) =>
          unit.id === editingUnit.id
            ? {
                ...unit,
                name: formData.name,
                abbreviation: formData.abbreviation,
                type: formData.type,
                baseUnit: formData.baseUnit || null,
                conversionFactor: formData.conversionFactor,
                description: formData.description,
                active: formData.active,
              }
            : unit
        )
      );
      alert("Unidad actualizada exitosamente");
    } else {
      const newUnit: Unit = {
        id: Date.now().toString(),
        name: formData.name,
        abbreviation: formData.abbreviation,
        type: formData.type,
        baseUnit: formData.baseUnit || null,
        conversionFactor: formData.conversionFactor,
        description: formData.description,
        active: formData.active,
      };
      setUnits([...units, newUnit]);
      alert("Unidad creada exitosamente");
    }

    handleCloseModal();
  };

  const handleDeleteUnit = (id: string) => {
    const unit = units.find((u) => u.id === id);
    const hasDependents = units.some((u) => u.baseUnit === id);

    if (hasDependents) {
      alert(
        "No puedes eliminar una unidad base que tiene otras unidades dependientes"
      );
      return;
    }

    if (confirm(`¿Estás seguro de eliminar la unidad "${unit?.name}"?`)) {
      setUnits(units.filter((u) => u.id !== id));
      alert("Unidad eliminada exitosamente");
    }
  };

  const getBaseUnits = (type: string) => {
    return units.filter((u) => u.type === type && u.baseUnit === null);
  };

  const getTypeIcon = (type: string) => {
    return unitTypes.find((t) => t.value === type)?.icon || "📦";
  };

  const getTypeLabel = (type: string) => {
    return unitTypes.find((t) => t.value === type)?.label || type;
  };

  const getBaseUnitName = (baseUnitId: string | null) => {
    if (!baseUnitId) return "Unidad base";
    const baseUnit = units.find((u) => u.id === baseUnitId);
    return baseUnit ? baseUnit.abbreviation : "N/A";
  };

  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.abbreviation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || unit.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const groupedUnits = unitTypes.map((type) => ({
    type: type.value,
    label: type.label,
    icon: type.icon,
    units: filteredUnits.filter((u) => u.type === type.value),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Ruler className="w-8 h-8 text-primary" />
            Unidades de Medida
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona las unidades de medida para tus productos
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 justify-center whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Nueva Unidad
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0a1628] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Ruler className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Unidades</p>
              <p className="text-white font-bold text-2xl">{units.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a1628] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Tipos</p>
              <p className="text-white font-bold text-2xl">
                {
                  unitTypes.filter((t) =>
                    units.some((u) => u.type === t.value)
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a1628] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Activas</p>
              <p className="text-white font-bold text-2xl">
                {units.filter((u) => u.active).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a1628] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Bases</p>
              <p className="text-white font-bold text-2xl">
                {units.filter((u) => u.baseUnit === null).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Búsqueda */}
        <div className="bg-[#0f1825]/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-primary" />
            <span className="text-white font-medium">Buscar unidad</span>
          </div>
          <input
            type="text"
            placeholder="Nombre o abreviatura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0a1628] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        {/* Filtro por tipo */}
        <div className="bg-[#0f1825]/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-white font-medium">Filtrar por tipo</span>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0a1628] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          >
            <option value="all">Todos los tipos</option>
            {unitTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de unidades agrupadas por tipo */}
      <div className="space-y-4">
        {groupedUnits.map(
          (group) =>
            group.units.length > 0 && (
              <div key={group.type} className="space-y-3">
                {/* Header del grupo */}
                <div className="flex items-center gap-3 px-2">
                  <div className="text-2xl">{group.icon}</div>
                  <h3 className="text-white font-semibold text-lg">
                    {group.label}
                  </h3>
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-gray-500 text-sm">
                    {group.units.length} unidades
                  </span>
                </div>

                {/* Unidades del grupo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.units.map((unit) => (
                    <div
                      key={unit.id}
                      className="bg-[#0a1628] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white font-semibold text-lg">
                              {unit.name}
                            </h4>
                            <span className="px-2.5 py-1 bg-primary/20 text-primary text-xs font-mono rounded-md">
                              {unit.abbreviation}
                            </span>
                            {!unit.active && (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                Inactiva
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-3">
                            {unit.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-gray-500">
                              <span className="text-gray-400 font-medium">
                                Base:
                              </span>{" "}
                              {getBaseUnitName(unit.baseUnit)}
                            </span>
                            {unit.baseUnit && (
                              <span className="text-gray-500">
                                <span className="text-gray-400 font-medium">
                                  Factor:
                                </span>{" "}
                                {unit.conversionFactor}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => handleOpenModal(unit)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUnit(unit.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        {filteredUnits.length === 0 && (
          <div className="bg-[#0a1628] border border-white/5 rounded-xl p-12 text-center">
            <Ruler className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No se encontraron unidades de medida
            </p>
          </div>
        )}
      </div>

      {/* Modal de crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#0a1628] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-[#0a1628] border-b border-white/10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">
                    {editingUnit ? "Editar Unidad" : "Nueva Unidad"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {editingUnit
                      ? "Actualiza los datos de la unidad de medida"
                      : "Completa la información de la nueva unidad"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-5">
              {/* Nombre y abreviatura */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: Kilogramo"
                    className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Abreviatura *
                  </label>
                  <input
                    type="text"
                    value={formData.abbreviation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        abbreviation: e.target.value,
                      })
                    }
                    placeholder="Ej: kg"
                    className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripción de la unidad de medida..."
                  rows={2}
                  className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Tipo de unidad */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Tipo de unidad *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value,
                      baseUnit: "",
                    })
                  }
                  className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                >
                  {unitTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unidad base y factor de conversión */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Unidad base (opcional)
                  </label>
                  <select
                    value={formData.baseUnit}
                    onChange={(e) =>
                      setFormData({ ...formData, baseUnit: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  >
                    <option value="">Es unidad base</option>
                    {getBaseUnits(formData.type)
                      .filter((u) => u.id !== editingUnit?.id)
                      .map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name} ({unit.abbreviation})
                        </option>
                      ))}
                  </select>
                  <p className="text-gray-500 text-xs mt-1">
                    Selecciona si se deriva de otra unidad
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Factor de conversión
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.conversionFactor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        conversionFactor: parseFloat(e.target.value) || 0,
                      })
                    }
                    disabled={!formData.baseUnit}
                    placeholder="1.0"
                    className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    1 {formData.abbreviation || "unidad"} ={" "}
                    {formData.conversionFactor}{" "}
                    {formData.baseUnit
                      ? getBaseUnitName(formData.baseUnit)
                      : "base"}
                  </p>
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-start gap-4 p-4 bg-[#0f1825]/50 rounded-lg border border-white/5">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="sr-only peer"
                    id="unitActive"
                  />
                  <label
                    htmlFor="unitActive"
                    className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center cursor-pointer"
                  >
                    {formData.active && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="unitActive"
                    className="text-white font-medium text-sm block mb-1 cursor-pointer"
                  >
                    Unidad activa
                  </label>
                  <p className="text-gray-400 text-xs">
                    Solo las unidades activas se pueden asignar a productos
                  </p>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="border-t border-white/10 p-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUnit}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingUnit ? "Actualizar" : "Crear"} Unidad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}