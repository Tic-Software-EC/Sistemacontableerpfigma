import { useState } from "react";
import {
  ShoppingCart, ShoppingBag, Banknote, Package,
  Users, TrendingDown, ArrowRight, CheckCircle,
  Send, Settings2, Percent, ChevronRight,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useAccountingConfig, type AccountingConfig, type CuentaMap } from "../contexts/accounting-config-context";
import { useAccounting } from "../contexts/accounting-context";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════
   Catálogo de cuentas
══════════════════════════════════════════════════ */
const CUENTAS = [
  { codigo: "1.1.1.01", nombre: "Caja General"                    },
  { codigo: "1.1.1.02", nombre: "Banco Pichincha Cte."             },
  { codigo: "1.1.1.03", nombre: "Banco Guayaquil Ahorros"          },
  { codigo: "1.1.2.01", nombre: "Clientes Locales"                 },
  { codigo: "1.1.3.01", nombre: "IVA en Compras"                   },
  { codigo: "1.1.4.01", nombre: "Mercadería en Stock"              },
  { codigo: "1.2.1.02", nombre: "(-) Dep. Acum. Equipos"          },
  { codigo: "2.1.1.01", nombre: "Proveedores Locales"              },
  { codigo: "2.1.2.01", nombre: "Anticipos de Clientes"            },
  { codigo: "2.1.3.01", nombre: "IVA por Pagar"                    },
  { codigo: "2.1.4.01", nombre: "Retención IVA por Pagar"          },
  { codigo: "4.1.1.01", nombre: "Ventas"                           },
  { codigo: "5.1.1.01", nombre: "Sueldos y Salarios"               },
  { codigo: "5.1.2.01", nombre: "Beneficios Sociales"              },
  { codigo: "5.2.1.01", nombre: "Gasto Depreciación"               },
  { codigo: "5.3.1.01", nombre: "Pérdida por Ajuste Inventario"    },
];

/* ══════════════════════════════════════════════════
   Tipos de operación
══════════════════════════════════════════════════ */
type TipoOp =
  | "venta_contado"
  | "venta_credito"
  | "compra_contado"
  | "compra_credito"
  | "cobro"
  | "pago"
  | "ajuste_inv"
  | "nomina"
  | "depreciacion";

interface OpDef {
  key:      TipoOp;
  label:    string;
  pregunta: string;
  icon:     typeof ShoppingCart;
}

const OPERACIONES: OpDef[] = [
  { key: "venta_contado",  label: "Venta al Contado",      icon: ShoppingCart,  pregunta: "Vendiste y el cliente te pagó en el momento"   },
  { key: "venta_credito",  label: "Venta a Crédito",        icon: ShoppingCart,  pregunta: "Vendiste y el cliente te pagará después"        },
  { key: "compra_contado", label: "Compra al Contado",      icon: ShoppingBag,   pregunta: "Compraste mercadería y pagaste en el momento"   },
  { key: "compra_credito", label: "Compra a Crédito",       icon: ShoppingBag,   pregunta: "Compraste mercadería y pagarás después"         },
  { key: "cobro",          label: "Cobro a Cliente",        icon: Banknote,      pregunta: "Un cliente te pagó lo que te debía"             },
  { key: "pago",           label: "Pago a Proveedor",       icon: Banknote,      pregunta: "Le pagaste a un proveedor lo que debías"        },
  { key: "ajuste_inv",     label: "Ajuste de Inventario",   icon: Package,       pregunta: "Hay diferencia entre el sistema y la bodega"    },
  { key: "nomina",         label: "Pago de Nómina",         icon: Users,         pregunta: "Pagaste los sueldos de tus empleados"           },
  { key: "depreciacion",   label: "Depreciación",           icon: TrendingDown,  pregunta: "Registras el desgaste mensual de un activo fijo" },
];

/* ══════════════════════════════════════════════════
   Genera líneas del asiento
══════════════════════════════════════════════════ */
type Linea = { cuenta: string; nombre: string; debe: number; haber: number; rol: string };

function generarLineas(tipo: TipoOp, base: number, ivaRate: number, config: AccountingConfig): Linea[] {
  const iva   = parseFloat((base * ivaRate / 100).toFixed(2));
  const total = parseFloat((base + iva).toFixed(2));
  const c     = config;

  switch (tipo) {
    case "venta_contado":  return [
      { cuenta: c.ventaCobro.codigo,       nombre: c.ventaCobro.nombre,       debe: total, haber: 0,    rol: "Entra dinero"              },
      { cuenta: c.ventaIngreso.codigo,     nombre: c.ventaIngreso.nombre,     debe: 0,     haber: base, rol: "Ingreso por venta"          },
      { cuenta: c.ivaVentas.codigo,        nombre: c.ivaVentas.nombre,        debe: 0,     haber: iva,  rol: "IVA cobrado al cliente"     },
    ];
    case "venta_credito":  return [
      { cuenta: c.ventaCxC.codigo,         nombre: c.ventaCxC.nombre,         debe: total, haber: 0,    rol: "El cliente nos debe"        },
      { cuenta: c.ventaIngreso.codigo,     nombre: c.ventaIngreso.nombre,     debe: 0,     haber: base, rol: "Ingreso por venta"          },
      { cuenta: c.ivaVentas.codigo,        nombre: c.ivaVentas.nombre,        debe: 0,     haber: iva,  rol: "IVA cobrado al cliente"     },
    ];
    case "compra_contado": return [
      { cuenta: c.compraInventario.codigo, nombre: c.compraInventario.nombre, debe: base,  haber: 0,    rol: "Mercadería que ingresa"      },
      { cuenta: c.compraIvaCredito.codigo, nombre: c.compraIvaCredito.nombre, debe: iva,   haber: 0,    rol: "IVA que nos devuelven"       },
      { cuenta: c.compraPago.codigo,       nombre: c.compraPago.nombre,       debe: 0,     haber: total, rol: "Sale dinero"               },
    ];
    case "compra_credito": return [
      { cuenta: c.compraInventario.codigo, nombre: c.compraInventario.nombre, debe: base,  haber: 0,    rol: "Mercadería que ingresa"      },
      { cuenta: c.compraIvaCredito.codigo, nombre: c.compraIvaCredito.nombre, debe: iva,   haber: 0,    rol: "IVA que nos devuelven"       },
      { cuenta: c.compraCxP.codigo,        nombre: c.compraCxP.nombre,        debe: 0,     haber: total, rol: "Le debemos al proveedor"   },
    ];
    case "cobro": return [
      { cuenta: c.bancoPrincipal.codigo,   nombre: c.bancoPrincipal.nombre,   debe: base,  haber: 0,    rol: "Entra dinero al banco"       },
      { cuenta: c.cxcClientes.codigo,      nombre: c.cxcClientes.nombre,      debe: 0,     haber: base, rol: "El cliente ya no nos debe"   },
    ];
    case "pago": return [
      { cuenta: c.cxpProveedores.codigo,   nombre: c.cxpProveedores.nombre,   debe: base,  haber: 0,    rol: "Ya no debemos al proveedor"  },
      { cuenta: c.bancoPrincipal.codigo,   nombre: c.bancoPrincipal.nombre,   debe: 0,     haber: base, rol: "Sale dinero del banco"       },
    ];
    case "ajuste_inv": return [
      { cuenta: c.ajusteInventario.codigo,    nombre: c.ajusteInventario.nombre,    debe: base, haber: 0,    rol: "Pérdida por diferencia"  },
      { cuenta: c.inventarioPrincipal.codigo, nombre: c.inventarioPrincipal.nombre, debe: 0,    haber: base, rol: "Inventario se reduce"    },
    ];
    case "nomina": {
      const benef  = parseFloat((base * 0.1).toFixed(2));
      const total2 = parseFloat((base + benef).toFixed(2));
      return [
        { cuenta: c.nominaSueldos.codigo,    nombre: c.nominaSueldos.nombre,    debe: base,   haber: 0,      rol: "Sueldo bruto"     },
        { cuenta: c.nominaBeneficios.codigo, nombre: c.nominaBeneficios.nombre, debe: benef,  haber: 0,      rol: "Beneficios (10%)" },
        { cuenta: c.bancoPrincipal.codigo,   nombre: c.bancoPrincipal.nombre,   debe: 0,      haber: total2, rol: "Sale del banco"   },
      ];
    }
    case "depreciacion": return [
      { cuenta: c.depreciacionGasto.codigo, nombre: c.depreciacionGasto.nombre, debe: base, haber: 0,    rol: "Gasto del período"          },
      { cuenta: c.depreciacionAcum.codigo,  nombre: c.depreciacionAcum.nombre,  debe: 0,    haber: base, rol: "El activo pierde valor"      },
    ];
  }
}

/* ══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════ */
export function AccountingConfigContent() {
  const { theme }   = useTheme();
  const isLight     = theme === "light";
  const { config, updateConfig } = useAccountingConfig();
  const { addAsiento } = useAccounting();

  const [paso,    setPaso]    = useState<1 | 2 | 3>(1);
  const [tipoSel, setTipoSel] = useState<TipoOp | null>(null);
  const [monto,   setMonto]   = useState("1000.00");
  const [fecha,   setFecha]   = useState("2026-03-06");
  const [desc,    setDesc]    = useState("");
  const [ref,     setRef]     = useState("");
  const [ivaRate, setIvaRate] = useState(15);
  const [enviado, setEnviado] = useState(false);
  const [showCfg, setShowCfg] = useState(false);

  /* ── Estilos del sistema ── */
  const card = `rounded-xl border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const inp  = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary transition-colors ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const lbl  = `block mb-1.5 text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`;
  const sub  = isLight ? "text-gray-400" : "text-gray-500";

  /* ── Cálculos ── */
  const base   = parseFloat(monto) || 0;
  const ivaAmt = parseFloat((base * ivaRate / 100).toFixed(2));
  const lineas = tipoSel ? generarLineas(tipoSel, base, ivaRate, config) : [];
  const totD   = lineas.reduce((s, l) => s + l.debe,  0);
  const totH   = lineas.reduce((s, l) => s + l.haber, 0);
  const ok     = Math.abs(totD - totH) < 0.01 && base > 0;
  const opInfo = OPERACIONES.find(o => o.key === tipoSel);
  const fmt    = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;
  const conIva = ["venta_contado","venta_credito","compra_contado","compra_credito"].includes(tipoSel ?? "");

  /* ── Enviar al Libro Diario ── */
  const enviar = () => {
    if (!ok || !tipoSel) return;
    const origenMap: Record<TipoOp, string> = {
      venta_contado: "ventas", venta_credito: "ventas",
      compra_contado: "compras", compra_credito: "compras",
      cobro: "cartera", pago: "cartera",
      ajuste_inv: "inventario", nomina: "nomina", depreciacion: "activos",
    };
    addAsiento({
      descripcion: desc || opInfo!.label,
      referencia: ref,
      tipo: opInfo!.label,
      fecha,
      estado: "borrador",
      origen: origenMap[tipoSel] as any,
      autoGenerado: false,
      debe: totD, haber: totH,
      lineas: lineas.map(l => ({ cuenta: l.cuenta, nombre: l.nombre, debe: l.debe, haber: l.haber })),
    });
    toast.success("Asiento creado en el Libro Diario");
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false); setPaso(1); setTipoSel(null);
      setDesc(""); setRef(""); setMonto("1000.00");
    }, 2500);
  };

  /* ── Selector de cuenta (modal cfg) ── */
  const SelCuenta = ({ ck, label }: { ck: keyof AccountingConfig; label: string }) => {
    const val = config[ck] as CuentaMap;
    return (
      <div>
        <label className={lbl}>{label}</label>
        <select value={val.codigo}
          onChange={e => {
            const c = CUENTAS.find(x => x.codigo === e.target.value);
            if (c) updateConfig({ [ck]: { codigo: c.codigo, nombre: c.nombre } } as Partial<AccountingConfig>);
          }}
          className={inp}>
          {CUENTAS.map(c => (
            <option key={c.codigo} value={c.codigo} className="bg-[#0D1B2A]">
              {c.codigo} — {c.nombre}
            </option>
          ))}
        </select>
      </div>
    );
  };

  /* ══════════════════════════════════════════════════
     PASO 1 — Elige la operación
  ══════════════════════════════════════════════════ */
  const Paso1 = () => (
    <div className="space-y-5">
      <div>
        <h2 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>¿Qué operación quieres registrar?</h2>
        <p className={`text-xs mt-1 ${sub}`}>Selecciona el tipo y el sistema generará el asiento automáticamente con las cuentas correctas.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {OPERACIONES.map(op => {
          const Icon = op.icon;
          return (
            <button
              key={op.key}
              onClick={() => { setTipoSel(op.key); setPaso(2); setDesc(op.label); }}
              className={`group text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                isLight
                  ? "bg-white border-gray-200 hover:border-primary/50 hover:bg-primary/[0.03]"
                  : "bg-white/[0.03] border-white/10 hover:border-primary/40 hover:bg-white/[0.05]"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-gray-100 group-hover:bg-primary/10" : "bg-white/5 group-hover:bg-primary/10"} transition-colors`}>
                <Icon className={`w-4 h-4 ${isLight ? "text-gray-500 group-hover:text-primary" : "text-gray-400 group-hover:text-primary"} transition-colors`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isLight ? "text-gray-800" : "text-white"}`}>{op.label}</p>
                <p className={`text-xs truncate mt-0.5 ${sub}`}>{op.pregunta}</p>
              </div>
              <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isLight ? "text-gray-300 group-hover:text-primary" : "text-gray-600 group-hover:text-primary"} transition-colors`} />
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════
     PASO 2 — Datos del asiento
  ══════════════════════════════════════════════════ */
  const Paso2 = () => (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setPaso(1)}
          className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${isLight ? "border-gray-200 text-gray-500 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
          ← Volver
        </button>
        <div>
          <h2 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{opInfo?.label}</h2>
          <p className={`text-xs ${sub}`}>{opInfo?.pregunta}</p>
        </div>
      </div>

      <div className={`${card} p-5 space-y-4`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>{conIva ? "Monto sin IVA" : "Monto"}</label>
            <input type="number" min="0" step="0.01" value={monto}
              onChange={e => setMonto(e.target.value)} className={inp} placeholder="0.00" />
          </div>
          <div>
            <label className={lbl}>Fecha</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={inp} />
          </div>
        </div>

        {conIva && (
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.02]"}`}>
            <Percent className={`w-4 h-4 flex-shrink-0 text-primary`} />
            <span className={`text-xs ${sub}`}>IVA</span>
            <input type="number" min="0" max="99" step="0.5" value={ivaRate}
              onChange={e => setIvaRate(parseFloat(e.target.value) || 0)}
              className={`w-14 text-center text-xs px-2 py-1 border rounded-lg focus:outline-none focus:border-primary ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`} />
            <span className={`text-xs ${sub}`}>%</span>
            {base > 0 && (
              <span className={`ml-auto text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                = {fmt(ivaAmt)} · Total {fmt(base + ivaAmt)}
              </span>
            )}
          </div>
        )}

        <div>
          <label className={lbl}>Descripción</label>
          <input type="text" value={desc} onChange={e => setDesc(e.target.value)}
            placeholder={opInfo?.label} className={inp} />
        </div>
        <div>
          <label className={lbl}>Referencia <span className="font-normal opacity-60">(opcional)</span></label>
          <input type="text" value={ref} onChange={e => setRef(e.target.value)}
            placeholder="FAC-001, POS-002..." className={inp} />
        </div>
      </div>

      <button onClick={() => setPaso(3)} disabled={base <= 0}
        className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
          base > 0 ? "bg-primary hover:bg-primary/90 text-white" : isLight ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white/5 text-gray-600 cursor-not-allowed"
        }`}>
        Ver asiento generado <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  /* ══════════════════════════════════════════════════
     PASO 3 — Confirmar y guardar
  ══════════════════════════════════════════════════ */
  const Paso3 = () => (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setPaso(2)}
          className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${isLight ? "border-gray-200 text-gray-500 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
          ← Volver
        </button>
        <div className="flex-1">
          <h2 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>Revisa el asiento</h2>
          <p className={`text-xs ${sub}`}>Verifica que los datos estén correctos antes de guardar</p>
        </div>
        {ok && (
          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${isLight ? "text-gray-600 border-gray-200 bg-gray-50" : "text-gray-400 border-white/10 bg-white/[0.03]"}`}>
            <CheckCircle className="w-3.5 h-3.5 text-primary" /> Balanceado
          </span>
        )}
      </div>

      {/* Info compacta */}
      <div className={`${card} px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-xs`}>
        <span className={sub}>Tipo: <strong className={isLight ? "text-gray-800" : "text-white"}>{opInfo?.label}</strong></span>
        <span className={sub}>Fecha: <strong className={isLight ? "text-gray-800" : "text-white"}>{fecha}</strong></span>
        <span className={sub}>Descripción: <strong className={isLight ? "text-gray-800" : "text-white"}>{desc || opInfo?.label}</strong></span>
        {ref && <span className={sub}>Ref: <strong className={isLight ? "text-gray-800" : "text-white"}>{ref}</strong></span>}
      </div>

      {/* Tabla del asiento */}
      <div className={`${card} overflow-hidden`}>
        {/* Encabezado tabla */}
        <div className={`grid grid-cols-12 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b ${isLight ? "bg-[#0D1B2A] text-gray-300 border-gray-200" : "bg-[#0D1B2A] text-gray-400 border-white/10"}`}>
          <span className="col-span-5">Cuenta</span>
          <span className="col-span-4">Descripción del movimiento</span>
          <span className="col-span-1.5 text-right col-start-10">Debe</span>
          <span className="col-span-1.5 text-right col-start-12">Haber</span>
        </div>

        {lineas.map((l, i) => (
          <div key={i} className={`grid grid-cols-12 items-center px-4 py-3 text-sm border-b ${isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/[0.02]"}`}>
            {/* Cuenta */}
            <div className="col-span-5 flex items-center gap-2">
              <div className={`w-1 h-6 rounded-full flex-shrink-0 ${l.debe > 0 ? "bg-primary" : isLight ? "bg-gray-300" : "bg-white/20"}`} />
              <div>
                <p className="font-mono text-xs font-bold text-primary">{l.cuenta}</p>
                <p className={`text-xs truncate ${isLight ? "text-gray-700" : "text-gray-300"}`}>{l.nombre}</p>
              </div>
            </div>

            {/* Rol */}
            <div className="col-span-4">
              <p className={`text-xs ${sub}`}>{l.rol}</p>
            </div>

            {/* Debe */}
            <div className="col-span-1 col-start-10 text-right font-mono text-xs">
              {l.debe > 0
                ? <span className={isLight ? "text-gray-800 font-semibold" : "text-gray-200 font-semibold"}>{fmt(l.debe)}</span>
                : <span className={isLight ? "text-gray-200" : "text-gray-700"}>—</span>}
            </div>

            {/* Haber */}
            <div className="col-span-2 col-start-11 text-right font-mono text-xs">
              {l.haber > 0
                ? <span className={isLight ? "text-gray-800 font-semibold" : "text-gray-200 font-semibold"}>{fmt(l.haber)}</span>
                : <span className={isLight ? "text-gray-200" : "text-gray-700"}>—</span>}
            </div>
          </div>
        ))}

        {/* Totales */}
        <div className={`grid grid-cols-12 px-4 py-2.5 text-xs font-bold border-t ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.02] border-white/10"}`}>
          <span className={`col-span-9 uppercase tracking-wider ${sub}`}>Total</span>
          <span className={`col-span-1 col-start-10 text-right font-mono ${isLight ? "text-gray-800" : "text-gray-200"}`}>{fmt(totD)}</span>
          <span className={`col-span-2 col-start-11 text-right font-mono ${isLight ? "text-gray-800" : "text-gray-200"}`}>{fmt(totH)}</span>
        </div>
      </div>

      {/* Botón guardar */}
      {enviado ? (
        <div className="w-full py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-semibold text-sm flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" /> Asiento guardado en el Libro Diario
        </div>
      ) : (
        <button onClick={enviar} disabled={!ok}
          className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            ok ? "bg-primary hover:bg-primary/90 text-white" : isLight ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white/5 text-gray-600 cursor-not-allowed"
          }`}>
          <Send className="w-4 h-4" /> Guardar en el Libro Diario
        </button>
      )}

      <p className={`text-center text-xs ${sub}`}>
        Se guardará en estado <strong>Borrador</strong> · Puedes editarlo desde el Libro Diario
      </p>
    </div>
  );

  /* ══════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════ */
  return (
    <div>
      {/* Barra superior */}
      <div className="flex items-center justify-between mb-6">
        {/* Indicador de pasos */}
        <div className="flex items-center gap-2">
          {([1,2,3] as const).map((n, idx) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                paso === n
                  ? "bg-primary text-white"
                  : paso > n
                    ? "bg-primary/20 text-primary"
                    : isLight ? "bg-gray-100 text-gray-400" : "bg-white/5 text-gray-500"
              }`}>
                {paso > n ? <CheckCircle className="w-3.5 h-3.5" /> : n}
              </div>
              <span className={`text-xs hidden sm:inline ${paso === n ? (isLight ? "text-gray-800 font-semibold" : "text-white font-semibold") : sub}`}>
                {n === 1 ? "Tipo" : n === 2 ? "Datos" : "Confirmar"}
              </span>
              {idx < 2 && <div className={`w-6 h-px mx-1 ${paso > n ? "bg-primary/30" : isLight ? "bg-gray-200" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Botón configurar */}
        <button onClick={() => setShowCfg(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-400 hover:bg-white/5"}`}>
          <Settings2 className="w-4 h-4" />
          <span className="hidden sm:inline">Configurar cuentas</span>
        </button>
      </div>

      <div className={`border-t mb-6 ${isLight ? "border-gray-200" : "border-white/10"}`} />

      {paso === 1 && <Paso1 />}
      {paso === 2 && <Paso2 />}
      {paso === 3 && <Paso3 />}

      {/* ── Modal configuración de cuentas ── */}
      {showCfg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border shadow-2xl ${isLight ? "bg-white border-gray-200" : "bg-[#151c28] border-white/10"}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Settings2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>Configurar cuentas por defecto</h3>
                  <p className={`text-xs ${sub}`}>Elige qué cuenta usar en cada operación</p>
                </div>
              </div>
              <button onClick={() => setShowCfg(false)}
                className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100 text-gray-400" : "hover:bg-white/5 text-gray-500"}`}>
                ✕
              </button>
            </div>

            {/* Cuerpo */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* IVA */}
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${sub}`}>Tasa de IVA</p>
                <div className="flex items-center gap-3">
                  <input type="number" min="0" max="99" step="0.5" value={ivaRate}
                    onChange={e => setIvaRate(parseFloat(e.target.value) || 0)}
                    className={`w-24 ${inp}`} />
                  <span className={`text-xs ${sub}`}>% · Ecuador 2024: 15%</span>
                </div>
              </div>

              {/* Ventas */}
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${sub}`}>Ventas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelCuenta ck="ventaIngreso"  label="Cuenta de ingresos" />
                  <SelCuenta ck="ventaCobro"    label="Cobro al contado (caja/banco)" />
                  <SelCuenta ck="ventaCxC"      label="Venta a crédito (CxC)" />
                  <SelCuenta ck="ivaVentas"     label="IVA en ventas (por pagar)" />
                </div>
              </div>

              {/* Compras */}
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${sub}`}>Compras</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelCuenta ck="compraInventario" label="Inventario / mercadería" />
                  <SelCuenta ck="compraPago"       label="Pago al contado (caja/banco)" />
                  <SelCuenta ck="compraCxP"        label="Compra a crédito (CxP)" />
                  <SelCuenta ck="compraIvaCredito" label="IVA en compras (crédito tributario)" />
                </div>
              </div>

              {/* Bancos y cartera */}
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${sub}`}>Bancos y Cartera</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelCuenta ck="cajaGeneral"    label="Caja general" />
                  <SelCuenta ck="bancoPrincipal" label="Banco principal" />
                  <SelCuenta ck="cxcClientes"    label="Cuentas por cobrar" />
                  <SelCuenta ck="cxpProveedores" label="Cuentas por pagar" />
                </div>
              </div>

              {/* Otros */}
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${sub}`}>Inventario, Nómina y Activos</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelCuenta ck="inventarioPrincipal" label="Inventario principal" />
                  <SelCuenta ck="ajusteInventario"    label="Pérdida por ajuste" />
                  <SelCuenta ck="nominaSueldos"       label="Sueldos y salarios" />
                  <SelCuenta ck="nominaBeneficios"    label="Beneficios sociales" />
                  <SelCuenta ck="depreciacionGasto"   label="Gasto depreciación" />
                  <SelCuenta ck="depreciacionAcum"    label="Depreciación acumulada" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t flex-shrink-0 flex justify-end ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <button onClick={() => { setShowCfg(false); toast.success("Configuración guardada"); }}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors">
                Guardar configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
