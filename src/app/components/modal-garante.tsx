import { Search, Check, UserPlus, X } from "lucide-react";

interface ModalGaranteProps {
  isLight: boolean;
  showGaranteModal: boolean;
  setShowGaranteModal: (show: boolean) => void;
  searchGaranteTerm: string;
  setSearchGaranteTerm: (term: string) => void;
  mostrarResultadosBusqueda: boolean;
  setMostrarResultadosBusqueda: (show: boolean) => void;
  clientesDisponiblesGarantes: any[];
  seleccionarClienteComoGarante: (cliente: any) => void;
  nuevoGarante: any;
  setNuevoGarante: (garante: any) => void;
  limpiarFormularioGarante: () => void;
  agregarGarante: () => void;
}

export function ModalGarante({
  isLight,
  showGaranteModal,
  setShowGaranteModal,
  searchGaranteTerm,
  setSearchGaranteTerm,
  mostrarResultadosBusqueda,
  setMostrarResultadosBusqueda,
  clientesDisponiblesGarantes,
  seleccionarClienteComoGarante,
  nuevoGarante,
  setNuevoGarante,
  limpiarFormularioGarante,
  agregarGarante,
}: ModalGaranteProps) {
  if (!showGaranteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
        isLight ? "bg-white" : "bg-card"
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
              Agregar Garante
            </h3>
          </div>
          <button
            onClick={() => {
              setShowGaranteModal(false);
              limpiarFormularioGarante();
            }}
            className="p-1 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Buscador Destacado */}
          <div className={`p-4 rounded-lg border-2 ${
            isLight ? "bg-orange-50 border-primary/30" : "bg-primary/10 border-primary/30"
          }`}>
            <div className="flex items-start gap-3">
              <Search className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <label className={`text-sm font-semibold mb-2 block ${
                  isLight ? "text-gray-900" : "text-white"
                }`}>
                  ¿Es un cliente existente?
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Busca por cédula, nombre o apellido para autocompletar datos
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={searchGaranteTerm}
                    onChange={(e) => {
                      setSearchGaranteTerm(e.target.value);
                      setMostrarResultadosBusqueda(e.target.value.length > 0);
                    }}
                    onFocus={() => searchGaranteTerm.length > 0 && setMostrarResultadosBusqueda(true)}
                    placeholder="Buscar cliente por cédula, nombre o apellido..."
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" 
                        : "bg-white/5 border-white/20 text-white placeholder-gray-400"
                    }`}
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  
                  {/* Resultados de búsqueda */}
                  {mostrarResultadosBusqueda && clientesDisponiblesGarantes.length > 0 && (
                    <div className={`absolute mt-2 w-full max-h-60 overflow-y-auto rounded-lg shadow-xl z-10 border ${
                      isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
                    }`}>
                      {clientesDisponiblesGarantes.map(cliente => (
                        <div
                          key={cliente.id}
                          onClick={() => seleccionarClienteComoGarante(cliente)}
                          className={`px-4 py-3 cursor-pointer border-b transition-colors ${
                            isLight 
                              ? "hover:bg-orange-50 border-gray-100 last:border-0" 
                              : "hover:bg-primary/10 border-white/5 last:border-0"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                                {cliente.nombre} {cliente.apellido}
                              </p>
                              <div className="flex flex-wrap gap-3 mt-1">
                                <span className="text-xs text-gray-400">
                                  CI: {cliente.cedula}
                                </span>
                                <span className="text-xs text-gray-400">
                                  Tel: {cliente.telefono}
                                </span>
                                <span className="text-xs text-gray-400">
                                  Email: {cliente.email}
                                </span>
                              </div>
                            </div>
                            <Check className="w-4 h-4 text-primary flex-shrink-0 ml-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sin resultados */}
                  {mostrarResultadosBusqueda && searchGaranteTerm.length > 0 && clientesDisponiblesGarantes.length === 0 && (
                    <div className={`absolute mt-2 w-full p-4 rounded-lg border text-center ${
                      isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
                    }`}>
                      <p className="text-sm text-gray-400">
                        No se encontraron clientes disponibles
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de datos del garante */}
          <div className={`p-4 rounded-lg border ${
            isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
          }`}>
            <h4 className={`text-sm font-semibold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
              Datos del Garante
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Cédula */}
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Cédula *
                </label>
                <input
                  type="text"
                  value={nuevoGarante.cedula}
                  onChange={(e) => setNuevoGarante({...nuevoGarante, cedula: e.target.value})}
                  placeholder="0912345678"
                  maxLength={10}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight 
                      ? "bg-white border-gray-200 text-gray-900" 
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              {/* Nombre */}
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={nuevoGarante.nombre}
                  onChange={(e) => setNuevoGarante({...nuevoGarante, nombre: e.target.value})}
                  placeholder="Juan Carlos"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight 
                      ? "bg-white border-gray-200 text-gray-900" 
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              {/* Apellido */}
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Apellido *
                </label>
                <input
                  type="text"
                  value={nuevoGarante.apellido}
                  onChange={(e) => setNuevoGarante({...nuevoGarante, apellido: e.target.value})}
                  placeholder="Pérez Morales"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight 
                      ? "bg-white border-gray-200 text-gray-900" 
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  value={nuevoGarante.email}
                  onChange={(e) => setNuevoGarante({...nuevoGarante, email: e.target.value})}
                  placeholder="ejemplo@email.com"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight 
                      ? "bg-white border-gray-200 text-gray-900" 
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={nuevoGarante.telefono}
                  onChange={(e) => setNuevoGarante({...nuevoGarante, telefono: e.target.value})}
                  placeholder="0987654321"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight 
                      ? "bg-white border-gray-200 text-gray-900" 
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              {/* Relación */}
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Relación *
                </label>
                <input
                  type="text"
                  value={nuevoGarante.relacion}
                  onChange={(e) => setNuevoGarante({...nuevoGarante, relacion: e.target.value})}
                  placeholder="Ej: Cónyuge, Padre, Hermano"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight 
                      ? "bg-white border-gray-200 text-gray-900" 
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              {/* Dirección - Ocupa 2 columnas */}
              <div className="col-span-2">
                <label className={`text-xs font-medium mb-1.5 block ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Dirección
                </label>
                <input
                  type="text"
                  value={nuevoGarante.direccion}
                  onChange={(e) => setNuevoGarante({...nuevoGarante, direccion: e.target.value})}
                  placeholder="Av. Principal 123 y Calle Secundaria"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight 
                      ? "bg-white border-gray-200 text-gray-900" 
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              {/* Ingresos */}
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Ingresos Mensuales
                </label>
                <input
                  type="number"
                  value={nuevoGarante.ingresos || ""}
                  onChange={(e) => setNuevoGarante({...nuevoGarante, ingresos: parseFloat(e.target.value) || 0})}
                  placeholder="1500.00"
                  step="0.01"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight 
                      ? "bg-white border-gray-200 text-gray-900" 
                      : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setShowGaranteModal(false);
                limpiarFormularioGarante();
              }}
              className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                isLight 
                  ? "border-gray-200 hover:bg-gray-50 text-gray-700" 
                  : "border-white/10 hover:bg-white/5 text-white"
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={agregarGarante}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Guardar Garante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
