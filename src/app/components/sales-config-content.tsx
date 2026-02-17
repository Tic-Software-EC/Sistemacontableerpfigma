import { useState } from "react";
import { Settings, Building2, Percent, DollarSign, FileText, ShoppingCart } from "lucide-react";

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

interface SalesConfig {
  id: string;
  sucursalId: string;
  allowNegativeStock: boolean;
  requireCustomer: boolean;
  maxDiscountPercent: string;
  defaultPriceList: string;
  autoGenerateInvoice: boolean;
  allowCreditSales: boolean;
  creditDaysLimit: string;
  roundingDecimals: string;
  showStockInSale: boolean;
  allowModifyPrice: boolean;
}

const PRICE_LISTS = [
  { id: "pvp", name: "Precio al Público (PVP)" },
  { id: "mayorista", name: "Precio Mayorista" },
  { id: "distribuidor", name: "Precio Distribuidor" },
  { id: "especial", name: "Precio Especial" },
];

export function SalesConfigContent() {
  const [selectedSucursal, setSelectedSucursal] = useState<string>("suc-001");
  
  const [configs, setConfigs] = useState<SalesConfig[]>([
    {
      id: "config-001",
      sucursalId: "suc-001",
      allowNegativeStock: false,
      requireCustomer: true,
      maxDiscountPercent: "15",
      defaultPriceList: "pvp",
      autoGenerateInvoice: true,
      allowCreditSales: true,
      creditDaysLimit: "30",
      roundingDecimals: "2",
      showStockInSale: true,
      allowModifyPrice: false,
    },
    {
      id: "config-002",
      sucursalId: "suc-002",
      allowNegativeStock: false,
      requireCustomer: true,
      maxDiscountPercent: "10",
      defaultPriceList: "pvp",
      autoGenerateInvoice: true,
      allowCreditSales: true,
      creditDaysLimit: "15",
      roundingDecimals: "2",
      showStockInSale: true,
      allowModifyPrice: false,
    },
    {
      id: "config-003",
      sucursalId: "suc-003",
      allowNegativeStock: true,
      requireCustomer: false,
      maxDiscountPercent: "20",
      defaultPriceList: "mayorista",
      autoGenerateInvoice: true,
      allowCreditSales: true,
      creditDaysLimit: "45",
      roundingDecimals: "2",
      showStockInSale: true,
      allowModifyPrice: true,
    },
    {
      id: "config-004",
      sucursalId: "suc-004",
      allowNegativeStock: false,
      requireCustomer: true,
      maxDiscountPercent: "12",
      defaultPriceList: "pvp",
      autoGenerateInvoice: true,
      allowCreditSales: false,
      creditDaysLimit: "0",
      roundingDecimals: "2",
      showStockInSale: true,
      allowModifyPrice: false,
    },
  ]);

  const currentConfig = configs.find(c => c.sucursalId === selectedSucursal) || configs[0];

  const handleUpdateConfig = (field: keyof SalesConfig, value: string | boolean) => {
    setConfigs(configs.map(config => 
      config.sucursalId === selectedSucursal 
        ? { ...config, [field]: value }
        : config
    ));
  };

  const handleSave = () => {
    console.log("Guardando configuración de ventas...", configs);
    alert("Configuración de ventas guardada exitosamente");
  };

  const getSucursalName = (id: string) => {
    return SUCURSALES.find(s => s.id === id)?.name || id;
  };

  const getPriceListName = (id: string) => {
    return PRICE_LISTS.find(p => p.id === id)?.name || id;
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header estándar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Configuración de Ventas
          </h2>
          <p className="text-gray-400 text-sm">
            Parametriza el comportamiento del módulo de ventas por sucursal
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

      {/* Selector de sucursal */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <label className="block text-white font-medium mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Selecciona la sucursal a configurar
        </label>
        <select
          value={selectedSucursal}
          onChange={(e) => setSelectedSucursal(e.target.value)}
          className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
        >
          {SUCURSALES.map((sucursal) => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.name}
            </option>
          ))}
        </select>
      </div>

      {/* Configuraciones de la sucursal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuraciones generales */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h3 className="text-white font-bold text-xl">Configuración General</h3>
          </div>

          <div className="space-y-5">
            {/* Permitir ventas en negativo */}
            <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={currentConfig.allowNegativeStock}
                  onChange={(e) => handleUpdateConfig("allowNegativeStock", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  {currentConfig.allowNegativeStock && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">Permitir ventas con stock negativo</span>
                <p className="text-gray-400 text-xs mt-0.5">
                  Permite realizar ventas aunque no haya existencias disponibles
                </p>
              </div>
            </label>

            {/* Requerir cliente */}
            <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={currentConfig.requireCustomer}
                  onChange={(e) => handleUpdateConfig("requireCustomer", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  {currentConfig.requireCustomer && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">Requerir cliente en ventas</span>
                <p className="text-gray-400 text-xs mt-0.5">
                  Obliga a seleccionar un cliente antes de completar la venta
                </p>
              </div>
            </label>

            {/* Generar factura automáticamente */}
            <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={currentConfig.autoGenerateInvoice}
                  onChange={(e) => handleUpdateConfig("autoGenerateInvoice", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  {currentConfig.autoGenerateInvoice && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">Generar factura automáticamente</span>
                <p className="text-gray-400 text-xs mt-0.5">
                  Crea la factura electrónica al completar la venta
                </p>
              </div>
            </label>

            {/* Mostrar stock en ventas */}
            <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={currentConfig.showStockInSale}
                  onChange={(e) => handleUpdateConfig("showStockInSale", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  {currentConfig.showStockInSale && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">Mostrar stock disponible</span>
                <p className="text-gray-400 text-xs mt-0.5">
                  Muestra la cantidad disponible al seleccionar productos
                </p>
              </div>
            </label>

            {/* Permitir modificar precio */}
            <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={currentConfig.allowModifyPrice}
                  onChange={(e) => handleUpdateConfig("allowModifyPrice", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  {currentConfig.allowModifyPrice && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">Permitir modificar precio unitario</span>
                <p className="text-gray-400 text-xs mt-0.5">
                  Permite al vendedor cambiar el precio de los productos en la venta
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Configuración de precios y descuentos */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="text-white font-bold text-xl">Precios y Descuentos</h3>
          </div>

          <div className="space-y-5">
            {/* Lista de precios predeterminada */}
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Lista de precios predeterminada
              </label>
              <select
                value={currentConfig.defaultPriceList}
                onChange={(e) => handleUpdateConfig("defaultPriceList", e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                {PRICE_LISTS.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
              <p className="text-gray-500 text-xs mt-2">
                Actualmente: <span className="text-white font-medium">{getPriceListName(currentConfig.defaultPriceList)}</span>
              </p>
            </div>

            {/* Descuento máximo */}
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-400" />
                Descuento máximo permitido (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={currentConfig.maxDiscountPercent}
                onChange={(e) => handleUpdateConfig("maxDiscountPercent", e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
              <p className="text-gray-500 text-xs mt-2">
                Los vendedores no podrán aplicar descuentos superiores a este porcentaje
              </p>
            </div>

            {/* Decimales de redondeo */}
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Decimales para redondeo
              </label>
              <select
                value={currentConfig.roundingDecimals}
                onChange={(e) => handleUpdateConfig("roundingDecimals", e.target.value)}
                className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="0">Sin decimales (0)</option>
                <option value="1">1 decimal</option>
                <option value="2">2 decimales</option>
                <option value="3">3 decimales</option>
                <option value="4">4 decimales</option>
              </select>
              <p className="text-gray-500 text-xs mt-2">
                Define la precisión de los cálculos monetarios en las ventas
              </p>
            </div>
          </div>
        </div>

        {/* Configuración de crédito */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-white font-bold text-xl">Ventas a Crédito</h3>
          </div>

          <div className="space-y-5">
            {/* Permitir ventas a crédito */}
            <label className="flex items-start gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={currentConfig.allowCreditSales}
                  onChange={(e) => handleUpdateConfig("allowCreditSales", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                  {currentConfig.allowCreditSales && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-white font-medium">Permitir ventas a crédito</span>
                <p className="text-gray-400 text-xs mt-0.5">
                  Habilita la opción de registrar ventas con pago diferido
                </p>
              </div>
            </label>

            {/* Días de crédito */}
            {currentConfig.allowCreditSales && (
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Días de crédito predeterminados
                </label>
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={currentConfig.creditDaysLimit}
                  onChange={(e) => handleUpdateConfig("creditDaysLimit", e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Plazo máximo en días para pago de ventas a crédito
                </p>
              </div>
            )}

            {!currentConfig.allowCreditSales && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <p className="text-yellow-400 text-sm">
                  Las ventas a crédito están deshabilitadas para esta sucursal
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Resumen de configuración */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
          <h3 className="text-white font-bold text-xl mb-4">Resumen de Configuración</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300 text-sm">Sucursal:</span>
              <span className="text-white font-medium text-sm">{getSucursalName(currentConfig.sucursalId)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300 text-sm">Lista de precios:</span>
              <span className="text-white font-medium text-sm">{getPriceListName(currentConfig.defaultPriceList)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300 text-sm">Descuento máximo:</span>
              <span className="text-white font-medium text-sm">{currentConfig.maxDiscountPercent}%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300 text-sm">Ventas a crédito:</span>
              <span className={`font-medium text-sm ${currentConfig.allowCreditSales ? "text-green-400" : "text-red-400"}`}>
                {currentConfig.allowCreditSales ? "Habilitadas" : "Deshabilitadas"}
              </span>
            </div>
            {currentConfig.allowCreditSales && (
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-300 text-sm">Días de crédito:</span>
                <span className="text-white font-medium text-sm">{currentConfig.creditDaysLimit} días</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300 text-sm">Stock negativo:</span>
              <span className={`font-medium text-sm ${currentConfig.allowNegativeStock ? "text-yellow-400" : "text-green-400"}`}>
                {currentConfig.allowNegativeStock ? "Permitido" : "No permitido"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-300 text-sm">Modificar precios:</span>
              <span className={`font-medium text-sm ${currentConfig.allowModifyPrice ? "text-yellow-400" : "text-green-400"}`}>
                {currentConfig.allowModifyPrice ? "Permitido" : "No permitido"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
