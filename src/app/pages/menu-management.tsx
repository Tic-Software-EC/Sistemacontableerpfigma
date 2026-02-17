import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Settings,
  Building2,
  LogOut,
  X,
  FileText,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Receipt,
  ClipboardList,
  Warehouse,
  BarChart3,
  Calculator,
  Plus,
  Edit3,
  Trash2,
  Save,
  Check,
  Menu,
  ChevronRight,
  List,
  MoveVertical,
  Search,
  Home,
  TrendingUp,
  CreditCard as CreditCardIcon,
  Truck,
  ShieldCheck,
  Globe,
  Zap,
  Database,
  Cloud,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Image as ImageIcon,
  Music,
  Film,
  Code,
  Terminal,
  Cpu,
  HardDrive,
  Server,
  Smartphone,
  Tablet,
  Monitor,
  Printer,
  Headphones,
  Camera,
  Calendar,
  FileSpreadsheet,
  UserCheck,
  BookOpen,
  PieChart,
  Layers,
  Target,
  Briefcase,
  Activity,
} from "lucide-react";
import { AdminNavigation } from "../components/admin-navigation";
import { ProfileModal } from "../components/profile-modal";

// Lista de íconos disponibles
const availableIcons = [
  { name: "FileText", icon: FileText, label: "Documento" },
  { name: "Users", icon: Users, label: "Usuarios" },
  { name: "ShoppingCart", icon: ShoppingCart, label: "Carrito" },
  { name: "DollarSign", icon: DollarSign, label: "Dólar" },
  { name: "Package", icon: Package, label: "Paquete" },
  { name: "Receipt", icon: Receipt, label: "Recibo" },
  { name: "ClipboardList", icon: ClipboardList, label: "Lista" },
  { name: "Warehouse", icon: Warehouse, label: "Bodega" },
  { name: "BarChart3", icon: BarChart3, label: "Gráfico" },
  { name: "Calendar", icon: Calendar, label: "Calendario" },
  { name: "FileSpreadsheet", icon: FileSpreadsheet, label: "Hoja" },
  { name: "UserCheck", icon: UserCheck, label: "Usuario Check" },
  { name: "Calculator", icon: Calculator, label: "Calculadora" },
  { name: "BookOpen", icon: BookOpen, label: "Libro" },
  { name: "PieChart", icon: PieChart, label: "Gráfico Pie" },
  { name: "Layers", icon: Layers, label: "Capas" },
  { name: "Target", icon: Target, label: "Objetivo" },
  { name: "Briefcase", icon: Briefcase, label: "Maletín" },
  { name: "Activity", icon: Activity, label: "Actividad" },
  { name: "Home", icon: Home, label: "Inicio" },
  { name: "TrendingUp", icon: TrendingUp, label: "Tendencia" },
  { name: "CreditCard", icon: CreditCardIcon, label: "Tarjeta" },
  { name: "Truck", icon: Truck, label: "Camión" },
  { name: "ShieldCheck", icon: ShieldCheck, label: "Escudo" },
  { name: "Globe", icon: Globe, label: "Globo" },
  { name: "Zap", icon: Zap, label: "Rayo" },
  { name: "Database", icon: Database, label: "Base de Datos" },
  { name: "Cloud", icon: Cloud, label: "Nube" },
  { name: "Bell", icon: Bell, label: "Campana" },
  { name: "Mail", icon: Mail, label: "Correo" },
  { name: "MessageSquare", icon: MessageSquare, label: "Mensaje" },
  { name: "Phone", icon: Phone, label: "Teléfono" },
  { name: "Video", icon: Video, label: "Video" },
  { name: "Image", icon: ImageIcon, label: "Imagen" },
  { name: "Music", icon: Music, label: "Música" },
  { name: "Film", icon: Film, label: "Película" },
  { name: "Code", icon: Code, label: "Código" },
  { name: "Terminal", icon: Terminal, label: "Terminal" },
  { name: "Cpu", icon: Cpu, label: "CPU" },
  { name: "HardDrive", icon: HardDrive, label: "Disco Duro" },
  { name: "Server", icon: Server, label: "Servidor" },
  { name: "Smartphone", icon: Smartphone, label: "Móvil" },
  { name: "Tablet", icon: Tablet, label: "Tablet" },
  { name: "Monitor", icon: Monitor, label: "Monitor" },
  { name: "Printer", icon: Printer, label: "Impresora" },
  { name: "Headphones", icon: Headphones, label: "Audífonos" },
  { name: "Camera", icon: Camera, label: "Cámara" },
  { name: "Settings", icon: Settings, label: "Configuración" },
];

interface SubMenuItem {
  id: string;
  name: string;
  description: string;
  icon: string; // Agregar ícono a submenús
  url: string; // Agregar URL a submenús
  order: number;
  subMenus: SubMenuItem[]; // Estructura recursiva para múltiples niveles
}

interface SubModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  url: string; // Agregar URL a menús principales
  order: number;
  subMenus: SubMenuItem[];
}

interface Module {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  subModules: SubModule[];
}

export default function MenuManagementPage() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isSubmenu, setIsSubmenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<SubModule | null>(null);
  const [selectedSubmenu, setSelectedSubmenu] = useState<SubMenuItem | null>(null);
  const [selectedParentMenu, setSelectedParentMenu] = useState<SubModule | SubMenuItem | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageType, setSuccessMessageType] = useState<"create" | "update" | "delete">("create");
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Estado para perfil de usuario
  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador",
    avatar: "",
  });

  // Form state
  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    icon: "",
    url: "", // Agregar campo URL
    order: 1,
    parentMenuId: "",
  });

  // Definición de todos los módulos del sistema
  const [modules, setModules] = useState<Module[]>([
    {
      id: "facturas",
      name: "Facturas",
      icon: FileText,
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.15)",
      description: "Facturación electrónica completa",
      subModules: [
        {
          id: "fact-1",
          name: "Emisión de Facturas",
          description: "Crear y emitir facturas electrónicas",
          icon: "FileText",
          url: "/facturas/emision",
          order: 1,
          subMenus: [
            {
              id: "fact-1-1",
              name: "Nueva Factura",
              description: "Crear una nueva factura",
              icon: "FileText",
              url: "/facturas/emision/nueva",
              order: 1,
              subMenus: [],
            },
            {
              id: "fact-1-2",
              name: "Lista de Facturas",
              description: "Ver todas las facturas emitidas",
              icon: "FileText",
              url: "/facturas/emision/lista",
              order: 2,
              subMenus: [
                {
                  id: "fact-1-2-1",
                  name: "Facturas Pendientes",
                  description: "Facturas por cobrar",
                  icon: "FileText",
                  url: "/facturas/emision/lista/pendientes",
                  order: 1,
                  subMenus: [],
                },
                {
                  id: "fact-1-2-2",
                  name: "Facturas Pagadas",
                  description: "Historial de facturas pagadas",
                  icon: "FileText",
                  url: "/facturas/emision/lista/pagadas",
                  order: 2,
                  subMenus: [],
                },
              ],
            },
          ],
        },
        {
          id: "fact-2",
          name: "Notas de Crédito",
          description: "Gestión de devoluciones y anulaciones",
          icon: "Receipt",
          url: "/facturas/notas-credito",
          order: 2,
          subMenus: [],
        },
        {
          id: "fact-3",
          name: "Notas de Débito",
          description: "Cargos adicionales a facturas",
          icon: "ClipboardList",
          url: "/facturas/notas-debito",
          order: 3,
          subMenus: [],
        },
      ],
    },
    {
      id: "clientes",
      name: "Clientes",
      icon: Users,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.15)",
      description: "Administración de clientes",
      subModules: [
        {
          id: "cli-1",
          name: "Base de Clientes",
          description: "Registro y gestión de clientes",
          icon: "Users",
          url: "/clientes/base",
          order: 1,
          subMenus: [
            {
              id: "cli-1-1",
              name: "Nuevo Cliente",
              description: "Registrar nuevo cliente",
              icon: "UserCheck",
              url: "/clientes/base/nuevo",
              order: 1,
              subMenus: [],
            },
            {
              id: "cli-1-2",
              name: "Lista de Clientes",
              description: "Ver todos los clientes",
              icon: "Users",
              url: "/clientes/base/lista",
              order: 2,
              subMenus: [
                {
                  id: "cli-1-2-1",
                  name: "Clientes Activos",
                  description: "Clientes con cuenta activa",
                  icon: "UserCheck",
                  url: "/clientes/base/lista/activos",
                  order: 1,
                  subMenus: [],
                },
                {
                  id: "cli-1-2-2",
                  name: "Clientes Inactivos",
                  description: "Clientes con cuenta suspendida",
                  icon: "Users",
                  url: "/clientes/base/lista/inactivos",
                  order: 2,
                  subMenus: [],
                },
              ],
            },
          ],
        },
        {
          id: "cli-2",
          name: "Reportes de Clientes",
          description: "Estadísticas y análisis",
          icon: "BarChart3",
          url: "/clientes/reportes",
          order: 2,
          subMenus: [],
        },
      ],
    },
    {
      id: "inventario",
      name: "Inventario",
      icon: Package,
      color: "#F97316",
      bgColor: "rgba(249, 115, 22, 0.15)",
      description: "Control de stock y productos",
      subModules: [
        {
          id: "inv-1",
          name: "Productos",
          description: "Catálogo de productos",
          icon: "Package",
          url: "/inventario/productos",
          order: 1,
          subMenus: [
            {
              id: "inv-1-1",
              name: "Agregar Producto",
              description: "Registrar nuevo producto",
              icon: "Package",
              url: "/inventario/productos/nuevo",
              order: 1,
              subMenus: [],
            },
            {
              id: "inv-1-2",
              name: "Categorías",
              description: "Gestión de categorías",
              icon: "Layers",
              url: "/inventario/productos/categorias",
              order: 2,
              subMenus: [
                {
                  id: "inv-1-2-1",
                  name: "Nueva Categoría",
                  description: "Crear categoría de productos",
                  icon: "Layers",
                  url: "/inventario/productos/categorias/nueva",
                  order: 1,
                  subMenus: [],
                },
                {
                  id: "inv-1-2-2",
                  name: "Lista de Categorías",
                  description: "Ver todas las categorías",
                  icon: "List",
                  url: "/inventario/productos/categorias/lista",
                  order: 2,
                  subMenus: [],
                },
              ],
            },
          ],
        },
        {
          id: "inv-2",
          name: "Bodegas",
          description: "Control de almacenes",
          icon: "Warehouse",
          url: "/inventario/bodegas",
          order: 2,
          subMenus: [],
        },
      ],
    },
  ]);

  const toggleExpandMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  // Función recursiva para agregar un submenú en cualquier nivel
  const addSubMenuRecursive = (subMenus: SubMenuItem[], parentId: string, newSubmenu: SubMenuItem): SubMenuItem[] => {
    return subMenus.map((sm) => {
      if (sm.id === parentId) {
        return {
          ...sm,
          subMenus: [...sm.subMenus, newSubmenu].sort((a, b) => a.order - b.order),
        };
      }
      if (sm.subMenus.length > 0) {
        return {
          ...sm,
          subMenus: addSubMenuRecursive(sm.subMenus, parentId, newSubmenu),
        };
      }
      return sm;
    });
  };

  // Función recursiva para actualizar un submenú en cualquier nivel
  const updateSubMenuRecursive = (subMenus: SubMenuItem[], targetId: string, updates: Partial<SubMenuItem>): SubMenuItem[] => {
    return subMenus.map((sm) => {
      if (sm.id === targetId) {
        return { ...sm, ...updates };
      }
      if (sm.subMenus.length > 0) {
        return {
          ...sm,
          subMenus: updateSubMenuRecursive(sm.subMenus, targetId, updates),
        };
      }
      return sm;
    }).sort((a, b) => a.order - b.order);
  };

  // Función recursiva para eliminar un submenú en cualquier nivel
  const deleteSubMenuRecursive = (subMenus: SubMenuItem[], targetId: string): SubMenuItem[] => {
    return subMenus
      .filter((sm) => sm.id !== targetId)
      .map((sm) => {
        if (sm.subMenus.length > 0) {
          return {
            ...sm,
            subMenus: deleteSubMenuRecursive(sm.subMenus, targetId),
          };
        }
        return sm;
      });
  };

  const handleOpenCreateModal = (parentMenu?: SubModule | SubMenuItem) => {
    setModalMode("create");
    setIsSubmenu(!!parentMenu);
    setSelectedParentMenu(parentMenu || null);
    
    const maxOrder = parentMenu
      ? Math.max(0, ...parentMenu.subMenus.map((sm) => sm.order)) + 1
      : selectedModule
      ? Math.max(0, ...selectedModule.subModules.map((sm) => sm.order)) + 1
      : 1;

    setMenuForm({
      name: "",
      description: "",
      icon: "",
      url: "", // Inicializar URL
      order: maxOrder,
      parentMenuId: parentMenu?.id || "",
    });
    setShowMenuModal(true);
  };

  const handleOpenEditModal = (menu: SubModule | SubMenuItem, parentMenu?: SubModule | SubMenuItem) => {
    setModalMode("edit");
    setIsSubmenu(!!parentMenu);
    setSelectedParentMenu(parentMenu || null);

    // Verificar si es SubModule (tiene propiedad url y es de tipo SubModule)
    const isSubModule = 'url' in menu && 'subMenus' in menu && !parentMenu;
    
    if (isSubModule) {
      // Es un menú principal (SubModule)
      setSelectedMenu(menu as SubModule);
      setSelectedSubmenu(null);
      setMenuForm({
        name: menu.name,
        description: menu.description,
        icon: menu.icon,
        url: menu.url,
        order: menu.order,
        parentMenuId: "",
      });
    } else {
      // Es un submenú (SubMenuItem)
      setSelectedSubmenu(menu as SubMenuItem);
      setSelectedMenu(null);
      setMenuForm({
        name: menu.name,
        description: menu.description,
        icon: menu.icon, // Ahora los submenús también tienen ícono
        url: menu.url,
        order: menu.order,
        parentMenuId: parentMenu?.id || "",
      });
    }
    setShowMenuModal(true);
  };

  const handleCreateMenu = () => {
    if (!selectedModule || !menuForm.name.trim()) return;

    if (isSubmenu && selectedParentMenu) {
      // Crear submenú (puede ser en cualquier nivel)
      const newSubmenu: SubMenuItem = {
        id: `${selectedParentMenu.id}-${Date.now()}`,
        name: menuForm.name,
        description: menuForm.description,
        icon: menuForm.icon,
        url: menuForm.url,
        order: menuForm.order,
        subMenus: [],
      };

      setModules((prev) =>
        prev.map((module) => {
          if (module.id !== selectedModule.id) return module;
          return {
            ...module,
            subModules: module.subModules.map((sub) => {
              // Si el padre es un SubModule (nivel 1)
              if (sub.id === selectedParentMenu.id) {
                return {
                  ...sub,
                  subMenus: [...sub.subMenus, newSubmenu].sort((a, b) => a.order - b.order),
                };
              }
              // Si el padre está en niveles más profundos
              if (sub.subMenus.length > 0) {
                return {
                  ...sub,
                  subMenus: addSubMenuRecursive(sub.subMenus, selectedParentMenu.id, newSubmenu),
                };
              }
              return sub;
            }),
          };
        })
      );

      // Actualizar selectedModule
      setSelectedModule((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subModules: prev.subModules.map((sub) => {
            if (sub.id === selectedParentMenu.id) {
              return {
                ...sub,
                subMenus: [...sub.subMenus, newSubmenu].sort((a, b) => a.order - b.order),
              };
            }
            if (sub.subMenus.length > 0) {
              return {
                ...sub,
                subMenus: addSubMenuRecursive(sub.subMenus, selectedParentMenu.id, newSubmenu),
              };
            }
            return sub;
          }),
        };
      });
    } else {
      // Crear menú principal
      const newMenu: SubModule = {
        id: `${selectedModule.id}-${Date.now()}`,
        name: menuForm.name,
        description: menuForm.description,
        icon: menuForm.icon,
        url: menuForm.url,
        order: menuForm.order,
        subMenus: [],
      };

      setModules((prev) =>
        prev.map((module) => {
          if (module.id !== selectedModule.id) return module;
          return {
            ...module,
            subModules: [...module.subModules, newMenu].sort((a, b) => a.order - b.order),
          };
        })
      );

      // Actualizar selectedModule
      setSelectedModule((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subModules: [...prev.subModules, newMenu].sort((a, b) => a.order - b.order),
        };
      });
    }

    setShowMenuModal(false);
    setSuccessMessageType("create");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

  const handleUpdateMenu = () => {
    if (!selectedModule || !menuForm.name.trim()) return;

    if (isSubmenu && selectedSubmenu && selectedParentMenu) {
      // Actualizar submenú (puede estar en cualquier nivel)
      setModules((prev) =>
        prev.map((module) => {
          if (module.id !== selectedModule.id) return module;
          return {
            ...module,
            subModules: module.subModules.map((sub) => {
              // Si el padre es el SubModule (nivel 1)
              if (sub.id === selectedParentMenu.id) {
                return {
                  ...sub,
                  subMenus: updateSubMenuRecursive(sub.subMenus, selectedSubmenu.id, {
                    name: menuForm.name,
                    description: menuForm.description,
                    icon: menuForm.icon,
                    url: menuForm.url,
                    order: menuForm.order,
                  }),
                };
              }
              // Buscar en niveles más profundos
              if (sub.subMenus.length > 0) {
                return {
                  ...sub,
                  subMenus: updateSubMenuRecursive(sub.subMenus, selectedSubmenu.id, {
                    name: menuForm.name,
                    description: menuForm.description,
                    icon: menuForm.icon,
                    url: menuForm.url,
                    order: menuForm.order,
                  }),
                };
              }
              return sub;
            }),
          };
        })
      );

      // Actualizar selectedModule
      setSelectedModule((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subModules: prev.subModules.map((sub) => {
            if (sub.id === selectedParentMenu.id) {
              return {
                ...sub,
                subMenus: updateSubMenuRecursive(sub.subMenus, selectedSubmenu.id, {
                  name: menuForm.name,
                  description: menuForm.description,
                  icon: menuForm.icon,
                  url: menuForm.url,
                  order: menuForm.order,
                }),
              };
            }
            if (sub.subMenus.length > 0) {
              return {
                ...sub,
                subMenus: updateSubMenuRecursive(sub.subMenus, selectedSubmenu.id, {
                  name: menuForm.name,
                  description: menuForm.description,
                  icon: menuForm.icon,
                  url: menuForm.url,
                  order: menuForm.order,
                }),
              };
            }
            return sub;
          }),
        };
      });
    } else if (selectedMenu) {
      // Actualizar menú principal
      setModules((prev) =>
        prev.map((module) => {
          if (module.id !== selectedModule.id) return module;
          return {
            ...module,
            subModules: module.subModules
              .map((sub) => {
                if (sub.id !== selectedMenu.id) return sub;
                return {
                  ...sub,
                  name: menuForm.name,
                  description: menuForm.description,
                  icon: menuForm.icon,
                  url: menuForm.url,
                  order: menuForm.order,
                };
              })
              .sort((a, b) => a.order - b.order),
          };
        })
      );

      // Actualizar selectedModule
      setSelectedModule((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subModules: prev.subModules
            .map((sub) => {
              if (sub.id !== selectedMenu.id) return sub;
              return {
                ...sub,
                name: menuForm.name,
                description: menuForm.description,
                icon: menuForm.icon,
                url: menuForm.url,
                order: menuForm.order,
              };
            })
            .sort((a, b) => a.order - b.order),
        };
      });
    }

    setShowMenuModal(false);
    setSuccessMessageType("update");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

  const handleDeleteMenu = (menuId: string, parentMenuId?: string) => {
    if (!selectedModule) return;
    if (!confirm("¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.")) return;

    if (parentMenuId) {
      // Eliminar submenú (puede estar en cualquier nivel)
      setModules((prev) =>
        prev.map((module) => {
          if (module.id !== selectedModule.id) return module;
          return {
            ...module,
            subModules: module.subModules.map((sub) => {
              // Si el padre es el SubModule (nivel 1)
              if (sub.id === parentMenuId) {
                return {
                  ...sub,
                  subMenus: deleteSubMenuRecursive(sub.subMenus, menuId),
                };
              }
              // Buscar en niveles más profundos
              if (sub.subMenus.length > 0) {
                return {
                  ...sub,
                  subMenus: deleteSubMenuRecursive(sub.subMenus, menuId),
                };
              }
              return sub;
            }),
          };
        })
      );

      // Actualizar selectedModule
      setSelectedModule((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subModules: prev.subModules.map((sub) => {
            if (sub.id === parentMenuId) {
              return {
                ...sub,
                subMenus: deleteSubMenuRecursive(sub.subMenus, menuId),
              };
            }
            if (sub.subMenus.length > 0) {
              return {
                ...sub,
                subMenus: deleteSubMenuRecursive(sub.subMenus, menuId),
              };
            }
            return sub;
          }),
        };
      });
    } else {
      // Eliminar menú principal
      setModules((prev) =>
        prev.map((module) => {
          if (module.id !== selectedModule.id) return module;
          return {
            ...module,
            subModules: module.subModules.filter((sub) => sub.id !== menuId),
          };
        })
      );

      // Actualizar selectedModule
      setSelectedModule((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subModules: prev.subModules.filter((sub) => sub.id !== menuId),
        };
      });
    }

    setSuccessMessageType("delete");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

  const getSuccessMessage = () => {
    switch (successMessageType) {
      case "create":
        return {
          title: "¡Elemento Creado!",
          message: `El nuevo ${isSubmenu ? "submenú" : "menú"} se ha creado correctamente`,
          bgColor: "bg-green-600",
          borderColor: "border-green-500",
        };
      case "update":
        return {
          title: "¡Elemento Actualizado!",
          message: "Los cambios se han guardado correctamente",
          bgColor: "bg-blue-600",
          borderColor: "border-blue-500",
        };
      case "delete":
        return {
          title: "¡Elemento Eliminado!",
          message: "El elemento se ha eliminado correctamente",
          bgColor: "bg-red-600",
          borderColor: "border-red-500",
        };
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find((i) => i.name === iconName);
    return iconData ? iconData.icon : Package;
  };

  const filteredIcons = availableIcons.filter((icon) =>
    icon.label.toLowerCase().includes(iconSearchTerm.toLowerCase()) ||
    icon.name.toLowerCase().includes(iconSearchTerm.toLowerCase())
  );

  // Componente recursivo para renderizar submenús hasta nivel 2
  const RenderSubMenus = ({ 
    subMenus, 
    parentMenu, 
    level = 1 
  }: { 
    subMenus: SubMenuItem[]; 
    parentMenu: SubModule | SubMenuItem; 
    level?: number;
  }) => {
    if (level > 2) return null; // Limitar a nivel 2

    return (
      <>
        {subMenus.map((submenu) => {
          const hasChildren = submenu.subMenus && submenu.subMenus.length > 0;
          const isExpanded = expandedMenus.includes(submenu.id);
          const IconComponent = getIconComponent(submenu.icon);

          return (
            <div key={submenu.id}>
              <div
                className={`bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors`}
                style={{ marginLeft: `${level * 24}px` }}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Botón de expandir/contraer */}
                      <button
                        onClick={() => toggleExpandMenu(submenu.id)}
                        className={`p-1 rounded transition-colors ${
                          hasChildren
                            ? "text-gray-400 hover:text-white hover:bg-white/10"
                            : "invisible"
                        }`}
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {/* Contenido del submenú */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {/* Ícono del submenú */}
                          <div className="w-6 h-6 bg-white/5 rounded flex items-center justify-center">
                            <IconComponent className="w-3.5 h-3.5 text-gray-400" />
                          </div>
                          <MoveVertical className="w-3 h-3 text-gray-600" />
                          <span className="text-xs text-gray-500">Orden: {submenu.order}</span>
                          <span className="text-gray-600">•</span>
                          <h5 className={`text-white font-medium ${level === 1 ? 'text-sm' : 'text-xs'}`}>
                            {submenu.name}
                          </h5>
                        </div>
                        <p className={`text-gray-400 ${level === 1 ? 'text-xs' : 'text-[11px]'} ml-8`}>
                          {submenu.description}
                        </p>
                        {submenu.url && (
                          <p className={`text-blue-400 ${level === 1 ? 'text-xs' : 'text-[11px]'} ml-8 mt-1`}>
                            {submenu.url}
                          </p>
                        )}

                        {/* Badge de submenús hijos */}
                        {hasChildren && (
                          <div className="flex gap-2 mt-2 ml-8">
                            <span className="text-xs px-2 py-1 rounded bg-indigo-500/20 text-indigo-400">
                              {submenu.subMenus.length} submenús
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-1 ml-4">
                      {level < 2 && (
                        <button
                          onClick={() => handleOpenCreateModal(submenu)}
                          className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                          title="Agregar submenú"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEditModal(submenu, parentMenu)}
                        className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(submenu.id, parentMenu.id)}
                        className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Renderizar submenús hijos recursivamente */}
              {isExpanded && hasChildren && (
                <div className="mt-2 space-y-2">
                  <RenderSubMenus
                    subMenus={submenu.subMenus}
                    parentMenu={submenu}
                    level={level + 1}
                  />
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  };

  const successMsg = getSuccessMessage();

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-secondary border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">TicSoftEc</h1>
                <p className="text-gray-400 text-xs">Administrador de Suscripciones</p>
              </div>
            </div>

            {/* Usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SA</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Super Admin</p>
                  <p className="text-gray-400 text-xs">Administrador</p>
                </div>
              </button>

              {/* Menú de usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#3a3f4f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm">Super Admin</p>
                    <p className="text-gray-400 text-xs">admin@ticsoftec.com</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Configuración</span>
                    </button>
                    <div className="border-t border-white/10 my-2"></div>
                    <button
                      onClick={() => navigate("/")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navegación entre secciones */}
      <div className="bg-secondary border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <AdminNavigation activeSection="menus" />
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Título y descripción */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Gestión de Menús y Submenús</h2>
          <p className="text-gray-400">
            Administra la estructura de menús y su orden de visualización por módulo. El control de acceso se gestiona a nivel de módulos en los planes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de módulos */}
          <div className="lg:col-span-1">
            <div className="bg-[#1e2530] border border-white/10 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Módulos del Sistema
              </h3>
              <div className="space-y-2">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const isSelected = selectedModule?.id === module.id;

                  return (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isSelected
                          ? "bg-primary/20 border border-primary"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: module.bgColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: module.color }} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-medium text-sm ${isSelected ? "text-white" : "text-gray-300"}`}>
                          {module.name}
                        </p>
                        <p className="text-xs text-gray-500">{module.subModules.length} menús</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detalle del módulo seleccionado */}
          <div className="lg:col-span-2">
            {!selectedModule ? (
              <div className="bg-[#1e2530] border border-white/10 rounded-xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-4">
                  <Menu className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Selecciona un Módulo</h3>
                <p className="text-gray-400 text-sm">Elige un módulo de la lista para gestionar sus menús</p>
              </div>
            ) : (
              <div className="bg-[#1e2530] border border-white/10 rounded-xl">
                {/* Header del módulo */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: selectedModule.bgColor }}
                      >
                        {(() => {
                          const Icon = selectedModule.icon;
                          return <Icon className="w-7 h-7" style={{ color: selectedModule.color }} />;
                        })()}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-xl">{selectedModule.name}</h3>
                        <p className="text-gray-400 text-sm">{selectedModule.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenCreateModal()}
                      className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Nuevo Menú
                    </button>
                  </div>
                </div>

                {/* Lista de menús con jerarquía */}
                <div className="p-6">
                  {selectedModule.subModules.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm mb-4">No hay menús configurados para este módulo</p>
                      <button
                        onClick={() => handleOpenCreateModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Crear primer menú
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedModule.subModules.map((menu) => (
                        <div key={menu.id}>
                          {/* Menú principal */}
                          <div className="bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                            <div className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <button
                                    onClick={() => toggleExpandMenu(menu.id)}
                                    className={`p-1 rounded transition-colors ${
                                      menu.subMenus.length > 0
                                        ? "text-gray-400 hover:text-white hover:bg-white/10"
                                        : "invisible"
                                    }`}
                                  >
                                    <ChevronRight
                                      className={`w-4 h-4 transition-transform ${
                                        expandedMenus.includes(menu.id) ? "rotate-90" : ""
                                      }`}
                                    />
                                  </button>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      {/* Ícono del menú principal */}
                                      {(() => {
                                        const MenuIconComponent = getIconComponent(menu.icon);
                                        return (
                                          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                            <MenuIconComponent className="w-4 h-4 text-primary" />
                                          </div>
                                        );
                                      })()}
                                      <MoveVertical className="w-4 h-4 text-gray-500" />
                                      <span className="text-xs text-gray-500">Orden: {menu.order}</span>
                                      <span className="text-gray-600">•</span>
                                      <h4 className="text-white font-medium">{menu.name}</h4>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-2">{menu.description}</p>
                                    
                                    {/* URL del menú */}
                                    {menu.url && (
                                      <p className="text-blue-400 text-xs mb-3">
                                        {menu.url}
                                      </p>
                                    )}

                                    {/* Badge de submenús */}
                                    {menu.subMenus.length > 0 && (
                                      <div className="flex gap-2">
                                        <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                                          {menu.subMenus.length} submenús
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Botones de acción */}
                                <div className="flex gap-1 ml-4">
                                  <button
                                    onClick={() => handleOpenCreateModal(menu)}
                                    className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                    title="Agregar submenú"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditModal(menu)}
                                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                    title="Editar"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMenu(menu.id)}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Submenús recursivos */}
                            {expandedMenus.includes(menu.id) && menu.subMenus.length > 0 && (
                              <div className="border-t border-white/10 bg-black/20">
                                <div className="p-4 space-y-2">
                                  <RenderSubMenus
                                    subMenus={menu.subMenus}
                                    parentMenu={menu}
                                    level={1}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Crear/Editar Menú/Submenú */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2530] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#1e2530] z-10">
              <div className="flex items-center gap-3">
                {modalMode === "create" ? (
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-blue-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-semibold text-xl">
                    {modalMode === "create"
                      ? isSubmenu
                        ? "Crear Nuevo Submenú"
                        : "Crear Nuevo Menú"
                      : isSubmenu
                      ? "Editar Submenú"
                      : "Editar Menú"}
                  </h3>
                  {isSubmenu && selectedParentMenu && (
                    <p className="text-gray-400 text-xs mt-1">
                      Submenú de: {selectedParentMenu.name}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowMenuModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Nombre {isSubmenu ? "del Submenú" : "del Menú"} *
                </label>
                <input
                  type="text"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder={isSubmenu ? "Ej: Lista de Facturas" : "Ej: Emisión de Facturas"}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Describe la funcionalidad de este menú"
                  rows={2}
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">URL</label>
                <input
                  type="text"
                  value={menuForm.url}
                  onChange={(e) => setMenuForm({ ...menuForm, url: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="/ruta/del/menu"
                />
              </div>

              {/* Orden de visualización */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  <div className="flex items-center gap-2">
                    <MoveVertical className="w-4 h-4" />
                    Orden de Visualización *
                  </div>
                </label>
                <input
                  type="number"
                  min="1"
                  value={menuForm.order}
                  onChange={(e) => setMenuForm({ ...menuForm, order: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="1"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Define el orden en que aparecerá este elemento (menor número = más arriba)
                </p>
              </div>

              {/* Ícono */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Ícono {isSubmenu ? "del Submenú" : "del Menú"} *
                </label>
                
                {/* Botón selector de ícono */}
                <button
                  type="button"
                  onClick={() => setShowIconSelector(!showIconSelector)}
                  className="w-full bg-[#3a3f4f] border border-white/10 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-[#424856] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const IconComponent = getIconComponent(menuForm.icon || "Package");
                      return (
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                      );
                    })()}
                    <div className="text-left">
                      <p className="text-white font-medium text-sm">{menuForm.icon || "Seleccionar ícono"}</p>
                      <p className="text-gray-400 text-xs">Click para cambiar</p>
                    </div>
                  </div>
                  <Search className="w-4 h-4 text-gray-400" />
                </button>

                {/* Panel de selección de íconos */}
                {showIconSelector && (
                  <div className="mt-3 bg-[#2a2f3d] border border-white/10 rounded-lg p-4">
                    {/* Búsqueda */}
                    <div className="mb-4 relative">
                      <input
                        type="text"
                        value={iconSearchTerm}
                        onChange={(e) => setIconSearchTerm(e.target.value)}
                        className="w-full bg-[#3a3f4f] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary transition-colors"
                        placeholder="Buscar ícono..."
                      />
                      <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
                    </div>

                    {/* Grid de íconos */}
                    <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                      {filteredIcons.map((iconData) => {
                        const IconComp = iconData.icon;
                        const isSelected = menuForm.icon === iconData.name;
                        return (
                          <button
                            key={iconData.name}
                            type="button"
                            onClick={() => {
                              setMenuForm({ ...menuForm, icon: iconData.name });
                              setShowIconSelector(false);
                              setIconSearchTerm("");
                            }}
                            className={`p-3 rounded-lg transition-all ${
                              isSelected
                                ? "bg-primary/20 border-2 border-primary"
                                : "bg-[#3a3f4f] border border-white/10 hover:bg-[#424856]"
                            }`}
                            title={iconData.label}
                          >
                            <IconComp
                              className="w-5 h-5 mx-auto"
                              style={{ color: isSelected ? "#E8692E" : "#9CA3AF" }}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {filteredIcons.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-4">
                        No se encontraron íconos
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-[#1e2530]">
              <button
                onClick={() => setShowMenuModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={modalMode === "create" ? handleCreateMenu : handleUpdateMenu}
                disabled={!menuForm.name.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  !menuForm.name.trim()
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : modalMode === "create"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                <Save className="w-4 h-4" />
                {modalMode === "create" ? "Crear" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito flotante */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-[100]">
          <div
            className={`${successMsg.bgColor} border ${successMsg.borderColor} rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[350px] animate-slide-in-right`}
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{successMsg.title}</p>
              <p className="text-white/90 text-xs mt-0.5">{successMsg.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-gray-500 text-xs">
            TicSoftEc ERP v2.0 © 2024 - Gestión de Menús y Submenús
          </p>
        </div>
      </footer>

      {/* Modal de Configuración de Perfil */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={(newProfile) => setUserProfile(newProfile)}
      />

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}