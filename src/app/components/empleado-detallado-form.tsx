import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  FileText,
  DollarSign,
  Save,
  Upload,
  Download,
  Eye,
  Trash2,
  Plus,
  Camera,
  X,
  Check,
  Search,
  Briefcase,
  Award,
  Heart,
  Baby,
} from "lucide-react";

interface EmpleadoDetalladoFormProps {
  empleado?: any;
  onClose?: () => void;
  theme: string;
}

type EmpleadoDetalladoTab = 
  | "datos-empleado" 
  | "documentos-empleado" 
  | "historial-laboral" 
  | "permisos-vacaciones" 
  | "evaluaciones" 
  | "cargas-familiares";

export function EmpleadoDetalladoForm({ theme }: EmpleadoDetalladoFormProps) {
  const isLight = theme === "light";
  const [activeSubTab, setActiveSubTab] = useState<EmpleadoDetalladoTab>("datos-empleado");
  const [searchTerm, setSearchTerm] = useState("");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<any>(null);
  
  // Estados para modales
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [showPermisoModal, setShowPermisoModal] = useState(false);
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false);
  const [showFamiliarModal, setShowFamiliarModal] = useState(false);
  
  // Estados para las listas editables
  const [documentos, setDocumentos] = useState([
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
  ]);

  const [historialLaboral, setHistorialLaboral] = useState([
    {
      id: "1",
      empresa: "Comercial del Pacífico S.A.",
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
  ]);

  const [permisos, setPermisos] = useState([
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
  ]);

  const [evaluaciones, setEvaluaciones] = useState([
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
  ]);

  const [cargasFamiliares, setCargasFamiliares] = useState([
    {
      id: "1",
      nombre: "Ana Pérez López",
      parentesco: "Cónyuge",
      cedula: "0923456789",
      fechaNacimiento: "1987-05-20",
      edad: 37,
      discapacidad: false,
    },
    {
      id: "2",
      nombre: "Carlos Pérez López",
      parentesco: "Hijo",
      cedula: "0934567890",
      fechaNacimiento: "2015-08-12",
      edad: 9,
      discapacidad: false,
    },
  ]);

  // Estados para formularios de modales
  const [nuevoDocumento, setNuevoDocumento] = useState({ tipo: "", nombre: "", archivo: null });
  const [nuevaExperiencia, setNuevaExperiencia] = useState({ empresa: "", cargo: "", fechaInicio: "", fechaFin: "", departamento: "", motivo: "" });
  const [nuevoPermiso, setNuevoPermiso] = useState({ tipo: "Vacaciones", fechaInicio: "", fechaFin: "", dias: 0, motivo: "" });
  const [nuevaEvaluacion, setNuevaEvaluacion] = useState({ periodo: "", evaluador: "", calificacion: 0, desempeno: 0, puntualidad: 0, trabajo_equipo: 0, iniciativa: 0, comentarios: "" });
  const [nuevoFamiliar, setNuevoFamiliar] = useState({ nombre: "", parentesco: "Cónyuge", cedula: "", fechaNacimiento: "", edad: 0, discapacidad: false });
  
  // Empleados disponibles para búsqueda
  const empleadosDisponibles = [
    {
      id: "1",
      cedula: "0912345678",
      nombre: "Juan Carlos",
      apellido: "Pérez Morales",
      email: "juan.perez@comercialdelpacificosa.com",
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
      email: "maria.gonzalez@comercialdelpacificosa.com",
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

  // Función para limpiar selección
  const limpiarSeleccion = () => {
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
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (field: string, value: any) => {
    setEmpleadoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para guardar cambios
  const guardarCambios = () => {
    console.log("Guardando cambios del empleado:", empleadoData);
    alert(`Cambios guardados exitosamente para ${empleadoData.nombre} ${empleadoData.apellido}`);
  };

  // ============ FUNCIONES PARA DOCUMENTOS ============
  const handleSubirDocumento = () => {
    setShowDocumentoModal(true);
  };

  const agregarDocumento = () => {
    if (!nuevoDocumento.nombre || !nuevoDocumento.tipo) {
      alert("Por favor complete todos los campos");
      return;
    }
    
    const documento = {
      id: String(documentos.length + 1),
      tipo: nuevoDocumento.tipo,
      nombre: nuevoDocumento.nombre,
      archivo: nuevoDocumento.archivo || "archivo.pdf",
      fechaSubida: new Date().toISOString().split('T')[0],
      tamano: "1.5 MB",
    };
    
    setDocumentos([...documentos, documento]);
    setNuevoDocumento({ tipo: "", nombre: "", archivo: null });
    setShowDocumentoModal(false);
    alert("Documento subido exitosamente");
  };

  const visualizarDocumento = (doc: any) => {
    alert(`Visualizando documento: ${doc.nombre}\nArchivo: ${doc.archivo}`);
  };

  const descargarDocumento = (doc: any) => {
    alert(`Descargando documento: ${doc.nombre}`);
    console.log("Descargando:", doc);
  };

  const eliminarDocumento = (id: string) => {
    if (confirm("¿Está seguro de eliminar este documento?")) {
      setDocumentos(documentos.filter(doc => doc.id !== id));
      alert("Documento eliminado exitosamente");
    }
  };

  // ============ FUNCIONES PARA HISTORIAL LABORAL ============
  const handleAgregarExperiencia = () => {
    setShowHistorialModal(true);
  };

  const agregarExperiencia = () => {
    if (!nuevaExperiencia.empresa || !nuevaExperiencia.cargo || !nuevaExperiencia.fechaInicio) {
      alert("Por favor complete los campos obligatorios");
      return;
    }
    
    const experiencia = {
      id: String(historialLaboral.length + 1),
      ...nuevaExperiencia,
    };
    
    setHistorialLaboral([...historialLaboral, experiencia]);
    setNuevaExperiencia({ empresa: "", cargo: "", fechaInicio: "", fechaFin: "", departamento: "", motivo: "" });
    setShowHistorialModal(false);
    alert("Experiencia laboral agregada exitosamente");
  };

  // ============ FUNCIONES PARA PERMISOS ============
  const handleSolicitarPermiso = () => {
    setShowPermisoModal(true);
  };

  const solicitarPermiso = () => {
    if (!nuevoPermiso.tipo || !nuevoPermiso.fechaInicio || !nuevoPermiso.fechaFin) {
      alert("Por favor complete todos los campos");
      return;
    }
    
    const permiso = {
      id: String(permisos.length + 1),
      tipo: nuevoPermiso.tipo,
      fechaSolicitud: new Date().toISOString().split('T')[0],
      fechaInicio: nuevoPermiso.fechaInicio,
      fechaFin: nuevoPermiso.fechaFin,
      dias: nuevoPermiso.dias,
      estado: "pendiente",
      motivo: nuevoPermiso.motivo,
    };
    
    setPermisos([...permisos, permiso]);
    setNuevoPermiso({ tipo: "Vacaciones", fechaInicio: "", fechaFin: "", dias: 0, motivo: "" });
    setShowPermisoModal(false);
    alert("Permiso solicitado exitosamente");
  };

  // ============ FUNCIONES PARA EVALUACIONES ============
  const handleNuevaEvaluacion = () => {
    setShowEvaluacionModal(true);
  };

  const agregarEvaluacion = () => {
    if (!nuevaEvaluacion.periodo || !nuevaEvaluacion.evaluador) {
      alert("Por favor complete todos los campos");
      return;
    }
    
    const promedio = (
      Number(nuevaEvaluacion.desempeno) +
      Number(nuevaEvaluacion.puntualidad) +
      Number(nuevaEvaluacion.trabajo_equipo) +
      Number(nuevaEvaluacion.iniciativa)
    ) / 4;
    
    const evaluacion = {
      id: String(evaluaciones.length + 1),
      periodo: nuevaEvaluacion.periodo,
      fecha: new Date().toISOString().split('T')[0],
      calificacion: Number(promedio.toFixed(1)),
      evaluador: nuevaEvaluacion.evaluador,
      aspectos: {
        desempeno: Number(nuevaEvaluacion.desempeno),
        puntualidad: Number(nuevaEvaluacion.puntualidad),
        trabajo_equipo: Number(nuevaEvaluacion.trabajo_equipo),
        iniciativa: Number(nuevaEvaluacion.iniciativa),
      },
      comentarios: nuevaEvaluacion.comentarios,
    };
    
    setEvaluaciones([...evaluaciones, evaluacion]);
    setNuevaEvaluacion({ periodo: "", evaluador: "", calificacion: 0, desempeno: 0, puntualidad: 0, trabajo_equipo: 0, iniciativa: 0, comentarios: "" });
    setShowEvaluacionModal(false);
    alert("Evaluación agregada exitosamente");
  };

  // ============ FUNCIONES PARA CARGAS FAMILIARES ============
  const handleAgregarFamiliar = () => {
    setShowFamiliarModal(true);
  };

  const agregarFamiliar = () => {
    if (!nuevoFamiliar.nombre || !nuevoFamiliar.cedula || !nuevoFamiliar.fechaNacimiento) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }
    
    const familiar = {
      id: String(cargasFamiliares.length + 1),
      nombre: nuevoFamiliar.nombre,
      parentesco: nuevoFamiliar.parentesco,
      cedula: nuevoFamiliar.cedula,
      fechaNacimiento: nuevoFamiliar.fechaNacimiento,
      edad: nuevoFamiliar.edad,
      discapacidad: nuevoFamiliar.discapacidad,
    };
    
    setCargasFamiliares([...cargasFamiliares, familiar]);
    setNuevoFamiliar({ nombre: "", parentesco: "Cónyuge", cedula: "", fechaNacimiento: "", edad: 0, discapacidad: false });
    setShowFamiliarModal(false);
    alert("Familiar agregado exitosamente");
  };

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
                onClick={limpiarSeleccion}
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

      {/* Botones de Acción Superiores - SIEMPRE VISIBLES */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={limpiarSeleccion}
          disabled={!empleadoSeleccionado}
          className={`px-6 py-2 border rounded-lg text-sm font-medium transition-colors ${
            empleadoSeleccionado
              ? isLight 
                ? "border-gray-200 hover:bg-gray-50 text-gray-700 cursor-pointer"
                : "border-white/10 hover:bg-white/5 text-white cursor-pointer"
              : "border-gray-600 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
          }`}
        >
          Limpiar
        </button>
        <button 
          disabled={!empleadoSeleccionado}
          className={`px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
            empleadoSeleccionado
              ? "bg-primary hover:bg-primary/90 text-white cursor-pointer"
              : "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
          }`}
          onClick={guardarCambios}
        >
          <Save className="w-4 h-4" />
          Guardar Cambios
        </button>
      </div>

      {/* Sub-Tabs - SIEMPRE VISIBLES */}
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
          <button
            onClick={() => setActiveSubTab("cargas-familiares")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "cargas-familiares"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <Heart className="w-4 h-4" />
            Cargas Familiares
          </button>
        </div>
      </div>

      {/* Tab Content Container - SIEMPRE VISIBLE */}
      <div className={`border rounded-lg p-6 ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        {/* Tab: Datos Generales */}
        {activeSubTab === "datos-empleado" && (
          <div className="space-y-6">
            <h3 className={`font-bold text-lg mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
              Datos Generales
            </h3>

            {/* Tarjeta de Perfil del Empleado */}
            <div className={`p-6 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <div className="flex items-start gap-6 mb-6">
                {/* Foto del empleado */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    {empleadoSeleccionado ? (
                      <User className="w-12 h-12 text-gray-500" />
                    ) : (
                      <User className="w-12 h-12 text-gray-500" />
                    )}
                  </div>
                  <button className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
                    <Camera className="w-3 h-3" />
                    Cambiar Foto
                  </button>
                </div>

                {/* Información Principal */}
                <div className="flex-1">
                  <h4 className={`text-xl font-bold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    {empleadoSeleccionado ? `${empleadoData.nombre} ${empleadoData.apellido}` : "Sin nombre"}
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Cédula: {empleadoSeleccionado ? empleadoData.cedula : "Sin cédula"} • {empleadoSeleccionado && empleadoData.cargo ? empleadoData.cargo : "Sin cargo"}
                  </p>
                  <div className="flex gap-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      empleadoSeleccionado && empleadoData.estado 
                        ? getEstadoBadge(empleadoData.estado).style 
                        : "bg-green-500/10 text-green-400 border border-green-500/40"
                    }`}>
                      {empleadoSeleccionado && empleadoData.estado ? getEstadoBadge(empleadoData.estado).name : "Activo"}
                    </span>
                    {empleadoSeleccionado && empleadoData.departamento && (
                      <span className={`text-xs px-2 py-1 rounded ${getDepartamentoBadge(empleadoData.departamento)}`}>
                        {empleadoData.departamento}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Salario Mensual</p>
                      <p className="text-lg font-bold text-primary">
                        ${empleadoSeleccionado && empleadoData.salario > 0 ? empleadoData.salario.toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Fecha de Ingreso</p>
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        {empleadoSeleccionado && empleadoData.fechaIngreso ? empleadoData.fechaIngreso : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div className={`p-6 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-primary" />
                <h4 className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Información Personal
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Cédula
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.cedula : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.nombre : ""}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    disabled={!empleadoSeleccionado}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder="Ingrese el nombre"
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.apellido : ""}
                    onChange={(e) => handleInputChange("apellido", e.target.value)}
                    disabled={!empleadoSeleccionado}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder="Ingrese el apellido"
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    value={empleadoSeleccionado ? empleadoData.fechaNacimiento : ""}
                    onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                    disabled={!empleadoSeleccionado}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Estado Civil
                  </label>
                  <select
                    value={empleadoSeleccionado ? empleadoData.estadoCivil : ""}
                    onChange={(e) => handleInputChange("estadoCivil", e.target.value)}
                    disabled={!empleadoSeleccionado}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="Soltero">Soltero</option>
                    <option value="Casado">Casado</option>
                    <option value="Divorciado">Divorciado</option>
                    <option value="Viudo">Viudo</option>
                    <option value="Unión Libre">Unión Libre</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Profesión
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.profesion : ""}
                    onChange={(e) => handleInputChange("profesion", e.target.value)}
                    disabled={!empleadoSeleccionado}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder="Ingrese la profesión"
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className={`p-6 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-4 h-4 text-primary" />
                <h4 className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Información de Contacto
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={empleadoSeleccionado ? empleadoData.email : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={empleadoSeleccionado ? empleadoData.telefono : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.direccion : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.ciudad : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Provincia
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.provincia : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Información Laboral */}
            <div className={`p-6 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-primary" />
                <h4 className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Información Laboral
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.cargo : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.departamento : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha de Ingreso
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.fechaIngreso : "dd/mm/aaaa"}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Tipo de Contrato
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.tipoContrato : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Salario Mensual
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado && empleadoData.salario > 0 ? `$${empleadoData.salario.toFixed(2)}` : "$0.00"}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm font-bold text-primary ${
                      isLight
                        ? "bg-white border-gray-200"
                        : "bg-white/5 border-white/10"
                    }`}
                    readOnly
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Nivel de Educación
                  </label>
                  <input
                    type="text"
                    value={empleadoSeleccionado ? empleadoData.nivelEducacion : ""}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                    placeholder=""
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Documentos */}
        {activeSubTab === "documentos-empleado" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Documentos
              </h3>
              <button 
                onClick={handleSubirDocumento}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Subir Documento
              </button>
            </div>

            <div className="space-y-3">
              {empleadoSeleccionado ? (
                documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 rounded-lg border ${
                      isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            {doc.nombre}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {doc.tamano} • Subido el {doc.fechaSubida}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => visualizarDocumento(doc)}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => descargarDocumento(doc)}
                          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => eliminarDocumento(doc.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`p-8 rounded-lg border text-center ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Selecciona un empleado para ver sus documentos
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Historial Laboral */}
        {activeSubTab === "historial-laboral" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Historial Laboral
              </h3>
              <button 
                onClick={handleAgregarExperiencia}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Experiencia
              </button>
            </div>

            <div className="space-y-3">
              {empleadoSeleccionado ? (
                historialLaboral.map((exp) => (
                  <div
                    key={exp.id}
                    className={`p-4 rounded-lg border ${
                      isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                            {exp.cargo}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {exp.empresa}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400">Período:</span>
                        <p className={`font-medium mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                          {exp.fechaInicio} - {exp.fechaFin}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Motivo de salida:</span>
                        <p className={`font-medium mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                          {exp.motivo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`p-8 rounded-lg border text-center ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Selecciona un empleado para ver su historial laboral
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Permisos y Vacaciones */}
        {activeSubTab === "permisos-vacaciones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Permisos y Vacaciones
              </h3>
              <button 
                onClick={handleSolicitarPermiso}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Solicitar Permiso
              </button>
            </div>

            <div className="space-y-3">
              {empleadoSeleccionado ? (
                permisos.map((permiso) => (
                  <div
                    key={permiso.id}
                    className={`p-4 rounded-lg border ${
                      isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                            {permiso.tipo}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {permiso.dias} días • {permiso.fechaInicio} a {permiso.fechaFin}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getEstadoBadge(permiso.estado).style}`}>
                        {getEstadoBadge(permiso.estado).name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Motivo: {permiso.motivo}
                    </p>
                  </div>
                ))
              ) : (
                <div className={`p-8 rounded-lg border text-center ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Selecciona un empleado para ver sus permisos y vacaciones
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Evaluaciones */}
        {activeSubTab === "evaluaciones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Evaluaciones de Desempeño
              </h3>
              <button 
                onClick={handleNuevaEvaluacion}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nueva Evaluación
              </button>
            </div>

            <div className="space-y-3">
              {empleadoSeleccionado ? (
                evaluaciones.map((evaluacion) => (
                  <div
                    key={evaluacion.id}
                    className={`p-4 rounded-lg border ${
                      isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                            Evaluación {evaluacion.periodo}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Evaluado por: {evaluacion.evaluador}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{evaluacion.calificacion}</p>
                        <p className="text-xs text-gray-400">/ 10</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Desempeño</p>
                        <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                          {evaluacion.aspectos.desempeno}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Puntualidad</p>
                        <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                          {evaluacion.aspectos.puntualidad}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Trabajo en Equipo</p>
                        <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                          {evaluacion.aspectos.trabajo_equipo}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Iniciativa</p>
                        <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                          {evaluacion.aspectos.iniciativa}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 italic">
                      "{evaluacion.comentarios}"
                    </p>
                  </div>
                ))
              ) : (
                <div className={`p-8 rounded-lg border text-center ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Selecciona un empleado para ver sus evaluaciones
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Cargas Familiares */}
        {activeSubTab === "cargas-familiares" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Cargas Familiares
              </h3>
              <button 
                onClick={handleAgregarFamiliar}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar Familiar
              </button>
            </div>

            <div className="space-y-3">
              {empleadoSeleccionado ? (
                cargasFamiliares.map((familiar) => (
                  <div
                    key={familiar.id}
                    className={`p-4 rounded-lg border ${
                      isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {familiar.parentesco === "Hijo" ? (
                            <Baby className="w-5 h-5 text-primary" />
                          ) : (
                            <Heart className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                            {familiar.nombre}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {familiar.parentesco} • {familiar.edad} años
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <p className="text-gray-400">Cédula</p>
                        <p className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {familiar.cedula}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`p-8 rounded-lg border text-center ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <Heart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">
                    Selecciona un empleado para ver sus cargas familiares
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ============ MODALES ============ */}
      
      {/* Modal: Subir Documento */}
      {showDocumentoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${ 
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Subir Documento
              </h3>
              <button onClick={() => setShowDocumentoModal(false)} className="p-1 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Tipo de Documento *
                </label>
                <select
                  value={nuevoDocumento.tipo}
                  onChange={(e) => setNuevoDocumento({...nuevoDocumento, tipo: e.target.value})}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                >
                  <option value="">Seleccione...</option>
                  <option value="cedula">Cédula</option>
                  <option value="contrato">Contrato</option>
                  <option value="titulo">Título Profesional</option>
                  <option value="certificado">Certificado</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Nombre del Documento *
                </label>
                <input
                  type="text"
                  value={nuevoDocumento.nombre}
                  onChange={(e) => setNuevoDocumento({...nuevoDocumento, nombre: e.target.value})}
                  placeholder="Ej: Cédula de Identidad"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Archivo
                </label>
                <input
                  type="file"
                  onChange={(e) => setNuevoDocumento({...nuevoDocumento, archivo: e.target.files?.[0] || null})}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDocumentoModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium ${
                    isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarDocumento}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Agregar Experiencia Laboral */}
      {showHistorialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-lg w-full ${ 
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Agregar Experiencia Laboral
              </h3>
              <button onClick={() => setShowHistorialModal(false)} className="p-1 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Empresa *
                </label>
                <input
                  type="text"
                  value={nuevaExperiencia.empresa}
                  onChange={(e) => setNuevaExperiencia({...nuevaExperiencia, empresa: e.target.value})}
                  placeholder="Nombre de la empresa"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Cargo *
                  </label>
                  <input
                    type="text"
                    value={nuevaExperiencia.cargo}
                    onChange={(e) => setNuevaExperiencia({...nuevaExperiencia, cargo: e.target.value})}
                    placeholder="Cargo desempeñado"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Departamento
                  </label>
                  <input
                    type="text"
                    value={nuevaExperiencia.departamento}
                    onChange={(e) => setNuevaExperiencia({...nuevaExperiencia, departamento: e.target.value})}
                    placeholder="Departamento"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    value={nuevaExperiencia.fechaInicio}
                    onChange={(e) => setNuevaExperiencia({...nuevaExperiencia, fechaInicio: e.target.value})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={nuevaExperiencia.fechaFin}
                    onChange={(e) => setNuevaExperiencia({...nuevaExperiencia, fechaFin: e.target.value})}
                    placeholder="Actualidad"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Motivo de Salida
                </label>
                <textarea
                  value={nuevaExperiencia.motivo}
                  onChange={(e) => setNuevaExperiencia({...nuevaExperiencia, motivo: e.target.value})}
                  placeholder="Motivo de salida (opcional)"
                  rows={2}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowHistorialModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium ${
                    isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarExperiencia}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Solicitar Permiso */}
      {showPermisoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${ 
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Solicitar Permiso
              </h3>
              <button onClick={() => setShowPermisoModal(false)} className="p-1 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Tipo de Permiso *
                </label>
                <select
                  value={nuevoPermiso.tipo}
                  onChange={(e) => setNuevoPermiso({...nuevoPermiso, tipo: e.target.value})}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                >
                  <option value="Vacaciones">Vacaciones</option>
                  <option value="Permiso Médico">Permiso Médico</option>
                  <option value="Permiso Personal">Permiso Personal</option>
                  <option value="Permiso Familiar">Permiso Familiar</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    value={nuevoPermiso.fechaInicio}
                    onChange={(e) => setNuevoPermiso({...nuevoPermiso, fechaInicio: e.target.value})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha Fin *
                  </label>
                  <input
                    type="date"
                    value={nuevoPermiso.fechaFin}
                    onChange={(e) => setNuevoPermiso({...nuevoPermiso, fechaFin: e.target.value})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Número de Días
                </label>
                <input
                  type="number"
                  value={nuevoPermiso.dias}
                  onChange={(e) => setNuevoPermiso({...nuevoPermiso, dias: Number(e.target.value)})}
                  placeholder="Días solicitados"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Motivo *
                </label>
                <textarea
                  value={nuevoPermiso.motivo}
                  onChange={(e) => setNuevoPermiso({...nuevoPermiso, motivo: e.target.value})}
                  placeholder="Describa el motivo del permiso"
                  rows={3}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPermisoModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium ${
                    isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={solicitarPermiso}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium"
                >
                  Solicitar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nueva Evaluación */}
      {showEvaluacionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto ${ 
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Nueva Evaluación de Desempeño
              </h3>
              <button onClick={() => setShowEvaluacionModal(false)} className="p-1 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Período *
                  </label>
                  <input
                    type="text"
                    value={nuevaEvaluacion.periodo}
                    onChange={(e) => setNuevaEvaluacion({...nuevaEvaluacion, periodo: e.target.value})}
                    placeholder="Ej: 2024 - Q1"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Evaluador *
                  </label>
                  <input
                    type="text"
                    value={nuevaEvaluacion.evaluador}
                    onChange={(e) => setNuevaEvaluacion({...nuevaEvaluacion, evaluador: e.target.value})}
                    placeholder="Nombre del evaluador"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-sm font-semibold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Calificaciones (0-10)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Desempeño
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={nuevaEvaluacion.desempeno}
                      onChange={(e) => setNuevaEvaluacion({...nuevaEvaluacion, desempeno: Number(e.target.value)})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Puntualidad
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={nuevaEvaluacion.puntualidad}
                      onChange={(e) => setNuevaEvaluacion({...nuevaEvaluacion, puntualidad: Number(e.target.value)})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Trabajo en Equipo
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={nuevaEvaluacion.trabajo_equipo}
                      onChange={(e) => setNuevaEvaluacion({...nuevaEvaluacion, trabajo_equipo: Number(e.target.value)})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Iniciativa
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={nuevaEvaluacion.iniciativa}
                      onChange={(e) => setNuevaEvaluacion({...nuevaEvaluacion, iniciativa: Number(e.target.value)})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Comentarios
                </label>
                <textarea
                  value={nuevaEvaluacion.comentarios}
                  onChange={(e) => setNuevaEvaluacion({...nuevaEvaluacion, comentarios: e.target.value})}
                  placeholder="Comentarios sobre el desempeño"
                  rows={3}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEvaluacionModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium ${
                    isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarEvaluacion}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Agregar Familiar */}
      {showFamiliarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${ 
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Agregar Carga Familiar
              </h3>
              <button onClick={() => setShowFamiliarModal(false)} className="p-1 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={nuevoFamiliar.nombre}
                  onChange={(e) => setNuevoFamiliar({...nuevoFamiliar, nombre: e.target.value})}
                  placeholder="Nombre completo del familiar"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Parentesco *
                  </label>
                  <select
                    value={nuevoFamiliar.parentesco}
                    onChange={(e) => setNuevoFamiliar({...nuevoFamiliar, parentesco: e.target.value})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="Cónyuge">Cónyuge</option>
                    <option value="Hijo">Hijo</option>
                    <option value="Padre">Padre</option>
                    <option value="Madre">Madre</option>
                    <option value="Hermano">Hermano</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Cédula *
                  </label>
                  <input
                    type="text"
                    value={nuevoFamiliar.cedula}
                    onChange={(e) => setNuevoFamiliar({...nuevoFamiliar, cedula: e.target.value})}
                    placeholder="Número de cédula"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha Nacimiento *
                  </label>
                  <input
                    type="date"
                    value={nuevoFamiliar.fechaNacimiento}
                    onChange={(e) => setNuevoFamiliar({...nuevoFamiliar, fechaNacimiento: e.target.value})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Edad
                  </label>
                  <input
                    type="number"
                    value={nuevoFamiliar.edad}
                    onChange={(e) => setNuevoFamiliar({...nuevoFamiliar, edad: Number(e.target.value)})}
                    placeholder="Edad"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={nuevoFamiliar.discapacidad}
                    onChange={(e) => setNuevoFamiliar({...nuevoFamiliar, discapacidad: e.target.checked})}
                    className="rounded"
                  />
                  <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    ¿Tiene discapacidad?
                  </span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowFamiliarModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium ${
                    isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarFamiliar}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}