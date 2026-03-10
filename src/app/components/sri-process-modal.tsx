import { useState, useEffect } from "react";
import { X, FileCode, Shield, Send, CheckCircle2, Loader2, FileText } from "lucide-react";

interface SRIProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (authData: any) => void;
  noteData: any;
  isLight: boolean;
}

type ProcessStep = {
  id: string;
  label: string;
  icon: React.ReactNode;
  status: "pending" | "processing" | "completed" | "error";
  message?: string;
};

export function SRIProcessModal({ isOpen, onClose, onComplete, noteData, isLight }: SRIProcessModalProps) {
  const [steps, setSteps] = useState<ProcessStep[]>([
    {
      id: "xml",
      label: "Generación de Documento XML",
      icon: <FileCode className="w-4 h-4" />,
      status: "pending",
    },
    {
      id: "validate",
      label: "Validación de Estructura",
      icon: <FileText className="w-4 h-4" />,
      status: "pending",
    },
    {
      id: "sign",
      label: "Firma Electrónica",
      icon: <Shield className="w-4 h-4" />,
      status: "pending",
    },
    {
      id: "send",
      label: "Envío al SRI",
      icon: <Send className="w-4 h-4" />,
      status: "pending",
    },
    {
      id: "authorize",
      label: "Autorización SRI",
      icon: <CheckCircle2 className="w-4 h-4" />,
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

        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

        let message = "";
        if (i === 0) message = "Documento XML generado correctamente";
        if (i === 1) message = "Estructura validada sin errores";
        if (i === 2) message = "Firmado con certificado digital válido";
        if (i === 3) message = "Recibido por el SRI exitosamente";
        if (i === 4) {
          const authNum = generateAuthorizationNumber();
          setAuthorizationNumber(authNum);
          message = "Documento autorizado por el SRI";
        }

        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "completed" as const, message } : s
        ));
      }

      await new Promise(resolve => setTimeout(resolve, 400));
      setIsCompleted(true);
    };

    processSteps();
  }, [isOpen]);

  const generateAuthorizationNumber = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const random = Array.from({ length: 37 }, () => Math.floor(Math.random() * 10)).join("");
    return `${day}${month}${year}${random}`;
  };

  const handleFinish = () => {
    onComplete({
      authorizationNumber,
      sriStatus: "authorized",
      sriAuthDate: new Date().toISOString().replace("T", " ").substring(0, 16),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "bg-gradient-to-r from-gray-50 to-white border-gray-200" : "bg-gradient-to-r from-[#0a0f1a] to-[#0d1724] border-white/10"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${isLight ? "bg-primary/10" : "bg-primary/20"}`}>
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Proceso de Autorización SRI
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Nota de Crédito: <span className="font-mono">{noteData?.noteNumber || "N/A"}</span>
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
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
            <div className={`text-xs mt-2 text-center ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              {isCompleted ? "Proceso completado" : `Paso ${currentStepIndex + 1} de ${steps.length}`}
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
                        ? "bg-blue-50/50 shadow-sm"
                        : "bg-blue-500/5 shadow-sm"
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
                      ? "bg-primary text-white"
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
            <div className={`mt-6 p-5 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20"}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isLight ? "bg-green-100" : "bg-green-500/20"}`}>
                  <CheckCircle2 className={`w-5 h-5 ${isLight ? "text-green-600" : "text-green-400"}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${isLight ? "text-green-900" : "text-green-300"}`}>
                    Autorización Exitosa
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? "text-green-700" : "text-green-400"}`}>
                    El documento ha sido autorizado por el SRI y se encuentra listo para su emisión.
                  </p>
                  
                  {/* Authorization Number */}
                  <div className={`mt-4 p-3 rounded-lg ${isLight ? "bg-white border border-green-200" : "bg-[#0a0f1a] border border-green-500/30"}`}>
                    <div className={`text-[10px] uppercase tracking-wider font-semibold mb-2 ${isLight ? "text-green-600" : "text-green-400"}`}>
                      Número de Autorización
                    </div>
                    <div className={`font-mono text-xs break-all leading-relaxed ${isLight ? "text-gray-900" : "text-white"}`}>
                      {authorizationNumber}
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
                  ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" 
                  : "bg-[#1a2332] border border-white/10 text-gray-300 hover:bg-white/5"
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
