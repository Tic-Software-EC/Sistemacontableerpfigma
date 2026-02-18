import { useState } from "react";
import { Truck, Plus, Pencil, Trash2, Search, Eye, Mail, Phone, MapPin, User, Building2, FileText, X, Package, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Supplier {
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
  productsOffered: string[];
  createdDate: string;
  createdBy: string;
}

const SUPPLIER_CATEGORIES = [
  "all",
  "Tecnología",
  "Papelería",
  "Muebles",
  "Construcción",
  "Servicios",
  "Alimentos",
  "Otros"
];

const PAYMENT_TERMS = [
  "Contado",
  "Crédito 15 días",
  "Crédito 30 días",
  "Crédito 45 días",
  "Crédito 60 días",
  "Crédito 90 días"
];

const AVAILABLE_PRODUCTS = [
  { code: "PROD-001", name: "Laptop Dell Latitude 5420" },
  { code: "PROD-002", name: "Monitor LG 27 pulgadas" },
  { code: "PROD-003", name: "Teclado mecánico Logitech" },
  { code: "PROD-004", name: "Mouse inalámbrico" },
  { code: "PROD-005", name: "Resma papel bond A4" },
  { code: "PROD-006", name: "Marcadores permanentes x12" },
  { code: "PROD-007", name: "Archivador de palanca" },
  { code: "PROD-008", name: "Silla ergonómica oficina" },
  { code: "PROD-009", name: "Escritorio ejecutivo" },
  { code: "PROD-010", name: "Lámpara LED escritorio" },
  { code: "PROD-011", name: "Impresora multifunción" },
  { code: "PROD-012", name: "Caja de bolígrafos x50" },
  { code: "PROD-013", name: "Cemento Portland x50kg" },
  { code: "PROD-014", name: "Varilla de hierro 12mm" },
  { code: "PROD-015", name: "Cable UTP Cat6 x305m" },
];

export function SuppliersContent() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
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
      productsOffered: ["PROD-008", "PROD-009", "PROD-010"],
      createdDate: "2025-01-15",
      createdBy: "Admin Sistema"
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
      productsOffered: ["PROD-001", "PROD-002", "PROD-003", "PROD-004"],
      createdDate: "2025-02-01",
      createdBy: "Admin Sistema"
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
      productsOffered: ["PROD-005", "PROD-006", "PROD-007", "PROD-012"],
      createdDate: "2025-01-20",
      createdBy: "Admin Sistema"
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
      productsOffered: ["PROD-011", "PROD-015"],
      createdDate: "2025-02-10",
      createdBy: "Admin Sistema"
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
      productsOffered: ["PROD-013", "PROD-014"],
      createdDate: "2025-01-05",
      createdBy: "Admin Sistema"
    },
  ]);

  const [formData, setFormData] = useState<Partial<Supplier>>({
    code: "",
    name: "",
    ruc: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Ecuador",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    paymentTerms: "Contado",
    creditDays: 0,
    category: "Otros",
    status: "active",
    notes: "",
    productsOffered: [],
    createdBy: "Usuario Actual"
  });

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.ruc.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === "all" || supplier.category === filterCategory;
    const matchesStatus = filterStatus === "all" || supplier.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
  });

  const handleOpenModal = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData(supplier);
    } else {
      setEditingSupplier(null);
      const nextNumber = `SUP-${String(suppliers.length + 1).padStart(3, "0")}`;
      setFormData({
        code: nextNumber,
        name: "",
        ruc: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        country: "Ecuador",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        paymentTerms: "Contado",
        creditDays: 0,
        category: "Otros",
        status: "active",
        notes: "",
        productsOffered: [],
        createdDate: new Date().toISOString().split("T")[0],
        createdBy: "Usuario Actual"
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.ruc) {
      alert("Por favor completa el nombre y RUC del proveedor");
      return;
    }

    if (editingSupplier) {
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === editingSupplier.id ? { ...supplier, ...formData } : supplier
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

  const handleViewSupplier = (supplier: Supplier) => {
    setViewingSupplier(supplier);
    setShowViewModal(true);
  };

  const toggleProduct = (productCode: string) => {
    const currentProducts = formData.productsOffered || [];
    if (currentProducts.includes(productCode)) {
      setFormData({
        ...formData,
        productsOffered: currentProducts.filter(code => code !== productCode)
      });
    } else {
      setFormData({
        ...formData,
        productsOffered: [...currentProducts, productCode]
      });
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Estadísticas
  const activeSuppliers = suppliers.filter(s => s.status === "active").length;
  const inactiveSuppliers = suppliers.filter(s => s.status === "inactive").length;

  return (
    <div className="space-y-6">
      {/* Header estándar con diseño corporativo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-2xl mb-2 flex items-center gap-3">
            <Truck className="w-8 h-8 text-primary" />
            Gestión de Proveedores
          </h2>
          <p className="text-gray-400 text-sm">
            Administra tu catálogo de proveedores y sus productos
          </p>
        </div>
        
        {/* Botón Nuevo Proveedor - Arriba a la derecha */}
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 justify-center whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Sección de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Buscar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        {/* Categoría */}
        <div className="relative">
          <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todas las categorías</option>
            {SUPPLIER_CATEGORIES.filter(cat => cat !== "all").map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div className="relative">
          <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Lista de proveedores - Tabla */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {filteredSuppliers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No se encontraron proveedores</p>
            <p className="text-gray-500 text-sm">
              Intenta ajustar los filtros o crea un nuevo proveedor
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    RUC
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentItems.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Código */}
                    <td className="px-6 py-4">
                      <span className="text-white font-mono font-bold">{supplier.code}</span>
                    </td>

                    {/* Proveedor */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{supplier.name}</span>
                        <span className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {supplier.city}, {supplier.country}
                        </span>
                      </div>
                    </td>

                    {/* RUC */}
                    <td className="px-6 py-4">
                      <span className="text-white text-sm font-mono">{supplier.ruc}</span>
                    </td>

                    {/* Categoría */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-gray-300">
                        {supplier.category}
                      </span>
                    </td>

                    {/* Contacto */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="text-white flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          {supplier.contactName}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {supplier.contactPhone}
                        </span>
                      </div>
                    </td>

                    {/* Productos */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-xs font-medium text-primary">
                        <Package className="w-3 h-3" />
                        {supplier.productsOffered.length} productos
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                        supplier.status === "active"
                          ? "bg-green-500/10 border border-green-500/20 text-green-400"
                          : "bg-red-500/10 border border-red-500/20 text-red-400"
                      }`}>
                        {supplier.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewSupplier(supplier)}
                          className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenModal(supplier)}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {filteredSuppliers.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Información de registros */}
          <div className="text-gray-400 text-sm">
            Mostrando <span className="text-white font-medium">{indexOfFirstItem + 1}</span> a{" "}
            <span className="text-white font-medium">{Math.min(indexOfLastItem, filteredSuppliers.length)}</span> de{" "}
            <span className="text-white font-medium">{filteredSuppliers.length}</span> proveedores
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center gap-2">
            {/* Selector de items por página */}
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>

            {/* Botones de navegación */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Primera página"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm min-w-[100px] text-center">
                {currentPage} / {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Última página"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
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
                      Código
                    </label>
                    <input
                      type="text"
                      value={formData.code || ""}
                      disabled
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-gray-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      RUC/Tax ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ruc || ""}
                      onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="1234567890001"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Nombre del Proveedor <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Nombre de la empresa"
                    />
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
                      {SUPPLIER_CATEGORIES.filter(cat => cat !== "all").map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Estado
                    </label>
                    <select
                      value={formData.status || ""}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Información de Contacto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="email@empresa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="+593 2 1234567"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Nombre del Contacto
                    </label>
                    <input
                      type="text"
                      value={formData.contactName || ""}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Teléfono del Contacto
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone || ""}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="+593 99 1234567"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Email del Contacto
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail || ""}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="contacto@empresa.com"
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
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Av. Principal N12-34 y Secundaria"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Quito"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      País
                    </label>
                    <input
                      type="text"
                      value={formData.country || ""}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Ecuador"
                    />
                  </div>
                </div>
              </div>

              {/* Condiciones de Pago */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Condiciones de Pago
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Términos de Pago
                    </label>
                    <select
                      value={formData.paymentTerms || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const days = value === "Contado" ? 0 :
                                    value === "Crédito 15 días" ? 15 :
                                    value === "Crédito 30 días" ? 30 :
                                    value === "Crédito 45 días" ? 45 :
                                    value === "Crédito 60 días" ? 60 :
                                    value === "Crédito 90 días" ? 90 : 0;
                        setFormData({ ...formData, paymentTerms: value, creditDays: days });
                      }}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      {PAYMENT_TERMS.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Días de Crédito
                    </label>
                    <input
                      type="number"
                      value={formData.creditDays || 0}
                      disabled
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Productos Ofrecidos */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Productos Ofrecidos ({formData.productsOffered?.length || 0})
                </h4>
                <div className="bg-[#0f1825]/50 border border-white/10 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                    {AVAILABLE_PRODUCTS.map((product) => {
                      const isSelected = formData.productsOffered?.includes(product.code);
                      return (
                        <label
                          key={product.code}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/10 border border-primary/20"
                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProduct(product.code)}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/40"
                          />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isSelected ? "text-primary" : "text-white"}`}>
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">{product.code}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Notas adicionales
                </label>
                <textarea
                  placeholder="Observaciones, condiciones especiales, etc."
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
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

      {/* Modal de vista detallada */}
      {showViewModal && viewingSupplier && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-white font-bold text-xl font-mono">
                  {viewingSupplier.code}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {viewingSupplier.name}
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información general en cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-5">
                  <h4 className="text-gray-400 text-xs font-medium mb-4 uppercase flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Información de la Empresa
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">RUC</p>
                      <p className="text-white font-medium font-mono">{viewingSupplier.ruc}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Categoría</p>
                      <p className="text-white font-medium">{viewingSupplier.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Estado</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                        viewingSupplier.status === "active"
                          ? "bg-green-500/10 border border-green-500/20 text-green-400"
                          : "bg-red-500/10 border border-red-500/20 text-red-400"
                      }`}>
                        {viewingSupplier.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-5">
                  <h4 className="text-gray-400 text-xs font-medium mb-4 uppercase flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Persona de Contacto
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Nombre</p>
                      <p className="text-white font-medium">{viewingSupplier.contactName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Teléfono</p>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {viewingSupplier.contactPhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Email</p>
                      <p className="text-white font-medium flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {viewingSupplier.contactEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-5">
                  <h4 className="text-gray-400 text-xs font-medium mb-4 uppercase flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Ubicación
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-white">{viewingSupplier.address}</p>
                    <p className="text-gray-400">{viewingSupplier.city}, {viewingSupplier.country}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-white">{viewingSupplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-white">{viewingSupplier.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-5">
                  <h4 className="text-gray-400 text-xs font-medium mb-4 uppercase flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Condiciones Comerciales
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Términos de Pago</p>
                      <p className="text-white font-medium">{viewingSupplier.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Días de Crédito</p>
                      <p className="text-primary font-bold text-2xl">{viewingSupplier.creditDays}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos Ofrecidos */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Productos Ofrecidos ({viewingSupplier.productsOffered.length})
                </h4>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {viewingSupplier.productsOffered.map((productCode) => {
                      const product = AVAILABLE_PRODUCTS.find(p => p.code === productCode);
                      return product ? (
                        <div
                          key={productCode}
                          className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg"
                        >
                          <Package className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-white text-sm font-medium">{product.name}</p>
                            <p className="text-gray-500 text-xs">{product.code}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              {/* Notas */}
              {viewingSupplier.notes && (
                <div className="bg-white/5 rounded-xl p-5">
                  <h4 className="text-gray-400 text-xs font-medium mb-2 uppercase">Notas</h4>
                  <p className="text-white text-sm">{viewingSupplier.notes}</p>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}