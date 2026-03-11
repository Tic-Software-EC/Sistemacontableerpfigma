import { useState } from "react";
import { X, Search, CreditCard, AlertTriangle, Shield, Circle } from "lucide-react";

interface CancelPurchaseCreditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isLight: boolean;
}

interface PurchaseCreditNote {
  number: string;
  date: string;
  supplierName: string;
  supplierRuc: string;
  invoiceRef: string;
  total: number;
  status: "authorized" | "pending";
}

const NOTES: PurchaseCreditNote[] = [
  {
    number: "001-002-000045",
    date: "2026-03-09",
    supplierName: "Distribuidora ABC S.A.",
    supplierRuc: "1792345678001",
    invoiceRef: "001-002-001234",
    total: 250.00,
    status: "authorized",
  },
  {
    number: "002-001-000023",
    date: "2026-03-08",
    supplierName: "Importadora XYZ Cía. Ltda.",
    supplierRuc: "1798765432001",
    invoiceRef: "002-001-005678",
    total: 450.00,
    status: "authorized",
  },
];

const CANCELLATION_REASONS = [
  { value: "", label: "Seleccione un motivo..." },
  { value: "emision_error", label: "Nota emitida por error" },
  { value: "datos_incorrectos", label: "Datos incorrectos en el documento" },
  { value: "duplicacion", label: "Duplicación del documento" },
  { value: "error_monto", label: "Error en el monto" },
  { value: "anulacion_factura", label: "Anulación de la factura referenciada" },
  { value: "otros", label: "Otros (especificar)" },
];

const SRI_STEPS = [
  { id: "validando", label: "Validando", desc: "Validando estructura XML…" },
  { id: "firmando", label: "Firmando", desc: "Aplicando firma electrónica…" },
  { id: "enviando", label: "Enviando", desc: "Enviando anulación al SRI…" },
  { id: "recepcion", label: "Recepción", desc: "Esperando respuesta del SRI…" },
  { id: "autorizando", label: "Autorizando", desc: "Procesando autorización…" },
];

export function CancelPurchaseCreditNoteModal({ isOpen, onClose, onSave, isLight }: CancelPurchaseCreditNoteModalProps) {
  const [step, setStep] = useState(1);
  const [searchNote, setSearchNote] = useState("");
  const [selectedNote, setSelectedNote] = useState<PurchaseCreditNote | null>(null);
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [sriStep, setSriStep] = useState<string>("validando");
  const [sriComplete, setSriComplete] = useState(false);

  const handleClose = () => {
    setStep(1);
    setSearchNote("");
    setSelectedNote(null);
    setReason("");
    setOtherReason("");
    setSriStep("validando");
    setSriComplete(false);
    onClose();
  };

  const handleSelectNote = (note: PurchaseCreditNote) => {
    setSelectedNote(note);
    setSearchNote("");
  };

  const handleNext = () => {
    if (step === 1 && selectedNote) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      startSRIProcess();
    }
  };

  const startSRIProcess = () => {
    setSriStep("validando");
    setTimeout(() => setSriStep("firmando"), 1200);
    setTimeout(() => setSriStep("enviando"), 2400);
    setTimeout(() => setSriStep("recepcion"), 3600);
    setTimeout(() => setSriStep("autorizando"), 4800);
    setTimeout(() => {
      setSriComplete(true);
      setTimeout(() => {
        const finalReason = reason === "otros" 
          ? otherReason 
          : CANCELLATION_REASONS.find(r => r.value === reason)?.label || "";
        onSave({
          note: selectedNote,
          reason: finalReason,
          cancelDate: new Date().toISOString(),
        });
        handleClose();
      }, 1500);
    }, 6000);
  };

  const canProceedStep2 = reason !== "" && (reason !== "otros" || otherReason.trim() !== "");

  const filteredNotes = NOTES.filter((note) => {
    const searchLower = searchNote.toLowerCase();
    return (
      note.number.includes(searchNote) ||
      note.supplierName.toLowerCase().includes(searchLower) ||
      note.supplierRuc.includes(searchNote) ||
      note.invoiceRef.includes(searchNote)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-3xl rounded-xl shadow-2xl max-h-[90vh] flex flex-col ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        
        <div className={`px-6 py-5 border-b flex-shrink-0 ${isLight ? "bg-red-50 border-red-200" : "bg-red-500/10 border-red-500/20"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isLight ? "bg-red-100" : "bg-red-500/20"}`}>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Anular Nota de Crédito de Proveedor
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? "text-red-600" : "text-red-400"}`}>
                  Paso {step} de 3
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={step === 3 && !sriComplete}
              className={`p-2 rounded-lg transition-colors ${
                step === 3 && !sriComplete ? "opacity-50 cursor-not-allowed" : isLight ? "hover:bg-red-100 text-gray-500" : "hover:bg-white/5 text-gray-400"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 flex-1 ${s > 1 ? "ml-2" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > s ? "bg-green-500 text-white" : step === s ? "bg-primary text-white" : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-500"
                  }`}>
                    {step > s ? "✓" : s}
                  </div>
                  <span className={`text-xs font-medium ${step >= s ? isLight ? "text-gray-900" : "text-white" : isLight ? "text-gray-400" : "text-gray-500"}`}>
                    {s === 1 ? "Nota" : s === 2 ? "Motivo" : "SRI"}
                  </span>
                </div>
                {s < 3 && <div className={`h-0.5 flex-1 mx-2 ${step > s ? "bg-green-500" : isLight ? "bg-gray-200" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Buscar Nota de Crédito a Anular
                </label>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="text"
                    value={searchNote}
                    onChange={(e) => setSearchNote(e.target.value)}
                    placeholder="Buscar por número, proveedor, RUC o factura ref..."
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500"
                    }`}
                  />
                </div>
              </div>

              {selectedNote && !searchNote && (
                <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className={`w-4 h-4 ${isLight ? "text-blue-600" : "text-blue-400"}`} />
                        <p className={`font-mono font-bold text-sm ${isLight ? "text-blue-900" : "text-blue-300"}`}>
                          {selectedNote.number}
                        </p>
                      </div>
                      <p className={`text-sm font-medium ${isLight ? "text-blue-800" : "text-blue-200"}`}>
                        {selectedNote.supplierName}
                      </p>
                      <p className={`text-xs mt-1 ${isLight ? "text-blue-600" : "text-blue-400"}`}>
                        RUC: {selectedNote.supplierRuc} • Fact. Ref: {selectedNote.invoiceRef}
                      </p>
                      <p className={`text-sm font-bold mt-2 ${isLight ? "text-blue-900" : "text-blue-300"}`}>
                        Total: ${selectedNote.total.toFixed(2)}
                      </p>
                    </div>
                    <button onClick={() => setSelectedNote(null)} className={`p-1 rounded transition-colors ${isLight ? "hover:bg-blue-100 text-blue-600" : "hover:bg-blue-500/20 text-blue-400"}`}>
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {searchNote && !selectedNote && (
                <div className={`rounded-lg border max-h-96 overflow-y-auto ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                  {filteredNotes.length > 0 ? (
                    <div className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/5"}`}>
                      {filteredNotes.map((note) => (
                        <button key={note.number} onClick={() => handleSelectNote(note)} className={`w-full text-left p-4 transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}>
                          <p className={`font-mono font-bold text-sm ${isLight ? "text-primary" : "text-primary"}`}>{note.number}</p>
                          <p className={`text-sm mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>{note.supplierName}</p>
                          <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            RUC: {note.supplierRuc} • Fact: {note.invoiceRef} • ${note.total.toFixed(2)}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <CreditCard className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                      <p className={`text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>No se encontraron notas</p>
                    </div>
                  )}
                </div>
              )}

              {!selectedNote && !searchNote && (
                <div className={`text-center py-12 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                  <CreditCard className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                  <p className={`text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>Busca una nota de crédito</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && selectedNote && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${isLight ? "bg-yellow-50 border-yellow-200" : "bg-yellow-500/10 border-yellow-500/20"}`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isLight ? "text-yellow-600" : "text-yellow-500"}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isLight ? "text-yellow-900" : "text-yellow-300"}`}>
                      Está a punto de anular la siguiente nota de crédito:
                    </p>
                    <p className={`text-sm font-mono font-bold mt-1 ${isLight ? "text-yellow-800" : "text-yellow-200"}`}>
                      {selectedNote.number}
                    </p>
                    <p className={`text-xs mt-2 ${isLight ? "text-yellow-700" : "text-yellow-400"}`}>
                      Proveedor: {selectedNote.supplierName} • Total: ${selectedNote.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Motivo de Anulación *
                </label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors ${
                  isLight ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                }`}>
                  {CANCELLATION_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>

                {reason === "otros" && (
                  <div className="mt-3">
                    <input type="text" value={otherReason} onChange={(e) => setOtherReason(e.target.value)} placeholder="Especifique el motivo..." autoFocus
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500"}`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {SRI_STEPS.map((s, i) => {
                  const currentIndex = SRI_STEPS.findIndex((x) => x.id === sriStep);
                  const isActive = i === currentIndex;
                  const isDone = i < currentIndex || sriComplete;

                  return (
                    <div key={s.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                          sriComplete ? "bg-green-500 text-white" : isActive ? "bg-primary text-white animate-pulse" : isDone ? "bg-green-500 text-white" : isLight ? "bg-gray-200 text-gray-400" : "bg-white/10 text-gray-500"
                        }`}>
                          {sriComplete || isDone ? "✓" : isActive ? <Circle className="w-4 h-4 animate-spin" /> : i + 1}
                        </div>
                        <p className={`text-[10px] font-medium text-center ${isActive || isDone || sriComplete ? isLight ? "text-gray-900" : "text-white" : isLight ? "text-gray-400" : "text-gray-500"}`}>
                          {s.label}
                        </p>
                      </div>
                      {i < SRI_STEPS.length - 1 && <div className={`h-0.5 flex-1 -mt-6 transition-all ${sriComplete || i < currentIndex ? "bg-green-500" : isLight ? "bg-gray-200" : "bg-white/10"}`} />}
                    </div>
                  );
                })}
              </div>

              <div className={`p-6 rounded-lg border text-center ${sriComplete ? isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20" : isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                {sriComplete ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <p className={`text-base font-bold mb-2 ${isLight ? "text-green-900" : "text-green-300"}`}>¡Anulación Autorizada por el SRI!</p>
                    <p className={`text-sm ${isLight ? "text-green-700" : "text-green-400"}`}>La nota de crédito ha sido anulada correctamente</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center animate-pulse">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <p className={`text-base font-bold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>Procesando Anulación en el SRI</p>
                    <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-300"}`}>{SRI_STEPS.find((s) => s.id === sriStep)?.desc}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className={`px-6 py-4 border-t flex items-center justify-between flex-shrink-0 ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
            <button onClick={step === 1 ? handleClose : () => setStep(step - 1)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isLight ? "text-gray-700 hover:bg-gray-200" : "text-gray-300 hover:bg-white/10"}`}>
              {step === 1 ? "Cancelar" : "Atrás"}
            </button>
            <button onClick={handleNext} disabled={step === 1 ? !selectedNote : step === 2 ? !canProceedStep2 : false}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                (step === 1 && !selectedNote) || (step === 2 && !canProceedStep2) ? isLight ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-700 text-gray-500 cursor-not-allowed" : step === 2 ? "bg-red-600 hover:bg-red-700 text-white" : "bg-primary hover:bg-primary/90 text-white"
              }`}
            >
              {step === 2 ? "Anular Nota" : "Siguiente"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
