import { useState } from "react";
import {
  Search,
  Download,
  Upload,
  CheckSquare,
  XCircle,
  AlertCircle,
  Building2,
  FileText,
  Calendar,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface ConciliacionBancariaTabProps {
  theme: string;
  isLight: boolean;
}

interface MovimientoBancario {
  id: string;
  fecha: string;
  descripcion: string;
  referencia: string;
  tipo: "deposito" | "retiro" | "transferencia" | "cheque";
  monto: number;
  conciliado: boolean;
  movimientoContable?: string;
}

export function ConciliacionBancariaTab({ theme, isLight }: ConciliacionBancariaTabProps) {
  const [selectedBanco, setSelectedBanco] = useState("pichincha");
  const [selectedMes, setSelectedMes] = useState("marzo-2026");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("todos");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [movimientosSeleccionados, setMovimientosSeleccionados] = useState<string[]>([]);

  const movimientosBancarios: MovimientoBancario[] = [
    {
      id: "1",
      fecha: "01/03/2026",
      descripcion: "Depósito Cliente - Factura #001-001-145",
      referencia: "DEP-001-2026",
      tipo: "deposito",
      monto: 2500.00,
      conciliado: true,
      movimientoContable: "ING-2026-001",
    },
    {
      id: "2",
      fecha: "03/03/2026",
      descripcion: "Transferencia Pago Proveedor - Tech Solutions",
      referencia: "TRANS-045",
      tipo: "transferencia",
      monto: -2016.00,
      conciliado: true,
      movimientoContable: "EGR-2026-018",
    },
    {
      id: "3",
      fecha: "05/03/2026",
      descripcion: "Depósito Venta Mostrador",
      referencia: "DEP-002-2026",
      tipo: "deposito",
      monto: 1850.00,
      conciliado: false,
    },
    {
      id: "4",
      fecha: "07/03/2026",
      descripcion: "Cheque #001234 - Pago Servicios Básicos",
      referencia: "CHQ-001234",
      tipo: "cheque",
      monto: -450.00,
      conciliado: false,
    },
    {
      id: "5",
      fecha: "10/03/2026",
      descripcion: "Transferencia Pago Nómina - Empleados",
      referencia: "TRANS-046",
      tipo: "transferencia",
      monto: -8900.00,
      conciliado: true,
      movimientoContable: "EGR-2026-019",
    },
    {
      id: "6",
      fecha: "12/03/2026",
      descripcion: "Depósito Cliente - Abono Factura #145",
      referencia: "DEP-003-2026",
      tipo: "deposito",
      monto: 3200.00,
      conciliado: false,
    },
    {
      id: "7",
      fecha: "14/03/2026",
      descripcion: "Retiro Caja Chica",
      referencia: "RET-008",
      tipo: "retiro",
      monto: -500.00,
      conciliado: true,
      movimientoContable: "EGR-2026-020",
    },
  ];

  const handleSelectMovimiento = (id: string) => {
    setMovimientosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (movimientosSeleccionados.length === movimientosFiltrados.length) {
      setMovimientosSeleccionados([]);
    } else {
      setMovimientosSeleccionados(movimientosFiltrados.map(m => m.id));
    }
  };

  const handleConciliarSeleccionados = () => {
    if (movimientosSeleccionados.length === 0) {
      toast.error("Selección requerida", {
        description: "Selecciona al menos un movimiento para conciliar"
      });
      return;
    }

    const movimientosPendientes = movimientosSeleccionados.filter(id => {
      const movimiento = movimientosBancarios.find(m => m.id === id);
      return !movimiento?.conciliado;
    });

    if (movimientosPendientes.length === 0) {
      toast.error("Sin movimientos pendientes", {
        description: "Los movimientos seleccionados ya están conciliados"
      });
      return;
    }

    toast.success("Conciliación exitosa", {
      description: `${movimientosPendientes.length} movimiento(s) conciliado(s)`
    });
    setMovimientosSeleccionados([]);
  };

  const handleImportarExtracto = () => {
    toast.success("Extracto importado", {
      description: "El extracto bancario se ha cargado correctamente"
    });
  };

  const movimientosFiltrados = movimientosBancarios.filter(movimiento => {
    const matchesSearch =
      movimiento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movimiento.referencia.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = selectedTipo === "todos" || movimiento.tipo === selectedTipo;
    const matchesEstado =
      selectedEstado === "todos" ||
      (selectedEstado === "conciliado" && movimiento.conciliado) ||
      (selectedEstado === "pendiente" && !movimiento.conciliado);

    return matchesSearch && matchesTipo && matchesEstado;
  });

  const totalDepositos = movimientosFiltrados
    .filter(m => m.monto > 0)
    .reduce((sum, m) => sum + m.monto, 0);

  const totalRetiros = movimientosFiltrados
    .filter(m => m.monto < 0)
    .reduce((sum, m) => sum + Math.abs(m.monto), 0);

  const saldoNeto = totalDepositos - totalRetiros;

  const conciliados = movimientosFiltrados.filter(m => m.conciliado).length;
  const pendientes = movimientosFiltrados.filter(m => !m.conciliado).length;

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "deposito":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
            Depósito
          </span>
        );
      case "retiro":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">
            Retiro
          </span>
        );
      case "transferencia":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">
            Transferencia
          </span>
        );
      case "cheque":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs font-medium">
            Cheque
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Acciones principales */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleImportarExtracto}
          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            isLight
              ? "border-gray-200 hover:bg-gray-50 text-gray-700"
              : "border-white/10 hover:bg-white/5 text-white"
          }`}
        >
          <Upload className="w-4 h-4" />
          Importar Extracto
        </button>
        <button
          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            isLight
              ? "border-gray-200 hover:bg-gray-50 text-gray-700"
              : "border-white/10 hover:bg-white/5 text-white"
          }`}
        >
          <Download className="w-4 h-4" />
          Exportar Reporte
        </button>
        <button
          onClick={handleConciliarSeleccionados}
          disabled={movimientosSeleccionados.length === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            movimientosSeleccionados.length === 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Conciliar ({movimientosSeleccionados.length})
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <select
          value={selectedBanco}
          onChange={(e) => setSelectedBanco(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="pichincha">Banco Pichincha</option>
          <option value="guayaquil">Banco Guayaquil</option>
          <option value="pacifico">Banco del Pacífico</option>
        </select>

        <select
          value={selectedMes}
          onChange={(e) => setSelectedMes(e.target.value)}
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

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar movimiento..."
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
          <option value="deposito">Depósito</option>
          <option value="retiro">Retiro</option>
          <option value="transferencia">Transferencia</option>
          <option value="cheque">Cheque</option>
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
          <option value="todos">Todos</option>
          <option value="conciliado">Conciliado</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Depósitos</p>
              <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                ${totalDepositos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <DollarSign className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Retiros</p>
              <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                ${totalRetiros.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Building2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Saldo Neto</p>
              <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                ${saldoNeto.toFixed(2)}
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
              <p className="text-xs text-gray-400">Conciliados</p>
              <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                {conciliados}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Pendientes</p>
              <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                {pendientes}
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
                    checked={movimientosSeleccionados.length === movimientosFiltrados.length && movimientosFiltrados.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Mov. Contable
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
              {movimientosFiltrados.map((movimiento) => (
                <tr
                  key={movimiento.id}
                  className={`transition-colors ${
                    isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={movimientosSeleccionados.includes(movimiento.id)}
                      onChange={() => handleSelectMovimiento(movimiento.id)}
                      disabled={movimiento.conciliado}
                      className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0 disabled:opacity-50"
                    />
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {movimiento.fecha}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                    {movimiento.descripcion}
                  </td>
                  <td className={`px-4 py-3 text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {movimiento.referencia}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getTipoBadge(movimiento.tipo)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${
                    movimiento.monto > 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {movimiento.monto > 0 ? "+" : ""}${Math.abs(movimiento.monto).toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {movimiento.movimientoContable || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {movimiento.conciliado ? (
                      <CheckSquare className="w-5 h-5 text-green-400 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-yellow-400 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}