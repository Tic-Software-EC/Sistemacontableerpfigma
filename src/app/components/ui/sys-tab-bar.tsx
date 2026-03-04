import { ElementType } from "react";
import { useTheme } from "../../contexts/theme-context";

export interface SysTab {
  id: string;
  label: string;
  icon: ElementType;
}

interface SysTabBarProps {
  tabs: SysTab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Barra de tabs corporativa del sistema TicSoftEc.
 * Activo → icono + texto en naranja + línea inferior naranja.
 * Inactivo → icono + texto en gris.
 */
export function SysTabBar({ tabs, active, onChange, className = "" }: SysTabBarProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`border-b ${isLight ? "border-gray-200" : "border-white/10"} ${className}`}>
      <div className="flex gap-0">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                isActive
                  ? "border-primary text-primary"
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : isLight ? "text-gray-400" : "text-gray-500"}`} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
