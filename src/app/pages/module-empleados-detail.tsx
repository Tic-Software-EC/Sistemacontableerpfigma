import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Users,
  Moon,
  Sun,
  Home,
  User,
  UserCheck,
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  Check,
  FileText,
  CreditCard,
  Plus,
  Upload,
  Download,
  Eye,
  Trash2,
  Calendar,
  IdCard,
  Camera,
  Bell,
  X,
  Briefcase,
  ClipboardList,
  Award,
  GraduationCap,
  Shield,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Edit,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { EmpleadoDetalladoForm } from "../components/empleado-detallado-form";
import { CrearEmpleadoForm } from "../components/crear-empleado-form";
import { NominaPagosContent } from "../components/nomina-pagos-content";

// Módulo de Empleados - TicSoftEc

type FichaSubTab = "datos-generales" | "documentos" | "historial-laboral" | "permisos-vacaciones" | "evaluaciones";

interface Empleado {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  estado: "activo" | "inactivo" | "vacaciones";
  cargo: string;
  departamento: string;
  salario: number;
  foto?: string;
  tipoContrato: "indefinido" | "temporal" | "por-horas";
  tipo: "regular" | "vip" | "mayorista";
  horarioAsignado?: string;
  mesHorario?: string;
  anioHorario?: string;
}

export function ModuleEmpleadosDetail() {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();
  const [searchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  
  const validTabs = ["inicio", "mis-empleados", "ficha-empleado", "crear-empleado", "nomina-pagos"];
  type TabType = typeof validTabs[number];
  const activeTab: TabType = validTabs.includes(params.tab as TabType) ? (params.tab as TabType) : "inicio";
  const setActiveTab = (tab: TabType) => {
    navigate(`/module-empleados-detail/${tab}`, { replace: true });
  };
  
  const [fichaSubTab, setFichaSubTab] = useState<FichaSubTab>("datos-generales");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartamento, setFilterDepartamento] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [selectedEmpleados, setSelectedEmpleados] = useState<string[]>([]);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState<string | null>(null);
  const [showAsignarHorario, setShowAsignarHorario] = useState(false);
  const [searchEmpleadoFicha, setSearchEmpleadoFicha] = useState("");
  const [horarioMes, setHorarioMes] = useState("marzo");
  const [horarioAnio, setHorarioAnio] = useState("2026");
  const [horarioTurno, setHorarioTurno] = useState("08:00-17:00");
  const [showVisualizarModal, setShowVisualizarModal] = useState(false);
  const [empleadoVisualizar, setEmpleadoVisualizar] = useState<Empleado | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  
  // Obtener el ID del empleado de los parámetros de búsqueda
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl && activeTab === 'ficha-empleado') {
      setSelectedEmpleadoId(idFromUrl);
    }
  }, [searchParams, activeTab]);

  // Datos de ejemplo
  const empleados: Empleado[] = [
    {
      id: "1",
      cedula: "0912345678",
      nombre: "Juan Carlos",
      apellido: "Pérez Morales",
      email: "juan.perez@email.com",
      telefono: "0987654321",
      direccion: "Av. Principal 123",
      ciudad: "Guayaquil",
      fechaNacimiento: "1990-05-15",
      fechaIngreso: "2020-01-10",
      estado: "activo",
      cargo: "Gerente de Ventas",
      departamento: "Ventas",
      salario: 2500,
      tipoContrato: "indefinido",
      tipo: "vip",
      horarioAsignado: "08:00-17:00",
      mesHorario: "Marzo",
      anioHorario: "2026",
    },
    {
      id: "2",
      cedula: "0923456789",
      nombre: "María Fernanda",
      apellido: "González Castro",
      email: "maria.gonzalez@email.com",
      telefono: "0998765432",
      direccion: "Calle Secundaria 456",
      ciudad: "Quito",
      fechaNacimiento: "1988-08-22",
      fechaIngreso: "2019-03-15",
      estado: "activo",
      cargo: "Contadora",
      departamento: "Contabilidad",
      salario: 1800,
      tipoContrato: "indefinido",
      tipo: "regular",
      horarioAsignado: "08:00-17:00",
      mesHorario: "Marzo",
      anioHorario: "2026",
    },
    {
      id: "3",
      cedula: "0934567890",
      nombre: "Roberto",
      apellido: "Loor Zamora",
      email: "roberto.loor@email.com",
      telefono: "0976543210",
      direccion: "Av. Los Ceibos 789",
      ciudad: "Guayaquil",
      fechaNacimiento: "1995-12-03",
      fechaIngreso: "2021-06-20",
      estado: "activo",
      cargo: "Asistente Administrativo",
      departamento: "Administración",
      salario: 1500,
      tipoContrato: "temporal",
      tipo: "mayorista",
      horarioAsignado: "14:00-22:00",
      mesHorario: "Marzo",
      anioHorario: "2026",
    },
    {
      id: "4",
      cedula: "0945678901",
      nombre: "Carmen Elena",
      apellido: "Salazar Vega",
      email: "carmen.salazar@email.com",
      telefono: "0965432109",
      direccion: "Urbanización Las Palmas",
      ciudad: "Cuenca",
      fechaNacimiento: "1992-04-18",
      fechaIngreso: "2018-09-01",
      estado: "vacaciones",
      cargo: "Diseñadora Gráfica",
      departamento: "Marketing",
      salario: 1600,
      tipoContrato: "indefinido",
      tipo: "regular",
    },
  ];

  const filteredEmpleados = empleados.filter((emp) => {
    const matchesSearch =
      emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cedula.includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartamento = filterDepartamento === "all" || emp.departamento === filterDepartamento;
    const matchesEstado = filterEstado === "all" || emp.estado === filterEstado;
    const matchesTipo = filterTipo === "all" || emp.tipo === filterTipo;
    return matchesSearch && matchesDepartamento && matchesEstado && matchesTipo;
  });

  const selectedEmpleado = empleados.find((emp) => emp.id === selectedEmpleadoId);

  const handleVerFicha = (id: string) => {
    setSelectedEmpleadoId(id);
    navigate(`/module-empleados-detail/ficha-empleado?id=${id}`, { replace: true });
  };

  const handleToggleEmpleado = (id: string) => {
    setSelectedEmpleados((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (selectedEmpleados.length === filteredEmpleados.length) {
      setSelectedEmpleados([]);
    } else {
      setSelectedEmpleados(filteredEmpleados.map((emp) => emp.id));
    }
  };

  const handleAsignarHorario = () => {
    // Aquí iría la lógica para asignar el horario
    alert(`Horario asignado a ${selectedEmpleados.length} empleado(s): ${horarioTurno} para ${horarioMes} ${horarioAnio}`);
    setShowAsignarHorario(false);
    setSelectedEmpleados([]);
  };

  const getEstadoBadge = (estado: string) => {
    const styles = {
      activo: "bg-green-500/10 text-green-400 border border-green-500/30",
      inactivo: "bg-red-500/10 text-red-400 border border-red-500/30",
      vacaciones: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
    };
    const names = {
      activo: "Activo",
      inactivo: "Inactivo",
      vacaciones: "Vacaciones",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[estado as keyof typeof styles]}`}>
        {names[estado as keyof typeof names]}
      </span>
    );
  };

  const getTipoBadge = (tipo: string) => {
    const styles = {
      vip: "bg-amber-900 text-white",
      regular: "bg-teal-600 text-white",
      mayorista: "bg-blue-600 text-white",
    };
    const names = {
      vip: "VIP",
      regular: "Regular",
      mayorista: "Mayorista",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[tipo as keyof typeof styles]}`}>
        {names[tipo as keyof typeof names]}
      </span>
    );
  };

  return (
    <div className={`min-h-screen ${isLight ? "bg-[#F8FAFC]" : "bg-[#0D1B2A]"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
        {/* Fila principal del header */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Izquierda: botón volver + logo/título */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${
                isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>
                  Comercial del Pacífico S.A.
                </h1>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Empleados
                </p>
              </div>
            </div>
          </div>

          {/* Derecha: acciones y usuario */}
          <div className="flex items-center gap-3">
            {/* Toggle tema */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-primary hover:bg-white/5"
              }`}
              title={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Notificaciones */}
            <button className={`p-2 rounded-lg transition-colors relative ${
              isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Usuario */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JP</span>
              </div>
              <div className="hidden md:block text-left">
                <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  Juan Pérez
                </p>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Administrador RH • Matriz
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs horizontales */}
        <div className={`px-6 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab("inicio")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "inicio"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <Home className={`w-4 h-4 ${activeTab === "inicio" ? "text-primary" : ""}`} />
              Inicio
            </button>
            <button
              onClick={() => setActiveTab("mis-empleados")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "mis-empleados"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === "mis-empleados" ? "text-primary" : ""}`} />
              Mis Empleados
            </button>
            <button
              onClick={() => setActiveTab("ficha-empleado")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "ficha-empleado"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeTab === "ficha-empleado" ? "text-primary" : ""}`} />
              Ficha del Empleado
            </button>
            <button
              onClick={() => setActiveTab("crear-empleado")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "crear-empleado"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <UserPlus className={`w-4 h-4 ${activeTab === "crear-empleado" ? "text-primary" : ""}`} />
              Crear Empleado
            </button>
            <button
              onClick={() => setActiveTab("nomina-pagos")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === "nomina-pagos"
                  ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                  : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
              }`}
            >
              <DollarSign className={`w-4 h-4 ${activeTab === "nomina-pagos" ? "text-primary" : ""}`} />
              Nómina y Pagos
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Tab: Inicio */}
        {activeTab === "inicio" && (
          <>
            <div className={`mb-8 border rounded-lg p-8 text-center ${ 
              isLight 
                ? "bg-gradient-to-br from-gray-50/50 to-white border-gray-200" 
                : "bg-gradient-to-br from-[#0D1B2A] to-[#1a2936] border-white/10"
            }`}>
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-3 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>Módulo de Empleados</h2>
              <p className={`text-sm max-w-3xl mx-auto leading-relaxed ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}>
                Sistema completo para la gestión de recursos humanos, nómina, asignación de horarios, documentación laboral, control de pagos del personal, evaluaciones de desempeño y administración de permisos y vacaciones
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div
                onClick={() => setActiveTab("mis-empleados")}
                className={`rounded-lg p-5 border cursor-pointer transition-all hover:shadow-md ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-gray-300" 
                    : "bg-card border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Mis Empleados
                    </h3>
                    <p className={`text-sm mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Listado completo de personal y control de horarios
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Registro completo de empleados
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Asignación de turnos mensuales
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Control de cargos y salarios
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("ficha-empleado")}
                className={`rounded-lg p-5 border cursor-pointer transition-all hover:shadow-md ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-gray-300" 
                    : "bg-card border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Ficha del Empleado
                    </h3>
                    <p className={`text-sm mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Búsqueda y consulta completa de información del empleado
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Datos personales y laborales
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Documentos y garantes
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Historial laboral y evaluaciones
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("crear-empleado")}
                className={`rounded-lg p-5 border cursor-pointer transition-all hover:shadow-md ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-gray-300" 
                    : "bg-card border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Crear Empleado
                    </h3>
                    <p className={`text-sm mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Registro completo de nuevos empleados
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Formulario completo de datos
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Carga de documentos
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Configuración de cargo y contrato
                    </span>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("nomina-pagos")}
                className={`rounded-lg p-5 border cursor-pointer transition-all hover:shadow-md ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-gray-300" 
                    : "bg-card border-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Nómina y Pagos
                    </h3>
                    <p className={`text-sm mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Gestión de roles de pago y nómina mensual
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Generación de roles de pago
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Registro de pagos realizados
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isLight ? "text-green-600" : "text-green-500"}`} />
                    <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                      Historial completo de nóminas
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab: Mis Empleados */}
        {activeTab === "mis-empleados" && (
          <div className="space-y-4">
            {/* Botón Asignar Horario - Siempre visible */}
            <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      {selectedEmpleados.length > 0 
                        ? `${selectedEmpleados.length} empleado(s) seleccionado(s)` 
                        : "Ningún empleado seleccionado"}
                    </p>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {selectedEmpleados.length > 0 
                        ? "Asigna un horario laboral para el mes" 
                        : "Selecciona empleados para asignar horario"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAsignarHorario(true)}
                  disabled={selectedEmpleados.length === 0}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedEmpleados.length > 0
                      ? "bg-primary text-white hover:bg-primary/90"
                      : isLight
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white/10 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Asignar Horario
                </button>
              </div>
            </div>

            {/* Fila de filtros */}
            <div className="flex items-center gap-3">
              {/* Buscador */}
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-3 py-1.5 rounded-lg text-sm border ${
                    isLight
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                />
              </div>

              {/* Filtro Tipo */}
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className={`pl-10 pr-10 py-1.5 rounded-lg text-sm border appearance-none cursor-pointer ${
                    isLight
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-white/5 border-white/10 text-white"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="vip">VIP</option>
                  <option value="regular">Regular</option>
                  <option value="mayorista">Mayorista</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              </div>

              {/* Filtro Estado */}
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className={`pl-10 pr-10 py-1.5 rounded-lg text-sm border appearance-none cursor-pointer ${
                    isLight
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-white/5 border-white/10 text-white"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                >
                  <option value="all">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="vacaciones">Vacaciones</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              </div>

              {/* Filtro Departamento */}
              <div className="relative">
                <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <select
                  value={filterDepartamento}
                  onChange={(e) => setFilterDepartamento(e.target.value)}
                  className={`pl-10 pr-10 py-1.5 rounded-lg text-sm border appearance-none cursor-pointer ${
                    isLight
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-white/5 border-white/10 text-white"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                >
                  <option value="all">Todos los departamentos</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Contabilidad">Contabilidad</option>
                  <option value="Administración">Administración</option>
                  <option value="Marketing">Marketing</option>
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              </div>
            </div>

            {/* Tabla de empleados */}
            <div className={`rounded-xl border overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isLight ? "bg-gray-50" : "bg-white/5"}>
                    <tr className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      <th className="text-left px-4 py-3 w-12">
                        <input
                          type="checkbox"
                          checked={selectedEmpleados.length === filteredEmpleados.length && filteredEmpleados.length > 0}
                          onChange={handleToggleAll}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </th>
                      <th className="text-left px-4 py-3 uppercase tracking-wider">Cédula</th>
                      <th className="text-left px-4 py-3 uppercase tracking-wider">Nombre</th>
                      <th className="text-left px-4 py-3 uppercase tracking-wider">Apellido</th>
                      <th className="text-left px-4 py-3 uppercase tracking-wider">Cargo</th>
                      <th className="text-left px-4 py-3 uppercase tracking-wider">Departamento</th>
                      <th className="text-left px-4 py-3 uppercase tracking-wider">Estado</th>
                      <th className="text-left px-4 py-3 uppercase tracking-wider">Horario</th>
                      <th className="text-right px-4 py-3 uppercase tracking-wider">Salario</th>
                    </tr>
                  </thead>
                  <tbody className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                    {filteredEmpleados.map((empleado) => (
                      <tr
                        key={empleado.id}
                        className={`border-t transition-colors ${
                          isLight
                            ? "border-gray-200 hover:bg-gray-50"
                            : "border-white/5 hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedEmpleados.includes(empleado.id)}
                            onChange={() => handleToggleEmpleado(empleado.id)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3">{empleado.cedula}</td>
                        <td className="px-4 py-3">{empleado.nombre}</td>
                        <td className="px-4 py-3">{empleado.apellido}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                            {empleado.cargo}
                          </div>
                        </td>
                        <td className="px-4 py-3">{empleado.departamento}</td>
                        <td className="px-4 py-3">{getEstadoBadge(empleado.estado)}</td>
                        <td className="px-4 py-3">
                          {empleado.horarioAsignado ? (
                            <div className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {empleado.horarioAsignado}
                              </div>
                              <div className="text-[10px] mt-0.5">
                                {empleado.mesHorario} {empleado.anioHorario}
                              </div>
                            </div>
                          ) : (
                            <span className={`text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                              Sin asignar
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-primary">
                          ${empleado.salario.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Ficha del Empleado */}
        {activeTab === "ficha-empleado" && (
          <div className="space-y-6">
            <EmpleadoDetalladoForm
              empleado={selectedEmpleado}
              onClose={() => {
                setSelectedEmpleadoId(null);
                navigate("/module-empleados-detail/ficha-empleado", { replace: true });
              }}
              theme={theme}
            />
          </div>
        )}

        {/* Tab: Crear Empleado */}
        {activeTab === "crear-empleado" && (
          <CrearEmpleadoForm theme={theme} />
        )}

        {/* Tab: Nómina y Pagos */}
        {activeTab === "nomina-pagos" && (
          <NominaPagosContent theme={theme} />
        )}
      </div>

      {/* Modal Asignar Horario */}
      {showAsignarHorario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl border max-w-md w-full ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Asignar Horario Laboral
                </h3>
                <button
                  onClick={() => setShowAsignarHorario(false)}
                  className={`p-1 rounded-lg transition-colors ${
                    isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Mes
                  </label>
                  <select
                    value={horarioMes}
                    onChange={(e) => setHorarioMes(e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="enero">Enero</option>
                    <option value="febrero">Febrero</option>
                    <option value="marzo">Marzo</option>
                    <option value="abril">Abril</option>
                    <option value="mayo">Mayo</option>
                    <option value="junio">Junio</option>
                    <option value="julio">Julio</option>
                    <option value="agosto">Agosto</option>
                    <option value="septiembre">Septiembre</option>
                    <option value="octubre">Octubre</option>
                    <option value="noviembre">Noviembre</option>
                    <option value="diciembre">Diciembre</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Año
                  </label>
                  <select
                    value={horarioAnio}
                    onChange={(e) => setHorarioAnio(e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Turno / Horario
                  </label>
                  <select
                    value={horarioTurno}
                    onChange={(e) => setHorarioTurno(e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="08:00-17:00">Matutino (08:00 - 17:00)</option>
                    <option value="14:00-22:00">Vespertino (14:00 - 22:00)</option>
                    <option value="22:00-06:00">Nocturno (22:00 - 06:00)</option>
                    <option value="08:00-12:00">Medio Tiempo Mañana (08:00 - 12:00)</option>
                    <option value="14:00-18:00">Medio Tiempo Tarde (14:00 - 18:00)</option>
                  </select>
                </div>

                <div className={`p-3 rounded-lg ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                  <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Se asignará el horario a <strong>{selectedEmpleados.length}</strong> empleado(s) para el mes de{" "}
                    <strong>{horarioMes} {horarioAnio}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowAsignarHorario(false)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    isLight
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "border-white/10 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAsignarHorario}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Asignar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visualizar Datos Básicos */}
      {showVisualizarModal && empleadoVisualizar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl border max-w-lg w-full ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Datos Básicos del Empleado
                </h3>
                <button
                  onClick={() => {
                    setShowVisualizarModal(false);
                    setEmpleadoVisualizar(null);
                  }}
                  className={`p-1 rounded-lg transition-colors ${
                    isLight ? "hover:bg-gray-100 text-gray-600" : "hover:bg-white/5 text-gray-400"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Avatar y nombre */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-white/10">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium ${
                    isLight ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary"
                  }`}>
                    {empleadoVisualizar.nombre.charAt(0)}{empleadoVisualizar.apellido.charAt(0)}
                  </div>
                  <div>
                    <h4 className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoVisualizar.nombre} {empleadoVisualizar.apellido}
                    </h4>
                    <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {empleadoVisualizar.cargo}
                    </p>
                  </div>
                </div>

                {/* Información básica */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Cédula
                    </label>
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoVisualizar.cedula}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Tipo
                    </label>
                    <div>{getTipoBadge(empleadoVisualizar.tipo)}</div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Email
                    </label>
                    <p className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoVisualizar.email}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Teléfono
                    </label>
                    <p className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoVisualizar.telefono}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Departamento
                    </label>
                    <p className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      {empleadoVisualizar.departamento}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Estado
                    </label>
                    <div>{getEstadoBadge(empleadoVisualizar.estado)}</div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Salario
                    </label>
                    <p className={`text-sm font-medium text-primary`}>
                      ${empleadoVisualizar.salario.toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Horario Asignado
                    </label>
                    {empleadoVisualizar.horarioAsignado ? (
                      <div>
                        <p className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                          {empleadoVisualizar.horarioAsignado}
                        </p>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          {empleadoVisualizar.mesHorario} {empleadoVisualizar.anioHorario}
                        </p>
                      </div>
                    ) : (
                      <p className={`text-sm ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                        Sin asignar
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
                <button
                  onClick={() => {
                    setShowVisualizarModal(false);
                    setEmpleadoVisualizar(null);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    isLight
                      ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                      : "border-white/10 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setShowVisualizarModal(false);
                    setEmpleadoVisualizar(null);
                    handleVerFicha(empleadoVisualizar.id);
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Ver Ficha Completa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}