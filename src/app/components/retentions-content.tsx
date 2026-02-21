import { useState } from "react";
import { FileText, Search, Calendar, Eye, Plus, X, Printer, Download, DollarSign, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Filter, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { NewRetentionModal } from "./new-retention-modal";

// Usuario logueado
const LOGGED_USER = {
  name: "María López Contreras",
  role: "administrador",
  email: "maria.lopez@empresa.com"
};

interface RetentionDetail {
  type: string; // "IVA" o "Renta"
  taxBase: number;
  percentage: number;
  retainedAmount: number;
  taxCode: string;
}

interface Retention {
  id: string;
  retentionNumber: string;
  invoiceNumber: string;
  supplier: string;
  supplierRuc: string;
  emissionDate: string;
  fiscalPeriod: string;
  status: "emitida" | "autorizada" | "anulada";
  statusLabel: string;
  authorizationNumber?: string;
  details: RetentionDetail[];
  totalRetained: number;
  invoiceTotal: number;
  registeredBy: string;
  notes?: string;
}

const MOCK_RETENTIONS: Retention[] = [
  {
    id: "ret-001",
    retentionNumber: "RET-001-000123",
    invoiceNumber: "FAC-001-001234",
    supplier: "Distribuidora Nacional S.A.",
    supplierRuc: "1790016919001",
    emissionDate: "2026-02-18",
    fiscalPeriod: "02/2026",
    status: "autorizada",
    statusLabel: "Autorizada",
    authorizationNumber: "1802202601179001691900120010010000012341234567810",
    details: [
      {
        type: "IVA",
        taxBase: 6612.50,
        percentage: 30,
        retainedAmount: 297.56,
        taxCode: "2"
      },
      {
        type: "Renta",
        taxBase: 5750.00,
        percentage: 1,
        retainedAmount: 57.50,
        taxCode: "312"
      }
    ],
    totalRetained: 355.06,
    invoiceTotal: 6612.50,
    registeredBy: "Carlos Mendoza",
    notes: "Retención generada automáticamente"
  },
  {
    id: "ret-002",
    retentionNumber: "RET-001-000124",
    invoiceNumber: "FAC-002-005678",
    supplier: "Kreafast",
    supplierRuc: "1792345678001",
    emissionDate: "2026-02-19",
    fiscalPeriod: "02/2026",
    status: "emitida",
    statusLabel: "Emitida",
    details: [
      {
        type: "IVA",
        taxBase: 236.50,
        percentage: 30,
        retainedAmount: 10.64,
        taxCode: "2"
      },
      {
        type: "Renta",
        taxBase: 210.00,
        percentage: 2,
        retainedAmount: 4.20,
        taxCode: "319"
      }
    ],
    totalRetained: 14.84,
    invoiceTotal: 236.50,
    registeredBy: "Ana Torres"
  },
  {
    id: "ret-003",
    retentionNumber: "RET-001-000125",
    invoiceNumber: "FAC-003-002345",
    supplier: "Tecnología Avanzada S.A.",
    supplierRuc: "1798765432001",
    emissionDate: "2026-02-15",
    fiscalPeriod: "02/2026",
    status: "autorizada",
    statusLabel: "Autorizada",
    authorizationNumber: "1502202601179876543200120010010000012541234567810",
    details: [
      {
        type: "IVA",
        taxBase: 1074.00,
        percentage: 100,
        retainedAmount: 161.10,
        taxCode: "1"
      },
      {
        type: "Renta",
        taxBase: 960.00,
        percentage: 1,
        retainedAmount: 9.60,
        taxCode: "312"
      }
    ],
    totalRetained: 170.70,
    invoiceTotal: 1074.00,
    registeredBy: "Luis Ramírez"
  },
  {
    id: "ret-004",
    retentionNumber: "RET-001-000126",
    invoiceNumber: "FAC-004-009876",
    supplier: "Importadora del Pacífico",
    supplierRuc: "1790123456001",
    emissionDate: "2026-01-20",
    fiscalPeriod: "01/2026",
    status: "autorizada",
    statusLabel: "Autorizada",
    authorizationNumber: "2001202601179012345600120010010000012641234567810",
    details: [
      {
        type: "IVA",
        taxBase: 488.75,
        percentage: 30,
        retainedAmount: 21.99,
        taxCode: "2"
      },
      {
        type: "Renta",
        taxBase: 425.00,
        percentage: 1,
        retainedAmount: 4.25,
        taxCode: "312"
      }
    ],
    totalRetained: 26.24,
    invoiceTotal: 488.75,
    registeredBy: "María López"
  },
  {
    id: "ret-005",
    retentionNumber: "RET-001-000127",
    invoiceNumber: "FAC-005-001111",
    supplier: "Comercial Andina",
    supplierRuc: "1791234567001",
    emissionDate: "2026-02-20",
    fiscalPeriod: "02/2026",
    status: "emitida",
    statusLabel: "Emitida",
    details: [
      {
        type: "IVA",
        taxBase: 2779.00,
        percentage: 30,
        retainedAmount: 125.06,
        taxCode: "2"
      },
      {
        type: "Renta",
        taxBase: 2460.00,
        percentage: 1,
        retainedAmount: 24.60,
        taxCode: "312"
      }
    ],
    totalRetained: 149.66,
    invoiceTotal: 2779.00,
    registeredBy: "Juan Pérez"
  }
];

export function RetentionsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRetention, setSelectedRetention] = useState<Retention | null>(null);
  const [showNewRetentionModal, setShowNewRetentionModal] = useState(false);

  const itemsPerPage = 10;

  // Filtrar retenciones
  const filteredRetentions = MOCK_RETENTIONS.filter((retention) => {
    const matchesSearch =
      searchTerm === "" ||
      retention.retentionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retention.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retention.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retention.supplierRuc.includes(searchTerm);

    const matchesDateFrom = dateFrom === "" || retention.emissionDate >= dateFrom;
    const matchesDateTo = dateTo === "" || retention.emissionDate <= dateTo;
    const matchesStatus = statusFilter === "all" || retention.status === statusFilter;

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredRetentions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRetentions = filteredRetentions.slice(startIndex, endIndex);

  // Estadísticas
  const stats = {
    total: MOCK_RETENTIONS.length,
    emitidas: MOCK_RETENTIONS.filter((r) => r.status === "emitida").length,
    autorizadas: MOCK_RETENTIONS.filter((r) => r.status === "autorizada").length,
    anuladas: MOCK_RETENTIONS.filter((r) => r.status === "anulada").length,
    totalRetained: MOCK_RETENTIONS.reduce((sum, r) => sum + r.totalRetained, 0),
    thisMonth: MOCK_RETENTIONS.filter((r) => r.fiscalPeriod === "02/2026").length
  };

  const handleViewDetail = (retention: Retention) => {
    setSelectedRetention(retention);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "autorizada":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "emitida":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "anulada":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "autorizada":
        return <CheckCircle className="w-3.5 h-3.5" />;
      case "emitida":
        return <Clock className="w-3.5 h-3.5" />;
      case "anulada":
        return <XCircle className="w-3.5 h-3.5" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Dashboard de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Total Retenciones</p>
              <p className="text-white font-bold text-2xl mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Autorizadas</p>
              <p className="text-white font-bold text-2xl mt-1">{stats.autorizadas}</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Total Retenido</p>
              <p className="text-white font-bold text-2xl mt-1">{formatCurrency(stats.totalRetained)}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs">Este Mes</p>
              <p className="text-white font-bold text-2xl mt-1">{stats.thisMonth}</p>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-gray-400 text-xs mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nº retención, factura, proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-2">Desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-2">Hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-2">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            >
              <option value="all">Todos</option>
              <option value="emitida">Emitida</option>
              <option value="autorizada">Autorizada</option>
              <option value="anulada">Anulada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botón Nueva Retención */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowNewRetentionModal(true)}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Retención
        </button>
      </div>

      {/* Tabla de Retenciones */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Nº Retención
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fecha Emisión
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Periodo Fiscal
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Retenido
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentRetentions.map((retention) => (
                <tr
                  key={retention.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-white text-sm font-mono font-medium">
                      {retention.retentionNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-gray-300 text-sm font-mono">
                      {retention.invoiceNumber}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <p className="text-white text-sm">{retention.supplier}</p>
                      <p className="text-gray-400 text-xs font-mono">{retention.supplierRuc}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-gray-300 text-sm font-mono">
                      {new Date(retention.emissionDate).toLocaleDateString("es-EC")}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-gray-300 text-sm font-mono">
                      {retention.fiscalPeriod}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className="text-primary font-bold text-sm font-mono">
                      {formatCurrency(retention.totalRetained)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        retention.status
                      )}`}
                    >
                      {getStatusIcon(retention.status)}
                      {retention.statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDetail(retention)}
                        className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                        title="Imprimir"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="bg-white/5 border-t border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Mostrando <span className="text-white font-medium">{startIndex + 1}</span> a{" "}
              <span className="text-white font-medium">
                {Math.min(endIndex, filteredRetentions.length)}
              </span>{" "}
              de <span className="text-white font-medium">{filteredRetentions.length}</span>{" "}
              retenciones
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-sm text-gray-400">
                Página <span className="text-white font-medium">{currentPage}</span> de{" "}
                <span className="text-white font-medium">{totalPages}</span>
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {showDetailModal && selectedRetention && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 className="text-white font-bold text-xl">Detalle de Retención</h3>
                <p className="text-gray-400 text-sm mt-1 font-mono">
                  {selectedRetention.retentionNumber}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 space-y-6">
              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Proveedor</p>
                    <p className="text-white font-medium">{selectedRetention.supplier}</p>
                    <p className="text-gray-400 text-sm font-mono">{selectedRetention.supplierRuc}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-1">Factura Relacionada</p>
                    <p className="text-white font-mono font-medium">{selectedRetention.invoiceNumber}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-1">Fecha de Emisión</p>
                    <p className="text-white font-mono">
                      {new Date(selectedRetention.emissionDate).toLocaleDateString("es-EC")}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Periodo Fiscal</p>
                    <p className="text-white font-mono font-medium">{selectedRetention.fiscalPeriod}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-1">Estado</p>
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(
                        selectedRetention.status
                      )}`}
                    >
                      {getStatusIcon(selectedRetention.status)}
                      {selectedRetention.statusLabel}
                    </span>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs mb-1">Registrado por</p>
                    <p className="text-white">{selectedRetention.registeredBy}</p>
                  </div>
                </div>
              </div>

              {/* Autorización SRI */}
              {selectedRetention.authorizationNumber && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Número de Autorización SRI</p>
                  <p className="text-white font-mono text-sm break-all">
                    {selectedRetention.authorizationNumber}
                  </p>
                </div>
              )}

              {/* Detalles de Retención */}
              <div>
                <h4 className="text-white font-bold text-sm mb-4">Detalles de Retención</h4>
                <div className="space-y-3">
                  {selectedRetention.details.map((detail, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Tipo</p>
                          <p className="text-white font-medium">{detail.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Base Imponible</p>
                          <p className="text-white font-mono">{formatCurrency(detail.taxBase)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">% Retención</p>
                          <p className="text-white font-mono">{detail.percentage}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Valor Retenido</p>
                          <p className="text-primary font-bold font-mono">
                            {formatCurrency(detail.retainedAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-gray-400 text-xs">Código de Impuesto: <span className="text-white font-mono">{detail.taxCode}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de Valores */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="text-white font-bold text-sm mb-4">Resumen</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total Factura:</span>
                    <span className="text-white font-medium font-mono">
                      {formatCurrency(selectedRetention.invoiceTotal)}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">TOTAL RETENIDO:</span>
                      <span className="text-primary font-bold text-xl font-mono">
                        {formatCurrency(selectedRetention.totalRetained)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              {selectedRetention.notes && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">Notas</p>
                  <p className="text-white text-sm">{selectedRetention.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cerrar
              </button>
              <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2">
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
              <button className="px-6 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl transition-colors font-medium flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar XML
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nueva Retención */}
      {showNewRetentionModal && (
        <NewRetentionModal onClose={() => setShowNewRetentionModal(false)} />
      )}
    </div>
  );
}
