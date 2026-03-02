import { X, Package, Calendar, FileText, Warehouse, TrendingUp, User, Hash, MessageSquare } from "lucide-react";

interface ViewMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  movement: any;
}

export function ViewMovementModal({ isOpen, onClose, movement }: ViewMovementModalProps) {
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
      <div className="w-full max-w-2xl bg-secondary border border-white/10 rounded-xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-white font-bold text-lg">Detalle del Movimiento</h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${typeInfo.bg} ${typeInfo.text}`}>
                <TrendingUp className="w-3.5 h-3.5" />
                {typeInfo.label}
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              Código: <span className="text-white font-mono font-semibold">{movement.code}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Información General */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Información General
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Fecha */}
              <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <p className="text-gray-400 text-xs">Fecha</p>
                </div>
                <p className="text-white text-sm font-medium">
                  {new Date(movement.date).toLocaleDateString('es-EC', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Almacén */}
              <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Warehouse className="w-3.5 h-3.5 text-primary" />
                  <p className="text-gray-400 text-xs">
                    {movement.type === "transferencia" ? "Almacenes" : "Almacén"}
                  </p>
                </div>
                <p className="text-white text-sm font-medium">{movement.warehouse}</p>
              </div>

              {/* Referencia */}
              <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="w-3.5 h-3.5 text-primary" />
                  <p className="text-gray-400 text-xs">Referencia</p>
                </div>
                <p className="text-white text-sm font-medium font-mono">{movement.reference || "N/A"}</p>
              </div>

              {/* Motivo */}
              <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3 md:col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <p className="text-gray-400 text-xs">Motivo</p>
                </div>
                <p className="text-white text-sm font-medium">{movement.reason}</p>
              </div>

              {/* Usuario */}
              {movement.createdBy && (
                <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <p className="text-gray-400 text-xs">Registrado por</p>
                  </div>
                  <p className="text-white text-sm font-medium">{movement.createdBy}</p>
                </div>
              )}

              {/* Notas */}
              {movement.notes && (
                <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3 md:col-span-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                    <p className="text-gray-400 text-xs">Notas</p>
                  </div>
                  <p className="text-white text-sm">{movement.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Productos */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Detalle de Productos ({movement.products?.length || 0})
            </h4>

            {movement.products && movement.products.length > 0 ? (
              <div className="bg-[#1a2332] border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#151f2e]">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">#</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Código</th>
                      <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Producto</th>
                      <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Stock Anterior</th>
                      <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Cantidad</th>
                      <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Unidad</th>
                      <th className="px-4 py-2.5 text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Stock Resultante</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movement.products.map((product: any, index: number) => {
                      const resultingStock = product.currentStock + product.quantity;
                      return (
                        <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-2.5">
                            <span className="text-gray-400 text-sm font-mono">{index + 1}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-gray-300 text-sm font-mono">{product.productCode}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="text-white text-sm">{product.productName}</span>
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
                            <span className="text-white text-sm font-medium">{resultingStock}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-[#151f2e] border-t border-white/10">
                    <tr>
                      <td colSpan={4} className="px-4 py-2.5 text-right">
                        <span className="text-gray-400 text-sm font-semibold">Total:</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="text-white text-sm font-bold">{totalQuantity}</span>
                      </td>
                      <td colSpan={2} className="px-4 py-2.5 text-center">
                        <span className="text-gray-400 text-xs">{movement.products.length} producto(s)</span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-[#1a2332] border border-white/10 rounded-lg">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No hay productos en este movimiento</p>
              </div>
            )}
          </div>

          {/* Resumen de Impacto */}
          {movement.products && movement.products.length > 0 && (
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Resumen</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Total Productos</p>
                  <p className="text-white text-xl font-bold">{movement.products.length}</p>
                </div>
                <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Cantidad Total</p>
                  <p className="text-white text-xl font-bold">{totalQuantity}</p>
                </div>
                <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Tipo Movimiento</p>
                  <p className={`text-lg font-bold ${typeInfo.text}`}>{typeInfo.label}</p>
                </div>
                {movement.createdAt && (
                  <div className="bg-[#1a2332] border border-white/10 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Fecha Registro</p>
                    <p className="text-white text-xs font-medium">
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
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-[#1a2332]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium text-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
