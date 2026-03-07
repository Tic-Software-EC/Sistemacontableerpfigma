import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface YearPickerProps {
  dateFrom: string; // YYYY-MM-DD format
  dateTo: string; // YYYY-MM-DD format
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  placeholder?: string;
}

export function YearPicker({ dateFrom, dateTo, onDateFromChange, onDateToChange, placeholder = "Seleccionar año" }: YearPickerProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Generar rango de años (últimos 10 años desde el actual)
  const startYear = currentYear - 9;
  const years = Array.from({ length: 10 }, (_, i) => startYear + i);

  // Parsear la fecha seleccionada (usamos dateTo para determinar el año)
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

  // Formatear la fecha para mostrar solo el año
  const formatDisplayDate = () => {
    if (!selectedDate) return "";
    return selectedDate.getFullYear().toString();
  };

  // Seleccionar un año
  const selectYear = (year: number) => {
    const isCurrentYear = year === currentYear;
    
    // Fecha desde: siempre el 1 de enero
    const dateFromStr = `${year}-01-01`;
    
    // Fecha hasta: 
    // - Si es el año actual: hasta hoy
    // - Si es un año pasado: hasta el 31 de diciembre
    let dateToStr: string;
    if (isCurrentYear) {
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      dateToStr = `${year}-${month}-${day}`;
    } else {
      dateToStr = `${year}-12-31`;
    }
    
    onDateFromChange(dateFromStr);
    onDateToChange(dateToStr);
    setIsOpen(false);
  };

  // Seleccionar año actual
  const selectCurrentYear = () => {
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    
    // Desde el 1 de enero del año actual hasta hoy
    onDateFromChange(`${currentYear}-01-01`);
    onDateToChange(`${currentYear}-${month}-${day}`);
    setIsOpen(false);
  };

  // Limpiar selección
  const clearSelection = () => {
    onDateFromChange("");
    onDateToChange("");
    setIsOpen(false);
  };

  // Verificar si un año es el seleccionado
  const isYearSelected = (year: number) => {
    if (!selectedDate) return false;
    return selectedDate.getFullYear() === year;
  };

  // Verificar si un año es el actual
  const isCurrentYearCheck = (year: number) => {
    return year === currentYear;
  };

  // Verificar si un año está en el futuro (no se puede seleccionar)
  const isYearInFuture = (year: number) => {
    return year > currentYear;
  };

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const inp = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const popup = `absolute top-full left-0 mt-2 rounded-lg border shadow-xl z-50 ${isLight ? "bg-white border-gray-200" : "bg-[#0f1825] border-white/10"}`;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={formatDisplayDate()}
          placeholder={placeholder}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className={`${inp} w-full cursor-pointer pr-20`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {dateTo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ${sub}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              selectCurrentYear();
            }}
            className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${isLight ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
          >
            Hoy
          </button>
          <Calendar className={`w-4 h-4 ${sub}`} />
        </div>
      </div>

      {/* Popup */}
      {isOpen && (
        <div className={`${popup} p-4 w-80`}>
          {/* Header */}
          <div className="mb-4">
            <h3 className={`text-sm font-bold ${txt}`}>Seleccionar Año</h3>
            <p className={`text-xs mt-1 ${sub}`}>Del 1 de enero al 31 de diciembre</p>
          </div>

          {/* Años */}
          <div className="grid grid-cols-5 gap-2">
            {years.map((year) => {
              const isSelected = isYearSelected(year);
              const isCurrent = isCurrentYearCheck(year);
              const isFuture = isYearInFuture(year);

              return (
                <button
                  key={year}
                  onClick={() => !isFuture && selectYear(year)}
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
                  {year}
                </button>
              );
            })}
          </div>

          {/* Nota para año actual */}
          <div className={`mt-4 pt-3 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <p className={`text-xs ${sub}`}>
              * El año actual muestra datos hasta el día de hoy ({today.getDate()}/{today.getMonth() + 1}/{currentYear})
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
