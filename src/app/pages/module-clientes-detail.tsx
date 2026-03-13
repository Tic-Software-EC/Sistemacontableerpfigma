import { useState } from "react";
import { useNavigate } from "react-router";
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
  ShoppingBag,
  FileText,
  CreditCard,
  Plus,
  Upload,
  Download,
  Eye,
  Trash2,
  Calendar,
  IdCard,
  Vote,
  Camera,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { ClienteDetalladoForm } from "../components/cliente-detallado-form";
import { CrearClienteForm } from "../components/crear-cliente-form";

type Tab = "inicio" | "datos-generales" | "cliente-detallado" | "crear-cliente";

interface Cliente {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  fechaNacimiento: string;
  fechaRegistro: string;
  estado: "activo" | "inactivo";
  tipo: "regular" | "vip" | "mayorista";
  limiteCredito: number;
  saldoPendiente: number;
  foto?: string;
}

export function ModuleClientesDetail() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const [activeTab, setActiveTab] = useState<Tab>("inicio");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");

  // Datos de ejemplo
  const clientes: Cliente[] = [
    {
      id: "1",
      cedula: "0912345678",
      nombre: "Juan Carlos",
      apellido: "Pérez Morales",
      email: "juan.perez@email.com",
      telefono: "0987654321",
      direccion: "Av. Principal 123 y Calle Secundaria",
      ciudad: "Guayaquil",
      fechaNacimiento: "1985-03-15",
      fechaRegistro: "2023-01-10",
      estado: "activo",
      tipo: "vip",
      limiteCredito: 5000,
      saldoPendiente: 1200,
    },
    {
      id: "2",
      cedula: "0923456789",
      nombre: "María Fernanda",
      apellido: "González Castro",
      email: "maria.gonzalez@email.com",
      telefono: "0998765432",
      direccion: "Calle Las Flores 456",
      ciudad: "Quito",
      fechaNacimiento: "1990-07-22",
      fechaRegistro: "2023-03-20",
      estado: "activo",
      tipo: "regular",
      limiteCredito: 2000,
      saldoPendiente: 0,
    },
    {
      id: "3",
      cedula: "0934567890",
      nombre: "Roberto",
      apellido: "Loor Zamora",
      email: "roberto.loor@email.com",
      telefono: "0976543210",
      direccion: "Av. Central 789",
      ciudad: "Cuenca",
      fechaNacimiento: "1978-11-05",
      fechaRegistro: "2022-08-15",
      estado: "activo",
      tipo: "mayorista",
      limiteCredito: 10000,
      saldoPendiente: 3500,
    },
  ];

  const getTipoClienteBadge = (tipo: string) => {
    const styles = {
      regular: "bg-gray-100 text-gray-700 border border-gray-300",
      vip: "bg-[#3d2817] text-[#E8692E] border border-[#E8692E]/40",
      mayorista: "bg-[#0d3d4a] text-cyan-400 border border-cyan-500/40",
    };
    const names = {
      regular: "Regular",
      vip: "VIP",
      mayorista: "Mayorista",
    };
    return { style: styles[tipo as keyof typeof styles], name: names[tipo as keyof typeof names] };
  };

  const getEstadoBadge = (estado: string) => {
    const styles = {
      activo: "bg-green-500/10 text-green-400 border border-green-500/40",
      inactivo: "bg-gray-700 text-gray-400 border border-gray-600",
    };
    const names = {
      activo: "Activo",
      inactivo: "Inactivo",
    };
    return { style: styles[estado as keyof typeof styles], name: names[estado as keyof typeof names] };
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.cedula.includes(searchTerm) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || cliente.tipo === filterTipo;
    const matchesEstado = filterEstado === "all" || cliente.estado === filterEstado;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  return (
    <div className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-secondary"}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${
                isLight 
                  ? "hover:bg-gray-100 text-gray-700" 
                  : "hover:bg-white/5 text-white"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                  Módulo de Clientes
                </h1>
                <p className="text-xs text-gray-400">Gestión completa de clientes</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isLight 
                  ? "hover:bg-gray-100 text-gray-700" 
                  : "hover:bg-white/5 text-white"
              }`}
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 px-6 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <button
            onClick={() => setActiveTab("inicio")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "inicio"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <Home className="w-4 h-4" />
            Inicio
          </button>
          <button
            onClick={() => setActiveTab("datos-generales")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "datos-generales"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <User className="w-4 h-4" />
            Datos Generales
          </button>
          <button
            onClick={() => setActiveTab("cliente-detallado")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "cliente-detallado"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Ficha del Cliente
          </button>
          <button
            onClick={() => setActiveTab("crear-cliente")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "crear-cliente"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Crear Cliente
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {activeTab === "inicio" && (
          <>
            {/* Hero Section */}
            <div className={`rounded-2xl p-12 mb-8 text-center ${
              isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
            }`}>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className={`text-3xl font-bold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                Módulo de Clientes
              </h2>
              <p className={`text-sm max-w-2xl mx-auto ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Sistema completo para la gestión de clientes, historial de compras, documentación digital
                y administración de créditos con seguimiento detallado por cliente
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Datos Generales */}
              <div
                onClick={() => setActiveTab("datos-generales")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Datos Generales
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Información personal y de contacto de clientes
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Registro completo de datos personales
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Clasificación por tipo de cliente
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Gestión de límites de crédito
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Ficha del Cliente */}
              <div
                onClick={() => setActiveTab("cliente-detallado")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Ficha del Cliente
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Búsqueda y consulta completa de información del cliente
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Buscador inteligente de clientes
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Documentos y garantes
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Historial de compras y deudas
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Crear Cliente */}
              <div
                onClick={() => setActiveTab("crear-cliente")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Crear Cliente
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Registro completo de nuevos clientes
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Formulario completo de datos
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Subida de documentos
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Configuración de garantes y crédito
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "datos-generales" && (
          <div className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-wrap gap-3">
              {/* Buscador */}
              <div className="flex-1 min-w-[300px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, cédula o email..."
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                      : "bg-white/5 border-white/10 text-white placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Filtro Tipo */}
              <div className="relative flex items-center">
                <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className={`pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 appearance-none ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-700"
                      : "bg-secondary border-white/10 text-white"
                  }`}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="mayorista">Mayorista</option>
                </select>
                <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              </div>

              {/* Filtro Estado */}
              <div className="relative flex items-center">
                <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className={`pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 appearance-none ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-700"
                      : "bg-secondary border-white/10 text-white"
                  }`}
                >
                  <option value="all">Todos los estados</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              </div>
            </div>

            {/* Tabla de Clientes */}
            <div className={`border rounded-lg overflow-hidden ${
              isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cédula</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Apellido</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ciudad</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Límite Crédito</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Saldo Pendiente</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                    {filteredClientes.map((cliente) => (
                      <tr 
                        key={cliente.id}
                        className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                      >
                        <td className={`px-4 py-3 text-sm font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                          {cliente.cedula}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                          {cliente.nombre}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                          {cliente.apellido}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          {cliente.email}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          {cliente.telefono}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          {cliente.ciudad}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getTipoClienteBadge(cliente.tipo).style}`}>
                            {getTipoClienteBadge(cliente.tipo).name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getEstadoBadge(cliente.estado).style}`}>
                            {getEstadoBadge(cliente.estado).name}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                          ${cliente.limiteCredito.toFixed(2)}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-mono ${cliente.saldoPendiente > 0 ? "text-red-500" : "text-green-500"}`}>
                          ${cliente.saldoPendiente.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "cliente-detallado" && (
          <div className="space-y-4">
            <ClienteDetalladoForm theme={theme} />
          </div>
        )}

        {activeTab === "crear-cliente" && (
          <div className="space-y-4">
            <CrearClienteForm theme={theme} />
          </div>
        )}
      </main>
    </div>
  );
}