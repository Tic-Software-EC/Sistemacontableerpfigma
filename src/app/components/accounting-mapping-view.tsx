import {
  ShoppingCart, ShoppingBag, Banknote, Package,
  Users, TrendingDown, ArrowUpRight, ArrowDownRight,
  FileText, AlertCircle,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useAccountingConfig } from "../contexts/accounting-config-context";

/* ══════════════════════════════════════════════════
   Definición de eventos del sistema
══════════════════════════════════════════════════ */
interface EventoMapping {
  id: string;
  nombre: string;
  modulo: string;
  icon: typeof ShoppingCart;
  color: string;
  movimientos: {
    tipo: "debe" | "haber";
    cuenta: string;
    cuentaCfg: string; // key del config
    descripcion: string;
  }[];
}

export function AccountingMappingView() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { config } = useAccountingConfig();

  const eventos: EventoMapping[] = [
    {
      id: "factura_venta_contado",
      nombre: "Factura de Venta al Contado",
      modulo: "Ventas / POS",
      icon: ShoppingCart,
      color: "blue",
      movimientos: [
        { tipo: "debe", cuenta: config.ventaCobro.codigo, cuentaCfg: "ventaCobro", descripcion: "Entra dinero a caja/banco" },
        { tipo: "haber", cuenta: config.ventaIngreso.codigo, cuentaCfg: "ventaIngreso", descripcion: "Ingreso por venta" },
        { tipo: "haber", cuenta: config.ivaVentas.codigo, cuentaCfg: "ivaVentas", descripcion: "IVA cobrado al cliente" },
      ],
    },
    {
      id: "factura_venta_credito",
      nombre: "Factura de Venta a Crédito",
      modulo: "Ventas / POS",
      icon: ShoppingCart,
      color: "blue",
      movimientos: [
        { tipo: "debe", cuenta: config.ventaCxC.codigo, cuentaCfg: "ventaCxC", descripcion: "El cliente nos debe" },
        { tipo: "haber", cuenta: config.ventaIngreso.codigo, cuentaCfg: "ventaIngreso", descripcion: "Ingreso por venta" },
        { tipo: "haber", cuenta: config.ivaVentas.codigo, cuentaCfg: "ivaVentas", descripcion: "IVA cobrado al cliente" },
      ],
    },
    {
      id: "factura_compra_contado",
      nombre: "Factura de Compra al Contado",
      modulo: "Compras",
      icon: ShoppingBag,
      color: "purple",
      movimientos: [
        { tipo: "debe", cuenta: config.compraInventario.codigo, cuentaCfg: "compraInventario", descripcion: "Mercadería que ingresa" },
        { tipo: "debe", cuenta: config.compraIvaCredito.codigo, cuentaCfg: "compraIvaCredito", descripcion: "Crédito tributario IVA" },
        { tipo: "haber", cuenta: config.compraPago.codigo, cuentaCfg: "compraPago", descripcion: "Sale dinero de caja/banco" },
      ],
    },
    {
      id: "factura_compra_credito",
      nombre: "Factura de Compra a Crédito",
      modulo: "Compras",
      icon: ShoppingBag,
      color: "purple",
      movimientos: [
        { tipo: "debe", cuenta: config.compraInventario.codigo, cuentaCfg: "compraInventario", descripcion: "Mercadería que ingresa" },
        { tipo: "debe", cuenta: config.compraIvaCredito.codigo, cuentaCfg: "compraIvaCredito", descripcion: "Crédito tributario IVA" },
        { tipo: "haber", cuenta: config.compraCxP.codigo, cuentaCfg: "compraCxP", descripcion: "Deuda con proveedor" },
      ],
    },
    {
      id: "cobro_cliente",
      nombre: "Cobro a Cliente",
      modulo: "Cartera / Tesorería",
      icon: Banknote,
      color: "emerald",
      movimientos: [
        { tipo: "debe", cuenta: config.bancoPrincipal.codigo, cuentaCfg: "bancoPrincipal", descripcion: "Entra dinero al banco" },
        { tipo: "haber", cuenta: config.cxcClientes.codigo, cuentaCfg: "cxcClientes", descripcion: "Cliente ya no nos debe" },
      ],
    },
    {
      id: "pago_proveedor",
      nombre: "Pago a Proveedor",
      modulo: "Cartera / Tesorería",
      icon: Banknote,
      color: "orange",
      movimientos: [
        { tipo: "debe", cuenta: config.cxpProveedores.codigo, cuentaCfg: "cxpProveedores", descripcion: "Ya no debemos al proveedor" },
        { tipo: "haber", cuenta: config.bancoPrincipal.codigo, cuentaCfg: "bancoPrincipal", descripcion: "Sale dinero del banco" },
      ],
    },
    {
      id: "ajuste_inventario",
      nombre: "Ajuste de Inventario (Pérdida)",
      modulo: "Inventario",
      icon: Package,
      color: "teal",
      movimientos: [
        { tipo: "debe", cuenta: config.ajusteInventario.codigo, cuentaCfg: "ajusteInventario", descripcion: "Pérdida por diferencia" },
        { tipo: "haber", cuenta: config.inventarioPrincipal.codigo, cuentaCfg: "inventarioPrincipal", descripcion: "Inventario se reduce" },
      ],
    },
    {
      id: "pago_nomina",
      nombre: "Pago de Nómina",
      modulo: "Nómina / RRHH",
      icon: Users,
      color: "amber",
      movimientos: [
        { tipo: "debe", cuenta: config.nominaSueldos.codigo, cuentaCfg: "nominaSueldos", descripcion: "Sueldos del personal" },
        { tipo: "debe", cuenta: config.nominaBeneficios.codigo, cuentaCfg: "nominaBeneficios", descripcion: "Beneficios sociales" },
        { tipo: "haber", cuenta: config.bancoPrincipal.codigo, cuentaCfg: "bancoPrincipal", descripcion: "Sale del banco" },
      ],
    },
    {
      id: "depreciacion_mensual",
      nombre: "Depreciación Mensual",
      modulo: "Activos Fijos",
      icon: TrendingDown,
      color: "rose",
      movimientos: [
        { tipo: "debe", cuenta: config.depreciacionGasto.codigo, cuentaCfg: "depreciacionGasto", descripcion: "Gasto del período" },
        { tipo: "haber", cuenta: config.depreciacionAcum.codigo, cuentaCfg: "depreciacionAcum", descripcion: "El activo pierde valor" },
      ],
    },
  ];

  const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    blue:    { bg: isLight ? "bg-blue-50" : "bg-blue-500/10", border: isLight ? "border-blue-200" : "border-blue-500/20", text: isLight ? "text-blue-700" : "text-blue-300", badge: isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-400" },
    purple:  { bg: isLight ? "bg-purple-50" : "bg-purple-500/10", border: isLight ? "border-purple-200" : "border-purple-500/20", text: isLight ? "text-purple-700" : "text-purple-300", badge: isLight ? "bg-purple-100 text-purple-700" : "bg-purple-500/20 text-purple-400" },
    emerald: { bg: isLight ? "bg-emerald-50" : "bg-emerald-500/10", border: isLight ? "border-emerald-200" : "border-emerald-500/20", text: isLight ? "text-emerald-700" : "text-emerald-300", badge: isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500/20 text-emerald-400" },
    orange:  { bg: isLight ? "bg-orange-50" : "bg-orange-500/10", border: isLight ? "border-orange-200" : "border-orange-500/20", text: isLight ? "text-orange-700" : "text-orange-300", badge: isLight ? "bg-orange-100 text-orange-700" : "bg-orange-500/20 text-orange-400" },
    teal:    { bg: isLight ? "bg-teal-50" : "bg-teal-500/10", border: isLight ? "border-teal-200" : "border-teal-500/20", text: isLight ? "text-teal-700" : "text-teal-300", badge: isLight ? "bg-teal-100 text-teal-700" : "bg-teal-500/20 text-teal-400" },
    amber:   { bg: isLight ? "bg-amber-50" : "bg-amber-500/10", border: isLight ? "border-amber-200" : "border-amber-500/20", text: isLight ? "text-amber-700" : "text-amber-300", badge: isLight ? "bg-amber-100 text-amber-700" : "bg-amber-500/20 text-amber-400" },
    rose:    { bg: isLight ? "bg-rose-50" : "bg-rose-500/10", border: isLight ? "border-rose-200" : "border-rose-500/20", text: isLight ? "text-rose-700" : "text-rose-300", badge: isLight ? "bg-rose-100 text-rose-700" : "bg-rose-500/20 text-rose-400" },
  };

  const sub = isLight ? "text-gray-400" : "text-gray-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-start gap-4 px-5 py-4 rounded-xl border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
        <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLight ? "text-blue-600" : "text-blue-400"}`} />
        <div>
          <h3 className={`font-bold text-sm ${isLight ? "text-blue-900" : "text-blue-200"}`}>
            Mapa de Eventos → Cuentas Contables
          </h3>
          <p className={`text-xs mt-1 ${isLight ? "text-blue-700" : "text-blue-300"}`}>
            Este es el mapeo automático de eventos del sistema a asientos contables. Cada evento genera automáticamente un asiento con las cuentas configuradas.
          </p>
        </div>
      </div>

      {/* Aviso de configuración */}
      <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-xs ${isLight ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-amber-500/10 border-amber-500/20 text-amber-300"}`}>
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Las cuentas mostradas aquí se configuran desde el botón <strong>"Configurar cuentas"</strong> en la parte superior.
          Puedes cambiar qué cuenta se usa para cada tipo de operación.
        </p>
      </div>

      {/* Lista de eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {eventos.map((evento) => {
          const Icon = evento.icon;
          const colors = colorMap[evento.color];
          const debes = evento.movimientos.filter(m => m.tipo === "debe");
          const haberes = evento.movimientos.filter(m => m.tipo === "haber");

          return (
            <div
              key={evento.id}
              className={`rounded-xl border p-5 ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}
            >
              {/* Header del evento */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg} border ${colors.border}`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                    {evento.nombre}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${colors.badge}`}>
                      {evento.modulo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Asiento contable */}
              <div className="space-y-3">
                {/* DEBE */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className={`w-3.5 h-3.5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${sub}`}>
                      Debe
                    </span>
                  </div>
                  <div className="space-y-2">
                    {debes.map((mov, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.02] border-white/10"}`}
                      >
                        <div className="w-1 h-full min-h-[24px] bg-primary rounded-full flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono font-bold text-primary">
                            {mov.cuenta}
                          </p>
                          <p className={`text-xs mt-0.5 ${sub}`}>
                            {mov.descripcion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HABER */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownRight className={`w-3.5 h-3.5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${sub}`}>
                      Haber
                    </span>
                  </div>
                  <div className="space-y-2">
                    {haberes.map((mov, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.02] border-white/10"}`}
                      >
                        <div className={`w-1 h-full min-h-[24px] rounded-full flex-shrink-0 mt-1 ${isLight ? "bg-gray-300" : "bg-white/20"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono font-bold text-primary">
                            {mov.cuenta}
                          </p>
                          <p className={`text-xs mt-0.5 ${sub}`}>
                            {mov.descripcion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
