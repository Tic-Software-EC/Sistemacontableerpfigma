import { useState } from "react";
import {
  Search,
  Download,
  DollarSign,
  Building2,
  FileText,
  Calendar,
  AlertCircle,
  CheckSquare,
  Clock,
  Eye,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface PagoProveedoresTabProps {
  theme: string;
  isLight: boolean;
}

interface PagoProveedor {
  id: string;
  proveedor: string;
  ruc: string;
  factura: string;
  fechaFactura: string;
  fechaVencimiento: string;
  subtotal: number;
  iva: number;
  total: number;
  formaPago: string;
  banco: string;
  numeroCuenta: string;
  estado: "pendiente" | "pagado" | "vencido" | "parcial";
  montoPagado?: number;
  fechaPago?: string;
}

export function PagoProveedoresTab({ theme, isLight }: PagoProveedoresTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [selectedFormaPago, setSelectedFormaPago] = useState("todos");
  const [pagosSeleccionados, setPagosSeleccionados] = useState<string[]>([]);

  const pagosProveedores: PagoProveedor[] = [
    {
      id: "1",
      proveedor: "Distribuidora del Norte S.A.",
      ruc: "0992345678001",
      factura: "001-001-000145",
      fechaFactura: "01/03/2026",
      fechaVencimiento: "31/03/2026",
      subtotal: 5200.00,
      iva: 624.00,
      total: 5824.00,
      formaPago: "Transferencia",
      banco: "Banco Pichincha",
      numeroCuenta: "2100456789",
      estado: "pendiente",
    },
    {
      id: "2",
      proveedor: "Tech Solutions Ecuador",
      ruc: "1792345678001",
      factura: "002-001-000789",
      fechaFactura: "28/02/2026",
      fechaVencimiento: "15/03/2026",
      subtotal: 1800.00,
      iva: 216.00,
      total: 2016.00,
      formaPago: "Cheque",
      banco: "Banco Guayaquil",
      numeroCuenta: "0012345678",
      estado: "vencido",
    },
    {
      id: "3",
      proveedor: "Papelería Universal",
      ruc: "0992876543001",
      factura: "001-002-001256",
      fechaFactura: "05/03/2026",
      fechaVencimiento: "05/04/2026",
      subtotal: 450.00,
      iva: 54.00,
      total: 504.00,
      formaPago: "Transferencia",
      banco: "Banco del Pacífico",
      numeroCuenta: "7500123456",
      estado: "pendiente",
    },
    {
      id: "4",
      proveedor: "Ferretería El Hierro",
      ruc: "1792567890001",
      factura: "003-001-000345",
      fechaFactura: "10/02/2026",
      fechaVencimiento: "10/03/2026",
      subtotal: 3200.00,
      iva: 384.00,
      total: 3584.00,
      formaPago: "Transferencia",
      banco: "Banco Pichincha",
      numeroCuenta: "2100987654",
      estado: "pagado",
      montoPagado: 3584.00,
      fechaPago: "08/03/2026",
    },
    {
      id: "5",
      proveedor: "Alimentos del Ecuador S.A.",
      ruc: "0991234567001",
      factura: "001-003-000678",
      fechaFactura: "01/03/2026",
      fechaVencimiento: "16/03/2026",
      subtotal: 2500.00,
      iva: 300.00,
      total: 2800.00,
      formaPago: "Transferencia",
      banco: "Banco Guayaquil",
      numeroCuenta: "0098765432",
      estado: "parcial",
      montoPagado: 1400.00,
    },
  ];

  const handleSelectPago = (id: string) => {
    setPagosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (pagosSeleccionados.length === pagosFiltrados.length) {
      setPagosSeleccionados([]);
    } else {
      setPagosSeleccionados(pagosFiltrados.map(p => p.id));
    }
  };

  const handleProcesarPagos = () => {
    if (pagosSeleccionados.length === 0) {
      toast.error("Selección requerida", {
        description: "Selecciona al menos una factura para procesar el pago"
      });
      return;
    }

    const pagosPendientes = pagosSeleccionados.filter(id => {
      const pago = pagosProveedores.find(p => p.id === id);
      return pago?.estado === "pendiente" || pago?.estado === "vencido" || pago?.estado === "parcial";
    });

    if (pagosPendientes.length === 0) {
      toast.error("Sin pagos pendientes", {
        description: "Las facturas seleccionadas ya han sido pagadas"
      });
      return;
    }

    toast.success("Pagos procesados exitosamente", {
      description: `${pagosPendientes.length} pago(s) a proveedores procesado(s)`
    });
    setPagosSeleccionados([]);
  };

  const pagosFiltrados = pagosProveedores.filter(pago => {
    const matchesSearch =
      pago.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.ruc.includes(searchTerm) ||
      pago.factura.includes(searchTerm);

    const matchesEstado = selectedEstado === "todos" || pago.estado === selectedEstado;
    const matchesFormaPago = selectedFormaPago === "todos" || pago.formaPago === selectedFormaPago;

    return matchesSearch && matchesEstado && matchesFormaPago;
  });

  const totalPendiente = pagosFiltrados
    .filter(p => p.estado === "pendiente" || p.estado === "vencido")
    .reduce((sum, p) => sum + p.total, 0);

  const totalSeleccionado = pagosFiltrados
    .filter(p => pagosSeleccionados.includes(p.id) && (p.estado === "pendiente" || p.estado === "vencido" || p.estado === "parcial"))
    .reduce((sum, p) => {
      if (p.estado === "parcial" && p.montoPagado) {
        return sum + (p.total - p.montoPagado);
      }
      return sum + p.total;
    }, 0);

  const getEstadoBadge = (pago: PagoProveedor) => {
    switch (pago.estado) {
      case "pagado":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
            <CheckSquare className="w-3 h-3" />
            Pagado
          </span>
        );
      case "vencido":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Vencido
          </span>
        );
      case "parcial":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Parcial
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-medium">
            <DollarSign className="w-3 h-3" />
            Pendiente
          </span>
        );
    }
  };

  const getDiasVencimiento = (fechaVencimiento: string) => {
    const hoy = new Date("2026-03-15");
    const [dia, mes, año] = fechaVencimiento.split("/");
    const vencimiento = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
    const diffTime = vencimiento.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4">
      {/* Acciones principales */}
      <div className="flex justify-end gap-3">
        <button
          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            isLight
              ? "border-gray-200 hover:bg-gray-50 text-gray-700"
              : "border-white/10 hover:bg-white/5 text-white"
          }`}
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>
        <button
          onClick={handleProcesarPagos}
          disabled={pagosSeleccionados.length === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            pagosSeleccionados.length === 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Procesar Pagos ({pagosSeleccionados.length})
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar proveedor, RUC o factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-1.5 border rounded-lg text-sm ${
              isLight
                ? "bg-white border-gray-200 text-gray-900"
                : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            }`}
          />
        </div>

        <select
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="todos">Todos los Estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="vencido">Vencido</option>
          <option value="parcial">Pago Parcial</option>
          <option value="pagado">Pagado</option>
        </select>

        <select
          value={selectedFormaPago}
          onChange={(e) => setSelectedFormaPago(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="todos">Todas las Formas de Pago</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Cheque">Cheque</option>
          <option value="Efectivo">Efectivo</option>
        </select>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Pendiente</p>
              <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                ${totalPendiente.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckSquare className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Seleccionado</p>
              <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                ${totalSeleccionado.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className={`border rounded-lg overflow-hidden ${
        isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={pagosSeleccionados.length === pagosFiltrados.length && pagosFiltrados.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  IVA
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Forma de Pago
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
              {pagosFiltrados.map((pago) => {
                const diasVencimiento = getDiasVencimiento(pago.fechaVencimiento);
                return (
                  <tr
                    key={pago.id}
                    className={`transition-colors ${
                      isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={pagosSeleccionados.includes(pago.id)}
                        onChange={() => handleSelectPago(pago.id)}
                        disabled={pago.estado === "pagado"}
                        className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0 disabled:opacity-50"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {pago.proveedor}
                        </p>
                        <p className="text-xs text-gray-400">RUC: {pago.ruc}</p>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      {pago.factura}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          Emisión: {pago.fechaFactura}
                        </p>
                        <p className={`text-xs ${
                          diasVencimiento < 0 ? "text-red-400" : diasVencimiento <= 7 ? "text-yellow-400" : "text-gray-400"
                        }`}>
                          Vence: {pago.fechaVencimiento}
                          {diasVencimiento < 0 && ` (${Math.abs(diasVencimiento)}d vencido)`}
                          {diasVencimiento >= 0 && diasVencimiento <= 7 && ` (${diasVencimiento}d)`}
                        </p>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-sm text-right ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      ${pago.subtotal.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      ${pago.iva.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        ${pago.total.toFixed(2)}
                      </p>
                      {pago.estado === "parcial" && pago.montoPagado && (
                        <p className="text-xs text-blue-400">
                          Pagado: ${pago.montoPagado.toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          {pago.formaPago}
                        </p>
                        <p className="text-xs text-gray-400">
                          {pago.banco}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getEstadoBadge(pago)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight
                              ? "hover:bg-blue-50 text-blue-600"
                              : "hover:bg-blue-500/10 text-blue-400"
                          }`}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight
                              ? "hover:bg-gray-100 text-gray-600"
                              : "hover:bg-white/5 text-gray-400"
                          }`}
                          title="Ver factura"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}