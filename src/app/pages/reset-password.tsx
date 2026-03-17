import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Shield, ArrowLeft, KeyRound } from "lucide-react";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Validación de contraseña
  const getPasswordStrength = (password: string) => {
    if (!password) return null;
    
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [hasMinLength, hasSpecialChar].filter(Boolean).length;

    return {
      isValid: hasMinLength && hasSpecialChar,
      score,
      hasMinLength,
      hasSpecialChar,
    };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const passwordsMatch = formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (!token) {
      setError("Token de recuperación no válido");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (!passwordStrength?.isValid) {
      setError("La contraseña no cumple con los requisitos mínimos de seguridad");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Integrar con backend real
      // const response = await fetch('/api/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, newPassword: formData.newPassword })
      // });

      // Simulación de cambio exitoso
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError("Error al cambiar la contraseña. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1a2936] to-[#0D1B2A] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl -top-20 -right-20 animate-pulse"></div>
          <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-20 -left-20 animate-pulse"></div>
        </div>

        <div className="bg-[#1a2936]/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-12 w-full max-w-md text-center relative z-10 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/40 animate-in zoom-in duration-700 delay-100">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 animate-in slide-in-from-bottom duration-500 delay-200">¡Contraseña Actualizada!</h2>
          <p className="text-gray-300 mb-8 text-base animate-in slide-in-from-bottom duration-500 delay-300">
            Tu contraseña ha sido cambiada exitosamente.
          </p>
          <div className="flex items-center justify-center gap-2 animate-in fade-in duration-500 delay-500">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200"></div>
            <p className="text-sm text-gray-400 ml-2">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo mejorado con elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] via-[#1a2936] to-[#0D1B2A]"></div>
        
        {/* Círculos grandes animados con diferentes velocidades */}
        <div className="absolute w-[900px] h-[900px] bg-primary/12 rounded-full blur-3xl -top-72 -right-72 animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute w-[800px] h-[800px] bg-blue-500/8 rounded-full blur-3xl -bottom-72 -left-72 animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl top-1/4 right-1/3 animate-pulse" style={{ animationDuration: '5s' }}></div>
        
        {/* Grid pattern sutil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle, #E8692E 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Líneas decorativas */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent"></div>
        </div>
      </div>

      <div className="bg-[#1a2936]/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Borde brillante animado */}
        <div className="absolute inset-0 rounded-2xl opacity-50">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 animate-pulse" style={{ animationDuration: '3s' }}></div>
        </div>

        <div className="grid md:grid-cols-5 relative z-10">
          {/* Panel Izquierdo - Decorativo Mejorado */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#0D1B2A]/95 via-[#1a2936]/95 to-[#0D1B2A]/95 p-8 flex flex-col justify-between relative overflow-hidden border-r border-primary/10">
            {/* Decoración de fondo mejorada */}
            <div className="absolute inset-0">
              <div className="absolute w-64 h-64 bg-primary/10 rounded-full -top-20 -left-20 blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
              <div className="absolute w-48 h-48 bg-primary/8 rounded-full -bottom-12 -right-12 blur-3xl animate-pulse" style={{ animationDuration: '5s' }}></div>
              <div className="absolute w-32 h-32 bg-blue-500/5 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl animate-pulse" style={{ animationDuration: '6s' }}></div>
            </div>

            {/* Patrón de puntos */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle, #E8692E 1.5px, transparent 1.5px)`,
              backgroundSize: '30px 30px'
            }}></div>

            <div className="relative z-10">
              {/* Logo/Icono principal mejorado */}
              <div className="mb-8 animate-in fade-in slide-in-from-left duration-700">
                <div className="relative inline-block mb-5">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-primary/30 shadow-xl">
                    <KeyRound className="w-8 h-8 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"></div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2.5">Restablecer Contraseña</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Crea una contraseña segura para proteger tu cuenta en <span className="text-primary font-semibold">TicSoftEc</span>
                </p>
              </div>

              {/* Features mejorados con animaciones escalonadas */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-3 group animate-in fade-in slide-in-from-left duration-700 delay-100">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur group-hover:blur-lg transition-all"></div>
                    <div className="relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 group-hover:scale-110 transition-all duration-300 border border-white/10">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">Máxima Seguridad</p>
                    <p className="text-gray-400 text-xs">Encriptación de nivel empresarial</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group animate-in fade-in slide-in-from-left duration-700 delay-200">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur group-hover:blur-lg transition-all"></div>
                    <div className="relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 group-hover:scale-110 transition-all duration-300 border border-white/10">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">Acceso Inmediato</p>
                    <p className="text-gray-400 text-xs">Ingresa con tu nueva contraseña</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 group animate-in fade-in slide-in-from-left duration-700 delay-300">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-xl blur group-hover:blur-lg transition-all"></div>
                    <div className="relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/15 group-hover:scale-110 transition-all duration-300 border border-white/10">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">Protección Total</p>
                    <p className="text-gray-400 text-xs">Tu información siempre segura</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer mejorado */}
            <div className="relative z-10 animate-in fade-in duration-700 delay-500">
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-400">© 2026 TicSoftEc ERP</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-sm shadow-green-500/50"></div>
                  <span className="text-gray-400">Seguro</span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel Derecho - Formulario Mejorado */}
          <div className="md:col-span-3 p-8 bg-gradient-to-br from-[#1a2936]/30 to-[#0D1B2A]/30">
            {/* Header Mobile */}
            <div className="md:hidden mb-6 animate-in fade-in slide-in-from-top duration-700">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Cambiar Contraseña</h1>
                  <p className="text-xs text-gray-400">TicSoftEc ERP</p>
                </div>
              </div>
            </div>

            {/* Header Desktop */}
            <div className="hidden md:block mb-6 animate-in fade-in slide-in-from-top duration-700">
              <h1 className="text-2xl font-bold text-white mb-1.5 flex items-center gap-2">
                Nueva Contraseña
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              </h1>
              <p className="text-sm text-gray-400">Asegura tu cuenta con una contraseña robusta</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 backdrop-blur-sm animate-in shake duration-500">
                <div className="w-6 h-6 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-xs text-red-300 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nueva Contraseña */}
              <div className="animate-in fade-in slide-in-from-right duration-700 delay-100">
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-br from-primary/30 to-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold border border-primary/30">1</span>
                  Nueva Contraseña <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity blur-md"></div>
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                  <input
                    type={showPassword.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="relative w-full pl-11 pr-11 px-3 py-2 bg-[#0f1621]/80 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="Mínimo 8 caracteres"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10"
                  >
                    {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div className="animate-in fade-in slide-in-from-right duration-700 delay-200">
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-gradient-to-br from-primary/30 to-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold border border-primary/30">2</span>
                  Confirmar Contraseña <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity blur-md"></div>
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="relative w-full pl-11 pr-11 px-3 py-2 bg-[#0f1621]/80 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    placeholder="Repite tu contraseña"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors z-10"
                  >
                    {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="mt-2 animate-in slide-in-from-top-1 duration-300">
                    {passwordsMatch ? (
                      <div className="flex items-center gap-2 p-2.5 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-sm">
                        <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        </div>
                        <p className="text-xs text-green-300 font-medium">Las contraseñas coinciden perfectamente</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm">
                        <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-3 h-3 text-red-400" />
                        </div>
                        <p className="text-xs text-red-300 font-medium">Las contraseñas no coinciden</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Indicador de fuerza de contraseña mejorado */}
              {formData.newPassword && passwordStrength && (
                null
              )}

              {/* Botones mejorados */}
              <div className="flex gap-3 pt-3 animate-in fade-in slide-in-from-bottom duration-700 delay-400">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !passwordStrength?.isValid || !passwordsMatch}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 disabled:shadow-none relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Cambiando Contraseña...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Cambiar Contraseña
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}