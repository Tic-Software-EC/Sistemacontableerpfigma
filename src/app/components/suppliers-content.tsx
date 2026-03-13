/* Módulo de Proveedores - TicSoftEc */
import { useState } from "react";
import {
  Search, Plus, Download, Printer, Eye, Edit, Trash2,
  X, Save, Building2, MapPin, Phone, Mail, CreditCard, User,
  FileText, Calendar, Truck, CheckCircle, Ban,
  Globe, Briefcase, Clock, DollarSign, Upload, Image as ImageIcon,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
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
  createdDate: string;
  createdBy: string;
  website?: string;
  bankAccount?: string;
  // Nuevos campos
  companyLogo?: string;
  assignedCompany?: string; // Empresa a la que pertenece
  advisorName?: string; // Nombre del asesor
}

/* ══════════════════════════════════════════════════════════════════════
   DATOS MOCK
══════════════════════════════════════════════════════════════════════ */
const SUPPLIER_CATEGORIES = [
  "Tecnología",
  "Papelería",
  "Muebles",
  "Construcción",
  "Servicios",
  "Alimentos",
  "Transporte",
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

const SUPPLIERS_INIT: Supplier[] = [
  {
    id: "1",
    code: "SUP-001",
    name: "Distribuidora TechWorld S.A.",
    ruc: "1792345678001",
    email: "ventas@techworld.com.ec",
    phone: "+593 2 234-5678",
    address: "Av. Amazonas N24-123 y Colón",
    city: "Quito",
    country: "Ecuador",
    contactName: "Carlos Mendoza",
    contactPhone: "+593 99 123-4567",
    contactEmail: "cmendoza@techworld.com.ec",
    paymentTerms: "Crédito 30 días",
    creditDays: 30,
    category: "Tecnología",
    status: "active",
    notes: "Proveedor preferencial de equipos tecnológicos",
    createdDate: "2026-01-15",
    createdBy: "Admin Principal",
    website: "www.techworld.com.ec",
    bankAccount: "1234567890 - Banco Pichincha",
    assignedCompany: "TicSoftEc - Sucursal Quito",
    advisorName: "Juan Pérez Gómez"
  },
  {
    id: "2",
    code: "SUP-002",
    name: "Suministros Oficina Express",
    ruc: "1798765432001",
    email: "info@oficinaexpress.com",
    phone: "+593 2 345-6789",
    address: "Calle 10 de Agosto 456",
    city: "Guayaquil",
    country: "Ecuador",
    contactName: "Ana Torres",
    contactPhone: "+593 99 234-5678",
    contactEmail: "atorres@oficinaexpress.com",
    paymentTerms: "Contado",
    creditDays: 0,
    assignedCompany: "TicSoftEc - Sucursal Guayaquil",
    advisorName: "María Rodríguez Silva",
    category: "Papelería",
    status: "active",
    notes: "Entrega rápida en zona urbana",
    createdDate: "2026-01-20",
    createdBy: "Admin Principal",
    website: "www.oficinaexpress.com",
    bankAccount: "9876543210 - Banco del Pacífico"
  },
  {
    id: "3",
    code: "SUP-003",
    name: "Industrial Components Ltd.",
    ruc: "1791122334001",
    email: "ventas@industrial.com",
    phone: "+593 2 456-7890",
    address: "Parque Industrial Norte Km 12",
    city: "Quito",
    country: "Ecuador",
    contactName: "Luis Ramírez",
    contactPhone: "+593 99 345-6789",
    contactEmail: "lramirez@industrial.com",
    paymentTerms: "Crédito 45 días",
    creditDays: 45,
    category: "Construcción",
    status: "active",
    notes: "Proveedor de materiales industriales",
    createdDate: "2026-02-01",
    createdBy: "Admin Principal",
    website: "www.industrialcomponents.com",
    bankAccount: "5555666677 - Banco Guayaquil",
    assignedCompany: "TicSoftEc - Sucursal Cuenca",
    advisorName: "Carlos Méndez Torres"
  },
  {
    id: "4",
    code: "SUP-004",
    name: "Construcciones Andinas S.A.",
    ruc: "1795544332001",
    email: "contacto@andinas.ec",
    phone: "+593 2 567-8901",
    address: "Vía a Tumbaco Km 8",
    city: "Quito",
    country: "Ecuador",
    contactName: "Pedro Morales",
    contactPhone: "+593 99 456-7890",
    contactEmail: "pmorales@andinas.ec",
    paymentTerms: "Crédito 60 días",
    creditDays: 60,
    category: "Construcción",
    status: "active",
    notes: "Obras civiles y materiales de construcción",
    createdDate: "2026-02-10",
    createdBy: "Admin Principal",
    website: "www.andinas.ec",
    bankAccount: "1111222233 - Produbanco",
    assignedCompany: "TicSoftEc - Matriz",
    advisorName: "Laura Fernández Castro"
  },
  {
    id: "5",
    code: "SUP-005",
    name: "Muebles del Norte Ltda.",
    ruc: "1793388776001",
    email: "ventas@mueblesnorte.com",
    phone: "+593 2 678-9012",
    address: "Av. 6 de Diciembre N40-200",
    city: "Quito",
    country: "Ecuador",
    contactName: "Laura Jiménez",
    contactPhone: "+593 99 567-8901",
    contactEmail: "ljimenez@mueblesnorte.com",
    paymentTerms: "Crédito 30 días",
    creditDays: 30,
    category: "Muebles",
    status: "inactive",
    notes: "Proveedor temporal - Evaluar renovación",
    assignedCompany: "TicSoftEc - Sucursal Quito",
    advisorName: "Roberto Sánchez Díaz",
    createdDate: "2026-02-15",
    createdBy: "Admin Principal",
    website: "www.mueblesnorte.com",
    bankAccount: "4444555566 - Banco Internacional"
  },
];

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function SuppliersContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados principales
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS_INIT);
  const [activeTab, setActiveTab] = useState<"active" | "inactive" | "all">("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Estados para formulario
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
    website: "",
    bankAccount: "",
    companyLogo: "",
    assignedCompany: "",
    advisorName: ""
  });

  // Contadores por estado
  const counts = {
    active: suppliers.filter(s => s.status === "active").length,
    inactive: suppliers.filter(s => s.status === "inactive").length,
    all: suppliers.length,
  };

  // Filtrar proveedores
  const filteredSuppliers = suppliers
    .filter(supplier => {
      // Filtro por tab
      if (activeTab !== "all" && supplier.status !== activeTab) return false;
      
      // Filtro por búsqueda
      if (searchTerm && !(
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.ruc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase())
      )) return false;

      // Filtro por categoría
      if (filterCategory !== "all" && supplier.category !== filterCategory) return false;

      return true;
    })
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredSuppliers.map(s => s.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSet = new Set(selectedIds);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedIds(newSet);
  };

  const handleView = (supplier: Supplier) => {
    setViewingSupplier(supplier);
    setShowViewModal(true);
  };

  const handleOpenCreate = () => {
    const nextNumber = `SUP-${String(suppliers.length + 1).padStart(3, '0')}`;
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
      website: "",
      bankAccount: "",
      companyLogo: "",
      assignedCompany: "",
      advisorName: ""
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
    setShowEditModal(true);
  };

  const handleSaveNew = () => {
    // Validaciones
    if (!formData.name || !formData.ruc) {
      toast.error("El nombre y RUC son obligatorios");
      return;
    }

    // Validar formato RUC (13 dígitos)
    if (!/^\d{13}$/.test(formData.ruc)) {
      toast.error("El RUC debe tener 13 dígitos");
      return;
    }

    // Validar email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Email inválido");
      return;
    }

    const newSupplier: Supplier = {
      id: String(Date.now()),
      ...formData as Supplier,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: "María López Contreras"
    };

    setSuppliers([newSupplier, ...suppliers]);
    toast.success("✓ Proveedor creado exitosamente");
    setShowCreateModal(false);
  };

  const handleSaveEdit = () => {
    if (!editingSupplier) return;

    // Validaciones
    if (!formData.name || !formData.ruc) {
      toast.error("El nombre y RUC son obligatorios");
      return;
    }

    setSuppliers(suppliers.map(s =>
      s.id === editingSupplier.id ? { ...s, ...formData } : s
    ));
    toast.success("✓ Proveedor actualizado exitosamente");
    setShowEditModal(false);
    setEditingSupplier(null);
  };

  const handleDelete = (supplier: Supplier) => {
    if (confirm(`¿Estás seguro de eliminar al proveedor "${supplier.name}"?`)) {
      setSuppliers(suppliers.filter(s => s.id !== supplier.id));
      toast.success("✓ Proveedor eliminado");
    }
  };

  const handleActivateSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos un proveedor");
      return;
    }
    setSuppliers(suppliers.map(s =>
      selectedIds.has(s.id) ? { ...s, status: "active" as const } : s
    ));
    toast.success(`✓ ${selectedIds.size} proveedor(es) activado(s)`);
    setSelectedIds(new Set());
  };

  const handleDeactivateSelected = () => {
    if (selectedIds.size === 0) {
      toast.error("Selecciona al menos un proveedor");
      return;
    }
    setSuppliers(suppliers.map(s =>
      selectedIds.has(s.id) ? { ...s, status: "inactive" as const } : s
    ));
    toast.success(`✓ ${selectedIds.size} proveedor(es) desactivado(s)`);
    setSelectedIds(new Set());
  };

  const handleExportCSV = () => {
    toast.success("✓ Exportando proveedores a CSV...");
  };

  const handlePrint = () => {
    toast.success("✓ Imprimiendo lista de proveedores...");
  };

  const updateFormData = (field: keyof Supplier, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  /* ════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <div className={`flex flex-col gap-4 ${isLight ? "bg-white" : "bg-[#0D1B2A]"} rounded-xl p-5`}>
        {/* ── Botón Nuevo Proveedor (alineado a la derecha) ── */}
        <div className="flex justify-end">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-primary hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Proveedor
          </button>
        </div>

        {/* ── Fila de Filtros ── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Buscador */}
          <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${
            isLight ? "bg-white border-gray-300" : "bg-white/5 border-white/15"
          }`}>
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, código, RUC..."
              className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            />
          </div>

          {/* Selector de Categoría */}
          <div className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 ${
            isLight ? "bg-white border-gray-300" : "bg-white/5 border-white/15"
          }`}>
            <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`flex-1 bg-transparent text-sm focus:outline-none ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              <option value="all">Todas las categorías</option>
              {SUPPLIER_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── TABS de Estados ── */}
        <div className={`flex items-center gap-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <button
            onClick={() => {setActiveTab("active"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "active"
                ? isLight ? "text-green-700" : "text-green-400"
                : isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Activos
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "active"
                  ? "bg-green-100 text-green-700"
                  : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
              }`}>
                {counts.active}
              </span>
            </div>
            {activeTab === "active" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("inactive"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "inactive"
                ? isLight ? "text-red-700" : "text-red-400"
                : isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Ban className="w-4 h-4" />
              Inactivos
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "inactive"
                  ? "bg-red-100 text-red-700"
                  : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
              }`}>
                {counts.inactive}
              </span>
            </div>
            {activeTab === "inactive" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
            )}
          </button>

          <button
            onClick={() => {setActiveTab("all"); setSelectedIds(new Set());}}
            className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
              activeTab === "all"
                ? isLight ? "text-blue-700" : "text-blue-400"
                : isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Todos
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === "all"
                  ? "bg-blue-100 text-blue-700"
                  : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
              }`}>
                {counts.all}
              </span>
            </div>
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
            )}
          </button>
        </div>

        {/* ── Barra de Acciones ── */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Mostrar cuando hay selección */}
            {selectedIds.size > 0 && (
              <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                {selectedIds.size} seleccionado(s)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Botones de acción masiva - Siempre visibles */}
            <button
              onClick={handleActivateSelected}
              disabled={selectedIds.size === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${
                selectedIds.size === 0
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Activar
            </button>
            <button
              onClick={handleDeactivateSelected}
              disabled={selectedIds.size === 0}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm ${
                selectedIds.size === 0
                  ? "bg-red-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <Ban className="w-4 h-4" />
              Desactivar
            </button>

            <button
              onClick={handleExportCSV}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                isLight
                  ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  : "border-white/20 text-gray-300 bg-white/5 hover:bg-white/10"
              }`}
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={handlePrint}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                isLight
                  ? "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  : "border-white/20 text-gray-300 bg-white/5 hover:bg-white/10"
              }`}
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>

        {/* ── Banner Informativo ── */}
        <div className={`rounded-lg p-4 border ${
          activeTab === "active"
            ? isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20"
            : activeTab === "inactive"
            ? isLight ? "bg-red-50 border-red-200" : "bg-red-500/10 border-red-500/20"
            : isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"
        }`}>
          <div className="flex items-start gap-2">
            <Truck className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
              activeTab === "active" ? (isLight ? "text-green-600" : "text-green-400")
              : activeTab === "inactive" ? (isLight ? "text-red-600" : "text-red-400")
              : (isLight ? "text-blue-600" : "text-blue-400")
            }`} />
            <div>
              <p className={`text-sm font-semibold ${
                activeTab === "active" ? (isLight ? "text-green-900" : "text-green-300")
                : activeTab === "inactive" ? (isLight ? "text-red-900" : "text-red-300")
                : (isLight ? "text-blue-900" : "text-blue-300")
              }`}>
                {activeTab === "active" && "Proveedores Activos"}
                {activeTab === "inactive" && "Proveedores Inactivos"}
                {activeTab === "all" && "Todos los Proveedores"}
              </p>
              <p className={`text-xs mt-0.5 ${
                activeTab === "active" ? (isLight ? "text-green-700" : "text-green-400")
                : activeTab === "inactive" ? (isLight ? "text-red-700" : "text-red-400")
                : (isLight ? "text-blue-700" : "text-blue-400")
              }`}>
                {activeTab === "active" && "Estos proveedores están disponibles para realizar pedidos y transacciones."}
                {activeTab === "inactive" && "Estos proveedores están temporalmente desactivados y no pueden recibir nuevos pedidos."}
                {activeTab === "all" && "Vista completa de todos los proveedores registrados en el sistema."}
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabla de Proveedores ── */}
        <div className={`rounded-lg border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className={`text-xs font-semibold uppercase tracking-wider border-b ${
                  isLight ? "bg-gray-100 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"
                }`}>
                  <th className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredSuppliers.length && filteredSuppliers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-2 text-left">Código</th>
                  <th className="px-3 py-2 text-left">Proveedor</th>
                  <th className="px-3 py-2 text-left">RUC</th>
                  <th className="px-3 py-2 text-left">Categoría</th>
                  <th className="px-3 py-2 text-left">Contacto</th>
                  <th className="px-3 py-2 text-left">Teléfono</th>
                  <th className="px-3 py-2 text-left">Términos Pago</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier, index) => (
                    <tr
                      key={supplier.id}
                      className={`border-t transition-colors relative ${
                        isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/5"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-1.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(supplier.id)}
                          onChange={(e) => handleSelectOne(supplier.id, e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>

                      {/* Código con barra naranja */}
                      <td className="px-3 py-1.5 relative">
                        {index === 0 && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                        )}
                        <div className={`font-mono font-semibold text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                          {supplier.code}
                        </div>
                      </td>

                      {/* Proveedor */}
                      <td className="px-3 py-1.5">
                        <div className={`font-medium text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                          {supplier.name}
                        </div>
                        <div className={`text-[10px] ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          {supplier.city}
                        </div>
                      </td>

                      {/* RUC */}
                      <td className={`px-3 py-1.5 text-xs font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {supplier.ruc}
                      </td>

                      {/* Categoría */}
                      <td className="px-3 py-1.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isLight ? "bg-gray-100 text-gray-700" : "bg-white/10 text-gray-300"
                        }`}>
                          {supplier.category}
                        </span>
                      </td>

                      {/* Contacto */}
                      <td className={`px-3 py-1.5 text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {supplier.contactName}
                      </td>

                      {/* Teléfono */}
                      <td className={`px-3 py-1.5 text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {supplier.phone}
                      </td>

                      {/* Términos de Pago */}
                      <td className={`px-3 py-1.5 text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {supplier.paymentTerms}
                      </td>

                      {/* Estado */}
                      <td className="px-3 py-1.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          supplier.status === "active"
                            ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                            : isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400"
                        }`}>
                          {supplier.status === "active" ? (
                            <><CheckCircle className="w-3 h-3" /> Activo</>
                          ) : (
                            <><Ban className="w-3 h-3" /> Inactivo</>
                          )}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-3 py-1.5">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(supplier)}
                            className={`p-1 rounded transition-colors ${
                              isLight ? "hover:bg-gray-200 text-gray-600" : "hover:bg-white/10 text-gray-400"
                            }`}
                            title="Ver detalles"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(supplier)}
                            className="p-1 rounded transition-colors hover:bg-blue-500/10 text-blue-500"
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(supplier)}
                            className="p-1 rounded transition-colors hover:bg-red-500/10 text-red-500"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Truck className={`w-12 h-12 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                        <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          No se encontraron proveedores
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          MODAL: Crear Proveedor
      ══════════════════════════════════════════════════════════════ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-4xl rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/20"}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <h3 className={`text-lg font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                  Nuevo Proveedor
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto">
              <div className="space-y-5">
                {/* Información Básica */}
                <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                  <p className={`text-sm font-semibold ${isLight ? "text-blue-900" : "text-blue-300"}`}>
                    Información Básica del Proveedor
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Código <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      readOnly
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm bg-gray-100 ${
                        isLight ? "border-gray-300 text-gray-600" : "border-white/15 text-gray-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      RUC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ruc}
                      onChange={(e) => updateFormData("ruc", e.target.value)}
                      placeholder="1234567890001"
                      maxLength={13}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Nombre / Razón Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="Nombre del proveedor"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateFormData("category", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    >
                      {SUPPLIER_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => updateFormData("status", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                </div>

                {/* Asignación y Logo */}
                <div className={`p-4 rounded-lg border ${isLight ? "bg-purple-50 border-purple-200" : "bg-purple-500/10 border-purple-500/20"}`}>
                  <p className={`text-sm font-semibold ${isLight ? "text-purple-900" : "text-purple-300"}`}>
                    Asignación y Branding
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Empresa Asignada
                    </label>
                    <input
                      type="text"
                      value={formData.assignedCompany}
                      onChange={(e) => updateFormData("assignedCompany", e.target.value)}
                      placeholder="Ej: TicSoftEc - Sucursal Quito"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Asesor Asignado
                    </label>
                    <input
                      type="text"
                      value={formData.advisorName}
                      onChange={(e) => updateFormData("advisorName", e.target.value)}
                      placeholder="Nombre completo del asesor"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Logo de la Empresa
                  </label>
                  <div className="flex items-center gap-3">
                    {formData.companyLogo ? (
                      <div className="relative">
                        <img
                          src={formData.companyLogo}
                          alt="Logo empresa"
                          className="w-20 h-20 object-contain rounded-lg border-2 border-dashed border-gray-300"
                        />
                        <button
                          onClick={() => updateFormData("companyLogo", "")}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className={`w-20 h-20 flex items-center justify-center rounded-lg border-2 border-dashed ${
                        isLight ? "border-gray-300 bg-gray-50" : "border-white/20 bg-white/5"
                      }`}>
                        <ImageIcon className={`w-8 h-8 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.companyLogo || ""}
                        onChange={(e) => updateFormData("companyLogo", e.target.value)}
                        placeholder="URL del logo (https://...)"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                          isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                        }`}
                      />
                      <p className={`text-[10px] mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Ingresa la URL del logo de la empresa del proveedor
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className={`p-4 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20"}`}>
                  <p className={`text-sm font-semibold ${isLight ? "text-green-900" : "text-green-300"}`}>
                    Información de Contacto
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="email@ejemplo.com"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="+593 2 234-5678"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      placeholder="Dirección completa"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      placeholder="Quito"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Persona de Contacto
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => updateFormData("contactName", e.target.value)}
                      placeholder="Nombre completo"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Teléfono Contacto
                    </label>
                    <input
                      type="text"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData("contactPhone", e.target.value)}
                      placeholder="+593 99 123-4567"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Email Contacto
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData("contactEmail", e.target.value)}
                      placeholder="contacto@ejemplo.com"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                {/* Información Comercial */}
                <div className={`p-4 rounded-lg border ${isLight ? "bg-yellow-50 border-yellow-200" : "bg-yellow-500/10 border-yellow-500/20"}`}>
                  <p className={`text-sm font-semibold ${isLight ? "text-yellow-900" : "text-yellow-300"}`}>
                    Información Comercial
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Términos de Pago
                    </label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateFormData("paymentTerms", value);
                        // Extraer días del término
                        const match = value.match(/(\d+)/);
                        updateFormData("creditDays", match ? parseInt(match[1]) : 0);
                      }}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    >
                      {PAYMENT_TERMS.map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Sitio Web
                    </label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => updateFormData("website", e.target.value)}
                      placeholder="www.ejemplo.com"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Cuenta Bancaria
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) => updateFormData("bankAccount", e.target.value)}
                      placeholder="1234567890 - Banco"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    rows={3}
                    placeholder="Información adicional sobre el proveedor..."
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-gray-500 ${
                      isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-2 px-6 py-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNew}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:opacity-90 transition-opacity shadow-sm"
              >
                <Save className="w-4 h-4" />
                Guardar Proveedor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODAL: Editar Proveedor (Similar al de Crear)
      ══════════════════════════════════════════════════════════════ */}
      {showEditModal && editingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-4xl rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/20"}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Edit className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                    Editar Proveedor
                  </h3>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    {editingSupplier.code}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {setShowEditModal(false); setEditingSupplier(null);}}
                className={`p-2 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto">
              <div className="space-y-5">
                {/* Información Básica */}
                <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                  <p className={`text-sm font-semibold ${isLight ? "text-blue-900" : "text-blue-300"}`}>
                    Información Básica del Proveedor
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Código
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      readOnly
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm bg-gray-100 ${
                        isLight ? "border-gray-300 text-gray-600" : "border-white/15 text-gray-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      RUC <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ruc}
                      onChange={(e) => updateFormData("ruc", e.target.value)}
                      maxLength={13}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Nombre / Razón Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateFormData("category", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    >
                      {SUPPLIER_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => updateFormData("status", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className={`p-4 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20"}`}>
                  <p className={`text-sm font-semibold ${isLight ? "text-green-900" : "text-green-300"}`}>
                    Información de Contacto
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Persona de Contacto
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => updateFormData("contactName", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Teléfono Contacto
                    </label>
                    <input
                      type="text"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData("contactPhone", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Email Contacto
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData("contactEmail", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                {/* Información Comercial */}
                <div className={`p-4 rounded-lg border ${isLight ? "bg-yellow-50 border-yellow-200" : "bg-yellow-500/10 border-yellow-500/20"}`}>
                  <p className={`text-sm font-semibold ${isLight ? "text-yellow-900" : "text-yellow-300"}`}>
                    Información Comercial
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Términos de Pago
                    </label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateFormData("paymentTerms", value);
                        const match = value.match(/(\d+)/);
                        updateFormData("creditDays", match ? parseInt(match[1]) : 0);
                      }}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    >
                      {PAYMENT_TERMS.map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Sitio Web
                    </label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => updateFormData("website", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Cuenta Bancaria
                    </label>
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) => updateFormData("bankAccount", e.target.value)}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Notas
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-gray-500 ${
                      isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/15 text-white"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-2 px-6 py-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button
                onClick={() => {setShowEditModal(false); setEditingSupplier(null);}}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODAL: Ver Detalles
      ══════════════════════════════════════════════════════════════ */}
      {showViewModal && viewingSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B2A]/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-3xl rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/20"}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                    {viewingSupplier.name}
                  </h3>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    {viewingSupplier.code} • {viewingSupplier.ruc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/10 text-gray-300"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Logo y Asignación */}
                {(viewingSupplier.companyLogo || viewingSupplier.assignedCompany || viewingSupplier.advisorName) && (
                  <div className={`rounded-lg border p-4 ${isLight ? "bg-purple-50 border-purple-200" : "bg-purple-500/10 border-purple-500/20"}`}>
                    <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                      ASIGNACIÓN Y BRANDING
                    </h4>
                    <div className="flex items-start gap-4">
                      {viewingSupplier.companyLogo && (
                        <div className="flex-shrink-0">
                          <img
                            src={viewingSupplier.companyLogo}
                            alt={`Logo de ${viewingSupplier.name}`}
                            className="w-24 h-24 object-contain rounded-lg border-2 border-dashed border-gray-300"
                          />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3 flex-1 text-sm">
                        {viewingSupplier.assignedCompany && (
                          <div>
                            <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Empresa Asignada:</span>
                            <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.assignedCompany}</span>
                          </div>
                        )}
                        {viewingSupplier.advisorName && (
                          <div>
                            <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Asesor:</span>
                            <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.advisorName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Información General */}
                <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                    INFORMACIÓN GENERAL
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Categoría:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.category}</span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Estado:</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        viewingSupplier.status === "active"
                          ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                          : isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400"
                      }`}>
                        {viewingSupplier.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Email:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.email}</span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Teléfono:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Dirección:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        {viewingSupplier.address}, {viewingSupplier.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contacto */}
                <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                    INFORMACIÓN DE CONTACTO
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Persona:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.contactName}</span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Teléfono:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.contactPhone}</span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Email:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.contactEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Información Comercial */}
                <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                    INFORMACIÓN COMERCIAL
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Términos de Pago:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.paymentTerms}</span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Días de Crédito:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.creditDays} días</span>
                    </div>
                    {viewingSupplier.website && (
                      <div>
                        <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Sitio Web:</span>
                        <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.website}</span>
                      </div>
                    )}
                    {viewingSupplier.bankAccount && (
                      <div>
                        <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cuenta Bancaria:</span>
                        <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.bankAccount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notas */}
                {viewingSupplier.notes && (
                  <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <h4 className={`text-sm font-bold mb-2 ${isLight ? "text-darkBg" : "text-white"}`}>
                      NOTAS
                    </h4>
                    <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{viewingSupplier.notes}</p>
                  </div>
                )}

                {/* Información de Creación */}
                <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                    INFORMACIÓN DE REGISTRO
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha de Creación:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        {new Date(viewingSupplier.createdDate).toLocaleDateString("es-EC")}
                      </span>
                    </div>
                    <div>
                      <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Creado por:</span>
                      <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{viewingSupplier.createdBy}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-end px-6 py-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button
                onClick={() => setShowViewModal(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
