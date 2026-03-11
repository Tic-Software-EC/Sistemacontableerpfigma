import { useState } from "react";
import { Supplier, SUPPLIERS_DATA } from "../data/suppliers-data";
import { useTheme } from "../contexts/theme-context";
import {
  Search, Plus, Filter, Download, Printer, Eye, Edit, Trash2,
  X, Save, Building2, MapPin, Phone, Mail, CreditCard, User,
  FileText, Calendar, DollarSign, Package, TrendingUp, AlertCircle,
  CheckCircle2, Clock, Ban, Truck, Pencil, ChevronsLeft, ChevronsRight,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

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

export function SuppliersContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // Estilos adaptativos
  const txt = isLight ? "text-gray-900" : "text-white";
  const txtSub = isLight ? "text-gray-600" : "text-gray-400";
  const bg = isLight ? "bg-white" : "bg-white/5";
  const bgHover = isLight ? "hover:bg-gray-50" : "hover:bg-white/10";
  const border = isLight ? "border-gray-200" : "border-white/10";
  const inputBg = isLight ? "bg-white" : "bg-white/5";
  const inputBorder = isLight ? "border-gray-300" : "border-white/10";
  const inputText = isLight ? "text-gray-900" : "text-white";
  const placeholder = isLight ? "placeholder-gray-400" : "placeholder-gray-500";
  const modal = isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10";
  const headerBg = isLight ? "bg-gray-50" : "bg-white/5";
  
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS_DATA);

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
    createdDate: new Date().toISOString().split("T")[0],
    createdBy: "Usuario Actual",
    website: "",
    contactPerson: "",
    bankAccount: ""
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
        createdDate: new Date().toISOString().split("T")[0],
        createdBy: "Usuario Actual",
        website: "",
        contactPerson: "",
        bankAccount: ""
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
      toast.error("Por favor completa el nombre y RUC del proveedor");
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

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">


      {/* Línea separatoria */}
      <div className={`border-t ${border}`}></div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${bg} border ${border} rounded-xl p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${txtSub} text-xs mb-1`}>Total Proveedores</p>
              <p className={`${txt} font-bold text-2xl`}>{suppliers.length}</p>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
        <div className={`${bg} border ${border} rounded-xl p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${txtSub} text-xs mb-1`}>Activos</p>
              <p className={`${txt} font-bold text-2xl`}>{suppliers.filter(s => s.status === "active").length}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
        <div className={`${bg} border ${border} rounded-xl p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${txtSub} text-xs mb-1`}>Inactivos</p>
              <p className={`${txt} font-bold text-2xl`}>{suppliers.filter(s => s.status === "inactive").length}</p>
            </div>
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>
        <div className={`${bg} border ${border} rounded-xl p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${txtSub} text-xs mb-1`}>En Búsqueda</p>
              <p className={`${txt} font-bold text-2xl`}>{filteredSuppliers.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Segunda línea separatoria */}
      <div className={`border-t ${border}`}></div>

      {/* Botón de acción */}
      <div className="flex justify-end">
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Sección de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Buscar */}
        <div className="relative">
          <Search className={`w-4 h-4 ${txtSub} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
          <input
            type="text"
            placeholder="Buscar proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${inputBorder} rounded-lg ${inputText} text-sm ${placeholder} focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all`}
          />
        </div>

        {/* Categoría */}
        <div className="relative">
          <Building2 className={`w-4 h-4 ${txtSub} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${inputBorder} rounded-lg ${inputText} text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer`}
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
          <FileText className={`w-4 h-4 ${txtSub} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 ${inputBg} border ${inputBorder} rounded-lg ${inputText} text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer`}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Lista de proveedores - Tabla */}
      <div className={`${bg} border ${border} rounded-2xl overflow-hidden`}>
        {filteredSuppliers.length === 0 ? (
          <div className="p-12 text-center">
            <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Truck className={`w-8 h-8 ${txtSub}`} />
            </div>
            <p className={`${txtSub} mb-2`}>No se encontraron proveedores</p>
            <p className={`${txtSub} text-sm`}>
              Intenta ajustar los filtros o crea un nuevo proveedor
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${headerBg} border-b ${border}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Código
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Proveedor
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    RUC
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Categoría
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Contacto
                  </th>
                  <th className={`px-6 py-4 text-center text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Estado
                  </th>
                  <th className={`px-6 py-4 text-center text-xs font-medium ${txtSub} uppercase tracking-wider`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/5"}`}>
                {currentItems.map((supplier) => (
                  <tr key={supplier.id} className={`${isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"} transition-colors`}>
                    {/* Código */}
                    <td className="px-6 py-4">
                      <span className={`${txt} font-mono font-bold`}>{supplier.code}</span>
                    </td>

                    {/* Proveedor */}
                    <td className="px-6 py-3">
                      <span className={`${txt} font-medium`}>{supplier.name}</span>
                    </td>

                    {/* RUC */}
                    <td className="px-6 py-3">
                      <span className={`${txt} text-sm font-mono`}>{supplier.ruc}</span>
                    </td>

                    {/* Categoría */}
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${bg} border ${border} rounded-lg text-xs font-medium ${txtSub}`}>
                        {supplier.category}
                      </span>
                    </td>

                    {/* Contacto */}
                    <td className="px-6 py-3">
                      <span className={`${txt} text-sm`}>{supplier.contactName}</span>
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
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenModal(supplier)}
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}
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
        <div className="fixed inset-0 bg-[#0D1B2A]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl ${modal} rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}>
            {/* Header del modal */}
            <div className={`sticky top-0 ${isLight ? "bg-white" : "bg-secondary"} border-b ${border} px-6 py-4 flex items-center justify-between z-10`}>
              <h3 className={`${txt} font-bold text-xl`}>
                {editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
              </h3>
              <button
                onClick={handleCloseModal}
                className={`p-2 ${txtSub} ${isLight ? "hover:text-gray-900 hover:bg-gray-100" : "hover:text-white hover:bg-white/5"} rounded-lg transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información Básica */}
              <div>
                <h4 className={`${txt} font-bold text-lg mb-4 flex items-center gap-2`}>
                  <Building2 className="w-5 h-5 text-primary" />
                  Información Básica
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${txtSub} text-sm mb-2 font-medium`}>
                      Código
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-gray-500 text-sm font-mono"
                      disabled
                    />
                  </div>

                  <div>
                    <label className={`block ${txtSub} text-sm mb-2 font-medium`}>
                      RUC/Tax ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ruc || ""}
                      onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="1234567890001"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block ${txtSub} text-sm mb-2 font-medium`}>
                      Nombre del Proveedor <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nombre del proveedor"
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block ${txtSub} text-sm mb-2 font-medium`}>
                      Categoría
                    </label>
                    <select
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      {SUPPLIER_CATEGORIES.filter(cat => cat !== "all").map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Estado — solo en edición */}
                  {editingSupplier && (
                  <div>
                    <label className={`block ${txtSub} text-sm mb-2 font-medium`}>
                      Estado
                    </label>
                    <select
                      value={formData.status || ""}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                  )}
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
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="proveedor@ejemplo.com"
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+593 99 999 9999"
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
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
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
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
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
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
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
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
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Dirección completa"
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ciudad"
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      País
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="País"
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
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
                      className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-gray-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Notas Adicionales
                </h4>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales sobre el proveedor..."
                  rows={3}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-gray-500 text-sm"
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
        <div className="fixed inset-0 bg-[#0D1B2A]/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl ${modal} rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl`}>
            {/* Header del modal */}
            <div className={`sticky top-0 ${isLight ? "bg-white" : "bg-secondary"} border-b ${border} px-6 py-4 flex items-center justify-between z-10`}>
              <div>
                <h3 className={`${txt} font-bold text-xl font-mono`}>
                  {viewingSupplier.code}
                </h3>
                <p className={`${txtSub} text-sm mt-1`}>
                  {viewingSupplier.name}
                </p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className={`p-2 ${txtSub} ${isLight ? "hover:text-gray-900 hover:bg-gray-100" : "hover:text-white hover:bg-white/5"} rounded-lg transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información general en cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${bg} rounded-xl p-5`}>
                  <h4 className={`${txtSub} text-xs font-medium mb-4 uppercase flex items-center gap-2`}>
                    <Building2 className="w-4 h-4" />
                    Información de la Empresa
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className={`${txtSub} text-xs`}>RUC</p>
                      <p className={`${txt} font-medium font-mono`}>{viewingSupplier.ruc}</p>
                    </div>
                    <div>
                      <p className={`${txtSub} text-xs`}>Categoría</p>
                      <p className={`${txt} font-medium`}>{viewingSupplier.category}</p>
                    </div>
                    <div>
                      <p className={`${txtSub} text-xs`}>Estado</p>
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

                <div className={`${bg} rounded-xl p-5`}>
                  <h4 className={`${txtSub} text-xs font-medium mb-4 uppercase flex items-center gap-2`}>
                    <User className="w-4 h-4" />
                    Persona de Contacto
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className={`${txtSub} text-xs`}>Nombre</p>
                      <p className={`${txt} font-medium`}>{viewingSupplier.contactName}</p>
                    </div>
                    <div>
                      <p className={`${txtSub} text-xs`}>Teléfono</p>
                      <p className={`${txt} font-medium flex items-center gap-2`}>
                        <Phone className={`w-3 h-3 ${txtSub}`} />
                        {viewingSupplier.contactPhone}
                      </p>
                    </div>
                    <div>
                      <p className={`${txtSub} text-xs`}>Email</p>
                      <p className={`${txt} font-medium flex items-center gap-2`}>
                        <Mail className={`w-3 h-3 ${txtSub}`} />
                        {viewingSupplier.contactEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`${bg} rounded-xl p-5`}>
                  <h4 className={`${txtSub} text-xs font-medium mb-4 uppercase flex items-center gap-2`}>
                    <MapPin className="w-4 h-4" />
                    Ubicación
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className={txt}>{viewingSupplier.address}</p>
                    <p className={txtSub}>{viewingSupplier.city}, {viewingSupplier.country}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Phone className={`w-3 h-3 ${txtSub}`} />
                      <span className={txt}>{viewingSupplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className={`w-3 h-3 ${txtSub}`} />
                      <span className={txt}>{viewingSupplier.email}</span>
                    </div>
                  </div>
                </div>

                <div className={`${bg} rounded-xl p-5`}>
                  <h4 className={`${txtSub} text-xs font-medium mb-4 uppercase flex items-center gap-2`}>
                    <FileText className="w-4 h-4" />
                    Condiciones Comerciales
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className={`${txtSub} text-xs`}>Términos de Pago</p>
                      <p className={`${txt} font-medium`}>{viewingSupplier.paymentTerms}</p>
                    </div>
                    <div>
                      <p className={`${txtSub} text-xs`}>Días de Crédito</p>
                      <p className="text-primary font-bold text-2xl">{viewingSupplier.creditDays}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {viewingSupplier.notes && (
                <div className={`${bg} rounded-xl p-5`}>
                  <h4 className={`${txtSub} text-xs font-medium mb-2 uppercase`}>Notas</h4>
                  <p className={`${txt} text-sm`}>{viewingSupplier.notes}</p>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className={`sticky bottom-0 ${isLight ? "bg-white" : "bg-secondary"} border-t ${border} px-6 py-4 flex items-center justify-end gap-3`}>
              <button
                onClick={() => setShowViewModal(false)}
                className={`px-6 py-2.5 ${bg} ${bgHover} ${txt} rounded-xl transition-colors font-medium`}
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