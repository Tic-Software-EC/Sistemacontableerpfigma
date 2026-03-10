import { X, Info, Camera, User, Mail, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";

interface VerifyClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string, address: string) => void;
  client: {
    name: string;
    ruc: string;
    phone: string;
    email: string;
    address: string;
    photo?: string;
    debt?: number;
    totalPurchases?: number;
    lastPurchaseDate?: string;
  } | null;
  isLight: boolean;
}

export function VerifyClientModal({ isOpen, onClose, onConfirm, client, isLight }: VerifyClientModalProps) {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (client) {
      setEmail(client.email);
      setAddress(client.address);
    }
  }, [client]);

  if (!isOpen || !client) return null;

  const hasDebt = (client.debt ?? 0) > 0;

  const handleConfirm = () => {
    onConfirm(email, address);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className={`w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "bg-gray-50/50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Verificar Datos del Cliente
              </h2>
              <p className={`text-sm mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                Confirme que los datos son correctos antes de continuar
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-200 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[600px] overflow-y-auto">
          
          {/* Banner Informativo */}
          <div className={`p-4 rounded-lg border mb-6 ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/30"}`}>
            <div className="flex gap-3">
              <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? "text-blue-600" : "text-blue-400"}`} />
              <div className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                <span className="font-semibold">Información Importante:</span> Solo puedes editar{" "}
                <span className="font-bold">Email</span> y{" "}
                <span className="font-bold">Dirección</span> desde aquí. Para modificar otros datos, ve al{" "}
                <span className="text-primary font-bold">Módulo de Clientes</span>.
              </div>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna Izquierda - Foto, Saldo, Historial */}
            <div className="space-y-4">
              
              {/* Fotografía */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-4 h-4 text-primary" />
                  <h3 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Fotografía
                  </h3>
                </div>
                <div className="relative">
                  <div className={`aspect-[4/5] rounded-lg overflow-hidden border-2 ${isLight ? "border-gray-200 bg-gray-100" : "border-white/10 bg-white/5"}`}>
                    {client.photo ? (
                      <img src={client.photo} alt={client.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className={`w-20 h-20 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
                      </div>
                    )}
                  </div>
                  {hasDebt && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Con Deuda
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Saldo Pendiente */}
              {hasDebt && (
                <div className={`p-4 rounded-lg border-2 ${isLight ? "bg-red-50 border-red-200" : "bg-red-500/10 border-red-500/30"}`}>
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`p-1.5 rounded ${isLight ? "bg-red-100" : "bg-red-500/20"}`}>
                      <CreditCard className="w-4 h-4 text-red-600" />
                    </div>
                    <div className={`text-xs font-bold uppercase tracking-wide ${isLight ? "text-red-700" : "text-red-400"}`}>
                      Saldo Pendiente
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${isLight ? "text-red-700" : "text-red-500"}`}>
                    ${client.debt?.toFixed(2)}
                  </div>
                  <div className={`text-xs mt-1 ${isLight ? "text-red-600" : "text-red-400"}`}>
                    Deuda pendiente
                  </div>
                </div>
              )}

              {/* Historial */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-orange-50 border-orange-200" : "bg-primary/10 border-primary/30"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Historial
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Total Compras:
                    </span>
                    <span className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {client.totalPurchases || 0}
                    </span>
                  </div>
                  <div className={`flex justify-between items-center pt-2 border-t ${isLight ? "border-orange-200" : "border-primary/20"}`}>
                    <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Última Compra:
                    </span>
                    <span className={`text-sm font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      {client.lastPurchaseDate || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Datos del Cliente */}
            <div className="lg:col-span-2 space-y-5">
              
              {/* Datos de Identificación */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Datos de Identificación
                    </h3>
                  </div>
                  <span className={`text-xs italic ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Editar en Módulo de Clientes
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Nombre Completo */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={client.name}
                      readOnly
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm font-medium cursor-not-allowed ${
                        isLight 
                          ? "bg-gray-100 border-gray-300 text-gray-700" 
                          : "bg-white/5 border-white/10 text-gray-300"
                      }`}
                    />
                  </div>

                  {/* RUC/Cédula y Teléfono */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        RUC/Cédula
                      </label>
                      <input
                        type="text"
                        value={client.ruc}
                        readOnly
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono cursor-not-allowed ${
                          isLight 
                            ? "bg-gray-100 border-gray-300 text-gray-700" 
                            : "bg-white/5 border-white/10 text-gray-300"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Teléfono Celular
                      </label>
                      <input
                        type="text"
                        value={client.phone}
                        readOnly
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm font-mono cursor-not-allowed ${
                          isLight 
                            ? "bg-gray-100 border-gray-300 text-gray-700" 
                            : "bg-white/5 border-white/10 text-gray-300"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de Contacto - EDITABLE */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <h3 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Información de Contacto
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editable
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cliente@email.com"
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors ${
                        isLight 
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                          : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    />
                  </div>

                  {/* Dirección */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Dirección Completa
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Av. Principal N12-34, Ciudad"
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors ${
                        isLight 
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                          : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              isLight 
                ? "text-gray-700 hover:bg-gray-200 border border-gray-300" 
                : "text-gray-300 hover:bg-white/10 border border-white/10"
            }`}
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          
          <button
            onClick={handleConfirm}
            className="px-8 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirmar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
