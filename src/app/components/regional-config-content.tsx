import { useState } from "react";
import { Globe, Calendar, Clock, Check, Languages, DollarSign } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { SysTabBar, SysTab } from "./ui/sys-tab-bar";

const REGIONAL_TABS: SysTab[] = [
  { id: "locale",   label: "Idioma y País",    icon: Languages  },
  { id: "datetime", label: "Fecha y Hora",     icon: Calendar   },
  { id: "numbers",  label: "Números y Moneda", icon: DollarSign },
  { id: "timezone", label: "Zona Horaria",     icon: Clock      },
];

export function RegionalConfigContent() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("locale");
  const [saved,     setSaved]     = useState(false);

  // ── Idioma y País ──
  const [language, setLanguage] = useState("es");
  const [country,  setCountry]  = useState("EC");

  // ── Fecha y Hora ──
  const [dateFormat,     setDateFormat]     = useState("DD/MM/YYYY");
  const [timeFormat,     setTimeFormat]     = useState("24");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("monday");

  // ── Números y Moneda ──
  const [currency,          setCurrency]          = useState("USD");
  const [currencyPosition,  setCurrencyPosition]  = useState("before");
  const [decimalSeparator,  setDecimalSeparator]  = useState(".");
  const [thousandSeparator, setThousandSeparator] = useState(",");
  const [decimals,          setDecimals]          = useState("2");

  // ── Zona Horaria ──
  const [timezone, setTimezone] = useState("America/Guayaquil");

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const isLight = theme === "light";
  const D    = `border-t ${isLight ? "border-gray-200" : "border-white/10"}`;
  const txt  = isLight ? "text-gray-900" : "text-white";
  const sub  = isLight ? "text-gray-500" : "text-gray-400";
  const lbl  = isLight ? "text-gray-600" : "text-gray-300";
  const card = `rounded-2xl p-6 border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const sec  = `rounded-xl p-4 border mb-5 ${isLight ? "border-gray-100 bg-gray-50" : "border-white/8 bg-white/[0.03]"}`;
  const SH   = `text-xs font-semibold uppercase tracking-wide mb-3 ${isLight ? "text-gray-400" : "text-gray-500"}`;
  const IN   = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const OB   = isLight ? "" : "bg-[#0D1B2A]";

  const Field = ({ label, children, colSpan }: { label: string; children: React.ReactNode; colSpan?: string }) => (
    <div className={colSpan}>
      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 w-full">

      <div className={D} />

      {/* BOTÓN GUARDAR */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 ${saved ? "bg-green-500" : "bg-primary hover:bg-primary/90"} text-white`}
        >
          {saved ? <><Check className="w-4 h-4" /> Guardado</> : "Guardar Cambios"}
        </button>
      </div>

      <SysTabBar tabs={REGIONAL_TABS} active={activeTab} onChange={setActiveTab} />

      {/* ══ IDIOMA Y PAÍS ══ */}
      {activeTab === "locale" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Languages className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Idioma y País</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Idioma del Sistema">
              <select value={language} onChange={e => setLanguage(e.target.value)} className={IN}>
                <option value="es" className={OB}>Español</option>
                <option value="en" className={OB}>English</option>
                <option value="pt" className={OB}>Português</option>
              </select>
            </Field>
            <Field label="País">
              <select value={country} onChange={e => setCountry(e.target.value)} className={IN}>
                <option value="EC" className={OB}>Ecuador</option>
                <option value="CO" className={OB}>Colombia</option>
                <option value="PE" className={OB}>Perú</option>
                <option value="MX" className={OB}>México</option>
                <option value="AR" className={OB}>Argentina</option>
                <option value="CL" className={OB}>Chile</option>
                <option value="VE" className={OB}>Venezuela</option>
                <option value="BO" className={OB}>Bolivia</option>
                <option value="PY" className={OB}>Paraguay</option>
                <option value="UY" className={OB}>Uruguay</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {/* ══ FECHA Y HORA ══ */}
      {activeTab === "datetime" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Fecha y Hora</h3>
          </div>

          <div className={sec} style={{ marginBottom: 0 }}>
            <p className={SH}>Formatos</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Formato de Fecha">
                <select value={dateFormat} onChange={e => setDateFormat(e.target.value)} className={IN}>
                  <option value="DD/MM/YYYY" className={OB}>DD/MM/YYYY — 16/02/2026</option>
                  <option value="MM/DD/YYYY" className={OB}>MM/DD/YYYY — 02/16/2026</option>
                  <option value="YYYY-MM-DD" className={OB}>YYYY-MM-DD — 2026-02-16</option>
                  <option value="DD-MM-YYYY" className={OB}>DD-MM-YYYY — 16-02-2026</option>
                </select>
              </Field>
              <Field label="Formato de Hora">
                <select value={timeFormat} onChange={e => setTimeFormat(e.target.value)} className={IN}>
                  <option value="24" className={OB}>24 horas — 14:30</option>
                  <option value="12" className={OB}>12 horas — 02:30 PM</option>
                </select>
              </Field>
              <Field label="Primer Día de la Semana">
                <select value={firstDayOfWeek} onChange={e => setFirstDayOfWeek(e.target.value)} className={IN}>
                  <option value="monday"    className={OB}>Lunes</option>
                  <option value="tuesday"   className={OB}>Martes</option>
                  <option value="wednesday" className={OB}>Miércoles</option>
                  <option value="thursday"  className={OB}>Jueves</option>
                  <option value="friday"    className={OB}>Viernes</option>
                  <option value="saturday"  className={OB}>Sábado</option>
                  <option value="sunday"    className={OB}>Domingo</option>
                </select>
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* ══ NÚMEROS Y MONEDA ══ */}
      {activeTab === "numbers" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Números y Moneda</h3>
          </div>

          <div className={sec}>
            <p className={SH}>Moneda</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Moneda">
                <select value={currency} onChange={e => setCurrency(e.target.value)} className={IN}>
                  <option value="USD" className={OB}>USD — Dólar Estadounidense ($)</option>
                  <option value="COP" className={OB}>COP — Peso Colombiano ($)</option>
                  <option value="PEN" className={OB}>PEN — Sol Peruano (S/.)</option>
                  <option value="MXN" className={OB}>MXN — Peso Mexicano ($)</option>
                  <option value="ARS" className={OB}>ARS — Peso Argentino ($)</option>
                  <option value="CLP" className={OB}>CLP — Peso Chileno ($)</option>
                </select>
              </Field>
              <Field label="Posición del Símbolo">
                <select value={currencyPosition} onChange={e => setCurrencyPosition(e.target.value)} className={IN}>
                  <option value="before" className={OB}>Antes del número — $ 1,234.56</option>
                  <option value="after"  className={OB}>Después del número — 1,234.56 $</option>
                </select>
              </Field>
            </div>
          </div>

          <div className={sec} style={{ marginBottom: 0 }}>
            <p className={SH}>Separadores y Decimales</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Separador Decimal">
                <select value={decimalSeparator} onChange={e => setDecimalSeparator(e.target.value)} className={IN}>
                  <option value="." className={OB}>Punto  —  1234.56</option>
                  <option value="," className={OB}>Coma   —  1234,56</option>
                </select>
              </Field>
              <Field label="Separador de Miles">
                <select value={thousandSeparator} onChange={e => setThousandSeparator(e.target.value)} className={IN}>
                  <option value="," className={OB}>Coma   —  1,234.56</option>
                  <option value="." className={OB}>Punto  —  1.234,56</option>
                  <option value=" " className={OB}>Espacio — 1 234.56</option>
                  <option value=""  className={OB}>Ninguno — 1234.56</option>
                </select>
              </Field>
              <Field label="Decimales a Mostrar">
                <select value={decimals} onChange={e => setDecimals(e.target.value)} className={IN}>
                  <option value="0" className={OB}>0 decimales — 1,235</option>
                  <option value="2" className={OB}>2 decimales — 1,234.56</option>
                  <option value="3" className={OB}>3 decimales — 1,234.567</option>
                  <option value="4" className={OB}>4 decimales — 1,234.5678</option>
                </select>
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* ══ ZONA HORARIA ══ */}
      {activeTab === "timezone" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Zona Horaria</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Field label="Zona Horaria">
              <select value={timezone} onChange={e => setTimezone(e.target.value)} className={IN}>
                <optgroup label="América del Sur">
                  <option value="America/Guayaquil"              className={OB}>GMT-5 — Ecuador (Guayaquil / Quito)</option>
                  <option value="America/Bogota"                 className={OB}>GMT-5 — Colombia (Bogotá)</option>
                  <option value="America/Lima"                   className={OB}>GMT-5 — Perú (Lima)</option>
                  <option value="America/La_Paz"                 className={OB}>GMT-4 — Bolivia (La Paz)</option>
                  <option value="America/Caracas"                className={OB}>GMT-4 — Venezuela (Caracas)</option>
                  <option value="America/Santiago"               className={OB}>GMT-3 — Chile (Santiago)</option>
                  <option value="America/Argentina/Buenos_Aires" className={OB}>GMT-3 — Argentina (Buenos Aires)</option>
                  <option value="America/Asuncion"               className={OB}>GMT-3 — Paraguay (Asunción)</option>
                  <option value="America/Montevideo"             className={OB}>GMT-3 — Uruguay (Montevideo)</option>
                  <option value="America/Sao_Paulo"              className={OB}>GMT-3 — Brasil (São Paulo)</option>
                </optgroup>
                <optgroup label="América del Norte">
                  <option value="America/Mexico_City"            className={OB}>GMT-6 — México (Ciudad de México)</option>
                  <option value="America/New_York"               className={OB}>GMT-5 — EE.UU. Este (Nueva York)</option>
                  <option value="America/Chicago"                className={OB}>GMT-6 — EE.UU. Centro (Chicago)</option>
                  <option value="America/Denver"                 className={OB}>GMT-7 — EE.UU. Montaña (Denver)</option>
                  <option value="America/Los_Angeles"            className={OB}>GMT-8 — EE.UU. Pacífico (Los Ángeles)</option>
                </optgroup>
                <optgroup label="Europa">
                  <option value="Europe/Madrid"                  className={OB}>GMT+1 — España (Madrid)</option>
                  <option value="Europe/London"                  className={OB}>GMT+0 — Reino Unido (Londres)</option>
                </optgroup>
              </select>
            </Field>
          </div>
        </div>
      )}

    </div>
  );
}
