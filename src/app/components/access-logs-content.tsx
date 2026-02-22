import { useState } from "react";
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  MapPin,
  Monitor,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userAvatar?: string;
  action: "login" | "logout" | "failed_login";
  status: "success" | "failed" | "warning";
  timestamp: string;
  ipAddress: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  branch: string;
  sessionDuration?: string;
  failureReason?: string;
}

export function AccessLogsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Datos de ejemplo
  const accessLogs: AccessLog[] = [
    {
      id: "1",
      userId: "U001",
      userName: "Carlos Méndez",
      userRole: "Administrador de Empresa",
      action: "login",
      status: "success",
      timestamp: "2026-02-17 09:15:23",
      ipAddress: "192.168.1.45",
      device: "Desktop",
      browser: "Chrome 121",
      os: "Windows 11",
      location: "Quito, Ecuador",
      branch: "Sucursal Principal - Centro",
      sessionDuration: "2h 34min",
    },
    {
      id: "2",
      userId: "U005",
      userName: "Laura Ramírez",
      userRole: "Contador",
      action: "login",
      status: "success",
      timestamp: "2026-02-17 08:45:12",
      ipAddress: "192.168.1.78",
      device: "Laptop",
      browser: "Firefox 122",
      os: "macOS 14",
      location: "Quito, Ecuador",
      branch: "Sucursal Principal - Centro",
      sessionDuration: "3h 12min",
    },
    {
      id: "3",
      userId: "U003",
      userName: "Pedro Vargas",
      userRole: "Vendedor",
      action: "failed_login",
      status: "failed",
      timestamp: "2026-02-17 08:30:45",
      ipAddress: "192.168.1.92",
      device: "Mobile",
      browser: "Safari iOS",
      os: "iOS 17",
      location: "Guayaquil, Ecuador",
      branch: "Sucursal Guayaquil",
      failureReason: "Contraseña incorrecta (3 intentos)",
    },
    {
      id: "4",
      userId: "U007",
      userName: "Ana Torres",
      userRole: "Administrador de Empresa",
      action: "logout",
      status: "success",
      timestamp: "2026-02-17 07:55:30",
      ipAddress: "192.168.1.56",
      device: "Desktop",
      browser: "Edge 121",
      os: "Windows 10",
      location: "Quito, Ecuador",
      branch: "Sucursal Norte",
      sessionDuration: "8h 15min",
    },
    {
      id: "5",
      userId: "U002",
      userName: "María González",
      userRole: "Cajero",
      action: "login",
      status: "success",
      timestamp: "2026-02-17 07:30:00",
      ipAddress: "192.168.1.101",
      device: "Desktop",
      browser: "Chrome 121",
      os: "Windows 11",
      location: "Quito, Ecuador",
      branch: "Sucursal Principal - Centro",
      sessionDuration: "4h 23min",
    },
    {
      id: "6",
      userId: "U009",
      userName: "Roberto Jiménez",
      userRole: "Administrador de Empresa",
      action: "login",
      status: "success",
      timestamp: "2026-02-17 07:00:15",
      ipAddress: "192.168.2.34",
      device: "Tablet",
      browser: "Chrome Mobile",
      os: "Android 14",
      location: "Guayaquil, Ecuador",
      branch: "Sucursal Guayaquil",
      sessionDuration: "5h 45min",
    },
    {
      id: "7",
      userId: "U004",
      userName: "Juan Pérez",
      userRole: "Bodeguero",
      action: "failed_login",
      status: "failed",
      timestamp: "2026-02-16 18:45:22",
      ipAddress: "201.234.56.78",
      device: "Mobile",
      browser: "Chrome Mobile",
      os: "Android 13",
      location: "Ambato, Ecuador",
      branch: "Sucursal Sur",
      failureReason: "Usuario bloqueado temporalmente",
    },
    {
      id: "8",
      userId: "U006",
      userName: "Sofía Morales",
      userRole: "Comprador",
      action: "logout",
      status: "success",
      timestamp: "2026-02-16 17:30:10",
      ipAddress: "192.168.1.67",
      device: "Laptop",
      browser: "Chrome 121",
      os: "Windows 11",
      location: "Quito, Ecuador",
      branch: "Sucursal Norte",
      sessionDuration: "6h 50min",
    },
    {
      id: "9",
      userId: "ADMIN",
      userName: "Super Administrador",
      userRole: "Super Admin",
      action: "login",
      status: "success",
      timestamp: "2026-02-16 16:20:00",
      ipAddress: "10.0.0.5",
      device: "Desktop",
      browser: "Chrome 121",
      os: "Ubuntu 22.04",
      location: "Quito, Ecuador",
      branch: "Sistema Central",
      sessionDuration: "1h 15min",
    },
    {
      id: "10",
      userId: "U008",
      userName: "Diego Silva",
      userRole: "Vendedor",
      action: "login",
      status: "success",
      timestamp: "2026-02-16 15:45:33",
      ipAddress: "192.168.1.89",
      device: "Desktop",
      browser: "Firefox 122",
      os: "Windows 10",
      location: "Quito, Ecuador",
      branch: "Sucursal Principal - Centro",
      sessionDuration: "7h 20min",
    },
    {
      id: "11",
      userId: "U003",
      userName: "Pedro Vargas",
      userRole: "Vendedor",
      action: "failed_login",
      status: "failed",
      timestamp: "2026-02-16 14:30:12",
      ipAddress: "192.168.1.92",
      device: "Mobile",
      browser: "Safari iOS",
      os: "iOS 17",
      location: "Guayaquil, Ecuador",
      branch: "Sucursal Guayaquil",
      failureReason: "Contraseña incorrecta",
    },
    {
      id: "12",
      userId: "U010",
      userName: "Carmen Ruiz",
      userRole: "Contador",
      action: "login",
      status: "success",
      timestamp: "2026-02-16 13:15:45",
      ipAddress: "192.168.1.123",
      device: "Laptop",
      browser: "Edge 121",
      os: "Windows 11",
      location: "Quito, Ecuador",
      branch: "Sucursal Norte",
      sessionDuration: "5h 10min",
    },
  ];

  const branches = [
    "Sucursal Principal - Centro",
    "Sucursal Norte",
    "Sucursal Guayaquil",
    "Sucursal Sur",
    "Sistema Central",
  ];

  // Filtrado de logs
  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userRole.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || log.status === statusFilter;

    const matchesAction =
      actionFilter === "all" || log.action === actionFilter;

    const matchesBranch =
      branchFilter === "all" || log.branch === branchFilter;

    const matchesDate = () => {
      if (dateFilter === "all") return true;
      const logDate = new Date(log.timestamp);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case "today":
          return logDate >= today;
        case "yesterday": {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return logDate >= yesterday && logDate < today;
        }
        case "week": {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return logDate >= weekAgo;
        }
        case "month": {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return logDate >= monthAgo;
        }
        default:
          return true;
      }
    };

    return (
      matchesSearch &&
      matchesStatus &&
      matchesAction &&
      matchesBranch &&
      matchesDate()
    );
  });

  // Paginación
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handleViewDetails = (log: AccessLog) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const handleExport = () => {
    alert("Exportando registros de accesos...");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "login":
        return (
          <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-[10px] font-medium">
            Ingreso
          </span>
        );
      case "logout":
        return (
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[10px] font-medium">
            Salida
          </span>
        );
      case "failed_login":
        return (
          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] font-medium">
            Intento Fallido
          </span>
        );
      default:
        return null;
    }
  };

  const stats = {
    total: accessLogs.length,
    successful: accessLogs.filter((log) => log.status === "success").length,
    failed: accessLogs.filter((log) => log.status === "failed").length,
    today: accessLogs.filter((log) => {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length,
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Registro de Accesos
          </h2>
          <p className="text-gray-400 text-sm">
            Historial completo de accesos e intentos de acceso al sistema
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 justify-center"
        >
          <Download className="w-5 h-5" />
          Exportar Registros
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Filtros y búsqueda */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Búsqueda */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por usuario, IP, ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Filtro por fecha */}
          <div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="all">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="week">Última semana</option>
                <option value="month">Último mes</option>
              </select>
            </div>
          </div>

          {/* Filtro por acción */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="all">Todas las acciones</option>
                <option value="login">Ingresos</option>
                <option value="logout">Salidas</option>
                <option value="failed_login">Intentos fallidos</option>
              </select>
            </div>
          </div>

          {/* Filtro por sucursal */}
          <div>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="all">Todas las sucursales</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resumen de filtros */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-gray-400">
            Mostrando <span className="text-white font-medium">{filteredLogs.length}</span> de{" "}
            <span className="text-white font-medium">{accessLogs.length}</span> registros
          </p>
          {(searchTerm || statusFilter !== "all" || actionFilter !== "all" || branchFilter !== "all" || dateFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setActionFilter("all");
                setBranchFilter("all");
                setDateFilter("all");
              }}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabla de registros */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left px-4 py-2.5 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                  Usuario
                </th>
                <th className="text-left px-4 py-2.5 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                  Acción
                </th>
                <th className="text-left px-4 py-2.5 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="text-left px-4 py-2.5 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                  IP / Dispositivo
                </th>
                <th className="text-left px-4 py-2.5 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="text-left px-4 py-2.5 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-center px-4 py-2.5 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <span className="text-white font-medium text-sm">{log.userName}</span>
                  </td>
                  <td className="px-4 py-2.5">{getActionBadge(log.action)}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-gray-300 text-sm">{log.timestamp}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-white text-sm font-medium">{log.ipAddress}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-gray-300 text-sm">{log.branch}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    {getStatusIcon(log.status)}
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleViewDetails(log)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group inline-flex"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Página {currentPage} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="p-6 border-b border-white/10 sticky top-0 bg-secondary z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">
                      Detalles del Acceso
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Información completa del registro
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Información del Usuario */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Información del Usuario
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Nombre</p>
                    <p className="text-white font-medium">{selectedLog.userName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">ID de Usuario</p>
                    <p className="text-white font-medium">{selectedLog.userId}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Rol</p>
                    <p className="text-white font-medium">{selectedLog.userRole}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Sucursal</p>
                    <p className="text-white font-medium">{selectedLog.branch}</p>
                  </div>
                </div>
              </div>

              {/* Detalles del Acceso */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Detalles del Acceso
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Acción</p>
                    <div className="mt-1">{getActionBadge(selectedLog.action)}</div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Estado</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(selectedLog.status)}
                      <span className="text-white font-medium capitalize">
                        {selectedLog.status === "success" ? "Exitoso" : "Fallido"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Fecha y Hora</p>
                    <p className="text-white font-medium">{selectedLog.timestamp}</p>
                  </div>
                  {selectedLog.sessionDuration && (
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Duración de Sesión</p>
                      <p className="text-white font-medium">
                        {selectedLog.sessionDuration}
                      </p>
                    </div>
                  )}
                </div>
                {selectedLog.failureReason && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm font-medium">
                      Motivo del fallo: {selectedLog.failureReason}
                    </p>
                  </div>
                )}
              </div>

              {/* Información Técnica */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  Información Técnica
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Dirección IP</p>
                    <p className="text-white font-medium font-mono">
                      {selectedLog.ipAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Dispositivo</p>
                    <p className="text-white font-medium">{selectedLog.device}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Navegador</p>
                    <p className="text-white font-medium">{selectedLog.browser}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Sistema Operativo</p>
                    <p className="text-white font-medium">{selectedLog.os}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm mb-1">Ubicación</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <p className="text-white font-medium">{selectedLog.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="p-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}