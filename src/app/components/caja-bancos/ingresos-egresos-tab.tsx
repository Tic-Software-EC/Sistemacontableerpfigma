import { useState } from "react";
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  Building2,
  User,
  DollarSign,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "../ui/date-picker";

interface IngresosEgresosTabProps {
  theme: string;
  isLight: boolean;
}

interface Movimiento {
  id: string;
  tipo: "ingreso" | "egreso";
  fecha: string;
  concepto: string;
  categoria: string;
  monto: number;
  metodoPago: string;
  referencia: string;
  beneficiario: string;
  estado: "confirmado" | "pendiente" | "anulado";
}

export function IngresosEgresosTab({ theme, isLight }: IngresosEgresosTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("todos");
  const [selectedCategoria, setSelectedCategoria] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [showModalNuevo, setShowModalNuevo] = useState(false);
  const [showModalDetalle, setShowModalDetalle] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<Movimiento | null>(null);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: "ingreso" as "ingreso" | "egreso",
    fecha: "",
    concepto: "",
    categoria: "",
    monto: "",
    metodoPago: "transferencia",
    referencia: "",
    beneficiario: "",
  });

  const movimientos: Movimiento[] = [
    {
      id: "1",
      tipo: "ingreso",
      fecha: "10/03/2026",
      concepto: "Venta de mercancías - Factura 001-001-1234",
      categoria: "Ventas",
      monto: 15840.00,
      metodoPago: "Transferencia",
      referencia: "TRF-2026-001234",
      beneficiario: "Cliente ABC S.A.",
      estado: "confirmado",
    },
    {
      id: "2",
      tipo: "egreso",
      fecha: "09/03/2026",
      concepto: "Pago de arriendo oficina principal",
      categoria: "Gastos Administrativos",
      monto: 2500.00,
      metodoPago: "Transferencia",
      referencia: "TRF-2026-001230",
      beneficiario: "Inmobiliaria del Centro",
      estado: "confirmado",
    },
    {
      id: "3",
      tipo: "ingreso",
      fecha: "08/03/2026",
      concepto: "Cobro de servicios profesionales",
      categoria: "Servicios",
      monto: 4200.00,
      metodoPago: "Cheque",
      referencia: "CHQ-000456",
      beneficiario: "Empresa XYZ Ltda.",
      estado: "confirmado",
    },
    {
      id: "4",
      tipo: "egreso",
      fecha: "07/03/2026",
      concepto: "Compra de suministros de oficina",
      categoria: "Gastos Operativos",
      monto: 856.00,
      metodoPago: "Efectivo",
      referencia: "EFE-2026-045",
      beneficiario: "Papelería Universal",
      estado: "confirmado",
    },
    {
      id: "5",
      tipo: "ingreso",
      fecha: "06/03/2026",
      concepto: "Intereses bancarios del mes",
      categoria: "Ingresos Financieros",
      monto: 340.00,
      metodoPago: "Transferencia",
      referencia: "INT-BCO-2026-03",
      beneficiario: "Banco Pichincha",
      estado: "confirmado",
    },
    {
      id: "6",
      tipo: "egreso",
      fecha: "05/03/2026",
      concepto: "Pago de servicios básicos (luz, agua, internet)",
      categoria: "Servicios Básicos",
      monto: 420.00,
      metodoPago: "Transferencia",
      referencia: "TRF-2026-001225",
      beneficiario: "Varios",
      estado: "confirmado",
    },
    {
      id: "7",
      tipo: "ingreso",
      fecha: "15/03/2026",
      concepto: "Anticipo de cliente - Proyecto 2026",
      categoria: "Anticipos",
      monto: 8500.00,
      metodoPago: "Transferencia",
      referencia: "TRF-2026-001240",
      beneficiario: "Corporación Nacional",
      estado: "pendiente",
    },
  ];

  const categorias = [
    "Ventas",
    "Servicios",
    "Ingresos Financieros",
    "Anticipos",
    "Gastos Administrativos",
    "Gastos Operativos",
    "Servicios Básicos",
    "Nómina",
    "Impuestos",
    "Otros",
  ];

  const handleNuevoMovimiento = () => {
    if (!nuevoMovimiento.fecha || !nuevoMovimiento.concepto || !nuevoMovimiento.monto || !nuevoMovimiento.categoria) {
      toast.error("Datos incompletos", {
        description: "Completa todos los campos obligatorios"
      });
      return;
    }

    toast.success(
      nuevoMovimiento.tipo === "ingreso" ? "Ingreso registrado" : "Egreso registrado",
      {
        description: `${nuevoMovimiento.tipo === "ingreso" ? "Ingreso" : "Egreso"} de $${parseFloat(nuevoMovimiento.monto).toFixed(2)} registrado exitosamente`
      }
    );

    setShowModalNuevo(false);
    setNuevoMovimiento({
      tipo: "ingreso",
      fecha: "",
      concepto: "",
      categoria: "",
      monto: "",
      metodoPago: "transferencia",
      referencia: "",
      beneficiario: "",
    });
  };

  const movimientosFiltrados = movimientos.filter(mov => {
    const matchesSearch =
      mov.concepto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.referencia.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = selectedTipo === "todos" || mov.tipo === selectedTipo;
    const matchesCategoria = selectedCategoria === "todos" || mov.categoria === selectedCategoria;

    const matchesFechaDesde = !fechaDesde || new Date(mov.fecha.split('/').reverse().join('-')) >= fechaDesde;
    const matchesFechaHasta = !fechaHasta || new Date(mov.fecha.split('/').reverse().join('-')) <= fechaHasta;

    return matchesSearch && matchesTipo && matchesCategoria && matchesFechaDesde && matchesFechaHasta;
  });

  const totalIngresos = movimientosFiltrados
    .filter(m => m.tipo === "ingreso" && m.estado === "confirmado")
    .reduce((sum, m) => sum + m.monto, 0);

  const totalEgresos = movimientosFiltrados
    .filter(m => m.tipo === "egreso" && m.estado === "confirmado")
    .reduce((sum, m) => sum + m.monto, 0);

  const saldoNeto = totalIngresos - totalEgresos;

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
          onClick={() => setShowModalNuevo(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Movimiento
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar concepto, beneficiario o referencia..."
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
          value={selectedTipo}
          onChange={(e) => setSelectedTipo(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="todos">Todos los Tipos</option>
          <option value="ingreso">Ingresos</option>
          <option value="egreso">Egresos</option>
        </select>

        <select
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="todos">Todas las Categorías</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
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
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Ingresos</p>
              <p className={`text-lg font-bold text-green-400`}>
                ${totalIngresos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Egresos</p>
              <p className={`text-lg font-bold text-red-400`}>
                ${totalEgresos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${saldoNeto >= 0 ? "bg-blue-500/10" : "bg-orange-500/10"}`}>
              <DollarSign className={`w-5 h-5 ${saldoNeto >= 0 ? "text-blue-400" : "text-orange-400"}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Saldo Neto</p>
              <p className={`text-lg font-bold ${saldoNeto >= 0 ? "text-blue-400" : "text-orange-400"}`}>
                ${saldoNeto.toFixed(2)}
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Beneficiario
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Método Pago
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Monto
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
              {movimientosFiltrados.map((mov) => (
                <tr
                  key={mov.id}
                  className={`transition-colors ${
                    isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-4 py-3">
                    {mov.tipo === "ingreso" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
                        <TrendingUp className="w-3 h-3" />
                        Ingreso
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">
                        <TrendingDown className="w-3 h-3" />
                        Egreso
                      </span>
                    )}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {mov.fecha}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                    <div>
                      <p className="font-medium">{mov.concepto}</p>
                      <p className="text-xs text-gray-400">Ref: {mov.referencia}</p>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {mov.categoria}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {mov.beneficiario}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {mov.metodoPago}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${
                    mov.tipo === "ingreso" ? "text-green-400" : "text-red-400"
                  }`}>
                    {mov.tipo === "ingreso" ? "+" : "-"}${mov.monto.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {mov.estado === "confirmado" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
                        Confirmado
                      </span>
                    ) : mov.estado === "pendiente" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-medium">
                        Pendiente
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-500/10 text-gray-400 text-xs font-medium">
                        Anulado
                      </span>
                    )}
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
                          setMovimientoSeleccionado(mov);
                          setShowModalDetalle(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight
                            ? "hover:bg-yellow-50 text-yellow-600"
                            : "hover:bg-yellow-500/10 text-yellow-400"
                        }`}
                        title="Editar"
                        onClick={() => {
                          setMovimientoSeleccionado(mov);
                          setShowModalEditar(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight
                            ? "hover:bg-red-50 text-red-600"
                            : "hover:bg-red-500/10 text-red-400"
                        }`}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Movimiento */}
      {showModalNuevo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-2xl w-full p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Registrar Nuevo Movimiento
              </h3>
              <button
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
                onClick={() => {
                  setShowModalNuevo(false);
                  setNuevoMovimiento({
                    tipo: "ingreso",
                    fecha: "",
                    concepto: "",
                    categoria: "",
                    monto: "",
                    metodoPago: "transferencia",
                    referencia: "",
                    beneficiario: "",
                  });
                }}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tipo de movimiento */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Tipo de Movimiento *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNuevoMovimiento({ ...nuevoMovimiento, tipo: "ingreso" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      nuevoMovimiento.tipo === "ingreso"
                        ? "border-green-500 bg-green-500/10"
                        : isLight
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
                      nuevoMovimiento.tipo === "ingreso" ? "text-green-400" : "text-gray-400"
                    }`} />
                    <p className={`text-sm font-medium ${
                      nuevoMovimiento.tipo === "ingreso"
                        ? "text-green-400"
                        : isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Ingreso
                    </p>
                  </button>

                  <button
                    onClick={() => setNuevoMovimiento({ ...nuevoMovimiento, tipo: "egreso" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      nuevoMovimiento.tipo === "egreso"
                        ? "border-red-500 bg-red-500/10"
                        : isLight
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <TrendingDown className={`w-6 h-6 mx-auto mb-2 ${
                      nuevoMovimiento.tipo === "egreso" ? "text-red-400" : "text-gray-400"
                    }`} />
                    <p className={`text-sm font-medium ${
                      nuevoMovimiento.tipo === "egreso"
                        ? "text-red-400"
                        : isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Egreso
                    </p>
                  </button>
                </div>
              </div>

              {/* Datos del movimiento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={nuevoMovimiento.fecha}
                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, fecha: e.target.value })}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Monto *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevoMovimiento.monto}
                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, monto: e.target.value })}
                    placeholder="0.00"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Concepto *
                </label>
                <textarea
                  value={nuevoMovimiento.concepto}
                  onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, concepto: e.target.value })}
                  placeholder="Descripción del movimiento..."
                  rows={3}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Categoría *
                  </label>
                  <select
                    value={nuevoMovimiento.categoria}
                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, categoria: e.target.value })}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Método de Pago *
                  </label>
                  <select
                    value={nuevoMovimiento.metodoPago}
                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, metodoPago: e.target.value })}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="transferencia">Transferencia</option>
                    <option value="cheque">Cheque</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Beneficiario
                  </label>
                  <input
                    type="text"
                    value={nuevoMovimiento.beneficiario}
                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, beneficiario: e.target.value })}
                    placeholder="Nombre del beneficiario o cliente"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Referencia
                  </label>
                  <input
                    type="text"
                    value={nuevoMovimiento.referencia}
                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, referencia: e.target.value })}
                    placeholder="Nº de factura, comprobante, etc."
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModalNuevo(false);
                    setNuevoMovimiento({
                      tipo: "ingreso",
                      fecha: "",
                      concepto: "",
                      categoria: "",
                      monto: "",
                      metodoPago: "transferencia",
                      referencia: "",
                      beneficiario: "",
                    });
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
                  onClick={handleNuevoMovimiento}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Registrar Movimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Movimiento */}
      {showModalDetalle && movimientoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-2xl w-full p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Detalles del Movimiento
              </h3>
              <button
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
                onClick={() => {
                  setShowModalDetalle(false);
                  setMovimientoSeleccionado(null);
                }}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tipo de movimiento */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Tipo de Movimiento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`p-4 rounded-lg border-2 transition-all ${
                      movimientoSeleccionado.tipo === "ingreso"
                        ? "border-green-500 bg-green-500/10"
                        : isLight
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
                      movimientoSeleccionado.tipo === "ingreso" ? "text-green-400" : "text-gray-400"
                    }`} />
                    <p className={`text-sm font-medium ${
                      movimientoSeleccionado.tipo === "ingreso"
                        ? "text-green-400"
                        : isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Ingreso
                    </p>
                  </button>

                  <button
                    className={`p-4 rounded-lg border-2 transition-all ${
                      movimientoSeleccionado.tipo === "egreso"
                        ? "border-red-500 bg-red-500/10"
                        : isLight
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <TrendingDown className={`w-6 h-6 mx-auto mb-2 ${
                      movimientoSeleccionado.tipo === "egreso" ? "text-red-400" : "text-gray-400"
                    }`} />
                    <p className={`text-sm font-medium ${
                      movimientoSeleccionado.tipo === "egreso"
                        ? "text-red-400"
                        : isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Egreso
                    </p>
                  </button>
                </div>
              </div>

              {/* Datos del movimiento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={movimientoSeleccionado.fecha}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    readOnly
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Monto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={movimientoSeleccionado.monto}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Concepto
                </label>
                <textarea
                  value={movimientoSeleccionado.concepto}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  }`}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Categoría
                  </label>
                  <select
                    value={movimientoSeleccionado.categoria}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    readOnly
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Método de Pago
                  </label>
                  <select
                    value={movimientoSeleccionado.metodoPago}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    readOnly
                  >
                    <option value="transferencia">Transferencia</option>
                    <option value="cheque">Cheque</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Beneficiario
                  </label>
                  <input
                    type="text"
                    value={movimientoSeleccionado.beneficiario}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                    readOnly
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Referencia
                  </label>
                  <input
                    type="text"
                    value={movimientoSeleccionado.referencia}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                    readOnly
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModalDetalle(false);
                    setMovimientoSeleccionado(null);
                  }}
                  className={`flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
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

      {/* Modal Editar Movimiento */}
      {showModalEditar && movimientoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-2xl w-full p-6 rounded-lg shadow-xl max-h-[90vh] overflow-y-auto ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Editar Movimiento
              </h3>
              <button
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
                onClick={() => {
                  setShowModalEditar(false);
                  setMovimientoSeleccionado(null);
                }}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tipo de movimiento */}
              <div>
                <label className={`text-sm font-medium mb-2 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Tipo de Movimiento *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMovimientoSeleccionado({ ...movimientoSeleccionado, tipo: "ingreso" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      movimientoSeleccionado.tipo === "ingreso"
                        ? "border-green-500 bg-green-500/10"
                        : isLight
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${
                      movimientoSeleccionado.tipo === "ingreso" ? "text-green-400" : "text-gray-400"
                    }`} />
                    <p className={`text-sm font-medium ${
                      movimientoSeleccionado.tipo === "ingreso"
                        ? "text-green-400"
                        : isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Ingreso
                    </p>
                  </button>

                  <button
                    onClick={() => setMovimientoSeleccionado({ ...movimientoSeleccionado, tipo: "egreso" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      movimientoSeleccionado.tipo === "egreso"
                        ? "border-red-500 bg-red-500/10"
                        : isLight
                        ? "border-gray-200 hover:border-gray-300"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <TrendingDown className={`w-6 h-6 mx-auto mb-2 ${
                      movimientoSeleccionado.tipo === "egreso" ? "text-red-400" : "text-gray-400"
                    }`} />
                    <p className={`text-sm font-medium ${
                      movimientoSeleccionado.tipo === "egreso"
                        ? "text-red-400"
                        : isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Egreso
                    </p>
                  </button>
                </div>
              </div>

              {/* Datos del movimiento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={movimientoSeleccionado.fecha}
                    onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, fecha: e.target.value })}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Monto *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={movimientoSeleccionado.monto}
                    onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, monto: parseFloat(e.target.value) })}
                    placeholder="0.00"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Concepto *
                </label>
                <textarea
                  value={movimientoSeleccionado.concepto}
                  onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, concepto: e.target.value })}
                  placeholder="Descripción del movimiento..."
                  rows={3}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Categoría *
                  </label>
                  <select
                    value={movimientoSeleccionado.categoria}
                    onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, categoria: e.target.value })}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Método de Pago *
                  </label>
                  <select
                    value={movimientoSeleccionado.metodoPago}
                    onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, metodoPago: e.target.value })}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="transferencia">Transferencia</option>
                    <option value="cheque">Cheque</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Beneficiario
                  </label>
                  <input
                    type="text"
                    value={movimientoSeleccionado.beneficiario}
                    onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, beneficiario: e.target.value })}
                    placeholder="Nombre del beneficiario o cliente"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Referencia
                  </label>
                  <input
                    type="text"
                    value={movimientoSeleccionado.referencia}
                    onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, referencia: e.target.value })}
                    placeholder="Nº de factura, comprobante, etc."
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModalEditar(false);
                    setMovimientoSeleccionado(null);
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
                  onClick={() => {
                    // Aquí se debería agregar la lógica para guardar los cambios
                    toast.success(
                      movimientoSeleccionado.tipo === "ingreso" ? "Ingreso actualizado" : "Egreso actualizado",
                      {
                        description: `${movimientoSeleccionado.tipo === "ingreso" ? "Ingreso" : "Egreso"} de $${movimientoSeleccionado.monto.toFixed(2)} actualizado exitosamente`
                      }
                    );

                    setShowModalEditar(false);
                    setMovimientoSeleccionado(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}