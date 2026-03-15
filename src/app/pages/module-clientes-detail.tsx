import { useState } from "react";
import { useNavigate, useParams } from "react-router";
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
  Bell,
  Send,
  Mail,
  MessageSquare,
  X,
  Tag,
  Percent,
  Gift,
  Heart,
  Baby,
  Sparkles,
  Edit,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { ClienteDetalladoForm } from "../components/cliente-detallado-form";
import { CrearClienteForm } from "../components/crear-cliente-form";

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

interface Promocion {
  id: string;
  nombre: string;
  codigo: string;
  descuento: string;
  titulo: string;
  fecha: string;
  activa: boolean;
  icono: "gift" | "heart" | "user" | "baby" | "sparkles";
  descripcion?: string;
}

export function ModuleClientesDetail() {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  
  const validTabs = ["inicio", "datos-generales", "cliente-detallado", "crear-cliente", "promociones"];
  type TabType = typeof validTabs[number];
  const activeTab: TabType = validTabs.includes(params.tab as TabType) ? (params.tab as TabType) : "inicio";
  const setActiveTab = (tab: TabType) => {
    navigate(`/module-clientes-detail/${tab}`, { replace: true });
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [filterCalidad, setFilterCalidad] = useState<string>("all");
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [showPromoModal, setShowPromoModal] = useState(false);
  
  // Estados del modal de promoción
  const [promoSeleccionada, setPromoSeleccionada] = useState("");
  const [promoCanal, setPromoCanal] = useState<"email" | "sms" | "whatsapp">("email");

  // Estados para gestión de promociones
  const [promociones, setPromociones] = useState<Promocion[]>([
    { id: "navidad", nombre: "Navidad", codigo: "NAVIDAD2026", descuento: "25% OFF", titulo: "¡Feliz Navidad! Descuentos Especiales", fecha: "25 de Diciembre", activa: true, icono: "gift", descripcion: "Celebra esta Navidad con increíbles descuentos en toda nuestra línea de productos. Válido hasta fin de año." },
    { id: "madre", nombre: "Día de la Madre", codigo: "MAMA2026", descuento: "20% OFF", titulo: "¡Feliz Día de la Madre! Regalos Especiales", fecha: "2do domingo de Mayo", activa: true, icono: "heart", descripcion: "Homenajea a mamá con nuestros productos especiales. Un regalo perfecto para demostrar tu amor." },
    { id: "padre", nombre: "Día del Padre", codigo: "PAPA2026", descuento: "20% OFF", titulo: "¡Feliz Día del Padre! Ofertas para Papá", fecha: "3er domingo de Junio", activa: true, icono: "user", descripcion: "Los mejores regalos para papá con descuentos exclusivos. Demuestra tu cariño en su día especial." },
    { id: "nino", nombre: "Día del Niño", codigo: "NINOS2026", descuento: "30% OFF", titulo: "¡Feliz Día del Niño! Diversión y Descuentos", fecha: "1 de Junio", activa: false, icono: "baby", descripcion: "Diversión garantizada con nuestros productos para niños. Ofertas especiales que harán sonreír a los más pequeños." },
  ]);

  const [showCreatePromoModal, setShowCreatePromoModal] = useState(false);
  const [showEditPromoModal, setShowEditPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promocion | null>(null);

  // Estados del formulario de promoción
  const [promoForm, setPromoForm] = useState({
    nombre: "",
    codigo: "",
    descuento: "",
    titulo: "",
    fecha: "",
    icono: "sparkles" as "gift" | "heart" | "user" | "baby" | "sparkles",
    descripcion: "",
  });

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

  const getPromoIcon = (icono: string) => {
    switch (icono) {
      case "gift": return Gift;
      case "heart": return Heart;
      case "user": return User;
      case "baby": return Baby;
      case "sparkles": return Sparkles;
      default: return Gift;
    }
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.cedula.includes(searchTerm) ||
                         cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === "all" || cliente.tipo === filterTipo;
    const matchesEstado = filterEstado === "all" || cliente.estado === filterEstado;
    const matchesCalidad = 
      filterCalidad === "all" ||
      (filterCalidad === "buenos" && cliente.saldoPendiente === 0) ||
      (filterCalidad === "malos" && cliente.saldoPendiente > 0);
    return matchesSearch && matchesTipo && matchesEstado && matchesCalidad;
  });

  const toggleClienteSelection = (id: string) => {
    setSelectedClientes(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedClientes.length === filteredClientes.length) {
      setSelectedClientes([]);
    } else {
      setSelectedClientes(filteredClientes.map(c => c.id));
    }
  };

  const handleEnviarPromocion = () => {
    const promocion = promociones.find(p => p.id === promoSeleccionada);
    console.log("Enviando promoción a clientes:", selectedClientes);
    console.log("Promoción seleccionada:", promocion);
    console.log("Canal:", promoCanal);
    
    alert(`Promoción "${promocion?.nombre}" enviada a ${selectedClientes.length} cliente(s) vía ${promoCanal}`);
    
    setShowPromoModal(false);
    setSelectedClientes([]);
    setPromoSeleccionada("");
  };

  const handleCreatePromocion = () => {
    const newPromo: Promocion = {
      id: Date.now().toString(),
      nombre: promoForm.nombre,
      codigo: promoForm.codigo,
      descuento: promoForm.descuento,
      titulo: promoForm.titulo,
      fecha: promoForm.fecha,
      activa: true,
      icono: promoForm.icono,
      descripcion: promoForm.descripcion,
    };

    setPromociones([...promociones, newPromo]);
    setShowCreatePromoModal(false);
    resetPromoForm();
    alert(`Promoción "${newPromo.nombre}" creada exitosamente`);
  };

  const handleEditPromocion = () => {
    if (!editingPromo) return;

    const updatedPromos = promociones.map(p =>
      p.id === editingPromo.id
        ? {
            ...p,
            nombre: promoForm.nombre,
            codigo: promoForm.codigo,
            descuento: promoForm.descuento,
            titulo: promoForm.titulo,
            fecha: promoForm.fecha,
            icono: promoForm.icono,
            descripcion: promoForm.descripcion,
          }
        : p
    );

    setPromociones(updatedPromos);
    setShowEditPromoModal(false);
    setEditingPromo(null);
    resetPromoForm();
    alert(`Promoción "${promoForm.nombre}" actualizada exitosamente`);
  };

  const togglePromocionEstado = (id: string) => {
    const updatedPromos = promociones.map(p =>
      p.id === id ? { ...p, activa: !p.activa } : p
    );
    setPromociones(updatedPromos);
  };

  const openEditModal = (promo: Promocion) => {
    setEditingPromo(promo);
    setPromoForm({
      nombre: promo.nombre,
      codigo: promo.codigo,
      descuento: promo.descuento,
      titulo: promo.titulo,
      fecha: promo.fecha,
      icono: promo.icono,
      descripcion: promo.descripcion || "",
    });
    setShowEditPromoModal(true);
  };

  const openCreateModal = () => {
    resetPromoForm();
    setShowCreatePromoModal(true);
  };

  const resetPromoForm = () => {
    setPromoForm({
      nombre: "",
      codigo: "",
      descuento: "",
      titulo: "",
      fecha: "",
      icono: "sparkles",
      descripcion: "",
    });
  };

  return (
    <div className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-[#0D1B2A]"}`}>
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
                  Clientes
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
                  Vendedor • Matriz
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
            onClick={() => setActiveTab("datos-generales")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
              activeTab === "datos-generales"
                ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
            }`}
          >
            <User className={`w-4 h-4 ${activeTab === "datos-generales" ? "text-primary" : ""}`} />
            Mis Clientes
          </button>
          <button
            onClick={() => setActiveTab("cliente-detallado")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
              activeTab === "cliente-detallado"
                ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
            }`}
          >
            <UserCheck className={`w-4 h-4 ${activeTab === "cliente-detallado" ? "text-primary" : ""}`} />
            Ficha del Cliente
          </button>
          <button
            onClick={() => setActiveTab("crear-cliente")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
              activeTab === "crear-cliente"
                ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
            }`}
          >
            <UserPlus className={`w-4 h-4 ${activeTab === "crear-cliente" ? "text-primary" : ""}`} />
            Crear Cliente
          </button>
          <button
            onClick={() => setActiveTab("promociones")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
              activeTab === "promociones"
                ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-primary"}`
                : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300"}`
            }`}
          >
            <Gift className={`w-4 h-4 ${activeTab === "promociones" ? "text-primary" : ""}`} />
            Promociones
          </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {activeTab === "inicio" && (
          <>
            <div className={`mb-8 border rounded-xl p-8 text-center ${
              isLight 
                ? "bg-gradient-to-br from-blue-50 to-white border-blue-200" 
                : "bg-gradient-to-br from-blue-500/10 to-secondary border-blue-500/20"
            }`}>
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-9 h-9 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>Módulo de Clientes</h2>
              <p className={`text-sm max-w-2xl mx-auto ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}>
                Sistema completo para la gestión de clientes, historial de compras, documentación digital,
                administración de créditos y marketing promocional con envío masivo personalizado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              <div
                onClick={() => setActiveTab("promociones")}
                className={`rounded-xl p-6 border cursor-pointer transition-all hover:shadow-lg ${
                  isLight 
                    ? "bg-white border-gray-200 hover:border-primary hover:shadow-primary/10" 
                    : "bg-card border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                      Promociones
                    </h3>
                    <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Marketing y campañas promocionales personalizadas
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Crear y editar promociones
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Envío masivo (Email/SMS/WhatsApp)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Check className={`w-3.5 h-3.5 ${isLight ? "text-green-600" : "text-green-500"}`} />
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          Segmentación de clientes
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
            {/* Botón Enviar Promoción - Siempre visible */}
            <div className={`p-4 rounded-lg border ${isLight ? "bg-purple-50 border-purple-200" : "bg-purple-500/10 border-purple-500/20"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 text-primary" />
                  <div>
                    <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      {selectedClientes.length > 0 
                        ? `${selectedClientes.length} cliente(s) seleccionado(s)` 
                        : "Ningún cliente seleccionado"}
                    </p>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {selectedClientes.length > 0 
                        ? "Envía promociones por Email, SMS o WhatsApp" 
                        : "Selecciona clientes para enviar promociones"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPromoModal(true)}
                  disabled={selectedClientes.length === 0}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedClientes.length > 0
                      ? "bg-primary text-white hover:bg-primary/90"
                      : isLight
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white/10 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Enviar Promoción
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
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

              <div className="relative flex items-center">
                <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <select
                  value={filterCalidad}
                  onChange={(e) => setFilterCalidad(e.target.value)}
                  className={`pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 appearance-none ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-700"
                      : "bg-secondary border-white/10 text-white"
                  }`}
                >
                  <option value="all">Todos los clientes</option>
                  <option value="buenos">Buenos Clientes</option>
                  <option value="malos">Malos Clientes</option>
                </select>
                <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              </div>
            </div>

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
                          checked={filteredClientes.length > 0 && selectedClientes.length === filteredClientes.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cédula</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Apellido</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                    {filteredClientes.map((cliente) => (
                      <tr 
                        key={cliente.id}
                        className={`transition-colors ${
                          selectedClientes.includes(cliente.id)
                            ? isLight ? "bg-primary/5" : "bg-primary/10"
                            : isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedClientes.includes(cliente.id)}
                            onChange={() => toggleClienteSelection(cliente.id)}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          />
                        </td>
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
                        <td className={`px-4 py-3 text-sm text-right font-mono ${cliente.saldoPendiente > 0 ? "text-red-500" : "text-green-500"}`}>
                          ${cliente.saldoPendiente.toFixed(2)}
                          {cliente.saldoPendiente === 0 && (
                            <span className="ml-2 text-xs text-green-500">✓</span>
                          )}
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

        {activeTab === "promociones" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button 
                onClick={openCreateModal}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nueva Promoción Personalizada
              </button>
            </div>

            <div className={`border rounded-lg overflow-hidden ${
              isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Festividad</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descuento</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                    {promociones.map((promo) => {
                      const IconComponent = getPromoIcon(promo.icono);
                      return (
                        <tr key={promo.id} className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isLight ? "bg-gray-100" : "bg-white/5"
                              }`}>
                                <IconComponent className={`w-5 h-5 ${isLight ? "text-gray-600" : "text-gray-400"}`} />
                              </div>
                              <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                                {promo.nombre}
                              </span>
                            </div>
                          </td>
                          <td className={`px-4 py-4 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            {promo.fecha}
                          </td>
                          <td className={`px-4 py-4 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            {promo.titulo}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                              isLight ? "bg-gray-100 text-gray-700" : "bg-white/5 text-gray-300"
                            }`}>
                              {promo.descuento}
                            </span>
                          </td>
                          <td className={`px-4 py-4 text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            {promo.codigo}
                          </td>
                          <td className="px-4 py-4">
                            <button 
                              onClick={() => togglePromocionEstado(promo.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                                promo.activa
                                  ? isLight 
                                    ? "bg-green-50 text-green-700 hover:bg-green-100" 
                                    : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                  : isLight 
                                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                              }`}
                            >
                              {promo.activa ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                              {promo.activa ? "Activa" : "Inactiva"}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openEditModal(promo)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                                }`}
                              >
                                <Edit className={`w-4 h-4 ${isLight ? "text-gray-600" : "text-gray-400"}`} />
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
      </main>

      {/* Modal de Enviar Promoción */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-xl shadow-2xl ${
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className={`flex items-center justify-between p-4 border-b ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}>
              <div>
                <h3 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Enviar Promoción
                </h3>
                <p className={`text-xs mt-0.5 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  {selectedClientes.length} cliente{selectedClientes.length !== 1 ? 's' : ''} seleccionado{selectedClientes.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowPromoModal(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Promoción
                </label>
                <div className="relative flex items-center">
                  <Gift className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  <select
                    value={promoSeleccionada}
                    onChange={(e) => setPromoSeleccionada(e.target.value)}
                    className={`w-full pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 appearance-none ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-700"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  >
                    <option value="">Seleccione una promoción</option>
                    {promociones.filter(p => p.activa).map((promo) => (
                      <option key={promo.id} value={promo.id}>
                        {promo.nombre} - {promo.descuento} ({promo.codigo})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Canal de Envío
                </label>
                <div className="relative flex items-center">
                  <Send className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  <select
                    value={promoCanal}
                    onChange={(e) => setPromoCanal(e.target.value as "email" | "sms" | "whatsapp")}
                    className={`w-full pl-9 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 appearance-none ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-700"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                  <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                </div>
              </div>

              {promoSeleccionada && (
                <div className={`p-3 rounded-lg border ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <p className={`text-xs font-semibold mb-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    VISTA PREVIA
                  </p>
                  <div className={`text-sm mb-1 font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {promociones.find(p => p.id === promoSeleccionada)?.titulo}
                  </div>
                  {promociones.find(p => p.id === promoSeleccionada)?.descripcion && (
                    <p className={`text-xs mb-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {promociones.find(p => p.id === promoSeleccionada)?.descripcion}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary/20 text-primary rounded text-xs font-bold">
                      {promociones.find(p => p.id === promoSeleccionada)?.descuento}
                    </span>
                    <span className={`text-xs font-mono ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {promociones.find(p => p.id === promoSeleccionada)?.codigo}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className={`flex gap-3 p-4 border-t ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}>
              <button
                onClick={() => setShowPromoModal(false)}
                className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  isLight
                    ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                    : "border-white/10 hover:bg-white/5 text-white"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleEnviarPromocion}
                disabled={!promoSeleccionada}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  !promoSeleccionada
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Crear Promoción */}
      {showCreatePromoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`max-w-lg w-full rounded-xl shadow-2xl ${
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className={`flex items-center justify-between p-4 border-b ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}>
              <h3 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Nueva Promoción Personalizada
              </h3>
              <button
                onClick={() => {
                  setShowCreatePromoModal(false);
                  resetPromoForm();
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={promoForm.nombre}
                    onChange={(e) => setPromoForm({ ...promoForm, nombre: e.target.value })}
                    placeholder="Ej: Black Friday"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    Código
                  </label>
                  <input
                    type="text"
                    value={promoForm.codigo}
                    onChange={(e) => setPromoForm({ ...promoForm, codigo: e.target.value.toUpperCase() })}
                    placeholder="Ej: BF2026"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 font-mono ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Título de la Promoción
                </label>
                <input
                  type="text"
                  value={promoForm.titulo}
                  onChange={(e) => setPromoForm({ ...promoForm, titulo: e.target.value })}
                  placeholder="Ej: ¡Mega Ofertas de Black Friday!"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-secondary border-white/10 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    Descuento
                  </label>
                  <input
                    type="text"
                    value={promoForm.descuento}
                    onChange={(e) => setPromoForm({ ...promoForm, descuento: e.target.value })}
                    placeholder="Ej: 50% OFF"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    Fecha
                  </label>
                  <input
                    type="text"
                    value={promoForm.fecha}
                    onChange={(e) => setPromoForm({ ...promoForm, fecha: e.target.value })}
                    placeholder="Ej: 29 de Noviembre"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Descripción Detallada
                </label>
                <textarea
                  value={promoForm.descripcion}
                  onChange={(e) => setPromoForm({ ...promoForm, descripcion: e.target.value })}
                  placeholder="Ej: Celebra esta temporada con increíbles descuentos en toda nuestra línea de productos..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 resize-none ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-secondary border-white/10 text-white"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Ícono
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: "gift", icon: Gift },
                    { value: "heart", icon: Heart },
                    { value: "user", icon: User },
                    { value: "baby", icon: Baby },
                    { value: "sparkles", icon: Sparkles },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setPromoForm({ ...promoForm, icono: value as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        promoForm.icono === value
                          ? "border-primary bg-primary/10"
                          : isLight
                          ? "border-gray-200 hover:border-gray-300"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto ${
                        promoForm.icono === value
                          ? "text-primary"
                          : isLight ? "text-gray-600" : "text-gray-400"
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`flex gap-3 p-4 border-t ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}>
              <button
                onClick={() => {
                  setShowCreatePromoModal(false);
                  resetPromoForm();
                }}
                className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  isLight
                    ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                    : "border-white/10 hover:bg-white/5 text-white"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreatePromocion}
                disabled={!promoForm.nombre || !promoForm.codigo || !promoForm.titulo || !promoForm.descuento || !promoForm.fecha}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !promoForm.nombre || !promoForm.codigo || !promoForm.titulo || !promoForm.descuento || !promoForm.fecha
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                Crear Promoción
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Promoción */}
      {showEditPromoModal && editingPromo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`max-w-lg w-full rounded-xl shadow-2xl ${
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className={`flex items-center justify-between p-4 border-b ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}>
              <h3 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Editar Promoción
              </h3>
              <button
                onClick={() => {
                  setShowEditPromoModal(false);
                  setEditingPromo(null);
                  resetPromoForm();
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={promoForm.nombre}
                    onChange={(e) => setPromoForm({ ...promoForm, nombre: e.target.value })}
                    placeholder="Ej: Black Friday"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    Código
                  </label>
                  <input
                    type="text"
                    value={promoForm.codigo}
                    onChange={(e) => setPromoForm({ ...promoForm, codigo: e.target.value.toUpperCase() })}
                    placeholder="Ej: BF2026"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 font-mono ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Título de la Promoción
                </label>
                <input
                  type="text"
                  value={promoForm.titulo}
                  onChange={(e) => setPromoForm({ ...promoForm, titulo: e.target.value })}
                  placeholder="Ej: ¡Mega Ofertas de Black Friday!"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-secondary border-white/10 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    Descuento
                  </label>
                  <input
                    type="text"
                    value={promoForm.descuento}
                    onChange={(e) => setPromoForm({ ...promoForm, descuento: e.target.value })}
                    placeholder="Ej: 50% OFF"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    Fecha
                  </label>
                  <input
                    type="text"
                    value={promoForm.fecha}
                    onChange={(e) => setPromoForm({ ...promoForm, fecha: e.target.value })}
                    placeholder="Ej: 29 de Noviembre"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-secondary border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Descripción Detallada
                </label>
                <textarea
                  value={promoForm.descripcion}
                  onChange={(e) => setPromoForm({ ...promoForm, descripcion: e.target.value })}
                  placeholder="Ej: Celebra esta temporada con increíbles descuentos en toda nuestra línea de productos..."
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary/50 resize-none ${
                    isLight
                      ? "bg-white border-gray-200 text-gray-900"
                      : "bg-secondary border-white/10 text-white"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Ícono
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { value: "gift", icon: Gift },
                    { value: "heart", icon: Heart },
                    { value: "user", icon: User },
                    { value: "baby", icon: Baby },
                    { value: "sparkles", icon: Sparkles },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setPromoForm({ ...promoForm, icono: value as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        promoForm.icono === value
                          ? "border-primary bg-primary/10"
                          : isLight
                          ? "border-gray-200 hover:border-gray-300"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto ${
                        promoForm.icono === value
                          ? "text-primary"
                          : isLight ? "text-gray-600" : "text-gray-400"
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={`flex gap-3 p-4 border-t ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}>
              <button
                onClick={() => {
                  setShowEditPromoModal(false);
                  setEditingPromo(null);
                  resetPromoForm();
                }}
                className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  isLight
                    ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                    : "border-white/10 hover:bg-white/5 text-white"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleEditPromocion}
                disabled={!promoForm.nombre || !promoForm.codigo || !promoForm.titulo || !promoForm.descuento || !promoForm.fecha}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !promoForm.nombre || !promoForm.codigo || !promoForm.titulo || !promoForm.descuento || !promoForm.fecha
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
