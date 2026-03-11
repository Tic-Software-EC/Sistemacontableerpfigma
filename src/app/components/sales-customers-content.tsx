import { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Eye, X, Save, Users, 
  Mail, Phone, MapPin, FileText, Calendar, DollarSign,
  Filter, Download, Upload, User
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { CUSTOMERS_DATA, Customer } from "../data/customers-data";

const INITIAL_CUSTOMERS: Customer[] = CUSTOMERS_DATA;

export function SalesCustomersContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── Estilos ────────────────────────────────────────────────────────────────
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const lbl = isLight ? "text-gray-600" : "text-gray-300";
  const divB = isLight ? "border-gray-200" : "border-white/10";
  const card = `rounded-xl border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const modal = `rounded-2xl border shadow-2xl ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`;
  const IN = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" : "bg-[#1a2936] border-white/10 text-white placeholder-gray-500"}`;
  const thCls = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`;
  const hoverRow = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]";
  const btnSec = isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white";

  // ── Estado ─────────────────────────────────────────────────────────────────
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    idType: "RUC" as "RUC" | "Cédula" | "Pasaporte",
    idNumber: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    creditLimit: 0,
    status: "Activo" as "Activo" | "Inactivo"
  });

  // ── Filtrado ───────────────────────────────────────────────────────────────
  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.idNumber.includes(searchTerm);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Estadísticas ───────────────────────────────────────────────────────────
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "Activo").length;
  const totalSales = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({
      name: "", idType: "RUC", idNumber: "", email: "", phone: "",
      address: "", city: "", creditLimit: 0, status: "Activo"
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      idType: customer.idType,
      idNumber: customer.idNumber,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      creditLimit: customer.creditLimit,
      status: customer.status
    });
    setShowEditModal(true);
  };

  const openViewModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  const openDeleteModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  const handleCreate = () => {
    if (!formData.name || !formData.idNumber) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    const newCustomer: Customer = {
      id: Date.now().toString(),
      code: `CLI-${String(customers.length + 1).padStart(3, "0")}`,
      name: formData.name,
      idType: formData.idType,
      idNumber: formData.idNumber,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      totalPurchases: 0,
      lastPurchase: "",
      status: formData.status,
      creditLimit: formData.creditLimit,
      balance: 0
    };

    setCustomers([...customers, newCustomer]);
    setShowCreateModal(false);
    resetForm();
    toast.success("Cliente creado exitosamente");
  };

  const handleEdit = () => {
    if (!selectedCustomer || !formData.name || !formData.idNumber) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    setCustomers(customers.map(c =>
      c.id === selectedCustomer.id ? { ...c, ...formData } : c
    ));
    setShowEditModal(false);
    setSelectedCustomer(null);
    resetForm();
    toast.success("Cliente actualizado exitosamente");
  };

  const handleDelete = () => {
    if (selectedCustomer) {
      setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
      setShowDeleteModal(false);
      setSelectedCustomer(null);
      toast.success("Cliente eliminado exitosamente");
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {/* ══ Botón Nuevo (alineado a la derecha) ═══════════════════════════════ */}
          <div className="flex justify-end">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Nuevo Cliente
            </button>
          </div>

          {/* ══ Fila de filtros ════════════════════════════════════════════════════ */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
              <input
                type="text"
                placeholder="Buscar por nombre, código o identificación..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className={`${IN} pl-10`}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className={`w-4 h-4 ${sub}`} />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className={IN}
                style={{ width: "160px" }}
              >
                <option value="all">Todos los estados</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
              </select>
            </div>
            <button
              onClick={() => toast.success("Exportando clientes...")}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}
            >
              <Download className="w-4 h-4" /> Exportar
            </button>
          </div>

          {/* ══ Tabla con encabezado oscuro ═══════════════════════════════════════ */}
          <div className={card}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${isLight ? "bg-gray-900 border-gray-800" : "bg-black/40 border-white/10"}`}>
                    <th className={`${thCls} ${isLight ? "text-gray-300" : ""}`}>Código</th>
                    <th className={`${thCls} ${isLight ? "text-gray-300" : ""}`}>Cliente</th>
                    <th className={`${thCls} ${isLight ? "text-gray-300" : ""}`}>Identificación</th>
                    <th className={`${thCls} ${isLight ? "text-gray-300" : ""}`}>Contacto</th>
                    <th className={`${thCls} ${isLight ? "text-gray-300" : ""}`}>Ciudad</th>
                    <th className={`${thCls} text-right ${isLight ? "text-gray-300" : ""}`}>Total Compras</th>
                    <th className={`${thCls} text-right ${isLight ? "text-gray-300" : ""}`}>Saldo</th>
                    <th className={`${thCls} text-center ${isLight ? "text-gray-300" : ""}`}>Estado</th>
                    <th className={`${thCls} text-center ${isLight ? "text-gray-300" : ""}`}>Acciones</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${divB}`}>
                  {filtered.length > 0 ? filtered.map(customer => (
                    <tr key={customer.id} className={hoverRow}>
                      <td className={`px-4 py-3 text-sm font-medium ${txt}`}>{customer.code}</td>
                      <td className={`px-4 py-3 text-sm ${txt}`}>
                        <div className="font-medium">{customer.name}</div>
                        <div className={`text-xs ${sub}`}>{customer.lastPurchase ? `Última compra: ${customer.lastPurchase}` : "Sin compras"}</div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${txt}`}>
                        <div className="text-xs font-semibold text-primary">{customer.idType}</div>
                        <div>{customer.idNumber}</div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${txt}`}>
                        <div className="flex items-center gap-1 text-xs">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${sub} mt-0.5`}>
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${txt}`}>{customer.city}</td>
                      <td className={`px-4 py-3 text-sm font-semibold text-right ${txt}`}>
                        ${customer.totalPurchases.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-4 py-3 text-sm font-semibold text-right ${customer.balance > 0 ? "text-orange-500" : txt}`}>
                        ${customer.balance.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          customer.status === "Activo"
                            ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openViewModal(customer)}
                            className={`transition-colors ${isLight ? "text-gray-400 hover:text-blue-600" : "text-gray-500 hover:text-blue-400"}`}
                            title="Ver"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(customer)}
                            className={`transition-colors ${isLight ? "text-gray-400 hover:text-primary" : "text-gray-500 hover:text-primary"}`}
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(customer)}
                            className={`transition-colors ${isLight ? "text-gray-400 hover:text-red-500" : "text-gray-500 hover:text-red-400"}`}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={9} className="py-12 text-center">
                        <Users className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                        <p className={`text-sm font-medium ${txt}`}>No se encontraron clientes</p>
                        <p className={`text-xs mt-1 ${sub}`}>Intenta con otros términos de búsqueda</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ══ Modal Crear ════════════════════════════════════════════════════════ */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className={`w-full max-w-2xl ${modal} max-h-[90vh] overflow-y-auto`}>
                <div className={`sticky top-0 z-10 border-b ${divB} px-6 py-4 flex items-center justify-between ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
                  <h3 className={`font-bold text-lg ${txt}`}>Nuevo Cliente</h3>
                  <button onClick={() => setShowCreateModal(false)} className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Nombre / Razón Social <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={IN} placeholder="Ej: Corporación ABC S.A." />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Tipo de Identificación <span className="text-red-500">*</span></label>
                      <select value={formData.idType} onChange={e => setFormData({...formData, idType: e.target.value as any})} className={IN}>
                        <option value="RUC">RUC</option>
                        <option value="Cédula">Cédula</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Número de Identificación <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} className={IN} placeholder="Ej: 1792345678001" />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Email</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={IN} placeholder="Ej: contacto@empresa.com" />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Teléfono</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={IN} placeholder="Ej: +593 2 123 4567" />
                    </div>
                    <div className="col-span-2">
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Dirección</label>
                      <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={IN} placeholder="Ej: Av. Principal 123 y Secundaria" />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Ciudad</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={IN} placeholder="Ej: Quito" />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Límite de Crédito</label>
                      <input type="number" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: parseFloat(e.target.value) || 0})} className={IN} placeholder="0.00" />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Estado</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className={IN}>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className={`border-t ${divB} px-6 py-4 flex justify-end gap-3`}>
                  <button onClick={() => setShowCreateModal(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>Cancelar</button>
                  <button onClick={handleCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> Guardar Cliente
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ Modal Editar ═══════════════════════════════════════════════════════ */}
          {showEditModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className={`w-full max-w-2xl ${modal} max-h-[90vh] overflow-y-auto`}>
                <div className={`sticky top-0 z-10 border-b ${divB} px-6 py-4 flex items-center justify-between ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
                  <h3 className={`font-bold text-lg ${txt}`}>Editar Cliente: {selectedCustomer.code}</h3>
                  <button onClick={() => { setShowEditModal(false); setSelectedCustomer(null); }} className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Nombre / Razón Social <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={IN} />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Tipo de Identificación</label>
                      <select value={formData.idType} onChange={e => setFormData({...formData, idType: e.target.value as any})} className={IN}>
                        <option value="RUC">RUC</option>
                        <option value="Cédula">Cédula</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Número de Identificación</label>
                      <input type="text" value={formData.idNumber} onChange={e => setFormData({...formData, idNumber: e.target.value})} className={IN} />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Email</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={IN} />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Teléfono</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={IN} />
                    </div>
                    <div className="col-span-2">
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Dirección</label>
                      <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={IN} />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Ciudad</label>
                      <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={IN} />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Límite de Crédito</label>
                      <input type="number" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: parseFloat(e.target.value) || 0})} className={IN} />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Estado</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className={IN}>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className={`border-t ${divB} px-6 py-4 flex justify-end gap-3`}>
                  <button onClick={() => { setShowEditModal(false); setSelectedCustomer(null); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>Cancelar</button>
                  <button onClick={handleEdit} className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                    <Save className="w-4 h-4" /> Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ Modal Ver ══════════════════════════════════════════════════════════ */}
          {showViewModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className={`w-full max-w-2xl ${modal}`}>
                <div className={`border-b ${divB} px-6 py-4 flex items-center justify-between`}>
                  <h3 className={`font-bold text-lg ${txt}`}>Detalles del Cliente</h3>
                  <button onClick={() => { setShowViewModal(false); setSelectedCustomer(null); }} className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Código</p>
                      <p className={`text-sm font-semibold ${txt}`}>{selectedCustomer.code}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Estado</p>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        selectedCustomer.status === "Activo"
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
                      }`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className={`text-xs font-medium ${sub} mb-1`}>Nombre / Razón Social</p>
                      <p className={`text-sm font-semibold ${txt}`}>{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Tipo de Identificación</p>
                      <p className={`text-sm ${txt}`}>{selectedCustomer.idType}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Número de Identificación</p>
                      <p className={`text-sm ${txt}`}>{selectedCustomer.idNumber}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Email</p>
                      <p className={`text-sm ${txt}`}>{selectedCustomer.email || "—"}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Teléfono</p>
                      <p className={`text-sm ${txt}`}>{selectedCustomer.phone || "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className={`text-xs font-medium ${sub} mb-1`}>Dirección</p>
                      <p className={`text-sm ${txt}`}>{selectedCustomer.address || "—"}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Ciudad</p>
                      <p className={`text-sm ${txt}`}>{selectedCustomer.city || "—"}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Límite de Crédito</p>
                      <p className={`text-sm font-semibold ${txt}`}>${selectedCustomer.creditLimit.toLocaleString("es-EC", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Total Compras</p>
                      <p className={`text-sm font-semibold text-blue-600`}>${selectedCustomer.totalPurchases.toLocaleString("es-EC", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Saldo Pendiente</p>
                      <p className={`text-sm font-semibold ${selectedCustomer.balance > 0 ? "text-orange-500" : "text-green-600"}`}>${selectedCustomer.balance.toLocaleString("es-EC", { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${sub} mb-1`}>Última Compra</p>
                      <p className={`text-sm ${txt}`}>{selectedCustomer.lastPurchase || "—"}</p>
                    </div>
                  </div>
                </div>
                <div className={`border-t ${divB} px-6 py-4 flex justify-end gap-3`}>
                  <button onClick={() => { setShowViewModal(false); openEditModal(selectedCustomer); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>
                    <Edit2 className="w-4 h-4 inline mr-2" /> Editar
                  </button>
                  <button onClick={() => { setShowViewModal(false); setSelectedCustomer(null); }} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">Cerrar</button>
                </div>
              </div>
            </div>
          )}

          {/* ══ Modal Eliminar ═════════════════════════════════════════════════════ */}
          {showDeleteModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className={`w-full max-w-md ${modal}`}>
                <div className={`border-b ${divB} px-6 py-4`}>
                  <h3 className={`font-bold text-lg ${txt}`}>Eliminar Cliente</h3>
                </div>
                <div className="p-6">
                  <p className={`text-sm ${txt} mb-4`}>
                    ¿Estás seguro de que deseas eliminar el cliente <strong>{selectedCustomer.name}</strong>?
                  </p>
                  <p className={`text-xs ${sub}`}>Esta acción no se puede deshacer.</p>
                </div>
                <div className={`border-t ${divB} px-6 py-4 flex justify-end gap-3`}>
                  <button onClick={() => { setShowDeleteModal(false); setSelectedCustomer(null); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>Cancelar</button>
                  <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">Eliminar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}