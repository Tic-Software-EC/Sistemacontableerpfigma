import { useState } from "react";
import {
  User,
  Phone,
  Building,
  FileText,
  CreditCard,
  Save,
  Upload,
  IdCard,
  Vote,
  Home as HomeIcon,
  Camera,
  UserCheck,
  Plus,
  Trash2,
  Eye,
  Download,
  Edit,
  Calendar,
  X,
} from "lucide-react";

interface CrearClienteFormProps {
  theme: string;
}

type CreacionTab = "datos-cliente" | "documentos" | "garantes-credito";

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

  const [garantes, setGarantes] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);

  return (
    <div className="space-y-4">
      {/* Botones de Acción Superiores */}
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
            setDocumentos([]);
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

      {/* Tabs de Creación con nuevo estilo */}
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

      {/* Tab Content Container */}
      <div className={`border rounded-lg p-6 ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        {activeTab === "datos-cliente" && (
            <div className="space-y-6">
              <h3 className={`font-bold text-lg mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                Crear Nuevo Cliente
              </h3>

              {/* Información Personal */}
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

              {/* Información de Contacto */}
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

              {/* Información Laboral y Comercial */}
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
              <div className="flex items-center justify-between">
                <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                  Subir Documentos del Cliente
                </h3>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  Subir Documento
                </button>
              </div>

              <p className="text-sm text-gray-400">
                Sube los documentos requeridos: cédula (frontal y posterior), papeleta de votación, comprobante de domicilio, etc.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card para Cédula Frontal */}
                <div
                  className={`rounded-lg p-6 border-2 border-dashed cursor-pointer transition-all hover:border-primary ${
                    isLight ? "border-gray-300 bg-gray-50 hover:bg-white" : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IdCard className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        Cédula Frontal
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click para subir
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card para Cédula Posterior */}
                <div
                  className={`rounded-lg p-6 border-2 border-dashed cursor-pointer transition-all hover:border-primary ${
                    isLight ? "border-gray-300 bg-gray-50 hover:bg-white" : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IdCard className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        Cédula Posterior
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click para subir
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card para Papeleta de Votación */}
                <div
                  className={`rounded-lg p-6 border-2 border-dashed cursor-pointer transition-all hover:border-primary ${
                    isLight ? "border-gray-300 bg-gray-50 hover:bg-white" : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Vote className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        Papeleta de Votación
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click para subir
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card para Comprobante de Domicilio */}
                <div
                  className={`rounded-lg p-6 border-2 border-dashed cursor-pointer transition-all hover:border-primary ${
                    isLight ? "border-gray-300 bg-gray-50 hover:bg-white" : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HomeIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        Comprobante Domicilio
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click para subir
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card para Foto del Cliente */}
                <div
                  className={`rounded-lg p-6 border-2 border-dashed cursor-pointer transition-all hover:border-primary ${
                    isLight ? "border-gray-300 bg-gray-50 hover:bg-white" : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        Foto del Cliente
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click para subir
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card para Otros Documentos */}
                <div
                  className={`rounded-lg p-6 border-2 border-dashed cursor-pointer transition-all hover:border-primary ${
                    isLight ? "border-gray-300 bg-gray-50 hover:bg-white" : "border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        Otros Documentos
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click para subir
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "garantes-credito" && (
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

              {/* Configuración de Crédito */}
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

              {/* Lista de Garantes */}
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
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center justify-center gap-2">
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
    </div>
  );
}