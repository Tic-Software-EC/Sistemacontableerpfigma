// Módulo de Cobros - TicSoftEc ERP - Actualización: Pagos parciales con cambio
import React, { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Printer,
  Eye,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  TrendingUp,
  FileText,
  CreditCard,
  User,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  CalendarClock,
  Building2,
  Zap,
  Receipt,
  Check,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

type PaymentDetail = {
  id: string;
  date: string;
  amount: number;
  paymentMethod: "cash" | "transfer" | "check" | "card" | "deposit";
  reference: string;
  notes: string;
  registeredBy: string;
};

type AmortizationRow = {
  id: string;
  installmentNumber: number;
  dueDate: string;
  scheduledAmount: number;
  paidAmount: number;
  pendingAmount: number;
  status: "pending" | "partial" | "paid" | "overdue";
  paymentDetails: PaymentDetail[];
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  saleType: "credit" | "cash";
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  paymentTermDays: number;
  installments: number;
  status: "pending" | "partial" | "paid" | "overdue" | "cancelled";
  amortization: AmortizationRow[];
  notes: string;
  isActive: boolean;
};

type Client = {
  id: string;
  name: string;
  type: "company" | "individual";
  ruc: string;
  phone: string;
  email: string;
  address: string;
  invoices: Invoice[];
  totalDebt: number;
  totalPaid: number;
  totalPending: number;
};

type TabType = "all" | "pending" | "overdue" | "paid";

export function CollectionsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set());
  const [selectedInvoice, setSelectedInvoice] = useState<{ client: Client; invoice: Invoice } | null>(null);
  const [showAmortizationModal, setShowAmortizationModal] = useState(false);
  const [showRegisterPaymentModal, setShowRegisterPaymentModal] = useState(false);
  const [selectedInstallments, setSelectedInstallments] = useState<Set<string>>(new Set());
  const [expandedPaymentDetails, setExpandedPaymentDetails] = useState<Set<string>>(new Set());
  const [activeInstallmentsTab, setActiveInstallmentsTab] = useState<"pending" | "paid">("pending");
  const [currentStep, setCurrentStep] = useState(1);

  // Estado del formulario de pago
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    paymentMethod: "cash" as PaymentDetail["paymentMethod"],
    reference: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Datos de ejemplo - Mix de empresas y personas naturales
  const [clients, setClients] = useState<Client[]>([
    {
      id: "CLI-001",
      name: "Distribuidora Nacional S.A.",
      type: "company",
      ruc: "1792345678001",
      phone: "+593 2 2456789",
      email: "ventas@distribuidoranacional.com",
      address: "Av. Amazonas N24-155 y Coruña, Quito",
      totalDebt: 0,
      totalPaid: 0,
      totalPending: 0,
      invoices: [
        {
          id: "INV-001",
          invoiceNumber: "FAC-2026-001",
          invoiceDate: "2026-02-01",
          saleType: "credit",
          totalAmount: 6000.0,
          paidAmount: 2000.0,
          pendingAmount: 4000.0,
          dueDate: "2026-05-01",
          paymentTermDays: 90,
          installments: 3,
          status: "partial",
          amortization: [
            {
              id: "A1",
              installmentNumber: 1,
              dueDate: "2026-03-01",
              scheduledAmount: 2000.0,
              paidAmount: 2000.0,
              pendingAmount: 0,
              status: "paid",
              paymentDetails: [
                {
                  id: "P1",
                  date: "2026-03-01",
                  amount: 2000.0,
                  paymentMethod: "transfer",
                  reference: "TRANS-001",
                  notes: "Primera cuota",
                  registeredBy: "Juan Pérez",
                },
              ],
            },
            {
              id: "A2",
              installmentNumber: 2,
              dueDate: "2026-04-01",
              scheduledAmount: 2000.0,
              paidAmount: 0,
              pendingAmount: 2000.0,
              status: "pending",
              paymentDetails: [],
            },
            {
              id: "A3",
              installmentNumber: 3,
              dueDate: "2026-05-01",
              scheduledAmount: 2000.0,
              paidAmount: 0,
              pendingAmount: 2000.0,
              status: "pending",
              paymentDetails: [],
            },
          ],
          notes: "Crédito 90 días - 3 cuotas mensuales",
          isActive: true,
        },
        {
          id: "INV-002",
          invoiceNumber: "FAC-2026-015",
          invoiceDate: "2026-03-05",
          saleType: "credit",
          totalAmount: 3500.0,
          paidAmount: 0,
          pendingAmount: 3500.0,
          dueDate: "2026-04-04",
          paymentTermDays: 30,
          installments: 1,
          status: "pending",
          amortization: [
            {
              id: "A4",
              installmentNumber: 1,
              dueDate: "2026-04-04",
              scheduledAmount: 3500.0,
              paidAmount: 0,
              pendingAmount: 3500.0,
              status: "pending",
              paymentDetails: [],
            },
          ],
          notes: "Crédito 30 días",
          isActive: true,
        },
      ],
    },
    {
      id: "CLI-002",
      name: "María Fernanda López García",
      type: "individual",
      ruc: "1712345678",
      phone: "+593 99 234 5678",
      email: "mf.lopez@gmail.com",
      address: "Av. La Prensa N24-56, Quito",
      totalDebt: 0,
      totalPaid: 0,
      totalPending: 0,
      invoices: [
        {
          id: "INV-003",
          invoiceNumber: "FAC-2026-008",
          invoiceDate: "2026-02-10",
          saleType: "credit",
          totalAmount: 1800.0,
          paidAmount: 900.0,
          pendingAmount: 900.0,
          dueDate: "2026-04-10",
          paymentTermDays: 60,
          installments: 2,
          status: "partial",
          amortization: [
            {
              id: "A5",
              installmentNumber: 1,
              dueDate: "2026-03-10",
              scheduledAmount: 900.0,
              paidAmount: 900.0,
              pendingAmount: 0,
              status: "paid",
              paymentDetails: [
                {
                  id: "P2",
                  date: "2026-03-10",
                  amount: 900.0,
                  paymentMethod: "card",
                  reference: "VISA-4532",
                  notes: "Tarjeta de crédito",
                  registeredBy: "María López",
                },
              ],
            },
            {
              id: "A6",
              installmentNumber: 2,
              dueDate: "2026-04-10",
              scheduledAmount: 900.0,
              paidAmount: 0,
              pendingAmount: 900.0,
              status: "pending",
              paymentDetails: [],
            },
          ],
          notes: "Cliente frecuente - Crédito 60 días",
          isActive: true,
        },
      ],
    },
    {
      id: "CLI-003",
      name: "Comercial El Ahorro Cía. Ltda.",
      type: "company",
      ruc: "1791234567001",
      phone: "+593 2 2345678",
      email: "pagos@elahorro.com",
      address: "Av. 6 de Diciembre N33-42, Quito",
      totalDebt: 0,
      totalPaid: 0,
      totalPending: 0,
      invoices: [
        {
          id: "INV-004",
          invoiceNumber: "FAC-2026-020",
          invoiceDate: "2026-03-10",
          saleType: "cash",
          totalAmount: 1250.0,
          paidAmount: 1250.0,
          pendingAmount: 0,
          dueDate: "2026-03-10",
          paymentTermDays: 0,
          installments: 1,
          status: "paid",
          amortization: [
            {
              id: "A7",
              installmentNumber: 1,
              dueDate: "2026-03-10",
              scheduledAmount: 1250.0,
              paidAmount: 1250.0,
              pendingAmount: 0,
              status: "paid",
              paymentDetails: [
                {
                  id: "P3",
                  date: "2026-03-10",
                  amount: 1250.0,
                  paymentMethod: "cash",
                  reference: "CONTADO-001",
                  notes: "Pago al contado",
                  registeredBy: "Carlos Ruiz",
                },
              ],
            },
          ],
          notes: "Venta al contado",
          isActive: true,
        },
      ],
    },
    {
      id: "CLI-004",
      name: "Carlos Alberto Pérez Morales",
      type: "individual",
      ruc: "1723456789",
      phone: "+593 98 765 4321",
      email: "carlos.perez@outlook.com",
      address: "Calle Murialdo E8-45, Quito",
      totalDebt: 0,
      totalPaid: 0,
      totalPending: 0,
      invoices: [
        {
          id: "INV-005",
          invoiceNumber: "FAC-2026-003",
          invoiceDate: "2026-01-15",
          saleType: "credit",
          totalAmount: 2400.0,
          paidAmount: 0,
          pendingAmount: 2400.0,
          dueDate: "2026-03-01",
          paymentTermDays: 45,
          installments: 1,
          status: "overdue",
          amortization: [
            {
              id: "A8",
              installmentNumber: 1,
              dueDate: "2026-03-01",
              scheduledAmount: 2400.0,
              paidAmount: 0,
              pendingAmount: 2400.0,
              status: "overdue",
              paymentDetails: [],
            },
          ],
          notes: "URGENTE: Cobro vencido - Contactar cliente",
          isActive: true,
        },
      ],
    },
    {
      id: "CLI-005",
      name: "Almacenes Pérez & Asociados",
      type: "company",
      ruc: "1789012345001",
      phone: "+593 2 4567890",
      email: "pagos@perezasociados.com",
      address: "Av. Patria E4-123, Quito",
      totalDebt: 0,
      totalPaid: 0,
      totalPending: 0,
      invoices: [
        {
          id: "INV-006",
          invoiceNumber: "FAC-2026-012",
          invoiceDate: "2026-02-20",
          saleType: "credit",
          totalAmount: 5200.0,
          paidAmount: 0,
          pendingAmount: 5200.0,
          dueDate: "2026-03-22",
          paymentTermDays: 30,
          installments: 1,
          status: "pending",
          amortization: [
            {
              id: "A9",
              installmentNumber: 1,
              dueDate: "2026-03-22",
              scheduledAmount: 5200.0,
              paidAmount: 0,
              pendingAmount: 5200.0,
              status: "pending",
              paymentDetails: [],
            },
          ],
          notes: "Crédito 30 días",
          isActive: true,
        },
        {
          id: "INV-007",
          invoiceNumber: "FAC-2026-018",
          invoiceDate: "2026-03-01",
          saleType: "credit",
          totalAmount: 3600.0,
          paidAmount: 0,
          pendingAmount: 3600.0,
          dueDate: "2026-03-31",
          paymentTermDays: 30,
          installments: 1,
          status: "pending",
          amortization: [
            {
              id: "A10",
              installmentNumber: 1,
              dueDate: "2026-03-31",
              scheduledAmount: 3600.0,
              paidAmount: 0,
              pendingAmount: 3600.0,
              status: "pending",
              paymentDetails: [],
            },
          ],
          notes: "Crédito 30 días",
          isActive: true,
        },
      ],
    },
    {
      id: "CLI-006",
      name: "Ana Patricia Moreno Villavicencio",
      type: "individual",
      ruc: "1734567890",
      phone: "+593 99 876 5432",
      email: "ana.moreno@yahoo.com",
      address: "Av. 10 de Agosto N45-67, Quito",
      totalDebt: 0,
      totalPaid: 0,
      totalPending: 0,
      invoices: [
        {
          id: "INV-008",
          invoiceNumber: "FAC-2026-022",
          invoiceDate: "2026-03-08",
          saleType: "cash",
          totalAmount: 850.0,
          paidAmount: 850.0,
          pendingAmount: 0,
          dueDate: "2026-03-08",
          paymentTermDays: 0,
          installments: 1,
          status: "paid",
          amortization: [
            {
              id: "A11",
              installmentNumber: 1,
              dueDate: "2026-03-08",
              scheduledAmount: 850.0,
              paidAmount: 850.0,
              pendingAmount: 0,
              status: "paid",
              paymentDetails: [
                {
                  id: "P4",
                  date: "2026-03-08",
                  amount: 850.0,
                  paymentMethod: "transfer",
                  reference: "TRANS-2026-089",
                  notes: "Transferencia Banco Guayaquil",
                  registeredBy: "Ana Torres",
                },
              ],
            },
          ],
          notes: "Pago al contado",
          isActive: true,
        },
      ],
    },
    {
      id: "CLI-007",
      name: "TechnoSoft Ecuador S.A.",
      type: "company",
      ruc: "1787890123001",
      phone: "+593 2 6789012",
      email: "facturacion@technosoft.ec",
      address: "Av. República E7-123 y Diego de Almagro, Quito",
      totalDebt: 0,
      totalPaid: 0,
      totalPending: 0,
      invoices: [
        {
          id: "INV-009",
          invoiceNumber: "FAC-2026-025",
          invoiceDate: "2026-03-09",
          saleType: "credit",
          totalAmount: 7200.0,
          paidAmount: 3600.0,
          pendingAmount: 3600.0,
          dueDate: "2026-05-09",
          paymentTermDays: 60,
          installments: 2,
          status: "partial",
          amortization: [
            {
              id: "A12",
              installmentNumber: 1,
              dueDate: "2026-04-09",
              scheduledAmount: 3600.0,
              paidAmount: 3600.0,
              pendingAmount: 0,
              status: "paid",
              paymentDetails: [
                {
                  id: "P5",
                  date: "2026-04-08",
                  amount: 3600.0,
                  paymentMethod: "transfer",
                  reference: "TRANS-2026-145",
                  notes: "Pago anticipado primera cuota",
                  registeredBy: "Juan Pérez",
                },
              ],
            },
            {
              id: "A13",
              installmentNumber: 2,
              dueDate: "2026-05-09",
              scheduledAmount: 3600.0,
              paidAmount: 0,
              pendingAmount: 3600.0,
              status: "pending",
              paymentDetails: [],
            },
          ],
          notes: "Cliente preferencial - Crédito 60 días",
          isActive: true,
        },
      ],
    },
    {
      id: "CLI-008",
      name: "Diego Sebastián Romero Castro",
      type: "individual",
      ruc: "1745678901",
      phone: "+593 98 123 4567",
      email: "diego.romero@hotmail.com",
      address: "Calle Portugal E9-234, Quito",
      totalDebt: 0,
      totalPaid: 0,
      totalPending: 0,
      invoices: [
        {
          id: "INV-010",
          invoiceNumber: "FAC-2026-027",
          invoiceDate: "2026-03-11",
          saleType: "credit",
          totalAmount: 1500.0,
          paidAmount: 0,
          pendingAmount: 1500.0,
          dueDate: "2026-04-10",
          paymentTermDays: 30,
          installments: 1,
          status: "pending",
          amortization: [
            {
              id: "A14",
              installmentNumber: 1,
              dueDate: "2026-04-10",
              scheduledAmount: 1500.0,
              paidAmount: 0,
              pendingAmount: 1500.0,
              status: "pending",
              paymentDetails: [],
            },
          ],
          notes: "Crédito 30 días",
          isActive: true,
        },
      ],
    },
  ]);

  // Calcular totales por cliente
  clients.forEach((client) => {
    client.totalDebt = client.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    client.totalPaid = client.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    client.totalPending = client.invoices.reduce((sum, inv) => sum + inv.pendingAmount, 0);
  });

  // Calcular meses hasta vencimiento
  const getMonthsUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    return { days: diffDays, months: diffMonths };
  };

  // Filtros
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.ruc.includes(searchTerm) ||
      client.invoices.some((inv) => inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const hasMatchingInvoices = client.invoices.some((invoice) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return invoice.status === "pending" || invoice.status === "partial";
      if (activeTab === "overdue") return invoice.status === "overdue";
      if (activeTab === "paid") return invoice.status === "paid";
      return false;
    });

    return matchesSearch && hasMatchingInvoices && client.invoices.length > 0;
  });

  // Contadores
  const counts = {
    all: clients.reduce((sum, c) => sum + c.invoices.length, 0),
    pending: clients.reduce(
      (sum, c) => sum + c.invoices.filter((i) => i.status === "pending" || i.status === "partial").length,
      0
    ),
    overdue: clients.reduce((sum, c) => sum + c.invoices.filter((i) => i.status === "overdue").length, 0),
    paid: clients.reduce((sum, c) => sum + c.invoices.filter((i) => i.status === "paid").length, 0),
  };

  // Funciones
  const toggleClientExpanded = (clientId: string) => {
    const newSet = new Set(expandedClients);
    if (newSet.has(clientId)) {
      newSet.delete(clientId);
    } else {
      newSet.add(clientId);
    }
    setExpandedClients(newSet);
  };

  const togglePaymentDetails = (installmentId: string) => {
    const newSet = new Set(expandedPaymentDetails);
    if (newSet.has(installmentId)) {
      newSet.delete(installmentId);
    } else {
      newSet.add(installmentId);
    }
    setExpandedPaymentDetails(newSet);
  };

  const toggleInstallmentSelection = (installmentId: string) => {
    const newSet = new Set(selectedInstallments);
    if (newSet.has(installmentId)) {
      newSet.delete(installmentId);
    } else {
      newSet.add(installmentId);
    }
    setSelectedInstallments(newSet);
  };

  const handleQuickPayment = (totalAmount: boolean = false) => {
    if (!selectedInvoice || selectedInstallments.size === 0) return;

    const installmentsArray = selectedInvoice.invoice.amortization.filter((row) =>
      selectedInstallments.has(row.id)
    );

    const totalPending = installmentsArray.reduce((sum, row) => sum + row.pendingAmount, 0);

    const amount = totalAmount ? totalPending : parseFloat(paymentForm.amount);

    if (!totalAmount && (isNaN(amount) || amount <= 0)) {
      alert("Por favor ingrese un monto válido");
      return;
    }

    // Eliminada la validación que impedía pagar de más - ahora se permite para calcular cambio
    
    let remainingAmount = amount;
    const paymentDate = paymentForm.date;
    const paymentMethod = paymentForm.paymentMethod;
    const reference = paymentForm.reference || `PAY-${Date.now()}`;

    setClients((prevClients) =>
      prevClients.map((client) => {
        if (client.id === selectedInvoice.client.id) {
          return {
            ...client,
            invoices: client.invoices.map((invoice) => {
              if (invoice.id === selectedInvoice.invoice.id) {
                const updatedAmortization = invoice.amortization.map((row) => {
                  if (selectedInstallments.has(row.id) && remainingAmount > 0) {
                    const paymentForThisRow = Math.min(remainingAmount, row.pendingAmount);
                    remainingAmount -= paymentForThisRow;

                    const newPayment: PaymentDetail = {
                      id: Date.now().toString() + Math.random(),
                      date: paymentDate,
                      amount: paymentForThisRow,
                      paymentMethod: paymentMethod,
                      reference: reference,
                      notes: selectedInstallments.size > 1 ? "Pago múltiple de cuotas" : "Pago de cuota",
                      registeredBy: "Usuario Actual",
                    };

                    const newPaidAmount = row.paidAmount + paymentForThisRow;
                    const newPendingAmount = row.scheduledAmount - newPaidAmount;
                    const newStatus: AmortizationRow["status"] =
                      newPendingAmount === 0
                        ? "paid"
                        : newPaidAmount > 0
                        ? "partial"
                        : row.status === "overdue"
                        ? "overdue"
                        : "pending";

                    return {
                      ...row,
                      paidAmount: newPaidAmount,
                      pendingAmount: newPendingAmount,
                      status: newStatus,
                      paymentDetails: [...row.paymentDetails, newPayment],
                    };
                  }
                  return row;
                });

                const newPaidAmount = updatedAmortization.reduce((sum, row) => sum + row.paidAmount, 0);
                const newPendingAmount = invoice.totalAmount - newPaidAmount;
                const hasOverdue = updatedAmortization.some((row) => row.status === "overdue");
                const newStatus: Invoice["status"] = hasOverdue
                  ? "overdue"
                  : newPendingAmount === 0
                  ? "paid"
                  : newPaidAmount > 0
                  ? "partial"
                  : "pending";

                return {
                  ...invoice,
                  paidAmount: newPaidAmount,
                  pendingAmount: newPendingAmount,
                  status: newStatus,
                  amortization: updatedAmortization,
                };
              }
              return invoice;
            }),
          };
        }
        return client;
      })
    );

    // No generar recibo aquí - se hace en el paso 4
    // No resetear formulario - se hace después de imprimir
  };

  const generatePaymentReceipt = (
    client: Client,
    invoice: Invoice,
    installments: AmortizationRow[],
    totalPaid: number,
    totalPending: number
  ) => {
    const companyName = localStorage.getItem("companyName") || "TicSoftEc";
    const receiptNumber = `REC-${Date.now()}`;
    const currentDate = new Date().toLocaleString("es-EC");
    
    // Calcular cambio y pago efectivo
    const changeAmount = Math.max(0, totalPaid - totalPending);
    const effectivePayment = Math.min(totalPaid, totalPending);
    const remainingBalance = Math.max(0, totalPending - totalPaid);

    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Recibo de Pago - ${receiptNumber}</title>
          <style>
            @media print {
              @page { margin: 0.5cm; }
              body { margin: 0; }
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 80mm;
              margin: 0 auto;
              padding: 10px;
              background: white;
              color: #000;
            }
            .receipt { background: white; }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 8px;
              margin-bottom: 8px;
            }
            .company-name {
              font-size: 16px;
              font-weight: bold;
              text-transform: uppercase;
              margin-bottom: 3px;
            }
            .receipt-title {
              font-size: 14px;
              font-weight: bold;
              margin: 5px 0;
            }
            .receipt-number {
              font-size: 10px;
              margin-top: 3px;
            }
            .section {
              margin-bottom: 8px;
              font-size: 11px;
            }
            .section-title {
              font-weight: bold;
              font-size: 11px;
              margin-bottom: 3px;
              text-transform: uppercase;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 2px 0;
              font-size: 10px;
            }
            .label { font-weight: normal; }
            .value { font-weight: bold; text-align: right; }
            .divider {
              border-top: 1px dashed #000;
              margin: 6px 0;
            }
            .divider-solid {
              border-top: 2px solid #000;
              margin: 6px 0;
            }
            .amount-box {
              text-align: center;
              border: 2px solid #000;
              padding: 8px;
              margin: 8px 0;
            }
            .amount-label {
              font-size: 10px;
              margin-bottom: 3px;
            }
            .amount-value {
              font-size: 20px;
              font-weight: bold;
            }
            .highlight-box {
              text-align: center;
              border: 2px dashed #000;
              padding: 10px;
              margin: 10px 0;
              background: #f5f5f5;
            }
            .highlight-label {
              font-size: 12px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .highlight-value {
              font-size: 24px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              font-size: 9px;
              margin-top: 8px;
              padding-top: 6px;
              border-top: 2px dashed #000;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin: 30px 20px 5px 20px;
              text-align: center;
              font-size: 9px;
            }
            table {
              width: 100%;
              font-size: 9px;
              margin: 5px 0;
            }
            table td {
              padding: 2px 0;
            }
            .text-right { text-align: right; }
            .text-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="company-name">${companyName}</div>
              <div class="receipt-title">RECIBO DE PAGO</div>
              <div class="receipt-number">${receiptNumber}</div>
            </div>

            <div class="section">
              <div class="section-title">Cliente</div>
              <div class="row">
                <span class="label">Nombre:</span>
                <span class="value">${client.name}</span>
              </div>
              <div class="row">
                <span class="label">${client.type === "company" ? "RUC" : "CI"}:</span>
                <span class="value">${client.ruc}</span>
              </div>
              <div class="row">
                <span class="label">Tel:</span>
                <span class="value">${client.phone}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Detalle del Pago</div>
              <div class="row">
                <span class="label">Factura:</span>
                <span class="value">${invoice.invoiceNumber}</span>
              </div>
              <div class="row">
                <span class="label">F. Factura:</span>
                <span class="value">${new Date(invoice.invoiceDate).toLocaleDateString("es-EC")}</span>
              </div>
              <div class="row">
                <span class="label">Método Pago:</span>
                <span class="value">${getPaymentMethodLabel(paymentForm.paymentMethod)}</span>
              </div>
              ${
                paymentForm.reference
                  ? `<div class="row">
                <span class="label">Ref:</span>
                <span class="value">${paymentForm.reference}</span>
              </div>`
                  : ""
              }
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Cuotas</div>
              <table>
                ${installments
                  .map(
                    (inst) => `
                  <tr>
                    <td>${invoice.saleType === "cash" ? "Pago Único" : `Cuota ${inst.installmentNumber}`}</td>
                    <td class="text-right text-bold">$${inst.scheduledAmount.toFixed(2)}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>

            <div class="divider-solid"></div>

            <div class="section">
              <table>
                <tr>
                  <td>Total a Pagar:</td>
                  <td class="text-right text-bold">$${totalPending.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Monto Recibido:</td>
                  <td class="text-right text-bold">$${totalPaid.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Pago Efectivo:</td>
                  <td class="text-right text-bold">$${effectivePayment.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            ${remainingBalance > 0 ? `
            <div class="highlight-box">
              <div class="highlight-label">SALDO PENDIENTE</div>
              <div class="highlight-value">$${remainingBalance.toFixed(2)}</div>
            </div>
            ` : ''}

            ${changeAmount > 0 ? `
            <div class="highlight-box">
              <div class="highlight-label">CAMBIO A DEVOLVER</div>
              <div class="highlight-value">$${changeAmount.toFixed(2)}</div>
            </div>
            ` : ''}

            <div class="divider-solid"></div>

            <div class="section">
              <div class="section-title">Resumen de Factura ${invoice.invoiceNumber}</div>
              <table>
                <tr>
                  <td>Monto Total Factura:</td>
                  <td class="text-right text-bold">$${invoice.totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Total Abonos:</td>
                  <td class="text-right">$${(invoice.paidAmount + effectivePayment).toFixed(2)}</td>
                </tr>
                <tr style="background: #f0f0f0;">
                  <td class="text-bold">Saldo que Debe:</td>
                  <td class="text-right text-bold">$${(invoice.pendingAmount - effectivePayment).toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <div class="divider"></div>

            <div class="section">
              <div class="section-title">Detalle Completo de la Factura</div>
              <table>
                ${invoice.amortization
                  .map(
                    (row, index) => `
                  <tr>
                    <td style="font-size: 8px;">${invoice.saleType === "cash" ? "Pago Único" : `Cuota ${row.installmentNumber}`}</td>
                    <td class="text-right" style="font-size: 8px;">$${row.scheduledAmount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="font-size: 7px; padding-left: 8px; color: #666;">
                      Pagado: $${row.paidAmount.toFixed(2)} | Pendiente: $${row.pendingAmount.toFixed(2)}
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>

            <div class="signature-line">
              Firma y Sello del Cobrador
            </div>

            <div class="footer">
              <div>${currentDate}</div>
              <div style="margin-top: 5px;">Procesado por: Usuario Actual</div>
              <div style="margin-top: 8px; font-weight: bold;">¡Gracias por su pago!</div>
              <div style="margin-top: 5px;">Sistema ERP ${companyName}</div>
            </div>
          </div>
          
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Cliente",
      "Tipo",
      "RUC/CI",
      "# Factura",
      "Fecha",
      "Total",
      "Pagado",
      "Pendiente",
      "Vencimiento",
      "Estado",
    ];
    const rows: string[][] = [];

    filteredClients.forEach((client) => {
      client.invoices.forEach((invoice) => {
        rows.push([
          client.name,
          client.type === "company" ? "Empresa" : "Persona Natural",
          client.ruc,
          invoice.invoiceNumber,
          invoice.invoiceDate,
          invoice.totalAmount.toFixed(2),
          invoice.paidAmount.toFixed(2),
          invoice.pendingAmount.toFixed(2),
          invoice.dueDate,
          getInvoiceStatusConfig(invoice.status).label,
        ]);
      });
    });

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cobros_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const getInvoiceStatusConfig = (status: Invoice["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendiente",
          color: isLight ? "bg-orange-100 text-orange-700" : "bg-orange-900/30 text-orange-400",
        };
      case "partial":
        return {
          label: "Pendiente",
          color: isLight ? "bg-orange-100 text-orange-700" : "bg-orange-900/30 text-orange-400",
        };
      case "paid":
        return {
          label: "Pagado",
          color: isLight ? "bg-green-100 text-green-700" : "bg-green-900/30 text-green-400",
        };
      case "overdue":
        return {
          label: "Vencido",
          color: isLight ? "bg-red-100 text-red-700" : "bg-red-900/30 text-red-400",
        };
      case "cancelled":
        return {
          label: "Cancelado",
          color: isLight ? "bg-gray-100 text-gray-700" : "bg-gray-900/30 text-gray-400",
        };
    }
  };

  const getInstallmentStatusConfig = (status: AmortizationRow["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendiente",
          color: isLight ? "bg-orange-100 text-orange-700" : "bg-orange-900/30 text-orange-400",
        };
      case "partial":
        return {
          label: "Pendiente",
          color: isLight ? "bg-orange-100 text-orange-700" : "bg-orange-900/30 text-orange-400",
        };
      case "paid":
        return {
          label: "Pagado",
          color: isLight ? "bg-green-100 text-green-700" : "bg-green-900/30 text-green-400",
        };
      case "overdue":
        return {
          label: "Vencido",
          color: isLight ? "bg-red-100 text-red-700" : "bg-red-900/30 text-red-400",
        };
    }
  };

  const getPaymentMethodLabel = (method: PaymentDetail["paymentMethod"]) => {
    switch (method) {
      case "cash":
        return "Efectivo";
      case "transfer":
        return "Transferencia";
      case "check":
        return "Cheque";
      case "card":
        return "Tarjeta";
      case "deposit":
        return "Depósito";
    }
  };

  // Función para imprimir el resumen de amortización
  const printReceipt = (invoice: Invoice) => {
    const companyName = localStorage.getItem("companyName") || "TicSoftEc";
    
    const receiptContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Resumen de Amortización - ${invoice.invoiceNumber}</title>
          <style>
            @media print {
              @page { margin: 1cm; }
              body { margin: 0; }
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              background: white;
              color: #000;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #0D1B2A;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #E8692E;
            }
            .document-title {
              font-size: 18px;
              font-weight: bold;
              margin-top: 10px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 10px;
              color: #0D1B2A;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #0D1B2A;
              color: white;
              font-weight: bold;
            }
            .text-right { text-align: right; }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">${companyName}</div>
            <div class="document-title">Resumen de Amortización</div>
            <div style="margin-top: 10px;">${invoice.invoiceNumber}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Información General</div>
            <p>Total Factura: $${invoice.totalAmount.toFixed(2)}</p>
            <p>Total Pagado: $${invoice.paidAmount.toFixed(2)}</p>
            <p>Saldo Pendiente: $${invoice.pendingAmount.toFixed(2)}</p>
          </div>

          <div class="section">
            <div class="section-title">Tabla de Amortización</div>
            <table>
              <thead>
                <tr>
                  <th>Cuota</th>
                  <th>Vencimiento</th>
                  <th class="text-right">Monto</th>
                  <th class="text-right">Pagado</th>
                  <th class="text-right">Saldo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.amortization.map((row) => `
                  <tr>
                    <td>Cuota ${row.installmentNumber}</td>
                    <td>${new Date(row.dueDate).toLocaleDateString("es-EC")}</td>
                    <td class="text-right">$${row.scheduledAmount.toFixed(2)}</td>
                    <td class="text-right">$${row.paidAmount.toFixed(2)}</td>
                    <td class="text-right">$${row.pendingAmount.toFixed(2)}</td>
                    <td>${row.status === "paid" ? "Pagado" : row.status === "overdue" ? "Vencido" : "Pendiente"}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>Generado el ${new Date().toLocaleString("es-EC")}</p>
            <p>Sistema ERP ${companyName}</p>
          </div>
          
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Tabs y Acciones ── */}
      <div className={`flex items-center justify-between border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-8 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "pending"
                ? "border-primary text-primary"
                : isLight
                ? "border-transparent text-gray-600 hover:text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Pendientes ({counts.pending})
          </button>

          <button
            onClick={() => setActiveTab("overdue")}
            className={`px-8 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "overdue"
                ? "border-primary text-primary"
                : isLight
                ? "border-transparent text-gray-600 hover:text-gray-900"
                : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
          >
            Vencidos ({counts.overdue})
          </button>
        </div>

        <div className="flex items-center gap-2 pb-3">
          <button
            onClick={handleExportCSV}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLight
                ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
            }`}
          >
            Exportar CSV
          </button>
          <button
            onClick={handlePrint}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLight
                ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
            }`}
          >
            Imprimir
          </button>
        </div>
      </div>

      {/* ── Buscador ── */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por cliente, RUC/CI o número de factura..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
            isLight
              ? "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
              : "bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
          }`}
        />
      </div>

      {/* ── Lista de Clientes con Facturas ── */}
      <div className="space-y-3">
        {filteredClients.map((client) => {
          const isExpanded = expandedClients.has(client.id);

          return (
            <div
              key={client.id}
              className={`rounded-xl border overflow-hidden ${
                isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"
              }`}
            >
              {/* Header del Cliente */}
              <div
                className={`px-5 py-4 cursor-pointer transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                onClick={() => toggleClientExpanded(client.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className={`font-semibold text-sm ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                          {client.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            isLight ? "bg-gray-100 text-gray-600" : "bg-white/10 text-gray-400"
                          }`}
                        >
                          {client.type === "company" ? "Empresa" : "Persona Natural"}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        {client.type === "company" ? "RUC" : "CI"}: {client.ruc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Total Deuda</p>
                      <p className={`text-base font-semibold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                        ${client.totalDebt.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Saldo Pendiente</p>
                      <p className="text-base font-semibold text-red-600">
                        ${client.totalPending.toFixed(2)}
                      </p>
                    </div>
                    <div className="w-6 flex justify-center">
                      {isExpanded ? (
                        <ChevronDown className={`w-5 h-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      ) : (
                        <ChevronRight className={`w-5 h-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de Facturas del Cliente */}
              {isExpanded && (
                <div
                  className={`border-t ${isLight ? "border-gray-200 bg-gray-50/50" : "border-white/10 bg-black/20"}`}
                >
                  {client.invoices.map((invoice) => {
                    const statusConfig = getInvoiceStatusConfig(invoice.status);

                    return (
                      <div
                        key={invoice.id}
                        className={`px-5 py-4 border-b last:border-b-0 ${isLight ? "border-gray-200" : "border-white/10"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className={`font-semibold text-sm ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                                {invoice.invoiceNumber}
                              </h4>
                              <span className={`px-2.5 py-1 rounded text-xs font-medium ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className={`text-xs mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                              Fecha: {new Date(invoice.invoiceDate).toLocaleDateString("es-EC")} • Crédito {invoice.paymentTermDays} días
                            </p>
                          </div>

                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Monto Total</p>
                              <p className={`text-sm font-semibold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                                ${invoice.totalAmount.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Pendiente</p>
                              <p className="text-sm font-semibold text-red-600">
                                ${invoice.pendingAmount.toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedInvoice({ client, invoice });
                                setShowRegisterPaymentModal(true);
                                setCurrentStep(1);
                                setActiveInstallmentsTab("pending");
                                setSelectedInstallments(new Set());
                              }}
                              className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
                            >
                              Cobrar Cuota
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {filteredClients.length === 0 && (
          <div
            className={`py-16 rounded-xl border text-center ${
              isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"
            }`}
          >
            <p className={`text-sm font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              No se encontraron facturas {activeTab === "pending" ? "pendientes" : "vencidas"}
            </p>
            <p className={`text-xs mt-2 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* ── Modal Tabla de Amortización (CON DETALLES DE PAGO) ── */}
      {showAmortizationModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl ${
              isLight ? "bg-white" : "bg-[#1a2936]"
            }`}
          >
            {/* Header */}
            <div
              className={`sticky top-0 px-6 py-4 border-b ${
                isLight
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200"
                  : "bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <CalendarClock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Tabla de Amortización
                    </h3>
                    <p className={`text-sm mt-0.5 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {selectedInvoice.invoice.invoiceNumber} • {selectedInvoice.client.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAmortizationModal(false)}
                  className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
                >
                  <X className={`w-5 h-5 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
                </button>
              </div>
            </div>

            {/* Contenido con scroll */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6 space-y-6">
                {/* Resumen - ÚNICA TARJETA */}
                <div className="grid grid-cols-4 gap-3">
                  <div className={`px-3 py-2.5 rounded-lg ${isLight ? "bg-gray-50" : "bg-[#0f1825]"}`}>
                    <p className={`text-[10px] font-medium mb-0.5 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Tipo de Venta
                    </p>
                    <p className={`text-xs font-bold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                      {selectedInvoice.invoice.saleType === "cash" ? "Contado" : `Crédito ${selectedInvoice.invoice.paymentTermDays} días`}
                    </p>
                  </div>
                  <div className={`px-3 py-2.5 rounded-lg ${isLight ? "bg-gray-50" : "bg-[#0f1825]"}`}>
                    <p className={`text-[10px] font-medium mb-0.5 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Total Factura
                    </p>
                    <p className={`text-xs font-bold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                      ${selectedInvoice.invoice.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className={`px-3 py-2.5 rounded-lg ${isLight ? "bg-green-50" : "bg-green-900/20"}`}>
                    <p className={`text-[10px] font-medium mb-0.5 ${isLight ? "text-green-700" : "text-green-400"}`}>
                      Total Pagado
                    </p>
                    <p className="text-xs font-bold text-green-600">
                      ${selectedInvoice.invoice.paidAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className={`px-3 py-2.5 rounded-lg ${isLight ? "bg-red-50" : "bg-red-900/20"}`}>
                    <p className={`text-[10px] font-medium mb-0.5 ${isLight ? "text-red-700" : "text-red-400"}`}>
                      Saldo Pendiente
                    </p>
                    <p className="text-xs font-bold text-red-600">
                      ${selectedInvoice.invoice.pendingAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Título y Botón de Pago */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className={`text-sm font-bold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                      {selectedInvoice.invoice.saleType === "cash"
                        ? "Pago al Contado"
                        : `Plan de Pagos - ${selectedInvoice.invoice.installments} cuotas mensuales`}
                    </h4>
                    {selectedInstallments.size > 0 && (
                      <button
                        onClick={() => {
                          const totalSelected = selectedInvoice.invoice.amortization
                            .filter((row) => selectedInstallments.has(row.id))
                            .reduce((sum, row) => sum + row.pendingAmount, 0);
                          setPaymentForm({ ...paymentForm, amount: totalSelected.toFixed(2) });
                          setCurrentStep(1);
                          setShowRegisterPaymentModal(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        Pagar ${selectedInvoice.invoice.amortization
                          .filter((row) => selectedInstallments.has(row.id))
                          .reduce((sum, row) => sum + row.pendingAmount, 0)
                          .toFixed(2)}
                      </button>
                    )}
                  </div>

                  {/* Pestañas */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <button
                      onClick={() => {
                        setActiveInstallmentsTab("pending");
                        setSelectedInstallments(new Set());
                      }}
                      className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 ${
                        activeInstallmentsTab === "pending"
                          ? "border-primary text-primary"
                          : isLight
                          ? "border-transparent text-gray-500 hover:text-gray-700"
                          : "border-transparent text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      Cuotas Pendientes ({selectedInvoice.invoice.amortization.filter((r) => r.status !== "paid").length})
                    </button>
                    <button
                      onClick={() => {
                        setActiveInstallmentsTab("paid");
                        setSelectedInstallments(new Set());
                      }}
                      className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 ${
                        activeInstallmentsTab === "paid"
                          ? "border-primary text-primary"
                          : isLight
                          ? "border-transparent text-gray-500 hover:text-gray-700"
                          : "border-transparent text-gray-400 hover:text-gray-300"
                      }`}
                    >
                      Cuotas Pagadas ({selectedInvoice.invoice.amortization.filter((r) => r.status === "paid").length})
                    </button>
                    </div>
                    
                    {/* Botón Imprimir */}
                    <button
                      onClick={() => window.print()}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isLight
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Imprimir Resumen
                    </button>
                  </div>
                  <div className={`rounded-lg border overflow-hidden ${isLight ? "border-gray-200" : "border-[#1a2936]"}`}>
                    <table className="w-full">
                      <thead className={isLight ? "bg-gray-50" : "bg-[#0f1825]"}>
                        <tr>
                          {activeInstallmentsTab === "pending" && (
                            <th className="px-2 py-2.5 text-left w-8">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded accent-primary cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    const pendingIds = selectedInvoice.invoice.amortization
                                      .filter((row) => row.status !== "paid")
                                      .map((row) => row.id);
                                    setSelectedInstallments(new Set(pendingIds));
                                  } else {
                                    setSelectedInstallments(new Set());
                                  }
                                }}
                                checked={
                                  selectedInstallments.size > 0 &&
                                  selectedInvoice.invoice.amortization.filter((row) => row.status !== "paid").length ===
                                    selectedInstallments.size
                                }
                              />
                            </th>
                          )}
                          <th className={`px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Cuota
                          </th>
                          <th className={`px-3 py-2.5 text-left text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Vencimiento
                          </th>
                          <th className={`px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Monto
                          </th>
                          <th className={`px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Pagado
                          </th>
                          <th className={`px-3 py-2.5 text-right text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Saldo
                          </th>
                          <th className={`px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Estado
                          </th>
                          {activeInstallmentsTab === "pending" && (
                            <th className={`px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wider w-24 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                              Acciones
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-[#1a2936]"}`}>
                        {selectedInvoice.invoice.amortization
                          .filter((row) =>
                            activeInstallmentsTab === "pending" ? row.status !== "paid" : row.status === "paid"
                          )
                          .flatMap((row) => {
                            const statusConfig = getInstallmentStatusConfig(row.status);
                            const timeUntilDue = getMonthsUntilDue(row.dueDate);
                            const isExpanded = expandedPaymentDetails.has(row.id);

                            const mainRow = (
                              <tr key={row.id} className={`group transition-colors ${isLight ? "hover:bg-primary/5" : "hover:bg-[#1a2936]"}`}>
                                {activeInstallmentsTab === "pending" && (
                                  <td className="px-2 py-3">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded accent-primary cursor-pointer"
                                      checked={selectedInstallments.has(row.id)}
                                      onChange={() => toggleInstallmentSelection(row.id)}
                                      disabled={row.status === "paid"}
                                    />
                                  </td>
                                )}
                                <td className="px-3 py-3">
                                  <span className={`text-sm font-bold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                                    {selectedInvoice.invoice.saleType === "cash" ? "Pago Único" : `Cuota ${row.installmentNumber}`}
                                  </span>
                                </td>
                                <td className="px-3 py-3">
                                  <div>
                                    <p className={`text-sm font-medium ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                                      {new Date(row.dueDate).toLocaleDateString("es-EC")}
                                    </p>
                                    {activeInstallmentsTab === "pending" && (row.status === "pending" || row.status === "partial" || row.status === "overdue") && (
                                      <p
                                        className={`text-xs font-medium mt-0.5 ${
                                          timeUntilDue.days < 0
                                            ? "text-red-600"
                                            : timeUntilDue.months === 0
                                            ? "text-primary"
                                            : isLight ? "text-gray-500" : "text-gray-400"
                                        }`}
                                      >
                                        {timeUntilDue.days < 0
                                          ? `Vencido ${Math.abs(timeUntilDue.months)}m`
                                          : timeUntilDue.months === 0
                                          ? "Este mes"
                                          : `${timeUntilDue.months}m`}
                                      </p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <p className={`text-sm font-bold text-right ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                                    ${row.scheduledAmount.toFixed(2)}
                                  </p>
                                </td>
                                <td className="px-3 py-3">
                                  <p className="text-sm font-bold text-right text-green-600">
                                    ${row.paidAmount.toFixed(2)}
                                  </p>
                                  {row.paidAmount > 0 && row.paidAmount < row.scheduledAmount && (
                                    <p className={`text-xs text-right mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                      {((row.paidAmount / row.scheduledAmount) * 100).toFixed(0)}%
                                    </p>
                                  )}
                                </td>
                                <td className="px-3 py-3">
                                  <p className={`text-sm font-bold text-right ${row.pendingAmount > 0 ? "text-red-600" : isLight ? "text-gray-400" : "text-gray-500"}`}>
                                    ${row.pendingAmount.toFixed(2)}
                                  </p>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex justify-center">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase ${
                                        row.status === "paid"
                                          ? isLight
                                            ? "bg-green-100 text-green-700"
                                            : "bg-green-900/30 text-green-400"
                                          : row.status === "partial"
                                          ? isLight
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-orange-900/30 text-orange-400"
                                          : row.status === "overdue"
                                          ? isLight
                                            ? "bg-red-100 text-red-700"
                                            : "bg-red-900/30 text-red-400"
                                          : isLight
                                          ? "bg-orange-100 text-orange-700"
                                          : "bg-orange-900/30 text-primary"
                                      }`}
                                    >
                                      {statusConfig.label}
                                    </span>
                                  </div>
                                </td>
                                {activeInstallmentsTab === "pending" && (
                                  <td className="px-3 py-3">
                                    <div className="flex justify-center">
                                      <button
                                        onClick={() => {
                                          setSelectedInstallments(new Set([row.id]));
                                          setPaymentForm({ ...paymentForm, amount: row.pendingAmount.toFixed(2) });
                                          setCurrentStep(1);
                                          setShowRegisterPaymentModal(true);
                                        }}
                                        disabled={row.status === "paid"}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                          row.status === "paid"
                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            : "bg-primary text-white hover:bg-primary/90"
                                        }`}
                                      >
                                        <DollarSign className="w-3.5 h-3.5" />
                                        Pagar
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );

                            // Detalles de Pagos Expandidos
                            const detailRow = isExpanded && row.paymentDetails.length > 0 ? (
                              <tr key={`${row.id}-details`}>
                                <td colSpan={activeInstallmentsTab === "pending" ? 8 : 6} className={isLight ? "bg-primary/5 border-l-2 border-primary" : "bg-[#0D1B2A] border-l-2 border-primary"}>
                                  <div className="px-8 py-3">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Receipt className={`w-4 h-4 ${isLight ? "text-primary" : "text-primary"}`} />
                                      <h5 className={`text-xs font-bold uppercase tracking-wide ${isLight ? "text-[#0D1B2A]" : "text-gray-300"}`}>
                                        Historial de Pagos
                                      </h5>
                                    </div>
                                    <div
                                      className={`rounded-lg border overflow-hidden ${
                                        isLight ? "border-gray-200 bg-white" : "border-[#1a2936] bg-[#1a2936]"
                                      }`}
                                    >
                                      <table className="w-full">
                                        <thead
                                          className={isLight ? "bg-gray-100 border-b border-gray-200" : "bg-[#0f1825] border-b border-[#1a2936]"}
                                        >
                                          <tr>
                                            <th
                                              className={`px-3 py-2 text-left text-xs font-medium ${
                                                isLight ? "text-gray-600" : "text-gray-400"
                                              }`}
                                            >
                                              Fecha
                                            </th>
                                            <th
                                              className={`px-3 py-2 text-left text-xs font-medium ${
                                                isLight ? "text-gray-600" : "text-gray-400"
                                              }`}
                                            >
                                              Método
                                            </th>
                                            <th
                                              className={`px-3 py-2 text-left text-xs font-medium ${
                                                isLight ? "text-gray-600" : "text-gray-400"
                                              }`}
                                            >
                                              Referencia
                                            </th>
                                            <th
                                              className={`px-3 py-2 text-right text-xs font-medium ${
                                                isLight ? "text-gray-600" : "text-gray-400"
                                              }`}
                                            >
                                              Monto
                                            </th>
                                            <th
                                              className={`px-3 py-2 text-left text-xs font-medium ${
                                                isLight ? "text-gray-600" : "text-gray-400"
                                              }`}
                                            >
                                              Registrado por
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody
                                          className={`divide-y ${
                                            isLight ? "divide-gray-200" : "divide-[#1a2936]"
                                          }`}
                                        >
                                          {row.paymentDetails.map((payment) => (
                                            <tr key={payment.id}>
                                              <td
                                                className={`px-3 py-2 text-sm ${
                                                  isLight ? "text-[#0D1B2A]" : "text-gray-300"
                                                }`}
                                              >
                                                {new Date(payment.date).toLocaleDateString("es-EC")}
                                              </td>
                                              <td
                                                className={`px-3 py-2 text-sm font-medium ${
                                                  isLight ? "text-[#0D1B2A]" : "text-white"
                                                }`}
                                              >
                                                {getPaymentMethodLabel(payment.paymentMethod)}
                                              </td>
                                              <td
                                                className={`px-3 py-2 text-sm font-mono ${
                                                  isLight ? "text-gray-700" : "text-gray-400"
                                                }`}
                                              >
                                                {payment.reference}
                                              </td>
                                              <td className="px-3 py-2 text-sm font-bold text-right text-green-600">
                                                ${payment.amount.toFixed(2)}
                                              </td>
                                              <td
                                                className={`px-3 py-2 text-sm ${
                                                  isLight ? "text-gray-600" : "text-gray-400"
                                                }`}
                                              >
                                                {payment.registeredBy}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ) : null;

                            return detailRow ? [mainRow, detailRow] : [mainRow];
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Registrar Pago (PROFESIONAL) ── */}
      {showRegisterPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className={`rounded-2xl max-w-4xl w-full shadow-2xl ${isLight ? "bg-white" : "bg-[#1a2936]"}`}>
            {/* Header con Ícono y Título */}
            <div
              className={`px-6 py-5 border-b ${
                isLight
                  ? "bg-gray-50 border-gray-200"
                  : "bg-[#0f1825] border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${isLight ? "bg-primary/10" : "bg-primary/20"}`}>
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                      Registrar Pago
                    </h3>
                    <p className={`text-sm mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Paso {currentStep} de 3: {
                        currentStep === 1 ? "Seleccionar Cuotas" :
                        currentStep === 2 ? "Método de Pago" :
                        "Confirmar y Pagar"
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowRegisterPaymentModal(false);
                    setCurrentStep(1);
                    setSelectedInstallments(new Set());
                    setActiveInstallmentsTab("pending");
                  }}
                  className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-200" : "hover:bg-white/10"}`}
                >
                  <X className={`w-5 h-5 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
                </button>
              </div>
            </div>

            {/* Indicador de Pasos */}
            <div className={`px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                {/* Paso 1 */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    currentStep > 1 
                      ? "bg-green-600 text-white"
                      : currentStep === 1
                      ? "bg-primary text-white"
                      : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-400"
                  }`}>
                    {currentStep > 1 ? "✓" : "1"}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    currentStep >= 1 
                      ? isLight ? "text-[#0D1B2A]" : "text-white"
                      : isLight ? "text-gray-500" : "text-gray-400"
                  }`}>
                    Seleccionar Cuotas
                  </span>
                </div>
                <div className={`h-px flex-1 mx-2 ${currentStep > 1 ? (isLight ? "bg-green-600" : "bg-green-500") : (isLight ? "bg-gray-300" : "bg-white/20")}`}></div>
                
                {/* Paso 2 */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    currentStep > 2 
                      ? "bg-green-600 text-white"
                      : currentStep === 2
                      ? "bg-primary text-white"
                      : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-400"
                  }`}>
                    {currentStep > 2 ? "✓" : "2"}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    currentStep >= 2 
                      ? isLight ? "text-[#0D1B2A]" : "text-white"
                      : isLight ? "text-gray-500" : "text-gray-400"
                  }`}>
                    Método de Pago
                  </span>
                </div>
                <div className={`h-px flex-1 mx-2 ${currentStep > 2 ? (isLight ? "bg-green-600" : "bg-green-500") : (isLight ? "bg-gray-300" : "bg-white/20")}`}></div>
                
                {/* Paso 3 */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                    currentStep === 3
                      ? "bg-primary text-white"
                      : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-400"
                  }`}>
                    3
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    currentStep >= 3 
                      ? isLight ? "text-[#0D1B2A]" : "text-white"
                      : isLight ? "text-gray-500" : "text-gray-400"
                  }`}>
                    Confirmar y Pagar
                  </span>
                </div>
              </div>
            </div>

            {/* Contenido Dinámico según Paso */}
            <div className="p-6 min-h-[400px]">
              {/* PASO 1: Seleccionar Cuotas - Tabla de Amortización */}
              {currentStep === 1 && (
                <>
                  {/* Header con Info de Factura */}
                  <div className="mb-4">
                    <h3 className={`text-base font-bold mb-1 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                      Tabla de Amortización
                    </h3>
                    <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {selectedInvoice.invoice.invoiceNumber} • {selectedInvoice.client.name}
                    </p>
                  </div>

                  {/* Resumen Superior - 3 columnas */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className={`p-3 rounded-lg ${isLight ? "bg-gray-50" : "bg-[#0f1825]"}`}>
                      <p className={`text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Tipo de Venta</p>
                      <p className={`text-sm font-bold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                        Crédito {selectedInvoice.invoice.paymentTermDays} días
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isLight ? "bg-gray-50" : "bg-[#0f1825]"}`}>
                      <p className={`text-xs mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>Total Factura</p>
                      <p className={`text-sm font-bold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                        ${selectedInvoice.invoice.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${isLight ? "bg-green-50" : "bg-green-900/20"}`}>
                      <p className={`text-xs mb-1 ${isLight ? "text-green-700" : "text-green-400"}`}>Total Pagado</p>
                      <p className="text-sm font-bold text-green-600">
                        ${selectedInvoice.invoice.paidAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Saldo Pendiente - Destacado */}
                  <div className={`p-3 rounded-lg mb-5 ${isLight ? "bg-red-50" : "bg-red-900/20"}`}>
                    <div className="flex justify-between items-center">
                      <p className={`text-xs font-medium ${isLight ? "text-red-700" : "text-red-400"}`}>
                        Saldo Pendiente
                      </p>
                      <p className="text-xl font-bold text-red-600">
                        ${selectedInvoice.invoice.pendingAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Plan de Pagos */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`text-sm font-bold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                        Plan de Pagos - {selectedInvoice.invoice.installments} cuotas mensuales
                      </h4>
                      <button
                        onClick={() => printReceipt(selectedInvoice.invoice)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isLight
                            ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                            : "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Imprimir Resumen
                      </button>
                    </div>

                    {/* Pestañas */}
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() => setActiveInstallmentsTab("pending")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                          activeInstallmentsTab === "pending"
                            ? "bg-primary text-white"
                            : isLight
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-white/10 text-gray-400 hover:bg-white/20"
                        }`}
                      >
                        Cuotas Pendientes ({selectedInvoice.invoice.amortization.filter((r) => r.status === "pending" || r.status === "partial" || r.status === "overdue").length})
                      </button>
                      <button
                        onClick={() => setActiveInstallmentsTab("paid")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                          activeInstallmentsTab === "paid"
                            ? "bg-primary text-white"
                            : isLight
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-white/10 text-gray-400 hover:bg-white/20"
                        }`}
                      >
                        Cuotas Pagadas ({selectedInvoice.invoice.amortization.filter((r) => r.status === "paid").length})
                      </button>
                    </div>
                  </div>

                  {/* Tabla de Cuotas - INICIO */}
                  <div className={`rounded-lg border overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <table className="w-full text-xs">
                      <thead className={isLight ? "bg-gray-100" : "bg-[#0f1825]"}>
                        <tr>
                          <th className={`px-3 py-2 text-left text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            <input
                              type="checkbox"
                              checked={selectedInvoice.invoice.amortization
                                .filter((r) => activeInstallmentsTab === "pending" ? r.status !== "paid" : r.status === "paid")
                                .filter((r) => r.status !== "paid")
                                .every((r) => selectedInstallments.has(r.id))}
                              onChange={(e) => {
                                const pendingRows = selectedInvoice.invoice.amortization.filter((r) => r.status !== "paid");
                                if (e.target.checked) {
                                  setSelectedInstallments(new Set(pendingRows.map((r) => r.id)));
                                } else {
                                  setSelectedInstallments(new Set());
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                          </th>
                          <th className={`px-3 py-2 text-left text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>Cuota</th>
                          <th className={`px-3 py-2 text-left text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>Vencimiento</th>
                          <th className={`px-3 py-2 text-right text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>Monto</th>
                          <th className={`px-3 py-2 text-right text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>Pagado</th>
                          <th className={`px-3 py-2 text-right text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>Saldo</th>
                          <th className={`px-3 py-2 text-center text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>Estado</th>
                          <th className={`px-3 py-2 text-center text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody className={isLight ? "bg-white" : "bg-[#1a2936]"}>
                        {selectedInvoice.invoice.amortization
                          .filter((row) =>
                            activeInstallmentsTab === "pending"
                              ? row.status === "pending" || row.status === "partial" || row.status === "overdue"
                              : row.status === "paid"
                          )
                          .map((row) => (
                            <tr
                              key={row.id}
                              className={`border-t ${
                                selectedInstallments.has(row.id)
                                  ? `border-l-4 border-l-primary ${isLight ? "bg-primary/5 border-gray-200" : "bg-primary/10 border-white/10"}`
                                  : isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                              }`}
                            >
                              <td className="px-3 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedInstallments.has(row.id)}
                                  disabled={row.status === "paid"}
                                  onChange={(e) => {
                                    const newSet = new Set(selectedInstallments);
                                    if (e.target.checked) {
                                      newSet.add(row.id);
                                    } else {
                                      newSet.delete(row.id);
                                    }
                                    setSelectedInstallments(newSet);
                                  }}
                                  className="w-4 h-4 rounded border-gray-300"
                                />
                              </td>
                              <td className={`px-3 py-3 font-medium ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                                Cuota {row.installmentNumber}
                              </td>
                              <td className={`px-3 py-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                <div>
                                  {new Date(row.dueDate).toLocaleDateString("es-EC", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                </div>
                                {row.status === "overdue" && (
                                  <div className="text-xs text-red-600 font-medium">Este mes</div>
                                )}
                              </td>
                              <td className={`px-3 py-3 text-right font-semibold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                                ${row.scheduledAmount.toFixed(2)}
                              </td>
                              <td className="px-3 py-3 text-right font-semibold text-green-600">
                                ${row.paidAmount.toFixed(2)}
                              </td>
                              <td className="px-3 py-3 text-right font-bold text-red-600">
                                ${row.pendingAmount.toFixed(2)}
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase ${
                                    row.status === "paid"
                                      ? isLight ? "bg-green-100 text-green-700" : "bg-green-900/30 text-green-400"
                                      : row.status === "overdue"
                                      ? isLight ? "bg-red-100 text-red-700" : "bg-red-900/30 text-red-400"
                                      : isLight ? "bg-orange-100 text-orange-700" : "bg-orange-900/30 text-orange-400"
                                  }`}
                                >
                                  {row.status === "paid" ? "Pagado" : row.status === "overdue" ? "Vencido" : "Pendiente"}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center">
                                <button
                                  disabled={row.status === "paid"}
                                  onClick={() => {
                                    if (row.status !== "paid") {
                                      const newSet = new Set(selectedInstallments);
                                      newSet.add(row.id);
                                      setSelectedInstallments(newSet);
                                      setCurrentStep(2);
                                    }
                                  }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                    row.status === "paid"
                                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                      : "bg-primary text-white hover:bg-primary/90"
                                  }`}
                                >
                                  <DollarSign className="w-3.5 h-3.5" />
                                  Pagar
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* PASO 2: Método de Pago */}
              {currentStep === 2 && (
                <>
                  {/* Resumen del Cliente y Factura */}
                  <div className={`mb-6 p-4 rounded-xl border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f1825] border-white/10"}`}>
                    <h4 className={`text-sm font-bold mb-3 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                      Información de la Transacción
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cliente</p>
                        <p className={`text-sm font-medium mt-0.5 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                          {selectedInvoice.client.name}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Factura</p>
                        <p className={`text-sm font-medium mt-0.5 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                          {selectedInvoice.invoice.invoiceNumber}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cuotas Seleccionadas</p>
                        <p className={`text-sm font-medium mt-0.5 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                          {selectedInstallments.size} cuota(s)
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Saldo Pendiente Total</p>
                        <p className="text-lg font-bold mt-0.5 text-red-600">
                          ${selectedInvoice.invoice.amortization
                            .filter((row) => selectedInstallments.has(row.id))
                            .reduce((sum, row) => sum + row.pendingAmount, 0)
                            .toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de Pago */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                    Monto a Pagar *
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      placeholder="0.00"
                      className={`w-full pl-7 pr-3 py-2 rounded-lg text-sm border transition-colors ${
                        isLight
                          ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                    Método de Pago *
                  </label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentMethod: e.target.value as PaymentDetail["paymentMethod"],
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        : "bg-[#0f1825] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  >
                    <option value="cash">Efectivo</option>
                    <option value="transfer">Transferencia</option>
                    <option value="check">Cheque</option>
                    <option value="card">Tarjeta</option>
                    <option value="deposit">Depósito</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                    Fecha de Pago *
                  </label>
                  <input
                    type="date"
                    value={paymentForm.date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors ${
                      isLight
                        ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        : "bg-[#0f1825] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>

                    <div className="col-span-3">
                      <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                        Referencia / Número de Comprobante
                      </label>
                      <input
                        type="text"
                        value={paymentForm.reference}
                        onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                        placeholder="Ej: CHQ-123456, TRANS-789012"
                        className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors ${
                          isLight
                            ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                    </div>

                    <div className="col-span-3">
                      <label className={`block text-sm font-medium mb-1.5 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                        Notas Adicionales
                      </label>
                      <textarea
                        value={paymentForm.notes}
                        onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                        placeholder="Observaciones o notas sobre el pago..."
                        rows={2}
                        className={`w-full px-3 py-2 rounded-lg text-sm border transition-colors resize-none ${
                          isLight
                            ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Botón de Pago Rápido Total */}
                  <button
                    onClick={() => {
                      const totalPending = selectedInvoice.invoice.amortization
                        .filter((row) => selectedInstallments.has(row.id))
                        .reduce((sum, row) => sum + row.pendingAmount, 0);
                      setPaymentForm({ ...paymentForm, amount: totalPending.toFixed(2) });
                    }}
                    className="w-full mb-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all"
                  >
                    Pago Total Rápido - $
                    {selectedInvoice.invoice.amortization
                      .filter((row) => selectedInstallments.has(row.id))
                      .reduce((sum, row) => sum + row.pendingAmount, 0)
                      .toFixed(2)}
                  </button>
                </>
              )}

              {/* PASO 3: Verificar Datos */}
              {currentStep === 3 && (() => {
                const totalPendingAmount = selectedInvoice.invoice.amortization
                  .filter((row) => selectedInstallments.has(row.id))
                  .reduce((sum, row) => sum + row.pendingAmount, 0);
                const paymentAmount = parseFloat(paymentForm.amount || "0");
                const changeAmount = Math.max(0, paymentAmount - totalPendingAmount);
                const effectivePayment = Math.min(paymentAmount, totalPendingAmount);
                const remainingBalance = Math.max(0, totalPendingAmount - paymentAmount);

                return (
                <>
                  <div className={`mb-4 p-5 rounded-xl border ${isLight ? "bg-white border-gray-200" : "bg-[#0f1825] border-white/10"}`}>
                    <h4 className={`text-sm font-semibold mb-4 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                      Resumen de Pago
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Cliente</p>
                        <p className={`text-sm font-medium mt-1 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                          {selectedInvoice.client.name}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Factura</p>
                        <p className={`text-sm font-medium mt-1 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                          {selectedInvoice.invoice.invoiceNumber}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Monto Recibido</p>
                        <p className={`text-sm font-semibold mt-1 text-green-600`}>
                          ${paymentAmount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Método</p>
                        <p className={`text-sm font-medium mt-1 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                          {getPaymentMethodLabel(paymentForm.paymentMethod)}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Fecha</p>
                        <p className={`text-sm font-medium mt-1 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                          {new Date(paymentForm.date).toLocaleDateString("es-EC")}
                        </p>
                      </div>
                      {paymentForm.reference && (
                        <div>
                          <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Referencia</p>
                          <p className={`text-sm font-medium mt-1 ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                            {paymentForm.reference}
                          </p>
                        </div>
                      )}
                    </div>

                    {paymentForm.notes && (
                      <div className="mb-4">
                        <p className={`text-xs mb-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>Notas</p>
                        <p className={`text-sm p-2 rounded ${isLight ? "bg-gray-50 text-[#0D1B2A]" : "bg-[#0D1B2A] text-gray-300"}`}>
                          {paymentForm.notes}
                        </p>
                      </div>
                    )}

                    <div className={`pt-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <h5 className={`text-xs font-semibold mb-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        CUOTAS SELECCIONADAS ({selectedInstallments.size})
                      </h5>
                      <div className="space-y-1.5">
                        {selectedInvoice.invoice.amortization
                          .filter((row) => selectedInstallments.has(row.id))
                          .map((row) => (
                            <div
                              key={row.id}
                              className={`flex justify-between items-center px-3 py-2 rounded ${
                                isLight ? "bg-gray-50" : "bg-[#0D1B2A]"
                              }`}
                            >
                              <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                                Cuota #{row.installmentNumber} - Vence {new Date(row.dueDate).toLocaleDateString("es-EC")}
                              </span>
                              <span className="text-xs font-semibold text-red-600">
                                ${row.pendingAmount.toFixed(2)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Sección de Cálculos */}
                    <div className={`mt-5 pt-4 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Total a Pagar
                          </span>
                          <span className={`text-sm font-bold ${isLight ? "text-[#0D1B2A]" : "text-white"}`}>
                            ${totalPendingAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Pago Efectivo
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            ${effectivePayment.toFixed(2)}
                          </span>
                        </div>
                        {remainingBalance > 0 && (
                          <div className={`flex justify-between items-center p-3 rounded-lg ${isLight ? "bg-orange-50" : "bg-orange-900/20"}`}>
                            <span className={`text-sm font-semibold ${isLight ? "text-orange-700" : "text-orange-400"}`}>
                              Saldo Pendiente
                            </span>
                            <span className="text-base font-bold text-orange-600">
                              ${remainingBalance.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {changeAmount > 0 && (
                          <div className={`flex justify-between items-center p-3 rounded-lg ${isLight ? "bg-blue-50" : "bg-blue-900/20"}`}>
                            <span className={`text-sm font-semibold ${isLight ? "text-blue-700" : "text-blue-400"}`}>
                              Cambio a Devolver
                            </span>
                            <span className="text-base font-bold text-blue-600">
                              ${changeAmount.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
                );
              })()}


            </div>

            {/* Footer con Botones de Navegación */}
            <div className={`flex gap-3 px-6 py-4 border-t ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0f1825] border-white/10"}`}>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isLight ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Atrás
                </button>
              )}
              
              {currentStep === 1 && (
                <button
                  onClick={() => {
                    setShowRegisterPaymentModal(false);
                    setCurrentStep(1);
                    setSelectedInstallments(new Set());
                    setActiveInstallmentsTab("pending");
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isLight ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100" : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              )}

              {currentStep < 3 && (
                <button
                  onClick={() => {
                    if (currentStep === 1 && selectedInstallments.size === 0) {
                      alert("Por favor seleccione al menos una cuota para pagar");
                      return;
                    }
                    if (currentStep === 2 && !paymentForm.amount) {
                      alert("Por favor ingrese el monto a pagar");
                      return;
                    }
                    setCurrentStep(currentStep + 1);
                  }}
                  disabled={currentStep === 1 && selectedInstallments.size === 0}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    currentStep === 1 && selectedInstallments.size === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 3 && (
                <button
                  onClick={() => {
                    // Procesar el pago
                    handleQuickPayment(false);
                    
                    // Obtener datos para el recibo
                    const installmentsArray = selectedInvoice.invoice.amortization.filter((row) =>
                      selectedInstallments.has(row.id)
                    );
                    const totalPending = installmentsArray.reduce((sum, row) => sum + row.pendingAmount, 0);
                    const amount = parseFloat(paymentForm.amount);
                    
                    // Imprimir recibo POS
                    generatePaymentReceipt(
                      selectedInvoice.client,
                      selectedInvoice.invoice,
                      installmentsArray,
                      amount,
                      totalPending
                    );
                    
                    // Resetear formulario y cerrar modal
                    setPaymentForm({
                      amount: "",
                      paymentMethod: "cash",
                      reference: "",
                      date: new Date().toISOString().split("T")[0],
                      notes: "",
                    });
                    setShowRegisterPaymentModal(false);
                    setCurrentStep(1);
                    setSelectedInstallments(new Set());
                    setActiveInstallmentsTab("pending");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all"
                >
                  <Receipt className="w-4 h-4" />
                  Confirmar y Pagar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
