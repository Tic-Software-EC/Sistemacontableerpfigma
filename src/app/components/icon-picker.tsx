import { useState } from "react";
import {
  Search,
  ChevronDown,
  Package,
  ShoppingCart,
  TrendingUp,
  Calculator,
  Wallet,
  Users,
  FileText,
  BarChart3,
  Settings,
  Home,
  Briefcase,
  Tag,
  Truck,
  DollarSign,
  CreditCard,
  PieChart,
  Calendar,
  Clock,
  Target,
  Award,
  Activity,
  Globe,
  MapPin,
  Shield,
  Monitor,
  Smartphone,
  Laptop,
  Layers,
  FolderTree,
  Folder,
} from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  isLight: boolean;
}

const availableIcons = [
  { name: "ShoppingCart", Icon: ShoppingCart },
  { name: "TrendingUp", Icon: TrendingUp },
  { name: "Package", Icon: Package },
  { name: "Calculator", Icon: Calculator },
  { name: "Wallet", Icon: Wallet },
  { name: "Users", Icon: Users },
  { name: "FileText", Icon: FileText },
  { name: "BarChart3", Icon: BarChart3 },
  { name: "Settings", Icon: Settings },
  { name: "Home", Icon: Home },
  { name: "Briefcase", Icon: Briefcase },
  { name: "Tag", Icon: Tag },
  { name: "Truck", Icon: Truck },
  { name: "DollarSign", Icon: DollarSign },
  { name: "CreditCard", Icon: CreditCard },
  { name: "PieChart", Icon: PieChart },
  { name: "Calendar", Icon: Calendar },
  { name: "Clock", Icon: Clock },
  { name: "Target", Icon: Target },
  { name: "Award", Icon: Award },
  { name: "Activity", Icon: Activity },
  { name: "Globe", Icon: Globe },
  { name: "MapPin", Icon: MapPin },
  { name: "Shield", Icon: Shield },
  { name: "Monitor", Icon: Monitor },
  { name: "Smartphone", Icon: Smartphone },
  { name: "Laptop", Icon: Laptop },
  { name: "Layers", Icon: Layers },
  { name: "FolderTree", Icon: FolderTree },
  { name: "Folder", Icon: Folder },
];

export function IconPicker({ value, onChange, isLight }: IconPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIcons = availableIcons.filter((icon) =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find((i) => i.name === iconName);
    return icon ? icon.Icon : Package;
  };

  const IconComponent = value ? getIconComponent(value) : null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className={`w-full px-3 py-2 border rounded-lg text-sm transition-all flex items-center justify-between ${
          isLight
            ? "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
            : "bg-white/5 border-white/10 text-white hover:bg-white/10"
        }`}
      >
        <div className="flex items-center gap-2">
          {IconComponent ? (
            <>
              <IconComponent className="w-4 h-4" />
              <span>{value}</span>
            </>
          ) : (
            <span className="text-gray-400">Seleccionar icono...</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            showPicker ? "rotate-180" : ""
          }`}
        />
      </button>

      {showPicker && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowPicker(false);
              setSearchTerm("");
            }}
          />

          {/* Panel del selector */}
          <div
            className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-xl z-50 ${
              isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
            }`}
          >
            {/* Buscador */}
            <div
              className={`p-3 border-b ${
                isLight ? "border-gray-200" : "border-white/10"
              }`}
            >
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar icono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-8 pr-3 py-1.5 border rounded text-sm ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>
            </div>

            {/* Grid de iconos */}
            <div className="p-2 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-5 gap-1">
                {filteredIcons.map(({ name, Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name);
                      setShowPicker(false);
                      setSearchTerm("");
                    }}
                    className={`p-3 rounded-lg transition-all flex flex-col items-center justify-center gap-1 group ${
                      value === name
                        ? isLight
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-primary/20 border-2 border-primary"
                        : isLight
                        ? "hover:bg-gray-100 border-2 border-transparent"
                        : "hover:bg-white/5 border-2 border-transparent"
                    }`}
                    title={name}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        value === name
                          ? "text-primary"
                          : isLight
                          ? "text-gray-600 group-hover:text-gray-900"
                          : "text-gray-400 group-hover:text-white"
                      }`}
                    />
                    <span
                      className={`text-[9px] font-medium truncate w-full text-center ${
                        value === name ? "text-primary" : "text-gray-400"
                      }`}
                    >
                      {name.slice(0, 8)}
                    </span>
                  </button>
                ))}
              </div>
              {filteredIcons.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No se encontraron iconos
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
