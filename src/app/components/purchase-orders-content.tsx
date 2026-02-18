import { useState } from "react";
import { ShoppingCart, Plus, Pencil, Trash2, Search, Eye, CheckCircle, Clock, XCircle, FileText, Package, DollarSign, Calendar, Truck, X, Check, Filter, Download } from "lucide-react";

interface OrderItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  tax: string;
  discount: string;
  subtotal: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  deliveryDate: string;
  status: "draft" | "pending" | "approved" | "received" | "cancelled";
  items: OrderItem[];
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  total: string;
  notes: string;
  createdBy: string;
  approvedBy?: string;
  approvedDate?: string;
  receivedDate?: string;
}

const SUPPLIERS = [
  { id: "sup-001", name: "Distribuidora La Favorita C.A.", ruc: "1790016919001" },
  { id: "sup-002", name: "Tecnología Avanzada S.A.", ruc: "1792345678001" },
  { id: "sup-003", name: "Papelería Corporativa Ltda.", ruc: "1798765432001" },
  { id: "sup-004", name: "Industrial Supplies Corp.", ruc: "US-987654321" },
  { id: "sup-005", name: "Construcciones Andinas S.A.", ruc: "1790123456001" },
];

const PRODUCTS = [
  { code: "PROD-001", name: "Laptop Dell Latitude 5420", price: "850.00", tax: "12" },
  { code: "PROD-002", name: "Monitor LG 27 pulgadas", price: "320.00", tax: "12" },
  { code: "PROD-003", name: "Teclado mecánico Logitech", price: "89.99", tax: "12" },
  { code: "PROD-004", name: "Mouse inalámbrico", price: "25.50", tax: "12" },
  { code: "PROD-005", name: "Resma papel bond A4", price: "4.50", tax: "0" },
  { code: "PROD-006", name: "Marcadores permanentes x12", price: "8.75", tax: "12" },
  { code: "PROD-007", name: "Archivador de palanca", price: "2.30", tax: "12" },
  { code: "PROD-008", name: "Silla ergonómica oficina", price: "185.00", tax: "12" },
];

const ORDER_STATUSES = [
  { id: "all", name: "Todos los estados", color: "" },
  { id: "draft", name: "Borrador", color: "bg-gray-500/10 border-gray-500/20 text-gray-400" },
  { id: "pending", name: "Pendiente", color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
  { id: "approved", name: "Aprobada", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  { id: "received", name: "Recibida", color: "bg-green-500/10 border-green-500/20 text-green-400" },
  { id: "cancelled", name: "Cancelada", color: "bg-red-500/10 border-red-500/20 text-red-400" },
];

export function PurchaseOrdersContent() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSupplier, setFilterSupplier] = useState<string>("all");

  const [orders, setOrders] = useState<PurchaseOrder[]>([
    {
      id: "po-001",
      orderNumber: "COMP-001001",
      supplierId: "sup-002",
      supplierName: "Tecnología Avanzada S.A.",
      date: "2026-02-15",
      deliveryDate: "2026-02-25",
      status: "approved",
      items: [
        {
          id: "item-1",
          productCode: "PROD-001",
          productName: "Laptop Dell Latitude 5420",
          quantity: 5,
          unitPrice: "850.00",
          tax: "12",
          discount: "0",
          subtotal: "4250.00",
        },
        {
          id: "item-2",
          productCode: "PROD-002",
          productName: "Monitor LG 27 pulgadas",
          quantity: 10,
          unitPrice: "320.00",
          tax: "12",
          discount: "5",
          subtotal: "3040.00",
        },
      ],
      subtotal: "7290.00",
      taxAmount: "874.80",
      discountAmount: "160.00",
      total: "8004.80",
      notes: "Urgente para nuevo proyecto",
      createdBy: "Juan Pérez",
      approvedBy: "María González",
      approvedDate: "2026-02-16",
    },
    {
      id: "po-002",
      orderNumber: "COMP-001002",
      supplierId: "sup-003",
      supplierName: "Papelería Corporativa Ltda.",
      date: "2026-02-16",
      deliveryDate: "2026-02-20",
      status: "received",
      items: [
        {
          id: "item-3",
          productCode: "PROD-005",
          productName: "Resma papel bond A4",
          quantity: 50,
          unitPrice: "4.50",
          tax: "0",
          discount: "0",
          subtotal: "225.00",
        },
        {
          id: "item-4",
          productCode: "PROD-006",
          productName: "Marcadores permanentes x12",
          quantity: 20,
          unitPrice: "8.75",
          tax: "12",
          discount: "0",
          subtotal: "175.00",
        },
      ],
      subtotal: "400.00",
      taxAmount: "21.00",
      discountAmount: "0",
      total: "421.00",
      notes: "Material de oficina mensual",
      createdBy: "Carlos Méndez",
      approvedBy: "María González",
      approvedDate: "2026-02-16",
      receivedDate: "2026-02-18",
    },
    {
      id: "po-003",
      orderNumber: "COMP-001003",
      supplierId: "sup-001",
      supplierName: "Distribuidora La Favorita C.A.",
      date: "2026-02-17",
      deliveryDate: "2026-02-22",
      status: "pending",
      items: [
        {
          id: "item-5",
          productCode: "PROD-008",
          productName: "Silla ergonómica oficina",
          quantity: 15,
          unitPrice: "185.00",
          tax: "12",
          discount: "10",
          subtotal: "2497.50",
        },
      ],
      subtotal: "2497.50",
      taxAmount: "299.70",
      discountAmount: "277.50",
      total: "2519.70",
      notes: "Para ampliación de oficinas",
      createdBy: "Ana López",
    },
    {
      id: "po-004",
      orderNumber: "COMP-001004",
      supplierId: "sup-002",
      supplierName: "Tecnología Avanzada S.A.",
      date: "2026-02-18",
      deliveryDate: "2026-03-01",
      status: "draft",
      items: [
        {
          id: "item-6",
          productCode: "PROD-003",
          productName: "Teclado mecánico Logitech",
          quantity: 8,
          unitPrice: "89.99",
          tax: "12",
          discount: "0",
          subtotal: "719.92",
        },
        {
          id: "item-7",
          productCode: "PROD-004",
          productName: "Mouse inalámbrico",
          quantity: 8,
          unitPrice: "25.50",
          tax: "12",
          discount: "0",
          subtotal: "204.00",
        },
      ],
      subtotal: "923.92",
      taxAmount: "110.87",
      discountAmount: "0",
      total: "1034.79",
      notes: "Equipamiento para nuevos empleados",
      createdBy: "Pedro Morales",
    },
    {
      id: "po-005",
      orderNumber: "COMP-001005",
      supplierId: "sup-004",
      supplierName: "Industrial Supplies Corp.",
      date: "2026-02-10",
      deliveryDate: "2026-02-15",
      status: "cancelled",
      items: [
        {
          id: "item-8",
          productCode: "PROD-001",
          productName: "Laptop Dell Latitude 5420",
          quantity: 3,
          unitPrice: "850.00",
          tax: "12",
          discount: "0",
          subtotal: "2550.00",
        },
      ],
      subtotal: "2550.00",
      taxAmount: "306.00",
      discountAmount: "0",
      total: "2856.00",
      notes: "Cancelado por retraso del proveedor",
      createdBy: "Laura Jiménez",
    },
  ]);

  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    orderNumber: "",
    supplierId: "",
    supplierName: "",
    date: new Date().toISOString().split("T")[0],
    deliveryDate: "",
    status: "draft",
    items: [],
    subtotal: "0",
    taxAmount: "0",
    discountAmount: "0",
    total: "0",
    notes: "",
    createdBy: "Usuario Actual",
  });

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSupplier = filterSupplier === "all" || order.supplierId === filterSupplier;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  const calculateTotals = (items: OrderItem[]) => {
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    items.forEach((item) => {
      const itemSubtotal = parseFloat(item.subtotal);
      const itemDiscount = (itemSubtotal * parseFloat(item.discount)) / 100;
      const itemTaxableAmount = itemSubtotal - itemDiscount;
      const itemTax = (itemTaxableAmount * parseFloat(item.tax)) / 100;

      subtotal += itemSubtotal;
      discountAmount += itemDiscount;
      taxAmount += itemTax;
    });

    const total = subtotal - discountAmount + taxAmount;

    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const addItem = () => {
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      productCode: "",
      productName: "",
      quantity: 1,
      unitPrice: "0",
      tax: "12",
      discount: "0",
      subtotal: "0",
    };

    const updatedItems = [...(formData.items || []), newItem];
    const totals = calculateTotals(updatedItems);

    setFormData({
      ...formData,
      items: updatedItems,
      ...totals,
    });
  };

  const removeItem = (itemId: string) => {
    const updatedItems = (formData.items || []).filter((item) => item.id !== itemId);
    const totals = calculateTotals(updatedItems);

    setFormData({
      ...formData,
      items: updatedItems,
      ...totals,
    });
  };

  const updateItem = (itemId: string, field: keyof OrderItem, value: any) => {
    const updatedItems = (formData.items || []).map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };

        // Si cambia el producto, actualizar precio y nombre
        if (field === "productCode") {
          const product = PRODUCTS.find((p) => p.code === value);
          if (product) {
            updatedItem.productName = product.name;
            updatedItem.unitPrice = product.price;
            updatedItem.tax = product.tax;
          }
        }

        // Recalcular subtotal
        if (field === "quantity" || field === "unitPrice") {
          const qty = field === "quantity" ? parseFloat(value) : parseFloat(updatedItem.quantity.toString());
          const price = field === "unitPrice" ? parseFloat(value) : parseFloat(updatedItem.unitPrice);
          updatedItem.subtotal = (qty * price).toFixed(2);
        }

        return updatedItem;
      }
      return item;
    });

    const totals = calculateTotals(updatedItems);

    setFormData({
      ...formData,
      items: updatedItems,
      ...totals,
    });
  };

  const handleOpenModal = (order?: PurchaseOrder) => {
    if (order) {
      setEditingOrder(order);
      setFormData(order);
    } else {
      setEditingOrder(null);
      const nextNumber = `COMP-${String(orders.length + 1001).padStart(6, "0")}`;
      setFormData({
        orderNumber: nextNumber,
        supplierId: "",
        supplierName: "",
        date: new Date().toISOString().split("T")[0],
        deliveryDate: "",
        status: "draft",
        items: [],
        subtotal: "0",
        taxAmount: "0",
        discountAmount: "0",
        total: "0",
        notes: "",
        createdBy: "Usuario Actual",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOrder(null);
  };

  const handleSave = () => {
    if (!formData.supplierId || !formData.items || formData.items.length === 0) {
      alert("Por favor selecciona un proveedor y agrega al menos un producto");
      return;
    }

    // Validar que todos los productos tengan código
    const hasEmptyProducts = formData.items.some((item) => !item.productCode);
    if (hasEmptyProducts) {
      alert("Por favor completa todos los productos");
      return;
    }

    if (editingOrder) {
      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id ? { ...order, ...formData } : order
        )
      );
    } else {
      const newOrder: PurchaseOrder = {
        id: `po-${Date.now()}`,
        ...formData as PurchaseOrder,
      };
      setOrders([...orders, newOrder]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta orden de compra?")) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const handleViewOrder = (order: PurchaseOrder) => {
    setViewingOrder(order);
    setShowViewModal(true);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(
      orders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus as any };
          
          if (newStatus === "approved") {
            updatedOrder.approvedBy = "Usuario Actual";
            updatedOrder.approvedDate = new Date().toISOString().split("T")[0];
          }
          
          if (newStatus === "received") {
            updatedOrder.receivedDate = new Date().toISOString().split("T")[0];
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "approved":
        return <CheckCircle className="w-5 h-5" />;
      case "received":
        return <Package className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUSES.find((s) => s.id === status);
    return statusObj?.color || "bg-gray-500/10 border-gray-500/20 text-gray-400";
  };

  const getStatusName = (status: string) => {
    const statusObj = ORDER_STATUSES.find((s) => s.id === status);
    return statusObj?.name || status;
  };

  // Estadísticas
  const totalOrders = orders.length;
  const draftOrders = orders.filter((o) => o.status === "draft").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const approvedOrders = orders.filter((o) => o.status === "approved").length;
  const receivedOrders = orders.filter((o) => o.status === "received").length;
  const totalAmount = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseFloat(o.total), 0);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header estándar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Órdenes de Compra
          </h2>
          <p className="text-gray-400 text-sm">
            Gestión de órdenes de compra y seguimiento
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Orden
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Total Órdenes</p>
          <p className="text-white font-bold text-2xl">{totalOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-gray-500/20 to-gray-500/5 border border-gray-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Borradores</p>
          <p className="text-gray-400 font-bold text-2xl">{draftOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Pendientes</p>
          <p className="text-yellow-400 font-bold text-2xl">{pendingOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Aprobadas</p>
          <p className="text-blue-400 font-bold text-2xl">{approvedOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Recibidas</p>
          <p className="text-green-400 font-bold text-2xl">{receivedOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">Total Monto</p>
          <p className="text-primary font-bold text-xl">${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-white font-medium mb-3 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Buscar orden
          </label>
          <input
            type="text"
            placeholder="Número de orden, proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-white font-medium mb-3 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Estado
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-white font-medium mb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Proveedor
          </label>
          <select
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todos los proveedores</option>
            {SUPPLIERS.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No se encontraron órdenes de compra</p>
            <p className="text-gray-500 text-sm">
              Intenta ajustar los filtros o crea una nueva orden
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all"
            >
              {/* Header de la orden */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-xl font-mono">
                      {order.orderNumber}
                    </h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {getStatusName(order.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4" />
                      <span>{order.supplierName}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Fecha: {new Date(order.date).toLocaleDateString("es-EC")}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Entrega: {new Date(order.deliveryDate).toLocaleDateString("es-EC")}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    <span className="text-gray-500">Creado por:</span>{" "}
                    <span className="text-white">{order.createdBy}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Total</p>
                  <p className="text-white font-bold text-3xl">
                    ${parseFloat(order.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Resumen de items */}
              <div className="bg-[#0f1825]/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Productos ({order.items.length})
                  </h4>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0"
                    >
                      <div className="flex-1">
                        <span className="text-white font-medium">{item.productName}</span>
                        <span className="text-gray-500 ml-2">({item.productCode})</span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-400">
                        <span>Cant: <span className="text-white font-medium">{item.quantity}</span></span>
                        <span>×</span>
                        <span>${parseFloat(item.unitPrice).toFixed(2)}</span>
                        <span>=</span>
                        <span className="text-white font-bold min-w-[80px] text-right">
                          ${parseFloat(item.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales y aprobaciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Desglose financiero */}
                <div className="bg-[#0f1825]/50 rounded-xl p-4">
                  <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase">Desglose</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white font-medium">
                        ${parseFloat(order.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {parseFloat(order.discountAmount) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Descuento:</span>
                        <span className="text-red-400 font-medium">
                          -${parseFloat(order.discountAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Impuestos:</span>
                      <span className="text-white font-medium">
                        ${parseFloat(order.taxAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="text-white font-bold">Total:</span>
                      <span className="text-primary font-bold text-lg">
                        ${parseFloat(order.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estado y aprobaciones */}
                <div className="bg-[#0f1825]/50 rounded-xl p-4">
                  <h4 className="text-gray-400 text-xs font-medium mb-3 uppercase">Estado</h4>
                  <div className="space-y-2 text-sm">
                    {order.approvedBy && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Aprobado por:</span>
                          <span className="text-white font-medium">{order.approvedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fecha aprobación:</span>
                          <span className="text-white">
                            {order.approvedDate && new Date(order.approvedDate).toLocaleDateString("es-EC")}
                          </span>
                        </div>
                      </>
                    )}
                    {order.receivedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fecha recepción:</span>
                        <span className="text-white">
                          {new Date(order.receivedDate).toLocaleDateString("es-EC")}
                        </span>
                      </div>
                    )}
                    {!order.approvedBy && !order.receivedDate && (
                      <p className="text-gray-500 text-xs italic">
                        Pendiente de procesamiento
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleViewOrder(order)}
                  className="flex-1 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalle
                </button>

                {order.status === "draft" && (
                  <button
                    onClick={() => handleStatusChange(order.id, "pending")}
                    className="flex-1 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    Enviar a Aprobación
                  </button>
                )}

                {order.status === "pending" && (
                  <button
                    onClick={() => handleStatusChange(order.id, "approved")}
                    className="flex-1 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aprobar
                  </button>
                )}

                {order.status === "approved" && (
                  <button
                    onClick={() => handleStatusChange(order.id, "received")}
                    className="flex-1 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Package className="w-4 h-4" />
                    Marcar Recibida
                  </button>
                )}

                {(order.status === "draft" || order.status === "pending") && (
                  <button
                    onClick={() => handleOpenModal(order)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                )}

                {order.status !== "received" && (
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-white font-bold text-xl">
                {editingOrder ? "Editar Orden de Compra" : "Nueva Orden de Compra"}
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
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Número de Orden
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber || ""}
                    disabled
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-gray-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Fecha <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate || ""}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Proveedor */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Proveedor <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.supplierId || ""}
                  onChange={(e) => {
                    const supplier = SUPPLIERS.find((s) => s.id === e.target.value);
                    setFormData({
                      ...formData,
                      supplierId: e.target.value,
                      supplierName: supplier?.name || "",
                    });
                  }}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="">Seleccionar proveedor</option>
                  {SUPPLIERS.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.ruc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Productos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-bold text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Productos
                  </h4>
                  <button
                    onClick={addItem}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Producto
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.items || []).map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-[#0f1825]/50 border border-white/10 rounded-xl p-4"
                    >
                      <div className="grid grid-cols-12 gap-3">
                        {/* Producto */}
                        <div className="col-span-12 md:col-span-4">
                          <label className="block text-gray-400 text-xs mb-1">Producto</label>
                          <select
                            value={item.productCode}
                            onChange={(e) => updateItem(item.id, "productCode", e.target.value)}
                            className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                          >
                            <option value="">Seleccionar</option>
                            {PRODUCTS.map((product) => (
                              <option key={product.code} value={product.code}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Cantidad */}
                        <div className="col-span-4 md:col-span-2">
                          <label className="block text-gray-400 text-xs mb-1">Cant.</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                            className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                          />
                        </div>

                        {/* Precio */}
                        <div className="col-span-4 md:col-span-2">
                          <label className="block text-gray-400 text-xs mb-1">Precio</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                            className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                          />
                        </div>

                        {/* Desc. % */}
                        <div className="col-span-4 md:col-span-1">
                          <label className="block text-gray-400 text-xs mb-1">Desc%</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={item.discount}
                            onChange={(e) => updateItem(item.id, "discount", e.target.value)}
                            className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50"
                          />
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-8 md:col-span-2">
                          <label className="block text-gray-400 text-xs mb-1">Subtotal</label>
                          <input
                            type="text"
                            value={`$${parseFloat(item.subtotal).toFixed(2)}`}
                            disabled
                            className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm font-bold"
                          />
                        </div>

                        {/* Eliminar */}
                        <div className="col-span-4 md:col-span-1 flex items-end">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!formData.items || formData.items.length === 0) && (
                    <div className="bg-[#0f1825]/30 border border-dashed border-white/10 rounded-xl p-8 text-center">
                      <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        No hay productos agregados. Haz clic en "Agregar Producto" para comenzar.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Totales */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Resumen Financiero
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Subtotal</p>
                    <p className="text-white font-bold text-xl">
                      ${parseFloat(formData.subtotal || "0").toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Descuento</p>
                    <p className="text-red-400 font-bold text-xl">
                      -${parseFloat(formData.discountAmount || "0").toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Impuestos</p>
                    <p className="text-white font-bold text-xl">
                      ${parseFloat(formData.taxAmount || "0").toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total</p>
                    <p className="text-primary font-bold text-2xl">
                      ${parseFloat(formData.total || "0").toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
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
                {editingOrder ? "Guardar Cambios" : "Crear Orden"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de vista detallada */}
      {showViewModal && viewingOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-white font-bold text-xl font-mono">
                  {viewingOrder.orderNumber}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Orden de Compra - {getStatusName(viewingOrder.status)}
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
              {/* Info general */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-5">
                  <h4 className="text-gray-400 text-xs font-medium mb-4 uppercase flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Información del Proveedor
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Proveedor</p>
                      <p className="text-white font-medium">{viewingOrder.supplierName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-5">
                  <h4 className="text-gray-400 text-xs font-medium mb-4 uppercase flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fechas
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha de orden:</span>
                      <span className="text-white font-medium">
                        {new Date(viewingOrder.date).toLocaleDateString("es-EC")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fecha de entrega:</span>
                      <span className="text-white font-medium">
                        {new Date(viewingOrder.deliveryDate).toLocaleDateString("es-EC")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Productos ({viewingOrder.items.length})
                </h4>
                <div className="bg-white/5 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Producto</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">Cant.</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Precio</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Desc%</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {viewingOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <p className="text-white font-medium text-sm">{item.productName}</p>
                            <p className="text-gray-500 text-xs">{item.productCode}</p>
                          </td>
                          <td className="px-4 py-3 text-center text-white font-medium">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-white">
                            ${parseFloat(item.unitPrice).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-400">{item.discount}%</td>
                          <td className="px-4 py-3 text-right text-white font-bold">
                            ${parseFloat(item.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumen financiero */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-white font-medium">
                        ${parseFloat(viewingOrder.subtotal).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    {parseFloat(viewingOrder.discountAmount) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Descuento:</span>
                        <span className="text-red-400 font-medium">
                          -${parseFloat(viewingOrder.discountAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Impuestos:</span>
                      <span className="text-white font-medium">
                        ${parseFloat(viewingOrder.taxAmount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-end">
                    <div className="text-right">
                      <p className="text-gray-400 text-sm mb-1">Total de la Orden</p>
                      <p className="text-primary font-bold text-4xl">
                        ${parseFloat(viewingOrder.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {viewingOrder.notes && (
                <div className="bg-white/5 rounded-xl p-5">
                  <h4 className="text-gray-400 text-xs font-medium mb-2 uppercase">Notas</h4>
                  <p className="text-white text-sm">{viewingOrder.notes}</p>
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
              <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
