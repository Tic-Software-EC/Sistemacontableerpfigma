import { useState, useEffect } from "react";
import { X, FileText, Search, AlertCircle, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
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
interface CreatePurchaseDebitNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: any) => void;
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export function CreatePurchaseDebitNoteModal({ isOpen, onClose, onSave }: CreatePurchaseDebitNoteModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados de navegación
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de búsqueda de proveedor
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState<any>(null);

  // Estados de datos básicos
  const [noteNumber, setNoteNumber] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [authorizationKey, setAuthorizationKey] = useState("");

  // Estados de detalles
  const [referenceInvoice, setReferenceInvoice] = useState("");
  const [reason, setReason] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

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
      setNoteNumber("");
      setNoteDate("");
      setAuthorizationKey("");
      setReferenceInvoice("");
      setReason("");
      setSubtotal(0);
      setTax(0);
      setTotal(0);
    }
  }, [isOpen]);

  // Recalcular total cuando cambia el subtotal
  useEffect(() => {
    const calculatedTax = subtotal * 0.12;
    const calculatedTotal = subtotal + calculatedTax;
    setTax(calculatedTax);
    setTotal(calculatedTotal);
  }, [subtotal]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedProveedor) {
        toast.error("Selecciona un proveedor emisor");
        return;
      }
      if (!noteNumber.trim()) {
        toast.error("Ingresa el número de nota de débito");
        return;
      }
      if (!noteDate) {
        toast.error("Selecciona la fecha de emisión");
        return;
      }
      if (!authorizationKey.trim() || authorizationKey.length !== 49) {
        toast.error("Ingresa la clave de acceso completa (49 dígitos)");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!referenceInvoice.trim()) {
        toast.error("Ingresa la factura de referencia");
        return;
      }
      if (!reason.trim()) {
        toast.error("Ingresa el motivo de la nota de débito");
        return;
      }
      if (subtotal <= 0) {
        toast.error("Ingresa un monto válido");
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

    const newNote = {
      id: Date.now().toString(),
      noteNumber,
      date: noteDate,
      time: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      referenceInvoice,
      supplier: {
        name: selectedProveedor.razonSocial,
        ruc: selectedProveedor.ruc,
        address: selectedProveedor.direccion,
      },
      reason,
      subtotal,
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
      ambiente: "Pruebas",
      periodo_fiscal: new Date().toLocaleDateString("es-EC", { month: "2-digit", year: "numeric" }),
    };

    onSave(newNote);
    toast.success("✓ Nota de débito de compra registrada correctamente");

    await new Promise(resolve => setTimeout(resolve, 1000));
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
        <div className="flex items-start justify-between px-6 py-5 border-b" style={{ borderColor: isLight ? "#e5e7eb" : "rgba(255,255,255,0.1)" }}>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                Registrar Nota de Débito de Compra
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
                Detalles
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

              {/* Datos de la Nota de Débito (se muestra cuando hay proveedor seleccionado) */}
              {selectedProveedor && (
                <div className="space-y-4">
                  <h3 className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                    Datos de la Nota de Débito
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Número de ND *
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
                    <p className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      {authorizationKey.length}/49 dígitos
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASO 2: Detalles */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <h3 className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                Detalles de la Nota de Débito
              </h3>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Factura de Referencia *
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
                  Motivo *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-1.5 rounded-lg text-sm border resize-none ${
                    isLight
                      ? "border-gray-300 bg-white text-gray-900"
                      : "border-white/20 bg-white/5 text-white"
                  }`}
                  placeholder="Ej: Intereses por mora en pago"
                />
              </div>

              <div>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  VALORES
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Subtotal *
                    </label>
                    <input
                      type="number"
                      value={subtotal}
                      onChange={(e) => setSubtotal(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "border-gray-300 bg-white text-gray-900"
                          : "border-white/20 bg-white/5 text-white"
                      }`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      IVA 12%
                    </label>
                    <input
                      type="text"
                      value={tax.toFixed(2)}
                      disabled
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border font-mono ${
                        isLight
                          ? "border-gray-300 bg-gray-100 text-gray-900"
                          : "border-white/20 bg-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Total
                    </label>
                    <input
                      type="text"
                      value={total.toFixed(2)}
                      disabled
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border font-mono font-bold ${
                        isLight
                          ? "border-gray-300 bg-gray-100 text-gray-900"
                          : "border-white/20 bg-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: Resumen */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <h3 className={`text-base font-bold ${isLight ? "text-darkBg" : "text-white"}`}>
                Resumen de la Nota de Débito
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

              {/* Datos de la ND */}
              <div className={`border rounded-lg p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  DATOS DE LA NOTA DE DÉBITO
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Número:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{noteNumber}</span>
                  </div>
                  <div>
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{noteDate}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Clave de Acceso:</span>
                    <span className={`font-mono text-xs ${isLight ? "text-gray-900" : "text-white"}`}>{authorizationKey}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`block text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Factura de Referencia:</span>
                    <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{referenceInvoice}</span>
                  </div>
                </div>
              </div>

              {/* Motivo */}
              <div className={`border rounded-lg p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`text-sm font-bold mb-2 ${isLight ? "text-darkBg" : "text-white"}`}>
                  MOTIVO
                </h4>
                <p className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{reason}</p>
              </div>

              {/* Totales */}
              <div className={`border rounded-lg p-4 ${isLight ? "bg-orange-50 border-primary/30" : "bg-primary/10 border-primary/30"}`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-darkBg" : "text-white"}`}>
                  TOTALES
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>Subtotal:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>${subtotal.toFixed(2)}</span>
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