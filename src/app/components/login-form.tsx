import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, Shield, Crown, Send, X, CheckCircle2, Building2 } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [ruc, setRuc] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, ruc, password, rememberMe, isSuperAdmin });
    
    if (isSuperAdmin) {
      // Super admin: limpiar datos de empresa
      localStorage.removeItem("companyRuc");
      localStorage.removeItem("companyName");
      localStorage.setItem("userType", "superadmin");
      navigate("/admin/subscriptions");
    } else {
      // Admin de empresa: guardar datos de empresa
      localStorage.setItem("companyRuc", ruc);
      // En un sistema real, aquí se buscaría el nombre de la empresa por RUC desde la base de datos
      // Por ahora usamos un nombre simulado basado en el RUC
      const companyNames = [
        "Comercial del Pacífico S.A.",
        "Distribuidora Andina Cia. Ltda.",
        "Servicios Corporativos EC",
        "Importadora TecnoSoft S.A.",
        "Grupo Empresarial del Ecuador"
      ];
      // Usar el último dígito del RUC para seleccionar un nombre
      const lastDigit = parseInt(ruc.slice(-1)) || 0;
      const companyName = companyNames[lastDigit % companyNames.length];
      localStorage.setItem("companyName", companyName);
      localStorage.setItem("userType", "company");
      navigate("/modules");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== SIMULACIÓN DE ENVÍO DE EMAIL PARA RESETEO ===");
    console.log("Para:", forgotEmail);
    console.log("Asunto: Recuperación de Contraseña - TicSoftEc");
    console.log("\n--- Contenido del Email ---");
    console.log(`Estimado usuario,\n`);
    console.log(`Hemos recibido una solicitud para restablecer su contraseña en TicSoftEc.\n`);
    console.log("Para crear una nueva contraseña, haga clic en el siguiente enlace:\n");
    console.log("[ENLACE DE RESETEO]\n");
    console.log("Este enlace expirará en 24 horas por seguridad.\n");
    console.log("Si no solicitó este cambio, ignore este mensaje.\n");
    console.log("Saludos cordiales,");
    console.log("Equipo TicSoftEc");
    console.log("===============================================\n");
    
    setEmailSent(true);
    
    // Cerrar el modal después de 3 segundos
    setTimeout(() => {
      setShowForgotModal(false);
      setEmailSent(false);
      setForgotEmail("");
    }, 3000);
  };

  return (
    <div className="w-full max-w-md">
      {/* Header compacto */}
      <div className="flex flex-col items-center mb-4">
        <div className="mb-3 relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-xl backdrop-blur-sm border border-white/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <span className="text-white font-bold text-2xl relative z-10">T</span>
          </div>
          <div className="absolute -inset-1 rounded-xl border border-primary/20 -z-10"></div>
        </div>
        <h2 className="text-2xl font-light text-secondary mb-1">
          Bienvenido
        </h2>
        <p className="text-xs text-gray-500">
          Accede a tu cuenta empresarial
        </p>
      </div>

      {/* Formulario con glassmorphism mejorado */}
      <div className="relative">
        <div className="absolute inset-0 bg-white backdrop-blur-xl rounded-xl border border-gray-200 shadow-2xl"></div>
        
        <div className="relative p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-secondary mb-1.5 font-medium text-xs">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white text-secondary placeholder:text-gray-400 transition-all text-sm hover:bg-white hover:border-primary/50"
                  required
                />
              </div>
            </div>

            {/* RUC - Solo para administradores de empresa */}
            {!isSuperAdmin && (
              <div>
                
                <div className="relative group">
                  
                  
                </div>
              </div>
            )}

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-secondary mb-1.5 font-medium text-xs">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-white text-secondary placeholder:text-gray-400 transition-all text-sm hover:bg-white hover:border-primary/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox Super Admin */}
            <div className="pt-1">
              <label className="flex items-center justify-center cursor-pointer group p-2.5 rounded-lg hover:bg-gray-50 transition-all">
                <input
                  type="checkbox"
                  checked={isSuperAdmin}
                  onChange={(e) => setIsSuperAdmin(e.target.checked)}
                  className="w-4 h-4 border-2 border-gray-400 rounded text-secondary focus:ring-2 focus:ring-secondary/40 cursor-pointer accent-secondary"
                />
                <div className="flex items-center gap-1.5 ml-2.5">
                  <Crown className={`w-3.5 h-3.5 transition-colors ${isSuperAdmin ? 'text-secondary' : 'text-gray-400'}`} />
                  <span className={`text-xs font-medium transition-colors ${isSuperAdmin ? 'text-secondary' : 'text-gray-500'}`}>
                    Iniciar como Super Administrador
                  </span>
                </div>
              </label>
            </div>

            {/* Recordarme y Olvidaste contraseña */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center cursor-pointer group">
                
                
              </label>
              <a
                href="#"
                className="block w-full text-center text-xs text-primary hover:text-primary/80 transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotModal(true);
                }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón Login */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg hover:shadow-2xl hover:shadow-primary/30 transition-all font-medium text-sm mt-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isSuperAdmin && <Crown className="w-4 h-4" />}
                Iniciar Sesión
              </span>
            </button>
          </form>

          {/* Info de seguridad */}
          <div className="mt-5 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
              <div className="w-6 h-6 rounded-md bg-green-500/10 flex items-center justify-center">
                <Shield className="w-3 h-3 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">
                Conexión segura y encriptada
              </p>
            </div>
            <p className="text-center text-xs text-gray-600">
              ¿Necesitas ayuda?{" "}
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Contactar soporte técnico");
                }}
              >
                Contacta a soporte
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center">
        <div className="inline-block px-4 py-1.5 bg-white/50 backdrop-blur-md rounded-full border border-gray-200">
          <p className="text-xs text-gray-500">
            TicSoftEc ERP v2.0
          </p>
        </div>
      </div>

      {/* Modal Recuperar Contraseña */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-secondary font-semibold text-xl">Recuperar Contraseña</h3>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setEmailSent(false);
                  setForgotEmail("");
                }}
                className="p-2 text-gray-400 hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {!emailSent ? (
                <>
                  <p className="text-gray-600 text-sm mb-6">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                  </p>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <label htmlFor="forgot-email" className="block text-secondary mb-2 font-medium text-sm">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="forgot-email"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="usuario@empresa.com"
                          className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-secondary placeholder:text-gray-400 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar Enlace de Recuperación
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-secondary font-semibold text-lg mb-2">¡Email Enviado!</h4>
                  <p className="text-gray-600 text-sm">
                    Hemos enviado un enlace de recuperación a:<br />
                    <span className="font-mono text-primary">{forgotEmail}</span>
                  </p>
                  <p className="text-gray-500 text-xs mt-4">
                    Revisa tu bandeja de entrada y sigue las instrucciones.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}