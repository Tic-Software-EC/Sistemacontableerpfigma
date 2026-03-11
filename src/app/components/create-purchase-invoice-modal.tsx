import { useState, useEffect } from "react";
import { X, Plus, Trash2, FileText, Search, AlertCircle, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════════════════════════
   BASE DE DATOS MOCK - PROVEEDORES
══════════════════════════════════════════════════════════════════════ */
const PROVEEDORES_MOCK = [
  {
    id: "1",
    ruc: "1790016919001",
    razonSocial: "Corporación Favorita C.A.",
    nombreComercial: "Corporación Favorita",
    direccion: "Av. General Enríquez km 4.5, Sangolquí",
    telefono: "02-3456789",
    email: "facturacion@favorita.com"
  },
  {
    id: "2",
    ruc: "1891234567001",
    razonSocial: "Distribuidora El Sol S.A.",
    nombreComercial: "El Sol",
    direccion: "Calle Bolívar 234 y Rocafuerte, Cuenca",
    telefono: "07-2890123",
    email: "ventas@elsol.com.ec"
  },
  {
    id: "3",
    ruc: "1712345678001",
    razonSocial: "Importadora del Pacífico Cía. Ltda.",
    nombreComercial: "Importadora del Pacífico",
    direccion: "Av. de las Américas y José Mascote, Guayaquil",
    telefono: "04-2567890",
    email: "info@importadorapacifico.com"
  }
];

/* ══════════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════════ */
interface PurchaseInvoiceItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface CreatePurchaseInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: any) => void;
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function CreatePurchaseInvoiceModal({ isOpen, onClose, onSave }: CreatePurchaseInvoiceModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados de navegación
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de búsqueda de proveedor
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState<any>(null);

  // Estados de datos básicos
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [authorizationKey, setAuthorizationKey] = useState("");

  // Estados de items
  const [items, setItems] = useState<PurchaseInvoiceItem[]>([
    { code: "", name: "", quantity: 1, price: 0, discount: 0, tax: 12, total: 0 }
  ]);

  // Calcular totales
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const subtotal12 = items.filter(i => i.tax === 12).reduce((sum, item) => sum + item.total, 0);
  const subtotal0 = items.filter(i => i.tax === 0).reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal12 * 0.12;
  const total = subtotal + tax;

  // Filtrar proveedores por búsqueda
  const filteredProveedores = PROVEEDORES_MOCK.filter(p =>
    p.razonSocial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nombreComercial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ruc.includes(searchQuery)
  );

  // Resetear al cerrar
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setIsSaving(false);
      setSearchQuery("");
      setSelectedProveedor(null);
      setInvoiceNumber("");
      setInvoiceDate("");
      setAuthorizationKey("");
      setItems([{ code: "", name: "", quantity: 1, price: 0, discount: 0, tax: 12, total: 0 }]);
    }
  }, [isOpen]);

  const handleAddItem = () => {
    setItems([...items, { code: "", name: "", quantity: 1, price: 0, discount: 0, tax: 12, total: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof PurchaseInvoiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalcular total del item
    const item = newItems[index];
    const subtotalItem = item.quantity * item.price - item.discount;
    newItems[index].total = subtotalItem;

    setItems(newItems);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedProveedor) {
        toast.error("Selecciona un proveedor emisor");
        return;
      }
      if (!invoiceNumber.trim()) {
        toast.error("Ingresa el número de factura");
        return;
      }
      if (!invoiceDate) {
        toast.error("Selecciona la fecha de emisión");
        return;
      }
      if (!authorizationKey.trim() || authorizationKey.length !== 49) {
        toast.error("Ingresa la clave de acceso completa (49 dígitos)");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (items.some(item => !item.code || !item.name || item.quantity <= 0 || item.price <= 0)) {
        toast.error("Completa todos los items correctamente");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Crear factura
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber,
      date: invoiceDate,
      time: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      supplier: {
        name: selectedProveedor.razonSocial,
        ruc: selectedProveedor.ruc,
        address: selectedProveedor.direccion,
        email: selectedProveedor.email,
        phone: selectedProveedor.telefono,
      },
      items: items.map(item => ({
        code: item.code,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        tax: item.tax,
        total: item.total,
      })),
      subtotal,
      totalDiscount,
      subtotal12,
      subtotal0,
      tax,
      total,
      status: "completed",
      authorizationNumber: authorizationKey,
      sriStatus: "authorized",
      sriAuthDate: new Date().toLocaleString("es-EC", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }),
      emisor_razon: selectedProveedor.razonSocial,
      emisor_dir: selectedProveedor.direccion,
      emisor_ruc: selectedProveedor.ruc,
      emisor_telefono: selectedProveedor.telefono,
      emisor_email: selectedProveedor.email,
      ambiente: "Pruebas",
      periodo_fiscal: new Date().toLocaleDateString("es-EC", { month: "2-digit", year: "numeric" }),
    };

    onSave(newInvoice);
    toast.success("✓ Factura de compra registrada correctamente");

    await new Promise(resolve => setTimeout(resolve, 1000));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] ${
          isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/20"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                Registrar Factura de Compra
              </h2>
              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                Paso {currentStep} de 3
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className={`p-2 rounded-lg transition-colors ${
              isLight
                ? "hover:bg-gray-100 text-gray-600"
                : "hover:bg-white/10 text-gray-300"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps */}
        <div className={`px-6 py-5 border-b ${isLight ? "bg-gray-50" : "bg-white/5"}`} style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Paso 1 */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep >= 1
                    ? "bg-primary text-white"
                    : isLight
                    ? "bg-gray-200 text-gray-500"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                1
              </div>
              <span className={`text-sm font-medium ${currentStep >= 1 ? (isLight ? "text-darkBg" : "text-white") : "text-gray-400"}`}>
                Proveedor y Datos
              </span>
            </div>

            {/* Separador */}
            <div className={`h-0.5 w-12 mx-2 ${currentStep >= 2 ? "bg-primary" : isLight ? "bg-gray-200" : "bg-white/10"}`} />

            {/* Paso 2 */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep >= 2
                    ? "bg-primary text-white"
                    : isLight
                    ? "bg-gray-200 text-gray-500"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                2
              </div>
              <span className={`text-sm font-medium ${currentStep >= 2 ? (isLight ? "text-darkBg" : "text-white") : "text-gray-400"}`}>
                Items
              </span>
            </div>

            {/* Separador */}
            <div className={`h-0.5 w-12 mx-2 ${currentStep >= 3 ? "bg-primary" : isLight ? "bg-gray-200" : "bg-white/10"}`} />

            {/* Paso 3 */}
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep >= 3
                    ? "bg-primary text-white"
                    : isLight
                    ? "bg-gray-200 text-gray-500"
                    : "bg-white/10 text-gray-500"
                }`}
              >
                3
              </div>
              <span className={`text-sm font-medium ${currentStep >= 3 ? (isLight ? "text-darkBg" : "text-white") : "text-gray-400"}`}>
                Resumen
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* PASO 1: Seleccionar Proveedor y Datos Básicos */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className={`text-base font-bold mb-4 ${isLight ? "text-darkBg" : "text-white"}`}>
                  Seleccionar Proveedor Emisor
                </h3>

                {/* SI NO HAY PROVEEDOR SELECCIONADO: Mostrar buscador + lista */}
                {!selectedProveedor ? (
                  <>
                    {/* Buscador */}
                    <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 mb-4 ${isLight ? "bg-white border-gray-300" : "bg-white/5 border-white/15"}`}>
                      <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar proveedor por nombre o RUC..."
                        className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${isLight ? "text-gray-900" : "text-white"}`}
                      />
                    </div>

                    {/* Lista de proveedores */}
                    <div className={`border rounded-lg min-h-[200px] max-h-[200px] overflow-y-auto ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
                      {searchQuery === "" ? (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className={`text-sm font-semibold mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            Busca un proveedor
                          </p>
                          <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            Escribe el nombre o RUC del proveedor emisor
                          </p>
                        </div>
                      ) : filteredProveedores.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-12">
                          <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
                          <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            No se encontraron proveedores
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.05)" }}>
                          {filteredProveedores.map((proveedor) => (
                            <div
                              key={proveedor.id}
                              onClick={() => setSelectedProveedor(proveedor)}
                              className={`p-4 cursor-pointer transition-colors ${
                                isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-bold text-sm ${isLight ? "text-darkBg" : "text-white"}`}>
                                      {proveedor.razonSocial}
                                    </span>
                                  </div>
                                  <p className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                    RUC: {proveedor.ruc}
                                  </p>
                                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                    {proveedor.direccion}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* SI HAY PROVEEDOR SELECCIONADO: Mostrar solo el proveedor con opción de cambiar */
                  <div className={`border rounded-lg p-4 ${isLight ? "bg-orange-50 border-primary/30" : "bg-primary/10 border-primary/30"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-primary/10" : "bg-primary/20"}`}>
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-bold text-sm ${isLight ? "text-darkBg" : "text-white"}`}>
                              {selectedProveedor.razonSocial}
                            </span>
                          </div>
                          <p className={`text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                            RUC: {selectedProveedor.ruc}
                          </p>
                          <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            {selectedProveedor.direccion}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProveedor(null);
                          setSearchQuery("");
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex-shrink-0 ${
                          isLight
                            ? "border-gray-300 text-gray-600 hover:bg-white"
                            : "border-white/20 text-gray-300 hover:bg-white/5"
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Cambiar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Datos de la Factura (se muestra cuando hay proveedor seleccionado) */}
              {selectedProveedor && (
                <div className="space-y-4">
                  <h3 className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                    Datos de la Factura
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Número de Factura *
                      </label>
                      <input
                        type="text"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                          isLight
                            ? "border-gray-300 bg-white text-gray-900"
                            : "border-white/20 bg-white/5 text-white"
                        }`}
                        placeholder="001-002-001234567"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Fecha de Emisión *
                      </label>
                      <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                          isLight
                            ? "border-gray-300 bg-white text-gray-900"
                            : "border-white/20 bg-white/5 text-white"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Clave de Acceso (49 dígitos) *
                    </label>
                    <input
                      type="text"
                      value={authorizationKey}
                      onChange={(e) => setAuthorizationKey(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm font-mono border ${
                        isLight
                          ? "border-gray-300 bg-white text-gray-900"
                          : "border-white/20 bg-white/5 text-white"
                      }`}
                      placeholder="0123456789012345678901234567890123456789012345678"
                      maxLength={49}
                    />
                    <p className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      {authorizationKey.length}/49 dígitos
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: Items */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                  Productos / Servicios
                </h3>
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-primary hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-6 gap-3">
                        <div className="col-span-2">
                          <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            Código
                          </label>
                          <input
                            type="text"
                            value={item.code}
                            onChange={(e) => handleItemChange(index, "code", e.target.value)}
                            className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                              isLight
                                ? "border-gray-300 bg-white text-gray-900"
                                : "border-white/20 bg-white/5 text-white"
                            }`}
                            placeholder="COD001"
                          />
                        </div>
                        <div className="col-span-4">
                          <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            Descripción
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                            className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                              isLight
                                ? "border-gray-300 bg-white text-gray-900"
                                : "border-white/20 bg-white/5 text-white"
                            }`}
                            placeholder="Nombre del producto/servicio"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            Cant.
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)}
                            className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                              isLight
                                ? "border-gray-300 bg-white text-gray-900"
                                : "border-white/20 bg-white/5 text-white"
                            }`}
                            min="1"
                            step="1"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            Precio Unit.
                          </label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleItemChange(index, "price", parseFloat(e.target.value) || 0)}
                            className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                              isLight
                                ? "border-gray-300 bg-white text-gray-900"
                                : "border-white/20 bg-white/5 text-white"
                            }`}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            Descuento
                          </label>
                          <input
                            type="number"
                            value={item.discount}
                            onChange={(e) => handleItemChange(index, "discount", parseFloat(e.target.value) || 0)}
                            className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                              isLight
                                ? "border-gray-300 bg-white text-gray-900"
                                : "border-white/20 bg-white/5 text-white"
                            }`}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            IVA %
                          </label>
                          <select
                            value={item.tax}
                            onChange={(e) => handleItemChange(index, "tax", parseFloat(e.target.value))}
                            className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                              isLight
                                ? "border-gray-300 bg-white text-gray-900"
                                : "border-white/20 bg-white/5 text-white"
                            }`}
                          >
                            <option value={0}>0%</option>
                            <option value={12}>12%</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            Subtotal
                          </label>
                          <input
                            type="text"
                            value={item.total.toFixed(2)}
                            disabled
                            className={`w-full px-3 py-1.5 rounded-lg text-sm border font-mono font-bold ${
                              isLight
                                ? "border-gray-300 bg-gray-100 text-gray-900"
                                : "border-white/20 bg-white/10 text-white"
                            }`}
                          />
                        </div>
                      </div>
                      {items.length > 1 && (
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className={`p-2 rounded-lg transition-colors mt-6 ${
                            isLight
                              ? "hover:bg-red-50 text-red-600"
                              : "hover:bg-red-500/10 text-red-500"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: Resumen */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h3 className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                Resumen de la Factura
              </h3>

              {/* Datos del Proveedor */}
              <div className={`border rounded-lg p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  PROVEEDOR EMISOR
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Razón Social:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{selectedProveedor?.razonSocial}</span>
                  </div>
                  <div>
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>RUC:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{selectedProveedor?.ruc}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Dirección:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{selectedProveedor?.direccion}</span>
                  </div>
                </div>
              </div>

              {/* Datos de la Factura */}
              <div className={`border rounded-lg p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  DATOS DE LA FACTURA
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Número:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{invoiceNumber}</span>
                  </div>
                  <div>
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{invoiceDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Clave de Acceso:</span>
                    <span className={`font-mono text-xs ${isLight ? "text-gray-900" : "text-white"}`}>{authorizationKey}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className={`border rounded-lg p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  ITEMS ({items.length})
                </h4>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className={`text-sm p-2 rounded ${isLight ? "bg-white" : "bg-white/5"}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{item.name}</span>
                          <span className={`text-xs ml-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}>({item.code})</span>
                        </div>
                        <span className={`font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                          ${item.total.toFixed(2)}
                        </span>
                      </div>
                      <div className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        {item.quantity} x ${item.price.toFixed(2)} - Desc: ${item.discount.toFixed(2)} - IVA: {item.tax}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className={`border rounded-lg p-4 ${isLight ? "bg-orange-50 border-primary/30" : "bg-primary/10 border-primary/30"}`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  TOTALES
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>Subtotal 12%:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${subtotal12.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>Subtotal 0%:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${subtotal0.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>Descuento:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>IVA 12%:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${tax.toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between pt-2 border-t ${isLight ? "border-primary/20" : "border-white/20"}`}>
                    <span className={`font-bold ${isLight ? "text-darkBg" : "text-white"}`}>TOTAL:</span>
                    <span className={`font-mono font-bold text-lg text-primary`}>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
          <button
            onClick={currentStep === 1 ? onClose : handlePrevious}
            disabled={isSaving}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLight
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            {currentStep === 1 ? "Cancelar" : "Anterior"}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity ${
                !selectedProveedor && currentStep === 1
                  ? isLight
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:opacity-90"
              }`}
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:opacity-90 transition-opacity"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Guardar y Autorizar
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}