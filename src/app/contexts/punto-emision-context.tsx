import { createContext, useContext, useState, ReactNode } from "react";

// ── Tipos ─────────────────────────────────────────────────────────────────────
export type TipoDoc = "FAC" | "LIQ" | "NOT_DEB" | "NOT_CRE" | "RET" | "GRE";

export interface PuntoEmision {
  id: string;
  sucursalId: string;        // ← ID de la Sucursal a la que pertenece
  establecimiento: string;   // ← se hereda/sincroniza del establecimiento de la sucursal
  puntoEmision: string;
  descripcion: string;
  tiposDocumento: TipoDoc[];
  secuenciales: Record<TipoDoc, number>;
  activo: boolean;
  responsable: string;
  ambiente: "1" | "2";
}

const STORAGE_KEY = "ticsoftec_puntos_emision";

const INITIAL: PuntoEmision[] = [
  {
    id: "pe1",
    sucursalId: "s1",
    establecimiento: "001",
    puntoEmision: "001",
    descripcion: "Punto de venta principal - Matriz",
    tiposDocumento: ["FAC", "NOT_CRE", "NOT_DEB", "RET"],
    secuenciales: { FAC: 1462, LIQ: 1, NOT_DEB: 23, NOT_CRE: 45, RET: 88, GRE: 1 },
    activo: true,
    responsable: "Juan Pérez",
    ambiente: "2",
  },
  {
    id: "pe2",
    sucursalId: "s1",
    establecimiento: "001",
    puntoEmision: "002",
    descripcion: "Caja 2 - Atención al cliente",
    tiposDocumento: ["FAC"],
    secuenciales: { FAC: 312, LIQ: 1, NOT_DEB: 1, NOT_CRE: 1, RET: 1, GRE: 1 },
    activo: true,
    responsable: "María Gómez",
    ambiente: "2",
  },
  {
    id: "pe3",
    sucursalId: "s2",
    establecimiento: "002",
    puntoEmision: "001",
    descripcion: "Caja Principal Norte",
    tiposDocumento: ["FAC", "GRE"],
    secuenciales: { FAC: 78, LIQ: 1, NOT_DEB: 1, NOT_CRE: 1, RET: 1, GRE: 5 },
    activo: true,
    responsable: "Carlos López",
    ambiente: "2",
  },
];

function load(): PuntoEmision[] {
  try { const s = localStorage.getItem(STORAGE_KEY); if (s) return JSON.parse(s); } catch {}
  return INITIAL;
}
function save(data: PuntoEmision[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ── Contexto ──────────────────────────────────────────────────────────────────
interface CtxValue {
  puntos: PuntoEmision[];
  setPuntos: (p: PuntoEmision[]) => void;
}

const Ctx = createContext<CtxValue | null>(null);

export function PuntoEmisionProvider({ children }: { children: ReactNode }) {
  const [puntos, setPuntosState] = useState<PuntoEmision[]>(load);
  const setPuntos = (p: PuntoEmision[]) => { setPuntosState(p); save(p); };
  return <Ctx.Provider value={{ puntos, setPuntos }}>{children}</Ctx.Provider>;
}

export function usePuntosEmision() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePuntosEmision must be used within PuntoEmisionProvider");
  return c;
}
