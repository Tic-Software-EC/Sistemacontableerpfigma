import { useState } from "react";
import { Settings, Building2, Save, Package, DollarSign, FileText, Truck, Calendar, Check, AlertCircle } from "lucide-react";

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

const TAX_OPTIONS = [
  { id: "iva12", name: "IVA 12%", value: "12" },
  { id: "iva0", name: "IVA 0%", value: "0" },
  { id: "ice", name: "ICE", value: "75" },
];

const DOCUMENT_TYPES = [
  { id: "factura", name: "Factura de compra" },
  { id: "nota-credito", name: "Nota de crédito" },
  { id: "nota-debito", name: "Nota de débito" },
  { id: "liquidacion", name: "Liquidación de compra" },
  { id: "retencion", name: "Comprobante de retención" },
];

const PAYMENT_TERMS = [
  { id: "0", name: "Pago inmediato (contado)" },
  { id: "7", name: "7 días" },
  { id: "15", name: "15 días" },
  { id: "30", name: "30 días" },
  { id: "45", name: "45 días" },
  { id: "60", name: "60 días" },
  { id: "90", name: "90 días" },
  { id: "custom", name: "Personalizado" },
];

const APPROVAL_LEVELS = [
  { id: "none", name: "Sin aprobación requerida" },
  { id: "single", name: "Una aprobación" },
  { id: "double", name: "Doble aprobación" },
  { id: "triple", name: "Triple aprobación" },
];

const CURRENCIES = [
  { id: "USD", name: "Dólar estadounidense (USD)", symbol: "$" },
  { id: "EUR", name: "Euro (EUR)", symbol: "€" },
  { id: "COP", name: "Peso colombiano (COP)", symbol: "$" },
  { id: "PEN", name: "Sol peruano (PEN)", symbol: "S/" },
];

interface PurchaseConfig {
  sucursalId: string;
  
  // General
  defaultCurrency: string;
  allowMultiCurrency: boolean;
  defaultTax: string;
  applyTaxByDefault: boolean;
  
  // Documentos
  enabledDocuments: string[];
  requireDocumentNumber: boolean;
  validateDocumentNumber: boolean;
  allowManualEntry: boolean;
  
  // Proveedores
  requireSupplier: boolean;
  allowNewSupplierOnPurchase: boolean;
  requireSupplierRUC: boolean;
  
  // Productos
  allowNewProductOnPurchase: boolean;
  updateCostOnPurchase: boolean;
  updateStockAutomatically: boolean;
  
  // Precios y costos
  allowNegativePrices: boolean;
  roundPrices: boolean;
  decimalPlaces: string;
  
  // Términos de pago
  defaultPaymentTerm: string;
  customPaymentDays: string;
  allowPartialPayments: boolean;
  
  // Aprobaciones
  approvalLevel: string;
  approvalAmountThreshold: string;
  requireApprovalForAllPurchases: boolean;
  
  // Numeración
  useAutoNumbering: boolean;
  purchasePrefix: string;
  nextNumber: string;
  numberLength: string;
}

export function PurchasesConfigContent() {
  const [selectedSucursal, setSelectedSucursal] = useState<string>("suc-001");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [configs, setConfigs] = useState<Record<string, PurchaseConfig>>({
    "suc-001": {
      sucursalId: "suc-001",
      defaultCurrency: "USD",
      allowMultiCurrency: true,
      defaultTax: "iva12",
      applyTaxByDefault: true,
      enabledDocuments: ["factura", "nota-credito", "retencion"],
      requireDocumentNumber: true,
      validateDocumentNumber: true,
      allowManualEntry: true,
      requireSupplier: true,
      allowNewSupplierOnPurchase: true,
      requireSupplierRUC: true,
      allowNewProductOnPurchase: true,
      updateCostOnPurchase: true,
      updateStockAutomatically: true,
      allowNegativePrices: false,
      roundPrices: true,
      decimalPlaces: "2",
      defaultPaymentTerm: "30",
      customPaymentDays: "",
      allowPartialPayments: true,
      approvalLevel: "single",
      approvalAmountThreshold: "1000",
      requireApprovalForAllPurchases: false,
      useAutoNumbering: true,
      purchasePrefix: "COMP",
      nextNumber: "1001",
      numberLength: "6",
    },
    "suc-002": {
      sucursalId: "suc-002",
      defaultCurrency: "USD",
      allowMultiCurrency: false,
      defaultTax: "iva12",
      applyTaxByDefault: true,
      enabledDocuments: ["factura", "retencion"],
      requireDocumentNumber: true,
      validateDocumentNumber: true,
      allowManualEntry: false,
      requireSupplier: true,
      allowNewSupplierOnPurchase: false,
      requireSupplierRUC: true,
      allowNewProductOnPurchase: false,
      updateCostOnPurchase: true,
      updateStockAutomatically: true,
      allowNegativePrices: false,
      roundPrices: true,
      decimalPlaces: "2",
      defaultPaymentTerm: "15",
      customPaymentDays: "",
      allowPartialPayments: false,
      approvalLevel: "double",
      approvalAmountThreshold: "500",
      requireApprovalForAllPurchases: true,
      useAutoNumbering: true,
      purchasePrefix: "CN",
      nextNumber: "2001",
      numberLength: "6",
    },
  });

  const currentConfig = configs[selectedSucursal] || configs["suc-001"];

  const updateConfig = (field: keyof PurchaseConfig, value: any) => {
    setConfigs({
      ...configs,
      [selectedSucursal]: {
        ...currentConfig,
        [field]: value,
      },
    });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log("Guardando configuración de compras...", currentConfig);
    setHasUnsavedChanges(false);
    alert("Configuración guardada exitosamente");
  };

  const toggleDocument = (docId: string) => {
    const enabledDocs = currentConfig.enabledDocuments.includes(docId)
      ? currentConfig.enabledDocuments.filter((id) => id !== docId)
      : [...currentConfig.enabledDocuments, docId];
    updateConfig("enabledDocuments", enabledDocs);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header estándar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Configurar
          </h2>
          <p className="text-gray-400 text-sm">
            Parametrización de compras por sucursal
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasUnsavedChanges}
          className={`px-6 py-2.5 rounded-xl transition-all font-medium flex items-center gap-2 ${
            hasUnsavedChanges
              ? "bg-primary hover:bg-primary/90 text-white"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Save className="w-5 h-5" />
          Guardar Cambios
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Alerta de cambios sin guardar */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-500 font-medium text-sm">
              Tienes cambios sin guardar
            </p>
            <p className="text-yellow-500/80 text-xs mt-1">
              Recuerda guardar tus cambios antes de cambiar de sucursal
            </p>
          </div>
        </div>
      )}

      {/* Selector de sucursal */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <label className="block text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Building2 className="w-8 h-8 text-primary" />
          Sucursal
        </label>
        <select
          value={selectedSucursal}
          onChange={(e) => {
            if (hasUnsavedChanges) {
              if (
                confirm(
                  "Tienes cambios sin guardar. ¿Deseas continuar sin guardar?"
                )
              ) {
                setSelectedSucursal(e.target.value);
                setHasUnsavedChanges(false);
              }
            } else {
              setSelectedSucursal(e.target.value);
            }
          }}
          className="w-full max-w-md px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
        >
          {SUCURSALES.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.name}
            </option>
          ))}
        </select>
      </div>

      {/* Configuración General */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-8 h-8 text-primary" />
          <h3 className="text-white font-semibold text-lg">Configuración General</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Moneda predeterminada */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Moneda predeterminada
            </label>
            <select
              value={currentConfig.defaultCurrency}
              onChange={(e) => updateConfig("defaultCurrency", e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Impuesto predeterminado */}
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Impuesto predeterminado
            </label>
            <select
              value={currentConfig.defaultTax}
              onChange={(e) => updateConfig("defaultTax", e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              {TAX_OPTIONS.map((tax) => (
                <option key={tax.id} value={tax.id}>
                  {tax.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.allowMultiCurrency}
                onChange={(e) => updateConfig("allowMultiCurrency", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.allowMultiCurrency && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Permitir múltiples monedas</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Habilitar compras en diferentes monedas
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.applyTaxByDefault}
                onChange={(e) => updateConfig("applyTaxByDefault", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.applyTaxByDefault && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Aplicar impuesto por defecto</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Aplicar automáticamente el impuesto en nuevas compras
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Configuración de Documentos */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-8 h-8 text-primary" />
          <h3 className="text-white font-semibold text-lg">Documentos de Compra</h3>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-3 font-medium">
            Tipos de documentos habilitados
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DOCUMENT_TYPES.map((doc) => (
              <label
                key={doc.id}
                className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={currentConfig.enabledDocuments.includes(doc.id)}
                    onChange={() => toggleDocument(doc.id)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                    {currentConfig.enabledDocuments.includes(doc.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-white font-medium text-sm">{doc.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.requireDocumentNumber}
                onChange={(e) => updateConfig("requireDocumentNumber", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.requireDocumentNumber && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Requerir número de documento</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Obligatorio ingresar número de factura/documento
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.validateDocumentNumber}
                onChange={(e) => updateConfig("validateDocumentNumber", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.validateDocumentNumber && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Validar formato de documento</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Verificar que el número cumpla con formato oficial
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.allowManualEntry}
                onChange={(e) => updateConfig("allowManualEntry", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.allowManualEntry && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Permitir ingreso manual</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Registrar compras manualmente sin conexión
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Configuración de Proveedores */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="w-8 h-8 text-primary" />
          <h3 className="text-white font-semibold text-lg">Proveedores</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.requireSupplier}
                onChange={(e) => updateConfig("requireSupplier", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.requireSupplier && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Proveedor obligatorio</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Requerir seleccionar proveedor en cada compra
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.allowNewSupplierOnPurchase}
                onChange={(e) => updateConfig("allowNewSupplierOnPurchase", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.allowNewSupplierOnPurchase && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Crear proveedor en compra</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Permitir agregar nuevos proveedores durante la compra
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.requireSupplierRUC}
                onChange={(e) => updateConfig("requireSupplierRUC", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.requireSupplierRUC && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">RUC/ID obligatorio</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Exigir RUC o identificación del proveedor
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Configuración de Productos e Inventario */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-8 h-8 text-primary" />
          <h3 className="text-white font-semibold text-lg">Productos e Inventario</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.allowNewProductOnPurchase}
                onChange={(e) => updateConfig("allowNewProductOnPurchase", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.allowNewProductOnPurchase && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Crear producto en compra</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Permitir agregar nuevos productos durante la compra
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.updateCostOnPurchase}
                onChange={(e) => updateConfig("updateCostOnPurchase", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.updateCostOnPurchase && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Actualizar costo en compra</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Actualizar automáticamente el costo del producto
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.updateStockAutomatically}
                onChange={(e) => updateConfig("updateStockAutomatically", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.updateStockAutomatically && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Actualizar inventario automáticamente</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Incrementar stock al registrar una compra
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Configuración de Precios */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-8 h-8 text-primary" />
          <h3 className="text-white font-semibold text-lg">Precios y Costos</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Decimales en precios
            </label>
            <select
              value={currentConfig.decimalPlaces}
              onChange={(e) => updateConfig("decimalPlaces", e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="0">Sin decimales (0)</option>
              <option value="2">2 decimales (0.00)</option>
              <option value="4">4 decimales (0.0000)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.roundPrices}
                onChange={(e) => updateConfig("roundPrices", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.roundPrices && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Redondear precios</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Redondear automáticamente los precios
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.allowNegativePrices}
                onChange={(e) => updateConfig("allowNegativePrices", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.allowNegativePrices && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Permitir precios negativos</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Habilitar para notas de crédito o devoluciones
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Términos de Pago */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-8 h-8 text-primary" />
          <h3 className="text-white font-semibold text-lg">Términos de Pago</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Plazo de pago predeterminado
            </label>
            <select
              value={currentConfig.defaultPaymentTerm}
              onChange={(e) => updateConfig("defaultPaymentTerm", e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              {PAYMENT_TERMS.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
            </select>
          </div>

          {currentConfig.defaultPaymentTerm === "custom" && (
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Días personalizados
              </label>
              <input
                type="number"
                min="1"
                placeholder="Ingresa los días"
                value={currentConfig.customPaymentDays}
                onChange={(e) => updateConfig("customPaymentDays", e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.allowPartialPayments}
                onChange={(e) => updateConfig("allowPartialPayments", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.allowPartialPayments && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Permitir pagos parciales</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Habilitar abonos y pagos en varias cuotas
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Aprobaciones */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Check className="w-8 h-8 text-primary" />
          <h3 className="text-white font-semibold text-lg">Aprobaciones</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Nivel de aprobación
            </label>
            <select
              value={currentConfig.approvalLevel}
              onChange={(e) => updateConfig("approvalLevel", e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              {APPROVAL_LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2 font-medium">
              Monto mínimo para aprobación ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={currentConfig.approvalAmountThreshold}
              onChange={(e) => updateConfig("approvalAmountThreshold", e.target.value)}
              className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.requireApprovalForAllPurchases}
                onChange={(e) => updateConfig("requireApprovalForAllPurchases", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.requireApprovalForAllPurchases && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Aprobar todas las compras</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Requerir aprobación sin importar el monto
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Numeración Automática */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-8 h-8 text-primary" />
          <h3 className="text-white font-semibold text-lg">Numeración Automática</h3>
        </div>

        <div className="mb-4">
          <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={currentConfig.useAutoNumbering}
                onChange={(e) => updateConfig("useAutoNumbering", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {currentConfig.useAutoNumbering && <Check className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-white font-medium">Usar numeración automática</span>
              <p className="text-gray-400 text-xs mt-0.5">
                Generar números consecutivos para órdenes de compra
              </p>
            </div>
          </label>
        </div>

        {currentConfig.useAutoNumbering && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Prefijo
              </label>
              <input
                type="text"
                placeholder="COMP"
                value={currentConfig.purchasePrefix}
                onChange={(e) => updateConfig("purchasePrefix", e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Siguiente número
              </label>
              <input
                type="number"
                min="1"
                placeholder="1001"
                value={currentConfig.nextNumber}
                onChange={(e) => updateConfig("nextNumber", e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Longitud
              </label>
              <select
                value={currentConfig.numberLength}
                onChange={(e) => updateConfig("numberLength", e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="4">4 dígitos</option>
                <option value="5">5 dígitos</option>
                <option value="6">6 dígitos</option>
                <option value="7">7 dígitos</option>
                <option value="8">8 dígitos</option>
              </select>
            </div>
          </div>
        )}

        {currentConfig.useAutoNumbering && (
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-gray-300 text-sm mb-2">Vista previa del formato:</p>
            <p className="text-white font-bold text-lg font-mono">
              {currentConfig.purchasePrefix}-
              {currentConfig.nextNumber.padStart(parseInt(currentConfig.numberLength), "0")}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Ejemplo: {currentConfig.purchasePrefix}-
              {(parseInt(currentConfig.nextNumber) + 1)
                .toString()
                .padStart(parseInt(currentConfig.numberLength), "0")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}