import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function DatePicker({ value, onChange, placeholder, isLight }: {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  isLight: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split("T")[0];
      onChange(isoDate);
      setOpen(false);
    }
  };

  const handleClear = () => {
    setDate(undefined);
    onChange("");
    setOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    setDate(today);
    onChange(today.toISOString().split("T")[0]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs transition-all min-w-[140px] ${isLight ? "bg-white border-gray-300 text-gray-700 hover:border-primary" : "bg-[#0d1724] border-white/10 text-gray-300 hover:border-primary/50"}`}>
          <CalendarIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className={date ? "" : "text-gray-500"}>
            {date ? formatDate(date) : (placeholder || "Seleccionar")}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className={`w-auto p-0 ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"}`} align="start">
        <div className={`p-3 ${isLight ? "bg-white" : "bg-[#1a2332]"}`}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            className={isLight ? "" : "text-white"}
          />
          <div className={`flex items-center justify-between gap-2 mt-3 pt-3 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <button
              onClick={handleClear}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}
            >
              Borrar
            </button>
            <button
              onClick={handleToday}
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
