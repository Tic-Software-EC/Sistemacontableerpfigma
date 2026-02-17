import { useState } from "react";
import {
  Clock,
  Calendar,
  Save,
  AlertCircle,
  CheckCircle,
  Sun,
  Moon,
  Sunset,
  Plus,
  Trash2,
  Edit2,
  Building2,
  MapPin,
} from "lucide-react";

interface WorkShift {
  id: string;
  name: string;
  color: string;
  sucursal: string;
  workingDays: {
    lunes: boolean;
    martes: boolean;
    miercoles: boolean;
    jueves: boolean;
    viernes: boolean;
    sabado: boolean;
    domingo: boolean;
  };
  morningStart: string;
  morningEnd: string;
  lunchStart: string;
  lunchEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
}

interface WorkingDaysConfig {
  lunes: boolean;
  martes: boolean;
  miercoles: boolean;
  jueves: boolean;
  viernes: boolean;
  sabado: boolean;
  domingo: boolean;
}

const SHIFT_COLORS = [
  { value: "orange", label: "Naranja", bg: "bg-orange-500/20", border: "border-orange-500/30", text: "text-orange-400", icon: "bg-orange-500/20" },
  { value: "purple", label: "Morado", bg: "bg-purple-500/20", border: "border-purple-500/30", text: "text-purple-400", icon: "bg-purple-500/20" },
  { value: "blue", label: "Azul", bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-400", icon: "bg-blue-500/20" },
  { value: "green", label: "Verde", bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-400", icon: "bg-green-500/20" },
  { value: "red", label: "Rojo", bg: "bg-red-500/20", border: "border-red-500/30", text: "text-red-400", icon: "bg-red-500/20" },
  { value: "yellow", label: "Amarillo", bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400", icon: "bg-yellow-500/20" },
];

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

export function WorkScheduleContent() {
  const [shifts, setShifts] = useState<WorkShift[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [editShiftWorkingDays, setEditShiftWorkingDays] = useState<WorkingDaysConfig>({
    lunes: true,
    martes: true,
    miercoles: true,
    jueves: true,
    viernes: true,
    sabado: false,
    domingo: false,
  });
  const [newShiftWorkingDays, setNewShiftWorkingDays] = useState<WorkingDaysConfig>({
    lunes: true,
    martes: true,
    miercoles: true,
    jueves: true,
    viernes: true,
    sabado: false,
    domingo: false,
  });
  const [newShift, setNewShift] = useState<Partial<WorkShift>>({
    name: "",
    color: "orange",
    sucursal: SUCURSALES[0].id,
    morningStart: "08:00",
    morningEnd: "12:00",
    lunchStart: "12:00",
    lunchEnd: "13:00",
    afternoonStart: "13:00",
    afternoonEnd: "17:00",
  });

  const handleTimeChange = (
    shiftId: string,
    field: keyof WorkShift,
    value: string
  ) => {
    setShifts(
      shifts.map((shift) =>
        shift.id === shiftId ? { ...shift, [field]: value } : shift
      )
    );
  };

  const handleSaveSchedules = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const addNewShift = () => {
    if (!newShift.name?.trim()) {
      return;
    }
    
    const createdShift: WorkShift = {
      id: Date.now().toString(),
      name: newShift.name,
      color: newShift.color || "orange",
      sucursal: newShift.sucursal || SUCURSALES[0].id,
      workingDays: { ...newShiftWorkingDays },
      morningStart: newShift.morningStart || "08:00",
      morningEnd: newShift.morningEnd || "12:00",
      lunchStart: newShift.lunchStart || "12:00",
      lunchEnd: newShift.lunchEnd || "13:00",
      afternoonStart: newShift.afternoonStart || "13:00",
      afternoonEnd: newShift.afternoonEnd || "17:00",
    };
    setShifts([...shifts, createdShift]);
    setShowCreateModal(false);
    setNewShift({
      name: "",
      color: "orange",
      sucursal: SUCURSALES[0].id,
      morningStart: "08:00",
      morningEnd: "12:00",
      lunchStart: "12:00",
      lunchEnd: "13:00",
      afternoonStart: "13:00",
      afternoonEnd: "17:00",
    });
    setNewShiftWorkingDays({
      lunes: true,
      martes: true,
      miercoles: true,
      jueves: true,
      viernes: true,
      sabado: false,
      domingo: false,
    });
  };

  const deleteShift = (shiftId: string) => {
    setShifts(shifts.filter((shift) => shift.id !== shiftId));
  };

  const openEditModal = (shift: WorkShift) => {
    setEditingShift(shift);
    setEditShiftWorkingDays({ ...shift.workingDays });
    setShowEditModal(true);
  };

  const saveEditShift = () => {
    if (!editingShift || !editingShift.name?.trim()) {
      return;
    }

    setShifts(
      shifts.map((shift) =>
        shift.id === editingShift.id
          ? { ...editingShift, workingDays: { ...editShiftWorkingDays } }
          : shift
      )
    );
    setShowEditModal(false);
    setEditingShift(null);
  };

  const toggleEditShiftWorkingDay = (day: keyof WorkingDaysConfig) => {
    setEditShiftWorkingDays({ ...editShiftWorkingDays, [day]: !editShiftWorkingDays[day] });
  };

  const toggleNewShiftWorkingDay = (day: keyof WorkingDaysConfig) => {
    setNewShiftWorkingDays({ ...newShiftWorkingDays, [day]: !newShiftWorkingDays[day] });
  };

  const calculateShiftHours = (shift: WorkShift): number => {
    const morningHours = calculateHours(shift.morningStart, shift.morningEnd);
    const afternoonHours = calculateHours(shift.afternoonStart, shift.afternoonEnd);
    return morningHours + afternoonHours;
  };

  function calculateHours(start: string, end: string): number {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
    return endHour - startHour + (endMin - startMin) / 60;
  };

  const getWorkingDaysCountForShift = (workingDays: WorkingDaysConfig): number => {
    return Object.values(workingDays).filter((day) => day).length;
  };

  const getColorConfig = (colorValue: string) => {
    return SHIFT_COLORS.find((c) => c.value === colorValue) || SHIFT_COLORS[0];
  };

  const getSucursalName = (sucursalId: string): string => {
    return SUCURSALES.find((s) => s.id === sucursalId)?.name || sucursalId;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
          <Clock className="w-8 h-8 text-primary" />
          Horario Laboral
        </h2>
        <p className="text-gray-400 text-sm">
          Configure los turnos de trabajo por sucursal
        </p>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Turnos de Trabajo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {shifts.map((shift) => {
          const colorConfig = getColorConfig(shift.color);
          const workingDaysCount = getWorkingDaysCountForShift(shift.workingDays);
          return (
            <div key={shift.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${colorConfig.icon} rounded-xl flex items-center justify-center`}>
                    <Clock className={`w-6 h-6 ${colorConfig.text}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">
                      {shift.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {calculateShiftHours(shift).toFixed(1)} horas/día • {workingDaysCount} días/semana
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(shift)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Editar turno"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteShift(shift.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar turno"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sucursal */}
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-300 bg-blue-500/5 border border-blue-500/20 rounded-lg px-3 py-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>{getSucursalName(shift.sucursal)}</span>
              </div>

              {/* Días laborables del turno */}
              <div className="mb-4">
                <label className="text-gray-400 text-xs mb-2 block">Días laborables</label>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(shift.workingDays).map(([day, isActive]) => (
                    <div
                      key={day}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isActive
                          ? "bg-green-500/20 border border-green-500/30 text-green-300"
                          : "bg-gray-500/10 border border-gray-500/30 text-gray-500"
                      }`}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {/* Horario de Mañana */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sun className="w-4 h-4 text-blue-400" />
                    <p className="text-blue-400 font-medium text-sm">
                      Jornada Mañana
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        Entrada
                      </label>
                      <div className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm">
                        {shift.morningStart}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        Salida
                      </label>
                      <div className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm">
                        {shift.morningEnd}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horario de Almuerzo */}
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sunset className="w-4 h-4 text-orange-400" />
                    <p className="text-orange-400 font-medium text-sm">
                      Almuerzo
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        Inicio
                      </label>
                      <div className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm">
                        {shift.lunchStart}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        Fin
                      </label>
                      <div className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm">
                        {shift.lunchEnd}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horario de Tarde */}
                <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="w-4 h-4 text-purple-400" />
                    <p className="text-purple-400 font-medium text-sm">
                      Jornada Tarde
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        Entrada
                      </label>
                      <div className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm">
                        {shift.afternoonStart}
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-xs mb-1 block">
                        Salida
                      </label>
                      <div className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm">
                        {shift.afternoonEnd}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen del turno */}
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium text-sm">
                        Total Semanal
                      </span>
                    </div>
                    <span className="text-white font-bold text-lg">
                      {(calculateShiftHours(shift) * workingDaysCount).toFixed(1)}h
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Tarjeta para agregar turno */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Agregar Turno</h3>
              <p className="text-gray-400 text-sm">
                Crear un nuevo turno de trabajo
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 justify-center"
          >
            <Plus className="w-5 h-5" />
            Crear Turno
          </button>
        </div>
      </div>

      {/* Notas importantes */}
      {shifts.length > 0 && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-yellow-400 font-semibold mb-2">
                Información Importante
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Los trabajadores serán asignados a los turnos según su sucursal y contrato</li>
                <li>• Cada turno puede tener días laborables y horarios diferentes</li>
                <li>• Los tiempos de almuerzo/descanso no cuentan como horas laborables</li>
                <li>• Los turnos son específicos por sucursal</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear un nuevo turno */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1825] border border-white/10 rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-2xl mb-6">Crear Nuevo Turno</h3>
            
            <div className="space-y-6">
              {/* Información Básica */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg">Información Básica</h4>
                
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Nombre del Turno *</label>
                  <input
                    type="text"
                    value={newShift.name}
                    onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                    placeholder="Ej: Primer Turno, Segundo Turno, Turno Nocturno..."
                    className="w-full px-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Sucursal *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={newShift.sucursal}
                      onChange={(e) => setNewShift({ ...newShift, sucursal: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      {SUCURSALES.map((sucursal) => (
                        <option key={sucursal.id} value={sucursal.id}>
                          {sucursal.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Color del turno</label>
                  <div className="flex gap-2 flex-wrap">
                    {SHIFT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewShift({ ...newShift, color: color.value })}
                        className={`w-10 h-10 rounded-lg transition-all ${color.icon} flex items-center justify-center ${
                          newShift.color === color.value
                            ? `ring-2 ring-offset-2 ring-offset-[#0f1825] ${color.border.replace("border-", "ring-")}`
                            : "hover:scale-110"
                        }`}
                        title={color.label}
                      >
                        {newShift.color === color.value && (
                          <CheckCircle className={`w-5 h-5 ${color.text}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Días Laborables */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-3">Días Laborables</h4>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-3">Seleccione los días en que aplica este turno</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "lunes", label: "Lunes" },
                      { key: "martes", label: "Martes" },
                      { key: "miercoles", label: "Miércoles" },
                      { key: "jueves", label: "Jueves" },
                      { key: "viernes", label: "Viernes" },
                      { key: "sabado", label: "Sábado" },
                      { key: "domingo", label: "Domingo" },
                    ].map((day) => {
                      const dayKey = day.key as keyof WorkingDaysConfig;
                      const isActive = newShiftWorkingDays[dayKey];
                      return (
                        <button
                          key={day.key}
                          onClick={() => toggleNewShiftWorkingDay(dayKey)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? "bg-blue-500/20 border border-blue-500/30 text-blue-300"
                              : "bg-gray-500/10 border border-gray-500/30 text-gray-500 hover:bg-gray-500/20"
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-green-400 text-xs mt-3">
                    {getWorkingDaysCountForShift(newShiftWorkingDays)} días seleccionados
                  </p>
                </div>
              </div>
              
              {/* Configuración de Horarios */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-3">Configuración de Horarios</h4>
                <div className="space-y-4">
                  {/* Horario de Mañana */}
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sun className="w-5 h-5 text-blue-400" />
                      <p className="text-blue-400 font-medium">
                        Jornada Mañana
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Entrada
                        </label>
                        <input
                          type="time"
                          value={newShift.morningStart}
                          onChange={(e) =>
                            setNewShift({ ...newShift, morningStart: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Salida
                        </label>
                        <input
                          type="time"
                          value={newShift.morningEnd}
                          onChange={(e) =>
                            setNewShift({ ...newShift, morningEnd: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Horario de Almuerzo */}
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sunset className="w-5 h-5 text-orange-400" />
                      <p className="text-orange-400 font-medium">
                        Almuerzo / Descanso
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Inicio
                        </label>
                        <input
                          type="time"
                          value={newShift.lunchStart}
                          onChange={(e) =>
                            setNewShift({ ...newShift, lunchStart: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Fin
                        </label>
                        <input
                          type="time"
                          value={newShift.lunchEnd}
                          onChange={(e) =>
                            setNewShift({ ...newShift, lunchEnd: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Horario de Tarde */}
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Moon className="w-5 h-5 text-purple-400" />
                      <p className="text-purple-400 font-medium">
                        Jornada Tarde
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Entrada
                        </label>
                        <input
                          type="time"
                          value={newShift.afternoonStart}
                          onChange={(e) =>
                            setNewShift({ ...newShift, afternoonStart: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Salida
                        </label>
                        <input
                          type="time"
                          value={newShift.afternoonEnd}
                          onChange={(e) =>
                            setNewShift({ ...newShift, afternoonEnd: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewShift({
                    name: "",
                    color: "orange",
                    sucursal: SUCURSALES[0].id,
                    morningStart: "08:00",
                    morningEnd: "12:00",
                    lunchStart: "12:00",
                    lunchEnd: "13:00",
                    afternoonStart: "13:00",
                    afternoonEnd: "17:00",
                  });
                  setNewShiftWorkingDays({
                    lunes: true,
                    martes: true,
                    miercoles: true,
                    jueves: true,
                    viernes: true,
                    sabado: false,
                    domingo: false,
                  });
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={addNewShift}
                disabled={!newShift.name?.trim()}
                className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Crear Turno
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar un turno */}
      {showEditModal && editingShift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f1825] border border-white/10 rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-bold text-2xl mb-6">Editar Turno: {editingShift.name}</h3>
            
            <div className="space-y-6">
              {/* Información Básica */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-lg">Información Básica</h4>
                
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Nombre del Turno *</label>
                  <input
                    type="text"
                    value={editingShift.name}
                    onChange={(e) => setEditingShift({ ...editingShift, name: e.target.value })}
                    placeholder="Ej: Primer Turno, Segundo Turno, Turno Nocturno..."
                    className="w-full px-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Sucursal *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={editingShift.sucursal}
                      onChange={(e) => setEditingShift({ ...editingShift, sucursal: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      {SUCURSALES.map((sucursal) => (
                        <option key={sucursal.id} value={sucursal.id}>
                          {sucursal.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Color del turno</label>
                  <div className="flex gap-2 flex-wrap">
                    {SHIFT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setEditingShift({ ...editingShift, color: color.value })}
                        className={`w-10 h-10 rounded-lg transition-all ${color.icon} flex items-center justify-center ${
                          editingShift.color === color.value
                            ? `ring-2 ring-offset-2 ring-offset-[#0f1825] ${color.border.replace("border-", "ring-")}`
                            : "hover:scale-110"
                        }`}
                        title={color.label}
                      >
                        {editingShift.color === color.value && (
                          <CheckCircle className={`w-5 h-5 ${color.text}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Días Laborables */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-3">Días Laborables</h4>
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-3">Seleccione los días en que aplica este turno</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "lunes", label: "Lunes" },
                      { key: "martes", label: "Martes" },
                      { key: "miercoles", label: "Miércoles" },
                      { key: "jueves", label: "Jueves" },
                      { key: "viernes", label: "Viernes" },
                      { key: "sabado", label: "Sábado" },
                      { key: "domingo", label: "Domingo" },
                    ].map((day) => {
                      const dayKey = day.key as keyof WorkingDaysConfig;
                      const isActive = editShiftWorkingDays[dayKey];
                      return (
                        <button
                          key={day.key}
                          onClick={() => toggleEditShiftWorkingDay(dayKey)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? "bg-blue-500/20 border border-blue-500/30 text-blue-300"
                              : "bg-gray-500/10 border border-gray-500/30 text-gray-500 hover:bg-gray-500/20"
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-green-400 text-xs mt-3">
                    {getWorkingDaysCountForShift(editShiftWorkingDays)} días seleccionados
                  </p>
                </div>
              </div>
              
              {/* Configuración de Horarios */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-3">Configuración de Horarios</h4>
                <div className="space-y-4">
                  {/* Horario de Mañana */}
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sun className="w-5 h-5 text-blue-400" />
                      <p className="text-blue-400 font-medium">
                        Jornada Mañana
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Entrada
                        </label>
                        <input
                          type="time"
                          value={editingShift.morningStart}
                          onChange={(e) =>
                            setEditingShift({ ...editingShift, morningStart: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Salida
                        </label>
                        <input
                          type="time"
                          value={editingShift.morningEnd}
                          onChange={(e) =>
                            setEditingShift({ ...editingShift, morningEnd: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Horario de Almuerzo */}
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sunset className="w-5 h-5 text-orange-400" />
                      <p className="text-orange-400 font-medium">
                        Almuerzo / Descanso
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Inicio
                        </label>
                        <input
                          type="time"
                          value={editingShift.lunchStart}
                          onChange={(e) =>
                            setEditingShift({ ...editingShift, lunchStart: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Fin
                        </label>
                        <input
                          type="time"
                          value={editingShift.lunchEnd}
                          onChange={(e) =>
                            setEditingShift({ ...editingShift, lunchEnd: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Horario de Tarde */}
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Moon className="w-5 h-5 text-purple-400" />
                      <p className="text-purple-400 font-medium">
                        Jornada Tarde
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Entrada
                        </label>
                        <input
                          type="time"
                          value={editingShift.afternoonStart}
                          onChange={(e) =>
                            setEditingShift({ ...editingShift, afternoonStart: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-xs mb-1 block">
                          Salida
                        </label>
                        <input
                          type="time"
                          value={editingShift.afternoonEnd}
                          onChange={(e) =>
                            setEditingShift({ ...editingShift, afternoonEnd: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#0D1B2A] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingShift(null);
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={saveEditShift}
                disabled={!editingShift.name?.trim()}
                className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}