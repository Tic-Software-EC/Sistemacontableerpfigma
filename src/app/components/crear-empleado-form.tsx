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
  Briefcase,
  DollarSign,
} from "lucide-react";

interface CrearEmpleadoFormProps {
  theme: string;
}

type CreacionTab = "datos-empleado" | "documentos" | "informacion-laboral";

export function CrearEmpleadoForm({ theme }: CrearEmpleadoFormProps) {
  const isLight = theme === "light";
  const [activeTab, setActiveTab] = useState<CreacionTab>("datos-empleado");
  
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
  });

  const [documentos, setDocumentos] = useState<any[]>([]);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botones de Acción Superiores */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => {
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
            });
            setDocumentos([]);
            setFotoPreview(null);
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
          Guardar Empleado
        </button>
      </div>

      {/* Tabs de Creación con nuevo estilo */}
      <div className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("datos-empleado")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "datos-empleado"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <User className="w-4 h-4" />
            Datos del Empleado
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
            onClick={() => setActiveTab("informacion-laboral")}
            className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === "informacion-laboral"
                ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Información Laboral
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className={`border rounded-lg p-6 ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        {activeTab === "datos-empleado" && (
            <div className="space-y-6">
              <h3 className={`font-bold text-lg mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                Crear Nuevo Empleado
              </h3>

              {/* Foto del Empleado */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <Camera className="w-4 h-4" />
                  Foto del Empleado
                </h4>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    {fotoPreview ? (
                      <img
                        src={fotoPreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className={`w-32 h-32 rounded-2xl flex items-center justify-center ${
                        isLight ? "bg-gray-200" : "bg-white/10"
                      }`}>
                        <User className={`w-16 h-16 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
                      </div>
                    )}
                    <button
                      onClick={() => document.getElementById('foto-input')?.click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
                      type="button"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      id="foto-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFotoUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Sube una foto del empleado
                    </p>
                    <p className={`text-xs mb-3 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Formatos permitidos: JPG, PNG. Tamaño máximo: 5MB
                    </p>
                    <button
                      onClick={() => document.getElementById('foto-input')?.click()}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        isLight
                          ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                          : "border-white/10 hover:bg-white/5 text-white"
                      }`}
                      type="button"
                    >
                      <Upload className="w-4 h-4 inline mr-2" />
                      Subir Foto
                    </button>
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
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Cédula *
                    </label>
                    <input
                      type="text"
                      value={empleadoData.cedula}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, cedula: e.target.value })}
                      placeholder="0912345678"
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Nombres *
                    </label>
                    <input
                      type="text"
                      value={empleadoData.nombre}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, nombre: e.target.value })}
                      placeholder="Juan Carlos"
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={empleadoData.apellido}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, apellido: e.target.value })}
                      placeholder="Pérez Morales"
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Fecha de Nacimiento *
                    </label>
                    <input
                      type="date"
                      value={empleadoData.fechaNacimiento}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, fechaNacimiento: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Estado Civil
                    </label>
                    <select
                      value={empleadoData.estadoCivil}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, estadoCivil: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    >
                      <option value="Soltero">Soltero/a</option>
                      <option value="Casado">Casado/a</option>
                      <option value="Divorciado">Divorciado/a</option>
                      <option value="Viudo">Viudo/a</option>
                      <option value="Union Libre">Unión Libre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  <Phone className="w-4 h-4" />
                  Información de Contacto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={empleadoData.email}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, email: e.target.value })}
                      placeholder="empleado@ticsoftec.com"
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={empleadoData.telefono}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, telefono: e.target.value })}
                      placeholder="0987654321"
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Teléfono Adicional
                    </label>
                    <input
                      type="tel"
                      value={empleadoData.telefonoAdicional}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, telefonoAdicional: e.target.value })}
                      placeholder="042345678"
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={empleadoData.ciudad}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, ciudad: e.target.value })}
                      placeholder="Guayaquil"
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Provincia *
                    </label>
                    <select
                      value={empleadoData.provincia}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, provincia: e.target.value })}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-white/5 border-white/10 text-white"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Guayas">Guayas</option>
                      <option value="Pichincha">Pichincha</option>
                      <option value="Azuay">Azuay</option>
                      <option value="Manabí">Manabí</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="El Oro">El Oro</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Dirección *
                    </label>
                    <input
                      type="text"
                      value={empleadoData.direccion}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, direccion: e.target.value })}
                      placeholder="Av. Principal 123 y Calle Secundaria"
                      className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
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
                Documentos del Empleado
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <Upload className="w-4 h-4" />
                Subir Documento
              </button>
            </div>
            <div className={`text-center py-12 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No hay documentos cargados</p>
              <p className="text-xs mt-2">Los documentos requeridos son: Cédula (frontal y posterior), Título Profesional</p>
            </div>
          </div>
        )}

        {activeTab === "informacion-laboral" && (
          <div className="space-y-6">
            <h3 className={`font-bold text-lg mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
              Información Laboral
            </h3>

            <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <h4 className={`font-semibold text-sm mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                <Briefcase className="w-4 h-4" />
                Datos del Puesto
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Cargo *
                  </label>
                  <input
                    type="text"
                    value={empleadoData.cargo}
                    onChange={(e) => setEmpleadoData({ ...empleadoData, cargo: e.target.value })}
                    placeholder="Gerente de Ventas"
                    className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Departamento *
                  </label>
                  <select
                    value={empleadoData.departamento}
                    onChange={(e) => setEmpleadoData({ ...empleadoData, departamento: e.target.value })}
                    className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Contabilidad">Contabilidad</option>
                    <option value="Inventario">Inventario</option>
                    <option value="Compras">Compras</option>
                    <option value="RRHH">RRHH</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Fecha de Ingreso *
                  </label>
                  <input
                    type="date"
                    value={empleadoData.fechaIngreso}
                    onChange={(e) => setEmpleadoData({ ...empleadoData, fechaIngreso: e.target.value })}
                    className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Tipo de Contrato *
                  </label>
                  <select
                    value={empleadoData.tipoContrato}
                    onChange={(e) => setEmpleadoData({ ...empleadoData, tipoContrato: e.target.value })}
                    className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="indefinido">Indefinido</option>
                    <option value="temporal">Temporal</option>
                    <option value="por-horas">Por Horas</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Salario Mensual *
                  </label>
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                    <input
                      type="number"
                      step="0.01"
                      value={empleadoData.salario}
                      onChange={(e) => setEmpleadoData({ ...empleadoData, salario: parseFloat(e.target.value) })}
                      placeholder="2500.00"
                      className={`w-full pl-10 pr-3 py-1.5 rounded-lg text-sm border ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Estado
                  </label>
                  <select
                    value={empleadoData.estado}
                    onChange={(e) => setEmpleadoData({ ...empleadoData, estado: e.target.value })}
                    className={`w-full px-3 py-1.5 rounded-lg text-sm border ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="vacaciones">Vacaciones</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}