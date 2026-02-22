import { User, X, CheckCircle, Loader2, Search, FileText, Phone, Mail, MapPin, Camera, AlertTriangle, Upload, Image, PenTool, Users, Home, Briefcase, Calendar, Heart, Building2, IdCard } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface Customer {
  ruc: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  pendingBalance: number;
  lastPurchaseDate?: string;
  // Datos adicionales
  birthDate?: string;
  birthPlace?: string;
  civilStatus?: string;
  spouseName?: string; // Nombre del cónyuge
  occupation?: string;
  workplace?: string;
  workPhone?: string;
  // Ubicación geográfica
  country?: string;
  province?: string;
  canton?: string;
  parish?: string;
  neighborhood?: string;
  reference?: string;
  photo?: string;
  signature?: string;
  cedula?: string;
  papeletaVotacion?: string;
  planillaServicio?: string;
  fotoCasa?: string;
  consultaBuro?: string;
  // Garante
  guarantorName?: string;
  guarantorCedula?: string;
  guarantorPhone?: string;
  guarantorAddress?: string;
  guarantorRelationship?: string;
}

interface CreateCustomerModalProps {
  onConfirm: (customer: Customer) => void;
  onCancel: () => void;
  existingCustomers?: Customer[];
}

export function CreateCustomerModal({ onConfirm, onCancel, existingCustomers = [] }: CreateCustomerModalProps) {
  const [activeTab, setActiveTab] = useState<"basica" | "documentacion" | "garante">("basica");
  const [consultarRC, setConsultarRC] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [datosObtenidos, setDatosObtenidos] = useState(false);
  const [garanteEsCliente, setGaranteEsCliente] = useState(false);
  const [garanteSearchTerm, setGaranteSearchTerm] = useState("");
  const [showGaranteResults, setShowGaranteResults] = useState(false);
  const [filteredGarantes, setFilteredGarantes] = useState<Customer[]>([]);
  
  // Referencias para inputs de archivos
  const photoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const cedulaInputRef = useRef<HTMLInputElement>(null);
  const papeletaInputRef = useRef<HTMLInputElement>(null);
  const planillaInputRef = useRef<HTMLInputElement>(null);
  const fotoCasaInputRef = useRef<HTMLInputElement>(null);
  const consultaBuroInputRef = useRef<HTMLInputElement>(null);

  // Datos del formulario
  const [formData, setFormData] = useState({
    // Básicos
    ruc: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    birthDate: "",
    birthPlace: "",
    civilStatus: "Soltero/a",
    spouseName: "", // Nombre del cónyuge
    occupation: "",
    workplace: "",
    workPhone: "",
    // Ubicación geográfica
    country: "Ecuador",
    province: "",
    canton: "",
    parish: "",
    neighborhood: "",
    reference: "",
    // Documentación
    photo: "",
    signature: "",
    cedula: "",
    papeletaVotacion: "",
    planillaServicio: "",
    fotoCasa: "",
    consultaBuro: "",
    // Garante
    guarantorName: "",
    guarantorCedula: "",
    guarantorPhone: "",
    guarantorAddress: "",
    guarantorRelationship: "",
  });

  // Consultar Registro Civil cuando se ingresa la cédula y está marcado el checkbox
  const handleConsultarRegistroCivil = async () => {
    if (!formData.ruc || formData.ruc.length < 10) {
      toast.error("Ingrese un número de cédula/RUC válido (mínimo 10 dígitos)");
      return;
    }

    setIsSearching(true);

    // Simulación de llamada a API del Registro Civil
    setTimeout(() => {
      // Datos simulados basados en la cédula ingresada
      const datosMock = {
        name: formData.ruc.endsWith("1") ? "Juan Carlos Pérez García" :
              formData.ruc.endsWith("2") ? "María Fernanda López Rodríguez" :
              formData.ruc.endsWith("3") ? "Carlos Alberto Sánchez Morales" :
              formData.ruc.endsWith("4") ? "Ana Patricia González Herrera" :
              formData.ruc.endsWith("5") ? "José Luis Martínez Suárez" :
              "Roberto Antonio Mendoza Castillo",
        birthDate: "1985-05-15",
        birthPlace: "Quito, Pichincha",
        civilStatus: "Soltero/a",
      };

      setFormData(prev => ({ ...prev, ...datosMock }));
      setDatosObtenidos(true);
      setIsSearching(false);
      toast.success("Datos obtenidos del Registro Civil");
    }, 1500);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Si cambia la cédula, resetear el estado de datos obtenidos
    if (field === "ruc") {
      setDatosObtenidos(false);
    }
  };

  // Manejar carga de archivos
  const handleFileUpload = (field: keyof typeof formData, file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Buscar garante en clientes existentes
  const handleGaranteSearch = (searchTerm: string) => {
    setGaranteSearchTerm(searchTerm);
    
    if (searchTerm.trim().length > 0) {
      const filtered = existingCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.ruc.includes(searchTerm)
      );
      setFilteredGarantes(filtered);
      setShowGaranteResults(true);
    } else {
      setShowGaranteResults(false);
      setFilteredGarantes([]);
    }
  };

  // Seleccionar cliente como garante
  const handleSelectGarante = (customer: Customer) => {
    setFormData(prev => ({
      ...prev,
      guarantorName: customer.name,
      guarantorCedula: customer.ruc,
      guarantorPhone: customer.phone || "",
      guarantorAddress: customer.address || "",
    }));
    setGaranteSearchTerm("");
    setShowGaranteResults(false);
    toast.success(`Cliente ${customer.name} seleccionado como garante`);
  };

  const handleSubmit = () => {
    // Validaciones
    if (!formData.ruc || !formData.name) {
      toast.error("Cédula/RUC y Nombre son obligatorios");
      setActiveTab("basica");
      return;
    }

    if (formData.ruc.length < 10) {
      toast.error("La Cédula/RUC debe tener al menos 10 dígitos");
      setActiveTab("basica");
      return;
    }

    // Crear el nuevo cliente
    const newCustomer: Customer = {
      ruc: formData.ruc,
      name: formData.name,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      address: formData.address || undefined,
      birthDate: formData.birthDate || undefined,
      birthPlace: formData.birthPlace || undefined,
      civilStatus: formData.civilStatus || undefined,
      spouseName: formData.spouseName || undefined, // Nombre del cónyuge
      occupation: formData.occupation || undefined,
      workplace: formData.workplace || undefined,
      workPhone: formData.workPhone || undefined,
      // Ubicación geográfica
      country: formData.country || undefined,
      province: formData.province || undefined,
      canton: formData.canton || undefined,
      parish: formData.parish || undefined,
      neighborhood: formData.neighborhood || undefined,
      reference: formData.reference || undefined,
      photo: formData.photo || undefined,
      signature: formData.signature || undefined,
      cedula: formData.cedula || undefined,
      papeletaVotacion: formData.papeletaVotacion || undefined,
      planillaServicio: formData.planillaServicio || undefined,
      fotoCasa: formData.fotoCasa || undefined,
      consultaBuro: formData.consultaBuro || undefined,
      guarantorName: formData.guarantorName || undefined,
      guarantorCedula: formData.guarantorCedula || undefined,
      guarantorPhone: formData.guarantorPhone || undefined,
      guarantorAddress: formData.guarantorAddress || undefined,
      guarantorRelationship: formData.guarantorRelationship || undefined,
      totalPurchases: 0,
      pendingBalance: 0,
    };

    onConfirm(newCustomer);
    toast.success(`Cliente ${newCustomer.name} creado exitosamente`);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl bg-[#0D1B2A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-primary/10 border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Crear Nuevo Cliente
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Complete la información del cliente
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col h-full">
            {/* Banner de éxito si vino del Registro Civil */}
            {datosObtenidos && (
              <div className="mx-6 mt-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 font-bold text-sm mb-1">Datos obtenidos correctamente</p>
                    <p className="text-gray-400 text-xs">
                      Los datos básicos han sido cargados desde el Registro Civil. Complete los datos adicionales.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-white/10 px-6 mt-6">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("basica")}
                  className={`px-4 py-3 font-medium transition-all text-sm ${
                    activeTab === "basica"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Información Básica
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("documentacion")}
                  className={`px-4 py-3 font-medium transition-all text-sm ${
                    activeTab === "documentacion"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documentación
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("garante")}
                  className={`px-4 py-3 font-medium transition-all text-sm ${
                    activeTab === "garante"
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Datos del Garante
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Tab: Información Básica */}
              {activeTab === "basica" && (
                <div className="space-y-4">
                  {/* Checkbox para consultar Registro Civil */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consultarRC}
                        onChange={(e) => setConsultarRC(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-blue-500/50 bg-[#0f1825] text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-bold text-sm">Consultar Registro Civil</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          Marque esta opción para obtener automáticamente los datos del cliente desde el Registro Civil.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* SECCIÓN: DATOS DE IDENTIFICACIÓN */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <IdCard className="w-4 h-4 text-primary" />
                      Datos de Identificación
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Cédula/RUC */}
                      <div className="md:col-span-2">
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <IdCard className="w-3 h-3" />
                          Cédula / RUC <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.ruc}
                            onChange={(e) => handleInputChange("ruc", e.target.value.replace(/\D/g, ""))}
                            placeholder="0123456789"
                            maxLength={13}
                            className="flex-1 px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                          {consultarRC && (
                            <button
                              onClick={handleConsultarRegistroCivil}
                              disabled={isSearching || !formData.ruc || formData.ruc.length < 10}
                              className="px-4 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center gap-2 whitespace-nowrap"
                            >
                              {isSearching ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Consultando...
                                </>
                              ) : (
                                <>
                                  <Search className="w-4 h-4" />
                                  Consultar
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        {consultarRC && (
                          <p className="text-gray-500 text-xs mt-1">
                            Ingrese mínimo 10 dígitos y haga clic en "Consultar"
                          </p>
                        )}
                      </div>

                      {/* Nombre Completo */}
                      <div className="md:col-span-2">
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Nombre Completo <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Juan Carlos Pérez García"
                          disabled={datosObtenidos}
                          className={`w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                            datosObtenidos ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        />
                        {datosObtenidos && (
                          <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            Dato obtenido del Registro Civil
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN: DATOS PERSONALES */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Datos Personales
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Fecha de Nacimiento */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Fecha de Nacimiento
                        </label>
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => handleInputChange("birthDate", e.target.value)}
                          disabled={datosObtenidos}
                          className={`w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                            datosObtenidos ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>

                      {/* Lugar de Nacimiento */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Lugar de Nacimiento
                        </label>
                        <input
                          type="text"
                          value={formData.birthPlace}
                          onChange={(e) => handleInputChange("birthPlace", e.target.value)}
                          placeholder="Quito, Pichincha"
                          disabled={datosObtenidos}
                          className={`w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                            datosObtenidos ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>

                      {/* Estado Civil */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          Estado Civil
                        </label>
                        <select
                          value={formData.civilStatus}
                          onChange={(e) => handleInputChange("civilStatus", e.target.value)}
                          disabled={datosObtenidos}
                          className={`w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                            datosObtenidos ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                        >
                          <option value="Soltero/a">Soltero/a</option>
                          <option value="Casado/a">Casado/a</option>
                          <option value="Divorciado/a">Divorciado/a</option>
                          <option value="Viudo/a">Viudo/a</option>
                          <option value="Unión Libre">Unión Libre</option>
                        </select>
                      </div>

                      {/* Nombre del Cónyuge - Solo si está casado o en unión libre */}
                      {(formData.civilStatus === "Casado/a" || formData.civilStatus === "Unión Libre") && (
                        <div>
                          <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Nombre del Cónyuge / Pareja
                          </label>
                          <input
                            type="text"
                            value={formData.spouseName}
                            onChange={(e) => handleInputChange("spouseName", e.target.value)}
                            placeholder="Nombre completo del cónyuge o pareja"
                            className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SECCIÓN: DATOS DE CONTACTO */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Datos de Contacto
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Teléfono */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Teléfono
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="0991234567"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="cliente@email.com"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN: DATOS LABORALES */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Datos Laborales
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Ocupación */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          Ocupación
                        </label>
                        <input
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => handleInputChange("occupation", e.target.value)}
                          placeholder="Ingeniero de Software"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Lugar de Trabajo */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          Lugar de Trabajo
                        </label>
                        <input
                          type="text"
                          value={formData.workplace}
                          onChange={(e) => handleInputChange("workplace", e.target.value)}
                          placeholder="TechCorp S.A."
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Teléfono Trabajo */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          Teléfono de Trabajo
                        </label>
                        <input
                          type="text"
                          value={formData.workPhone}
                          onChange={(e) => handleInputChange("workPhone", e.target.value)}
                          placeholder="022345678"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECCIÓN: UBICACIÓN GEOGRÁFICA */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Ubicación Geográfica
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Provincia */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Provincia
                        </label>
                        <input
                          type="text"
                          value={formData.province}
                          onChange={(e) => handleInputChange("province", e.target.value)}
                          placeholder="Pichincha"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Canton */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Cantón
                        </label>
                        <input
                          type="text"
                          value={formData.canton}
                          onChange={(e) => handleInputChange("canton", e.target.value)}
                          placeholder="Quito"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Parroquia */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Parroquia
                        </label>
                        <input
                          type="text"
                          value={formData.parish}
                          onChange={(e) => handleInputChange("parish", e.target.value)}
                          placeholder="Iñaquito"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Barrio */}
                      <div>
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <Home className="w-3 h-3" />
                          Barrio
                        </label>
                        <input
                          type="text"
                          value={formData.neighborhood}
                          onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                          placeholder="La Carolina"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Dirección */}
                      <div className="md:col-span-2">
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Dirección Completa
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Av. 6 de Diciembre N34-145 y Whymper"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Referencia */}
                      <div className="md:col-span-2">
                        <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Referencia
                        </label>
                        <input
                          type="text"
                          value={formData.reference}
                          onChange={(e) => handleInputChange("reference", e.target.value)}
                          placeholder="Edificio color azul junto a la gasolinera"
                          className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Documentación */}
              {activeTab === "documentacion" && (
                <div className="space-y-4">
                  {/* Foto del Cliente */}
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-3">
                    <label className="text-gray-400 text-xs mb-2 block font-medium flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-primary" />
                      Foto del Cliente
                    </label>
                    <div className="flex gap-3 items-center">
                      {formData.photo ? (
                        <div className="relative">
                          <img
                            src={formData.photo}
                            alt="Foto del cliente"
                            className="w-16 h-16 object-cover rounded-lg border-2 border-primary/50"
                          />
                          <button
                            onClick={() => handleInputChange("photo", "")}
                            className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-white/5 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center">
                          <Camera className="w-5 h-5 text-gray-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload("photo", e.target.files[0])}
                          className="hidden"
                        />
                        <button
                          onClick={() => photoInputRef.current?.click()}
                          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-1.5 text-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Cargar Foto
                        </button>
                        <p className="text-gray-500 text-[10px] mt-1">
                          JPG, PNG - Máx. 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid de Documentos - 2 columnas */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Firma del Cliente */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-white text-xs mb-2 block font-bold flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5 text-primary" />
                        Firma
                      </label>
                      <div className="space-y-2">
                        {formData.signature ? (
                          <div className="relative">
                            <img
                              src={formData.signature}
                              alt="Firma del cliente"
                              className="w-full h-20 object-contain bg-white rounded-lg border border-primary/30 p-1.5"
                            />
                            <button
                              onClick={() => handleInputChange("signature", "")}
                              className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-20 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1">
                            <PenTool className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-500 text-[10px]">Sin firma</span>
                          </div>
                        )}
                        <input
                          ref={signatureInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload("signature", e.target.files[0])}
                          className="hidden"
                        />
                        <button
                          onClick={() => signatureInputRef.current?.click()}
                          className="w-full px-2 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {formData.signature ? "Cambiar" : "Cargar"}
                        </button>
                        <p className="text-gray-500 text-[10px] text-center">
                          Escanee la firma
                        </p>
                      </div>
                    </div>

                    {/* Cédula */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-white text-xs mb-2 block font-bold flex items-center gap-1.5">
                        <IdCard className="w-3.5 h-3.5 text-primary" />
                        Cédula
                      </label>
                      <div className="space-y-2">
                        {formData.cedula ? (
                          <div className="relative">
                            <img
                              src={formData.cedula}
                              alt="Cédula"
                              className="w-full h-20 object-cover rounded-lg border border-primary/30"
                            />
                            <button
                              onClick={() => handleInputChange("cedula", "")}
                              className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-20 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-500 text-[10px]">Sin cédula</span>
                          </div>
                        )}
                        <input
                          ref={cedulaInputRef}
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload("cedula", e.target.files[0])}
                          className="hidden"
                        />
                        <button
                          onClick={() => cedulaInputRef.current?.click()}
                          className="w-full px-2 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {formData.cedula ? "Cambiar" : "Cargar"}
                        </button>
                        <p className="text-gray-500 text-[10px] text-center">
                          Ambos lados
                        </p>
                      </div>
                    </div>

                    {/* Papeleta de Votación */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-white text-xs mb-2 block font-bold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        Papeleta
                      </label>
                      <div className="space-y-2">
                        {formData.papeletaVotacion ? (
                          <div className="relative">
                            <img
                              src={formData.papeletaVotacion}
                              alt="Papeleta"
                              className="w-full h-20 object-cover rounded-lg border border-primary/30"
                            />
                            <button
                              onClick={() => handleInputChange("papeletaVotacion", "")}
                              className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-20 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-500 text-[10px]">Sin papeleta</span>
                          </div>
                        )}
                        <input
                          ref={papeletaInputRef}
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload("papeletaVotacion", e.target.files[0])}
                          className="hidden"
                        />
                        <button
                          onClick={() => papeletaInputRef.current?.click()}
                          className="w-full px-2 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {formData.papeletaVotacion ? "Cambiar" : "Cargar"}
                        </button>
                        <p className="text-gray-500 text-[10px] text-center">
                          Actualizada
                        </p>
                      </div>
                    </div>

                    {/* Planilla de Servicio */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-white text-xs mb-2 block font-bold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        Planilla
                      </label>
                      <div className="space-y-2">
                        {formData.planillaServicio ? (
                          <div className="relative">
                            <img
                              src={formData.planillaServicio}
                              alt="Planilla"
                              className="w-full h-20 object-cover rounded-lg border border-primary/30"
                            />
                            <button
                              onClick={() => handleInputChange("planillaServicio", "")}
                              className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-20 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-500 text-[10px]">Sin planilla</span>
                          </div>
                        )}
                        <input
                          ref={planillaInputRef}
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload("planillaServicio", e.target.files[0])}
                          className="hidden"
                        />
                        <button
                          onClick={() => planillaInputRef.current?.click()}
                          className="w-full px-2 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {formData.planillaServicio ? "Cambiar" : "Cargar"}
                        </button>
                        <p className="text-gray-500 text-[10px] text-center">
                          Máx. 3 meses
                        </p>
                      </div>
                    </div>

                    {/* Foto de la Casa */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-white text-xs mb-2 block font-bold flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-primary" />
                        Foto de la Casa
                      </label>
                      <div className="space-y-2">
                        {formData.fotoCasa ? (
                          <div className="relative">
                            <img
                              src={formData.fotoCasa}
                              alt="Foto de la casa"
                              className="w-full h-20 object-cover rounded-lg border border-primary/30"
                            />
                            <button
                              onClick={() => handleInputChange("fotoCasa", "")}
                              className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-20 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1">
                            <Home className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-500 text-[10px]">Sin foto</span>
                          </div>
                        )}
                        <input
                          ref={fotoCasaInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload("fotoCasa", e.target.files[0])}
                          className="hidden"
                        />
                        <button
                          onClick={() => fotoCasaInputRef.current?.click()}
                          className="w-full px-2 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {formData.fotoCasa ? "Cambiar" : "Cargar"}
                        </button>
                        <p className="text-gray-500 text-[10px] text-center">
                          Escanee la foto
                        </p>
                      </div>
                    </div>

                    {/* Consulta de Buro */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <label className="text-white text-xs mb-2 block font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-primary" />
                        Consulta de Buro
                      </label>
                      <div className="space-y-2">
                        {formData.consultaBuro ? (
                          <div className="relative">
                            <img
                              src={formData.consultaBuro}
                              alt="Consulta de Buro"
                              className="w-full h-20 object-cover rounded-lg border border-primary/30"
                            />
                            <button
                              onClick={() => handleInputChange("consultaBuro", "")}
                              className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-full h-20 bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center gap-1">
                            <AlertTriangle className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-500 text-[10px]">Sin consulta</span>
                          </div>
                        )}
                        <input
                          ref={consultaBuroInputRef}
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload("consultaBuro", e.target.files[0])}
                          className="hidden"
                        />
                        <button
                          onClick={() => consultaBuroInputRef.current?.click()}
                          className="w-full px-2 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-1.5 text-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {formData.consultaBuro ? "Cambiar" : "Cargar"}
                        </button>
                        <p className="text-gray-500 text-[10px] text-center">
                          Reporte de crédito
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Datos del Garante */}
              {activeTab === "garante" && (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-400 font-bold text-sm mb-1">Información del Garante</p>
                        <p className="text-gray-400 text-xs">
                          Requerido únicamente para clientes que soliciten crédito. Complete los datos de la persona que garantizará los pagos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox para seleccionar cliente existente */}
                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={garanteEsCliente}
                        onChange={(e) => {
                          setGaranteEsCliente(e.target.checked);
                          if (!e.target.checked) {
                            setGaranteSearchTerm("");
                            setShowGaranteResults(false);
                          }
                        }}
                        className="mt-1 w-5 h-5 rounded border-primary/50 bg-[#0f1825] text-primary focus:ring-primary focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-primary font-bold text-sm">El garante es un cliente existente</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          Marque esta opción para buscar y seleccionar un cliente registrado como garante.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Búsqueda de cliente como garante */}
                  {garanteEsCliente && (
                    <div className="relative mb-4">
                      <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                        <Search className="w-3 h-3" />
                        Buscar Cliente
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={garanteSearchTerm}
                          onChange={(e) => handleGaranteSearch(e.target.value)}
                          onFocus={() => garanteSearchTerm && setShowGaranteResults(true)}
                          placeholder="Buscar por nombre o cédula/RUC..."
                          className="w-full px-3 py-2.5 pl-10 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>

                      {/* Resultados de búsqueda */}
                      {showGaranteResults && filteredGarantes.length > 0 && (
                        <div className="absolute z-10 w-full mt-2 bg-[#0D1B2A] border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                          {filteredGarantes.map((customer) => (
                            <button
                              key={customer.ruc}
                              onClick={() => handleSelectGarante(customer)}
                              className="w-full px-4 py-3 hover:bg-white/5 border-b border-white/10 last:border-b-0 transition-colors text-left"
                            >
                              <div className="flex flex-col">
                                <p className="text-white font-medium text-sm">{customer.name}</p>
                                <p className="text-gray-400 text-xs mt-0.5">{customer.ruc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {showGaranteResults && filteredGarantes.length === 0 && garanteSearchTerm && (
                        <div className="absolute z-10 w-full mt-2 bg-[#0D1B2A] border border-white/20 rounded-lg shadow-xl p-4">
                          <p className="text-gray-400 text-sm text-center">No se encontraron clientes</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre del Garante */}
                    <div className="md:col-span-2">
                      <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Nombre Completo del Garante
                      </label>
                      <input
                        type="text"
                        value={formData.guarantorName}
                        onChange={(e) => handleInputChange("guarantorName", e.target.value)}
                        placeholder="Pedro Luis Ramírez Torres"
                        disabled={garanteEsCliente}
                        className={`w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          garanteEsCliente ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      />
                      {garanteEsCliente && formData.guarantorName && (
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          Datos obtenidos del cliente seleccionado
                        </p>
                      )}
                    </div>

                    {/* Cédula del Garante */}
                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                        <IdCard className="w-3 h-3" />
                        Cédula del Garante
                      </label>
                      <input
                        type="text"
                        value={formData.guarantorCedula}
                        onChange={(e) => handleInputChange("guarantorCedula", e.target.value.replace(/\D/g, ""))}
                        placeholder="0987654321"
                        maxLength={10}
                        disabled={garanteEsCliente}
                        className={`w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          garanteEsCliente ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>

                    {/* Teléfono del Garante */}
                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Teléfono del Garante
                      </label>
                      <input
                        type="text"
                        value={formData.guarantorPhone}
                        onChange={(e) => handleInputChange("guarantorPhone", e.target.value)}
                        placeholder="0987654321"
                        disabled={garanteEsCliente}
                        className={`w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          garanteEsCliente ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>

                    {/* Parentesco */}
                    <div>
                      <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Parentesco / Relación
                      </label>
                      <input
                        type="text"
                        value={formData.guarantorRelationship}
                        onChange={(e) => handleInputChange("guarantorRelationship", e.target.value)}
                        placeholder="Padre, Hermano, Amigo, etc."
                        className="w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    {/* Dirección del Garante */}
                    <div className="md:col-span-2">
                      <label className="text-gray-400 text-xs mb-1.5 block flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Dirección del Garante
                      </label>
                      <input
                        type="text"
                        value={formData.guarantorAddress}
                        onChange={(e) => handleInputChange("guarantorAddress", e.target.value)}
                        placeholder="Calle Principal N12-34 y Secundaria"
                        disabled={garanteEsCliente}
                        className={`w-full px-3 py-2.5 bg-[#0f1825] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${
                          garanteEsCliente ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Botones */}
        <div className="border-t border-white/10 px-6 py-4 bg-[#1a2332]">
          <div className="flex gap-3 items-center justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-bold flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Guardar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}