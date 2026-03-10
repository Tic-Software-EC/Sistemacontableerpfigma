import { useState, useEffect } from "react";
import { X, Search, Plus, Minus, CheckCircle2, Send, Shield, FileCheck, FileSignature, FileText, Circle } from "lucide-react";

interface CreateCreditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: any) => void;
  isLight: boolean;
}

interface Invoice {
  number: string;
  date: string;
  clientName: string;
  clientRuc: string;
  items: Array<{
    code: string;
    name: string;
    quantity: number;
    price: number;
    tax: number;
  }>;
  total: number;
}

// Facturas de ejemplo
const INVOICES: Invoice[] = [
  {
    number: "001-001-000123",
    date: "2026-03-05",
    clientName: "Corporación Favorita C.A.",
    clientRuc: "1790016919001",
    items: [
      { code: "PROD001", name: "Laptop Dell Inspiron 15", quantity: 2, price: 890.00, tax: 12 },
      { code: "PROD002", name: "Mouse Logitech MX", quantity: 1, price: 45.00, tax: 12 },
    ],
    total: 2086.80,
  },
  {
    number: "001-001-000124",
    date: "2026-03-06",
    clientName: "Importadora del Pacífico Cía. Ltda.",
    clientRuc: "1712345678001",
    items: [
      { code: "PROD010", name: "Monitor Samsung 24\"", quantity: 3, price: 280.00, tax: 12 },
      { code: "PROD015", name: "Teclado Mecánico RGB", quantity: 2, price: 85.00, tax: 12 },
    ],
    total: 1130.40,
  },
  {
    number: "001-001-000125",
    date: "2026-03-07",
    clientName: "Distribuidora Andina S.A.",
    clientRuc: "1791234567001",
    items: [
      { code: "PROD020", name: "Impresora HP LaserJet", quantity: 1, price: 450.00, tax: 12 },
      { code: "PROD025", name: "Router TP-Link AC1750", quantity: 2, price: 65.00, tax: 12 },
    ],
    total: 653.60,
  },
];

const CREDIT_NOTE_REASONS = [
  "Devolución de mercadería defectuosa",
  "Descuento por volumen aplicado posteriormente",
  "Error en precio de factura",
  "Producto no cumple especificaciones",
  "Ajuste por garantía",
  "Devolución parcial acordada",
  "Otros (especificar)",
];

export function CreateCreditNoteModal({ isOpen, onClose, onSave, isLight }: CreateCreditNoteModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [creditNoteReason, setCreditNoteReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [searchInvoice, setSearchInvoice] = useState("");
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({});
  const [sriStep, setSriStep] = useState(0);
  const [noteNumber, setNoteNumber] = useState("");

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedInvoice(null);
      setCreditNoteReason("");
      setOtherReason("");
      setSearchInvoice("");
      setSelectedItems({});
      setSriStep(0);
      setNoteNumber("");
    }
  }, [isOpen]);

  // Simular proceso SRI cuando se llega al paso 3
  useEffect(() => {
    if (step === 3 && sriStep === 0) {
      // Generar número de nota
      setNoteNumber(`004-001-${String(Math.floor(Math.random() * 100000)).padStart(6, "0")}`);
      
      // Iniciar proceso automático inmediatamente
      setSriStep(1);
      
      const timer2 = setTimeout(() => setSriStep(2), 1000);
      const timer3 = setTimeout(() => setSriStep(3), 2000);
      const timer4 = setTimeout(() => setSriStep(4), 3000);
      const timer5 = setTimeout(() => setSriStep(5), 4000);

      return () => {
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [step]);

  // Filtrar facturas - Solo mostrar si hay búsqueda, y solo mostrar LA PRIMERA que coincida
  const filteredInvoices = searchInvoice.trim() === "" ? [] : INVOICES.filter((inv) => {
    const searchLower = searchInvoice.toLowerCase();
    return (
      inv.number.toLowerCase().includes(searchLower) ||
      inv.clientName.toLowerCase().includes(searchLower) ||
      inv.clientRuc.toLowerCase().includes(searchLower)
    );
  }).slice(0, 1); // Solo tomar la primera factura que coincida

  const handleItemQuantityChange = (itemCode: string, newQuantity: number) => {
    const invoiceItem = selectedInvoice?.items.find(i => i.code === itemCode);
    if (!invoiceItem) return;

    if (newQuantity <= 0) {
      const updated = { ...selectedItems };
      delete updated[itemCode];
      setSelectedItems(updated);
      return;
    }

    if (newQuantity > invoiceItem.quantity) {
      newQuantity = invoiceItem.quantity;
    }

    setSelectedItems({ ...selectedItems, [itemCode]: newQuantity });
  };

  const calculateTotal = () => {
    let subtotal = 0;
    Object.keys(selectedItems).forEach(itemCode => {
      const item = selectedInvoice?.items.find(i => i.code === itemCode);
      if (item) {
        subtotal += item.price * selectedItems[itemCode];
      }
    });
    const tax = subtotal * 0.12;
    return { subtotal, tax, total: subtotal + tax };
  };

  const totals = calculateTotal();

  const handleSave = () => {
    if (!selectedInvoice || !creditNoteReason || Object.keys(selectedItems).length === 0) {
      return;
    }

    const finalReason = creditNoteReason === "Otros (especificar)" ? otherReason : creditNoteReason;

    const newNote = {
      noteNumber: `004-001-${String(Math.floor(Math.random() * 1000)).padStart(6, "0")}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      invoiceRef: selectedInvoice.number,
      reason: finalReason,
      customer: {
        name: selectedInvoice.clientName,
        ruc: selectedInvoice.clientRuc
      },
      items: selectedInvoice.items.filter(item => selectedItems[item.code] > 0).map(item => ({
        ...item,
        quantity: selectedItems[item.code],
        total: item.price * selectedItems[item.code],
        discount: 0
      })),
      subtotal: totals.subtotal,
      totalDiscount: 0,
      subtotal12: totals.subtotal,
      subtotal0: 0,
      tax: totals.tax,
      total: totals.total,
      status: "pending" as const,
      seller: "Usuario Actual",
      branch: "Sucursal Centro",
      sriStatus: "pending" as const,
      emisor_razon: "TicSoftEc S.A.",
      emisor_dir: "Av. Amazonas N35-17 y Japón, Quito - Ecuador",
      emisor_ruc: "1790123456001",
      emisor_telefono: "02-2345-678",
      emisor_email: "facturacion@ticsoftec.com",
      ambiente: "Pruebas",
    };

    onSave(newNote);
    // Cerrar el modal automáticamente después de guardar
    onClose();
  };

  const canGoToStep2 = selectedInvoice !== null && creditNoteReason !== "" && (creditNoteReason !== "Otros (especificar)" || otherReason.trim() !== "");
  const canSave = Object.keys(selectedItems).length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "bg-gray-50/50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isLight ? "bg-blue-100" : "bg-blue-500/20"}`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Nueva Nota de Crédito
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Paso {step} de 3
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-200 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className={`px-6 py-4 border-b ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d1724]"}`}>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 1
                  ? "bg-primary text-white"
                  : isLight
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white/10 text-gray-500"
              }`}>
                {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
              </div>
              <span className={`text-xs font-medium ${step >= 1 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")}`}>
                Factura y Motivo
              </span>
            </div>

            {/* Line */}
            <div className={`flex-1 h-0.5 mx-3 ${step > 1 ? "bg-primary" : (isLight ? "bg-gray-200" : "bg-white/10")}`} />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 2
                  ? "bg-primary text-white"
                  : isLight
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white/10 text-gray-500"
              }`}>
                {step > 2 ? <CheckCircle2 className="w-4 h-4" /> : "2"}
              </div>
              <span className={`text-xs font-medium ${step >= 2 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")}`}>
                Items
              </span>
            </div>

            {/* Line */}
            <div className={`flex-1 h-0.5 mx-3 ${step > 2 ? "bg-primary" : (isLight ? "bg-gray-200" : "bg-white/10")}`} />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 3
                  ? "bg-primary text-white"
                  : isLight
                  ? "bg-gray-200 text-gray-500"
                  : "bg-white/10 text-gray-500"
              }`}>
                {step > 3 ? <CheckCircle2 className="w-4 h-4" /> : "3"}
              </div>
              <span className={`text-xs font-medium ${step >= 3 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")}`}>
                SRI
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
          
          {/* STEP 1: Seleccionar Factura y Motivo */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Seleccionar Factura y Motivo
              </h3>
              
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="text"
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                  placeholder="Buscar por número, cliente o RUC..."
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm transition-colors ${
                    isLight 
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
              </div>

              <div className="space-y-2">
                {filteredInvoices.map((inv) => (
                  <button
                    key={inv.number}
                    onClick={() => setSelectedInvoice(inv)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedInvoice?.number === inv.number
                        ? isLight
                          ? "bg-blue-50 border-blue-300 shadow-sm"
                          : "bg-blue-500/10 border-blue-500/30 shadow-sm"
                        : isLight
                        ? "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        : "bg-[#1a2332] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className={`font-mono font-bold text-sm mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                          {inv.number}
                        </div>
                        <div className={`text-sm mb-0.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          {inv.clientName}
                        </div>
                        <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                          RUC: {inv.clientRuc}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          {inv.date}
                        </div>
                        <div className={`font-bold text-base ${isLight ? "text-gray-900" : "text-white"}`}>
                          ${inv.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                
                {/* Mensaje cuando no se encuentran facturas */}
                {searchInvoice.trim() !== "" && filteredInvoices.length === 0 && (
                  <div className={`text-center py-12 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                    <FileText className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      No se encontraron facturas
                    </p>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      No existe ninguna factura con esos criterios de búsqueda
                    </p>
                  </div>
                )}

                {/* Mensaje cuando no hay búsqueda */}
                {searchInvoice.trim() === "" && (
                  <div className={`text-center py-12 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                    <Search className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Busca una factura
                    </p>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Escribe el número de factura, cliente o RUC
                    </p>
                  </div>
                )}
              </div>

              {/* Selector de Motivo - Solo se muestra cuando se selecciona una factura */}
              {selectedInvoice && (
                <div className={`space-y-2 p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/30"}`}>
                  <label className={`text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Motivo de la Nota de Crédito *
                  </label>
                  <select
                    value={creditNoteReason}
                    onChange={(e) => setCreditNoteReason(e.target.value)}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  >
                    <option value="">-- Seleccione un motivo --</option>
                    {CREDIT_NOTE_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>

                  {creditNoteReason === "Otros (especificar)" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        placeholder="Especifique el motivo..."
                        autoFocus
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm transition-colors ${
                          isLight 
                            ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                            : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Items */}
          {step === 2 && selectedInvoice && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Seleccionar Items a Devolver
              </h3>

              {/* Info */}
              <div className={`p-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className={isLight ? "text-gray-500" : "text-gray-400"}>Factura:</span>
                    <span className={`ml-2 font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      {selectedInvoice.number}
                    </span>
                  </div>
                  <div>
                    <span className={isLight ? "text-gray-500" : "text-gray-400"}>Motivo:</span>
                    <span className={`ml-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      {creditNoteReason === "Otros (especificar)" ? otherReason : creditNoteReason}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className={`rounded-lg border overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <table className="w-full">
                  <thead className={isLight ? "bg-gray-50" : "bg-[#0a0f1a]"}>
                    <tr>
                      <th className={`px-3 py-2.5 text-left text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Producto
                      </th>
                      <th className={`px-3 py-2.5 text-center text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Cant. Fact.
                      </th>
                      <th className={`px-3 py-2.5 text-center text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Cant. NC
                      </th>
                      <th className={`px-3 py-2.5 text-right text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Precio
                      </th>
                      <th className={`px-3 py-2.5 text-right text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/10"}`}>
                    {selectedInvoice.items.map((item) => {
                      const quantity = selectedItems[item.code] || 0;
                      const total = item.price * quantity;

                      return (
                        <tr key={item.code} className={isLight ? "bg-white hover:bg-gray-50" : "bg-[#0d1724] hover:bg-white/5"}>
                          <td className={`px-3 py-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className={`text-xs font-mono ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                              {item.code}
                            </div>
                          </td>
                          <td className={`px-3 py-3 text-center text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            {item.quantity}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleItemQuantityChange(item.code, quantity - 1)}
                                disabled={quantity <= 0}
                                className={`p-1 rounded transition-colors ${
                                  quantity <= 0
                                    ? "opacity-30 cursor-not-allowed"
                                    : isLight
                                    ? "hover:bg-gray-200 text-gray-600"
                                    : "hover:bg-white/10 text-gray-400"
                                }`}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className={`w-12 text-center font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                                {quantity}
                              </span>
                              <button
                                onClick={() => handleItemQuantityChange(item.code, quantity + 1)}
                                disabled={quantity >= item.quantity}
                                className={`p-1 rounded transition-colors ${
                                  quantity >= item.quantity
                                    ? "opacity-30 cursor-not-allowed"
                                    : isLight
                                    ? "hover:bg-gray-200 text-gray-600"
                                    : "hover:bg-white/10 text-gray-400"
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className={`px-3 py-3 text-right font-mono text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            ${item.price.toFixed(2)}
                          </td>
                          <td className={`px-3 py-3 text-right font-mono font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            ${total.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totales */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                <div className="space-y-2 text-sm max-w-sm ml-auto">
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-600" : "text-gray-400"}>Subtotal:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${totals.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-600" : "text-gray-400"}>IVA (12%):</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${totals.tax.toFixed(2)}
                    </span>
                  </div>
                  <div className={`flex justify-between pt-2 border-t ${isLight ? "border-gray-300" : "border-white/10"}`}>
                    <span className={`font-bold ${isLight ? "text-gray-900" : "text-white"}`}>Total NC:</span>
                    <span className={`font-mono font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Autorización SRI */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Proceso de Autorización SRI
              </h3>

              {/* Info de la Nota de Crédito */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Número de Nota:
                    </div>
                    <div className={`font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {noteNumber}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Total:
                    </div>
                    <div className={`font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${totals.total.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Cliente:
                    </div>
                    <div className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {selectedInvoice?.clientName}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Factura Ref:
                    </div>
                    <div className={`font-mono text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {selectedInvoice?.number}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stepper Horizontal de Proceso SRI */}
              <div className={`p-5 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                <div className="flex items-center justify-between mb-6">
                  {/* Paso 1: Validando XML */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      sriStep >= 1
                        ? sriStep === 1
                          ? "border-primary bg-primary/10"
                          : "border-green-500 bg-green-500/10"
                        : isLight
                        ? "border-gray-300 bg-gray-100"
                        : "border-white/20 bg-white/5"
                    }`}>
                      {sriStep > 1 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : sriStep === 1 ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileText className={`w-6 h-6 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      )}
                    </div>
                    <div className={`text-xs font-medium text-center ${
                      sriStep >= 1 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")
                    }`}>
                      Validando<br />XML
                    </div>
                  </div>

                  {/* Línea conectora 1 */}
                  <div className={`h-0.5 flex-1 transition-all ${
                    sriStep > 1 ? "bg-green-500" : isLight ? "bg-gray-300" : "bg-white/10"
                  }`} />

                  {/* Paso 2: Validación Estructura */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      sriStep >= 2
                        ? sriStep === 2
                          ? "border-primary bg-primary/10"
                          : "border-green-500 bg-green-500/10"
                        : isLight
                        ? "border-gray-300 bg-gray-100"
                        : "border-white/20 bg-white/5"
                    }`}>
                      {sriStep > 2 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : sriStep === 2 ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileCheck className={`w-6 h-6 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      )}
                    </div>
                    <div className={`text-xs font-medium text-center ${
                      sriStep >= 2 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")
                    }`}>
                      Validación<br />Estructura
                    </div>
                  </div>

                  {/* Línea conectora 2 */}
                  <div className={`h-0.5 flex-1 transition-all ${
                    sriStep > 2 ? "bg-green-500" : isLight ? "bg-gray-300" : "bg-white/10"
                  }`} />

                  {/* Paso 3: Firma Electrónica */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      sriStep >= 3
                        ? sriStep === 3
                          ? "border-primary bg-primary/10"
                          : "border-green-500 bg-green-500/10"
                        : isLight
                        ? "border-gray-300 bg-gray-100"
                        : "border-white/20 bg-white/5"
                    }`}>
                      {sriStep > 3 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : sriStep === 3 ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileSignature className={`w-6 h-6 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      )}
                    </div>
                    <div className={`text-xs font-medium text-center ${
                      sriStep >= 3 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")
                    }`}>
                      Firma<br />Electrónica
                    </div>
                  </div>

                  {/* Línea conectora 3 */}
                  <div className={`h-0.5 flex-1 transition-all ${
                    sriStep > 3 ? "bg-green-500" : isLight ? "bg-gray-300" : "bg-white/10"
                  }`} />

                  {/* Paso 4: Enviando al SRI */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      sriStep >= 4
                        ? sriStep === 4
                          ? "border-primary bg-primary/10"
                          : "border-green-500 bg-green-500/10"
                        : isLight
                        ? "border-gray-300 bg-gray-100"
                        : "border-white/20 bg-white/5"
                    }`}>
                      {sriStep > 4 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : sriStep === 4 ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className={`w-6 h-6 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      )}
                    </div>
                    <div className={`text-xs font-medium text-center ${
                      sriStep >= 4 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")
                    }`}>
                      Enviando<br />al SRI
                    </div>
                  </div>

                  {/* Línea conectora 4 */}
                  <div className={`h-0.5 flex-1 transition-all ${
                    sriStep > 4 ? "bg-green-500" : isLight ? "bg-gray-300" : "bg-white/10"
                  }`} />

                  {/* Paso 5: Autorización SRI */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      sriStep >= 5
                        ? "border-green-500 bg-green-500/10"
                        : isLight
                        ? "border-gray-300 bg-gray-100"
                        : "border-white/20 bg-white/5"
                    }`}>
                      {sriStep >= 5 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Shield className={`w-6 h-6 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      )}
                    </div>
                    <div className={`text-xs font-medium text-center ${
                      sriStep >= 5 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")
                    }`}>
                      Autorización<br />SRI
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de éxito */}
              {sriStep >= 5 && (
                <div className={`p-4 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/30"}`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <div className={`font-bold text-sm ${isLight ? "text-green-700" : "text-green-500"}`}>
                        ¡Nota de Crédito autorizada exitosamente!
                      </div>
                      <div className={`text-xs ${isLight ? "text-green-600" : "text-green-400"}`}>
                        La nota de crédito ha sido procesada y autorizada por el SRI
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
          <div>
            {step > 1 && step < 3 && (
              <button
                onClick={() => setStep((step - 1) as 1 | 2 | 3)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLight 
                    ? "text-gray-700 hover:bg-gray-200" 
                    : "text-gray-300 hover:bg-white/10"
                }`}>
                ← Atrás
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLight 
                  ? "text-gray-700 hover:bg-gray-200" 
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              Cancelar
            </button>
            
            {/* Lógica de navegación de pasos */}
            {step < 3 ? (
              <button
                onClick={() => {
                  // Validaciones por paso
                  if (step === 1 && !canGoToStep2) return;
                  if (step === 2 && !canSave) return;
                  
                  // Avanzar al siguiente paso
                  setStep((step + 1) as 1 | 2 | 3);
                }}
                disabled={
                  (step === 1 && !canGoToStep2) ||
                  (step === 2 && !canSave)
                }
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  (step === 1 && !canGoToStep2) ||
                  (step === 2 && !canSave)
                    ? isLight
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={sriStep < 5 || !canSave}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  (sriStep < 5 || !canSave)
                    ? isLight
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {sriStep >= 5 ? "Finalizar Nota de Crédito" : "Procesando..."}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}