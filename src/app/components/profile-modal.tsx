import { useState } from "react";
import { X, Camera, User, Mail, Lock, Save, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
  };
  onSave: (profile: {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
  }) => void;
}

export function ProfileModal({ isOpen, onClose, userProfile, onSave }: ProfileModalProps) {
  const { theme } = useTheme();
  const safeProfile = userProfile ?? { name: "", email: "", phone: "", role: "", avatar: "" };
  const [editingProfile, setEditingProfile] = useState(safeProfile);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProfile(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editingProfile);
    onClose();
  };

  const handleCancel = () => {
    setEditingProfile(safeProfile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-2xl border rounded-2xl overflow-hidden ${
        theme === "light" ? "bg-white border-gray-200" : "bg-gradient-to-br from-secondary to-[#1a1f2e] border-white/10"
      }`}>
        {/* Header - Diseño Compacto */}
        <div className={`flex items-center justify-between p-5 border-b ${
          theme === "light" ? "border-gray-200 bg-gray-50" : "border-white/10"
        }`}>
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-primary" />
            <div>
              <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                Configuración de Perfil
              </h3>
              <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                Cambia tu contraseña de forma segura
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className={`p-2 rounded-lg transition-colors ${
              theme === "light" 
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" 
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className={`p-5 max-h-[calc(85vh-120px)] overflow-y-auto ${
          theme === "light" ? "bg-white" : ""
        }`}>

          {/* Formulario - Solo lectura para usuarios regulares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
            {/* Nombre completo */}
            <div className="md:col-span-2">
              <label className={`block text-xs font-medium mb-1.5 ${
                theme === "light" ? "text-gray-700" : "text-white"
              }`}>
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={editingProfile.name}
                  disabled
                  className={`w-full border rounded-lg px-3.5 py-2 pl-10 text-sm cursor-not-allowed ${
                    theme === "light"
                      ? "bg-gray-100 border-gray-300 text-gray-600"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className={`block text-xs font-medium mb-1.5 ${
                theme === "light" ? "text-gray-700" : "text-white"
              }`}>
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={editingProfile.email}
                  disabled
                  className={`w-full border rounded-lg px-3.5 py-2 pl-10 text-sm cursor-not-allowed ${
                    theme === "light"
                      ? "bg-gray-100 border-gray-300 text-gray-600"
                      : "bg-white/5 border-white/10 text-gray-400"
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                theme === "light" ? "text-gray-700" : "text-white"
              }`}>
                Teléfono
              </label>
              <input
                type="tel"
                value={editingProfile.phone}
                disabled
                className={`w-full border rounded-lg px-3.5 py-2 text-sm cursor-not-allowed ${
                  theme === "light"
                    ? "bg-gray-100 border-gray-300 text-gray-600"
                    : "bg-white/5 border-white/10 text-gray-400"
                }`}
                placeholder="+593 99 123 4567"
              />
            </div>

            {/* Rol */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                theme === "light" ? "text-gray-700" : "text-white"
              }`}>
                Rol
              </label>
              <input
                type="text"
                value={editingProfile.role}
                disabled
                className={`w-full border rounded-lg px-3.5 py-2 text-sm cursor-not-allowed ${
                  theme === "light"
                    ? "bg-gray-100 border-gray-300 text-gray-500"
                    : "bg-white/5 border-white/10 text-gray-400"
                }`}
              />
            </div>
          </div>

          {/* Sección de contraseña */}
          <div className={`mb-5 p-4 rounded-xl border ${
            theme === "light" ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
          }`}>
            <div className="flex items-center gap-2.5 mb-3.5">
              <Lock className="w-4 h-4 text-primary" />
              <div>
                <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  Cambiar Contraseña
                </h4>
                <p className={`text-[11px] ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  Actualiza tu contraseña periódicamente
                </p>
              </div>
            </div>

            {/* Campo de contraseña actual */}
            <div className="mb-3.5">
              <label className={`block text-xs font-medium mb-1.5 ${
                theme === "light" ? "text-gray-700" : "text-white"
              }`}>
                Contraseña Actual
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full border rounded-lg px-3.5 py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      : "bg-white/5 border-white/10 text-white placeholder-gray-500"
                  }`}
                  placeholder="Ingresa tu contraseña actual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                    theme === "light" ? "text-gray-400 hover:text-gray-900" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Campo de nueva contraseña */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${
                theme === "light" ? "text-gray-700" : "text-white"
              }`}>
                Nueva Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full border rounded-lg px-3.5 py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      : "bg-white/5 border-white/10 text-white placeholder-gray-500"
                  }`}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                    theme === "light" ? "text-gray-400 hover:text-gray-900" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className={`text-xs mt-2 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className={`flex-1 px-6 py-3 border rounded-lg transition-colors font-medium text-sm ${
                theme === "light"
                  ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-300"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border-white/10"
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}