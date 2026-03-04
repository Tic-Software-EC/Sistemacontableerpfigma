import { createContext, useContext, useState, ReactNode } from "react";

export interface Sucursal {
  id: string;
  code: string;
  name: string;
  establecimiento: string; // 3 dígitos SRI: "001", "002"…
  type: "principal" | "secundaria";
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  manager: string;
  openingDate: string;
  schedule: string;
  status: "active" | "inactive";
}

const STORAGE_KEY = "ticsoftec_sucursales";

const INITIAL: Sucursal[] = [
  { id: "s1", code: "SUC-001", name: "Sucursal Principal - Centro", establecimiento: "001", type: "principal", address: "Av. Amazonas N24-123 y Colón", city: "Quito",     province: "Pichincha", phone: "02-2345678", email: "centro@empresa.com",    manager: "Carlos Méndez",    openingDate: "2020-01-15", schedule: "Lun-Vie: 8:00-18:00, Sáb: 9:00-13:00",       status: "active"   },
  { id: "s2", code: "SUC-002", name: "Sucursal Norte",              establecimiento: "002", type: "secundaria", address: "Av. de los Shyris N34-567",   city: "Quito",     province: "Pichincha", phone: "02-3456789", email: "norte@empresa.com",     manager: "Ana Torres",       openingDate: "2021-03-20", schedule: "Lun-Vie: 9:00-17:00",                          status: "active"   },
  { id: "s3", code: "SUC-003", name: "Sucursal Guayaquil",          establecimiento: "003", type: "secundaria", address: "Av. 9 de Octubre 456",         city: "Guayaquil", province: "Guayas",    phone: "04-2345678", email: "guayaquil@empresa.com", manager: "Roberto Jiménez",  openingDate: "2021-06-10", schedule: "Lun-Vie: 8:30-17:30, Sáb: 9:00-12:00",       status: "active"   },
  { id: "s4", code: "SUC-004", name: "Sucursal Sur",                establecimiento: "004", type: "secundaria", address: "Av. Maldonado S56-789",        city: "Quito",     province: "Pichincha", phone: "02-4567890", email: "sur@empresa.com",       manager: "María López",      openingDate: "2022-01-05", schedule: "Lun-Vie: 9:00-18:00",                          status: "inactive" },
];

function load(): Sucursal[] {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch {}
  return INITIAL;
}
function save(data: Sucursal[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

interface CtxValue {
  sucursales: Sucursal[];
  setSucursales: (s: Sucursal[]) => void;
  activeSucursales: Sucursal[];
}

const Ctx = createContext<CtxValue | null>(null);

export function SucursalProvider({ children }: { children: ReactNode }) {
  const [sucursales, setSucursalesState] = useState<Sucursal[]>(load);
  const setSucursales = (s: Sucursal[]) => { setSucursalesState(s); save(s); };
  const activeSucursales = sucursales.filter(s => s.status === "active");
  return <Ctx.Provider value={{ sucursales, setSucursales, activeSucursales }}>{children}</Ctx.Provider>;
}

export function useSucursales() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSucursales must be used within SucursalProvider");
  return c;
}
