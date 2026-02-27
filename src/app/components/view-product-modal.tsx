import { X, Package, Tag, Warehouse, DollarSign, QrCode, Printer, Barcode as BarcodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import { useState, useRef } from "react";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

export function ViewProductModal({ isOpen, onClose, product }: ViewProductModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "characteristics" | "qr">("info");
  const [codeType, setCodeType] = useState<"qr" | "barcode">("qr");
  const qrRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !product) return null;

  const qrData = JSON.stringify({
    code: product.code,
    name: product.productName,
    category: product.category,
    price: product.salePrice,
    warehouse: product.warehouse,
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
          <title>Imprimir ${codeType === "qr" ? "QR" : "Código de Barras"} - ${product.productName}</title>
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
            <div class="product-name">${product.productName}</div>
            <div class="product-code">COD: ${product.code}</div>
            ${codeContent}
            <div class="product-price">$${product.salePrice.toFixed(2)}</div>
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
    { id: "info", name: "Información del Producto", icon: Package },
    { id: "characteristics", name: "Características", icon: Tag },
    { id: "qr", name: "Códigos", icon: QrCode },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      normal: { bg: "bg-green-500/10", text: "text-green-400", label: "Normal" },
      low: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Stock Bajo" },
      critical: { bg: "bg-red-500/10", text: "text-red-400", label: "Crítico" },
      overstock: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Sobrestock" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-secondary border border-white/10 rounded-xl p-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              Detalle del Producto
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
        <div className="flex items-center gap-1 mb-5 border-b border-white/10 overflow-x-auto">
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

        {/* Tab Content */}
        <div className="min-h-[450px]">
          {/* Información */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Imagen y Estado */}
              <div className="space-y-3">
                <div className="w-full h-48 bg-[#1a2332] border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                  {product.imagePreview ? (
                    <img src={product.imagePreview} alt={product.productName} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-16 h-16 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-2">Estado del Stock</p>
                  {getStatusBadge(product.status)}
                </div>
              </div>

              {/* Detalles del Producto */}
              <div className="md:col-span-2 space-y-4">
                {/* Información General */}
                <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-5 h-5 text-primary" />
                    <h4 className="text-white font-semibold text-base">Información General</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Código</p>
                      <p className="text-white text-sm font-mono">{product.code}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Nombre</p>
                      <p className="text-white text-sm">{product.productName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Categoría</p>
                      <p className="text-white text-sm">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Unidad de Medida</p>
                      <p className="text-white text-sm">{product.unit}</p>
                    </div>
                  </div>
                </div>

                {/* Inventario */}
                <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Warehouse className="w-5 h-5 text-primary" />
                    <h4 className="text-white font-semibold text-base">Inventario</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Almacén</p>
                      <p className="text-white text-sm">{product.warehouse}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Stock Actual</p>
                      <p className="text-white text-sm font-bold">{product.quantity} {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Stock Mínimo</p>
                      <p className="text-white text-sm">{product.minStock} {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Stock Máximo</p>
                      <p className="text-white text-sm">{product.maxStock} {product.unit}</p>
                    </div>
                  </div>
                </div>

                {/* Precios */}
                <div className="bg-[#1a2332] rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <h4 className="text-white font-semibold text-base">Precios</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Precio de Costo</p>
                      <p className="text-white text-sm font-medium">${product.costPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Precio de Venta</p>
                      <p className="text-primary text-sm font-bold">${product.salePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Margen de Ganancia</p>
                      <p className="text-green-400 text-sm font-bold">
                        {((product.salePrice - product.costPrice) / product.costPrice * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Características */}
          {activeTab === "characteristics" && (
            <div>
              <div className="mb-4">
                <h4 className="text-white font-semibold text-base flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Características del Producto
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  Especificaciones técnicas y características del producto
                </p>
              </div>

              {/* Lista de Características */}
              <div className="space-y-3">
                {product.characteristics && product.characteristics.length > 0 ? (
                  product.characteristics.map((char: any, index: number) => (
                    <div key={index} className="bg-[#1a2332] border border-white/10 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-0.5">{char.name || "Sin nombre"}</p>
                          <p className="text-white text-sm font-medium">{char.value || "Sin valor"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-[#1a2332] border border-white/10 rounded-lg">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 text-base">No hay características registradas</p>
                    <p className="text-gray-500 text-sm mt-1">Este producto no tiene características adicionales</p>
                  </div>
                )}
              </div>

              {/* Información adicional si existe descripción o proveedor */}
              {(product.description || product.supplier) && (
                <div className="mt-5 space-y-3">
                  {product.description && (
                    <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-2">Descripción</p>
                      <p className="text-white text-sm">{product.description}</p>
                    </div>
                  )}
                  
                  {product.supplier && (
                    <div className="bg-[#1a2332] border border-white/10 rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-2">Proveedor</p>
                      <p className="text-white text-sm">{product.supplier}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Códigos QR y Barras */}
          {activeTab === "qr" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-semibold text-base">Códigos de Identificación</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Visualiza e imprime códigos QR o de barras para este producto
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
                    <div className="bg-white p-4 rounded-lg mb-3">
                      <QRCodeSVG
                        value={qrData}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="text-center space-y-1.5">
                      <p className="text-white font-bold text-lg">{product.productName}</p>
                      <p className="text-gray-400 text-sm font-mono">COD: {product.code}</p>
                      <p className="text-primary text-2xl font-bold">${product.salePrice.toFixed(2)}</p>
                      <p className="text-gray-500 text-xs">Almacén: {product.warehouse}</p>
                    </div>
                  </div>
                )}

                {/* Código de Barras */}
                {codeType === "barcode" && (
                  <div ref={barcodeRef} className="flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-lg mb-3 max-w-full overflow-hidden">
                      <Barcode 
                        value={product.code} 
                        format="CODE128"
                        width={2}
                        height={100}
                        displayValue={true}
                        fontSize={16}
                        margin={10}
                      />
                    </div>
                    <div className="text-center space-y-1.5">
                      <p className="text-white font-bold text-lg">{product.productName}</p>
                      <p className="text-primary text-2xl font-bold">${product.salePrice.toFixed(2)}</p>
                      <p className="text-gray-500 text-xs">Almacén: {product.warehouse}</p>
                    </div>
                  </div>
                )}

                {/* Botón de imprimir */}
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
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}