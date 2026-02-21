import { useState } from "react";
import { X, Save, Plus, Trash2, FileText, Calendar, Truck, CheckCircle } from "lucide-react";

interface NewInvoiceItem {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  discount: number;
}

interface NewSupplierInvoiceModalProps {
  onClose: () => void;
}

const MOCK_SUPPLIERS = [
  { name: "Distribuidora Nacional S.A.", ruc: "1790016919001" },
  { name: "Kreafast", ruc: "1792345678001" },
  { name: "Tecnología Avanzada S.A.", ruc: "1798765432001" },
  { name: "Importadora del Pacífico", ruc: "1790123456001" },
  { name: "Comercial Andina", ruc: "1791234567001" },
];

interface PurchaseOrderProduct {
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
}

interface PurchaseOrderData {
  id: string;
  supplier: string;
  supplierRuc: string;
  products: PurchaseOrderProduct[];
}

const MOCK_PURCHASE_ORDERS: PurchaseOrderData[] = [
  {
    id: "OC-2026-001",
    supplier: "Distribuidora Nacional S.A.",
    supplierRuc: "1790016919001",
    products: [
      {
        productCode: "PROD-001",
        productName: "Laptop Dell Inspiron 15",
        quantity: 5,
        unit: "Unidad",
        unitPrice: 850.00,
        taxRate: 15
      },
      {
        productCode: "PROD-002",
        productName: "Mouse Inalámbrico Logitech M185",
        quantity: 10,
        unit: "Unidad",
        unitPrice: 15.00,
        taxRate: 15
      },
      {
        productCode: "PROD-003",
        productName: "Teclado Mecánico RGB Gamer",
        quantity: 10,
        unit: "Unidad",
        unitPrice: 45.00,
        taxRate: 15
      }
    ]
  },
  {
    id: "OC-2026-002",
    supplier: "Kreafast",
    supplierRuc: "1792345678001",
    products: [
      {
        productCode: "PROD-005",
        productName: "Resma papel bond A4",
        quantity: 20,
        unit: "Unidad",
        unitPrice: 4.50,
        taxRate: 15
      },
      {
        productCode: "PROD-006",
        productName: "Marcadores permanentes x12",
        quantity: 15,
        unit: "Caja",
        unitPrice: 8.00,
        taxRate: 15
      }
    ]
  },
  {
    id: "OC-2026-003",
    supplier: "Tecnología Avanzada S.A.",
    supplierRuc: "1798765432001",
    products: [
      {
        productCode: "PROD-011",
        productName: "Impresora multifunción",
        quantity: 3,
        unit: "Unidad",
        unitPrice: 320.00,
        taxRate: 15
      },
      {
        productCode: "PROD-012",
        productName: "Tóner HP Negro",
        quantity: 6,
        unit: "Unidad",
        unitPrice: 45.00,
        taxRate: 15
      }
    ]
  },
  {
    id: "OC-2026-004",
    supplier: "Comercial Andina",
    supplierRuc: "1791234567001",
    products: [
      {
        productCode: "PROD-008",
        productName: "Silla ergonómica oficina",
        quantity: 12,
        unit: "Unidad",
        unitPrice: 95.00,
        taxRate: 15
      },
      {
        productCode: "PROD-009",
        productName: "Escritorio ejecutivo",
        quantity: 6,
        unit: "Unidad",
        unitPrice: 220.00,
        taxRate: 15
      }
    ]
  },
  {
    id: "OC-2026-005",
    supplier: "Importadora del Pacífico",
    supplierRuc: "1790123456001",
    products: [
      {
        productCode: "PROD-015",
        productName: "Cable UTP Cat6 x305m",
        quantity: 5,
        unit: "Rollo",
        unitPrice: 85.00,
        taxRate: 15
      },
      {
        productCode: "PROD-016",
        productName: "Conectores RJ45 x100",
        quantity: 10,
        unit: "Caja",
        unitPrice: 12.00,
        taxRate: 15
      }
    ]
  }
];

const MOCK_RECEPTIONS = [
  "REC-2026-001",
  "REC-2026-002",
  "REC-2026-003",
];

export function NewSupplierInvoiceModal({ onClose }: NewSupplierInvoiceModalProps) {
  // Datos generales
  const [supplier, setSupplier] = useState("");
  const [supplierRuc, setSupplierRuc] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("contado");
  const [purchaseOrder, setPurchaseOrder] = useState("");
  const [receptionNumber, setReceptionNumber] = useState("");
  const [notes, setNotes] = useState("");

  // Productos
  const [items, setItems] = useState<NewInvoiceItem[]>([
    { productName: "", quantity: 1, unit: "Unidad", unitPrice: 0, taxRate: 15, discount: 0 }
  ]);

  const handleSupplierChange = (supplierName: string) => {
    setSupplier(supplierName);
    const selectedSupplier = MOCK_SUPPLIERS.find(s => s.name === supplierName);
    if (selectedSupplier) {
      setSupplierRuc(selectedSupplier.ruc);
    }
  };

  const handlePurchaseOrderChange = (orderId: string) => {
    setPurchaseOrder(orderId);
    
    if (orderId) {
      // Buscar la orden de compra seleccionada
      const selectedOrder = MOCK_PURCHASE_ORDERS.find(oc => oc.id === orderId);
      
      if (selectedOrder) {
        // Auto-completar proveedor
        setSupplier(selectedOrder.supplier);
        setSupplierRuc(selectedOrder.supplierRuc);
        
        // Cargar productos de la orden de compra
        const loadedItems: NewInvoiceItem[] = selectedOrder.products.map(product => ({
          productName: product.productName,
          quantity: product.quantity,
          unit: product.unit,
          unitPrice: product.unitPrice,
          taxRate: product.taxRate,
          discount: 0
        }));
        
        setItems(loadedItems);
      }
    }
  };

  const handlePaymentTermsChange = (terms: string) => {
    setPaymentTerms(terms);
    if (invoiceDate) {
      const invoice = new Date(invoiceDate);
      let due = new Date(invoice);
      
      switch (terms) {
        case "contado":
          due = new Date(invoice);
          break;
        case "credito_15":
          due.setDate(due.getDate() + 15);
          break;
        case "credito_30":
          due.setDate(due.getDate() + 30);
          break;
        case "credito_45":
          due.setDate(due.getDate() + 45);
          break;
        case "credito_60":
          due.setDate(due.getDate() + 60);
          break;
      }
      
      setDueDate(due.toISOString().split('T')[0]);
    }
  };

  const addItem = () => {
    setItems([...items, { productName: "", quantity: 1, unit: "Unidad", unitPrice: 0, taxRate: 15, discount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof NewInvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateItemSubtotal = (item: NewInvoiceItem) => {
    return item.quantity * item.unitPrice - item.discount;
  };

  const calculateItemTax = (item: NewInvoiceItem) => {
    const subtotal = calculateItemSubtotal(item);
    return subtotal * (item.taxRate / 100);
  };

  const calculateItemTotal = (item: NewInvoiceItem) => {
    return calculateItemSubtotal(item) + calculateItemTax(item);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0);
    const totalTax = items.reduce((sum, item) => sum + calculateItemTax(item), 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const total = subtotal + totalTax;

    return { subtotal, totalTax, totalDiscount, total };
  };

  const handleSave = () => {
    // Aquí se implementaría la lógica para guardar la factura
    console.log("Guardando factura...", {
      supplier,
      supplierRuc,
      invoiceNumber,
      invoiceDate,
      dueDate,
      paymentTerms,
      purchaseOrder,
      receptionNumber,
      items,
      notes,
      totals: calculateTotals()
    });
    
    alert("Factura registrada exitosamente");
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const totals = calculateTotals();
  const isFormValid = supplier && invoiceNumber && invoiceDate && items.every(item => item.productName && item.quantity > 0 && item.unitPrice > 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-6xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-white font-bold text-xl">Nueva Factura de Proveedor</h3>
            <p className="text-gray-400 text-sm mt-1">Registrar una nueva factura recibida</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información del Proveedor */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              Información del Proveedor
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-2">Proveedor *</label>
                <select
                  value={supplier}
                  onChange={(e) => handleSupplierChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  required
                >
                  <option value="">Seleccionar proveedor...</option>
                  {MOCK_SUPPLIERS.map((sup) => (
                    <option key={sup.ruc} value={sup.name}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2">RUC</label>
                <input
                  type="text"
                  value={supplierRuc}
                  readOnly
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-500 text-sm font-mono"
                  placeholder="Seleccione un proveedor"
                />
              </div>
            </div>
          </div>

          {/* Información de la Factura */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Datos de la Factura
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 text-xs mb-2">Nº de Factura *</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="FAC-001-001234"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2">Fecha de Emisión *</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => {
                    setInvoiceDate(e.target.value);
                    if (paymentTerms) {
                      handlePaymentTermsChange(paymentTerms);
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2">Términos de Pago *</label>
                <select
                  value={paymentTerms}
                  onChange={(e) => handlePaymentTermsChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  required
                >
                  <option value="contado">Contado</option>
                  <option value="credito_15">Crédito 15 días</option>
                  <option value="credito_30">Crédito 30 días</option>
                  <option value="credito_45">Crédito 45 días</option>
                  <option value="credito_60">Crédito 60 días</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2">Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2">Orden de Compra</label>
                <select
                  value={purchaseOrder}
                  onChange={(e) => handlePurchaseOrderChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                >
                  <option value="">Sin OC...</option>
                  {MOCK_PURCHASE_ORDERS.map((oc) => (
                    <option key={oc.id} value={oc.id}>
                      {oc.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-xs mb-2">Nº Recepción</label>
                <select
                  value={receptionNumber}
                  onChange={(e) => setReceptionNumber(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                >
                  <option value="">Sin recepción...</option>
                  {MOCK_RECEPTIONS.map((rec) => (
                    <option key={rec} value={rec}>
                      {rec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                Productos
              </h4>
              <button
                onClick={addItem}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Producto
              </button>
            </div>

            {purchaseOrder && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-green-400 text-sm">
                  Productos cargados automáticamente desde la orden de compra <span className="font-mono font-bold">{purchaseOrder}</span>
                </p>
              </div>
            )}

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 text-xs mb-2">Producto *</label>
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => updateItem(index, 'productName', e.target.value)}
                        placeholder="Nombre del producto"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-2">Cantidad *</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-2">Unidad</label>
                      <select
                        value={item.unit}
                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      >
                        <option>Unidad</option>
                        <option>Caja</option>
                        <option>Paquete</option>
                        <option>Rollo</option>
                        <option>Kg</option>
                        <option>Litro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-2">P. Unitario *</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="flex-1">
                        <label className="block text-gray-400 text-xs mb-2">Total</label>
                        <div className="px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-primary text-sm font-bold font-mono">
                          {formatCurrency(calculateItemTotal(item))}
                        </div>
                      </div>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="ml-2 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Detalles adicionales */}
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10">
                    <div>
                      <label className="block text-gray-400 text-xs mb-2">IVA (%)</label>
                      <select
                        value={item.taxRate}
                        onChange={(e) => updateItem(index, 'taxRate', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      >
                        <option value={0}>0%</option>
                        <option value={15}>15%</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-2">Descuento ($)</label>
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateItem(index, 'discount', Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totales */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="text-white font-bold text-sm mb-4">Resumen de Totales</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Subtotal:</span>
                <span className="text-white font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Descuento:</span>
                  <span className="text-red-400 font-medium">-{formatCurrency(totals.totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">IVA:</span>
                <span className="text-white font-medium">{formatCurrency(totals.totalTax)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold text-lg">TOTAL:</span>
                  <span className="text-primary font-bold text-2xl">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-gray-400 text-xs mb-2">Notas / Observaciones</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales sobre la factura..."
              rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Guardar Factura
          </button>
        </div>
      </div>
    </div>
  );
}