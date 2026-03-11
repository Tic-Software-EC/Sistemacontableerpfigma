import { useState, useEffect, useRef } from "react";
import { X, Search, Plus, Minus, CheckCircle2, User, Truck, FileText, MapPin, Send, Shield, FileCheck, Loader2 } from "lucide-react";
import { 
  PRODUCTS_CATALOG, 
  CUSTOMERS,
  type Product,
  type Customer
} from "../data/test-data";

interface CreateRemissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (guide: any) => void;
}

interface RemissionItem {
  code: string;
  name: string;
  quantity: number;
  unit: string;
}

const MOTIVOS_TRASLADO = [
  { value: "venta", label: "Venta" },
  { value: "compra", label: "Compra" },
  { value: "devolucion", label: "Devolución" },
  { value: "importacion", label: "Importación" },
  { value: "exportacion", label: "Exportación" },
  { value: "traslado_entre_establecimientos", label: "Traslado entre establecimientos" },
  { value: "otros", label: "Otros (especificar)" },
];

export function CreateRemissionGuideModal({ isOpen, onClose, onSave }: CreateRemissionGuideModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // Paso 1: Destinatario
  const [selectedDestinatario, setSelectedDestinatario] = useState<Customer | null>(null);
  const [searchDestinatario, setSearchDestinatario] = useState("");
  const [showDestinatarioDropdown, setShowDestinatarioDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Paso 2: Transportista y traslado
  const [transportistaNombre, setTransportistaNombre] = useState("");
  const [transportistaRuc, setTransportistaRuc] = useState("");
  const [transportistaPlaca, setTransportistaPlaca] = useState("");
  const [puntoPartida, setPuntoPartida] = useState("Av. Amazonas N35-17 y Japón, Quito - Ecuador");
  const [puntoDestino, setPuntoDestino] = useState("");
  const [motivoTraslado, setMotivoTraslado] = useState("venta");
  const [motivoTrasladoDesc, setMotivoTrasladoDesc] = useState("");
  const [relatedInvoice, setRelatedInvoice] = useState("");
  
  // Paso 3: Productos
  const [items, setItems] = useState<RemissionItem[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  
  // Paso 4: Proceso SRI
  const [sriStep, setSriStep] = useState(0);
  const [guideNumber, setGuideNumber] = useState("");
  const [authorizationNumber, setAuthorizationNumber] = useState("");

  // Determinar si es light theme
  const isLight = true; // Por defecto

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedDestinatario(null);
      setSearchDestinatario("");
      setTransportistaNombre("");
      setTransportistaRuc("");
      setTransportistaPlaca("");
      setPuntoDestino("");
      setMotivoTraslado("venta");
      setMotivoTrasladoDesc("");
      setRelatedInvoice("");
      setItems([]);
      setSearchProduct("");
      setSriStep(0);
      setGuideNumber("");
      setAuthorizationNumber("");
    }
  }, [isOpen]);

  // Simular proceso SRI cuando se llega al paso 4
  useEffect(() => {
    if (step === 4 && sriStep === 0) {
      // Generar número de guía
      setGuideNumber(`006-001-${String(Math.floor(Math.random() * 100000)).padStart(6, "0")}`);
      
      // Iniciar proceso automático inmediatamente
      setSriStep(1);
      
      const timer2 = setTimeout(() => setSriStep(2), 1000);
      const timer3 = setTimeout(() => setSriStep(3), 2000);
      const timer4 = setTimeout(() => setSriStep(4), 3000);
      const timer5 = setTimeout(() => {
        setSriStep(5);
        // Generar clave de acceso
        const genClave = () => Array.from({ length: 49 }, () => Math.floor(Math.random() * 10)).join("");
        setAuthorizationNumber(genClave());
      }, 4000);

      return () => {
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [step]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDestinatarioDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrar destinatarios
  const filteredDestinatarios = searchDestinatario.trim() === "" ? [] : CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchDestinatario.toLowerCase()) ||
      c.ruc.includes(searchDestinatario)
  ).slice(0, 3);

  // Filtrar productos
  const filteredProducts = searchProduct.trim() === "" ? [] : PRODUCTS_CATALOG.filter(
    (p) =>
      p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      p.code.toLowerCase().includes(searchProduct.toLowerCase())
  ).slice(0, 5);

  // Funciones para manejar productos
  const handleAddProduct = (product: Product) => {
    const exists = items.find((i) => i.code === product.code);
    if (exists) {
      setItems(items.map((i) => i.code === product.code ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems([...items, { 
        code: product.code, 
        name: product.name, 
        quantity: 1,
        unit: "UND"
      }]);
    }
    setSearchProduct("");
  };

  const handleUpdateQuantity = (code: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(items.filter((i) => i.code !== code));
    } else {
      setItems(items.map((i) => i.code === code ? { ...i, quantity } : i));
    }
  };

  const handleUpdateUnit = (code: string, unit: string) => {
    setItems(items.map((i) => i.code === code ? { ...i, unit } : i));
  };

  const handleRemoveItem = (code: string) => {
    setItems(items.filter((i) => i.code !== code));
  };

  const canGoToStep2 = selectedDestinatario !== null;
  const canGoToStep3 = transportistaNombre && transportistaRuc && transportistaPlaca && puntoDestino && (motivoTraslado !== "otros" || motivoTrasladoDesc);
  const canGoToStep4 = items.length > 0;

  const handleSave = () => {
    if (!selectedDestinatario) return;

    const newGuide = {
      id: Date.now().toString(),
      guideNumber,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
      destinatario: {
        name: selectedDestinatario.name,
        ruc: selectedDestinatario.ruc,
        address: selectedDestinatario.address,
        email: selectedDestinatario.email,
        phone: selectedDestinatario.phone,
      },
      transportista: {
        name: transportistaNombre,
        ruc: transportistaRuc,
        placa: transportistaPlaca,
      },
      puntoPartida,
      puntoDestino,
      motivoTraslado,
      motivoTrasladoDesc: motivoTraslado === "otros" ? motivoTrasladoDesc : undefined,
      items,
      relatedInvoice: relatedInvoice || undefined,
      status: "completed",
      seller: "Juan Pérez",
      branch: "Sucursal Centro",
      authorizationNumber,
      sriStatus: "authorized",
      sriAuthDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      emisor_razon: "TicSoftEc S.A.",
      emisor_dir: "Av. Amazonas N35-17 y Japón, Quito - Ecuador",
      emisor_ruc: "1790123456001",
      emisor_telefono: "02-2345-678",
      emisor_email: "facturacion@ticsoftec.com",
      ambiente: "Pruebas",
      periodo_fiscal: new Date().toLocaleDateString("es-EC", { month: "2-digit", year: "numeric" }),
    };

    onSave(newGuide);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "bg-gray-50/50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isLight ? "bg-blue-100" : "bg-blue-500/20"}`}>
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Nueva Guía de Remisión
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Paso {step} de 4
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-200 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className={`px-6 py-4 border-b ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d1724]"}`}>
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { num: 1, label: "Destinatario", hasCheck: step > 1 },
              { num: 2, label: "Transporte", hasCheck: step > 2 },
              { num: 3, label: "Productos", hasCheck: step > 3 },
              { num: 4, label: "SRI", hasCheck: false }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center gap-2">
                {idx > 0 && (
                  <div className={`flex-1 h-0.5 mx-3 ${step > s.num - 1 ? "bg-primary" : (isLight ? "bg-gray-200" : "bg-white/10")}`} />
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  step >= s.num
                    ? "bg-primary text-white"
                    : isLight
                    ? "bg-gray-200 text-gray-500"
                    : "bg-white/10 text-gray-500"
                }`}>
                  {s.hasCheck ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-medium ${step >= s.num ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
          
          {/* STEP 1: Destinatario */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Seleccionar Destinatario
              </h3>
              
              <div ref={searchRef} className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="text"
                  value={searchDestinatario}
                  onChange={(e) => {
                    setSearchDestinatario(e.target.value);
                    setShowDestinatarioDropdown(true);
                  }}
                  onFocus={() => setShowDestinatarioDropdown(true)}
                  placeholder="Buscar por nombre o RUC..."
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm transition-colors ${
                    isLight 
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />

                {/* Dropdown de resultados */}
                {showDestinatarioDropdown && searchDestinatario.trim() !== "" && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-xl max-h-60 overflow-auto z-10 ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                    {filteredDestinatarios.length > 0 ? (
                      filteredDestinatarios.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => {
                            setSelectedDestinatario(customer);
                            setSearchDestinatario("");
                            setShowDestinatarioDropdown(false);
                            setPuntoDestino(customer.address || "");
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b last:border-b-0 ${isLight ? "border-gray-100" : "border-white/5"}`}
                        >
                          <div className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            {customer.name}
                          </div>
                          <div className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            RUC: {customer.ruc}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className={`px-3 py-4 text-sm text-center ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        No se encontraron destinatarios
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mensaje cuando no hay búsqueda */}
              {searchDestinatario.trim() === "" && !selectedDestinatario && (
                <div className={`text-center py-12 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                  <Search className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                  <p className={`text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Busca un destinatario
                  </p>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Escribe el nombre o RUC del destinatario
                  </p>
                </div>
              )}

              {/* Cliente seleccionado */}
              {selectedDestinatario && (
                <div className={`p-4 rounded-lg border ${isLight ? "bg-green-50 border-green-300" : "bg-green-500/10 border-green-500/30"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isLight ? "bg-green-100" : "bg-green-500/20"}`}>
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className={`font-semibold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                          {selectedDestinatario.name}
                        </div>
                        <div className={`text-xs mt-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          RUC: {selectedDestinatario.ruc}
                        </div>
                        {selectedDestinatario.address && (
                          <div className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            {selectedDestinatario.address}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDestinatario(null)}
                      className="p-1 rounded hover:bg-red-100 text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Transportista y Traslado */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Información del Transporte
              </h3>

              {/* Transportista */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Razón Social *
                  </label>
                  <input
                    value={transportistaNombre}
                    onChange={(e) => setTransportistaNombre(e.target.value)}
                    placeholder="Nombre del transportista"
                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    RUC *
                  </label>
                  <input
                    value={transportistaRuc}
                    onChange={(e) => setTransportistaRuc(e.target.value)}
                    placeholder="1234567890001"
                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Placa *
                  </label>
                  <input
                    value={transportistaPlaca}
                    onChange={(e) => setTransportistaPlaca(e.target.value.toUpperCase())}
                    placeholder="ABC-1234"
                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
              </div>

              {/* Información del Traslado */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Punto de Partida *
                  </label>
                  <input
                    value={puntoPartida}
                    onChange={(e) => setPuntoPartida(e.target.value)}
                    placeholder="Dirección de origen"
                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Punto de Destino *
                  </label>
                  <input
                    value={puntoDestino}
                    onChange={(e) => setPuntoDestino(e.target.value)}
                    placeholder="Dirección de destino"
                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Motivo del Traslado *
                  </label>
                  <select
                    value={motivoTraslado}
                    onChange={(e) => setMotivoTraslado(e.target.value)}
                    className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  >
                    {MOTIVOS_TRASLADO.map((motivo) => (
                      <option key={motivo.value} value={motivo.value}>
                        {motivo.label}
                      </option>
                    ))}
                  </select>
                </div>
                {motivoTraslado === "otros" ? (
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Especificar motivo *
                    </label>
                    <input
                      value={motivoTrasladoDesc}
                      onChange={(e) => setMotivoTrasladoDesc(e.target.value)}
                      placeholder="Describa el motivo"
                      className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors ${
                        isLight 
                          ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                          : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    />
                  </div>
                ) : (
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      Factura Relacionada (opcional)
                    </label>
                    <input
                      value={relatedInvoice}
                      onChange={(e) => setRelatedInvoice(e.target.value)}
                      placeholder="001-001-000123"
                      className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors ${
                        isLight 
                          ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                          : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Productos */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Productos a Trasladar
              </h3>
              
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Buscar por código o nombre..."
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm transition-colors ${
                    isLight 
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />

                {/* Lista de productos */}
                {searchProduct.trim() !== "" && (
                  <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-xl max-h-60 overflow-auto z-10 ${isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <button
                          key={product.code}
                          onClick={() => handleAddProduct(product)}
                          className={`w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b last:border-b-0 ${isLight ? "border-gray-100" : "border-white/5"}`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                                {product.name}
                              </div>
                              <div className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                Código: {product.code}
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-primary" />
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className={`px-3 py-4 text-sm text-center ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        No se encontraron productos
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Lista de items seleccionados */}
              {items.length > 0 ? (
                <div className={`border rounded-lg overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <table className="w-full text-sm">
                    <thead className={isLight ? "bg-gray-100" : "bg-white/5"}>
                      <tr>
                        <th className={`text-left py-2 px-3 text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-400"}`}>Código</th>
                        <th className={`text-left py-2 px-3 text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-400"}`}>Producto</th>
                        <th className={`text-center py-2 px-3 text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-400"}`}>Cantidad</th>
                        <th className={`text-center py-2 px-3 text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-400"}`}>Unidad</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.code} className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                          <td className={`py-2 px-3 font-mono ${isLight ? "text-gray-900" : "text-white"}`}>{item.code}</td>
                          <td className={`py-2 px-3 ${isLight ? "text-gray-900" : "text-white"}`}>{item.name}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.code, item.quantity - 1)}
                                className={`p-1 rounded hover:bg-gray-100 ${isLight ? "text-gray-600" : "text-gray-400"}`}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleUpdateQuantity(item.code, parseInt(e.target.value) || 0)}
                                className={`w-16 px-2 py-1 text-center border rounded ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-transparent border-white/15 text-white"}`}
                              />
                              <button
                                onClick={() => handleUpdateQuantity(item.code, item.quantity + 1)}
                                className={`p-1 rounded hover:bg-gray-100 ${isLight ? "text-gray-600" : "text-gray-400"}`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={item.unit}
                              onChange={(e) => handleUpdateUnit(item.code, e.target.value)}
                              className={`w-full px-2 py-1 text-xs border rounded ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-transparent border-white/15 text-white"}`}
                            >
                              <option value="UND">UND</option>
                              <option value="KG">KG</option>
                              <option value="LB">LB</option>
                              <option value="M">M</option>
                              <option value="L">L</option>
                              <option value="CAJA">CAJA</option>
                              <option value="PAQ">PAQ</option>
                            </select>
                          </td>
                          <td className="py-2 px-3">
                            <button
                              onClick={() => handleRemoveItem(item.code)}
                              className="p-1 rounded hover:bg-red-50 text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={`text-center py-12 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                  <FileText className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                  <p className={`text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    No hay productos agregados
                  </p>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Busca y agrega productos para continuar
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Proceso SRI */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Proceso de Autorización SRI
                </h3>
                <p className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Guía: {guideNumber}
                </p>
              </div>

              {/* Stepper horizontal */}
              <div className="flex items-center justify-between px-4">
                {[
                  { num: 1, label: "Generación XML", icon: FileText },
                  { num: 2, label: "Validación", icon: CheckCircle2 },
                  { num: 3, label: "Firma Digital", icon: FileCheck },
                  { num: 4, label: "Envío al SRI", icon: Send },
                  { num: 5, label: "Autorización", icon: Shield },
                ].map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = sriStep === s.num;
                  const isDone = sriStep > s.num;
                  
                  return (
                    <div key={s.num} className="flex flex-col items-center relative flex-1">
                      {/* Círculo */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${
                          isDone
                            ? "bg-green-500"
                            : isActive
                            ? "bg-primary"
                            : isLight
                            ? "bg-gray-200"
                            : "bg-white/10"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : isActive ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Icon className={`w-6 h-6 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                        )}
                      </div>

                      {/* Línea conectora */}
                      {idx < 4 && (
                        <div
                          className={`absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 transition-all duration-500 ${
                            isDone ? "bg-green-500" : isLight ? "bg-gray-200" : "bg-white/10"
                          }`}
                        />
                      )}

                      {/* Label */}
                      <div className={`mt-3 text-xs text-center font-medium ${isActive || isDone ? (isLight ? "text-gray-900" : "text-white") : isLight ? "text-gray-500" : "text-gray-400"}`}>
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mensaje de autorización */}
              {sriStep === 5 && authorizationNumber && (
                <div className={`p-4 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20"}`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className={`text-sm font-semibold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                        ¡Guía autorizada exitosamente!
                      </div>
                      <div className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Clave de acceso:
                      </div>
                      <div className={`text-xs font-mono mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                        {authorizationNumber}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
          <button
            onClick={() => {
              if (step > 1) setStep((step - 1) as 1 | 2 | 3 | 4);
              else onClose();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isLight
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-300 hover:bg-white/5"
            }`}
          >
            {step === 1 ? "Cancelar" : "Atrás"}
          </button>
          
          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4)}
                disabled={
                  (step === 1 && !canGoToStep2) ||
                  (step === 2 && !canGoToStep3) ||
                  (step === 3 && !canGoToStep4)
                }
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  (step === 1 && !canGoToStep2) ||
                  (step === 2 && !canGoToStep3) ||
                  (step === 3 && !canGoToStep4)
                    ? isLight
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white/10 text-gray-500 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                Continuar
              </button>
            ) : (
              sriStep === 5 && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Finalizar
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}