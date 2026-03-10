import { useState, useEffect, useRef } from "react";
import { X, Search, Plus, Minus, CheckCircle2, User, ShoppingCart, FileText, CreditCard, Calendar, DollarSign, TrendingUp, Send, Shield, FileCheck, FileSignature, Mail, MapPin, Phone, Edit2, Check, UserPlus, Camera, AlertTriangle, Receipt, Info, Printer } from "lucide-react";
import { 
  PRODUCTS_CATALOG, 
  CUSTOMERS, 
  PAYMENT_METHODS,
  type Product,
  type Customer
} from "../data/test-data";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: any) => void;
  isLight: boolean;
}

interface InvoiceItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

interface PaymentSchedule {
  cuota: number;
  fechaVencimiento: string;
  capital: number;
  interes: number;
  totalCuota: number;
  saldo: number;
}

export function CreateInvoiceModal({ isOpen, onClose, onSave, isLight }: CreateInvoiceModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Campos para nuevo cliente
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerRuc, setNewCustomerRuc] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  
  // Campos editables del cliente seleccionado
  const [editEmail, setEditEmail] = useState("");
  const [editAddress, setEditAddress] = useState("");
  
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  
  // Estado para modal de info del producto
  const [selectedProductInfo, setSelectedProductInfo] = useState<Product | null>(null);
  
  // Campos de pago
  const [paymentReference, setPaymentReference] = useState(""); // Número de comprobante/transacción
  
  // Campos de crédito
  const [creditMonths, setCreditMonths] = useState(3);
  const [interestRate, setInterestRate] = useState(2.5);
  const [firstPaymentDate, setFirstPaymentDate] = useState("");
  const [downPayment, setDownPayment] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<PaymentSchedule[]>([]);

  // Estados del proceso SRI
  const [sriStep, setSriStep] = useState(1); // 1: XML, 2: Validación, 3: Firma, 4: Envío, 5: Autorización
  const [invoiceNumber, setInvoiceNumber] = useState("");

  // Calcular totales
  const calculateTotal = () => {
    let subtotal0 = 0;
    let subtotal12 = 0;

    items.forEach((item) => {
      const itemSubtotal = item.price * item.quantity - item.discount;
      if (item.tax === 12) {
        subtotal12 += itemSubtotal;
      } else {
        subtotal0 += itemSubtotal;
      }
    });

    const tax = subtotal12 * 0.12;
    const total = subtotal0 + subtotal12 + tax;

    return {
      subtotal0,
      subtotal12,
      subtotal: subtotal0 + subtotal12,
      totalDiscount: items.reduce((sum, item) => sum + item.discount, 0),
      tax,
      total,
    };
  };

  const totals = calculateTotal();

  // Función para imprimir comprobante de pago inicial
  const printDownPaymentReceipt = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const currentDate = new Date();
    const receiptNumber = `REC-${String(Math.floor(Math.random() * 100000)).padStart(6, "0")}`;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Comprobante de Pago Inicial - ${receiptNumber}</title>
        <style>
          @media print {
            @page { margin: 1cm; }
            body { margin: 0; }
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px;
            color: #0D1B2A;
          }
          .header {
            border-bottom: 4px solid #E8692E;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #E8692E;
            margin-bottom: 5px;
          }
          .company-info {
            font-size: 11px;
            color: #666;
            line-height: 1.5;
          }
          .receipt-title {
            text-align: center;
            background: #0D1B2A;
            color: white;
            padding: 12px;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            border-radius: 6px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
          }
          .info-box {
            border: 1px solid #ddd;
            padding: 12px;
            border-radius: 6px;
            background: #f9f9f9;
          }
          .info-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 4px;
            font-weight: 600;
          }
          .info-value {
            font-size: 13px;
            color: #0D1B2A;
            font-weight: bold;
          }
          .payment-section {
            background: #FFF5F0;
            border: 2px solid #E8692E;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .payment-title {
            font-size: 14px;
            color: #E8692E;
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .amount-display {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 6px;
            margin-bottom: 15px;
          }
          .amount-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 8px;
          }
          .amount-value {
            font-size: 36px;
            color: #E8692E;
            font-weight: bold;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            font-size: 13px;
          }
          .detail-label { color: #666; }
          .detail-value { font-weight: bold; color: #0D1B2A; }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            text-align: center;
          }
          .signature-line {
            margin-top: 50px;
            border-top: 2px solid #0D1B2A;
            width: 300px;
            margin-left: auto;
            margin-right: auto;
            padding-top: 10px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .print-info {
            margin-top: 20px;
            text-align: center;
            font-size: 10px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">TicSoftEc S.A.</div>
          <div class="company-info">
            RUC: 1790123456001<br>
            Av. Amazonas N35-17 y Japón, Quito - Ecuador<br>
            Tel: 02-2345-678 | Email: facturacion@ticsoftec.com
          </div>
        </div>

        <div class="receipt-title">
          COMPROBANTE DE PAGO INICIAL
        </div>

        <div class="info-grid">
          <div class="info-box">
            <div class="info-label">Nº Comprobante</div>
            <div class="info-value">${receiptNumber}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Fecha</div>
            <div class="info-value">${currentDate.toLocaleDateString("es-EC", { 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Hora</div>
            <div class="info-value">${currentDate.toLocaleTimeString("es-EC", { 
              hour: "2-digit", 
              minute: "2-digit" 
            })}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Factura Relacionada</div>
            <div class="info-value">${invoiceNumber}</div>
          </div>
        </div>

        <div class="info-box" style="margin-bottom: 20px;">
          <div class="info-label">Cliente</div>
          <div class="info-value">${selectedCustomer?.name}</div>
          <div style="font-size: 11px; color: #666; margin-top: 4px;">
            RUC/CI: ${selectedCustomer?.ruc}
          </div>
        </div>

        <div class="payment-section">
          <div class="payment-title">Detalle del Pago Inicial</div>
          
          <div class="amount-display">
            <div class="amount-label">MONTO PAGADO</div>
            <div class="amount-value">$${downPayment.toFixed(2)}</div>
          </div>

          <div class="detail-row">
            <span class="detail-label">Total de la Factura:</span>
            <span class="detail-value">$${totals.total.toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Abono Inicial:</span>
            <span class="detail-value">$${downPayment.toFixed(2)}</span>
          </div>
          <div class="detail-row" style="border-bottom: 2px solid #E8692E; padding-bottom: 12px; margin-bottom: 12px;">
            <span class="detail-label">Saldo a Financiar:</span>
            <span class="detail-value">$${(totals.total - downPayment).toFixed(2)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Plazo:</span>
            <span class="detail-value">${creditMonths} meses</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tasa de Interés:</span>
            <span class="detail-value">${interestRate}% mensual</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Forma de Pago:</span>
            <span class="detail-value">${PAYMENT_METHODS.find(m => m.code === paymentMethod)?.name || "Efectivo"}</span>
          </div>
        </div>

        <div class="footer">
          <div class="signature-line">
            Firma del Cliente
          </div>
          <div class="print-info">
            Documento generado electrónicamente por TicSoftEc<br>
            Fecha de impresión: ${currentDate.toLocaleString("es-EC")}
          </div>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Función para imprimir tabla de amortización
  const printAmortizationSchedule = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const currentDate = new Date();
    const totalInterest = amortizationSchedule.reduce((sum, p) => sum + p.interes, 0);
    const totalPayments = amortizationSchedule.reduce((sum, p) => sum + p.totalCuota, 0);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tabla de Amortización - ${invoiceNumber}</title>
        <style>
          @media print {
            @page { margin: 1cm; size: landscape; }
            body { margin: 0; }
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px;
            color: #0D1B2A;
          }
          .header {
            border-bottom: 4px solid #E8692E;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #E8692E;
            margin-bottom: 5px;
          }
          .company-info {
            font-size: 11px;
            color: #666;
            line-height: 1.5;
          }
          .document-title {
            text-align: center;
            background: #0D1B2A;
            color: white;
            padding: 12px;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
            border-radius: 6px;
          }
          .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
          }
          .info-card {
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 6px;
            background: #f9f9f9;
          }
          .info-card h3 {
            font-size: 12px;
            color: #E8692E;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-weight: bold;
          }
          .info-line {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 12px;
          }
          .info-label { color: #666; }
          .info-value { font-weight: bold; color: #0D1B2A; }
          .summary-boxes {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 25px;
          }
          .summary-box {
            text-align: center;
            padding: 15px;
            border-radius: 6px;
            border: 2px solid #E8692E;
            background: #FFF5F0;
          }
          .summary-label {
            font-size: 11px;
            color: #666;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          .summary-value {
            font-size: 20px;
            font-weight: bold;
            color: #E8692E;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }
          thead {
            background: #0D1B2A;
            color: white;
          }
          th {
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
          }
          th.text-right, td.text-right {
            text-align: right;
          }
          th.text-center, td.text-center {
            text-align: center;
          }
          tbody tr {
            border-bottom: 1px solid #eee;
          }
          tbody tr:nth-child(even) {
            background: #f9f9f9;
          }
          tbody tr:hover {
            background: #FFF5F0;
          }
          td {
            padding: 10px 8px;
            color: #0D1B2A;
          }
          tfoot {
            background: #0D1B2A;
            color: white;
            font-weight: bold;
          }
          tfoot td {
            padding: 12px 8px;
            color: white;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #999;
          }
          .notes {
            background: #FFF5F0;
            border-left: 4px solid #E8692E;
            padding: 15px;
            margin-top: 20px;
            font-size: 11px;
            color: #666;
          }
          .notes strong {
            color: #0D1B2A;
            display: block;
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">TicSoftEc S.A.</div>
          <div class="company-info">
            RUC: 1790123456001<br>
            Av. Amazonas N35-17 y Japón, Quito - Ecuador<br>
            Tel: 02-2345-678 | Email: facturacion@ticsoftec.com
          </div>
        </div>

        <div class="document-title">
          TABLA DE AMORTIZACIÓN
        </div>

        <div class="info-section">
          <div class="info-card">
            <h3>Información del Cliente</h3>
            <div class="info-line">
              <span class="info-label">Nombre:</span>
              <span class="info-value">${selectedCustomer?.name}</span>
            </div>
            <div class="info-line">
              <span class="info-label">RUC/CI:</span>
              <span class="info-value">${selectedCustomer?.ruc}</span>
            </div>
            <div class="info-line">
              <span class="info-label">Factura:</span>
              <span class="info-value">${invoiceNumber}</span>
            </div>
          </div>

          <div class="info-card">
            <h3>Información del Crédito</h3>
            <div class="info-line">
              <span class="info-label">Total Factura:</span>
              <span class="info-value">$${totals.total.toFixed(2)}</span>
            </div>
            ${downPayment > 0 ? `
            <div class="info-line">
              <span class="info-label">Abono Inicial:</span>
              <span class="info-value">$${downPayment.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="info-line">
              <span class="info-label">Monto a Financiar:</span>
              <span class="info-value">$${(totals.total - downPayment).toFixed(2)}</span>
            </div>
            <div class="info-line">
              <span class="info-label">Tasa de Interés:</span>
              <span class="info-value">${interestRate}% mensual</span>
            </div>
          </div>
        </div>

        <div class="summary-boxes">
          <div class="summary-box">
            <div class="summary-label">Nº Cuotas</div>
            <div class="summary-value">${creditMonths}</div>
          </div>
          <div class="summary-box">
            <div class="summary-label">Cuota Mensual</div>
            <div class="summary-value">$${amortizationSchedule[0]?.totalCuota.toFixed(2) || '0.00'}</div>
          </div>
          <div class="summary-box">
            <div class="summary-label">Total Intereses</div>
            <div class="summary-value">$${totalInterest.toFixed(2)}</div>
          </div>
          <div class="summary-box">
            <div class="summary-label">Total a Pagar</div>
            <div class="summary-value">$${totalPayments.toFixed(2)}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="text-center">#</th>
              <th>Fecha Vencimiento</th>
              <th class="text-right">Capital</th>
              <th class="text-right">Interés</th>
              <th class="text-right">Cuota Total</th>
              <th class="text-right">Saldo</th>
            </tr>
          </thead>
          <tbody>
            ${amortizationSchedule.map(payment => `
              <tr>
                <td class="text-center">${payment.cuota}</td>
                <td>${payment.fechaVencimiento}</td>
                <td class="text-right">$${payment.capital.toFixed(2)}</td>
                <td class="text-right">$${payment.interes.toFixed(2)}</td>
                <td class="text-right"><strong>$${payment.totalCuota.toFixed(2)}</strong></td>
                <td class="text-right">$${payment.saldo.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" class="text-right">TOTALES:</td>
              <td class="text-right">$${amortizationSchedule.reduce((sum, p) => sum + p.capital, 0).toFixed(2)}</td>
              <td class="text-right">$${totalInterest.toFixed(2)}</td>
              <td class="text-right">$${totalPayments.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <div class="notes">
          <strong>NOTAS IMPORTANTES:</strong>
          • Las cuotas deben pagarse en las fechas indicadas para evitar intereses moratorios.<br>
          • Este cronograma puede variar si se realizan pagos anticipados o adicionales.<br>
          • Para más información, contactar al departamento de crédito y cobranzas.
        </div>

        <div class="footer">
          Documento generado electrónicamente por TicSoftEc<br>
          Fecha de impresión: ${currentDate.toLocaleString("es-EC")}
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedCustomer(null);
      setSearchCustomer("");
      setShowCustomerDropdown(false);
      setShowNewCustomerForm(false);
      setIsEditingCustomer(false);
      setNewCustomerName("");
      setNewCustomerRuc("");
      setNewCustomerEmail("");
      setNewCustomerPhone("");
      setNewCustomerAddress("");
      setEditEmail("");
      setEditAddress("");
      setItems([]);
      setSearchProduct("");
      setPaymentMethod("cash");
      setPaymentReference("");
      setNotes("");
      setCreditMonths(3);
      setInterestRate(2.5);
      setFirstPaymentDate("");
      setDownPayment(0);
      setAmortizationSchedule([]);
      setSriStep(1);
      setInvoiceNumber("");
      setSelectedProductInfo(null);
    }
  }, [isOpen]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Actualizar campos editables cuando se selecciona un cliente
  useEffect(() => {
    if (selectedCustomer) {
      setEditEmail(selectedCustomer.email);
      setEditAddress(selectedCustomer.address);
    }
  }, [selectedCustomer]);

  // Calcular fecha por defecto para primera cuota (30 días desde hoy)
  useEffect(() => {
    if (paymentMethod === "credit" && !firstPaymentDate) {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setFirstPaymentDate(date.toISOString().split("T")[0]);
    }
  }, [paymentMethod, firstPaymentDate]);

  // Filtrar clientes
  const filteredCustomers = CUSTOMERS.filter((c) => {
    const searchLower = searchCustomer.toLowerCase();
    return (
      c.name.toLowerCase().includes(searchLower) ||
      c.ruc.includes(searchCustomer) ||
      c.email.toLowerCase().includes(searchLower)
    );
  });

  // Seleccionar cliente del dropdown
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchCustomer("");
    setShowCustomerDropdown(false);
    setShowNewCustomerForm(false);
  };

  // Crear nuevo cliente
  const handleCreateNewCustomer = () => {
    if (!newCustomerName || !newCustomerRuc) {
      return;
    }

    const newCustomer: Customer = {
      name: newCustomerName,
      ruc: newCustomerRuc,
      email: newCustomerEmail,
      phone: newCustomerPhone,
      address: newCustomerAddress,
      photo: "",
      debt: 0,
      totalPurchases: 0,
      lastPurchaseDate: ""
    };

    setSelectedCustomer(newCustomer);
    setShowNewCustomerForm(false);
    setSearchCustomer("");
    setShowCustomerDropdown(false);
    
    // Limpiar formulario
    setNewCustomerName("");
    setNewCustomerRuc("");
    setNewCustomerEmail("");
    setNewCustomerPhone("");
    setNewCustomerAddress("");
  };

  // Guardar edición de cliente
  const handleSaveCustomerEdit = () => {
    if (selectedCustomer) {
      setSelectedCustomer({
        ...selectedCustomer,
        email: editEmail,
        address: editAddress
      });
      setIsEditingCustomer(false);
    }
  };

  // Deseleccionar cliente
  const handleDeselectCustomer = () => {
    setSelectedCustomer(null);
    setSearchCustomer("");
    setIsEditingCustomer(false);
  };

  // Filtrar productos
  const filteredProducts = PRODUCTS_CATALOG.filter((p) => {
    const searchLower = searchProduct.toLowerCase();
    return (
      p.code.toLowerCase().includes(searchLower) ||
      p.name.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower)
    );
  });

  // Agregar producto
  const addProduct = (product: Product) => {
    const existingIndex = items.findIndex((item) => item.code === product.code);

    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      newItems[existingIndex].total =
        newItems[existingIndex].quantity * newItems[existingIndex].price -
        newItems[existingIndex].discount;
      setItems(newItems);
    } else {
      const newItem: InvoiceItem = {
        code: product.code,
        name: product.name,
        quantity: 1,
        price: product.price,
        discount: 0,
        tax: product.tax,
        total: product.price,
      };
      setItems([...items, newItem]);
    }
    setSearchProduct("");
  };

  // Actualizar cantidad
  const handleItemQuantityChange = (itemCode: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems(items.filter((i) => i.code !== itemCode));
      return;
    }

    const newItems = items.map((item) => {
      if (item.code === itemCode) {
        const total = item.price * newQuantity - item.discount;
        return { ...item, quantity: newQuantity, total };
      }
      return item;
    });
    setItems(newItems);
  };

  // Generar tabla de amortización
  const generateAmortizationSchedule = () => {
    const schedule: PaymentSchedule[] = [];
    const total = totals.total - downPayment;
    const monthlyRate = interestRate / 100;
    const numPayments = creditMonths;
    
    // Calcular cuota fija usando fórmula de anualidad
    const monthlyPayment = total * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    let balance = total;
    const startDate = new Date(firstPaymentDate);

    for (let i = 1; i <= numPayments; i++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance = balance - principal;

      // Calcular fecha de vencimiento
      const dueDate = new Date(startDate);
      dueDate.setMonth(startDate.getMonth() + (i - 1));

      schedule.push({
        cuota: i,
        fechaVencimiento: dueDate.toISOString().split("T")[0],
        capital: principal,
        interes: interest,
        totalCuota: monthlyPayment,
        saldo: Math.max(0, balance), // Evitar negativos por redondeo
      });
    }

    setAmortizationSchedule(schedule);
  };

  // Generar tabla cuando cambien los parámetros
  useEffect(() => {
    if (paymentMethod === "credit" && firstPaymentDate && creditMonths > 0) {
      const total = totals.total;
      if (total > 0) {
        generateAmortizationSchedule();
      }
    } else if (paymentMethod !== "credit") {
      setAmortizationSchedule([]);
    }
  }, [paymentMethod, firstPaymentDate, creditMonths, interestRate, downPayment, items]);

  const handleSave = () => {
    if (!selectedCustomer || items.length === 0) {
      return;
    }

    const newInvoice = {
      invoiceNumber: `001-001-${String(Math.floor(Math.random() * 10000)).padStart(6, "0")}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }),
      customer: {
        name: selectedCustomer.name,
        ruc: selectedCustomer.ruc,
        address: selectedCustomer.address,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
      },
      items: items.map((item) => ({
        code: item.code,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        tax: item.tax,
        total: item.total,
      })),
      subtotal: totals.subtotal,
      totalDiscount: totals.totalDiscount,
      subtotal12: totals.subtotal12,
      subtotal0: totals.subtotal0,
      tax: totals.tax,
      total: totals.total,
      paymentMethod,
      notes,
      // Datos de crédito si aplica
      ...(paymentMethod === "credit" && {
        creditInfo: {
          months: creditMonths,
          interestRate: interestRate,
          firstPaymentDate: firstPaymentDate,
          downPayment: downPayment,
          amortizationSchedule: amortizationSchedule,
        }
      }),
      status: "pending" as const,
      seller: "Usuario Actual",
      branch: "Sucursal Centro",
      sriStatus: "pending" as const,
      emisor_razon: "TicSoftEc S.A.",
      emisor_dir: "Av. Amazonas N35-17 y Japón, Quito - Ecuador",
      emisor_ruc: "1790123456001",
      emisor_telefono: "02-2345-678",
      emisor_email: "facturacion@ticsoftec.com",
      ambiente: "Pruebas",
    };

    onSave(newInvoice);
    // Cerrar el modal automáticamente después de guardar
    onClose();
  };

  const canGoToStep2 = selectedCustomer !== null;
  const canGoToStep3 = items.length > 0;
  const canGoToStep4 = paymentMethod !== "" && 
    (paymentMethod !== "credit" || (creditMonths > 0 && firstPaymentDate !== "")) &&
    (paymentMethod === "cash" || paymentMethod === "credit" || paymentReference !== "");
  const canSave = items.length > 0;

  // Determinar número total de pasos (ahora 5 pasos: Cliente, Productos, Pago, Revisión, Autorización SRI)
  const totalSteps = 5;

  // Simular progreso del SRI cuando estamos en paso 5
  useEffect(() => {
    if (step === 5 && sriStep < 5) {
      const timer = setTimeout(() => {
        setSriStep((prev) => prev + 1);
      }, 1500); // Avanza cada 1.5 segundos

      return () => clearTimeout(timer);
    }
  }, [step, sriStep]);

  // Generar número de factura cuando llegamos al paso 5
  useEffect(() => {
    if (step === 5 && !invoiceNumber) {
      const newInvoiceNumber = `004-001-${String(Math.floor(Math.random() * 10000)).padStart(6, "0")}`;
      setInvoiceNumber(newInvoiceNumber);
    }
  }, [step, invoiceNumber]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden ${isLight ? "bg-white" : "bg-[#0d1724]"}`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isLight ? "bg-gray-50/50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isLight ? "bg-blue-100" : "bg-blue-500/20"}`}>
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Nueva Factura
                </h2>
                <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Paso {step} de {totalSteps}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-200 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className={`px-6 py-4 border-b ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d1724]"}`}>
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Step 1 */}
            <div key="step-1" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 1 ? "bg-primary text-white" : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-500"
              }`}>
                {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
              </div>
              <span className={`text-xs font-medium ${step >= 1 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")}`}>
                Cliente
              </span>
            </div>

            <div key="line-1" className={`flex-1 h-0.5 mx-2 ${step > 1 ? "bg-primary" : (isLight ? "bg-gray-200" : "bg-white/10")}`} />

            {/* Step 2 */}
            <div key="step-2" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 2 ? "bg-primary text-white" : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-500"
              }`}>
                {step > 2 ? <CheckCircle2 className="w-4 h-4" /> : "2"}
              </div>
              <span className={`text-xs font-medium ${step >= 2 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")}`}>
                Productos
              </span>
            </div>

            <div key="line-2" className={`flex-1 h-0.5 mx-2 ${step > 2 ? "bg-primary" : (isLight ? "bg-gray-200" : "bg-white/10")}`} />

            {/* Step 3 */}
            <div key="step-3" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 3 ? "bg-primary text-white" : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-500"
              }`}>
                {step > 3 ? <CheckCircle2 className="w-4 h-4" /> : "3"}
              </div>
              <span className={`text-xs font-medium ${step >= 3 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")}`}>
                Pago
              </span>
            </div>

            <div key="line-3" className={`flex-1 h-0.5 mx-2 ${step > 3 ? "bg-primary" : (isLight ? "bg-gray-200" : "bg-white/10")}`} />

            {/* Step Final */}
            <div key="step-4" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 4 ? "bg-primary text-white" : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-500"
              }`}>
                4
              </div>
              <span className={`text-xs font-medium ${step >= 4 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")}`}>
                Revisión
              </span>
            </div>

            <div key="line-4" className={`flex-1 h-0.5 mx-2 ${step > 4 ? "bg-primary" : (isLight ? "bg-gray-200" : "bg-white/10")}`} />

            {/* Step SRI */}
            <div key="step-5" className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 5 ? "bg-primary text-white" : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-500"
              }`}>
                5
              </div>
              <span className={`text-xs font-medium ${step >= 5 ? (isLight ? "text-gray-900" : "text-white") : (isLight ? "text-gray-400" : "text-gray-500")}`}>
                SRI
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 min-h-[500px] max-h-[550px] overflow-y-auto">
          
          {/* STEP 1: Seleccionar Cliente */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Seleccionar Cliente
              </h3>
              
              {/* Buscador con autocomplete */}
              {!selectedCustomer && (
                <div className="relative" ref={searchRef}>
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="text"
                    value={searchCustomer}
                    onChange={(e) => {
                      setSearchCustomer(e.target.value);
                      setShowCustomerDropdown(e.target.value.length > 0);
                      setShowNewCustomerForm(false);
                    }}
                    onFocus={() => searchCustomer.length > 0 && setShowCustomerDropdown(true)}
                    placeholder="Buscar por nombre, RUC o email..."
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm transition-colors ${
                      isLight 
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                        : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />

                  {/* Dropdown de resultados */}
                  {showCustomerDropdown && searchCustomer && (
                    <div className={`absolute top-full left-0 right-0 mt-2 rounded-lg border shadow-lg z-50 max-h-[320px] overflow-y-auto ${
                      isLight ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
                    }`}>
                      {filteredCustomers.length > 0 ? (
                        <div className={`divide-y ${isLight ? "divide-gray-100" : "divide-white/5"}`}>
                          {filteredCustomers.map((customer) => (
                            <button
                              key={customer.ruc}
                              onClick={() => handleSelectCustomer(customer)}
                              className={`w-full text-left p-3 transition-colors ${
                                isLight 
                                  ? "hover:bg-gray-50" 
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-1.5 rounded-lg ${isLight ? "bg-gray-100" : "bg-white/5"}`}>
                                  <User className={`w-3.5 h-3.5 ${isLight ? "text-gray-600" : "text-gray-400"}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className={`font-semibold text-sm mb-0.5 ${isLight ? "text-gray-900" : "text-white"}`}>
                                    {customer.name}
                                  </div>
                                  <div className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                                    RUC: {customer.ruc}
                                  </div>
                                  <div className={`text-xs mt-0.5 truncate ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                                    {customer.email}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <User className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                          <p className={`text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            No se encontraron clientes
                          </p>
                          <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            Debe ir a la sección de Clientes para crear uno nuevo
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Formulario de nuevo cliente */}
              {showNewCustomerForm && (
                <div className={`rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Nuevo Cliente
                    </h4>
                    <button
                      onClick={() => {
                        setShowNewCustomerForm(false);
                        setSearchCustomer("");
                      }}
                      className={`p-1 rounded transition-colors ${isLight ? "hover:bg-gray-200 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Nombre / Razón Social *
                      </label>
                      <input
                        type="text"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight 
                            ? "bg-white border-gray-300 text-gray-900" 
                            : "bg-[#0d1724] border-white/10 text-white"
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        RUC / Cédula *
                      </label>
                      <input
                        type="text"
                        value={newCustomerRuc}
                        onChange={(e) => setNewCustomerRuc(e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight 
                            ? "bg-white border-gray-300 text-gray-900" 
                            : "bg-[#0d1724] border-white/10 text-white"
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={newCustomerEmail}
                        onChange={(e) => setNewCustomerEmail(e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight 
                            ? "bg-white border-gray-300 text-gray-900" 
                            : "bg-[#0d1724] border-white/10 text-white"
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={newCustomerPhone}
                        onChange={(e) => setNewCustomerPhone(e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight 
                            ? "bg-white border-gray-300 text-gray-900" 
                            : "bg-[#0d1724] border-white/10 text-white"
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={newCustomerAddress}
                        onChange={(e) => setNewCustomerAddress(e.target.value)}
                        className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                          isLight 
                            ? "bg-white border-gray-300 text-gray-900" 
                            : "bg-[#0d1724] border-white/10 text-white"
                        }`}
                      />
                    </div>
                    
                    <button
                      onClick={handleCreateNewCustomer}
                      disabled={!newCustomerName || !newCustomerRuc}
                      className="w-full px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Crear Cliente
                    </button>
                  </div>
                </div>
              )}

              {/* Información del cliente seleccionado */}
              {selectedCustomer && (
                <div className="grid grid-cols-[280px_1fr] gap-4">
                  {/* Columna izquierda: Foto y datos adicionales */}
                  <div className="space-y-3">
                    {/* Fotografía */}
                    <div className="relative">
                      <div className={`rounded-lg overflow-hidden border ${isLight ? "border-gray-200 bg-gray-100" : "border-white/10 bg-[#1a2332]"}`}>
                        {selectedCustomer.photo ? (
                          <img 
                            src={selectedCustomer.photo} 
                            alt={selectedCustomer.name}
                            className="w-full h-56 object-cover"
                          />
                        ) : (
                          <div className={`w-full h-56 flex flex-col items-center justify-center ${isLight ? "bg-gray-100" : "bg-[#1a2332]"}`}>
                            <Camera className={`w-12 h-12 mb-2 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
                            <span className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>Sin fotografía</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-lg">
                          <Camera className="w-3.5 h-3.5" />
                          Fotografía
                        </span>
                      </div>
                      {selectedCustomer.debt > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-md shadow-lg">
                            Con Deuda
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Saldo Pendiente */}
                    {selectedCustomer.debt > 0 && (
                      <div className={`rounded-lg border p-4 ${isLight ? "bg-red-50 border-red-200" : "bg-red-900/20 border-red-500/30"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className={`text-xs font-bold uppercase ${isLight ? "text-red-700" : "text-red-400"}`}>
                            Saldo Pendiente
                          </span>
                        </div>
                        <div className={`text-3xl font-black ${isLight ? "text-gray-900" : "text-white"}`}>
                          ${selectedCustomer.debt.toFixed(2)}
                        </div>
                        <p className={`text-xs mt-1 ${isLight ? "text-red-600" : "text-red-400"}`}>
                          Deuda pendiente
                        </p>
                      </div>
                    )}

                    {/* Historial */}
                    <div className={`rounded-lg border-2 p-4 ${isLight ? "bg-white border-primary/30" : "bg-[#1a2332] border-primary/30"}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Receipt className="w-4 h-4 text-primary" />
                        <span className={`text-xs font-bold uppercase ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          Historial
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Total Compras:
                          </span>
                          <span className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                            {selectedCustomer.totalPurchases || 0}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            Última Compra:
                          </span>
                          <span className={`text-xs font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                            {selectedCustomer.lastPurchaseDate || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columna derecha: Información del cliente */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-500" />
                        <h4 className={`text-sm font-bold uppercase ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          Datos de Identificación
                        </h4>
                      </div>
                      <button
                        onClick={handleDeselectCustomer}
                        className={`p-1.5 rounded transition-colors ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/10 text-gray-400"}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Nombre Completo */}
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 uppercase ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Nombre Completo
                      </label>
                      <div className={`px-4 py-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}>
                        <span className="text-base font-medium">{selectedCustomer.name}</span>
                      </div>
                    </div>

                    {/* RUC y Teléfono */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 uppercase ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          RUC/Cédula
                        </label>
                        <div className={`px-4 py-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}>
                          <span className="text-base font-medium">{selectedCustomer.ruc}</span>
                        </div>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 uppercase ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          Teléfono Celular
                        </label>
                        <div className={`px-4 py-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}>
                          <span className="text-base font-medium">{selectedCustomer.phone || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Información de Contacto */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-5 h-5 text-primary" />
                          <h4 className={`text-sm font-bold uppercase ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                            Información de Contacto
                          </h4>
                        </div>
                        {!isEditingCustomer ? (
                          <button
                            onClick={() => setIsEditingCustomer(true)}
                            className="text-xs text-green-600 hover:underline inline-flex items-center gap-1 font-medium"
                          >
                            ✓ Editable
                          </button>
                        ) : (
                          <span className="text-xs text-primary font-medium">
                            Editando...
                          </span>
                        )}
                      </div>

                      {/* Email */}
                      <div className="mb-4">
                        <label className={`block text-xs font-medium mb-1.5 uppercase ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          Correo Electrónico
                        </label>
                        {isEditingCustomer ? (
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg text-base ${
                              isLight 
                                ? "bg-white border-gray-300 text-gray-900" 
                                : "bg-[#0d1724] border-white/10 text-white"
                            }`}
                          />
                        ) : (
                          <div className={`px-4 py-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}>
                            <span className="text-base font-medium">{selectedCustomer.email || "No especificado"}</span>
                          </div>
                        )}
                      </div>

                      {/* Dirección */}
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 uppercase ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          Dirección Completa
                        </label>
                        {isEditingCustomer ? (
                          <input
                            type="text"
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg text-base ${
                              isLight 
                                ? "bg-white border-gray-300 text-gray-900" 
                                : "bg-[#0d1724] border-white/10 text-white"
                            }`}
                          />
                        ) : (
                          <div className={`px-4 py-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200 text-gray-900" : "bg-[#0d1724] border-white/10 text-white"}`}>
                            <span className="text-base font-medium">{selectedCustomer.address || "No especificada"}</span>
                          </div>
                        )}
                      </div>

                      {/* Botones de edición */}
                      {isEditingCustomer && (
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={handleSaveCustomerEdit}
                            className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Guardar Cambios
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingCustomer(false);
                              setEditEmail(selectedCustomer.email);
                              setEditAddress(selectedCustomer.address);
                            }}
                            className={`px-4 py-2.5 border text-sm font-bold rounded-lg transition-colors ${
                              isLight 
                                ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
                                : "border-white/10 text-gray-300 hover:bg-white/5"
                            }`}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay cliente seleccionado ni formulario */}
              {!selectedCustomer && !showNewCustomerForm && !searchCustomer && (
                <div className={`text-center py-12 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"}`}>
                  <User className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                  <p className={`text-sm font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Busca un cliente
                  </p>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Escribe el nombre, RUC o correo del cliente
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Agregar Productos */}
          {step === 2 && selectedCustomer && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Agregar Productos
                </h3>
                <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Cliente: <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{selectedCustomer.name}</span>
                </div>
              </div>

              {/* Buscador de productos */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                <input
                  type="text"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  placeholder="Buscar productos por código, nombre o categoría..."
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm transition-colors ${
                    isLight 
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
              </div>

              {/* Catálogo de productos */}
              {searchProduct && (
<div className={`rounded-lg border max-h-80 overflow-y-auto ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#1a2332]"}`}>
                  {filteredProducts.map((product) => (
                    <button
                      key={product.code}
                      onClick={() => addProduct(product)}
                      className={`w-full flex items-center gap-4 px-4 py-3 border-b last:border-b-0 transition-colors group text-left ${
                        isLight 
                          ? "border-gray-100 hover:bg-orange-50" 
                          : "border-white/5 hover:bg-orange-950/20"
                      }`}
                    >
                      {/* Código */}
                      <div className="w-24 flex-shrink-0">
                        <span className={`font-mono text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          {product.code}
                        </span>
                      </div>

                      {/* Nombre y Categoría */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold mb-0.5 group-hover:text-primary transition-colors ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}>
                          {product.name}
                        </div>
                        <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          {product.category}
                        </div>
                      </div>

                      {/* Precio e IVA */}
                      <div className="text-right w-28 flex-shrink-0">
                        <div className="text-lg font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </div>
                        <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          IVA {product.tax}%
                        </div>
                      </div>

                      {/* Stock */}
                      <div className="w-14 flex-shrink-0 flex justify-center">
                        <span className={`px-2.5 py-1 rounded-md text-sm font-bold ${
                          product.stock > 20 
                            ? "bg-green-100 text-green-700"
                            : product.stock > 5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {product.stock}
                        </span>
                      </div>

                      {/* Botón Agregar */}
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        isLight
                          ? "bg-orange-100 text-primary"
                          : "bg-orange-900/30 text-primary"
                      }`}>
                        <Plus className="w-4 h-4" />
                      </div>

                      {/* Botón Info */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductInfo(product);
                        }}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 cursor-pointer ${
                          isLight
                            ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                        title="Ver información del producto"
                      >
                        <Info className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className={`text-center py-8 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      <p className="text-sm">No se encontraron productos</p>
                    </div>
                  )}
                </div>
              )}

              {/* Items agregados */}
              {items.length > 0 && (
                <div className={`rounded-lg border overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <table className="w-full">
                    <thead className={isLight ? "bg-gray-50" : "bg-[#0a0f1a]"}>
                      <tr>
                        <th className={`px-3 py-2.5 text-left text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          Producto
                        </th>
                        <th className={`px-3 py-2.5 text-center text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          Cantidad
                        </th>
                        <th className={`px-3 py-2.5 text-right text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          Precio
                        </th>
                        <th className={`px-3 py-2.5 text-right text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/10"}`}>
                      {items.map((item) => (
                        <tr key={item.code} className={isLight ? "bg-white" : "bg-[#0d1724]"}>
                          <td className={`px-3 py-3 ${isLight ? "text-gray-900" : "text-white"}`}>
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="flex items-center gap-3 mt-1">
                              <div className={`text-xs font-mono ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                {item.code}
                              </div>
                              {(() => {
                                const product = PRODUCTS_CATALOG.find(p => p.code === item.code);
                                if (product) {
                                  return (
                                    <span className={`text-xs font-medium ${
                                      product.stock > 20 
                                        ? isLight ? "text-green-600" : "text-green-400"
                                        : product.stock > 5
                                        ? isLight ? "text-yellow-600" : "text-yellow-400"
                                        : isLight ? "text-red-600" : "text-red-400"
                                    }`}>
                                      Stock: {product.stock}
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleItemQuantityChange(item.code, item.quantity - 1)}
                                className={`p-1 rounded transition-colors ${
                                  isLight
                                    ? "hover:bg-gray-200 text-gray-600"
                                    : "hover:bg-white/10 text-gray-400"
                                }`}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className={`w-12 text-center font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleItemQuantityChange(item.code, item.quantity + 1)}
                                className={`p-1 rounded transition-colors ${
                                  isLight
                                    ? "hover:bg-gray-200 text-gray-600"
                                    : "hover:bg-white/10 text-gray-400"
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          <td className={`px-3 py-3 text-right font-mono text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            ${item.price.toFixed(2)}
                          </td>
                          <td className={`px-3 py-3 text-right font-mono font-bold text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Resumen de Totales */}
                  <div className={`px-4 py-3 border-t ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          Subtotal
                        </span>
                        <span className={`text-sm font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                          ${totals.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          IVA
                        </span>
                        <span className={`text-sm font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                          ${totals.tax.toFixed(2)}
                        </span>
                      </div>
                      <div className={`pt-2 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                            TOTAL
                          </span>
                          <span className="text-xl font-mono font-bold text-primary">
                            ${totals.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {items.length === 0 && (
                <div className={`text-center py-12 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  <ShoppingCart className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                  <p className="text-sm">No hay productos agregados</p>
                  <p className="text-xs mt-1">Busca y selecciona productos del catálogo</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Método de Pago */}
          {step === 3 && selectedCustomer && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Método de Pago
              </h3>

              {/* Resumen rápido */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Cliente: {selectedCustomer.name}
                    </div>
                    <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Productos: {items.length}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Total a pagar</div>
                    <div className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${totals.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selector de método de pago */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Seleccione el Método de Pago *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors ${
                    isLight 
                      ? "bg-white border-gray-300 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      : "bg-[#1a2332] border-white/10 text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.code} value={method.code}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo de Comprobante - Se muestra para pagos diferentes a efectivo y crédito */}
              {paymentMethod !== "cash" && paymentMethod !== "credit" && (
                <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-900/20 border-blue-500/30"}`}>
                  <div className={`text-sm font-bold mb-3 flex items-center gap-2 ${isLight ? "text-blue-800" : "text-blue-200"}`}>
                    <Receipt className="w-4 h-4" />
                    Información del Comprobante
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-blue-700" : "text-blue-300"}`}>
                      Número de Comprobante / Referencia *
                    </label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Ej: 123456789, TRX-001, etc."
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm ${
                        isLight 
                          ? "bg-white border-blue-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" 
                          : "bg-[#1a2332] border-blue-600/30 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      }`}
                    />
                    <p className={`text-xs mt-1.5 ${isLight ? "text-blue-600" : "text-blue-400"}`}>
                      Ingrese el número de transacción, voucher o comprobante del pago
                    </p>
                  </div>
                </div>
              )}

              {/* Configuración de Crédito - Se muestra si selecciona crédito */}
              {paymentMethod === "credit" && (
                <div className={`p-4 rounded-lg border ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-800/20 border-slate-700/30"}`}>
                  <div className={`text-sm font-bold mb-3 flex items-center gap-2 ${isLight ? "text-slate-800" : "text-slate-200"}`}>
                    <CreditCard className="w-4 h-4" />
                    Configuración del Crédito
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Plazo */}
                    <div key="credit-plazo">
                      <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                        Plazo *
                      </label>
                      <select
                        value={creditMonths}
                        onChange={(e) => setCreditMonths(parseInt(e.target.value) || 1)}
                        className={`w-full px-2.5 py-2 border rounded-lg text-sm ${ 
                          isLight 
                            ? "bg-white border-slate-300 text-gray-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20" 
                            : "bg-[#1a2332] border-slate-600/30 text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
                        }`}
                      >
                        <option key="3" value={3}>3 meses</option>
                        <option key="6" value={6}>6 meses</option>
                        <option key="9" value={9}>9 meses</option>
                        <option key="12" value={12}>12 meses</option>
                        <option key="18" value={18}>18 meses</option>
                        <option key="24" value={24}>24 meses</option>
                      </select>
                    </div>

                    {/* Tasa de interés */}
                    <div key="credit-interes">
                      <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                        Interés Mensual (%) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                        className={`w-full px-2.5 py-2 border rounded-lg text-sm ${ 
                          isLight 
                            ? "bg-white border-slate-300 text-gray-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20" 
                            : "bg-[#1a2332] border-slate-600/30 text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Fecha primera cuota */}
                  <div className="mb-3">
                    <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Fecha Primera Cuota *
                    </label>
                    <input
                      type="date"
                      value={firstPaymentDate}
                      onChange={(e) => setFirstPaymentDate(e.target.value)}
                      className={`w-full px-2.5 py-2 border rounded-lg text-sm ${ 
                        isLight 
                          ? "bg-white border-slate-300 text-gray-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20" 
                          : "bg-[#1a2332] border-slate-600/30 text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
                      }`}
                    />
                  </div>

                  {/* Abono inicial */}
                  <div className="mb-3">
                    <label className={`block text-xs font-semibold mb-1.5 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Abono Inicial (opcional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max={totals.total}
                      value={downPayment}
                      onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                      className={`w-full px-2.5 py-2 border rounded-lg text-sm ${ 
                        isLight 
                          ? "bg-white border-slate-300 text-gray-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20" 
                          : "bg-[#1a2332] border-slate-600/30 text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
                      }`}
                    />
                  </div>

                  {/* Vista previa de cuota */}
                  {amortizationSchedule.length > 0 && (
                    <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-slate-300" : "bg-[#0d1724] border-slate-600/30"}`}>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <div className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                            Cuota Mensual
                          </div>
                          <div className={`text-xl font-bold mt-0.5 ${isLight ? "text-slate-900" : "text-white"}`}>
                            ${amortizationSchedule[0]?.totalCuota.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs font-medium ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                            Total a Pagar
                          </div>
                          <div className={`text-base font-bold mt-0.5 ${isLight ? "text-slate-900" : "text-white"}`}>
                            ${amortizationSchedule.reduce((sum, p) => sum + p.totalCuota, 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notas adicionales */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                  Notas Adicionales (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Agregar observaciones o notas para esta factura..."
                  rows={3}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm transition-colors resize-none ${
                    isLight 
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  }`}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Revisión Final */}
          {step === 4 && selectedCustomer && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                Revisión Final
              </h3>

              {/* Cliente */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className={`text-xs uppercase tracking-wider font-semibold mb-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Cliente
                </div>
                <div className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  {selectedCustomer.name}
                </div>
                <div className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  RUC: {selectedCustomer.ruc}
                </div>
              </div>

              {/* Resumen de productos */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className={`text-xs uppercase tracking-wider font-semibold mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Productos ({items.length})
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.code} className="flex justify-between text-sm">
                      <div className={isLight ? "text-gray-700" : "text-gray-300"}>
                        {item.quantity}x {item.name}
                      </div>
                      <div className={`font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                <div className="space-y-2 text-sm">
                  <div key="subtotal-0" className="flex justify-between">
                    <span className={isLight ? "text-gray-600" : "text-gray-400"}>Subtotal 0%:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${totals.subtotal0.toFixed(2)}
                    </span>
                  </div>
                  <div key="subtotal-12" className="flex justify-between">
                    <span className={isLight ? "text-gray-600" : "text-gray-400"}>Subtotal 12%:</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${totals.subtotal12.toFixed(2)}
                    </span>
                  </div>
                  <div key="iva" className="flex justify-between">
                    <span className={isLight ? "text-gray-600" : "text-gray-400"}>IVA (12%):</span>
                    <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${totals.tax.toFixed(2)}
                    </span>
                  </div>
                  <div key="total" className={`flex justify-between pt-2 border-t ${isLight ? "border-blue-300" : "border-blue-500/30"}`}>
                    <span className={`font-bold ${isLight ? "text-gray-900" : "text-white"}`}>Total Factura:</span>
                    <span className={`font-mono font-bold text-lg ${isLight ? "text-blue-700" : "text-blue-400"}`}>
                      ${totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className={`p-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Método de Pago:
                  </span>
                  <span className={`text-sm font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {PAYMENT_METHODS.find(m => m.code === paymentMethod)?.name}
                  </span>
                </div>
              </div>

              {/* Tabla de Amortización (solo si es crédito) */}
              {paymentMethod === "credit" && amortizationSchedule.length > 0 && (
                <div className={`p-4 rounded-lg border ${isLight ? "bg-slate-50 border-slate-200" : "bg-slate-800/20 border-slate-700/30"}`}>
                  <div className={`text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                    <TrendingUp className="w-4 h-4" />
                    Tabla de Amortización
                  </div>

                  {/* Resumen de crédito */}
                  {downPayment > 0 && (
                    <div className={`mb-3 p-3 rounded-lg border ${isLight ? "bg-white border-slate-300" : "bg-[#0d1724] border-slate-600/30"}`}>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div key="total-factura">
                          <div className={`font-medium mb-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Total Factura</div>
                          <div className={`font-bold text-base ${isLight ? "text-slate-900" : "text-white"}`}>${totals.total.toFixed(2)}</div>
                        </div>
                        <div key="abono-inicial">
                          <div className={`font-medium mb-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Abono Inicial</div>
                          <div className={`font-bold text-base ${isLight ? "text-slate-900" : "text-white"}`}>${downPayment.toFixed(2)}</div>
                        </div>
                        <div key="monto-financiar">
                          <div className={`font-medium mb-1 ${isLight ? "text-slate-600" : "text-slate-400"}`}>Monto a Financiar</div>
                          <div className={`font-bold text-base ${isLight ? "text-primary" : "text-primary"}`}>${(totals.total - downPayment).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className={isLight ? "bg-slate-100" : "bg-slate-700/30"}>
                        <tr>
                          <th className={`px-2 py-2 text-left font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                            #
                          </th>
                          <th className={`px-2 py-2 text-left font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                            Fecha
                          </th>
                          <th className={`px-2 py-2 text-right font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                            Capital
                          </th>
                          <th className={`px-2 py-2 text-right font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                            Interés
                          </th>
                          <th className={`px-2 py-2 text-right font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                            Cuota
                          </th>
                          <th className={`px-2 py-2 text-right font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                            Saldo
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isLight ? "divide-slate-200" : "divide-slate-700/30"}`}>
                        {amortizationSchedule.map((payment) => (
                          <tr key={payment.cuota} className={isLight ? "hover:bg-slate-50" : "hover:bg-slate-800/10"}>
                            <td className={`px-2 py-2.5 font-mono ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                              {payment.cuota}
                            </td>
                            <td className={`px-2 py-2.5 font-mono ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                              {payment.fechaVencimiento}
                            </td>
                            <td className={`px-2 py-2.5 text-right font-mono ${isLight ? "text-slate-900" : "text-white"}`}>
                              ${payment.capital.toFixed(2)}
                            </td>
                            <td className={`px-2 py-2.5 text-right font-mono ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                              ${payment.interes.toFixed(2)}
                            </td>
                            <td className={`px-2 py-2.5 text-right font-mono font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                              ${payment.totalCuota.toFixed(2)}
                            </td>
                            <td className={`px-2 py-2.5 text-right font-mono ${isLight ? "text-slate-600" : "text-slate-400"}`}>
                              ${payment.saldo.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className={isLight ? "bg-slate-100" : "bg-slate-700/30"}>
                        <tr>
                          <td colSpan={4} className={`px-2 py-2.5 text-right font-bold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                            TOTAL A PAGAR:
                          </td>
                          <td className={`px-2 py-2.5 text-right font-mono font-bold ${isLight ? "text-slate-900" : "text-white"}`}>
                            ${amortizationSchedule.reduce((sum, p) => sum + p.totalCuota, 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div className={`mt-3 pt-3 border-t flex items-center justify-between text-xs ${isLight ? "border-slate-200 text-slate-600" : "border-slate-700/30 text-slate-400"}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{creditMonths} cuotas</span>
                      <span className="font-medium">{interestRate}% mensual</span>
                    </div>
                    <div className={`font-semibold ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                      Total intereses: ${amortizationSchedule.reduce((sum, p) => sum + p.interes, 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Autorización SRI */}
          {step === 5 && selectedCustomer && (
            <div className="space-y-6">
              {/* Header con icono */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Send className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Proceso de Autorización SRI
                  </h3>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Factura: {invoiceNumber || "Generando..."}
                  </p>
                </div>
              </div>

              {/* Resumen rápido */}
              <div className={`p-4 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Cliente: {selectedCustomer.name}
                    </div>
                    <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Productos: {items.length}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Total a pagar</div>
                    <div className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      ${totals.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stepper horizontal dinámico */}
              <div className={`p-8 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                <div className="flex items-start">
                  {/* Paso 1: Validando XML */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                      sriStep >= 1 
                        ? "bg-primary border-primary" 
                        : isLight ? "bg-white border-gray-300" : "bg-[#1a2332] border-gray-600"
                    }`}>
                      {sriStep === 1 ? (
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : sriStep > 1 ? (
                        <FileCheck className="w-7 h-7 text-white" />
                      ) : (
                        <FileCheck className={`w-7 h-7 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
                      )}
                    </div>
                    <div className="text-center mt-3">
                      <div className={`text-sm font-semibold ${
                        sriStep >= 1 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Validando
                      </div>
                      <div className={`text-sm ${
                        sriStep >= 1 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        XML
                      </div>
                    </div>
                  </div>

                  {/* Línea 1 */}
                  <div className="flex items-center justify-center" style={{ width: '120px', marginTop: '32px' }}>
                    <div className={`h-0.5 w-full transition-all ${
                      sriStep > 1 ? "bg-gray-300" : isLight ? "bg-gray-300" : "bg-gray-600"
                    }`} />
                  </div>

                  {/* Paso 2: Validación Estructura */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                      sriStep >= 2 
                        ? "bg-primary border-primary" 
                        : isLight ? "bg-white border-gray-300" : "bg-[#1a2332] border-gray-600"
                    }`}>
                      {sriStep === 2 ? (
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : sriStep > 2 ? (
                        <FileText className="w-7 h-7 text-white" />
                      ) : (
                        <FileText className={`w-7 h-7 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
                      )}
                    </div>
                    <div className="text-center mt-3">
                      <div className={`text-sm font-semibold ${
                        sriStep >= 2 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Validación
                      </div>
                      <div className={`text-sm ${
                        sriStep >= 2 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Estructura
                      </div>
                    </div>
                  </div>

                  {/* Línea 2 */}
                  <div className="flex items-center justify-center" style={{ width: '120px', marginTop: '32px' }}>
                    <div className={`h-0.5 w-full transition-all ${
                      sriStep > 2 ? "bg-gray-300" : isLight ? "bg-gray-300" : "bg-gray-600"
                    }`} />
                  </div>

                  {/* Paso 3: Firma Electrónica */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                      sriStep >= 3 
                        ? "bg-primary border-primary" 
                        : isLight ? "bg-white border-gray-300" : "bg-[#1a2332] border-gray-600"
                    }`}>
                      {sriStep === 3 ? (
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : sriStep > 3 ? (
                        <FileSignature className="w-7 h-7 text-white" />
                      ) : (
                        <FileSignature className={`w-7 h-7 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
                      )}
                    </div>
                    <div className="text-center mt-3">
                      <div className={`text-sm font-semibold ${
                        sriStep >= 3 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Firma
                      </div>
                      <div className={`text-sm ${
                        sriStep >= 3 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Electrónica
                      </div>
                    </div>
                  </div>

                  {/* Línea 3 */}
                  <div className="flex items-center justify-center" style={{ width: '120px', marginTop: '32px' }}>
                    <div className={`h-0.5 w-full transition-all ${
                      sriStep > 3 ? "bg-gray-300" : isLight ? "bg-gray-300" : "bg-gray-600"
                    }`} />
                  </div>

                  {/* Paso 4: Enviando al SRI */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                      sriStep >= 4 
                        ? "bg-primary border-primary" 
                        : isLight ? "bg-white border-gray-300" : "bg-[#1a2332] border-gray-600"
                    }`}>
                      {sriStep === 4 ? (
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : sriStep > 4 ? (
                        <Send className="w-7 h-7 text-white" />
                      ) : (
                        <Send className={`w-7 h-7 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
                      )}
                    </div>
                    <div className="text-center mt-3">
                      <div className={`text-sm font-semibold ${
                        sriStep >= 4 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Enviando
                      </div>
                      <div className={`text-sm ${
                        sriStep >= 4 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        al SRI
                      </div>
                    </div>
                  </div>

                  {/* Línea 4 */}
                  <div className="flex items-center justify-center" style={{ width: '120px', marginTop: '32px' }}>
                    <div className={`h-0.5 w-full transition-all ${
                      sriStep > 4 ? "bg-gray-300" : isLight ? "bg-gray-300" : "bg-gray-600"
                    }`} />
                  </div>

                  {/* Paso 5: Autorización SRI */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
                      sriStep >= 5 
                        ? "bg-primary border-primary" 
                        : isLight ? "bg-white border-gray-300" : "bg-[#1a2332] border-gray-600"
                    }`}>
                      {sriStep === 5 ? (
                        <Shield className="w-7 h-7 text-white" />
                      ) : sriStep > 5 ? (
                        <Shield className="w-7 h-7 text-white" />
                      ) : (
                        <Shield className={`w-7 h-7 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
                      )}
                    </div>
                    <div className="text-center mt-3">
                      <div className={`text-sm font-semibold ${
                        sriStep >= 5 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        Autorización
                      </div>
                      <div className={`text-sm ${
                        sriStep >= 5 ? "text-gray-900" : isLight ? "text-gray-400" : "text-gray-500"
                      }`}>
                        SRI
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mensaje de éxito */}
              {sriStep >= 5 && (
                <>
                  <div className={`p-4 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/30"}`}>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <div>
                        <div className={`font-bold text-sm ${isLight ? "text-green-700" : "text-green-500"}`}>
                          ¡Factura autorizada exitosamente!
                        </div>
                        <div className={`text-xs ${isLight ? "text-green-600" : "text-green-400"}`}>
                          La factura ha sido procesada y autorizada por el SRI
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de impresión */}
                  {paymentMethod === "credit" && (
                    <div className={`p-4 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/30"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Receipt className={`w-5 h-5 ${isLight ? "text-blue-700" : "text-blue-400"}`} />
                          <span className={`text-sm font-semibold ${isLight ? "text-blue-700" : "text-blue-400"}`}>
                            Documentos de Crédito Disponibles
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {/* Botón para imprimir comprobante de pago inicial */}
                        {downPayment > 0 && (
                          <button
                            onClick={printDownPaymentReceipt}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                              isLight 
                                ? "bg-white border-primary text-primary hover:bg-primary hover:text-white" 
                                : "bg-[#1a2332] border-primary text-primary hover:bg-primary hover:text-white"
                            }`}
                          >
                            <Printer className="w-4 h-4" />
                            <span className="text-sm font-medium">Comprobante Pago Inicial</span>
                          </button>
                        )}
                        
                        {/* Botón para imprimir tabla de amortización */}
                        {amortizationSchedule.length > 0 && (
                          <button
                            onClick={printAmortizationSchedule}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                              isLight 
                                ? "bg-white border-primary text-primary hover:bg-primary hover:text-white" 
                                : "bg-[#1a2332] border-primary text-primary hover:bg-primary hover:text-white"
                            }`}
                          >
                            <Printer className="w-4 h-4" />
                            <span className="text-sm font-medium">Tabla de Amortización</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${isLight ? "bg-gray-50 border-gray-200" : "bg-[#0a0f1a] border-white/10"}`}>
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLight 
                    ? "text-gray-700 hover:bg-gray-200" 
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                ← Atrás
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLight 
                  ? "text-gray-700 hover:bg-gray-200" 
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              Cancelar
            </button>
            
            {/* Lógica de navegación de pasos */}
            {step < totalSteps ? (
              <button
                onClick={() => {
                  // Validaciones por paso
                  if (step === 1 && !canGoToStep2) return;
                  if (step === 2 && !canGoToStep3) return;
                  if (step === 3 && !canGoToStep4) return;
                  
                  // Avanzar al siguiente paso
                  setStep((step + 1) as 1 | 2 | 3 | 4 | 5);
                }}
                disabled={
                  (step === 1 && !canGoToStep2) ||
                  (step === 2 && !canGoToStep3) ||
                  (step === 3 && !canGoToStep4)
                }
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  (step === 1 && !canGoToStep2) ||
                  (step === 2 && !canGoToStep3) ||
                  (step === 3 && !canGoToStep4)
                    ? isLight
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                {step === 4 ? "Iniciar Autorización SRI" : "Siguiente →"}
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={sriStep < 5 || !canSave}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  (sriStep < 5 || !canSave)
                    ? isLight
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {sriStep >= 5 ? "Finalizar Factura" : "Procesando..."}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Información del Producto */}
      {selectedProductInfo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div 
            className={`rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden ${
              isLight ? "bg-white" : "bg-[#0D1B2A]"
            }`}
          >
            {/* Header */}
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Información del Producto
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductInfo(null)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              {/* Código y Categoría */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`font-mono text-base font-bold px-3 py-1.5 rounded-lg ${
                  isLight ? "bg-gray-100 text-gray-900" : "bg-white/10 text-white"
                }`}>
                  {selectedProductInfo.code}
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                  {selectedProductInfo.category}
                </span>
              </div>

              {/* Nombre */}
              <h4 className={`text-xl font-bold mb-4 ${isLight ? "text-gray-900" : "text-white"}`}>
                {selectedProductInfo.name}
              </h4>

              {/* Grid de información */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Precio */}
                <div className={`p-4 rounded-lg ${isLight ? "bg-orange-50" : "bg-orange-950/20"}`}>
                  <div className={`text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Precio Unitario
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ${selectedProductInfo.price.toFixed(2)}
                  </div>
                </div>

                {/* IVA */}
                <div className={`p-4 rounded-lg ${isLight ? "bg-blue-50" : "bg-blue-950/20"}`}>
                  <div className={`text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    IVA
                  </div>
                  <div className={`text-2xl font-bold ${isLight ? "text-blue-700" : "text-blue-400"}`}>
                    {selectedProductInfo.tax}%
                  </div>
                </div>

                {/* Stock */}
                <div className={`p-4 rounded-lg ${
                  selectedProductInfo.stock > 20 
                    ? "bg-green-50"
                    : selectedProductInfo.stock > 5
                    ? "bg-yellow-50"
                    : "bg-red-50"
                }`}>
                  <div className={`text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Stock Disponible
                  </div>
                  <div className={`text-2xl font-bold ${
                    selectedProductInfo.stock > 20 
                      ? "text-green-700"
                      : selectedProductInfo.stock > 5
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}>
                    {selectedProductInfo.stock} unidades
                  </div>
                </div>

                {/* Precio con IVA */}
                <div className={`p-4 rounded-lg ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                  <div className={`text-xs font-medium mb-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Precio + IVA
                  </div>
                  <div className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    ${(selectedProductInfo.price * (1 + selectedProductInfo.tax / 100)).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Características Técnicas */}
              {(selectedProductInfo.brand || selectedProductInfo.model || selectedProductInfo.description || selectedProductInfo.warranty) && (
                <div className={`rounded-lg border p-4 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"}`}>
                  <h5 className={`text-sm font-bold uppercase mb-3 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Características Técnicas
                  </h5>
                  <div className="space-y-2.5">
                    {selectedProductInfo.brand && (
                      <div className="flex items-start gap-3">
                        <span className={`text-xs font-medium w-24 flex-shrink-0 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          Marca:
                        </span>
                        <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {selectedProductInfo.brand}
                        </span>
                      </div>
                    )}
                    {selectedProductInfo.model && (
                      <div className="flex items-start gap-3">
                        <span className={`text-xs font-medium w-24 flex-shrink-0 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          Modelo:
                        </span>
                        <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {selectedProductInfo.model}
                        </span>
                      </div>
                    )}
                    {selectedProductInfo.description && (
                      <div className="flex items-start gap-3">
                        <span className={`text-xs font-medium w-24 flex-shrink-0 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          Descripción:
                        </span>
                        <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                          {selectedProductInfo.description}
                        </span>
                      </div>
                    )}
                    {selectedProductInfo.warranty && (
                      <div className="flex items-start gap-3">
                        <span className={`text-xs font-medium w-24 flex-shrink-0 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          Garantía:
                        </span>
                        <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {selectedProductInfo.warranty}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer con botón Agregar */}
            <div className={`px-6 py-4 border-t flex items-center justify-between ${
              isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/5"
            }`}>
              <button
                onClick={() => setSelectedProductInfo(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLight
                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  addProduct(selectedProductInfo);
                  setSelectedProductInfo(null);
                }}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar a Factura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}