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
   DATOS INICIALES (historial existente)
══════════════════════════════════════════════════════════════════ */
const ASIENTOS_INICIALES: Asiento[] = [
  {
    id: "ASI-2026-001", fecha: "2026-03-01",
    descripcion: "Venta de mercadería - Factura #001-001-000120",
    referencia: "FAC-000120", tipo: "Venta", estado: "aprobado",
    origen: "ventas", autoGenerado: true,
    debe: 5600.00, haber: 5600.00,
    lineas: [
      { cuenta: "1.1.1.01", nombre: "Caja",         debe: 5600.00, haber: 0 },
      { cuenta: "4.1.1.01", nombre: "Ventas",        debe: 0,       haber: 5000.00 },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar", debe: 0,       haber: 600.00 },
    ],
  },
  {
    id: "ASI-2026-002", fecha: "2026-03-02",
    descripcion: "Compra de mercadería - FAC-001-001234 / Distribuidora Nacional",
    referencia: "FAC-001-001234", tipo: "Compra", estado: "aprobado",
    origen: "compras", autoGenerado: true,
    debe: 6612.50, haber: 6612.50,
    lineas: [
      { cuenta: "1.1.4.01", nombre: "Inventario",         debe: 5750.00, haber: 0 },
      { cuenta: "1.1.3.01", nombre: "IVA en Compras",      debe: 862.50,  haber: 0 },
      { cuenta: "2.1.1.01", nombre: "Cuentas por Pagar",   debe: 0,       haber: 6612.50 },
    ],
  },
  {
    id: "ASI-2026-003", fecha: "2026-03-03",
    descripcion: "Pago de nómina – Febrero 2026",
    referencia: "NOM-FEB-2026", tipo: "Nómina", estado: "aprobado",
    origen: "nomina", autoGenerado: true,
    debe: 12400.00, haber: 12400.00,
    lineas: [
      { cuenta: "5.1.1.01", nombre: "Sueldos y Salarios", debe: 12400.00, haber: 0 },
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",    debe: 0,        haber: 12400.00 },
    ],
  },
  {
    id: "ASI-2026-004", fecha: "2026-03-04",
    descripcion: "Depreciación mensual de activos fijos - Marzo 2026",
    referencia: "DEP-MAR-2026", tipo: "Depreciación", estado: "aprobado",
    origen: "activos", autoGenerado: true,
    debe: 850.00, haber: 850.00,
    lineas: [
      { cuenta: "5.2.1.01", nombre: "Gasto Depreciación",    debe: 850.00, haber: 0 },
      { cuenta: "1.2.1.02", nombre: "Dep. Acumulada Equipos", debe: 0,      haber: 850.00 },
    ],
  },
  {
    id: "ASI-2026-005", fecha: "2026-03-05",
    descripcion: "Venta de mercadería - Factura #001-001-000123",
    referencia: "FAC-000123", tipo: "Venta", estado: "aprobado",
    origen: "ventas", autoGenerado: true,
    debe: 1052.80, haber: 1052.80,
    lineas: [
      { cuenta: "1.1.2.01", nombre: "Cuentas por Cobrar", debe: 1052.80, haber: 0 },
      { cuenta: "4.1.1.01", nombre: "Ventas",              debe: 0,       haber: 940.00 },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",       debe: 0,       haber: 112.80 },
    ],
  },
  {
    id: "ASI-2026-006", fecha: "2026-03-05",
    descripcion: "Venta de mercadería - Factura #001-001-000124",
    referencia: "FAC-000124", tipo: "Venta", estado: "aprobado",
    origen: "ventas", autoGenerado: true,
    debe: 898.80, haber: 898.80,
    lineas: [
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",    debe: 898.80, haber: 0 },
      { cuenta: "4.1.1.01", nombre: "Ventas",              debe: 0,      haber: 840.00 },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",       debe: 0,      haber: 100.80 },
      { cuenta: "4.1.2.01", nombre: "Descuentos Ventas",   debe: 42.00,  haber: 0 },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
   HELPERS para generar IDs
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
  /** Añade un asiento ya construido */
  addAsiento: (a: Omit<Asiento, "id">) => string;
  /** Añade varios asientos de una vez y retorna sus IDs */
  addMultipleAsientos: (list: Omit<Asiento, "id">[]) => string[];
  /** Actualiza estado de un asiento */
  updateEstado: (id: string, estado: Asiento["estado"]) => void;
  /** Elimina un asiento */
  removeAsiento: (id: string) => void;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

/* ══════════════════════════════════════════════════════════════════
   HELPERS PARA ARMAR ASIENTOS DESDE MÓDULOS
══════════════════════════════════════════════════════════════════ */

/** Genera el asiento de una factura de venta */
export function buildAsientoVenta(params: {
  fecha: string;
  invoiceNumber: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
}): Omit<Asiento, "id"> {
  const { fecha, invoiceNumber, subtotal, tax, total, paymentMethod } = params;

  // Cuenta de cobro según método de pago
  const cuentaCobro = paymentMethod === "cash"
    ? { cuenta: "1.1.1.01", nombre: "Caja General" }
    : paymentMethod === "transfer" || paymentMethod === "card"
    ? { cuenta: "1.1.1.02", nombre: "Banco Pichincha" }
    : { cuenta: "1.1.2.01", nombre: "Cuentas por Cobrar" };

  const lineas: AsientoLinea[] = [
    { ...cuentaCobro,                                             debe: total,    haber: 0       },
    { cuenta: "4.1.1.01", nombre: "Ventas",                      debe: 0,        haber: subtotal },
    { cuenta: "2.1.3.01", nombre: "IVA por Pagar",               debe: 0,        haber: tax      },
  ];

  return {
    fecha,
    descripcion: `Venta de mercadería - Factura #${invoiceNumber}`,
    referencia:  invoiceNumber,
    tipo:        "Venta",
    estado:      "aprobado",
    origen:      "ventas",
    autoGenerado: true,
    debe:  total,
    haber: total,
    lineas,
  };
}

/** Genera el asiento de una factura de compra/proveedor */
export function buildAsientoCompra(params: {
  fecha: string;
  invoiceNumber: string;
  supplier: string;
  subtotal: number;
  taxAmount: number;
  discount: number;
  total: number;
}): Omit<Asiento, "id"> {
  const { fecha, invoiceNumber, supplier, subtotal, taxAmount, total, discount } = params;

  const lineas: AsientoLinea[] = [
    { cuenta: "1.1.4.01", nombre: "Inventario",       debe: subtotal,  haber: 0     },
    { cuenta: "1.1.3.01", nombre: "IVA en Compras",   debe: taxAmount, haber: 0     },
    { cuenta: "2.1.1.01", nombre: "Cuentas por Pagar",debe: 0,         haber: total },
  ];

  if (discount > 0) {
    lineas[0].debe -= discount;
  }

  return {
    fecha,
    descripcion:  `Compra - ${invoiceNumber} / ${supplier}`,
    referencia:   invoiceNumber,
    tipo:         "Compra",
    estado:       "aprobado",
    origen:       "compras",
    autoGenerado: true,
    debe:  total,
    haber: total,
    lineas,
  };
}

/** Genera asiento de venta POS */
export function buildAsientoPOS(params: {
  fecha: string;
  reference: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
}): Omit<Asiento, "id"> {
  const { fecha, reference, subtotal, tax, total, paymentMethod } = params;
  const cuentaCobro = paymentMethod === "cash"
    ? { cuenta: "1.1.1.01", nombre: "Caja General" }
    : { cuenta: "1.1.1.02", nombre: "Banco Pichincha" };

  return {
    fecha,
    descripcion:  `Venta POS - ${reference}`,
    referencia:   reference,
    tipo:         "Venta",
    estado:       "aprobado",
    origen:       "pos",
    autoGenerado: true,
    debe:  total,
    haber: total,
    lineas: [
      { ...cuentaCobro,                                    debe: total,    haber: 0       },
      { cuenta: "4.1.1.01", nombre: "Ventas",             debe: 0,        haber: subtotal },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar",      debe: 0,        haber: tax      },
    ],
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
    const nuevos: Asiento[] = list.map(a => {
      const id = nextId();
      ids.push(id);
      return { ...a, id };
    });
    setAsientos(prev => [...prev, ...nuevos]);
    return ids;
  }, []);

  const updateEstado = useCallback((id: string, estado: Asiento["estado"]) => {
    setAsientos(prev => prev.map(a => a.id === id ? { ...a, estado } : a));
  }, []);

  const removeAsiento = useCallback((id: string) => {
    setAsientos(prev => prev.filter(a => a.id !== id));
  }, []);

  return (
    <AccountingContext.Provider value={{ asientos, addAsiento, addMultipleAsientos, updateEstado, removeAsiento }}>
      {children}
    </AccountingContext.Provider>
  );
}

export function useAccounting() {
  const ctx = useContext(AccountingContext);
  if (!ctx) throw new Error("useAccounting must be used within AccountingProvider");
  return ctx;
}
