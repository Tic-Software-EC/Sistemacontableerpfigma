import { useState } from "react";
import { Download, FileDown, Calendar, Search } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

// Datos de ejemplo para compras
const COMPRAS_SAMPLE = [
  {
    id: "C-001",
    fecha: "2026-03-01",
    tipoComprobante: "Factura",
    numero: "001-001-000045",
    proveedor: "Distribuidora Nacional S.A.",
    ruc: "1792145678001",
    baseImponible: 5000.00,
    iva: 600.00,
    retRenta: 50.00,
    retIva: 72.00,
    total: 5600.00,
  },
  {
    id: "C-002",
    fecha: "2026-03-05",
    tipoComprobante: "Factura",
    numero: "002-001-000089",
    proveedor: "Kreafast S.A.",
    ruc: "0992876543001",
    baseImponible: 2000.00,
    iva: 240.00,
    retRenta: 20.00,
    retIva: 28.80,
    total: 2240.00,
  },
  {
    id: "C-003",
    fecha: "2026-03-10",
    tipoComprobante: "Factura",
    numero: "001-002-001234",
    proveedor: "Comercial del Pacífico Cía. Ltda.",
    ruc: "1791234567001",
    baseImponible: 8500.00,
    iva: 960.00,
    retRenta: 85.00,
    retIva: 115.20,
    total: 9460.00,
  },
];

const VENTAS_SAMPLE = [
  {
    id: "V-001",
    fecha: "2026-03-02",
    tipoComprobante: "Factura",
    numero: "001-001-000123",
    cliente: "Empresa Comercial XYZ S.A.",
    ruc: "1790123456001",
    baseImponible: 12000.00,
    iva: 1440.00,
    total: 13440.00,
  },
  {
    id: "V-002",
    fecha: "2026-03-08",
    tipoComprobante: "Factura",
    numero: "001-001-000124",
    cliente: "Importadora ABC Cía. Ltda.",
    ruc: "1798765432001",
    baseImponible: 8500.00,
    iva: 1020.00,
    total: 9520.00,
  },
  {
    id: "V-003",
    fecha: "2026-03-15",
    tipoComprobante: "Factura",
    numero: "001-002-000045",
    cliente: "Distribuidora La Favorita S.A.",
    ruc: "1791357924001",
    baseImponible: 15600.00,
    iva: 1680.00,
    total: 17280.00,
  },
];

export function AtsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [periodo, setPeriodo] = useState("2026-03");
  const [activeTab, setActiveTab] = useState<"compras" | "ventas">("compras");
  const [search, setSearch] = useState("");

  const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;

  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";

  const generarXML = () => {
    // Simulación de generación de XML
    toast.success("Archivo ATS generado correctamente");
  };

  const totalCompras = COMPRAS_SAMPLE.reduce((s, c) => s + c.total, 0);
  const totalVentas = VENTAS_SAMPLE.reduce((s, v) => s + v.total, 0);
  const totalIvaCompras = COMPRAS_SAMPLE.reduce((s, c) => s + c.iva, 0);
  const totalIvaVentas = VENTAS_SAMPLE.reduce((s, v) => s + v.iva, 0);

  const dataActual = activeTab === "compras" ? COMPRAS_SAMPLE : VENTAS_SAMPLE;
  const filtered = dataActual.filter(item => {
    const q = search.toLowerCase();
    const nombre = activeTab === "compras" ? item.proveedor : (item as any).cliente;
    return nombre.toLowerCase().includes(q) || item.ruc.includes(q) || item.numero.includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Anexo Transaccional Simplificado (ATS)</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>Reporte mensual de compras y ventas para el SRI</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${sub}`} />
            <input
              type="month"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
              }`}
            />
          </div>
          <button
            onClick={generarXML}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <FileDown className="w-4 h-4" />
            Generar XML
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <button
          onClick={() => setActiveTab("compras")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "compras"
              ? `border-primary ${txt}`
              : `border-transparent ${sub} hover:${txt}`
          }`}
        >
          Compras ({COMPRAS_SAMPLE.length})
        </button>
        <button
          onClick={() => setActiveTab("ventas")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "ventas"
              ? `border-primary ${txt}`
              : `border-transparent ${sub} hover:${txt}`
          }`}
        >
          Ventas ({VENTAS_SAMPLE.length})
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
        <input
          type="text"
          placeholder={`Buscar ${activeTab === "compras" ? "proveedor" : "cliente"}, RUC o número...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
            isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
          }`}
        />
      </div>

      {/* Tabla */}
      <div className={`${card} overflow-hidden`}>
        <div className={`px-5 py-3 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide">
            <div className={`col-span-1 ${sub}`}>Fecha</div>
            <div className={`col-span-1 ${sub}`}>Tipo</div>
            <div className={`col-span-1 ${sub}`}>Número</div>
            <div className={`col-span-3 ${sub}`}>{activeTab === "compras" ? "Proveedor" : "Cliente"}</div>
            <div className={`col-span-1 ${sub}`}>RUC</div>
            <div className={`col-span-1 text-right ${sub}`}>Base</div>
            <div className={`col-span-1 text-right ${sub}`}>IVA</div>
            {activeTab === "compras" && (
              <>
                <div className={`col-span-1 text-right ${sub}`}>Ret. Renta</div>
                <div className={`col-span-1 text-right ${sub}`}>Ret. IVA</div>
              </>
            )}
            <div className={`col-span-${activeTab === "compras" ? "1" : "3"} text-right ${sub}`}>Total</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 gap-4 items-center px-5 py-3 transition-colors ${
                isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"
              }`}
            >
              <div className={`col-span-1 text-xs ${sub}`}>
                {new Date(item.fecha).toLocaleDateString("es-EC", { day: "2-digit", month: "short" })}
              </div>
              <div className={`col-span-1 text-xs ${sub}`}>{item.tipoComprobante}</div>
              <div className={`col-span-1 text-xs font-mono ${sub}`}>{item.numero}</div>
              <div className={`col-span-3 text-sm ${txt} truncate`}>
                {activeTab === "compras" ? item.proveedor : (item as any).cliente}
              </div>
              <div className={`col-span-1 text-xs font-mono ${sub}`}>{item.ruc}</div>
              <div className={`col-span-1 text-right text-sm font-mono ${txt}`}>{fmt(item.baseImponible)}</div>
              <div className={`col-span-1 text-right text-sm font-mono ${txt}`}>{fmt(item.iva)}</div>
              {activeTab === "compras" && (
                <>
                  <div className={`col-span-1 text-right text-sm font-mono ${txt}`}>{fmt((item as any).retRenta)}</div>
                  <div className={`col-span-1 text-right text-sm font-mono ${txt}`}>{fmt((item as any).retIva)}</div>
                </>
              )}
              <div className={`col-span-${activeTab === "compras" ? "1" : "3"} text-right text-sm font-mono font-semibold ${txt}`}>
                {fmt(item.total)}
              </div>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className={`px-5 py-3 border-t ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
          <div className="grid grid-cols-12 gap-4">
            <div className={`col-span-7 text-sm font-bold ${txt}`}>TOTALES</div>
            <div className={`col-span-1 text-right text-sm font-bold font-mono ${txt}`}>
              {fmt(filtered.reduce((s, i) => s + i.baseImponible, 0))}
            </div>
            <div className={`col-span-1 text-right text-sm font-bold font-mono ${txt}`}>
              {fmt(filtered.reduce((s, i) => s + i.iva, 0))}
            </div>
            {activeTab === "compras" && (
              <>
                <div className={`col-span-1 text-right text-sm font-bold font-mono ${txt}`}>
                  {fmt(filtered.reduce((s, i) => s + (i as any).retRenta, 0))}
                </div>
                <div className={`col-span-1 text-right text-sm font-bold font-mono ${txt}`}>
                  {fmt(filtered.reduce((s, i) => s + (i as any).retIva, 0))}
                </div>
              </>
            )}
            <div className={`col-span-${activeTab === "compras" ? "1" : "3"} text-right text-sm font-bold font-mono ${txt}`}>
              {fmt(filtered.reduce((s, i) => s + i.total, 0))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${card} px-5 py-4`}>
        <h3 className={`font-semibold mb-2 ${txt}`}>Información del archivo ATS</h3>
        <div className={`text-sm space-y-1 ${sub}`}>
          <p>• El archivo XML contiene el detalle de todas las transacciones de compras y ventas del periodo</p>
          <p>• Se debe presentar mensualmente al Servicio de Rentas Internas (SRI)</p>
          <p>• Plazo máximo de presentación: hasta el día 28 del mes siguiente</p>
          <p>• Formato: XML según estructura definida por el SRI</p>
        </div>
      </div>

      <p className={`text-xs text-center ${sub}`}>
        Generado el 04 de marzo, 2026
      </p>
    </div>
  );
}