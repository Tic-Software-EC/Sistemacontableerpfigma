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
  ShoppingCart,
  DollarSign,
  Save,
  Upload,
  Download,
  Eye,
  Trash2,
  Plus,
  IdCard,
  Vote,
  Home as HomeIcon,
  Camera,
  UserCheck,
  UserPlus,
  X,
  Edit,
  AlertCircle,
  Check,
  Search,
  Users,
  History,
  Receipt,
} from "lucide-react";

interface ClienteDetalladoFormProps {
  theme: string;
}

type ClienteDetalladoTab = "datos-cliente" | "documentos-cliente" | "garantes-credito" | "historial-cliente" | "deudas-cliente";

export function ClienteDetalladoForm({ theme }: ClienteDetalladoFormProps) {
  const isLight = theme === "light";
  const [activeSubTab, setActiveSubTab] = useState<ClienteDetalladoTab>("datos-cliente");
  const [searchTerm, setSearchTerm] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
  
  // Clientes disponibles para búsqueda
  const clientesDisponibles = [
    {
      id: "1",
      cedula: "0912345678",
      nombre: "Juan Carlos",
      apellido: "Pérez Morales",
      email: "juan.perez@email.com",
      telefono: "0987654321",
      telefonoAdicional: "042345678",
      direccion: "Av. Principal 123 y Calle Secundaria",
      ciudad: "Guayaquil",
      provincia: "Guayas",
      fechaNacimiento: "1985-03-15",
      estadoCivil: "Casado",
      profesion: "Ingeniero",
      lugarTrabajo: "Tech Solutions S.A.",
      ingresosMensuales: 2500,
      tipo: "vip",
      estado: "activo",
      limiteCredito: 5000,
      saldoPendiente: 1200,
    },
    {
      id: "2",
      cedula: "0923456789",
      nombre: "María Elena",
      apellido: "Torres García",
      email: "maria.torres@email.com",
      telefono: "0976543210",
      telefonoAdicional: "042876543",
      direccion: "Calle Secundaria 456",
      ciudad: "Quito",
      provincia: "Pichincha",
      fechaNacimiento: "1990-08-22",
      estadoCivil: "Soltera",
      profesion: "Contadora",
      lugarTrabajo: "Contadores Asociados",
      ingresosMensuales: 1800,
      tipo: "regular",
      estado: "activo",
      limiteCredito: 3000,
      saldoPendiente: 0,
    },
  ];

  // Filtrar clientes según búsqueda
  const clientesFiltrados = clientesDisponibles.filter(cliente =>
    cliente.cedula.includes(searchTerm) ||
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Datos de ejemplo para el cliente
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
    saldoPendiente: 0,
  });

  // Función para seleccionar un cliente
  const seleccionarCliente = (cliente: any) => {
    setClienteSeleccionado(cliente);
    setClienteData(cliente);
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
      tipo: "papeleta-votacion",
      nombre: "Papeleta de Votación",
      archivo: "papeleta.pdf",
      fechaSubida: "2024-03-10",
      tamano: "1.5 MB",
    },
  ];

  const garantes = [
    {
      id: "1",
      nombre: "María Elena Torres",
      cedula: "0923456789",
      telefono: "0987654321",
      relacion: "Cónyuge",
      ingresosMensuales: 1800,
    },
    {
      id: "2",
      nombre: "Roberto Mendoza",
      cedula: "0934567890",
      telefono: "0976543210",
      relacion: "Amigo",
      ingresosMensuales: 2200,
    },
  ];

  const compras = [
    {
      id: "1",
      fecha: "2024-03-10",
      factura: "FAC-001-0012345",
      total: 450.00,
      estado: "pagado",
      productos: 5,
    },
    {
      id: "2",
      fecha: "2024-03-05",
      factura: "FAC-001-0012344",
      total: 320.00,
      estado: "pagado",
      productos: 3,
    },
    {
      id: "3",
      fecha: "2024-02-28",
      factura: "FAC-001-0012343",
      total: 1200.00,
      estado: "pendiente",
      productos: 8,
    },
  ];

  const deudas = [
    {
      id: "1",
      factura: "FAC-001-0012343",
      fechaEmision: "2024-02-28",
      fechaVencimiento: "2024-03-28",
      montoOriginal: 1200.00,
      montoPendiente: 1200.00,
      diasVencidos: 0,
      estado: "pendiente",
    },
    {
      id: "2",
      factura: "FAC-001-0012340",
      fechaEmision: "2024-01-15",
      fechaVencimiento: "2024-02-15",
      montoOriginal: 850.00,
      montoPendiente: 0.00,
      diasVencidos: 0,
      estado: "pagado",
    },
  ];

  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      activo: "bg-green-500/10 text-green-400 border border-green-500/40",
      inactivo: "bg-gray-700 text-gray-400 border border-gray-600",
      pagado: "bg-green-500/10 text-green-400 border border-green-500/40",
      pendiente: "bg-[#3d3417] text-yellow-400 border border-yellow-500/40",
      vencido: "bg-[#3d1a1f] text-red-400 border border-red-500/40",
    };
    const names: Record<string, string> = {
      activo: "Activo",
      inactivo: "Inactivo",
      pagado: "Pagado",
      pendiente: "Pendiente",
      vencido: "Vencido",
    };
    return { style: styles[estado], name: names[estado] };
  };

  return (
    <div className="space-y-4">
      {/* Buscador de Cliente */}
      <div className={`border rounded-lg p-4 ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        <h3 className={`font-semibold text-sm mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
          Buscar Cliente
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
            {clientesFiltrados.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {clientesFiltrados.map((cliente) => (
                  <button
                    key={cliente.id}
                    onClick={() => seleccionarCliente(cliente)}
                    className={`w-full px-4 py-3 text-left transition-colors border-b last:border-b-0 ${
                      isLight 
                        ? "hover:bg-gray-50 border-gray-200" 
                        : "hover:bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                          {cliente.nombre} {cliente.apellido}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Cédula: {cliente.cedula} • {cliente.email}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        cliente.tipo === "vip" 
                          ? "bg-purple-500/10 text-purple-400" 
                          : cliente.tipo === "mayorista"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-gray-500/10 text-gray-400"
                      }`}>
                        {cliente.tipo.toUpperCase()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-400">
                  No se encontraron clientes
                </p>
              </div>
            )}
          </div>
        )}

        {/* Cliente Seleccionado */}
        {clienteSeleccionado && (
          <div className={`mt-3 p-3 rounded-lg border ${
            isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/40"
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <p className={`text-sm font-medium ${isLight ? "text-green-900" : "text-green-400"}`}>
                  Cliente seleccionado: {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                </p>
              </div>
              <button
                onClick={() => {
                  setClienteSeleccionado(null);
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
                    saldoPendiente: 0,
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

      {/* Botones de Acción Superiores */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => {
            setClienteSeleccionado(null);
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
              saldoPendiente: 0,
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
            onClick={() => setActiveSubTab("datos-cliente")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "datos-cliente"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <User className="w-4 h-4" />
            Datos del Cliente
          </button>
          <button
            onClick={() => setActiveSubTab("documentos-cliente")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "documentos-cliente"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <FileText className="w-4 h-4" />
            Documentos
          </button>
          <button
            onClick={() => setActiveSubTab("garantes-credito")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "garantes-credito"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <Users className="w-4 h-4" />
            Garantes y Crédito
          </button>
          <button
            onClick={() => setActiveSubTab("historial-cliente")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "historial-cliente"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <History className="w-4 h-4" />
            Historial de Compras
          </button>
          <button
            onClick={() => setActiveSubTab("deudas-cliente")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === "deudas-cliente"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <Receipt className="w-4 h-4" />
            Deudas
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className={`border rounded-lg p-6 ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        {activeSubTab === "datos-cliente" && (
            <div className="space-y-6">
              <h3 className={`font-bold text-lg mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                Información Completa del Cliente
              </h3>

              {/* Información Personal */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <User className="w-4 h-4 text-primary" />
                  Información Personal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Cédula</label>
                    <input
                      type="text"
                      value={clienteData.cedula}
                      onChange={(e) => setClienteData({...clienteData, cedula: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={clienteData.nombre}
                      onChange={(e) => setClienteData({...clienteData, nombre: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Apellido</label>
                    <input
                      type="text"
                      value={clienteData.apellido}
                      onChange={(e) => setClienteData({...clienteData, apellido: e.target.value})}
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
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <Phone className="w-4 h-4 text-primary" />
                  Información de Contacto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={clienteData.email}
                      onChange={(e) => setClienteData({...clienteData, email: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono Principal</label>
                    <input
                      type="tel"
                      value={clienteData.telefono}
                      onChange={(e) => setClienteData({...clienteData, telefono: e.target.value})}
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
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Dirección</label>
                    <input
                      type="text"
                      value={clienteData.direccion}
                      onChange={(e) => setClienteData({...clienteData, direccion: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={clienteData.ciudad}
                      onChange={(e) => setClienteData({...clienteData, ciudad: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Provincia</label>
                    <input
                      type="text"
                      value={clienteData.provincia}
                      onChange={(e) => setClienteData({...clienteData, provincia: e.target.value})}
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Información Laboral */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <Building className="w-4 h-4 text-primary" />
                  Información Laboral y Financiera
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Lugar de Trabajo</label>
                    <input
                      type="text"
                      value={clienteData.lugarTrabajo}
                      onChange={(e) => setClienteData({...clienteData, lugarTrabajo: e.target.value})}
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
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de Cliente</label>
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
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
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Saldo Pendiente</label>
                    <input
                      type="number"
                      value={clienteData.saldoPendiente}
                      disabled
                      className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                        isLight ? "bg-gray-100 border-gray-200 text-gray-500" : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="flex justify-end">
                <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </button>
              </div>
            </div>
          )}

          {activeSubTab === "documentos-cliente" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                  Documentos del Cliente
                </h3>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  Subir Documento
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className={`rounded-lg p-4 border ${
                      isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {doc.tipo.includes('cedula') && <IdCard className="w-6 h-6 text-primary" />}
                        {doc.tipo === 'papeleta-votacion' && <Vote className="w-6 h-6 text-primary" />}
                        {doc.tipo === 'domicilio' && <HomeIcon className="w-6 h-6 text-primary" />}
                        {doc.tipo === 'foto-cliente' && <Camera className="w-6 h-6 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                          {doc.nombre}
                        </h4>
                        <p className="text-xs text-gray-400 mb-2">{doc.archivo}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(doc.fechaSubida).toLocaleDateString('es-EC')}
                          <span>•</span>
                          <span>{doc.tamano}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-white/10">
                      <button
                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isLight 
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-700" 
                            : "bg-white/5 hover:bg-white/10 text-white"
                        }`}
                      >
                        <Eye className="w-3 h-3 inline mr-1" />
                        Ver
                      </button>
                      <button
                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isLight 
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-700" 
                            : "bg-white/5 hover:bg-white/10 text-white"
                        }`}
                      >
                        <Download className="w-3 h-3 inline mr-1" />
                        Descargar
                      </button>
                      <button
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight 
                            ? "hover:bg-red-50 text-red-600" 
                            : "hover:bg-red-500/10 text-red-400"
                        }`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Card para agregar nuevo documento */}
                <div
                  className={`rounded-lg p-4 border-2 border-dashed cursor-pointer transition-all hover:border-primary ${
                    isLight ? "border-gray-300 bg-gray-50 hover:bg-white" : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="h-full flex flex-col items-center justify-center gap-3 min-h-[160px]">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        Subir nuevo documento
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click para seleccionar archivo
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "garantes-credito" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                  Garantes y Límite de Crédito
                </h3>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  Agregar Garante
                </button>
              </div>

              {/* Información de Crédito */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <CreditCard className="w-4 h-4 text-primary" />
                  Información de Crédito
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Límite de Crédito</label>
                    <div className={`text-2xl font-bold font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${clienteData.limiteCredito.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Saldo Pendiente</label>
                    <div className={`text-2xl font-bold font-mono ${clienteData.saldoPendiente > 0 ? "text-red-500" : "text-green-500"}`}>
                      ${clienteData.saldoPendiente.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Crédito Disponible</label>
                    <div className={`text-2xl font-bold font-mono text-green-500`}>
                      ${(clienteData.limiteCredito - clienteData.saldoPendiente).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Garantes */}
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
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingresos</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                      {garantes.map((garante) => (
                        <tr 
                          key={garante.id}
                          className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                        >
                          <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            {garante.nombre}
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
                          <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                            ${garante.ingresosMensuales.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight 
                                    ? "hover:bg-gray-100 text-gray-600" 
                                    : "hover:bg-white/5 text-gray-400"
                                }`}
                                title="Editar"
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
            </div>
          )}

          {activeSubTab === "historial-cliente" && (
            <div className="space-y-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Historial de Compras del Cliente
              </h3>

              <div className={`border rounded-lg overflow-hidden ${
                isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Factura</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Productos</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                      {compras.map((compra) => (
                        <tr 
                          key={compra.id}
                          className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                        >
                          <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {new Date(compra.fecha).toLocaleDateString('es-EC')}
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-sm font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                            {compra.factura}
                          </td>
                          <td className={`px-4 py-3 text-sm text-center ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            {compra.productos}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-mono font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                            ${compra.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getEstadoBadge(compra.estado).style}`}>
                              {getEstadoBadge(compra.estado).name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight 
                                    ? "hover:bg-gray-100 text-gray-600" 
                                    : "hover:bg-white/5 text-gray-400"
                                }`}
                                title="Ver factura"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight 
                                    ? "hover:bg-gray-100 text-gray-600" 
                                    : "hover:bg-white/5 text-gray-400"
                                }`}
                                title="Descargar"
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

          {activeSubTab === "deudas-cliente" && (
            <div className="space-y-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Deudas Pendientes
              </h3>

              {/* Resumen de Deudas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Total Deudas</p>
                      <p className={`text-xl font-bold font-mono text-red-500`}>
                        $1,200.00
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Facturas Pendientes</p>
                      <p className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        1
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-card border-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Crédito Disponible</p>
                      <p className={`text-xl font-bold font-mono text-green-500`}>
                        $3,800.00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`border rounded-lg overflow-hidden ${
                isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
              }`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Factura</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Emisión</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vencimiento</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto Original</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Pendiente</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Días Vencidos</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                      {deudas.map((deuda) => (
                        <tr 
                          key={deuda.id}
                          className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                        >
                          <td className={`px-4 py-3 text-sm font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                            {deuda.factura}
                          </td>
                          <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            {new Date(deuda.fechaEmision).toLocaleDateString('es-EC')}
                          </td>
                          <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            {new Date(deuda.fechaVencimiento).toLocaleDateString('es-EC')}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                            ${deuda.montoOriginal.toFixed(2)}
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-mono font-semibold ${deuda.montoPendiente > 0 ? "text-red-500" : "text-green-500"}`}>
                            ${deuda.montoPendiente.toFixed(2)}
                          </td>
                          <td className={`px-4 py-3 text-sm text-center ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            {deuda.diasVencidos > 0 ? deuda.diasVencidos : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getEstadoBadge(deuda.estado).style}`}>
                              {getEstadoBadge(deuda.estado).name}
                            </span>
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
  );
}