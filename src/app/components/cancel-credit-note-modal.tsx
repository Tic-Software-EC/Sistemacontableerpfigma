import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface CancelCreditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  noteData: any;
  isLight: boolean;
}

const CANCELLATION_REASONS = [
  "Nota de crédito emitida por error",
  "Datos incorrectos en el documento",
  "Solicitud del cliente",
  "Error en el monto",
  "Duplicación del documento",
  "Otros (especificar)",
];

export function CancelCreditNoteModal({ isOpen, onClose, onConfirm, noteData, isLight }: CancelCreditNoteModalProps) {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const handleConfirm = () => {
    const finalReason = reason === "Otros (especificar)" ? otherReason : reason;
    if (!finalReason.trim()) return;
    onConfirm(finalReason);
    setReason("");
    setOtherReason("");
  };

  const canConfirm = reason !== "" && (reason !== "Otros (especificar)" || otherReason.trim() !== "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-xl shadow-2xl ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "bg-red-50 border-red-200" : "bg-red-500/10 border-red-500/20"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isLight ? "bg-red-100" : "bg-red-500/20"}`}>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Anular Nota de Crédito
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? "text-red-600" : "text-red-400"}`}>
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-red-100 text-gray-500" : "hover:bg-white/5 text-gray-400"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className={`p-4 rounded-lg border ${isLight ? "bg-yellow-50 border-yellow-200" : "bg-yellow-500/10 border-yellow-500/20"}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? "text-yellow-600" : "text-yellow-500"}`} />
              <div>
                <p className={`text-sm font-medium ${isLight ? "text-yellow-900" : "text-yellow-300"}`}>
                  Está a punto de anular la siguiente nota de crédito:
                </p>
                <p className={`text-sm font-mono font-bold mt-1 ${isLight ? "text-yellow-800" : "text-yellow-200"}`}>
                  {noteData.noteNumber}
                </p>
                <p className={`text-xs mt-2 ${isLight ? "text-yellow-700" : "text-yellow-400"}`}>
                  El documento será marcado como anulado y se notificará al SRI.
                </p>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
              Motivo de Anulación *
            </label>
            <div className="space-y-2">
              {CANCELLATION_REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                    reason === r
                      ? isLight
                        ? "bg-blue-50 border-blue-300 shadow-sm"
                        : "bg-blue-500/10 border-blue-500/30 shadow-sm"
                      : isLight
                      ? "bg-white border-gray-200 hover:border-gray-300"
                      : "bg-[#1a2332] border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      reason === r
                        ? "border-primary bg-primary"
                        : isLight
                        ? "border-gray-300"
                        : "border-white/20"
                    }`}>
                      {reason === r && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className={isLight ? "text-gray-900" : "text-white"}>
                      {r}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {reason === "Otros (especificar)" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Especifique el motivo de anulación..."
                  autoFocus
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors ${
                    isLight 
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
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
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              !canConfirm
                ? isLight
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            Confirmar Anulación
          </button>
        </div>
      </div>
    </div>
  );
}