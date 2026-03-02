import { useState, useRef } from "react";
import { X, Upload, Package, DollarSign, Warehouse, Tag, Plus, Trash2, Settings, QrCode, Printer, Building2, Barcode as BarcodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData?: any; // Datos del producto para editar
  mode?: "create" | "edit"; // Modo del modal
}

interface Characteristic {
  id: string;
  name: string;
  value: string;
}

export function NewProductModal({ isOpen, onClose, productData, mode = "create" }: NewProductModalProps) {
  // Obtener el porcentaje de ganancia desde localStorage (parametrizado)
  const defaultProfitMargin = parseFloat(localStorage.getItem("defaultProfitMargin") || "30");

  const [activeTab, setActiveTab] = useState<"info" | "inventory" | "characteristics" | "qr">("info");
  const qrRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    code: productData?.code || "",
    name: productData?.name || "",
    category: productData?.category || "",
    description: productData?.description || "",
    supplier: productData?.supplier || "",
    warehouse: productData?.warehouse || "",
    quantity: productData?.quantity || "",
    minStock: productData?.minStock || "",
    maxStock: productData?.maxStock || "",
    unit: productData?.unit || "UND",
    unitsPerPackage: productData?.unitsPerPackage || "",
    costPrice: productData?.costPrice || "",
    salePrice: productData?.salePrice || "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(productData?.imagePreview || null);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>(productData?.characteristics || []);
  const [manualPriceEdit, setManualPriceEdit] = useState(false);
  const [codeType, setCodeType] = useState<"qr" | "barcode">("qr"); // Tipo de código a mostrar

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el producto
    const productData = {
      ...formData,
      status: "activo", // Siempre inicia como activo
      characteristics,
    };
    console.log("Producto a guardar:", productData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Si se cambia el precio de costo, calcular automáticamente el precio de venta
    if (name === "costPrice" && value && !manualPriceEdit) {
      const cost = parseFloat(value);
      const salePrice = cost * (1 + defaultProfitMargin / 100);
      setFormData(prev => ({ 
        ...prev, 
        costPrice: value, 
        salePrice: salePrice.toFixed(2) 
      }));
    } else if (name === "salePrice") {
      // Si el usuario edita manualmente el precio de venta, marcar como edición manual
      setManualPriceEdit(true);
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addCharacteristic = () => {
    setCharacteristics([
      ...characteristics,
      { id: Date.now().toString(), name: "", value: "" }
    ]);
  };

  const removeCharacteristic = (id: string) => {
    setCharacteristics(characteristics.filter(char => char.id !== id));
  };

  const updateCharacteristic = (id: string, field: "name" | "value", value: string) => {
    setCharacteristics(
      characteristics.map(char =>
        char.id === id ? { ...char, [field]: value } : char
      )
    );
  };

  // Determinar si necesita mostrar el campo de unidades por empaque
  const needsPackageUnits = ["CAJA", "PAQUETE", "DOCENA", "PACK"].includes(formData.unit);

  // Generar datos para el QR (JSON con info del producto)
  const qrData = JSON.stringify({
    code: formData.code || "PENDING",
    name: formData.name || "Sin nombre",
    category: formData.category,
    price: formData.salePrice,
    supplier: formData.supplier,
  });

  const handlePrintQR = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const contentRef = codeType === "qr" ? qrRef.current : barcodeRef.current;
    const codeContent = contentRef?.innerHTML || "";
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Imprimir ${codeType === "qr" ? "QR" : "Código de Barras"} - ${formData.name || formData.code}</title>
          <style>
            @media print {
              @page { 
                size: ${codeType === "qr" ? "80mm 80mm" : "100mm 40mm"};
                margin: 0;
              }
            }
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .code-container {
              text-align: center;
              border: 2px dashed #E8692E;
              padding: 20px;
              border-radius: 10px;
              background: white;
            }
            .product-name {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #0D1B2A;
            }
            .product-code {
              font-size: 12px;
              color: #666;
              margin-bottom: 15px;
              font-family: monospace;
            }
            .product-price {
              font-size: 18px;
              font-weight: bold;
              color: #E8692E;
              margin-top: 10px;
            }
            svg {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="code-container">
            <div class="product-name">${formData.name || "Producto sin nombre"}</div>
            <div class="product-code">COD: ${formData.code || "PENDING"}</div>
            ${codeContent}
            <div class="product-price">$${formData.salePrice || "0.00"}</div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 250);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const tabs = [
    { id: "info", name: "Información General", icon: Tag },
    { id: "inventory", name: "Inventario y Precios", icon: Warehouse },
    { id: "characteristics", name: "Características", icon: Package },
    { id: "qr", name: "Código QR", icon: QrCode },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-secondary border border-white/10 rounded-xl p-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              {mode === "create" ? "Nuevo Producto" : "Editar Producto"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 border-b border-white/10 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-primary text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tab Content */}
          <div className="min-h-[420px]">
            {/* Información General */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Columna Imagen */}
                <div className="space-y-3">
                  {/* Upload de Imagen */}
                  <div>
                    <label className="block text-gray-300 text-xs font-medium mb-1.5">
                      Imagen del Producto
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="product-image"
                      />
                      <label
                        htmlFor="product-image"
                        className="block w-full h-36 bg-[#1a2332] border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Upload className="w-8 h-8 mb-1" />
                            <span className="text-xs">Subir imagen</span>
                            <span className="text-[10px] mt-0.5">PNG, JPG</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Estado - Siempre Activo */}
                  <div className="px-2.5 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-green-400 text-xs font-medium">✓ Estado: Activo</span>
                  </div>
                </div>

                {/* Columnas de Formulario */}
                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  {/* Código */}
                  <div>
                    <label className="block text-gray-300 text-xs font-medium mb-1.5">
                      Código del Producto *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="PROD-001"
                      required
                      className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors font-mono"
                    />
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="block text-gray-300 text-xs font-medium mb-1.5">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Laptop Dell Inspiron 15"
                      required
                      className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="block text-gray-300 text-xs font-medium mb-1.5">
                      Categoría *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Papelería">Papelería</option>
                      <option value="Muebles">Muebles</option>
                      <option value="Electrónica">Electrónica</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>

                  {/* Proveedor */}
                  <div>
                    <label className="block text-gray-300 text-xs font-medium mb-1.5">
                      Proveedor *
                    </label>
                    <select
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="">Seleccionar proveedor</option>
                      <option value="TechSupplies Ltda.">TechSupplies Ltda.</option>
                      <option value="Distribuidora Nacional">Distribuidora Nacional</option>
                      <option value="Importaciones del Pacífico">Importaciones del Pacífico</option>
                      <option value="Suministros Corporativos">Suministros Corporativos</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  {/* Descripción */}
                  <div className="col-span-2">
                    <label className="block text-gray-300 text-xs font-medium mb-1.5">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Descripción detallada del producto..."
                      rows={3}
                      className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Inventario y Precios */}
            {activeTab === "inventory" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Columna Izquierda: Inventario */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Warehouse className="w-5 h-5 text-primary" />
                    <h4 className="text-white font-semibold text-base">Inventario</h4>
                  </div>

                  {/* Almacén */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Almacén *
                    </label>
                    <select
                      name="warehouse"
                      value={formData.warehouse}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="">Seleccionar almacén</option>
                      <option value="Almacén Principal">Almacén Principal</option>
                      <option value="Sucursal Norte">Sucursal Norte</option>
                      <option value="Sucursal Sur">Sucursal Sur</option>
                    </select>
                  </div>

                  {/* Unidad de Medida */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Unidad de Medida *
                    </label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="UND">Unidad (UND)</option>
                      <option value="KG">Kilogramo (KG)</option>
                      <option value="LT">Litro (LT)</option>
                      <option value="MT">Metro (MT)</option>
                      <option value="CAJA">Caja</option>
                      <option value="PAQUETE">Paquete</option>
                      <option value="DOCENA">Docena</option>
                      <option value="PACK">Pack</option>
                    </select>
                  </div>

                  {/* Unidades por Empaque - Condicional */}
                  {needsPackageUnits && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Unidades por {formData.unit === "CAJA" ? "caja" : formData.unit === "PAQUETE" ? "paquete" : formData.unit === "DOCENA" ? "docena" : "pack"} *
                      </label>
                      <input
                        type="number"
                        name="unitsPerPackage"
                        value={formData.unitsPerPackage}
                        onChange={handleChange}
                        placeholder="Ej: 12"
                        min="1"
                        required
                        className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  )}

                  {/* Stock Inicial */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Stock Inicial *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      required
                      className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {needsPackageUnits && formData.unitsPerPackage && formData.quantity && (
                      <p className="text-xs text-primary mt-1.5">
                        = {parseInt(formData.quantity) * parseInt(formData.unitsPerPackage)} unidades totales
                      </p>
                    )}
                  </div>

                  {/* Stock Mínimo y Máximo */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Stock Mín. *
                      </label>
                      <input
                        type="number"
                        name="minStock"
                        value={formData.minStock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        required
                        className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Stock Máx. *
                      </label>
                      <input
                        type="number"
                        name="maxStock"
                        value={formData.maxStock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        required
                        className="w-full px-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Precios */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      <h4 className="text-white font-semibold text-base">Precios</h4>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 rounded-md">
                      <Settings className="w-3.5 h-3.5 text-primary" />
                      <span className="text-primary text-xs font-medium">{defaultProfitMargin}%</span>
                    </div>
                  </div>

                  {/* Precio de Costo */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Precio de Costo *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="w-full pl-7 pr-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    {!manualPriceEdit && formData.costPrice && (
                      <p className="text-xs text-primary mt-1.5">
                        ⚡ Cálculo automático activado
                      </p>
                    )}
                  </div>

                  {/* Precio de Venta */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Precio de Venta * {manualPriceEdit && <span className="text-yellow-400 text-xs">(Manual)</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                        className="w-full pl-7 pr-3 py-2 bg-[#1a2332] border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    {manualPriceEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          setManualPriceEdit(false);
                          if (formData.costPrice) {
                            const cost = parseFloat(formData.costPrice);
                            const salePrice = cost * (1 + defaultProfitMargin / 100);
                            setFormData(prev => ({ ...prev, salePrice: salePrice.toFixed(2) }));
                          }
                        }}
                        className="text-xs text-primary hover:underline mt-1.5"
                      >
                        ↺ Recalcular automático
                      </button>
                    )}
                  </div>

                  {/* Margen de Ganancia */}
                  {formData.costPrice && formData.salePrice && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Margen de Ganancia</p>
                      <p className="text-primary font-bold text-2xl">
                        {((parseFloat(formData.salePrice) - parseFloat(formData.costPrice)) / parseFloat(formData.costPrice) * 100).toFixed(2)}%
                      </p>
                      <p className="text-sm text-gray-300 mt-1.5">
                        Ganancia: <span className="text-primary font-bold">${(parseFloat(formData.salePrice) - parseFloat(formData.costPrice)).toFixed(2)}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Características */}
            {activeTab === "characteristics" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold text-base">Características del Producto</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Agrega características específicas (color, tamaño, material, etc.)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addCharacteristic}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar
                  </button>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto">
                  {characteristics.length === 0 ? (
                    <div className="text-center py-12 bg-[#1a2332] border border-white/10 rounded-lg">
                      <Package className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No hay características agregadas</p>
                    </div>
                  ) : (
                    characteristics.map((char, index) => (
                      <div key={char.id} className="flex gap-3 items-center bg-[#1a2332] p-3 rounded-lg border border-white/10">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          placeholder="Característica"
                          value={char.name}
                          onChange={(e) => updateCharacteristic(char.id, "name", e.target.value)}
                          className="flex-1 px-3 py-2 bg-secondary border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="Valor"
                          value={char.value}
                          onChange={(e) => updateCharacteristic(char.id, "value", e.target.value)}
                          className="flex-1 px-3 py-2 bg-secondary border border-white/10 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeCharacteristic(char.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Código QR y Barras */}
            {activeTab === "qr" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-semibold text-base">Códigos de Identificación</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Genera e imprime códigos QR o de barras para tu producto
                    </p>
                  </div>
                  {/* Selector de tipo de código */}
                  <div className="flex items-center gap-2 bg-[#1a2332] p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCodeType("qr")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-sm ${
                        codeType === "qr"
                          ? "bg-primary text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeType("barcode")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-sm ${
                        codeType === "barcode"
                          ? "bg-primary text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <BarcodeIcon className="w-4 h-4" />
                      Código de Barras
                    </button>
                  </div>
                </div>

                <div className="bg-[#1a2332] border border-white/10 rounded-lg p-5">
                  {/* Código QR */}
                  {codeType === "qr" && (
                    <div ref={qrRef} className="flex flex-col items-center justify-center">
                      {formData.code || formData.name ? (
                        <>
                          <div className="bg-white p-4 rounded-lg mb-3">
                            <QRCodeSVG
                              value={qrData}
                              size={180}
                              level="H"
                              includeMargin={true}
                            />
                          </div>
                          <div className="text-center space-y-1.5">
                            <p className="text-white font-bold text-base">{formData.name || "Producto sin nombre"}</p>
                            <p className="text-gray-400 text-sm font-mono">COD: {formData.code || "PENDING"}</p>
                            {formData.salePrice && (
                              <p className="text-primary text-xl font-bold">${formData.salePrice}</p>
                            )}
                            {formData.supplier && (
                              <p className="text-gray-500 text-xs">Proveedor: {formData.supplier}</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <QrCode className="w-14 h-14 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400 text-sm">Completa al menos el código o nombre</p>
                          <p className="text-gray-500 text-xs mt-1">para generar el código QR</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Código de Barras */}
                  {codeType === "barcode" && (
                    <div ref={barcodeRef} className="flex flex-col items-center justify-center">
                      {formData.code ? (
                        <>
                          <div className="bg-white p-4 rounded-lg mb-3 max-w-full overflow-hidden">
                            <Barcode 
                              value={formData.code} 
                              format="CODE128"
                              width={2}
                              height={80}
                              displayValue={true}
                              fontSize={14}
                              margin={10}
                            />
                          </div>
                          <div className="text-center space-y-1.5">
                            <p className="text-white font-bold text-base">{formData.name || "Producto sin nombre"}</p>
                            {formData.salePrice && (
                              <p className="text-primary text-xl font-bold">${formData.salePrice}</p>
                            )}
                            {formData.supplier && (
                              <p className="text-gray-500 text-xs">Proveedor: {formData.supplier}</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12">
                          <BarcodeIcon className="w-14 h-14 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400 text-sm">Ingresa un código de producto</p>
                          <p className="text-gray-500 text-xs mt-1">para generar el código de barras</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Botón de imprimir */}
                  {((codeType === "qr" && (formData.code || formData.name)) || (codeType === "barcode" && formData.code)) && (
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={handlePrintQR}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors text-sm shadow-lg shadow-primary/20"
                      >
                        <Printer className="w-4 h-4" />
                        Imprimir {codeType === "qr" ? "Código QR" : "Código de Barras"}
                      </button>
                      <p className="text-gray-500 text-xs text-center mt-2">
                        {codeType === "qr" ? "Formato de etiqueta 80mm x 80mm" : "Formato de etiqueta 100mm x 40mm"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10 mt-4">
            <div className="text-xs text-gray-500">
              {activeTab === "info" && "1/4"}
              {activeTab === "inventory" && "2/4"}
              {activeTab === "characteristics" && "3/4"}
              {activeTab === "qr" && "4/4"}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-xs"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium shadow-lg shadow-primary/20 text-xs"
              >
                {mode === "create" ? "Guardar Producto" : "Actualizar Producto"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}