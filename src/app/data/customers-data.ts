export interface Customer {
  id: string;
  code: string;
  name: string;
  idType: "RUC" | "Cédula" | "Pasaporte";
  idNumber: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalPurchases: number;
  lastPurchase: string;
  status: "Activo" | "Inactivo";
  creditLimit: number;
  balance: number;
}

export const CUSTOMERS_DATA: Customer[] = [
  {
    id: "1",
    code: "CLI-001",
    name: "Corporación Nacional S.A.",
    idType: "RUC",
    idNumber: "1792345678001",
    email: "contacto@corpnacional.com",
    phone: "+593 2 245 6789",
    address: "Av. Amazonas N24-123 y Colón",
    city: "Quito",
    totalPurchases: 45680.50,
    lastPurchase: "2026-03-05",
    status: "Activo",
    creditLimit: 10000,
    balance: 2340.50
  },
  {
    id: "2",
    code: "CLI-002",
    name: "Distribuidora del Pacífico",
    idType: "RUC",
    idNumber: "0992567890001",
    email: "ventas@dispacifico.com",
    phone: "+593 4 234 5678",
    address: "Av. 9 de Octubre 456",
    city: "Guayaquil",
    totalPurchases: 38920.75,
    lastPurchase: "2026-03-07",
    status: "Activo",
    creditLimit: 15000,
    balance: 4500.00
  },
  {
    id: "3",
    code: "CLI-003",
    name: "María Fernanda González",
    idType: "Cédula",
    idNumber: "1712345678",
    email: "mfgonzalez@gmail.com",
    phone: "+593 99 876 5432",
    address: "Calle Los Pinos 234",
    city: "Quito",
    totalPurchases: 12450.00,
    lastPurchase: "2026-02-28",
    status: "Activo",
    creditLimit: 5000,
    balance: 0
  },
  {
    id: "4",
    code: "CLI-004",
    name: "Comercial del Sur Ltda.",
    idType: "RUC",
    idNumber: "0102345678001",
    email: "info@comsur.com",
    phone: "+593 7 283 4567",
    address: "Av. Loja y Bolívar",
    city: "Cuenca",
    totalPurchases: 28340.25,
    lastPurchase: "2026-03-01",
    status: "Activo",
    creditLimit: 8000,
    balance: 1200.00
  },
  {
    id: "5",
    code: "CLI-005",
    name: "Industrias Unidas S.A.",
    idType: "RUC",
    idNumber: "1891234567001",
    email: "compras@indunidas.com",
    phone: "+593 2 298 7654",
    address: "Panamericana Norte Km 12",
    city: "Quito",
    totalPurchases: 52340.80,
    lastPurchase: "2026-03-08",
    status: "Activo",
    creditLimit: 20000,
    balance: 5600.00
  },
  {
    id: "6",
    code: "CLI-006",
    name: "Carlos Andrés Moreno",
    idType: "Cédula",
    idNumber: "0912345678",
    email: "carlosmoreno@hotmail.com",
    phone: "+593 98 765 4321",
    address: "Cdla. Kennedy, Mz 45 Solar 12",
    city: "Guayaquil",
    totalPurchases: 8950.30,
    lastPurchase: "2026-02-15",
    status: "Activo",
    creditLimit: 3000,
    balance: 450.00
  },
  {
    id: "7",
    code: "CLI-007",
    name: "Farmacéutica del Norte",
    idType: "RUC",
    idNumber: "1791234509001",
    email: "ventas@farmanorte.ec",
    phone: "+593 6 295 8765",
    address: "Calle Bolívar 567",
    city: "Ibarra",
    totalPurchases: 34560.00,
    lastPurchase: "2026-03-06",
    status: "Activo",
    creditLimit: 12000,
    balance: 2100.00
  },
  {
    id: "8",
    code: "CLI-008",
    name: "Textiles Andinos S.A.",
    idType: "RUC",
    idNumber: "1801234567001",
    email: "info@textilandinos.com",
    phone: "+593 3 282 3456",
    address: "Av. Cevallos y Martínez",
    city: "Ambato",
    totalPurchases: 19870.45,
    lastPurchase: "2026-02-20",
    status: "Activo",
    creditLimit: 7000,
    balance: 890.00
  },
  {
    id: "9",
    code: "CLI-009",
    name: "Ana Patricia Ruiz",
    idType: "Cédula",
    idNumber: "1704567890",
    email: "anaruiz@yahoo.com",
    phone: "+593 99 234 5678",
    address: "Urbanización La Floresta, Casa 23",
    city: "Quito",
    totalPurchases: 6780.20,
    lastPurchase: "2026-01-30",
    status: "Activo",
    creditLimit: 2000,
    balance: 0
  },
  {
    id: "10",
    code: "CLI-010",
    name: "Supermercados La Económica",
    idType: "RUC",
    idNumber: "0991234567001",
    email: "gerencia@laeconomica.com",
    phone: "+593 4 256 7890",
    address: "Av. Las Américas y Orellana",
    city: "Guayaquil",
    totalPurchases: 67890.50,
    lastPurchase: "2026-03-08",
    status: "Activo",
    creditLimit: 25000,
    balance: 8900.00
  }
];
