import { useState, useEffect, useRef } from "react";
import { X, FileText, Receipt, Check, Loader2, ChevronRight, Search, CheckCircle2, Shield, Send } from "lucide-react";
import { toast } from "sonner";

// Iconos de archivos específicos
const FileCheck = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FileSignature = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

interface CreateRetentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (retention: any) => void;
  isLight: boolean;
  categoria: "compras" | "ventas";
  suppliers: Array<{ id: string; name: string; ruc: string; address: string }>;
  invoices: Array<{ id: string; number: string; date: string; supplierName: string; total: number; supplierRuc?: string }>;
}

const RETENTION_CODES = {
  Fuente: [
    { code: "1", description: "Honorarios profesionales y dietas", percentage: 10 },
    { code: "2", description: "Servicios predomina intelecto", percentage: 8 },
    { code: "303", description: "Compra bienes/servicios no sujetos a retención", percentage: 1 },
    { code: "304", description: "Transporte privado pasajeros o servicio público/privado carga", percentage: 1 },
    { code: "307", description: "Compra bienes/servicios >$50 actividades agrícolas/similares", percentage: 1 },
    { code: "308", description: "Compra bienes/servicios personas naturales sin RUC", percentage: 2 },
    { code: "309", description: "Arrendamiento mercantil inmuebles personas naturales", percentage: 8 },
    { code: "310", description: "Arrendamiento mercantil inmuebles sociedades", percentage: 2 },
    { code: "312", description: "Seguros y reaseguros (primas y cesiones)", percentage: 1 },
    { code: "320", description: "Compra local de Banano a productor", percentage: 1 },
  ],
  IVA: [
    { code: "9", description: "Retención 10% IVA Servicios", percentage: 10 },
    { code: "10", description: "Retención 20% IVA Servicios", percentage: 20 },
    { code: "1", description: "Retención 30% IVA Bienes", percentage: 30 },
    { code: "2", description: "Retención 70% IVA Servicios", percentage: 70 },
    { code: "3", description: "Retención 100% IVA Bienes", percentage: 100 },
    { code: "4", description: "Retención 100% IVA Servicios", percentage: 100 },
  ],
};

const STEPS = [
  { id: 1, label: "Factura" },
  { id: 2, label: "Detalles" },
  { id: 3, label: "SRI" },
];

export function CreateRetentionModal({
  isOpen,
  onClose,
  onSave,
  isLight,
  categoria,
  suppliers,
  invoices,
}: CreateRetentionModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [sriStep, setSriStep] = useState(0);
  const [retentionNumber, setRetentionNumber] = useState("");
  
  // Control para evitar re-ejecuciones del proceso SRI
  const sriProcessStarted = useRef(false);

  // Paso 1: Selección de Factura
  const [searchInvoice, setSearchInvoice] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Paso 2: Detalles de retención
  const [retentionType, setRetentionType] = useState<"Fuente" | "IVA">("Fuente");
  const [selectedCode, setSelectedCode] = useState("");
  const [taxBase, setTaxBase] = useState("");
  const [percentage, setPercentage] = useState("");
  const [retentionValue, setRetentionValue] = useState("");

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSriStep(0);
      setRetentionNumber("");
      setSearchInvoice("");
      setSelectedInvoice(null);
      setRetentionType("Fuente");
      setSelectedCode("");
      setTaxBase("");
      setPercentage("");
      setRetentionValue("");
      sriProcessStarted.current = false;
    }
  }, [isOpen]);

  // Calcular valor retenido automáticamente
  useEffect(() => {
    if (taxBase && percentage) {
      const base = parseFloat(taxBase) || 0;
      const perc = parseFloat(percentage) || 0;
      const value = (base * perc) / 100;
      setRetentionValue(value.toFixed(2));
    }
  }, [taxBase, percentage]);

  // Auto-rellenar porcentaje cuando se selecciona un código
  useEffect(() => {
    if (selectedCode) {
      const codes = RETENTION_CODES[retentionType];
      const code = codes.find((c) => c.code === selectedCode);
      if (code) {
        setPercentage(code.percentage.toString());
      }
    }
  }, [selectedCode, retentionType]);

  // Simular proceso SRI cuando se llega al paso 3
  useEffect(() => {
    if (step === 3 && sriStep === 0 && !sriProcessStarted.current) {
      // Marcar que el proceso SRI ha comenzado INMEDIATAMENTE
      sriProcessStarted.current = true;
      
      // Generar número de retención
      const newRetentionNumber = `007-001-${String(Math.floor(Math.random() * 100000)).padStart(6, "0")}`;
      setRetentionNumber(newRetentionNumber);

      // Capturar valores actuales para usar en el closure
      const currentRetentionType = retentionType;
      const currentSelectedCode = selectedCode;
      const currentSelectedInvoice = selectedInvoice;
      const currentTaxBase = taxBase;
      const currentPercentage = percentage;
      const currentRetentionValue = retentionValue;

      // Iniciar proceso automático
      setSriStep(1);
      const timer2 = setTimeout(() => setSriStep(2), 1000);
      const timer3 = setTimeout(() => setSriStep(3), 2000);
      const timer4 = setTimeout(() => setSriStep(4), 3000);
      const timer5 = setTimeout(() => setSriStep(5), 4000);

      // Cuando termine el proceso SRI, guardar y cerrar después de 2s
      const timerSave = setTimeout(() => {
        const codeData = RETENTION_CODES[currentRetentionType].find(
          (c) => c.code === currentSelectedCode
        );
        
        // Buscar datos del proveedor
        const supplier = suppliers.find(s => s.name === currentSelectedInvoice?.supplierName);
        
        const retention = {
          id: `RET-${Date.now()}`,
          num: newRetentionNumber,
          clave_acceso: `${Math.floor(Math.random() * 10000000000000000000)}`.padStart(49, "0"),
          fecha: new Date().toISOString().slice(0, 10),
          emisor_razon: "TicSoftEc S.A.",
          emisor_ruc: "1792345678001",
          emisor_dir: "Av. Principal 123, Quito",
          emisor_telefono: "02-2345678",
          emisor_email: "facturacion@ticsoftec.com.ec",
          contribuyente: currentSelectedInvoice?.supplierName || "",
          ruc: supplier?.ruc || "9999999999001",
          direccion_sujeto: supplier?.address || "",
          telefono_sujeto: "",
          comprobante: currentSelectedInvoice?.number || "",
          fecha_comprobante: currentSelectedInvoice?.date || new Date().toISOString().slice(0, 10),
          detalles: [
            {
              codigo: currentSelectedCode,
              concepto: codeData?.description || "",
              tipo: currentRetentionType,
              base_imponible: parseFloat(currentTaxBase) || 0,
              porcentaje: parseFloat(currentPercentage) || 0,
              valor_retenido: parseFloat(currentRetentionValue) || 0,
            },
          ],
          estado: "autorizada" as const,
          categoria: categoria,
          autorizacion_sri: `${Math.floor(Math.random() * 10000000000)}`.padStart(49, "0"),
          ambiente: "Producción" as const,
          total_retenido: parseFloat(currentRetentionValue) || 0,
        };

        onSave(retention);
        toast.success("✓ Retención creada y autorizada por el SRI");
        
        // Limpiar estados antes de cerrar
        setStep(1);
        setSriStep(0);
        setRetentionNumber("");
        setSearchInvoice("");
        setSelectedInvoice(null);
        setRetentionType("Fuente");
        setSelectedCode("");
        setTaxBase("");
        setPercentage("");
        setRetentionValue("");
        
        // Cerrar modal
        setTimeout(() => onClose(), 500);
      }, 6000);

      return () => {
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
        clearTimeout(timerSave);
      };
    }
  }, [step]);

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.number?.toLowerCase().includes(searchInvoice?.toLowerCase() || "") ||
      inv.supplierName?.toLowerCase().includes(searchInvoice?.toLowerCase() || "") ||
      inv.supplierRuc?.includes(searchInvoice || "")
  );

  const canProceedStep1 = selectedInvoice;
  const canProceedStep2 = selectedCode && taxBase && percentage && retentionValue;

  if (!isOpen) return null;

  // Obtener proveedor de la factura seleccionada
  const selectedSupplier = selectedInvoice 
    ? suppliers.find(s => s.name === selectedInvoice.supplierName)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div
        className={`relative w-full max-w-3xl rounded-xl shadow-2xl ${
          isLight ? "bg-white" : "bg-[#0d1724]"
        }`}
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between flex-shrink-0 ${
            isLight ? "border-gray-200" : "border-white/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2
                className={`text-lg font-bold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Nueva Retención
              </h2>
              <p
                className={`text-xs mt-0.5 ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Paso {step} de 3
              </p>
            </div>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isLight
                  ? "hover:bg-gray-100 text-gray-600"
                  : "hover:bg-white/5 text-gray-400"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Horizontal */}
        <div className={`px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center justify-between">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step === s.id
                        ? "bg-primary text-white"
                        : step > s.id
                        ? "bg-green-500 text-white"
                        : isLight
                        ? "bg-gray-200 text-gray-500"
                        : "bg-white/10 text-gray-500"
                    }`}
                  >
                    {step > s.id ? "✓" : s.id}
                  </div>
                  <p
                    className={`text-xs font-medium mt-2 ${
                      step === s.id
                        ? isLight
                          ? "text-gray-900"
                          : "text-white"
                        : isLight
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    {s.label}
                  </p>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition-all ${
                      step > s.id
                        ? "bg-green-500"
                        : isLight
                        ? "bg-gray-300"
                        : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* STEP 1: Seleccionar Factura */}
          {step === 1 && (
            <div className="space-y-5">
              <h3
                className={`text-sm font-semibold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Seleccionar Factura
              </h3>

              {/* Buscador */}
              <div className="relative">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isLight ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                  placeholder="Buscar por número, cliente o RUC..."
                  autoFocus
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors ${
                    isLight
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
              </div>

              {/* Estado vacío o lista de facturas */}
              {searchInvoice === "" && !selectedInvoice ? (
                <div
                  className={`border rounded-lg p-12 text-center ${
                    isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                  }`}
                >
                  <Search
                    className={`w-16 h-16 mx-auto mb-4 ${
                      isLight ? "text-gray-300" : "text-gray-700"
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Busca una factura
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isLight ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Escribe el número de factura, cliente o RUC
                  </p>
                </div>
              ) : searchInvoice !== "" && !selectedInvoice && (
                <div
                  className={`border rounded-lg overflow-hidden ${
                    isLight ? "border-gray-200" : "border-white/10"
                  }`}
                >
                  <div
                    className={`px-4 py-2 border-b ${
                      isLight
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <p
                      className={`text-xs font-medium ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {filteredInvoices.length} factura(s) encontrada(s)
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setSearchInvoice("");
                            setTaxBase(invoice.total.toString());
                          }}
                          className={`px-4 py-3 border-b cursor-pointer transition-colors ${
                            selectedInvoice?.id === invoice.id
                              ? isLight
                                ? "bg-primary/10 border-primary/20"
                                : "bg-primary/20 border-primary/30"
                              : isLight
                              ? "hover:bg-gray-50 border-gray-100"
                              : "hover:bg-white/5 border-white/5"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText
                                  className={`w-4 h-4 flex-shrink-0 ${
                                    isLight ? "text-gray-600" : "text-gray-400"
                                  }`}
                                />
                                <p
                                  className={`font-mono text-sm font-semibold ${
                                    isLight ? "text-gray-900" : "text-white"
                                  }`}
                                >
                                  {invoice.number}
                                </p>
                              </div>
                              <p
                                className={`text-xs ${
                                  isLight ? "text-gray-600" : "text-gray-400"
                                }`}
                              >
                                {invoice.supplierName}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <p
                                  className={`text-xs ${
                                    isLight ? "text-gray-500" : "text-gray-500"
                                  }`}
                                >
                                  {invoice.date}
                                </p>
                                <p
                                  className={`text-xs font-semibold ${
                                    isLight ? "text-gray-900" : "text-white"
                                  }`}
                                >
                                  ${invoice.total.toFixed(2)}
                                </p>
                              </div>
                            </div>
                            {selectedInvoice?.id === invoice.id && (
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <p
                          className={`text-sm ${
                            isLight ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          No se encontraron facturas
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedInvoice && (
                <div
                  className={`p-4 rounded-lg border ${
                    isLight
                      ? "bg-blue-50 border-blue-200"
                      : "bg-blue-500/10 border-blue-500/20"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isLight ? "text-blue-900" : "text-blue-300"
                    }`}
                  >
                    ✓ Factura seleccionada:{" "}
                    <span className="font-mono">{selectedInvoice.number}</span>
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isLight ? "text-blue-700" : "text-blue-400"
                    }`}
                  >
                    {selectedInvoice.supplierName} • ${selectedInvoice.total.toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Detalles de Retención */}
          {step === 2 && selectedInvoice && (
            <div className="space-y-5">
              <h3
                className={`text-sm font-semibold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Detalles de la Retención
              </h3>

              {/* Info de la factura */}
              <div
                className={`p-4 rounded-lg border ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div
                      className={`text-xs mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {categoria === "compras" ? "Proveedor" : "Cliente"}:
                    </div>
                    <div
                      className={`font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {selectedInvoice.supplierName}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-xs mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      RUC:
                    </div>
                    <div
                      className={`font-mono ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {selectedSupplier?.ruc || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-xs mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Factura:
                    </div>
                    <div
                      className={`font-mono ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {selectedInvoice.number}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-xs mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Total:
                    </div>
                    <div
                      className={`font-mono font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      ${selectedInvoice.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tipo de Retención */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Tipo de Retención *
                </label>
                <div
                  className={`flex gap-2 p-1 rounded-lg ${
                    isLight ? "bg-gray-100" : "bg-white/5"
                  }`}
                >
                  {(["Fuente", "IVA"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setRetentionType(type);
                        setSelectedCode("");
                        setPercentage("");
                      }}
                      className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                        retentionType === type
                          ? "bg-primary text-white"
                          : isLight
                          ? "text-gray-600 hover:bg-gray-200"
                          : "text-gray-400 hover:bg-white/5"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Código de Retención */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Código de Retención *
                </label>
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors ${
                    isLight
                      ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                >
                  <option value="">Seleccione un código...</option>
                  {RETENTION_CODES[retentionType].map((code) => (
                    <option key={code.code} value={code.code}>
                      {code.code} - {code.description} ({code.percentage}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Base Imponible */}
              <div>
                <label
                  className={`block text-sm font-semibold mb-2 ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Base Imponible *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={taxBase}
                  onChange={(e) => setTaxBase(e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono ${
                    isLight
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500"
                  }`}
                />
              </div>

              {/* Porcentaje y Valor Retenido */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Porcentaje (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="0.00"
                    readOnly
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono ${
                      isLight
                        ? "bg-gray-100 border-gray-300 text-gray-700"
                        : "bg-white/5 border-white/10 text-gray-300"
                    }`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Valor Retenido
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={retentionValue}
                    readOnly
                    placeholder="0.00"
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono font-bold ${
                      isLight
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-green-500/10 border-green-500/30 text-green-400"
                    }`}
                  />
                </div>
              </div>

              {/* Resumen */}
              <div
                className={`p-4 rounded-lg border ${
                  isLight
                    ? "bg-primary/5 border-primary/20"
                    : "bg-primary/10 border-primary/30"
                }`}
              >
                <p
                  className={`text-xs font-medium mb-2 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Resumen de Retención:
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span
                      className={isLight ? "text-gray-700" : "text-gray-300"}
                    >
                      Tipo:
                    </span>
                    <span
                      className={`font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {retentionType}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isLight ? "text-gray-700" : "text-gray-300"}
                    >
                      Base:
                    </span>
                    <span
                      className={`font-mono ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      ${taxBase || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={isLight ? "text-gray-700" : "text-gray-300"}
                    >
                      % Retención:
                    </span>
                    <span
                      className={`font-mono ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {percentage || "0"}%
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-primary/30">
                    <span
                      className={`font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Total Retenido:
                    </span>
                    <span className="font-mono font-bold text-primary text-lg">
                      ${retentionValue || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Autorización SRI */}
          {step === 3 && (
            <div className="space-y-5">
              <h3
                className={`text-sm font-semibold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Proceso de Autorización SRI
              </h3>

              {/* Info de la Retención */}
              <div
                className={`p-4 rounded-lg border ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div
                      className={`text-xs mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Número de Retención:
                    </div>
                    <div
                      className={`font-mono text-sm font-bold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {retentionNumber}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-xs mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Tipo:
                    </div>
                    <div
                      className={`font-semibold text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {retentionType}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-xs mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {categoria === "compras" ? "Proveedor" : "Cliente"}:
                    </div>
                    <div
                      className={`text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {selectedInvoice?.supplierName}
                    </div>
                  </div>
                  <div>
                    <div
                      className={`text-xs mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Valor Retenido:
                    </div>
                    <div
                      className={`font-mono text-sm font-bold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      ${retentionValue}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div
                      className={`text-xs mb-1 ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Factura Ref:
                    </div>
                    <div
                      className={`font-mono text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {selectedInvoice?.number}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stepper Horizontal de Proceso SRI */}
              <div
                className={`p-5 rounded-lg border ${
                  isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  {/* Paso 1: Validando XML */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        sriStep >= 1
                          ? sriStep === 1
                            ? "border-primary bg-primary/10"
                            : "border-green-500 bg-green-500/10"
                          : isLight
                          ? "border-gray-300 bg-gray-100"
                          : "border-white/20 bg-white/5"
                      }`}
                    >
                      {sriStep > 1 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : sriStep === 1 ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileText
                          className={`w-6 h-6 ${
                            isLight ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`text-xs font-medium text-center ${
                        sriStep >= 1
                          ? isLight
                            ? "text-gray-900"
                            : "text-white"
                          : isLight
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Validando
                      <br />
                      XML
                    </div>
                  </div>

                  {/* Línea conectora 1 */}
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      sriStep > 1
                        ? "bg-green-500"
                        : isLight
                        ? "bg-gray-300"
                        : "bg-white/10"
                    }`}
                  />

                  {/* Paso 2: Validación Estructura */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        sriStep >= 2
                          ? sriStep === 2
                            ? "border-primary bg-primary/10"
                            : "border-green-500 bg-green-500/10"
                          : isLight
                          ? "border-gray-300 bg-gray-100"
                          : "border-white/20 bg-white/5"
                      }`}
                    >
                      {sriStep > 2 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : sriStep === 2 ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileCheck
                          className={`w-6 h-6 ${
                            isLight ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`text-xs font-medium text-center ${
                        sriStep >= 2
                          ? isLight
                            ? "text-gray-900"
                            : "text-white"
                          : isLight
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Validación
                      <br />
                      Estructura
                    </div>
                  </div>

                  {/* Línea conectora 2 */}
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      sriStep > 2
                        ? "bg-green-500"
                        : isLight
                        ? "bg-gray-300"
                        : "bg-white/10"
                    }`}
                  />

                  {/* Paso 3: Firma Electrónica */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        sriStep >= 3
                          ? sriStep === 3
                            ? "border-primary bg-primary/10"
                            : "border-green-500 bg-green-500/10"
                          : isLight
                          ? "border-gray-300 bg-gray-100"
                          : "border-white/20 bg-white/5"
                      }`}
                    >
                      {sriStep > 3 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : sriStep === 3 ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FileSignature
                          className={`w-6 h-6 ${
                            isLight ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`text-xs font-medium text-center ${
                        sriStep >= 3
                          ? isLight
                            ? "text-gray-900"
                            : "text-white"
                          : isLight
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Firma
                      <br />
                      Electrónica
                    </div>
                  </div>

                  {/* Línea conectora 3 */}
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      sriStep > 3
                        ? "bg-green-500"
                        : isLight
                        ? "bg-gray-300"
                        : "bg-white/10"
                    }`}
                  />

                  {/* Paso 4: Enviando al SRI */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        sriStep >= 4
                          ? sriStep === 4
                            ? "border-primary bg-primary/10"
                            : "border-green-500 bg-green-500/10"
                          : isLight
                          ? "border-gray-300 bg-gray-100"
                          : "border-white/20 bg-white/5"
                      }`}
                    >
                      {sriStep > 4 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : sriStep === 4 ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send
                          className={`w-6 h-6 ${
                            isLight ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`text-xs font-medium text-center ${
                        sriStep >= 4
                          ? isLight
                            ? "text-gray-900"
                            : "text-white"
                          : isLight
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Enviando
                      <br />
                      al SRI
                    </div>
                  </div>

                  {/* Línea conectora 4 */}
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      sriStep > 4
                        ? "bg-green-500"
                        : isLight
                        ? "bg-gray-300"
                        : "bg-white/10"
                    }`}
                  />

                  {/* Paso 5: Autorización SRI */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        sriStep >= 5
                          ? "border-green-500 bg-green-500/10"
                          : isLight
                          ? "border-gray-300 bg-gray-100"
                          : "border-white/20 bg-white/5"
                      }`}
                    >
                      {sriStep >= 5 ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Shield
                          className={`w-6 h-6 ${
                            isLight ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                      )}
                    </div>
                    <div
                      className={`text-xs font-medium text-center ${
                        sriStep >= 5
                          ? isLight
                            ? "text-gray-900"
                            : "text-white"
                          : isLight
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      Autorización
                      <br />
                      SRI
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de éxito */}
              {sriStep >= 5 && (
                <div
                  className={`p-4 rounded-lg border ${
                    isLight
                      ? "bg-green-50 border-green-200"
                      : "bg-green-500/10 border-green-500/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <div
                        className={`font-bold text-sm ${
                          isLight ? "text-green-700" : "text-green-500"
                        }`}
                      >
                        ¡Retención autorizada exitosamente!
                      </div>
                      <div
                        className={`text-xs ${
                          isLight ? "text-green-600" : "text-green-400"
                        }`}
                      >
                        La retención ha sido procesada y autorizada por el SRI
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 3 && (
          <div
            className={`px-6 py-4 border-t flex items-center justify-end gap-3 flex-shrink-0 ${
              isLight ? "bg-gray-50 border-gray-200" : "bg-[#0a0f1a] border-white/10"
            }`}
          >
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

            <button
              onClick={() => {
                if (step === 1 && canProceedStep1) {
                  setStep(2);
                } else if (step === 2 && canProceedStep2) {
                  setStep(3);
                }
              }}
              disabled={
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2)
              }
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                (step === 1 && canProceedStep1) || (step === 2 && canProceedStep2)
                  ? isLight
                    ? "bg-gray-300 hover:bg-gray-400 text-gray-700 shadow-sm"
                    : "bg-gray-600 hover:bg-gray-500 text-white shadow-sm"
                  : isLight
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}