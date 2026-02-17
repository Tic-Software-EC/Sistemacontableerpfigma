import { LoginForm } from "../components/login-form";

export function Login() {
  return (
    <div className="size-full flex relative overflow-hidden">
      {/* Fondo con formas geométricas abstractas */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-50">
        {/* Círculos decorativos */}
        <div className="absolute w-[600px] h-[600px] bg-primary/10 rounded-full -top-40 -right-40 blur-3xl"></div>
        <div className="absolute w-[500px] h-[500px] bg-secondary/5 rounded-full top-1/3 -left-60 blur-3xl"></div>
        <div className="absolute w-[400px] h-[400px] bg-primary/15 rounded-full bottom-0 right-1/4 blur-3xl"></div>
        
        {/* Formas geométricas */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rounded-2xl rotate-12"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-secondary/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-primary/5 rounded-lg rotate-45"></div>
      </div>

      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#1a2332] via-[#1e2936] to-[#243242] relative overflow-hidden items-center justify-center z-10">
        {/* Formas geométricas decorativas */}
        <div className="absolute w-96 h-96 bg-primary/15 rounded-full -top-20 -left-20 blur-3xl"></div>
        <div className="absolute w-80 h-80 bg-white/10 rounded-full top-1/3 -left-32"></div>
        <div className="absolute w-72 h-72 bg-primary/20 rounded-full bottom-10 left-1/4 blur-2xl"></div>
        
        {/* Líneas decorativas */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Iconos flotantes relacionados con ERP */}
          <div className="absolute top-[15%] left-[10%] w-16 h-16 border-2 border-primary/20 rounded-lg rotate-12 flex items-center justify-center backdrop-blur-sm">
            <div className="text-primary/40 text-2xl">📊</div>
          </div>
          <div className="absolute top-[35%] right-[15%] w-20 h-20 border-2 border-primary/15 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="text-primary/40 text-2xl">📈</div>
          </div>
          <div className="absolute bottom-[25%] left-[20%] w-14 h-14 border-2 border-primary/20 rounded-lg -rotate-6 flex items-center justify-center backdrop-blur-sm">
            <div className="text-primary/40 text-xl">💼</div>
          </div>
          <div className="absolute top-[60%] right-[8%] w-12 h-12 border-2 border-primary/25 rounded-lg rotate-45 flex items-center justify-center backdrop-blur-sm">
            <div className="text-primary/40 text-lg">📋</div>
          </div>
          <div className="absolute bottom-[15%] right-[25%] w-16 h-16 border-2 border-primary/15 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="text-primary/40 text-xl">💰</div>
          </div>
          {/* Líneas de conexión sutiles */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        </div>
        
        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 px-16 text-white max-w-lg">
          <div className="mb-8">
            <h2 className="text-[2.75rem] font-thin mb-3 tracking-wide leading-tight">Bienvenido a</h2>
            <h1 className="text-[3.5rem] font-black mb-8 tracking-tight leading-none bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent font-[Raleway] text-[40px] font-normal text-center">TicSoftEc</h1>
          </div>
          
          <p className="text-lg font-light text-white/90 mb-12 leading-relaxed">
            Plataforma integral de gestión empresarial contable
          </p>
          
          <div className="space-y-5">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/30 transition-colors border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <p className="font-medium text-white text-base">Sistema ERP Completo</p>
                <p className="text-sm text-white/60 font-light">Gestión contable integrada</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/30 transition-colors border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <p className="font-medium text-white text-base">Seguridad Empresarial</p>
                <p className="text-sm text-white/60 font-light">Protección de datos garantizada</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-lg bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/30 transition-colors border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div>
                <p className="font-medium text-white text-base">Reportes en Tiempo Real</p>
                <p className="text-sm text-white/60 font-light">Análisis y métricas avanzadas</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-xs font-light text-white/50">
              © 2026 TicSoftEc - Tecnología para tu empresa
            </p>
          </div>
        </div>
      </div>

      {/* Panel derecho con formulario */}
      <div className="flex-1 relative z-10 flex items-center justify-center p-8 overflow-hidden">
        {/* Fondo con degradado mejorado */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-gray-50 to-orange-50/30"></div>
        
        {/* Efectos de fondo decorativos mejorados */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Efectos decorativos removidos */}
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}