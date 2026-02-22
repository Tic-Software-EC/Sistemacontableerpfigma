import { useState } from "react";
import { DollarSign, Building2, Plus, Pencil, Trash2, Percent, Tag, Calendar, Check, X, Users, Package } from "lucide-react";

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

interface Discount {
  id: string;
  sucursalId: string;
  name: string;
  code: string;
  type: "percentage" | "fixed";
  value: string;
  applicationType: "general" | "category" | "product" | "customer";
  enabled: boolean;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxDiscount: string;
  stackable: boolean;
  autoApply: boolean;
  requiresCoupon: boolean;
  usageLimit: string;
  usedCount: string;
  color: string;
  description: string;
}

const DISCOUNT_TYPES = [
  { id: "percentage", name: "Porcentaje (%)", icon: <Percent className="w-4 h-4" /> },
  { id: "fixed", name: "Valor Fijo ($)", icon: <DollarSign className="w-4 h-4" /> },
];

const APPLICATION_TYPES = [
  { id: "general", name: "Descuento General", icon: <Tag className="w-4 h-4" />, desc: "Aplica a todas las ventas" },
  { id: "category", name: "Por Categoría", icon: <Package className="w-4 h-4" />, desc: "Aplica a productos de categorías específicas" },
  { id: "product", name: "Por Producto", icon: <Package className="w-4 h-4" />, desc: "Aplica a productos específicos" },
  { id: "customer", name: "Por Cliente", icon: <Users className="w-4 h-4" />, desc: "Aplica a clientes específicos" },
];

const COLORS = [
  { id: "red", name: "Rojo", value: "#ef4444" },
  { id: "orange", name: "Naranja", value: "#E8692E" },
  { id: "yellow", name: "Amarillo", value: "#f59e0b" },
  { id: "green", name: "Verde", value: "#10b981" },
  { id: "blue", name: "Azul", value: "#3b82f6" },
  { id: "purple", name: "Morado", value: "#8b5cf6" },
  { id: "pink", name: "Rosa", value: "#ec4899" },
  { id: "indigo", name: "Índigo", value: "#6366f1" },
];

export function DiscountsContent() {
  const [selectedSucursal, setSelectedSucursal] = useState<string>("suc-001");
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: "disc-001",
      sucursalId: "suc-001",
      name: "Black Friday 2026",
      code: "BLACKFRIDAY26",
      type: "percentage",
      value: "25",
      applicationType: "general",
      enabled: true,
      startDate: "2026-11-27",
      endDate: "2026-11-30",
      minAmount: "50",
      maxDiscount: "100",
      stackable: false,
      autoApply: false,
      requiresCoupon: true,
      usageLimit: "1000",
      usedCount: "347",
      color: "#ef4444",
      description: "Descuento especial de Black Friday para todas las compras",
    },
    {
      id: "disc-002",
      sucursalId: "suc-001",
      name: "Cliente Frecuente",
      code: "VIPCLIENTE",
      type: "percentage",
      value: "10",
      applicationType: "customer",
      enabled: true,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      minAmount: "0",
      maxDiscount: "50",
      stackable: true,
      autoApply: true,
      requiresCoupon: false,
      usageLimit: "0",
      usedCount: "1245",
      color: "#8b5cf6",
      description: "Descuento automático para clientes VIP",
    },
    {
      id: "disc-003",
      sucursalId: "suc-001",
      name: "Descuento por Volumen",
      code: "VOLUMEN100",
      type: "fixed",
      value: "15",
      applicationType: "general",
      enabled: true,
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      minAmount: "100",
      maxDiscount: "15",
      stackable: true,
      autoApply: true,
      requiresCoupon: false,
      usageLimit: "0",
      usedCount: "523",
      color: "#10b981",
      description: "Descuento de $15 en compras superiores a $100",
    },
    {
      id: "disc-004",
      sucursalId: "suc-001",
      name: "Liquidación Electrónica",
      code: "ELECTRO30",
      type: "percentage",
      value: "30",
      applicationType: "category",
      enabled: true,
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      minAmount: "0",
      maxDiscount: "200",
      stackable: false,
      autoApply: true,
      requiresCoupon: false,
      usageLimit: "500",
      usedCount: "87",
      color: "#f59e0b",
      description: "30% de descuento en toda la categoría de electrónica",
    },
    {
      id: "disc-005",
      sucursalId: "suc-002",
      name: "Inauguración Sucursal",
      code: "INAUG2026",
      type: "percentage",
      value: "15",
      applicationType: "general",
      enabled: true,
      startDate: "2026-03-01",
      endDate: "2026-03-15",
      minAmount: "30",
      maxDiscount: "50",
      stackable: false,
      autoApply: false,
      requiresCoupon: true,
      usageLimit: "300",
      usedCount: "142",
      color: "#E8692E",
      description: "Descuento especial por inauguración",
    },
  ]);

  const [formData, setFormData] = useState<Partial<Discount>>({
    name: "",
    code: "",
    type: "percentage",
    value: "",
    applicationType: "general",
    enabled: true,
    startDate: "",
    endDate: "",
    minAmount: "0",
    maxDiscount: "",
    stackable: false,
    autoApply: false,
    requiresCoupon: false,
    usageLimit: "0",
    usedCount: "0",
    color: "#ef4444",
    description: "",
  });

  const filteredDiscounts = discounts.filter(
    (discount) =>
      discount.sucursalId === selectedSucursal &&
      (discount.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discount.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (discount?: Discount) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData(discount);
    } else {
      setEditingDiscount(null);
      setFormData({
        name: "",
        code: "",
        type: "percentage",
        value: "",
        applicationType: "general",
        enabled: true,
        startDate: "",
        endDate: "",
        minAmount: "0",
        maxDiscount: "",
        stackable: false,
        autoApply: false,
        requiresCoupon: false,
        usageLimit: "0",
        usedCount: "0",
        color: "#ef4444",
        description: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDiscount(null);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.value) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (editingDiscount) {
      setDiscounts(
        discounts.map((discount) =>
          discount.id === editingDiscount.id
            ? { ...discount, ...formData }
            : discount
        )
      );
    } else {
      const newDiscount: Discount = {
        id: `disc-${Date.now()}`,
        sucursalId: selectedSucursal,
        ...formData as Discount,
      };
      setDiscounts([...discounts, newDiscount]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este descuento?")) {
      setDiscounts(discounts.filter((discount) => discount.id !== id));
    }
  };

  const toggleEnabled = (id: string) => {
    setDiscounts(
      discounts.map((discount) =>
        discount.id === id ? { ...discount, enabled: !discount.enabled } : discount
      )
    );
  };

  const getApplicationTypeName = (type: string) => {
    return APPLICATION_TYPES.find((t) => t.id === type)?.name || type;
  };

  const isDiscountActive = (discount: Discount) => {
    const now = new Date();
    const start = new Date(discount.startDate);
    const end = new Date(discount.endDate);
    return now >= start && now <= end && discount.enabled;
  };

  const isDiscountExpired = (discount: Discount) => {
    const now = new Date();
    const end = new Date(discount.endDate);
    return now > end;
  };

  const getUsagePercentage = (discount: Discount) => {
    if (discount.usageLimit === "0") return 0;
    return (parseInt(discount.usedCount) / parseInt(discount.usageLimit)) * 100;
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header estándar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-primary" />
            Descuentos y Promociones
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona los descuentos activos y promociones disponibles
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Descuento
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
          <label className="block text-white font-medium mb-3">Buscar descuento</label>
          <input
            type="text"
            placeholder="Nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Lista de descuentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredDiscounts.length === 0 ? (
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No hay descuentos configurados</p>
            <p className="text-gray-500 text-sm">
              Agrega un nuevo descuento para esta sucursal
            </p>
          </div>
        ) : (
          filteredDiscounts.map((discount) => {
            const isActive = isDiscountActive(discount);
            const isExpired = isDiscountExpired(discount);
            const usagePercentage = getUsagePercentage(discount);
            const isLimitReached = discount.usageLimit !== "0" && parseInt(discount.usedCount) >= parseInt(discount.usageLimit);

            return (
              <div
                key={discount.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all"
              >
                {/* Header de la tarjeta */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${discount.color}20`, border: `2px solid ${discount.color}` }}
                    >
                      {discount.type === "percentage" ? (
                        <Percent className="w-5 h-5" style={{ color: discount.color }} />
                      ) : (
                        <DollarSign className="w-5 h-5" style={{ color: discount.color }} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{discount.name}</h3>
                      <p className="text-gray-400 text-sm font-mono">{discount.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleEnabled(discount.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        discount.enabled ? "bg-primary" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          discount.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Valor del descuento */}
                <div className="mb-4 p-4 bg-[#0f1825]/50 rounded-xl">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-white">
                      {discount.type === "percentage" ? `${discount.value}%` : `$${parseFloat(discount.value).toFixed(2)}`}
                    </span>
                    <span className="text-gray-400 text-sm">de descuento</span>
                  </div>
                  <p className="text-gray-500 text-xs">{getApplicationTypeName(discount.applicationType)}</p>
                </div>

                {/* Información del descuento */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Periodo:</span>
                    <span className="text-white font-medium text-xs">
                      {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  {discount.minAmount !== "0" && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Compra mínima:</span>
                      <span className="text-white font-medium">${parseFloat(discount.minAmount).toFixed(2)}</span>
                    </div>
                  )}

                  {discount.usageLimit !== "0" && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Uso:</span>
                        <span className="text-white font-medium">
                          {discount.usedCount} / {discount.usageLimit}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isLimitReached ? "bg-red-500" : "bg-primary"
                          }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {discount.usageLimit === "0" && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Uso:</span>
                      <span className="text-white font-medium">{discount.usedCount} veces (ilimitado)</span>
                    </div>
                  )}
                </div>

                {/* Estado y características */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {isActive && !isLimitReached && (
                    <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-medium">
                      ✓ Activo
                    </span>
                  )}
                  {isExpired && (
                    <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                      Expirado
                    </span>
                  )}
                  {isLimitReached && (
                    <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-xs font-medium">
                      Límite alcanzado
                    </span>
                  )}
                  {!discount.enabled && (
                    <span className="px-2.5 py-1 bg-gray-500/10 border border-gray-500/20 text-gray-400 rounded-lg text-xs font-medium">
                      Deshabilitado
                    </span>
                  )}
                  {discount.autoApply && (
                    <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                      Auto-aplicable
                    </span>
                  )}
                  {discount.requiresCoupon && (
                    <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-xs font-medium">
                      Requiere cupón
                    </span>
                  )}
                  {discount.stackable && (
                    <span className="px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg text-xs font-medium">
                      Acumulable
                    </span>
                  )}
                </div>

                {/* Descripción */}
                {discount.description && (
                  <p className="text-gray-400 text-xs mb-4 line-clamp-2">{discount.description}</p>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleOpenModal(discount)}
                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Pencil className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(discount.id)}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resumen de descuentos */}
      {filteredDiscounts.length > 0 && (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            Resumen de Descuentos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total de descuentos</p>
              <p className="text-white font-bold text-2xl">{filteredDiscounts.length}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Descuentos activos</p>
              <p className="text-green-400 font-bold text-2xl">
                {filteredDiscounts.filter((d) => isDiscountActive(d) && !isDiscountExpired(d)).length}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Descuentos expirados</p>
              <p className="text-red-400 font-bold text-2xl">
                {filteredDiscounts.filter((d) => isDiscountExpired(d)).length}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total de usos</p>
              <p className="text-primary font-bold text-2xl">
                {filteredDiscounts.reduce((sum, d) => sum + parseInt(d.usedCount), 0)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de agregar/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">
                {editingDiscount ? "Editar Descuento" : "Nuevo Descuento"}
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
              {/* Nombre y código */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Nombre del descuento <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Black Friday, Cliente VIP..."
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Código <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: BLACKFRIDAY26"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Tipo y Valor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Tipo de descuento
                  </label>
                  <select
                    value={formData.type || "percentage"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    {DISCOUNT_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    {formData.type === "percentage" ? "Porcentaje (%)" : "Valor ($)"}{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={formData.type === "percentage" ? "25" : "15.00"}
                    value={formData.value || ""}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Tipo de aplicación */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Aplicar a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {APPLICATION_TYPES.map((appType) => (
                    <button
                      key={appType.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, applicationType: appType.id as any })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        formData.applicationType === appType.id
                          ? "border-primary bg-primary/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {appType.icon}
                        <span className="text-white font-medium text-sm">{appType.name}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{appType.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Restricciones */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Monto mínimo de compra ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.minAmount || "0"}
                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Descuento máximo ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Sin límite"
                    value={formData.maxDiscount || ""}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Límite de uso */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Límite de uso (0 = ilimitado)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.usageLimit || "0"}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Color de identificación
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? "border-white scale-110"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {formData.color === color.value && (
                        <Check className="w-5 h-5 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Descripción
                </label>
                <textarea
                  placeholder="Descripción opcional del descuento..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
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
                    <span className="text-white font-medium">Descuento habilitado</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Activar este descuento para que esté disponible
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.autoApply || false}
                      onChange={(e) => setFormData({ ...formData, autoApply: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.autoApply && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Aplicar automáticamente</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      El descuento se aplica sin necesidad de código
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.requiresCoupon || false}
                      onChange={(e) => setFormData({ ...formData, requiresCoupon: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.requiresCoupon && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Requiere cupón</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      El cliente debe ingresar el código para aplicar el descuento
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.stackable || false}
                      onChange={(e) => setFormData({ ...formData, stackable: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.stackable && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Acumulable con otros descuentos</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Permite combinar este descuento con otros
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
                {editingDiscount ? "Guardar Cambios" : "Crear Descuento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}