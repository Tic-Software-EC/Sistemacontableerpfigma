import { X, CheckCircle2, Building2, Mail, Lock, Key, AlertCircle } from "lucide-react";

interface CredentialsModalProps {
  show: boolean;
  onClose: () => void;
  credentials: {
    email: string;
    password: string;
    companyName: string;
    adminName: string;
  } | null;
}

export function CredentialsModal({ show, onClose, credentials }: CredentialsModalProps) {
  if (!show || !credentials) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1e2530] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-green-600/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white font-semibold text-xl">¡Empresa Creada!</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Información de la empresa */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-4 h-4 text-green-400" />
              <h4 className="text-green-400 font-medium">{credentials.companyName}</h4>
            </div>
            <p className="text-gray-300 text-sm">Administrador: {credentials.adminName}</p>
          </div>

          {/* Mensaje de email enviado */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex gap-3">
              <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium text-sm mb-1">Credenciales Enviadas</p>
                <p className="text-gray-300 text-sm">
                  Se ha enviado la contraseña de acceso a:<br />
                  <span className="font-mono text-white text-xs">{credentials.email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Nota simple */}
          <div className="flex gap-2 text-gray-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              El administrador puede iniciar sesión con su email y la contraseña recibida. 
              Si olvida su contraseña, puede usar la opción de recuperación en el login.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-[#1e2530]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}