// ═══════════════════════════════════════════════════════════════════
// DATOS DE PRUEBA - SISTEMA ERP TICSOFTEC
// ═══════════════════════════════════════════════════════════════════
// ⚠️ IMPORTANTE: Todos los datos son ficticios y solo para demostración
// ═══════════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────────
// CATÁLOGO DE PRODUCTOS Y SERVICIOS
// ──────────────────────────────────────────────────────────────────

export interface Product {
  code: string;
  name: string;
  price: number;
  tax: number;
  stock: number;
  category: string;
  brand?: string;
  model?: string;
  description?: string;
  warranty?: string;
}

export const PRODUCTS_CATALOG: Product[] = [
  // Computadoras
  { 
    code: "PROD001", 
    name: "Laptop HP 15-dy Intel Core i5", 
    price: 850.00, 
    tax: 12, 
    stock: 15, 
    category: "Computadoras",
    brand: "HP",
    model: "15-dy2031la",
    description: "RAM 8GB DDR4, SSD 256GB, Pantalla 15.6\" HD",
    warranty: "1 año"
  },
  { 
    code: "PROD002", 
    name: "Laptop Dell Inspiron 15 AMD Ryzen 7", 
    price: 920.00, 
    tax: 12, 
    stock: 12, 
    category: "Computadoras",
    brand: "Dell",
    model: "Inspiron 3505",
    description: "RAM 16GB DDR4, SSD 512GB NVMe, Pantalla 15.6\" FHD",
    warranty: "1 año"
  },
  { 
    code: "PROD003", 
    name: "PC Desktop Lenovo ThinkCentre i7", 
    price: 1250.00, 
    tax: 12, 
    stock: 8, 
    category: "Computadoras",
    brand: "Lenovo",
    model: "ThinkCentre M720q",
    description: "Intel i7-10700, RAM 16GB, SSD 512GB, Sin monitor",
    warranty: "2 años"
  },
  { 
    code: "PROD004", 
    name: "MacBook Air M2 13\" 256GB", 
    price: 1850.00, 
    tax: 12, 
    stock: 5, 
    category: "Computadoras",
    brand: "Apple",
    model: "MacBook Air M2",
    description: "Chip M2, RAM 8GB, SSD 256GB, Pantalla Retina 13.6\"",
    warranty: "1 año"
  },
  
  // Monitores
  { 
    code: "PROD005", 
    name: "Monitor LG 27 pulgadas", 
    price: 320.00, 
    tax: 12, 
    stock: 25, 
    category: "Tecnología",
    brand: "LG",
    model: "27UP550",
    description: "4K UHD, IPS, HDR10, 60Hz",
    warranty: "3 años"
  },
  { code: "PROD006", name: "Monitor Samsung 24\" Full HD", price: 280.00, tax: 12, stock: 30, category: "Tecnología" },
  { code: "PROD007", name: "Monitor Gaming ASUS 27\" 144Hz", price: 520.00, tax: 12, stock: 10, category: "Tecnología" },
  
  // Impresoras
  { code: "PROD008", name: "Impresora Epson L3210 Multifunción", price: 285.00, tax: 12, stock: 20, category: "Impresoras" },
  { code: "PROD009", name: "Impresora HP LaserJet Pro M404dn", price: 420.00, tax: 12, stock: 14, category: "Impresoras" },
  { code: "PROD010", name: "Impresora Canon Pixma G3160", price: 310.00, tax: 12, stock: 22, category: "Impresoras" },
  
  // Accesorios
  { 
    code: "PROD044", 
    name: "Teclado mecánico Logitech", 
    price: 89.99, 
    tax: 12, 
    stock: 40, 
    category: "Tecnología",
    brand: "Logitech",
    model: "G915 TKL",
    description: "Mecánico inalámbrico, switches GL Tactile, RGB",
    warranty: "2 años"
  },
  { 
    code: "PROD045", 
    name: "Mouse inalámbrico", 
    price: 25.50, 
    tax: 12, 
    stock: 60, 
    category: "Tecnología",
    brand: "Logitech",
    model: "M330 Silent",
    description: "Inalámbrico, silencioso, batería 24 meses",
    warranty: "1 año"
  },
  { code: "PROD011", name: "Mouse Logitech MX Master 3", price: 45.00, tax: 12, stock: 50, category: "Tecnología" },
  { code: "PROD012", name: "Teclado Mecánico RGB Corsair K95", price: 120.00, tax: 12, stock: 25, category: "Tecnología" },
  { code: "PROD013", name: "Webcam Logitech C920 Pro HD", price: 95.00, tax: 12, stock: 28, category: "Tecnología" },
  { code: "PROD014", name: "Audífonos Sony WH-1000XM4 Bluetooth", price: 320.00, tax: 12, stock: 18, category: "Tecnología" },
  { code: "PROD015", name: "Mouse Pad XL Gamer RGB", price: 25.00, tax: 12, stock: 65, category: "Tecnología" },
  
  // Componentes
  { code: "PROD016", name: "Memoria RAM DDR4 16GB Kingston", price: 75.00, tax: 12, stock: 60, category: "Componentes" },
  { code: "PROD017", name: "Memoria RAM DDR5 32GB Corsair", price: 185.00, tax: 12, stock: 25, category: "Componentes" },
  { code: "PROD018", name: "Tarjeta Gráfica NVIDIA RTX 3060", price: 450.00, tax: 12, stock: 8, category: "Componentes" },
  { code: "PROD019", name: "Procesador Intel Core i7-13700K", price: 420.00, tax: 12, stock: 12, category: "Componentes" },
  
  // Almacenamiento
  { code: "PROD020", name: "SSD M.2 NVMe 500GB Samsung", price: 85.00, tax: 12, stock: 35, category: "Almacenamiento" },
  { code: "PROD021", name: "SSD M.2 NVMe 1TB WD Black", price: 145.00, tax: 12, stock: 28, category: "Almacenamiento" },
  { code: "PROD022", name: "Disco Duro Externo Seagate 2TB", price: 95.00, tax: 12, stock: 40, category: "Almacenamiento" },
  { code: "PROD023", name: "Disco Duro Externo WD 4TB", price: 135.00, tax: 12, stock: 32, category: "Almacenamiento" },
  { code: "PROD024", name: "USB Flash Drive 128GB SanDisk", price: 22.00, tax: 12, stock: 75, category: "Almacenamiento" },
  
  // Redes
  { code: "PROD025", name: "Router TP-Link AC1200 Dual Band", price: 65.00, tax: 12, stock: 45, category: "Redes" },
  { code: "PROD026", name: "Router Gaming ASUS ROG AX3000", price: 220.00, tax: 12, stock: 15, category: "Redes" },
  { code: "PROD027", name: "Switch Gigabit 8 puertos", price: 85.00, tax: 12, stock: 22, category: "Redes" },
  { code: "PROD028", name: "Switch Gigabit 24 puertos", price: 285.00, tax: 12, stock: 8, category: "Redes" },
  { code: "PROD029", name: "Access Point Ubiquiti UniFi", price: 145.00, tax: 12, stock: 18, category: "Redes" },
  
  // Energía
  { code: "PROD030", name: "UPS APC 1500VA Back-UPS Pro", price: 320.00, tax: 12, stock: 12, category: "Energía" },
  { code: "PROD031", name: "UPS CyberPower 850VA", price: 185.00, tax: 12, stock: 20, category: "Energía" },
  { code: "PROD032", name: "Regulador de Voltaje 1000W", price: 45.00, tax: 12, stock: 35, category: "Energía" },
  
  // Proyección
  { code: "PROD033", name: "Proyector Epson EB-X06 3600 Lúmenes", price: 485.00, tax: 12, stock: 8, category: "Proyección" },
  { code: "PROD034", name: "Proyector BenQ MH535A Full HD", price: 620.00, tax: 12, stock: 6, category: "Proyección" },
  { code: "PROD035", name: "Pantalla de Proyección 100\" Portátil", price: 125.00, tax: 12, stock: 15, category: "Proyección" },
  { code: "PROD036", name: "Pantalla de Proyección 120\" Eléctrica", price: 380.00, tax: 12, stock: 5, category: "Proyección" },
  
  // Audio
  { code: "PROD037", name: "Parlantes Logitech Z623 2.1", price: 135.00, tax: 12, stock: 22, category: "Audio" },
  { code: "PROD038", name: "Micrófono Blue Yeti USB", price: 185.00, tax: 12, stock: 16, category: "Audio" },
  { code: "PROD039", name: "Soundbar Samsung HW-A450", price: 245.00, tax: 12, stock: 12, category: "Audio" },
  
  // Cables y Adaptadores
  { code: "PROD040", name: "Cable HDMI 2.1 2m 8K", price: 18.00, tax: 12, stock: 85, category: "Cables" },
  { code: "PROD041", name: "Cable USB-C a USB-C 3m", price: 15.00, tax: 12, stock: 95, category: "Cables" },
  { code: "PROD042", name: "Adaptador USB-C a HDMI", price: 22.00, tax: 12, stock: 68, category: "Cables" },
  { code: "PROD043", name: "Hub USB 3.0 7 puertos", price: 35.00, tax: 12, stock: 42, category: "Cables" },
  
  // Software
  { code: "SOFT001", name: "Licencia Microsoft Office 365 Personal 1 año", price: 85.00, tax: 12, stock: 999, category: "Software" },
  { code: "SOFT002", name: "Licencia Windows 11 Pro OEM", price: 145.00, tax: 12, stock: 999, category: "Software" },
  { code: "SOFT003", name: "Antivirus Kaspersky Total Security 3 PC", price: 65.00, tax: 12, stock: 999, category: "Software" },
  { code: "SOFT004", name: "Adobe Creative Cloud 1 año", price: 620.00, tax: 12, stock: 999, category: "Software" },
  
  // Servicios
  { code: "SERV001", name: "Consultoría IT - Hora", price: 60.00, tax: 12, stock: 999, category: "Servicios" },
  { code: "SERV002", name: "Soporte Técnico - Mensual", price: 150.00, tax: 12, stock: 999, category: "Servicios" },
  { code: "SERV003", name: "Instalación y Configuración", price: 80.00, tax: 12, stock: 999, category: "Servicios" },
  { code: "SERV004", name: "Mantenimiento Preventivo PC", price: 45.00, tax: 12, stock: 999, category: "Servicios" },
  { code: "SERV005", name: "Backup y Recuperación de Datos", price: 120.00, tax: 12, stock: 999, category: "Servicios" },
  { code: "SERV006", name: "Configuración de Redes - Día", price: 180.00, tax: 12, stock: 999, category: "Servicios" },
  
  // Papelería (IVA 0%)
  { 
    code: "PAP001", 
    name: "Resma papel bond A4", 
    price: 4.50, 
    tax: 0, 
    stock: 200, 
    category: "Papelería",
    brand: "Chamex",
    model: "A4 75g",
    description: "500 hojas, 75g/m², blanco ultra",
    warranty: "N/A"
  },
  { 
    code: "PAP002", 
    name: "Cuaderno universitario", 
    price: 2.50, 
    tax: 0, 
    stock: 150, 
    category: "Papelería",
    brand: "Norma",
    model: "100 hojas",
    description: "Espiral, cuadriculado, 100 hojas",
    warranty: "N/A"
  },
  { code: "PAP003", name: "Bolígrafos azules x12", price: 3.00, tax: 0, stock: 180, category: "Papelería" },
  { code: "PAP004", name: "Marcadores permanentes x4", price: 5.50, tax: 0, stock: 120, category: "Papelería" },
  { code: "PAP005", name: "Folder manila tamaño oficio", price: 0.25, tax: 0, stock: 500, category: "Papelería" },
  { code: "PAP006", name: "Cinta adhesiva transparente", price: 1.20, tax: 0, stock: 250, category: "Papelería" },
  { code: "PAP007", name: "Tijeras 8 pulgadas", price: 2.80, tax: 0, stock: 80, category: "Papelería" },
  { code: "PAP008", name: "Grapadora metálica", price: 6.50, tax: 0, stock: 60, category: "Papelería" },
  { code: "PAP009", name: "Caja de grapas x1000", price: 1.50, tax: 0, stock: 300, category: "Papelería" },
  { code: "PAP010", name: "Corrector líquido", price: 1.80, tax: 0, stock: 140, category: "Papelería" },
];

// ──────────────────────────────────────────────────────────────────
// CLIENTES DE PRUEBA
// ──────────────────────────────────────────────────────────────────

export interface Customer {
  name: string;
  ruc: string;
  address: string;
  email: string;
  phone: string;
  photo?: string;
  debt?: number;
  totalPurchases?: number;
  lastPurchaseDate?: string;
}

export const CUSTOMERS: Customer[] = [
  { 
    name: "María González López", 
    ruc: "1234567890", 
    address: "Av. 6 de Diciembre N34-145, Quito", 
    email: "maria.gonzalez@email.com", 
    phone: "+593 99 123 4567",
    debt: 250.00,
    totalPurchases: 15,
    lastPurchaseDate: "2026-02-15"
  },
  { 
    name: "Corporación Favorita C.A.", 
    ruc: "1790016919001", 
    address: "Av. General Enríquez km 4.5, Sangolquí", 
    email: "facturacion@favorita.com", 
    phone: "02-3456789",
    totalPurchases: 42,
    lastPurchaseDate: "2026-03-01"
  },
  { 
    name: "Importadora del Pacífico Cía. Ltda.", 
    ruc: "1712345678001", 
    address: "Av. de las Américas y José Mascote, Guayaquil", 
    email: "info@importadorapacifico.com", 
    phone: "04-2567890",
    debt: 1850.50,
    totalPurchases: 28,
    lastPurchaseDate: "2026-02-28"
  },
  { 
    name: "Distribuidora El Sol S.A.", 
    ruc: "1891234567001", 
    address: "Calle Bolívar 234 y Rocafuerte, Cuenca", 
    email: "ventas@elsol.com.ec", 
    phone: "07-2890123",
    totalPurchases: 8,
    lastPurchaseDate: "2026-01-20"
  },
  { 
    name: "Comercial Andina Ltda.", 
    ruc: "0992345678001", 
    address: "Av. 6 de Diciembre N34-45, Quito", 
    email: "compras@andina.ec", 
    phone: "02-2445566" 
  },
  { 
    name: "Supermercados La Rebaja S.A.", 
    ruc: "1790345678001", 
    address: "Av. Maldonado S15-78, Quito", 
    email: "facturacion@larebaja.com", 
    phone: "02-2667788" 
  },
  { 
    name: "Ferretería Industrial S.A.", 
    ruc: "1791456789001", 
    address: "Av. Mariscal Sucre Km 7.5, Quito", 
    email: "ventas@ferreteriaind.com", 
    phone: "02-2334455" 
  },
  { 
    name: "Tecnología Avanzada Cía. Ltda.", 
    ruc: "1792567890001", 
    address: "Av. González Suárez N27-142, Quito", 
    email: "compras@tecnoavanzada.ec", 
    phone: "02-2998877" 
  },
  { 
    name: "Almacenes Japón S.A.", 
    ruc: "1790567890001", 
    address: "Av. Amazonas y Naciones Unidas, Quito", 
    email: "facturas@almjapon.com", 
    phone: "02-2556677" 
  },
  { 
    name: "Megamaxi S.A.", 
    ruc: "1790987654001", 
    address: "Av. 6 de Diciembre y Eloy Alfaro, Quito", 
    email: "proveedores@megamaxi.com", 
    phone: "02-2443322" 
  },
  { 
    name: "TecnoComputer S.A.", 
    ruc: "1790123456001", 
    address: "Av. América N35-87, Quito", 
    email: "info@tecnocomputer.com", 
    phone: "02-2456789" 
  },
  { 
    name: "Electrónica del Ecuador S.A.", 
    ruc: "1790234567001", 
    address: "Av. Naciones Unidas E10-68, Quito", 
    email: "ventas@electronicaec.com", 
    phone: "02-2778899" 
  },
  { 
    name: "Comercial Martínez Ltda.", 
    ruc: "1791345678001", 
    address: "Calle García Moreno 456, Ambato", 
    email: "info@martinez.ec", 
    phone: "03-2445566" 
  },
  { 
    name: "Distribuidora Guayas S.A.", 
    ruc: "0990456789001", 
    address: "Av. 9 de Octubre 1234, Guayaquil", 
    email: "facturacion@distguayas.com", 
    phone: "04-2889900" 
  },
  { 
    name: "Grupo Empresarial del Norte", 
    ruc: "1793456789001", 
    address: "Av. Atahualpa Oe1-109, Quito", 
    email: "contacto@grupnorte.ec", 
    phone: "02-2556688" 
  },
  { 
    name: "Soluciones Tecnológicas S.A.", 
    ruc: "1794567890001", 
    address: "Av. República del Salvador N36-84, Quito", 
    email: "ventas@solutech.ec", 
    phone: "02-2334477" 
  },
];

// ──────────────────────────────────────────────────────────────────
// DATOS DE LA EMPRESA EMISORA
// ──────────────────────────────────────────────────────────────────

export const COMPANY_INFO = {
  razon_social: "TICSOFTEC S.A.",
  nombre_comercial: "TicSoftEc",
  ruc: "1790012345001",
  name: "TICSOFTEC S.A.",
  address: "Av. Principal 123 y Secundaria, Quito - Ecuador",
  direccion_matriz: "Av. Principal 123 y Secundaria, Quito - Ecuador",
  direccion_sucursal: "Sucursal Centro - Av. Amazonas N24-156, Quito",
  telefono: "02-2345678",
  phone: "02-2345678",
  email: "info@ticsoftec.com",
  website: "www.ticsoftec.com",
  obligado_contabilidad: true,
  contribuyente_especial: false,
  agente_retencion: true,
};

// ──────────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE PUNTOS DE EMISIÓN
// ──────────────────────────────────────────────────────────────────

export const EMISSION_POINTS = [
  { code: "001", name: "Sucursal Centro", establishment: "001" },
  { code: "002", name: "Sucursal Norte", establishment: "001" },
  { code: "001", name: "Almacén Principal", establishment: "002" },
];

// ──────────────────────────────────────────────────────────────────
// TIPOS DE DOCUMENTO
// ──────────────────────────────────────────────────────────────────

export const DOCUMENT_TYPES = {
  FACTURA: "01",
  NOTA_CREDITO: "04",
  NOTA_DEBITO: "05",
  GUIA_REMISION: "06",
  RETENCION: "07",
};

// ──────────────────────────────────────────────────────────────────
// FORMAS DE PAGO
// ──────────────────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
  { code: "cash", name: "Efectivo", sri_code: "01" },
  { code: "card", name: "Tarjeta de Crédito/Débito", sri_code: "19" },
  { code: "transfer", name: "Transferencia Bancaria", sri_code: "17" },
  { code: "credit", name: "Crédito", sri_code: "20" },
  { code: "check", name: "Cheque", sri_code: "02" },
];

// ──────────────────────────────────────────────────────────────────
// MOTIVOS PARA NOTAS DE CRÉDITO/DÉBITO
// ──────────────────────────────────────────────────────────────────

export const CREDIT_NOTE_REASONS = [
  "Devolución de mercadería",
  "Descuento por volumen",
  "Anulación de factura",
  "Error en precio",
  "Producto defectuoso",
  "Descuento especial",
  "Ajuste comercial",
];

export const DEBIT_NOTE_REASONS = [
  "Intereses de mora",
  "Gastos de cobranza",
  "Corrección de precio",
  "Ajuste de IVA",
  "Gastos adicionales",
  "Recargo por retraso",
];

// ──────────────────────────────────────────────────────────────────
// UTILIDADES
// ──────────────────────────────────────────────────────────────────

export function generateDocumentNumber(type: string): string {
  const establishment = "001";
  const emissionPoint = "001";
  const sequential = String(Math.floor(Math.random() * 900000) + 100000).padStart(9, "0");
  return `${establishment}-${emissionPoint}-${sequential}`;
}

export function getCurrentDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getCurrentTime(): string {
  return new Date().toTimeString().split(" ")[0].substring(0, 5);
}

export function getCurrentPeriod(): string {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
}

// ──────────────────────────────────────────────────────────────────
// CATEGORÍAS DE PRODUCTOS (para filtros)
// ──────────────────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES = [
  "Tecnología",
  "Papelería",
  "Computadoras",
  "Monitores",
  "Impresoras",
  "Accesorios",
  "Componentes",
  "Almacenamiento",
  "Redes",
  "Energía",
  "Proyección",
  "Audio",
  "Cables",
  "Software",
  "Servicios",
];