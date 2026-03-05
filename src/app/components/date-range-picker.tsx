import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useTheme } from "../contexts/theme-context";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
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
  const [openTo, setOpenTo] = useState(false);

  const selectedDateFrom = dateFrom ? new Date(dateFrom + "T00:00:00") : undefined;
  const selectedDateTo = dateTo ? new Date(dateTo + "T00:00:00") : undefined;

  const handleFromSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onDateFromChange(`${year}-${month}-${day}`);
      setOpenFrom(false);
    }
  };

  const handleToSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      onDateToChange(`${year}-${month}-${day}`);
      setOpenTo(false);
    }
  };

  const clearFrom = () => {
    onDateFromChange("");
    setOpenFrom(false);
  };

  const clearTo = () => {
    onDateToChange("");
    setOpenTo(false);
  };

  const setTodayFrom = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    onDateFromChange(`${year}-${month}-${day}`);
    setOpenFrom(false);
  };

  const setTodayTo = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    onDateToChange(`${year}-${month}-${day}`);
    setOpenTo(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Fecha Desde */}
      <div>
        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
          Desde
        </label>
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <button
              className={`w-full px-3 py-2 rounded-lg text-sm border flex items-center justify-between ${
                isLight
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-white/5 border-white/10 text-white"
              }`}
            >
              <span>
                {selectedDateFrom
                  ? format(selectedDateFrom, "PPP", { locale: es })
                  : "Seleccionar fecha"}
              </span>
              <CalendarIcon className="w-4 h-4 ml-2" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <Calendar
                mode="single"
                selected={selectedDateFrom}
                onSelect={handleFromSelect}
                initialFocus
                locale={es}
                classNames={{
                  months: "flex flex-col sm:flex-row gap-2",
                  month: "flex flex-col gap-4",
                  caption: "flex justify-center pt-1 relative items-center w-full",
                  caption_label: "text-base font-semibold",
                  nav: "flex items-center gap-1",
                  nav_button: "size-9 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell: "text-gray-500 rounded-md w-9 font-medium text-xs uppercase",
                  row: "flex w-full mt-1",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  day: "size-9 p-0 font-normal rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center",
                  day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white font-semibold rounded-xl",
                  day_today: "bg-gray-100 font-semibold",
                  day_outside: "text-gray-300 opacity-50",
                  day_disabled: "text-gray-300 opacity-30",
                  day_hidden: "invisible",
                }}
              />
            </div>
            <div className="flex items-center justify-between px-4 pb-4 border-t pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFrom}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Borrar
              </Button>
              <Button
                size="sm"
                onClick={setTodayFrom}
                className="text-sm bg-primary hover:bg-primary/90 text-white rounded-lg px-4"
              >
                Hoy
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Fecha Hasta */}
      <div>
        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
          Hasta
        </label>
        <Popover open={openTo} onOpenChange={setOpenTo}>
          <PopoverTrigger asChild>
            <button
              className={`w-full px-3 py-2 rounded-lg text-sm border flex items-center justify-between ${
                isLight
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-white/5 border-white/10 text-white"
              }`}
            >
              <span>
                {selectedDateTo
                  ? format(selectedDateTo, "PPP", { locale: es })
                  : "Seleccionar fecha"}
              </span>
              <CalendarIcon className="w-4 h-4 ml-2" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <Calendar
                mode="single"
                selected={selectedDateTo}
                onSelect={handleToSelect}
                initialFocus
                locale={es}
                classNames={{
                  months: "flex flex-col sm:flex-row gap-2",
                  month: "flex flex-col gap-4",
                  caption: "flex justify-center pt-1 relative items-center w-full",
                  caption_label: "text-base font-semibold",
                  nav: "flex items-center gap-1",
                  nav_button: "size-9 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell: "text-gray-500 rounded-md w-9 font-medium text-xs uppercase",
                  row: "flex w-full mt-1",
                  cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                  day: "size-9 p-0 font-normal rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center",
                  day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white font-semibold rounded-xl",
                  day_today: "bg-gray-100 font-semibold",
                  day_outside: "text-gray-300 opacity-50",
                  day_disabled: "text-gray-300 opacity-30",
                  day_hidden: "invisible",
                }}
              />
            </div>
            <div className="flex items-center justify-between px-4 pb-4 border-t pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearTo}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Borrar
              </Button>
              <Button
                size="sm"
                onClick={setTodayTo}
                className="text-sm bg-primary hover:bg-primary/90 text-white rounded-lg px-4"
              >
                Hoy
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
