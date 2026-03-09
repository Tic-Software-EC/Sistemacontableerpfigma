import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

/** Convierte Date → "YYYY-MM-DD" sin zona horaria */
function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Convierte "YYYY-MM-DD" → "DD/MM/YYYY" para mostrar */
function formatDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function DatePicker({ value, onChange, placeholder, isLight }: {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  isLight: boolean;
}) {
  const [open, setOpen] = useState(false);

  const selected = value ? (() => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  })() : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(toIso(date));
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs transition-all w-full ${isLight ? "bg-white border-gray-300 text-gray-700 hover:border-primary" : "bg-[#0d1724] border-white/10 text-gray-300 hover:border-primary/50"}`}>
          <CalendarIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className={value ? "" : "text-gray-500"}>
            {value ? formatDisplay(value) : (placeholder || "Seleccionar")}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className={`w-auto p-0 ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"}`} align="start">
        <div className={`p-3 ${isLight ? "bg-white" : "bg-[#1a2332]"}`}>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            initialFocus
            className={isLight ? "" : "text-white"}
          />
          <div className={`flex items-center justify-between gap-2 mt-3 pt-3 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <button
              onClick={() => { onChange(""); setOpen(false); }}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}
            >
              Borrar
            </button>
            <button
              onClick={() => { onChange(toIso(new Date())); setOpen(false); }}
              className="text-xs px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white transition-colors"
            >
              Hoy
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}