import { useState } from "react";
import { Truck, Plus, Pencil, Trash2, Search, Phone, Mail, MapPin, Building2, CreditCard, FileText, X, Check, Star, TrendingUp, DollarSign, Package, AlertCircle } from "lucide-react";

interface Supplier {
  id: string;
  code: string;
  businessName: string;
  commercialName: string;
  ruc: string;
  type: "national" | "international";
  category: string;
  
  // Contacto
  contactPerson: string;
  phone: string;
  mobile: string;
  email: string;
  website: string;
  
  // Dirección
  address: string;
  city: string;
  country: string;
  
  // Información financiera
  paymentTerm: string;
  creditLimit: string;
  currency: string;
  bankAccount: string;
  
  // Estadísticas
  totalPurchases: string;
  outstandingBalance: string;
  lastPurchaseDate: string;
  
  // Estado
  status: "active" | "inactive" | "blocked";
  isPreferred: boolean;
  rating: number;
  
  notes: string;
}

const CATEGORIES = [
  "Materias Primas",
  "Productos Terminados",
  "Suministros de Oficina",
  "Equipamiento",
  "Servicios",
  "Tecnología",
  "Construcción",
  "Alimentos y Bebidas",
  "Textiles",
  "Otros",
];

const PAYMENT_TERMS = [
  { id: "0", name: "Contado" },
  { id: "7", name: "7 días" },
  { id: "15", name: "15 días" },
  { id: "30", name: "30 días" },
  { id: "45", name: "45 días" },
  { id: "60", name: "60 días" },
  { id: "90", name: "90 días" },
];

const CURRENCIES = [
  { id: "USD", name: "USD - Dólar" },
  { id: "EUR", name: "EUR - Euro" },
  { id: "COP", name: "COP - Peso colombiano" },
  { id: "PEN", name: "PEN - Sol peruano" },
];

const COUNTRIES = [
  "Ecuador",
  "Colombia",
  "Perú",
  "Estados Unidos",
  "México",
  "Chile",
  "Argentina",
  "España",
  "China",
  "Otros",
];

export function SuppliersContent() {
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "sup-001",
      code: "PROV-001",
      businessName: "Distribuidora La Favorita C.A.",
      commercialName: "Supermaxi",
      ruc: "1790016919001",
      type: "national",
      category: "Alimentos y Bebidas",
      contactPerson: "María Rodríguez",
      phone: "02-2987654",
      mobile: "0998765432",
      email: "compras@supermaxi.com",
      website: "www.supermaxi.com",
      address: "Av. 6 de Diciembre N34-120 y Whymper",
      city: "Quito",
      country: "Ecuador",
      paymentTerm: "30",
      creditLimit: "50000",
      currency: "USD",
      bankAccount: "2100543210 - Banco Pichincha",
      totalPurchases: "245680.50",
      outstandingBalance: "12500.00",
      lastPurchaseDate: "2026-02-15",
      status: "active",
      isPreferred: true,
      rating: 5,
      notes: "Proveedor preferencial con descuentos por volumen",
    },
    {
      id: "sup-002",
      code: "PROV-002",
      businessName: "Tecnología Avanzada S.A.",
      commercialName: "TechAdvance",
      ruc: "1792345678001",
      type: "national",
      category: "Tecnología",
      contactPerson: "Carlos Méndez",
      phone: "02-3456789",
      mobile: "0987654321",
      email: "ventas@techadvance.com.ec",
      website: "www.techadvance.com.ec",
      address: "Av. Naciones Unidas E10-41 y República",
      city: "Quito",
      country: "Ecuador",
      paymentTerm: "45",
      creditLimit: "75000",
      currency: "USD",
      bankAccount: "3200876543 - Banco Guayaquil",
      totalPurchases: "156340.00",
      outstandingBalance: "8900.00",
      lastPurchaseDate: "2026-02-12",
      status: "active",
      isPreferred: true,
      rating: 5,
      notes: "Excelente servicio post-venta y garantías extendidas",
    },
    {
      id: "sup-003",
      code: "PROV-003",
      businessName: "Papelería Corporativa Ltda.",
      commercialName: "OfficeMax Ecuador",
      ruc: "1798765432001",
      type: "national",
      category: "Suministros de Oficina",
      contactPerson: "Ana López",
      phone: "02-2345678",
      mobile: "0976543210",
      email: "info@officemax.ec",
      website: "www.officemax.ec",
      address: "Av. República del Salvador N36-84",
      city: "Quito",
      country: "Ecuador",
      paymentTerm: "15",
      creditLimit: "15000",
      currency: "USD",
      bankAccount: "4100234567 - Banco Pacífico",
      totalPurchases: "34560.75",
      outstandingBalance: "2100.50",
      lastPurchaseDate: "2026-02-10",
      status: "active",
      isPreferred: false,
      rating: 4,
      notes: "Entregas puntuales, buenos precios en pedidos grandes",
    },
    {
      id: "sup-004",
      code: "PROV-004",
      businessName: "Industrial Supplies Corp.",
      commercialName: "IndusSupply",
      ruc: "US-987654321",
      type: "international",
      category: "Equipamiento",
      contactPerson: "John Smith",
      phone: "+1-305-555-0123",
      mobile: "+1-305-555-0124",
      email: "sales@indussupply.com",
      website: "www.indussupply.com",
      address: "1234 Industrial Blvd, Suite 500",
      city: "Miami",
      country: "Estados Unidos",
      paymentTerm: "60",
      creditLimit: "100000",
      currency: "USD",
      bankAccount: "INT-5678901234 - Chase Bank",
      totalPurchases: "89450.00",
      outstandingBalance: "15000.00",
      lastPurchaseDate: "2026-01-28",
      status: "active",
      isPreferred: false,
      rating: 4,
      notes: "Proveedor internacional, requiere tiempo de importación",
    },
    {
      id: "sup-005",
      code: "PROV-005",
      businessName: "Construcciones Andinas S.A.",
      commercialName: "ConAndes",
      ruc: "1790123456001",
      type: "national",
      category: "Construcción",
      contactPerson: "Pedro Morales",
      phone: "02-4567890",
      mobile: "0965432109",
      email: "ventas@conandes.com",
      website: "www.conandes.com",
      address: "Av. Mariscal Sucre y Fernández Salvador",
      city: "Quito",
      country: "Ecuador",
      paymentTerm: "30",
      creditLimit: "60000",
      currency: "USD",
      bankAccount: "5100765432 - Produbanco",
      totalPurchases: "67890.00",
      outstandingBalance: "0.00",
      lastPurchaseDate: "2026-02-08",
      status: "active",
      isPreferred: true,
      rating: 5,
      notes: "Siempre al día con los pagos, excelente calidad",
    },
    {
      id: "sup-006",
      code: "PROV-006",
      businessName: "Textiles del Norte Ltda.",
      commercialName: "TexNorte",
      ruc: "1795432109001",
      type: "national",
      category: "Textiles",
      contactPerson: "Laura Jiménez",
      phone: "02-3210987",
      mobile: "0954321098",
      email: "contacto@texnorte.com",
      website: "",
      address: "Av. Eloy Alfaro N45-123",
      city: "Quito",
      country: "Ecuador",
      paymentTerm: "45",
      creditLimit: "25000",
      currency: "USD",
      bankAccount: "6100432109 - Banco Internacional",
      totalPurchases: "23450.00",
      outstandingBalance: "5600.00",
      lastPurchaseDate: "2026-01-15",
      status: "inactive",
      isPreferred: false,
      rating: 3,
      notes: "Pausado temporalmente por problemas de calidad",
    },
  ]);

  const [formData, setFormData] = useState<Partial<Supplier>>({
    code: "",
    businessName: "",
    commercialName: "",
    ruc: "",
    type: "national",
    category: "",
    contactPerson: "",
    phone: "",
    mobile: "",
    email: "",
    website: "",
    address: "",
    city: "",
    country: "Ecuador",
    paymentTerm: "30",
    creditLimit: "0",
    currency: "USD",
    bankAccount: "",
    totalPurchases: "0",
    outstandingBalance: "0",
    lastPurchaseDate: "",
    status: "active",
    isPreferred: false,
    rating: 3,
    notes: "",
  });

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.ruc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "all" || supplier.category === filterCategory;
    const matchesStatus = filterStatus === "all" || supplier.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      const nextCode = `PROV-${String(suppliers.length + 1).padStart(3, "0")}`;
      setFormData({
        code: nextCode,
        businessName: "",
        commercialName: "",
        ruc: "",
        type: "national",
        category: "",
        contactPerson: "",
        phone: "",
        mobile: "",
        email: "",
        website: "",
        address: "",
        city: "",
        country: "Ecuador",
        paymentTerm: "30",
        creditLimit: "0",
        currency: "USD",
        bankAccount: "",
        totalPurchases: "0",
        outstandingBalance: "0",
        lastPurchaseDate: "",
        status: "active",
        isPreferred: false,
        rating: 3,
        notes: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handleSave = () => {
    if (!formData.businessName || !formData.ruc) {
      alert("Por favor completa los campos obligatorios (Razón Social y RUC)");
      return;
    }

    if (editingSupplier) {
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === editingSupplier.id
            ? { ...supplier, ...formData }
            : supplier
        )
      );
    } else {
      const newSupplier: Supplier = {
        id: `sup-${Date.now()}`,
        ...formData as Supplier,
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    }
  };

  const togglePreferred = (id: string) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id
          ? { ...supplier, isPreferred: !supplier.isPreferred }
          : supplier
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 border-green-500/20 text-green-400";
      case "inactive":
        return "bg-gray-500/10 border-gray-500/20 text-gray-400";
      case "blocked":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      default:
        return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      case "blocked":
        return "Bloqueado";
      default:
        return status;
    }
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length;
  const preferredSuppliers = suppliers.filter((s) => s.isPreferred).length;
  const totalPurchasesSum = suppliers.reduce(
    (sum, s) => sum + parseFloat(s.totalPurchases),
    0
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header estándar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Truck className="w-8 h-8 text-primary" />
            Proveedores
          </h2>
          <p className="text-gray-400 text-sm">
            Gestión de proveedores y contactos comerciales
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 text-primary" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Proveedores</p>
          <p className="text-white font-bold text-3xl">{totalSuppliers}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Proveedores Activos</p>
          <p className="text-green-400 font-bold text-3xl">{activeSuppliers}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Preferidos</p>
          <p className="text-yellow-400 font-bold text-3xl">{preferredSuppliers}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Compras</p>
          <p className="text-blue-400 font-bold text-3xl">
            ${totalPurchasesSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-white font-medium mb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Buscar proveedor
          </label>
          <input
            type="text"
            placeholder="Razón social, RUC, código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-white font-medium mb-3">Categoría</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-white font-medium mb-3">Estado</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="blocked">Bloqueados</option>
          </select>
        </div>
      </div>

      {/* Lista de proveedores */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No se encontraron proveedores</p>
            <p className="text-gray-500 text-sm">
              Intenta ajustar los filtros o agrega un nuevo proveedor
            </p>
          </div>
        ) : (
          filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                {/* Información principal */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-xl">
                      {supplier.businessName}
                    </h3>
                    {supplier.isPreferred && (
                      <span className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        Preferido
                      </span>
                    )}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(supplier.status)}`}>
                      {getStatusText(supplier.status)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="font-mono">{supplier.code}</span>
                    <span>•</span>
                    <span>{supplier.commercialName}</span>
                    <span>•</span>
                    <span className="font-mono">{supplier.ruc}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < supplier.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 text-sm ml-1">
                      ({supplier.rating}/5)
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePreferred(supplier.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      supplier.isPreferred
                        ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                    title="Marcar como preferido"
                  >
                    <Star className={`w-5 h-5 ${supplier.isPreferred ? "fill-yellow-400" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleOpenModal(supplier)}
                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Información detallada en grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Contacto */}
                <div className="bg-[#0f1825]/50 rounded-xl p-4">
                  <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase">Contacto</h4>
                  <div className="space-y-2">
                    {supplier.contactPerson && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-white">{supplier.contactPerson}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-white">{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <a href={`mailto:${supplier.email}`} className="text-primary hover:underline">
                          {supplier.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ubicación */}
                <div className="bg-[#0f1825]/50 rounded-xl p-4">
                  <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase">Ubicación</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white">{supplier.city}, {supplier.country}</p>
                        {supplier.address && (
                          <p className="text-gray-400 text-xs mt-1">{supplier.address}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-white">{supplier.category}</span>
                    </div>
                  </div>
                </div>

                {/* Información Financiera */}
                <div className="bg-[#0f1825]/50 rounded-xl p-4">
                  <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase">Financiero</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Plazo de pago:</span>
                      <span className="text-white font-medium">
                        {PAYMENT_TERMS.find((p) => p.id === supplier.paymentTerm)?.name || supplier.paymentTerm}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Límite crédito:</span>
                      <span className="text-white font-medium">
                        ${parseFloat(supplier.creditLimit).toLocaleString("en-US")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Saldo pendiente:</span>
                      <span className={`font-medium ${parseFloat(supplier.outstandingBalance) > 0 ? "text-yellow-400" : "text-green-400"}`}>
                        ${parseFloat(supplier.outstandingBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="flex items-center gap-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-gray-400 text-sm">Total compras:</span>
                  <span className="text-white font-bold">
                    ${parseFloat(supplier.totalPurchases).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {supplier.lastPurchaseDate && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400 text-sm">Última compra:</span>
                    <span className="text-white">
                      {new Date(supplier.lastPurchaseDate).toLocaleDateString("es-EC")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de agregar/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">
                {editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información Básica */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Información Básica
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Código <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="PROV-001"
                      value={formData.code || ""}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      RUC/ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="1790016919001"
                      value={formData.ruc || ""}
                      onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Razón Social <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre legal de la empresa"
                      value={formData.businessName || ""}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Nombre Comercial
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre comercial o marca"
                      value={formData.commercialName || ""}
                      onChange={(e) => setFormData({ ...formData, commercialName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Tipo
                    </label>
                    <select
                      value={formData.type || "national"}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="national">Nacional</option>
                      <option value="international">Internacional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Categoría
                    </label>
                    <select
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="">Seleccionar categoría</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Contacto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Persona de contacto
                    </label>
                    <input
                      type="text"
                      placeholder="Nombre del contacto"
                      value={formData.contactPerson || ""}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@empresa.com"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      placeholder="02-1234567"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Celular
                    </label>
                    <input
                      type="tel"
                      placeholder="0987654321"
                      value={formData.mobile || ""}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Sitio web
                    </label>
                    <input
                      type="url"
                      placeholder="www.empresa.com"
                      value={formData.website || ""}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Dirección
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Dirección completa
                    </label>
                    <input
                      type="text"
                      placeholder="Calle, número, sector"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      País
                    </label>
                    <select
                      value={formData.country || "Ecuador"}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Información Financiera */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Información Financiera
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Plazo de pago
                    </label>
                    <select
                      value={formData.paymentTerm || "30"}
                      onChange={(e) => setFormData({ ...formData, paymentTerm: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      {PAYMENT_TERMS.map((term) => (
                        <option key={term.id} value={term.id}>
                          {term.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Límite de crédito ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.creditLimit || "0"}
                      onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Moneda
                    </label>
                    <select
                      value={formData.currency || "USD"}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      {CURRENCIES.map((curr) => (
                        <option key={curr.id} value={curr.id}>
                          {curr.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Calificación
                    </label>
                    <select
                      value={formData.rating || 3}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ Excelente</option>
                      <option value={4}>⭐⭐⭐⭐ Muy bueno</option>
                      <option value={3}>⭐⭐⭐ Bueno</option>
                      <option value={2}>⭐⭐ Regular</option>
                      <option value={1}>⭐ Malo</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Cuenta bancaria
                    </label>
                    <input
                      type="text"
                      placeholder="Número de cuenta - Banco"
                      value={formData.bankAccount || ""}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Estado y Opciones */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4">Estado y Opciones</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Estado
                    </label>
                    <select
                      value={formData.status || "active"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors flex-1">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={formData.isPreferred || false}
                          onChange={(e) => setFormData({ ...formData, isPreferred: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                          {formData.isPreferred && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <span className="text-white font-medium">Proveedor preferido</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Notas adicionales
                </label>
                <textarea
                  placeholder="Observaciones, acuerdos especiales, etc."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium"
              >
                {editingSupplier ? "Guardar Cambios" : "Crear Proveedor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
