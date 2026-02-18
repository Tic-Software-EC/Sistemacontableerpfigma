import { WarehousesContent } from "../components/warehouses-content";
import { StockConfigContent } from "../components/stock-config-content";
import { CategoriesContent } from "../components/categories-content";
import { UnitsContent } from "../components/units-content";

export function Settings() {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["inventory"]);
  const [selectedSubMenu, setSelectedSubMenu] = useState<string | null>(null);

  const toggleMenu = (menuId: string) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter(id => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  const menuItems = [
    {
      id: "general",
      label: "Ajustes generales",
      icon: SettingsIcon,
      subItems: [],
    },
    {
      id: "users",
      label: "Usuarios",
      icon: Users,
      subItems: [],
    },
    {
      id: "sales",
      label: "Ventas",
      icon: ShoppingCart,
      subItems: [],
    },
    {
      id: "calendar",
      label: "Calendario",
      icon: Calendar,
      subItems: [],
    },
    {
      id: "purchases",
      label: "Compras",
      icon: ShoppingCart,
      subItems: [],
    },
    {
      id: "inventory",
      label: "Inventario",
      icon: Package,
      subItems: [
        { id: "warehouses", label: "Almacenes", icon: Warehouse },
        { id: "stock-config", label: "Configuración de stock", icon: SettingsIcon },
        { id: "categories", label: "Categorías", icon: FolderTree },
        { id: "units", label: "Unidades de medida", icon: Ruler },
      ],
    },
  ];

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Principal - Menús */}
      <aside className="w-64 bg-secondary rounded-xl p-4 flex-shrink-0">
        <div className="mb-6">
          <h2 className="text-white font-bold text-sm">Menús</h2>
        </div>

        <nav className="space-y-0.5">
          {menuItems.map((menu) => (
            <div key={menu.id}>
              <button
                onClick={() => {
                  if (menu.subItems.length > 0) {
                    toggleMenu(menu.id);
                  } else {
                    setSelectedSubMenu(menu.id);
                  }
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white rounded-lg transition-all text-sm group"
              >
                <menu.icon className="w-4 h-4" />
                <span className="flex-1 text-left">{menu.label}</span>
                {menu.subItems.length > 0 && (
                  expandedMenus.includes(menu.id) ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Submenú */}
              {menu.subItems.length > 0 && expandedMenus.includes(menu.id) && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {menu.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => setSelectedSubMenu(subItem.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                        selectedSubMenu === subItem.id
                          ? "bg-primary text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <subItem.icon className="w-4 h-4" />
                      <span className="text-left">{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 min-w-0">
        {!selectedSubMenu ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
              <SettingsIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-2">Selecciona un menú</h2>
            <p className="text-gray-500">Elige una opción del menú lateral para comenzar</p>
          </div>
        ) : selectedSubMenu === "warehouses" ? (
          <WarehousesContent />
        ) : selectedSubMenu === "stock-config" ? (
          <StockConfigContent />
        ) : selectedSubMenu === "categories" ? (
          <CategoriesContent />
        ) : selectedSubMenu === "units" ? (
          <UnitsContent />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="bg-white rounded-xl border border-gray-200 p-12">
              <Box className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Módulo en desarrollo</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}