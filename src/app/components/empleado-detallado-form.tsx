import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  FileText,
  CreditCard,
  DollarSign,
  Save,
  Upload,
  Download,
  Eye,
  Trash2,
  Plus,
  IdCard,
  Camera,
  UserCheck,
  X,
  Edit,
  AlertCircle,
  Check,
  Search,
  Users,
  History,
  Briefcase,
  Award,
  Clock,
  GraduationCap,
} from "lucide-react";

interface EmpleadoDetalladoFormProps {
  theme: string;
}

type EmpleadoDetalladoTab = "datos-empleado" | "documentos-empleado" | "historial-laboral" | "permisos-vacaciones" | "evaluaciones";

export function EmpleadoDetalladoForm({ theme }: EmpleadoDetalladoFormProps) {
  const isLight = theme === "light";
  const [activeSubTab, setActiveSubTab] = useState<EmpleadoDetalladoTab>("datos-empleado");
  const [searchTerm, setSearchTerm] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<any>(null);
  
  // Empleados disponibles para búsqueda
  const empleadosDisponibles = [
    {
      id: "1",
      cedula: "0912345678",
      nombre: "Juan Carlos",
      apellido: "Pérez Morales",
      email: "juan.perez@ticsoftec.com",
      telefono: "0987654321",
      telefonoAdicional: "042345678",
      direccion: "Av. Principal 123 y Calle Secundaria",
      ciudad: "Guayaquil",
      provincia: "Guayas",
      fechaNacimiento: "1985-03-15",
      estadoCivil: "Casado",
      fechaIngreso: "2020-01-10",
      estado: "activo",
      cargo: "Gerente de Ventas",
      departamento: "Ventas",
      salario: 2500,
      tipoContrato: "indefinido",
      nivelEducacion: "Universitario",
      profesion: "Ingeniero Comercial",
    },
    {
      id: "2",
      cedula: "0923456789",
      nombre: "María Fernanda",
      apellido: "González Castro",
      email: "maria.gonzalez@ticsoftec.com",
      telefono: "0998765432",
      telefonoAdicional: "042876543",
      direccion: "Calle Las Flores 456",
      ciudad: "Quito",
      provincia: "Pichincha",
      fechaNacimiento: "1990-07-22",
      estadoCivil: "Soltera",
      fechaIngreso: "2021-03-20",
      estado: "activo",
      cargo: "Contadora",
      departamento: "Contabilidad",
      salario: 1800,
      tipoContrato: "indefinido",
      nivelEducacion: "Universitario",
      profesion: "Contador Público",
    },
  ];

  // Filtrar empleados según búsqueda
  const empleadosFiltrados = empleadosDisponibles.filter(empleado =>
    empleado.cedula.includes(searchTerm) ||
    empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Datos de ejemplo para el empleado
  const [empleadoData, setEmpleadoData] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    telefonoAdicional: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    fechaNacimiento: "",
    estadoCivil: "Soltero",
    fechaIngreso: "",
    estado: "activo",
    cargo: "",
    departamento: "",
    salario: 0,
    tipoContrato: "indefinido",
    nivelEducacion: "",
    profesion: "",
  });

  // Función para seleccionar un empleado
  const seleccionarEmpleado = (empleado: any) => {
    setEmpleadoSeleccionado(empleado);
    setEmpleadoData(empleado);
    setSearchTerm("");
  };

  const documentos = [
    {
      id: "1",
      tipo: "cedula-frontal",
      nombre: "Cédula Frontal",
      archivo: "cedula_frontal.jpg",
      fechaSubida: "2024-03-10",
      tamano: "2.3 MB",
    },
    {
      id: "2",
      tipo: "cedula-posterior",
      nombre: "Cédula Posterior",
      archivo: "cedula_posterior.jpg",
      fechaSubida: "2024-03-10",
      tamano: "2.1 MB",
    },
    {
      id: "3",
      tipo: "contrato",
      nombre: "Contrato Laboral",
      archivo: "contrato.pdf",
      fechaSubida: "2024-03-10",
      tamano: "1.8 MB",
    },
    {
      id: "4",
      tipo: "foto-empleado",
      nombre: "Foto del Empleado",
      archivo: "foto_empleado.jpg",
      fechaSubida: "2024-03-10",
      tamano: "1.5 MB",
    },
  ];

  const historialLaboral = [
    {
      id: "1",
      empresa: "Tech Solutions S.A.",
      cargo: "Gerente de Ventas",
      fechaInicio: "2020-01-10",
      fechaFin: "Actualidad",
      departamento: "Ventas",
      motivo: "-",
    },
    {
      id: "2",
      empresa: "Innovate Corp",
      cargo: "Supervisor de Ventas",
      fechaInicio: "2017-06-15",
      fechaFin: "2019-12-31",
      departamento: "Ventas",
      motivo: "Mejor oferta laboral",
    },
  ];

  const permisos = [
    {
      id: "1",
      tipo: "Vacaciones",
      fechaSolicitud: "2024-02-20",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-03-15",
      dias: 14,
      estado: "aprobado",
      motivo: "Vacaciones anuales",
    },
    {
      id: "2",
      tipo: "Permiso Médico",
      fechaSolicitud: "2024-01-10",
      fechaInicio: "2024-01-11",
      fechaFin: "2024-01-12",
      dias: 2,
      estado: "aprobado",
      motivo: "Consulta médica",
    },
  ];

  const evaluaciones = [
    {
      id: "1",
      periodo: "2024 - Q1",
      fecha: "2024-03-31",
      calificacion: 9.2,
      evaluador: "María Torres - Directora RH",
      aspectos: {
        desempeno: 9.5,
        puntualidad: 9.0,
        trabajo_equipo: 9.3,
        iniciativa: 9.0,
      },
      comentarios: "Excelente desempeño en el primer trimestre. Superó las metas establecidas.",
    },
    {
      id: "2",
      periodo: "2023 - Q4",
      fecha: "2023-12-31",
      calificacion: 8.8,
      evaluador: "María Torres - Directora RH",
      aspectos: {
        desempeno: 9.0,
        puntualidad: 8.5,
        trabajo_equipo: 9.0,
        iniciativa: 8.8,
      },
      comentarios: "Buen desempeño general. Se recomienda mejorar puntualidad.",
    },
  ];

  const getDepartamentoBadge = (departamento: string) => {
    const styles: Record<string, string> = {
      Ventas: "bg-[#3d2817] text-[#E8692E] border border-[#E8692E]/40",
      Contabilidad: "bg-[#0d3d4a] text-cyan-400 border border-cyan-500/40",
      Inventario: "bg-[#1e3d1e] text-green-400 border border-green-500/40",
      Compras: "bg-[#3d1e3d] text-purple-400 border border-purple-500/40",
      RRHH: "bg-[#3d1e1e] text-rose-400 border border-rose-500/40",
    };
    return styles[departamento] || "bg-gray-700 text-gray-400 border border-gray-600";
  };

  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      activo: "bg-green-500/10 text-green-400 border border-green-500/40",
      inactivo: "bg-gray-700 text-gray-400 border border-gray-600",
      vacaciones: "bg-blue-500/10 text-blue-400 border border-blue-500/40",
      aprobado: "bg-green-500/10 text-green-400 border border-green-500/40",
      pendiente: "bg-[#3d3417] text-yellow-400 border border-yellow-500/40",
      rechazado: "bg-[#3d1a1f] text-red-400 border border-red-500/40",
    };
    const names: Record<string, string> = {
      activo: "Activo",
      inactivo: "Inactivo",
      vacaciones: "Vacaciones",
      aprobado: "Aprobado",
      pendiente: "Pendiente",
      rechazado: "Rechazado",
    };
    return { style: styles[estado], name: names[estado] };
  };

  return (
    <div className="space-y-4">
      {/* Buscador de Empleado */}
      <div className={`border rounded-lg p-4 ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        <h3 className={`font-semibold text-sm mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
          Buscar Empleado
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cédula, nombre o apellido..."
            className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
              isLight
                ? "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                : "bg-white/5 border-white/10 text-white placeholder-gray-500"
            }`}
          />
        </div>

        {/* Resultados de Búsqueda */}
        {searchTerm && (
          <div className={`mt-3 border rounded-lg overflow-hidden ${
            isLight ? "border-gray-200" : "border-white/10"
          }`}>
            {empleadosFiltrados.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {empleadosFiltrados.map((empleado) => (
                  <button
                    key={empleado.id}
                    onClick={() => seleccionarEmpleado(empleado)}
                    className={`w-full px-4 py-3 text-left transition-colors border-b last:border-b-0 ${
                      isLight 
                        ? "hover:bg-gray-50 border-gray-200" 
                        : "hover:bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                          {empleado.nombre} {empleado.apellido}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Cédula: {empleado.cedula} • {empleado.cargo}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getDepartamentoBadge(empleado.departamento)}`}>
                        {empleado.departamento}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-400">
                  No se encontraron empleados
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empleado Seleccionado */}
        {empleadoSeleccionado && (
          <div className={`mt-3 p-3 rounded-lg border ${
            isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/40"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <p className={`text-sm font-medium ${isLight ? "text-green-900" : "text-green-400"}`}>
                  Empleado seleccionado: {empleadoSeleccionado.nombre} {empleadoSeleccionado.apellido}
                </p>
              </div>
              <button
                onClick={() => {
                  setEmpleadoSeleccionado(null);
                  setEmpleadoData({
                    cedula: "",
                    nombre: "",
                    apellido: "",
                    email: "",
                    telefono: "",
                    telefonoAdicional: "",
                    direccion: "",
                    ciudad: "",
                    provincia: "",
                    fechaNacimiento: "",
                    estadoCivil: "Soltero",
                    fechaIngreso: "",
                    estado: "activo",
                    cargo: "",
                    departamento: "",
                    salario: 0,
                    tipoContrato: "indefinido",
                    nivelEducacion: "",
                    profesion: "",
                  });
                }}
                className={`p-1 rounded-lg transition-colors ${
                  isLight ? "hover:bg-green-100" : "hover:bg-green-500/20"
                }`}
              >
                <X className="w-4 h-4 text-green-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Botones de Acción Superiores - SIEMPRE VISIBLE */}
      <div className="flex justify-end gap-3 bg-red-500/20 p-4 rounded-lg">
        <button 
          onClick={() => {
            setEmpleadoSeleccionado(null);
            setEmpleadoData({
              cedula: "",
              nombre: "",
              apellido: "",
              email: "",
              telefono: "",
              telefonoAdicional: "",
              direccion: "",
              ciudad: "",
              provincia: "",
              fechaNacimiento: "",
              estadoCivil: "Soltero",
              fechaIngreso: "",
              estado: "activo",
              cargo: "",
              departamento: "",
              salario: 0,
              tipoContrato: "indefinido",
              nivelEducacion: "",
              profesion: "",
            });
          }}
          className={`px-6 py-2 border rounded-lg text-sm font-medium transition-colors ${
            isLight 
              ? "border-gray-200 hover:bg-gray-50 text-gray-700"
              : "border-white/10 hover:bg-white/5 text-white"
          }`}
        >
          Limpiar
        </button>
        <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>

      {/* Sub-Tabs con nuevo estilo */}
      <div className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveSubTab("datos-empleado")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "datos-empleado"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <User className="w-4 h-4" />
            Datos Generales
          </button>
          <button
            onClick={() => setActiveSubTab("documentos-empleado")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "documentos-empleado"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <FileText className="w-4 h-4" />
            Documentos
          </button>
          <button
            onClick={() => setActiveSubTab("historial-laboral")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "historial-laboral"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Historial Laboral
          </button>
          <button
            onClick={() => setActiveSubTab("permisos-vacaciones")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "permisos-vacaciones"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <Calendar className="w-4 h-4" />
            Permisos y Vacaciones
          </button>
          <button
            onClick={() => setActiveSubTab("evaluaciones")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "evaluaciones"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <Award className="w-4 h-4" />
            Evaluaciones
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className={`border rounded-lg p-6 ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        {activeSubTab === "datos-empleado" && (
            <div className="space-y-6">
              <h3 className={`font-bold text-lg mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                Datos Generales
              </h3>

              {/* Sección de Foto del Empleado */}
              <div className={`p-6 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Foto del Empleado */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-primary/20">
                        <img
                          src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczNDA0MjEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                          alt="Foto del empleado"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
                      <Upload className="w-3 h-3" />
                      Cargar Foto
                    </button>
                  </div>

                  {/* Información Básica del Empleado */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Nombre Completo
                      </label>
                      <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {empleadoData.nombre} {empleadoData.apellido}
                      </p>
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Cédula
                      </label>
                      <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {empleadoData.cedula || "-"}
                      </p>
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Cargo
                      </label>
                      <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {empleadoData.cargo || "-"}
                      </p>
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Departamento
                      </label>
                      <span className={`text-xs px-2 py-1 rounded inline-block ${getDepartamentoBadge(empleadoData.departamento)}`}>
                        {empleadoData.departamento || "-"}
                      </span>
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Estado
                      </label>
                      <span className={`text-xs px-2 py-1 rounded inline-block ${getEstadoBadge(empleadoData.estado).style}`}>
                        {getEstadoBadge(empleadoData.estado).name}
                      </span>
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Salario Mensual
                      </label>
                      <p className={`text-sm font-bold text-primary`}>
                        ${empleadoData.salario.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Personal */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <User className="w-4 h-4" />
                  Información Personal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={empleadoData.email}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, email: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Teléfono Principal
                    </label>
                    <input
                      type="text"
                      value={empleadoData.telefono}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, telefono: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Teléfono Adicional
                    </label>
                    <input
                      type="text"
                      value={empleadoData.telefonoAdicional}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, telefonoAdicional: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      value={empleadoData.fechaNacimiento}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, fechaNacimiento: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Estado Civil
                    </label>
                    <select
                      value={empleadoData.estadoCivil}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, estadoCivil: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    >
                      <option value="Soltero">Soltero/a</option>
                      <option value="Casado">Casado/a</option>
                      <option value="Divorciado">Divorciado/a</option>
                      <option value="Viudo">Viudo/a</option>
                      <option value="Union Libre">Unión Libre</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Profesión
                    </label>
                    <input
                      type="text"
                      value={empleadoData.profesion}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, profesion: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    />
                  </div>
                </div>
              </div>

              {/* Información de Domicilio */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <MapPin className="w-4 h-4" />
                  Información de Domicilio
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Dirección Completa
                    </label>
                    <input
                      type="text"
                      value={empleadoData.direccion}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, direccion: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={empleadoData.ciudad}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, ciudad: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Provincia
                    </label>
                    <select
                      value={empleadoData.provincia}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, provincia: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    >
                      <option value="">Seleccione...</option>
                      <option value="Guayas">Guayas</option>
                      <option value="Pichincha">Pichincha</option>
                      <option value="Azuay">Azuay</option>
                      <option value="Manabí">Manabí</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="El Oro">El Oro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Información Laboral */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <Briefcase className="w-4 h-4" />
                  Información Laboral
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Fecha de Ingreso
                    </label>
                    <input
                      type="date"
                      value={empleadoData.fechaIngreso}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, fechaIngreso: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Tipo de Contrato
                    </label>
                    <select
                      value={empleadoData.tipoContrato}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, tipoContrato: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    >
                      <option value="indefinido">Indefinido</option>
                      <option value="temporal">Temporal</option>
                      <option value="por-horas">Por Horas</option>
                      <option value="practicante">Practicante</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Salario Mensual
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={empleadoData.salario}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, salario: parseFloat(e.target.value) })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Nivel de Educación
                    </label>
                    <select
                      value={empleadoData.nivelEducacion}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, nivelEducacion: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-200 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:border-primary/50`}
                    >
                      <option value="">Seleccione...</option>
                      <option value="Primaria">Primaria</option>
                      <option value="Secundaria">Secundaria</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Universitario">Universitario</option>
                      <option value="Postgrado">Postgrado</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
        )}

        {activeSubTab === "documentos-empleado" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Documentos del Empleado
              </h3>
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                Agregar Documento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 rounded-lg border ${
                    isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                          {doc.nombre}
                        </h4>
                        <p className="text-xs text-gray-400">{doc.archivo}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{doc.fechaSubida}</span>
                    <span>{doc.tamano}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isLight ? "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}>
                      <Eye className="w-3 h-3 inline mr-1" />
                      Ver
                    </button>
                    <button className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isLight ? "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}>
                      <Download className="w-3 h-3 inline mr-1" />
                      Descargar
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === "historial-laboral" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Historial Laboral
              </h3>
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                Agregar Experiencia
              </button>
            </div>

            <div className="space-y-4">
              {historialLaboral.map((exp) => (
                <div
                  key={exp.id}
                  className={`p-4 rounded-lg border ${
                    isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold text-base ${isLight ? "text-gray-900" : "text-white"}`}>
                        {exp.cargo}
                      </h4>
                      <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        {exp.empresa} • {exp.departamento}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="text-xs text-gray-400">Fecha Inicio</label>
                      <p className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{exp.fechaInicio}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Fecha Fin</label>
                      <p className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{exp.fechaFin}</p>
                    </div>
                    {exp.motivo !== "-" && (
                      <div className="col-span-2">
                        <label className="text-xs text-gray-400">Motivo de Salida</label>
                        <p className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{exp.motivo}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === "permisos-vacaciones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Permisos y Vacaciones
              </h3>
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                Solicitar Permiso
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-xs font-medium ${isLight ? "text-gray-500 bg-gray-50" : "text-gray-400 bg-white/5"}`}>
                    <th className="text-left px-4 py-3 rounded-tl-lg">Tipo</th>
                    <th className="text-left px-4 py-3">Fecha Solicitud</th>
                    <th className="text-left px-4 py-3">Inicio</th>
                    <th className="text-left px-4 py-3">Fin</th>
                    <th className="text-center px-4 py-3">Días</th>
                    <th className="text-left px-4 py-3">Estado</th>
                    <th className="text-left px-4 py-3 rounded-tr-lg">Motivo</th>
                  </tr>
                </thead>
                <tbody className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                  {permisos.map((permiso) => (
                    <tr
                      key={permiso.id}
                      className={`border-t ${
                        isLight ? "border-gray-200" : "border-white/5"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{permiso.tipo}</td>
                      <td className="px-4 py-3 text-gray-400">{permiso.fechaSolicitud}</td>
                      <td className="px-4 py-3">{permiso.fechaInicio}</td>
                      <td className="px-4 py-3">{permiso.fechaFin}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          {permiso.dias}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoBadge(permiso.estado).style}`}>
                          {getEstadoBadge(permiso.estado).name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{permiso.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSubTab === "evaluaciones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Evaluaciones de Desempeño
              </h3>
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4" />
                Nueva Evaluación
              </button>
            </div>

            <div className="space-y-4">
              {evaluaciones.map((evaluacion) => (
                <div
                  key={evaluacion.id}
                  className={`p-4 rounded-lg border ${
                    isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className={`font-semibold text-base ${isLight ? "text-gray-900" : "text-white"}`}>
                        {evaluacion.periodo}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        Evaluado por: {evaluacion.evaluador}
                      </p>
                      <p className="text-xs text-gray-400">
                        Fecha: {evaluacion.fecha}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{evaluacion.calificacion}</div>
                      <p className="text-xs text-gray-400">Calificación</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${isLight ? "bg-white" : "bg-white/5"}`}>
                      <p className="text-xs text-gray-400 mb-1">Desempeño</p>
                      <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {evaluacion.aspectos.desempeno}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isLight ? "bg-white" : "bg-white/5"}`}>
                      <p className="text-xs text-gray-400 mb-1">Puntualidad</p>
                      <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {evaluacion.aspectos.puntualidad}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isLight ? "bg-white" : "bg-white/5"}`}>
                      <p className="text-xs text-gray-400 mb-1">Trabajo en Equipo</p>
                      <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {evaluacion.aspectos.trabajo_equipo}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isLight ? "bg-white" : "bg-white/5"}`}>
                      <p className="text-xs text-gray-400 mb-1">Iniciativa</p>
                      <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {evaluacion.aspectos.iniciativa}
                      </p>
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`}>
                    <p className="text-xs text-gray-400 mb-2">Comentarios</p>
                    <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      {evaluacion.comentarios}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}