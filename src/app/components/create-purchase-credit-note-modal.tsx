import { useState, useEffect } from "react";
import { X, Search, ArrowRight, FileText, Package, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
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
interface CreatePurchaseCreditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: any) => void;
}

interface Item {
  codigo: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═════════════════════════════════════════════════════════════════════ */
export function CreatePurchaseCreditNoteModal({ isOpen, onClose, onSave }: CreatePurchaseCreditNoteModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados del wizard
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Paso 1: Proveedor y datos básicos
  const [selectedProveedor, setSelectedProveedor] = useState<any>(null);
  const [noteNumber, setNoteNumber] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [authorizationKey, setAuthorizationKey] = useState("");
  const [referenceInvoice, setReferenceInvoice] = useState("");
  const [motivo, setMotivo] = useState("");
  
  // Paso 2: Items
  const [items, setItems] = useState<Item[]>([
    { codigo: "", descripcion: "", cantidad: 1, precioUnitario: 0, descuento: 0, subtotal: 0 }
  ]);

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setSearchQuery("");
      setSelectedProveedor(null);
      setNoteNumber("");
      setNoteDate("");
      setAuthorizationKey("");
      setReferenceInvoice("");
      setMotivo("");
      setItems([{ codigo: "", descripcion: "", cantidad: 1, precioUnitario: 0, descuento: 0, subtotal: 0 }]);
    }
  }, [isOpen]);

  // Filtrar proveedores por búsqueda
  const filteredProveedores = PROVEEDORES_MOCK.filter(p => 
    p.razonSocial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nombreComercial.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.ruc.includes(searchQuery)
  );

  // Calcular totales
  const calcularTotales = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const iva = subtotal * 0.12;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const { subtotal, iva, total } = calcularTotales();

  // Validaciones por paso
  const canGoNext = () => {
    if (currentStep === 1) {
      return selectedProveedor && noteNumber.trim() && noteDate && authorizationKey.trim() && motivo.trim();
    }
    if (currentStep === 2) {
      return items.length > 0 && items.every(i => i.descripcion.trim() && i.cantidad > 0 && i.precioUnitario > 0);
    }
    return false;
  };

  // Navegar entre pasos
  const handleNext = () => {
    if (canGoNext()) {
      setCurrentStep(currentStep + 1);
    } else {
      if (currentStep === 1) {
        if (!selectedProveedor) toast.error("Seleccione un proveedor");
        else if (!noteNumber.trim()) toast.error("Ingrese el número de NC");
        else if (!noteDate) toast.error("Ingrese la fecha de emisión");
        else if (!authorizationKey.trim()) toast.error("Ingrese la clave de acceso");
        else if (!motivo.trim()) toast.error("Ingrese el motivo");
      } else if (currentStep === 2) {
        toast.error("Complete todos los ítems correctamente");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Agregar/eliminar items
  const handleAddItem = () => {
    setItems([...items, { codigo: "", descripcion: "", cantidad: 1, precioUnitario: 0, descuento: 0, subtotal: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalcular subtotal del item
    const item = newItems[index];
    const subtotalItem = (item.cantidad * item.precioUnitario) - item.descuento;
    newItems[index].subtotal = subtotalItem;

    setItems(newItems);
  };

  // Guardar nota de crédito
  const handleSave = () => {
    const newNote = {
      id: Date.now().toString(),
      noteNumber,
      date: noteDate,
      time: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      referenceInvoice: referenceInvoice || "N/A",
      supplier: {
        name: selectedProveedor.razonSocial,
        ruc: selectedProveedor.ruc,
        address: selectedProveedor.direccion,
        email: selectedProveedor.email,
        phone: selectedProveedor.telefono
      },
      reason: motivo,
      items: items.map(item => ({
        code: item.codigo,
        description: item.descripcion,
        quantity: item.cantidad,
        price: item.precioUnitario,
        discount: item.descuento,
        total: item.subtotal
      })),
      subtotal,
      tax: iva,
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
      ambiente: "Producción",
      periodo_fiscal: new Date().toLocaleDateString("es-EC", { month: "2-digit", year: "numeric" }),
    };

    onSave(newNote);
    toast.success("Nota de crédito de compra registrada correctamente");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={`w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] ${
          isLight ? "bg-white" : "bg-[#0D1B2A] border border-white/20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#E8692E20" }}>
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                Registrar Nota de Crédito de Compra
              </h2>
              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                Paso {currentStep} de 3
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight
                ? "hover:bg-gray-100 text-gray-600"
                : "hover:bg-white/10 text-gray-300"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indicadores de pasos */}
        <div className="px-6 py-5 border-b" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center justify-center gap-4">
            {/* Paso 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
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

            <div className={`h-px w-12 ${currentStep > 1 ? "bg-primary" : isLight ? "bg-gray-300" : "bg-white/10"}`}></div>

            {/* Paso 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
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
                Ítems
              </span>
            </div>

            <div className={`h-px w-12 ${currentStep > 2 ? "bg-primary" : isLight ? "bg-gray-300" : "bg-white/10"}`}></div>

            {/* Paso 3 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
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

              {/* Datos de la NC (se muestra cuando hay proveedor seleccionado) */}
              {selectedProveedor && (
                <div className="space-y-4">
                  <h3 className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                    Datos de la Nota de Crédito
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Número de NC *
                      </label>
                      <input
                        type="text"
                        value={noteNumber}
                        onChange={(e) => setNoteNumber(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                          isLight
                            ? "border-gray-300 bg-white text-gray-900"
                            : "border-white/20 bg-white/5 text-white"
                        }`}
                        placeholder="001-001-000001234"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Fecha de Emisión *
                      </label>
                      <input
                        type="date"
                        value={noteDate}
                        onChange={(e) => setNoteDate(e.target.value)}
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
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Factura de Referencia (opcional)
                    </label>
                    <input
                      type="text"
                      value={referenceInvoice}
                      onChange={(e) => setReferenceInvoice(e.target.value)}
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
                      Motivo de la NC *
                    </label>
                    <textarea
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      rows={2}
                      className={`w-full px-3 py-2 rounded-lg text-sm border resize-none ${
                        isLight
                          ? "border-gray-300 bg-white text-gray-900"
                          : "border-white/20 bg-white/5 text-white"
                      }`}
                      placeholder="Ej: Devolución de mercadería defectuosa"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: Ingresar Ítems */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                  Detalle de Ítems
                </h3>
                <button
                  onClick={handleAddItem}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-primary hover:opacity-90 transition-opacity"
                >
                  <Package className="w-3.5 h-3.5" />
                  Agregar Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}
                  >
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          Código
                        </label>
                        <input
                          type="text"
                          value={item.codigo}
                          onChange={(e) => handleItemChange(index, "codigo", e.target.value)}
                          className={`w-full px-2 py-1 rounded text-xs border ${
                            isLight
                              ? "border-gray-300 bg-white text-gray-900"
                              : "border-white/20 bg-white/5 text-white"
                          }`}
                          placeholder="PROD001"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          Descripción *
                        </label>
                        <input
                          type="text"
                          value={item.descripcion}
                          onChange={(e) => handleItemChange(index, "descripcion", e.target.value)}
                          className={`w-full px-2 py-1 rounded text-xs border ${
                            isLight
                              ? "border-gray-300 bg-white text-gray-900"
                              : "border-white/20 bg-white/5 text-white"
                          }`}
                          placeholder="Nombre del producto"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          Cantidad *
                        </label>
                        <input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => handleItemChange(index, "cantidad", parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 py-1 rounded text-xs border ${
                            isLight
                              ? "border-gray-300 bg-white text-gray-900"
                              : "border-white/20 bg-white/5 text-white"
                          }`}
                          min="1"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          P. Unitario *
                        </label>
                        <input
                          type="number"
                          value={item.precioUnitario}
                          onChange={(e) => handleItemChange(index, "precioUnitario", parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 py-1 rounded text-xs border ${
                            isLight
                              ? "border-gray-300 bg-white text-gray-900"
                              : "border-white/20 bg-white/5 text-white"
                          }`}
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          Descuento
                        </label>
                        <input
                          type="number"
                          value={item.descuento}
                          onChange={(e) => handleItemChange(index, "descuento", parseFloat(e.target.value) || 0)}
                          className={`w-full px-2 py-1 rounded text-xs border ${
                            isLight
                              ? "border-gray-300 bg-white text-gray-900"
                              : "border-white/20 bg-white/5 text-white"
                          }`}
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="col-span-1 flex flex-col">
                        <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          &nbsp;
                        </label>
                        {items.length > 1 && (
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="p-1.5 rounded text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
                      <div className="flex justify-end">
                        <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          Subtotal: 
                        </span>
                        <span className={`text-xs font-mono font-bold ml-2 ${isLight ? "text-darkBg" : "text-white"}`}>
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className={`mt-4 border rounded-lg p-4 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
                <div className="flex justify-between mb-2">
                  <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>Subtotal:</span>
                  <span className={`text-sm font-mono font-bold ${isLight ? "text-darkBg" : "text-white"}`}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>IVA 12%:</span>
                  <span className={`text-sm font-mono font-bold ${isLight ? "text-darkBg" : "text-white"}`}>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
                  <span className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>TOTAL NC:</span>
                  <span className="text-base font-mono font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Resumen */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className={`text-base font-bold mb-4 ${isLight ? "text-darkBg" : "text-white"}`}>
                  Resumen de la Nota de Crédito
                </h3>

                {/* Datos del Proveedor */}
                <div className={`border rounded-lg p-4 mb-4 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
                  <p className={`text-xs font-semibold mb-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>PROVEEDOR EMISOR</p>
                  <div className="space-y-1">
                    <p className={`font-bold text-sm ${isLight ? "text-darkBg" : "text-white"}`}>{selectedProveedor?.razonSocial}</p>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>RUC: {selectedProveedor?.ruc}</p>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>{selectedProveedor?.direccion}</p>
                  </div>
                </div>

                {/* Datos de la NC */}
                <div className={`border rounded-lg p-4 mb-4 ${isLight ? "border-primary/30 bg-orange-50" : "border-primary/30 bg-primary/10"}`}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className={`text-xs font-semibold mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>NÚMERO DE NC</p>
                      <p className={`font-mono font-bold text-sm ${isLight ? "text-darkBg" : "text-white"}`}>{noteNumber}</p>
                    </div>
                    <div>
                      <p className={`text-xs font-semibold mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>FECHA</p>
                      <p className={`font-bold text-sm ${isLight ? "text-darkBg" : "text-white"}`}>{noteDate}</p>
                    </div>
                    {referenceInvoice && (
                      <div className="col-span-2">
                        <p className={`text-xs font-semibold mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>FACTURA REFERENCIA</p>
                        <p className={`font-mono text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{referenceInvoice}</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <p className={`text-xs font-semibold mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>MOTIVO</p>
                      <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{motivo}</p>
                    </div>
                  </div>
                </div>

                {/* Resumen de Items */}
                <div className={`border rounded-lg p-4 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
                  <p className={`text-xs font-semibold mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>DETALLE ({items.length} ítems)</p>
                  <div className="space-y-2 mb-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          {item.cantidad}x {item.descripcion}
                        </span>
                        <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t space-y-2" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
                    <div className="flex justify-between text-sm">
                      <span className={isLight ? "text-gray-600" : "text-gray-400"}>Subtotal:</span>
                      <span className={`font-mono font-bold ${isLight ? "text-darkBg" : "text-white"}`}>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={isLight ? "text-gray-600" : "text-gray-400"}>IVA 12%:</span>
                      <span className={`font-mono font-bold ${isLight ? "text-darkBg" : "text-white"}`}>${iva.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
                      <span className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>TOTAL NC:</span>
                      <span className="text-lg font-mono font-bold text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
          <button
            onClick={currentStep === 1 ? onClose : handleBack}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLight
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            {currentStep === 1 ? "Cancelar" : "Atrás"}
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                canGoNext()
                  ? "bg-primary hover:bg-primary/90 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Registrar NC
            </button>
          )}
        </div>
      </div>
    </div>
  );
}