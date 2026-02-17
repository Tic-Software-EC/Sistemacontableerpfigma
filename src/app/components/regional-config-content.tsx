import { useState } from "react";
import { Globe, Calendar } from "lucide-react";

export function RegionalConfigContent() {
  const [language, setLanguage] = useState("es");
  const [country, setCountry] = useState("EC");
  const [timezone, setTimezone] = useState("America/Guayaquil");
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("24");
  const [decimalSeparator, setDecimalSeparator] = useState(".");
  const [thousandSeparator, setThousandSeparator] = useState(",");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("monday");
  const [paperSize, setPaperSize] = useState("A4");

  const handleSave = () => {
    console.log("Guardando configuración regional...");
    alert("Configuración guardada exitosamente");
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2">
            Configuración Regional
          </h2>
          <p className="text-gray-400 text-sm">
            Personaliza el idioma, zona horaria y formatos del sistema
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium"
        >
          Guardar Cambios
        </button>
      </div>

      <div className="border-t border-white/10"></div>

      {/* Idioma y Ubicación */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-white font-bold text-xl">Idioma y Ubicación</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Idioma del Sistema
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              País
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="EC">Ecuador</option>
              <option value="CO">Colombia</option>
              <option value="PE">Perú</option>
              <option value="MX">México</option>
              <option value="AR">Argentina</option>
              <option value="CL">Chile</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Zona Horaria
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="America/Guayaquil">GMT-5 (Ecuador)</option>
              <option value="America/Bogota">GMT-5 (Colombia)</option>
              <option value="America/Lima">GMT-5 (Perú)</option>
              <option value="America/Mexico_City">GMT-6 (México)</option>
              <option value="America/Buenos_Aires">GMT-3 (Argentina)</option>
              <option value="America/Santiago">GMT-3 (Chile)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Moneda
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="USD">USD - Dólar Estadounidense</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="PEN">PEN - Sol Peruano</option>
              <option value="MXN">MXN - Peso Mexicano</option>
              <option value="ARS">ARS - Peso Argentino</option>
              <option value="CLP">CLP - Peso Chileno</option>
            </select>
          </div>
        </div>
      </div>

      {/* Formatos de Fecha y Hora */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-white font-bold text-xl">Formatos de Fecha y Hora</h3>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Formato de Fecha
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (16/02/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (02/16/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-02-16)</option>
              <option value="DD-MM-YYYY">DD-MM-YYYY (16-02-2026)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Formato de Hora
            </label>
            <select
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="24">24 horas (14:30)</option>
              <option value="12">12 horas (02:30 PM)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Separador Decimal
            </label>
            <select
              value={decimalSeparator}
              onChange={(e) => setDecimalSeparator(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value=".">Punto (1234.56)</option>
              <option value=",">Coma (1234,56)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Separador de Miles
            </label>
            <select
              value={thousandSeparator}
              onChange={(e) => setThousandSeparator(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value=",">Coma (1,234.56)</option>
              <option value=".">Punto (1.234,56)</option>
              <option value=" ">Espacio (1 234.56)</option>
              <option value="">Ninguno (1234.56)</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Primer Día de la Semana
            </label>
            <select
              value={firstDayOfWeek}
              onChange={(e) => setFirstDayOfWeek(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="monday">Lunes</option>
              <option value="sunday">Domingo</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Tamaño de Papel
            </label>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="A4">A4 (210 x 297 mm)</option>
              <option value="Letter">Letter (216 x 279 mm)</option>
              <option value="Legal">Legal (216 x 356 mm)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
