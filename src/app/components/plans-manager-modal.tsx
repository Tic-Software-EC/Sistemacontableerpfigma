import { useState } from "react";
import {
  X,
  Plus,
  Edit,
  Eye,
  Package,
  Users,
  Building2,
  CreditCard,
  Percent,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { PLAN_CONFIGS } from "../config/plans";
import { PlanViewModal } from "./plan-view-modal";
import { toast } from "sonner";

interface PlanData {
  name: string;
  displayName: string;
  price: number;
  maxUsers: number;
  maxBranches: number;
  maxCashRegisters: number;
  description: string;
  annualDiscountPercent?: number;
}

interface PlansManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlansManagerModal({ isOpen, onClose }: PlansManagerModalProps) {
  const { theme } = useTheme();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);

  // Convertir PLAN_CONFIGS a array de planes
  const [plans, setPlans] = useState<PlanData[]>([
    {
      name: "free",
      displayName: PLAN_CONFIGS.free.displayName,
      price: PLAN_CONFIGS.free.price,
      maxUsers: PLAN_CONFIGS.free.maxUsers,
      maxBranches: PLAN_CONFIGS.free.maxBranches,
      maxCashRegisters: PLAN_CONFIGS.free.maxCashRegisters,
      description: PLAN_CONFIGS.free.description,
      annualDiscountPercent: PLAN_CONFIGS.free.annualDiscountPercent || 0,
    },
    {
      name: "standard",
      displayName: PLAN_CONFIGS.standard.displayName,
      price: PLAN_CONFIGS.standard.price,
      maxUsers: PLAN_CONFIGS.standard.maxUsers,
      maxBranches: PLAN_CONFIGS.standard.maxBranches,
      maxCashRegisters: PLAN_CONFIGS.standard.maxCashRegisters,
      description: PLAN_CONFIGS.standard.description,
      annualDiscountPercent: PLAN_CONFIGS.standard.annualDiscountPercent || 0,
    },
    {
      name: "custom",
      displayName: PLAN_CONFIGS.custom.displayName,
      price: PLAN_CONFIGS.custom.price,
      maxUsers: PLAN_CONFIGS.custom.maxUsers,
      maxBranches: PLAN_CONFIGS.custom.maxBranches,
      maxCashRegisters: PLAN_CONFIGS.custom.maxCashRegisters,
      description: PLAN_CONFIGS.custom.description,
      annualDiscountPercent: PLAN_CONFIGS.custom.annualDiscountPercent || 0,
    },
  ]);

  const [editFormData, setEditFormData] = useState<PlanData | null>(null);

  if (!isOpen) return null;

  const handleEditPlan = (plan: PlanData) => {
    setSelectedPlan(plan);
    setEditFormData({ ...plan });
    setShowEditModal(true);
  };

  const handleSavePlan = () => {
    if (!editFormData) return;

    setPlans(
      plans.map((p) => (p.name === editFormData.name ? editFormData : p))
    );

    // Aquí guardarías en localStorage o backend
    console.log("Plan actualizado:", editFormData);
    toast.success(`Plan "${editFormData.displayName}" actualizado exitosamente`);

    setShowEditModal(false);
    setEditFormData(null);
    setSelectedPlan(null);
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "free":
        return "bg-gray-700 text-gray-300 border-gray-600";
      case "standard":
        return "bg-[#3d2817] text-[#E8692E] border-[#E8692E]/40";
      case "custom":
        return "bg-[#0d3d4a] text-cyan-400 border-cyan-500/40";
      default:
        return "bg-gray-700 text-gray-300 border-gray-600";
    }
  };

  return (
    <>
      {/* Modal Principal de Gestión de Planes */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
          className={`w-full max-w-2xl border rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-[#1a2332] border-white/10"
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${
              theme === "light"
                ? "border-gray-200 bg-gray-50"
                : "border-white/10 bg-[#232d3f]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3
                  className={`font-bold text-lg ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  Gestionar Planes de Suscripción
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Configura los límites y precios de cada plan
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === "light"
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`border rounded-xl overflow-hidden ${
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-[#232d3f] border-white/10"
                  }`}
                >
                  {/* Plan Header */}
                  <div
                    className={`px-6 py-4 border-b ${
                      theme === "light"
                        ? "border-gray-200 bg-gray-50"
                        : "border-white/10 bg-[#1a2332]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium border ${getPlanColor(
                          plan.name
                        )}`}
                      >
                        {plan.displayName}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedPlan(plan);
                            setShowViewModal(true);
                          }}
                          className={`p-1.5 rounded-md transition-colors ${
                            theme === "light"
                              ? "text-gray-600 hover:bg-gray-100"
                              : "text-gray-400 hover:bg-white/5"
                          }`}
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Editar plan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Precio y Descuento en la misma línea */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-3xl font-bold ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}
                        >
                          ${plan.price}
                        </span>
                        <span
                          className={`text-sm ${
                            theme === "light" ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          /mes
                        </span>
                      </div>
                      
                      {plan.annualDiscountPercent && plan.annualDiscountPercent > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-lg border border-green-500/20">
                          <Percent className="w-3.5 h-3.5 text-green-500" />
                          <span
                            className={`text-xs font-semibold ${
                              theme === "light" ? "text-green-700" : "text-green-400"
                            }`}
                          >
                            {plan.annualDiscountPercent}% anual
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="p-6 space-y-4">
                    <p
                      className={`text-sm ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {plan.description}
                    </p>

                    <div className="space-y-3">
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          theme === "light"
                            ? "bg-gray-50"
                            : "bg-[#0f1621]"
                        }`}
                      >
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p
                            className={`text-xs ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            Usuarios
                          </p>
                          <p
                            className={`font-semibold ${
                              theme === "light" ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {plan.maxUsers}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          theme === "light"
                            ? "bg-gray-50"
                            : "bg-[#0f1621]"
                        }`}
                      >
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Building2 className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <p
                            className={`text-xs ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            Sucursales
                          </p>
                          <p
                            className={`font-semibold ${
                              theme === "light" ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {plan.maxBranches}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          theme === "light"
                            ? "bg-gray-50"
                            : "bg-[#0f1621]"
                        }`}
                      >
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <CreditCard className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <p
                            className={`text-xs ${
                              theme === "light"
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            Cajas
                          </p>
                          <p
                            className={`font-semibold ${
                              theme === "light" ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {plan.maxCashRegisters}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
              theme === "light"
                ? "border-gray-200 bg-gray-50"
                : "border-white/10 bg-[#1a2332]"
            }`}
          >
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Plan */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div
            className={`w-full max-w-2xl border rounded-xl shadow-2xl ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-[#1a2332] border-white/10"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${
                theme === "light"
                  ? "border-gray-200 bg-gray-50"
                  : "border-white/10 bg-[#232d3f]"
              }`}
            >
              <div>
                <h3
                  className={`font-bold text-lg ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  Editar Plan {editFormData.displayName}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Configura los límites y precio del plan
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData(null);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "light"
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div
              className={`p-6 space-y-4 ${
                theme === "light" ? "bg-white" : "bg-[#232d3f]"
              }`}
            >
              {/* Precio Mensual y Descuento Anual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Precio Mensual */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Precio Mensual (USD)
                  </label>
                  <div className="relative">
                    <span
                      className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editFormData.price}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className={`w-full pl-8 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-400"
                          : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Descuento Anual (>12 meses) */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Descuento Anual (&gt;12 meses)
                  </label>
                  <div className="relative">
                    <Percent
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    />
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={editFormData.annualDiscountPercent || 0}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          annualDiscountPercent: parseInt(e.target.value) || 0,
                        })
                      }
                      className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                        theme === "light"
                          ? "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-400"
                          : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                      }`}
                      placeholder="0"
                    />
                  </div>
                  <p
                    className={`text-xs mt-1.5 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    % para suscripciones anuales
                  </p>
                </div>
              </div>

              {/* Usuarios Máximos */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  Usuarios Máximos
                </label>
                <div className="relative">
                  <Users
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="number"
                    min="1"
                    value={editFormData.maxUsers}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        maxUsers: parseInt(e.target.value) || 1,
                      })
                    }
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      theme === "light"
                        ? "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-400"
                        : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                    }`}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Sucursales Máximas */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  Sucursales Máximas
                </label>
                <div className="relative">
                  <Building2
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="number"
                    min="1"
                    value={editFormData.maxBranches}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        maxBranches: parseInt(e.target.value) || 1,
                      })
                    }
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      theme === "light"
                        ? "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-400"
                        : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                    }`}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Cajas Máximas */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  Cajas Máximas
                </label>
                <div className="relative">
                  <CreditCard
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="number"
                    min="1"
                    value={editFormData.maxCashRegisters}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        maxCashRegisters: parseInt(e.target.value) || 1,
                      })
                    }
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 ${
                      theme === "light"
                        ? "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-400"
                        : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                    }`}
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  Descripción
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-primary/50 resize-none ${
                    theme === "light"
                      ? "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-400"
                      : "bg-[#3d4f61] border-[#4a5f75] text-white placeholder:text-gray-500"
                  }`}
                  placeholder="Plan gratuito para comenzar"
                />
              </div>

              {/* Vista Previa */}
              <div
                className={`border rounded-lg p-4 ${
                  theme === "light"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-[#0f1621] border-white/10"
                }`}
              >
                <p
                  className={`text-xs mb-3 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Vista previa:
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      theme === "light"
                        ? "bg-gray-200 text-gray-900"
                        : "bg-[#3d4f61] text-white"
                    }`}
                  >
                    ${editFormData.price}/mes
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      theme === "light"
                        ? "bg-gray-200 text-gray-900"
                        : "bg-[#3d4f61] text-white"
                    }`}
                  >
                    {editFormData.maxUsers} usuarios
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      theme === "light"
                        ? "bg-gray-200 text-gray-900"
                        : "bg-[#3d4f61] text-white"
                    }`}
                  >
                    {editFormData.maxBranches} sucursales
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      theme === "light"
                        ? "bg-gray-200 text-gray-900"
                        : "bg-[#3d4f61] text-white"
                    }`}
                  >
                    {editFormData.maxCashRegisters} cajas
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
                theme === "light"
                  ? "border-gray-200 bg-gray-50"
                  : "border-white/10 bg-[#1a2332]"
              }`}
            >
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData(null);
                }}
                className={`px-6 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 text-sm font-medium flex items-center gap-2"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Vista de Plan */}
      {showViewModal && selectedPlan && (
        <PlanViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          plan={selectedPlan}
        />
      )}
    </>
  );
}