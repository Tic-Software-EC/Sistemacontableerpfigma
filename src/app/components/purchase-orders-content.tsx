import { useState } from "react";
import { ShoppingCart, Plus, Pencil, Trash2, Search, Eye, CheckCircle, Clock, XCircle, FileText, Package, DollarSign, Calendar, Truck, X, Check, Filter, Download, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, PackageCheck, AlertCircle, Warehouse } from "lucide-react";

interface OrderItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  tax: string;
  discount: string;
  subtotal: string;
  receivedQuantity?: number; // Cantidad ya recibida
}

interface ReceivingItem {
  productCode: string;
  productName: string;
  orderedQuantity: number;
  previouslyReceived: number;
  receivingNow: number;
  warehouse: string;
}

interface Reception {
  id: string;
  receptionNumber: string;
  orderId: string;
  orderNumber: string;
  date: string;
  receivedBy: string;
  warehouse: string;
  items: {
    productCode: string;
    productName: string;
    quantityReceived: number;
  }[];
  notes: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  deliveryDate: string;
  status: "draft" | "pending" | "approved" | "received" | "partial" | "cancelled";
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
  receptions?: Reception[]; // Historial de recepciones
}

const SUPPLIERS = [
  { id: "sup-001", name: "Distribuidora La Favorita C.A.", ruc: "1790016919001" },
  { id: "sup-002", name: "Tecnología Avanzada S.A.", ruc: "1792345678001" },
  { id: "sup-003", name: "Papelería Corporativa Ltda.", ruc: "1798765432001" },
  { id: "sup-004", name: "Industrial Supplies Corp.", ruc: "US-987654321" },
  { id: "sup-005", name: "Construcciones Andinas S.A.", ruc: "1790123456001" },
];

const PRODUCTS = [
  { code: "PROD-001", name: "Laptop Dell Latitude 5420", price: "850.00", tax: "12", supplierId: "sup-002" },
  { code: "PROD-002", name: "Monitor LG 27 pulgadas", price: "320.00", tax: "12", supplierId: "sup-002" },
  { code: "PROD-003", name: "Teclado mecánico Logitech", price: "89.99", tax: "12", supplierId: "sup-002" },
  { code: "PROD-004", name: "Mouse inalámbrico", price: "25.50", tax: "12", supplierId: "sup-002" },
  { code: "PROD-005", name: "Resma papel bond A4", price: "4.50", tax: "0", supplierId: "sup-003" },
  { code: "PROD-006", name: "Marcadores permanentes x12", price: "8.75", tax: "12", supplierId: "sup-003" },
  { code: "PROD-007", name: "Archivador de palanca", price: "2.30", tax: "12", supplierId: "sup-003" },
  { code: "PROD-008", name: "Silla ergonómica oficina", price: "185.00", tax: "12", supplierId: "sup-001" },
  { code: "PROD-009", name: "Escritorio ejecutivo", price: "450.00", tax: "12", supplierId: "sup-001" },
  { code: "PROD-010", name: "Lámpara LED escritorio", price: "35.00", tax: "12", supplierId: "sup-001" },
  { code: "PROD-011", name: "Impresora multifunción", price: "280.00", tax: "12", supplierId: "sup-004" },
  { code: "PROD-012", name: "Caja de bolígrafos x50", price: "12.50", tax: "12", supplierId: "sup-003" },
  { code: "PROD-013", name: "Cemento Portland x50kg", price: "8.90", tax: "12", supplierId: "sup-005" },
  { code: "PROD-014", name: "Varilla de hierro 12mm", price: "15.50", tax: "12", supplierId: "sup-005" },
  { code: "PROD-015", name: "Cable UTP Cat6 x305m", price: "120.00", tax: "12", supplierId: "sup-004" },
];

const ORDER_STATUSES = [
  { id: "all", name: "Todos los estados", color: "" },
  { id: "draft", name: "Borrador", color: "bg-gray-500/10 border-gray-500/20 text-gray-400" },
  { id: "pending", name: "Pendiente", color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
  { id: "approved", name: "Aprobada", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  { id: "partial", name: "Parcialmente Recibida", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
  { id: "received", name: "Recibida", color: "bg-green-500/10 border-green-500/20 text-green-400" },
  { id: "cancelled", name: "Cancelada", color: "bg-red-500/10 border-red-500/20 text-red-400" },
];

const WAREHOUSES = [
  { id: "wh-001", name: "Bodega Principal - Centro" },
  { id: "wh-002", name: "Bodega Norte" },
  { id: "wh-003", name: "Bodega Sur" },
  { id: "wh-004", name: "Bodega Guayaquil" },
];

export function PurchaseOrdersContent() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReceivingModal, setShowReceivingModal] = useState(false);
  const [showProductSearchModal, setShowProductSearchModal] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<PurchaseOrder | null>(null);
  const [receivingOrder, setReceivingOrder] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSupplier, setFilterSupplier] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados para recepción de mercancía
  const [receivingItems, setReceivingItems] = useState<ReceivingItem[]>([]);
  const [receivingWarehouse, setReceivingWarehouse] = useState("wh-001");
  const [receivingNotes, setReceivingNotes] = useState("");
  const [receptions, setReceptions] = useState<Reception[]>([]);

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
          receivedQuantity: 0,
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
          receivedQuantity: 0,
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
          receivedQuantity: 50,
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
          receivedQuantity: 20,
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
      date: "2026-02-14",
      deliveryDate: "2026-02-22",
      status: "partial",
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
          receivedQuantity: 10,
        },
        {
          id: "item-5b",
          productCode: "PROD-009",
          productName: "Escritorio ejecutivo",
          quantity: 8,
          unitPrice: "450.00",
          tax: "12",
          discount: "0",
          subtotal: "3600.00",
          receivedQuantity: 0,
        },
      ],
      subtotal: "6097.50",
      taxAmount: "731.70",
      discountAmount: "277.50",
      total: "6551.70",
      notes: "Para ampliación de oficinas - Recepción parcial",
      createdBy: "Ana López",
      approvedBy: "María González",
      approvedDate: "2026-02-14",
    },
    {
      id: "po-004",
      orderNumber: "COMP-001004",
      supplierId: "sup-004",
      supplierName: "Industrial Supplies Corp.",
      date: "2026-02-17",
      deliveryDate: "2026-02-28",
      status: "pending",
      items: [
        {
          id: "item-6",
          productCode: "PROD-011",
          productName: "Impresora multifunción",
          quantity: 3,
          unitPrice: "280.00",
          tax: "12",
          discount: "0",
          subtotal: "840.00",
          receivedQuantity: 0,
        },
      ],
      subtotal: "840.00",
      taxAmount: "100.80",
      discountAmount: "0",
      total: "940.80",
      notes: "Para departamento de contabilidad",
      createdBy: "Carlos Méndez",
    },
    {
      id: "po-005",
      orderNumber: "COMP-001005",
      supplierId: "sup-002",
      supplierName: "Tecnología Avanzada S.A.",
      date: "2026-02-18",
      deliveryDate: "2026-03-01",
      status: "draft",
      items: [
        {
          id: "item-7",
          productCode: "PROD-003",
          productName: "Teclado mecánico Logitech",
          quantity: 8,
          unitPrice: "89.99",
          tax: "12",
          discount: "0",
          subtotal: "719.92",
          receivedQuantity: 0,
        },
        {
          id: "item-8",
          productCode: "PROD-004",
          productName: "Mouse inalámbrico",
          quantity: 8,
          unitPrice: "25.50",
          tax: "12",
          discount: "0",
          subtotal: "204.00",
          receivedQuantity: 0,
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
      id: "po-006",
      orderNumber: "COMP-001006",
      supplierId: "sup-004",
      supplierName: "Industrial Supplies Corp.",
      date: "2026-02-10",
      deliveryDate: "2026-02-15",
      status: "cancelled",
      items: [
        {
          id: "item-9",
          productCode: "PROD-001",
          productName: "Laptop Dell Latitude 5420",
          quantity: 3,
          unitPrice: "850.00",
          tax: "12",
          discount: "0",
          subtotal: "2550.00",
          receivedQuantity: 0,
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

    const matchesDateFrom = !filterDateFrom || new Date(order.date) >= new Date(filterDateFrom);
    const matchesDateTo = !filterDateTo || new Date(order.date) <= new Date(filterDateTo);

    return matchesSearch && matchesStatus && matchesSupplier && matchesDateFrom && matchesDateTo;
  }).sort((a, b) => {
    // Ordenar por fecha descendente (más reciente primero)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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
    if (!formData.supplierId) {
      alert("Primero debes seleccionar un proveedor");
      return;
    }
    setProductSearchTerm("");
    setShowProductSearchModal(true);
  };

  const addProductFromSearch = (product: typeof PRODUCTS[0]) => {
    // Verificar si el producto ya existe en la lista
    const existingItem = formData.items?.find(item => item.productCode === product.code);
    if (existingItem) {
      alert("Este producto ya está agregado a la orden");
      return;
    }

    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      productCode: product.code,
      productName: product.name,
      quantity: 1,
      unitPrice: product.price,
      tax: product.tax,
      discount: "0",
      subtotal: product.price,
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

  // Funciones para recepción de mercancía
  const handleOpenReceivingModal = (order: PurchaseOrder) => {
    setReceivingOrder(order);
    
    // Inicializar items para recepción
    const items: ReceivingItem[] = order.items.map(item => ({
      productCode: item.productCode,
      productName: item.productName,
      orderedQuantity: item.quantity,
      previouslyReceived: item.receivedQuantity || 0,
      receivingNow: item.quantity - (item.receivedQuantity || 0), // Por defecto, recibir todo lo pendiente
      warehouse: receivingWarehouse
    }));
    
    setReceivingItems(items);
    setReceivingNotes("");
    setShowReceivingModal(true);
  };

  const handleCloseReceivingModal = () => {
    setShowReceivingModal(false);
    setReceivingOrder(null);
    setReceivingItems([]);
    setReceivingNotes("");
  };

  const handleReceivingQuantityChange = (productCode: string, quantity: number) => {
    setReceivingItems(items =>
      items.map(item =>
        item.productCode === productCode
          ? { ...item, receivingNow: Math.max(0, quantity) }
          : item
      )
    );
  };

  const handleCompleteReception = () => {
    if (!receivingOrder) return;

    // Validar que haya al menos un producto con cantidad > 0
    const hasItemsToReceive = receivingItems.some(item => item.receivingNow > 0);
    if (!hasItemsToReceive) {
      alert("Debe ingresar al menos un producto con cantidad mayor a 0");
      return;
    }

    // Validar que no se exceda la cantidad ordenada
    const hasExcessQuantity = receivingItems.some(item => 
      item.previouslyReceived + item.receivingNow > item.orderedQuantity
    );
    if (hasExcessQuantity) {
      alert("No se puede recibir más cantidad de la ordenada");
      return;
    }

    // Crear registro de recepción
    const newReception: Reception = {
      id: `rec-${Date.now()}`,
      receptionNumber: `REC-${String(receptions.length + 1).padStart(6, "0")}`,
      orderId: receivingOrder.id,
      orderNumber: receivingOrder.orderNumber,
      date: new Date().toISOString().split("T")[0],
      receivedBy: "Usuario Actual",
      warehouse: receivingWarehouse,
      items: receivingItems
        .filter(item => item.receivingNow > 0)
        .map(item => ({
          productCode: item.productCode,
          productName: item.productName,
          quantityReceived: item.receivingNow
        })),
      notes: receivingNotes
    };

    // Actualizar la orden con las cantidades recibidas
    setOrders(orders.map(order => {
      if (order.id === receivingOrder.id) {
        const updatedItems = order.items.map(item => {
          const receivingItem = receivingItems.find(ri => ri.productCode === item.productCode);
          if (receivingItem) {
            return {
              ...item,
              receivedQuantity: (item.receivedQuantity || 0) + receivingItem.receivingNow
            };
          }
          return item;
        });

        // Calcular si la orden está completamente recibida o parcial
        const allReceived = updatedItems.every(item => 
          (item.receivedQuantity || 0) >= item.quantity
        );
        const anyReceived = updatedItems.some(item => 
          (item.receivedQuantity || 0) > 0
        );

        let newStatus: "received" | "partial" = order.status as any;
        if (allReceived) {
          newStatus = "received";
        } else if (anyReceived) {
          newStatus = "partial";
        }

        return {
          ...order,
          items: updatedItems,
          status: newStatus,
          receivedDate: allReceived ? new Date().toISOString().split("T")[0] : order.receivedDate,
          receptions: [...(order.receptions || []), newReception]
        };
      }
      return order;
    }));

    // Guardar la recepción en el historial global
    setReceptions([...receptions, newReception]);

    // Mostrar mensaje de éxito
    alert(`✅ Recepción completada exitosamente!\n\nNúmero: ${newReception.receptionNumber}\nBodega: ${WAREHOUSES.find(w => w.id === receivingWarehouse)?.name}\nProductos: ${newReception.items.length}`);

    handleCloseReceivingModal();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "approved":
        return <CheckCircle className="w-5 h-5" />;
      case "partial":
        return <PackageCheck className="w-5 h-5" />;
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">
      {/* Header estándar con diseño corporativo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Órdenes de Compra
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona tus órdenes de compra y realiza seguimiento de entregas
          </p>
        </div>
        
        {/* Botones de acción - Arriba a la derecha */}
        <div className="flex items-center gap-3">
          
          
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 justify-center whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Nueva Orden
          </button>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Sección de filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Buscar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar orden..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>

        {/* Estado */}
        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        {/* Proveedor */}
        <div className="relative">
          <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todos los proveedores</option>
            {SUPPLIERS.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de fechas en un solo campo */}
        <div className="relative">
          <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            onChange={(e) => {
              const value = e.target.value;
              const today = new Date();
              let from = "";
              let to = "";

              switch (value) {
                case "today":
                  from = to = today.toISOString().split("T")[0];
                  break;
                case "week":
                  from = new Date(today.setDate(today.getDate() - 7)).toISOString().split("T")[0];
                  to = new Date().toISOString().split("T")[0];
                  break;
                case "month":
                  from = new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0];
                  to = new Date().toISOString().split("T")[0];
                  break;
                case "all":
                default:
                  from = to = "";
              }

              setFilterDateFrom(from);
              setFilterDateTo(to);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="all">Todas las fechas</option>
            <option value="today">Hoy</option>
            <option value="week">Últimos 7 días</option>
            <option value="month">Últimos 30 días</option>
          </select>
        </div>
      </div>

      {/* Lista de órdenes - Tabla */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No se encontraron órdenes de compra</p>
            <p className="text-gray-500 text-sm">
              Intenta ajustar los filtros o crea una nueva orden
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Número de Orden
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Entrega
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentItems.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Número de Orden */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold font-mono">{order.orderNumber}</span>
                        <span className="text-gray-500 text-xs mt-0.5">
                          {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>

                    {/* Proveedor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-white text-sm">{order.supplierName}</span>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-white text-sm">
                          {new Date(order.date).toLocaleDateString("es-EC")}
                        </span>
                      </div>
                    </td>

                    {/* Fecha de Entrega */}
                    <td className="px-6 py-4">
                      <span className="text-white text-sm">
                        {new Date(order.deliveryDate).toLocaleDateString("es-EC")}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusName(order.status)}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-white font-bold text-lg">
                        ${parseFloat(order.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {order.status === "draft" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "pending")}
                            className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors"
                            title="Enviar a aprobación"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        )}

                        {order.status === "pending" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "approved")}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="Aprobar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {(order.status === "approved" || order.status === "partial") && (
                          <button
                            onClick={() => handleOpenReceivingModal(order)}
                            className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                            title="Recibir mercancía"
                          >
                            <PackageCheck className="w-4 h-4" />
                          </button>
                        )}

                        {(order.status === "draft" || order.status === "pending") && (
                          <button
                            onClick={() => handleOpenModal(order)}
                            className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}

                        {order.status !== "received" && (
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

            {/* Contenido del modal de crear/editar */}
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
                    disabled={!formData.supplierId}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search className="w-4 h-4" />
                    Buscar Producto
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
                            disabled={!formData.supplierId}
                          >
                            <option value="">{!formData.supplierId ? "Primero selecciona un proveedor" : "Seleccionar producto"}</option>
                            {PRODUCTS.filter(product => product.supplierId === formData.supplierId).map((product) => (
                              <option key={product.code} value={product.code}>
                                {product.name} - ${product.price}
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

      {/* Paginación */}
      {filteredOrders.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Información de registros */}
          <div className="text-gray-400 text-sm">
            Mostrando <span className="text-white font-medium">{indexOfFirstItem + 1}</span> a{" "}
            <span className="text-white font-medium">{Math.min(indexOfLastItem, filteredOrders.length)}</span> de{" "}
            <span className="text-white font-medium">{filteredOrders.length}</span> órdenes
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

      {/* Modal de Recepción de Mercancía */}
      {showReceivingModal && receivingOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <PackageCheck className="w-6 h-6 text-green-400" />
                  Recepción de Mercancía
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Orden: <span className="font-mono text-primary">{receivingOrder.orderNumber}</span> - {receivingOrder.supplierName}
                </p>
              </div>
              <button
                onClick={handleCloseReceivingModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-6">
              {/* Información de la Orden */}
              <div className="bg-white/5 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Fecha de Orden</p>
                    <p className="text-white font-medium">{new Date(receivingOrder.date).toLocaleDateString("es-EC")}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Fecha de Entrega</p>
                    <p className="text-white font-medium">{new Date(receivingOrder.deliveryDate).toLocaleDateString("es-EC")}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Total de la Orden</p>
                    <p className="text-primary font-bold text-xl">${parseFloat(receivingOrder.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>

              {/* Selección de Bodega */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-primary" />
                  Bodega de Destino
                </label>
                <select
                  value={receivingWarehouse}
                  onChange={(e) => setReceivingWarehouse(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                >
                  {WAREHOUSES.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tabla de Productos */}
              <div>
                <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Productos a Recibir
                </h4>
                
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                            Producto
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                            Ordenado
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                            Ya Recibido
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                            Pendiente
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase">
                            Recibir Ahora
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {receivingItems.map((item) => {
                          const pending = item.orderedQuantity - item.previouslyReceived;
                          const exceedsOrdered = item.previouslyReceived + item.receivingNow > item.orderedQuantity;
                          
                          return (
                            <tr key={item.productCode} className="hover:bg-white/[0.02]">
                              {/* Producto */}
                              <td className="px-4 py-4">
                                <div>
                                  <p className="text-white font-medium text-sm">{item.productName}</p>
                                  <p className="text-gray-500 text-xs font-mono">{item.productCode}</p>
                                </div>
                              </td>

                              {/* Ordenado */}
                              <td className="px-4 py-4 text-center">
                                <span className="text-white font-bold">{item.orderedQuantity}</span>
                              </td>

                              {/* Ya Recibido */}
                              <td className="px-4 py-4 text-center">
                                <span className="text-blue-400 font-bold">{item.previouslyReceived}</span>
                              </td>

                              {/* Pendiente */}
                              <td className="px-4 py-4 text-center">
                                <span className={`font-bold ${pending > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                                  {pending}
                                </span>
                              </td>

                              {/* Recibir Ahora */}
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleReceivingQuantityChange(item.productCode, item.receivingNow - 1)}
                                    disabled={item.receivingNow <= 0}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                  
                                  <input
                                    type="number"
                                    min="0"
                                    max={pending}
                                    value={item.receivingNow}
                                    onChange={(e) => handleReceivingQuantityChange(item.productCode, parseInt(e.target.value) || 0)}
                                    className={`w-20 px-3 py-2 bg-[#0f1825] border rounded-lg text-white text-center font-bold focus:outline-none focus:ring-2 transition-all ${
                                      exceedsOrdered 
                                        ? 'border-red-500/50 focus:ring-red-500/40' 
                                        : 'border-white/10 focus:ring-primary/40'
                                    }`}
                                  />
                                  
                                  <button
                                    onClick={() => handleReceivingQuantityChange(item.productCode, item.receivingNow + 1)}
                                    disabled={item.receivingNow >= pending}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                  
                                  <button
                                    onClick={() => handleReceivingQuantityChange(item.productCode, pending)}
                                    disabled={pending === 0}
                                    className="px-2 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    Todo
                                  </button>
                                </div>
                                {exceedsOrdered && (
                                  <p className="text-red-400 text-xs text-center mt-1 flex items-center justify-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Excede cantidad ordenada
                                  </p>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Resumen de Recepción */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm mb-1">Total de Productos a Recibir</p>
                    <p className="text-primary font-bold text-2xl">
                      {receivingItems.reduce((sum, item) => sum + item.receivingNow, 0)} unidades
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm mb-1">Productos con Recepción</p>
                    <p className="text-white font-bold text-xl">
                      {receivingItems.filter(item => item.receivingNow > 0).length} / {receivingItems.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Notas de Recepción (Opcional)
                </label>
                <textarea
                  placeholder="Observaciones sobre la recepción, productos dañados, discrepancias, etc."
                  value={receivingNotes}
                  onChange={(e) => setReceivingNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseReceivingModal}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleCompleteReception}
                className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Completar Recepción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Búsqueda de Productos */}
      {showProductSearchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del modal */}
            <div className="bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <Search className="w-6 h-6 text-primary" />
                  Buscar Productos
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Selecciona los productos del proveedor {SUPPLIERS.find(s => s.id === formData.supplierId)?.name}
                </p>
              </div>
              <button
                onClick={() => setShowProductSearchModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de búsqueda */}
            <div className="px-6 py-4 bg-white/5 border-b border-white/10">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar por código o nombre de producto..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-3">
                {PRODUCTS
                  .filter(product => product.supplierId === formData.supplierId)
                  .filter(product => 
                    productSearchTerm === "" ||
                    product.code.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                    product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
                  )
                  .map((product) => {
                    const isAlreadyAdded = formData.items?.some(item => item.productCode === product.code);
                    return (
                      <div
                        key={product.code}
                        className={`bg-white/5 border rounded-xl p-4 transition-all ${
                          isAlreadyAdded
                            ? "border-green-500/20 bg-green-500/5 opacity-60"
                            : "border-white/10 hover:border-primary/50 hover:bg-white/10 cursor-pointer"
                        }`}
                        onClick={() => {
                          if (!isAlreadyAdded) {
                            addProductFromSearch(product);
                            setShowProductSearchModal(false);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Package className={`w-5 h-5 flex-shrink-0 ${isAlreadyAdded ? "text-green-400" : "text-primary"}`} />
                              <div>
                                <p className="text-white font-medium">{product.name}</p>
                                <p className="text-gray-500 text-sm font-mono">{product.code}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-400">
                                Precio: <span className="text-white font-bold">${parseFloat(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                              </span>
                              <span className="text-gray-400">
                                IVA: <span className="text-white font-medium">{product.tax}%</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {isAlreadyAdded ? (
                              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 font-medium text-sm">Agregado</span>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addProductFromSearch(product);
                                  setShowProductSearchModal(false);
                                }}
                                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                              >
                                <Plus className="w-5 h-5" />
                                Agregar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Mensaje cuando no hay resultados */}
              {PRODUCTS
                .filter(product => product.supplierId === formData.supplierId)
                .filter(product => 
                  productSearchTerm === "" ||
                  product.code.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                  product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
                ).length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-2">No se encontraron productos</p>
                  <p className="text-gray-500 text-sm">
                    {productSearchTerm 
                      ? "Intenta con otro término de búsqueda"
                      : "No hay productos disponibles para este proveedor"}
                  </p>
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Haz clic en un producto para agregarlo a la orden
              </p>
              <button
                onClick={() => setShowProductSearchModal(false)}
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