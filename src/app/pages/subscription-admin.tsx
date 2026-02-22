import { useState } from "react"; 
import { useNavigate } from "react-router";
import {
  Building2,
  Users,
  Plus,
  Search,
  Settings,
  LogOut,
  CreditCard,
  Check,
  AlertCircle,
  Menu,
  Package,
  Eye,
  Edit,
  Trash2,
  X,
  Mail,
  Phone,
  Calendar,
  Save,
  Image as ImageIcon,
  Palette,
  Upload,
  Copy,
  CheckCircle2,
  Key,
  Lock,
  RefreshCw,
} from "lucide-react";
import { AdminNavigation } from "../components/admin-navigation";
import { Pagination } from "../components/pagination";
import { CompanyLogoUpload } from "../components/company-logo-upload";
import { PLAN_CONFIGS, type PlanConfig } from "../config/plans";
import { ProfileModal } from "../components/profile-modal";

interface Company {
  id: string;
  name: string;
  ruc: string;
  email: string;
  phone: string;
  plan: "free" | "standard" | "custom";
  status: "active" | "trial" | "suspended" | "expired";
  users: number;
  maxUsers: number;
  maxBranches: number;
  maxCashRegisters: number;
  admin: string;
  adminEmail: string;
  createdAt: string;
  expiresAt: string;
  monthlyPrice: number;
  nextPayment: string;
  autoRenewal: boolean;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

interface CredentialsData {
  email: string;
  password: string;
  companyName: string;
  adminName: string;
}

export default function SubscriptionAdminPage() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"all" | "free" | "standard" | "custom">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "trial" | "suspended" | "expired">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Estado para perfil de usuario
  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador",
    avatar: "",
  });

  // Paleta de colores predefinidos
  const predefinedColors = [
    "#4A90E2", // Azul
    "#10B981", // Verde
    "#F97316", // Naranja
    "#A855F7", // Púrpura
    "#EC4899", // Rosa
    "#06B6D4", // Cyan
    "#EF4444", // Rojo
    "#F59E0B", // Amarillo
    "#6366F1", // Índigo
    "#14B8A6", // Teal
    "#84CC16", // Lima
    "#8B5CF6", // Violeta
  ];

  // Estados para modales
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState<CredentialsData | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [logoError, setLogoError] = useState<string>("");

  // Función para generar contraseña segura
  const generateSecurePassword = (): string => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let password = "";
    
    // Asegurar al menos un carácter de cada tipo
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%&*"[Math.floor(Math.random() * 7)];
    
    // Completar el resto de la contraseña
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Mezclar los caracteres
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Función para copiar al portapapeles
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Función para manejar la subida del logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError("");
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setLogoError("Formato no válido. Solo JPG, PNG, GIF o SVG");
      return;
    }
    
    // Validar tamaño (2MB máximo)
    const maxSize = 2 * 1024 * 1024; // 2MB en bytes
    if (file.size > maxSize) {
      setLogoError("El archivo es muy grande. Tamaño máximo: 2MB");
      return;
    }

    // Crear URL temporal para preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result as string });
      setLogoError("");
    };
    reader.readAsDataURL(file);
  };

  // Estados para formulario de nueva/editar empresa
  const [formData, setFormData] = useState({
    name: "",
    ruc: "",
    email: "",
    phone: "",
    plan: "standard" as "free" | "standard" | "custom",
    status: "active" as "active" | "trial" | "suspended" | "expired",
    maxUsers: PLAN_CONFIGS.standard.maxUsers,
    maxBranches: PLAN_CONFIGS.standard.maxBranches,
    maxCashRegisters: PLAN_CONFIGS.standard.maxCashRegisters,
    admin: "",
    adminEmail: "",
    adminPassword: "", // Nueva contraseña inicial opcional
    expiresAt: "",
    monthlyPrice: PLAN_CONFIGS.standard.price,
    nextPayment: "",
    autoRenewal: true,
    logo: "",
    primaryColor: "#E8692E",
    secondaryColor: "#0D1B2A",
  });

  // Función para manejar cambio de plan y actualizar valores automáticamente
  const handlePlanChange = (newPlan: "free" | "standard" | "custom") => {
    const planConfig = PLAN_CONFIGS[newPlan];
    setFormData({
      ...formData,
      plan: newPlan,
      maxUsers: planConfig.maxUsers,
      maxBranches: planConfig.maxBranches,
      maxCashRegisters: planConfig.maxCashRegisters,
      monthlyPrice: planConfig.price,
    });
  };

  // Datos de ejemplo de empresas
  const [companies] = useState<Company[]>([
    {
      id: "1",
      name: "TechCorp S.A.",
      ruc: "1792345678001",
      email: "contacto@techcorp.com",
      phone: "+593 99 123 4567",
      plan: "standard",
      status: "active",
      users: 5,
      maxUsers: 10,
      maxBranches: 5,
      maxCashRegisters: 3,
      admin: "Juan Pérez",
      adminEmail: "juan.perez@techcorp.com",
      createdAt: "2024-01-15",
      expiresAt: "2025-01-15",
      monthlyPrice: 99.00,
      nextPayment: "2024-03-15",
      autoRenewal: true,
    },
    {
      id: "2",
      name: "Innovatech Solutions",
      ruc: "1792876543001",
      email: "info@innovatech.com",
      phone: "+593 98 765 4321",
      plan: "custom",
      status: "active",
      users: 15,
      maxUsers: 50,
      maxBranches: 20,
      maxCashRegisters: 15,
      admin: "María González",
      adminEmail: "maria@innovatech.com",
      createdAt: "2023-11-20",
      expiresAt: "2025-11-20",
      monthlyPrice: 299.00,
      nextPayment: "2024-03-20",
      autoRenewal: true,
    },
    {
      id: "3",
      name: "StartupXYZ",
      ruc: "1792111222001",
      email: "admin@startupxyz.com",
      phone: "+593 99 888 7777",
      plan: "free",
      status: "trial",
      users: 1,
      maxUsers: 1,
      maxBranches: 1,
      maxCashRegisters: 1,
      admin: "Carlos Rodríguez",
      adminEmail: "carlos@startupxyz.com",
      createdAt: "2024-02-10",
      expiresAt: "2024-02-25",
      monthlyPrice: 0,
      nextPayment: "2024-02-25",
      autoRenewal: false,
    },
    {
      id: "4",
      name: "Comercial López & Asociados",
      ruc: "1792444555001",
      email: "info@lopezasoc.com",
      phone: "+593 99 456 7890",
      plan: "standard",
      status: "active",
      users: 7,
      maxUsers: 10,
      maxBranches: 8,
      maxCashRegisters: 5,
      admin: "Pedro López",
      adminEmail: "pedro@lopezasoc.com",
      createdAt: "2023-09-05",
      expiresAt: "2025-09-05",
      monthlyPrice: 99.00,
      nextPayment: "2024-03-05",
      autoRenewal: true,
    },
    {
      id: "5",
      name: "Distribuidora Nacional",
      ruc: "1792666777001",
      email: "ventas@distnac.com",
      phone: "+593 98 234 5678",
      plan: "custom",
      status: "active",
      users: 25,
      maxUsers: 50,
      maxBranches: 30,
      maxCashRegisters: 25,
      admin: "Ana Martínez",
      adminEmail: "ana.martinez@distnac.com",
      createdAt: "2023-06-12",
      expiresAt: "2025-06-12",
      monthlyPrice: 299.00,
      nextPayment: "2024-03-12",
      autoRenewal: true,
    },
    {
      id: "6",
      name: "Servicios TI Ecuador",
      ruc: "1792333888001",
      email: "contacto@stiect.com",
      phone: "+593 99 876 5432",
      plan: "standard",
      status: "suspended",
      users: 4,
      maxUsers: 10,
      maxBranches: 3,
      maxCashRegisters: 2,
      admin: "Roberto Silva",
      adminEmail: "roberto@stiect.com",
      createdAt: "2023-08-20",
      expiresAt: "2024-08-20",
      monthlyPrice: 99.00,
      nextPayment: "2024-08-20",
      autoRenewal: false,
    },
    {
      id: "7",
      name: "Consultores Empresariales",
      ruc: "1792999111001",
      email: "info@consempr.com",
      phone: "+593 98 111 2222",
      plan: "standard",
      status: "active",
      users: 6,
      maxUsers: 10,
      maxBranches: 4,
      maxCashRegisters: 3,
      admin: "Luisa Mendoza",
      adminEmail: "luisa@consempr.com",
      createdAt: "2024-01-08",
      expiresAt: "2025-01-08",
      monthlyPrice: 99.00,
      nextPayment: "2024-03-08",
      autoRenewal: true,
    },
    {
      id: "8",
      name: "Grupo Financiero Andino",
      ruc: "1792777888001",
      email: "contacto@gfandino.com",
      phone: "+593 99 333 4444",
      plan: "custom",
      status: "active",
      users: 30,
      maxUsers: 50,
      maxBranches: 40,
      maxCashRegisters: 35,
      admin: "Fernando Castro",
      adminEmail: "fernando@gfandino.com",
      createdAt: "2023-05-15",
      expiresAt: "2025-05-15",
      monthlyPrice: 399.00,
      nextPayment: "2024-03-15",
      autoRenewal: true,
    },
    {
      id: "9",
      name: "Logística Express",
      ruc: "1792555999001",
      email: "operaciones@logexpress.com",
      phone: "+593 98 555 6666",
      plan: "standard",
      status: "trial",
      users: 3,
      maxUsers: 5,
      maxBranches: 3,
      maxCashRegisters: 2,
      admin: "Gabriela Ruiz",
      adminEmail: "gabriela@logexpress.com",
      createdAt: "2024-02-12",
      expiresAt: "2024-02-27",
      monthlyPrice: 99.00,
      nextPayment: "2024-02-27",
      autoRenewal: false,
    },
    {
      id: "10",
      name: "Importadora del Pacífico",
      ruc: "1792222444001",
      email: "ventas@imppac.com",
      phone: "+593 99 777 8888",
      plan: "custom",
      status: "active",
      users: 18,
      maxUsers: 30,
      maxBranches: 15,
      maxCashRegisters: 12,
      admin: "Diego Morales",
      adminEmail: "diego@imppac.com",
      createdAt: "2023-10-10",
      expiresAt: "2025-10-10",
      monthlyPrice: 249.00,
      nextPayment: "2024-03-10",
      autoRenewal: true,
    },
    {
      id: "11",
      name: "Alimentos del Valle",
      ruc: "1792888999001",
      email: "info@alimvalle.com",
      phone: "+593 98 999 1111",
      plan: "standard",
      status: "expired",
      users: 5,
      maxUsers: 10,
      maxBranches: 5,
      maxCashRegisters: 4,
      admin: "Patricia Vega",
      adminEmail: "patricia@alimvalle.com",
      createdAt: "2022-11-20",
      expiresAt: "2024-01-20",
      monthlyPrice: 99.00,
      nextPayment: "2024-01-20",
      autoRenewal: false,
    },
    {
      id: "12",
      name: "Constructora del Sur",
      ruc: "1792123456001",
      email: "proyectos@consur.com",
      phone: "+593 99 123 9876",
      plan: "standard",
      status: "active",
      users: 8,
      maxUsers: 10,
      maxBranches: 6,
      maxCashRegisters: 4,
      admin: "Miguel Torres",
      adminEmail: "miguel@consur.com",
      createdAt: "2023-12-05",
      expiresAt: "2025-12-05",
      monthlyPrice: 99.00,
      nextPayment: "2024-03-05",
      autoRenewal: true,
    },
    {
      id: "13",
      name: "Textiles Ecuatorianos",
      ruc: "1792654321001",
      email: "ventas@textecu.com",
      phone: "+593 98 654 3210",
      plan: "free",
      status: "trial",
      users: 1,
      maxUsers: 1,
      maxBranches: 1,
      maxCashRegisters: 1,
      admin: "Sandra Jiménez",
      adminEmail: "sandra@textecu.com",
      createdAt: "2024-02-14",
      expiresAt: "2024-03-01",
      monthlyPrice: 0,
      nextPayment: "2024-03-01",
      autoRenewal: false,
    },
    {
      id: "14",
      name: "Farmacéutica Central",
      ruc: "1792147258001",
      email: "info@farmcentral.com",
      phone: "+593 99 147 2580",
      plan: "custom",
      status: "active",
      users: 22,
      maxUsers: 40,
      maxBranches: 25,
      maxCashRegisters: 20,
      admin: "Alberto Ramos",
      adminEmail: "alberto@farmcentral.com",
      createdAt: "2023-07-22",
      expiresAt: "2025-07-22",
      monthlyPrice: 349.00,
      nextPayment: "2024-03-22",
      autoRenewal: true,
    },
    {
      id: "15",
      name: "Automotriz Continental",
      ruc: "1792369258001",
      email: "contacto@autoconti.com",
      phone: "+593 98 369 2580",
      plan: "standard",
      status: "active",
      users: 9,
      maxUsers: 10,
      maxBranches: 7,
      maxCashRegisters: 5,
      admin: "Carolina Herrera",
      adminEmail: "carolina@autoconti.com",
      createdAt: "2024-01-25",
      expiresAt: "2025-01-25",
      monthlyPrice: 99.00,
      nextPayment: "2024-03-25",
      autoRenewal: true,
    },
  ]);

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      case "standard":
        return "bg-primary/20 text-primary border-primary/30";
      case "custom":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "trial":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "suspended":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "expired":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case "free":
        return "Free";
      case "standard":
        return "Standard";
      case "custom":
        return "Custom";
      default:
        return plan;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "trial":
        return "Prueba";
      case "suspended":
        return "Suspendido";
      case "expired":
        return "Expirado";
      default:
        return status;
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.ruc.includes(searchTerm) ||
      company.admin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = selectedPlan === "all" || company.plan === selectedPlan;
    const matchesStatus = selectedStatus === "all" || company.status === selectedStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Funciones para manejar cambios en filtros y paginación
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Funciones para manejar modales
  const handleOpenNewModal = () => {
    const defaultPlan = "standard";
    const planConfig = PLAN_CONFIGS[defaultPlan];
    setFormData({
      name: "",
      ruc: "",
      email: "",
      phone: "",
      plan: defaultPlan,
      status: "active",
      maxUsers: planConfig.maxUsers,
      maxBranches: planConfig.maxBranches,
      maxCashRegisters: planConfig.maxCashRegisters,
      admin: "",
      adminEmail: "",
      adminPassword: "",
      expiresAt: "",
      monthlyPrice: planConfig.price,
      nextPayment: "",
      autoRenewal: true,
      logo: "",
      primaryColor: "#E8692E",
      secondaryColor: "#0D1B2A",
    });
    setShowNewModal(true);
  };

  const handleOpenViewModal = (company: Company) => {
    setSelectedCompany(company);
    setShowViewModal(true);
  };

  const handleOpenEditModal = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      ruc: company.ruc,
      email: company.email,
      phone: company.phone,
      plan: company.plan,
      status: company.status,
      maxUsers: company.maxUsers,
      maxBranches: company.maxBranches,
      maxCashRegisters: company.maxCashRegisters,
      admin: company.admin,
      adminEmail: company.adminEmail,
      adminPassword: "",
      expiresAt: company.expiresAt,
      monthlyPrice: company.monthlyPrice,
      nextPayment: company.nextPayment,
      autoRenewal: company.autoRenewal,
      logo: company.logo || "",
      primaryColor: company.primaryColor || "#E8692E",
      secondaryColor: company.secondaryColor || "#0D1B2A",
    });
    setShowEditModal(true);
  };

  const handleSaveNewCompany = () => {
    // Generar contraseña si no se proporcionó una
    const finalPassword = formData.adminPassword.trim() || generateSecurePassword();
    
    // Guardar las credenciales generadas
    setGeneratedCredentials({
      email: formData.adminEmail,
      password: finalPassword,
      companyName: formData.name,
      adminName: formData.admin,
    });
    
    // Aquí iría la lógica para guardar la empresa en la base de datos
    console.log("Guardando nueva empresa:", formData);
    console.log("Credenciales generadas:", { email: formData.adminEmail, password: finalPassword });
    
    // Simular envío de email con las credenciales
    sendCredentialsEmail(formData.adminEmail, formData.name, formData.admin, finalPassword);
    
    // Cerrar modal de creación y mostrar modal de confirmación
    setShowNewModal(false);
    setShowCredentialsModal(true);
  };

  // Función para simular envío de email con credenciales
  const sendCredentialsEmail = (email: string, companyName: string, adminName: string, password: string) => {
    console.log("=== SIMULACIÓN DE ENVÍO DE EMAIL ===");
    console.log("Para:", email);
    console.log("Asunto: Bienvenido a TicSoftEc - Credenciales de Acceso");
    console.log("\n--- Contenido del Email ---");
    console.log(`Estimado/a ${adminName},\n`);
    console.log(`Bienvenido/a a TicSoftEc ERP. Su empresa "${companyName}" ha sido registrada exitosamente.\n`);
    console.log("Sus credenciales de acceso son:\n");
    console.log(`Usuario: ${email}`);
    console.log(`Contraseña temporal: ${password}\n`);
    console.log("Por seguridad, le recomendamos cambiar su contraseña en el primer inicio de sesión.\n");
    console.log("Si olvidó su contraseña, puede usar la opción 'Recuperar contraseña' en la página de inicio de sesión.\n");
    console.log("Saludos cordiales,");
    console.log("Equipo TicSoftEc");
    console.log("===================================\n");
    
    // En producción, aquí iría la llamada a una API de email
    // await sendEmail({ to: email, subject: '...', body: '...' });
  };

  // Función para reenviar credenciales
  const handleResendCredentials = (company: Company) => {
    const tempPassword = generateSecurePassword();
    
    // Aquí iría la lógica para actualizar la contraseña en la base de datos
    console.log("Generando nueva contraseña temporal para:", company.adminEmail);
    
    // Enviar email
    sendCredentialsEmail(company.adminEmail, company.name, company.admin, tempPassword);
    
    alert(`Se ha enviado un email con una nueva contraseña temporal a ${company.adminEmail}`);
  };

  const handleSaveEditCompany = () => {
    // Aquí iría la lógica para actualizar la empresa
    console.log("Actualizando empresa:", formData);
    setShowEditModal(false);
    alert("Empresa actualizada exitosamente");
  };

  const handleDeleteCompany = (companyName: string) => {
    if (confirm(`¿Está seguro que desea eliminar la empresa ${companyName}?`)) {
      // Aquí iría la lógica para eliminar
      alert("Empresa eliminada - En desarrollo");
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-secondary border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">TicSoftEc</h1>
                <p className="text-gray-400 text-xs">Administrador de Suscripciones</p>
              </div>
            </div>

            {/* Usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SA</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Super Admin</p>
                  <p className="text-gray-400 text-xs">Administrador</p>
                </div>
              </button>

              {/* Menú de usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#3a3f4f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm">Super Admin</p>
                    <p className="text-gray-400 text-xs">admin@ticsoftec.com</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Configuración</span>
                    </button>
                    <div className="border-t border-white/10 my-2"></div>
                    <button
                      onClick={() => navigate("/")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navegación entre secciones */}
      <div className="bg-secondary border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <AdminNavigation activeSection="companies" />
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header con estadísticas */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Gestión de Empresas
              </h2>
              <p className="text-gray-400">
                Administra las empresas y sus suscripciones
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenNewModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nueva Empresa
              </button>
            </div>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Empresas</p>
                  <p className="text-white text-2xl font-bold mt-1">{companies.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Activas</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {companies.filter((c) => c.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">En Prueba</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {companies.filter((c) => c.status === "trial").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Usuarios</p>
                  <p className="text-white text-2xl font-bold mt-1">
                    {companies.reduce((acc, c) => acc + c.users, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por empresa, RUC o administrador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filtro por plan */}
            <select
              value={selectedPlan}
              onChange={(e) => {
                setSelectedPlan(e.target.value as any);
                handleFilterChange();
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
            >
              <option value="all">Todos los planes</option>
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="custom">Custom</option>
            </select>

            {/* Filtro por estado */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as any);
                handleFilterChange();
              }}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="trial">Prueba</option>
              <option value="suspended">Suspendido</option>
              <option value="expired">Expirado</option>
            </select>
          </div>
        </div>

        {/* Tabla de empresas */}
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Administrador
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Usuarios
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Vigencia
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paginatedCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="text-white font-medium text-sm">{company.name}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-white text-sm">{company.admin}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getPlanBadgeColor(
                          company.plan
                        )}`}
                      >
                        {getPlanLabel(company.plan)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusBadgeColor(
                          company.status
                        )}`}
                      >
                        {getStatusLabel(company.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-gray-300 text-sm">
                        {company.users}/{company.maxUsers}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-white text-sm">{company.expiresAt}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenViewModal(company)}
                          className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(company)}
                          className="p-1.5 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResendCredentials(company)}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Enviar credenciales por correo"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCompany(company.name)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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

          {filteredCompanies.length === 0 && (
            <div className="py-12 text-center">
              <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No se encontraron empresas</p>
            </div>
          )}

          {/* Paginación */}
          {filteredCompanies.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCompanies.length}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </main>

      {/* Modal Ver Empresa - Diseño Compacto */}
      {showViewModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2530] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10">
              <div className="flex items-center gap-2.5">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-bold text-lg">Detalles de la Empresa</h3>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">Nombre de la Empresa</label>
                  <p className="text-white text-sm font-medium">{selectedCompany.name}</p>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">RUC</label>
                  <p className="text-white text-sm">{selectedCompany.ruc}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-white text-sm">{selectedCompany.email}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-medium mb-1">Teléfono</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-white text-sm">{selectedCompany.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-white font-medium mb-3">Administrador</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Nombre</label>
                    <p className="text-white text-sm">{selectedCompany.admin}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Email</label>
                    <p className="text-white text-sm">{selectedCompany.adminEmail}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-white font-medium mb-3">Suscripción</h4>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Plan</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getPlanBadgeColor(selectedCompany.plan)}`}>
                      {getPlanLabel(selectedCompany.plan)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Estado</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getStatusBadgeColor(selectedCompany.status)}`}>
                      {getStatusLabel(selectedCompany.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Usuarios</label>
                    <p className="text-white text-sm">{selectedCompany.users}/{selectedCompany.maxUsers}</p>
                  </div>
                </div>
                
                {/* Características del plan */}
                <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-gray-400 text-xs">Características del Plan {getPlanLabel(selectedCompany.plan)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Máx. Sucursales</label>
                      <p className="text-white text-sm font-medium">{selectedCompany.maxBranches}</p>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">Máx. Cajas</label>
                      <p className="text-white text-sm font-medium">{selectedCompany.maxCashRegisters}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Precio Mensual</label>
                    <p className="text-white text-sm font-medium">${selectedCompany.monthlyPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Próximo Pago</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-white text-sm">{selectedCompany.nextPayment}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Auto Renovación</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                      selectedCompany.autoRenewal 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                    }`}>
                      {selectedCompany.autoRenewal ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <h4 className="text-white font-medium mb-3">Fechas</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Fecha de Creación</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-white text-sm">{selectedCompany.createdAt}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1">Fecha de Expiración</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-white text-sm">{selectedCompany.expiresAt}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-[#1e2530]">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Empresa - Diseño Compacto */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2530] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-green-600/10 sticky top-0 z-10 bg-[#1e2530]">
              <div className="flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-bold text-lg">Registrar Nueva Empresa</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-white font-medium mb-3.5 flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" />
                  Información General
                </h4>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Nombre de la Empresa *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">RUC *</label>
                    <input
                      type="text"
                      value={formData.ruc}
                      onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="1792345678001"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="email@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Teléfono *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="+593 99 123 4567"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h4 className="text-white font-medium mb-3.5 flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  Administrador Principal
                </h4>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Nombre del Administrador *</label>
                    <input
                      type="text"
                      value={formData.admin}
                      onChange={(e) => setFormData({ ...formData, admin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Email del Administrador *</label>
                    <input
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="admin@empresa.com"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">
                      Contraseña Inicial (opcional)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.adminPassword}
                        onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                        placeholder="Dejar vacío para generar automáticamente"
                      />
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-[11px] mt-1">
                      Si no especifica una contraseña, se generará una automáticamente de forma segura
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h4 className="text-white font-medium mb-3.5 flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4" />
                  Configuración de Suscripción
                </h4>
                <div className="grid grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Plan *</label>
                    <select
                      value={formData.plan}
                      onChange={(e) => handlePlanChange(e.target.value as "free" | "standard" | "custom")}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="free">Free</option>
                      <option value="standard">Standard</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Estado *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "trial" | "suspended" | "expired" })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="active">Activo</option>
                      <option value="trial">Prueba</option>
                      <option value="suspended">Suspendido</option>
                      <option value="expired">Expirado</option>
                    </select>
                  </div>
                  <div></div>
                </div>

                {/* Información del plan seleccionado */}
                <div className="mt-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5">
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-medium mb-0.5 text-sm">
                        Características del Plan {PLAN_CONFIGS[formData.plan].displayName}
                      </h5>
                      <p className="text-gray-400 text-[11px]">
                        {PLAN_CONFIGS[formData.plan].description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400 text-xs">Usuarios</span>
                      </div>
                      <p className="text-white font-semibold text-lg">{formData.maxUsers}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-xs">Sucursales</span>
                      </div>
                      <p className="text-white font-semibold text-lg">{formData.maxBranches}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400 text-xs">Cajas</span>
                      </div>
                      <p className="text-white font-semibold text-lg">{formData.maxCashRegisters}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">💰</span>
                        <span className="text-gray-400 text-xs">Precio Mensual</span>
                      </div>
                      <p className="text-white font-semibold text-lg">
                        ${formData.monthlyPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Próximo Pago *</label>
                    <input
                      type="date"
                      value={formData.nextPayment}
                      onChange={(e) => setFormData({ ...formData, nextPayment: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Auto Renovación *</label>
                    <select
                      value={formData.autoRenewal ? "true" : "false"}
                      onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.value === "true" })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div></div>
                  <div className="col-span-3">
                    <label className="block text-gray-400 text-sm font-medium mb-2">Fecha de Expiración *</label>
                    <input
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Personalización
                </h4>
                <div className="space-y-4">
                  {/* Logo de la Empresa */}
                  <CompanyLogoUpload
                    logo={formData.logo}
                    logoError={logoError}
                    onLogoChange={(logo) => setFormData({ ...formData, logo })}
                    onErrorChange={setLogoError}
                    onFileSelect={handleLogoUpload}
                  />

                  {/* Color Primario */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Color Primario</label>
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, primaryColor: color })}
                          className={`h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                            formData.primaryColor === color ? "border-white shadow-lg" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2 items-center bg-[#2a2f3f] rounded-lg p-2">
                      <div 
                        className="w-10 h-10 rounded-lg border border-white/10"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
                        placeholder="#E8692E"
                      />
                    </div>
                  </div>

                  {/* Color Secundario */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Color Secundario</label>
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, secondaryColor: color })}
                          className={`h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                            formData.secondaryColor === color ? "border-white shadow-lg" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2 items-center bg-[#2a2f3f] rounded-lg p-2">
                      <div 
                        className="w-10 h-10 rounded-lg border border-white/10"
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
                        placeholder="#0D1B2A"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones del modal */}
            <div className="p-6 border-t border-white/10 bg-[#1a1f2c] flex justify-end gap-3 sticky bottom-0">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-5 py-2.5 text-gray-300 hover:text-white border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNewCompany}
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Crear Empresa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Empresa - Diseño Compacto */}
      {showEditModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2530] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-blue-600/10 sticky top-0 z-10 bg-[#1e2530]">
              <div className="flex items-center gap-2.5">
                <Edit className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-bold text-lg">Editar Empresa</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-white font-medium mb-3.5 flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" />
                  Información General
                </h4>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Nombre de la Empresa *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">RUC *</label>
                    <input
                      type="text"
                      value={formData.ruc}
                      onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="1792345678001"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="email@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Teléfono *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                      placeholder="+593 99 123 4567"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h4 className="text-white font-medium mb-3.5 flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4" />
                  Configuración de Suscripción
                </h4>
                <div className="grid grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Plan *</label>
                    <select
                      value={formData.plan}
                      onChange={(e) => handlePlanChange(e.target.value as "free" | "standard" | "custom")}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="free">Free</option>
                      <option value="standard">Standard</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-medium mb-1.5">Estado *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "trial" | "suspended" | "expired" })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2 text-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="active">Activo</option>
                      <option value="trial">Prueba</option>
                      <option value="suspended">Suspendido</option>
                      <option value="expired">Expirado</option>
                    </select>
                  </div>
                  <div></div>
                </div>

                {/* Información del plan seleccionado */}
                <div className="mt-3.5 bg-white/5 border border-white/10 rounded-xl p-3.5">
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-white font-medium mb-1">
                        Características del Plan {PLAN_CONFIGS[formData.plan].displayName}
                      </h5>
                      <p className="text-gray-400 text-xs">
                        {PLAN_CONFIGS[formData.plan].description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400 text-xs">Usuarios</span>
                      </div>
                      <p className="text-white font-semibold text-lg">{formData.maxUsers}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-green-400" />
                        <span className="text-gray-400 text-xs">Sucursales</span>
                      </div>
                      <p className="text-white font-semibold text-lg">{formData.maxBranches}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-400 text-xs">Cajas</span>
                      </div>
                      <p className="text-white font-semibold text-lg">{formData.maxCashRegisters}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">💰</span>
                        <span className="text-gray-400 text-xs">Precio Mensual</span>
                      </div>
                      <p className="text-white font-semibold text-lg">
                        ${formData.monthlyPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Próximo Pago *</label>
                    <input
                      type="date"
                      value={formData.nextPayment}
                      onChange={(e) => setFormData({ ...formData, nextPayment: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Auto Renovación *</label>
                    <select
                      value={formData.autoRenewal ? "true" : "false"}
                      onChange={(e) => setFormData({ ...formData, autoRenewal: e.target.value === "true" })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                    >
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div></div>
                  <div className="col-span-3">
                    <label className="block text-gray-400 text-sm font-medium mb-2">Fecha de Expiración *</label>
                    <input
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Personalización
                </h4>
                <div className="space-y-4">
                  {/* Logo de la Empresa */}
                  <CompanyLogoUpload
                    logo={formData.logo}
                    logoError={logoError}
                    onLogoChange={(logo) => setFormData({ ...formData, logo })}
                    onErrorChange={setLogoError}
                    onFileSelect={handleLogoUpload}
                  />

                  {/* Color Primario */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Color Primario</label>
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, primaryColor: color })}
                          className={`h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                            formData.primaryColor === color ? "border-white shadow-lg" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2 items-center bg-[#2a2f3f] rounded-lg p-2">
                      <div 
                        className="w-10 h-10 rounded-lg border border-white/10"
                        style={{ backgroundColor: formData.primaryColor }}
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
                        placeholder="#E8692E"
                      />
                      <span className="text-gray-500 text-xs">Color personalizado</span>
                    </div>
                  </div>

                  {/* Color Secundario */}
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Color Secundario</label>
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData({ ...formData, secondaryColor: color })}
                          className={`h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                            formData.secondaryColor === color ? "border-white shadow-lg" : "border-transparent"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2 items-center bg-[#2a2f3f] rounded-lg p-2">
                      <div 
                        className="w-10 h-10 rounded-lg border border-white/10"
                        style={{ backgroundColor: formData.secondaryColor }}
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
                        placeholder="#0D1B2A"
                      />
                      <span className="text-gray-500 text-xs">Color personalizado</span>
                    </div>
                  </div>

                  {/* Vista Previa */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-3">Vista Previa de Colores:</p>
                    <div className="flex gap-3">
                      <div className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-medium text-sm" style={{ backgroundColor: formData.primaryColor }}>
                        Color Primario
                      </div>
                      <div className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-medium text-sm border border-white/20" style={{ backgroundColor: formData.secondaryColor }}>
                        Color Secundario
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-[#1e2530] sticky bottom-0">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditCompany}
                disabled={!formData.name.trim() || !formData.ruc.trim() || !formData.email.trim() || !formData.admin.trim() || !formData.adminEmail.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  !formData.name.trim() || !formData.ruc.trim() || !formData.email.trim() || !formData.admin.trim() || !formData.adminEmail.trim()
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Credenciales Generadas - Diseño Compacto */}
      {showCredentialsModal && generatedCredentials && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2530] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-green-600/10">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="text-white font-bold text-lg">¡Empresa Creada Exitosamente!</h3>
                  <p className="text-gray-400 text-xs">Credenciales de acceso generadas</p>
                </div>
              </div>
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Información de la empresa */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-green-400" />
                  <h4 className="text-green-400 font-medium">Empresa: {generatedCredentials.companyName}</h4>
                </div>
                <p className="text-gray-300 text-sm">Administrador: {generatedCredentials.adminName}</p>
              </div>

              {/* Notificación de email enviado */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-medium text-sm mb-1">Email Enviado Exitosamente</p>
                  <p className="text-gray-300 text-xs mb-2">
                    Se han enviado las credenciales de acceso a: <span className="font-mono text-white">{generatedCredentials.email}</span>
                  </p>
                  <p className="text-gray-400 text-xs">
                    El administrador recibirá un email con su usuario y contraseña temporal para acceder al sistema.
                  </p>
                </div>
              </div>

              {/* Credenciales */}
              

              {/* Instrucciones */}
              
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-[#1e2530]">
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-gray-500 text-xs">
            TicSoftEc ERP v2.0 © 2024 - Panel de Administración de Empresas
          </p>
        </div>
      </footer>

      {/* Modal de Configuración de Perfil */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={(newProfile) => setUserProfile(newProfile)}
      />
    </div>
  );
}