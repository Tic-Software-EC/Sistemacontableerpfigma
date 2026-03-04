import { User, Mail, Phone, MapPin, AlertTriangle, CheckCircle, X, Info, Camera, CreditCard, Calendar } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTheme } from "../contexts/theme-context";

interface Customer {
  ruc: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  pendingBalance: number;
  lastPurchaseDate?: string;
}

interface CustomerModalProps {
  customer: Customer;
  onConfirm: () => void;
  onCancel: () => void;
  onUpdate?: (updatedData: Partial<Customer>) => void;
}

export function CustomerModal({ customer, onConfirm, onCancel, onUpdate }: CustomerModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const txt  = isLight ? "text-gray-900" : "text-white";
  const sub  = isLight ? "text-gray-500" : "text-gray-400";
  const bdr  = isLight ? "border-gray-200" : "border-white/10";
  const secBg = isLight ? "bg-gray-50 border border-gray-200" : "bg-white/5 border border-white/10";
  const inp  = isLight
    ? "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/30"
    : "bg-white/10 border border-primary/30 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20";
  const modalBg = isLight ? "bg-white" : "bg-[#0D1B2A]";
  const btnSec  = isLight
    ? "bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700"
    : "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white";
  const [editedEmail, setEditedEmail] = useState(customer.email || "");
  const [editedAddress, setEditedAddress] = useState(customer.address || "");

  const handleSaveChanges = () => {
    if (onUpdate) {
      onUpdate({
        email: editedEmail,
        address: editedAddress,
      });
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border ${bdr} ${modalBg}`}>
        <div className={`bg-primary/10 border-b ${bdr} px-6 py-4`}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`font-bold text-xl mb-1 ${txt}`}>Verificar Datos del Cliente</h3>
              <p className={`text-xs ${sub}`}>Confirme que los datos son correctos antes de continuar</p>
            </div>
            <button onClick={onCancel} className={`p-1.5 rounded-lg transition-colors ${sub} ${isLight ? "hover:bg-gray-100" : "hover:bg-white/10"}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-6 pt-4">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-500 font-bold text-xs">Información Importante</p>
                <p className={`text-[10px] mt-0.5 ${sub}`}>
                  Solo puedes editar <span className={`font-medium ${txt}`}>Email</span> y <span className={`font-medium ${txt}`}>Dirección</span> desde aquí. 
                  Para modificar otros datos, ve al <span className="text-primary font-medium">Módulo de Clientes</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4">
          <div className="grid grid-cols-[160px_1fr] gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Camera className="w-3.5 h-3.5 text-primary" />
                  <h4 className="text-primary text-xs font-bold">Fotografía</h4>
                </div>
                <div className="relative">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGhlYWRzaG90fGVufDF8fHx8MTc3MTY4NzAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Foto del cliente"
                    className={`w-full aspect-square object-cover rounded-lg border ${bdr}`}
                  />
                  <div className="absolute top-2 right-2">
                    {customer.pendingBalance > 0 ? (
                      <span className="px-2 py-0.5 bg-red-500 text-white rounded text-[10px] font-bold shadow-lg">Con Deuda</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-500 text-white rounded text-[10px] font-bold shadow-lg">Al Día</span>
                    )}
                  </div>
                </div>
              </div>

              {customer.pendingBalance > 0 ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                    <p className="text-red-500 text-[10px] font-bold uppercase">Saldo Pendiente</p>
                  </div>
                  <p className={`font-bold text-2xl mb-0.5 ${txt}`}>${customer.pendingBalance.toFixed(2)}</p>
                  <p className={`text-[10px] ${sub}`}>Deuda pendiente</p>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-green-500 font-bold text-xs">Sin Deudas</p>
                      <p className={`text-[10px] ${sub}`}>Al día</p>
                    </div>
                  </div>
                </div>
              )}

              <div className={`rounded-lg p-3 ${secBg}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  <h4 className="text-primary text-xs font-bold">Historial</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <p className={`text-[10px] ${sub}`}>Total Compras:</p>
                    <p className={`font-bold text-sm ${txt}`}>{customer.totalPurchases}</p>
                  </div>
                  {customer.lastPurchaseDate && (
                    <div className={`flex justify-between items-center pt-1.5 border-t ${bdr}`}>
                      <p className={`text-[10px] ${sub}`}>Última Compra:</p>
                      <p className={`text-[10px] font-medium ${txt}`}>{customer.lastPurchaseDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className={`flex items-center gap-2 mb-3 pb-1.5 border-b ${bdr}`}>
                  <User className="w-4 h-4 text-primary" />
                  <h4 className={`font-bold text-sm ${txt}`}>Datos de Identificación</h4>
                  <span className={`ml-auto text-[10px] italic ${sub}`}>Editar en Módulo de Clientes</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={`text-[10px] font-medium mb-1.5 block uppercase tracking-wide ${sub}`}>Nombre Completo</label>
                    <div className={`px-3 py-2 rounded-lg ${secBg}`}>
                      <p className={`text-sm font-medium ${txt}`}>{customer.name}</p>
                    </div>
                  </div>
                  <div>
                    <label className={`text-[10px] font-medium mb-1.5 block uppercase tracking-wide ${sub}`}>RUC/Cédula</label>
                    <div className={`px-3 py-2 rounded-lg ${secBg}`}>
                      <p className={`text-sm font-mono font-bold ${txt}`}>{customer.ruc}</p>
                    </div>
                  </div>
                  <div>
                    <label className={`text-[10px] font-medium mb-1.5 block uppercase tracking-wide ${sub}`}>Teléfono Celular</label>
                    <div className={`px-3 py-2 rounded-lg ${secBg}`}>
                      <p className={`text-sm ${txt}`}>{customer.phone || "No registrado"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-primary/30">
                  <Mail className="w-4 h-4 text-primary" />
                  <h4 className={`font-bold text-sm ${txt}`}>Información de Contacto</h4>
                  <span className="ml-auto text-[10px] text-green-500 font-medium">✓ Editable</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className={`text-[10px] font-medium mb-1.5 block uppercase tracking-wide ${sub}`}>Correo Electrónico</label>
                    <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} placeholder="correo@ejemplo.com" className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none transition-all ${inp}`} />
                  </div>
                  <div>
                    <label className={`text-[10px] font-medium mb-1.5 block uppercase tracking-wide ${sub}`}>Dirección Completa</label>
                    <textarea value={editedAddress} onChange={(e) => setEditedAddress(e.target.value)} placeholder="Calle principal y secundaria, N° edificio, ciudad" rows={2} className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none resize-none transition-all ${inp}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`border-t ${bdr} px-6 py-4 ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
          <div className="flex gap-3">
            <button onClick={onCancel} className={`flex-1 px-6 py-2.5 rounded-xl transition-all font-bold flex items-center justify-center gap-2 text-sm ${btnSec}`}>
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button onClick={handleSaveChanges} className="flex-1 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-sm">
              <CheckCircle className="w-4 h-4" />
              Confirmar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}