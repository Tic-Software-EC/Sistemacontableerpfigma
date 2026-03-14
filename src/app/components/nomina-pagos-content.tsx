import { useState } from "react";
import {
  DollarSign,
  Plus,
  Search,
  ChevronDown,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
} from "lucide-react";

type NominaSubTab = "roles-pago" | "descuentos" | "calculo-nomina" | "historial-pagos";

interface RolPago {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  mes: string;
  anio: number;
  salarioBase: number;
  horasExtras: number;
  comisiones: number;
  bonos: number;
  totalIngresos: number;
  iess: number;
  impuestoRenta: number;
  anticipos: number;
  prestamos: number;
  totalDescuentos: number;
  netoRecibir: number;
  estado: "pendiente" | "aprobado" | "pagado";
}

interface Descuento {
  id: string;
  tipo: "iess" | "impuesto-renta" | "anticipo" | "prestamo" | "otro";
  nombre: string;
  porcentaje?: number;
  montoFijo?: number;
  activo: boolean;
}

export function NominaPagosContent({ theme }: { theme: "light" | "dark" }) {
  const isLight = theme === "light";
  const [nominaSubTab, setNominaSubTab] = useState<NominaSubTab>("roles-pago");
  const [searchTermRol, setSearchTermRol] = useState("");
  const [filterMes, setFilterMes] = useState<string>("all");
  const [filterAnio, setFilterAnio] = useState<string>("2026");
  const [showCrearRol, setShowCrearRol] = useState(false);

  // Datos de ejemplo
  const rolesPago: RolPago[] = [
    {
      id: "1",
      empleadoId: "1",
      empleadoNombre: "Juan Carlos Pérez Morales",
      mes: "Marzo",
      anio: 2026,
      salarioBase: 2500,
      horasExtras: 150,
      comisiones: 300,
      bonos: 100,
      totalIngresos: 3050,
      iess: 237.50,
      impuestoRenta: 0,
      anticipos: 0,
      prestamos: 100,
      totalDescuentos: 337.50,
      netoRecibir: 2712.50,
      estado: "pagado",
    },
    {
      id: "2",
      empleadoId: "2",
      empleadoNombre: "María Fernanda González Castro",
      mes: "Marzo",
      anio: 2026,
      salarioBase: 1800,
      horasExtras: 80,
      comisiones: 0,
      bonos: 50,
      totalIngresos: 1930,
      iess: 171,
      impuestoRenta: 0,
      anticipos: 200,
      prestamos: 0,
      totalDescuentos: 371,
      netoRecibir: 1559,
      estado: "aprobado",
    },
    {
      id: "3",
      empleadoId: "3",
      empleadoNombre: "Roberto Loor Zamora",
      mes: "Marzo",
      anio: 2026,
      salarioBase: 1500,
      horasExtras: 60,
      comisiones: 0,
      bonos: 0,
      totalIngresos: 1560,
      iess: 142.50,
      impuestoRenta: 0,
      anticipos: 0,
      prestamos: 0,
      totalDescuentos: 142.50,
      netoRecibir: 1417.50,
      estado: "pendiente",
    },
  ];

  const descuentos: Descuento[] = [
    {
      id: "1",
      tipo: "iess",
      nombre: "Aporte IESS (Personal)",
      porcentaje: 9.45,
      activo: true,
    },
    {
      id: "2",
      tipo: "impuesto-renta",
      nombre: "Impuesto a la Renta",
      porcentaje: 0,
      activo: true,
    },
    {
      id: "3",
      tipo: "anticipo",
      nombre: "Anticipos de Sueldo",
      activo: true,
    },
    {
      id: "4",
      tipo: "prestamo",
      nombre: "Préstamos Empresariales",
      activo: true,
    },
  ];

  const getEstadoBadge = (estado: string) => {
    const styles = {
      pendiente: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
      aprobado: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
      pagado: "bg-green-500/10 text-green-400 border border-green-500/30",
    };
    const names = {
      pendiente: "Pendiente",
      aprobado: "Aprobado",
      pagado: "Pagado",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[estado as keyof typeof styles]}`}>
        {names[estado as keyof typeof names]}
      </span>
    );
  };

  const filteredRoles = rolesPago.filter((rol) => {
    const matchesSearch =
      rol.empleadoNombre.toLowerCase().includes(searchTermRol.toLowerCase()) ||
      rol.id.includes(searchTermRol);
    const matchesMes = filterMes === "all" || rol.mes === filterMes;
    const matchesAnio = filterAnio === "all" || rol.anio.toString() === filterAnio;
    return matchesSearch && matchesMes && matchesAnio;
  });

  return (
    <div className="space-y-6">
      {/* Navegación de subtabs */}
      <div className={`rounded-xl border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
        <div className={`flex items-center gap-1 border-b overflow-x-auto ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <button
            onClick={() => setNominaSubTab("roles-pago")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              nominaSubTab === "roles-pago"
                ? `border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `border-transparent ${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <FileText className="w-4 h-4" />
            Roles de Pago
          </button>
          <button
            onClick={() => setNominaSubTab("descuentos")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              nominaSubTab === "descuentos"
                ? `border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `border-transparent ${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            Descuentos
          </button>
          <button
            onClick={() => setNominaSubTab("calculo-nomina")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              nominaSubTab === "calculo-nomina"
                ? `border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `border-transparent ${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Cálculo de Nómina
          </button>
          <button
            onClick={() => setNominaSubTab("historial-pagos")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              nominaSubTab === "historial-pagos"
                ? `border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `border-transparent ${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <Clock className="w-4 h-4" />
            Historial de Pagos
          </button>
        </div>

        {/* Contenido de subtabs */}
        <div className="p-6">
          {/* Subtab: Roles de Pago */}
          {nominaSubTab === "roles-pago" && (
            <div className="space-y-6">
              {/* Fila de filtros */}
              <div className="flex items-center gap-3">
                {/* Botón Generar Rol */}
                <button
                  onClick={() => setShowCrearRol(!showCrearRol)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Generar Rol
                </button>

                {/* Buscador */}
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="text"
                    placeholder="Buscar por empleado o ID..."
                    value={searchTermRol}
                    onChange={(e) => setSearchTermRol(e.target.value)}
                    className={`w-full pl-10 pr-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  />
                </div>

                {/* Filtro Mes */}
                <div className="relative">
                  <select
                    value={filterMes}
                    onChange={(e) => setFilterMes(e.target.value)}
                    className={`pl-3 pr-10 py-1.5 rounded-lg text-sm border appearance-none cursor-pointer ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="all">Todos los meses</option>
                    <option value="Enero">Enero</option>
                    <option value="Febrero">Febrero</option>
                    <option value="Marzo">Marzo</option>
                    <option value="Abril">Abril</option>
                    <option value="Mayo">Mayo</option>
                    <option value="Junio">Junio</option>
                    <option value="Julio">Julio</option>
                    <option value="Agosto">Agosto</option>
                    <option value="Septiembre">Septiembre</option>
                    <option value="Octubre">Octubre</option>
                    <option value="Noviembre">Noviembre</option>
                    <option value="Diciembre">Diciembre</option>
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                </div>

                {/* Filtro Año */}
                <div className="relative">
                  <select
                    value={filterAnio}
                    onChange={(e) => setFilterAnio(e.target.value)}
                    className={`pl-3 pr-10 py-1.5 rounded-lg text-sm border appearance-none cursor-pointer ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="all">Todos los años</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                </div>
              </div>

              {/* Tabla de Roles */}
              <div className={`rounded-xl border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isLight ? "bg-gray-50" : "bg-white/5"}>
                      <tr className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        <th className="text-left px-4 py-3 uppercase tracking-wider">Empleado</th>
                        <th className="text-left px-4 py-3 uppercase tracking-wider">Período</th>
                        <th className="text-right px-4 py-3 uppercase tracking-wider">Total Ingresos</th>
                        <th className="text-right px-4 py-3 uppercase tracking-wider">Total Descuentos</th>
                        <th className="text-right px-4 py-3 uppercase tracking-wider">Neto a Recibir</th>
                        <th className="text-left px-4 py-3 uppercase tracking-wider">Estado</th>
                        <th className="text-center px-4 py-3 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {filteredRoles.map((rol) => (
                        <tr
                          key={rol.id}
                          className={`border-t transition-colors ${
                            isLight
                              ? "border-gray-200 hover:bg-gray-50"
                              : "border-white/5 hover:bg-white/[0.02]"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium">{rol.empleadoNombre}</div>
                            <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                              ID: {rol.id}
                            </div>
                          </td>
                          <td className="px-4 py-3">{rol.mes} {rol.anio}</td>
                          <td className="px-4 py-3 text-right font-medium text-green-400">
                            ${rol.totalIngresos.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-red-400">
                            ${rol.totalDescuentos.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-bold">
                            ${rol.netoRecibir.toFixed(2)}
                          </td>
                          <td className="px-4 py-3">{getEstadoBadge(rol.estado)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
                                }`}
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
                                }`}
                                title="Descargar"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              {rol.estado === "pendiente" && (
                                <button
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
                                  }`}
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Subtab: Descuentos */}
          {nominaSubTab === "descuentos" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Configuración de Descuentos
                </h3>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  Nuevo Descuento
                </button>
              </div>

              <div className={`rounded-xl border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isLight ? "bg-gray-50" : "bg-white/5"}>
                      <tr className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        <th className="text-left px-4 py-3 uppercase tracking-wider">Tipo</th>
                        <th className="text-left px-4 py-3 uppercase tracking-wider">Nombre</th>
                        <th className="text-left px-4 py-3 uppercase tracking-wider">Cálculo</th>
                        <th className="text-center px-4 py-3 uppercase tracking-wider">Estado</th>
                        <th className="text-center px-4 py-3 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {descuentos.map((descuento) => (
                        <tr
                          key={descuento.id}
                          className={`border-t transition-colors ${
                            isLight
                              ? "border-gray-200 hover:bg-gray-50"
                              : "border-white/5 hover:bg-white/[0.02]"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              descuento.tipo === "iess" ? "bg-blue-500/10 text-blue-400 border border-blue-500/30" :
                              descuento.tipo === "impuesto-renta" ? "bg-purple-500/10 text-purple-400 border border-purple-500/30" :
                              descuento.tipo === "anticipo" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30" :
                              descuento.tipo === "prestamo" ? "bg-red-500/10 text-red-400 border border-red-500/30" :
                              "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                            }`}>
                              {descuento.tipo.toUpperCase().replace("-", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3">{descuento.nombre}</td>
                          <td className="px-4 py-3">
                            {descuento.porcentaje !== undefined ? (
                              <span>{descuento.porcentaje}% del salario</span>
                            ) : descuento.montoFijo !== undefined ? (
                              <span>${descuento.montoFijo.toFixed(2)}</span>
                            ) : (
                              <span className={isLight ? "text-gray-500" : "text-gray-400"}>Variable</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {descuento.activo ? (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/30">
                                Activo
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30">
                                Inactivo
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
                                }`}
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight ? "hover:bg-gray-100 text-red-600" : "hover:bg-white/5 text-red-400"
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
            </div>
          )}

          {/* Subtab: Cálculo de Nómina */}
          {nominaSubTab === "calculo-nomina" && (
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                <h3 className={`text-lg font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Generar Nómina del Mes
                </h3>
                <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Selecciona el mes y año para calcular automáticamente la nómina de todos los empleados
                </p>
                <div className="flex items-center gap-3">
                  <select
                    className={`pl-3 pr-10 py-1.5 rounded-lg text-sm border appearance-none cursor-pointer ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option>Marzo</option>
                    <option>Abril</option>
                    <option>Mayo</option>
                  </select>
                  <select
                    className={`pl-3 pr-10 py-1.5 rounded-lg text-sm border appearance-none cursor-pointer ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option>2026</option>
                    <option>2025</option>
                  </select>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                    <DollarSign className="w-4 h-4" />
                    Calcular Nómina
                  </button>
                </div>
              </div>

              <div className={`text-center py-12 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Selecciona un período para calcular la nómina</p>
              </div>
            </div>
          )}

          {/* Subtab: Historial de Pagos */}
          {nominaSubTab === "historial-pagos" && (
            <div className="space-y-6">
              <div className={`text-center py-12 ${isLight ? "text-gray-500" : "text-gray-400"}`}>\n                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay historial de pagos registrado</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
