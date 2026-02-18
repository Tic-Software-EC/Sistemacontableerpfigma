import { useState } from "react";
import { CreditCard, Building2, Plus, Pencil, Trash2, DollarSign, Percent, Check, X } from "lucide-react";

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

interface PaymentMethod {
  id: string;
  sucursalId: string;
  name: string;
  type: "cash" | "credit_card" | "debit_card" | "transfer" | "check" | "credit";
  enabled: boolean;
  commissionPercent: string;
  commissionFixed: string;
  requiresAuthorization: boolean;
  accountingAccount: string;
  allowPartialPayment: boolean;
  maxAmount: string;
  color: string;
}

const PAYMENT_TYPES = [
  { id: "cash", name: "Efectivo", icon: "💵" },
  { id: "credit_card", name: "Tarjeta de Crédito", icon: "💳" },
  { id: "debit_card", name: "Tarjeta de Débito", icon: "💳" },
  { id: "transfer", name: "Transferencia Bancaria", icon: "🏦" },
  { id: "check", name: "Cheque", icon: "📝" },
  { id: "credit", name: "Crédito", icon: "📋" },
];

const COLORS = [
  { id: "green", name: "Verde", value: "#10b981" },
  { id: "blue", name: "Azul", value: "#3b82f6" },
  { id: "purple", name: "Morado", value: "#8b5cf6" },
  { id: "orange", name: "Naranja", value: "#E8692E" },
  { id: "yellow", name: "Amarillo", value: "#f59e0b" },
  { id: "red", name: "Rojo", value: "#ef4444" },
  { id: "pink", name: "Rosa", value: "#ec4899" },
  { id: "gray", name: "Gris", value: "#6b7280" },
];

export function PaymentMethodsContent() {
  const [selectedSucursal, setSelectedSucursal] = useState<string>("suc-001");
  const [showModal, setShowModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-001",
      sucursalId: "suc-001",
      name: "Efectivo",
      type: "cash",
      enabled: true,
      commissionPercent: "0",
      commissionFixed: "0",
      requiresAuthorization: false,
      accountingAccount: "1101-001",
      allowPartialPayment: true,
      maxAmount: "10000",
      color: "#10b981",
    },
    {
      id: "pm-002",
      sucursalId: "suc-001",
      name: "Tarjeta Visa/Mastercard",
      type: "credit_card",
      enabled: true,
      commissionPercent: "2.5",
      commissionFixed: "0",
      requiresAuthorization: false,
      accountingAccount: "1102-001",
      allowPartialPayment: false,
      maxAmount: "50000",
      color: "#3b82f6",
    },
    {
      id: "pm-003",
      sucursalId: "suc-001",
      name: "Transferencia Banco Pichincha",
      type: "transfer",
      enabled: true,
      commissionPercent: "0",
      commissionFixed: "0.50",
      requiresAuthorization: true,
      accountingAccount: "1103-001",
      allowPartialPayment: true,
      maxAmount: "100000",
      color: "#8b5cf6",
    },
    {
      id: "pm-004",
      sucursalId: "suc-001",
      name: "Crédito 30 días",
      type: "credit",
      enabled: true,
      commissionPercent: "0",
      commissionFixed: "0",
      requiresAuthorization: true,
      accountingAccount: "1301-001",
      allowPartialPayment: true,
      maxAmount: "20000",
      color: "#E8692E",
    },
    {
      id: "pm-005",
      sucursalId: "suc-002",
      name: "Efectivo",
      type: "cash",
      enabled: true,
      commissionPercent: "0",
      commissionFixed: "0",
      requiresAuthorization: false,
      accountingAccount: "1101-002",
      allowPartialPayment: true,
      maxAmount: "5000",
      color: "#10b981",
    },
    {
      id: "pm-006",
      sucursalId: "suc-002",
      name: "Tarjeta de Débito",
      type: "debit_card",
      enabled: true,
      commissionPercent: "1.5",
      commissionFixed: "0",
      requiresAuthorization: false,
      accountingAccount: "1102-002",
      allowPartialPayment: false,
      maxAmount: "30000",
      color: "#3b82f6",
    },
  ]);

  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    name: "",
    type: "cash",
    enabled: true,
    commissionPercent: "0",
    commissionFixed: "0",
    requiresAuthorization: false,
    accountingAccount: "",
    allowPartialPayment: true,
    maxAmount: "",
    color: "#10b981",
  });

  const filteredMethods = paymentMethods.filter(
    (method) =>
      method.sucursalId === selectedSucursal &&
      method.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (method?: PaymentMethod) => {
    if (method) {
      setEditingMethod(method);
      setFormData(method);
    } else {
      setEditingMethod(null);
      setFormData({
        name: "",
        type: "cash",
        enabled: true,
        commissionPercent: "0",
        commissionFixed: "0",
        requiresAuthorization: false,
        accountingAccount: "",
        allowPartialPayment: true,
        maxAmount: "",
        color: "#10b981",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMethod(null);
    setFormData({
      name: "",
      type: "cash",
      enabled: true,
      commissionPercent: "0",
      commissionFixed: "0",
      requiresAuthorization: false,
      accountingAccount: "",
      allowPartialPayment: true,
      maxAmount: "",
      color: "#10b981",
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.accountingAccount) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (editingMethod) {
      setPaymentMethods(
        paymentMethods.map((method) =>
          method.id === editingMethod.id
            ? { ...method, ...formData }
            : method
        )
      );
    } else {
      const newMethod: PaymentMethod = {
        id: `pm-${Date.now()}`,
        sucursalId: selectedSucursal,
        ...formData as PaymentMethod,
      };
      setPaymentMethods([...paymentMethods, newMethod]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este método de pago?")) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
    }
  };

  const toggleEnabled = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  const getTypeName = (type: string) => {
    return PAYMENT_TYPES.find((t) => t.id === type)?.name || type;
  };

  const getTypeIcon = (type: string) => {
    return PAYMENT_TYPES.find((t) => t.id === type)?.icon || "💰";
  };

  const getSucursalName = (id: string) => {
    return SUCURSALES.find((s) => s.id === id)?.name || id;
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header estándar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            Métodos de Pago
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona los métodos de pago disponibles por sucursal
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Método
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Selector de sucursal y búsqueda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-white font-medium mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Sucursal
          </label>
          <select
            value={selectedSucursal}
            onChange={(e) => setSelectedSucursal(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none cursor-pointer"
          >
            {SUCURSALES.map((sucursal) => (
              <option key={sucursal.id} value={sucursal.id}>
                {sucursal.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <label className="block text-white font-medium mb-3">Buscar método</label>
          <input
            type="text"
            placeholder="Nombre del método de pago..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Lista de métodos de pago */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMethods.length === 0 ? (
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No hay métodos de pago configurados</p>
            <p className="text-gray-500 text-sm">
              Agrega un nuevo método de pago para esta sucursal
            </p>
          </div>
        ) : (
          filteredMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${method.color}20`, border: `2px solid ${method.color}` }}
                  >
                    {getTypeIcon(method.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{method.name}</h3>
                    <p className="text-gray-400 text-sm">{getTypeName(method.type)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEnabled(method.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      method.enabled ? "bg-primary" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        method.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Información del método */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Cuenta contable:</span>
                  <span className="text-white font-medium">{method.accountingAccount}</span>
                </div>

                {(parseFloat(method.commissionPercent) > 0 || parseFloat(method.commissionFixed) > 0) && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Comisión:</span>
                    <span className="text-yellow-400 font-medium flex items-center gap-1">
                      {parseFloat(method.commissionPercent) > 0 && (
                        <span className="flex items-center gap-0.5">
                          {method.commissionPercent}%
                        </span>
                      )}
                      {parseFloat(method.commissionPercent) > 0 && parseFloat(method.commissionFixed) > 0 && " + "}
                      {parseFloat(method.commissionFixed) > 0 && (
                        <span>${method.commissionFixed}</span>
                      )}
                    </span>
                  </div>
                )}

                {method.maxAmount && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Monto máximo:</span>
                    <span className="text-white font-medium">${parseFloat(method.maxAmount).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Características */}
              <div className="flex flex-wrap gap-2 mb-4">
                {method.requiresAuthorization && (
                  <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-xs font-medium">
                    Requiere autorización
                  </span>
                )}
                {method.allowPartialPayment && (
                  <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                    Pago parcial
                  </span>
                )}
                {!method.enabled && (
                  <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                    Deshabilitado
                  </span>
                )}
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleOpenModal(method)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(method.id)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de agregar/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">
                {editingMethod ? "Editar Método de Pago" : "Nuevo Método de Pago"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Nombre del método <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Efectivo, Tarjeta Visa, Transferencia..."
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Tipo y Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Tipo de pago
                  </label>
                  <select
                    value={formData.type || "cash"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    {PAYMENT_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Color de identificación
                  </label>
                  <select
                    value={formData.color || "#10b981"}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    {COLORS.map((color) => (
                      <option key={color.id} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg border-2 border-white/20"
                      style={{ backgroundColor: formData.color }}
                    />
                    <span className="text-gray-400 text-xs">Vista previa del color</span>
                  </div>
                </div>
              </div>

              {/* Cuenta contable */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Cuenta contable <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1101-001"
                  value={formData.accountingAccount || ""}
                  onChange={(e) => setFormData({ ...formData, accountingAccount: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Comisiones */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                    <Percent className="w-4 h-4 text-yellow-400" />
                    Comisión (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0.00"
                    value={formData.commissionPercent || "0"}
                    onChange={(e) => setFormData({ ...formData, commissionPercent: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    Comisión fija ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.commissionFixed || "0"}
                    onChange={(e) => setFormData({ ...formData, commissionFixed: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Monto máximo */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Monto máximo permitido ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Sin límite"
                  value={formData.maxAmount || ""}
                  onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Opciones */}
              <div className="space-y-3 bg-white/5 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.enabled || false}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.enabled && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Método habilitado</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Permitir usar este método de pago en las ventas
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.requiresAuthorization || false}
                      onChange={(e) => setFormData({ ...formData, requiresAuthorization: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.requiresAuthorization && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Requiere autorización</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Solicitar aprobación de un supervisor para usar este método
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.allowPartialPayment || false}
                      onChange={(e) => setFormData({ ...formData, allowPartialPayment: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.allowPartialPayment && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Permitir pago parcial</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Habilitar pagos parciales con este método
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="sticky bottom-0 bg-secondary border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium"
              >
                {editingMethod ? "Guardar Cambios" : "Crear Método"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
