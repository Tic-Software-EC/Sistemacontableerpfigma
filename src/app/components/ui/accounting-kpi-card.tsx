import { ReactNode } from "react";
import { useTheme } from "../../contexts/theme-context";

interface AccountingKpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  iconBg: string; // e.g. "bg-primary/20"
}

/**
 * Tarjeta de métrica unificada para todos los módulos de contabilidad.
 * Layout: label pequeño arriba, valor grande abajo, ícono a la derecha en caja coloreada.
 * Altura y padding siempre iguales: px-4 py-3, ícono w-10 h-10.
 */
export function AccountingKpiCard({ label, value, icon, iconBg }: AccountingKpiCardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className={`rounded-xl px-4 py-3 flex items-center justify-between min-h-[64px] ${
        isLight
          ? "bg-white border border-gray-200"
          : "bg-white/5 border border-white/10"
      }`}
    >
      <div className="min-w-0 flex-1 pr-3">
        <p className="text-gray-400 text-xs mb-0.5 truncate">{label}</p>
        <p className={`font-bold text-xl leading-tight truncate ${isLight ? "text-gray-900" : "text-white"}`}>
          {value}
        </p>
      </div>
      <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
    </div>
  );
}
