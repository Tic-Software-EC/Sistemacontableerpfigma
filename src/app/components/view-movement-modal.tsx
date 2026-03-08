import { X, Package, Calendar, FileText, Warehouse, TrendingUp, User, Hash, MessageSquare } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface ViewMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  movement: any;
}

export function ViewMovementModal({ isOpen, onClose, movement }: ViewMovementModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  if (!isOpen || !movement) return null;

  const getTypeInfo = (type: string) => {
    const typeConfig = {
      entrada: { bg: "bg-green-500/10", text: "text-green-400", label: "Entrada" },
      salida: { bg: "bg-red-500/10", text: "text-red-400", label: "Salida" },
      ajuste: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Ajuste" },
      transferencia: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Transferencia" },
    };
    return typeConfig[type as keyof typeof typeConfig];
  };

  const typeInfo = getTypeInfo(movement.type);
  const totalQuantity = movement.products?.reduce((sum: number, p: any) => sum + Math.abs(p.quantity), 0) || 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`w-full max-w-5xl border rounded-xl shadow-2xl my-8 ${
        isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? "border-gray-200" : "border-white/10"
        }`}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`font-bold text-lg ${
                isLight ? "text-gray-900" : "text-white"
              }`}>Detalle del Movimiento</h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${typeInfo.bg} ${typeInfo.text}`}>
                <TrendingUp className="w-3.5 h-3.5" />
                {typeInfo.label}
              </span>
            </div>
            <p className={`text-xs ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}>
              Código: <span className={`font-mono font-semibold ${
                isLight ? "text-gray-900" : "text-white"
              }`}>{movement.code}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight 
                ? "text-gray-400 hover:text-gray-900 hover:bg-gray-100" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Información General */}
          <div>
            <h4 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${
              isLight ? "text-gray-900" : "text-white"
            }`}>
              <FileText className="w-4 h-4 text-primary" />
              Información General
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Fecha */}
              <div className={`border rounded-lg p-3 ${
                isLight 
                  ? "bg-gray-50 border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <p className={`text-xs ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Fecha</p>
                </div>
                <p className={`text-sm font-medium ${
                  isLight ? "text-gray-900" : "text-white"
                }`}>
                  {new Date(movement.date).toLocaleDateString('es-EC', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Almacén */}
              <div className={`border rounded-lg p-3 ${
                isLight 
                  ? "bg-gray-50 border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Warehouse className="w-3.5 h-3.5 text-primary" />
                  <p className={`text-xs ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>
                    {movement.type === "transferencia" ? "Almacenes" : "Almacén"}
                  </p>
                </div>
                <p className={`text-sm font-medium ${
                  isLight ? "text-gray-900" : "text-white"
                }`}>{movement.warehouse}</p>
              </div>

              {/* Referencia */}
              <div className={`border rounded-lg p-3 ${
                isLight 
                  ? "bg-gray-50 border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  <p className={`text-xs ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Referencia</p>
                </div>
                <p className={`text-sm font-medium font-mono ${
                  isLight ? "text-gray-900" : "text-white"
                }`}>{movement.reference || "N/A"}</p>
              </div>

              {/* Motivo */}
              <div className={`border rounded-lg p-3 md:col-span-2 ${
                isLight 
                  ? "bg-gray-50 border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <p className={`text-xs ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Motivo</p>
                </div>
                <p className={`text-sm font-medium ${
                  isLight ? "text-gray-900" : "text-white"
                }`}>{movement.reason}</p>
              </div>

              {/* Usuario */}
              {movement.createdBy && (
                <div className={`border rounded-lg p-3 ${
                  isLight 
                    ? "bg-gray-50 border-gray-200" 
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <p className={`text-xs ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Registrado por</p>
                  </div>
                  <p className={`text-sm font-medium ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}>{movement.createdBy}</p>
                </div>
              )}

              {/* Notas */}
              {movement.notes && (
                <div className={`border rounded-lg p-3 md:col-span-3 ${
                  isLight 
                    ? "bg-gray-50 border-gray-200" 
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <p className={`text-xs ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Notas</p>
                  </div>
                  <p className={`text-sm ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}>{movement.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Productos */}
          <div>
            <h4 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${
              isLight ? "text-gray-900" : "text-white"
            }`}>
              <Package className="w-4 h-4 text-primary" />
              Detalle de Productos ({movement.products?.length || 0})
            </h4>

            {movement.products && movement.products.length > 0 ? (
              <div className={`border rounded-lg overflow-hidden ${
                isLight 
                  ? "bg-white border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <table className="w-full">
                  <thead className={isLight ? "bg-gray-50" : "bg-[#151f2e]"}>
                    <tr>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}>#</th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}>Código</th>
                      <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}>Producto</th>
                      <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}>Stock Anterior</th>
                      <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}>Cantidad</th>
                      <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}>Unidad</th>
                      <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}>Stock Resultante</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    isLight ? "divide-gray-200" : "divide-white/5"
                  }`}>
                    {movement.products.map((product: any, index: number) => {
                      const resultingStock = product.currentStock + product.quantity;
                      return (
                        <tr key={index} className={
                          isLight 
                            ? "hover:bg-gray-50 transition-colors" 
                            : "hover:bg-white/[0.02] transition-colors"
                        }>
                          <td className="px-4 py-2.5">
                            <span className="text-gray-400 text-sm font-mono">{index + 1}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`text-sm font-mono ${
                              isLight ? "text-gray-700" : "text-gray-300"
                            }`}>{product.productCode}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`text-sm ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}>{product.productName}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-gray-400 text-sm">{product.currentStock}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`text-sm font-bold ${product.quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {product.quantity > 0 ? '+' : ''}{product.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="text-gray-400 text-sm">{product.unit}</span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className={`text-sm font-medium ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}>{resultingStock}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className={`border-t ${
                    isLight 
                      ? "bg-gray-50 border-gray-200" 
                      : "bg-[#151f2e] border-white/10"
                  }`}>
                    <tr>
                      <td colSpan={4} className="px-4 py-2.5 text-right">
                        <span className="text-gray-400 text-sm font-semibold">Total:</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`text-sm font-bold ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}>{totalQuantity}</span>
                      </td>
                      <td colSpan={2} className="px-4 py-2.5 text-center">
                        <span className="text-gray-400 text-xs">{movement.products.length} producto(s)</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className={`text-center py-12 border rounded-lg ${
                isLight 
                  ? "bg-gray-50 border-gray-200" 
                  : "bg-[#1a2332] border-white/10"
              }`}>
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No hay productos en este movimiento</p>
              </div>
            )}
          </div>

          {/* Resumen de Impacto */}
          {movement.products && movement.products.length > 0 && (
            <div>
              <h4 className={`font-semibold text-sm mb-3 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>Resumen</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`border rounded-lg p-3 ${
                  isLight 
                    ? "bg-gray-50 border-gray-200" 
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <p className={`text-xs mb-1 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Total Productos</p>
                  <p className={`text-xl font-bold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}>{movement.products.length}</p>
                </div>
                <div className={`border rounded-lg p-3 ${
                  isLight 
                    ? "bg-gray-50 border-gray-200" 
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <p className={`text-xs mb-1 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Cantidad Total</p>
                  <p className={`text-xl font-bold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}>{totalQuantity}</p>
                </div>
                <div className={`border rounded-lg p-3 ${
                  isLight 
                    ? "bg-gray-50 border-gray-200" 
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <p className={`text-xs mb-1 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}>Tipo Movimiento</p>
                  <p className={`text-lg font-bold ${typeInfo.text}`}>{typeInfo.label}</p>
                </div>
                {movement.createdAt && (
                  <div className={`border rounded-lg p-3 ${
                    isLight 
                      ? "bg-gray-50 border-gray-200" 
                      : "bg-[#1a2332] border-white/10"
                  }`}>
                    <p className={`text-xs mb-1 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}>Fecha Registro</p>
                    <p className={`text-xs font-medium ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}>
                      {new Date(movement.createdAt).toLocaleDateString('es-EC')}
                      <br />
                      <span className="text-gray-400">
                        {new Date(movement.createdAt).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
          isLight 
            ? "border-gray-200 bg-gray-50" 
            : "border-white/10 bg-[#1a2332]"
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors font-medium text-xs ${
              isLight 
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300" 
                : "bg-white/5 hover:bg-white/10 text-white"
            }`}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
