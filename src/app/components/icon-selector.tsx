import { useState } from "react";
import { Search, X } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import * as Icons from "lucide-react";

// Iconos disponibles para selección
const availableIcons = [
  "FileText", "Users", "ShoppingCart", "DollarSign", "Package", "Calculator",
  "ClipboardList", "Building", "BarChart3", "Calendar", "Receipt", "UserPlus",
  "Smartphone", "PieChart", "Layers", "Target", "Briefcase", "Activity",
  "Home", "TrendingUp", "CreditCard", "Truck", "Shield", "Globe",
  "Settings", "Bell", "Mail", "Phone", "MapPin", "Clock",
  "Archive", "Award", "BookOpen", "Camera", "Clipboard", "Cloud",
  "Database", "Edit", "Eye", "Filter", "Flag", "Folder",
  "Gift", "Grid", "Hash", "Heart", "Image", "Inbox",
  "Info", "Key", "Link", "List", "Lock", "Map",
  "Menu", "MessageSquare", "Minimize", "Monitor", "MoreHorizontal", "Move",
  "Paperclip", "Percent", "Plus", "Power", "Printer", "RefreshCw",
  "Repeat", "RotateCw", "Save", "Search", "Send", "Server",
  "Share", "ShoppingBag", "Sliders", "Star", "Tag", "Trash2",
  "Upload", "User", "Video", "Volume2", "Wallet", "Zap",
];

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  label?: string;
  required?: boolean;
}

export function IconSelector({
  selectedIcon,
  onSelectIcon,
  label = "Ícono",
  required = false,
}: IconSelectorProps) {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = availableIcons.filter((iconName) =>
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.HelpCircle;
  };

  const SelectedIconComponent = getIconComponent(selectedIcon);

  return (
    <div className="space-y-3">
      {label && (
        <label className={`block text-xs mb-2 ${
          theme === "light" ? "text-gray-600" : "text-gray-400"
        }`}>
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Preview del icono seleccionado */}
      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-[#0f1621] border-white/10"
      }`}>
        <div className={`p-2 rounded-lg ${
          theme === "light" ? "bg-gray-100" : "bg-white/5"
        }`}>
          <SelectedIconComponent className={`w-5 h-5 ${
            theme === "light" ? "text-gray-700" : "text-white"
          }`} />
        </div>
        <span className={`text-sm ${
          theme === "light" ? "text-gray-900" : "text-white"
        }`}>
          {selectedIcon}
        </span>
      </div>

      {/* Campo de búsqueda */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
          theme === "light" ? "text-gray-400" : "text-gray-500"
        }`} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-10 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
            theme === "light"
              ? "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
          }`}
          placeholder="Buscar ícono..."
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors ${
              theme === "light"
                ? "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                : "hover:bg-white/5 text-gray-500 hover:text-gray-300"
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid de iconos */}
      <div className={`border rounded-lg p-3 max-h-[280px] overflow-y-auto ${
        theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#0f1621] border-white/10"
      }`}>
        <div className="grid grid-cols-6 gap-2">
          {filteredIcons.map((iconName) => {
            const IconComponent = getIconComponent(iconName);
            const isSelected = selectedIcon === iconName;

            return (
              <button
                key={iconName}
                type="button"
                onClick={() => onSelectIcon(iconName)}
                className={`aspect-square p-3 rounded-lg border-2 transition-all flex items-center justify-center group relative ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : theme === "light"
                    ? "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50"
                    : "border-white/10 bg-[#1a2332] hover:border-primary/40 hover:bg-white/5"
                }`}
                title={iconName}
              >
                <IconComponent
                  className={`w-6 h-6 transition-colors ${
                    isSelected
                      ? "text-primary"
                      : theme === "light"
                      ? "text-gray-600 group-hover:text-gray-900"
                      : "text-gray-400 group-hover:text-white"
                  }`}
                />
                
                {/* Tooltip al hacer hover */}
                <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 ${
                  theme === "light"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}>
                  {iconName}
                </div>
              </button>
            );
          })}
        </div>

        {filteredIcons.length === 0 && (
          <div className={`text-center py-8 ${
            theme === "light" ? "text-gray-500" : "text-gray-400"
          }`}>
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No se encontraron iconos</p>
          </div>
        )}
      </div>
    </div>
  );
}
