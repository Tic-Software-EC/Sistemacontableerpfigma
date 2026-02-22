import { LoginForm } from "../components/login-form";
import { BarChart3, Shield, Clock } from "lucide-react";

export function Login() {
  return (
    <div className="size-full flex relative overflow-hidden bg-white">
      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#0D1B2A] relative overflow-hidden items-center justify-center z-10">
        {/* Formas geométricas grandes - estilo de la imagen */}
        <div className="absolute w-[700px] h-[700px] bg-[#1a2f45] rounded-full -top-60 -left-40 opacity-60"></div>
        <div className="absolute w-[600px] h-[600px] bg-[#0a151f] rounded-full top-1/3 -left-60 opacity-50"></div>
        <div className="absolute w-[500px] h-[500px] bg-[#1e3449] rounded-full -bottom-40 left-10 opacity-40"></div>
        
        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 px-16 text-white max-w-xl">
          {/* Logo/Marca */}
          <div className="mb-16">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-primary text-sm font-medium tracking-wide">Sistema ERP Empresarial</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 tracking-tight leading-tight">
              TicSoftEc
            </h1>
            <p className="text-xl text-white/70 font-normal leading-relaxed">
              Plataforma integral de gestión empresarial con tecnología de última generación
            </p>
          </div>
          
          {/* Características principales */}
          <div className="space-y-6 mb-20">
            <div className="flex items-start gap-4 group">
              <div className="mt-1 p-2.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1">Gestión Contable Integrada</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Control total de finanzas, facturación y reportes fiscales en tiempo real
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="mt-1 p-2.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1">Seguridad de Nivel Empresarial</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Protección avanzada de datos con encriptación y respaldos automáticos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="mt-1 p-2.5 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base mb-1">Análisis en Tiempo Real</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Dashboard ejecutivo con métricas clave y reportes personalizables
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-xs text-white/40">
              © 2026 TicSoftEc. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="flex-1 relative z-10 flex items-center justify-center p-8 overflow-hidden">
        {/* Fondo blanco limpio */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Líneas curvas sutiles - estilo de la imagen */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 300 Q 400 100, 900 400 T 1800 300" stroke="#0D1B2A" strokeWidth="2" fill="none"/>
          <path d="M-100 500 Q 500 300, 1000 600 T 1900 500" stroke="#0D1B2A" strokeWidth="2" fill="none"/>
          <path d="M-100 100 Q 300 -100, 800 200 T 1700 100" stroke="#E8692E" strokeWidth="1.5" fill="none"/>
        </svg>
        
        <LoginForm />
      </div>
    </div>
  );
}