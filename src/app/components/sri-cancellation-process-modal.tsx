import { useState, useEffect } from "react";
import { X, FileCode, Shield, Send, CheckCircle2, Loader2, FileText, XCircle } from "lucide-react";

interface SRICancellationProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  noteNumber: string;
  reason: string;
  isLight: boolean;
}

type ProcessStep = {
  id: string;
  label: string;
  status: "pending" | "processing" | "completed" | "error";
  message?: string;
};

export function SRICancellationProcessModal({ isOpen, onClose, onComplete, noteNumber, reason, isLight }: SRICancellationProcessModalProps) {
  const [steps, setSteps] = useState<ProcessStep[]>([
    {
      id: "validate",
      label: "Validación del Documento",
      status: "pending",
    },
    {
      id: "xml",
      label: "Generación de XML de Anulación",
      status: "pending",
    },
    {
      id: "sign",
      label: "Firma Electrónica",
      status: "pending",
    },
    {
      id: "send",
      label: "Notificación al SRI",
      status: "pending",
    },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSteps(steps.map(s => ({ ...s, status: "pending" as const, message: undefined })));
      setCurrentStepIndex(-1);
      setIsCompleted(false);
      return;
    }

    const processSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStepIndex(i);
        
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "processing" as const } : s
        ));

        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 600));

        let message = "";
        if (i === 0) message = "Documento validado correctamente";
        if (i === 1) message = "XML de anulación generado";
        if (i === 2) message = "Documento firmado electrónicamente";
        if (i === 3) message = "SRI notificado exitosamente";

        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "completed" as const, message } : s
        ));
      }

      await new Promise(resolve => setTimeout(resolve, 400));
      setIsCompleted(true);
    };

    processSteps();
  }, [isOpen]);

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "bg-gradient-to-r from-red-50 to-white border-red-200" : "bg-gradient-to-r from-red-500/10 to-[#0d1724] border-red-500/20"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${isLight ? "bg-red-100" : "bg-red-500/20"}`}>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Anulación en Proceso
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Nota de Crédito: <span className="font-mono">{noteNumber}</span>
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
                className="h-full bg-red-600 transition-all duration-500 ease-out"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className={`text-xs mt-2 text-center ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              {isCompleted ? "Anulación completada" : `Paso ${currentStepIndex + 1} de ${steps.length}`}
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
                        ? "bg-red-50/50 shadow-sm"
                        : "bg-red-500/5 shadow-sm"
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
                      ? "bg-red-600 text-white"
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
            <div className={`mt-6 p-5 rounded-lg border ${isLight ? "bg-red-50 border-red-200" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isLight ? "bg-red-100" : "bg-red-500/20"}`}>
                  <XCircle className={`w-5 h-5 ${isLight ? "text-red-600" : "text-red-400"}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${isLight ? "text-red-900" : "text-red-300"}`}>
                    Nota de Crédito Anulada
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? "text-red-700" : "text-red-400"}`}>
                    El documento ha sido anulado exitosamente y el SRI ha sido notificado.
                  </p>
                  
                  {/* Cancellation Reason */}
                  <div className={`mt-3 p-3 rounded-lg ${isLight ? "bg-white border border-red-200" : "bg-[#0a0f1a] border border-red-500/30"}`}>
                    <div className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${isLight ? "text-red-600" : "text-red-400"}`}>
                      Motivo de Anulación
                    </div>
                    <div className={`text-xs ${isLight ? "text-gray-900" : "text-white"}`}>
                      {reason}
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
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
