import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ── Tipos compartidos ─────────────────────────────────────────────────────────
export interface MenuPermission {
  menu: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

export interface ModulePermission {
  module: string;
  menus: MenuPermission[];
}

export interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

export interface SystemRole {
  id: string;
  code: string;
  name: string;
  description: string;
  type: "predefined" | "custom";
  usersCount: number;
  permissions: Permission[];
  modulePermissions?: ModulePermission[]; // Nueva estructura jerárquica
  color: string;
}

// ── Estructura de Módulos y Menús ─────────────────────────────────────────────
export interface ModuleStructure {
  module: string;
  icon: string;
  menus: string[];
}

export const MODULE_STRUCTURE: ModuleStructure[] = [
  {
    module: "Configuración",
    icon: "Settings",
    menus: ["Empresa", "Usuarios", "Roles y Permisos", "Puntos de Venta", "Impuestos", "Formas de Pago"]
  },
  {
    module: "Ventas",
    icon: "ShoppingCart",
    menus: ["Clientes", "Cotizaciones", "Facturas", "Notas de Crédito", "Punto de Venta", "Reportes de Ventas"]
  },
  {
    module: "Inventario",
    icon: "Package",
    menus: ["Productos", "Categorías", "Bodegas", "Transferencias", "Ajustes de Inventario", "Kardex"]
  },
  {
    module: "Contabilidad",
    icon: "Calculator",
    menus: ["Plan de Cuentas", "Asientos Contables", "Libro Diario", "Libro Mayor", "Balance General", "Estado de Resultados"]
  },
  {
    module: "Compras",
    icon: "ShoppingBag",
    menus: ["Proveedores", "Órdenes de Compra", "Recepción de Mercadería", "Facturas de Proveedor", "Reportes de Compras"]
  }
];

const MODULES = MODULE_STRUCTURE.map(m => m.module);

// Helper para crear permisos vacíos por módulo
function createEmptyModulePermissions(): ModulePermission[] {
  return MODULE_STRUCTURE.map(moduleStruct => ({
    module: moduleStruct.module,
    menus: moduleStruct.menus.map(menu => ({
      menu,
      view: false,
      create: false,
      edit: false,
      delete: false,
      export: false
    }))
  }));
}

// Helper para crear permisos completos por módulo
function createFullModulePermissions(): ModulePermission[] {
  return MODULE_STRUCTURE.map(moduleStruct => ({
    module: moduleStruct.module,
    menus: moduleStruct.menus.map(menu => ({
      menu,
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true
    }))
  }));
}

// ── Roles predefinidos iniciales ──────────────────────────────────────────────
const INITIAL_ROLES: SystemRole[] = [
  {
    id: "2",
    code: "ADM-001",
    name: "Administrador de Empresa",
    description: "Gestión completa de la empresa y configuraciones",
    type: "predefined",
    usersCount: 5,
    color: "#3B82F6",
    permissions: MODULES.map((module) => ({
      module, view: true, create: true, edit: true, delete: true, export: true,
    })),
    modulePermissions: createFullModulePermissions()
  },
  {
    id: "3",
    code: "CON-001",
    name: "Contador",
    description: "Acceso completo a módulo contable y reportes financieros",
    type: "predefined",
    usersCount: 3,
    color: "#10B981",
    permissions: [
      { module: "Configuración", view: true,  create: false, edit: false, delete: false, export: false },
      { module: "Ventas",        view: true,  create: false, edit: false, delete: false, export: true  },
      { module: "Inventario",    view: true,  create: false, edit: false, delete: false, export: true  },
      { module: "Contabilidad",  view: true,  create: true,  edit: true,  delete: true,  export: true  },
      { module: "Compras",       view: true,  create: false, edit: false, delete: false, export: true  },
    ],
    modulePermissions: createEmptyModulePermissions()
  },
  {
    id: "4",
    code: "VEN-001",
    name: "Vendedor",
    description: "Gestión de ventas, facturación y clientes",
    type: "predefined",
    usersCount: 12,
    color: "#8B5CF6",
    permissions: [
      { module: "Configuración", view: true,  create: false, edit: false, delete: false, export: false },
      { module: "Ventas",        view: true,  create: true,  edit: true,  delete: false, export: true  },
      { module: "Inventario",    view: true,  create: false, edit: false, delete: false, export: false },
      { module: "Contabilidad",  view: false, create: false, edit: false, delete: false, export: false },
      { module: "Compras",       view: false, create: false, edit: false, delete: false, export: false },
    ],
    modulePermissions: createEmptyModulePermissions()
  },
  {
    id: "5",
    code: "CAJ-001",
    name: "Cajero",
    description: "Procesamiento de pagos y cierre de caja",
    type: "predefined",
    usersCount: 8,
    color: "#F59E0B",
    permissions: [
      { module: "Configuración", view: true,  create: false, edit: false, delete: false, export: false },
      { module: "Ventas",        view: true,  create: true,  edit: false, delete: false, export: false },
      { module: "Inventario",    view: true,  create: false, edit: false, delete: false, export: false },
      { module: "Contabilidad",  view: false, create: false, edit: false, delete: false, export: false },
      { module: "Compras",       view: false, create: false, edit: false, delete: false, export: false },
    ],
    modulePermissions: createEmptyModulePermissions()
  },
  {
    id: "6",
    code: "COM-001",
    name: "Comprador",
    description: "Gestión de compras, proveedores y órdenes",
    type: "predefined",
    usersCount: 4,
    color: "#EC4899",
    permissions: [
      { module: "Configuración", view: true,  create: false, edit: false, delete: false, export: false },
      { module: "Ventas",        view: false, create: false, edit: false, delete: false, export: false },
      { module: "Inventario",    view: true,  create: true,  edit: true,  delete: false, export: true  },
      { module: "Contabilidad",  view: false, create: false, edit: false, delete: false, export: false },
      { module: "Compras",       view: true,  create: true,  edit: true,  delete: false, export: true  },
    ],
    modulePermissions: createEmptyModulePermissions()
  },
  {
    id: "7",
    code: "BOD-001",
    name: "Bodeguero",
    description: "Control de inventario y movimientos de stock",
    type: "predefined",
    usersCount: 6,
    color: "#14B8A6",
    permissions: [
      { module: "Configuración", view: true,  create: false, edit: false, delete: false, export: false },
      { module: "Ventas",        view: true,  create: false, edit: false, delete: false, export: false },
      { module: "Inventario",    view: true,  create: true,  edit: true,  delete: false, export: true  },
      { module: "Contabilidad",  view: false, create: false, edit: false, delete: false, export: false },
      { module: "Compras",       view: true,  create: false, edit: false, delete: false, export: false },
    ],
    modulePermissions: createEmptyModulePermissions()
  },
];

const STORAGE_KEY = "ticsoftec_roles";

function loadRoles(): SystemRole[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as SystemRole[];
  } catch {}
  return INITIAL_ROLES;
}

function saveRoles(roles: SystemRole[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(roles)); } catch {}
}

// ── Contexto ──────────────────────────────────────────────────────────────────
interface RolesContextValue {
  roles: SystemRole[];
  setRoles: (roles: SystemRole[]) => void;
  modules: string[];
}

const RolesContext = createContext<RolesContextValue | null>(null);

export function RolesProvider({ children }: { children: ReactNode }) {
  const [roles, setRolesState] = useState<SystemRole[]>(loadRoles);

  const setRoles = (newRoles: SystemRole[]) => {
    setRolesState(newRoles);
    saveRoles(newRoles);
  };

  // Sync on first load if localStorage was empty
  useEffect(() => {
    saveRoles(roles);
  }, []); // eslint-disable-line

  return (
    <RolesContext.Provider value={{ roles, setRoles, modules: MODULES }}>
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles() {
  const ctx = useContext(RolesContext);
  if (!ctx) throw new Error("useRoles must be used within RolesProvider");
  return ctx;
}