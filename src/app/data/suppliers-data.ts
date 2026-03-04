export interface Supplier {
  id: string;
  code: string;
  name: string;
  ruc: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  paymentTerms: string;
  creditDays: number;
  category: string;
  status: "active" | "inactive";
  notes: string;
  createdDate: string;
  createdBy: string;
  website: string;
  contactPerson: string;
  bankAccount: string;
}

export const SUPPLIERS_DATA: Supplier[] = [
  {
    id: "sup-001",
    code: "SUP-001",
    name: "Distribuidora La Favorita C.A.",
    ruc: "1790016919001",
    email: "ventas@lafavorita.com.ec",
    phone: "+593 2 2987654",
    address: "Av. América N35-87 y Naciones Unidas",
    city: "Quito",
    country: "Ecuador",
    contactName: "María Rodríguez",
    contactPhone: "+593 99 8765432",
    contactEmail: "mrodriguez@lafavorita.com.ec",
    paymentTerms: "Crédito 30 días",
    creditDays: 30,
    category: "Muebles",
    status: "active",
    notes: "Proveedor principal de mobiliario de oficina",
    createdDate: "2025-01-15",
    createdBy: "Admin Sistema",
    website: "www.lafavorita.com.ec",
    contactPerson: "María Rodríguez",
    bankAccount: "1234567890001"
  },
  {
    id: "sup-002",
    code: "SUP-002",
    name: "Tecnología Avanzada S.A.",
    ruc: "1792345678001",
    email: "info@tecnoavanzada.com.ec",
    phone: "+593 2 3456789",
    address: "Av. 6 de Diciembre N34-451 y Checoslovaquia",
    city: "Quito",
    country: "Ecuador",
    contactName: "Carlos Méndez",
    contactPhone: "+593 98 7654321",
    contactEmail: "cmendez@tecnoavanzada.com.ec",
    paymentTerms: "Crédito 45 días",
    creditDays: 45,
    category: "Tecnología",
    status: "active",
    notes: "Distribuidor autorizado de equipos Dell y HP",
    createdDate: "2025-02-01",
    createdBy: "Admin Sistema",
    website: "www.tecnoavanzada.com.ec",
    contactPerson: "Carlos Méndez",
    bankAccount: "1234567890002"
  },
  {
    id: "sup-003",
    code: "SUP-003",
    name: "Papelería Corporativa Ltda.",
    ruc: "1798765432001",
    email: "ventas@papelcorp.com.ec",
    phone: "+593 2 2345678",
    address: "Av. 10 de Agosto N24-123 y Colón",
    city: "Quito",
    country: "Ecuador",
    contactName: "Ana López",
    contactPhone: "+593 99 1234567",
    contactEmail: "alopez@papelcorp.com.ec",
    paymentTerms: "Crédito 15 días",
    creditDays: 15,
    category: "Papelería",
    status: "active",
    notes: "Proveedor de suministros de oficina y papelería",
    createdDate: "2025-01-20",
    createdBy: "Admin Sistema",
    website: "www.papelcorp.com.ec",
    contactPerson: "Ana López",
    bankAccount: "1234567890003"
  },
  {
    id: "sup-004",
    code: "SUP-004",
    name: "Industrial Supplies Corp.",
    ruc: "US-987654321",
    email: "sales@indsupplies.com",
    phone: "+1 305 555 0123",
    address: "1234 Industrial Blvd, Suite 500",
    city: "Miami",
    country: "USA",
    contactName: "John Smith",
    contactPhone: "+1 305 555 0124",
    contactEmail: "jsmith@indsupplies.com",
    paymentTerms: "Crédito 60 días",
    creditDays: 60,
    category: "Tecnología",
    status: "active",
    notes: "Proveedor internacional de equipos industriales",
    createdDate: "2025-02-10",
    createdBy: "Admin Sistema",
    website: "www.indsupplies.com",
    contactPerson: "John Smith",
    bankAccount: "1234567890004"
  },
  {
    id: "sup-005",
    code: "SUP-005",
    name: "Construcciones Andinas S.A.",
    ruc: "1790123456001",
    email: "ventas@construandinas.com.ec",
    phone: "+593 2 4567890",
    address: "Av. Mariscal Sucre Oe-234 y Galo Plaza",
    city: "Quito",
    country: "Ecuador",
    contactName: "Pedro Morales",
    contactPhone: "+593 98 2345678",
    contactEmail: "pmorales@construandinas.com.ec",
    paymentTerms: "Contado",
    creditDays: 0,
    category: "Construcción",
    status: "inactive",
    notes: "Temporalmente inactivo por restructuración",
    createdDate: "2025-01-05",
    createdBy: "Admin Sistema",
    website: "www.construandinas.com.ec",
    contactPerson: "Pedro Morales",
    bankAccount: "1234567890005"
  },
];
