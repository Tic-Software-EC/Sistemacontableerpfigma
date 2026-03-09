import { useState, useEffect } from "react";
import { 
  X, Hash, FileText, Calendar, User, Building2, Phone, Mail, 
  MapPin, Receipt, Calculator, Plus, Trash2, AlertCircle, Search 
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { CUSTOMERS_DATA, Customer } from "../data/customers-data";
import { SUPPLIERS_DATA } from "../data/suppliers-data";

interface DetalleRetencion {
  codigo: string;
  concepto: string;
  tipo: "Fuente" | "IVA";
  base_imponible: number;
  porcentaje: number;
  valor_retenido: number;
}

interface ManualRetentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (retention: any) => void;
  categoria: "compras" | "ventas";
}

// Códigos de retención más comunes
const CODIGOS_RETENCION_FUENTE = [
  { codigo: "303", concepto: "Honorarios profesionales y demás pagos por servicios relacionados con el título profesional", porcentaje: 10 },
  { codigo: "304", concepto: "Servicios profesionales sin título", porcentaje: 8 },
  { codigo: "307", concepto: "Servicios predomina el intelecto no relacionados con el título profesional", porcentaje: 8 },
  { codigo: "308", concepto: "Comisiones", porcentaje: 10 },
  { codigo: "309", concepto: "Arrendamiento mercantil", porcentaje: 1 },
  { codigo: "310", concepto: "Arrendamiento bienes inmuebles", porcentaje: 8 },
  { codigo: "311", concepto: "Arrendamiento bienes muebles", porcentaje: 1 },
  { codigo: "312", concepto: "Transporte privado de pasajeros o servicio público o privado de carga", porcentaje: 1 },
  { codigo: "319", concepto: "Servicios de construcción, urbanización, lotización", porcentaje: 1 },
  { codigo: "320", concepto: "Arrendamiento mercantil (solo personas naturales)", porcentaje: 1 },
  { codigo: "322", concepto: "Pagos a notarios y registradores", porcentaje: 8 },
  { codigo: "323", concepto: "Honorarios y dietas pagos por servicios de docencia", porcentaje: 8 },
  { codigo: "332", concepto: "Pagos a través de liquidación de compra", porcentaje: 2 },
  { codigo: "340", concepto: "Compra de bienes muebles", porcentaje: 1 },
  { codigo: "341", concepto: "Compra de bienes inmuebles", porcentaje: 1 },
];

const CODIGOS_RETENCION_IVA = [
  { codigo: "721", concepto: "IVA 30% - Bienes (Persona Natural)", porcentaje: 30 },
  { codigo: "723", concepto: "IVA 100% - Servicios (Persona Jurídica)", porcentaje: 100 },
  { codigo: "725", concepto: "IVA 70% - Prestación de Servicios (Persona Natural)", porcentaje: 70 },
  { codigo: "727", concepto: "IVA 100% - Bienes (Persona Jurídica)", porcentaje: 100 },
  { codigo: "729", concepto: "IVA 10% - Prestación de Servicios (Persona Natural)", porcentaje: 10 },
];

export function ManualRetentionModal({ isOpen, onClose, onSave, categoria }: ManualRetentionModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Obtener establecimiento y punto de emisión del localStorage
  const userEstablecimiento = localStorage.getItem("userEstablecimiento") || "001";
  const userPuntoEmision = localStorage.getItem("userPuntoEmision") || "001";

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Número de retención (automático desde sesión)
    establecimiento: userEstablecimiento,
    puntoEmision: userPuntoEmision,
    secuencial: "",
    
    // Fecha
    fecha: new Date().toISOString().split('T')[0],
    
    // Sujeto retenido (en compras es el proveedor, en ventas es el cliente)
    contribuyente: "",
    tipoIdentificacion: "RUC" as "RUC" | "Cédula" | "Pasaporte",
    identificacion: "",
    direccion: "",
    telefono: "",
    email: "",
    
    // Comprobante que origina la retención
    tipoComprobante: "Factura",
    numeroComprobante: "",
    fechaComprobante: new Date().toISOString().split('T')[0],
    periodoFiscal: "",
    
    // Ambiente
    ambiente: "Producción" as "Producción" | "Pruebas",
  });

  const [detalles, setDetalles] = useState<DetalleRetencion[]>([
    {
      codigo: "",
      concepto: "",
      tipo: "Fuente",
      base_imponible: 0,
      porcentaje: 0,
      valor_retenido: 0,
    }
  ]);

  // Buscador de clientes/proveedores
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<Customer | typeof SUPPLIERS_DATA[0] | null>(null);

  // Obtener lista según categoría
  const entityList = categoria === "compras" ? SUPPLIERS_DATA : CUSTOMERS_DATA;

  // Filtrar resultados
  const searchResults = searchQuery.length >= 2
    ? entityList.filter(entity => {
        const name = entity.name;
        const id = 'idNumber' in entity ? entity.idNumber : entity.ruc;
        return (
          name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          id.includes(searchQuery)
        );
      }).slice(0, 8)
    : [];

  // Debug
  console.log('Search Query:', searchQuery);
  console.log('Show Dropdown:', showDropdown);
  console.log('Search Results:', searchResults);
  console.log('Entity List Length:', entityList.length);

  // Seleccionar entidad (cliente o proveedor)
  const handleSelectEntity = (entity: Customer | typeof SUPPLIERS_DATA[0]) => {
    setSelectedEntity(entity);
    
    if ('idNumber' in entity) {
      // Es un cliente
      setSearchQuery(entity.name);
      setFormData(prev => ({
        ...prev,
        contribuyente: entity.name,
        tipoIdentificacion: entity.idType,
        identificacion: entity.idNumber,
        direccion: `${entity.address}, ${entity.city}`,
        telefono: entity.phone,
        email: entity.email,
      }));
    } else {
      // Es un proveedor
      setSearchQuery(entity.name);
      setFormData(prev => ({
        ...prev,
        contribuyente: entity.name,
        tipoIdentificacion: "RUC",
        identificacion: entity.ruc,
        direccion: `${entity.address}, ${entity.city}`,
        telefono: entity.phone,
        email: entity.email,
      }));
    }
    
    setShowDropdown(false);
  };

  // Calcular total retenido
  const totalRetenido = detalles.reduce((sum, det) => sum + det.valor_retenido, 0);

  const handleAddDetalle = () => {
    setDetalles([...detalles, {
      codigo: "",
      concepto: "",
      tipo: "Fuente",
      base_imponible: 0,
      porcentaje: 0,
      valor_retenido: 0,
    }]);
  };

  const handleRemoveDetalle = (index: number) => {
    if (detalles.length === 1) {
      toast.error("Debe haber al menos un detalle de retención");
      return;
    }
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const handleDetalleChange = (index: number, field: keyof DetalleRetencion, value: any) => {
    const newDetalles = [...detalles];
    newDetalles[index] = { ...newDetalles[index], [field]: value };
    
    // Si cambia el código, auto-completar concepto y porcentaje
    if (field === "codigo") {
      const tipo = newDetalles[index].tipo;
      const lista = tipo === "Fuente" ? CODIGOS_RETENCION_FUENTE : CODIGOS_RETENCION_IVA;
      const codigoInfo = lista.find(c => c.codigo === value);
      if (codigoInfo) {
        newDetalles[index].concepto = codigoInfo.concepto;
        newDetalles[index].porcentaje = codigoInfo.porcentaje;
      }
    }
    
    // Recalcular valor retenido si cambia base o porcentaje
    if (field === "base_imponible" || field === "porcentaje") {
      const base = parseFloat(String(newDetalles[index].base_imponible)) || 0;
      const pct = parseFloat(String(newDetalles[index].porcentaje)) || 0;
      newDetalles[index].valor_retenido = (base * pct) / 100;
    }
    
    setDetalles(newDetalles);
  };

  const handleTipoChange = (index: number, tipo: "Fuente" | "IVA") => {
    const newDetalles = [...detalles];
    newDetalles[index] = {
      ...newDetalles[index],
      tipo,
      codigo: "",
      concepto: "",
      porcentaje: 0,
    };
    setDetalles(newDetalles);
  };

  const handleSubmit = () => {
    // Validaciones
    if (!formData.secuencial.trim()) {
      toast.error("Ingrese el número secuencial de la retención");
      return;
    }
    if (!formData.contribuyente.trim()) {
      toast.error("Ingrese el nombre del contribuyente");
      return;
    }
    if (!formData.identificacion.trim()) {
      toast.error("Ingrese la identificación del contribuyente");
      return;
    }
    if (!formData.numeroComprobante.trim()) {
      toast.error("Ingrese el número del comprobante");
      return;
    }
    
    // Validar detalles
    for (const det of detalles) {
      if (!det.codigo) {
        toast.error("Todos los detalles deben tener un código de retención");
        return;
      }
      if (det.base_imponible <= 0) {
        toast.error("La base imponible debe ser mayor a cero");
        return;
      }
    }

    // Generar clave de acceso (49 dígitos simulados)
    const claveAcceso = Array.from({ length: 49 }, () => Math.floor(Math.random() * 10)).join("");
    
    // Construir objeto de retención
    const retention = {
      id: `RET-${categoria === "compras" ? "C" : "V"}-${Date.now()}`,
      num: `${formData.establecimiento}-${formData.puntoEmision}-${formData.secuencial.padStart(9, '0')}`,
      clave_acceso: claveAcceso,
      fecha: formData.fecha,
      emisor_razon: categoria === "compras" ? "TicSoftEc Cía. Ltda." : formData.contribuyente,
      emisor_ruc: categoria === "compras" ? "1791234567001" : formData.identificacion,
      emisor_dir: categoria === "compras" ? "Av. Amazonas N35-17 y Japón, Quito - Ecuador" : formData.direccion,
      emisor_telefono: categoria === "compras" ? "02-2547-891" : formData.telefono,
      emisor_email: categoria === "compras" ? "contabilidad@ticsoftec.com" : formData.email,
      contribuyente: categoria === "compras" ? formData.contribuyente : "TicSoftEc Cía. Ltda.",
      ruc: categoria === "compras" ? formData.identificacion : "1791234567001",
      direccion_sujeto: categoria === "compras" ? formData.direccion : "Av. Amazonas N35-17 y Japón, Quito - Ecuador",
      comprobante: formData.numeroComprobante,
      tipo_comprobante: formData.tipoComprobante,
      fecha_comprobante: formData.fechaComprobante,
      periodo_fiscal: formData.periodoFiscal || new Date().toISOString().slice(0, 7).split('-').reverse().join('/'),
      detalles: detalles,
      estado: "pendiente" as const,
      categoria: categoria,
      autorizacion_sri: "",
      ambiente: formData.ambiente,
      total_retenido: totalRetenido,
    };

    onSave(retention);
    toast.success("Retención ingresada correctamente");
    onClose();
  };

  if (!isOpen) return null;

  // Estilos
  const inputClass = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all ${
    isLight 
      ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" 
      : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500"
  }`;

  const labelClass = `block text-sm font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl rounded-2xl shadow-2xl ${
        isLight ? "bg-white" : "bg-[#0D1B2A]"
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? "border-gray-200" : "border-white/10"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-primary" />
            </div>
            <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
              Ingreso Manual de Retención
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/5 text-gray-400"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nota informativa */}
        <div className={`mx-6 mt-4 p-3 rounded-lg border flex items-start gap-3 ${
          isLight 
            ? "bg-orange-50 border-orange-200" 
            : "bg-primary/10 border-primary/30"
        }`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            isLight ? "text-primary" : "text-primary"
          }`} />
          <p className={`text-sm ${isLight ? "text-orange-800" : "text-orange-200"}`}>
            {categoria === "compras" 
              ? "Ingrese los datos de la retención que emitió a un proveedor."
              : "Ingrese los datos de la retención que recibió de un cliente."}
          </p>
        </div>

        {/* Body - Formulario */}
        <div className="p-6 max-h-[calc(100vh-280px)] overflow-y-auto space-y-6">
          
          {/* Numeración y Fecha */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Establecimiento</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.establecimiento}
                  readOnly
                  className={`${inputClass} pl-9 bg-gray-50 dark:bg-gray-900 cursor-not-allowed`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Pto. Emisión</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.puntoEmision}
                  readOnly
                  className={`${inputClass} pl-9 bg-gray-50 dark:bg-gray-900 cursor-not-allowed`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Secuencial <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.secuencial}
                  onChange={(e) => setFormData({ ...formData, secuencial: e.target.value })}
                  maxLength={9}
                  className={`${inputClass} pl-9`}
                  placeholder="000000001"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>
                Fecha Emisión <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          {/* Buscador de Cliente/Proveedor */}
          <div>
            <label className={labelClass}>
              {categoria === "compras" ? "Buscar Proveedor" : "Buscar Cliente"} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className={`${inputClass} pl-9`}
                placeholder={`Buscar por nombre o ${categoria === "compras" ? "RUC" : "identificación"}...`}
              />
              
              {/* Dropdown de resultados */}
              {showDropdown && searchResults.length > 0 && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-20 max-h-64 overflow-y-auto ${
                    isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"
                  }`}>
                    {searchResults.map((entity) => {
                      const name = entity.name;
                      const id = 'idNumber' in entity ? entity.idNumber : entity.ruc;
                      const code = 'code' in entity ? entity.code : entity.id;
                      
                      return (
                        <button
                          key={code}
                          onClick={() => handleSelectEntity(entity as any)}
                          className={`w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors border-b last:border-b-0 ${
                            isLight ? "border-gray-100" : "border-white/5"
                          }`}
                        >
                          <div className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            {name}
                          </div>
                          <div className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            {id} • {code}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Datos del Contribuyente (Auto-completados) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Tipo Identificación</label>
              <input
                type="text"
                value={formData.tipoIdentificacion}
                readOnly
                className={`${inputClass} bg-gray-50 dark:bg-gray-900 cursor-not-allowed`}
              />
            </div>

            <div>
              <label className={labelClass}>
                {formData.tipoIdentificacion} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.identificacion}
                  readOnly
                  className={`${inputClass} pl-9 bg-gray-50 dark:bg-gray-900 cursor-not-allowed`}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className={labelClass}>Dirección</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.direccion}
                  readOnly
                  className={`${inputClass} pl-9 bg-gray-50 dark:bg-gray-900 cursor-not-allowed`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.telefono}
                  readOnly
                  className={`${inputClass} pl-9 bg-gray-50 dark:bg-gray-900 cursor-not-allowed`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className={`${inputClass} pl-9 bg-gray-50 dark:bg-gray-900 cursor-not-allowed`}
                />
              </div>
            </div>
          </div>

          {/* Comprobante */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Tipo Comprobante</label>
              <select
                value={formData.tipoComprobante}
                onChange={(e) => setFormData({ ...formData, tipoComprobante: e.target.value })}
                className={inputClass}
              >
                <option value="Factura">Factura</option>
                <option value="Nota de Venta">Nota de Venta</option>
                <option value="Liquidación de Compra">Liquidación de Compra</option>
                <option value="Nota de Crédito">Nota de Crédito</option>
                <option value="Nota de Débito">Nota de Débito</option>
                <option value="Guía de Remisión">Guía de Remisión</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Nro. Comprobante <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.numeroComprobante}
                  onChange={(e) => setFormData({ ...formData, numeroComprobante: e.target.value })}
                  className={`${inputClass} pl-9`}
                  placeholder="001-001-000000001"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Fecha Comprobante</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.fechaComprobante}
                  onChange={(e) => setFormData({ ...formData, fechaComprobante: e.target.value })}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>
          </div>

          {/* Detalles de Retención */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Detalles de Retención <span className="text-red-500">*</span>
              </label>
              <button
                onClick={handleAddDetalle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Línea
              </button>
            </div>

            <div className="space-y-3">
              {detalles.map((detalle, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      {/* Tipo y Código */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Tipo
                          </label>
                          <div className="flex gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                checked={detalle.tipo === "Fuente"}
                                onChange={() => handleTipoChange(index, "Fuente")}
                                className="text-primary focus:ring-primary"
                              />
                              <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>Fuente</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                checked={detalle.tipo === "IVA"}
                                onChange={() => handleTipoChange(index, "IVA")}
                                className="text-primary focus:ring-primary"
                              />
                              <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>IVA</span>
                            </label>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Código de Retención
                          </label>
                          <select
                            value={detalle.codigo}
                            onChange={(e) => handleDetalleChange(index, "codigo", e.target.value)}
                            className={inputClass}
                          >
                            <option value="">Seleccione...</option>
                            {(detalle.tipo === "Fuente" ? CODIGOS_RETENCION_FUENTE : CODIGOS_RETENCION_IVA).map(c => (
                              <option key={c.codigo} value={c.codigo}>
                                {c.codigo} - {c.concepto} ({c.porcentaje}%)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Base, Porcentaje, Valor */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Base Imponible
                          </label>
                          <input
                            type="number"
                            value={detalle.base_imponible}
                            onChange={(e) => handleDetalleChange(index, "base_imponible", parseFloat(e.target.value))}
                            className={inputClass}
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            % Retención
                          </label>
                          <input
                            type="number"
                            value={detalle.porcentaje}
                            onChange={(e) => handleDetalleChange(index, "porcentaje", parseFloat(e.target.value))}
                            className={inputClass}
                            step="0.01"
                            min="0"
                            max="100"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Valor Retenido
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={`$${detalle.valor_retenido.toFixed(2)}`}
                              readOnly
                              className={`${inputClass} font-semibold text-primary bg-opacity-50`}
                            />
                            <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botón eliminar */}
                    <button
                      onClick={() => handleRemoveDetalle(index)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-5"
                      title="Eliminar línea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className={`mt-4 p-4 rounded-lg border-2 ${
              isLight 
                ? "bg-primary/5 border-primary/30" 
                : "bg-primary/10 border-primary/40"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                  TOTAL RETENIDO:
                </span>
                <span className="font-bold text-3xl text-primary">
                  ${totalRetenido.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Botones */}
        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
          isLight ? "border-gray-200" : "border-white/10"
        }`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isLight 
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700" 
                : "bg-white/5 hover:bg-white/10 text-white"
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Guardar Retención
          </button>
        </div>
      </div>
    </div>
  );
}