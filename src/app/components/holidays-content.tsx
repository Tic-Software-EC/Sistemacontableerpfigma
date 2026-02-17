import { useState } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Building2,
  Search,
  X,
  CheckCircle,
  PartyPopper,
  AlertCircle,
} from "lucide-react";

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "nacional" | "local" | "religioso" | "comercial" | "otro";
  sucursales: string[];
  description: string;
  isObligatory: boolean;
}

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

const HOLIDAY_TYPES = [
  { value: "nacional", label: "Nacional", color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
  { value: "local", label: "Local", color: "bg-green-500/20 border-green-500/30 text-green-400" },
  { value: "religioso", label: "Religioso", color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
  { value: "comercial", label: "Comercial", color: "bg-orange-500/20 border-orange-500/30 text-orange-400" },
  { value: "otro", label: "Otro", color: "bg-gray-500/20 border-gray-500/30 text-gray-400" },
];

export function HolidaysContent() {
  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: "1",
      name: "Año Nuevo",
      date: "2026-01-01",
      type: "nacional",
      sucursales: ["suc-001", "suc-002", "suc-003", "suc-004"],
      description: "Celebración de año nuevo",
      isObligatory: true,
    },
    {
      id: "2",
      name: "Día del Trabajo",
      date: "2026-05-01",
      type: "nacional",
      sucursales: ["suc-001", "suc-002", "suc-003", "suc-004"],
      description: "Día internacional del trabajador",
      isObligatory: true,
    },
    {
      id: "3",
      name: "Fiestas de Quito",
      date: "2026-12-06",
      type: "local",
      sucursales: ["suc-001", "suc-002", "suc-004"],
      description: "Festividades locales de Quito",
      isObligatory: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sucursalFilter, setSucursalFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  const [formData, setFormData] = useState<Omit<Holiday, "id">>({
    name: "",
    date: "",
    type: "nacional",
    sucursales: [],
    description: "",
    isObligatory: true,
  });

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({
      name: "",
      date: "",
      type: "nacional",
      sucursales: [],
      description: "",
      isObligatory: true,
    });
    setShowModal(true);
  };

  const openEditModal = (holiday: Holiday) => {
    setModalMode("edit");
    setEditingHoliday(holiday);
    setFormData({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      sucursales: [...holiday.sucursales],
      description: holiday.description,
      isObligatory: holiday.isObligatory,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.date || formData.sucursales.length === 0) {
      return;
    }

    if (modalMode === "create") {
      const newHoliday: Holiday = {
        id: Date.now().toString(),
        ...formData,
      };
      setHolidays([...holidays, newHoliday]);
    } else if (modalMode === "edit" && editingHoliday) {
      setHolidays(
        holidays.map((h) =>
          h.id === editingHoliday.id ? { ...editingHoliday, ...formData } : h
        )
      );
    }

    setShowModal(false);
    setEditingHoliday(null);
  };

  const deleteHoliday = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id));
  };

  const toggleSucursal = (sucursalId: string) => {
    if (formData.sucursales.includes(sucursalId)) {
      setFormData({
        ...formData,
        sucursales: formData.sucursales.filter((id) => id !== sucursalId),
      });
    } else {
      setFormData({
        ...formData,
        sucursales: [...formData.sucursales, sucursalId],
      });
    }
  };

  const selectAllSucursales = () => {
    setFormData({
      ...formData,
      sucursales: SUCURSALES.map((s) => s.id),
    });
  };

  const deselectAllSucursales = () => {
    setFormData({
      ...formData,
      sucursales: [],
    });
  };

  const getSucursalName = (id: string) => {
    return SUCURSALES.find((s) => s.id === id)?.name || id;
  };

  const getTypeConfig = (type: string) => {
    return HOLIDAY_TYPES.find((t) => t.value === type) || HOLIDAY_TYPES[4];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-EC", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filtrado
  const filteredHolidays = holidays
    .filter((holiday) => {
      const matchesSearch = holiday.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSucursal =
        sucursalFilter === "all" || holiday.sucursales.includes(sucursalFilter);
      return matchesSearch && matchesSucursal;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          Días Festivos
        </h2>
        <p className="text-gray-400 text-sm">
          Gestione los días festivos y feriados por sucursal
        </p>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar día festivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        {/* Filtro por Sucursal */}
        <div className="lg:w-64 relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={sucursalFilter}
            onChange={(e) => setSucursalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todas las sucursales</option>
            {SUCURSALES.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botón Crear */}
        <button
          onClick={openCreateModal}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Nuevo Festivo
        </button>
      </div>

      {/* Lista de Festivos */}
      <div className="space-y-4">
        {filteredHolidays.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No se encontraron días festivos</p>
          </div>
        ) : (
          filteredHolidays.map((holiday) => {
            const typeConfig = getTypeConfig(holiday.type);
            return (
              <div
                key={holiday.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PartyPopper className="w-8 h-8 text-primary" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-bold text-xl">{holiday.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-medium border ${typeConfig.color}`}
                        >
                          {typeConfig.label}
                        </span>
                        {holiday.isObligatory && (
                          <span className="px-3 py-1 rounded-lg text-xs font-medium border bg-red-500/20 border-red-500/30 text-red-400">
                            Obligatorio
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 text-sm mb-3 capitalize">
                        {formatDate(holiday.date)}
                      </p>

                      {holiday.description && (
                        <p className="text-gray-400 text-sm mb-3">{holiday.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {holiday.sucursales.map((sucId) => (
                          <span
                            key={sucId}
                            className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-300 text-xs flex items-center gap-1"
                          >
                            <Building2 className="w-3 h-3" />
                            {getSucursalName(sucId)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                    <button
                      onClick={() => openEditModal(holiday)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar festivo"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteHoliday(holiday.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Eliminar festivo"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Información */}
      {holidays.length > 0 && (
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-blue-400 font-semibold mb-2">
                Información Importante
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Los días festivos marcados como "Obligatorios" no permiten laborar</li>
                <li>• Puede configurar diferentes festivos para cada sucursal</li>
                <li>• Los festivos nacionales aplican a todas las sucursales por defecto</li>
                <li>• Los días festivos afectan el cálculo de nómina y asistencia</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1825] border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-2xl">
                {modalMode === "create" ? "Crear Día Festivo" : "Editar Día Festivo"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingHoliday(null);
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Nombre del día festivo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Año Nuevo, Día del Trabajo..."
                  className="w-full px-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Fecha *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Holiday["type"],
                    })
                  }
                  className="w-full px-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  {HOLIDAY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripción opcional del día festivo..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Descanso obligatorio */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isObligatory"
                  checked={formData.isObligatory}
                  onChange={(e) =>
                    setFormData({ ...formData, isObligatory: e.target.checked })
                  }
                  className="w-5 h-5 bg-[#0D1B2A] border border-white/10 rounded text-primary focus:ring-2 focus:ring-primary/40 cursor-pointer"
                />
                <label htmlFor="isObligatory" className="text-white text-sm cursor-pointer">
                  Descanso obligatorio (no se puede laborar)
                </label>
              </div>

              {/* Sucursales */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-gray-400 text-sm">
                    Sucursales donde aplica *
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllSucursales}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Seleccionar todas
                    </button>
                    <span className="text-gray-600">|</span>
                    <button
                      type="button"
                      onClick={deselectAllSucursales}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Deseleccionar todas
                    </button>
                  </div>
                </div>

                <div className="bg-[#0D1B2A] border border-white/10 rounded-lg p-4 space-y-3">
                  {SUCURSALES.map((sucursal) => (
                    <div key={sucursal.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={`sucursal-${sucursal.id}`}
                        checked={formData.sucursales.includes(sucursal.id)}
                        onChange={() => toggleSucursal(sucursal.id)}
                        className="w-5 h-5 bg-[#0f1825] border border-white/10 rounded text-primary focus:ring-2 focus:ring-primary/40 cursor-pointer"
                      />
                      <label
                        htmlFor={`sucursal-${sucursal.id}`}
                        className="text-white text-sm cursor-pointer flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-blue-400" />
                        {sucursal.name}
                      </label>
                    </div>
                  ))}
                </div>

                <p className="text-green-400 text-xs mt-2">
                  {formData.sucursales.length} sucursal(es) seleccionada(s)
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingHoliday(null);
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={
                  !formData.name.trim() ||
                  !formData.date ||
                  formData.sucursales.length === 0
                }
                className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {modalMode === "create" ? "Crear Festivo" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
