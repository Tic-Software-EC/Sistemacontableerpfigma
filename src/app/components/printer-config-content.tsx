import { useState } from "react";
import {
  Printer,
  FileText,
  AlertCircle,
  Settings,
  Building2,
} from "lucide-react";

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

interface Printer {
  id: string;
  name: string;
  type: string;
  ip: string;
  port: string;
  status: "connected" | "disconnected";
  driver: string;
  isDefault: boolean;
  sucursales: string[];
}

export function PrinterConfigContent() {
  const [activeTab, setActiveTab] = useState("documents");
  const [sucursalFilter, setSucursalFilter] = useState<string>("all");

  // Estados para impresoras
  const [printers, setPrinters] = useState<Printer[]>([
    {
      id: "printer-1",
      name: "Impresora Predeterminada",
      type: "Láser",
      ip: "192.168.1.100",
      port: "9100",
      status: "connected",
      driver: "Generic / PCL6",
      isDefault: true,
      sucursales: ["suc-001", "suc-002", "suc-003", "suc-004"],
    },
    {
      id: "printer-2",
      name: "Impresora Térmica - Caja",
      type: "Térmica",
      ip: "192.168.1.101",
      port: "9100",
      status: "connected",
      driver: "ESC/POS",
      isDefault: false,
      sucursales: ["suc-001", "suc-002"],
    },
    {
      id: "printer-3",
      name: "Impresora Guayaquil",
      type: "Láser",
      ip: "192.168.1.102",
      port: "9100",
      status: "disconnected",
      driver: "Generic / PCL6",
      isDefault: false,
      sucursales: ["suc-003"],
    },
  ]);

  const [selectedPrinter, setSelectedPrinter] = useState(printers[0]);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  // Estados para cada tipo de documento
  const [documents, setDocuments] = useState([
    {
      id: "invoice",
      name: "Factura Electrónica",
      format: "A4",
      width: "210",
      height: "297",
      unit: "mm",
      marginTop: "10",
      marginBottom: "10",
      marginLeft: "10",
      marginRight: "10",
      orientation: "portrait",
      printerId: "printer-1",
      copies: "1",
    },
    {
      id: "receipt",
      name: "Recibo",
      format: "ticket",
      width: "80",
      height: "200",
      unit: "mm",
      marginTop: "5",
      marginBottom: "5",
      marginLeft: "5",
      marginRight: "5",
      orientation: "portrait",
      printerId: "printer-2",
      copies: "1",
    },
    {
      id: "payment-voucher",
      name: "Comprobante de Pago",
      format: "custom",
      width: "210",
      height: "148",
      unit: "mm",
      marginTop: "10",
      marginBottom: "10",
      marginLeft: "15",
      marginRight: "15",
      orientation: "landscape",
      printerId: "printer-1",
      copies: "2",
    },
    {
      id: "goods-transfer",
      name: "Traslado de Mercaderías",
      format: "A4",
      width: "210",
      height: "297",
      unit: "mm",
      marginTop: "15",
      marginBottom: "15",
      marginLeft: "20",
      marginRight: "20",
      orientation: "portrait",
      printerId: "printer-1",
      copies: "2",
    },
  ]);

  const [selectedDoc, setSelectedDoc] = useState(documents[0]);

  const handleUpdateDocument = (field: string, value: string) => {
    const updatedDoc = { ...selectedDoc, [field]: value };
    setSelectedDoc(updatedDoc);
    
    setDocuments(documents.map(doc => 
      doc.id === updatedDoc.id ? updatedDoc : doc
    ));
  };

  const handleUpdatePrinter = (field: string, value: string | boolean | string[]) => {
    const updatedPrinter = { ...selectedPrinter, [field]: value } as Printer;
    setSelectedPrinter(updatedPrinter);
    
    setPrinters(printers.map(printer => 
      printer.id === updatedPrinter.id ? updatedPrinter : printer
    ));
  };

  const toggleSucursal = (sucursalId: string) => {
    const currentSucursales = selectedPrinter.sucursales;
    if (currentSucursales.includes(sucursalId)) {
      handleUpdatePrinter("sucursales", currentSucursales.filter(id => id !== sucursalId));
    } else {
      handleUpdatePrinter("sucursales", [...currentSucursales, sucursalId]);
    }
  };

  const selectAllSucursales = () => {
    handleUpdatePrinter("sucursales", SUCURSALES.map(s => s.id));
  };

  const deselectAllSucursales = () => {
    handleUpdatePrinter("sucursales", []);
  };

  const handleTestConnection = async (printerId: string) => {
    setTestingConnection(printerId);
    
    // Simular prueba de conexión
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3; // 70% de éxito
    
    setPrinters(printers.map(printer => 
      printer.id === printerId 
        ? { ...printer, status: success ? "connected" : "disconnected" }
        : printer
    ));
    
    setTestingConnection(null);
    
    if (success) {
      alert("✓ Conexión exitosa con la impresora");
    } else {
      alert("✗ No se pudo conectar con la impresora. Verifique IP y puerto.");
    }
  };

  const handleAddPrinter = () => {
    const newPrinter: Printer = {
      id: `printer-${Date.now()}`,
      name: "Nueva Impresora",
      type: "Láser",
      ip: "192.168.1.103",
      port: "9100",
      status: "disconnected",
      driver: "Generic / PCL6",
      isDefault: false,
      sucursales: [],
    };
    setPrinters([...printers, newPrinter]);
    setSelectedPrinter(newPrinter);
  };

  const handleDeletePrinter = (printerId: string) => {
    if (printers.length === 1) {
      alert("No puedes eliminar la única impresora");
      return;
    }
    if (window.confirm("¿Estás seguro de eliminar esta impresora?")) {
      setPrinters(printers.filter(p => p.id !== printerId));
      setSelectedPrinter(printers[0]);
    }
  };

  const handleSave = () => {
    console.log("Guardando configuración de impresión...", { documents, printers });
    alert("Configuración de impresión guardada exitosamente");
  };

  const getPrinterName = (printerId: string) => {
    return printers.find(p => p.id === printerId)?.name || "Sin asignar";
  };

  const getSucursalName = (id: string) => {
    return SUCURSALES.find(s => s.id === id)?.name || id;
  };

  // Filtrado de impresoras por sucursal
  const filteredPrinters = printers.filter(printer => {
    if (sucursalFilter === "all") return true;
    return printer.sucursales.includes(sucursalFilter);
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header con título y botón */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Printer className="w-8 h-8 text-primary" />
            Configuración de Impresión
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona impresoras y formatos de impresión por documento
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium"
        >
          Guardar Cambios
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Custom Tabs */}
      <div className="bg-[#0D1B2A] border border-white/10 rounded-xl p-1 inline-flex gap-1">
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
            activeTab === "documents"
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <FileText className="w-4 h-4" />
          Configuración de Documentos
        </button>
        <button
          onClick={() => setActiveTab("printers")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
            activeTab === "printers"
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Settings className="w-4 h-4" />
          Gestión de Impresoras
        </button>
      </div>

      {/* Tab: Configuración de Documentos */}
      {activeTab === "documents" && (
        <div className="mt-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Lista de documentos */}
            <div className="col-span-4 space-y-3">
              <h3 className="text-white font-bold text-lg mb-4">Tipos de Documentos</h3>
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedDoc.id === doc.id
                      ? "bg-primary text-white"
                      : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{doc.name}</div>
                      <div className={`text-xs ${selectedDoc.id === doc.id ? "text-white/70" : "text-gray-500"}`}>
                        {getPrinterName(doc.printerId)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Configuración del documento seleccionado */}
            <div className="col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-white font-bold text-xl">{selectedDoc.name}</h3>
              </div>

              <div className="space-y-6">
                {/* Impresora asignada */}
                <div>
                  <h4 className="text-white font-medium mb-4">Impresora</h4>
                  <select
                    value={selectedDoc.printerId}
                    onChange={(e) => handleUpdateDocument("printerId", e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    {printers.map(printer => (
                      <option key={printer.id} value={printer.id}>
                        {printer.name} {printer.isDefault ? "(Predeterminada)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Formato y Orientación */}
                <div>
                  <h4 className="text-white font-medium mb-4">Formato y Orientación</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Formato
                      </label>
                      <select
                        value={selectedDoc.format}
                        onChange={(e) => handleUpdateDocument("format", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="A4">A4 (210x297mm)</option>
                        <option value="A5">A5 (148x210mm)</option>
                        <option value="letter">Carta (216x279mm)</option>
                        <option value="ticket">Ticket (80mm)</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Orientación
                      </label>
                      <select
                        value={selectedDoc.orientation}
                        onChange={(e) => handleUpdateDocument("orientation", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="portrait">Vertical</option>
                        <option value="landscape">Horizontal</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Dimensiones personalizadas */}
                <div>
                  <h4 className="text-white font-medium mb-4">Dimensiones</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Ancho
                      </label>
                      <input
                        type="number"
                        value={selectedDoc.width}
                        onChange={(e) => handleUpdateDocument("width", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Alto
                      </label>
                      <input
                        type="number"
                        value={selectedDoc.height}
                        onChange={(e) => handleUpdateDocument("height", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Unidad
                      </label>
                      <select
                        value={selectedDoc.unit}
                        onChange={(e) => handleUpdateDocument("unit", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="in">pulgadas</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Márgenes */}
                <div>
                  <h4 className="text-white font-medium mb-4">Márgenes ({selectedDoc.unit})</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Superior
                      </label>
                      <input
                        type="number"
                        value={selectedDoc.marginTop}
                        onChange={(e) => handleUpdateDocument("marginTop", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Inferior
                      </label>
                      <input
                        type="number"
                        value={selectedDoc.marginBottom}
                        onChange={(e) => handleUpdateDocument("marginBottom", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Izquierdo
                      </label>
                      <input
                        type="number"
                        value={selectedDoc.marginLeft}
                        onChange={(e) => handleUpdateDocument("marginLeft", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Derecho
                      </label>
                      <input
                        type="number"
                        value={selectedDoc.marginRight}
                        onChange={(e) => handleUpdateDocument("marginRight", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Copias */}
                <div>
                  <h4 className="text-white font-medium mb-4">Opciones de impresión</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Número de copias
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={selectedDoc.copies}
                        onChange={(e) => handleUpdateDocument("copies", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview visual */}
                <div className="bg-[#0f1825] border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-medium mb-4">Vista Previa</h4>
                  <div className="flex items-center justify-center p-8">
                    <div 
                      className="bg-white relative flex items-center justify-center shadow-xl"
                      style={{
                        width: selectedDoc.orientation === "portrait" ? "150px" : "250px",
                        height: selectedDoc.orientation === "portrait" ? "200px" : "150px",
                        padding: `${parseInt(selectedDoc.marginTop) / 2}px ${parseInt(selectedDoc.marginRight) / 2}px ${parseInt(selectedDoc.marginBottom) / 2}px ${parseInt(selectedDoc.marginLeft) / 2}px`
                      }}
                    >
                      <div className="border-2 border-dashed border-gray-400 w-full h-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs text-center">
                          {selectedDoc.name}<br/>
                          {selectedDoc.width}x{selectedDoc.height}{selectedDoc.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Gestión de Impresoras */}
      {activeTab === "printers" && (
        <div className="mt-6">
          {/* Filtro por sucursal */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1 relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={sucursalFilter}
                onChange={(e) => setSucursalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="all">Todas las sucursales</option>
                {SUCURSALES.map((sucursal) => (
                  <option key={sucursal.id} value={sucursal.id}>
                    {sucursal.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Lista de impresoras */}
            <div className="col-span-4 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">
                  Impresoras ({filteredPrinters.length})
                </h3>
                <button
                  onClick={handleAddPrinter}
                  className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-sm rounded-lg transition-colors"
                >
                  + Agregar
                </button>
              </div>
              {filteredPrinters.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <Printer className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    No hay impresoras en esta sucursal
                  </p>
                </div>
              ) : (
                filteredPrinters.map((printer) => (
                  <button
                    key={printer.id}
                    onClick={() => setSelectedPrinter(printer)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedPrinter.id === printer.id
                        ? "bg-primary text-white"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Printer className="w-5 h-5 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{printer.name}</div>
                        <div className={`text-xs ${selectedPrinter.id === printer.id ? "text-white/70" : "text-gray-500"}`}>
                          {printer.type} • {printer.ip}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className={`w-2 h-2 rounded-full ${
                            printer.status === "connected" ? "bg-green-500" : "bg-red-500"
                          }`}></div>
                          <span className={`text-xs ${selectedPrinter.id === printer.id ? "text-white/70" : "text-gray-500"}`}>
                            {printer.status === "connected" ? "Conectada" : "Desconectada"}
                          </span>
                        </div>
                        <div className={`text-xs mt-1 ${selectedPrinter.id === printer.id ? "text-white/70" : "text-gray-500"}`}>
                          {printer.sucursales.length} sucursal(es)
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Configuración de la impresora seleccionada */}
            <div className="col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Printer className="w-5 h-5 text-primary" />
                  <h3 className="text-white font-bold text-xl">{selectedPrinter.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTestConnection(selectedPrinter.id)}
                    disabled={testingConnection === selectedPrinter.id}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                  >
                    {testingConnection === selectedPrinter.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Probando...
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        Probar Conexión
                      </>
                    )}
                  </button>
                  {!selectedPrinter.isDefault && (
                    <button
                      onClick={() => handleDeletePrinter(selectedPrinter.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Información General */}
                <div>
                  <h4 className="text-white font-medium mb-4">Información General</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Nombre de la impresora
                      </label>
                      <input
                        type="text"
                        value={selectedPrinter.name}
                        onChange={(e) => handleUpdatePrinter("name", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Tipo
                      </label>
                      <select
                        value={selectedPrinter.type}
                        onChange={(e) => handleUpdatePrinter("type", e.target.value)}
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="Láser">Láser</option>
                        <option value="Térmica">Térmica</option>
                        <option value="Inyección de tinta">Inyección de tinta</option>
                        <option value="Matricial">Matricial</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sucursales */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">
                      Sucursales donde está disponible
                    </h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={selectAllSucursales}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Seleccionar todas
                      </button>
                      <span className="text-gray-600">|</span>
                      <button
                        type="button"
                        onClick={deselectAllSucursales}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Deseleccionar todas
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#0D1B2A] border border-white/10 rounded-lg p-4 space-y-3">
                    {SUCURSALES.map((sucursal) => (
                      <div key={sucursal.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`printer-sucursal-${sucursal.id}`}
                          checked={selectedPrinter.sucursales.includes(sucursal.id)}
                          onChange={() => toggleSucursal(sucursal.id)}
                          className="w-5 h-5 bg-[#0f1825] border border-white/10 rounded text-primary focus:ring-2 focus:ring-primary/40 cursor-pointer"
                        />
                        <label
                          htmlFor={`printer-sucursal-${sucursal.id}`}
                          className="text-white text-sm cursor-pointer flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4 text-blue-400" />
                          {sucursal.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  <p className="text-green-400 text-xs mt-2">
                    {selectedPrinter.sucursales.length} sucursal(es) seleccionada(s)
                  </p>
                </div>

                {/* Conexión de red */}
                <div>
                  <h4 className="text-white font-medium mb-4">Conexión de Red</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Dirección IP
                      </label>
                      <input
                        type="text"
                        value={selectedPrinter.ip}
                        onChange={(e) => handleUpdatePrinter("ip", e.target.value)}
                        placeholder="192.168.1.100"
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Puerto
                      </label>
                      <input
                        type="text"
                        value={selectedPrinter.port}
                        onChange={(e) => handleUpdatePrinter("port", e.target.value)}
                        placeholder="9100"
                        className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Driver */}
                <div>
                  <h4 className="text-white font-medium mb-4">Driver</h4>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2 font-medium">
                      Driver de impresora
                    </label>
                    <select
                      value={selectedPrinter.driver}
                      onChange={(e) => handleUpdatePrinter("driver", e.target.value)}
                      className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="Generic / PCL6">Generic / PCL6</option>
                      <option value="ESC/POS">ESC/POS (Térmica)</option>
                      <option value="PostScript">PostScript</option>
                      <option value="HP LaserJet">HP LaserJet</option>
                      <option value="Epson">Epson</option>
                      <option value="Canon">Canon</option>
                    </select>
                  </div>
                </div>

                {/* Opciones */}
                <div>
                  <h4 className="text-white font-medium mb-4">Opciones</h4>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPrinter.isDefault}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Desmarcar todas las demás impresoras
                          setPrinters(printers.map(p => ({
                            ...p,
                            isDefault: p.id === selectedPrinter.id
                          })));
                          setSelectedPrinter({ ...selectedPrinter, isDefault: true });
                        } else {
                          handleUpdatePrinter("isDefault", false);
                        }
                      }}
                      className="w-5 h-5 bg-[#0f1825] border border-white/10 rounded text-primary focus:ring-2 focus:ring-primary/40 cursor-pointer"
                    />
                    <span className="text-white text-sm">
                      Establecer como impresora predeterminada
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}