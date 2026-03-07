import { createContext, useContext, useState, type ReactNode } from "react";

/* ══════════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════ */
export interface CuentaMap {
  codigo: string;
  nombre: string;
}

export interface AccountingConfig {
  // ── Ventas ──────────────────────────────────────────────────────
  ventaIngreso:      CuentaMap;   // 4.x.x — Ingresos por ventas
  ventaCobro:        CuentaMap;   // 1.1.1 — Caja / Banco cobro al contado
  ventaCxC:          CuentaMap;   // 1.1.2 — CxC cobro a crédito
  ventaIvaPagar:     CuentaMap;   // 2.1.3 — IVA ventas por pagar

  // ── Compras ─────────────────────────────────────────────────────
  compraInventario:  CuentaMap;   // 1.1.4 — Inventario / Gasto compra
  compraPago:        CuentaMap;   // 1.1.1 — Caja / Banco pago contado
  compraCxP:         CuentaMap;   // 2.1.1 — CxP pago a crédito
  compraIvaCredito:  CuentaMap;   // 1.1.3 — Crédito tributario IVA compras

  // ── IVA ─────────────────────────────────────────────────────────
  ivaVentas:         CuentaMap;   // 2.1.3 — IVA en ventas (pasivo)
  ivaCompras:        CuentaMap;   // 1.1.3 — IVA en compras (activo)
  retencionIva:      CuentaMap;   // 2.1.4 — Retención IVA por pagar

  // ── Retenciones ─────────────────────────────────────────────────
  retencionIvaPorPagar:    CuentaMap;   // 2.1.3.02 — Retención IVA por pagar
  retencionRentaPorPagar:  CuentaMap;   // 2.1.3.03 — Retención Renta por pagar
  retencionIvaPorCobrar:   CuentaMap;   // 1.1.3.02 — Retención IVA por cobrar
  retencionRentaPorCobrar: CuentaMap;   // 1.1.3.03 — Retención Renta por cobrar

  // ── Cuentas por Cobrar ──────────────────────────────────────────
  cxcClientes:       CuentaMap;   // 1.1.2.01
  cxcAnticipos:      CuentaMap;   // 1.1.2.02

  // ── Cuentas por Pagar ───────────────────────────────────────────
  cxpProveedores:    CuentaMap;   // 2.1.1.01
  cxpAnticipos:      CuentaMap;   // 2.1.2.01

  // ── Caja y Bancos ───────────────────────────────────────────────
  cajaGeneral:       CuentaMap;   // 1.1.1.01
  bancoPrincipal:    CuentaMap;   // 1.1.1.02

  // ── Inventario ──────────────────────────────────────────────────
  inventarioPrincipal: CuentaMap; // 1.1.4.01
  ajusteInventario:    CuentaMap; // 5.3.1.01

  // ── Nómina ──────────────────────────────────────────────────────
  nominaSueldos:     CuentaMap;   // 5.1.1.01
  nominaBeneficios:  CuentaMap;   // 5.1.2.01
  nominaIESS:        CuentaMap;   // 5.1.3.01 — NUEVA

  // ── Activos Fijos ───────────────────────────────────────────────
  depreciacionGasto: CuentaMap;   // 5.2.1.01
  depreciacionAcum:  CuentaMap;   // 1.2.1.02

  // ── Gastos Operacionales ────────────────────────────────────────
  gastoServiciosBasicos: CuentaMap;   // 5.2.2.01 — NUEVA
  gastoArriendo:         CuentaMap;   // 5.2.2.02 — NUEVA
  gastoPublicidad:       CuentaMap;   // 5.2.2.03 — NUEVA

  // ── Financieros ─────────────────────────────────────────────────
  ingresosFinancieros:   CuentaMap;   // 4.2.1.01 — NUEVA
  gastosFinancieros:     CuentaMap;   // 5.4.1.01 — NUEVA
}

const DEFAULT_CONFIG: AccountingConfig = {
  ventaIngreso:      { codigo: "4.1.1.01", nombre: "Ventas" },
  ventaCobro:        { codigo: "1.1.1.01", nombre: "Caja General" },
  ventaCxC:          { codigo: "1.1.2.01", nombre: "Clientes Locales" },
  ventaIvaPagar:     { codigo: "2.1.3.01", nombre: "IVA por Pagar" },

  compraInventario:  { codigo: "1.1.4.01", nombre: "Mercadería en Stock" },
  compraPago:        { codigo: "1.1.1.02", nombre: "Banco Pichincha Cte." },
  compraCxP:         { codigo: "2.1.1.01", nombre: "Proveedores Locales" },
  compraIvaCredito:  { codigo: "1.1.3.01", nombre: "IVA en Compras" },

  ivaVentas:         { codigo: "2.1.3.01", nombre: "IVA por Pagar" },
  ivaCompras:        { codigo: "1.1.3.01", nombre: "IVA en Compras" },
  retencionIva:      { codigo: "2.1.4.01", nombre: "Retención IVA por Pagar" },

  retencionIvaPorPagar:    { codigo: "2.1.3.02", nombre: "Retención IVA por Pagar" },
  retencionRentaPorPagar:  { codigo: "2.1.3.03", nombre: "Retención Renta por Pagar" },
  retencionIvaPorCobrar:   { codigo: "1.1.3.02", nombre: "Retención IVA por Cobrar" },
  retencionRentaPorCobrar: { codigo: "1.1.3.03", nombre: "Retención Renta por Cobrar" },

  cxcClientes:       { codigo: "1.1.2.01", nombre: "Clientes Locales" },
  cxcAnticipos:      { codigo: "1.1.2.02", nombre: "Anticipos a Empleados" },

  cxpProveedores:    { codigo: "2.1.1.01", nombre: "Proveedores Locales" },
  cxpAnticipos:      { codigo: "2.1.2.01", nombre: "Anticipos de Clientes" },

  cajaGeneral:       { codigo: "1.1.1.01", nombre: "Caja General" },
  bancoPrincipal:    { codigo: "1.1.1.02", nombre: "Banco Pichincha Cte." },

  inventarioPrincipal: { codigo: "1.1.4.01", nombre: "Mercadería en Stock" },
  ajusteInventario:    { codigo: "5.3.1.01", nombre: "Pérdida por Ajuste Inventario" },

  nominaSueldos:     { codigo: "5.1.1.01", nombre: "Sueldos y Salarios" },
  nominaBeneficios:  { codigo: "5.1.2.01", nombre: "Beneficios Sociales" },
  nominaIESS:        { codigo: "5.1.3.01", nombre: "IESS" },

  depreciacionGasto: { codigo: "5.2.1.01", nombre: "Gasto Depreciación" },
  depreciacionAcum:  { codigo: "1.2.1.02", nombre: "(-) Dep. Acum. Equipos" },

  gastoServiciosBasicos: { codigo: "5.2.2.01", nombre: "Servicios Básicos" },
  gastoArriendo:         { codigo: "5.2.2.02", nombre: "Arriendo" },
  gastoPublicidad:       { codigo: "5.2.2.03", nombre: "Publicidad" },

  ingresosFinancieros:   { codigo: "4.2.1.01", nombre: "Ingresos Financieros" },
  gastosFinancieros:     { codigo: "5.4.1.01", nombre: "Gastos Financieros" },
};

/* ══════════════════════════════════════════════════════════════════
   CONTEXT
══════════════════════════════════════════════════════════════════ */
interface AccountingConfigContextValue {
  config: AccountingConfig;
  updateConfig: (partial: Partial<AccountingConfig>) => void;
  resetConfig: () => void;
}

const AccountingConfigContext = createContext<AccountingConfigContextValue | null>(null);

export function AccountingConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AccountingConfig>(DEFAULT_CONFIG);

  const updateConfig = (partial: Partial<AccountingConfig>) =>
    setConfig(prev => ({ ...prev, ...partial }));

  const resetConfig = () => setConfig(DEFAULT_CONFIG);

  return (
    <AccountingConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </AccountingConfigContext.Provider>
  );
}

export function useAccountingConfig() {
  const ctx = useContext(AccountingConfigContext);
  if (!ctx) throw new Error("useAccountingConfig must be used within AccountingConfigProvider");
  return ctx;
}