import { createContext, useContext, useState, ReactNode, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════ */
export interface AsientoLinea {
  cuenta: string;
  nombre: string;
  debe:   number;
  haber:  number;
}

export type OrigenAsiento =
  | "ventas"
  | "compras"
  | "nomina"
  | "activos"
  | "cartera"
  | "pos"
  | "inventario"
  | "manual";

export interface Asiento {
  id:           string;
  fecha:        string;
  descripcion:  string;
  referencia:   string;
  tipo:         string;
  estado:       "aprobado" | "pendiente" | "borrador";
  origen:       OrigenAsiento;
  autoGenerado: boolean;
  debe:         number;
  haber:        number;
  lineas:       AsientoLinea[];
}

/* ══════════════════════════════════════════════════════════════════
   DATOS INICIALES
══════════════════════════════════════════════════════════════════ */
const ASIENTOS_INICIALES: Asiento[] = [
  // ── ENERO ──────────────────────────────────────────────────────
  {
    id: "ASI-2026-001", fecha: "2026-01-03",
    descripcion: "Venta - Factura #001-001-000101",
    referencia: "FAC-000101", tipo: "Venta", estado: "aprobado",
    origen: "ventas", autoGenerado: true, debe: 4480.00, haber: 4480.00,
    lineas: [
      { cuenta: "1.1.1.01", nombre: "Caja General",  debe: 4480.00, haber: 0       },
      { cuenta: "4.1.1.01", nombre: "Ventas",         debe: 0,       haber: 4000.00 },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",  debe: 0,       haber: 480.00  },
    ],
  },
  {
    id: "ASI-2026-002", fecha: "2026-01-05",
    descripcion: "Compra - FAC-P-000210 / Proveedor El Sur",
    referencia: "FAC-P-000210", tipo: "Compra", estado: "aprobado",
    origen: "compras", autoGenerado: true, debe: 3360.00, haber: 3360.00,
    lineas: [
      { cuenta: "1.1.4.01", nombre: "Inventario",         debe: 3000.00, haber: 0       },
      { cuenta: "1.1.3.01", nombre: "IVA en Compras",      debe: 360.00,  haber: 0       },
      { cuenta: "2.1.1.01", nombre: "Cuentas por Pagar",   debe: 0,       haber: 3360.00 },
    ],
  },
  {
    id: "ASI-2026-003", fecha: "2026-01-07",
    descripcion: "Venta POS - Terminal 01 / Turno mañana",
    referencia: "POS-2026-0001", tipo: "Venta", estado: "aprobado",
    origen: "pos", autoGenerado: true, debe: 896.00, haber: 896.00,
    lineas: [
      { cuenta: "1.1.1.01", nombre: "Caja General",  debe: 896.00, haber: 0      },
      { cuenta: "4.1.1.01", nombre: "Ventas",         debe: 0,      haber: 800.00 },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",  debe: 0,      haber: 96.00  },
    ],
  },
  {
    id: "ASI-2026-004", fecha: "2026-01-10",
    descripcion: "Cobro cartera - Cliente Tecno S.A.",
    referencia: "COB-2026-001", tipo: "Cobro", estado: "aprobado",
    origen: "cartera", autoGenerado: true, debe: 1500.00, haber: 1500.00,
    lineas: [
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",    debe: 1500.00, haber: 0       },
      { cuenta: "1.1.2.01", nombre: "Cuentas por Cobrar", debe: 0,       haber: 1500.00 },
    ],
  },
  {
    id: "ASI-2026-005", fecha: "2026-01-15",
    descripcion: "Depreciación mensual activos fijos - Enero 2026",
    referencia: "DEP-ENE-2026", tipo: "Depreciación", estado: "aprobado",
    origen: "activos", autoGenerado: true, debe: 850.00, haber: 850.00,
    lineas: [
      { cuenta: "5.2.1.01", nombre: "Gasto Depreciación",     debe: 850.00, haber: 0      },
      { cuenta: "1.2.1.02", nombre: "Dep. Acumulada Equipos",  debe: 0,      haber: 850.00 },
    ],
  },
  {
    id: "ASI-2026-006", fecha: "2026-01-20",
    descripcion: "Ajuste de inventario - Conteo físico enero",
    referencia: "AJU-INV-ENE", tipo: "Ajuste", estado: "aprobado",
    origen: "inventario", autoGenerado: true, debe: 210.00, haber: 210.00,
    lineas: [
      { cuenta: "5.3.1.01", nombre: "Pérdida por Ajuste Inventario", debe: 210.00, haber: 0      },
      { cuenta: "1.1.4.01", nombre: "Inventario",                     debe: 0,      haber: 210.00 },
    ],
  },
  {
    id: "ASI-2026-007", fecha: "2026-01-31",
    descripcion: "Pago de nómina - Enero 2026",
    referencia: "NOM-ENE-2026", tipo: "Nómina", estado: "aprobado",
    origen: "nomina", autoGenerado: true, debe: 11800.00, haber: 11800.00,
    lineas: [
      { cuenta: "5.1.1.01", nombre: "Sueldos y Salarios", debe: 11800.00, haber: 0        },
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",     debe: 0,        haber: 11800.00 },
    ],
  },
  // ── FEBRERO ─────────────────────────────────────────────────────
  {
    id: "ASI-2026-008", fecha: "2026-02-03",
    descripcion: "Venta - Factura #001-001-000112",
    referencia: "FAC-000112", tipo: "Venta", estado: "aprobado",
    origen: "ventas", autoGenerado: true, debe: 6272.00, haber: 6272.00,
    lineas: [
      { cuenta: "1.1.2.01", nombre: "Cuentas por Cobrar", debe: 6272.00, haber: 0       },
      { cuenta: "4.1.1.01", nombre: "Ventas",              debe: 0,       haber: 5600.00 },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",       debe: 0,       haber: 672.00  },
    ],
  },
  {
    id: "ASI-2026-009", fecha: "2026-02-05",
    descripcion: "Compra - FAC-P-000251 / Distribuidora Norte",
    referencia: "FAC-P-000251", tipo: "Compra", estado: "aprobado",
    origen: "compras", autoGenerado: true, debe: 5040.00, haber: 5040.00,
    lineas: [
      { cuenta: "1.1.4.01", nombre: "Inventario",         debe: 4500.00, haber: 0       },
      { cuenta: "1.1.3.01", nombre: "IVA en Compras",      debe: 540.00,  haber: 0       },
      { cuenta: "2.1.1.01", nombre: "Cuentas por Pagar",   debe: 0,       haber: 5040.00 },
    ],
  },
  {
    id: "ASI-2026-010", fecha: "2026-02-08",
    descripcion: "Venta POS - Terminal 02 / Turno tarde",
    referencia: "POS-2026-0021", tipo: "Venta", estado: "aprobado",
    origen: "pos", autoGenerado: true, debe: 1344.00, haber: 1344.00,
    lineas: [
      { cuenta: "1.1.1.01", nombre: "Caja General",  debe: 1344.00, haber: 0        },
      { cuenta: "4.1.1.01", nombre: "Ventas",         debe: 0,       haber: 1200.00  },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",  debe: 0,       haber: 144.00   },
    ],
  },
  {
    id: "ASI-2026-011", fecha: "2026-02-12",
    descripcion: "Cobro cartera - Cliente Importadora XYZ",
    referencia: "COB-2026-010", tipo: "Cobro", estado: "aprobado",
    origen: "cartera", autoGenerado: true, debe: 3200.00, haber: 3200.00,
    lineas: [
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",    debe: 3200.00, haber: 0       },
      { cuenta: "1.1.2.01", nombre: "Cuentas por Cobrar", debe: 0,       haber: 3200.00 },
    ],
  },
  {
    id: "ASI-2026-012", fecha: "2026-02-15",
    descripcion: "Depreciación mensual activos fijos - Febrero 2026",
    referencia: "DEP-FEB-2026", tipo: "Depreciación", estado: "aprobado",
    origen: "activos", autoGenerado: true, debe: 850.00, haber: 850.00,
    lineas: [
      { cuenta: "5.2.1.01", nombre: "Gasto Depreciación",     debe: 850.00, haber: 0      },
      { cuenta: "1.2.1.02", nombre: "Dep. Acumulada Equipos",  debe: 0,      haber: 850.00 },
    ],
  },
  {
    id: "ASI-2026-013", fecha: "2026-02-18",
    descripcion: "Ajuste de inventario - Merma por vencimiento",
    referencia: "AJU-INV-FEB", tipo: "Ajuste", estado: "aprobado",
    origen: "inventario", autoGenerado: true, debe: 480.00, haber: 480.00,
    lineas: [
      { cuenta: "5.3.1.01", nombre: "Pérdida por Ajuste Inventario", debe: 480.00, haber: 0      },
      { cuenta: "1.1.4.01", nombre: "Inventario",                     debe: 0,      haber: 480.00 },
    ],
  },
  {
    id: "ASI-2026-014", fecha: "2026-02-28",
    descripcion: "Pago de nómina - Febrero 2026",
    referencia: "NOM-FEB-2026", tipo: "Nómina", estado: "aprobado",
    origen: "nomina", autoGenerado: true, debe: 12400.00, haber: 12400.00,
    lineas: [
      { cuenta: "5.1.1.01", nombre: "Sueldos y Salarios", debe: 12400.00, haber: 0        },
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",     debe: 0,        haber: 12400.00 },
    ],
  },
  {
    id: "ASI-2026-015", fecha: "2026-02-28",
    descripcion: "Reclasificación de gastos administrativos",
    referencia: "MAN-001", tipo: "Corrección", estado: "borrador",
    origen: "manual", autoGenerado: false, debe: 620.00, haber: 620.00,
    lineas: [
      { cuenta: "5.1.1.01", nombre: "Sueldos y Salarios", debe: 620.00, haber: 0      },
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",     debe: 0,      haber: 620.00 },
    ],
  },
  // ── MARZO ───────────────────────────────────────────────────────
  {
    id: "ASI-2026-016", fecha: "2026-03-02",
    descripcion: "Venta - Factura #001-001-000120",
    referencia: "FAC-000120", tipo: "Venta", estado: "aprobado",
    origen: "ventas", autoGenerado: true, debe: 5600.00, haber: 5600.00,
    lineas: [
      { cuenta: "1.1.1.01", nombre: "Caja General",  debe: 5600.00, haber: 0       },
      { cuenta: "4.1.1.01", nombre: "Ventas",         debe: 0,       haber: 5000.00 },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",  debe: 0,       haber: 600.00  },
    ],
  },
  {
    id: "ASI-2026-017", fecha: "2026-03-03",
    descripcion: "Compra - FAC-P-000290 / Distribuidora Nacional",
    referencia: "FAC-P-000290", tipo: "Compra", estado: "aprobado",
    origen: "compras", autoGenerado: true, debe: 6612.50, haber: 6612.50,
    lineas: [
      { cuenta: "1.1.4.01", nombre: "Inventario",         debe: 5750.00, haber: 0       },
      { cuenta: "1.1.3.01", nombre: "IVA en Compras",      debe: 862.50,  haber: 0       },
      { cuenta: "2.1.1.01", nombre: "Cuentas por Pagar",   debe: 0,       haber: 6612.50 },
    ],
  },
  {
    id: "ASI-2026-018", fecha: "2026-03-04",
    descripcion: "Venta POS - Terminal 01 / Turno mañana",
    referencia: "POS-2026-0045", tipo: "Venta", estado: "aprobado",
    origen: "pos", autoGenerado: true, debe: 1240.00, haber: 1240.00,
    lineas: [
      { cuenta: "1.1.1.01", nombre: "Caja General",  debe: 1240.00, haber: 0        },
      { cuenta: "4.1.1.01", nombre: "Ventas",         debe: 0,       haber: 1107.14  },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",  debe: 0,       haber: 132.86   },
    ],
  },
  {
    id: "ASI-2026-019", fecha: "2026-03-05",
    descripcion: "Ajuste de inventario - Conteo físico bodega",
    referencia: "AJU-INV-MAR", tipo: "Ajuste", estado: "aprobado",
    origen: "inventario", autoGenerado: true, debe: 320.00, haber: 320.00,
    lineas: [
      { cuenta: "5.3.1.01", nombre: "Pérdida por Ajuste Inventario", debe: 320.00, haber: 0      },
      { cuenta: "1.1.4.01", nombre: "Inventario",                     debe: 0,      haber: 320.00 },
    ],
  },
  {
    id: "ASI-2026-020", fecha: "2026-03-06",
    descripcion: "Cobro cartera - Cliente Empresa ABC S.A.",
    referencia: "COB-2026-018", tipo: "Cobro", estado: "aprobado",
    origen: "cartera", autoGenerado: true, debe: 2100.00, haber: 2100.00,
    lineas: [
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",    debe: 2100.00, haber: 0       },
      { cuenta: "1.1.2.01", nombre: "Cuentas por Cobrar", debe: 0,       haber: 2100.00 },
    ],
  },
  {
    id: "ASI-2026-021", fecha: "2026-03-06",
    descripcion: "Corrección de asiento por error de cuenta",
    referencia: "MAN-002", tipo: "Corrección", estado: "borrador",
    origen: "manual", autoGenerado: false, debe: 350.00, haber: 350.00,
    lineas: [
      { cuenta: "1.1.2.01", nombre: "Cuentas por Cobrar", debe: 350.00, haber: 0      },
      { cuenta: "4.1.1.01", nombre: "Ventas",              debe: 0,      haber: 350.00 },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
   HELPERS IDs
══════════════════════════════════════════════════════════════════ */
let _counter = ASIENTOS_INICIALES.length;
function nextId(): string {
  _counter += 1;
  return `ASI-2026-${String(_counter).padStart(3, "0")}`;
}

/* ══════════════════════════════════════════════════════════════════
   CONTEXTO
══════════════════════════════════════════════════════════════════ */
interface AccountingContextType {
  asientos: Asiento[];
  addAsiento: (a: Omit<Asiento, "id">) => string;
  addMultipleAsientos: (list: Omit<Asiento, "id">[]) => string[];
  updateEstado: (id: string, estado: Asiento["estado"]) => void;
  /** Actualiza un asiento manual (solo aplica a autoGenerado=false) */
  updateAsiento: (id: string, changes: Partial<Omit<Asiento, "id">>) => void;
  removeAsiento: (id: string) => void;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

/* ══════════════════════════════════════════════════════════════════
   HELPERS PARA ARMAR ASIENTOS DESDE MÓDULOS
══════════════════════════════════════════════════════════════════ */

export function buildAsientoVenta(params: {
  fecha: string; invoiceNumber: string; subtotal: number;
  tax: number; discount: number; total: number; paymentMethod: string;
}): Omit<Asiento, "id"> {
  const { fecha, invoiceNumber, subtotal, tax, total, paymentMethod } = params;
  const cuentaCobro = paymentMethod === "cash"
    ? { cuenta: "1.1.1.01", nombre: "Caja General" }
    : paymentMethod === "transfer" || paymentMethod === "card"
    ? { cuenta: "1.1.1.02", nombre: "Banco Pichincha" }
    : { cuenta: "1.1.2.01", nombre: "Cuentas por Cobrar" };
  return {
    fecha,
    descripcion: `Venta de mercadería - Factura #${invoiceNumber}`,
    referencia: invoiceNumber, tipo: "Venta", estado: "aprobado",
    origen: "ventas", autoGenerado: true, debe: total, haber: total,
    lineas: [
      { ...cuentaCobro,                                          debe: total,    haber: 0       },
      { cuenta: "4.1.1.01", nombre: "Ventas",                   debe: 0,        haber: subtotal },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",            debe: 0,        haber: tax      },
    ],
  };
}

export function buildAsientoCompra(params: {
  fecha: string; invoiceNumber: string; supplier: string;
  subtotal: number; taxAmount: number; discount: number; total: number;
}): Omit<Asiento, "id"> {
  const { fecha, invoiceNumber, supplier, subtotal, taxAmount, total, discount } = params;
  const lineas: AsientoLinea[] = [
    { cuenta: "1.1.4.01", nombre: "Inventario",        debe: subtotal - (discount||0), haber: 0     },
    { cuenta: "1.1.3.01", nombre: "IVA en Compras",    debe: taxAmount,                haber: 0     },
    { cuenta: "2.1.1.01", nombre: "Cuentas por Pagar", debe: 0,                        haber: total },
  ];
  return {
    fecha,
    descripcion: `Compra - ${invoiceNumber} / ${supplier}`,
    referencia: invoiceNumber, tipo: "Compra", estado: "aprobado",
    origen: "compras", autoGenerado: true, debe: total, haber: total, lineas,
  };
}

export function buildAsientoPOS(params: {
  fecha: string; reference: string; subtotal: number;
  tax: number; total: number; paymentMethod: string;
}): Omit<Asiento, "id"> {
  const { fecha, reference, subtotal, tax, total, paymentMethod } = params;
  const cuentaCobro = paymentMethod === "cash"
    ? { cuenta: "1.1.1.01", nombre: "Caja General" }
    : { cuenta: "1.1.1.02", nombre: "Banco Pichincha" };
  return {
    fecha,
    descripcion: `Venta POS - ${reference}`,
    referencia: reference, tipo: "Venta", estado: "aprobado",
    origen: "pos", autoGenerado: true, debe: total, haber: total,
    lineas: [
      { ...cuentaCobro,                                   debe: total,    haber: 0       },
      { cuenta: "4.1.1.01", nombre: "Ventas",            debe: 0,        haber: subtotal },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",     debe: 0,        haber: tax      },
    ],
  };
}

/** Genera asiento de ajuste de inventario */
export function buildAsientoInventario(params: {
  fecha: string; referencia: string; descripcion: string;
  tipo: "ajuste_positivo" | "ajuste_negativo" | "transferencia";
  monto: number;
}): Omit<Asiento, "id"> {
  const { fecha, referencia, descripcion, tipo, monto } = params;
  const lineas: AsientoLinea[] = tipo === "ajuste_positivo"
    ? [
        { cuenta: "1.1.4.01", nombre: "Inventario",                      debe: monto, haber: 0     },
        { cuenta: "4.2.1.01", nombre: "Sobrante de Inventario",          debe: 0,     haber: monto },
      ]
    : tipo === "ajuste_negativo"
    ? [
        { cuenta: "5.3.1.01", nombre: "Pérdida por Ajuste Inventario",   debe: monto, haber: 0     },
        { cuenta: "1.1.4.01", nombre: "Inventario",                      debe: 0,     haber: monto },
      ]
    : [
        { cuenta: "1.1.4.02", nombre: "Inventario Bodega Destino",       debe: monto, haber: 0     },
        { cuenta: "1.1.4.01", nombre: "Inventario Bodega Origen",        debe: 0,     haber: monto },
      ];
  return {
    fecha, descripcion, referencia,
    tipo: "Ajuste Inventario", estado: "aprobado",
    origen: "inventario", autoGenerado: true, debe: monto, haber: monto, lineas,
  };
}

/* ══════════════════════════════════════════════════════════════════
   PROVIDER
══════════════════════════════════════════════════════════════════ */
export function AccountingProvider({ children }: { children: ReactNode }) {
  const [asientos, setAsientos] = useState<Asiento[]>(ASIENTOS_INICIALES);

  const addAsiento = useCallback((a: Omit<Asiento, "id">): string => {
    const id = nextId();
    setAsientos(prev => [...prev, { ...a, id }]);
    return id;
  }, []);

  const addMultipleAsientos = useCallback((list: Omit<Asiento, "id">[]): string[] => {
    const ids: string[] = [];
    const nuevos = list.map(a => { const id = nextId(); ids.push(id); return { ...a, id }; });
    setAsientos(prev => [...prev, ...nuevos]);
    return ids;
  }, []);

  const updateEstado = useCallback((id: string, estado: Asiento["estado"]) => {
    setAsientos(prev => prev.map(a => a.id === id ? { ...a, estado } : a));
  }, []);

  const updateAsiento = useCallback((id: string, changes: Partial<Omit<Asiento, "id">>) => {
    setAsientos(prev => prev.map(a => {
      if (a.id !== id || a.autoGenerado) return a; // solo manuales
      const updated = { ...a, ...changes };
      // recalcular debe/haber desde lineas si se cambiaron
      if (changes.lineas) {
        updated.debe  = changes.lineas.reduce((s, l) => s + (l.debe  || 0), 0);
        updated.haber = changes.lineas.reduce((s, l) => s + (l.haber || 0), 0);
      }
      return updated;
    }));
  }, []);

  const removeAsiento = useCallback((id: string) => {
    setAsientos(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <AccountingContext.Provider value={{ asientos, addAsiento, addMultipleAsientos, updateEstado, updateAsiento, removeAsiento }}>
      {children}
    </AccountingContext.Provider>
  );
}

export function useAccounting() {
  const ctx = useContext(AccountingContext);
  if (!ctx) throw new Error("useAccounting must be used within AccountingProvider");
  return ctx;
}