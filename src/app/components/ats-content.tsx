import { useState } from "react";
import { Download, FileDown, Calendar, Building2, Search, Filter, Eye, Trash2, Plus } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

// Datos de ejemplo para compras
const COMPRAS_SAMPLE = [
  {
    id: "C-001",
    fecha: "2026-03-01",
    tipoComprobante: "01", // Factura
    tipoComprobanteNombre: "Factura",
    establecimiento: "001",
    puntoEmision: "001",
    secuencial: "000045",
    autorizacion: "1234567890123456789012345678901234567890123456789",
    proveedor: "Distribuidora Nacional S.A.",
    ruc: "1792145678001",
    baseImponible: 5000.00,
    baseImpGrav: 5000.00,
    baseImpExe: 0,
    baseNoObjeto: 0,
    montoIva: 600.00,
    montoIce: 0,
    valorRetRenta: 50.00,
    valorRetIva: 72.00,
    total: 5600.00,
  },
  {
    id: "C-002",
    fecha: "2026-03-05",
    tipoComprobante: "01",
    tipoComprobanteNombre: "Factura",
    establecimiento: "002",
    puntoEmision: "001",
    secuencial: "000089",
    autorizacion: "9876543210987654321098765432109876543210987654321",
    proveedor: "Kreafast S.A.",
    ruc: "0992876543001",
    baseImponible: 2000.00,
    baseImpGrav: 2000.00,
    baseImpExe: 0,
    baseNoObjeto: 0,
    montoIva: 240.00,
    montoIce: 0,
    valorRetRenta: 20.00,
    valorRetIva: 28.80,
    total: 2240.00,
  },
  {
    id: "C-003",
    fecha: "2026-03-10",
    tipoComprobante: "01",
    tipoComprobanteNombre: "Factura",
    establecimiento: "001",
    puntoEmision: "002",
    secuencial: "001234",
    autorizacion: "5555666677778888999900001111222233334444555566667",
    proveedor: "Comercial del Pacífico Cía. Ltda.",
    ruc: "1791234567001",
    baseImponible: 8500.00,
    baseImpGrav: 8000.00,
    baseImpExe: 500.00,
    baseNoObjeto: 0,
    montoIva: 960.00,
    montoIce: 0,
    valorRetRenta: 85.00,
    valorRetIva: 115.20,
    total: 9460.00,
  },
];

// Datos de ejemplo para ventas
const VENTAS_SAMPLE = [
  {
    id: "V-001",
    fecha: "2026-03-02",
    tipoComprobante: "01",
    tipoComprobanteNombre: "Factura",
    establecimiento: "001",
    puntoEmision: "001",
    secuencial: "000123",
    autorizacion: "1111222233334444555566667777888899990000111122223",
    cliente: "Empresa Comercial XYZ S.A.",
    ruc: "1790123456001",
    baseImponible: 12000.00,
    baseImpGrav: 12000.00,
    baseImpExe: 0,
    baseNoObjeto: 0,
    montoIva: 1440.00,
    montoIce: 0,
    total: 13440.00,
  },
  {
    id: "V-002",
    fecha: "2026-03-08",
    tipoComprobante: "01",
    tipoComprobanteNombre: "Factura",
    establecimiento: "001",
    puntoEmision: "001",
    secuencial: "000124",
    autorizacion: "3333444455556666777788889999000011112222333344445",
    cliente: "Importadora ABC Cía. Ltda.",
    ruc: "1798765432001",
    baseImponible: 8500.00,
    baseImpGrav: 8500.00,
    baseImpExe: 0,
    baseNoObjeto: 0,
    montoIva: 1020.00,
    montoIce: 0,
    total: 9520.00,
  },
  {
    id: "V-003",
    fecha: "2026-03-15",
    tipoComprobante: "01",
    tipoComprobanteNombre: "Factura",
    establecimiento: "001",
    puntoEmision: "002",
    secuencial: "000045",
    autorizacion: "7777888899990000111122223333444455556666777788889",
    cliente: "Distribuidora La Favorita S.A.",
    ruc: "1791357924001",
    baseImponible: 15600.00,
    baseImpGrav: 14000.00,
    baseImpExe: 1600.00,
    baseNoObjeto: 0,
    montoIva: 1680.00,
    montoIce: 0,
    total: 17280.00,
  },
];

// Función para generar el XML del ATS según formato del SRI
function generarXmlAts(
  periodo: string,
  rucEmpresa: string,
  razonSocial: string,
  compras: any[],
  ventas: any[]
): string {
  const [anio, mes] = periodo.split("-");
  
  // Calcular totales
  const totalesCompras = compras.reduce((acc, c) => ({
    baseImponible: acc.baseImponible + c.baseImpGrav,
    montoIva: acc.montoIva + c.montoIva,
    montoIce: acc.montoIce + c.montoIce,
  }), { baseImponible: 0, montoIva: 0, montoIce: 0 });

  const totalesVentas = ventas.reduce((acc, v) => ({
    baseImponible: acc.baseImponible + v.baseImpGrav,
    montoIva: acc.montoIva + v.montoIva,
  }), { baseImponible: 0, montoIva: 0 });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<iva>
  <TipoIDInformante>R</TipoIDInformante>
  <IdInformante>${rucEmpresa}</IdInformante>
  <razonSocial>${razonSocial}</razonSocial>
  <Anio>${anio}</Anio>
  <Mes>${mes.padStart(2, '0')}</Mes>
  <numEstabRuc>001</numEstabRuc>
  <totalVentas>${totalesVentas.baseImponible.toFixed(2)}</totalVentas>
  <codigoOperativo>IVA</codigoOperativo>
  
  <!-- COMPRAS -->
  <compras>`;

  // Agregar cada compra
  compras.forEach((compra) => {
    xml += `
    <detalleCompras>
      <codSustento>01</codSustento>
      <tpIdProv>01</tpIdProv>
      <idProv>${compra.ruc}</idProv>
      <tipoComprobante>${compra.tipoComprobante}</tipoComprobante>
      <parteRel>NO</parteRel>
      <fechaRegistro>${compra.fecha.split('-').reverse().join('/')}</fechaRegistro>
      <establecimiento>${compra.establecimiento}</establecimiento>
      <puntoEmision>${compra.puntoEmision}</puntoEmision>
      <secuencial>${compra.secuencial}</secuencial>
      <fechaEmision>${compra.fecha.split('-').reverse().join('/')}</fechaEmision>
      <autorizacion>${compra.autorizacion}</autorizacion>
      <baseNoGraIva>0.00</baseNoGraIva>
      <baseImponible>${compra.baseImpGrav.toFixed(2)}</baseImponible>
      <baseImpGrav>${compra.baseImpGrav.toFixed(2)}</baseImpGrav>
      <baseImpExe>${compra.baseImpExe.toFixed(2)}</baseImpExe>
      <montoIce>${compra.montoIce.toFixed(2)}</montoIce>
      <montoIva>${compra.montoIva.toFixed(2)}</montoIva>
      <valRetBien10>0.00</valRetBien10>
      <valRetServ20>0.00</valRetServ20>
      <valorRetBienes>0.00</valorRetBienes>
      <valRetServ50>0.00</valRetServ50>
      <valorRetServicios>0.00</valorRetServicios>
      <valRetServ100>0.00</valRetServ100>
      <totbasesImpReemb>0.00</totbasesImpReemb>
      <pagoExterior>
        <pagoLocExt>01</pagoLocExt>
        <paisEfecPago>NA</paisEfecPago>
        <aplicConvDobTrib>NA</aplicConvDobTrib>
        <pagExtSujRetNorLeg>NA</pagExtSujRetNorLeg>
      </pagoExterior>
      <formasDePago>
        <formaPago>01</formaPago>
      </formasDePago>
      <air>
        <detalleAir>
          <codRetAir>303</codRetAir>
          <baseImpAir>${compra.baseImpGrav.toFixed(2)}</baseImpAir>
          <porcentajeAir>1.00</porcentajeAir>
          <valRetAir>${compra.valorRetRenta.toFixed(2)}</valRetAir>
        </detalleAir>
      </air>
    </detalleCompras>`;
  });

  xml += `
  </compras>
  
  <!-- VENTAS -->
  <ventas>`;

  // Agregar cada venta
  ventas.forEach((venta) => {
    xml += `
    <detalleVentas>
      <tpIdCliente>04</tpIdCliente>
      <idCliente>${venta.ruc}</idCliente>
      <parteRelVtas>NO</parteRelVtas>
      <tipoComprobante>${venta.tipoComprobante}</tipoComprobante>
      <tipoEmision>1</tipoEmision>
      <numeroComprobantes>1</numeroComprobantes>
      <baseNoGraIva>0.00</baseNoGraIva>
      <baseImponible>${venta.baseImpGrav.toFixed(2)}</baseImponible>
      <baseImpGrav>${venta.baseImpGrav.toFixed(2)}</baseImpGrav>
      <montoIva>${venta.montoIva.toFixed(2)}</montoIva>
      <montoIce>${venta.montoIce.toFixed(2)}</montoIce>
      <valorRetIva>0.00</valorRetIva>
      <valorRetRenta>0.00</valorRetRenta>
      <formasDePago>
        <formaPago>20</formaPago>
      </formasDePago>
    </detalleVentas>`;
  });

  xml += `
  </ventas>
  
  <!-- VENTAS ESTABLECIMIENTO -->
  <ventasEstablecimiento>
    <ventaEst>
      <codEstab>001</codEstab>
      <ventasEstab>${totalesVentas.baseImponible.toFixed(2)}</ventasEstab>
      <ivaComp>0.00</ivaComp>
    </ventaEst>
  </ventasEstablecimiento>
  
</iva>`;

  return xml;
}

// Función para descargar el XML
function descargarXmlAts(
  periodo: string,
  rucEmpresa: string,
  razonSocial: string,
  compras: any[],
  ventas: any[]
) {
  const xml = generarXmlAts(periodo, rucEmpresa, razonSocial, compras, ventas);
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ATS_${rucEmpresa}_${periodo.replace("-", "")}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Archivo XML generado exitosamente");
}

export function AtsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [activeTab, setActiveTab] = useState<"compras" | "ventas">("compras");
  const [mes, setMes] = useState("03");
  const [anio, setAnio] = useState("2026");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Datos de la empresa (normalmente vendrían del contexto o backend)
  const rucEmpresa = localStorage.getItem("companyRuc") || "1790123456001";
  const razonSocial = localStorage.getItem("companyName") || "Mi Empresa S.A.";

  const periodo = `${anio}-${mes}`;

  const card = `rounded-xl ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  
  // Meses del año
  const meses = [
    { value: "01", label: "Enero" },
    { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" },
    { value: "06", label: "Junio" },
    { value: "07", label: "Julio" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];
  
  // Generar años (últimos 5 años y próximos 2)
  const anioActual = new Date().getFullYear();
  const anios = Array.from({ length: 8 }, (_, i) => anioActual - 5 + i).map(a => a.toString());
  
  // Filtrar datos según búsqueda
  const comprasFiltradas = COMPRAS_SAMPLE.filter(c => 
    c.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ruc.includes(searchTerm) ||
    c.secuencial.includes(searchTerm)
  );

  const ventasFiltradas = VENTAS_SAMPLE.filter(v => 
    v.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.ruc.includes(searchTerm) ||
    v.secuencial.includes(searchTerm)
  );

  // Calcular totales de compras
  const totalesCompras = comprasFiltradas.reduce((acc, c) => ({
    baseImponible: acc.baseImponible + c.baseImponible,
    baseImpGrav: acc.baseImpGrav + c.baseImpGrav,
    montoIva: acc.montoIva + c.montoIva,
    valorRetRenta: acc.valorRetRenta + c.valorRetRenta,
    valorRetIva: acc.valorRetIva + c.valorRetIva,
    total: acc.total + c.total,
  }), { baseImponible: 0, baseImpGrav: 0, montoIva: 0, valorRetRenta: 0, valorRetIva: 0, total: 0 });

  // Calcular totales de ventas
  const totalesVentas = ventasFiltradas.reduce((acc, v) => ({
    baseImponible: acc.baseImponible + v.baseImponible,
    baseImpGrav: acc.baseImpGrav + v.baseImpGrav,
    montoIva: acc.montoIva + v.montoIva,
    total: acc.total + v.total,
  }), { baseImponible: 0, baseImpGrav: 0, montoIva: 0, total: 0 });

  const fmt = (v: number) => `$${v.toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Header con información y acciones */}
      <div className={`${card} p-6`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-xl font-bold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
              ATS - Anexo Transaccional Simplificado
            </h2>
            <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              Reporte de compras y ventas para declaración al SRI
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Selector de período */}
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
              <select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  isLight 
                    ? "bg-white border-gray-300 text-gray-900" 
                    : "bg-white/5 border-white/10 text-white"
                }`}
              >
                {meses.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  isLight 
                    ? "bg-white border-gray-300 text-gray-900" 
                    : "bg-white/5 border-white/10 text-white"
                }`}
              >
                {anios.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de descarga XML */}
            <button
              onClick={() => descargarXmlAts(periodo, rucEmpresa, razonSocial, COMPRAS_SAMPLE, VENTAS_SAMPLE)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Descargar XML
            </button>
          </div>
        </div>

        {/* Información de la empresa */}
        <div className={`mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4 ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLight ? "bg-primary/10" : "bg-primary/20"}`}>
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Razón Social</p>
              <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{razonSocial}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLight ? "bg-blue-500/10" : "bg-blue-500/20"}`}>
              <FileDown className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>RUC</p>
              <p className={`text-sm font-medium font-mono ${isLight ? "text-gray-900" : "text-white"}`}>{rucEmpresa}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isLight ? "bg-green-500/10" : "bg-green-500/20"}`}>
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Período Fiscal</p>
              <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                {new Date(periodo + "-01").toLocaleDateString("es-EC", { month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Compras/Ventas */}
      <div className={`${card} overflow-hidden`}>
        <div className={`flex items-center border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <button
            onClick={() => setActiveTab("compras")}
            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "compras"
                ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-white bg-primary/5"}`
                : `border-transparent ${isLight ? "text-gray-500 hover:text-gray-700 hover:bg-gray-50" : "text-gray-400 hover:text-white hover:bg-white/5"}`
            }`}
          >
            Compras ({COMPRAS_SAMPLE.length})
          </button>
          <button
            onClick={() => setActiveTab("ventas")}
            className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "ventas"
                ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-white bg-primary/5"}`
                : `border-transparent ${isLight ? "text-gray-500 hover:text-gray-700 hover:bg-gray-50" : "text-gray-400 hover:text-white hover:bg-white/5"}`
            }`}
          >
            Ventas ({VENTAS_SAMPLE.length})
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className={`p-4 border-b ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.02]"}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
            <input
              type="text"
              placeholder={`Buscar en ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm border ${
                isLight
                  ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  : "bg-white/5 border-white/10 text-white placeholder-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Contenido de compras */}
        {activeTab === "compras" && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"}`}>
                    <th className="px-4 py-3 text-left">Fecha</th>
                    <th className="px-4 py-3 text-left">Comprobante</th>
                    <th className="px-4 py-3 text-left">Proveedor</th>
                    <th className="px-4 py-3 text-right">Base Imp.</th>
                    <th className="px-4 py-3 text-right">IVA</th>
                    <th className="px-4 py-3 text-right">Ret. Renta</th>
                    <th className="px-4 py-3 text-right">Ret. IVA</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {comprasFiltradas.map((compra) => (
                    <tr key={compra.id} className={`border-b transition-colors ${isLight ? "hover:bg-gray-50 border-gray-100" : "hover:bg-white/[0.04] border-white/5"}`}>
                      <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        {new Date(compra.fecha).toLocaleDateString("es-EC")}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                        <div className="font-mono text-xs">
                          {compra.establecimiento}-{compra.puntoEmision}-{compra.secuencial}
                        </div>
                        <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                          {compra.tipoComprobanteNombre}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                        <div>{compra.proveedor}</div>
                        <div className={`text-xs font-mono ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                          {compra.ruc}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                        {fmt(compra.baseImpGrav)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                        {fmt(compra.montoIva)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-mono text-red-500`}>
                        {fmt(compra.valorRetRenta)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-mono text-red-500`}>
                        {fmt(compra.valorRetIva)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-mono font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        {fmt(compra.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`border-t-2 font-semibold ${isLight ? "bg-gray-50 border-gray-300" : "bg-white/[0.05] border-white/20"}`}>
                    <td colSpan={3} className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      TOTALES
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      {fmt(totalesCompras.baseImpGrav)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      {fmt(totalesCompras.montoIva)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono text-red-500`}>
                      {fmt(totalesCompras.valorRetRenta)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono text-red-500`}>
                      {fmt(totalesCompras.valorRetIva)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      {fmt(totalesCompras.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Contenido de ventas */}
        {activeTab === "ventas" && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"}`}>
                    <th className="px-4 py-3 text-left">Fecha</th>
                    <th className="px-4 py-3 text-left">Comprobante</th>
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-right">Base Imponible</th>
                    <th className="px-4 py-3 text-right">Base Grav.</th>
                    <th className="px-4 py-3 text-right">IVA</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventasFiltradas.map((venta) => (
                    <tr key={venta.id} className={`border-b transition-colors ${isLight ? "hover:bg-gray-50 border-gray-100" : "hover:bg-white/[0.04] border-white/5"}`}>
                      <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        {new Date(venta.fecha).toLocaleDateString("es-EC")}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                        <div className="font-mono text-xs">
                          {venta.establecimiento}-{venta.puntoEmision}-{venta.secuencial}
                        </div>
                        <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                          {venta.tipoComprobanteNombre}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                        <div>{venta.cliente}</div>
                        <div className={`text-xs font-mono ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                          {venta.ruc}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                        {fmt(venta.baseImponible)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                        {fmt(venta.baseImpGrav)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                        {fmt(venta.montoIva)}
                      </td>
                      <td className={`px-4 py-3 text-sm text-right font-mono font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                        {fmt(venta.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`border-t-2 font-semibold ${isLight ? "bg-gray-50 border-gray-300" : "bg-white/[0.05] border-white/20"}`}>
                    <td colSpan={3} className={`px-4 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                      TOTALES
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      {fmt(totalesVentas.baseImponible)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      {fmt(totalesVentas.baseImpGrav)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      {fmt(totalesVentas.montoIva)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      {fmt(totalesVentas.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Resumen de totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumen de Compras */}
        <div className={`${card} p-6`}>
          <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Resumen de Compras
          </h3>
          <div className="space-y-3">
            {[
              { label: "Base Imponible", value: totalesCompras.baseImpGrav, color: "text-gray-900" },
              { label: "IVA Compras", value: totalesCompras.montoIva, color: "text-blue-600" },
              { label: "Retención Renta", value: totalesCompras.valorRetRenta, color: "text-red-600" },
              { label: "Retención IVA", value: totalesCompras.valorRetIva, color: "text-red-600" },
              { label: "Total Compras", value: totalesCompras.total, color: "text-gray-900", bold: true },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between pb-2 ${i < 4 ? `border-b ${isLight ? "border-gray-200" : "border-white/10"}` : ""}`}>
                <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.label}</span>
                <span className={`text-sm font-mono ${item.bold ? "font-bold" : ""} ${isLight ? item.color : "text-white"}`}>
                  {fmt(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de Ventas */}
        <div className={`${card} p-6`}>
          <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isLight ? "text-gray-900" : "text-white"}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Resumen de Ventas
          </h3>
          <div className="space-y-3">
            {[
              { label: "Base Imponible", value: totalesVentas.baseImponible, color: "text-gray-900" },
              { label: "Base Gravada", value: totalesVentas.baseImpGrav, color: "text-gray-900" },
              { label: "IVA Ventas", value: totalesVentas.montoIva, color: "text-green-600" },
              { label: "Total Ventas", value: totalesVentas.total, color: "text-gray-900", bold: true },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between pb-2 ${i < 3 ? `border-b ${isLight ? "border-gray-200" : "border-white/10"}` : ""}`}>
                <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.label}</span>
                <span className={`text-sm font-mono ${item.bold ? "font-bold" : ""} ${isLight ? item.color : "text-white"}`}>
                  {fmt(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className={`${card} p-6`}>
        <h3 className={`font-semibold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
          Instrucciones para subir al SRI
        </h3>
        <ol className={`list-decimal list-inside space-y-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
          <li>Descargue el archivo XML haciendo clic en el botón "Descargar XML"</li>
          <li>Ingrese al portal del SRI con su usuario y contraseña</li>
          <li>Navegue a la sección "Anexos" → "Anexo Transaccional Simplificado (ATS)"</li>
          <li>Seleccione el período fiscal correspondiente</li>
          <li>Suba el archivo XML descargado</li>
          <li>Valide la información y envíe la declaración</li>
          <li>Guarde el comprobante de presentación</li>
        </ol>
      </div>
    </div>
  );
}
