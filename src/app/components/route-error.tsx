import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Error inesperado";
  let message = "Ocurrió un error al cargar esta página.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Página no encontrada";
      message = "La ruta que intentas acceder no existe en el sistema.";
    } else {
      title = `Error ${error.status}`;
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#0D1B2A] to-[#1a1f2e] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-white font-bold text-2xl mb-2">{title}</h1>
        <p className="text-gray-400 text-sm mb-8">{message}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E8692E] hover:bg-[#E8692E]/90 text-white rounded-lg transition-colors text-sm font-medium shadow-lg shadow-[#E8692E]/20"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
