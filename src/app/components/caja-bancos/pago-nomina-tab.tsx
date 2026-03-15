import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  DollarSign,
  Calendar,
  CheckSquare,
  AlertCircle,
  Building2,
  CreditCard,
  FileText,
  Eye,
  Printer,
  ChevronDown,
  Banknote,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "../ui/date-picker";

interface PagoNominaTabProps {
  theme: string;
  isLight: boolean;
}

interface EmpleadoNomina {
  id: string;
  empleado: string;
  cedula: string;
  cargo: string;
  departamento: string;
  salario: number;
  descuentos: number;
  bonificaciones: number;
  totalPagar: number;
  banco: string;
  numeroCuenta: string;
  tipoCuenta: string;
  estado: "pendiente" | "pagado" | "procesando";
  fechaPago?: string;
}

export function PagoNominaTab({ theme, isLight }: PagoNominaTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState("marzo-2026");
  const [selectedBanco, setSelectedBanco] = useState("todos");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState<string[]>([]);
  const [showModalMetodoPago, setShowModalMetodoPago] = useState(false);
  const [showModalDetalle, setShowModalDetalle] = useState(false);
  const [showModalComprobante, setShowModalComprobante] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<EmpleadoNomina | null>(null);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState("");
  const [bancoTransferencia, setBancoTransferencia] = useState("pichincha");
  const [datosCheque, setDatosCheque] = useState({
    numeroCheque: "",
    banco: "pichincha",
    fecha: "",
  });

  const empleadosNomina: EmpleadoNomina[] = [
    {
      id: "1",
      empleado: "Juan Carlos Pérez",
      cedula: "0912345678",
      cargo: "Gerente de Ventas",
      departamento: "Ventas",
      salario: 2500.00,
      descuentos: 350.00,
      bonificaciones: 200.00,
      totalPagar: 2350.00,
      banco: "Banco Pichincha",
      numeroCuenta: "2100123456",
      tipoCuenta: "Ahorros",
      estado: "pendiente",
    },
    {
      id: "2",
      empleado: "María González Torres",
      cedula: "0923456789",
      cargo: "Contador",
      departamento: "Contabilidad",
      salario: 1800.00,
      descuentos: 250.00,
      bonificaciones: 150.00,
      totalPagar: 1700.00,
      banco: "Banco Guayaquil",
      numeroCuenta: "0012345678",
      tipoCuenta: "Corriente",
      estado: "pagado",
      fechaPago: "15/03/2026",
    },
    {
      id: "3",
      empleado: "Carlos Ramírez López",
      cedula: "0934567890",
      cargo: "Vendedor",
      departamento: "Ventas",
      salario: 1200.00,
      descuentos: 180.00,
      bonificaciones: 100.00,
      totalPagar: 1120.00,
      banco: "Banco Pichincha",
      numeroCuenta: "2100987654",
      tipoCuenta: "Ahorros",
      estado: "procesando",
    },
    {
      id: "4",
      empleado: "Ana Mendoza Silva",
      cedula: "0945678901",
      cargo: "Asistente Administrativo",
      departamento: "Administración",
      salario: 900.00,
      descuentos: 120.00,
      bonificaciones: 50.00,
      totalPagar: 830.00,
      banco: "Banco del Pacífico",
      numeroCuenta: "7500456789",
      tipoCuenta: "Ahorros",
      estado: "pendiente",
    },
    {
      id: "5",
      empleado: "Luis Morales Vera",
      cedula: "0956789012",
      cargo: "Jefe de Logística",
      departamento: "Operaciones",
      salario: 2000.00,
      descuentos: 280.00,
      bonificaciones: 180.00,
      totalPagar: 1900.00,
      banco: "Banco Guayaquil",
      numeroCuenta: "0098765432",
      tipoCuenta: "Corriente",
      estado: "pendiente",
    },
  ];

  const handleSelectEmpleado = (id: string) => {
    setEmpleadosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (empleadosSeleccionados.length === empleadosFiltrados.length) {
      setEmpleadosSeleccionados([]);
    } else {
      setEmpleadosSeleccionados(empleadosFiltrados.map(e => e.id));
    }
  };

  const handleProcesarPagos = () => {
    if (empleadosSeleccionados.length === 0) {
      toast.error("Selección requerida", {
        description: "Selecciona al menos un empleado para procesar el pago"
      });
      return;
    }

    const empleadosPendientes = empleadosSeleccionados.filter(id => {
      const empleado = empleadosNomina.find(e => e.id === id);
      return empleado?.estado === "pendiente";
    });

    if (empleadosPendientes.length === 0) {
      toast.error("Sin pagos pendientes", {
        description: "Los empleados seleccionados ya han sido pagados"
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

      toast.success("Cheque creado exitosamente", {
        description: `Cheque #${datosCheque.numeroCheque} enviado a la bandeja de impresión`
      });
    } else if (metodoPagoSeleccionado === "transferencia") {
      const nombreBanco = bancoTransferencia === "pichincha" ? "Banco Pichincha" : 
                          bancoTransferencia === "guayaquil" ? "Banco Guayaquil" : 
                          "Banco del Pacífico";
      toast.success("Pago procesado exitosamente", {
        description: `${empleadosSeleccionados.length} pago(s) procesado(s) por transferencia desde ${nombreBanco}`
      });
    } else {
      toast.success("Pago procesado exitosamente", {
        description: `${empleadosSeleccionados.length} pago(s) procesado(s) en efectivo`
      });
    }

    // Resetear estados
    setShowModalMetodoPago(false);
    setMetodoPagoSeleccionado("");
    setBancoTransferencia("pichincha");
    setDatosCheque({ numeroCheque: "", banco: "pichincha", fecha: "" });
    setEmpleadosSeleccionados([]);
  };

  const handleGenerarReporte = () => {
    toast.success("Reporte generado", {
      description: "El reporte de nómina se ha descargado correctamente"
    });
  };

  const empleadosFiltrados = empleadosNomina.filter(empleado => {
    const matchesSearch = 
      empleado.empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.cedula.includes(searchTerm) ||
      empleado.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBanco = selectedBanco === "todos" || empleado.banco === selectedBanco;
    const matchesEstado = selectedEstado === "todos" || empleado.estado === selectedEstado;

    return matchesSearch && matchesBanco && matchesEstado;
  });

  const totalPendiente = empleadosFiltrados
    .filter(e => e.estado === "pendiente")
    .reduce((sum, e) => sum + e.totalPagar, 0);

  const totalSeleccionado = empleadosFiltrados
    .filter(e => empleadosSeleccionados.includes(e.id) && e.estado === "pendiente")
    .reduce((sum, e) => sum + e.totalPagar, 0);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pagado":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
            <CheckSquare className="w-3 h-3" />
            Pagado
          </span>
        );
      case "procesando":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Procesando
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

  return (
    <div className="space-y-4">
      {/* Acciones principales */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleGenerarReporte}
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
          disabled={empleadosSeleccionados.length === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            empleadosSeleccionados.length === 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Procesar Pagos ({empleadosSeleccionados.length})
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar empleado..."
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
          value={selectedPeriodo}
          onChange={(e) => setSelectedPeriodo(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="marzo-2026">Marzo 2026</option>
          <option value="febrero-2026">Febrero 2026</option>
          <option value="enero-2026">Enero 2026</option>
        </select>

        <select
          value={selectedBanco}
          onChange={(e) => setSelectedBanco(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="todos">Todos los Bancos</option>
          <option value="Banco Pichincha">Banco Pichincha</option>
          <option value="Banco Guayaquil">Banco Guayaquil</option>
          <option value="Banco del Pacífico">Banco del Pacífico</option>
        </select>

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
          <option value="procesando">Procesando</option>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Período</p>
              <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Marzo 2026
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <DollarSign className="w-5 h-5 text-yellow-400" />
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
                    checked={empleadosSeleccionados.length === empleadosFiltrados.length && empleadosFiltrados.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Salario
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Descuentos
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Bonificaciones
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total a Pagar
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Banco
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
              {empleadosFiltrados.map((empleado) => (
                <tr
                  key={empleado.id}
                  className={`transition-colors ${
                    isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={empleadosSeleccionados.includes(empleado.id)}
                      onChange={() => handleSelectEmpleado(empleado.id)}
                      disabled={empleado.estado !== "pendiente"}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        {empleado.empleado}
                      </p>
                      <p className="text-xs text-gray-400">{empleado.cedula}</p>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {empleado.cargo}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {empleado.departamento}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    ${empleado.salario.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-red-400">
                    -${empleado.descuentos.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-green-400">
                    +${empleado.bonificaciones.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    ${empleado.totalPagar.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {empleado.banco}
                      </p>
                      <p className="text-xs text-gray-400">
                        {empleado.tipoCuenta} - {empleado.numeroCuenta}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getEstadoBadge(empleado.estado)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEmpleadoSeleccionado(empleado);
                          setShowModalDetalle(true);
                        }}
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
                        onClick={() => {
                          setEmpleadoSeleccionado(empleado);
                          setShowModalComprobante(true);
                        }}
                        disabled={empleado.estado === "pendiente"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          empleado.estado === "pendiente"
                            ? "opacity-50 cursor-not-allowed text-gray-500"
                            : isLight
                            ? "hover:bg-green-50 text-green-600"
                            : "hover:bg-green-500/10 text-green-400"
                        }`}
                        title="Imprimir comprobante"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                  setBancoTransferencia("pichincha");
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
                    <p className="text-xs text-gray-400">Empleados seleccionados</p>
                    <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadosSeleccionados.length}
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

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModalMetodoPago(false);
                    setMetodoPagoSeleccionado("");
                    setBancoTransferencia("pichincha");
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
      
      {/* Modal Ver Detalle */}
      {showModalDetalle && empleadoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-2xl w-full p-6 rounded-xl shadow-xl ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Detalle de Pago - Nómina
              </h3>
              <button
                onClick={() => {
                  setShowModalDetalle(false);
                  setEmpleadoSeleccionado(null);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header con info empleado */}
              <div className={`p-6 rounded-lg border ${
                isLight ? "bg-gradient-to-br from-blue-50 to-white border-blue-200" : "bg-gradient-to-br from-blue-500/10 to-secondary border-blue-500/20"
              }`}>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">
                      {empleadoSeleccionado.empleado.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoSeleccionado.empleado}
                    </h4>
                    <p className="text-sm text-gray-400">{empleadoSeleccionado.cargo}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-400">CI: {empleadoSeleccionado.cedula}</span>
                      <span className="text-xs text-gray-400">• {empleadoSeleccionado.departamento}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {getEstadoBadge(empleadoSeleccionado.estado)}
                  </div>
                </div>
              </div>

              {/* Información bancaria */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg border ${
                  isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <p className="text-xs font-medium text-gray-400">Banco</p>
                  </div>
                  <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {empleadoSeleccionado.banco}
                  </p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <p className="text-xs font-medium text-gray-400">Cuenta {empleadoSeleccionado.tipoCuenta}</p>
                  </div>
                  <p className={`font-mono font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {empleadoSeleccionado.numeroCuenta}
                  </p>
                </div>
              </div>

              {/* Desglose de pago */}
              <div className={`rounded-lg border overflow-hidden ${
                isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
              }`}>
                <div className={`px-4 py-3 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <h5 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Desglose de Pago
                  </h5>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Salario Base
                    </span>
                    <span className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${empleadoSeleccionado.salario.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-400">
                      + Bonificaciones
                    </span>
                    <span className="text-sm font-semibold text-green-400">
                      +${empleadoSeleccionado.bonificaciones.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-400">
                      - Descuentos (IESS, IR, etc.)
                    </span>
                    <span className="text-sm font-semibold text-red-400">
                      -${empleadoSeleccionado.descuentos.toFixed(2)}
                    </span>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between ${
                    isLight ? "border-gray-200" : "border-white/10"
                  }`}>
                    <span className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Total a Pagar
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ${empleadoSeleccionado.totalPagar.toFixed(2)}
                    </span>
                  </div>

                  {empleadoSeleccionado.fechaPago && (
                    <div className={`pt-3 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">Fecha de pago: </span>
                        <span className={`text-xs font-medium ${isLight ? "text-gray-700" : "text-white"}`}>
                          {empleadoSeleccionado.fechaPago}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botón cerrar */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowModalDetalle(false);
                    setEmpleadoSeleccionado(null);
                  }}
                  className={`px-6 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                    isLight
                      ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                      : "border-white/10 hover:bg-white/5 text-white"
                  }`}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Comprobante de Pago */}
      {showModalComprobante && empleadoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-3xl w-full p-8 rounded-xl shadow-xl ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Comprobante de Pago de Nómina
              </h3>
              <button
                onClick={() => {
                  setShowModalComprobante(false);
                  setEmpleadoSeleccionado(null);
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Comprobante */}
            <div className={`p-8 rounded-xl border-2 ${
              isLight ? "bg-white border-gray-300" : "bg-secondary border-white/20"
            }`}>
              {/* Header del comprobante */}
              <div className={`pb-6 mb-6 border-b ${isLight ? "border-gray-300" : "border-white/20"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Comercial del Pacífico S.A.
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">RUC: 0992345678001</p>
                    <p className="text-sm text-gray-400">Guayaquil, Ecuador</p>
                  </div>
                  <div className="text-right">
                    <div className="px-4 py-2 bg-primary/10 rounded-lg border border-primary">
                      <p className="text-xs text-primary font-medium">COMPROBANTE DE PAGO</p>
                      <p className="text-lg font-bold text-primary">#{empleadoSeleccionado.id.padStart(6, '0')}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Fecha: {empleadoSeleccionado.fechaPago || new Date().toLocaleDateString('es-EC')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información del empleado */}
              <div className={`mb-6 p-4 rounded-lg ${
                isLight ? "bg-gray-50" : "bg-white/5"
              }`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                  DATOS DEL EMPLEADO
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Nombre Completo</p>
                    <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoSeleccionado.empleado}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Cédula de Identidad</p>
                    <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoSeleccionado.cedula}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Cargo</p>
                    <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoSeleccionado.cargo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Departamento</p>
                    <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoSeleccionado.departamento}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desglose detallado */}
              <div className={`mb-6`}>
                <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                  DETALLE DE PAGO - MARZO 2026
                </h4>
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${isLight ? "border-gray-300" : "border-white/20"}`}>
                      <th className={`text-left py-2 text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Concepto
                      </th>
                      <th className={`text-right py-2 text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Monto
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <td className={`py-2 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Salario Base
                      </td>
                      <td className={`py-2 text-sm text-right font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        ${empleadoSeleccionado.salario.toFixed(2)}
                      </td>
                    </tr>
                    <tr className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <td className="py-2 text-sm text-green-600">
                        Bonificaciones
                      </td>
                      <td className="py-2 text-sm text-right font-medium text-green-600">
                        +${empleadoSeleccionado.bonificaciones.toFixed(2)}
                      </td>
                    </tr>
                    <tr className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <td className="py-2 text-sm text-red-500">
                        Descuentos (IESS, IR)
                      </td>
                      <td className="py-2 text-sm text-right font-medium text-red-500">
                        -${empleadoSeleccionado.descuentos.toFixed(2)}
                      </td>
                    </tr>
                    <tr className={`border-t-2 ${isLight ? "border-gray-300" : "border-white/20"}`}>
                      <td className={`py-3 text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        TOTAL NETO A PAGAR
                      </td>
                      <td className="py-3 text-xl text-right font-bold text-primary">
                        ${empleadoSeleccionado.totalPagar.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Información de pago */}
              <div className={`p-4 rounded-lg ${
                isLight ? "bg-blue-50 border border-blue-200" : "bg-blue-500/10 border border-blue-500/20"
              }`}>
                <h4 className={`text-sm font-bold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  FORMA DE PAGO
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Banco</p>
                    <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoSeleccionado.banco}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Cuenta {empleadoSeleccionado.tipoCuenta}</p>
                    <p className={`text-sm font-mono font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoSeleccionado.numeroCuenta}
                    </p>
                  </div>
                </div>
              </div>

              {/* Firma */}
              <div className="mt-8 pt-6 border-t border-dashed border-gray-300">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className={`border-t pt-2 ${isLight ? "border-gray-300" : "border-white/20"}`}>
                      <p className={`text-xs font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Firma del Empleado
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`border-t pt-2 ${isLight ? "border-gray-300" : "border-white/20"}`}>
                      <p className={`text-xs font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Firma Autorizada
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModalComprobante(false);
                  setEmpleadoSeleccionado(null);
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
                  toast.success("Comprobante enviado a impresora", {
                    description: `Comprobante de pago para ${empleadoSeleccionado.empleado}`
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
      )}
    </div>
  );
}