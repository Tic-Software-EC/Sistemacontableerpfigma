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
} from "lucide-react";
import { toast } from "sonner";

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
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState<string[]>([]);

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

    toast.success("Pagos procesados exitosamente", {
      description: `${empleadosPendientes.length} pago(s) de nómina procesado(s)`
    });
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar empleado, cédula o departamento..."
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}