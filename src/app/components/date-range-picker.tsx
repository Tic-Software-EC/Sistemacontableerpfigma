import { useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useTheme } from "../contexts/theme-context";

interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
}

/** Convierte "YYYY-MM-DD" → "DD/MM/YYYY" para mostrar en el botón */
function formatDisplay(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

/** Convierte Date → "YYYY-MM-DD" sin problemas de zona horaria */
function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Convierte "YYYY-MM-DD" → Date forzando medianoche local */
function fromIso(iso: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: DateRangePickerProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo,   setOpenTo]   = useState(false);

  const selectedFrom = fromIso(dateFrom);
  const selectedTo   = fromIso(dateTo);

  const btnBase = `w-full px-3 py-2 rounded-lg text-sm border flex items-center justify-between gap-2 transition-colors ${
    isLight
      ? "bg-white border-gray-300 text-gray-900 hover:border-primary/60"
      : "bg-white/5 border-white/10 text-white hover:border-primary/40"
  }`;

  const todayIso = toIso(new Date());

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ── Fecha Desde ─────────────────────────────────────────────── */}
      <div>
        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
          Desde
        </label>
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <button className={btnBase}>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className={dateFrom ? "" : "text-gray-400"}>
                  {dateFrom ? formatDisplay(dateFrom) : "Seleccionar fecha"}
                </span>
              </div>
              {dateFrom && (
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); onDateFromChange(""); }}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className={`p-3 rounded-xl ${isLight ? "bg-white" : "bg-[#1a2332]"}`}>
              <Calendar
                mode="single"
                selected={selectedFrom}
                onSelect={(date) => {
                  if (date) { onDateFromChange(toIso(date)); setOpenFrom(false); }
                }}
                initialFocus
                classNames={{
                  months: "flex flex-col gap-2",
                  month:  "flex flex-col gap-3",
                  caption: "flex justify-center pt-1 relative items-center w-full",
                  caption_label: `text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`,
                  nav: "flex items-center gap-1",
                  nav_button: `size-8 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-lg ${isLight ? "hover:bg-gray-100" : "hover:bg-white/10"} transition-colors inline-flex items-center justify-center`,
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell: `${isLight ? "text-gray-400" : "text-gray-500"} rounded-md w-9 font-medium text-xs uppercase`,
                  row: "flex w-full mt-1",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  day: `size-9 p-0 font-normal rounded-lg ${isLight ? "hover:bg-gray-100 text-gray-900" : "hover:bg-white/10 text-white"} transition-colors inline-flex items-center justify-center`,
                  day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white font-semibold",
                  day_today: `font-bold ${isLight ? "bg-orange-50 text-primary" : "bg-primary/20 text-primary"}`,
                  day_outside: "opacity-30",
                  day_disabled: "opacity-20",
                  day_hidden: "invisible",
                }}
              />
              <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isLight ? "border-gray-100" : "border-white/10"}`}>
                <button
                  onClick={() => { onDateFromChange(""); setOpenFrom(false); }}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}
                >
                  Borrar
                </button>
                <button
                  onClick={() => { onDateFromChange(todayIso); setOpenFrom(false); }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
                >
                  Hoy
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* ── Fecha Hasta ─────────────────────────────────────────────── */}
      <div>
        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
          Hasta
        </label>
        <Popover open={openTo} onOpenChange={setOpenTo}>
          <PopoverTrigger asChild>
            <button className={btnBase}>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className={dateTo ? "" : "text-gray-400"}>
                  {dateTo ? formatDisplay(dateTo) : "Seleccionar fecha"}
                </span>
              </div>
              {dateTo && (
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); onDateToChange(""); }}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className={`p-3 rounded-xl ${isLight ? "bg-white" : "bg-[#1a2332]"}`}>
              <Calendar
                mode="single"
                selected={selectedTo}
                onSelect={(date) => {
                  if (date) { onDateToChange(toIso(date)); setOpenTo(false); }
                }}
                initialFocus
                classNames={{
                  months: "flex flex-col gap-2",
                  month:  "flex flex-col gap-3",
                  caption: "flex justify-center pt-1 relative items-center w-full",
                  caption_label: `text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`,
                  nav: "flex items-center gap-1",
                  nav_button: `size-8 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-lg ${isLight ? "hover:bg-gray-100" : "hover:bg-white/10"} transition-colors inline-flex items-center justify-center`,
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell: `${isLight ? "text-gray-400" : "text-gray-500"} rounded-md w-9 font-medium text-xs uppercase`,
                  row: "flex w-full mt-1",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  day: `size-9 p-0 font-normal rounded-lg ${isLight ? "hover:bg-gray-100 text-gray-900" : "hover:bg-white/10 text-white"} transition-colors inline-flex items-center justify-center`,
                  day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white font-semibold",
                  day_today: `font-bold ${isLight ? "bg-orange-50 text-primary" : "bg-primary/20 text-primary"}`,
                  day_outside: "opacity-30",
                  day_disabled: "opacity-20",
                  day_hidden: "invisible",
                }}
              />
              <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isLight ? "border-gray-100" : "border-white/10"}`}>
                <button
                  onClick={() => { onDateToChange(""); setOpenTo(false); }}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}
                >
                  Borrar
                </button>
                <button
                  onClick={() => { onDateToChange(todayIso); setOpenTo(false); }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
                >
                  Hoy
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
