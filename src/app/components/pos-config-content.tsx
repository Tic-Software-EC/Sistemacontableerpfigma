import { useState } from "react";
import { ShoppingCart, Lock, Building2, Edit2, Plus, Check, AlertTriangle, Info, X, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router";

interface PosConfigContentProps {
  userPlan?: string;
}

interface BranchPOSConfig {
  id: string;
  branchName: string;
  branchCode: string;
  branchAddress: string;
  branchPhone: string;
  enablePOS: boolean;
  autoOpenCashRegister: boolean;
  printReceipt: boolean;
  requireCustomer: boolean;
  allowDiscount: boolean;
  maxDiscount: string;
  defaultPaymentMethod: string;
  quickSale: boolean;
  multiplePaymentMethods: boolean;
  loyaltyProgram: boolean;
  inventoryIntegration: boolean;
  advancedReports: boolean;
}

// Simulación de TODAS las sucursales parametrizadas en el sistema
// En producción, esto vendría de una API o módulo de parametrización
const getAllSystemBranches = () => {
  const systemBranches = localStorage.getItem('allSystemBranches');
  
  if (systemBranches) {
    return JSON.parse(systemBranches);
  }

  // Sucursales completas parametrizadas en el sistema (todas las que existen en la empresa)
  const allBranches = [
    {
      id: "branch-1",
      branchName: "Matriz - Centro",
      branchCode: "MTZ-001",
      branchAddress: "Av. Amazonas N24-03 y Colón",
      branchPhone: "+593 2 234 5678",
    },
    {
      id: "branch-2",
      branchName: "Sucursal Norte",
      branchCode: "NRT-002",
      branchAddress: "Av. La Prensa N47-126 y De las Hortensias",
      branchPhone: "+593 2 345 6789",
    },
    {
      id: "branch-3",
      branchName: "Sucursal Sur",
      branchCode: "SUR-003",
      branchAddress: "Av. Maldonado S14-59 y Rumipamba",
      branchPhone: "+593 2 456 7890",
    },
    {
      id: "branch-4",
      branchName: "Sucursal Valle",
      branchCode: "VLL-004",
      branchAddress: "Av. Interoceánica Km 12.5",
      branchPhone: "+593 2 567 8901",
    },
    {
      id: "branch-5",
      branchName: "Sucursal Centro Comercial",
      branchCode: "CCA-005",
      branchAddress: "CC El Recreo, Local 234",
      branchPhone: "+593 2 678 9012",
    },
    {
      id: "branch-6",
      branchName: "Sucursal Cumbayá",
      branchCode: "CMB-006",
      branchAddress: "Av. San Juan de Cumbayá, Pasaje E10",
      branchPhone: "+593 2 789 0123",
    },
    {
      id: "branch-7",
      branchName: "Sucursal Aeropuerto",
      branchCode: "AER-007",
      branchAddress: "Terminal Aeropuerto Mariscal Sucre, Local 45",
      branchPhone: "+593 2 890 1234",
    },
    {
      id: "branch-8",
      branchName: "Sucursal Tumbaco",
      branchCode: "TMB-008",
      branchAddress: "Ruta Viva, Km 3.5",
      branchPhone: "+593 2 901 2345",
    },
  ];

  localStorage.setItem('allSystemBranches', JSON.stringify(allBranches));
  return allBranches;
};

// Simulación de sucursales parametrizadas en el sistema
// En producción, esto vendría de una API o contexto global
const getParameterizedBranches = (): BranchPOSConfig[] => {
  // Simular que se obtienen las sucursales desde localStorage o API
  const storedBranches = localStorage.getItem('systemBranches');
  
  if (storedBranches) {
    return JSON.parse(storedBranches);
  }

  // Datos iniciales de ejemplo (sucursales ya parametrizadas en el sistema CON configuración de POS)
  const defaultBranches: BranchPOSConfig[] = [
    {
      id: "branch-1",
      branchName: "Matriz - Centro",
      branchCode: "MTZ-001",
      branchAddress: "Av. Amazonas N24-03 y Colón",
      branchPhone: "+593 2 234 5678",
      enablePOS: true,
      autoOpenCashRegister: true,
      printReceipt: true,
      requireCustomer: false,
      allowDiscount: true,
      maxDiscount: "20",
      defaultPaymentMethod: "efectivo",
      quickSale: true,
      multiplePaymentMethods: true,
      loyaltyProgram: false,
      inventoryIntegration: true,
      advancedReports: false,
    },
    {
      id: "branch-2",
      branchName: "Sucursal Norte",
      branchCode: "NRT-002",
      branchAddress: "Av. La Prensa N47-126 y De las Hortensias",
      branchPhone: "+593 2 345 6789",
      enablePOS: true,
      autoOpenCashRegister: false,
      printReceipt: true,
      requireCustomer: true,
      allowDiscount: true,
      maxDiscount: "15",
      defaultPaymentMethod: "tarjeta",
      quickSale: true,
      multiplePaymentMethods: false,
      loyaltyProgram: false,
      inventoryIntegration: true,
      advancedReports: false,
    },
  ];

  // Guardar en localStorage para persistencia temporal
  localStorage.setItem('systemBranches', JSON.stringify(defaultBranches));
  return defaultBranches;
};

export function PosConfigContent({ userPlan = "Plan Básico" }: PosConfigContentProps) {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [editingBranch, setEditingBranch] = useState<string | null>(null);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [selectedBranchesIds, setSelectedBranchesIds] = useState<string[]>([]);

  // Determinar características disponibles por plan
  const isProfessional = userPlan === "Plan Profesional" || userPlan === "Plan Empresarial";
  const isEnterprise = userPlan === "Plan Empresarial";

  // Límites de POS por plan
  const getPOSLimit = () => {
    if (userPlan === "Plan Básico") return 2;
    if (userPlan === "Plan Profesional") return 5;
    if (userPlan === "Plan Empresarial") return 999; // Ilimitado
    return 2;
  };

  const posLimit = getPOSLimit();

  // Lista de sucursales con configuración de POS
  const [branches, setBranches] = useState<BranchPOSConfig[]>(getParameterizedBranches());

  const [formData, setFormData] = useState<BranchPOSConfig | null>(null);

  // Contador de POS activos
  const activePOSCount = branches.filter(b => b.enablePOS).length;
  const hasReachedLimit = activePOSCount >= posLimit;
  const isNearLimit = activePOSCount >= posLimit - 1 && posLimit !== 999;

  // Obtener todas las sucursales del sistema
  const allSystemBranches = getAllSystemBranches();
  
  // Filtrar sucursales que ya tienen configuración de POS
  const branchesWithoutPOS = allSystemBranches.filter(
    (systemBranch) => !branches.find(b => b.id === systemBranch.id)
  );

  const handleEditBranch = (branch: BranchPOSConfig) => {
    setEditingBranch(branch.id);
    setFormData({ ...branch });
    setSelectedBranch(branch.id);
  };

  const toggleBranchSelection = (branchId: string) => {
    setSelectedBranchesIds((prev) => {
      if (prev.includes(branchId)) {
        return prev.filter(id => id !== branchId);
      } else {
        return [...prev, branchId];
      }
    });
  };

  const handleAddSelectedBranches = () => {
    if (selectedBranchesIds.length === 0) {
      alert("Por favor selecciona al menos una sucursal");
      return;
    }

    // Verificar si se excedería el límite
    const newActivePOSCount = activePOSCount + selectedBranchesIds.length;
    if (newActivePOSCount > posLimit && posLimit !== 999) {
      alert(`No puedes agregar ${selectedBranchesIds.length} sucursales. Tu plan permite máximo ${posLimit} POS y ya tienes ${activePOSCount} activos.`);
      return;
    }

    // Crear configuración de POS para las sucursales seleccionadas
    const newBranches = selectedBranchesIds.map((branchId) => {
      const systemBranch = allSystemBranches.find(b => b.id === branchId);
      if (!systemBranch) return null;

      const newBranch: BranchPOSConfig = {
        id: systemBranch.id,
        branchName: systemBranch.branchName,
        branchCode: systemBranch.branchCode,
        branchAddress: systemBranch.branchAddress,
        branchPhone: systemBranch.branchPhone,
        enablePOS: false, // Por defecto inactivo
        autoOpenCashRegister: false,
        printReceipt: true,
        requireCustomer: false,
        allowDiscount: true,
        maxDiscount: "10",
        defaultPaymentMethod: "efectivo",
        quickSale: true,
        multiplePaymentMethods: false,
        loyaltyProgram: false,
        inventoryIntegration: false,
        advancedReports: false,
      };
      return newBranch;
    }).filter(Boolean) as BranchPOSConfig[];

    setBranches([...branches, ...newBranches]);
    
    // Guardar en localStorage
    localStorage.setItem('systemBranches', JSON.stringify([...branches, ...newBranches]));
    
    setShowAddBranchModal(false);
    setSelectedBranchesIds([]);
    alert(`${newBranches.length} sucursal(es) agregada(s) exitosamente. Puedes configurar su POS ahora.`);
  };

  const handleCloseModal = () => {
    setShowAddBranchModal(false);
    setSelectedBranchesIds([]);
  };

  const handleSaveBranch = () => {
    if (formData) {
      // Verificar si se está intentando activar un POS cuando ya se alcanzó el límite
      const originalBranch = branches.find(b => b.id === formData.id);
      if (formData.enablePOS && !originalBranch?.enablePOS && hasReachedLimit) {
        alert(`Has alcanzado el límite de ${posLimit} POS activos para tu plan ${userPlan}. Desactiva un POS existente o actualiza tu plan.`);
        return;
      }

      setBranches(branches.map(b => b.id === formData.id ? formData : b));
      setEditingBranch(null);
      setFormData(null);
      alert("Configuración de POS guardada exitosamente");
    }
  };

  const handleCancelEdit = () => {
    setEditingBranch(null);
    setFormData(null);
    setSelectedBranch(null);
  };

  const updateFormData = (field: keyof BranchPOSConfig, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const LockedFeature = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3 p-4 bg-[#0f1825]/30 rounded-xl opacity-50 cursor-not-allowed">
      <div className="w-5 h-5 border-2 border-white/10 rounded flex items-center justify-center">
        <Lock className="w-3 h-3 text-gray-500" />
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header con icono de 8x8 naranja, título en negrita 3xl, descripción en gris y línea separadora */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-8 h-8 text-primary" />
          <h2 className="text-white font-bold text-3xl">Configurar POS</h2>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Gestiona la configuración del punto de venta por sucursal • <span className="text-primary font-medium">{userPlan}</span>
        </p>
        <div className="border-t border-white/10"></div>
      </div>

      {/* Contador de POS activos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">POS Activos</p>
              <p className="text-white font-bold text-2xl">{activePOSCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">Límite del Plan</p>
              <p className="text-white font-bold text-2xl">
                {posLimit === 999 ? "Ilimitado" : posLimit}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs mb-1">POS Disponibles</p>
              <p className={`font-bold text-2xl ${hasReachedLimit ? 'text-red-400' : 'text-white'}`}>
                {posLimit === 999 ? "Ilimitado" : Math.max(0, posLimit - activePOSCount)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              hasReachedLimit ? 'bg-red-500/20' : 'bg-blue-500/20'
            }`}>
              {hasReachedLimit ? (
                <AlertTriangle className="w-6 h-6 text-red-400" />
              ) : (
                <Info className="w-6 h-6 text-blue-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de límite alcanzado */}
      {hasReachedLimit && posLimit !== 999 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium text-sm">
                Has alcanzado el límite de POS para tu plan
              </p>
              <p className="text-red-400/80 text-xs mt-1">
                Tu plan {userPlan} permite hasta {posLimit} POS activos. Para activar más puntos de venta, actualiza tu plan o desactiva algún POS existente.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta cerca del límite */}
      {isNearLimit && !hasReachedLimit && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium text-sm">
                Estás cerca del límite de POS
              </p>
              <p className="text-yellow-400/80 text-xs mt-1">
                Solo puedes activar {posLimit - activePOSCount} POS más con tu plan actual. Considera actualizar tu plan para obtener más licencias.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de sucursales */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-xl">Sucursales ({branches.length})</h3>
            <button 
              onClick={() => setShowAddBranchModal(true)}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Sucursal
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sucursal</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Estado POS</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Venta Rápida</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Impresión Auto</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Descuento Máx.</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Método Pago</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {branches.map((branch) => (
                <tr key={branch.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-white font-medium text-sm">{branch.branchName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {branch.enablePOS ? (
                      <span className="inline-flex items-center px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {branch.quickSale ? (
                      <Check className="w-4 h-4 text-green-400 mx-auto" />
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {branch.printReceipt ? (
                      <Check className="w-4 h-4 text-green-400 mx-auto" />
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-white text-sm">{branch.maxDiscount}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-gray-300 text-sm capitalize">{branch.defaultPaymentMethod}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleEditBranch(branch)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors text-xs font-medium"
                    >
                      <Edit2 className="w-3 h-3" />
                      Configurar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario de edición */}
      {editingBranch && formData && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Configuración POS</h3>
                <p className="text-gray-400 text-sm">{formData.branchName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveBranch}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium text-sm"
              >
                Guardar Cambios
              </button>
            </div>
          </div>

          {/* Configuración General */}
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Configuración General</h4>
              <div className="space-y-5">
                {/* Habilitar POS - Disponible en todos los planes pero con límite */}
                <label className={`flex items-center gap-3 p-4 bg-[#0f1825]/50 rounded-xl transition-colors ${
                  !formData.enablePOS && hasReachedLimit 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer group hover:bg-[#0f1825]'
                }`}>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.enablePOS}
                      onChange={(e) => {
                        if (!e.target.checked || !hasReachedLimit || formData.enablePOS) {
                          updateFormData("enablePOS", e.target.checked);
                        }
                      }}
                      disabled={!formData.enablePOS && hasReachedLimit}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center peer-disabled:opacity-50">
                      {formData.enablePOS && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">Habilitar Punto de Venta</span>
                      {!formData.enablePOS && hasReachedLimit && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Límite alcanzado</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {!formData.enablePOS && hasReachedLimit 
                        ? `Has alcanzado el límite de ${posLimit} POS activos` 
                        : 'Activa el módulo POS para esta sucursal'}
                    </p>
                  </div>
                </label>

                {/* Imprimir ticket - Disponible en todos los planes */}
                <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.printReceipt}
                      onChange={(e) => updateFormData("printReceipt", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.printReceipt && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-white font-medium">Imprimir ticket automáticamente</span>
                    <p className="text-gray-400 text-xs mt-0.5">Imprime el recibo después de cada venta</p>
                  </div>
                </label>

                {/* Venta rápida - Disponible en todos los planes */}
                <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.quickSale}
                      onChange={(e) => updateFormData("quickSale", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.quickSale && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-white font-medium">Modo venta rápida</span>
                    <p className="text-gray-400 text-xs mt-0.5">Permite completar ventas con un solo clic</p>
                  </div>
                </label>

                {/* Abrir caja automáticamente - Plan Profesional y Empresarial */}
                {isProfessional ? (
                  <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.autoOpenCashRegister}
                        onChange={(e) => updateFormData("autoOpenCashRegister", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                        {formData.autoOpenCashRegister && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-white font-medium">Abrir caja de dinero automáticamente</span>
                      <p className="text-gray-400 text-xs mt-0.5">La caja se abre al completar una venta</p>
                    </div>
                  </label>
                ) : (
                  <LockedFeature>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">Abrir caja de dinero automáticamente</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Plan Profesional</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">La caja se abre al completar una venta</p>
                    </div>
                  </LockedFeature>
                )}

                {/* Requerir cliente - Plan Profesional y Empresarial */}
                {isProfessional ? (
                  <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.requireCustomer}
                        onChange={(e) => updateFormData("requireCustomer", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                        {formData.requireCustomer && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-white font-medium">Requerir cliente en cada venta</span>
                      <p className="text-gray-400 text-xs mt-0.5">Obliga a seleccionar un cliente antes de finalizar</p>
                    </div>
                  </label>
                ) : (
                  <LockedFeature>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">Requerir cliente en cada venta</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Plan Profesional</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">Obliga a seleccionar un cliente antes de finalizar</p>
                    </div>
                  </LockedFeature>
                )}

                {/* Permitir descuentos - Disponible en todos los planes */}
                <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.allowDiscount}
                      onChange={(e) => updateFormData("allowDiscount", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                      {formData.allowDiscount && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-white font-medium">Permitir descuentos</span>
                    <p className="text-gray-400 text-xs mt-0.5">Habilita la aplicación de descuentos en el POS</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Configuración de descuentos y pagos */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Descuentos y Pagos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Descuento máximo permitido (%)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => updateFormData("maxDiscount", e.target.value)}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <p className="text-gray-500 text-xs mt-1">Porcentaje máximo de descuento por venta</p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Método de pago predeterminado
                  </label>
                  <select
                    value={formData.defaultPaymentMethod}
                    onChange={(e) => updateFormData("defaultPaymentMethod", e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta de crédito/débito</option>
                    <option value="transferencia">Transferencia bancaria</option>
                    <option value="cheque">Cheque</option>
                  </select>
                  <p className="text-gray-500 text-xs mt-1">Método seleccionado por defecto en el POS</p>
                </div>
              </div>
            </div>

            {/* Características Avanzadas */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-bold text-lg">Características Avanzadas</h4>
                {!isProfessional && (
                  <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full font-medium">
                    Requiere Plan Profesional o superior
                  </span>
                )}
              </div>

              <div className="space-y-5">
                {/* Métodos de pago múltiples - Plan Profesional y Empresarial */}
                {isProfessional ? (
                  <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.multiplePaymentMethods}
                        onChange={(e) => updateFormData("multiplePaymentMethods", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                        {formData.multiplePaymentMethods && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-white font-medium">Métodos de pago múltiples</span>
                      <p className="text-gray-400 text-xs mt-0.5">Permite seleccionar múltiples métodos de pago por venta</p>
                    </div>
                  </label>
                ) : (
                  <LockedFeature>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">Métodos de pago múltiples</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Plan Profesional</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">Permite seleccionar múltiples métodos de pago por venta</p>
                    </div>
                  </LockedFeature>
                )}

                {/* Integración de inventario - Plan Profesional y Empresarial */}
                {isProfessional ? (
                  <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.inventoryIntegration}
                        onChange={(e) => updateFormData("inventoryIntegration", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                        {formData.inventoryIntegration && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-white font-medium">Integración de inventario</span>
                      <p className="text-gray-400 text-xs mt-0.5">Sincroniza el inventario con el POS para un seguimiento preciso</p>
                    </div>
                  </label>
                ) : (
                  <LockedFeature>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">Integración de inventario</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Plan Profesional</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">Sincroniza el inventario con el POS para un seguimiento preciso</p>
                    </div>
                  </LockedFeature>
                )}

                {/* Programa de lealtad - Plan Empresarial */}
                {isEnterprise ? (
                  <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.loyaltyProgram}
                        onChange={(e) => updateFormData("loyaltyProgram", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                        {formData.loyaltyProgram && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-white font-medium">Programa de lealtad</span>
                      <p className="text-gray-400 text-xs mt-0.5">Habilita un programa de lealtad para recompensar a los clientes</p>
                    </div>
                  </label>
                ) : (
                  <LockedFeature>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">Programa de lealtad</span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Plan Empresarial</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">Habilita un programa de lealtad para recompensar a los clientes</p>
                    </div>
                  </LockedFeature>
                )}

                {/* Informes avanzados - Plan Empresarial */}
                {isEnterprise ? (
                  <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.advancedReports}
                        onChange={(e) => updateFormData("advancedReports", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                        {formData.advancedReports && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-white font-medium">Informes avanzados</span>
                      <p className="text-gray-400 text-xs mt-0.5">Genera informes detallados para análisis de ventas</p>
                    </div>
                  </label>
                ) : (
                  <LockedFeature>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">Informes avanzados</span>
                        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">Plan Empresarial</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5">Genera informes detallados para análisis de ventas</p>
                    </div>
                  </LockedFeature>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-blue-400 text-sm">
          <strong>Nota:</strong> La configuración de POS se aplica de forma independiente para cada sucursal. Los cambios se aplicarán de inmediato al guardar.
        </p>
      </div>

      {/* Resumen de características por plan */}
      {!isEnterprise && (
        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl p-6">
          <h4 className="text-white font-bold text-lg mb-4">¿Necesitas más funcionalidades?</h4>
          <div className="space-y-3">
            {!isProfessional && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">+</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Plan Profesional</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Desbloquea: 5 POS simultáneos, Caja automática, Cliente requerido, Múltiples métodos de pago, Integración de inventario
                  </p>
                </div>
              </div>
            )}
            {!isEnterprise && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-400 text-xs font-bold">★</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Plan Empresarial</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Incluye todo lo anterior más: POS ilimitados, Programa de lealtad, Informes avanzados, Soporte prioritario
                  </p>
                </div>
              </div>
            )}
          </div>
          <button className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
            Actualizar Plan
          </button>
        </div>
      )}

      {/* Modal Agregar Sucursal - Diseño Compacto v2 */}
      {showAddBranchModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl bg-secondary border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h3 className="text-white font-bold text-lg">Seleccionar Sucursales</h3>
                </div>
                <p className="text-gray-400 text-xs">Selecciona las sucursales para configurar su Punto de Venta</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Información de límites */}
            {branchesWithoutPOS.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 mb-5">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium text-xs">
                      {branchesWithoutPOS.length} {branchesWithoutPOS.length === 1 ? 'sucursal disponible' : 'sucursales disponibles'} para configurar POS
                    </p>
                    <p className="text-blue-400/80 text-[11px] mt-0.5">
                      Tienes {activePOSCount} de {posLimit === 999 ? '∞' : posLimit} licencias de POS en uso
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Lista de sucursales */}
            {branchesWithoutPOS.length === 0 ? (
              <div className="bg-white/5 rounded-xl p-10 text-center">
                <div className="w-14 h-14 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-7 h-7 text-gray-400" />
                </div>
                <h4 className="text-white font-bold text-base mb-1.5">No hay sucursales disponibles</h4>
                <p className="text-gray-400 text-xs mb-4">
                  Todas las sucursales parametrizadas ya tienen configuración de POS
                </p>
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium text-xs"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2.5 mb-5 max-h-[380px] overflow-y-auto pr-1">
                  {branchesWithoutPOS.map((branch) => {
                    const isSelected = selectedBranchesIds.includes(branch.id);
                    return (
                      <div
                        key={branch.id}
                        onClick={() => toggleBranchSelection(branch.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary/50'
                            : 'bg-[#0f1825]/80 border-white/10 hover:bg-[#0f1825] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleBranchSelection(branch.id)}
                              className="sr-only peer"
                            />
                            <div className={`w-4 h-4 border-2 rounded transition-colors flex items-center justify-center ${
                              isSelected ? 'bg-primary border-primary' : 'border-white/30'
                            }`}>
                              {isSelected && (
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>

                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'bg-primary/20' : 'bg-white/10'
                          }`}>
                            <Building2 className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="text-white font-medium text-sm">{branch.branchName}</h4>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                isSelected ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'
                              }`}>
                                {branch.branchCode}
                              </span>
                            </div>
                            <p className="text-gray-400 text-[11px] mb-0.5 truncate">{branch.branchAddress}</p>
                            <p className="text-gray-500 text-[10px]">{branch.branchPhone}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedBranchesIds.length > 0 && (
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-3.5 mb-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium text-xs">
                          {selectedBranchesIds.length} {selectedBranchesIds.length === 1 ? 'sucursal seleccionada' : 'sucursales seleccionadas'}
                        </p>
                        <p className="text-gray-400 text-[11px] mt-0.5">
                          {posLimit === 999 ? 'Sin límite de POS' : `Quedarán ${Math.max(0, posLimit - activePOSCount - selectedBranchesIds.length)} licencias disponibles`}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedBranchesIds([])}
                        className="text-[11px] text-gray-400 hover:text-white transition-colors"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-colors font-medium text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddSelectedBranches}
                    disabled={selectedBranchesIds.length === 0}
                    className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Agregar {selectedBranchesIds.length > 0 && `(${selectedBranchesIds.length})`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}