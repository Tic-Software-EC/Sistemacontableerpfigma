import { useState } from "react";
import {
  User,
  Phone,
  Building,
  FileText,
  CreditCard,
  Save,
  Upload,
  UserCheck,
  Plus,
  Trash2,
  X,
  Eye,
  Download,
  Search,
  Check,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { ModalGarante } from "./modal-garante";

interface CrearClienteFormProps {
  theme: string;
}

type CreacionTab = "datos-cliente" | "documentos" | "garantes-credito";

interface Garante {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  relacion: string;
  ingresos: number;
}

interface DocumentoSubido {
  id: string;
  tipo: string;
  nombre: string;
  archivo: File;
  url: string;
  fechaSubida: string;
  tamano: string;
}

export function CrearClienteForm({ theme }: CrearClienteFormProps) {
  const isLight = theme === "light";
  const [activeTab, setActiveTab] = useState<CreacionTab>("datos-cliente");
  
  const [clienteData, setClienteData] = useState({
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
    profesion: "",
    lugarTrabajo: "",
    ingresosMensuales: 0,
    tipo: "regular",
    estado: "activo",
    limiteCredito: 0,
  });

  const [garantes, setGarantes] = useState<Garante[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoSubido[]>([]);
  const [showGaranteModal, setShowGaranteModal] = useState(false);
  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [searchGaranteTerm, setSearchGaranteTerm] = useState("");
  const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false);
  
  // Variables temporales para compatibilidad con el modal viejo (serán eliminadas cuando se reemplace el modal)
  const [tipoGarante, setTipoGarante] = useState<"cliente" | "nuevo">("cliente");
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
  
  const [nuevoGarante, setNuevoGarante] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    relacion: "",
    ingresos: 0,
  });
  const [nuevoDocumento, setNuevoDocumento] = useState({
    tipo: "",
    nombre: "",
    archivo: null as File | null,
  });

  // Clientes disponibles para seleccionar como garantes (simulado)
  const clientesDisponibles = [
    {
      id: "1",
      cedula: "0912345678",
      nombre: "María",
      apellido: "González",
      email: "maria.gonzalez@email.com",
      telefono: "0987654321",
      direccion: "Av. 9 de Octubre 456",
      ingresosMensuales: 1200,
    },
    {
      id: "2",
      cedula: "0923456789",
      nombre: "Carlos",
      apellido: "Ramírez",
      email: "carlos.ramirez@email.com",
      telefono: "0987654322",
      direccion: "Calle Las Monjas 789",
      ingresosMensuales: 1500,
    },
    {
      id: "3",
      cedula: "0934567890",
      nombre: "Ana",
      apellido: "Torres",
      email: "ana.torres@email.com",
      telefono: "0987654323",
      direccion: "Av. Francisco de Orellana 321",
      ingresosMensuales: 1100,
    },
    {
      id: "4",
      cedula: "0945678901",
      nombre: "Luis",
      apellido: "Méndez",
      email: "luis.mendez@email.com",
      telefono: "0987654324",
      direccion: "Calle Principal 654",
      ingresosMensuales: 1800,
    },
    {
      id: "5",
      cedula: "0956789012",
      nombre: "Patricia",
      apellido: "Vera",
      email: "patricia.vera@email.com",
      telefono: "0987654325",
      direccion: "Av. Kennedy 987",
      ingresosMensuales: 1350,
    },
  ];

  const handleAbregarGarante = () => {
    setShowGaranteModal(true);
    setSearchGaranteTerm("");
    setMostrarResultadosBusqueda(false);
    setNuevoGarante({
      cedula: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      relacion: "",
      ingresos: 0,
    });
  };

  const limpiarFormularioGarante = () => {
    setSearchGaranteTerm("");
    setMostrarResultadosBusqueda(false);
    setNuevoGarante({
      cedula: "",
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
      relacion: "",
      ingresos: 0,
    });
  };

  const seleccionarClienteComoGarante = (cliente: any) => {
    setNuevoGarante({
      cedula: cliente.cedula,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      relacion: "",
      ingresos: cliente.ingresosMensuales || 0,
    });
    setSearchGaranteTerm("");
    setMostrarResultadosBusqueda(false);
    toast.success("Datos autocompletados", {
      description: `Información de ${cliente.nombre} ${cliente.apellido} cargada`
    });
  };

  const agregarGarante = () => {
    // Validaciones
    if (!nuevoGarante.cedula || !nuevoGarante.nombre || !nuevoGarante.apellido) {
      toast.error("Campos obligatorios incompletos", {
        description: "Cédula, nombre y apellido son requeridos"
      });
      return;
    }

    if (nuevoGarante.cedula.length !== 10) {
      toast.error("Cédula inválida", {
        description: "La cédula debe tener 10 dígitos"
      });
      return;
    }

    if (!nuevoGarante.relacion) {
      toast.error("Relación requerida", {
        description: "Por favor especifica la relación con el cliente"
      });
      return;
    }

    // Verificar si la cédula ya existe
    const cedulaExiste = garantes.some(g => g.cedula === nuevoGarante.cedula);
    if (cedulaExiste) {
      toast.error("Garante duplicado", {
        description: "Ya existe un garante con esta cédula"
      });
      return;
    }

    const nuevoGaranteId = `${Date.now()}-${Math.random()}`;
    const garante: Garante = {
      id: nuevoGaranteId,
      cedula: nuevoGarante.cedula,
      nombre: nuevoGarante.nombre,
      apellido: nuevoGarante.apellido,
      email: nuevoGarante.email || "N/A",
      telefono: nuevoGarante.telefono || "N/A",
      direccion: nuevoGarante.direccion || "N/A",
      relacion: nuevoGarante.relacion,
      ingresos: nuevoGarante.ingresos || 0,
    };

    setGarantes([...garantes, garante]);
    toast.success("Garante agregado exitosamente", {
      description: `${nuevoGarante.nombre} ${nuevoGarante.apellido}`
    });

    setShowGaranteModal(false);
    limpiarFormularioGarante();
  };

  const eliminarGarante = (id: string) => {
    const garante = garantes.find(g => g.id === id);
    if (garante) {
      setGarantes(garantes.filter(g => g.id !== id));
      toast.success("Garante eliminado");
    }
  };

  // Filtrar clientes disponibles para garantes (excluir ya agregados)
  const clientesDisponiblesGarantes = clientesDisponibles.filter(cliente => {
    const yaEsGarante = garantes.some(g => g.cedula === cliente.cedula);
    const coincideBusqueda = searchGaranteTerm.length > 0 && (
      cliente.cedula.includes(searchGaranteTerm) ||
      cliente.nombre.toLowerCase().includes(searchGaranteTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchGaranteTerm.toLowerCase())
    );
    return !yaEsGarante && coincideBusqueda;
  });

  const handleSubirDocumento = () => {
    setShowDocumentoModal(true);
  };

  const agregarDocumento = () => {
    if (!nuevoDocumento.nombre || !nuevoDocumento.tipo || !nuevoDocumento.archivo) {
      toast.error("Campos incompletos", {
        description: "Por favor completa todos los campos requeridos"
      });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(nuevoDocumento.archivo.type)) {
      toast.error("Tipo de archivo no permitido", {
        description: "Solo se permiten imágenes (JPEG, PNG, WEBP) y archivos PDF."
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (nuevoDocumento.archivo.size > maxSize) {
      toast.error("Archivo muy grande", {
        description: "El archivo no debe superar los 5MB."
      });
      return;
    }

    const url = URL.createObjectURL(nuevoDocumento.archivo);
    const tamanoKB = (nuevoDocumento.archivo.size / 1024).toFixed(2);
    const tamano = tamanoKB + " KB";
    const fecha = new Date().toLocaleDateString('es-EC', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });

    const documento: DocumentoSubido = {
      id: `${Date.now()}-${Math.random()}`,
      tipo: nuevoDocumento.tipo,
      nombre: nuevoDocumento.nombre,
      archivo: nuevoDocumento.archivo,
      url,
      fechaSubida: fecha,
      tamano,
    };

    setDocumentos([...documentos, documento]);
    toast.success("Documento agregado exitosamente", {
      description: nuevoDocumento.nombre
    });

    setNuevoDocumento({ tipo: "", nombre: "", archivo: null });
    setShowDocumentoModal(false);
  };

  const eliminarDocumento = (id: string) => {
    const documento = documentos.find(d => d.id === id);
    if (documento) {
      URL.revokeObjectURL(documento.url);
      setDocumentos(documentos.filter(d => d.id !== id));
      toast.success("Documento eliminado");
    }
  };

  const visualizarDocumento = (doc: DocumentoSubido) => {
    window.open(doc.url, "_blank");
  };

  const descargarDocumento = (doc: DocumentoSubido) => {
    const link = document.createElement("a");
    link.href = doc.url;
    link.download = doc.archivo.name;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => {
            setClienteData({
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
              profesion: "",
              lugarTrabajo: "",
              ingresosMensuales: 0,
              tipo: "regular",
              estado: "activo",
              limiteCredito: 0,
            });
            setGarantes([]);
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
          Guardar Cliente
        </button>
      </div>

      <div className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("datos-cliente")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "datos-cliente"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <User className="w-4 h-4" />
            Datos del Cliente
          </button>
          <button
            onClick={() => setActiveTab("documentos")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "documentos"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <FileText className="w-4 h-4" />
            Documentos
          </button>
          <button
            onClick={() => setActiveTab("garantes-credito")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "garantes-credito"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Garantes y Crédito
          </button>
        </div>
      </div>

      <div className={`border rounded-lg p-6 ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        {activeTab === "datos-cliente" && (
            <div className="space-y-6">
              <h3 className={`font-bold text-lg mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                Crear Nuevo Cliente
              </h3>

              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <User className="w-4 h-4 text-primary" />
                  Información Personal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Cédula *</label>
                    <input
                      type="text"
                      value={clienteData.cedula}
                      onChange={(e) => setClienteData({...clienteData, cedula: e.target.value})}
                      placeholder="0912345678"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={clienteData.nombre}
                      onChange={(e) => setClienteData({...clienteData, nombre: e.target.value})}
                      placeholder="Juan Carlos"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Apellido *</label>
                    <input
                      type="text"
                      value={clienteData.apellido}
                      onChange={(e) => setClienteData({...clienteData, apellido: e.target.value})}
                      placeholder="Pérez Morales"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={clienteData.fechaNacimiento}
                      onChange={(e) => setClienteData({...clienteData, fechaNacimiento: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Estado Civil</label>
                    <select
                      value={clienteData.estadoCivil}
                      onChange={(e) => setClienteData({...clienteData, estadoCivil: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">Profesión</label>
                    <input
                      type="text"
                      value={clienteData.profesion}
                      onChange={(e) => setClienteData({...clienteData, profesion: e.target.value})}
                      placeholder="Ingeniero"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <Phone className="w-4 h-4 text-primary" />
                  Información de Contacto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
                    <input
                      type="email"
                      value={clienteData.email}
                      onChange={(e) => setClienteData({...clienteData, email: e.target.value})}
                      placeholder="ejemplo@email.com"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono Principal *</label>
                    <input
                      type="tel"
                      value={clienteData.telefono}
                      onChange={(e) => setClienteData({...clienteData, telefono: e.target.value})}
                      placeholder="0987654321"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono Adicional</label>
                    <input
                      type="tel"
                      value={clienteData.telefonoAdicional}
                      onChange={(e) => setClienteData({...clienteData, telefonoAdicional: e.target.value})}
                      placeholder="042345678"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Dirección *</label>
                    <input
                      type="text"
                      value={clienteData.direccion}
                      onChange={(e) => setClienteData({...clienteData, direccion: e.target.value})}
                      placeholder="Av. Principal 123 y Calle Secundaria"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ciudad *</label>
                    <input
                      type="text"
                      value={clienteData.ciudad}
                      onChange={(e) => setClienteData({...clienteData, ciudad: e.target.value})}
                      placeholder="Guayaquil"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Provincia *</label>
                    <input
                      type="text"
                      value={clienteData.provincia}
                      onChange={(e) => setClienteData({...clienteData, provincia: e.target.value})}
                      placeholder="Guayas"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <Building className="w-4 h-4 text-primary" />
                  Información Laboral y Comercial
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Lugar de Trabajo</label>
                    <input
                      type="text"
                      value={clienteData.lugarTrabajo}
                      onChange={(e) => setClienteData({...clienteData, lugarTrabajo: e.target.value})}
                      placeholder="Tech Solutions S.A."
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ingresos Mensuales</label>
                    <input
                      type="number"
                      value={clienteData.ingresosMensuales}
                      onChange={(e) => setClienteData({...clienteData, ingresosMensuales: parseFloat(e.target.value)})}
                      placeholder="2500.00"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de Cliente *</label>
                    <select
                      value={clienteData.tipo}
                      onChange={(e) => setClienteData({...clienteData, tipo: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <option value="regular">Regular</option>
                      <option value="vip">VIP</option>
                      <option value="mayorista">Mayorista</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Estado *</label>
                    <select
                      value={clienteData.estado}
                      onChange={(e) => setClienteData({...clienteData, estado: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Límite de Crédito</label>
                    <input
                      type="number"
                      value={clienteData.limiteCredito}
                      onChange={(e) => setClienteData({...clienteData, limiteCredito: parseFloat(e.target.value)})}
                      placeholder="5000.00"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === "documentos" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                  Documentos del Cliente
                </h3>
                <button
                  onClick={handleSubirDocumento}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Subir Documento
                </button>
              </div>
              {documentos.length > 0 ? (
                <div className={`border rounded-lg overflow-hidden ${
                  isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Subida</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tamaño</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                        {documentos.map((doc, index) => (
                          <tr 
                            key={index}
                            className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                          >
                            <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                              {doc.nombre}
                            </td>
                            <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              {doc.tipo}
                            </td>
                            <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              {doc.fechaSubida}
                            </td>
                            <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              {doc.tamano}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => visualizarDocumento(doc)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isLight 
                                      ? "hover:bg-blue-50 text-blue-600" 
                                      : "hover:bg-blue-500/10 text-blue-400"
                                  }`}
                                  title="Visualizar"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => descargarDocumento(doc)}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    isLight 
                                      ? "hover:bg-green-50 text-green-600" 
                                      : "hover:bg-green-500/10 text-green-400"
                                  }`}
                                  title="Descargar"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => eliminarDocumento(doc.id)}
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
              ) : (
                <div className={`text-center py-12 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay documentos cargados</p>
                  <p className="text-xs mt-2">Los documentos requeridos son: Cédula (frontal y posterior), Papeleta de Votación, Comprobante de Domicilio</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "garantes-credito" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                  Garantes y Límite de Crédito
                </h3>
                <button 
                  onClick={handleAbregarGarante}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Garante
                </button>
              </div>

              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <CreditCard className="w-4 h-4 text-primary" />
                  Configuración de Crédito
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Límite de Crédito</label>
                    <input
                      type="number"
                      value={clienteData.limiteCredito}
                      onChange={(e) => setClienteData({...clienteData, limiteCredito: parseFloat(e.target.value)})}
                      placeholder="5000.00"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Días de Plazo</label>
                    <input
                      type="number"
                      placeholder="30"
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {garantes.length > 0 ? (
                <div className={`border rounded-lg overflow-hidden ${
                  isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cédula</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Relación</th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                        {garantes.map((garante, index) => (
                          <tr 
                            key={index}
                            className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                          >
                            <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                              {garante.nombre} {garante.apellido}
                            </td>
                            <td className={`px-4 py-3 text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              {garante.cedula}
                            </td>
                            <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              {garante.telefono}
                            </td>
                            <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              {garante.relacion}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => eliminarGarante(garante.id)}
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
              ) : (
                <div className={`p-8 text-center rounded-lg border-2 border-dashed ${
                  isLight ? "border-gray-300 bg-gray-50" : "border-white/20 bg-white/5"
                }`}>
                  <UserCheck className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    No hay garantes agregados
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Haz clic en "Agregar Garante" para comenzar
                  </p>
                </div>
              )}
            </div>
          )}
      </div>

      <ModalGarante
        isLight={isLight}
        showGaranteModal={showGaranteModal}
        setShowGaranteModal={setShowGaranteModal}
        searchGaranteTerm={searchGaranteTerm}
        setSearchGaranteTerm={setSearchGaranteTerm}
        mostrarResultadosBusqueda={mostrarResultadosBusqueda}
        setMostrarResultadosBusqueda={setMostrarResultadosBusqueda}
        clientesDisponiblesGarantes={clientesDisponiblesGarantes}
        seleccionarClienteComoGarante={seleccionarClienteComoGarante}
        nuevoGarante={nuevoGarante}
        setNuevoGarante={setNuevoGarante}
        limpiarFormularioGarante={limpiarFormularioGarante}
        agregarGarante={agregarGarante}
      />

      {showDocumentoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-md w-full ${
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Subir Documento
              </h3>
              <button
                onClick={() => setShowDocumentoModal(false)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Tipo de Documento
                </label>
                <select
                  value={nuevoDocumento.tipo}
                  onChange={(e) => setNuevoDocumento({...nuevoDocumento, tipo: e.target.value})}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                >
                  <option value="cedula">Cédula</option>
                  <option value="papeleta">Papeleta de Votación</option>
                  <option value="comprobante">Comprobante de Domicilio</option>
                </select>
              </div>

              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Nombre del Documento
                </label>
                <input
                  type="text"
                  value={nuevoDocumento.nombre}
                  onChange={(e) => setNuevoDocumento({...nuevoDocumento, nombre: e.target.value})}
                  placeholder="Ej: Cédula frontal"
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
                  accept="image/jpeg, image/jpg, image/png, image/webp, application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNuevoDocumento({...nuevoDocumento, archivo: file});
                    }
                  }}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDocumentoModal(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
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
    </div>
  );
}