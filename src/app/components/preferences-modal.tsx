import { X, User, Mail, Phone, Lock, Eye, EyeOff, Camera, Save } from "lucide-react";
import { useState, useRef } from "react";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreferencesModal({ isOpen, onClose }: PreferencesModalProps) {
  // Perfil
  const [fullName, setFullName]     = useState("Juan Pérez");
  const [email]                     = useState("admin@ticsoftec.com");
  const [phone, setPhone]           = useState("+593 99 123 4567");
  const [role]                      = useState("Administrador de Empresa");
  const [avatar, setAvatar]         = useState<string | null>(null);

  // Contraseña
  const [currentPwd,  setCurrentPwd]  = useState("");
  const [newPwd,      setNewPwd]      = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);

  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1500);
  };

  // Iniciales del avatar
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[95vh]">

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 py-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-lg leading-tight">Configuración de Perfil</h2>
              <p className="text-gray-400 text-xs mt-0.5">Actualiza tu información personal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Cuerpo scrollable ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-5">

          {/* Avatar upload */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="relative flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{initials}</span>
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="text-gray-700 font-medium text-sm">Sube una foto para personalizar tu perfil</p>
              <p className="text-gray-400 text-xs mt-1">Formatos: JPG, PNG, GIF • Tamaño máximo: 2MB</p>
            </div>
          </div>

          {/* Nombre completo */}
          <div>
            <label className="block text-gray-700 text-sm mb-1.5">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
              />
            </div>
          </div>

          {/* Correo electrónico */}
          <div>
            <label className="block text-gray-700 text-sm mb-1.5">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-gray-500 text-sm bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Teléfono + Rol en grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Rol</label>
              <input
                type="text"
                value={role}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-400 text-sm bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Sección cambio de contraseña */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-sm">Cambiar Contraseña</p>
                <p className="text-gray-400 text-xs">Actualiza tu contraseña periódicamente</p>
              </div>
            </div>

            {/* Contraseña actual */}
            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Contraseña Actual</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <label className="block text-gray-700 text-sm mb-1.5">Nueva Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-1.5">
                Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium transition-all ${
              saved ? "bg-green-500" : "bg-primary hover:bg-primary/90"
            }`}
          >
            <Save className="w-4 h-4" />
            {saved ? "¡Guardado!" : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}