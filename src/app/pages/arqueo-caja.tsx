import { useState } from "react";
import {
  Calculator,
  Wallet,
  Banknote,
  AlertCircle,
  Printer,
  DollarSign,
  TrendingUp,
  History,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Lock,
  Unlock,
  ShoppingBag,
  FileText,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Interfaz para gastos
interface Gasto {
  id: string;
  fecha: string;
  hora: string;
  concepto: string;
  categoria: string;
  monto: number;
  responsable: string;
}

// Interfaz para transacciones
interface Transaccion {
  id: string;
  fecha: string;
  hora: string;
  cliente: string;
  factura: string;
  monto: number;
  estado: string;
}

export function ArqueoCaja() {
  const [billetes, setBilletes] = useState({
    b100: 0,
    b50: 0,
    b20: 0,
    b10: 0,
    b5: 0,
    b1: 0,
  });
  
  const [monedas, setMonedas] = useState({
    m1: 0,
    m050: 0,
    m025: 0,
    m010: 0,
    m005: 0,
    m001: 0,
  });

  const [isCajaCerrada, setIsCajaCerrada] = useState(false);
  const [showGastosModal, setShowGastosModal] = useState(false);
  const [showTarjetaModal, setShowTarjetaModal] = useState(false);
  const [showTransferenciaModal, setShowTransferenciaModal] = useState(false);

  // Datos de caja (normalmente vendrían del backend)
  const [montoInicial] = useState(500.00);
  const [gastos] = useState(45.50);

  // Gastos del día (mock data)
  const gastosDelDia: Gasto[] = [
    {
      id: "G-001",
      fecha: "22/02/2026",
      hora: "09:15",
      concepto: "Compra de suministros de limpieza",
      categoria: "Suministros",
      monto: 15.50,
      responsable: "Juan Pérez"
    },
    {
      id: "G-002",
      fecha: "22/02/2026",
      hora: "11:30",
      concepto: "Pago de servicio de internet",
      categoria: "Servicios",
      monto: 25.00,
      responsable: "Juan Pérez"
    },
    {
      id: "G-003",
      fecha: "22/02/2026",
      hora: "14:45",
      concepto: "Compra de tinta para impresora",
      categoria: "Suministros",
      monto: 5.00,
      responsable: "Juan Pérez"
    }
  ];

  const totalGastos = gastosDelDia.reduce((sum, gasto) => sum + gasto.monto, 0);

  // Transacciones con Tarjeta (mock data)
  const transaccionesTarjeta: Transaccion[] = [
    {
      id: "TRX-001",
      fecha: "22/02/2026",
      hora: "10:25",
      cliente: "María González",
      factura: "FAC-001-001456",
      monto: 450.00,
      estado: "Aprobada"
    },
    {
      id: "TRX-002",
      fecha: "22/02/2026",
      hora: "12:10",
      cliente: "Carlos Ruiz",
      factura: "FAC-001-001457",
      monto: 789.50,
      estado: "Aprobada"
    },
    {
      id: "TRX-003",
      fecha: "22/02/2026",
      hora: "14:35",
      cliente: "Ana Martínez",
      factura: "FAC-001-001458",
      monto: 325.25,
      estado: "Aprobada"
    },
    {
      id: "TRX-004",
      fecha: "22/02/2026",
      hora: "16:20",
      cliente: "Pedro Sánchez",
      factura: "FAC-001-001459",
      monto: 781.00,
      estado: "Aprobada"
    }
  ];

  // Transacciones con Transferencia (mock data)
  const transaccionesTransferencia: Transaccion[] = [
    {
      id: "TRF-001",
      fecha: "22/02/2026",
      hora: "09:45",
      cliente: "Empresa ABC S.A.",
      factura: "FAC-001-001454",
      monto: 560.75,
      estado: "Confirmada"
    },
    {
      id: "TRF-002",
      fecha: "22/02/2026",
      hora: "13:20",
      cliente: "Distribuidora XYZ",
      factura: "FAC-001-001460",
      monto: 329.50,
      estado: "Confirmada"
    }
  ];

  const totalTarjeta = transaccionesTarjeta.reduce((sum, t) => sum + t.monto, 0);
  const totalTransferencias = transaccionesTransferencia.reduce((sum, t) => sum + t.monto, 0);

  // Ventas del día por método de pago (mock data)
  const ventasEfectivo = 1234.50;
  const ventasTarjeta = 2345.75;
  const ventasTransferencia = 890.25;
  const ventasCredito = 1486.15;
  
  const totalVentas = ventasEfectivo + ventasTarjeta + ventasTransferencia + ventasCredito;

  // Calcular totales
  const totalBilletes = 
    billetes.b100 * 100 +
    billetes.b50 * 50 +
    billetes.b20 * 20 +
    billetes.b10 * 10 +
    billetes.b5 * 5 +
    billetes.b1 * 1;

  const totalMonedas =
    monedas.m1 * 1 +
    monedas.m050 * 0.50 +
    monedas.m025 * 0.25 +
    monedas.m010 * 0.10 +
    monedas.m005 * 0.05 +
    monedas.m001 * 0.01;

  const totalContado = totalBilletes + totalMonedas;
  const saldoEsperado = montoInicial + ventasEfectivo - totalGastos;
  const diferencia = totalContado - saldoEsperado;

  const handleCerrarCaja = () => {
    if (totalContado === 0) {
      toast.error("Debes realizar el conteo de efectivo primero");
      return;
    }

    setIsCajaCerrada(true);
    toast.success("Caja cerrada exitosamente");
  };

  const handleImprimirArqueo = () => {
    window.print();
    toast.success("Generando reporte de arqueo...");
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#0D1B2A] via-[#1a2332] to-[#0D1B2A] overflow-auto">
      <Toaster position="top-right" />
      
      {/* Sección de impresión - Solo visible al imprimir */}
      <div className="hidden print:block print:p-8 print:bg-white print:text-black">
        <style>{`
          @media print {
            body { margin: 0; padding: 0; }
            @page { margin: 1cm; size: letter portrait; }
            .print\\:hidden { display: none !important; }
            .print\\:block { display: block !important; }
            .print\\:p-8 { padding: 2rem; }
            .print\\:bg-white { background: white; }
            .print\\:text-black { color: black; }
            .page-break { page-break-before: always; }
            .avoid-break { page-break-inside: avoid; }
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}</style>

        {/* Header del reporte */}
        <div className="mb-6 pb-4 border-b-2 border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">ARQUEO DE CAJA</h1>
              <p className="text-sm text-gray-600">Sistema ERP TicSoftEc</p>
              <p className="text-sm text-gray-600 mt-1">
                {localStorage.getItem("companyName") || "Mi Empresa"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Hora: {new Date().toLocaleTimeString()}</p>
              <p className="text-sm font-bold text-gray-800 mt-2">Cajero: Juan Pérez</p>
              <p className="text-sm text-gray-600">Sucursal: Centro</p>
            </div>
          </div>
        </div>

        {/* Resumen de Ventas */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-400">RESUMEN DE VENTAS</h2>
          <table className="w-full mb-4">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-2 text-sm font-semibold">Ventas en Efectivo:</td>
                <td className="py-2 text-sm text-right font-mono">${ventasEfectivo.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 text-sm font-semibold">Ventas con Tarjeta:</td>
                <td className="py-2 text-sm text-right font-mono">${ventasTarjeta.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 text-sm font-semibold">Ventas con Transferencia:</td>
                <td className="py-2 text-sm text-right font-mono">${ventasTransferencia.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 text-sm font-semibold">Ventas a Crédito:</td>
                <td className="py-2 text-sm text-right font-mono">${ventasCredito.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="py-2 text-base">TOTAL VENTAS DEL DÍA:</td>
                <td className="py-2 text-base text-right font-mono">${totalVentas.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Gastos del Día */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-400">GASTOS DEL DÍA</h2>
          <table className="w-full mb-2">
            <thead>
              <tr className="bg-gray-200 border-b-2 border-gray-400">
                <th className="py-2 px-2 text-left text-xs font-bold">ID</th>
                <th className="py-2 px-2 text-left text-xs font-bold">CONCEPTO</th>
                <th className="py-2 px-2 text-left text-xs font-bold">CATEGORÍA</th>
                <th className="py-2 px-2 text-right text-xs font-bold">MONTO</th>
              </tr>
            </thead>
            <tbody>
              {gastosDelDia.map((gasto) => (
                <tr key={gasto.id} className="border-b border-gray-200">
                  <td className="py-2 px-2 text-xs font-mono">{gasto.id}</td>
                  <td className="py-2 px-2 text-xs">{gasto.concepto}</td>
                  <td className="py-2 px-2 text-xs">{gasto.categoria}</td>
                  <td className="py-2 px-2 text-xs text-right font-mono">${gasto.monto.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                <td colSpan={3} className="py-2 px-2 text-sm text-right">TOTAL GASTOS:</td>
                <td className="py-2 px-2 text-sm text-right font-mono">${totalGastos.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transacciones con Tarjeta */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-400">TRANSACCIONES CON TARJETA</h2>
          <table className="w-full mb-2">
            <thead>
              <tr className="bg-gray-200 border-b-2 border-gray-400">
                <th className="py-2 px-2 text-left text-xs font-bold">ID</th>
                <th className="py-2 px-2 text-left text-xs font-bold">FECHA/HORA</th>
                <th className="py-2 px-2 text-left text-xs font-bold">CLIENTE</th>
                <th className="py-2 px-2 text-left text-xs font-bold">FACTURA</th>
                <th className="py-2 px-2 text-right text-xs font-bold">MONTO</th>
              </tr>
            </thead>
            <tbody>
              {transaccionesTarjeta.map((trx) => (
                <tr key={trx.id} className="border-b border-gray-200">
                  <td className="py-2 px-2 text-xs font-mono">{trx.id}</td>
                  <td className="py-2 px-2 text-xs">{trx.fecha} {trx.hora}</td>
                  <td className="py-2 px-2 text-xs">{trx.cliente}</td>
                  <td className="py-2 px-2 text-xs font-mono">{trx.factura}</td>
                  <td className="py-2 px-2 text-xs text-right font-mono">${trx.monto.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                <td colSpan={4} className="py-2 px-2 text-sm text-right">TOTAL TARJETA:</td>
                <td className="py-2 px-2 text-sm text-right font-mono">${totalTarjeta.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Transacciones con Transferencia */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-400">TRANSACCIONES CON TRANSFERENCIA</h2>
          <table className="w-full mb-2">
            <thead>
              <tr className="bg-gray-200 border-b-2 border-gray-400">
                <th className="py-2 px-2 text-left text-xs font-bold">ID</th>
                <th className="py-2 px-2 text-left text-xs font-bold">FECHA/HORA</th>
                <th className="py-2 px-2 text-left text-xs font-bold">CLIENTE</th>
                <th className="py-2 px-2 text-left text-xs font-bold">FACTURA</th>
                <th className="py-2 px-2 text-right text-xs font-bold">MONTO</th>
              </tr>
            </thead>
            <tbody>
              {transaccionesTransferencia.map((trx) => (
                <tr key={trx.id} className="border-b border-gray-200">
                  <td className="py-2 px-2 text-xs font-mono">{trx.id}</td>
                  <td className="py-2 px-2 text-xs">{trx.fecha} {trx.hora}</td>
                  <td className="py-2 px-2 text-xs">{trx.cliente}</td>
                  <td className="py-2 px-2 text-xs font-mono">{trx.factura}</td>
                  <td className="py-2 px-2 text-xs text-right font-mono">${trx.monto.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                <td colSpan={4} className="py-2 px-2 text-sm text-right">TOTAL TRANSFERENCIAS:</td>
                <td className="py-2 px-2 text-sm text-right font-mono">${totalTransferencias.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Conteo de Efectivo */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-400">CONTEO DE EFECTIVO</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
            {/* Billetes */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">BILLETES</h3>
              <table className="w-full">
                <tbody>
                  {[
                    { key: "b100" as const, label: "$100", value: 100 },
                    { key: "b50" as const, label: "$50", value: 50 },
                    { key: "b20" as const, label: "$20", value: 20 },
                    { key: "b10" as const, label: "$10", value: 10 },
                    { key: "b5" as const, label: "$5", value: 5 },
                    { key: "b1" as const, label: "$1", value: 1 },
                  ].map((b) => (
                    <tr key={b.key} className="border-b border-gray-200">
                      <td className="py-1 text-xs font-semibold">{b.label}</td>
                      <td className="py-1 text-xs text-center">×</td>
                      <td className="py-1 text-xs text-center font-mono">{billetes[b.key]}</td>
                      <td className="py-1 text-xs text-center">=</td>
                      <td className="py-1 text-xs text-right font-mono">${(billetes[b.key] * b.value).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                    <td colSpan={4} className="py-2 text-xs text-right">TOTAL:</td>
                    <td className="py-2 text-xs text-right font-mono">${totalBilletes.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Monedas */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">MONEDAS</h3>
              <table className="w-full">
                <tbody>
                  {[
                    { key: "m1" as const, label: "$1.00", value: 1 },
                    { key: "m050" as const, label: "$0.50", value: 0.50 },
                    { key: "m025" as const, label: "$0.25", value: 0.25 },
                    { key: "m010" as const, label: "$0.10", value: 0.10 },
                    { key: "m005" as const, label: "$0.05", value: 0.05 },
                    { key: "m001" as const, label: "$0.01", value: 0.01 },
                  ].map((m) => (
                    <tr key={m.key} className="border-b border-gray-200">
                      <td className="py-1 text-xs font-semibold">{m.label}</td>
                      <td className="py-1 text-xs text-center">×</td>
                      <td className="py-1 text-xs text-center font-mono">{monedas[m.key]}</td>
                      <td className="py-1 text-xs text-center">=</td>
                      <td className="py-1 text-xs text-right font-mono">${(monedas[m.key] * m.value).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold border-t-2 border-gray-400">
                    <td colSpan={4} className="py-2 text-xs text-right">TOTAL:</td>
                    <td className="py-2 text-xs text-right font-mono">${totalMonedas.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Resumen Final */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-400">RESUMEN FINAL</h2>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="py-2 text-sm font-semibold">Monto Inicial de Caja:</td>
                <td className="py-2 text-sm text-right font-mono">${montoInicial.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 text-sm font-semibold">Ventas en Efectivo:</td>
                <td className="py-2 text-sm text-right font-mono">+ ${ventasEfectivo.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="py-2 text-sm font-semibold">Gastos del Día:</td>
                <td className="py-2 text-sm text-right font-mono">- ${totalGastos.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-200 font-bold border-t-2 border-gray-400">
                <td className="py-2 text-base">SALDO ESPERADO:</td>
                <td className="py-2 text-base text-right font-mono">${saldoEsperado.toFixed(2)}</td>
              </tr>
              <tr className="border-b-2 border-gray-400">
                <td className="py-2 text-base font-bold">EFECTIVO CONTADO:</td>
                <td className="py-2 text-base text-right font-mono font-bold">${totalContado.toFixed(2)}</td>
              </tr>
              <tr className={`${diferencia === 0 ? 'bg-green-100' : diferencia > 0 ? 'bg-blue-100' : 'bg-red-100'} font-bold`}>
                <td className="py-3 text-lg">
                  {diferencia === 0 ? '✓ CAJA CUADRADA' : diferencia > 0 ? '↑ SOBRANTE' : '↓ FALTANTE'}
                </td>
                <td className="py-3 text-lg text-right font-mono">${Math.abs(diferencia).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Firmas */}
        <div className="mt-12 pt-8 border-t-2 border-gray-800">
          <div className="grid grid-cols-2 gap-12">
            <div className="text-center">
              <div className="border-t-2 border-gray-800 pt-2 mt-16">
                <p className="text-sm font-bold">FIRMA DEL CAJERO</p>
                <p className="text-xs text-gray-600 mt-1">Juan Pérez</p>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-gray-800 pt-2 mt-16">
                <p className="text-sm font-bold">FIRMA DEL SUPERVISOR</p>
                <p className="text-xs text-gray-600 mt-1">Nombre y Cargo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-400 text-center">
          <p className="text-xs text-gray-500">
            Documento generado automáticamente por TicSoftEc • {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Contenido normal de la pantalla - Oculto al imprimir */}
      <div className="p-4 print:hidden">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-xl flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                    <Calculator className="w-5 h-5 text-primary" />
                  </div>
                  Arqueo de Caja
                </h2>
                <p className="text-gray-400 text-xs mt-1 ml-1">
                  Conteo de efectivo y cierre de caja diario
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                  isCajaCerrada 
                    ? 'bg-red-500/5 border-red-500/30 text-red-400' 
                    : 'bg-green-500/5 border-green-500/30 text-green-400'
                }`}>
                  {isCajaCerrada ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span className="text-xs font-bold tracking-wide">CAJA CERRADA</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span className="text-xs font-bold tracking-wide">CAJA ABIERTA</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Resumen compacto de Gastos */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
            <div className="bg-white/[0.04] border border-white/10 rounded-lg p-2.5 hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 bg-white/5 rounded">
                  <Banknote className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <p className="text-gray-400 text-[9px] font-semibold uppercase tracking-wider">Efectivo</p>
              </div>
              <p className="text-white font-bold text-lg tabular-nums">${ventasEfectivo.toFixed(2)}</p>
            </div>

            {/* Tarjeta clickeable */}
            <div 
              onClick={() => setShowTarjetaModal(true)}
              className="bg-white/[0.04] border border-white/10 rounded-lg p-2.5 hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 bg-white/5 rounded">
                  <CreditCard className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <p className="text-gray-400 text-[9px] font-semibold uppercase tracking-wider">Tarjeta</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-white font-bold text-lg tabular-nums">${ventasTarjeta.toFixed(2)}</p>
                <FileText className="w-3.5 h-3.5 text-gray-400/60" />
              </div>
            </div>

            {/* Transferencias clickeable */}
            <div 
              onClick={() => setShowTransferenciaModal(true)}
              className="bg-white/[0.04] border border-white/10 rounded-lg p-2.5 hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 bg-white/5 rounded">
                  <DollarSign className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <p className="text-gray-400 text-[9px] font-semibold uppercase tracking-wider">Transferencias</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-white font-bold text-lg tabular-nums">${ventasTransferencia.toFixed(2)}</p>
                <FileText className="w-3.5 h-3.5 text-gray-400/60" />
              </div>
            </div>

            {/* Tarjeta de Gastos con botón */}
            <div 
              onClick={() => setShowGastosModal(true)}
              className="bg-red-500/5 border border-red-500/20 rounded-lg p-2.5 hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 bg-red-500/10 rounded">
                  <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
                </div>
                <p className="text-red-400 text-[9px] font-bold uppercase tracking-wider">Gastos</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-red-400 font-bold text-lg tabular-nums">${totalGastos.toFixed(2)}</p>
                <FileText className="w-3.5 h-3.5 text-red-400/60" />
              </div>
            </div>

            <div className="bg-primary/8 border border-primary/20 rounded-lg p-2.5 hover:border-primary/30 transition-all">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 bg-primary/10 rounded">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Total Ventas</p>
              </div>
              <p className="text-white font-bold text-lg tabular-nums">${totalVentas.toFixed(2)}</p>
            </div>
          </div>

          {/* Conteo de efectivo */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            
            {/* Columna 1: Billetes */}
            <div className="bg-white/[0.04] border border-white/10 rounded-lg p-3">
              <h4 className="text-white font-bold text-xs mb-3 flex items-center gap-2 pb-2 border-b border-white/10">
                <Banknote className="w-4 h-4 text-gray-300" />
                Billetes
              </h4>
              <div className="space-y-2">
                {[
                  { key: "b100" as const, label: "$100", value: 100 },
                  { key: "b50" as const, label: "$50", value: 50 },
                  { key: "b20" as const, label: "$20", value: 20 },
                  { key: "b10" as const, label: "$10", value: 10 },
                  { key: "b5" as const, label: "$5", value: 5 },
                  { key: "b1" as const, label: "$1", value: 1 },
                ].map((b) => (
                  <div key={b.key} className="flex items-center gap-2 bg-[#0D1B2A]/30 rounded p-1.5">
                    <label className="text-gray-400 text-xs font-semibold w-10 text-right">{b.label}</label>
                    <span className="text-gray-600 text-[10px]">×</span>
                    <input
                      type="number"
                      min="0"
                      value={billetes[b.key]}
                      onChange={(e) => setBilletes({ ...billetes, [b.key]: parseInt(e.target.value) || 0 })}
                      disabled={isCajaCerrada}
                      className="flex-1 px-2 py-1.5 bg-[#0D1B2A] border border-white/10 rounded text-white text-sm font-semibold text-center focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed tabular-nums"
                      placeholder="0"
                    />
                    <span className="text-gray-600 text-[10px]">=</span>
                    <span className="text-white text-sm font-bold w-20 text-right tabular-nums">
                      ${(billetes[b.key] * b.value).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-gray-400 text-xs font-bold uppercase">Total:</span>
                  <span className="text-white font-bold text-lg tabular-nums">${totalBilletes.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Columna 2: Monedas */}
            <div className="bg-white/[0.04] border border-white/10 rounded-lg p-3">
              <h4 className="text-white font-bold text-xs mb-3 flex items-center gap-2 pb-2 border-b border-white/10">
                <Wallet className="w-4 h-4 text-gray-300" />
                Monedas
              </h4>
              <div className="space-y-2">
                {[
                  { key: "m1" as const, label: "$1.00", value: 1 },
                  { key: "m050" as const, label: "$0.50", value: 0.50 },
                  { key: "m025" as const, label: "$0.25", value: 0.25 },
                  { key: "m010" as const, label: "$0.10", value: 0.10 },
                  { key: "m005" as const, label: "$0.05", value: 0.05 },
                  { key: "m001" as const, label: "$0.01", value: 0.01 },
                ].map((m) => (
                  <div key={m.key} className="flex items-center gap-2 bg-[#0D1B2A]/30 rounded p-1.5">
                    <label className="text-gray-400 text-xs font-semibold w-10 text-right">{m.label}</label>
                    <span className="text-gray-600 text-[10px]">×</span>
                    <input
                      type="number"
                      min="0"
                      value={monedas[m.key]}
                      onChange={(e) => setMonedas({ ...monedas, [m.key]: parseInt(e.target.value) || 0 })}
                      disabled={isCajaCerrada}
                      className="flex-1 px-2 py-1.5 bg-[#0D1B2A] border border-white/10 rounded text-white text-sm font-semibold text-center focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed tabular-nums"
                      placeholder="0"
                    />
                    <span className="text-gray-600 text-[10px]">=</span>
                    <span className="text-white text-sm font-bold w-20 text-right tabular-nums">
                      ${(monedas[m.key] * m.value).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex justify-between items-center bg-white/5 rounded p-2">
                  <span className="text-gray-400 text-xs font-bold uppercase">Total:</span>
                  <span className="text-white font-bold text-lg tabular-nums">${totalMonedas.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Columna 3: Resumen */}
            <div className="space-y-3">
              {/* Total Contado */}
              <div className="bg-white/[0.06] border border-white/20 rounded-lg p-3">
                <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wider mb-2">Total Contado</p>
                <p className="text-white font-bold text-2xl tabular-nums">${totalContado.toFixed(2)}</p>
              </div>

              {/* Detalles */}
              <div className="bg-white/[0.04] border border-white/10 rounded-lg p-3 space-y-2">
                <h5 className="text-white font-bold text-[10px] uppercase tracking-wide mb-2 pb-2 border-b border-white/10">Cálculo del Saldo</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Monto Inicial</span>
                    <span className="text-white font-bold text-sm tabular-nums">${montoInicial.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Ventas Efectivo</span>
                    <span className="text-white font-bold text-sm tabular-nums">+${ventasEfectivo.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">Gastos del Día</span>
                    <span className="text-white font-bold text-sm tabular-nums">-${totalGastos.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-2 mt-2">
                    <div className="flex justify-between items-center bg-white/5 rounded p-2">
                      <span className="text-white font-bold text-xs uppercase">Saldo Esperado</span>
                      <span className="text-white font-bold text-base tabular-nums">${saldoEsperado.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diferencia */}
              <div className={`border rounded-lg p-3 ${
                diferencia === 0 
                  ? 'bg-white/[0.04] border-white/20' 
                  : diferencia > 0 
                    ? 'bg-white/[0.04] border-white/20' 
                    : 'bg-red-500/5 border-red-500/30'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {diferencia === 0 ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <AlertCircle className={`w-4 h-4 ${diferencia > 0 ? 'text-white' : 'text-red-400'}`} />
                  )}
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    diferencia === 0 ? 'text-gray-400' : diferencia > 0 ? 'text-gray-400' : 'text-red-400'
                  }`}>
                    {diferencia === 0 ? '✓ Caja Cuadrada' : diferencia > 0 ? '↑ Sobrante' : '↓ Faltante'}
                  </p>
                </div>
                <p className={`font-bold text-2xl tabular-nums ${
                  diferencia === 0 ? 'text-white' : diferencia > 0 ? 'text-white' : 'text-red-400'
                }`}>
                  ${Math.abs(diferencia).toFixed(2)}
                </p>
              </div>

              {/* Acciones */}
              <div className="space-y-2">
                <button
                  onClick={handleImprimirArqueo}
                  className="w-full px-3 py-2.5 bg-white/[0.07] hover:bg-white/10 border border-white/20 text-white rounded-lg transition-all font-bold text-xs flex items-center justify-center gap-2 hover:border-white/30"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Arqueo
                </button>
                
                <button
                  onClick={handleCerrarCaja}
                  disabled={isCajaCerrada}
                  className="w-full px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                >
                  <Lock className="w-4 h-4" />
                  {isCajaCerrada ? 'Caja Cerrada' : 'Cerrar Caja'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalle de Gastos - Diseño Compacto */}
      {showGastosModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-[#0D1B2A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500/10 to-transparent border-b border-white/10 px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-0.5 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-red-400" />
                    Detalle de Gastos de Caja
                  </h3>
                  <p className="text-gray-400 text-[11px]">
                    Registro completo de gastos realizados en el día
                  </p>
                </div>
                <button
                  onClick={() => setShowGastosModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="bg-white/[0.04] border border-white/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0D1B2A]/50 border-b border-white/10">
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Fecha/Hora</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Concepto</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Categoría</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Responsable</th>
                        <th className="px-4 py-3 text-right text-gray-400 text-xs font-bold uppercase tracking-wider">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gastosDelDia.map((gasto, index) => (
                        <tr 
                          key={gasto.id}
                          className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                            index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                          }`}
                        >
                          <td className="px-4 py-3 text-gray-400 text-sm font-mono">{gasto.id}</td>
                          <td className="px-4 py-3 text-white text-sm">
                            <div className="flex items-center gap-2">
                              <span>{gasto.fecha}</span>
                              <span className="text-gray-600">•</span>
                              <span className="text-gray-400 text-xs">{gasto.hora}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-white text-sm">{gasto.concepto}</td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded text-xs font-medium">
                              {gasto.categoria}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{gasto.responsable}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-red-400 font-bold text-base tabular-nums">${gasto.monto.toFixed(2)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-red-500/5 border-t-2 border-red-500/20">
                        <td colSpan={5} className="px-4 py-3 text-right text-white font-bold text-sm uppercase">
                          Total Gastos del Día:
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-red-400 font-bold text-xl tabular-nums">${totalGastos.toFixed(2)}</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {gastosDelDia.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-base font-medium">No se registraron gastos en esta caja</p>
                    <p className="text-gray-500 text-sm mt-2">Los gastos aparecerán aquí cuando se registren</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4 bg-white/5">
              <button
                onClick={() => setShowGastosModal(false)}
                className="w-full px-6 py-2.5 bg-white/[0.07] hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalle de Tarjetas - Diseño Compacto */}
      {showTarjetaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-[#0D1B2A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500/10 to-transparent border-b border-white/10 px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-0.5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-red-400" />
                    Detalle de Transacciones con Tarjeta
                  </h3>
                  <p className="text-gray-400 text-[11px]">
                    Registro completo de transacciones realizadas con tarjeta en el día
                  </p>
                </div>
                <button
                  onClick={() => setShowTarjetaModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="bg-white/[0.04] border border-white/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0D1B2A]/50 border-b border-white/10">
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Fecha/Hora</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Factura</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-3 text-right text-gray-400 text-xs font-bold uppercase tracking-wider">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaccionesTarjeta.map((transaccion, index) => (
                        <tr 
                          key={transaccion.id}
                          className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                            index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                          }`}
                        >
                          <td className="px-4 py-3 text-gray-400 text-sm font-mono">{transaccion.id}</td>
                          <td className="px-4 py-3 text-white text-sm">
                            <div className="flex items-center gap-2">
                              <span>{transaccion.fecha}</span>
                              <span className="text-gray-600">•</span>
                              <span className="text-gray-400 text-xs">{transaccion.hora}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-white text-sm">{transaccion.cliente}</td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded text-xs font-medium">
                              {transaccion.factura}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{transaccion.estado}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-red-400 font-bold text-base tabular-nums">${transaccion.monto.toFixed(2)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-red-500/5 border-t-2 border-red-500/20">
                        <td colSpan={5} className="px-4 py-3 text-right text-white font-bold text-sm uppercase">
                          Total Transacciones con Tarjeta:
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-red-400 font-bold text-xl tabular-nums">${totalTarjeta.toFixed(2)}</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {transaccionesTarjeta.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-base font-medium">No se registraron transacciones con tarjeta en esta caja</p>
                    <p className="text-gray-500 text-sm mt-2">Las transacciones aparecerán aquí cuando se registren</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4 bg-white/5">
              <button
                onClick={() => setShowTarjetaModal(false)}
                className="w-full px-6 py-2.5 bg-white/[0.07] hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalle de Transferencias - Diseño Compacto */}
      {showTransferenciaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-[#0D1B2A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500/10 to-transparent border-b border-white/10 px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-0.5 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-red-400" />
                    Detalle de Transacciones con Transferencia
                  </h3>
                  <p className="text-gray-400 text-[11px]">
                    Registro completo de transacciones realizadas con transferencia en el día
                  </p>
                </div>
                <button
                  onClick={() => setShowTransferenciaModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="bg-white/[0.04] border border-white/10 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#0D1B2A]/50 border-b border-white/10">
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">ID</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Fecha/Hora</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Cliente</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Factura</th>
                        <th className="px-4 py-3 text-left text-gray-400 text-xs font-bold uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-3 text-right text-gray-400 text-xs font-bold uppercase tracking-wider">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transaccionesTransferencia.map((transaccion, index) => (
                        <tr 
                          key={transaccion.id}
                          className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                            index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                          }`}
                        >
                          <td className="px-4 py-3 text-gray-400 text-sm font-mono">{transaccion.id}</td>
                          <td className="px-4 py-3 text-white text-sm">
                            <div className="flex items-center gap-2">
                              <span>{transaccion.fecha}</span>
                              <span className="text-gray-600">•</span>
                              <span className="text-gray-400 text-xs">{transaccion.hora}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-white text-sm">{transaccion.cliente}</td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded text-xs font-medium">
                              {transaccion.factura}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{transaccion.estado}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-red-400 font-bold text-base tabular-nums">${transaccion.monto.toFixed(2)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-red-500/5 border-t-2 border-red-500/20">
                        <td colSpan={5} className="px-4 py-3 text-right text-white font-bold text-sm uppercase">
                          Total Transacciones con Transferencia:
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-red-400 font-bold text-xl tabular-nums">${totalTransferencias.toFixed(2)}</span>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {transaccionesTransferencia.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-base font-medium">No se registraron transacciones con transferencia en esta caja</p>
                    <p className="text-gray-500 text-sm mt-2">Las transacciones aparecerán aquí cuando se registren</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4 bg-white/5">
              <button
                onClick={() => setShowTransferenciaModal(false)}
                className="w-full px-6 py-2.5 bg-white/[0.07] hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all font-bold text-sm flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}