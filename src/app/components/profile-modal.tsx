import { useState } from "react";
import { X, Camera, User, Mail, Lock, Save, Eye, EyeOff } from "lucide-react";

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
  const [editingProfile, setEditingProfile] = useState(userProfile);
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
    setEditingProfile(userProfile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-gradient-to-br from-secondary to-[#1a1f2e] border border-white/10 rounded-2xl overflow-hidden">
        {/* Header - Diseño Compacto */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-white font-bold text-lg">
                Configuración de Perfil
              </h3>
              <p className="text-gray-400 text-xs">
                Actualiza tu información personal
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-5 max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* Foto de perfil */}
          <div className="flex items-center gap-6 mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center overflow-hidden">
                {editingProfile.avatar ? (
                  <img src={editingProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-3xl">
                    {editingProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold text-lg mb-1">
                Foto de Perfil
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Sube una foto para personalizar tu perfil
              </p>
              <p className="text-gray-500 text-xs">
                Formatos: JPG, PNG, GIF • Tamaño máximo: 2MB
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
            {/* Nombre completo */}
            <div className="md:col-span-2">
              <label className="block text-white text-xs font-medium mb-1.5">
                Nombre completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={editingProfile.name}
                  onChange={(e) => setEditingProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 pl-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-white text-xs font-medium mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={editingProfile.email}
                  onChange={(e) => setEditingProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 pl-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-white text-xs font-medium mb-1.5">
                Teléfono
              </label>
              <input
                type="tel"
                value={editingProfile.phone}
                onChange={(e) => setEditingProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+593 99 123 4567"
              />
            </div>

            {/* Rol */}
            <div>
              <label className="block text-white text-xs font-medium mb-1.5">
                Rol
              </label>
              <input
                type="text"
                value={editingProfile.role}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-gray-400 text-sm cursor-not-allowed"
              />
            </div>
          </div>

          {/* Sección de contraseña */}
          <div className="mb-5 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2.5 mb-3.5">
              <Lock className="w-4 h-4 text-primary" />
              <div>
                <h4 className="text-white font-semibold text-sm">
                  Cambiar Contraseña
                </h4>
                <p className="text-gray-400 text-[11px]">
                  Actualiza tu contraseña periódicamente
                </p>
              </div>
            </div>

            {/* Campo de contraseña actual */}
            <div className="mb-3.5">
              <label className="block text-white text-xs font-medium mb-1.5">
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 pl-10 pr-10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ingresa tu contraseña actual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
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
              <label className="block text-white text-xs font-medium mb-1.5">
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
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
              </p>
            </div>
          </div>

          {/* Guía de uso */}
          

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}