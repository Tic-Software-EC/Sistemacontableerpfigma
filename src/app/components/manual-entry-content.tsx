import { useState } from "react";
import {
  Plus, Trash2, Save, CheckCircle, AlertTriangle,
  ArrowUpRight, ArrowDownRight, FileText, X,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useAccounting, type AsientoLinea } from "../contexts/accounting-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════
   Catálogo de cuentas disponibles
══════════════════════════════════════════════════ */
const CUENTAS_DISPONIBLES = [
  { codigo: "1.1.1.01", nombre: "Caja General" },
  { codigo: "1.1.1.02", nombre: "Banco Pichincha" },
  { codigo: "1.1.1.03", nombre: "Banco Guayaquil Ahorros" },
  { codigo: "1.1.2.01", nombre: "Cuentas por Cobrar Clientes" },
  { codigo: "1.1.3.01", nombre: "IVA en Compras" },
  { codigo: "1.1.4.01", nombre: "Inventario" },
  { codigo: "1.1.4.02", nombre: "Inventario Bodega Destino" },
  { codigo: "1.2.1.02", nombre: "Dep. Acumulada Equipos" },
  { codigo: "2.1.1.01", nombre: "Cuentas por Pagar Proveedores" },
  { codigo: "2.1.2.01", nombre: "Anticipos de Clientes" },
  { codigo: "2.1.3.01", nombre: "IVA por Pagar" },
  { codigo: "2.1.4.01", nombre: "Retención IVA por Pagar" },
  { codigo: "4.1.1.01", nombre: "Ventas" },
  { codigo: "4.1.2.01", nombre: "Descuentos en Ventas" },
  { codigo: "4.2.1.01", nombre: "Sobrante de Inventario" },
  { codigo: "5.1.1.01", nombre: "Sueldos y Salarios" },
  { codigo: "5.1.2.01", nombre: "Beneficios Sociales" },
  { codigo: "5.2.1.01", nombre: "Gasto Depreciación" },
  { codigo: "5.3.1.01", nombre: "Pérdida por Ajuste Inventario" },
];

const TIPOS = ["Ajuste", "Cierre", "Corrección", "Reclasificación", "Otro"];

interface LineaExtendida extends AsientoLinea {
  id: string;
}

export function ManualEntryContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { addAsiento } = useAccounting();

  // Estado del formulario
  const [descripcion, setDescripcion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [tipo, setTipo] = useState("Ajuste");
  const [fecha, setFecha] = useState("2026-03-07");
  const [lineas, setLineas] = useState<LineaExtendida[]>([
    { id: crypto.randomUUID(), cuenta: "", nombre: "", debe: 0, haber: 0 },
  ]);

  // Estilos
  const inp = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors ${
    isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
  }`;
  const lbl = `block mb-1.5 text-xs font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`;
  const sub = isLight ? "text-gray-400" : "text-gray-500";
  const card = `rounded-xl border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;

  // Cálculos
  const totalDebe = lineas.reduce((sum, l) => sum + (l.debe || 0), 0);
  const totalHaber = lineas.reduce((sum, l) => sum + (l.haber || 0), 0);
  const balanced = Math.abs(totalDebe - totalHaber) < 0.01;
  const canSave = descripcion.trim() && lineas.some(l => l.cuenta) && balanced;
  const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;

  // Agregar línea
  const addLinea = () => {
    setLineas([...lineas, { id: crypto.randomUUID(), cuenta: "", nombre: "", debe: 0, haber: 0 }]);
  };

  // Eliminar línea
  const removeLinea = (id: string) => {
    if (lineas.length > 1) {
      setLineas(lineas.filter(l => l.id !== id));
    }
  };

  // Actualizar línea
  const updateLinea = (id: string, field: keyof AsientoLinea, value: string | number) => {
    setLineas(lineas.map(l => {
      if (l.id !== id) return l;
      if (field === "cuenta") {
        const cuenta = CUENTAS_DISPONIBLES.find(c => c.codigo === value);
        return { ...l, cuenta: String(value), nombre: cuenta?.nombre || l.nombre };
      }
      return { ...l, [field]: value };
    }));
  };

  // Guardar asiento
  const handleSave = () => {
    if (!canSave) {
      toast.error("Complete los datos y balancee el asiento");
      return;
    }

    const lineasFiltradas = lineas.filter(l => l.cuenta).map(l => ({
      cuenta: l.cuenta,
      nombre: l.nombre,
      debe: l.debe || 0,
      haber: l.haber || 0,
    }));

    addAsiento({
      descripcion,
      referencia,
      tipo,
      fecha,
      estado: "borrador",
      origen: "manual",
      autoGenerado: false,
      debe: totalDebe,
      haber: totalHaber,
      lineas: lineasFiltradas,
    });

    toast.success("Asiento manual creado correctamente");
    
    // Resetear formulario
    setDescripcion("");
    setReferencia("");
    setTipo("Ajuste");
    setFecha("2026-03-07");
    setLineas([{ id: crypto.randomUUID(), cuenta: "", nombre: "", debe: 0, haber: 0 }]);
  };

  // Limpiar formulario
  const handleClear = () => {
    if (window.confirm("¿Desea limpiar el formulario?")) {
      setDescripcion("");
      setReferencia("");
      setTipo("Ajuste");
      setLineas([{ id: crypto.randomUUID(), cuenta: "", nombre: "", debe: 0, haber: 0 }]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
          Crear Asiento Manual
        </h2>
        <p className={`text-sm mt-1 ${sub}`}>
          Use esta pantalla solo cuando necesite crear un asiento que no se genera automáticamente desde otro módulo
        </p>
      </div>

      {/* Aviso */}
      <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20"}`}>
        <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? "text-amber-600" : "text-amber-400"}`} />
        <div>
          <p className={`text-sm font-semibold ${isLight ? "text-amber-900" : "text-amber-200"}`}>
            ¿Cuándo usar un asiento manual?
          </p>
          <p className={`text-xs mt-1 ${isLight ? "text-amber-700" : "text-amber-300"}`}>
            Los asientos automáticos se generan desde Ventas, Compras, POS, Inventario y Nómina.
            Use asientos manuales solo para ajustes, correcciones, reclasificaciones o cierres contables.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Columna izquierda: Formulario */}
        <div className="xl:col-span-2 space-y-6">
          {/* Datos generales */}
          <div className={`${card} p-6`}>
            <h3 className={`font-bold text-sm mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
              Datos del Asiento
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Fecha *</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={lbl}>Tipo *</label>
                <select value={tipo} onChange={e => setTipo(e.target.value)} className={inp}>
                  {TIPOS.map(t => (
                    <option key={t} value={t} className="bg-[#0D1B2A]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className={lbl}>Descripción *</label>
              <input
                type="text"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Ej: Ajuste de inventario marzo 2026"
                className={inp}
              />
            </div>
            <div className="mt-4">
              <label className={lbl}>Referencia (opcional)</label>
              <input
                type="text"
                value={referencia}
                onChange={e => setReferencia(e.target.value)}
                placeholder="Ej: DOC-001, MEMO-123"
                className={inp}
              />
            </div>
          </div>

          {/* Líneas contables */}
          <div className={`${card} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                Líneas Contables
              </h3>
              <button
                onClick={addLinea}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar línea
              </button>
            </div>

            <div className="space-y-3">
              {lineas.map((linea, index) => (
                <div
                  key={linea.id}
                  className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.02] border-white/10"}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isLight ? "bg-gray-200 text-gray-600" : "bg-white/10 text-gray-400"}`}>
                      {index + 1}
                    </div>
                    <span className={`text-xs font-medium ${sub}`}>Línea {index + 1}</span>
                    {lineas.length > 1 && (
                      <button
                        onClick={() => removeLinea(linea.id)}
                        className="ml-auto p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                        title="Eliminar línea"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className={lbl}>Cuenta contable</label>
                      <select
                        value={linea.cuenta}
                        onChange={e => updateLinea(linea.id, "cuenta", e.target.value)}
                        className={inp}
                      >
                        <option value="" className="bg-[#0D1B2A]">— Seleccione una cuenta —</option>
                        {CUENTAS_DISPONIBLES.map(c => (
                          <option key={c.codigo} value={c.codigo} className="bg-[#0D1B2A]">
                            {c.codigo} — {c.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={lbl}>
                          <div className="flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" />
                            Debe
                          </div>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={linea.debe || ""}
                          onChange={e => updateLinea(linea.id, "debe", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className={`${inp} font-mono text-right`}
                        />
                      </div>
                      <div>
                        <label className={lbl}>
                          <div className="flex items-center gap-1">
                            <ArrowDownRight className="w-3 h-3" />
                            Haber
                          </div>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={linea.haber || ""}
                          onChange={e => updateLinea(linea.id, "haber", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className={`${inp} font-mono text-right`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha: Resumen */}
        <div className="xl:col-span-1">
          <div className={`${card} p-6 sticky top-24 space-y-6`}>
            {/* Título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className={`font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                  Resumen del Asiento
                </h3>
                <p className={`text-xs ${sub}`}>Vista previa</p>
              </div>
            </div>

            {/* Estado del balance */}
            <div className={`px-4 py-3 rounded-lg border ${balanced ? (isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20") : (isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20")}`}>
              <div className="flex items-center gap-2">
                {balanced ? (
                  <>
                    <CheckCircle className={`w-5 h-5 ${isLight ? "text-green-600" : "text-green-400"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${isLight ? "text-green-900" : "text-green-200"}`}>
                        Asiento balanceado
                      </p>
                      <p className={`text-xs ${isLight ? "text-green-700" : "text-green-300"}`}>
                        Debe = Haber
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className={`w-5 h-5 ${isLight ? "text-amber-600" : "text-amber-400"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${isLight ? "text-amber-900" : "text-amber-200"}`}>
                        Desbalanceado
                      </p>
                      <p className={`text-xs ${isLight ? "text-amber-700" : "text-amber-300"}`}>
                        Diferencia: {fmt(Math.abs(totalDebe - totalHaber))}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Totales */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${sub}`}>Total Debe:</span>
                <span className={`text-base font-bold font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                  {fmt(totalDebe)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${sub}`}>Total Haber:</span>
                <span className={`text-base font-bold font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                  {fmt(totalHaber)}
                </span>
              </div>
              <div className={`pt-3 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${sub}`}>Líneas:</span>
                  <span className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {lineas.filter(l => l.cuenta).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Datos generales */}
            <div className={`pt-4 border-t space-y-2 ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div>
                <span className={`text-xs ${sub}`}>Fecha:</span>
                <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  {fecha || "—"}
                </p>
              </div>
              <div>
                <span className={`text-xs ${sub}`}>Tipo:</span>
                <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  {tipo}
                </p>
              </div>
              {descripcion && (
                <div>
                  <span className={`text-xs ${sub}`}>Descripción:</span>
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {descripcion}
                  </p>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="space-y-2">
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  canSave
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : isLight
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white/5 text-gray-600 cursor-not-allowed"
                }`}
              >
                <Save className="w-4 h-4" />
                Guardar en Libro Diario
              </button>
              <button
                onClick={handleClear}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  isLight
                    ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                    : "border-white/10 text-gray-300 hover:bg-white/5"
                }`}
              >
                <X className="w-4 h-4" />
                Limpiar formulario
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
