import { useState } from "react";
import {
  Search,
  Plus,
  DollarSign,
  Calendar,
  Filter,
  FileText,
  CheckSquare,
  XCircle,
  AlertCircle,
  Building2,
  CreditCard,
  Banknote,
  X,
  ChevronDown,
  Download,
  Eye,
  Printer,
  Receipt,
  Clock,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "../ui/date-picker";

interface PagoProveedoresTabProps {
  theme: string;
  isLight: boolean;
}

interface PagoProveedor {
  id: string;
  proveedor: string;
  ruc: string;
  numeroFactura: string;
  fechaEmision: string;
  fechaVencimiento: string;
  monto: number;
  saldo: number;
  estado: "pendiente" | "pagado" | "vencido";
  diasVencimiento?: number;
  concepto: string;
}

export function PagoProveedoresTab({ theme, isLight }: PagoProveedoresTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [pagosSeleccionados, setPagosSeleccionados] = useState<string[]>([]);
  const [showModalMetodoPago, setShowModalMetodoPago] = useState(false);
  const [showModalDetalle, setShowModalDetalle] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoProveedor | null>(null);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");
  const [bancoTransferencia, setBancoTransferencia] = useState("pichincha");
  const [datosCheque, setDatosCheque] = useState({
    numeroCheque: "",
    banco: "pichincha",
    fecha: "",
  });

  const pagosProveedores: PagoProveedor[] = [
    {
      id: "1",
      proveedor: "Distribuidora del Norte S.A.",
      ruc: "0992345678001",
      numeroFactura: "001-001-000145",
      fechaEmision: "01/03/2026",
      fechaVencimiento: "31/03/2026",
      monto: 5824.00,
      saldo: 5824.00,
      estado: "pendiente",
      concepto: "Compra de mercancías",
    },
    {
      id: "2",
      proveedor: "Tech Solutions Ecuador",
      ruc: "1792345678001",
      numeroFactura: "002-001-000789",
      fechaEmision: "28/02/2026",
      fechaVencimiento: "15/03/2026",
      monto: 2016.00,
      saldo: 2016.00,
      estado: "vencido",
      concepto: "Servicios de mantenimiento",
    },
    {
      id: "3",
      proveedor: "Papelería Universal",
      ruc: "0992876543001",
      numeroFactura: "001-002-001256",
      fechaEmision: "05/03/2026",
      fechaVencimiento: "05/04/2026",
      monto: 504.00,
      saldo: 504.00,
      estado: "pendiente",
      concepto: "Compra de papel",
    },
    {
      id: "4",
      proveedor: "Ferretería El Hierro",
      ruc: "1792567890001",
      numeroFactura: "003-001-000345",
      fechaEmision: "10/02/2026",
      fechaVencimiento: "10/03/2026",
      monto: 3584.00,
      saldo: 0.00,
      estado: "pagado",
      concepto: "Compra de herramientas",
    },
    {
      id: "5",
      proveedor: "Alimentos del Ecuador S.A.",
      ruc: "0991234567001",
      numeroFactura: "001-003-000678",
      fechaEmision: "01/03/2026",
      fechaVencimiento: "16/03/2026",
      monto: 2800.00,
      saldo: 1400.00,
      estado: "pendiente",
      concepto: "Compra de alimentos",
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
      return pago?.estado === "pendiente" || pago?.estado === "vencido";
    });

    if (pagosPendientes.length === 0) {
      toast.error("Sin pagos pendientes", {
        description: "Las facturas seleccionadas ya han sido pagadas"
      });
      return;
    }

    // Abrir modal de método de pago
    setShowModalMetodoPago(true);
  };

  const handleConfirmarPago = () => {
    if (!metodoPagoSeleccionado) {
      toast.error("Método de pago requerido", {
        description: "Selecciona un método de pago para continuar"
      });
      return;
    }

    if (metodoPagoSeleccionado === "cheque") {
      if (!datosCheque.numeroCheque || !datosCheque.fecha) {
        toast.error("Datos incompletos", {
          description: "Completa los datos del cheque"
        });
        return;
      }

      // Simular envío a bandeja de impresión de cheques
      toast.success("Cheque creado exitosamente", {
        description: `Cheque #${datosCheque.numeroCheque} enviado a la bandeja de impresión`
      });
    } else if (metodoPagoSeleccionado === "transferencia") {
      const nombreBanco = bancoTransferencia === "pichincha" ? "Banco Pichincha" : 
                          bancoTransferencia === "guayaquil" ? "Banco Guayaquil" : 
                          "Banco del Pacífico";
      toast.success("Pago procesado exitosamente", {
        description: `${pagosSeleccionados.length} pago(s) procesado(s) por transferencia desde ${nombreBanco}`
      });
    } else {
      toast.success("Pago procesado exitosamente", {
        description: `${pagosSeleccionados.length} pago(s) procesado(s) en efectivo`
      });
    }

    // Resetear estados
    setShowModalMetodoPago(false);
    setMetodoPagoSeleccionado("");
    setBancoTransferencia("pichincha");
    setDatosCheque({ numeroCheque: "", banco: "pichincha", fecha: "" });
    setPagosSeleccionados([]);
  };

  const pagosFiltrados = pagosProveedores.filter(pago => {
    const matchesSearch =
      pago.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pago.ruc.includes(searchTerm) ||
      pago.numeroFactura.includes(searchTerm);

    const matchesEstado = selectedEstado === "todos" || pago.estado === selectedEstado;

    const matchesFechaDesde = !fechaDesde || new Date(pago.fechaEmision) >= fechaDesde;
    const matchesFechaHasta = !fechaHasta || new Date(pago.fechaEmision) <= fechaHasta;

    return matchesSearch && matchesEstado && matchesFechaDesde && matchesFechaHasta;
  });

  const totalPendiente = pagosFiltrados
    .filter(p => p.estado === "pendiente" || p.estado === "vencido")
    .reduce((sum, p) => sum + p.saldo, 0);

  const totalSeleccionado = pagosFiltrados
    .filter(p => pagosSeleccionados.includes(p.id) && (p.estado === "pendiente" || p.estado === "vencido"))
    .reduce((sum, p) => sum + p.saldo, 0);

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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="relative md:col-span-2">
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
          <option value="pagado">Pagado</option>
        </select>

        <DatePicker
          value={fechaDesde}
          onChange={setFechaDesde}
          placeholder="Desde..."
          isLight={isLight}
        />

        <DatePicker
          value={fechaHasta}
          onChange={setFechaHasta}
          placeholder="Hasta..."
          isLight={isLight}
        />
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
                  Concepto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Saldo
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
                      {pago.numeroFactura}
                    </td>
                    <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      {pago.concepto}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          Emisión: {pago.fechaEmision}
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
                    <td className={`px-4 py-3 text-sm text-right font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${pago.monto.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-semibold ${
                      pago.saldo > 0 ? "text-yellow-400" : "text-green-400"
                    }`}>
                      ${pago.saldo.toFixed(2)}
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
                          onClick={() => {
                            setPagoSeleccionado(pago);
                            setShowModalDetalle(true);
                          }}
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

      {/* Modal de método de pago */}
      {showModalMetodoPago && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-lg w-full p-6 rounded-lg shadow-xl ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Seleccionar Método de Pago
              </h3>
              <button
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
                onClick={() => {
                  setShowModalMetodoPago(false);
                  setMetodoPagoSeleccionado("");
                  setDatosCheque({ numeroCheque: "", banco: "pichincha", fecha: "" });
                }}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Resumen de pagos */}
              <div className={`p-4 rounded-lg border ${
                isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Facturas seleccionadas</p>
                    <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {pagosSeleccionados.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Total a pagar</p>
                    <p className="text-lg font-bold text-primary">
                      ${totalSeleccionado.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Método de Pago *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setMetodoPagoSeleccionado("transferencia")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      metodoPagoSeleccionado === "transferencia"
                        ? "border-primary bg-primary/10"
                        : isLight
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                      metodoPagoSeleccionado === "transferencia" ? "text-primary" : "text-gray-400"
                    }`} />
                    <p className={`text-xs font-medium ${
                      metodoPagoSeleccionado === "transferencia"
                        ? "text-primary"
                        : isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Transferencia
                    </p>
                  </button>

                  <button
                    onClick={() => setMetodoPagoSeleccionado("cheque")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      metodoPagoSeleccionado === "cheque"
                        ? "border-primary bg-primary/10"
                        : isLight
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <FileText className={`w-6 h-6 mx-auto mb-2 ${
                      metodoPagoSeleccionado === "cheque" ? "text-primary" : "text-gray-400"
                    }`} />
                    <p className={`text-xs font-medium ${
                      metodoPagoSeleccionado === "cheque"
                        ? "text-primary"
                        : isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Cheque
                    </p>
                  </button>

                  <button
                    onClick={() => setMetodoPagoSeleccionado("efectivo")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      metodoPagoSeleccionado === "efectivo"
                        ? "border-primary bg-primary/10"
                        : isLight
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Banknote className={`w-6 h-6 mx-auto mb-2 ${
                      metodoPagoSeleccionado === "efectivo" ? "text-primary" : "text-gray-400"
                    }`} />
                    <p className={`text-xs font-medium ${
                      metodoPagoSeleccionado === "efectivo"
                        ? "text-primary"
                        : isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Efectivo
                    </p>
                  </button>
                </div>
              </div>

              {/* Campos adicionales para cheque */}
              {metodoPagoSeleccionado === "cheque" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Número de Cheque *
                    </label>
                    <input
                      type="text"
                      value={datosCheque.numeroCheque}
                      onChange={(e) => setDatosCheque({ ...datosCheque, numeroCheque: e.target.value })}
                      placeholder="Ej: 001238"
                      className={`w-full px-3 py-2 border rounded-lg text-sm ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Banco *
                    </label>
                    <select
                      value={datosCheque.banco}
                      onChange={(e) => setDatosCheque({ ...datosCheque, banco: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <option value="pichincha">Banco Pichincha</option>
                      <option value="guayaquil">Banco Guayaquil</option>
                      <option value="pacifico">Banco del Pacífico</option>
                    </select>
                  </div>

                  <div>
                    <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Fecha de Emisión *
                    </label>
                    <input
                      type="date"
                      value={datosCheque.fecha}
                      onChange={(e) => setDatosCheque({ ...datosCheque, fecha: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Campos adicionales para transferencia */}
              {metodoPagoSeleccionado === "transferencia" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Banco de Origen *
                    </label>
                    <select
                      value={bancoTransferencia}
                      onChange={(e) => setBancoTransferencia(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <option value="pichincha">Banco Pichincha</option>
                      <option value="guayaquil">Banco Guayaquil</option>
                      <option value="pacifico">Banco del Pacífico</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModalMetodoPago(false);
                    setMetodoPagoSeleccionado("");
                    setDatosCheque({ numeroCheque: "", banco: "pichincha", fecha: "" });
                  }}
                  className={`flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                    isLight
                      ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                      : "border-white/10 hover:bg-white/5 text-white"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarPago}
                  disabled={!metodoPagoSeleccionado}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    !metodoPagoSeleccionado
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Confirmar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle */}
      {showModalDetalle && pagoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-3xl w-full p-6 rounded-xl shadow-2xl ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Detalles del Pago a Proveedor
              </h3>
              <button
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
                onClick={() => {
                  setShowModalDetalle(false);
                  setPagoSeleccionado(null);
                }}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Header del proveedor */}
              <div className={`p-6 rounded-lg border-2 ${
                isLight 
                  ? "bg-gradient-to-br from-orange-50 to-white border-orange-200" 
                  : "bg-gradient-to-br from-primary/10 to-secondary border-primary/20"
              }`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {pagoSeleccionado.proveedor}
                    </h4>
                    <p className="text-sm text-gray-400 mt-0.5">RUC: {pagoSeleccionado.ruc}</p>
                  </div>
                  <div className="text-right">
                    {getEstadoBadge(pagoSeleccionado)}
                  </div>
                </div>
              </div>

              {/* Información de la factura */}
              <div className={`rounded-lg border overflow-hidden ${
                isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
              }`}>
                <div className={`px-5 py-3 border-b ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-primary" />
                    <h5 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Información de Factura
                    </h5>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border ${
                      isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                    }`}>
                      <p className="text-xs text-gray-400 mb-1.5">Número de Factura</p>
                      <p className={`text-lg font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {pagoSeleccionado.numeroFactura}
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg border ${
                      isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                    }`}>
                      <p className="text-xs text-gray-400 mb-1.5">Concepto</p>
                      <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {pagoSeleccionado.concepto}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${
                  isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <p className="text-xs font-medium text-gray-400">Fecha de Emisión</p>
                  </div>
                  <p className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {pagoSeleccionado.fechaEmision}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  pagoSeleccionado.estado === "vencido" 
                    ? "bg-red-500/10 border-red-500/30" 
                    : getDiasVencimiento(pagoSeleccionado.fechaVencimiento) <= 7
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className={`w-4 h-4 ${
                      pagoSeleccionado.estado === "vencido" 
                        ? "text-red-400" 
                        : getDiasVencimiento(pagoSeleccionado.fechaVencimiento) <= 7
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`} />
                    <p className={`text-xs font-medium ${
                      pagoSeleccionado.estado === "vencido" 
                        ? "text-red-400" 
                        : getDiasVencimiento(pagoSeleccionado.fechaVencimiento) <= 7
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}>
                      Fecha de Vencimiento
                    </p>
                  </div>
                  <p className={`text-base font-semibold ${
                    pagoSeleccionado.estado === "vencido" 
                      ? "text-red-400" 
                      : getDiasVencimiento(pagoSeleccionado.fechaVencimiento) <= 7
                      ? "text-yellow-400"
                      : isLight ? "text-gray-900" : "text-white"
                  }`}>
                    {pagoSeleccionado.fechaVencimiento}
                  </p>
                  {(() => {
                    const dias = getDiasVencimiento(pagoSeleccionado.fechaVencimiento);
                    return dias < 0 ? (
                      <p className="text-xs text-red-400 mt-1">
                        Vencido hace {Math.abs(dias)} día(s)
                      </p>
                    ) : dias <= 7 ? (
                      <p className="text-xs text-yellow-400 mt-1">
                        Vence en {dias} día(s)
                      </p>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Montos */}
              <div className={`rounded-lg border overflow-hidden ${
                isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
              }`}>
                <div className={`px-5 py-3 border-b ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <h5 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Detalle de Montos
                    </h5>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Monto Total de la Factura
                    </span>
                    <span className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${pagoSeleccionado.monto.toFixed(2)}
                    </span>
                  </div>

                  {pagoSeleccionado.monto !== pagoSeleccionado.saldo && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-400">
                        Pagado
                      </span>
                      <span className="text-base font-semibold text-green-400">
                        ${(pagoSeleccionado.monto - pagoSeleccionado.saldo).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className={`pt-3 border-t flex items-center justify-between ${
                    isLight ? "border-gray-200" : "border-white/10"
                  }`}>
                    <span className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Saldo Pendiente
                    </span>
                    <span className={`text-2xl font-bold ${
                      pagoSeleccionado.saldo > 0 ? "text-yellow-400" : "text-green-400"
                    }`}>
                      ${pagoSeleccionado.saldo.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowModalDetalle(false);
                    setPagoSeleccionado(null);
                  }}
                  className={`flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                    isLight
                      ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                      : "border-white/10 hover:bg-white/5 text-white"
                  }`}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    toast.success("Comprobante generado", {
                      description: `Comprobante de pago para ${pagoSeleccionado.proveedor}`
                    });
                  }}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Comprobante
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}