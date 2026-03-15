import { useState } from "react";
import {
  Search,
  Plus,
  Printer,
  Eye,
  FileCheck,
  Calendar,
  Building2,
  DollarSign,
  CheckSquare,
  XCircle,
  AlertCircle,
  X,
  ChevronDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "../ui/date-picker";

interface ImpresionChequesTabProps {
  theme: string;
  isLight: boolean;
}

interface Cheque {
  id: string;
  numero: string;
  fecha: string;
  beneficiario: string;
  concepto: string;
  monto: number;
  banco: string;
  cuenta: string;
  estado: "emitido" | "impreso" | "cobrado" | "anulado";
  fechaImpresion?: string;
  fechaCobro?: string;
  usuarioEmision: string;
}

export function ImpresionChequesTab({ theme, isLight }: ImpresionChequesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBanco, setSelectedBanco] = useState("todos");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined);
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined);
  const [showNuevoCheque, setShowNuevoCheque] = useState(false);
  const [showVistaPrevia, setShowVistaPrevia] = useState(false);
  const [chequeSeleccionado, setChequeSeleccionado] = useState<Cheque | null>(null);

  const [nuevoCheque, setNuevoCheque] = useState({
    numero: "",
    fecha: "",
    beneficiario: "",
    concepto: "",
    monto: 0,
    banco: "pichincha",
    cuenta: "",
  });

  const cheques: Cheque[] = [
    {
      id: "1",
      numero: "001234",
      fecha: "07/03/2026",
      beneficiario: "Servicios Básicos EC",
      concepto: "Pago servicios agua y luz - Marzo 2026",
      monto: 450.00,
      banco: "Banco Pichincha",
      cuenta: "2100456789",
      estado: "cobrado",
      fechaImpresion: "07/03/2026",
      fechaCobro: "10/03/2026",
      usuarioEmision: "Admin",
    },
    {
      id: "2",
      numero: "001235",
      fecha: "10/03/2026",
      beneficiario: "Distribuidora del Norte S.A.",
      concepto: "Pago Factura #001-001-000145",
      monto: 5824.00,
      banco: "Banco Pichincha",
      cuenta: "2100456789",
      estado: "impreso",
      fechaImpresion: "10/03/2026",
      usuarioEmision: "Admin",
    },
    {
      id: "3",
      numero: "001236",
      fecha: "12/03/2026",
      beneficiario: "Alquiler Oficina Central",
      concepto: "Arriendo Marzo 2026",
      monto: 1200.00,
      banco: "Banco Pichincha",
      cuenta: "2100456789",
      estado: "emitido",
      usuarioEmision: "Admin",
    },
    {
      id: "4",
      numero: "000998",
      fecha: "05/03/2026",
      beneficiario: "Tech Solutions Ecuador",
      concepto: "Pago servicios técnicos",
      monto: 2016.00,
      banco: "Banco Guayaquil",
      cuenta: "0012345678",
      estado: "anulado",
      usuarioEmision: "Admin",
    },
    {
      id: "5",
      numero: "001237",
      fecha: "14/03/2026",
      beneficiario: "Ferretería El Hierro",
      concepto: "Pago Factura #003-001-000345",
      monto: 3584.00,
      banco: "Banco Pichincha",
      cuenta: "2100456789",
      estado: "impreso",
      fechaImpresion: "14/03/2026",
      usuarioEmision: "Admin",
    },
  ];

  const handleCrearCheque = () => {
    if (!nuevoCheque.numero || !nuevoCheque.beneficiario || nuevoCheque.monto <= 0) {
      toast.error("Campos incompletos", {
        description: "Por favor completa todos los campos obligatorios"
      });
      return;
    }

    toast.success("Cheque creado exitosamente", {
      description: `Cheque #${nuevoCheque.numero} para ${nuevoCheque.beneficiario}`
    });
    setShowNuevoCheque(false);
    setNuevoCheque({
      numero: "",
      fecha: "",
      beneficiario: "",
      concepto: "",
      monto: 0,
      banco: "pichincha",
      cuenta: "",
    });
  };

  const handleImprimirCheque = (cheque: Cheque) => {
    if (cheque.estado === "anulado") {
      toast.error("Cheque anulado", {
        description: "No se puede imprimir un cheque anulado"
      });
      return;
    }

    if (cheque.estado === "cobrado") {
      toast.error("Cheque ya cobrado", {
        description: "Este cheque ya fue cobrado y no se puede reimprimir"
      });
      return;
    }

    // Simular impresión
    toast.success("Imprimiendo cheque", {
      description: `Cheque #${cheque.numero} enviado a impresora`
    });

    // En producción, aquí se enviaría a la impresora física
    setTimeout(() => {
      toast.success("Cheque impreso exitosamente", {
        description: `Cheque #${cheque.numero} listo para entrega`
      });
    }, 2000);
  };

  const handleEntregarCheque = (cheque: Cheque) => {
    if (cheque.estado !== "impreso") {
      toast.error("Cheque no disponible", {
        description: "Solo se pueden entregar cheques en estado 'Impreso'"
      });
      return;
    }

    toast.success("Cheque entregado", {
      description: `Cheque #${cheque.numero} marcado como entregado a ${cheque.beneficiario}`
    });
  };

  const handleAnularCheque = (cheque: Cheque) => {
    if (cheque.estado === "cobrado") {
      toast.error("No se puede anular", {
        description: "Este cheque ya fue cobrado"
      });
      return;
    }

    toast.success("Cheque anulado", {
      description: `Cheque #${cheque.numero} ha sido anulado exitosamente`
    });
  };

  const handleVerVistaPrevia = (cheque: Cheque) => {
    setChequeSeleccionado(cheque);
    setShowVistaPrevia(true);
  };

  const chequesFiltrados = cheques.filter(cheque => {
    const matchesSearch =
      cheque.numero.includes(searchTerm) ||
      cheque.beneficiario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cheque.concepto.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBanco = selectedBanco === "todos" || cheque.banco === selectedBanco;
    const matchesEstado = selectedEstado === "todos" || cheque.estado === selectedEstado;

    const matchesFechaDesde = !fechaDesde || new Date(cheque.fecha) >= fechaDesde;
    const matchesFechaHasta = !fechaHasta || new Date(cheque.fecha) <= fechaHasta;

    return matchesSearch && matchesBanco && matchesEstado && matchesFechaDesde && matchesFechaHasta;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "cobrado":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
            <CheckSquare className="w-3 h-3" />
            Cobrado
          </span>
        );
      case "impreso":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">
            <Printer className="w-3 h-3" />
            Impreso
          </span>
        );
      case "anulado":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Anulado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Emitido
          </span>
        );
    }
  };

  const numeroALetras = (numero: number): string => {
    // Función simplificada para convertir números a letras
    const entero = Math.floor(numero);
    const decimales = Math.round((numero - entero) * 100);
    return `${entero.toLocaleString("es-EC")} CON ${decimales}/100 DÓLARES`;
  };

  return (
    <div className="space-y-4">
      {/* Acciones principales */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowNuevoCheque(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cheque
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cheque, beneficiario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-1.5 border rounded-lg text-sm ${
              isLight
                ? "bg-white border-gray-200 text-gray-900"
                : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            }`}
          />
        </div>

        <select
          value={selectedBanco}
          onChange={(e) => setSelectedBanco(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="todos">Todos los Bancos</option>
          <option value="Banco Pichincha">Banco Pichincha</option>
          <option value="Banco Guayaquil">Banco Guayaquil</option>
          <option value="Banco del Pacífico">Banco del Pacífico</option>
        </select>

        <select
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="todos">Todos los Estados</option>
          <option value="emitido">Emitido</option>
          <option value="impreso">Impreso</option>
          <option value="cobrado">Cobrado</option>
          <option value="anulado">Anulado</option>
        </select>

        <DatePicker
          value={fechaDesde}
          onChange={setFechaDesde}
          placeholder="Desde..."
          isLight={isLight}
        />

        <DatePicker
          value={fechaHasta}
          onChange={setFechaHasta}
          placeholder="Hasta..."
          isLight={isLight}
        />

        <button
          className={`px-4 py-1.5 border rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            isLight
              ? "border-gray-200 hover:bg-gray-50 text-gray-700"
              : "border-white/10 hover:bg-white/5 text-white"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtrar
        </button>
      </div>

      {/* Tabla */}
      <div className={`border rounded-lg overflow-hidden ${
        isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Beneficiario
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Banco
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
              {chequesFiltrados.map((cheque) => (
                <tr
                  key={cheque.id}
                  className={`transition-colors ${
                    isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
                  }`}
                >
                  <td className={`px-4 py-3 text-sm font-mono font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    #{cheque.numero}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {cheque.fecha}
                  </td>
                  <td className={`px-4 py-3 text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {cheque.beneficiario}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {cheque.concepto}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    ${cheque.monto.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        {cheque.banco}
                      </p>
                      <p className="text-xs text-gray-400">{cheque.cuenta}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getEstadoBadge(cheque.estado)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleVerVistaPrevia(cheque)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight
                            ? "hover:bg-blue-50 text-blue-600"
                            : "hover:bg-blue-500/10 text-blue-400"
                        }`}
                        title="Vista previa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleImprimirCheque(cheque)}
                        disabled={cheque.estado === "anulado" || cheque.estado === "cobrado"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          cheque.estado === "anulado" || cheque.estado === "cobrado"
                            ? "opacity-50 cursor-not-allowed text-gray-500"
                            : isLight
                            ? "hover:bg-green-50 text-green-600"
                            : "hover:bg-green-500/10 text-green-400"
                        }`}
                        title="Imprimir"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAnularCheque(cheque)}
                        disabled={cheque.estado === "cobrado" || cheque.estado === "anulado"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          cheque.estado === "cobrado" || cheque.estado === "anulado"
                            ? "opacity-50 cursor-not-allowed text-gray-500"
                            : isLight
                            ? "hover:bg-red-50 text-red-600"
                            : "hover:bg-red-500/10 text-red-400"
                        }`}
                        title="Anular"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEntregarCheque(cheque)}
                        disabled={cheque.estado !== "impreso"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          cheque.estado !== "impreso"
                            ? "opacity-50 cursor-not-allowed text-gray-500"
                            : isLight
                            ? "hover:bg-green-50 text-green-600"
                            : "hover:bg-green-500/10 text-green-400"
                        }`}
                        title="Marcar como Entregado"
                      >
                        <CheckSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Cheque */}
      {showNuevoCheque && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-2xl w-full ${
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Nuevo Cheque
              </h3>
              <button
                onClick={() => setShowNuevoCheque(false)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Número de Cheque *
                  </label>
                  <input
                    type="text"
                    value={nuevoCheque.numero}
                    onChange={(e) => setNuevoCheque({...nuevoCheque, numero: e.target.value})}
                    placeholder="001238"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={nuevoCheque.fecha}
                    onChange={(e) => setNuevoCheque({...nuevoCheque, fecha: e.target.value})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Beneficiario *
                </label>
                <input
                  type="text"
                  value={nuevoCheque.beneficiario}
                  onChange={(e) => setNuevoCheque({...nuevoCheque, beneficiario: e.target.value})}
                  placeholder="Nombre del beneficiario"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Concepto *
                </label>
                <textarea
                  value={nuevoCheque.concepto}
                  onChange={(e) => setNuevoCheque({...nuevoCheque, concepto: e.target.value})}
                  placeholder="Descripción del pago"
                  rows={3}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Monto *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={nuevoCheque.monto}
                    onChange={(e) => setNuevoCheque({...nuevoCheque, monto: parseFloat(e.target.value)})}
                    placeholder="0.00"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Banco *
                  </label>
                  <select
                    value={nuevoCheque.banco}
                    onChange={(e) => setNuevoCheque({...nuevoCheque, banco: e.target.value})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="pichincha">Banco Pichincha</option>
                    <option value="guayaquil">Banco Guayaquil</option>
                    <option value="pacifico">Banco del Pacífico</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNuevoCheque(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearCheque}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium"
                >
                  Crear Cheque
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Vista Previa */}
      {showVistaPrevia && chequeSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-3xl w-full ${
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Vista Previa del Cheque
              </h3>
              <button
                onClick={() => setShowVistaPrevia(false)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Diseño del cheque */}
            <div className={`border-2 rounded-lg p-8 ${
              isLight ? "bg-gray-50 border-gray-300" : "bg-[#0D1B2A] border-white/20"
            }`}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm font-bold text-primary">COMERCIAL DEL PACÍFICO S.A.</p>
                  <p className="text-xs text-gray-400 mt-1">{chequeSeleccionado.banco}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">CHEQUE No.</p>
                  <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {chequeSeleccionado.numero}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-400">Fecha:</p>
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {chequeSeleccionado.fecha}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Páguese a la orden de:</p>
                  <p className={`text-base font-bold border-b pb-1 ${
                    isLight ? "text-gray-900 border-gray-300" : "text-white border-white/20"
                  }`}>
                    {chequeSeleccionado.beneficiario}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">La suma de:</p>
                  <p className={`text-sm font-medium border-b pb-1 ${
                    isLight ? "text-gray-900 border-gray-300" : "text-white border-white/20"
                  }`}>
                    {numeroALetras(chequeSeleccionado.monto)}
                  </p>
                </div>

                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Monto:</p>
                    <p className={`text-2xl font-bold text-primary`}>
                      ${chequeSeleccionado.monto.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Concepto:</p>
                  <p className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {chequeSeleccionado.concepto}
                  </p>
                </div>

                <div className="flex justify-end pt-8">
                  <div className="text-center">
                    <div className={`border-t w-48 mb-1 ${isLight ? "border-gray-300" : "border-white/20"}`}></div>
                    <p className="text-xs text-gray-400">Firma Autorizada</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowVistaPrevia(false)}
                className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                }`}
              >
                Cerrar
              </button>
              <button
                onClick={() => handleImprimirCheque(chequeSeleccionado)}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimir Cheque
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}