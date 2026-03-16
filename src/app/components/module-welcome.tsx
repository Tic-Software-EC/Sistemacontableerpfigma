import { LucideIcon } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface ModuleWelcomeProps {
  icon: LucideIcon;
  title: string;
  description: string;
  companyName?: string;
}

export function ModuleWelcome({
  icon: Icon,
  title,
  description,
  companyName = "Comercial del Pacífico S.A."
}: ModuleWelcomeProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className={`mb-8 border rounded-xl p-8 text-center ${
      isLight 
        ? "bg-gradient-to-br from-blue-50 to-white border-blue-200" 
        : "bg-gradient-to-br from-blue-500/10 to-secondary border-blue-500/20"
    }`}>
      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-9 h-9 text-white" />
      </div>
      <h2 className={`text-2xl font-bold mb-2 ${
        isLight ? "text-gray-900" : "text-white"
      }`}>{title}</h2>
      <p className={`text-sm max-w-2xl mx-auto ${
        isLight ? "text-gray-600" : "text-gray-400"
      }`}>
        {description}
      </p>
    </div>
  );
}

interface SubModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  onClick: () => void;
  colorHex?: string;
}

export function SubModuleCard({
  icon: Icon,
  title,
  description,
  features,
  onClick,
  colorHex = "#4F46E5"
}: SubModuleCardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={onClick}
      className={`group text-left border rounded-2xl p-7 transition-all duration-300 hover:scale-[1.02] ${
        isLight 
          ? "bg-white border-gray-200 hover:shadow-2xl" 
          : "bg-[#1a2936] border-white/10 hover:bg-[#1e3a4f] hover:shadow-2xl"
      }`}
      style={{
        borderColor: isLight ? undefined : "rgba(255, 255, 255, 0.1)"
      }}
    >
      <div className="flex items-start gap-5">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
          style={{
            backgroundColor: isLight 
              ? `${colorHex}15` 
              : `${colorHex}20`
          }}
        >
          <Icon className="w-7 h-7" style={{ color: colorHex }} />
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-2.5 ${
            isLight ? "text-gray-900" : "text-white"
          }`}>{title}</h3>
          <p className={`text-sm mb-4 leading-relaxed ${
            isLight ? "text-gray-600" : "text-gray-400"
          }`}>{description}</p>
          <ul className="space-y-2.5">
            {features.map((feature, index) => (
              <li key={index} className={`text-xs flex items-start gap-2.5 ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}>
                <span className="mt-0.5 font-bold" style={{ color: colorHex }}>✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}