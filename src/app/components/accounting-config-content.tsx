import { useState } from "react";
import { Settings2, Save } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

/**
 * Este componente es obsoleto.
 * Use AccountingSettingsContent en su lugar.
 * 
 * Se mantiene por compatibilidad pero se recomienda migrar a AccountingSettingsContent
 * que incluye:
 * - Gestión completa del catálogo de cuentas
 * - Plantillas de asientos automáticos configurables
 * - Interfaz más moderna y profesional
 */

export function AccountingConfigContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Configuración Contable (Obsoleto)</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>Este componente está obsoleto. Use la pestaña "Configuración" para acceder a AccountingSettingsContent.</p>
        </div>
      </div>

      {/* Mensaje */}
      <div className={card}>
        <div className="p-8 text-center space-y-3">
          <Settings2 className={`w-12 h-12 mx-auto ${sub}`} />
          <div>
            <h3 className={`text-base font-semibold ${txt}`}>Componente Obsoleto</h3>
            <p className={`text-sm ${sub} mt-2`}>
              Este componente ha sido reemplazado por <strong>AccountingSettingsContent</strong>.
            </p>
            <p className={`text-sm ${sub} mt-2`}>
              El nuevo componente incluye gestión completa del catálogo de cuentas y plantillas de asientos automáticos con una interfaz más moderna y profesional.
            </p>
          </div>
          <button onClick={() => toast.info("Use la pestaña 'Configuración' para acceder al nuevo módulo")} className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors">
            <Save className="w-4 h-4 inline mr-2" />
            Ver Nuevo Módulo
          </button>
        </div>
      </div>
    </div>
  );
}
