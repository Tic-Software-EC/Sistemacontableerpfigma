import { User, Mail, Phone, MapPin, AlertTriangle, CheckCircle, X, Info, Camera, CreditCard, Calendar } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

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
      <div className="w-full max-w-2xl bg-[#0D1B2A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Profesional */}
        <div className="bg-gradient-to-r from-primary/10 to-transparent border-b border-white/10 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-bold text-xl mb-1">
                Verificar Datos del Cliente
              </h3>
              <p className="text-gray-400 text-xs">
                Confirme que los datos son correctos antes de continuar
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Banner Informativo */}
        <div className="px-6 pt-4">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-400 font-bold text-xs">Información Importante</p>
                <p className="text-gray-400 text-[10px] mt-0.5">
                  Solo puedes editar <span className="text-white font-medium">Email</span> y <span className="text-white font-medium">Dirección</span> desde aquí. 
                  Para modificar otros datos, ve al <span className="text-primary font-medium">Módulo de Clientes</span>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-6 pt-4">
          <div className="grid grid-cols-[160px_1fr] gap-4">
            {/* Columna Izquierda: Foto y Saldo */}
            <div className="space-y-3">
              {/* Fotografía */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Camera className="w-3.5 h-3.5 text-primary" />
                  <h4 className="text-primary text-xs font-bold">Fotografía</h4>
                </div>
                <div className="relative">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGhlYWRzaG90fGVufDF8fHx8MTc3MTY4NzAwMHww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Foto del cliente"
                    className="w-full aspect-square object-cover rounded-lg border border-white/10"
                  />
                  <div className="absolute top-2 right-2">
                    {customer.pendingBalance > 0 ? (
                      <span className="px-2 py-0.5 bg-red-500 text-white rounded text-[10px] font-bold shadow-lg">
                        Con Deuda
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-500 text-white rounded text-[10px] font-bold shadow-lg">
                        Al Día
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Saldo Pendiente o Estado */}
              {customer.pendingBalance > 0 ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <p className="text-red-400 text-[10px] font-bold uppercase">Saldo Pendiente</p>
                  </div>
                  <p className="text-white font-bold text-2xl mb-0.5">
                    ${customer.pendingBalance.toFixed(2)}
                  </p>
                  <p className="text-gray-400 text-[10px]">
                    Deuda pendiente
                  </p>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-green-400 font-bold text-xs">Sin Deudas</p>
                      <p className="text-gray-400 text-[10px]">
                        Al día
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Historial */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <CreditCard className="w-3.5 h-3.5 text-primary" />
                  <h4 className="text-primary text-xs font-bold">Historial</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-400 text-[10px]">Total Compras:</p>
                    <p className="text-white font-bold text-sm">{customer.totalPurchases}</p>
                  </div>
                  {customer.lastPurchaseDate && (
                    <div className="flex justify-between items-center pt-1.5 border-t border-white/10">
                      <p className="text-gray-400 text-[10px]">Última Compra:</p>
                      <p className="text-white text-[10px] font-medium">{customer.lastPurchaseDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Datos del Cliente */}
            <div className="space-y-4">
              {/* Sección: Datos de Identificación */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-white/10">
                  <User className="w-4 h-4 text-primary" />
                  <h4 className="text-white font-bold text-sm">Datos de Identificación</h4>
                  <span className="ml-auto text-[10px] text-gray-500 italic">Editar en Módulo de Clientes</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Nombre Completo */}
                  <div className="col-span-2">
                    <label className="text-gray-400 text-[10px] font-medium mb-1.5 block uppercase tracking-wide">
                      Nombre Completo
                    </label>
                    <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-white text-sm font-medium">{customer.name}</p>
                    </div>
                  </div>
                  
                  {/* RUC/Cédula */}
                  <div>
                    <label className="text-gray-400 text-[10px] font-medium mb-1.5 block uppercase tracking-wide">
                      RUC/Cédula
                    </label>
                    <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-white text-sm font-mono font-bold">{customer.ruc}</p>
                    </div>
                  </div>
                  
                  {/* Teléfono */}
                  <div>
                    <label className="text-gray-400 text-[10px] font-medium mb-1.5 block uppercase tracking-wide">
                      Teléfono Celular
                    </label>
                    <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                      <p className="text-white text-sm">{customer.phone || "No registrado"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección: Datos Editables */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-primary/30">
                  <Mail className="w-4 h-4 text-primary" />
                  <h4 className="text-white font-bold text-sm">Información de Contacto</h4>
                  <span className="ml-auto text-[10px] text-green-400 font-medium">✓ Editable</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {/* Correo Electrónico */}
                  <div>
                    <label className="text-gray-400 text-[10px] font-medium mb-1.5 block uppercase tracking-wide">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3 py-2 bg-white/10 border border-primary/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  
                  {/* Dirección Completa */}
                  <div>
                    <label className="text-gray-400 text-[10px] font-medium mb-1.5 block uppercase tracking-wide">
                      Dirección Completa
                    </label>
                    <textarea
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      placeholder="Calle principal y secundaria, N° edificio, ciudad"
                      rows={2}
                      className="w-full px-3 py-2 bg-white/10 border border-primary/30 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Botones */}
        <div className="border-t border-white/10 px-6 py-4 bg-white/5">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl transition-all font-bold flex items-center justify-center gap-2 text-sm"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={handleSaveChanges}
              className="flex-1 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Confirmar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}