import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface MonthPickerProps {
  dateFrom: string; // YYYY-MM-DD format
  dateTo: string; // YYYY-MM-DD format
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  placeholder?: string;
}

export function MonthPicker({ dateFrom, dateTo, onDateFromChange, onDateToChange, placeholder = "Seleccionar mes" }: MonthPickerProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [isOpen, setIsOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const containerRef = useRef<HTMLDivElement>(null);

  // Parsear la fecha seleccionada (usamos dateTo para determinar el mes)
  const selectedDate = dateTo ? new Date(dateTo) : null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formatear la fecha para mostrar solo mes y año
  const formatDisplayDate = () => {
    if (!selectedDate) return "";
    const month = selectedDate.toLocaleDateString("es-EC", { month: "long" });
    const year = selectedDate.getFullYear();
    return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
  };

  // Meses del año
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Navegar entre años
  const goToPreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const goToNextYear = () => {
    const today = new Date();
    const currentYearNow = today.getFullYear();
    // No permitir avanzar más allá del año actual
    if (currentYear < currentYearNow) {
      setCurrentYear(currentYear + 1);
    }
  };

  // Seleccionar un mes
  const selectMonth = (monthIndex: number) => {
    const today = new Date();
    const isCurrentMonthSelected = currentYear === today.getFullYear() && monthIndex === today.getMonth();
    
    const month = String(monthIndex + 1).padStart(2, "0");
    
    // Fecha desde: siempre el día 1 del mes
    const dateFromStr = `${currentYear}-${month}-01`;
    
    // Fecha hasta: 
    // - Si es el mes actual del año actual: hasta hoy
    // - Si es un mes pasado: hasta el último día del mes
    let dateToStr: string;
    if (isCurrentMonthSelected) {
      const day = String(today.getDate()).padStart(2, "0");
      dateToStr = `${currentYear}-${month}-${day}`;
    } else {
      const lastDay = new Date(currentYear, monthIndex + 1, 0).getDate();
      const day = String(lastDay).padStart(2, "0");
      dateToStr = `${currentYear}-${month}-${day}`;
    }
    
    onDateFromChange(dateFromStr);
    onDateToChange(dateToStr);
    setIsOpen(false);
  };

  // Seleccionar mes actual
  const selectCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(today.getDate()).padStart(2, "0");
    
    // Desde el día 1 del mes actual hasta hoy
    onDateFromChange(`${year}-${monthStr}-01`);
    onDateToChange(`${year}-${monthStr}-${dayStr}`);
    setCurrentYear(year);
    setIsOpen(false);
  };

  // Limpiar selección
  const clearSelection = () => {
    onDateFromChange("");
    onDateToChange("");
    setIsOpen(false);
  };

  // Verificar si un mes está seleccionado
  const isMonthSelected = (monthIndex: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getMonth() === monthIndex &&
      selectedDate.getFullYear() === currentYear
    );
  };

  // Verificar si un mes es el actual
  const isCurrentMonth = (monthIndex: number) => {
    const today = new Date();
    return (
      today.getMonth() === monthIndex &&
      today.getFullYear() === currentYear
    );
  };

  // Verificar si un mes está en el futuro (no se puede seleccionar)
  const isMonthInFuture = (monthIndex: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYearNow = today.getFullYear();
    
    if (currentYear > currentYearNow) {
      return true; // Todo el año futuro está deshabilitado
    }
    
    if (currentYear === currentYearNow && monthIndex > currentMonth) {
      return true; // Meses futuros del año actual están deshabilitados
    }
    
    return false;
  };

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const inp = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const popup = `absolute top-full left-0 mt-2 rounded-lg border shadow-xl z-50 ${isLight ? "bg-white border-gray-200" : "bg-[#0f1825] border-white/10"}`;

  const today = new Date();
  const currentYearNow = today.getFullYear();
  const isCurrentYearShowing = currentYear === currentYearNow;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none`} />
        <input
          type="text"
          readOnly
          value={formatDisplayDate()}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          className={`${inp} pl-10 pr-10 w-full cursor-pointer`}
        />
        {dateTo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${sub} hover:text-gray-700 transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className={`${popup} p-4 w-80`}>
          {/* Header con navegación */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousYear}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${txt}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className={`text-base font-bold ${txt}`}>{currentYear}</h3>
            <button
              onClick={goToNextYear}
              disabled={isCurrentYearShowing}
              className={`p-1 rounded transition-colors ${
                isCurrentYearShowing 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:bg-gray-100 dark:hover:bg-white/5"
              } ${txt}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Meses del año */}
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, idx) => {
              const isSelected = isMonthSelected(idx);
              const isCurrent = isCurrentMonth(idx);
              const isFuture = isMonthInFuture(idx);

              return (
                <button
                  key={idx}
                  onClick={() => !isFuture && selectMonth(idx)}
                  disabled={isFuture}
                  className={`
                    w-full h-10 rounded-lg text-sm font-medium transition-colors
                    ${isSelected 
                      ? "bg-[#E8692E] text-white hover:bg-[#d65e28]" 
                      : isCurrent
                      ? `border-2 border-[#E8692E] ${txt} hover:bg-gray-100 dark:hover:bg-white/5`
                      : isFuture
                      ? `${isLight ? "bg-gray-200 text-gray-400" : "bg-white/5 text-gray-600"} cursor-not-allowed`
                      : `${txt} hover:bg-gray-100 dark:hover:bg-white/5`
                    }
                  `}
                >
                  {month}
                </button>
              );
            })}
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={clearSelection}
              className={`text-sm ${sub} hover:text-gray-700 dark:hover:text-gray-300 transition-colors`}
            >
              Borrar
            </button>
            <button
              onClick={selectCurrentMonth}
              className="px-4 py-2 bg-[#E8692E] text-white text-sm font-medium rounded-lg hover:bg-[#d65e28] transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}