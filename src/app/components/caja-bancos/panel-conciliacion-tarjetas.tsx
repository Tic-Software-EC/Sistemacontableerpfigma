import { Search, CheckCircle, BookOpen, X, GripVertical, TrendingUp, TrendingDown } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

interface MovimientoBancario {
  id: string;
  fecha: string;
  descripcion: string;
  referencia: string;
  debito: number;
  credito: number;
  saldo: number;
}

interface PanelConciliacionTarjetasProps {
  tipo: "sistema" | "banco";
  titulo: string;
  movimientos: MovimientoBancario[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  vinculaciones: Record<string, string>;
  movimientoSeleccionado: string | null;
  onSelectMovimiento: (id: string | null) => void;
  onDesvincular: (id: string) => void;
  onGenerarAsiento?: (mov: MovimientoBancario) => void;
  onVincularDrop: (idOrigen: string, idDestino: string) => void;
  isLight: boolean;
}

// Componente de Tarjeta Arrastratable
interface MovimientoCardProps {
  movimiento: MovimientoBancario;
  tipo: "sistema" | "banco";
  estaVinculado: boolean;
  estaSeleccionado: boolean;
  isLight: boolean;
  onSelect: () => void;
  onDesvincular?: () => void;
  onGenerarAsiento?: () => void;
  onVincularDrop: (idOtro: string) => void;
}

const MovimientoCard = ({
  movimiento,
  tipo,
  estaVinculado,
  estaSeleccionado,
  isLight,
  onSelect,
  onDesvincular,
  onGenerarAsiento,
  onVincularDrop,
}: MovimientoCardProps) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: tipo,
      item: { id: movimiento.id, movimiento },
      canDrag: !estaVinculado,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [estaVinculado]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: tipo === "sistema" ? "banco" : "sistema",
      drop: (item: any) => {
        if (!estaVinculado) {
          onVincularDrop(item.id);
        }
      },
      canDrop: () => !estaVinculado,
      collect: (monitor) => ({
        isOver: monitor.isOver() && monitor.canDrop(),
      }),
    }),
    [estaVinculado]
  );

  const monto = movimiento.debito + movimiento.credito;
  const esDebito = movimiento.debito > 0;

  return (
    <div
      ref={(node) => !estaVinculado && drag(drop(node))}
      onClick={onSelect}
      className={`p-3 rounded-lg border transition-all cursor-pointer relative group ${
        isDragging
          ? "opacity-50 scale-95"
          : isOver
          ? isLight
            ? "border-primary bg-primary/10 scale-102 shadow-md"
            : "border-primary bg-primary/20 scale-102 shadow-md"
          : estaVinculado
          ? isLight
            ? "bg-green-50 border-green-200"
            : "bg-green-500/10 border-green-500/30"
          : estaSeleccionado
          ? isLight
            ? "bg-primary/10 border-primary shadow-sm"
            : "bg-primary/20 border-primary shadow-sm"
          : isLight
          ? "bg-white border-gray-200 hover:border-primary/50 hover:shadow-sm"
          : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10"
      }`}
    >
      {/* Indicador de arrastre */}
      {!estaVinculado && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>
      )}

      <div className={`${!estaVinculado ? "ml-4" : ""}`}>
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium truncate ${isLight ? "text-gray-900" : "text-white"}`}>
              {movimiento.descripcion}
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{movimiento.referencia}</p>
          </div>

          {/* Estado */}
          <div className="flex-shrink-0">
            {estaVinculado ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDesvincular?.();
                }}
                className="p-1 rounded-md bg-green-500/20 hover:bg-green-500/30 transition-colors"
                title="Desvincular (clic para quitar)"
              >
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              </button>
            ) : tipo === "banco" && onGenerarAsiento ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerarAsiento();
                }}
                className="p-1 rounded-md hover:bg-primary/10 transition-colors"
                title="Generar Asiento Contable"
              >
                <BookOpen className="w-3.5 h-3.5 text-primary" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Detalles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">{movimiento.fecha}</span>
            {esDebito ? (
              <TrendingUp className="w-3 h-3 text-green-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
          </div>
          <div className={`text-sm font-bold ${esDebito ? "text-green-400" : "text-red-400"}`}>
            ${monto.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Efecto de hover para drag */}
      {isOver && !estaVinculado && (
        <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

export const PanelConciliacionTarjetas = ({
  tipo,
  titulo,
  movimientos,
  searchTerm,
  onSearchChange,
  vinculaciones,
  movimientoSeleccionado,
  onSelectMovimiento,
  onDesvincular,
  onGenerarAsiento,
  onVincularDrop,
  isLight,
}: PanelConciliacionTarjetasProps) => {
  const handleVincularDrop = (idOrigen: string, idDestino: string) => {
    if (tipo === "sistema") {
      onVincularDrop(idDestino, idOrigen); // destino=sistema, origen=banco
    } else {
      onVincularDrop(idOrigen, idDestino); // origen=sistema, destino=banco
    }
  };

  return (
    <div
      className={`border rounded-lg overflow-hidden ${
        isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
      }`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b ${
          isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
            {titulo}
          </h3>
          <span className="text-xs text-gray-400">{movimientos.length} registros</span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            id={tipo === "sistema" ? "search-sistema" : "search-banco"}
            className={`w-full pl-9 pr-3 py-1.5 border rounded-lg text-sm ${
              isLight
                ? "bg-white border-gray-200 text-gray-900"
                : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            }`}
          />
        </div>
      </div>

      {/* Contenido - Vista de Tarjetas */}
      <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
        {movimientos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No hay movimientos para mostrar</p>
          </div>
        ) : (
          movimientos.map((mov) => {
            const estaVinculado =
              tipo === "sistema"
                ? !!vinculaciones[mov.id]
                : Object.values(vinculaciones).includes(mov.id);
            const estaSeleccionado = movimientoSeleccionado === mov.id;

            return (
              <MovimientoCard
                key={mov.id}
                movimiento={mov}
                tipo={tipo}
                estaVinculado={estaVinculado}
                estaSeleccionado={estaSeleccionado}
                isLight={isLight}
                onSelect={() => {
                  if (!estaVinculado) {
                    onSelectMovimiento(estaSeleccionado ? null : mov.id);
                  }
                }}
                onDesvincular={
                  tipo === "sistema" && estaVinculado ? () => onDesvincular(mov.id) : undefined
                }
                onGenerarAsiento={
                  tipo === "banco" && !estaVinculado && onGenerarAsiento
                    ? () => onGenerarAsiento(mov)
                    : undefined
                }
                onVincularDrop={(idOtro) => handleVincularDrop(idOtro, mov.id)}
              />
            );
          })
        )}
      </div>

      {/* Hint de Drag & Drop */}
      <div
        className={`px-4 py-2 border-t text-center ${
          isLight ? "border-gray-200 bg-gray-50/50" : "border-white/10 bg-white/5"
        }`}
      >
        <p className="text-xs text-gray-400">
          💡 Arrastra una tarjeta hacia el otro panel para vincular • Clic en ✓ para desvincular
        </p>
      </div>
    </div>
  );
};
