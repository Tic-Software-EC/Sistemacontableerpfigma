import { useState } from "react";
import { XCircle, Calculator, Wallet, Banknote, AlertCircle, Printer } from "lucide-react";

interface ArqueoModalProps {
  isOpen: boolean;
  onClose: () => void;
  montoInicial: number;
  gastos: number;
  ventasEfectivo: number;
  ventasTarjeta: number;
  ventasTransferencia: number;
}

export function ArqueoModal({
  isOpen,
  onClose,
  montoInicial,
  gastos,
  ventasEfectivo,
  ventasTarjeta,
  ventasTransferencia,
}: ArqueoModalProps) {
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
  const saldoEsperado = montoInicial + ventasEfectivo - gastos;
  const diferencia = totalContado - saldoEsperado;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#0D1B2A] to-[#1a2332] border border-white/10 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#1a2332] border-b border-white/10 px-5 py-3 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <div className="p-1.5 bg-green-600/10 rounded-lg">
                  <Calculator className="w-5 h-5 text-green-400" />
                </div>
                Arqueo de Caja
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">Conteo de billetes y monedas - Cierre de caja</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Columna 1: Billetes */}
            <div>
              <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-green-400" />
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
                  <div key={b.key} className="flex items-center gap-2">
                    <label className="text-gray-300 text-xs font-medium w-12">{b.label}:</label>
                    <input
                      type="number"
                      min="0"
                      value={billetes[b.key]}
                      onChange={(e) => setBilletes({ ...billetes, [b.key]: parseInt(e.target.value) || 0 })}
                      className="flex-1 px-2 py-1.5 bg-[#141c29] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                    <span className="text-green-400 text-xs font-bold w-16 text-right">
                      ${(billetes[b.key] * b.value).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Total Billetes:</span>
                  <span className="text-white font-bold">${totalBilletes.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Columna 2: Monedas */}
            <div>
              <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-yellow-400" />
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
                  <div key={m.key} className="flex items-center gap-2">
                    <label className="text-gray-300 text-xs font-medium w-12">{m.label}:</label>
                    <input
                      type="number"
                      min="0"
                      value={monedas[m.key]}
                      onChange={(e) => setMonedas({ ...monedas, [m.key]: parseInt(e.target.value) || 0 })}
                      className="flex-1 px-2 py-1.5 bg-[#141c29] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
                    />
                    <span className="text-yellow-400 text-xs font-bold w-16 text-right">
                      ${(monedas[m.key] * m.value).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm font-medium">Total Monedas:</span>
                  <span className="text-white font-bold">${totalMonedas.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Columna 3: Resumen */}
            <div>
              <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                Resumen de Caja
              </h4>
              
              {/* Monto contado */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3">
                <p className="text-gray-400 text-xs mb-1">Total Contado</p>
                <p className="text-white font-bold text-2xl">${totalContado.toFixed(2)}</p>
              </div>

              {/* Detalles */}
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monto Inicial:</span>
                  <span className="text-white font-medium">${montoInicial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ventas Efectivo:</span>
                  <span className="text-green-400 font-medium">+${ventasEfectivo.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Gastos:</span>
                  <span className="text-red-400 font-medium">-${gastos.toFixed(2)}</span>
                </div>
              </div>

              {/* Saldo esperado */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-3">
                <p className="text-gray-400 text-xs mb-1">Saldo Esperado</p>
                <p className="text-white font-bold text-xl">${saldoEsperado.toFixed(2)}</p>
              </div>

              {/* Diferencia */}
              <div className={`border rounded-lg p-3 ${
                diferencia === 0 
                  ? 'bg-green-600/10 border-green-500/20' 
                  : diferencia > 0 
                    ? 'bg-blue-600/10 border-blue-500/20' 
                    : 'bg-red-600/10 border-red-500/20'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className={`w-4 h-4 ${
                    diferencia === 0 ? 'text-green-400' : diferencia > 0 ? 'text-blue-400' : 'text-red-400'
                  }`} />
                  <p className="text-xs font-medium text-gray-300">
                    {diferencia === 0 ? 'Cuadrado' : diferencia > 0 ? 'Sobrante' : 'Faltante'}
                  </p>
                </div>
                <p className={`font-bold text-xl ${
                  diferencia === 0 ? 'text-green-400' : diferencia > 0 ? 'text-blue-400' : 'text-red-400'
                }`}>
                  ${Math.abs(diferencia).toFixed(2)}
                </p>
              </div>

              {/* Otros medios de pago */}
              <div className="mt-3 pt-3 border-t border-white/10 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ventas Tarjeta:</span>
                  <span className="text-white">${ventasTarjeta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transferencias:</span>
                  <span className="text-white">${ventasTransferencia.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-white/5 px-5 py-3 flex items-center gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all font-medium text-sm"
          >
            Cancelar
          </button>
          <button
            className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir Arqueo
          </button>
          <button
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-semibold text-sm"
          >
            Cerrar Caja
          </button>
        </div>
      </div>
    </div>
  );
}
