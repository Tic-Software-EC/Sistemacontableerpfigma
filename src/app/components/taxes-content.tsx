import { useState } from "react";
import { Calculator, Building2, Plus, Pencil, Trash2, Percent, DollarSign, Check, X } from "lucide-react";

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

interface Tax {
  id: string;
  sucursalId: string;
  name: string;
  code: string;
  type: "percentage" | "fixed";
  rate: string;
  isIncludedInPrice: boolean;
  isDefault: boolean;
  enabled: boolean;
  accountingAccount: string;
  applicableToProducts: boolean;
  applicableToServices: boolean;
  color: string;
  description: string;
}

const TAX_TYPES = [
  { id: "percentage", name: "Porcentaje (%)", icon: <Percent className="w-4 h-4" /> },
  { id: "fixed", name: "Valor Fijo ($)", icon: <DollarSign className="w-4 h-4" /> },
];

const COLORS = [
  { id: "blue", name: "Azul", value: "#3b82f6" },
  { id: "green", name: "Verde", value: "#10b981" },
  { id: "purple", name: "Morado", value: "#8b5cf6" },
  { id: "orange", name: "Naranja", value: "#E8692E" },
  { id: "yellow", name: "Amarillo", value: "#f59e0b" },
  { id: "red", name: "Rojo", value: "#ef4444" },
  { id: "pink", name: "Rosa", value: "#ec4899" },
  { id: "indigo", name: "Índigo", value: "#6366f1" },
];

export function TaxesContent() {
  const [selectedSucursal, setSelectedSucursal] = useState<string>("suc-001");
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [taxes, setTaxes] = useState<Tax[]>([
    {
      id: "tax-001",
      sucursalId: "suc-001",
      name: "IVA",
      code: "IVA-12",
      type: "percentage",
      rate: "12",
      isIncludedInPrice: false,
      isDefault: true,
      enabled: true,
      accountingAccount: "2103-001",
      applicableToProducts: true,
      applicableToServices: true,
      color: "#3b82f6",
      description: "Impuesto al Valor Agregado del 12%",
    },
    {
      id: "tax-002",
      sucursalId: "suc-001",
      name: "IVA 0%",
      code: "IVA-0",
      type: "percentage",
      rate: "0",
      isIncludedInPrice: false,
      isDefault: false,
      enabled: true,
      accountingAccount: "2103-002",
      applicableToProducts: true,
      applicableToServices: true,
      color: "#10b981",
      description: "Productos y servicios con tarifa 0%",
    },
    {
      id: "tax-003",
      sucursalId: "suc-001",
      name: "ICE - Bebidas Alcohólicas",
      code: "ICE-BA",
      type: "percentage",
      rate: "75",
      isIncludedInPrice: false,
      isDefault: false,
      enabled: true,
      accountingAccount: "2104-001",
      applicableToProducts: true,
      applicableToServices: false,
      color: "#f59e0b",
      description: "Impuesto a Consumos Especiales para bebidas alcohólicas",
    },
    {
      id: "tax-004",
      sucursalId: "suc-001",
      name: "IRBPNR",
      code: "IRBPNR-2",
      type: "percentage",
      rate: "2",
      isIncludedInPrice: false,
      isDefault: false,
      enabled: true,
      accountingAccount: "2105-001",
      applicableToProducts: false,
      applicableToServices: true,
      color: "#8b5cf6",
      description: "Impuesto a la Renta para no residentes",
    },
    {
      id: "tax-005",
      sucursalId: "suc-002",
      name: "IVA",
      code: "IVA-12",
      type: "percentage",
      rate: "12",
      isIncludedInPrice: false,
      isDefault: true,
      enabled: true,
      accountingAccount: "2103-001",
      applicableToProducts: true,
      applicableToServices: true,
      color: "#3b82f6",
      description: "Impuesto al Valor Agregado del 12%",
    },
    {
      id: "tax-006",
      sucursalId: "suc-002",
      name: "IVA 0%",
      code: "IVA-0",
      type: "percentage",
      rate: "0",
      isIncludedInPrice: false,
      isDefault: false,
      enabled: true,
      accountingAccount: "2103-002",
      applicableToProducts: true,
      applicableToServices: true,
      color: "#10b981",
      description: "Productos y servicios con tarifa 0%",
    },
  ]);

  const [formData, setFormData] = useState<Partial<Tax>>({
    name: "",
    code: "",
    type: "percentage",
    rate: "",
    isIncludedInPrice: false,
    isDefault: false,
    enabled: true,
    accountingAccount: "",
    applicableToProducts: true,
    applicableToServices: true,
    color: "#3b82f6",
    description: "",
  });

  const filteredTaxes = taxes.filter(
    (tax) =>
      tax.sucursalId === selectedSucursal &&
      (tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tax.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (tax?: Tax) => {
    if (tax) {
      setEditingTax(tax);
      setFormData(tax);
    } else {
      setEditingTax(null);
      setFormData({
        name: "",
        code: "",
        type: "percentage",
        rate: "",
        isIncludedInPrice: false,
        isDefault: false,
        enabled: true,
        accountingAccount: "",
        applicableToProducts: true,
        applicableToServices: true,
        color: "#3b82f6",
        description: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTax(null);
    setFormData({
      name: "",
      code: "",
      type: "percentage",
      rate: "",
      isIncludedInPrice: false,
      isDefault: false,
      enabled: true,
      accountingAccount: "",
      applicableToProducts: true,
      applicableToServices: true,
      color: "#3b82f6",
      description: "",
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.rate || !formData.accountingAccount) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    if (editingTax) {
      setTaxes(
        taxes.map((tax) =>
          tax.id === editingTax.id ? { ...tax, ...formData } : tax
        )
      );
    } else {
      const newTax: Tax = {
        id: `tax-${Date.now()}`,
        sucursalId: selectedSucursal,
        ...formData as Tax,
      };
      setTaxes([...taxes, newTax]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este impuesto?")) {
      setTaxes(taxes.filter((tax) => tax.id !== id));
    }
  };

  const toggleEnabled = (id: string) => {
    setTaxes(
      taxes.map((tax) =>
        tax.id === id ? { ...tax, enabled: !tax.enabled } : tax
      )
    );
  };

  const setAsDefault = (id: string) => {
    setTaxes(
      taxes.map((tax) =>
        tax.sucursalId === selectedSucursal
          ? { ...tax, isDefault: tax.id === id }
          : tax
      )
    );
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
            <Calculator className="w-8 h-8 text-primary" />
            Impuestos
          </h2>
          <p className="text-gray-400 text-sm">
            Configura los impuestos aplicables a ventas por sucursal
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Impuesto
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
          <label className="block text-white font-medium mb-3">Buscar impuesto</label>
          <input
            type="text"
            placeholder="Nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Lista de impuestos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTaxes.length === 0 ? (
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 mb-2">No hay impuestos configurados</p>
            <p className="text-gray-500 text-sm">
              Agrega un nuevo impuesto para esta sucursal
            </p>
          </div>
        ) : (
          filteredTaxes.map((tax) => (
            <div
              key={tax.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all"
            >
              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tax.color}20`, border: `2px solid ${tax.color}` }}
                  >
                    {tax.type === "percentage" ? (
                      <Percent className="w-5 h-5" style={{ color: tax.color }} />
                    ) : (
                      <DollarSign className="w-5 h-5" style={{ color: tax.color }} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{tax.name}</h3>
                    <p className="text-gray-400 text-sm">Código: {tax.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEnabled(tax.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      tax.enabled ? "bg-primary" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        tax.enabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Tasa del impuesto */}
              <div className="mb-4 p-4 bg-[#0f1825]/50 rounded-xl">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">
                    {tax.type === "percentage" ? `${tax.rate}%` : `$${parseFloat(tax.rate).toFixed(2)}`}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {tax.type === "percentage" ? "del total" : "por ítem"}
                  </span>
                </div>
              </div>

              {/* Información del impuesto */}
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Cuenta contable:</span>
                  <span className="text-white font-medium">{tax.accountingAccount}</span>
                </div>

                {tax.description && (
                  <div className="text-sm">
                    <span className="text-gray-400">Descripción:</span>
                    <p className="text-gray-300 text-xs mt-1">{tax.description}</p>
                  </div>
                )}
              </div>

              {/* Características */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tax.isDefault && (
                  <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-lg text-xs font-medium">
                    ⭐ Predeterminado
                  </span>
                )}
                {tax.isIncludedInPrice && (
                  <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-medium">
                    Incluido en precio
                  </span>
                )}
                {tax.applicableToProducts && (
                  <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-medium">
                    📦 Productos
                  </span>
                )}
                {tax.applicableToServices && (
                  <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-xs font-medium">
                    ⚙️ Servicios
                  </span>
                )}
                {!tax.enabled && (
                  <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                    Deshabilitado
                  </span>
                )}
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                {!tax.isDefault && tax.enabled && (
                  <button
                    onClick={() => setAsDefault(tax.id)}
                    className="flex-1 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    ⭐ Predeterminar
                  </button>
                )}
                <button
                  onClick={() => handleOpenModal(tax)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(tax.id)}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Información adicional */}
      {filteredTaxes.length > 0 && (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Resumen de Impuestos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Total de impuestos</p>
              <p className="text-white font-bold text-2xl">{filteredTaxes.length}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Impuestos activos</p>
              <p className="text-green-400 font-bold text-2xl">
                {filteredTaxes.filter((t) => t.enabled).length}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Impuesto predeterminado</p>
              <p className="text-primary font-bold text-lg">
                {filteredTaxes.find((t) => t.isDefault)?.name || "Ninguno"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de agregar/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">
                {editingTax ? "Editar Impuesto" : "Nuevo Impuesto"}
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
                    Nombre del impuesto <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: IVA, ICE, IRBPNR..."
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
                    placeholder="Ej: IVA-12, ICE-BA..."
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Tipo y Tasa */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Tipo de impuesto
                  </label>
                  <select
                    value={formData.type || "percentage"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    {TAX_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    {formData.type === "percentage" ? "Tasa (%)" : "Valor ($)"}{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={formData.type === "percentage" ? "12" : "0.50"}
                    value={formData.rate || ""}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Cuenta contable */}
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Cuenta contable <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: 2103-001"
                  value={formData.accountingAccount || ""}
                  onChange={(e) => setFormData({ ...formData, accountingAccount: e.target.value })}
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
                  placeholder="Descripción opcional del impuesto..."
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
                    <span className="text-white font-medium">Impuesto habilitado</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Permitir usar este impuesto en las ventas
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.isDefault || false}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.isDefault && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Establecer como predeterminado</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Este impuesto se aplicará automáticamente en las ventas
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.isIncludedInPrice || false}
                      onChange={(e) => setFormData({ ...formData, isIncludedInPrice: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.isIncludedInPrice && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Incluido en el precio</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      El impuesto ya está incluido en el precio del producto
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.applicableToProducts || false}
                      onChange={(e) => setFormData({ ...formData, applicableToProducts: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.applicableToProducts && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Aplicable a productos</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Este impuesto se puede aplicar a productos físicos
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.applicableToServices || false}
                      onChange={(e) => setFormData({ ...formData, applicableToServices: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:border-primary peer-checked:bg-primary transition-colors flex items-center justify-center">
                      {formData.applicableToServices && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-medium">Aplicable a servicios</span>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Este impuesto se puede aplicar a servicios
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
                {editingTax ? "Guardar Cambios" : "Crear Impuesto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
