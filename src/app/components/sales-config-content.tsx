import { useState } from "react";
import {
  Settings, Building2, Percent, DollarSign, FileText,
  ShoppingCart, Check, Save,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../contexts/theme-context";

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

interface SalesConfig {
  id: string;
  sucursalId: string;
  allowNegativeStock: boolean;
  requireCustomer: boolean;
  maxDiscountPercent: string;
  defaultPriceList: string;
  autoGenerateInvoice: boolean;
  allowCreditSales: boolean;
  creditDaysLimit: string;
  roundingDecimals: string;
  showStockInSale: boolean;
  allowModifyPrice: boolean;
}

const PRICE_LISTS = [
  { id: "pvp",          name: "Precio al Público (PVP)" },
  { id: "mayorista",    name: "Precio Mayorista" },
  { id: "distribuidor", name: "Precio Distribuidor" },
  { id: "especial",     name: "Precio Especial" },
];

const INITIAL_CONFIGS: SalesConfig[] = [
  { id: "config-001", sucursalId: "suc-001", allowNegativeStock: false, requireCustomer: true,  maxDiscountPercent: "15", defaultPriceList: "pvp",       autoGenerateInvoice: true,  allowCreditSales: true,  creditDaysLimit: "30", roundingDecimals: "2", showStockInSale: true,  allowModifyPrice: false },
  { id: "config-002", sucursalId: "suc-002", allowNegativeStock: false, requireCustomer: true,  maxDiscountPercent: "10", defaultPriceList: "pvp",       autoGenerateInvoice: true,  allowCreditSales: true,  creditDaysLimit: "15", roundingDecimals: "2", showStockInSale: true,  allowModifyPrice: false },
  { id: "config-003", sucursalId: "suc-003", allowNegativeStock: true,  requireCustomer: false, maxDiscountPercent: "20", defaultPriceList: "mayorista", autoGenerateInvoice: true,  allowCreditSales: true,  creditDaysLimit: "45", roundingDecimals: "2", showStockInSale: true,  allowModifyPrice: true  },
  { id: "config-004", sucursalId: "suc-004", allowNegativeStock: false, requireCustomer: true,  maxDiscountPercent: "12", defaultPriceList: "pvp",       autoGenerateInvoice: true,  allowCreditSales: false, creditDaysLimit: "0",  roundingDecimals: "2", showStockInSale: true,  allowModifyPrice: false },
];

export function SalesConfigContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── Estilos adaptativos ────────────────────────────────────────────────────
  const txt    = isLight ? "text-gray-900"  : "text-white";
  const sub    = isLight ? "text-gray-500"  : "text-gray-400";
  const lbl    = isLight ? "text-gray-600"  : "text-gray-300";
  const divB   = isLight ? "border-gray-200" : "border-white/10";
  const card   = `rounded-2xl border p-6 ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const IN     = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const OB     = isLight ? "" : "bg-[#0D1B2A]";
  const rowBg  = isLight ? "bg-gray-50 hover:bg-gray-100" : "bg-[#0f1825]/50 hover:bg-[#0f1825]";
  const chkBdr = isLight ? "border-gray-300" : "border-white/20";

  const [selectedSucursal, setSelectedSucursal] = useState("suc-001");
  const [configs, setConfigs]                   = useState<SalesConfig[]>(INITIAL_CONFIGS);
  const [saved, setSaved]                       = useState(false);

  const currentConfig = configs.find(c => c.sucursalId === selectedSucursal) ?? configs[0];

  const update = (field: keyof SalesConfig, value: string | boolean) => {
    setConfigs(prev => prev.map(c =>
      c.sucursalId === selectedSucursal ? { ...c, [field]: value } : c
    ));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    toast.success("Configuración de ventas guardada exitosamente");
  };

  const getSucursalName   = (id: string) => SUCURSALES.find(s => s.id === id)?.name ?? id;
  const getPriceListName  = (id: string) => PRICE_LISTS.find(p => p.id === id)?.name ?? id;

  // ── Toggle checkbox reutilizable ─────────────────────────────────────────
  const ToggleRow = ({
    field, label, description,
  }: { field: keyof SalesConfig; label: string; description: string }) => {
    const checked = currentConfig[field] as boolean;
    return (
      <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-colors ${rowBg}`}>
        <div className="mt-0.5 flex-shrink-0">
          <input type="checkbox" checked={checked}
            onChange={e => update(field, e.target.checked)} className="sr-only" />
          <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
            checked ? "bg-primary border-primary" : chkBdr + " border-2"
          }`}>
            {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </div>
        </div>
        <div className="flex-1">
          <span className={`font-medium text-sm ${txt}`}>{label}</span>
          <p className={`text-xs mt-0.5 ${sub}`}>{description}</p>
        </div>
      </label>
    );
  };

  return (
    <div className="space-y-6 w-full">



      <div className={`border-t ${divB}`} />

      {/* ── Botón guardar ── */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all text-white shadow-lg shadow-primary/20 ${
            saved ? "bg-green-600" : "bg-primary hover:bg-primary/90"
          }`}>
          {saved ? <><Check className="w-4 h-4" />Guardado</> : <><Save className="w-4 h-4" />Guardar Cambios</>}
        </button>
      </div>

      {/* ── Selector de sucursal ── */}
      <div className={`${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"} border rounded-xl p-4`}>
        <label className={`flex items-center gap-2 mb-3 text-sm font-semibold ${txt}`}>
          <Building2 className="w-4 h-4 text-primary" />
          Sucursal a configurar
        </label>
        <div className="relative">
          <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
          <select value={selectedSucursal} onChange={e => setSelectedSucursal(e.target.value)}
            className={`${IN} pl-9 appearance-none cursor-pointer`}>
            {SUCURSALES.map(s => (
              <option key={s.id} value={s.id} className={OB}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Grid de tarjetas ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Configuración General */}
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Configuración General</h3>
          </div>
          <div className="space-y-3">
            <ToggleRow
              field="allowNegativeStock"
              label="Permitir ventas con stock negativo"
              description="Permite realizar ventas aunque no haya existencias disponibles"
            />
            <ToggleRow
              field="requireCustomer"
              label="Requerir cliente en ventas"
              description="Obliga a seleccionar un cliente antes de completar la venta"
            />
            <ToggleRow
              field="autoGenerateInvoice"
              label="Generar factura automáticamente"
              description="Crea la factura electrónica al completar la venta"
            />
            <ToggleRow
              field="showStockInSale"
              label="Mostrar stock disponible"
              description="Muestra la cantidad disponible al seleccionar productos"
            />
            <ToggleRow
              field="allowModifyPrice"
              label="Permitir modificar precio unitario"
              description="Permite al vendedor cambiar el precio de los productos"
            />
          </div>
        </div>

        {/* Precios y Descuentos */}
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Precios y Descuentos</h3>
          </div>
          <div className="space-y-5">

            {/* Lista de precios */}
            <div>
              <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                Lista de precios predeterminada
              </label>
              <select value={currentConfig.defaultPriceList}
                onChange={e => update("defaultPriceList", e.target.value)}
                className={IN}>
                {PRICE_LISTS.map(p => (
                  <option key={p.id} value={p.id} className={OB}>{p.name}</option>
                ))}
              </select>
              <p className={`text-xs mt-1.5 ${sub}`}>
                Actualmente: <span className={`font-medium ${txt}`}>{getPriceListName(currentConfig.defaultPriceList)}</span>
              </p>
            </div>

            {/* Descuento máximo */}
            <div>
              <label className={`mb-1.5 text-xs font-medium flex items-center gap-1.5 ${lbl}`}>
                <Percent className="w-3.5 h-3.5 text-blue-500" />
                Descuento máximo permitido (%)
              </label>
              <input type="number" min="0" max="100" step="0.1"
                value={currentConfig.maxDiscountPercent}
                onChange={e => update("maxDiscountPercent", e.target.value)}
                className={IN} />
              <p className={`text-xs mt-1.5 ${sub}`}>
                Los vendedores no podrán aplicar descuentos superiores a este porcentaje
              </p>
            </div>

            {/* Decimales */}
            <div>
              <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                Decimales para redondeo
              </label>
              <select value={currentConfig.roundingDecimals}
                onChange={e => update("roundingDecimals", e.target.value)}
                className={IN}>
                <option value="0" className={OB}>Sin decimales (0)</option>
                <option value="1" className={OB}>1 decimal</option>
                <option value="2" className={OB}>2 decimales</option>
                <option value="3" className={OB}>3 decimales</option>
                <option value="4" className={OB}>4 decimales</option>
              </select>
              <p className={`text-xs mt-1.5 ${sub}`}>
                Define la precisión de los cálculos monetarios en las ventas
              </p>
            </div>
          </div>
        </div>

        {/* Ventas a Crédito */}
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-green-500/15 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-500" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Ventas a Crédito</h3>
          </div>
          <div className="space-y-4">
            <ToggleRow
              field="allowCreditSales"
              label="Permitir ventas a crédito"
              description="Habilita la opción de registrar ventas con pago diferido"
            />

            {currentConfig.allowCreditSales ? (
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                  Días de crédito predeterminados
                </label>
                <input type="number" min="0" max="365"
                  value={currentConfig.creditDaysLimit}
                  onChange={e => update("creditDaysLimit", e.target.value)}
                  className={IN} />
                <p className={`text-xs mt-1.5 ${sub}`}>
                  Plazo máximo en días para pago de ventas a crédito
                </p>
              </div>
            ) : (
              <div className={`p-4 rounded-xl border text-sm ${
                isLight
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
              }`}>
                Las ventas a crédito están deshabilitadas para esta sucursal
              </div>
            )}
          </div>
        </div>

        {/* Resumen */}
        <div className={`rounded-2xl border p-6 ${
          isLight
            ? "bg-gradient-to-br from-primary/5 to-orange-50 border-primary/20"
            : "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20"
        }`}>
          <h3 className={`font-bold text-base mb-4 ${txt}`}>Resumen de Configuración</h3>
          <div className="space-y-0">
            {[
              { label: "Sucursal",         value: getSucursalName(currentConfig.sucursalId),        color: txt },
              { label: "Lista de precios", value: getPriceListName(currentConfig.defaultPriceList), color: txt },
              { label: "Descuento máximo", value: `${currentConfig.maxDiscountPercent}%`,           color: txt },
              {
                label: "Ventas a crédito",
                value: currentConfig.allowCreditSales ? "Habilitadas" : "Deshabilitadas",
                color: currentConfig.allowCreditSales ? "text-green-500" : "text-red-500",
              },
              ...(currentConfig.allowCreditSales ? [{
                label: "Días de crédito",
                value: `${currentConfig.creditDaysLimit} días`,
                color: txt,
              }] : []),
              {
                label: "Stock negativo",
                value: currentConfig.allowNegativeStock ? "Permitido" : "No permitido",
                color: currentConfig.allowNegativeStock ? "text-amber-500" : "text-green-500",
              },
              {
                label: "Modificar precios",
                value: currentConfig.allowModifyPrice ? "Permitido" : "No permitido",
                color: currentConfig.allowModifyPrice ? "text-amber-500" : "text-green-500",
              },
            ].map((row, i, arr) => (
              <div key={row.label}
                className={`flex justify-between items-center py-2.5 ${i < arr.length - 1 ? `border-b ${divB}` : ""}`}>
                <span className={`text-sm ${sub}`}>{row.label}</span>
                <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`border-t ${divB}`} />

      <div className="flex justify-end">
        <button onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all text-white shadow-lg shadow-primary/20 ${
            saved ? "bg-green-600" : "bg-primary hover:bg-primary/90"
          }`}>
          {saved ? <><Check className="w-4 h-4" />Guardado</> : <><Save className="w-4 h-4" />Guardar Cambios</>}
        </button>
      </div>
    </div>
  );
}
