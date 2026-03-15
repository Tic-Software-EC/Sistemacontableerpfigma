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
  Calculator,
  Save,
  Printer,
  Building,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

type NominaSubTab = "roles-pago" | "historial-pagos";

interface RolPago {
  id: string;
  empleadoId: string;
  empleadoNombre: string;
  empleadoCedula: string;
  empleadoCargo: string;
  empleadoDepartamento: string;
  mes: string;
  anio: number;
  diasTrabajados: number;
  salarioBase: number;
  horasExtras: number;
  valorHoraExtra: number;
  comisiones: number;
  bonos: number;
  decimoTercero: number;
  decimoCuarto: number;
  fondosReserva: number;
  totalIngresos: number;
  aportacionIESS: number;
  impuestoRenta: number;
  anticipos: number;
  prestamos: number;
  otrosDescuentos: number;
  totalDescuentos: number;
  netoRecibir: number;
  estado: "pendiente" | "aprobado" | "pagado";
  fechaGeneracion: string;
  fechaPago?: string;
  observaciones?: string;
}

interface HistorialPago {
  id: string;
  empleadoNombre: string;
  mes: string;
  anio: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estado: string;
  numeroComprobante: string;
}

export function NominaPagosContent({ theme }: { theme: "light" | "dark" }) {
  const isLight = theme === "light";
  const [nominaSubTab, setNominaSubTab] = useState<NominaSubTab>("roles-pago");
  const [searchTermRol, setSearchTermRol] = useState("");
  const [filterMes, setFilterMes] = useState<string>("all");
  const [filterAnio, setFilterAnio] = useState<string>("2026");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  
  // Filtros para historial de pagos
  const [filterHistorialEmpleado, setFilterHistorialEmpleado] = useState<string>("all");
  const [filterHistorialAnio, setFilterHistorialAnio] = useState<string>("all");
  const [filterHistorialEstado, setFilterHistorialEstado] = useState<string>("all");
  
  // Estados para modales
  const [showCrearRol, setShowCrearRol] = useState(false);
  const [showDetalleRol, setShowDetalleRol] = useState(false);
  const [showComprobanteRol, setShowComprobanteRol] = useState(false);
  const [showEditarRol, setShowEditarRol] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState<RolPago | null>(null);

  // Estados para formularios
  const [nuevoRol, setNuevoRol] = useState({
    empleadoId: "",
    empleadoNombre: "",
    empleadoCedula: "",
    empleadoCargo: "",
    empleadoDepartamento: "",
    mes: "Marzo",
    anio: 2026,
    diasTrabajados: 30,
    salarioBase: 0,
    horasExtras: 0,
    valorHoraExtra: 0,
    comisiones: 0,
    bonos: 0,
    anticipos: 0,
    prestamos: 0,
    otrosDescuentos: 0,
    observaciones: "",
  });

  const [mesCalcular, setMesCalcular] = useState("Marzo");
  const [anioCalcular, setAnioCalcular] = useState("2026");

  // Datos de la empresa
  const empresaInfo = {
    nombre: "Comercial del Pacífico S.A.",
    ruc: "0991234567001",
    direccion: "Av. Principal 123 y Calle Secundaria",
    ciudad: "Guayaquil, Ecuador",
    telefono: "(04) 234-5678",
    email: "rrhh@comercialdelpacificosa.com",
  };

  // Datos de ejemplo mejorados
  const [rolesPago, setRolesPago] = useState<RolPago[]>([
    {
      id: "RP-2026-03-001",
      empleadoId: "1",
      empleadoNombre: "Juan Carlos Pérez Morales",
      empleadoCedula: "0912345678",
      empleadoCargo: "Gerente de Ventas",
      empleadoDepartamento: "Ventas",
      mes: "Marzo",
      anio: 2026,
      diasTrabajados: 30,
      salarioBase: 2500.00,
      horasExtras: 10,
      valorHoraExtra: 15.00,
      comisiones: 300.00,
      bonos: 100.00,
      decimoTercero: 208.33,
      decimoCuarto: 47.00,
      fondosReserva: 208.33,
      totalIngresos: 3513.66,
      aportacionIESS: 236.25,
      impuestoRenta: 0,
      anticipos: 0,
      prestamos: 100.00,
      otrosDescuentos: 0,
      totalDescuentos: 336.25,
      netoRecibir: 3177.41,
      estado: "pagado",
      fechaGeneracion: "2026-03-25",
      fechaPago: "2026-03-31",
      observaciones: "",
    },
    {
      id: "RP-2026-03-002",
      empleadoId: "2",
      empleadoNombre: "María Fernanda González Castro",
      empleadoCedula: "0923456789",
      empleadoCargo: "Contadora",
      empleadoDepartamento: "Contabilidad",
      mes: "Marzo",
      anio: 2026,
      diasTrabajados: 30,
      salarioBase: 1800.00,
      horasExtras: 5,
      valorHoraExtra: 10.00,
      comisiones: 0,
      bonos: 50.00,
      decimoTercero: 150.00,
      decimoCuarto: 47.00,
      fondosReserva: 150.00,
      totalIngresos: 2247.00,
      aportacionIESS: 170.10,
      impuestoRenta: 0,
      anticipos: 200.00,
      prestamos: 0,
      otrosDescuentos: 0,
      totalDescuentos: 370.10,
      netoRecibir: 1876.90,
      estado: "aprobado",
      fechaGeneracion: "2026-03-25",
      observaciones: "",
    },
    {
      id: "RP-2026-03-003",
      empleadoId: "3",
      empleadoNombre: "Roberto Loor Zamora",
      empleadoCedula: "0934567890",
      empleadoCargo: "Asistente de Ventas",
      empleadoDepartamento: "Ventas",
      mes: "Marzo",
      anio: 2026,
      diasTrabajados: 30,
      salarioBase: 1500.00,
      horasExtras: 8,
      valorHoraExtra: 8.00,
      comisiones: 0,
      bonos: 0,
      decimoTercero: 125.00,
      decimoCuarto: 47.00,
      fondosReserva: 125.00,
      totalIngresos: 1861.00,
      aportacionIESS: 141.75,
      impuestoRenta: 0,
      anticipos: 0,
      prestamos: 0,
      otrosDescuentos: 0,
      totalDescuentos: 141.75,
      netoRecibir: 1719.25,
      estado: "pendiente",
      fechaGeneracion: "2026-03-25",
      observaciones: "",
    },
  ]);

  const [historialPagos, setHistorialPagos] = useState<HistorialPago[]>([
    {
      id: "1",
      empleadoNombre: "Juan Carlos Pérez Morales",
      mes: "Febrero",
      anio: 2026,
      monto: 3120.50,
      fechaPago: "2026-02-28",
      metodoPago: "Transferencia Bancaria",
      estado: "Pagado",
      numeroComprobante: "COMP-2026-02-001",
    },
    {
      id: "2",
      empleadoNombre: "María Fernanda González Castro",
      mes: "Febrero",
      anio: 2026,
      monto: 1850.00,
      fechaPago: "2026-02-28",
      metodoPago: "Transferencia Bancaria",
      estado: "Pagado",
      numeroComprobante: "COMP-2026-02-002",
    },
    {
      id: "3",
      empleadoNombre: "Carlos Alberto Rodríguez Silva",
      mes: "Febrero",
      anio: 2026,
      monto: 1680.00,
      fechaPago: "2026-02-28",
      metodoPago: "Transferencia Bancaria",
      estado: "Pagado",
      numeroComprobante: "COMP-2026-02-003",
    },
    {
      id: "4",
      empleadoNombre: "Ana Patricia López Mendoza",
      mes: "Enero",
      anio: 2026,
      monto: 2100.00,
      fechaPago: "2026-01-31",
      metodoPago: "Transferencia Bancaria",
      estado: "Verificado",
      numeroComprobante: "COMP-2026-01-001",
    },
    {
      id: "5",
      empleadoNombre: "Juan Carlos Pérez Morales",
      mes: "Enero",
      anio: 2026,
      monto: 3050.00,
      fechaPago: "2026-01-31",
      metodoPago: "Transferencia Bancaria",
      estado: "Procesado",
      numeroComprobante: "COMP-2026-01-002",
    },
    {
      id: "6",
      empleadoNombre: "María Fernanda González Castro",
      mes: "Diciembre",
      anio: 2025,
      monto: 1820.00,
      fechaPago: "2025-12-31",
      metodoPago: "Transferencia Bancaria",
      estado: "Pagado",
      numeroComprobante: "COMP-2025-12-001",
    },
    {
      id: "7",
      empleadoNombre: "Carlos Alberto Rodríguez Silva",
      mes: "Diciembre",
      anio: 2025,
      monto: 1650.00,
      fechaPago: "2025-12-31",
      metodoPago: "Efectivo",
      estado: "Verificado",
      numeroComprobante: "COMP-2025-12-002",
    },
    {
      id: "8",
      empleadoNombre: "Ana Patricia López Mendoza",
      mes: "Noviembre",
      anio: 2025,
      monto: 2050.00,
      fechaPago: "2025-11-30",
      metodoPago: "Transferencia Bancaria",
      estado: "Pagado",
      numeroComprobante: "COMP-2025-11-001",
    },
  ]);

  // Empleados disponibles con información completa
  const empleadosDisponibles = [
    { id: "1", nombre: "Juan Carlos Pérez Morales", cedula: "0912345678", cargo: "Gerente de Ventas", departamento: "Ventas", salarioBase: 2500 },
    { id: "2", nombre: "María Fernanda González Castro", cedula: "0923456789", cargo: "Contadora", departamento: "Contabilidad", salarioBase: 1800 },
    { id: "3", nombre: "Roberto Loor Zamora", cedula: "0934567890", cargo: "Asistente de Ventas", departamento: "Ventas", salarioBase: 1500 },
    { id: "4", nombre: "Andrea Salazar Vélez", cedula: "0945678901", cargo: "Jefa de Inventario", departamento: "Inventario", salarioBase: 2000 },
  ];

  // ============ FUNCIONES PARA ROLES DE PAGO ============
  const calcularRol = (datos: typeof nuevoRol) => {
    const totalHorasExtras = datos.horasExtras * (datos.valorHoraExtra || (datos.salarioBase / 240));
    const decimoTercero = datos.salarioBase / 12;
    const decimoCuarto = 47.00; // Salario básico unificado / 12
    const fondosReserva = datos.salarioBase / 12;
    
    const totalIngresos = 
      datos.salarioBase + 
      totalHorasExtras + 
      datos.comisiones + 
      datos.bonos + 
      decimoTercero + 
      decimoCuarto + 
      fondosReserva;
    
    const aportacionIESS = datos.salarioBase * 0.0945;
    const totalDescuentos = 
      aportacionIESS + 
      datos.anticipos + 
      datos.prestamos + 
      datos.otrosDescuentos;
    
    const netoRecibir = totalIngresos - totalDescuentos;

    return {
      totalHorasExtras,
      decimoTercero,
      decimoCuarto,
      fondosReserva,
      totalIngresos,
      aportacionIESS,
      totalDescuentos,
      netoRecibir,
    };
  };

  const handleGenerarRol = () => {
    if (!nuevoRol.empleadoId || nuevoRol.salarioBase === 0) {
      alert("Por favor seleccione un empleado");
      return;
    }

    const calculos = calcularRol(nuevoRol);
    const valorHoraExtra = nuevoRol.valorHoraExtra || (nuevoRol.salarioBase / 240);

    const rol: RolPago = {
      id: `RP-${nuevoRol.anio}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(rolesPago.length + 1).padStart(3, '0')}`,
      empleadoId: nuevoRol.empleadoId,
      empleadoNombre: nuevoRol.empleadoNombre,
      empleadoCedula: nuevoRol.empleadoCedula,
      empleadoCargo: nuevoRol.empleadoCargo,
      empleadoDepartamento: nuevoRol.empleadoDepartamento,
      mes: nuevoRol.mes,
      anio: nuevoRol.anio,
      diasTrabajados: nuevoRol.diasTrabajados,
      salarioBase: nuevoRol.salarioBase,
      horasExtras: nuevoRol.horasExtras,
      valorHoraExtra: valorHoraExtra,
      comisiones: nuevoRol.comisiones,
      bonos: nuevoRol.bonos,
      decimoTercero: calculos.decimoTercero,
      decimoCuarto: calculos.decimoCuarto,
      fondosReserva: calculos.fondosReserva,
      totalIngresos: calculos.totalIngresos,
      aportacionIESS: calculos.aportacionIESS,
      impuestoRenta: 0,
      anticipos: nuevoRol.anticipos,
      prestamos: nuevoRol.prestamos,
      otrosDescuentos: nuevoRol.otrosDescuentos,
      totalDescuentos: calculos.totalDescuentos,
      netoRecibir: calculos.netoRecibir,
      estado: "pendiente",
      fechaGeneracion: new Date().toISOString().split('T')[0],
      observaciones: nuevoRol.observaciones,
    };

    setRolesPago([...rolesPago, rol]);
    setNuevoRol({
      empleadoId: "",
      empleadoNombre: "",
      empleadoCedula: "",
      empleadoCargo: "",
      empleadoDepartamento: "",
      mes: "Marzo",
      anio: 2026,
      diasTrabajados: 30,
      salarioBase: 0,
      horasExtras: 0,
      valorHoraExtra: 0,
      comisiones: 0,
      bonos: 0,
      anticipos: 0,
      prestamos: 0,
      otrosDescuentos: 0,
      observaciones: "",
    });
    setShowCrearRol(false);
    alert("Rol de pago generado exitosamente");
  };

  const handleVerDetalleRol = (rol: RolPago) => {
    setRolSeleccionado(rol);
    setShowDetalleRol(true);
  };

  const handleVerComprobanteRol = (rol: RolPago) => {
    setRolSeleccionado(rol);
    setShowComprobanteRol(true);
  };

  const handleImprimirComprobante = () => {
    window.print();
  };

  const handleDescargarRol = (rol: RolPago) => {
    alert(`Generando PDF del comprobante de pago\n\nEmpleado: ${rol.empleadoNombre}\nPeríodo: ${rol.mes} ${rol.anio}\nNeto: $${rol.netoRecibir.toFixed(2)}`);
    console.log("Descargando:", rol);
  };

  const handleEditarRol = (rol: RolPago) => {
    setRolSeleccionado(rol);
    setShowEditarRol(true);
  };

  const handleAprobarRol = (id: string) => {
    setRolesPago(rolesPago.map(rol => 
      rol.id === id ? { ...rol, estado: "aprobado" as const } : rol
    ));
    alert("Rol aprobado exitosamente");
  };

  const handlePagarRol = (id: string) => {
    const rol = rolesPago.find(r => r.id === id);
    if (rol) {
      const fechaPago = new Date().toISOString().split('T')[0];
      setRolesPago(rolesPago.map(r => 
        r.id === id ? { ...r, estado: "pagado" as const, fechaPago } : r
      ));
      
      // Agregar al historial
      const nuevoPago: HistorialPago = {
        id: String(historialPagos.length + 1),
        empleadoNombre: rol.empleadoNombre,
        mes: rol.mes,
        anio: rol.anio,
        monto: rol.netoRecibir,
        fechaPago,
        metodoPago: "Transferencia Bancaria",
        estado: "pagado",
        numeroComprobante: `COMP-${rol.anio}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(historialPagos.length + 1).padStart(3, '0')}`,
      };
      setHistorialPagos([...historialPagos, nuevoPago]);
      alert("Pago registrado exitosamente");
    }
  };

  // ============ FUNCIONES PARA CÁLCULO DE NÓMINA ============
  const handleCalcularNomina = () => {
    const empleadosActivos = empleadosDisponibles.length;
    const nominaTotal = empleadosDisponibles.reduce((sum, emp) => sum + emp.salarioBase, 0);
    alert(`Calculando nómina para ${mesCalcular} ${anioCalcular}...\n\nEmpleados activos: ${empleadosActivos}\nNómina base: $${nominaTotal.toFixed(2)}\n\nSe generarán ${empleadosActivos} roles de pago automáticamente.`);
  };

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
      rol.id.includes(searchTermRol) ||
      rol.empleadoCedula.includes(searchTermRol);
    const matchesMes = filterMes === "all" || rol.mes === filterMes;
    const matchesAnio = filterAnio === "all" || rol.anio.toString() === filterAnio;
    const matchesEstado = filterEstado === "all" || rol.estado === filterEstado;
    return matchesSearch && matchesMes && matchesAnio && matchesEstado;
  });

  // Calcular totales
  const totalNominaMes = filteredRoles.reduce((sum, rol) => sum + rol.totalIngresos, 0);
  const totalDescuentosMes = filteredRoles.reduce((sum, rol) => sum + rol.totalDescuentos, 0);
  const totalNetoMes = filteredRoles.reduce((sum, rol) => sum + rol.netoRecibir, 0);

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
                  onClick={() => setShowCrearRol(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Generar Rol
                </button>

                {/* Buscador */}
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, cédula o ID..."
                    value={searchTermRol}
                    onChange={(e) => setSearchTermRol(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  />
                </div>

                {/* Filtro Estado */}
                <div className="relative">
                  <select
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    className={`pl-3 pr-10 py-2 rounded-lg text-sm border appearance-none cursor-pointer ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="pagado">Pagado</option>
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                </div>

                {/* Filtro Mes */}
                <div className="relative">
                  <select
                    value={filterMes}
                    onChange={(e) => setFilterMes(e.target.value)}
                    className={`pl-3 pr-10 py-2 rounded-lg text-sm border appearance-none cursor-pointer ${
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
                    className={`pl-3 pr-10 py-2 rounded-lg text-sm border appearance-none cursor-pointer ${
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
              <div className={`rounded-lg border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isLight ? "bg-gray-50 border-b border-gray-200" : "bg-white/5 border-b border-white/10"}>
                      <tr className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        <th className="text-left px-4 py-3">Cédula</th>
                        <th className="text-left px-4 py-3">Nombre</th>
                        <th className="text-left px-4 py-3">Apellido</th>
                        <th className="text-left px-4 py-3">Cargo</th>
                        <th className="text-left px-4 py-3">Departamento</th>
                        <th className="text-left px-4 py-3">Estado</th>
                        <th className="text-left px-4 py-3">Período</th>
                        <th className="text-right px-4 py-3">Salario</th>
                        <th className="text-center px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {filteredRoles.map((rol) => {
                        const nombreParts = rol.empleadoNombre.split(' ');
                        const nombre = nombreParts.slice(0, 2).join(' ');
                        const apellido = nombreParts.slice(2).join(' ');
                        
                        return (
                          <tr
                            key={rol.id}
                            className={`border-t transition-colors ${
                              isLight
                                ? "border-gray-100 hover:bg-gray-50/50"
                                : "border-white/5 hover:bg-white/[0.02]"
                            }`}
                          >
                            <td className="px-4 py-4">
                              <span className={`font-mono text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                                {rol.empleadoCedula}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                                {nombre}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                                {apellido}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${isLight ? "bg-gray-400" : "bg-gray-500"}`}></div>
                                <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                                  {rol.empleadoCargo}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                                {rol.empleadoDepartamento}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                Pendiente de Pago
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1.5">
                                <Clock className={`w-3.5 h-3.5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                                <div>
                                  <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                    {rol.mes} {rol.anio}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="text-base font-bold text-primary">
                                ${rol.netoRecibir.toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleVerComprobanteRol(rol)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isLight ? "hover:bg-blue-100 text-blue-600" : "hover:bg-blue-500/10 text-blue-400"
                                  }`}
                                  title="Ver comprobante"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDescargarRol(rol)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
                                  }`}
                                  title="Descargar PDF"
                                >
                                  <Download className="w-4 h-4" />
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
          )}

          {/* Subtab: Historial de Pagos */}
          {nominaSubTab === "historial-pagos" && (
            <div className="space-y-6">
              {/* Fila de filtros y botón exportar */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  {/* Filtro por Empleado */}
                  <select
                    value={filterHistorialEmpleado}
                    onChange={(e) => setFilterHistorialEmpleado(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="all">Todos los Empleados</option>
                    <option value="Juan Carlos Pérez Morales">Juan Carlos Pérez Morales</option>
                    <option value="María Fernanda González Castro">María Fernanda González Castro</option>
                    <option value="Carlos Alberto Rodríguez Silva">Carlos Alberto Rodríguez Silva</option>
                    <option value="Ana Patricia López Mendoza">Ana Patricia López Mendoza</option>
                  </select>

                  {/* Filtro por Año */}
                  <select
                    value={filterHistorialAnio}
                    onChange={(e) => setFilterHistorialAnio(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="all">Todos los Años</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>

                  {/* Filtro por Estado */}
                  <select
                    value={filterHistorialEstado}
                    onChange={(e) => setFilterHistorialEstado(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Procesado">Procesado</option>
                    <option value="Verificado">Verificado</option>
                  </select>
                </div>

                {/* Botón Exportar */}
                <button className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  isLight 
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
                    : "border-white/10 text-white hover:bg-white/5"
                }`}>
                  <Download className="w-4 h-4" />
                  Exportar Excel
                </button>
              </div>

              <div className={`rounded-lg border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={isLight ? "bg-gray-50 border-b border-gray-200" : "bg-white/5 border-b border-white/10"}>
                      <tr className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        <th className="text-left px-4 py-3">Comprobante</th>
                        <th className="text-left px-4 py-3">Empleado</th>
                        <th className="text-left px-4 py-3">Período</th>
                        <th className="text-right px-4 py-3">Monto Pagado</th>
                        <th className="text-left px-4 py-3">Fecha de Pago</th>
                        <th className="text-left px-4 py-3">Método</th>
                        <th className="text-center px-4 py-3">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {historialPagos
                        .filter((pago) => {
                          // Filtrar por empleado
                          if (filterHistorialEmpleado !== "all" && pago.empleadoNombre !== filterHistorialEmpleado) {
                            return false;
                          }
                          // Filtrar por año
                          if (filterHistorialAnio !== "all" && pago.anio.toString() !== filterHistorialAnio) {
                            return false;
                          }
                          // Filtrar por estado (convertir a minúsculas para comparación)
                          if (filterHistorialEstado !== "all" && pago.estado.toLowerCase() !== filterHistorialEstado.toLowerCase()) {
                            return false;
                          }
                          return true;
                        })
                        .map((pago) => (
                        <tr
                          key={pago.id}
                          className={`border-t transition-colors ${
                            isLight
                              ? "border-gray-100 hover:bg-gray-50/50"
                              : "border-white/5 hover:bg-white/[0.02]"
                          }`}
                        >
                          <td className="px-4 py-4">
                            <div className="font-mono text-xs text-primary">{pago.numeroComprobante}</div>
                          </td>
                          <td className="px-4 py-4 font-semibold">{pago.empleadoNombre}</td>
                          <td className="px-4 py-4">{pago.mes} {pago.anio}</td>
                          <td className="px-4 py-4 text-right font-bold text-lg text-primary">
                            ${pago.monto.toFixed(2)}
                          </td>
                          <td className="px-4 py-4">{pago.fechaPago}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              pago.metodoPago === "Transferencia Bancaria" 
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                : "bg-green-500/10 text-green-400 border border-green-500/30"
                            }`}>
                              {pago.metodoPago}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  alert(`Descargando rol de pago: ${pago.numeroComprobante}`);
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight ? "hover:bg-blue-100 text-blue-600" : "hover:bg-blue-500/10 text-blue-400"
                                }`}
                                title="Descargar Rol de Pago"
                              >
                                <Download className="w-4 h-4" />
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
        </div>
      </div>

      {/* ============ MODALES ============ */}

      {/* Modal: Generar Rol de Pago */}
      {showCrearRol && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-lg p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${ 
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className={`flex items-center justify-between mb-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div>
                <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                  Generar Rol de Pago
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Complete la información del período a liquidar
                </p>
              </div>
              <button onClick={() => setShowCrearRol(false)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Información del Empleado */}
              <div className={`p-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs font-semibold mb-2.5 uppercase tracking-wide ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Empleado
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-3">
                    <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Seleccionar Empleado *
                    </label>
                    <select
                      value={nuevoRol.empleadoId}
                      onChange={(e) => {
                        const emp = empleadosDisponibles.find(em => em.id === e.target.value);
                        setNuevoRol({
                          ...nuevoRol,
                          empleadoId: e.target.value,
                          empleadoNombre: emp?.nombre || "",
                          empleadoCedula: emp?.cedula || "",
                          empleadoCargo: emp?.cargo || "",
                          empleadoDepartamento: emp?.departamento || "",
                          salarioBase: emp?.salarioBase || 0,
                          valorHoraExtra: emp ? emp.salarioBase / 240 : 0,
                        });
                      }}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <option value="">Seleccione un empleado...</option>
                      {empleadosDisponibles.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.nombre} - {emp.cargo}</option>
                      ))}
                    </select>
                  </div>
                  {nuevoRol.empleadoId && (
                    <>
                      <div>
                        <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          Cédula
                        </label>
                        <input
                          type="text"
                          value={nuevoRol.empleadoCedula}
                          disabled
                          className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                            isLight ? "bg-gray-100 border-gray-200 text-gray-700" : "bg-white/5 border-white/10 text-gray-300"
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          Cargo
                        </label>
                        <input
                          type="text"
                          value={nuevoRol.empleadoCargo}
                          disabled
                          className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                            isLight ? "bg-gray-100 border-gray-200 text-gray-700" : "bg-white/5 border-white/10 text-gray-300"
                          }`}
                        />
                      </div>
                      <div>
                        <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          Departamento
                        </label>
                        <input
                          type="text"
                          value={nuevoRol.empleadoDepartamento}
                          disabled
                          className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                            isLight ? "bg-gray-100 border-gray-200 text-gray-700" : "bg-white/5 border-white/10 text-gray-300"
                          }`}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Período */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Mes *
                  </label>
                  <select
                    value={nuevoRol.mes}
                    onChange={(e) => setNuevoRol({...nuevoRol, mes: e.target.value})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map(m => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Año *
                  </label>
                  <select
                    value={nuevoRol.anio}
                    onChange={(e) => setNuevoRol({...nuevoRol, anio: Number(e.target.value)})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option>2026</option>
                    <option>2025</option>
                    <option>2024</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Días Trabajados
                  </label>
                  <input
                    type="number"
                    value={nuevoRol.diasTrabajados}
                    onChange={(e) => setNuevoRol({...nuevoRol, diasTrabajados: Number(e.target.value)})}
                    max="31"
                    min="1"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>

              {/* Ingresos y Descuentos lado a lado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Ingresos */}
                <div className={`p-3 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20"}`}>
                  <p className={`text-xs font-semibold mb-2.5 uppercase tracking-wide ${isLight ? "text-green-700" : "text-green-400"}`}>
                    Ingresos
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Salario Base
                      </label>
                      <input
                        type="number"
                        value={nuevoRol.salarioBase}
                        disabled
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm font-semibold text-green-600 ${
                          isLight ? "bg-gray-100 border-gray-200" : "bg-white/5 border-white/10"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Horas Extras
                      </label>
                      <input
                        type="number"
                        value={nuevoRol.horasExtras}
                        onChange={(e) => setNuevoRol({...nuevoRol, horasExtras: Number(e.target.value)})}
                        placeholder="0"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Comisiones
                      </label>
                      <input
                        type="number"
                        value={nuevoRol.comisiones}
                        onChange={(e) => setNuevoRol({...nuevoRol, comisiones: Number(e.target.value)})}
                        placeholder="0.00"
                        step="0.01"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Bonos
                      </label>
                      <input
                        type="number"
                        value={nuevoRol.bonos}
                        onChange={(e) => setNuevoRol({...nuevoRol, bonos: Number(e.target.value)})}
                        placeholder="0.00"
                        step="0.01"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Descuentos */}
                <div className={`p-3 rounded-lg border ${isLight ? "bg-red-50 border-red-200" : "bg-red-500/10 border-red-500/20"}`}>
                  <p className={`text-xs font-semibold mb-2.5 uppercase tracking-wide ${isLight ? "text-red-700" : "text-red-400"}`}>
                    Descuentos
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Anticipos
                      </label>
                      <input
                        type="number"
                        value={nuevoRol.anticipos}
                        onChange={(e) => setNuevoRol({...nuevoRol, anticipos: Number(e.target.value)})}
                        placeholder="0.00"
                        step="0.01"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Préstamos
                      </label>
                      <input
                        type="number"
                        value={nuevoRol.prestamos}
                        onChange={(e) => setNuevoRol({...nuevoRol, prestamos: Number(e.target.value)})}
                        placeholder="0.00"
                        step="0.01"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Otros Descuentos
                      </label>
                      <input
                        type="number"
                        value={nuevoRol.otrosDescuentos}
                        onChange={(e) => setNuevoRol({...nuevoRol, otrosDescuentos: Number(e.target.value)})}
                        placeholder="0.00"
                        step="0.01"
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Observaciones (Opcional)
                </label>
                <textarea
                  value={nuevoRol.observaciones}
                  onChange={(e) => setNuevoRol({...nuevoRol, observaciones: e.target.value})}
                  placeholder="Notas adicionales..."
                  rows={2}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm resize-none ${
                    isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              {/* Resumen de cálculo en tiempo real */}
              {nuevoRol.empleadoId && (
                <div className={`p-3 rounded-lg border ${isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"}`}>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center">
                      <p className={`text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Total Ingresos</p>
                      <p className="font-bold text-green-500 text-base">${calcularRol(nuevoRol).totalIngresos.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Total Descuentos</p>
                      <p className="font-bold text-red-500 text-base">${calcularRol(nuevoRol).totalDescuentos.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Neto a Recibir</p>
                      <p className="font-bold text-primary text-lg">${calcularRol(nuevoRol).netoRecibir.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className={`flex gap-3 pt-3 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <button
                  onClick={() => setShowCrearRol(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    isLight ? "border-gray-300 hover:bg-gray-50 text-gray-700" : "border-white/10 hover:bg-white/5 text-white"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGenerarRol}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Generar Rol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Comprobante Profesional de Pago */}
      {showComprobanteRol && rolSeleccionado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-lg max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl ${ 
            isLight ? "bg-white" : "bg-[#0D1B2A]"
          }`}>
            {/* Header del Modal */}
            <div className={`sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
              <h3 className={`font-bold text-base ${isLight ? "text-gray-900" : "text-white"}`}>
                Comprobante de Pago
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleImprimirComprobante}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors ${
                    isLight ? "border-gray-300 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir
                </button>
                <button
                  onClick={() => handleDescargarRol(rolSeleccionado)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button onClick={() => setShowComprobanteRol(false)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Comprobante - Diseño Compacto */}
            <div className="p-5 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
              {/* Encabezado de la Empresa */}
              <div className="border-b-2 border-[#E8692E] pb-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-[#0D1B2A] mb-0.5">{empresaInfo.nombre}</h1>
                    <p className="text-xs text-gray-600">RUC: {empresaInfo.ruc} | {empresaInfo.ciudad}</p>
                    <p className="text-xs text-gray-600">{empresaInfo.direccion}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-[#E8692E] text-white px-3 py-1.5 rounded mb-1.5">
                      <p className="text-xs font-medium">ROL DE PAGO</p>
                      <p className="text-base font-bold">{rolSeleccionado.id}</p>
                    </div>
                    <p className="text-xs text-gray-600">Generado: {rolSeleccionado.fechaGeneracion}</p>
                    {rolSeleccionado.fechaPago && (
                      <p className="text-xs text-gray-600">Pagado: {rolSeleccionado.fechaPago}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Información del Empleado */}
              <div className="bg-gray-50 rounded p-3 mb-4">
                <h2 className="text-xs font-bold text-[#0D1B2A] mb-2 uppercase tracking-wide">Información del Empleado</h2>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Nombre:</p>
                    <p className="text-sm font-semibold text-gray-900">{rolSeleccionado.empleadoNombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cédula:</p>
                    <p className="text-sm font-semibold text-gray-900">{rolSeleccionado.empleadoCedula}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cargo:</p>
                    <p className="text-sm font-semibold text-gray-900">{rolSeleccionado.empleadoCargo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Departamento:</p>
                    <p className="text-sm font-semibold text-gray-900">{rolSeleccionado.empleadoDepartamento}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Período:</p>
                    <p className="text-sm font-semibold text-gray-900">{rolSeleccionado.mes} {rolSeleccionado.anio}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Días Trabajados:</p>
                    <p className="text-sm font-semibold text-gray-900">{rolSeleccionado.diasTrabajados} días</p>
                  </div>
                </div>
              </div>

              {/* Layout de 2 columnas: Ingresos y Descuentos */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Detalle de Ingresos */}
                <div>
                  <h2 className="text-xs font-bold text-[#0D1B2A] mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
                    Ingresos
                  </h2>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-700">Salario Base</td>
                        <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.salarioBase.toFixed(2)}</td>
                      </tr>
                      {rolSeleccionado.horasExtras > 0 && (
                        <tr className="border-b border-gray-100">
                          <td className="py-1.5 text-gray-700">
                            H. Extras ({rolSeleccionado.horasExtras}h)
                          </td>
                          <td className="py-1.5 text-right font-mono font-medium text-gray-900">
                            ${(rolSeleccionado.horasExtras * rolSeleccionado.valorHoraExtra).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {rolSeleccionado.comisiones > 0 && (
                        <tr className="border-b border-gray-100">
                          <td className="py-1.5 text-gray-700">Comisiones</td>
                          <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.comisiones.toFixed(2)}</td>
                        </tr>
                      )}
                      {rolSeleccionado.bonos > 0 && (
                        <tr className="border-b border-gray-100">
                          <td className="py-1.5 text-gray-700">Bonos</td>
                          <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.bonos.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-700">Décimo Tercero</td>
                        <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.decimoTercero.toFixed(2)}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-700">Décimo Cuarto</td>
                        <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.decimoCuarto.toFixed(2)}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-700">Fondos Reserva</td>
                        <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.fondosReserva.toFixed(2)}</td>
                      </tr>
                      <tr className="bg-green-50 border-t-2 border-green-500">
                        <td className="py-1.5 font-bold text-green-800 text-xs">TOTAL</td>
                        <td className="py-1.5 text-right font-mono font-bold text-sm text-green-700">${rolSeleccionado.totalIngresos.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Detalle de Descuentos */}
                <div>
                  <h2 className="text-xs font-bold text-[#0D1B2A] mb-2 uppercase tracking-wide border-b border-gray-300 pb-1">
                    Descuentos
                  </h2>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-1.5 text-gray-700">IESS (9.45%)</td>
                        <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.aportacionIESS.toFixed(2)}</td>
                      </tr>
                      {rolSeleccionado.impuestoRenta > 0 && (
                        <tr className="border-b border-gray-100">
                          <td className="py-1.5 text-gray-700">Imp. Renta</td>
                          <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.impuestoRenta.toFixed(2)}</td>
                        </tr>
                      )}
                      {rolSeleccionado.anticipos > 0 && (
                        <tr className="border-b border-gray-100">
                          <td className="py-1.5 text-gray-700">Anticipos</td>
                          <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.anticipos.toFixed(2)}</td>
                        </tr>
                      )}
                      {rolSeleccionado.prestamos > 0 && (
                        <tr className="border-b border-gray-100">
                          <td className="py-1.5 text-gray-700">Préstamos</td>
                          <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.prestamos.toFixed(2)}</td>
                        </tr>
                      )}
                      {rolSeleccionado.otrosDescuentos > 0 && (
                        <tr className="border-b border-gray-100">
                          <td className="py-1.5 text-gray-700">Otros</td>
                          <td className="py-1.5 text-right font-mono font-medium text-gray-900">${rolSeleccionado.otrosDescuentos.toFixed(2)}</td>
                        </tr>
                      )}
                      <tr className="bg-red-50 border-t-2 border-red-500">
                        <td className="py-1.5 font-bold text-red-800 text-xs">TOTAL</td>
                        <td className="py-1.5 text-right font-mono font-bold text-sm text-red-700">${rolSeleccionado.totalDescuentos.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Neto a Recibir - Compacto */}
              <div className="bg-gradient-to-r from-[#E8692E] to-[#ff8c50] rounded p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-xs font-medium mb-0.5">NETO A RECIBIR</p>
                    <p className="text-white text-3xl font-bold">${rolSeleccionado.netoRecibir.toFixed(2)}</p>
                  </div>
                  <div>
                    {getEstadoBadge(rolSeleccionado.estado)}
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {rolSeleccionado.observaciones && (
                <div className="mb-4">
                  <h2 className="text-xs font-bold text-[#0D1B2A] mb-1.5 uppercase tracking-wide">Observaciones</h2>
                  <p className="text-xs text-gray-700 bg-yellow-50 p-2.5 rounded border-l-4 border-yellow-500">
                    {rolSeleccionado.observaciones}
                  </p>
                </div>
              )}

              {/* Firma y Aceptación - Compacto */}
              <div className="border-t-2 border-gray-300 pt-4 mt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="border-t-2 border-gray-400 pt-2 mt-12">
                      <p className="text-xs font-semibold text-gray-700">FIRMA DEL EMPLEADO</p>
                      <p className="text-xs text-gray-500 mt-0.5">{rolSeleccionado.empleadoNombre}</p>
                      <p className="text-xs text-gray-500">C.I: {rolSeleccionado.empleadoCedula}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t-2 border-gray-400 pt-2 mt-12">
                      <p className="text-xs font-semibold text-gray-700">RECURSOS HUMANOS</p>
                      <p className="text-xs text-gray-500 mt-0.5">{empresaInfo.nombre}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Legal */}
              <div className="mt-6 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-500 text-center">
                  Documento oficial emitido por {empresaInfo.nombre} | Tel: {empresaInfo.telefono}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
