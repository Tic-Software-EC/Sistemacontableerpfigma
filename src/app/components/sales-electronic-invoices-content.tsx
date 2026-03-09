import { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Eye, X, Save, Receipt, 
  Mail, Phone, MapPin, FileText, Calendar, DollarSign,
  Filter, Download, Send, CheckCircle, AlertCircle, Clock,
  User, Building2, Hash, CreditCard, Package, Percent, FileCheck
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

interface InvoiceItem {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  ivaRate: number; // 0%, 12%, 15%
  subtotal: number;
  iva: number;
  total: number;
}

interface ElectronicInvoice {
  id: string;
  invoiceNumber: string; // 001-001-000000123
  accessKey: string; // Clave de acceso de 49 dígitos
  issueDate: string;
  issuerRuc: string;
  issuerName: string;
  issuerAddress: string;
  issuerPhone: string;
  customerIdType: "RUC" | "Cédula" | "Pasaporte";
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  subtotalBeforeTax: number;
  iva12: number;
  iva15: number;
  iva0: number;
  total: number;
  status: "Borrador" | "Autorizado" | "Rechazado" | "Pendiente";
  authorizationDate?: string;
  observations?: string;
}

const INITIAL_INVOICES: ElectronicInvoice[] = [
  {
    id: "1",
    invoiceNumber: "001-001-000000123",
    accessKey: "0803202601179234567800110010010000001231234567818",
    issueDate: "2026-03-08",
    issuerRuc: "1792345678001",
    issuerName: "TicSoftEc S.A.",
    issuerAddress: "Av. Principal 123 y Secundaria, Quito",
    issuerPhone: "+593 2 245 6789",
    customerIdType: "RUC",
    customerId: "0992567890001",
    customerName: "Distribuidora del Pacífico",
    customerAddress: "Av. 9 de Octubre 456, Guayaquil",
    customerPhone: "+593 4 234 5678",
    customerEmail: "ventas@dispacifico.com",
    items: [
      {
        id: "1",
        code: "PROD-001",
        description: "Laptop Dell Inspiron 15",
        quantity: 2,
        unitPrice: 850.00,
        discount: 50.00,
        ivaRate: 15,
        subtotal: 1700.00,
        iva: 247.50,
        total: 1897.50
      },
      {
        id: "2",
        code: "PROD-002",
        description: "Mouse Inalámbrico Logitech",
        quantity: 5,
        unitPrice: 25.00,
        discount: 0,
        ivaRate: 15,
        subtotal: 125.00,
        iva: 18.75,
        total: 143.75
      }
    ],
    subtotal: 1825.00,
    totalDiscount: 50.00,
    subtotalBeforeTax: 1775.00,
    iva12: 0,
    iva15: 266.25,
    iva0: 0,
    total: 2041.25,
    status: "Autorizado",
    authorizationDate: "2026-03-08 10:30:00",
    observations: "Pago a 30 días"
  },
  {
    id: "2",
    invoiceNumber: "001-001-000000124",
    accessKey: "0803202601179234567800110010010000001241234567819",
    issueDate: "2026-03-08",
    issuerRuc: "1792345678001",
    issuerName: "TicSoftEc S.A.",
    issuerAddress: "Av. Principal 123 y Secundaria, Quito",
    issuerPhone: "+593 2 245 6789",
    customerIdType: "Cédula",
    customerId: "1712345678",
    customerName: "María Fernanda González",
    customerAddress: "Calle Los Pinos 234, Quito",
    customerPhone: "+593 99 876 5432",
    customerEmail: "mfgonzalez@gmail.com",
    items: [
      {
        id: "1",
        code: "SERV-001",
        description: "Servicio de Consultoría TI",
        quantity: 10,
        unitPrice: 120.00,
        discount: 100.00,
        ivaRate: 15,
        subtotal: 1200.00,
        iva: 165.00,
        total: 1265.00
      }
    ],
    subtotal: 1200.00,
    totalDiscount: 100.00,
    subtotalBeforeTax: 1100.00,
    iva12: 0,
    iva15: 165.00,
    iva0: 0,
    total: 1265.00,
    status: "Pendiente",
    observations: ""
  },
  {
    id: "3",
    invoiceNumber: "001-001-000000125",
    accessKey: "0803202601179234567800110010010000001251234567820",
    issueDate: "2026-03-07",
    issuerRuc: "1792345678001",
    issuerName: "TicSoftEc S.A.",
    issuerAddress: "Av. Principal 123 y Secundaria, Quito",
    issuerPhone: "+593 2 245 6789",
    customerIdType: "RUC",
    customerId: "1792345678001",
    customerName: "Corporación Nacional S.A.",
    customerAddress: "Av. Amazonas N24-123 y Colón, Quito",
    customerPhone: "+593 2 245 6789",
    customerEmail: "contacto@corpnacional.com",
    items: [
      {
        id: "1",
        code: "PROD-003",
        description: "Software Contable Anual",
        quantity: 1,
        unitPrice: 2500.00,
        discount: 250.00,
        ivaRate: 15,
        subtotal: 2500.00,
        iva: 337.50,
        total: 2587.50
      }
    ],
    subtotal: 2500.00,
    totalDiscount: 250.00,
    subtotalBeforeTax: 2250.00,
    iva12: 0,
    iva15: 337.50,
    iva0: 0,
    total: 2587.50,
    status: "Borrador"
  }
];

export function SalesElectronicInvoicesContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── Estilos ────────────────────────────────────────────────────────────────
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const lbl = isLight ? "text-gray-600" : "text-gray-300";
  const divB = isLight ? "border-gray-200" : "border-white/10";
  const card = `rounded-xl border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const modal = `rounded-2xl border shadow-2xl ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`;
  const IN = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500"}`;
  const thCls = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`;
  const hoverRow = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]";
  const btnSec = isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white";

  // ── Estado ─────────────────────────────────────────────────────────────────
  const [invoices, setInvoices] = useState<ElectronicInvoice[]>(INITIAL_INVOICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ElectronicInvoice | null>(null);
  
  const [formData, setFormData] = useState({
    customerIdType: "RUC" as "RUC" | "Cédula" | "Pasaporte",
    customerId: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    customerEmail: "",
    observations: ""
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    code: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    ivaRate: 15
  });

  // ── Filtrado ───────────────────────────────────────────────────────────────
  const filtered = invoices.filter(inv => {
    const matchSearch = inv.invoiceNumber.includes(searchTerm) ||
                       inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       inv.customerId.includes(searchTerm) ||
                       inv.accessKey.includes(searchTerm);
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Estadísticas ───────────────────────────────────────────────────────────
  const totalInvoices = invoices.length;
  const authorizedInvoices = invoices.filter(i => i.status === "Autorizado").length;
  const pendingInvoices = invoices.filter(i => i.status === "Pendiente").length;
  const totalAmount = invoices.filter(i => i.status === "Autorizado").reduce((sum, i) => sum + i.total, 0);

  // ── Funciones auxiliares ──────────────────────────────────────────────────
  const generateAccessKey = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '').slice(2); // DDMMYYYY
    const docType = "01"; // 01 = Factura
    const ruc = "1792345678001";
    const env = "1"; // 1 = Pruebas, 2 = Producción
    const series = "001001";
    const sequential = String(invoices.length + 1).padStart(9, "0");
    const numeric = "12345678";
    const emissionType = "1";
    
    const partial = `${date}${docType}${ruc}${env}${series}${sequential}${numeric}${emissionType}`;
    
    // Algoritmo módulo 11 para verificador
    let sum = 0;
    let factor = 2;
    for (let i = partial.length - 1; i >= 0; i--) {
      sum += parseInt(partial[i]) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }
    const mod = sum % 11;
    const verifier = mod === 0 ? 0 : mod === 1 ? 1 : 11 - mod;
    
    return partial + verifier;
  };

  const generateInvoiceNumber = () => {
    const establishment = "001";
    const emissionPoint = "001";
    const sequential = String(invoices.length + 1).padStart(9, "0");
    return `${establishment}-${emissionPoint}-${sequential}`;
  };

  const calculateItemTotals = (item: typeof currentItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = item.discount;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const iva = (subtotalAfterDiscount * item.ivaRate) / 100;
    const total = subtotalAfterDiscount + iva;
    
    return {
      subtotal,
      iva,
      total: total
    };
  };

  const addItem = () => {
    if (!currentItem.code || !currentItem.description || currentItem.quantity <= 0 || currentItem.unitPrice <= 0) {
      toast.error("Complete todos los campos del producto");
      return;
    }

    const totals = calculateItemTotals(currentItem);
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      code: currentItem.code,
      description: currentItem.description,
      quantity: currentItem.quantity,
      unitPrice: currentItem.unitPrice,
      discount: currentItem.discount,
      ivaRate: currentItem.ivaRate,
      subtotal: currentItem.quantity * currentItem.unitPrice,
      iva: totals.iva,
      total: totals.total
    };

    setItems([...items, newItem]);
    setCurrentItem({ code: "", description: "", quantity: 1, unitPrice: 0, discount: 0, ivaRate: 15 });
    toast.success("Producto agregado");
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.success("Producto eliminado");
  };

  const calculateInvoiceTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const subtotalBeforeTax = subtotal - totalDiscount;
    const iva12 = items.filter(i => i.ivaRate === 12).reduce((sum, i) => sum + i.iva, 0);
    const iva15 = items.filter(i => i.ivaRate === 15).reduce((sum, i) => sum + i.iva, 0);
    const iva0 = items.filter(i => i.ivaRate === 0).reduce((sum, i) => sum + i.iva, 0);
    const total = items.reduce((sum, item) => sum + item.total, 0);

    return { subtotal, totalDiscount, subtotalBeforeTax, iva12, iva15, iva0, total };
  };

  // ── Handlers ───────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFormData({
      customerIdType: "RUC",
      customerId: "",
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      customerEmail: "",
      observations: ""
    });
    setItems([]);
    setCurrentItem({ code: "", description: "", quantity: 1, unitPrice: 0, discount: 0, ivaRate: 15 });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openViewModal = (invoice: ElectronicInvoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const openDeleteModal = (invoice: ElectronicInvoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  const handleCreate = () => {
    if (!formData.customerId || !formData.customerName || items.length === 0) {
      toast.error("Complete los datos del cliente y agregue al menos un producto");
      return;
    }

    const totals = calculateInvoiceTotals();
    const newInvoice: ElectronicInvoice = {
      id: Date.now().toString(),
      invoiceNumber: generateInvoiceNumber(),
      accessKey: generateAccessKey(),
      issueDate: new Date().toISOString().slice(0, 10),
      issuerRuc: "1792345678001",
      issuerName: "TicSoftEc S.A.",
      issuerAddress: "Av. Principal 123 y Secundaria, Quito",
      issuerPhone: "+593 2 245 6789",
      customerIdType: formData.customerIdType,
      customerId: formData.customerId,
      customerName: formData.customerName,
      customerAddress: formData.customerAddress,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail,
      items: [...items],
      ...totals,
      status: "Borrador",
      observations: formData.observations
    };

    setInvoices([...invoices, newInvoice]);
    setShowCreateModal(false);
    resetForm();
    toast.success("Factura electrónica creada como borrador");
  };

  const handleSendToSRI = async (invoice: ElectronicInvoice) => {
    if (invoice.status !== "Borrador" && invoice.status !== "Pendiente") {
      toast.error("Solo se pueden enviar facturas en estado Borrador o Pendiente");
      return;
    }

    toast.loading("Generando XML y firmando...", { id: "sri-send" });
    
    // Simular proceso de firma y envío al SRI
    setTimeout(() => {
      toast.loading("Enviando al SRI...", { id: "sri-send" });
      
      setTimeout(() => {
        // Actualizar estado de la factura
        setInvoices(invoices.map(inv => 
          inv.id === invoice.id 
            ? { 
                ...inv, 
                status: "Autorizado", 
                authorizationDate: new Date().toISOString().slice(0, 19).replace("T", " ")
              } 
            : inv
        ));
        
        toast.success("Factura autorizada por el SRI", { id: "sri-send" });
      }, 2000);
    }, 1500);
  };

  const handleDownloadXML = (invoice: ElectronicInvoice) => {
    toast.success(`Descargando XML de factura ${invoice.invoiceNumber}`);
  };

  const handleDownloadPDF = (invoice: ElectronicInvoice) => {
    toast.success(`Descargando PDF de factura ${invoice.invoiceNumber}`);
  };

  const handleSendEmail = (invoice: ElectronicInvoice) => {
    if (!invoice.customerEmail) {
      toast.error("El cliente no tiene email registrado");
      return;
    }
    toast.success(`Factura enviada a ${invoice.customerEmail}`);
  };

  const handleDelete = () => {
    if (selectedInvoice) {
      if (selectedInvoice.status === "Autorizado") {
        toast.error("No se puede eliminar una factura autorizada");
        return;
      }
      setInvoices(invoices.filter(i => i.id !== selectedInvoice.id));
      setShowDeleteModal(false);
      setSelectedInvoice(null);
      toast.success("Factura eliminada exitosamente");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      "Autorizado": "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
      "Pendiente": "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
      "Rechazado": "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
      "Borrador": "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
    };
    return styles[status as keyof typeof styles] || styles.Borrador;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Autorizado": return <CheckCircle className="w-4 h-4" />;
      case "Pendiente": return <Clock className="w-4 h-4" />;
      case "Rechazado": return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const totals = calculateInvoiceTotals();

  return (
    <div className="space-y-4">
      {/* ══ Botón Nuevo (alineado a la derecha) ═══════════════════════════════ */}
      <div className="flex justify-end">
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Nueva Factura Electrónica
        </button>
      </div>

      {/* ══ Fila de filtros ════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
          <input
            type="text"
            placeholder="Buscar por número, cliente, identificación o clave de acceso..."
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
            style={{ width: "180px" }}
          >
            <option value="all">Todos los estados</option>
            <option value="Borrador">Borrador</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Autorizado">Autorizado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>
        <button
          onClick={() => toast.success("Exportando facturas...")}
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
                <th className={`${thCls} ${isLight ? "text-gray-300" : ""}`}>Número</th>
                <th className={`${thCls} ${isLight ? "text-gray-300" : ""}`}>Fecha</th>
                <th className={`${thCls} ${isLight ? "text-gray-300" : ""}`}>Cliente</th>
                <th className={`${thCls} ${isLight ? "text-gray-300" : ""}`}>Identificación</th>
                <th className={`${thCls} text-right ${isLight ? "text-gray-300" : ""}`}>Subtotal</th>
                <th className={`${thCls} text-right ${isLight ? "text-gray-300" : ""}`}>IVA</th>
                <th className={`${thCls} text-right ${isLight ? "text-gray-300" : ""}`}>Total</th>
                <th className={`${thCls} text-center ${isLight ? "text-gray-300" : ""}`}>Estado</th>
                <th className={`${thCls} text-center ${isLight ? "text-gray-300" : ""}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${divB}`}>
              {filtered.length > 0 ? filtered.map(invoice => (
                <tr key={invoice.id} className={hoverRow}>
                  <td className={`px-4 py-3 text-sm font-mono font-medium ${txt}`}>
                    <div>{invoice.invoiceNumber}</div>
                    <div className={`text-xs ${sub} truncate max-w-[200px]`} title={invoice.accessKey}>
                      {invoice.accessKey}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${txt}`}>{invoice.issueDate}</td>
                  <td className={`px-4 py-3 text-sm ${txt}`}>
                    <div className="font-medium">{invoice.customerName}</div>
                    <div className={`text-xs ${sub}`}>{invoice.customerEmail || "Sin email"}</div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${txt}`}>
                    <div className="text-xs font-semibold text-primary">{invoice.customerIdType}</div>
                    <div>{invoice.customerId}</div>
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold text-right ${txt}`}>
                    ${invoice.subtotalBeforeTax.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold text-right ${txt}`}>
                    ${(invoice.iva12 + invoice.iva15 + invoice.iva0).toLocaleString("es-EC", { minimumFractionDigits: 2 })}
                  </td>
                  <td className={`px-4 py-3 text-sm font-bold text-right ${txt}`}>
                    ${invoice.total.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openViewModal(invoice)}
                        className={`transition-colors ${isLight ? "text-gray-400 hover:text-blue-600" : "text-gray-500 hover:text-blue-400"}`}
                        title="Ver"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(invoice.status === "Borrador" || invoice.status === "Pendiente") && (
                        <button
                          onClick={() => handleSendToSRI(invoice)}
                          className={`transition-colors ${isLight ? "text-gray-400 hover:text-green-600" : "text-gray-500 hover:text-green-400"}`}
                          title="Enviar al SRI"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {invoice.status === "Autorizado" && (
                        <>
                          <button
                            onClick={() => handleDownloadXML(invoice)}
                            className={`transition-colors ${isLight ? "text-gray-400 hover:text-purple-600" : "text-gray-500 hover:text-purple-400"}`}
                            title="Descargar XML"
                          >
                            <FileCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSendEmail(invoice)}
                            className={`transition-colors ${isLight ? "text-gray-400 hover:text-blue-600" : "text-gray-500 hover:text-blue-400"}`}
                            title="Enviar por email"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openDeleteModal(invoice)}
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
                    <Receipt className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm font-medium ${txt}`}>No se encontraron facturas</p>
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
          <div className={`w-full max-w-5xl ${modal} max-h-[90vh] overflow-y-auto`}>
            <div className={`sticky top-0 z-10 border-b ${divB} px-6 py-4 flex items-center justify-between ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
              <div>
                <h3 className={`font-bold text-lg ${txt}`}>Nueva Factura Electrónica</h3>
                <p className={`text-xs ${sub} mt-0.5`}>Complete los datos para generar la factura</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Datos del Cliente */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-primary" />
                  <h4 className={`font-semibold text-sm ${txt}`}>Datos del Cliente</h4>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Tipo de ID <span className="text-red-500">*</span></label>
                    <select value={formData.customerIdType} onChange={e => setFormData({...formData, customerIdType: e.target.value as any})} className={IN}>
                      <option value="RUC">RUC</option>
                      <option value="Cédula">Cédula</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Número de Identificación <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} className={IN} placeholder="Ej: 1792345678001" />
                  </div>
                  <div className="col-span-3">
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Razón Social / Nombre <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className={IN} placeholder="Ej: Corporación ABC S.A." />
                  </div>
                  <div className="col-span-2">
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Dirección</label>
                    <input type="text" value={formData.customerAddress} onChange={e => setFormData({...formData, customerAddress: e.target.value})} className={IN} placeholder="Ej: Av. Principal 123" />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Teléfono</label>
                    <input type="tel" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className={IN} placeholder="Ej: +593 2 123 4567" />
                  </div>
                  <div className="col-span-2">
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Email</label>
                    <input type="email" value={formData.customerEmail} onChange={e => setFormData({...formData, customerEmail: e.target.value})} className={IN} placeholder="Ej: cliente@email.com" />
                  </div>
                </div>
              </div>

              {/* Agregar Productos */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-primary" />
                  <h4 className={`font-semibold text-sm ${txt}`}>Agregar Producto / Servicio</h4>
                </div>
                <div className="grid grid-cols-6 gap-3">
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Código</label>
                    <input type="text" value={currentItem.code} onChange={e => setCurrentItem({...currentItem, code: e.target.value})} className={IN} placeholder="PROD-001" />
                  </div>
                  <div className="col-span-2">
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Descripción</label>
                    <input type="text" value={currentItem.description} onChange={e => setCurrentItem({...currentItem, description: e.target.value})} className={IN} placeholder="Descripción del producto" />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Cantidad</label>
                    <input type="number" value={currentItem.quantity} onChange={e => setCurrentItem({...currentItem, quantity: parseFloat(e.target.value) || 0})} className={IN} min="1" />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Precio Unit.</label>
                    <input type="number" value={currentItem.unitPrice} onChange={e => setCurrentItem({...currentItem, unitPrice: parseFloat(e.target.value) || 0})} className={IN} step="0.01" />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Descuento</label>
                    <input type="number" value={currentItem.discount} onChange={e => setCurrentItem({...currentItem, discount: parseFloat(e.target.value) || 0})} className={IN} step="0.01" />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>IVA %</label>
                    <select value={currentItem.ivaRate} onChange={e => setCurrentItem({...currentItem, ivaRate: parseInt(e.target.value)})} className={IN}>
                      <option value={0}>0%</option>
                      <option value={12}>12%</option>
                      <option value={15}>15%</option>
                    </select>
                  </div>
                  <div className="col-span-6">
                    <button onClick={addItem} className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>
                      <Plus className="w-4 h-4" /> Agregar Producto
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de Productos */}
              {items.length > 0 && (
                <div>
                  <h4 className={`font-semibold text-sm ${txt} mb-3`}>Productos Agregados ({items.length})</h4>
                  <div className={`border rounded-lg overflow-hidden ${divB}`}>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className={`border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                          <th className={`px-3 py-2 text-left text-xs font-semibold ${sub}`}>Código</th>
                          <th className={`px-3 py-2 text-left text-xs font-semibold ${sub}`}>Descripción</th>
                          <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>Cant.</th>
                          <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>P. Unit.</th>
                          <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>Desc.</th>
                          <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>IVA</th>
                          <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>Total</th>
                          <th className={`px-3 py-2 text-center text-xs font-semibold ${sub}`}>Acción</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${divB}`}>
                        {items.map(item => (
                          <tr key={item.id}>
                            <td className={`px-3 py-2 ${txt}`}>{item.code}</td>
                            <td className={`px-3 py-2 ${txt}`}>{item.description}</td>
                            <td className={`px-3 py-2 text-right ${txt}`}>{item.quantity}</td>
                            <td className={`px-3 py-2 text-right ${txt}`}>${item.unitPrice.toFixed(2)}</td>
                            <td className={`px-3 py-2 text-right ${txt}`}>${item.discount.toFixed(2)}</td>
                            <td className={`px-3 py-2 text-right ${txt}`}>{item.ivaRate}%</td>
                            <td className={`px-3 py-2 text-right font-semibold ${txt}`}>${item.total.toFixed(2)}</td>
                            <td className="px-3 py-2 text-center">
                              <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totales */}
                  <div className={`mt-4 p-4 rounded-lg ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                    <div className="grid grid-cols-2 gap-3 max-w-md ml-auto">
                      <div className="flex justify-between">
                        <span className={`text-sm ${sub}`}>Subtotal:</span>
                        <span className={`text-sm font-semibold ${txt}`}>${totals.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${sub}`}>Descuento:</span>
                        <span className={`text-sm font-semibold text-red-600`}>-${totals.totalDiscount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${sub}`}>Subtotal antes IVA:</span>
                        <span className={`text-sm font-semibold ${txt}`}>${totals.subtotalBeforeTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${sub}`}>IVA 15%:</span>
                        <span className={`text-sm font-semibold ${txt}`}>${totals.iva15.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${sub}`}>IVA 12%:</span>
                        <span className={`text-sm font-semibold ${txt}`}>${totals.iva12.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${sub}`}>IVA 0%:</span>
                        <span className={`text-sm font-semibold ${txt}`}>${totals.iva0.toFixed(2)}</span>
                      </div>
                      <div className={`col-span-2 pt-3 border-t flex justify-between ${divB}`}>
                        <span className={`text-base font-bold ${txt}`}>TOTAL:</span>
                        <span className={`text-base font-bold text-primary`}>${totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Observaciones */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Observaciones</label>
                <textarea value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} className={IN} rows={3} placeholder="Notas adicionales..."></textarea>
              </div>
            </div>

            <div className={`border-t ${divB} px-6 py-4 flex justify-end gap-3`}>
              <button onClick={() => setShowCreateModal(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>Cancelar</button>
              <button onClick={handleCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                <Save className="w-4 h-4" /> Crear Factura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal Ver ══════════════════════════════════════════════════════════ */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-4xl ${modal} max-h-[90vh] overflow-y-auto`}>
            <div className={`border-b ${divB} px-6 py-4 flex items-center justify-between`}>
              <div>
                <h3 className={`font-bold text-lg ${txt}`}>Factura Electrónica</h3>
                <p className={`text-sm font-mono ${sub} mt-0.5`}>{selectedInvoice.invoiceNumber}</p>
              </div>
              <button onClick={() => { setShowViewModal(false); setSelectedInvoice(null); }} className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Estado y Clave de Acceso */}
              <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusBadge(selectedInvoice.status)}`}>
                    {getStatusIcon(selectedInvoice.status)}
                    {selectedInvoice.status}
                  </span>
                  {selectedInvoice.authorizationDate && (
                    <span className={`text-xs ${sub}`}>Autorizado: {selectedInvoice.authorizationDate}</span>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-medium ${sub} mb-1`}>Clave de Acceso:</p>
                  <p className={`text-sm font-mono ${txt} break-all`}>{selectedInvoice.accessKey}</p>
                </div>
              </div>

              {/* Emisor y Receptor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-xs font-semibold ${sub} mb-2`}>EMISOR</p>
                  <div className="space-y-1">
                    <p className={`text-sm font-bold ${txt}`}>{selectedInvoice.issuerName}</p>
                    <p className={`text-xs ${txt}`}>RUC: {selectedInvoice.issuerRuc}</p>
                    <p className={`text-xs ${sub}`}>{selectedInvoice.issuerAddress}</p>
                    <p className={`text-xs ${sub}`}>{selectedInvoice.issuerPhone}</p>
                  </div>
                </div>
                <div>
                  <p className={`text-xs font-semibold ${sub} mb-2`}>RECEPTOR</p>
                  <div className="space-y-1">
                    <p className={`text-sm font-bold ${txt}`}>{selectedInvoice.customerName}</p>
                    <p className={`text-xs ${txt}`}>{selectedInvoice.customerIdType}: {selectedInvoice.customerId}</p>
                    <p className={`text-xs ${sub}`}>{selectedInvoice.customerAddress || "—"}</p>
                    <p className={`text-xs ${sub}`}>{selectedInvoice.customerEmail || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Detalle de Productos */}
              <div>
                <p className={`text-xs font-semibold ${sub} mb-2`}>DETALLE</p>
                <div className={`border rounded-lg overflow-hidden ${divB}`}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                        <th className={`px-3 py-2 text-left text-xs font-semibold ${sub}`}>Descripción</th>
                        <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>Cant.</th>
                        <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>P. Unit.</th>
                        <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>Desc.</th>
                        <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>IVA</th>
                        <th className={`px-3 py-2 text-right text-xs font-semibold ${sub}`}>Total</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${divB}`}>
                      {selectedInvoice.items.map(item => (
                        <tr key={item.id}>
                          <td className={`px-3 py-2 ${txt}`}>
                            <div className="font-medium">{item.description}</div>
                            <div className={`text-xs ${sub}`}>Código: {item.code}</div>
                          </td>
                          <td className={`px-3 py-2 text-right ${txt}`}>{item.quantity}</td>
                          <td className={`px-3 py-2 text-right ${txt}`}>${item.unitPrice.toFixed(2)}</td>
                          <td className={`px-3 py-2 text-right ${txt}`}>${item.discount.toFixed(2)}</td>
                          <td className={`px-3 py-2 text-right ${txt}`}>{item.ivaRate}%</td>
                          <td className={`px-3 py-2 text-right font-semibold ${txt}`}>${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                <div className="grid grid-cols-2 gap-2 max-w-md ml-auto text-sm">
                  <span className={sub}>Subtotal:</span>
                  <span className={`text-right font-semibold ${txt}`}>${selectedInvoice.subtotal.toFixed(2)}</span>
                  
                  <span className={sub}>Descuento:</span>
                  <span className="text-right font-semibold text-red-600">-${selectedInvoice.totalDiscount.toFixed(2)}</span>
                  
                  <span className={sub}>Subtotal antes IVA:</span>
                  <span className={`text-right font-semibold ${txt}`}>${selectedInvoice.subtotalBeforeTax.toFixed(2)}</span>
                  
                  <span className={sub}>IVA 15%:</span>
                  <span className={`text-right font-semibold ${txt}`}>${selectedInvoice.iva15.toFixed(2)}</span>
                  
                  <span className={sub}>IVA 12%:</span>
                  <span className={`text-right font-semibold ${txt}`}>${selectedInvoice.iva12.toFixed(2)}</span>
                  
                  <span className={sub}>IVA 0%:</span>
                  <span className={`text-right font-semibold ${txt}`}>${selectedInvoice.iva0.toFixed(2)}</span>
                  
                  <div className={`col-span-2 pt-2 border-t flex justify-between ${divB}`}>
                    <span className={`font-bold ${txt}`}>TOTAL:</span>
                    <span className="font-bold text-primary text-lg">${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.observations && (
                <div>
                  <p className={`text-xs font-semibold ${sub} mb-1`}>OBSERVACIONES</p>
                  <p className={`text-sm ${txt}`}>{selectedInvoice.observations}</p>
                </div>
              )}
            </div>

            <div className={`border-t ${divB} px-6 py-4 flex justify-between items-center`}>
              <div className="flex gap-2">
                {selectedInvoice.status === "Autorizado" && (
                  <>
                    <button onClick={() => handleDownloadXML(selectedInvoice)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>
                      <FileCheck className="w-4 h-4" /> XML
                    </button>
                    <button onClick={() => handleDownloadPDF(selectedInvoice)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>
                      <Download className="w-4 h-4" /> PDF
                    </button>
                    <button onClick={() => handleSendEmail(selectedInvoice)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>
                      <Mail className="w-4 h-4" /> Email
                    </button>
                  </>
                )}
              </div>
              <button onClick={() => { setShowViewModal(false); setSelectedInvoice(null); }} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal Eliminar ═════════════════════════════════════════════════════ */}
      {showDeleteModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md ${modal}`}>
            <div className={`border-b ${divB} px-6 py-4`}>
              <h3 className={`font-bold text-lg ${txt}`}>Eliminar Factura</h3>
            </div>
            <div className="p-6">
              <p className={`text-sm ${txt} mb-4`}>
                ¿Estás seguro de que deseas eliminar la factura <strong>{selectedInvoice.invoiceNumber}</strong>?
              </p>
              {selectedInvoice.status === "Autorizado" && (
                <div className={`p-3 rounded-lg mb-4 ${isLight ? "bg-red-50 border border-red-200" : "bg-red-500/10 border border-red-500/20"}`}>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    ⚠️ Esta factura está autorizada por el SRI y no se puede eliminar. Debe anularse mediante nota de crédito.
                  </p>
                </div>
              )}
              <p className={`text-xs ${sub}`}>Esta acción no se puede deshacer.</p>
            </div>
            <div className={`border-t ${divB} px-6 py-4 flex justify-end gap-3`}>
              <button onClick={() => { setShowDeleteModal(false); setSelectedInvoice(null); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>Cancelar</button>
              <button 
                onClick={handleDelete} 
                disabled={selectedInvoice.status === "Autorizado"}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
