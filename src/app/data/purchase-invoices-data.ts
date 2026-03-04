export interface PurchaseInvoice {
  id: string;
  supplierId: string;
  numero: string;            // 001-001-000000001
  tipo: "Factura" | "Liquidación de Compra" | "Nota de Débito";
  fecha: string;             // YYYY-MM-DD
  subtotal: number;
  iva: number;
  total: number;
  estado: "pendiente" | "pagada" | "vencida";
  descripcion: string;
  retenida: boolean;         // ya tiene retención emitida
}

export const PURCHASE_INVOICES_DATA: PurchaseInvoice[] = [
  // Distribuidora La Favorita C.A. — sup-001
  {
    id: "pi-001", supplierId: "sup-001",
    numero: "001-001-000000045", tipo: "Factura",
    fecha: "2026-02-10", subtotal: 1200.00, iva: 144.00, total: 1344.00,
    estado: "pendiente", descripcion: "Mobiliario de oficina — sillas ejecutivas", retenida: false,
  },
  {
    id: "pi-002", supplierId: "sup-001",
    numero: "001-001-000000038", tipo: "Factura",
    fecha: "2026-01-22", subtotal: 870.00, iva: 104.40, total: 974.40,
    estado: "pagada", descripcion: "Escritorios modulares x6", retenida: true,
  },
  {
    id: "pi-003", supplierId: "sup-001",
    numero: "001-001-000000012", tipo: "Nota de Débito",
    fecha: "2026-01-05", subtotal: 120.00, iva: 14.40, total: 134.40,
    estado: "pagada", descripcion: "Ajuste por diferencia en precio", retenida: true,
  },

  // Tecnología Avanzada S.A. — sup-002
  {
    id: "pi-004", supplierId: "sup-002",
    numero: "002-001-000000089", tipo: "Factura",
    fecha: "2026-02-20", subtotal: 3500.00, iva: 420.00, total: 3920.00,
    estado: "pendiente", descripcion: "Laptops Dell Inspiron x5 unidades", retenida: false,
  },
  {
    id: "pi-005", supplierId: "sup-002",
    numero: "002-001-000000072", tipo: "Factura",
    fecha: "2026-02-01", subtotal: 890.00, iva: 106.80, total: 996.80,
    estado: "pendiente", descripcion: "Impresoras HP LaserJet x2", retenida: false,
  },
  {
    id: "pi-006", supplierId: "sup-002",
    numero: "002-001-000000060", tipo: "Factura",
    fecha: "2026-01-15", subtotal: 450.00, iva: 54.00, total: 504.00,
    estado: "pagada", descripcion: "Accesorios y periféricos varios", retenida: true,
  },

  // Papelería Corporativa Ltda. — sup-003
  {
    id: "pi-007", supplierId: "sup-003",
    numero: "003-001-000000201", tipo: "Factura",
    fecha: "2026-02-25", subtotal: 320.00, iva: 38.40, total: 358.40,
    estado: "pendiente", descripcion: "Suministros de oficina mensual", retenida: false,
  },
  {
    id: "pi-008", supplierId: "sup-003",
    numero: "003-001-000000188", tipo: "Factura",
    fecha: "2026-02-05", subtotal: 215.50, iva: 25.86, total: 241.36,
    estado: "pagada", descripcion: "Papel bond A4, resmas x20", retenida: true,
  },
  {
    id: "pi-009", supplierId: "sup-003",
    numero: "003-001-000000001", tipo: "Liquidación de Compra",
    fecha: "2026-01-10", subtotal: 98.00, iva: 0.00, total: 98.00,
    estado: "pagada", descripcion: "Artículos de limpieza", retenida: true,
  },

  // Industrial Supplies Corp. — sup-004
  {
    id: "pi-010", supplierId: "sup-004",
    numero: "INV-2026-00341", tipo: "Factura",
    fecha: "2026-02-18", subtotal: 8200.00, iva: 984.00, total: 9184.00,
    estado: "pendiente", descripcion: "Equipos industriales — lote importación", retenida: false,
  },
  {
    id: "pi-011", supplierId: "sup-004",
    numero: "INV-2026-00298", tipo: "Factura",
    fecha: "2026-01-30", subtotal: 4100.00, iva: 492.00, total: 4592.00,
    estado: "vencida", descripcion: "Repuestos maquinaria CNC", retenida: false,
  },
];
