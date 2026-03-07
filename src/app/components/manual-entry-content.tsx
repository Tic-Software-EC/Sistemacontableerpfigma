import { useState } from "react";
import { Plus, Trash2, Save, CheckCircle, AlertTriangle, Calendar, FileText, Tag, Hash } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useAccounting, type AsientoLinea } from "../contexts/accounting-context";
import { toast } from "sonner";
import { DatePicker } from "./date-picker-range";

const CUENTAS_DISPONIBLES = [
  { codigo: "1.1.1.01", nombre: "Caja General" },
  { codigo: "1.1.1.02", nombre: "Banco Pichincha" },
  { codigo: "1.1.2.01", nombre: "Cuentas por Cobrar" },
  { codigo: "1.1.3.01", nombre: "IVA en Compras" },
  { codigo: "1.1.4.01", nombre: "Inventario" },
  { codigo: "2.1.1.01", nombre: "Cuentas por Pagar" },
  { codigo: "2.1.3.01", nombre: "IVA por Pagar" },
  { codigo: "4.1.1.01", nombre: "Ventas" },
  { codigo: "5.1.1.01", nombre: "Sueldos y Salarios" },
];

const TIPOS = ["Ajuste", "Cierre", "Corrección", "Reclasificación", "Otro"];

interface LineaExtendida extends AsientoLinea {
  id: string;
}

export function ManualEntryContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { addAsiento } = useAccounting();

  const [descripcion, setDescripcion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipo, setTipo] = useState("Ajuste");
  const [fecha, setFecha] = useState("2026-03-07");
  const [lineas, setLineas] = useState<LineaExtendida[]>([
    { id: crypto.randomUUID(), cuenta: "", nombre: "", debe: 0, haber: 0 }
  ]);

  const addLinea = () => {
    setLineas([...lineas, { id: crypto.randomUUID(), cuenta: "", nombre: "", debe: 0, haber: 0 }]);
  };

  const removeLinea = (id: string) => {
    if (lineas.length > 1) {
      setLineas(lineas.filter(l => l.id !== id));
    }
  };

  const updateLinea = (id: string, field: keyof AsientoLinea, value: string | number) => {
    setLineas(lineas.map(l => {
      if (l.id !== id) return l;
      if (field === "cuenta") {
        const cuenta = CUENTAS_DISPONIBLES.find(c => c.codigo === value);
        return { ...l, cuenta: String(value), nombre: cuenta ? cuenta.nombre : l.nombre };
      }
      return { ...l, [field]: value };
    }));
  };

  const handleSave = () => {
    if (!descripcion.trim()) {
      toast.error("La descripción es obligatoria");
      return;
    }

    const lineasValidas = lineas.filter(l => l.cuenta);
    if (lineasValidas.length === 0) {
      toast.error("Debe agregar al menos una línea con cuenta");
      return;
    }

    const totalDebe = lineasValidas.reduce((s, l) => s + (l.debe || 0), 0);
    const totalHaber = lineasValidas.reduce((s, l) => s + (l.haber || 0), 0);

    if (Math.abs(totalDebe - totalHaber) >= 0.01) {
      toast.error("El asiento no está balanceado (Debe ≠ Haber)");
      return;
    }

    addAsiento({
      fecha,
      tipo,
      descripcion,
      referencia,
      origen: "manual",
      autoGenerado: false,
      estado: "borrador",
      debe: totalDebe,
      haber: totalHaber,
      lineas: lineasValidas.map(({ id, ...rest }) => rest),
    });

    toast.success("Asiento manual creado exitosamente");
    
    // Limpiar formulario
    setDescripcion("");
    setReferencia("");
    setLineas([{ id: crypto.randomUUID(), cuenta: "", nombre: "", debe: 0, haber: 0 }]);
  };

  const handleReset = () => {
    setDescripcion("");
    setReferencia("");
    setTipo("Ajuste");
    setFecha("2026-03-07");
    setLineas([{ id: crypto.randomUUID(), cuenta: "", nombre: "", debe: 0, haber: 0 }]);
    toast.info("Formulario reiniciado");
  };

  const totalDebe = lineas.reduce((s, l) => s + (l.debe || 0), 0);
  const totalHaber = lineas.reduce((s, l) => s + (l.haber || 0), 0);
  const isBalanced = Math.abs(totalDebe - totalHaber) < 0.01;

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const inp = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const opt = "bg-[#0D1B2A]";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Crear Asiento Manual</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>Para registros contables que no se generan automáticamente</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            Limpiar
          </button>
          <button onClick={handleSave} disabled={!isBalanced || !descripcion.trim()} className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors">
            <Save className="w-4 h-4" />
            Guardar Asiento
          </button>
        </div>
      </div>

      {/* Formulario Principal */}
      <div className={card}>
        <div className="p-5 space-y-5">
          {/* Información General del Asiento */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-primary/10" : "bg-primary/15"}`}>
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <h3 className={`text-sm font-bold ${txt}`}>Información General del Asiento</h3>
            </div>

            <div className="grid grid-cols-[160px_180px_180px_520px] gap-2">
              {/* Fecha */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${txt}`}>
                  Fecha <span className="text-red-500">*</span>
                </label>
                <DatePicker 
                  value={fecha} 
                  onChange={setFecha} 
                  placeholder="Seleccionar fecha"
                  isLight={isLight}
                />
              </div>

              {/* Tipo */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${txt}`}>
                  Tipo de Asiento <span className="text-red-500">*</span>
                </label>
                <select value={tipo} onChange={e => setTipo(e.target.value)} className={inp}>
                  {TIPOS.map(t => <option key={t} value={t} className={opt}>{t}</option>)}
                </select>
              </div>

              {/* Referencia */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${txt}`}>
                  Referencia
                </label>
                <input 
                  type="text" 
                  value={referencia} 
                  onChange={e => setReferencia(e.target.value)} 
                  placeholder="Ej: DOC-2026-001" 
                  className={inp} 
                />
              </div>

              {/* Descripción */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${txt}`}>
                  Descripción <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={descripcion} 
                  onChange={e => setDescripcion(e.target.value)} 
                  placeholder="Descripción del asiento contable..." 
                  className={inp}
                />
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`}></div>

          {/* Líneas Contables */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={`text-sm font-semibold ${txt}`}>Líneas Contables</label>
              <button 
                onClick={addLinea} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> Añadir línea
              </button>
            </div>

            {/* Tabla de Líneas */}
            <div className="space-y-0">
              {/* Headers */}
              <div className={`grid grid-cols-[1fr_140px_140px_40px] gap-3 px-4 py-2.5 border-b ${isLight ? "bg-gray-50/80 border-gray-200" : "bg-white/[0.02] border-white/10"}`}>
                <div className={`text-xs font-semibold uppercase tracking-wide ${sub}`}>Cuenta</div>
                <div className={`text-xs font-semibold uppercase tracking-wide text-right ${sub}`}>Debe</div>
                <div className={`text-xs font-semibold uppercase tracking-wide text-right ${sub}`}>Haber</div>
                <div></div>
              </div>

              {/* Líneas */}
              {lineas.map((linea, idx) => (
                <div 
                  key={linea.id} 
                  className={`grid grid-cols-[1fr_140px_140px_40px] gap-3 px-4 py-3 border-b ${isLight ? "border-gray-100 hover:bg-gray-50/50" : "border-white/5 hover:bg-white/[0.02]"} transition-colors`}
                >
                  {/* Selector de Cuenta */}
                  <select 
                    value={linea.cuenta} 
                    onChange={e => updateLinea(linea.id, "cuenta", e.target.value)} 
                    className={`text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
                  >
                    <option value="" className={opt}>— Seleccionar cuenta —</option>
                    {CUENTAS_DISPONIBLES.map(c => (
                      <option key={c.codigo} value={c.codigo} className={opt}>
                        {c.codigo} — {c.nombre}
                      </option>
                    ))}
                  </select>

                  {/* Input Debe */}
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={linea.debe || ""} 
                    onChange={e => updateLinea(linea.id, "debe", parseFloat(e.target.value) || 0)} 
                    placeholder="0.00" 
                    className={`text-sm text-right px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
                  />

                  {/* Input Haber */}
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={linea.haber || ""} 
                    onChange={e => updateLinea(linea.id, "haber", parseFloat(e.target.value) || 0)} 
                    placeholder="0.00" 
                    className={`text-sm text-right px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`}
                  />

                  {/* Botón Eliminar */}
                  <button 
                    onClick={() => removeLinea(linea.id)} 
                    disabled={lineas.length === 1} 
                    className={`p-2 rounded transition-colors ${lineas.length === 1 ? "opacity-20 cursor-not-allowed" : "hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Fila de Totales */}
              <div className={`grid grid-cols-[1fr_140px_140px_40px] gap-3 px-4 py-3 border-t-2 ${isLight ? "border-gray-300 bg-gray-50" : "border-white/20 bg-white/[0.03]"}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${txt}`}>Totales</span>
                  {isBalanced && totalDebe > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : null}
                </div>
                <div className={`text-sm font-bold font-mono text-right ${txt}`}>
                  ${totalDebe.toFixed(2)}
                </div>
                <div className={`text-sm font-bold font-mono text-right ${txt}`}>
                  ${totalHaber.toFixed(2)}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado del Asiento - Mensaje de Validación */}
      {!descripcion.trim() || !isBalanced ? (
        <div className={`flex items-center justify-between p-4 rounded-lg border ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20"}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className={`text-sm font-medium ${isLight ? "text-amber-800" : "text-amber-300"}`}>
              {!descripcion.trim() ? "Complete la descripción" : "El asiento debe estar balanceado"}
            </span>
          </div>
          <span className={`text-sm font-semibold ${isLight ? "text-amber-700" : "text-amber-400"}`}>
            Diferencia: ${Math.abs(totalDebe - totalHaber).toFixed(2)}
          </span>
        </div>
      ) : null}
    </div>
  );
}