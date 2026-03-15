import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  isLight?: boolean;
}

export function DatePicker({ value, onChange, placeholder = "Seleccionar fecha", isLight = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-1.5 border rounded-lg text-sm flex items-center gap-2 ${
          isLight
            ? "bg-white border-gray-200 text-gray-900"
            : "bg-white/5 border-white/10 text-white"
        }`}
      >
        <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className={`flex-1 text-left truncate ${value ? "" : "text-gray-500"}`}>
          {value ? format(value, "dd/MM/yyyy", { locale: es }) : placeholder}
        </span>
        {value && (
          <X
            className="w-4 h-4 text-gray-400 hover:text-gray-600 flex-shrink-0"
            onClick={handleClear}
          />
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute top-full mt-2 z-50 rounded-lg shadow-lg border p-3 ${
              isLight
                ? "bg-white border-gray-200"
                : "bg-[#1a2936] border-white/10"
            }`}
            style={{
              maxWidth: "320px",
            }}
          >
            <style>{`
              .rdp {
                --rdp-cell-size: 36px;
                --rdp-accent-color: #E8692E;
                --rdp-background-color: rgba(232, 105, 46, 0.1);
                margin: 0;
              }
              .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                background-color: ${isLight ? "#f3f4f6" : "rgba(255, 255, 255, 0.05)"};
              }
              .rdp-day_selected {
                background-color: #E8692E !important;
                color: white !important;
              }
              .rdp-day_selected:hover {
                background-color: #d65a24 !important;
              }
              .rdp-caption {
                color: ${isLight ? "#111827" : "#ffffff"};
                margin-bottom: 0.5rem;
              }
              .rdp-head_cell {
                color: ${isLight ? "#6b7280" : "#9ca3af"};
                font-weight: 600;
                font-size: 0.75rem;
              }
              .rdp-cell {
                color: ${isLight ? "#374151" : "#d1d5db"};
              }
              .rdp-button {
                border-radius: 0.375rem;
                font-size: 0.875rem;
              }
              .rdp-nav_button {
                color: ${isLight ? "#6b7280" : "#9ca3af"};
              }
              .rdp-nav_button:hover {
                background-color: ${isLight ? "#f3f4f6" : "rgba(255, 255, 255, 0.05)"};
              }
              .rdp-day_disabled {
                color: ${isLight ? "#d1d5db" : "#4b5563"};
              }
              .rdp-day_outside {
                color: ${isLight ? "#d1d5db" : "#4b5563"};
              }
            `}</style>
            <DayPicker
              mode="single"
              selected={value}
              onSelect={handleSelect}
              locale={es}
              showOutsideDays
            />
          </div>
        </>
      )}
    </div>
  );
}