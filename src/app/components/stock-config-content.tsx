import { useState } from "react";
import {
  Settings,
  Check,
  Package,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  Calculator,
  Save,
} from "lucide-react";

interface StockConfig {
  allowNegativeStock: boolean;
  autoUpdateStock: boolean;
  showStockAlerts: boolean;
  minimumStockAlert: number;
  stockValuationMethod: "fifo" | "lifo" | "average" | "standard";
  enableStockReservations: boolean;
  reservationExpirationDays: number;
  enableBatchTracking: boolean;
  enableSerialTracking: boolean;
  requireStockConfirmation: boolean;
}

export function StockConfigContent() {
  const [config, setConfig] = useState<StockConfig>({
    allowNegativeStock: false,
    autoUpdateStock: true,
    showStockAlerts: true,
    minimumStockAlert: 10,
    stockValuationMethod: "average",
    enableStockReservations: true,
    reservationExpirationDays: 7,
    enableBatchTracking: true,
    enableSerialTracking: false,
    requireStockConfirmation: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateConfig = <K extends keyof StockConfig>(
    key: K,
    value: StockConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    alert("Configuración de stock guardada exitosamente");
    setHasChanges(false);
  };

  const handleReset = () => {
    if (confirm("¿Deseas restaurar la configuración predeterminada?")) {
      setConfig({
        allowNegativeStock: false,
        autoUpdateStock: true,
        showStockAlerts: true,
        minimumStockAlert: 10,
        stockValuationMethod: "average",
        enableStockReservations: true,
        reservationExpirationDays: 7,
        enableBatchTracking: true,
        enableSerialTracking: false,
        requireStockConfirmation: true,
      });
      setHasChanges(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Configuración de Stock
          </h2>
          <p className="text-gray-400 text-sm">
            Configura los parámetros de control y gestión de inventario
          </p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 justify-center whitespace-nowrap"
          >
            <Save className="w-5 h-5" />
            Guardar Cambios
          </button>
        )}
      </div>

      {/* Control de Stock */}
      <div className="bg-[#0a1628] border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Control de Stock</h3>
            <p className="text-gray-400 text-sm">Configuración general del inventario</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Permitir stock negativo */}
          <div className="flex items-start gap-4 p-4 bg-[#0f1825]/50 rounded-lg border border-white/5">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={config.allowNegativeStock}
                onChange={(e) => updateConfig("allowNegativeStock", e.target.checked)}
                className="sr-only peer"
                id="allowNegativeStock"
              />
              <label
                htmlFor="allowNegativeStock"
                className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center cursor-pointer"
              >
                {config.allowNegativeStock && <Check className="w-3 h-3 text-white" />}
              </label>
            </div>
            <div className="flex-1">
              <label htmlFor="allowNegativeStock" className="text-white font-medium text-sm block mb-1 cursor-pointer">
                Permitir stock negativo
              </label>
              <p className="text-gray-400 text-xs">
                Permite realizar ventas o salidas de productos aun cuando no haya existencias disponibles
              </p>
            </div>
          </div>

          {/* Actualización automática */}
          <div className="flex items-start gap-4 p-4 bg-[#0f1825]/50 rounded-lg border border-white/5">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={config.autoUpdateStock}
                onChange={(e) => updateConfig("autoUpdateStock", e.target.checked)}
                className="sr-only peer"
                id="autoUpdateStock"
              />
              <label
                htmlFor="autoUpdateStock"
                className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center cursor-pointer"
              >
                {config.autoUpdateStock && <Check className="w-3 h-3 text-white" />}
              </label>
            </div>
            <div className="flex-1">
              <label htmlFor="autoUpdateStock" className="text-white font-medium text-sm block mb-1 cursor-pointer">
                Actualización automática de stock
              </label>
              <p className="text-gray-400 text-xs">
                Actualiza automáticamente el stock al confirmar ventas, compras o movimientos
              </p>
            </div>
          </div>

          {/* Alertas de stock */}
          <div className="flex items-start gap-4 p-4 bg-[#0f1825]/50 rounded-lg border border-white/5">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={config.showStockAlerts}
                onChange={(e) => updateConfig("showStockAlerts", e.target.checked)}
                className="sr-only peer"
                id="showStockAlerts"
              />
              <label
                htmlFor="showStockAlerts"
                className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center cursor-pointer"
              >
                {config.showStockAlerts && <Check className="w-3 h-3 text-white" />}
              </label>
            </div>
            <div className="flex-1">
              <label htmlFor="showStockAlerts" className="text-white font-medium text-sm block mb-1 cursor-pointer">
                Mostrar alertas de stock bajo
              </label>
              <p className="text-gray-400 text-xs mb-3">
                Notifica cuando el stock de un producto alcanza el nivel mínimo configurado
              </p>
              {config.showStockAlerts && (
                <div className="mt-3">
                  <label className="text-gray-400 text-xs block mb-2">
                    Cantidad mínima para alerta
                  </label>
                  <input
                    type="number"
                    value={config.minimumStockAlert}
                    onChange={(e) => updateConfig("minimumStockAlert", parseInt(e.target.value) || 0)}
                    min="0"
                    className="w-32 px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Requerir confirmación */}
          <div className="flex items-start gap-4 p-4 bg-[#0f1825]/50 rounded-lg border border-white/5">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={config.requireStockConfirmation}
                onChange={(e) => updateConfig("requireStockConfirmation", e.target.checked)}
                className="sr-only peer"
                id="requireStockConfirmation"
              />
              <label
                htmlFor="requireStockConfirmation"
                className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center cursor-pointer"
              >
                {config.requireStockConfirmation && <Check className="w-3 h-3 text-white" />}
              </label>
            </div>
            <div className="flex-1">
              <label htmlFor="requireStockConfirmation" className="text-white font-medium text-sm block mb-1 cursor-pointer">
                Requerir confirmación de movimientos
              </label>
              <p className="text-gray-400 text-xs">
                Solicita confirmación antes de realizar cualquier movimiento de stock
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Método de Valoración */}
      <div className="bg-[#0a1628] border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Método de Valoración de Inventario</h3>
            <p className="text-gray-400 text-sm">Define cómo se calcula el costo de los productos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FIFO */}
          <div
            onClick={() => updateConfig("stockValuationMethod", "fifo")}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              config.stockValuationMethod === "fifo"
                ? "bg-primary/10 border-primary"
                : "bg-[#0f1825]/50 border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                config.stockValuationMethod === "fifo"
                  ? "border-primary bg-primary"
                  : "border-white/20"
              }`}>
                {config.stockValuationMethod === "fifo" && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm mb-1">FIFO (Primero en Entrar, Primero en Salir)</h4>
                <p className="text-gray-400 text-xs">
                  Los productos que entraron primero son los primeros en salir
                </p>
              </div>
            </div>
          </div>

          {/* LIFO */}
          <div
            onClick={() => updateConfig("stockValuationMethod", "lifo")}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              config.stockValuationMethod === "lifo"
                ? "bg-primary/10 border-primary"
                : "bg-[#0f1825]/50 border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                config.stockValuationMethod === "lifo"
                  ? "border-primary bg-primary"
                  : "border-white/20"
              }`}>
                {config.stockValuationMethod === "lifo" && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm mb-1">LIFO (Último en Entrar, Primero en Salir)</h4>
                <p className="text-gray-400 text-xs">
                  Los productos que entraron últimos son los primeros en salir
                </p>
              </div>
            </div>
          </div>

          {/* Promedio Ponderado */}
          <div
            onClick={() => updateConfig("stockValuationMethod", "average")}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              config.stockValuationMethod === "average"
                ? "bg-primary/10 border-primary"
                : "bg-[#0f1825]/50 border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                config.stockValuationMethod === "average"
                  ? "border-primary bg-primary"
                  : "border-white/20"
              }`}>
                {config.stockValuationMethod === "average" && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm mb-1">Promedio Ponderado</h4>
                <p className="text-gray-400 text-xs">
                  Se calcula un costo promedio de todas las compras realizadas
                </p>
              </div>
            </div>
          </div>

          {/* Costo Estándar */}
          <div
            onClick={() => updateConfig("stockValuationMethod", "standard")}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              config.stockValuationMethod === "standard"
                ? "bg-primary/10 border-primary"
                : "bg-[#0f1825]/50 border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                config.stockValuationMethod === "standard"
                  ? "border-primary bg-primary"
                  : "border-white/20"
              }`}>
                {config.stockValuationMethod === "standard" && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm mb-1">Costo Estándar</h4>
                <p className="text-gray-400 text-xs">
                  Se utiliza un costo predeterminado para cada producto
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservas y Trazabilidad */}
      <div className="bg-[#0a1628] border border-white/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Reservas y Trazabilidad</h3>
            <p className="text-gray-400 text-sm">Configuración de reservas y seguimiento de productos</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Habilitar reservas */}
          <div className="flex items-start gap-4 p-4 bg-[#0f1825]/50 rounded-lg border border-white/5">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={config.enableStockReservations}
                onChange={(e) => updateConfig("enableStockReservations", e.target.checked)}
                className="sr-only peer"
                id="enableStockReservations"
              />
              <label
                htmlFor="enableStockReservations"
                className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center cursor-pointer"
              >
                {config.enableStockReservations && <Check className="w-3 h-3 text-white" />}
              </label>
            </div>
            <div className="flex-1">
              <label htmlFor="enableStockReservations" className="text-white font-medium text-sm block mb-1 cursor-pointer">
                Habilitar reservas de stock
              </label>
              <p className="text-gray-400 text-xs mb-3">
                Permite reservar productos para pedidos pendientes de confirmar
              </p>
              {config.enableStockReservations && (
                <div className="mt-3">
                  <label className="text-gray-400 text-xs block mb-2">
                    Días de expiración de reservas
                  </label>
                  <input
                    type="number"
                    value={config.reservationExpirationDays}
                    onChange={(e) => updateConfig("reservationExpirationDays", parseInt(e.target.value) || 1)}
                    min="1"
                    max="30"
                    className="w-32 px-3 py-2 bg-[#0a1628] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Seguimiento por lotes */}
          <div className="flex items-start gap-4 p-4 bg-[#0f1825]/50 rounded-lg border border-white/5">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={config.enableBatchTracking}
                onChange={(e) => updateConfig("enableBatchTracking", e.target.checked)}
                className="sr-only peer"
                id="enableBatchTracking"
              />
              <label
                htmlFor="enableBatchTracking"
                className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center cursor-pointer"
              >
                {config.enableBatchTracking && <Check className="w-3 h-3 text-white" />}
              </label>
            </div>
            <div className="flex-1">
              <label htmlFor="enableBatchTracking" className="text-white font-medium text-sm block mb-1 cursor-pointer">
                Seguimiento por lotes
              </label>
              <p className="text-gray-400 text-xs">
                Permite rastrear productos por números de lote y fechas de vencimiento
              </p>
            </div>
          </div>

          {/* Seguimiento por serie */}
          <div className="flex items-start gap-4 p-4 bg-[#0f1825]/50 rounded-lg border border-white/5">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={config.enableSerialTracking}
                onChange={(e) => updateConfig("enableSerialTracking", e.target.checked)}
                className="sr-only peer"
                id="enableSerialTracking"
              />
              <label
                htmlFor="enableSerialTracking"
                className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center cursor-pointer"
              >
                {config.enableSerialTracking && <Check className="w-3 h-3 text-white" />}
              </label>
            </div>
            <div className="flex-1">
              <label htmlFor="enableSerialTracking" className="text-white font-medium text-sm block mb-1 cursor-pointer">
                Seguimiento por número de serie
              </label>
              <p className="text-gray-400 text-xs">
                Permite rastrear productos individualmente por número de serie único
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Restaurar Predeterminados
        </button>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar Cambios
          </button>
        )}
      </div>
    </div>
  );
}
