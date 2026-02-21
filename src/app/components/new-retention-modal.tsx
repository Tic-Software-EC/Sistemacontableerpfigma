import { useState } from "react";
import { X, Save, Plus, Trash2, FileText, Calendar, AlertCircle } from "lucide-react";

interface RetentionDetail {
  type: "IVA" | "Renta";
  taxBase: number;
  percentage: number;
  taxCode: string;
}

interface NewRetentionModalProps {
  onClose: () => void;
}

interface SupplierInvoice {
  invoiceNumber: string;
  supplier: string;
  supplierRuc: string;
  invoiceDate: string;
  total: number;
  subtotal: number;
  taxAmount: number;
}

const MOCK_INVOICES: SupplierInvoice[] = [
  {
    invoiceNumber: "FAC-001-001234",
    supplier: "Distribuidora Nacional S.A.",
    supplierRuc: "1790016919001",
    invoiceDate: "2026-02-18",
    total: 6612.50,
    subtotal: 5750.00,
    taxAmount: 862.50
  },
  {
    invoiceNumber: "FAC-002-005678",
    supplier: "Kreafast",
    supplierRuc: "1792345678001",
    invoiceDate: "2026-02-19",
    total: 236.50,
    subtotal: 210.00,
    taxAmount: 31.50
  },
  {
    invoiceNumber: "FAC-003-002345",
    supplier: "Tecnología Avanzada S.A.",
    supplierRuc: "1798765432001",
    invoiceDate: "2026-02-15",
    total: 1074.00,
    subtotal: 960.00,
    taxAmount: 144.00
  },
  {
    invoiceNumber: "FAC-005-001111",
    supplier: "Comercial Andina",
    supplierRuc: "1791234567001",
    invoiceDate: "2026-02-20",
    total: 2779.00,
    subtotal: 2460.00,
    taxAmount: 369.00
  }
];

const IVA_RETENTION_PERCENTAGES = [
  { value: 10, label: "10% - Honorarios profesionales", code: "9" },
  { value: 20, label: "20% - Predomina mano de obra", code: "10" },
  { value: 30, label: "30% - Bienes", code: "2" },
  { value: 70, label: "70% - Servicios", code: "1" },
  { value: 100, label: "100% - Servicios y honorarios", code: "1" }
];

const RENTA_RETENTION_PERCENTAGES = [
  { value: 1, label: "1% - Otros bienes y servicios", code: "312" },
  { value: 2, label: "2% - Servicios", code: "319" },
  { value: 8, label: "8% - Honorarios profesionales", code: "303" },
  { value: 10, label: "10% - Arriendos", code: "322" }
];

export function NewRetentionModal({ onClose }: NewRetentionModalProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<string>("");
  const [invoiceData, setInvoiceData] = useState<SupplierInvoice | null>(null);
  const [emissionDate, setEmissionDate] = useState("");
  const [fiscalPeriod, setFiscalPeriod] = useState("");
  const [notes, setNotes] = useState("");

  const [retentionDetails, setRetentionDetails] = useState<RetentionDetail[]>([
    { type: "IVA", taxBase: 0, percentage: 30, taxCode: "2" },
    { type: "Renta", taxBase: 0, percentage: 1, taxCode: "312" }
  ]);

  const handleInvoiceChange = (invoiceNumber: string) => {
    setSelectedInvoice(invoiceNumber);
    const invoice = MOCK_INVOICES.find(inv => inv.invoiceNumber === invoiceNumber);
    
    if (invoice) {
      setInvoiceData(invoice);
      
      // Auto-llenar bases imponibles
      const newDetails = [...retentionDetails];
      newDetails[0].taxBase = invoice.total; // IVA sobre total
      newDetails[1].taxBase = invoice.subtotal; // Renta sobre subtotal
      setRetentionDetails(newDetails);

      // Auto-generar periodo fiscal
      const date = new Date(invoice.invoiceDate);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      setFiscalPeriod(`${month}/${year}`);
      
      // Sugerir fecha de emisión (hoy)
      if (!emissionDate) {
        setEmissionDate(new Date().toISOString().split('T')[0]);
      }
    }
  };

  const handlePercentageChange = (index: number, percentage: number, code: string) => {
    const newDetails = [...retentionDetails];
    newDetails[index].percentage = percentage;
    newDetails[index].taxCode = code;
    setRetentionDetails(newDetails);
  };

  const addRetentionDetail = (type: "IVA" | "Renta") => {
    const newDetail: RetentionDetail = {
      type,
      taxBase: invoiceData ? (type === "IVA" ? invoiceData.total : invoiceData.subtotal) : 0,
      percentage: type === "IVA" ? 30 : 1,
      taxCode: type === "IVA" ? "2" : "312"
    };
    setRetentionDetails([...retentionDetails, newDetail]);
  };

  const removeRetentionDetail = (index: number) => {
    if (retentionDetails.length > 1) {
      setRetentionDetails(retentionDetails.filter((_, i) => i !== index));
    }
  };

  const updateDetail = (index: number, field: keyof RetentionDetail, value: number | string) => {
    const newDetails = [...retentionDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setRetentionDetails(newDetails);
  };

  const calculateRetainedAmount = (detail: RetentionDetail) => {
    return (detail.taxBase * detail.percentage) / 100;
  };

  const calculateTotals = () => {
    const totalRetained = retentionDetails.reduce(
      (sum, detail) => sum + calculateRetainedAmount(detail),
      0
    );
    const totalIVARetained = retentionDetails
      .filter(d => d.type === "IVA")
      .reduce((sum, detail) => sum + calculateRetainedAmount(detail), 0);
    const totalRentaRetained = retentionDetails
      .filter(d => d.type === "Renta")
      .reduce((sum, detail) => sum + calculateRetainedAmount(detail), 0);

    return { totalRetained, totalIVARetained, totalRentaRetained };
  };

  const handleSave = () => {
    console.log("Guardando retención...", {
      selectedInvoice,
      invoiceData,
      emissionDate,
      fiscalPeriod,
      retentionDetails,
      notes,
      totals: calculateTotals()
    });

    alert("Retención registrada exitosamente");
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const totals = calculateTotals();
  const isFormValid = selectedInvoice && emissionDate && fiscalPeriod && retentionDetails.length > 0;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-5xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-white font-bold text-xl">Nueva Retención</h3>
            <p className="text-gray-400 text-sm mt-1">Generar comprobante de retención</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Selección de Factura */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Factura a Retener
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-400 text-xs mb-2">Seleccionar Factura *</label>
                <select
                  value={selectedInvoice}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  required
                >
                  <option value="">Seleccionar factura...</option>
                  {MOCK_INVOICES.map((invoice) => (
                    <option key={invoice.invoiceNumber} value={invoice.invoiceNumber}>
                      {invoice.invoiceNumber} - {invoice.supplier} - {formatCurrency(invoice.total)}
                    </option>
                  ))}
                </select>
              </div>

              {invoiceData && (
                <>
                  <div>
                    <label className="block text-gray-400 text-xs mb-2">Proveedor</label>
                    <input
                      type="text"
                      value={invoiceData.supplier}
                      readOnly
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-2">RUC</label>
                    <input
                      type="text"
                      value={invoiceData.supplierRuc}
                      readOnly
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-2">Fecha Factura</label>
                    <input
                      type="text"
                      value={new Date(invoiceData.invoiceDate).toLocaleDateString("es-EC")}
                      readOnly
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-2">Total Factura</label>
                    <input
                      type="text"
                      value={formatCurrency(invoiceData.total)}
                      readOnly
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-primary text-sm font-mono font-bold"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Información de la Retención */}
          {invoiceData && (
            <>
              <div>
                <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Datos de la Retención
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs mb-2">Fecha de Emisión *</label>
                    <input
                      type="date"
                      value={emissionDate}
                      onChange={(e) => setEmissionDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs mb-2">Periodo Fiscal *</label>
                    <input
                      type="text"
                      value={fiscalPeriod}
                      onChange={(e) => setFiscalPeriod(e.target.value)}
                      placeholder="MM/YYYY"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Detalles de Retención */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-bold text-sm">Detalles de Retención</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addRetentionDetail("IVA")}
                      className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors text-xs font-medium"
                    >
                      + IVA
                    </button>
                    <button
                      onClick={() => addRetentionDetail("Renta")}
                      className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors text-xs font-medium"
                    >
                      + Renta
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {retentionDetails.map((detail, index) => (
                    <div
                      key={index}
                      className={`border rounded-xl p-4 ${
                        detail.type === "IVA"
                          ? "bg-blue-500/5 border-blue-500/20"
                          : "bg-green-500/5 border-green-500/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              detail.type === "IVA"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {detail.type}
                          </span>
                          <span className="text-gray-400 text-xs">Código: {detail.taxCode}</span>
                        </div>
                        {retentionDetails.length > 1 && (
                          <button
                            onClick={() => removeRetentionDetail(index)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-gray-400 text-xs mb-2">Base Imponible *</label>
                          <input
                            type="number"
                            value={detail.taxBase}
                            onChange={(e) => updateDetail(index, 'taxBase', Number(e.target.value))}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-gray-400 text-xs mb-2">% Retención *</label>
                          <select
                            value={`${detail.percentage}-${detail.taxCode}`}
                            onChange={(e) => {
                              const [percentage, code] = e.target.value.split('-');
                              handlePercentageChange(index, Number(percentage), code);
                            }}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                          >
                            {detail.type === "IVA"
                              ? IVA_RETENTION_PERCENTAGES.map((opt) => (
                                  <option key={opt.value} value={`${opt.value}-${opt.code}`}>
                                    {opt.label}
                                  </option>
                                ))
                              : RENTA_RETENTION_PERCENTAGES.map((opt) => (
                                  <option key={opt.value} value={`${opt.value}-${opt.code}`}>
                                    {opt.label}
                                  </option>
                                ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-400 text-xs mb-2">Valor Retenido</label>
                          <div className="px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-primary text-sm font-bold font-mono">
                            {formatCurrency(calculateRetainedAmount(detail))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen de Totales */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h4 className="text-white font-bold text-sm mb-4">Resumen de Retenciones</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Total Factura:</span>
                    <span className="text-white font-medium font-mono">
                      {formatCurrency(invoiceData.total)}
                    </span>
                  </div>
                  {totals.totalIVARetained > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 text-sm">Retención IVA:</span>
                      <span className="text-blue-400 font-medium font-mono">
                        {formatCurrency(totals.totalIVARetained)}
                      </span>
                    </div>
                  )}
                  {totals.totalRentaRetained > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-400 text-sm">Retención Renta:</span>
                      <span className="text-green-400 font-medium font-mono">
                        {formatCurrency(totals.totalRentaRetained)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-lg">TOTAL RETENIDO:</span>
                      <span className="text-primary font-bold text-2xl font-mono">
                        {formatCurrency(totals.totalRetained)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-400 text-sm font-medium">Valor a Pagar al Proveedor</p>
                        <p className="text-blue-300 text-xl font-bold font-mono mt-1">
                          {formatCurrency(invoiceData.total - totals.totalRetained)}
                        </p>
                        <p className="text-blue-400/70 text-xs mt-1">
                          (Total factura menos retenciones)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-gray-400 text-xs mb-2">Notas / Observaciones</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas adicionales sobre la retención..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* Mensaje si no hay factura seleccionada */}
          {!invoiceData && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-yellow-400 font-medium">Seleccione una factura para continuar</p>
              <p className="text-yellow-400/70 text-sm mt-1">
                Las retenciones se generan a partir de facturas de proveedores registradas
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Guardar Retención
          </button>
        </div>
      </div>
    </div>
  );
}
