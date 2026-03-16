import { useState, useEffect } from "react";
import {
  Search,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  DollarSign,
  FileText,
  BookOpen,
  X,
  Link2,
  Zap,
  ChevronRight,
  Calendar,
  RefreshCw,
  Filter,
  ArrowUpDown,
  Eye,
  Trash2,
  ListFilter,
  SlidersHorizontal,
  GripVertical,
  TrendingUp,
  TrendingDown,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PanelConciliacionTarjetas } from "./panel-conciliacion-tarjetas";

interface ConciliacionBancariaTabProps {
  theme: string;
  isLight: boolean;
}

// Componente de Tarjeta Arrastratable
interface MovimientoCardProps {
  movimiento: MovimientoBancario;
  tipo: "sistema" | "banco";
  estaVinculado: boolean;
  estaSeleccionado: boolean;
  isLight: boolean;
  onSelect: () => void;
  onDesvincular?: () => void;
  onGenerarAsiento?: () => void;
}

const MovimientoCard = ({ 
  movimiento, 
  tipo, 
  estaVinculado, 
  estaSeleccionado, 
  isLight,
  onSelect,
  onDesvincular,
  onGenerarAsiento 
}: MovimientoCardProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: tipo,
    item: { id: movimiento.id, movimiento },
    canDrag: !estaVinculado,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [estaVinculado]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: tipo === "sistema" ? "banco" : "sistema",
    drop: (item: any) => {
      // Se maneja en el componente padre
      return { targetId: movimiento.id };
    },
    canDrop: () => !estaVinculado,
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  }), [estaVinculado]);

  const monto = movimiento.debito + movimiento.credito;
  const esDebito = movimiento.debito > 0;

  return (
    <div
      ref={(node) => !estaVinculado && drag(drop(node))}
      onClick={onSelect}
      className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
        isDragging
          ? "opacity-50 scale-95"
          : isOver
          ? isLight
            ? "border-primary bg-primary/10 scale-102"
            : "border-primary bg-primary/20 scale-102"
          : estaVinculado
          ? isLight
            ? "bg-green-50 border-green-200"
            : "bg-green-500/10 border-green-500/30"
          : estaSeleccionado
          ? isLight
            ? "bg-primary/10 border-primary"
            : "bg-primary/20 border-primary"
          : isLight
          ? "bg-white border-gray-200 hover:border-primary/50 hover:shadow-sm"
          : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10"
      }`}
    >
      {/* Indicador de arrastre */}
      {!estaVinculado && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>
      )}

      <div className={`${!estaVinculado ? "ml-4" : ""}`}>
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium truncate ${isLight ? "text-gray-900" : "text-white"}`}>
              {movimiento.descripcion}
            </p>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {movimiento.referencia}
            </p>
          </div>
          
          {/* Estado */}
          <div className="flex-shrink-0">
            {estaVinculado ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDesvincular?.();
                }}
                className="p-1 rounded-md bg-green-500/20 hover:bg-green-500/30 transition-colors"
                title="Desvincular"
              >
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              </button>
            ) : tipo === "banco" && onGenerarAsiento ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onGenerarAsiento();
                }}
                className="p-1 rounded-md hover:bg-primary/10 transition-colors"
                title="Generar Asiento"
              >
                <BookOpen className="w-3.5 h-3.5 text-primary" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Detalles */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono">{movimiento.fecha}</span>
            {esDebito ? (
              <TrendingUp className="w-3 h-3 text-green-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
          </div>
          <div className={`text-sm font-bold ${esDebito ? "text-green-400" : "text-red-400"}`}>
            ${monto.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Efecto de hover para drag */}
      {isOver && !estaVinculado && (
        <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  );
};

interface CuentaBancaria {
  id: string;
  banco: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldoLibro: number;
}

interface MovimientoBancario {
  id: string;
  fecha: string;
  descripcion: string;
  referencia: string;
  debito: number;
  credito: number;
  saldo: number;
  conciliado: boolean;
  vinculadoCon?: string;
  origen: "sistema" | "banco";
}

type PasoConciliacion = "seleccion-cuenta" | "carga-extracto" | "conciliacion";

export function ConciliacionBancariaTab({ theme, isLight }: ConciliacionBancariaTabProps) {
  const [pasoActual, setPasoActual] = useState<PasoConciliacion>("seleccion-cuenta");
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaBancaria | null>(null);
  const [extractoCargado, setExtractoCargado] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState("marzo-2026");
  const [searchTermSistema, setSearchTermSistema] = useState("");
  const [searchTermBanco, setSearchTermBanco] = useState("");
  const [vinculaciones, setVinculaciones] = useState<Record<string, string>>({});
  const [movimientoSeleccionadoSistema, setMovimientoSeleccionadoSistema] = useState<string | null>(null);
  const [movimientoSeleccionadoBanco, setMovimientoSeleccionadoBanco] = useState<string | null>(null);
  const [showModalMovimiento, setShowModalMovimiento] = useState(false);
  const [movimientoAGenerar, setMovimientoAGenerar] = useState<MovimientoBancario | null>(null);
  const [datosMovimientoContable, setDatosMovimientoContable] = useState({
    cuentaDebito: "",
    cuentaCredito: "",
    descripcion: "",
    centroCosto: "",
  });

  const [showModalGestionarPartida, setShowModalGestionarPartida] = useState(false);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState<MovimientoBancario | null>(null);
  const [tipoPartida, setTipoPartida] = useState<"transito" | "ajuste" | "error">("transito");
  const [justificacion, setJustificacion] = useState("");
  const [showResumenFinal, setShowResumenFinal] = useState(false);
  const [conciliacionesCompletadas, setConciliacionesCompletadas] = useState<string[]>([]);
  const [vistaActual, setVistaActual] = useState<"todos" | "conciliados" | "pendientes">("todos");
  const [filtroMontoMin, setFiltroMontoMin] = useState("");
  const [filtroMontoMax, setFiltroMontoMax] = useState("");
  const [showFiltrosAvanzados, setShowFiltrosAvanzados] = useState(false);
  const [ordenamiento, setOrdenamiento] = useState<"fecha" | "monto" | "descripcion">("fecha");
  const [modoVista, setModoVista] = useState<"tarjetas" | "tabla">("tarjetas");

  // Estados para subtabs
  const [subTabActivo, setSubTabActivo] = useState<"conciliaciones" | "historial">("conciliaciones");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState("2026-01-01");
  const [filtroFechaHasta, setFiltroFechaHasta] = useState("2026-03-31");
  const [filtroBancoHistorial, setFiltroBancoHistorial] = useState<string>("all");
  const [filtroEstadoHistorial, setFiltroEstadoHistorial] = useState<string>("all");
  const [conciliacionDetallada, setConciliacionDetallada] = useState<any | null>(null);
  const [showModalDetalle, setShowModalDetalle] = useState(false);
  const [tabDetalleActivo, setTabDetalleActivo] = useState<"movimientos" | "transito" | "ajustes">("movimientos");

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC para cancelar selección
      if (e.key === "Escape") {
        setMovimientoSeleccionadoSistema(null);
        setMovimientoSeleccionadoBanco(null);
        setShowModalGestionarPartida(false);
        setShowModalMovimiento(false);
        setShowResumenFinal(false);
      }
      
      // Enter para vincular (si hay ambos seleccionados)
      if (e.key === "Enter" && movimientoSeleccionadoSistema && movimientoSeleccionadoBanco) {
        handleVincularManual();
      }

      // Ctrl/Cmd + F para focus en búsqueda
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("search-sistema")?.focus();
      }

      // Ctrl/Cmd + M para matching automático
      if ((e.ctrlKey || e.metaKey) && e.key === "m") {
        e.preventDefault();
        handleMatchingAutomatico();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimientoSeleccionadoSistema, movimientoSeleccionadoBanco]);

  // Cuentas bancarias disponibles
  const cuentasBancarias: CuentaBancaria[] = [
    {
      id: "1",
      banco: "Banco Pichincha",
      numeroCuenta: "3456789012",
      tipoCuenta: "Corriente",
      saldoLibro: 15284.50,
    },
    {
      id: "2",
      banco: "Banco del Pacífico",
      numeroCuenta: "2109876543",
      tipoCuenta: "Corriente",
      saldoLibro: 28500.00,
    },
    {
      id: "3",
      banco: "Banco Guayaquil",
      numeroCuenta: "5678901234",
      tipoCuenta: "Ahorros",
      saldoLibro: 12750.80,
    },
  ];

  // Historial de conciliaciones (datos de ejemplo)
  const historialConciliaciones = [
    {
      id: "h1",
      periodo: "Feb 2026",
      periodoFull: "febrero-2026",
      fechaConciliacion: "2026-02-28",
      banco: "Banco Pichincha",
      numeroCuenta: "3456789012",
      movimientosConciliados: 18,
      movimientosTotales: 18,
      diferencia: 0,
      estado: "conciliado",
      saldoLibros: 14850.75,
      saldoBanco: 14850.75,
      responsable: "María González"
    },
    {
      id: "h2",
      periodo: "Feb 2026",
      periodoFull: "febrero-2026",
      fechaConciliacion: "2026-02-28",
      banco: "Banco del Pacífico",
      numeroCuenta: "2109876543",
      movimientosConciliados: 15,
      movimientosTotales: 16,
      diferencia: 125.50,
      estado: "con-diferencias",
      saldoLibros: 27875.25,
      saldoBanco: 28000.75,
      responsable: "Carlos Ruiz"
    },
    {
      id: "h3",
      periodo: "Ene 2026",
      periodoFull: "enero-2026",
      fechaConciliacion: "2026-01-31",
      banco: "Banco Pichincha",
      numeroCuenta: "3456789012",
      movimientosConciliados: 22,
      movimientosTotales: 22,
      diferencia: 0,
      estado: "conciliado",
      saldoLibros: 13250.00,
      saldoBanco: 13250.00,
      responsable: "María González"
    },
    {
      id: "h4",
      periodo: "Ene 2026",
      periodoFull: "enero-2026",
      fechaConciliacion: "2026-01-31",
      banco: "Banco Guayaquil",
      numeroCuenta: "5678901234",
      movimientosConciliados: 12,
      movimientosTotales: 12,
      diferencia: 0,
      estado: "conciliado",
      saldoLibros: 12100.50,
      saldoBanco: 12100.50,
      responsable: "Ana Torres"
    },
    {
      id: "h5",
      periodo: "Dic 2025",
      periodoFull: "diciembre-2025",
      fechaConciliacion: "2025-12-31",
      banco: "Banco del Pacífico",
      numeroCuenta: "2109876543",
      movimientosConciliados: 25,
      movimientosTotales: 27,
      diferencia: 350.00,
      estado: "con-diferencias",
      saldoLibros: 26500.00,
      saldoBanco: 26850.00,
      responsable: "Carlos Ruiz"
    },
  ];

  // Filtrar historial
  const historialFiltrado = historialConciliaciones.filter((item) => {
    const cumpleFecha = item.fechaConciliacion >= filtroFechaDesde && item.fechaConciliacion <= filtroFechaHasta;
    const cumpleBanco = filtroBancoHistorial === "all" || item.banco === filtroBancoHistorial;
    const cumpleEstado = filtroEstadoHistorial === "all" || item.estado === filtroEstadoHistorial;
    return cumpleFecha && cumpleBanco && cumpleEstado;
  });

  // Movimientos del sistema (libro auxiliar de bancos)
  const movimientosSistema: MovimientoBancario[] = [
    {
      id: "s1",
      fecha: "01/03/2026",
      descripcion: "Depósito Cliente - Factura 001-001-0145",
      referencia: "FAC-0145",
      debito: 2500.00,
      credito: 0,
      saldo: 2500.00,
      conciliado: false,
      origen: "sistema",
    },
    {
      id: "s2",
      fecha: "03/03/2026",
      descripcion: "Pago Proveedor Tech Solutions CIA. LTDA.",
      referencia: "CXP-0089",
      debito: 0,
      credito: 2016.00,
      saldo: 484.00,
      conciliado: false,
      origen: "sistema",
    },
    {
      id: "s3",
      fecha: "05/03/2026",
      descripcion: "Depósito Venta Mostrador - Varios Clientes",
      referencia: "VTA-0234",
      debito: 1850.00,
      credito: 0,
      saldo: 2334.00,
      conciliado: false,
      origen: "sistema",
    },
    {
      id: "s4",
      fecha: "07/03/2026",
      descripcion: "Cheque No. 001234 - Servicios Básicos",
      referencia: "CHQ-001234",
      debito: 0,
      credito: 450.00,
      saldo: 1884.00,
      conciliado: false,
      origen: "sistema",
    },
    {
      id: "s5",
      fecha: "10/03/2026",
      descripcion: "Transferencia Pago Nómina Empleados",
      referencia: "NOM-2026-03",
      debito: 0,
      credito: 8900.00,
      saldo: -7016.00,
      conciliado: false,
      origen: "sistema",
    },
    {
      id: "s6",
      fecha: "12/03/2026",
      descripcion: "Depósito Cliente - Abono Factura 001-001-0112",
      referencia: "FAC-0112",
      debito: 3200.00,
      credito: 0,
      saldo: -3816.00,
      conciliado: false,
      origen: "sistema",
    },
    {
      id: "s7",
      fecha: "14/03/2026",
      descripcion: "Retiro Caja Chica - Reposición Fondo",
      referencia: "CAJ-0015",
      debito: 0,
      credito: 500.00,
      saldo: -4316.00,
      conciliado: false,
      origen: "sistema",
    },
  ];

  // Movimientos del extracto bancario
  const movimientosBanco: MovimientoBancario[] = extractoCargado ? [
    {
      id: "b1",
      fecha: "01/03/2026",
      descripcion: "DEPOSITO EFECTIVO",
      referencia: "TRX-890234567",
      debito: 2500.00,
      credito: 0,
      saldo: 12784.50,
      conciliado: false,
      origen: "banco",
    },
    {
      id: "b2",
      fecha: "03/03/2026",
      descripcion: "TRANSFERENCIA ENVIADA",
      referencia: "TRF-453219087",
      debito: 0,
      credito: 2016.00,
      saldo: 10768.50,
      conciliado: false,
      origen: "banco",
    },
    {
      id: "b3",
      fecha: "05/03/2026",
      descripcion: "DEPOSITO VENTANILLA",
      referencia: "TRX-890456123",
      debito: 1850.00,
      credito: 0,
      saldo: 12618.50,
      conciliado: false,
      origen: "banco",
    },
    {
      id: "b4",
      fecha: "09/03/2026",
      descripcion: "CARGO COMISION MANEJO CTA",
      referencia: "COM-2026-03-001",
      debito: 0,
      credito: 25.00,
      saldo: 12593.50,
      conciliado: false,
      origen: "banco",
    },
    {
      id: "b5",
      fecha: "10/03/2026",
      descripcion: "TRANSFERENCIA ENVIADA",
      referencia: "TRF-453567234",
      debito: 0,
      credito: 8900.00,
      saldo: 3693.50,
      conciliado: false,
      origen: "banco",
    },
    {
      id: "b6",
      fecha: "12/03/2026",
      descripcion: "DEPOSITO VENTANILLA",
      referencia: "TRX-890567234",
      debito: 3200.00,
      credito: 0,
      saldo: 6893.50,
      conciliado: false,
      origen: "banco",
    },
    {
      id: "b7",
      fecha: "14/03/2026",
      descripcion: "RETIRO CAJERO AUTOMATICO",
      referencia: "ATM-567890234",
      debito: 0,
      credito: 500.00,
      saldo: 6393.50,
      conciliado: false,
      origen: "banco",
    },
    {
      id: "b8",
      fecha: "15/03/2026",
      descripcion: "INTERES GANADO CUENTA",
      referencia: "INT-2026-03-001",
      debito: 18.50,
      credito: 0,
      saldo: 6412.00,
      conciliado: false,
      origen: "banco",
    },
  ] : [];

  const handleSeleccionarCuenta = (cuenta: CuentaBancaria) => {
    // Verificar si la cuenta ya está conciliada
    if (conciliacionesCompletadas.includes(cuenta.id)) {
      toast.info("Cuenta ya conciliada", {
        description: `${cuenta.banco} ya fue conciliada para ${mesSeleccionado}. Puede reconciliar seleccionando otro mes.`
      });
      return;
    }
    
    setCuentaSeleccionada(cuenta);
    setPasoActual("carga-extracto");
  };

  const handleCargarExtracto = () => {
    setExtractoCargado(true);
    setPasoActual("conciliacion");
    toast.success("Extracto bancario cargado", {
      description: "Archivo procesado correctamente - 8 movimientos detectados"
    });
  };

  const handleMatchingAutomatico = () => {
    let matches = 0;
    const nuevasVinculaciones: Record<string, string> = { ...vinculaciones };

    movimientosSistema.forEach((movSistema) => {
      if (vinculaciones[movSistema.id]) return;

      const match = movimientosBanco.find((movBanco) =>
        !Object.values(nuevasVinculaciones).includes(movBanco.id) &&
        Math.abs(movSistema.debito - movBanco.debito) < 0.01 &&
        Math.abs(movSistema.credito - movBanco.credito) < 0.01 &&
        movSistema.fecha === movBanco.fecha
      );

      if (match) {
        nuevasVinculaciones[movSistema.id] = match.id;
        matches++;
      }
    });

    setVinculaciones(nuevasVinculaciones);
    toast.success("Matching automático ejecutado", {
      description: `${matches} movimiento(s) conciliado(s) automáticamente`
    });
  };

  const handleVincularManual = (idSistemaParam?: string, idBancoParam?: string) => {
    const idSistema = idSistemaParam || movimientoSeleccionadoSistema;
    const idBanco = idBancoParam || movimientoSeleccionadoBanco;

    if (!idSistema || !idBanco) {
      if (!idSistemaParam && !idBancoParam) {
        toast.error("Selección incompleta", {
          description: "Debe seleccionar un movimiento de cada panel"
        });
      }
      return;
    }

    const movSistema = movimientosSistema.find(m => m.id === idSistema);
    const movBanco = movimientosBanco.find(m => m.id === idBanco);

    if (!movSistema || !movBanco) return;

    const diferenciaDebito = Math.abs(movSistema.debito - movBanco.debito);
    const diferenciaCredito = Math.abs(movSistema.credito - movBanco.credito);

    if (diferenciaDebito > 0.01 || diferenciaCredito > 0.01) {
      toast.error("Montos no coinciden", {
        description: `Sistema: $${(movSistema.debito + movSistema.credito).toFixed(2)} | Banco: $${(movBanco.debito + movBanco.credito).toFixed(2)}`
      });
      return;
    }

    setVinculaciones({
      ...vinculaciones,
      [idSistema]: idBanco
    });

    toast.success("✓ Vinculación exitosa", {
      description: `${movSistema.descripcion.substring(0, 30)}...`
    });
    setMovimientoSeleccionadoSistema(null);
    setMovimientoSeleccionadoBanco(null);
  };

  const handleDesvincular = (sistemaId: string) => {
    const nuevasVinculaciones = { ...vinculaciones };
    delete nuevasVinculaciones[sistemaId];
    setVinculaciones(nuevasVinculaciones);
    toast.info("Vinculación eliminada");
  };

  const handleGenerarAsientoContable = (movimiento: MovimientoBancario) => {
    setMovimientoAGenerar(movimiento);
    
    if (movimiento.debito > 0) {
      setDatosMovimientoContable({
        cuentaDebito: `1.1.01.01 - ${cuentaSeleccionada?.banco || 'Banco'}`,
        cuentaCredito: "4.3.01 - Otros Ingresos",
        descripcion: movimiento.descripcion,
        centroCosto: "Administrativo",
      });
    } else {
      setDatosMovimientoContable({
        cuentaDebito: "5.3.01 - Gastos Bancarios",
        cuentaCredito: `1.1.01.01 - ${cuentaSeleccionada?.banco || 'Banco'}`,
        descripcion: movimiento.descripcion,
        centroCosto: "Administrativo",
      });
    }
    
    setShowModalMovimiento(true);
  };

  const handleGuardarAsiento = () => {
    if (!datosMovimientoContable.cuentaDebito || !datosMovimientoContable.cuentaCredito) {
      toast.error("Datos incompletos", {
        description: "Complete las cuentas contables"
      });
      return;
    }

    const tipoMov = movimientoAGenerar && movimientoAGenerar.debito > 0 ? "ING" : "EGR";
    const numeroMov = Math.floor(Math.random() * 900) + 100;
    const codigoMovimiento = `${tipoMov}-2026-${numeroMov.toString().padStart(3, '0')}`;

    toast.success("Asiento contable generado", {
      description: `Código ${codigoMovimiento} registrado exitosamente`
    });

    setShowModalMovimiento(false);
    setMovimientoAGenerar(null);
  };

  const handleReiniciar = () => {
    setPasoActual("seleccion-cuenta");
    setCuentaSeleccionada(null);
    setExtractoCargado(false);
    setVinculaciones({});
    setMovimientoSeleccionadoSistema(null);
    setMovimientoSeleccionadoBanco(null);
  };

  const handleVerDetalleConciliacion = (conciliacion: any) => {
    // Generar datos detallados según el ID de la conciliación
    const detallesExtendidos = generarDetallesConciliacion(conciliacion);
    setConciliacionDetallada(detallesExtendidos);
    setShowModalDetalle(true);
    setTabDetalleActivo("movimientos");
  };

  // Función para generar detalles completos de una conciliación
  const generarDetallesConciliacion = (conciliacion: any) => {
    const movimientosConciliadosDetalle = [];
    const partidasTransito = [];
    const ajustesRealizados = [];

    // Generar movimientos conciliados según el banco y período
    if (conciliacion.banco === "Banco del Pacífico" && conciliacion.periodo === "Feb 2026") {
      movimientosConciliadosDetalle.push(
        { fecha: "03/02/2026", descripcion: "Depósito Cliente - Factura 001-001-0289", monto: 3500.00, tipo: "débito", refSistema: "FAC-0289", refBanco: "TRX-567234" },
        { fecha: "05/02/2026", descripcion: "Transferencia a Proveedor XYZ S.A.", monto: 2150.00, tipo: "crédito", refSistema: "CXP-0234", refBanco: "TRF-892345" },
        { fecha: "07/02/2026", descripcion: "Depósito Venta Mostrador", monto: 1875.50, tipo: "débito", refSistema: "VTA-0145", refBanco: "TRX-567890" },
        { fecha: "10/02/2026", descripcion: "Cheque No. 002345 - Servicios", monto: 650.00, tipo: "crédito", refSistema: "CHQ-002345", refBanco: "CHQ-002345" },
        { fecha: "12/02/2026", descripcion: "Transferencia Recibida Cliente ABC", monto: 4200.00, tipo: "débito", refSistema: "FAC-0301", refBanco: "TRF-234567" },
        { fecha: "14/02/2026", descripción: "Pago Nómina Quincenal", monto: 5500.00, tipo: "crédito", refSistema: "NOM-2026-02-1", refBanco: "TRF-345678" },
        { fecha: "17/02/2026", descripcion: "Depósito Efectivo Caja", monto: 2850.00, tipo: "débito", refSistema: "CAJ-0089", refBanco: "TRX-678901" },
        { fecha: "19/02/2026", descripcion: "Transferencia Proveedor DEF CIA", monto: 3100.00, tipo: "crédito", refSistema: "CXP-0245", refBanco: "TRF-456789" },
        { fecha: "21/02/2026", descripcion: "Depósito Cliente - Varias Facturas", monto: 5600.00, tipo: "débito", refSistema: "FAC-0312", refBanco: "TRX-789012" },
        { fecha: "23/02/2026", descripcion: "Cheque No. 002346 - Arriendo Local", monto: 1200.00, tipo: "crédito", refSistema: "CHQ-002346", refBanco: "CHQ-002346" },
        { fecha: "25/02/2026", descripcion: "Transferencia Recibida", monto: 3750.00, tipo: "débito", refSistema: "FAC-0325", refBanco: "TRF-567890" },
        { fecha: "26/02/2026", descripcion: "Pago Servicios Básicos", monto: 425.75, tipo: "crédito", refSistema: "CXP-0250", refBanco: "DBT-678901" },
        { fecha: "27/02/2026", descripcion: "Depósito Venta Crédito", monto: 2950.00, tipo: "débito", refSistema: "VTA-0178", refBanco: "TRX-890123" },
        { fecha: "28/02/2026", descripcion: "Transferencia Pago Impuestos", monto: 1850.00, tipo: "crédito", refSistema: "IMP-2026-02", refBanco: "TRF-901234" },
        { fecha: "28/02/2026", descripcion: "Depósito Final Mes", monto: 4100.00, tipo: "débito", refSistema: "FAC-0340", refBanco: "TRX-012345" }
      );
      partidasTransito.push(
        { fecha: "28/02/2026", descripcion: "Cheque No. 002347 - Pendiente Cobro", monto: 125.50, tipo: "En Tránsito", origen: "Sistema", justificacion: "Cheque emitido el último día del mes, no cobrado aún por el beneficiario" }
      );
    } else if (conciliacion.banco === "Banco Pichincha" && conciliacion.periodo === "Feb 2026") {
      movimientosConciliadosDetalle.push(
        { fecha: "01/02/2026", descripcion: "Depósito Inicial Mes", monto: 2500.00, tipo: "débito", refSistema: "FAC-0275", refBanco: "TRX-445566" },
        { fecha: "04/02/2026", descripcion: "Pago Proveedor Suministros", monto: 1200.00, tipo: "crédito", refSistema: "CXP-0228", refBanco: "TRF-778899" },
        { fecha: "06/02/2026", descripcion: "Depósito Cliente Premium", monto: 3800.00, tipo: "débito", refSistema: "FAC-0280", refBanco: "TRX-112233" },
        { fecha: "09/02/2026", descripcion: "Transferencia Nómina", monto: 4500.00, tipo: "crédito", refSistema: "NOM-2026-02-1", refBanco: "TRF-445566" },
        { fecha: "11/02/2026", descripcion: "Depósito Ventas Varias", monto: 2150.75, tipo: "débito", refSistema: "VTA-0150", refBanco: "TRX-778899" },
        { fecha: "13/02/2026", descripcion: "Cheque Servicios Públicos", monto: 385.00, tipo: "crédito", refSistema: "CHQ-001890", refBanco: "CHQ-001890" },
        { fecha: "16/02/2026", descripcion: "Depósito Transferencia Recibida", monto: 5200.00, tipo: "débito", refSistema: "FAC-0295", refBanco: "TRF-112233" },
        { fecha: "18/02/2026", descripcion: "Pago Proveedores Varios", monto: 2800.00, tipo: "crédito", refSistema: "CXP-0235", refBanco: "TRF-445566" },
        { fecha: "20/02/2026", descripcion: "Depósito Efectivo", monto: 1950.00, tipo: "débito", refSistema: "CAJ-0075", refBanco: "TRX-778899" },
        { fecha: "22/02/2026", descripcion: "Transferencia Arriendo", monto: 1500.00, tipo: "crédito", refSistema: "CXP-0240", refBanco: "TRF-112233" },
        { fecha: "24/02/2026", descripcion: "Depósito Cliente Corporativo", monto: 6800.00, tipo: "débito", refSistema: "FAC-0315", refBanco: "TRX-445566" },
        { fecha: "25/02/2026", descripcion: "Pago Seguros", monto: 750.00, tipo: "crédito", refSistema: "CXP-0242", refBanco: "TRF-778899" },
        { fecha: "26/02/2026", descripcion: "Depósito Varias Facturas", monto: 3200.00, tipo: "débito", refSistema: "FAC-0322", refBanco: "TRX-112233" },
        { fecha: "27/02/2026", descripcion: "Cheque Mantenimiento", monto: 425.00, tipo: "crédito", refSistema: "CHQ-001891", refBanco: "CHQ-001891" },
        { fecha: "27/02/2026", descripcion: "Depósito Cliente Mayor", monto: 4500.00, tipo: "débito", refSistema: "FAC-0335", refBanco: "TRX-445566" },
        { fecha: "28/02/2026", descripcion: "Transferencia Impuestos", monto: 1200.00, tipo: "crédito", refSistema: "IMP-2026-02", refBanco: "TRF-778899" },
        { fecha: "28/02/2026", descripcion: "Depósito Cierre Mes", monto: 2800.00, tipo: "débito", refSistema: "VTA-0185", refBanco: "TRX-112233" },
        { fecha: "28/02/2026", descripcion: "Comisión Bancaria", monto: 28.00, tipo: "crédito", refSistema: "N/A", refBanco: "COM-022026" }
      );
    } else if (conciliacion.banco === "Banco del Pacífico" && conciliacion.periodo === "Dic 2025") {
      movimientosConciliadosDetalle.push(
        { fecha: "02/12/2025", descripcion: "Depósito Cliente - Factura 001-001-0201", monto: 4200.00, tipo: "débito", refSistema: "FAC-0201", refBanco: "TRX-334455" },
        { fecha: "05/12/2025", descripcion: "Pago Proveedor Importación", monto: 5800.00, tipo: "crédito", refSistema: "CXP-0198", refBanco: "TRF-556677" },
        { fecha: "08/12/2025", descripcion: "Depósito Ventas Navideñas", monto: 7500.00, tipo: "débito", refSistema: "VTA-0120", refBanco: "TRX-778899" },
        { fecha: "10/12/2025", descripcion: "Transferencia Nómina Mensual", monto: 8900.00, tipo: "crédito", refSistema: "NOM-2025-12", refBanco: "TRF-990011" },
        { fecha: "12/12/2025", descripcion: "Depósito Cliente Corporativo", monto: 6200.00, tipo: "débito", refSistema: "FAC-0215", refBanco: "TRX-223344" },
        { fecha: "15/12/2025", descripcion: "Cheque Aguinaldo Personal", monto: 3500.00, tipo: "crédito", refSistema: "CHQ-002250", refBanco: "CHQ-002250" },
        { fecha: "17/12/2025", descripcion: "Depósito Ventas Especiales", monto: 5800.00, tipo: "débito", refSistema: "VTA-0128", refBanco: "TRX-445566" },
        { fecha: "19/12/2025", descripcion: "Transferencia Proveedores", monto: 4200.00, tipo: "crédito", refSistema: "CXP-0210", refBanco: "TRF-667788" },
        { fecha: "20/12/2025", descripcion: "Depósito Final Campaña", monto: 8900.00, tipo: "débito", refSistema: "VTA-0135", refBanco: "TRX-889900" },
        { fecha: "22/12/2025", descripcion: "Pago Bonos Navideños", monto: 5200.00, tipo: "crédito", refSistema: "NOM-BONUS-12", refBanco: "TRF-001122" },
        { fecha: "23/12/2025", descripcion: "Depósito Cliente Premium", monto: 4500.00, tipo: "débito", refSistema: "FAC-0235", refBanco: "TRX-334455" },
        { fecha: "26/12/2025", descripcion: "Transferencia Servicios Anuales", monto: 2800.00, tipo: "crédito", refSistema: "CXP-0220", refBanco: "TRF-556677" },
        { fecha: "27/12/2025", descripcion: "Depósito Ventas Post-Navidad", monto: 3600.00, tipo: "débito", refSistema: "VTA-0142", refBanco: "TRX-778899" },
        { fecha: "28/12/2025", descripcion: "Cheque Arriendo Diciembre", monto: 1800.00, tipo: "crédito", refSistema: "CHQ-002251", refBanco: "CHQ-002251" },
        { fecha: "29/12/2025", descripcion: "Depósito Cobros Varios", monto: 2950.00, tipo: "débito", refSistema: "FAC-0245", refBanco: "TRX-990011" },
        { fecha: "30/12/2025", descripcion: "Pago Impuestos Fin Año", monto: 3200.00, tipo: "crédito", refSistema: "IMP-2025-12", refBanco: "TRF-223344" },
        { fecha: "30/12/2025", descripcion: "Depósito Cierre Anual", monto: 5400.00, tipo: "débito", refSistema: "VTA-0148", refBanco: "TRX-445566" },
        { fecha: "31/12/2025", descripcion: "Comisión Manejo Cuenta", monto: 45.00, tipo: "crédito", refSistema: "N/A", refBanco: "COM-122025" },
        { fecha: "31/12/2025", descripcion: "Interés Ganado Diciembre", monto: 125.00, tipo: "débito", refSistema: "N/A", refBanco: "INT-122025" },
        { fecha: "31/12/2025", descripcion: "Cargo Mantenimiento Anual", monto: 280.00, tipo: "crédito", refSistema: "N/A", refBanco: "MANT-2025" }
      );
      partidasTransito.push(
        { fecha: "30/12/2025", descripcion: "Transferencia Cliente ABC - Pendiente", monto: 1500.00, tipo: "En Tránsito", origen: "Sistema", justificacion: "Transferencia iniciada el 30/12, acreditada en enero por cierre de año" },
        { fecha: "31/12/2025", descripcion: "Cheque No. 002252 - No Cobrado", monto: 850.00, tipo: "En Tránsito", origen: "Sistema", justificacion: "Cheque emitido fin de año, no presentado al banco" }
      );
      ajustesRealizados.push(
        { fecha: "31/12/2025", descripcion: "Ajuste Comisión Manejo Cuenta", monto: 45.00, tipo: "Cargo Banco", cuenta: "5.3.01 - Gastos Bancarios", asiento: "AJ-2025-045", notas: "Comisión no registrada en sistema, ajustada al cierre" },
        { fecha: "31/12/2025", descripcion: "Ajuste Interés Ganado", monto: 125.00, tipo: "Abono Banco", cuenta: "4.3.02 - Ingresos Financieros", asiento: "AJ-2025-046", notas: "Interés bancario no contabilizado, ajuste por conciliación" },
        { fecha: "31/12/2025", descripcion: "Ajuste Cargo Mantenimiento Anual", monto: 280.00, tipo: "Cargo Banco", cuenta: "5.3.01 - Gastos Bancarios", asiento: "AJ-2025-047", notas: "Cargo anual del banco no previsto en registros contables" }
      );
    } else {
      // Datos genéricos para otras conciliaciones
      for (let i = 1; i <= conciliacion.movimientosConciliados; i++) {
        movimientosConciliadosDetalle.push({
          fecha: `${String(i).padStart(2, '0')}/${conciliacion.periodo.split(' ')[0] === 'Ene' ? '01' : conciliacion.periodo.split(' ')[0] === 'Feb' ? '02' : '01'}/2026`,
          descripcion: `Movimiento Conciliado ${i}`,
          monto: Math.random() * 5000 + 500,
          tipo: i % 2 === 0 ? "débito" : "crédito",
          refSistema: `REF-${String(i).padStart(4, '0')}`,
          refBanco: `TRX-${String(i).padStart(6, '0')}`
        });
      }
    }

    return {
      ...conciliacion,
      movimientosDetalle: movimientosConciliadosDetalle,
      partidasTransito,
      ajustesRealizados
    };
  };

  const handleFinalizarConciliacion = () => {
    const pendientes = movimientosSistema.length - Object.keys(vinculaciones).length;
    const bancoNombre = cuentaSeleccionada?.banco || "Banco";
    
    if (pendientes > 0 || pendientesBanco > 0) {
      // Mostrar resumen de partidas pendientes
      setShowResumenFinal(true);
      return;
    }

    // Conciliación perfecta - todos los movimientos cuadrados
    const cuentaId = cuentaSeleccionada?.id || "";
    
    toast.success("¡Conciliación perfecta!", {
      description: `${bancoNombre} - ${mesSeleccionado}: ${vinculados} movimientos conciliados sin diferencias`
    });
    
    // Marcar cuenta como conciliada
    if (cuentaId && !conciliacionesCompletadas.includes(cuentaId)) {
      setConciliacionesCompletadas([...conciliacionesCompletadas, cuentaId]);
    }
    
    // Resetear todo para iniciar con otro banco
    setTimeout(() => {
      setPasoActual("seleccion-cuenta");
      setCuentaSeleccionada(null);
      setExtractoCargado(false);
      setVinculaciones({});
      setMovimientoSeleccionadoSistema(null);
      setMovimientoSeleccionadoBanco(null);
      setSearchTermSistema("");
      setSearchTermBanco("");
      
      toast.info("Listo para nueva conciliación", {
        description: "Puede seleccionar otra cuenta bancaria para conciliar"
      });
    }, 1500);
  };

  const handleGestionarPartida = (movimiento: MovimientoBancario) => {
    setPartidaSeleccionada(movimiento);
    setJustificacion("");
    setTipoPartida("transito");
    setShowModalGestionarPartida(true);
  };

  const handleGuardarGestionPartida = () => {
    if (!justificacion.trim()) {
      toast.error("Justificación requerida", {
        description: "Debe explicar el motivo de esta partida no conciliada"
      });
      return;
    }

    const tipoTexto = tipoPartida === "transito" ? "Partida en tránsito" : tipoPartida === "ajuste" ? "Requiere ajuste" : "Error detectado";
    toast.success(`${tipoTexto} registrado`, {
      description: partidaSeleccionada?.descripcion
    });

    setShowModalGestionarPartida(false);
    setPartidaSeleccionada(null);
  };

  const handleFinalizarConPartidas = () => {
    const bancoNombre = cuentaSeleccionada?.banco || "Banco";
    const cuentaId = cuentaSeleccionada?.id || "";
    
    toast.success("Conciliación finalizada exitosamente", {
      description: `${bancoNombre} - ${mesSeleccionado} completado con ${vinculados} movimientos conciliados`
    });
    setShowResumenFinal(false);
    
    // Marcar cuenta como conciliada
    if (cuentaId && !conciliacionesCompletadas.includes(cuentaId)) {
      setConciliacionesCompletadas([...conciliacionesCompletadas, cuentaId]);
    }
    
    // Resetear todo para iniciar con otro banco
    setTimeout(() => {
      setPasoActual("seleccion-cuenta");
      setCuentaSeleccionada(null);
      setExtractoCargado(false);
      setVinculaciones({});
      setMovimientoSeleccionadoSistema(null);
      setMovimientoSeleccionadoBanco(null);
      setSearchTermSistema("");
      setSearchTermBanco("");
      
      toast.info("Listo para nueva conciliación", {
        description: "Puede seleccionar otra cuenta bancaria para conciliar"
      });
    }, 1500);
  };

  // Filtrado avanzado
  let movimientosSistemaFiltrados = movimientosSistema.filter(m => {
    const matchSearch = m.descripcion.toLowerCase().includes(searchTermSistema.toLowerCase()) ||
      m.referencia.toLowerCase().includes(searchTermSistema.toLowerCase());
    
    const matchMontoMin = filtroMontoMin ? (m.debito + m.credito) >= parseFloat(filtroMontoMin) : true;
    const matchMontoMax = filtroMontoMax ? (m.debito + m.credito) <= parseFloat(filtroMontoMax) : true;
    
    const matchVista = vistaActual === "todos" ? true :
      vistaActual === "conciliados" ? !!vinculaciones[m.id] :
      !vinculaciones[m.id];
    
    return matchSearch && matchMontoMin && matchMontoMax && matchVista;
  });

  let movimientosBancoFiltrados = movimientosBanco.filter(m => {
    const matchSearch = m.descripcion.toLowerCase().includes(searchTermBanco.toLowerCase()) ||
      m.referencia.toLowerCase().includes(searchTermBanco.toLowerCase());
    
    const matchMontoMin = filtroMontoMin ? (m.debito + m.credito) >= parseFloat(filtroMontoMin) : true;
    const matchMontoMax = filtroMontoMax ? (m.debito + m.credito) <= parseFloat(filtroMontoMax) : true;
    
    const matchVista = vistaActual === "todos" ? true :
      vistaActual === "conciliados" ? Object.values(vinculaciones).includes(m.id) :
      !Object.values(vinculaciones).includes(m.id);
    
    return matchSearch && matchMontoMin && matchMontoMax && matchVista;
  });

  // Aplicar ordenamiento
  const sortMovimientos = (movs: MovimientoBancario[]) => {
    return [...movs].sort((a, b) => {
      if (ordenamiento === "fecha") {
        return a.fecha.localeCompare(b.fecha);
      } else if (ordenamiento === "monto") {
        const montoA = a.debito + a.credito;
        const montoB = b.debito + b.credito;
        return montoB - montoA;
      } else {
        return a.descripcion.localeCompare(b.descripcion);
      }
    });
  };

  movimientosSistemaFiltrados = sortMovimientos(movimientosSistemaFiltrados);
  movimientosBancoFiltrados = sortMovimientos(movimientosBancoFiltrados);

  const totalDebitoSistema = movimientosSistema.reduce((sum, m) => sum + m.debito, 0);
  const totalCreditoSistema = movimientosSistema.reduce((sum, m) => sum + m.credito, 0);
  const totalDebitoBanco = movimientosBanco.reduce((sum, m) => sum + m.debito, 0);
  const totalCreditoBanco = movimientosBanco.reduce((sum, m) => sum + m.credito, 0);
  
  const saldoFinalSistema = totalDebitoSistema - totalCreditoSistema;
  const saldoFinalBanco = movimientosBanco.length > 0 ? movimientosBanco[movimientosBanco.length - 1].saldo : 0;
  const diferencia = saldoFinalSistema - saldoFinalBanco;
  
  const vinculados = Object.keys(vinculaciones).length;
  const pendientesSistema = movimientosSistema.filter(m => !vinculaciones[m.id]).length;
  const pendientesBanco = movimientosBanco.filter(m => !Object.values(vinculaciones).includes(m.id)).length;

  // PASO 1: SELECCIÓN DE CUENTA BANCARIA
  if (pasoActual === "seleccion-cuenta") {
    return (
      <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        {/* Encabezado */}
        

        {/* Sub-Tabs */}
        <div className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex gap-1">
            <button
              onClick={() => setSubTabActivo("conciliaciones")}
              className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                subTabActivo === "conciliaciones"
                  ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                  : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
              }`}
            >
              <Building2 className="w-4 h-4" />
              Conciliaciones
            </button>
            <button
              onClick={() => setSubTabActivo("historial")}
              className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                subTabActivo === "historial"
                  ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                  : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
              }`}
            >
              <History className="w-4 h-4" />
              Historial de Conciliaciones
            </button>
          </div>
        </div>

        {/* Contenido Tab Conciliaciones */}
        {subTabActivo === "conciliaciones" && (
          <div className="space-y-4">
            {/* Resumen de estado */}
            {conciliacionesCompletadas.length > 0 && (
            <div className="mt-4 flex items-center gap-6">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p className="text-xs text-gray-400">Pendientes</p>
                  <p className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {cuentasBancarias.length - conciliacionesCompletadas.length}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20"
              }`}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  <p className="text-xs text-gray-400">Conciliadas</p>
                  <p className="text-sm font-bold text-green-400">
                    {conciliacionesCompletadas.length}
                  </p>
                </div>
              </div>
            </div>
          )}

            {/* Selector de mes */}
            <div className={`p-4 rounded-lg border ${
              isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
            }`}>
          <label className={`text-sm font-medium mb-2 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
            Período a Conciliar
          </label>
          <select
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm ${
              isLight
                ? "bg-white border-gray-200 text-gray-900"
                : "bg-white/5 border-white/10 text-white"
            }`}
          >
            <option value="marzo-2026">Marzo 2026</option>
            <option value="febrero-2026">Febrero 2026</option>
            <option value="enero-2026">Enero 2026</option>
            <option value="diciembre-2025">Diciembre 2025</option>
          </select>
        </div>

        {/* Mensaje de completitud */}
        {conciliacionesCompletadas.length === cuentasBancarias.length && (
          <div className={`p-5 rounded-lg border ${
            isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20"
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h4 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  ¡Todas las cuentas conciliadas!
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Ha completado la conciliación de todas las cuentas bancarias para {mesSeleccionado}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Cuentas Bancarias */}
        <div className={`rounded-lg overflow-hidden ${
          isLight ? "bg-gray-50" : "bg-secondary/50"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isLight ? "bg-gray-100" : "bg-[#0D1B2A]"}>
                <tr>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}>
                    Banco
                  </th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}>
                    Tipo Cuenta
                  </th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}>
                    Nº Cuenta
                  </th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}>
                    Saldo en Libros
                  </th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}>
                    Estado
                  </th>
                  <th className={`text-center px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isLight ? "bg-white divide-gray-100" : "bg-card divide-white/10"
              }`}>
                {cuentasBancarias.map((cuenta) => {
                  const estaConciliada = conciliacionesCompletadas.includes(cuenta.id);
                  
                  return (
                    <tr
                      key={cuenta.id}
                      className={`transition-colors ${
                        estaConciliada
                          ? isLight ? "bg-green-50/50" : "bg-green-500/5"
                          : isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
                      }`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            estaConciliada
                              ? "bg-green-500/20"
                              : "bg-primary/10"
                          }`}>
                            <Building2 className={`w-4 h-4 ${estaConciliada ? "text-green-400" : "text-primary"}`} />
                          </div>
                          <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            {cuenta.banco}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-400"}`}>{cuenta.tipoCuenta}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-400"}`}>{cuenta.numeroCuenta}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                          ${cuenta.saldoLibro.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {estaConciliada ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Conciliado
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                            isLight ? "bg-yellow-500/10 text-yellow-600" : "bg-yellow-500/10 text-yellow-400"
                          }`}>
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleSeleccionarCuenta(cuenta)}
                          disabled={estaConciliada}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            estaConciliada
                              ? "bg-gray-500/20 text-gray-500 cursor-not-allowed opacity-50"
                              : "bg-primary hover:bg-primary/90 text-white"
                          }`}
                        >
                          {estaConciliada ? "Conciliado" : "Conciliar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
          </div>
        )}

        {/* Contenido Tab Historial */}
        {subTabActivo === "historial" && (
          <div className="space-y-4">
            {/* Filtros */}
            <div className={`p-4 rounded-lg border ${
              isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    value={filtroFechaDesde}
                    onChange={(e) => setFiltroFechaDesde(e.target.value)}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    value={filtroFechaHasta}
                    onChange={(e) => setFiltroFechaHasta(e.target.value)}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Banco
                  </label>
                  <select
                    value={filtroBancoHistorial}
                    onChange={(e) => setFiltroBancoHistorial(e.target.value)}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="all">Todos los bancos</option>
                    <option value="Banco Pichincha">Banco Pichincha</option>
                    <option value="Banco del Pacífico">Banco del Pacífico</option>
                    <option value="Banco Guayaquil">Banco Guayaquil</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Estado
                  </label>
                  <select
                    value={filtroEstadoHistorial}
                    onChange={(e) => setFiltroEstadoHistorial(e.target.value)}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="conciliado">Conciliado</option>
                    <option value="con-diferencias">Con diferencias</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabla de Historial */}
            <div className={`rounded-lg overflow-hidden ${
              isLight ? "bg-gray-50" : "bg-secondary/50"
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={isLight ? "bg-gray-100" : "bg-[#0D1B2A]"}>
                    <tr>
                      <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                        isLight ? "text-gray-600" : "text-white/70"
                      }`}>
                        Período
                      </th>
                      <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                        isLight ? "text-gray-600" : "text-white/70"
                      }`}>
                        Banco
                      </th>
                      <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                        isLight ? "text-gray-600" : "text-white/70"
                      }`}>
                        Nº Cuenta
                      </th>
                      <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                        isLight ? "text-gray-600" : "text-white/70"
                      }`}>
                        Movimientos
                      </th>
                      <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                        isLight ? "text-gray-600" : "text-white/70"
                      }`}>
                        Saldo Libros
                      </th>
                      <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                        isLight ? "text-gray-600" : "text-white/70"
                      }`}>
                        Saldo Banco
                      </th>
                      <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                        isLight ? "text-gray-600" : "text-white/70"
                      }`}>
                        Diferencia
                      </th>
                      <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                        isLight ? "text-gray-600" : "text-white/70"
                      }`}>
                        Estado
                      </th>
                      <th className={`text-center px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                        isLight ? "text-gray-600" : "text-white/70"
                      }`}>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    isLight ? "bg-white divide-gray-100" : "bg-card divide-white/10"
                  }`}>
                    {historialFiltrado.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-3 py-12 text-center">
                          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-gray-400">
                            No se encontraron conciliaciones con los filtros aplicados
                          </p>
                        </td>
                      </tr>
                    ) : (
                      historialFiltrado.map((item) => (
                        <tr
                          key={item.id}
                          className={isLight ? "hover:bg-gray-50 transition-colors" : "hover:bg-white/5 transition-colors"}
                        >
                          <td className="px-4 py-4">
                            <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-400"}`}>{item.periodo}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                              {item.banco}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-400"}`}>{item.numeroCuenta}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-400"}`}>
                              {item.movimientosConciliados}/{item.movimientosTotales}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                              ${item.saldoLibros.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                              ${item.saldoBanco.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-sm font-semibold ${
                              item.diferencia === 0 
                                ? isLight ? "text-green-600" : "text-green-400"
                                : isLight ? "text-yellow-600" : "text-yellow-400"
                            }`}>
                              ${Math.abs(item.diferencia).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {item.estado === "conciliado" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Conciliado
                              </span>
                            ) : (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/10 text-xs font-medium ${
                                isLight ? "text-yellow-600" : "text-yellow-400"
                              }`}>
                                <AlertCircle className="w-3 h-3" />
                                Con diferencias
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <button
                              onClick={() => handleVerDetalleConciliacion(item)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isLight ? "hover:bg-blue-50 text-blue-600" : "hover:bg-blue-500/10 text-blue-400"
                              }`}
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumen del historial */}
            {historialFiltrado.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                
                
                
              </div>
            )}
          </div>
        )}

        {/* Modal Detalle de Conciliación */}
        {showModalDetalle && conciliacionDetallada && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${
              isLight ? "bg-white" : "bg-[#1a2936]"
            }`}>
              {/* Header Modal */}
              <div className="bg-[#0D1B2A] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Detalle de Conciliación - {conciliacionDetallada.banco}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {conciliacionDetallada.periodo} • Cuenta: {conciliacionDetallada.numeroCuenta}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModalDetalle(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Body Modal */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Resumen - FIJO EN PRIMERA FILA */}
                <div className={`p-6 border-b sticky top-0 z-10 ${
                  isLight ? "bg-white border-gray-200" : "bg-[#1a2936] border-white/10"
                }`}>
                  <div className="grid grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg border ${
                      isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                    }`}>
                      <p className="text-xs text-gray-400 mb-1">Movimientos Conciliados</p>
                      <p className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {conciliacionDetallada.movimientosConciliados}/{conciliacionDetallada.movimientosTotales}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg border ${
                      isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"
                    }`}>
                      <p className="text-xs text-gray-400 mb-1">Saldo en Libros</p>
                      <p className="text-xl font-bold text-blue-400">
                        ${conciliacionDetallada.saldoLibros.toFixed(2)}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg border ${
                      isLight ? "bg-purple-50 border-purple-200" : "bg-purple-500/10 border-purple-500/20"
                    }`}>
                      <p className="text-xs text-gray-400 mb-1">Saldo Banco</p>
                      <p className="text-xl font-bold text-purple-400">
                        ${conciliacionDetallada.saldoBanco.toFixed(2)}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg border ${
                      conciliacionDetallada.diferencia === 0
                        ? isLight 
                          ? "bg-green-50 border-green-200" 
                          : "bg-green-500/10 border-green-500/20"
                        : isLight
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-yellow-500/10 border-yellow-500/20"
                    }`}>
                      <p className="text-xs text-gray-400 mb-1">Diferencia</p>
                      <p className={`text-xl font-bold ${
                        conciliacionDetallada.diferencia === 0 ? "text-green-400" : "text-yellow-400"
                      }`}>
                        ${Math.abs(conciliacionDetallada.diferencia).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Información adicional */}
                  <div className={`p-4 rounded-lg border mb-6 ${
                    isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
                  }`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Responsable</p>
                        <p className={`text-sm font-medium mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                          {conciliacionDetallada.responsable}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Fecha de Conciliación</p>
                        <p className={`text-sm font-medium mt-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                          {new Date(conciliacionDetallada.fechaConciliacion).toLocaleDateString('es-EC', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs de Detalle */}
                  <div className={`border-b mb-4 ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setTabDetalleActivo("movimientos")}
                        className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                          tabDetalleActivo === "movimientos"
                            ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                            : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        Movimientos Conciliados
                        <span className={`ml-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          tabDetalleActivo === "movimientos" 
                            ? "bg-primary/20 text-primary" 
                            : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
                        }`}>
                          {conciliacionDetallada.movimientosDetalle?.length || 0}
                        </span>
                      </button>
                      <button
                        onClick={() => setTabDetalleActivo("transito")}
                        className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                          tabDetalleActivo === "transito"
                            ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                            : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        Partidas en Tránsito
                        <span className={`ml-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          tabDetalleActivo === "transito" 
                            ? "bg-primary/20 text-primary" 
                            : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
                        }`}>
                          {conciliacionDetallada.partidasTransito?.length || 0}
                        </span>
                      </button>
                      <button
                        onClick={() => setTabDetalleActivo("ajustes")}
                        className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${
                          tabDetalleActivo === "ajustes"
                            ? `border-b-2 border-primary ${isLight ? "text-primary" : "text-primary"}`
                            : `${isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"}`
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        Ajustes Realizados
                        <span className={`ml-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          tabDetalleActivo === "ajustes" 
                            ? "bg-primary/20 text-primary" 
                            : isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
                        }`}>
                          {conciliacionDetallada.ajustesRealizados?.length || 0}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Contenido de Tabs */}
                  {tabDetalleActivo === "movimientos" && (
                    <div className={`rounded-lg overflow-hidden ${
                      isLight ? "bg-gray-50" : "bg-secondary/50"
                    }`}>
                      {conciliacionDetallada.movimientosDetalle && conciliacionDetallada.movimientosDetalle.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className={isLight ? "bg-gray-100" : "bg-[#0D1B2A]"}>
                              <tr>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Fecha</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Descripción</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Ref. Sistema</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Ref. Banco</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Tipo</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Monto</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${
                              isLight ? "bg-white divide-gray-100" : "bg-card divide-white/10"
                            }`}>
                              {conciliacionDetallada.movimientosDetalle.map((mov: any, idx: number) => (
                                <tr key={idx} className={isLight ? "hover:bg-gray-50 transition-colors" : "hover:bg-white/5 transition-colors"}>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-400"}`}>{mov.fecha}</span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                                      {mov.descripcion}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-400"}`}>{mov.refSistema}</span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-400"}`}>{mov.refBanco}</span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                                      mov.tipo === "débito"
                                        ? "bg-green-500/10 text-green-400"
                                        : "bg-red-500/10 text-red-400"
                                    }`}>
                                      {mov.tipo === "débito" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                      {mov.tipo === "débito" ? "Débito" : "Crédito"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-semibold ${
                                      mov.tipo === "débito" 
                                        ? isLight ? "text-green-600" : "text-green-400"
                                        : isLight ? "text-red-600" : "text-red-400"
                                    }`}>
                                      ${mov.monto.toFixed(2)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-gray-400">No hay movimientos conciliados</p>
                        </div>
                      )}
                    </div>
                  )}

                  {tabDetalleActivo === "transito" && (
                    <div className={`rounded-lg overflow-hidden ${
                      isLight ? "bg-gray-50" : "bg-secondary/50"
                    }`}>
                      {conciliacionDetallada.partidasTransito && conciliacionDetallada.partidasTransito.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className={isLight ? "bg-gray-100" : "bg-[#0D1B2A]"}>
                              <tr>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Fecha</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Descripción</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Tipo</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Origen</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Monto</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Justificación</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${
                              isLight ? "bg-white divide-gray-100" : "bg-card divide-white/10"
                            }`}>
                              {conciliacionDetallada.partidasTransito.map((partida: any, idx: number) => (
                                <tr key={idx} className={isLight ? "hover:bg-gray-50 transition-colors" : "hover:bg-white/5 transition-colors"}>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-400"}`}>{partida.fecha}</span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                                      {partida.descripcion}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                                      isLight ? "bg-yellow-500/10 text-yellow-600" : "bg-yellow-500/10 text-yellow-400"
                                    }`}>
                                      <AlertCircle className="w-3 h-3" />
                                      {partida.tipo}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-gray-400"}`}>
                                      {partida.origen}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-semibold ${isLight ? "text-yellow-600" : "text-yellow-400"}`}>
                                      ${partida.monto.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-400"}`}>{partida.justificacion}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-gray-400">No hay partidas en tránsito</p>
                          <p className="text-xs text-gray-500 mt-1">Todos los movimientos están conciliados</p>
                        </div>
                      )}
                    </div>
                  )}

                  {tabDetalleActivo === "ajustes" && (
                    <div className={`rounded-lg overflow-hidden ${
                      isLight ? "bg-gray-50" : "bg-secondary/50"
                    }`}>
                      {conciliacionDetallada.ajustesRealizados && conciliacionDetallada.ajustesRealizados.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className={isLight ? "bg-gray-100" : "bg-[#0D1B2A]"}>
                              <tr>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Fecha</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Descripción</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Tipo</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Cuenta Contable</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Asiento</th>
                                <th className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wide ${
                                  isLight ? "text-gray-600" : "text-white/70"
                                }`}>Monto</th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${
                              isLight ? "bg-white divide-gray-100" : "bg-card divide-white/10"
                            }`}>
                              {conciliacionDetallada.ajustesRealizados.map((ajuste: any, idx: number) => (
                                <tr key={idx} className={isLight ? "hover:bg-gray-50 transition-colors" : "hover:bg-white/5 transition-colors"}>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-400"}`}>{ajuste.fecha}</span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div>
                                      <span className={`text-sm block ${isLight ? "text-gray-900" : "text-white"}`}>
                                        {ajuste.descripcion}
                                      </span>
                                      <span className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{ajuste.notas}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                                      ajuste.tipo === "Cargo Banco"
                                        ? "bg-red-500/10 text-red-400"
                                        : "bg-blue-500/10 text-blue-400"
                                    }`}>
                                      <BookOpen className="w-3 h-3" />
                                      {ajuste.tipo}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-400"}`}>{ajuste.cuenta}</span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-mono ${isLight ? "text-gray-700" : "text-gray-400"}`}>{ajuste.asiento}</span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className={`text-sm font-semibold ${
                                      ajuste.tipo === "Cargo Banco" 
                                        ? isLight ? "text-red-600" : "text-red-400"
                                        : isLight ? "text-blue-600" : "text-blue-400"
                                    }`}>
                                      ${ajuste.monto.toFixed(2)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-gray-400">No se realizaron ajustes</p>
                          <p className="text-xs text-gray-500 mt-1">La conciliación no requirió ajustes contables</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Modal */}
              <div className={`px-6 py-4 border-t flex justify-end gap-3 ${
                isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
              }`}>
                <button
                  onClick={() => setShowModalDetalle(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isLight
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Cerrar
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </DndProvider>
    );
  }

  // PASO 2: CARGA DE EXTRACTO BANCARIO
  if (pasoActual === "carga-extracto") {
    return (
      <DndProvider backend={HTML5Backend}>
        <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setPasoActual("seleccion-cuenta")}
            className="text-gray-400 hover:text-white"
          >
            Selección de cuenta
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className={isLight ? "text-gray-900" : "text-white"}>Carga de extracto</span>
        </div>

        {/* Información de cuenta seleccionada */}
        <div className={`p-5 rounded-lg border ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                isLight ? "bg-primary/10" : "bg-primary/20"
              }`}>
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  {cuentaSeleccionada?.banco}
                </h3>
                <p className="text-sm text-gray-400">
                  {cuentaSeleccionada?.tipoCuenta} • {cuentaSeleccionada?.numeroCuenta} • {mesSeleccionado}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPasoActual("seleccion-cuenta")}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                isLight
                  ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                  : "border-white/10 hover:bg-white/5 text-white"
              }`}
            >
              Cambiar Cuenta
            </button>
          </div>
        </div>

        {/* Área de carga */}
        <div className={`p-12 rounded-lg border-2 border-dashed text-center ${
          isLight
            ? "bg-gray-50 border-gray-300"
            : "bg-white/5 border-white/20"
        }`}>
          <Upload className={`w-16 h-16 mx-auto mb-4 ${
            isLight ? "text-gray-400" : "text-gray-500"
          }`} />
          <h3 className={`text-lg font-bold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
            Cargar Extracto Bancario
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Arrastre el archivo o haga clic para seleccionar
          </p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleCargarExtracto}
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Seleccionar Archivo
            </button>
            <p className="text-xs text-gray-500">
              Formatos aceptados: Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf)
            </p>
          </div>
        </div>

        {/* Instrucciones */}
        <div className={`p-5 rounded-lg border ${
          isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"
        }`}>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className={`text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                Instrucciones para el extracto bancario
              </h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• El archivo debe contener las columnas: Fecha, Descripción, Débito, Crédito, Saldo</li>
                <li>• Verifique que las fechas correspondan al período seleccionado</li>
                <li>• El saldo final del extracto debe coincidir con el estado de cuenta</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </DndProvider>
    );
  }

  // PASO 3: CONCILIACIÓN
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-3">
      {/* Encabezado Compacto */}
      <div className={`p-4 rounded-lg border ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReiniciar}
              className={`p-2 rounded-lg transition-colors ${
                isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
              }`}
              title="Reiniciar"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
            <div className={`p-2 rounded-lg ${
              isLight ? "bg-primary/10" : "bg-primary/20"
            }`}>
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                {cuentaSeleccionada?.banco} • {cuentaSeleccionada?.numeroCuenta}
              </h2>
              <p className="text-xs text-gray-400">
                {mesSeleccionado} • Sistema: {movimientosSistema.length} | Banco: {movimientosBanco.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicadores Compactos */}
            <div className={`px-3 py-2 rounded-lg border ${
              isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
            }`}>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Conciliados</p>
                  <p className="text-sm font-bold text-green-400">{vinculados}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Pendientes</p>
                  <p className="text-sm font-bold text-yellow-400">{pendientesSistema + pendientesBanco}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Diferencia</p>
                  <p className={`text-sm font-bold ${Math.abs(diferencia) < 0.01 ? "text-green-400" : "text-yellow-400"}`}>
                    ${Math.abs(diferencia).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <button
              onClick={handleMatchingAutomatico}
              className="px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-primary/30"
            >
              <Zap className="w-4 h-4" />
              Auto Match
            </button>
            <button
              onClick={handleFinalizarConciliacion}
              className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Finalizar
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Vistas */}
      <div className={`p-3 rounded-lg border ${
        isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Tabs de Vista */}
            <button
              onClick={() => setVistaActual("todos")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                vistaActual === "todos"
                  ? "bg-primary text-white"
                  : isLight
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Todos ({movimientosSistema.length})
            </button>
            <button
              onClick={() => setVistaActual("conciliados")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                vistaActual === "conciliados"
                  ? "bg-green-500 text-white"
                  : isLight
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Conciliados ({vinculados})
            </button>
            <button
              onClick={() => setVistaActual("pendientes")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                vistaActual === "pendientes"
                  ? "bg-yellow-500 text-white"
                  : isLight
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              Pendientes ({pendientesSistema + pendientesBanco})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Vista */}
            <div className={`flex items-center rounded-lg border overflow-hidden ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}>
              <button
                onClick={() => setModoVista("tarjetas")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  modoVista === "tarjetas"
                    ? "bg-primary text-white"
                    : isLight
                    ? "bg-white text-gray-600 hover:bg-gray-50"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
                title="Vista de Tarjetas"
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setModoVista("tabla")}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  modoVista === "tabla"
                    ? "bg-primary text-white"
                    : isLight
                    ? "bg-white text-gray-600 hover:bg-gray-50"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
                title="Vista de Tabla"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Ordenamiento */}
            <select
              value={ordenamiento}
              onChange={(e) => setOrdenamiento(e.target.value as "fecha" | "monto" | "descripcion")}
              className={`px-3 py-1.5 border rounded-lg text-xs ${
                isLight
                  ? "bg-white border-gray-200 text-gray-900"
                  : "bg-white/5 border-white/10 text-white"
              }`}
            >
              <option value="fecha">Ordenar por Fecha</option>
              <option value="monto">Ordenar por Monto</option>
              <option value="descripcion">Ordenar por Descripción</option>
            </select>

            {/* Filtros Avanzados */}
            <button
              onClick={() => setShowFiltrosAvanzados(!showFiltrosAvanzados)}
              className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                showFiltrosAvanzados
                  ? isLight
                    ? "bg-primary text-white border-primary"
                    : "bg-primary text-white border-primary"
                  : isLight
                  ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtros
            </button>
          </div>
        </div>

        {/* Filtros Avanzados Expandibles */}
        {showFiltrosAvanzados && (
          <div className={`mt-3 pt-3 border-t grid grid-cols-3 gap-3 ${
            isLight ? "border-gray-200" : "border-white/10"
          }`}>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Monto Mínimo</label>
              <input
                type="number"
                value={filtroMontoMin}
                onChange={(e) => setFiltroMontoMin(e.target.value)}
                placeholder="0.00"
                className={`w-full px-3 py-1.5 border rounded-lg text-xs ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-900"
                    : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                }`}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Monto Máximo</label>
              <input
                type="number"
                value={filtroMontoMax}
                onChange={(e) => setFiltroMontoMax(e.target.value)}
                placeholder="999999.99"
                className={`w-full px-3 py-1.5 border rounded-lg text-xs ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-900"
                    : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                }`}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroMontoMin("");
                  setFiltroMontoMax("");
                  setShowFiltrosAvanzados(false);
                  toast.info("Filtros limpiados");
                }}
                className={`w-full px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${
                  isLight
                    ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                    : "border-white/10 hover:bg-white/5 text-white"
                }`}
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alerta de partidas pendientes (Compacta) */}
      {(pendientesSistema > 0 || pendientesBanco > 0) && vistaActual !== "conciliados" && (
        <div className={`p-3 rounded-lg border ${
          isLight ? "bg-yellow-50 border-yellow-200" : "bg-yellow-500/10 border-yellow-500/20"
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <p className={`text-xs font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
              {pendientesSistema} partida(s) solo en Sistema • {pendientesBanco} partida(s) solo en Banco
            </p>
            <button
              onClick={() => setVistaActual("pendientes")}
              className="ml-auto text-xs text-yellow-500 hover:text-yellow-400 font-medium"
            >
              Ver Detalles →
            </button>
          </div>
        </div>
      )}

      {/* Paneles de conciliación */}
      {modoVista === "tarjetas" ? (
        <div className="grid grid-cols-2 gap-4">
          <PanelConciliacionTarjetas
            tipo="sistema"
            titulo="📒 Libro Auxiliar de Bancos"
            movimientos={movimientosSistemaFiltrados}
            searchTerm={searchTermSistema}
            onSearchChange={setSearchTermSistema}
            vinculaciones={vinculaciones}
            movimientoSeleccionado={movimientoSeleccionadoSistema}
            onSelectMovimiento={setMovimientoSeleccionadoSistema}
            onDesvincular={handleDesvincular}
            onVincularDrop={handleVincularManual}
            isLight={isLight}
          />
          
          <PanelConciliacionTarjetas
            tipo="banco"
            titulo="🏦 Extracto Bancario"
            movimientos={movimientosBancoFiltrados}
            searchTerm={searchTermBanco}
            onSearchChange={setSearchTermBanco}
            vinculaciones={vinculaciones}
            movimientoSeleccionado={movimientoSeleccionadoBanco}
            onSelectMovimiento={setMovimientoSeleccionadoBanco}
            onDesvincular={(id) => {}}
            onGenerarAsiento={handleGenerarAsientoContable}
            onVincularDrop={handleVincularManual}
            isLight={isLight}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
        {/* Panel Izquierdo - Libro Auxiliar */}
        <div className={`border rounded-lg overflow-hidden ${
          isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
        }`}>
          <div className={`px-4 py-3 border-b ${
            isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Libro Auxiliar de Bancos
              </h3>
              <span className="text-xs text-gray-400">
                {movimientosSistemaFiltrados.length} registros
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTermSistema}
                onChange={(e) => setSearchTermSistema(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 border rounded-lg text-sm ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-900"
                    : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                }`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={`border-b text-xs ${
                isLight ? "border-gray-200" : "border-white/10"
              }`}>
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-500">Fecha</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-500">Descripción</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-500">Débito</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-500">Crédito</th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                {movimientosSistemaFiltrados.map((mov) => {
                  const estaVinculado = !!vinculaciones[mov.id];
                  const estaSeleccionado = movimientoSeleccionadoSistema === mov.id;

                  return (
                    <tr
                      key={mov.id}
                      onClick={() => {
                        if (!estaVinculado) {
                          setMovimientoSeleccionadoSistema(estaSeleccionado ? null : mov.id);
                        }
                      }}
                      className={`cursor-pointer transition-colors ${
                        estaVinculado
                          ? isLight
                            ? "bg-green-50"
                            : "bg-green-500/10"
                          : estaSeleccionado
                          ? isLight
                            ? "bg-primary/10"
                            : "bg-primary/20"
                          : isLight
                          ? "hover:bg-gray-50"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className={`px-3 py-2 text-xs font-mono ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        {mov.fecha}
                      </td>
                      <td className={`px-3 py-2 text-xs ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}>
                        <div className="max-w-[200px] truncate">{mov.descripcion}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{mov.referencia}</div>
                      </td>
                      <td className={`px-3 py-2 text-xs text-right font-medium ${
                        mov.debito > 0 ? "text-green-500" : "text-gray-500"
                      }`}>
                        {mov.debito > 0 ? mov.debito.toFixed(2) : "-"}
                      </td>
                      <td className={`px-3 py-2 text-xs text-right font-medium ${
                        mov.credito > 0 ? "text-red-500" : "text-gray-500"
                      }`}>
                        {mov.credito > 0 ? mov.credito.toFixed(2) : "-"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {estaVinculado ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDesvincular(mov.id);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs hover:bg-green-500/20"
                          >
                            <CheckCircle className="w-3 h-3" />
                            <X className="w-3 h-3" />
                          </button>
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel Derecho - Extracto Bancario */}
        <div className={`border rounded-lg overflow-hidden ${
          isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
        }`}>
          <div className={`px-4 py-3 border-b ${
            isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Extracto Bancario
              </h3>
              <span className="text-xs text-gray-400">
                {movimientosBancoFiltrados.length} registros
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTermBanco}
                onChange={(e) => setSearchTermBanco(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 border rounded-lg text-sm ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-900"
                    : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                }`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={`border-b text-xs ${
                isLight ? "border-gray-200" : "border-white/10"
              }`}>
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-500">Fecha</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-500">Descripción</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-500">Débito</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-500">Crédito</th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-500">Acción</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
                {movimientosBancoFiltrados.map((mov) => {
                  const estaVinculado = Object.values(vinculaciones).includes(mov.id);
                  const estaSeleccionado = movimientoSeleccionadoBanco === mov.id;
                  const necesitaAsiento = !estaVinculado;

                  return (
                    <tr
                      key={mov.id}
                      onClick={() => {
                        if (!estaVinculado) {
                          setMovimientoSeleccionadoBanco(estaSeleccionado ? null : mov.id);
                        }
                      }}
                      className={`cursor-pointer transition-colors ${
                        estaVinculado
                          ? isLight
                            ? "bg-green-50"
                            : "bg-green-500/10"
                          : estaSeleccionado
                          ? isLight
                            ? "bg-primary/10"
                            : "bg-primary/20"
                          : isLight
                          ? "hover:bg-gray-50"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <td className={`px-3 py-2 text-xs font-mono ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}>
                        {mov.fecha}
                      </td>
                      <td className={`px-3 py-2 text-xs ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}>
                        <div className="max-w-[200px] truncate">{mov.descripcion}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{mov.referencia}</div>
                      </td>
                      <td className={`px-3 py-2 text-xs text-right font-medium ${
                        mov.debito > 0 ? "text-green-500" : "text-gray-500"
                      }`}>
                        {mov.debito > 0 ? mov.debito.toFixed(2) : "-"}
                      </td>
                      <td className={`px-3 py-2 text-xs text-right font-medium ${
                        mov.credito > 0 ? "text-red-500" : "text-gray-500"
                      }`}>
                        {mov.credito > 0 ? mov.credito.toFixed(2) : "-"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {estaVinculado ? (
                          <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                        ) : necesitaAsiento ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGenerarAsientoContable(mov);
                            }}
                            className="p-1 rounded hover:bg-primary/10 text-primary"
                            title="Generar Asiento"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* Barra de vinculación manual mejorada */}
      {(movimientoSeleccionadoSistema || movimientoSeleccionadoBanco) && (
        <div className={`p-3 rounded-lg border ${
          isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Link2 className="w-4 h-4 text-blue-400" />
              <div className="flex items-center gap-4 flex-1">
                {/* Movimiento Sistema */}
                <div className={`flex-1 px-3 py-2 rounded-lg ${
                  movimientoSeleccionadoSistema 
                    ? isLight ? "bg-white border border-primary/30" : "bg-white/10 border border-primary/30"
                    : isLight ? "bg-gray-100 border border-dashed border-gray-300" : "bg-white/5 border border-dashed border-white/10"
                }`}>
                  {movimientoSeleccionadoSistema ? (
                    <>
                      <p className={`text-xs font-medium truncate ${isLight ? "text-gray-900" : "text-white"}`}>
                        {movimientosSistema.find(m => m.id === movimientoSeleccionadoSistema)?.descripcion}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ${(movimientosSistema.find(m => m.id === movimientoSeleccionadoSistema)?.debito || 0) + 
                          (movimientosSistema.find(m => m.id === movimientoSeleccionadoSistema)?.credito || 0).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Seleccione del Sistema</p>
                  )}
                </div>

                <div className="text-primary">
                  <ChevronRight className="w-5 h-5" />
                </div>

                {/* Movimiento Banco */}
                <div className={`flex-1 px-3 py-2 rounded-lg ${
                  movimientoSeleccionadoBanco 
                    ? isLight ? "bg-white border border-primary/30" : "bg-white/10 border border-primary/30"
                    : isLight ? "bg-gray-100 border border-dashed border-gray-300" : "bg-white/5 border border-dashed border-white/10"
                }`}>
                  {movimientoSeleccionadoBanco ? (
                    <>
                      <p className={`text-xs font-medium truncate ${isLight ? "text-gray-900" : "text-white"}`}>
                        {movimientosBanco.find(m => m.id === movimientoSeleccionadoBanco)?.descripcion}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ${((movimientosBanco.find(m => m.id === movimientoSeleccionadoBanco)?.debito || 0) + 
                          (movimientosBanco.find(m => m.id === movimientoSeleccionadoBanco)?.credito || 0)).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Seleccione del Banco</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMovimientoSeleccionadoSistema(null);
                  setMovimientoSeleccionadoBanco(null);
                }}
                className={`px-3 py-2 border rounded-lg text-xs font-medium transition-colors ${
                  isLight
                    ? "border-gray-200 hover:bg-gray-100 text-gray-700"
                    : "border-white/10 hover:bg-white/5 text-white"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleVincularManual}
                disabled={!movimientoSeleccionadoSistema || !movimientoSeleccionadoBanco}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
                  movimientoSeleccionadoSistema && movimientoSeleccionadoBanco
                    ? "bg-primary hover:bg-primary/90 text-white"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                Vincular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ayuda de Atajos de Teclado */}
      <div className={`p-3 rounded-lg border ${
        isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>⌨️ <strong>ESC</strong>: Cancelar</span>
            <span>|</span>
            <span><strong>Enter</strong>: Vincular seleccionados</span>
            <span>|</span>
            <span><strong>Ctrl/Cmd + M</strong>: Matching automático</span>
            <span>|</span>
            <span><strong>Ctrl/Cmd + F</strong>: Buscar</span>
          </div>
          <span className="text-xs text-gray-400">
            {modoVista === "tarjetas" ? "🖱️ Arrastra tarjetas para vincular" : "📊 Vista de tabla"}
          </span>
        </div>
      </div>

      {/* Modal Generar Asiento Contable */}
      {showModalMovimiento && movimientoAGenerar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-2xl w-full p-6 rounded-lg shadow-xl ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Generar Asiento Contable
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Movimiento bancario sin registro en el sistema
                </p>
              </div>
              <button
                onClick={() => setShowModalMovimiento(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Datos del Movimiento Bancario
                </h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Fecha</p>
                    <p className={isLight ? "text-gray-900" : "text-white"}>{movimientoAGenerar.fecha}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Débito</p>
                    <p className="text-green-500 font-medium">{movimientoAGenerar.debito > 0 ? movimientoAGenerar.debito.toFixed(2) : "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Crédito</p>
                    <p className="text-red-500 font-medium">{movimientoAGenerar.credito > 0 ? movimientoAGenerar.credito.toFixed(2) : "-"}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs text-gray-400">Descripción</p>
                    <p className={isLight ? "text-gray-900" : "text-white"}>{movimientoAGenerar.descripcion}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Cuenta Débito *
                  </label>
                  <select
                    value={datosMovimientoContable.cuentaDebito}
                    onChange={(e) => setDatosMovimientoContable({ ...datosMovimientoContable, cuentaDebito: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="">Seleccionar cuenta...</option>
                    <option value={`1.1.01.01 - ${cuentaSeleccionada?.banco}`}>1.1.01.01 - {cuentaSeleccionada?.banco}</option>
                    <option value="5.3.01 - Gastos Bancarios">5.3.01 - Gastos Bancarios</option>
                    <option value="5.3.02 - Comisiones Bancarias">5.3.02 - Comisiones Bancarias</option>
                    <option value="1.2.01 - Cuentas por Cobrar">1.2.01 - Cuentas por Cobrar</option>
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Cuenta Crédito *
                  </label>
                  <select
                    value={datosMovimientoContable.cuentaCredito}
                    onChange={(e) => setDatosMovimientoContable({ ...datosMovimientoContable, cuentaCredito: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="">Seleccionar cuenta...</option>
                    <option value={`1.1.01.01 - ${cuentaSeleccionada?.banco}`}>1.1.01.01 - {cuentaSeleccionada?.banco}</option>
                    <option value="4.3.01 - Otros Ingresos">4.3.01 - Otros Ingresos</option>
                    <option value="4.3.02 - Intereses Ganados">4.3.02 - Intereses Ganados</option>
                    <option value="2.1.01 - Cuentas por Pagar">2.1.01 - Cuentas por Pagar</option>
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Descripción del Asiento *
                  </label>
                  <textarea
                    value={datosMovimientoContable.descripcion}
                    onChange={(e) => setDatosMovimientoContable({ ...datosMovimientoContable, descripcion: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                    placeholder="Descripción del asiento contable..."
                  />
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Centro de Costo
                  </label>
                  <select
                    value={datosMovimientoContable.centroCosto}
                    onChange={(e) => setDatosMovimientoContable({ ...datosMovimientoContable, centroCosto: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="">Sin centro de costo</option>
                    <option value="Administrativo">Administrativo</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Operaciones">Operaciones</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModalMovimiento(false)}
                  className={`flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                    isLight
                      ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                      : "border-white/10 hover:bg-white/5 text-white"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarAsiento}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Guardar Asiento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gestionar Partida */}
      {showModalGestionarPartida && partidaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-2xl w-full p-6 rounded-lg shadow-xl ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Gestionar Partida No Conciliada
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {partidaSeleccionada.origen === "sistema" ? "Partida en el sistema" : "Partida en el extracto bancario"}
                </p>
              </div>
              <button
                onClick={() => setShowModalGestionarPartida(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Datos del Movimiento Bancario
                </h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Fecha</p>
                    <p className={isLight ? "text-gray-900" : "text-white"}>{partidaSeleccionada.fecha}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Débito</p>
                    <p className="text-green-500 font-medium">{partidaSeleccionada.debito > 0 ? partidaSeleccionada.debito.toFixed(2) : "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Crédito</p>
                    <p className="text-red-500 font-medium">{partidaSeleccionada.credito > 0 ? partidaSeleccionada.credito.toFixed(2) : "-"}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs text-gray-400">Descripción</p>
                    <p className={isLight ? "text-gray-900" : "text-white"}>{partidaSeleccionada.descripcion}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Tipo de Partida
                  </label>
                  <select
                    value={tipoPartida}
                    onChange={(e) => setTipoPartida(e.target.value as "transito" | "ajuste" | "error")}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="transito">Partida en tránsito</option>
                    <option value="ajuste">Requiere ajuste</option>
                    <option value="error">Error detectado</option>
                  </select>
                </div>

                <div>
                  <label className={`text-sm font-medium mb-1.5 block ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Justificación *
                  </label>
                  <textarea
                    value={justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    }`}
                    placeholder="Explicación de la partida no conciliada..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModalGestionarPartida(false)}
                  className={`flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                    isLight
                      ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                      : "border-white/10 hover:bg-white/5 text-white"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarGestionPartida}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Guardar Gestion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resumen Final */}
      {showResumenFinal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className={`max-w-3xl w-full p-6 rounded-lg shadow-xl ${
            isLight ? "bg-white border border-gray-200" : "bg-card border border-white/10"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Resumen Final de Conciliación
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {cuentaSeleccionada?.banco} • {cuentaSeleccionada?.numeroCuenta} • {mesSeleccionado}
                </p>
              </div>
              <button
                onClick={() => setShowResumenFinal(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Estadísticas Generales */}
            <div className={`p-4 rounded-lg border mb-4 ${
              isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"
            }`}>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Movimientos</p>
                  <p className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {movimientosSistema.length + movimientosBanco.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Conciliados</p>
                  <p className="text-lg font-bold text-green-400">
                    {vinculados}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Pendientes</p>
                  <p className="text-lg font-bold text-yellow-400">
                    {pendientesSistema + pendientesBanco}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Diferencia</p>
                  <p className={`text-lg font-bold ${Math.abs(diferencia) < 0.01 ? "text-green-400" : "text-yellow-400"}`}>
                    ${Math.abs(diferencia).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
              }`}>
                <h4 className={`text-sm font-semibold mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Partidas Pendientes
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {pendientesSistema > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Registradas en el Sistema pero NO en el Banco:</p>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {movimientosSistema
                          .filter(m => !vinculaciones[m.id])
                          .map(m => (
                            <li key={m.id} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                              <span className="flex-1 truncate">{m.descripcion}</span>
                              <span className={m.debito > 0 ? "text-green-400" : "text-red-400"}>
                                ${m.debito > 0 ? m.debito.toFixed(2) : m.credito.toFixed(2)}
                              </span>
                            </li>
                          ))}
                      </ul>
                      <p className="text-xs text-gray-400 mt-2 italic">
                        Ejemplos: Cheques girados no cobrados, depósitos en tránsito
                      </p>
                    </div>
                  )}
                  {pendientesBanco > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Registradas en el Banco pero NO en el Sistema:</p>
                      <ul className="text-xs text-gray-300 space-y-1">
                        {movimientosBanco
                          .filter(m => !Object.values(vinculaciones).includes(m.id))
                          .map(m => (
                            <li key={m.id} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                              <span className="flex-1 truncate">{m.descripcion}</span>
                              <span className={m.debito > 0 ? "text-green-400" : "text-red-400"}>
                                ${m.debito > 0 ? m.debito.toFixed(2) : m.credito.toFixed(2)}
                              </span>
                            </li>
                          ))}
                      </ul>
                      <p className="text-xs text-gray-400 mt-2 italic">
                        Ejemplos: Comisiones bancarias, intereses, notas de débito/crédito
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    ¿Qué sucede al finalizar?
                  </p>
                </div>
                <ul className="text-xs text-gray-400 space-y-1 ml-6">
                  <li>• La conciliación quedará registrada con {vinculados} movimientos conciliados</li>
                  <li>• Las {pendientesSistema + pendientesBanco} partida(s) pendiente(s) quedarán documentadas</li>
                  <li>• Podrá iniciar una nueva conciliación con otra cuenta bancaria</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowResumenFinal(false)}
                  className={`flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                    isLight
                      ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                      : "border-white/10 hover:bg-white/5 text-white"
                  }`}
                >
                  Volver a Editar
                </button>
                <button
                  onClick={handleFinalizarConPartidas}
                  className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Finalizar y Continuar con Otro Banco
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </DndProvider>
  );
}