import { useState, useEffect, useRef } from "react";
import { X, Search, FileText, AlertTriangle, Shield, CheckCircle2, Send } from "lucide-react";
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

interface CancelRetentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isLight: boolean;
  retentions: Array<{
    id: string;
    num: string;
    fecha: string;
    contribuyente: string;
    ruc: string;
    total_retenido: number;
    estado: string;
  }>;
}

const CANCELLATION_REASONS = [
  { value: "", label: "Seleccione un motivo..." },
  { value: "emision_error", label: "Retención emitida por error" },
  { value: "datos_incorrectos", label: "Datos incorrectos en el documento" },
  { value: "duplicacion", label: "Duplicación del documento" },
  { value: "error_monto", label: "Error en el monto" },
  { value: "devolucion_mercancia", label: "Devolución de mercancía" },
  { value: "otros", label: "Otros (especificar)" },
];

const SRI_STEPS = [
  { id: "validando", label: "Validando XML" },
  { id: "firmando", label: "Firma Digital" },
  { id: "enviando", label: "Enviando al SRI" },
  { id: "recepcion", label: "Recepción SRI" },
  { id: "autorizando", label: "Autorización" },
];

export function CancelRetentionModal({ isOpen, onClose, onSave, isLight, retentions }: CancelRetentionModalProps) {
  const [step, setStep] = useState(1);
  const [searchRetention, setSearchRetention] = useState("");
  const [selectedRetention, setSelectedRetention] = useState<any | null>(null);
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  
  const [sriStep, setSriStep] = useState(0);
  const sriProcessStarted = useRef(false);

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSearchRetention("");
      setSelectedRetention(null);
      setReason("");
      setOtherReason("");
      setSriStep(0);
      sriProcessStarted.current = false;
    }
  }, [isOpen]);

  // Proceso SRI automático
  useEffect(() => {
    if (step === 3 && sriStep === 0 && !sriProcessStarted.current) {
      sriProcessStarted.current = true;
      
      // Iniciar proceso
      setSriStep(1);
      const timer2 = setTimeout(() => setSriStep(2), 1000);
      const timer3 = setTimeout(() => setSriStep(3), 2000);
      const timer4 = setTimeout(() => setSriStep(4), 3000);
      const timer5 = setTimeout(() => setSriStep(5), 4000);
      
      const timerSave = setTimeout(() => {
        const finalReason = reason === "otros" ? otherReason : CANCELLATION_REASONS.find(r => r.value === reason)?.label || "";
        onSave({
          retentionId: selectedRetention?.id,
          reason: finalReason,
        });
        toast.success("✓ Retención anulada exitosamente");
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

  const handleSelectRetention = (retention: any) => {
    setSelectedRetention(retention);
    setSearchRetention("");
  };

  const handleNext = () => {
    if (step === 1 && selectedRetention) {
      setStep(2);
    } else if (step === 2 && reason && (reason !== "otros" || otherReason.trim())) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setReason("");
      setOtherReason("");
    }
  };

  const canProceed = () => {
    if (step === 1) return !!selectedRetention;
    if (step === 2) return reason && (reason !== "otros" || otherReason.trim());
    return false;
  };

  const authorizedRetentions = retentions.filter(r => r.estado === "autorizada");
  const filteredRetentions = authorizedRetentions.filter(ret =>
    ret.num.toLowerCase().includes(searchRetention.toLowerCase()) ||
    ret.contribuyente.toLowerCase().includes(searchRetention.toLowerCase()) ||
    ret.ruc.includes(searchRetention)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div
        className={`relative w-full max-w-2xl rounded-xl shadow-2xl ${
          isLight ? "bg-white" : "bg-[#0d1724]"
        }`}
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Anular Retención
              </h2>
              <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                {step === 1 && "Paso 1: Seleccionar retención"}
                {step === 2 && "Paso 2: Motivo de anulación"}
                {step === 3 && "Paso 3: Proceso de anulación SRI"}
              </p>
            </div>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Stepper Horizontal Superior - 3 Pasos */}
          <div className="mb-6">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {/* Paso 1 */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                  step >= 1
                    ? "bg-primary text-white"
                    : isLight
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white/10 text-gray-500"
                }`}>
                  1
                </div>
                <span className={`text-xs font-medium ${
                  step >= 1
                    ? isLight ? "text-gray-900" : "text-white"
                    : isLight ? "text-gray-400" : "text-gray-500"
                }`}>
                  Retención
                </span>
              </div>

              {/* Línea 1 */}
              <div className={`h-0.5 flex-1 mx-2 transition-all ${
                step >= 2
                  ? "bg-primary"
                  : isLight
                  ? "bg-gray-300"
                  : "bg-white/10"
              }`} />

              {/* Paso 2 */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                  step >= 2
                    ? "bg-primary text-white"
                    : isLight
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white/10 text-gray-500"
                }`}>
                  2
                </div>
                <span className={`text-xs font-medium ${
                  step >= 2
                    ? isLight ? "text-gray-900" : "text-white"
                    : isLight ? "text-gray-400" : "text-gray-500"
                }`}>
                  Motivo
                </span>
              </div>

              {/* Línea 2 */}
              <div className={`h-0.5 flex-1 mx-2 transition-all ${
                step >= 3
                  ? "bg-primary"
                  : isLight
                  ? "bg-gray-300"
                  : "bg-white/10"
              }`} />

              {/* Paso 3 */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                  step >= 3
                    ? "bg-primary text-white"
                    : isLight
                    ? "bg-gray-200 text-gray-400"
                    : "bg-white/10 text-gray-500"
                }`}>
                  3
                </div>
                <span className={`text-xs font-medium ${
                  step >= 3
                    ? isLight ? "text-gray-900" : "text-white"
                    : isLight ? "text-gray-400" : "text-gray-500"
                }`}>
                  SRI
                </span>
              </div>
            </div>
          </div>

          {/* STEP 1: Buscar Retención */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Buscar Retención *
                </label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="text"
                    value={searchRetention}
                    onChange={(e) => setSearchRetention(e.target.value)}
                    placeholder="Número, contribuyente o RUC..."
                    autoFocus
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
              </div>

              {/* Banner de confirmación SI ya seleccionó */}
              {selectedRetention && (
                <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                  <p className={`text-sm font-medium ${isLight ? "text-blue-900" : "text-blue-300"}`}>
                    ✓ Retención seleccionada: <span className="font-mono">{selectedRetention.num}</span>
                  </p>
                  <p className={`text-xs mt-1 ${isLight ? "text-blue-700" : "text-blue-400"}`}>
                    {selectedRetention.contribuyente} • ${selectedRetention.total_retenido.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Lista de resultados O estado vacío: SOLO si NO hay selección */}
              {!selectedRetention && (
                <div className={`border rounded-lg overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  {searchRetention ? (
                    <>
                      <div className={`px-4 py-2 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                        <p className={`text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          {filteredRetentions.length} retención(es) encontrada(s)
                        </p>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {filteredRetentions.length > 0 ? (
                          filteredRetentions.map((ret) => (
                            <div
                              key={ret.id}
                              onClick={() => handleSelectRetention(ret)}
                              className={`px-4 py-3 border-b cursor-pointer transition-colors ${
                                isLight ? "hover:bg-gray-50 border-gray-100" : "hover:bg-white/5 border-white/5"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <FileText className={`w-4 h-4 flex-shrink-0 ${isLight ? "text-gray-600" : "text-gray-400"}`} />
                                    <p className={`font-mono text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                                      {ret.num}
                                    </p>
                                  </div>
                                  <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                    {ret.contribuyente} • RUC: {ret.ruc}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                                      {ret.fecha}
                                    </p>
                                    <p className={`text-xs font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                                      ${ret.total_retenido.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <Search className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-700"}`} />
                            <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                              No se encontraron retenciones
                            </p>
                            <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                              Intenta con otro criterio de búsqueda
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-12 text-center">
                      <Search className={`w-16 h-16 mx-auto mb-4 ${isLight ? "text-gray-300" : "text-gray-700"}`} />
                      <p className={`text-sm font-medium mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                        Busca una retención
                      </p>
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Escribe el número de retención, contribuyente o RUC
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Motivo */}
          {step === 2 && selectedRetention && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${isLight ? "bg-yellow-50 border-yellow-200" : "bg-yellow-500/10 border-yellow-500/20"}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? "text-yellow-600" : "text-yellow-500"}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isLight ? "text-yellow-900" : "text-yellow-300"}`}>
                      Está a punto de anular la siguiente retención:
                    </p>
                    <div className={`mt-2 space-y-1 text-xs ${isLight ? "text-yellow-800" : "text-yellow-400"}`}>
                      <p>• <strong>Número:</strong> {selectedRetention.num}</p>
                      <p>• <strong>Contribuyente:</strong> {selectedRetention.contribuyente}</p>
                      <p>• <strong>RUC:</strong> {selectedRetention.ruc}</p>
                      <p>• <strong>Fecha:</strong> {selectedRetention.fecha}</p>
                      <p>• <strong>Total:</strong> ${selectedRetention.total_retenido.toFixed(2)}</p>
                    </div>
                    <p className={`text-xs mt-1 ${isLight ? "text-yellow-700" : "text-yellow-400"}`}>
                      El documento será marcado como anulado y se notificará al SRI.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Motivo de Anulación *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors ${
                    isLight 
                      ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                >
                  {CANCELLATION_REASONS.map((r) => (
                    <option key={r.value} value={r.value} className={isLight ? "text-gray-900" : "text-white"}>
                      {r.label}
                    </option>
                  ))}
                </select>

                {reason === "otros" && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      placeholder="Especifique el motivo de anulación..."
                      autoFocus
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm ${
                        isLight 
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" 
                          : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500"
                      }`}
                    />
                  </div>
                )}
              </div>

              <div className={`p-3 rounded-lg border ${isLight ? "bg-red-50 border-red-200" : "bg-red-500/10 border-red-500/20"}`}>
                <div className="flex items-start gap-2">
                  <Shield className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-red-600" : "text-red-500"}`} />
                  <p className={`text-xs ${isLight ? "text-red-800" : "text-red-400"}`}>
                    <strong>Importante:</strong> Esta acción es irreversible. Una vez anulada la retención ante el SRI, 
                    no podrá volver a habilitarse.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Proceso SRI - MISMO DISEÑO QUE CREACIÓN */}
          {step === 3 && selectedRetention && (
            <div className="space-y-5">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Proceso de Anulación SRI
              </h3>

              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Número:
                    </div>
                    <div className={`font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {selectedRetention.num}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Contribuyente:
                    </div>
                    <div className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {selectedRetention.contribuyente}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Valor Retenido:
                    </div>
                    <div className={`font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${selectedRetention.total_retenido.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Fecha:
                    </div>
                    <div className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {selectedRetention.fecha}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stepper - IGUAL QUE CREACIÓN */}
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
                      sriStep >= 1
                        ? isLight ? "text-gray-900" : "text-white"
                        : isLight ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Validando
                      <br />
                      XML
                    </div>
                  </div>

                  {/* Línea conectora 1 */}
                  <div className={`h-0.5 flex-1 transition-all ${
                    sriStep > 1
                      ? "bg-green-500"
                      : isLight
                      ? "bg-gray-300"
                      : "bg-white/10"
                  }`} />

                  {/* Paso 2: Firma Digital */}
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
                      sriStep >= 2
                        ? isLight ? "text-gray-900" : "text-white"
                        : isLight ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Firma
                      <br />
                      Digital
                    </div>
                  </div>

                  {/* Línea conectora 2 */}
                  <div className={`h-0.5 flex-1 transition-all ${
                    sriStep > 2
                      ? "bg-green-500"
                      : isLight
                      ? "bg-gray-300"
                      : "bg-white/10"
                  }`} />

                  {/* Paso 3: Enviando al SRI */}
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
                        <Send className={`w-6 h-6 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      )}
                    </div>
                    <div className={`text-xs font-medium text-center ${
                      sriStep >= 3
                        ? isLight ? "text-gray-900" : "text-white"
                        : isLight ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Enviando
                      <br />
                      al SRI
                    </div>
                  </div>

                  {/* Línea conectora 3 */}
                  <div className={`h-0.5 flex-1 transition-all ${
                    sriStep > 3
                      ? "bg-green-500"
                      : isLight
                      ? "bg-gray-300"
                      : "bg-white/10"
                  }`} />

                  {/* Paso 4: Recepción SRI */}
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
                        <FileSignature className={`w-6 h-6 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      )}
                    </div>
                    <div className={`text-xs font-medium text-center ${
                      sriStep >= 4
                        ? isLight ? "text-gray-900" : "text-white"
                        : isLight ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Recepción
                      <br />
                      SRI
                    </div>
                  </div>

                  {/* Línea conectora 4 */}
                  <div className={`h-0.5 flex-1 transition-all ${
                    sriStep > 4
                      ? "bg-green-500"
                      : isLight
                      ? "bg-gray-300"
                      : "bg-white/10"
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
                      sriStep >= 5
                        ? isLight ? "text-gray-900" : "text-white"
                        : isLight ? "text-gray-400" : "text-gray-500"
                    }`}>
                      Autorización
                      <br />
                      SRI
                    </div>
                  </div>
                </div>
              </div>

              {sriStep >= 5 && (
                <div className={`p-4 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/30"}`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <div>
                      <div className={`font-bold text-sm ${isLight ? "text-green-700" : "text-green-500"}`}>
                        ¡Retención anulada exitosamente!
                      </div>
                      <div className={`text-xs ${isLight ? "text-green-600" : "text-green-400"}`}>
                        La anulación ha sido procesada y autorizada por el SRI
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
          <div className={`px-6 py-4 border-t flex items-center justify-between flex-shrink-0 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
            <button
              onClick={step === 1 ? onClose : handleBack}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLight 
                  ? "text-gray-700 hover:bg-gray-200" 
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {step === 1 ? "Cancelar" : "Atrás"}
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                canProceed()
                  ? "bg-red-600 hover:bg-red-700 text-white shadow-sm"
                  : isLight
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              {step === 1 ? "Continuar" : "Anular en SRI"}
            </button>
          </div>
        )}

        {/* Footer para Paso 3: Botón Finalizar */}
        {step === 3 && sriStep >= 5 && (
          <div className={`px-6 py-4 border-t flex items-center justify-end flex-shrink-0 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white shadow-sm transition-colors"
            >
              Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}