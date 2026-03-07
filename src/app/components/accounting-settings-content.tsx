import { useState } from "react";
import { Save, RotateCcw, AlertCircle, ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useAccountingConfig, type AccountingConfig, type CuentaMap } from "../contexts/accounting-config-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════
   Catálogo de cuentas disponibles
══════════════════════════════════════════════════ */
const CUENTAS = [
  { codigo: "1.1.1.01", nombre: "Caja General" },
  { codigo: "1.1.1.02", nombre: "Banco Pichincha Cte." },
  { codigo: "1.1.1.03", nombre: "Banco Guayaquil Ahorros" },
  { codigo: "1.1.2.01", nombre: "Clientes Locales" },
  { codigo: "1.1.2.02", nombre: "Clientes Exterior" },
  { codigo: "1.1.3.01", nombre: "IVA en Compras" },
  { codigo: "1.1.3.02", nombre: "Retención IVA por Cobrar" },
  { codigo: "1.1.3.03", nombre: "Retención Renta por Cobrar" },
  { codigo: "1.1.4.01", nombre: "Inventario" },
  { codigo: "1.2.1.01", nombre: "Muebles y Enseres" },
  { codigo: "1.2.1.02", nombre: "Dep. Acumulada Equipos" },
  { codigo: "1.2.1.03", nombre: "Vehículos" },
  { codigo: "2.1.1.01", nombre: "Proveedores Locales" },
  { codigo: "2.1.1.02", nombre: "Proveedores Exterior" },
  { codigo: "2.1.2.01", nombre: "Anticipos de Clientes" },
  { codigo: "2.1.3.01", nombre: "IVA por Pagar" },
  { codigo: "2.1.3.02", nombre: "Retención IVA por Pagar" },
  { codigo: "2.1.3.03", nombre: "Retención Renta por Pagar" },
  { codigo: "2.1.4.01", nombre: "IESS por Pagar" },
  { codigo: "2.1.4.02", nombre: "Préstamos IESS por Pagar" },
  { codigo: "4.1.1.01", nombre: "Ventas" },
  { codigo: "4.1.1.02", nombre: "Ventas Exterior" },
  { codigo: "4.1.2.01", nombre: "Descuentos en Ventas" },
  { codigo: "4.2.1.01", nombre: "Ingresos Financieros" },
  { codigo: "5.1.1.01", nombre: "Sueldos y Salarios" },
  { codigo: "5.1.2.01", nombre: "Beneficios Sociales" },
  { codigo: "5.1.3.01", nombre: "Aportes Patronales IESS" },
  { codigo: "5.2.1.01", nombre: "Gasto Depreciación" },
  { codigo: "5.2.2.01", nombre: "Servicios Básicos" },
  { codigo: "5.2.2.02", nombre: "Arriendo" },
  { codigo: "5.2.2.03", nombre: "Publicidad" },
  { codigo: "5.3.1.01", nombre: "Pérdida por Ajuste Inventario" },
  { codigo: "5.4.1.01", nombre: "Gastos Financieros" },
];

/* ══════════════════════════════════════════════════
   Secciones de configuración
══════════════════════════════════════════════════ */
interface ConfigSection {
  id: string;
  title: string;
  fields: {
    key: keyof AccountingConfig;
    label: string;
  }[];
}

const CONFIG_SECTIONS: ConfigSection[] = [
  {
    id: "ventas",
    title: "Ventas",
    fields: [
      { key: "ventaIngreso", label: "Cuenta de ingresos" },
      { key: "ventaCobro", label: "Cobro al contado" },
      { key: "ventaCxC", label: "Venta a crédito (CxC)" },
      { key: "ivaVentas", label: "IVA por pagar" },
    ],
  },
  {
    id: "compras",
    title: "Compras - Asientos Automáticos",
    fields: [
      { key: "compraInventario", label: "Inventarios (Debe)" },
      { key: "compraIvaCredito", label: "IVA en Compras - IVA Pagado (Debe)" },
      { key: "compraCxP", label: "Cuentas por Pagar (Haber)" },
      { key: "compraPago", label: "Efectivo y Equivalentes de Efectivo (Haber)" },
      { key: "retencionRentaPorPagar", label: "Retención de IR (Haber)" },
      { key: "retencionIvaPorPagar", label: "Retención de IVA (Haber)" },
    ],
  },
  {
    id: "tesoreria",
    title: "Tesorería",
    fields: [
      { key: "cajaGeneral", label: "Caja general" },
      { key: "bancoPrincipal", label: "Banco principal" },
      { key: "cxcClientes", label: "Cuentas por cobrar clientes" },
      { key: "cxpProveedores", label: "Cuentas por pagar proveedores" },
    ],
  },
  {
    id: "retenciones",
    title: "Retenciones",
    fields: [
      { key: "retencionIvaPorPagar", label: "Retención IVA por pagar" },
      { key: "retencionRentaPorPagar", label: "Retención Renta por pagar" },
      { key: "retencionIvaPorCobrar", label: "Retención IVA por cobrar" },
      { key: "retencionRentaPorCobrar", label: "Retención Renta por cobrar" },
    ],
  },
  {
    id: "inventario",
    title: "Inventario",
    fields: [
      { key: "inventarioPrincipal", label: "Inventario principal" },
      { key: "ajusteInventario", label: "Pérdida por ajuste de inventario" },
    ],
  },
  {
    id: "nomina",
    title: "Nómina",
    fields: [
      { key: "nominaSueldos", label: "Sueldos y salarios" },
      { key: "nominaBeneficios", label: "Beneficios sociales" },
      { key: "nominaIESS", label: "Aportes patronales IESS" },
    ],
  },
  {
    id: "activos",
    title: "Activos Fijos",
    fields: [
      { key: "depreciacionGasto", label: "Gasto por depreciación" },
      { key: "depreciacionAcum", label: "Depreciación acumulada" },
    ],
  },
  {
    id: "gastos",
    title: "Gastos Operacionales",
    fields: [
      { key: "gastoServiciosBasicos", label: "Servicios básicos (luz, agua, internet)" },
      { key: "gastoArriendo", label: "Arriendo de local" },
      { key: "gastoPublicidad", label: "Publicidad y marketing" },
    ],
  },
  {
    id: "financieros",
    title: "Ingresos y Gastos Financieros",
    fields: [
      { key: "ingresosFinancieros", label: "Ingresos financieros (intereses ganados)" },
      { key: "gastosFinancieros", label: "Gastos financieros (intereses pagados)" },
    ],
  },
];

export function AccountingSettingsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { config, updateConfig, resetConfig } = useAccountingConfig();
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("compras");

  const inp = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
    isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
  }`;
  const lbl = `block mb-1.5 text-xs font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`;
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;

  const handleChangeCuenta = (key: keyof AccountingConfig, codigo: string) => {
    const cuenta = CUENTAS.find(c => c.codigo === codigo);
    if (cuenta) {
      updateConfig({ [key]: { codigo: cuenta.codigo, nombre: cuenta.nombre } } as Partial<AccountingConfig>);
      setHasChanges(true);
    }
  };

  const handleSave = () => {
    toast.success("Configuración guardada correctamente");
    setHasChanges(false);
  };

  const handleReset = () => {
    if (window.confirm("¿Restablecer todas las cuentas a los valores por defecto?")) {
      resetConfig();
      toast.success("Configuración restablecida");
      setHasChanges(false);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-5 mb-6 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
            Configuración de Cuentas Contables
          </h2>
          <p className={`text-sm mt-1 ${sub}`}>
            Define las cuentas contables que se utilizarán para generar asientos automáticos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isLight
                ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                : "border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
              hasChanges
                ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                : isLight
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white/5 text-gray-600 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            Guardar configuración
          </button>
        </div>
      </div>

      {/* Info */}
      {hasChanges && (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-lg mb-6 border ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20"}`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? "text-amber-600" : "text-amber-400"}`} />
          <div>
            <p className={`text-sm font-semibold ${isLight ? "text-amber-900" : "text-amber-200"}`}>
              Tiene cambios sin guardar
            </p>
            <p className={`text-xs mt-0.5 ${isLight ? "text-amber-700" : "text-amber-300"}`}>
              Recuerde guardar la configuración para aplicar los cambios
            </p>
          </div>
        </div>
      )}

      {/* Secciones */}
      <div className="space-y-3">
        {CONFIG_SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} className={card}>
              {/* Header de sección */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                  isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"
                }`}
              >
                <div>
                  <h3 className={`font-semibold text-base ${isLight ? "text-gray-900" : "text-white"}`}>
                    {section.title}
                  </h3>
                  <p className={`text-xs mt-0.5 ${sub}`}>
                    {section.fields.length} {section.fields.length === 1 ? "cuenta" : "cuentas"}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""} ${sub}`}
                />
              </button>

              {/* Contenido expandible */}
              {isExpanded && (
                <div className={`px-5 pb-5 pt-2 border-t ${isLight ? "border-gray-100" : "border-white/5"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => {
                      const currentValue = config[field.key] as CuentaMap;
                      return (
                        <div key={field.key}>
                          <label className={lbl}>{field.label}</label>
                          <select
                            value={currentValue.codigo}
                            onChange={(e) => handleChangeCuenta(field.key, e.target.value)}
                            className={inp}
                          >
                            {CUENTAS.map((c) => (
                              <option key={c.codigo} value={c.codigo} className="bg-[#0D1B2A]">
                                {c.codigo} — {c.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nota informativa al final */}
      <div className={`mt-6 p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
        <p className={`text-sm ${isLight ? "text-blue-900" : "text-blue-200"}`}>
          <span className="font-semibold">Nota:</span> Estas cuentas se utilizarán automáticamente cuando se generen
          asientos desde los módulos de Ventas, Compras, Inventario, Nómina y otros. Asegúrese de configurarlas
          correctamente según su plan de cuentas.
        </p>
      </div>

      {/* Ejemplo visual del asiento generado */}
      {expandedSection === "compras" && (
        <div className={`mt-6 ${card} overflow-hidden`}>
          <div className={`px-4 py-3 border-b ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20"}`}>
            <h3 className={`font-semibold text-sm ${isLight ? "text-amber-900" : "text-amber-200"}`}>
              Ejemplo: Asiento Generado por Factura de Compra
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? "text-amber-700" : "text-amber-300"}`}>
              Compra de $1,000.00 + IVA $120.00 con retenciones
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isLight ? "bg-gray-900 text-white border-gray-700" : "bg-[#0D1B2A] text-white border-white/10"}`}>
                  <th className="px-4 py-2 text-left text-xs font-semibold">Detalle</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold">Debe</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold">Haber</th>
                </tr>
              </thead>
              <tbody className={`${isLight ? "text-gray-900" : "text-white"}`}>
                <tr className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                  <td className="px-4 py-2 text-sm">
                    {config.compraInventario.nombre}
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-mono">1,000.00</td>
                  <td className="px-4 py-2 text-right text-sm font-mono"></td>
                </tr>
                <tr className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                  <td className="px-4 py-2 text-sm">
                    {config.compraIvaCredito.nombre}
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-mono">120.00</td>
                  <td className="px-4 py-2 text-right text-sm font-mono"></td>
                </tr>
                <tr className={`border-b ${isLight ? "border-gray-100 bg-gray-50" : "border-white/5 bg-white/[0.02]"}`}>
                  <td className="px-4 py-2 text-sm pl-8">
                    {config.compraCxP.nombre}
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-mono"></td>
                  <td className="px-4 py-2 text-right text-sm font-mono">533.25</td>
                </tr>
                <tr className={`border-b ${isLight ? "border-gray-100 bg-gray-50" : "border-white/5 bg-white/[0.02]"}`}>
                  <td className="px-4 py-2 text-sm pl-8">
                    {config.compraPago.nombre}
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-mono"></td>
                  <td className="px-4 py-2 text-right text-sm font-mono">533.25</td>
                </tr>
                <tr className={`border-b ${isLight ? "border-gray-100 bg-gray-50" : "border-white/5 bg-white/[0.02]"}`}>
                  <td className="px-4 py-2 text-sm pl-8">
                    {config.retencionRentaPorPagar.nombre}
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-mono"></td>
                  <td className="px-4 py-2 text-right text-sm font-mono">17.50</td>
                </tr>
                <tr className={`border-b ${isLight ? "border-gray-100 bg-gray-50" : "border-white/5 bg-white/[0.02]"}`}>
                  <td className="px-4 py-2 text-sm pl-8">
                    {config.retencionIvaPorPagar.nombre}
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-mono"></td>
                  <td className="px-4 py-2 text-right text-sm font-mono">36.00</td>
                </tr>
                <tr className={`border-t-2 ${isLight ? "border-gray-300 bg-gray-100" : "border-white/20 bg-white/5"}`}>
                  <td className="px-4 py-2 text-sm font-semibold">
                    p/r Factura de compra 001
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-mono font-bold">1,120.00</td>
                  <td className="px-4 py-2 text-right text-sm font-mono font-bold">1,120.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}