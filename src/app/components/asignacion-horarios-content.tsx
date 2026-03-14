import { useState } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
  Check,
  X,
  Search,
  Filter,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  departamento: string;
}

interface WorkShift {
  id: string;
  name: string;
  color: string;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
}

interface Asignacion {
  empleadoId: string;
  fecha: string; // YYYY-MM-DD
  turnoId: string;
}

const TURNOS_DISPONIBLES: WorkShift[] = [
  {
    id: "1",
    name: "Turno Administrativo",
    color: "bg-blue-500",
    morningStart: "08:00",
    morningEnd: "12:30",
    afternoonStart: "14:00",
    afternoonEnd: "18:00",
  },
  {
    id: "2",
    name: "Turno Comercial",
    color: "bg-green-500",
    morningStart: "10:00",
    morningEnd: "13:00",
    afternoonStart: "14:00",
    afternoonEnd: "19:00",
  },
  {
    id: "3",
    name: "Turno Rotativo",
    color: "bg-purple-500",
    morningStart: "09:00",
    morningEnd: "13:00",
    afternoonStart: "14:00",
    afternoonEnd: "18:00",
  },
];

interface AsignacionHorariosContentProps {
  empleados: Empleado[];
}

export function AsignacionHorariosContent({ empleados }: AsignacionHorariosContentProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedEmpleados, setSelectedEmpleados] = useState<string[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return days;
  };

  const days = getDaysInMonth(selectedMonth);
  const monthName = selectedMonth.toLocaleDateString("es-EC", { month: "long", year: "numeric" });

  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  const toggleEmpleado = (empleadoId: string) => {
    setSelectedEmpleados((prev) =>
      prev.includes(empleadoId)
        ? prev.filter((id) => id !== empleadoId)
        : [...prev, empleadoId]
    );
  };

  const asignarTurno = (dia: Date) => {
    if (!selectedTurno || selectedEmpleados.length === 0) return;

    const fecha = dia.toISOString().split("T")[0];
    const nuevasAsignaciones: Asignacion[] = selectedEmpleados.map((empId) => ({
      empleadoId: empId,
      fecha,
      turnoId: selectedTurno,
    }));

    setAsignaciones((prev) => {
      // Remover asignaciones existentes para esos empleados en esa fecha
      const filtered = prev.filter(
        (a) => !(selectedEmpleados.includes(a.empleadoId) && a.fecha === fecha)
      );
      return [...filtered, ...nuevasAsignaciones];
    });
  };

  const getAsignacion = (empleadoId: string, fecha: string): WorkShift | null => {
    const asig = asignaciones.find((a) => a.empleadoId === empleadoId && a.fecha === fecha);
    if (!asig) return null;
    return TURNOS_DISPONIBLES.find((t) => t.id === asig.turnoId) || null;
  };

  const filteredEmpleados = empleados.filter((emp) =>
    `${emp.nombre} ${emp.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="space-y-6">
      {/* Selector de Mes */}
      <div className={`rounded-xl border p-4 ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h2 className={`text-xl font-bold capitalize ${isLight ? "text-gray-900" : "text-white"}`}>
              {monthName}
            </h2>
          </div>

          <button
            onClick={nextMonth}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel Lateral - Empleados */}
        <div className="lg:col-span-3 space-y-4">
          {/* Turnos Disponibles */}
          <div
            className={`rounded-xl border p-4 ${
              isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
            }`}
          >
            <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
              Turnos Disponibles
            </h3>
            <div className="space-y-2">
              {TURNOS_DISPONIBLES.map((turno) => (
                <button
                  key={turno.id}
                  onClick={() => setSelectedTurno(turno.id === selectedTurno ? null : turno.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedTurno === turno.id
                      ? `${turno.color} text-white shadow-md`
                      : isLight
                      ? "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      : "bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{turno.name}</span>
                    {selectedTurno === turno.id && <Check className="w-4 h-4" />}
                  </div>
                  <div className={`text-xs mt-1 ${selectedTurno === turno.id ? "text-white/80" : "opacity-60"}`}>
                    {turno.morningStart}-{turno.morningEnd} | {turno.afternoonStart}-{turno.afternoonEnd}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Empleados */}
          <div
            className={`rounded-xl border p-4 ${
              isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
            }`}
          >
            <h3 className={`text-sm font-semibold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
              Seleccionar Empleados
            </h3>

            {/* Buscador */}
            <div className="mb-3 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              <input
                type="text"
                placeholder="Buscar empleado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-sm border ${
                  isLight
                    ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-primary/50`}
              />
            </div>

            {/* Lista */}
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredEmpleados.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => toggleEmpleado(emp.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedEmpleados.includes(emp.id)
                      ? "bg-primary/20 border-l-4 border-l-primary"
                      : isLight
                      ? "hover:bg-gray-50"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedEmpleados.includes(emp.id)
                          ? "bg-primary border-primary"
                          : isLight
                          ? "border-gray-300"
                          : "border-gray-600"
                      }`}
                    >
                      {selectedEmpleados.includes(emp.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${isLight ? "text-gray-900" : "text-white"}`}>
                        {emp.nombre} {emp.apellido}
                      </div>
                      <div className={`text-xs truncate ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        {emp.cargo}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedEmpleados.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className={isLight ? "text-gray-600" : "text-gray-400"}>
                    {selectedEmpleados.length} seleccionado(s)
                  </span>
                  <button
                    onClick={() => setSelectedEmpleados([])}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calendario - Vista de Tabla */}
        <div className="lg:col-span-9">
          <div
            className={`rounded-xl border overflow-hidden ${
              isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className={isLight ? "bg-gray-50" : "bg-white/5"}>
                  <tr>
                    <th
                      className={`sticky left-0 z-10 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                        isLight ? "bg-gray-50 text-gray-500" : "bg-white/5 text-gray-400"
                      }`}
                    >
                      Empleado
                    </th>
                    {days.map((day) => (
                      <th
                        key={day.toISOString()}
                        className={`px-2 py-3 text-center text-xs font-medium ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <div>{dayNames[day.getDay()]}</div>
                        <div className={`text-sm font-bold mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                          {day.getDate()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`text-sm divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                  {filteredEmpleados.map((emp) => (
                    <tr
                      key={emp.id}
                      className={`${isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"}`}
                    >
                      <td
                        className={`sticky left-0 z-10 px-4 py-3 ${
                          isLight ? "bg-white" : "bg-card"
                        } border-r ${isLight ? "border-gray-200" : "border-white/10"}`}
                      >
                        <div className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {emp.nombre} {emp.apellido}
                        </div>
                        <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          {emp.cargo}
                        </div>
                      </td>
                      {days.map((day) => {
                        const fecha = day.toISOString().split("T")[0];
                        const turno = getAsignacion(emp.id, fecha);
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                        return (
                          <td
                            key={day.toISOString()}
                            onClick={() => asignarTurno(day)}
                            className={`px-2 py-3 text-center cursor-pointer transition-colors ${
                              isWeekend
                                ? isLight
                                  ? "bg-gray-50"
                                  : "bg-white/[0.02]"
                                : ""
                            } ${
                              selectedEmpleados.includes(emp.id) && selectedTurno
                                ? "hover:bg-primary/10"
                                : ""
                            }`}
                          >
                            {turno ? (
                              <div
                                className={`${turno.color} text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap`}
                              >
                                {turno.name.split(" ")[1] || turno.name}
                              </div>
                            ) : (
                              <div className="text-gray-300">—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instrucciones */}
          <div
            className={`mt-4 rounded-xl border p-4 ${
              isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/5 border-blue-500/20"
            }`}
          >
            <p className={`text-sm ${isLight ? "text-blue-700" : "text-blue-300"}`}>
              <strong>Instrucciones:</strong> Seleccione un turno del panel lateral, luego seleccione uno o más
              empleados, y haga clic en los días del calendario para asignar el turno.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
