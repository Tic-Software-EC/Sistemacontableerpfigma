import { useState, useEffect } from "react";
import { X, FileCode, Shield, Send, CheckCircle2, Loader2, FileText } from "lucide-react";

interface SRIDebitProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (authData: any) => void;
  noteData: any;
  isLight: boolean;
}

type ProcessStep = {
  id: string;
  label: string;
  status: "pending" | "processing" | "completed" | "error";
  message?: string;
};

const genClave = () =>
  Array.from({ length: 49 }, () => Math.floor(Math.random() * 10)).join("");

export function SRIDebitProcessModal({ isOpen, onClose, onComplete, noteData, isLight }: SRIDebitProcessModalProps) {
  const [steps, setSteps] = useState<ProcessStep[]>([
    {
      id: "validate",
      label: "Validación de Datos",
      status: "pending",
    },
    {
      id: "xml",
      label: "Generación de XML",
      status: "pending",
    },
    {
      id: "sign",
      label: "Firma Electrónica",
      status: "pending",
    },
    {
      id: "send",
      label: "Envío al SRI",
      status: "pending",
    },
    {
      id: "authorize",
      label: "Autorización SRI",
      status: "pending",
    },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [authorizationNumber, setAuthorizationNumber] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSteps(steps.map(s => ({ ...s, status: "pending" as const, message: undefined })));
      setCurrentStepIndex(-1);
      setIsCompleted(false);
      setAuthorizationNumber("");
      return;
    }

    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStepIndex(i);
        
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "processing" as const } : s
        ));

        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 800));

        let message = "";
        if (i === 0) message = "Datos validados correctamente";
        if (i === 1) message = "XML generado según estándar SRI v1.0.0";
        if (i === 2) message = "Documento firmado electrónicamente";
        if (i === 3) message = "Enviado al SRI exitosamente";
        if (i === 4) {
          const claveAcceso = genClave();
          setAuthorizationNumber(claveAcceso);
          message = `Clave de acceso: ${claveAcceso.substring(0, 20)}...`;
        }

        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "completed" as const, message } : s
        ));
      }

      await new Promise(resolve => setTimeout(resolve, 500));
      setIsCompleted(true);
    };

    processSteps();
  }, [isOpen]);

  const handleFinish = () => {
    const authData = {
      authorizationNumber,
      sriStatus: "authorized" as const,
      sriAuthDate: new Date().toISOString().split('T')[0] + " " + new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
    };
    onComplete(authData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "bg-gradient-to-r from-purple-50 to-white border-purple-200" : "bg-gradient-to-r from-purple-500/10 to-[#0d1724] border-purple-500/20"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${isLight ? "bg-purple-100" : "bg-purple-500/20"}`}>
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Proceso de Autorización SRI
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Nota de Débito: <span className="font-mono">{noteData.noteNumber}</span>
                </p>
              </div>
            </div>
            {isCompleted && (
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/5 text-gray-400"}`}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className={`h-1.5 rounded-full overflow-hidden ${isLight ? "bg-gray-200" : "bg-white/10"}`}>
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500 ease-out"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className={`text-xs mt-2 text-center ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              {isCompleted ? "Proceso completado exitosamente" : `Paso ${currentStepIndex + 1} de ${steps.length}`}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = step.status === "completed";
              const isPending = step.status === "pending";
              const isProcessing = step.status === "processing";

              return (
                <div
                  key={step.id}
                  className={`relative flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                    isCompleted
                      ? isLight
                        ? "bg-gray-50"
                        : "bg-white/5"
                      : isProcessing
                      ? isLight
                        ? "bg-purple-50/50 shadow-sm"
                        : "bg-purple-500/5 shadow-sm"
                      : isLight
                      ? "bg-gray-50/50"
                      : "bg-white/[0.02]"
                  }`}
                >
                  {/* Step Number/Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-600 text-white"
                      : isProcessing
                      ? "bg-purple-600 text-white"
                      : isLight
                      ? "bg-gray-200 text-gray-500"
                      : "bg-white/10 text-gray-500"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${
                      isCompleted || isProcessing
                        ? isLight
                          ? "text-gray-900"
                          : "text-white"
                        : isLight
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}>
                      {step.label}
                    </div>
                    {step.message && (
                      <div className={`text-xs mt-1 ${
                        isCompleted
                          ? isLight
                            ? "text-green-700"
                            : "text-green-400"
                          : isLight
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}>
                        {step.message}
                      </div>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted && (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isLight ? "bg-green-100" : "bg-green-500/20"}`}>
                        <CheckCircle2 className={`w-4 h-4 ${isLight ? "text-green-600" : "text-green-400"}`} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Success Message */}
          {isCompleted && (
            <div className={`mt-6 p-5 rounded-lg border ${isLight ? "bg-purple-50 border-purple-200" : "bg-purple-500/10 border-purple-500/20"}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isLight ? "bg-purple-100" : "bg-purple-500/20"}`}>
                  <CheckCircle2 className={`w-5 h-5 ${isLight ? "text-purple-600" : "text-purple-400"}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${isLight ? "text-purple-900" : "text-purple-300"}`}>
                    Nota de Débito Autorizada
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? "text-purple-700" : "text-purple-400"}`}>
                    El documento ha sido autorizado por el SRI exitosamente.
                  </p>
                  
                  {/* Authorization Number */}
                  <div className={`mt-3 p-3 rounded-lg ${isLight ? "bg-white border border-purple-200" : "bg-[#0a0f1a] border border-purple-500/30"}`}>
                    <div className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${isLight ? "text-purple-600" : "text-purple-400"}`}>
                      Clave de Acceso
                    </div>
                    <div className={`text-xs font-mono break-all ${isLight ? "text-gray-900" : "text-white"}`}>
                      {authorizationNumber}
                    </div>
                  </div>

                  {/* Note Details */}
                  <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                    <div>
                      <span className={isLight ? "text-purple-600" : "text-purple-400"}>Cliente:</span>
                      <div className={`font-medium mt-0.5 ${isLight ? "text-gray-900" : "text-white"}`}>
                        {noteData.customer.name}
                      </div>
                    </div>
                    <div>
                      <span className={isLight ? "text-purple-600" : "text-purple-400"}>Monto:</span>
                      <div className={`font-mono font-bold mt-0.5 ${isLight ? "text-gray-900" : "text-white"}`}>
                        ${noteData.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {isCompleted && (
          <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLight 
                  ? "text-gray-700 hover:bg-gray-200" 
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              Cerrar
            </button>
            <button
              onClick={handleFinish}
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
